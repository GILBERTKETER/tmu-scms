# views.py in schedules app
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import Schedule
from academics.models import Enrollment
from django.contrib.auth.models import User
from django.utils.dateparse import parse_date, parse_time
from academics.models import Instructor
import json
from Halls.models import Hall
@csrf_exempt
def get_scheduled_classes(request):
    if request.method == 'GET':
        try:
            schedules = Schedule.objects.all()

            # Serialize the schedule data
            schedule_data = []
            for schedule in schedules:
                try:
                    hall = Hall.objects.get(id=schedule.hall)  # Fetch hall details by ID
                    hall_name = hall.hall_name
                    hall_number = hall.hall_number
                except Hall.DoesNotExist:
                    hall_name = "Unknown"
                    hall_number = "N/A"

                schedule_data.append({
                    'course_name': schedule.enrollment.course_name,
                    'course_code': schedule.enrollment.course_code,
                    'program_name': schedule.enrollment.course.program.name,
                    'instructor_name': schedule.instructor.user.first_name,
                    'hall_name': hall_name,
                    'hall_number': hall_number,
                    'date': schedule.date,
                    'time_start': schedule.time_start.strftime("%H:%M:%S"),
                    'time_end': schedule.time_end.strftime("%H:%M:%S"),
                    'recurring_days': schedule.recurring_days
                })
           
            return JsonResponse({'success': True, 'classes': schedule_data}, status=200)

        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=400)

    return JsonResponse({'success': False, 'message': 'Invalid request method.'}, status=405)

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
            recurring_days = data.get("recurring_days")

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


