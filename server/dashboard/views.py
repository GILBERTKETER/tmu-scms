from django.http import JsonResponse
from django.utils import timezone
from django.views import View
from authentication.models import UserProfile
from academics.models import Enrollment
from courseschedules.models import Schedule, Attendance
from datetime import datetime
from academicEvents.models import AcademicCalendar
from Halls.models import Hall
def StudentDashboardView( request):
    
    if request.method !='GET':
        return JsonResponse({"success":False,"message": "Invalid request method."}, status=405)
        # Check if user is authenticated
    if not request.user.is_authenticated:
        return JsonResponse({"success":False,"message": "Authentication required"}, status=401)
        
        # Get the authenticated user's profile
    try:
        user_profile = UserProfile.objects.get(user=request.user)
    except UserProfile.DoesNotExist:
        return JsonResponse({"error": "User profile not found"}, status=404)
        
        # Student-specific data
    user_id = request.user.id
    current_year = user_profile.year_of_study
    current_semester = user_profile.semester
        
        # 1. Number of enrolled courses this semester and year
    enrolled_courses_count = Enrollment.objects.filter(
            user_id=user_id,
            semester=current_semester,
            year=current_year
        ).count()
        
         # 2. Attendance percentage calculation
        # Each enrolled course has 12 sessions
    total_classes = enrolled_courses_count * 12  # Total sessions for the semester
        
        # Count attendance records for 'present' status for the user in the current semester and year
    present_count = Attendance.objects.filter(
            user_id=user_id,
            semester=current_semester,
            year=current_year,
            status='present'
        ).count()
        
        # Calculate attendance percentage
    missed_count = total_classes - present_count
    attendance_percentage = round((present_count / total_classes) * 100, 5) if total_classes > 0 else 0
        
        # 3. Upcoming class (based on current day and time)
    current_time = timezone.localtime()
    current_day = current_time.strftime('%A').lower()  # Get current day of the week
    enrolled_courses = Enrollment.objects.filter(
        user_id=user_id,
        semester=current_semester,
        year=current_year
    )
    upcoming_class_info = None

    for enrollment in enrolled_courses:
        upcoming_class = (
            Schedule.objects.filter(
                enrollment_id=enrollment.id,
                recurring_days__contains=[current_day],
            )
            .order_by('time_start')
            .first()
        )
        if upcoming_class:
            upcoming_class_info = {
                    "course_name": enrollment.course_name,
                    "course_code": enrollment.course_code,
                    "start_time": upcoming_class.time_start.strftime('%H:%M'),
                    "location": upcoming_class.hall
                }
            break
        
        # 4. Semester and year
    semester_info = {
            "current_semester": current_semester,
            "current_year": current_year,
        }

        # Combine all student data into a single response
    student_data = {
            "title1":"Upcoming Class",
            "title2":"My attendance",
            "title3":"Enrolled courses this Sem",
            "title4":"Upcoming Event",
            "enrolled_courses_count": enrolled_courses_count,
            "attendance_percentage": attendance_percentage,
            "upcoming_class": upcoming_class_info,
            "semester_info": semester_info,
        }

    return JsonResponse({"success":True,"data": student_data})



def LecturerDashboardView(request):
    
    if request.method != 'GET':
        return JsonResponse({"success": False, "message": "Invalid request method."}, status=405)

    # Check if user is authenticated
    if not request.user.is_authenticated:
        return JsonResponse({"success": False, "message": "Authentication required"}, status=401)
        
    # Get the authenticated user's profile
    try:
        user_profile = UserProfile.objects.get(user=request.user)
    except UserProfile.DoesNotExist:
        return JsonResponse({"error": "User profile not found"}, status=404)
        
    # Lecturer-specific data
    user_id = request.user.id
    current_year = user_profile.year_of_study
    current_semester = user_profile.semester
    #lecturers scheduled classes
    current_time = timezone.localtime()
    upcoming_classes = Schedule.objects.filter(instructor_id = user_id, recurring_days__contains=[timezone.localtime().strftime('%A').lower()],time_end__gte=timezone.localtime()
).order_by("time_start").first()
    upcoming_class_info = {
            "course_name":upcoming_classes.enrollment.course_name,
            "course_code":upcoming_classes.enrollment.course_code,
            "start_time":upcoming_classes.time_start,
            "end_time":upcoming_classes.time_end,
            "hall": Hall.objects.get(id = upcoming_classes.hall).hall_name+ Hall.objects.get(id = upcoming_classes.hall).hall_number
            
        }
    
    # 1. Number of classes scheduled for the lecturer in the current semester and year
    scheduled_classes_count = Schedule.objects.filter(
        instructor_id=user_id,
    ).count()
    
    # 2. Attendance percentage for the lecturer (based on students' attendance in their courses)
    # Count the number of students' 'present' attendance records for the lecturer's courses
    total_classes = scheduled_classes_count * 12  # Each course has 12 sessions
    present_count = Attendance.objects.filter(
        schedule__in=Schedule.objects.filter(instructor_id=user_id),
        status='present',
        semester=current_semester,
        year=current_year
    ).count()

    # Calculate attendance percentage for the lecturer
    missed_count = total_classes - present_count
    attendance_percentage = round((present_count / total_classes) * 100, 5) if total_classes > 0 else 0

    # 3. Upcoming academic event (based on current day)
    current_time = timezone.localtime()
    upcoming_event = AcademicCalendar.objects.filter(
        date__gte=current_time.date(),
    ).order_by('start_time').first()
    
    upcoming_event_info = {
        "event_name": upcoming_event.title if upcoming_event else None,
        "event_date": upcoming_event.date.strftime('%Y-%m-%d %H:%M') if upcoming_event else None,
        "event_location": upcoming_event.address if upcoming_event else  upcoming_event.link,
    }

    # 4. Semester and year
    semester_info = {
        "current_semester": current_semester,
        "current_year": current_year,
    }

    # Combine all lecturer data into a single response
    lecturer_data = {
        "title1":"Upcoming Class",
        "title2":"My attendance",
        "title3":"No Of Classes this Sem",
        "title4":"Upcoming Event",
        "scheduled_classes_count": scheduled_classes_count,
        "attendance_percentage": attendance_percentage,
        "upcoming_event": upcoming_event_info,
        "semester_info": semester_info,
        "upcoming_class_info": upcoming_class_info,
    }

    return JsonResponse({"success": True, "data": lecturer_data})



def AdminDashboardView(request):
    if request.method != 'GET':
        return JsonResponse({"success": False, "message": "Invalid request method."}, status=405)

    # Check if user is authenticated and is an admin
    if not request.user.is_authenticated or request.user.userprofile.role != 'admin':
        return JsonResponse({"success": False, "message": "Authentication and admin rights required"}, status=401)

    # Get the count of students, lecturers, and admins based on roles
    student_count = UserProfile.objects.filter(role='student').count()
    lecturer_count = UserProfile.objects.filter(role='lecturer').count()
    admin_count = UserProfile.objects.filter(role='admin').count()

    # Get the upcoming event (using the same approach as for the lecturer)
    current_time = timezone.localtime()
    current_day = current_time.strftime('%A').lower()  # Get current day of the week

    # 3. Upcoming academic event (based on current day)
    current_time = timezone.localtime()
    upcoming_event = AcademicCalendar.objects.filter(
        date__gte=current_time.date(),
    ).order_by('start_time').first()
    
    

    # Prepare upcoming event info
    upcoming_event_info = None
    if upcoming_event:
        upcoming_event_info = {
        "event_name": upcoming_event.title if upcoming_event else None,
        "event_date": upcoming_event.date.strftime('%Y-%m-%d %H:%M') if upcoming_event else None,
        "event_location": upcoming_event.address if upcoming_event else  upcoming_event.link,
    }

    # Combine all admin data into a single response
    admin_data = {
        "title1":"Active Students",
        "title2":"Active Lecturers",
        "title3":"Active Admins",
        "title4":"Upcoming Event",
        "student_count": student_count,
        "lecturer_count": lecturer_count,
        "admin_count": admin_count,
        "upcoming_event": upcoming_event_info,
    }

    return JsonResponse({"success": True, "data": admin_data})