from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from .models import Program, Course
from django.db import IntegrityError
from .models import Enrollment
from authentication.views import get_user
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

        # Validate required fields
        if not all([course_code, course_name, program_id, semester]):
            return JsonResponse({"success": False, "error": "All fields are required."}, status=400)

        # Create the course
        course = Course(
            code=course_code,
            name=course_name,
            description=description,
            program_id=program_id,
            semester=semester
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
    try:
        courses = Course.objects.all().values('id', 'code', 'name', 'description', 'program__name', 'semester')
        course_list = list(courses)

        return JsonResponse({"success": True, "data": course_list}, status=200)
    
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def enroll_student(request):
    """
    Enrolls an authenticated student in a specified course for a particular academic year and semester.
    
    Expects `course_id`, `year`, and `semester` in POST data.
    """
    try:
        # Retrieve user from the request
        user = request.user
        if not user.is_authenticated:
            return JsonResponse({"success": False, "message": "User is not authenticated."}, status=401)
        data = json.loads(request.body)
        # Retrieve data from request
        course_id = data.get("courseId")
        # year = int(request.POST.get("year")) 
        # semester = request.POST.get("semester")

        # Fetch course instance
        course = Course.objects.get(code=course_id)
        year = course.year
        semester = course.semester
        course_code = course.code
        course_name = course.name
        # Create or get the enrollment instance
        enrollment, created = Enrollment.objects.get_or_create(
            user=user,
            course=course,
            year=year,
            semester=semester,
            course_code = course_code,
            course_name = course_name,
        )

        # Check if the enrollment was newly created or already existed
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
    
    
    
@require_http_methods(["GET"])
def get_enrolled_courses(request):
    """
    Fetches the list of enrolled courses for the authenticated user.
    :return: JsonResponse with the list of courses and their details.
    """
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({"success": False, "message": "User is not authenticated."}, status=401)

    try:
        enrollments = Enrollment.objects.filter(user=user).select_related('course').values(
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
    
    