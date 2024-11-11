from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from .models import Program, Course, Instructor, Activities
from django.db import IntegrityError
from .models import Enrollment
from authentication.views import get_user
from django.core import serializers
from datetime import datetime
from django.utils import timezone
from courseschedules.models import Attendance

from authentication.models import UserProfile
@csrf_exempt  
@require_http_methods(["GET"])
def get_programs(request):
    programs = Program.objects.all()
    program_list = [{"id": program.id, "name": program.name} for program in programs]
    return JsonResponse(program_list, safe=False, status=200)

@csrf_exempt 
@require_http_methods(["POST"])
def add_course(request):
    try:
        data = json.loads(request.body)  # Parse JSON body
        course_code = data.get("code")
        course_name = data.get("name")
        description = data.get("description", "")
        program_id = data.get("program")
        semester = data.get("semester")
        year = data.get('year')

        # Validate required fields
        if not all([course_code, course_name, program_id, semester]):
            return JsonResponse({"success": False, "message": "All fields are required."}, status=400)
        existing_code = Course.objects.filter(code=course_code, year=year, semester=semester).exists()

        if existing_code:
            return JsonResponse({"success": False, "message": "The course is already registered."}, status=400)

        # Create the course
        course = Course(
            code=course_code,
            name=course_name,
            description=description,
            program_id=program_id,
            semester=semester,
            year = year
        )
        course.save()

        return JsonResponse({"success": True, "message": "Course added successfully!"}, status=201)
    
    except json.JSONDecodeError:
        return JsonResponse({"success": False, "error": "Invalid JSON."}, status=400)
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)
    
    
@csrf_exempt
@require_http_methods(["POST"])
def add_program(request):
    try:
        data = json.loads(request.body)
        name = data.get("name")
        description = data.get("description", "")
       

        if not all([name]):
            return JsonResponse({"success": False, "error": "All fields are required."}, status=400)

        # Create the program
        program = Program(
            name=name,
            description=description,
            
        )
        program.save()

        return JsonResponse({"success": True, "message": "Program added successfully!"}, status=201)

    except json.JSONDecodeError:
        return JsonResponse({"success": False, "error": "Invalid JSON."}, status=400)
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def fetch_courses(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({"success": False, "message": "You are not authenticated."}, status=401)
    
    try:
        user_id = user.id
        _student = UserProfile.objects.get(id=user_id)
        
        program_id_of_student = _student.program_id
        year_of_student = _student.year_of_study
        semester_of_student = _student.semester

        eligible_courses = Course.objects.filter(
            program_id=program_id_of_student,
            year=year_of_student,
            semester=semester_of_student
        ).values('id', 'code', 'name', 'description', 'program__name', 'semester')
        
        course_list = list(eligible_courses)

        return JsonResponse({"success": True, "data": course_list}, status=200)

    except UserProfile.DoesNotExist:
        return JsonResponse({"success": False, "message": "Student profile not found."}, status=404)
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def enroll_student(request):
   
    try:
        user = request.user
        if not user.is_authenticated:
            return JsonResponse({"success": False, "message": "User is not authenticated."}, status=401)
        data = json.loads(request.body)
        course_id = data.get("courseId")
        # year = int(request.POST.get("year")) 
        # semester = request.POST.get("semester")

        # Fetch course instance
        course = Course.objects.get(code=course_id)
        year = course.year
        semester = course.semester
        course_code = course.code
        course_name = course.name
        enrollment, created = Enrollment.objects.get_or_create(
            user=user,
            course=course,
            year=year,
            semester=semester,
            course_code = course_code,
            course_name = course_name,
        )

        if created:
            return JsonResponse({"success": True, "message": "Enrolled successfully."})
        else:
            return JsonResponse({"success": False, "message": "Already enrolled in this course for the given year and semester."})

    except Course.DoesNotExist:
        return JsonResponse({"success": False, "message": "Course not found."})
    except IntegrityError:
        return JsonResponse({"success": False, "message": "An error occurred while enrolling."})
    except Exception as e:
        return JsonResponse({"success": False, "message": str(e)})
    
    
@csrf_exempt    
@require_http_methods(["GET"])
def get_enrolled_courses(request):
   
    user = request.user
    user_profile = UserProfile.objects.get(user_id = user.id)
    user_year = user_profile.year_of_study
    user_sem = user_profile.semester
    user_prog = user_profile.program_id
    if not user.is_authenticated:
        return JsonResponse({"success": False, "message": "User is not authenticated."}, status=401)

    try:
        enrollments = Enrollment.objects.filter(user=user, semester = user_sem, year = user_year).select_related('course').values(
            'course__name', 'course__code', 'year', 'semester'
        )
        
        enrolled_courses = list(enrollments)

        return JsonResponse({"success": True, "enrolled_courses": enrolled_courses})
    except Exception as e:
        return JsonResponse({"success": False, "message": str(e)})
    
@csrf_exempt
def discard_course(request):
    try:
        user = request.user
        if not user.is_authenticated:
            return JsonResponse({"success": False, "message": "User is not authenticated."}, status=401)
        data = json.loads(request.body)
        course_code = data.get("courseCode")
       
        enrollment = Enrollment.objects.get(course_code=course_code, user_id = user.id)
        discarded = enrollment.delete()
        

        if discarded:
            return JsonResponse({"success": True, "message": "Discarded the course successfully."})
        else:
            return JsonResponse({"success": False, "message": "Sorry, There was a problem discarding your course."})

    except Course.DoesNotExist:
        return JsonResponse({"success": False, "message": "Course not found under enrollments."})
    except IntegrityError:
        return JsonResponse({"success": False, "message": "An error occurred while enrolling."})
    except Exception as e:
        return JsonResponse({"success": False, "message": str(e)})
 
@csrf_exempt   
def get_unscheduled_courses(request):
    user = request.user
    if user.is_authenticated:
        user_id = user.id
        _student = UserProfile.objects.get(id=user_id)
        
        year_of_student = _student.year_of_study
        semester_of_student = _student.semester
        
        unscheduled_courses = Enrollment.objects.filter(year= year_of_student, semester= semester_of_student, user_id = user_id, scheduled=1).values()
        return JsonResponse({"success": True, "message": "Enrolled courses fetched.", "data": list(unscheduled_courses)}, status=200)
    else:
        return JsonResponse({"success": False, "message": "You are not authenticated."}, status=401)
    
@csrf_exempt
def get_instructors(request):
    user = request.user
    if user.is_authenticated:
        instructors = Instructor.objects.select_related('user').all()
        instructors_data = [
            {
                "id": instructor.id,
                "name": f"{instructor.user.first_name} {instructor.user.last_name}",
                "bio": instructor.bio,
                "expertise": instructor.expertise,
                "courses": list(instructor.courses.values("id", "name"))
            }
            for instructor in instructors
        ]
        return JsonResponse({
            "success": True,
            "message": "Fetched successfully",
            "data": instructors_data
        }, status=201)
    else:
        return JsonResponse({
            "success": False,
            "message": "You are not authenticated"
        }, status=401)
@csrf_exempt    
def add_activity(request):
    user = request.user
    if user.is_authenticated:
        if request.method == 'POST':
            data = json.loads(request.body)
            
            activity_name = data.get('activity_name')
            activity_description = data.get('activity_description')
            activity_date = data.get('activity_date')
            start_time = data.get('activity_start_time')
            end_time = data.get('activity_end_time')
            activity_location = data.get('activity_location')
            course_id = data.get('course_id')
            
            if not all([activity_name, activity_description, activity_date, start_time, end_time, activity_location, course_id]):
                return JsonResponse({"success": False, "message": "All fields are required. Please fill in all fields."}, status=400)
            
            activity = Activities(
                user=user,
                activity_name=activity_name,
                activity_description=activity_description,
                activity_date=activity_date,
                activity_start_time=start_time,
                activity_end_time=end_time,
                activity_location=activity_location,
                course_id = course_id,
            )
            activity.save()
            
            return JsonResponse({"success": True, "message": "Your activity has been successfully added."}, status=200)
        
        return JsonResponse({"success": False, "message": "Invalid request method!"}, status=403)
    
    return JsonResponse({"success": False, "message": "You are not authenticated"}, status=401)

@csrf_exempt
def get_activities(request):
    user = request.user
    if user.is_authenticated:
        if request.method == 'GET':
            try:
                # Retrieve the user's profile details
                user_profile = UserProfile.objects.get(user_id=user.id)
                user_year = user_profile.year_of_study
                user_semester = user_profile.semester

                if user_year and user_year:
                        
                    # Get the courses the user is enrolled in for the current year and semester
                    enrolled_courses = Enrollment.objects.filter(
                        user_id=user.id,
                        semester=user_semester,
                        year=user_year
                    ).values_list('course_id', flat=True)  # Retrieve only course IDs

                    # Filter activities based on enrolled courses and upcoming dates
                    current_date = timezone.now().date()
                    activities = Activities.objects.filter(
                        course_id__in=enrolled_courses,  # Only activities related to enrolled courses
                        activity_date__gte=current_date  # Only activities that are not in the past
                    ).values()

                    return JsonResponse({
                        "success": True,
                        "message": "Success",
                        "data": list(activities)
                    }, status=200)
                else:
                    activities=""
                    return JsonResponse({
                        "success": True,
                        "message": "Success",
                        "data": list(activities)
                    }, status=200)
            except UserProfile.DoesNotExist:
                return JsonResponse({"success": False, "message": "User profile not found."}, status=404)
        else:
            return JsonResponse({"success": False, "message": "Invalid request method."}, status=403)
    else:
        return JsonResponse({"success": False, "message": "You are not authenticated."}, status=401)
    
    
@csrf_exempt
def delete_activity(request):
    user = request.user
    if user.is_authenticated:
        if request.method == 'DELETE':
            try:
                data = json.loads(request.body)
                id = data.get('id')
                
                activity = Activities.objects.get(id=id)
                activity.delete()
                
                return JsonResponse({
                    "success": True,
                    "message": "You have successfully deleted the activity."
                }, status=200)

            except Activities.DoesNotExist:
                return JsonResponse({
                    "success": False,
                    "message": "Activity not found."
                }, status=404)

            except json.JSONDecodeError:
                return JsonResponse({
                    "success": False,
                    "message": "Invalid JSON data."
                }, status=400)

        else:
            return JsonResponse({
                "success": False,
                "message": "Invalid request method."
            }, status=403)

    else:
        return JsonResponse({
            "success": False,
            "message": "You are not authenticated."
        }, status=401)
        
def get_program_details(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({"success": False, "message": "You are not authenticated."}, status=401)

    if request.method != 'GET':
        return JsonResponse({"success": False, "message": "Invalid request method."}, status=403)

    years = [1, 2, 3, 4, 5]
    program_details = {}

    for year in years:
        courses = Course.objects.filter(year=year)
        number_of_courses = courses.count()
        semesters = courses.values_list('semester', flat=True).distinct()
        enrolled_count = Enrollment.objects.filter(course__in=courses).count()

        program_details[f'year_{year}'] = {
            'number_of_courses': number_of_courses,
            'semesters': [2],
            'enrolled_count': enrolled_count,
        }

    return JsonResponse({"success": True, "data": program_details})   

@csrf_exempt
def update_activity(request):
    user = request.user
    if user.is_authenticated:
        if request.method == 'PUT':
            data = json.loads(request.body)
            id = data.get('id')
            activity_name = data.get('activity_name')
            activity_date = data.get('activity_date')
            activity_location = data.get('activity_location')
            time_range = data.get('time_range')  # Assuming this is a list [start_time, end_time]

            # Check for required fields
            if not all([id, time_range, activity_date, activity_name, activity_location]):
                return JsonResponse({"success": False, "message": "All fields are required."}, status=403)
            
            try:
                # Parse the date and time range fields
                activity_date = datetime.strptime(activity_date, '%Y-%m-%d').date()
                start_time = datetime.strptime(time_range[0], '%H:%M:%S').time()
                end_time = datetime.strptime(time_range[1], '%H:%M:%S').time()
                
                # Retrieve the activity
                activity = Activities.objects.get(id=id)
                
                # Update the fields
                activity.activity_name = activity_name
                activity.activity_date = activity_date
                activity.activity_location = activity_location
                activity.activity_start_time = start_time
                activity.activity_end_time = end_time
                activity.save()

                return JsonResponse({"success": True, "message": "Activity updated successfully."}, status=200)

            except Activities.DoesNotExist:
                return JsonResponse({"success": False, "message": "Activity not found."}, status=404)
            except ValueError:
                return JsonResponse({"success": False, "message": "Invalid date or time format."}, status=400)
            except Exception as e:
                return JsonResponse({"success": False, "message": f"Error: {str(e)}"}, status=500)
        else:
            return JsonResponse({"success": False, "message": "Invalid request method."}, status=400)
    else:
        return JsonResponse({"success": False, "message": "You are not logged in."}, status=401)



@csrf_exempt
@require_http_methods(["POST"])
def get_enrollments_by_course(request):
    try:
        user = request.user
        userDetails = UserProfile.objects.get(id=user.id)
        year = userDetails.year_of_study
        semester = userDetails.semester
        
        data = json.loads(request.body).get('params')
        course_id = data.get("course_id")
        schedule_id = data.get('scheduleId')
        if not course_id:
            return JsonResponse({"success": False, "message": "Course ID is required"}, status=400)

        today = timezone.now().date()
        print("today:", today)

        present_student_ids = Attendance.objects.filter(
        schedule_id=schedule_id,
        marked_date=today, 
        status='present'
        ).values_list('user_id', flat=True)

        
        print("present:", present_student_ids)

        enrollments = Enrollment.objects.filter(year=year,semester=semester,course_id=course_id).select_related('user', 'course').exclude(user_id__in=present_student_ids)

        enrollment_data = [
            {
                "user_id": enrollment.user.id,
                "first_name": enrollment.user.first_name,
                "course_id": enrollment.course.id,
                "course_name": enrollment.course_name,
            }
            for enrollment in enrollments
        ]
        
        return JsonResponse({"success": True, "enrollments": enrollment_data}, status=200)

    except json.JSONDecodeError:
        return JsonResponse({"success": False, "message": "Invalid JSON data"}, status=400)

    except Exception as e:
        return JsonResponse({"success": False, "message": str(e)}, status=500)