# views.py in schedules app
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import Schedule
from academics.models import Enrollment
from .models import Attendance
from django.contrib.auth.models import User
from django.utils.dateparse import parse_date, parse_time
from academics.models import Instructor
import json
from Halls.models import Hall
from datetime import datetime
import qrcode
from django.utils import timezone
import random
import string
from datetime import timedelta
from django.utils import timezone
from django.views.decorators.http import require_http_methods
from authentication.models import UserProfile
@csrf_exempt
def get_scheduled_classes(request):
    user = request.user
    if request.method == 'GET':
        try:
            userprofile = UserProfile.objects.get(user_id = user.id)
            user_year = userprofile.year_of_study
            user_sem = userprofile.semester
            
            enrollments = Enrollment.objects.filter(
                user=user,
                semester=user_sem,
                year=user_year,
                scheduled='0'
            ).values_list('id', flat=True)

            schedules = Schedule.objects.filter(
                enrollment_id__in=enrollments
            ).select_related(
                'enrollment',
                'enrollment__course',
                'enrollment__course__program',
                'instructor',
                'instructor__user'
            )

            schedule_data = []
            for schedule in schedules:
                try:
                    # Get hall information
                    hall = Hall.objects.get(id=schedule.hall)
                    hall_name = hall.hall_name
                    hall_number = hall.hall_number
                    hall_id = hall.id
                except Hall.DoesNotExist:
                    hall_name = "Unknown"
                    hall_number = "N/A"
                    hall_id = None
                
                # Format the schedule data
                schedule_info = {
                    'id': schedule.id,
                    'course_id': schedule.enrollment.course_id,
                    'course_name': schedule.enrollment.course_name,
                    'course_code': schedule.enrollment.course_code,
                    'program_name': schedule.enrollment.course.program.name,
                    'instructor_name': schedule.instructor.user.first_name,
                    'hall_name': hall_name,
                    'hallId': hall_id,
                    'hall_number': hall_number,
                    'date': schedule.date,
                    'time_start': schedule.time_start.strftime("%H:%M:%S") if schedule.time_start else None,
                    'time_end': schedule.time_end.strftime("%H:%M:%S") if schedule.time_end else None,
                    'recurring_days': schedule.recurring_days
                }
                schedule_data.append(schedule_info)
            
            return JsonResponse({
                'success': True,
                'classes': schedule_data,
                'total_classes': len(schedule_data)
            }, status=200)

        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            return JsonResponse({
                'success': False,
                'message': str(e),
                'error_details': error_details
            }, status=400)

    return JsonResponse({
        'success': False,
        'message': 'Invalid request method.'
    }, status=405)

@csrf_exempt
def create_schedule(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        try:
            course_id = data.get("course_id")
            instructor_id = data.get("instructor_id")
            hall = data.get("hall")
            date = data.get("date")
            time_start = data.get("time_start")
            time_end = data.get("time_end")
            recurring_days = [day.lower() for day in data.get("recurring_days", [])]


            # Retrieve enrollment and instructor
            enrollment = Enrollment.objects.get(course_id=course_id)
            instructor = Instructor.objects.get(id=instructor_id)

            print(f"Enrollment ID: {enrollment.id}, Scheduled Status: {enrollment.scheduled}")
            not_enrolled = enrollment.scheduled
            # Check if the class is not already scheduled (1 means not scheduled)
            if not_enrolled:
                schedule = Schedule.objects.create(
                    enrollment=enrollment,
                    instructor=instructor,
                    hall=hall,
                    date=parse_date(date) if date else None,
                    time_start=parse_time(time_start),
                    time_end=parse_time(time_end),
                    recurring_days=recurring_days if recurring_days else None
                )

                # Update the enrollment status to scheduled (0)
                enrollment.scheduled = 0
                enrollment.save()
                enrollment.refresh_from_db()  # Refresh the instance with the latest values
                print(f"Updated Scheduled Status: {enrollment.scheduled}")

                return JsonResponse({"success": True, "message": "Schedule created successfully."}, status=201)
            else:
                print("The class is already scheduled.")
                return JsonResponse({"success": False, "message": "The class is already scheduled."}, status=403)

        except Enrollment.DoesNotExist:
            return JsonResponse({"success": False, "message": "Enrollment not found."}, status=404)
        except Instructor.DoesNotExist:
            return JsonResponse({"success": False, "message": "Instructor not found."}, status=404)
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=400)

    return JsonResponse({"success": False, "message": "Invalid request method."}, status=405)


@csrf_exempt
def update_class_details(request):
    user = request.user
    if user.is_authenticated:
        if request.method == 'POST':
            data = json.loads(request.body)
            hall_id = data.get('hall_id')
            instructor_id = data.get('instructor_id')
            end_time = data.get('end_time')
            start_time = data.get('start_time')
            recurring_days = data.get('recurring_days')
            schedule_id = data.get('id')
            
            schedule = Schedule.objects.get(id=schedule_id)
            if schedule:
                schedule.hall = hall_id
                schedule.instructor_id = instructor_id
                schedule.time_start = start_time
                schedule.time_end = end_time
                schedule.recurring_days = recurring_days
                schedule.save()
                return JsonResponse({"success":True, "message":"The schedule has been successfully updated."}, status = 200)
            else:
                return JsonResponse({"success":False, "message":"The class could not be found on our system."},status=404)
        else:
            return JsonResponse({"success":False, "message":"Invalid request method."},status=400)
    else:
        return JsonResponse({"success":False, "message":"You are not authenticated."},status=403)

@csrf_exempt
def check_in_students(request):
    if request.method == "POST":
        data = json.loads(request.body)

        # Extract data from payload
        student_ids = data.get("student_ids", [])
        class_id = data.get("class_id")
        course_name = data.get("course_name")
        course_code = data.get("course_code")
        hall_number = data.get("hallId")
        day = data.get("day")[0]  
        start_time = data.get("StartTime")
        end_time = data.get("EndTime")
        schedule_id = data.get("ScheduleId")

        if not student_ids or not class_id:
            return JsonResponse({"success": False, "message": "Class ID and student IDs are required"}, status=400)

        try:
            # Retrieve the schedule object if needed
            schedule = Schedule.objects.get(id=schedule_id)

            for student_id in student_ids:
                # Check if the user exists
                try:
                    user = User.objects.get(id=student_id)
                except User.DoesNotExist:
                    return JsonResponse({"success": False, "message": f"User with ID {student_id} does not exist"}, status=400)

                # Create attendance record
                Attendance.objects.create(
                    user=user,
                    schedule=schedule,
                    year = schedule.enrollment.year,
                    semester = schedule.enrollment.semester,
                    course_code=course_code,
                    course_name=course_name,
                    course_hall=hall_number,
                    day_of_class=day,
                    status='present', 
                    check_in_method='manual'
                )

            return JsonResponse({"success": True, "message": "Students checked in successfully"})
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)
    else:
        return JsonResponse({"success": False, "message": "Invalid request method"}, status=405)


@csrf_exempt
def get_attendance_logs(request):
    user = request.user
    if request.method == 'GET':
        userprofile = UserProfile.objects.get(user_id = user.id)
        user_year = userprofile.year_of_study
        user_sem = userprofile.semester
        enrollments = Enrollment.objects.filter(year=user_year, semester = user_sem, user_id = user.id).count()
        
        attendance_logs = Attendance.objects.filter(year = user_year, semester = user_sem,user_id = user.id).values('course_code','course_name','marked_date', 'status', 'check_in_method')
        logs = [{
                'course': log['course_name']+' '+ log['course_code'],
                'date': log['marked_date'].strftime('%Y-%m-%d'),
                'status': log['status'].capitalize(),
                'method': log['check_in_method'].capitalize(),
            }
            for log in attendance_logs
        ]
        return JsonResponse({"success": True, "message": "Fetched", "total_count_enrolled":enrollments,"logs": logs}, safe=False)
    return JsonResponse({'success':False,'message': 'Invalid request method'}, status=400)


@csrf_exempt
def verify_qrcode(request):
    if not request.user.is_authenticated:
        return JsonResponse({"success": False, "message": "You are not authenticated."}, status=401)
    
    if request.method != 'POST':
        return JsonResponse({"success": False, "message": "Invalid request method."}, status=405)
    
    try:
        data = json.loads(request.body)
        qr_data = data.get('qrData', {})
        user_id = data.get('id')
        
        # Extract QR data
        qrschedule_id = qr_data.get('schedule_id')
        qrcourse_code = qr_data.get('course_code')
        qrsemester = qr_data.get('semester')
        qryear = qr_data.get('year')
        session_key = qr_data.get('session')
        day = qr_data.get('day')


        checked_in = Attendance.objects.filter(user_id = user_id)
        
        if checked_in:
            return JsonResponse({"success": False, "message": "You are already checked in."}, status=200)
        # Fetch the scheduled class
        try:
            class_schedule = Schedule.objects.get(id=qrschedule_id)
        except Schedule.DoesNotExist:
            return JsonResponse({"success": False, "message": "Schedule not found."}, status=404)

        # Check enrollment
        try:
            enrollment = Enrollment.objects.get(
                user_id=user_id,
                course_code=qrcourse_code,
                year=qryear,
                semester=qrsemester
            )
        except Enrollment.DoesNotExist:
            return JsonResponse({"success": False, "message": "User is not enrolled in the specified course."}, status=400)

        # Verify session key validity
        if not class_schedule.is_session_valid():
            return JsonResponse({"success": False, "message": "QR code has expired."}, status=400)

        current_datetime = timezone.localtime(timezone.now())
        current_time = current_datetime.time()  
        current_date = current_datetime.date()
        
        # Check if the current time is within the schedule's time range
        if current_time < class_schedule.time_start or current_time > class_schedule.time_end:
            return JsonResponse({
                "success": False, 
                "message": f"Attendance can only be marked during scheduled class time. Current time: {current_time.strftime('%H:%M')}, Class time: {class_schedule.time_start.strftime('%H:%M')} - {class_schedule.time_end.strftime('%H:%M')}"
            }, status=400)
    
        # Date validation logic
        if class_schedule.date:
            # If schedule has a specific date
            if current_date != class_schedule.date:
                return JsonResponse({
                    "success": False, 
                    "message": "Today is not the scheduled class date."
                }, status=400)
        elif class_schedule.recurring_days:
            # If schedule has recurring days
            current_day = current_datetime.strftime('%A').lower()  
            if current_day not in class_schedule.recurring_days:
                return JsonResponse({
                    "success": False, 
                    "message": "Today is not a scheduled class day."
                }, status=400)
        else:
            return JsonResponse({
                "success": False, 
                "message": "Invalid schedule configuration: neither date nor recurring days specified."
            }, status=400)

        attended = Attendance.objects.create(
            user_id=user_id,
            schedule=class_schedule,
            course_code=qrcourse_code,
            course_name=class_schedule.enrollment.course_name,
            course_hall=class_schedule.hall,
            day_of_class=day,
            year=class_schedule.enrollment.year,
            semester = class_schedule.enrollment.semester,
            
            status='present',
            check_in_method='qrCode'
            )
        attended.save()
        # If all checks pass, return success
        return JsonResponse({
            "success": True,
            "message": "Attendance marked successfully.",
            "data": {
                "schedule_id": qrschedule_id,
                "course_code": qrcourse_code,
                "course_name": class_schedule.enrollment.course_name,
                "instructor_id": class_schedule.instructor.id,
                "room": class_schedule.hall,
                "semester": qrsemester,
                "year": qryear,
            }
        })

    except json.JSONDecodeError:
        return JsonResponse({"success": False, "message": "Invalid JSON format."}, status=400)
    except Exception as e:
        return JsonResponse({"success": False, "message": str(e)}, status=400)

def generate_unique_session_key():
    """Generate a random 16-character alphanumeric key for session."""
    return ''.join(random.choices(string.ascii_letters + string.digits, k=16))


@csrf_exempt
def generate_qrcode(request):
    if not request.user.is_authenticated:
        return JsonResponse({"success": False, "message": "You are not authenticated."}, status=401)
    
    if request.method != 'POST':
        return JsonResponse({"success": False, "message": "Invalid request method."}, status=405)
    
    try:
        data = json.loads(request.body)
        qrschedule_id = data.get('id')

        # Retrieve the class schedule and related data
        class_schedule = Schedule.objects.get(id=qrschedule_id)
        
        # Check if a valid session already exists
        if class_schedule.qr_session_key and class_schedule.is_session_valid():
            # Store session details in the request session
            request.session['qr_code_data'] = {
                "session": class_schedule.qr_session_key,
                "schedule_id": qrschedule_id,
                "course_code": class_schedule.enrollment.course_code,
                "course_name": class_schedule.enrollment.course_name,
                "semester": class_schedule.enrollment.semester,
                "year": class_schedule.enrollment.year,
                "startTime": class_schedule.time_start.isoformat(),
                "endTime": class_schedule.time_end.isoformat(),
                "day": class_schedule.recurring_days,
                "hallId": class_schedule.hall,
                "instructorId": class_schedule.instructor.id,
                "courseId": class_schedule.enrollment.id,
                "generated_at": class_schedule.qr_generated_at.isoformat(),
                "expires_at": class_schedule.qr_expires_at.isoformat()
            }
            # Return existing QR code session data
            return JsonResponse({
                "success": True,
                "message": "QR code data retrieved successfully.",
                "data": request.session['qr_code_data']
            })

        # Generate a new session key and expiration time
        qr_session_key = f"qr_{generate_unique_session_key()}"
        expiration_time = timezone.now() + timedelta(days=5)

        # Update the schedule with the new QR session details
        class_schedule.qr_session_key = qr_session_key
        class_schedule.qr_generated_at = timezone.now()
        class_schedule.qr_expires_at = expiration_time
        class_schedule.save()

        # Store new QR code session details in the request session
        request.session['qr_code_data'] = {
            "session": class_schedule.qr_session_key,
            "schedule_id": qrschedule_id,
            "course_code": class_schedule.enrollment.course_code,
            "course_name": class_schedule.enrollment.course_name,
            "semester": class_schedule.enrollment.semester,
            "year": class_schedule.enrollment.year,
            "startTime": class_schedule.time_start.isoformat(),
            "endTime": class_schedule.time_end.isoformat(),
            "day": class_schedule.recurring_days,
            "hallId": class_schedule.hall,
            "instructorId": class_schedule.instructor.id,
            "courseId": class_schedule.enrollment.id,
            "generated_at": class_schedule.qr_generated_at.isoformat(),
            "expires_at": class_schedule.qr_expires_at.isoformat()
        }

        # Return the new QR code data
        return JsonResponse({
            "success": True,
            "message": "QR code data generated successfully.",
            "data": request.session['qr_code_data']
        })
    
    except Schedule.DoesNotExist:
        return JsonResponse({"success": False, "message": "Schedule not found."}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({"success": False, "message": "Invalid JSON format."}, status=400)
    except Exception as e:
        return JsonResponse({"success": False, "message": str(e)}, status=400)
    
    
@csrf_exempt
def update_rfid(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({"success": False, "message": "You are not authenticated."}, status=401)

    if request.method != 'PUT':
        return JsonResponse({"success": False, "message": "Invalid request method."}, status=405)

    try:
        data = json.loads(request.body)
        course_id = data.get("id")
        rfid = data.get("rfid")

        if not all([course_id, rfid]):
            return JsonResponse({"success": False, "message": "All fields are required"}, status=400)

        enrollment = Enrollment.objects.get(course_id=course_id)
        enrollment.rfid = rfid
        enrollment.save()

        return JsonResponse({"success": True, "message": "You have successfully added the RFID."})

    except Enrollment.DoesNotExist:
        return JsonResponse({"success": False, "message": "Enrollment not found for the given course ID."}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({"success": False, "message": "Invalid JSON data."}, status=400)
    except Exception as e:
        return JsonResponse({"success": False, "message": f"An error occurred: {str(e)}"}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def check_in_students_rfid(request):
    if request.method == "POST":
        data = json.loads(request.body)
        rfid = data.get("rfid")
        schedule_id = data.get("schedule_id")
        user_id = data.get("user_id")
        course_code = data.get("course_code")
        hall_id = data.get("hall_id")
        course_name = data.get("course_name")
        recurring_days = data.get("recurring_days")
        user = request.user
        # Check if required data is provided
        if not rfid or not schedule_id or not user_id:
            return JsonResponse({"success": False, "message": "RFID, Schedule ID, and User ID are required"}, status=400)
        try:
            class_schedule = Schedule.objects.get(id=schedule_id)
        except Schedule.DoesNotExist:
            return JsonResponse({"success": False, "message": "Schedule not found."}, status=404)
        try:
            enrollment = Enrollment.objects.get(
                user_id=user_id,
                course_code=course_code,
                year=user.userprofile.year_of_study,
                semester=user.userprofile.semester
            )
        except Enrollment.DoesNotExist:
            return JsonResponse({"success": False, "message": "User is not enrolled in the specified course."}, status=400)
        try:
            current_datetime = timezone.localtime(timezone.now())
            current_time = current_datetime.time()  
            current_date = current_datetime.date()
            
            # Check if the user has already checked in for this schedule
            if Attendance.objects.filter(schedule_id=schedule_id, user_id=user_id).exists():
                return JsonResponse({"success": False, "message": "You are already checked in."}, status=400)

            # Verify RFID matches the one on record for the user
            enrolled_user = Enrollment.objects.get(user_id=user_id)
            if enrolled_user.rfid != rfid:
                return JsonResponse({"success": False, "message": "Invalid RFID"}, status=400)

            # Check if the current time is within the schedule's time range
            if current_time < class_schedule.time_start or current_time > class_schedule.time_end:
                return JsonResponse({
                    "success": False, 
                    "message": f"Attendance can only be marked during scheduled class time. Current time: {current_time.strftime('%H:%M')}, Class time: {class_schedule.time_start.strftime('%H:%M')} - {class_schedule.time_end.strftime('%H:%M')}"
                }, status=400)
        
            # Date validation logic
            if class_schedule.date:
                # If schedule has a specific date
                if current_date != class_schedule.date:
                    return JsonResponse({
                        "success": False, 
                        "message": "Today is not the scheduled class date."
                    }, status=400)
            elif class_schedule.recurring_days:
                # If schedule has recurring days
                current_day = current_datetime.strftime('%A').lower() 
                print("current day:", current_day) 
                if current_day not in class_schedule.recurring_days:
                    return JsonResponse({
                        "success": False, 
                        "message": "Today is not a scheduled class day."
                    }, status=400)
            else:
                return JsonResponse({
                    "success": False, 
                    "message": "Invalid schedule configuration: neither date nor recurring days specified."
                }, status=400)

            # Create a new attendance record
            attendance = Attendance.objects.create(
                user_id=user_id,
                schedule_id=schedule_id,
                course_name=course_name,
                day_of_class=current_day,
                status="present",
                year = class_schedule.enrollment.year,
                semester = class_schedule.enrollment.semester,
                course_code=course_code,
                course_hall=hall_id,
                check_in_method = "Rfid"
            )

            return JsonResponse({"success": True, "message": "Check-in successful"}, status=200)

        except Enrollment.DoesNotExist:
            return JsonResponse({"success": False, "message": "Enrollment record not found for this user"}, status=404)

        except Exception as e:
            return JsonResponse({"success": False, "message": f"An error occurred: {str(e)}"}, status=500)
    
    return JsonResponse({"success": False, "message": "Invalid request method"}, status=405)