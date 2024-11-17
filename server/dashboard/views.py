from django.http import JsonResponse
from django.utils import timezone
from django.views import View
from authentication.models import UserProfile
from academics.models import Enrollment
from courseschedules.models import Schedule, Attendance
from datetime import datetime
from .models import Announcement
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_POST, require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from academicEvents.models import AcademicCalendar
from django.db.models import Count
from safetymonitoring.models import Incident
from Halls.models import Hall
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import Table, TableStyle, Image
from reportlab.lib.colors import Color
from django.db.models import Q
from notifications.utils import send_message
import os
from academics.models import Course
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
        
    if current_year and current_semester:
        
        # 1. Number of enrolled courses this semester and year
        enrolled_courses_count = Enrollment.objects.filter(
                user_id=user_id,
                semester=current_semester,
                year=current_year
            ).count()
    else:
        enrolled_courses_count = 0
        
         # 2. Attendance percentage calculation
        # Each enrolled course has 12 sessions
    total_classes = enrolled_courses_count * 12  # Total sessions for the semester
        
    if current_year and current_semester:

        # Count attendance records for 'present' status for the user in the current semester and year
            present_count = Attendance.objects.filter(
                    user_id=user_id,
                    semester=current_semester,
                    year=current_year,
                    status='present'
                ).count()
    else:
        present_count = 0
        
        # Calculate attendance percentage
    missed_count = total_classes - present_count
    attendance_percentage = round((present_count / total_classes) * 100, 5) if total_classes > 0 else 0
        
        # 3. Upcoming class (based on current day and time)
    current_time = timezone.localtime()
    current_day = current_time.strftime('%A').lower()  # Get current day of the week
    if current_year and current_semester:

        enrolled_courses = Enrollment.objects.filter(
            user_id=user_id,
            semester=current_semester,
            year=current_year
        )
        upcoming_class_info = None
    else:
        enrolled_courses = ''
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
                    "location": Hall.objects.get(id = upcoming_class.hall).hall_name+' '+ Hall.objects.get(id = upcoming_class.hall).hall_number
                }
            break
        
    current_time = timezone.localtime()
    upcoming_event = AcademicCalendar.objects.filter(
        date__gte=current_time.date(),
    ).order_by('start_time').first()
    
    upcoming_event_info = {
        "event_name": upcoming_event.title if upcoming_event else None,
        "event_date": upcoming_event.date.strftime('%Y-%m-%d %H:%M') if upcoming_event else None,
        "event_location": upcoming_event.address if upcoming_event and upcoming_event.address else (upcoming_event.link if upcoming_event else ''),
    }

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
            'upcoming_event': upcoming_event_info
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
        return JsonResponse({"success": False, "message": "User profile not found"}, status=404)
        
    # Lecturer-specific data
    user_id = request.user.id
    current_year = user_profile.year_of_study
    current_semester = user_profile.semester
    current_time = timezone.localtime()

    # Upcoming class information
    upcoming_classes = Schedule.objects.filter(
        instructor_id=user_id,
        recurring_days__contains=[current_time.strftime('%A').lower()],
        time_end__gte=current_time
    ).order_by("time_start").first()
    
    if upcoming_classes:
        try:
            hall_instance = Hall.objects.get(id=upcoming_classes.hall)
            upcoming_class_info = {
                "course_name": upcoming_classes.enrollment.course_name,
                "course_code": upcoming_classes.enrollment.course_code,
                "start_time": upcoming_classes.time_start,
                "end_time": upcoming_classes.time_end,
                "hall": f"{hall_instance.hall_name} {hall_instance.hall_number}"
            }
        except Hall.DoesNotExist:
            upcoming_class_info = {
                "course_name": upcoming_classes.enrollment.course_name,
                "course_code": upcoming_classes.enrollment.course_code,
                "start_time": upcoming_classes.time_start,
                "end_time": upcoming_classes.time_end,
                "hall": "Unknown Hall"
            }
    else:
        upcoming_class_info = {
            "course_name": "No upcoming class",
            "course_code": "N/A",
            "start_time": None,
            "end_time": None,
            "hall": "N/A"
        }

    # Number of classes scheduled for the lecturer in the current semester and year
    scheduled_classes_count = Schedule.objects.filter(
        instructor_id=user_id,
    ).count()
    
    # Attendance percentage for the lecturer
    total_classes = scheduled_classes_count * 12  # Assuming each course has 12 sessions
    present_count = Attendance.objects.filter(
        schedule__in=Schedule.objects.filter(instructor_id=user_id),
        status='present',
        semester=current_semester,
        year=current_year
    ).count()

    # Calculate attendance percentage
    attendance_percentage = round((present_count / total_classes) * 100, 5) if total_classes > 0 else 0

    # Upcoming academic event
    upcoming_event = AcademicCalendar.objects.filter(
        date__gte=current_time.date(),
    ).order_by('start_time').first()
    
    upcoming_event_info = {
        "event_name": upcoming_event.title if upcoming_event else None,
        "event_date": upcoming_event.date.strftime('%Y-%m-%d %H:%M') if upcoming_event else None,
        "event_location": upcoming_event.address if upcoming_event and upcoming_event.address else (upcoming_event.link if upcoming_event else None),
    }

    # Semester and year information
    semester_info = {
        "current_semester": current_semester,
        "current_year": current_year,
    }

    # Combine all lecturer data into a single response
    lecturer_data = {
        "title1": "Upcoming Class",
        "title2": "My attendance",
        "title3": "No Of Classes this Sem",
        "title4": "Upcoming Event",
        "scheduled_classes_count": scheduled_classes_count,
        "attendance_percentage": attendance_percentage,
        "upcoming_event": upcoming_event_info,
        "semester_info": semester_info,
        "upcoming_class": upcoming_class_info,
    }

    return JsonResponse({"success": True, "data": lecturer_data})

def AdminDashboardView(request):
    if request.method != 'GET':
        return JsonResponse({"success": False, "message": "Invalid request method."}, status=405)

    # Check if user is authenticated and is an admin
    if not request.user.is_authenticated or request.user.userprofile.role != 'admin':
        return JsonResponse({"success": False, "message": "Authentication and admin rights required"}, status=401)

    # Get the count of students, lecturers, and admins based on roles
    student_count = UserProfile.objects.filter(
    Q(role='student') | Q(role='classrep')
).count()
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

def active_announcements(request):
    now = timezone.now()
    announcements = Announcement.objects.all().order_by('expiry_date')

    announcements_data = [
        {
            "title": announcement.title,
            "content": announcement.content,
            "datePosted": announcement.published_date,
            "expiry_date": announcement.expiry_date,
        }
        for announcement in announcements
    ]
    return JsonResponse({"data": announcements_data})


@csrf_exempt
@require_POST
def add_announcement(request):
    try:
        data = json.loads(request.body).get("newAnnouncement")

        title = data.get("title")
        content = data.get("content")
        published_date = data.get("published_date", timezone.now())
        expiry_date = data.get("expiry_date", None)

        # Validation for required fields
        if not title or not content:
            return JsonResponse({"success":False,"message": "Title and content are required."}, status=400)

        # Create new announcement
        announcement = Announcement.objects.create(
            title=title,
            content=content,
            published_date=published_date,
            expiry_date=expiry_date
        )
        
        users = UserProfile.objects.all()
        for user in users:
            phone = user.phone_number
            name = user.full_name
            #send the message via whatsapp api
            message = f"Hello {name}, here is a new announcement for you: Title: '{title}', Content: '{content}'. Thank you."
            send_message(to=phone, conversation=message)
        return JsonResponse({"success": True, "message": "Announcement added successfully.", "announcement_id": announcement.id}, status=201)
    
    except json.JSONDecodeError:
        return JsonResponse({"success":False,"message": "Invalid JSON format."}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
    
@csrf_exempt
@require_http_methods(["POST"])
def get_attendance_data(request):
    data = json.loads(request.body)
    course_code = data.get("course_code")
    
    if not course_code:
        return JsonResponse({"success": False, "message": "Course code is required"}, status=400)

    user = request.user
    user_type = user.userprofile.role  
    
    # Initialize the query filter
    attendance_filter = {'course_code': course_code, 'status': 'present'}

    # Adjust filtering logic based on user type
    if user_type == 'admin' or user_type == 'Admin':
        # Admin can fetch attendance for any course (based on course_code)
        pass  # No further filter needed for admin
    elif user_type == 'lecturer' or user_type == 'Lecturer':
        # Lecturer fetches attendance data based on their courses
        schedules = Schedule.objects.filter(instructor_id=user.id, enrollment__course__code=course_code)
        # Ensure the lecturer teaches the course
        if not schedules.exists():
            return JsonResponse({"success": False, "message": "You are not authorized to view attendance for this course"}, status=403)
    elif user_type == 'student' or user_type == 'Student' or user_type == 'classrep' or user_type == 'Classrep':
        # Student fetches attendance data based on their enrollment
        enrollments = Enrollment.objects.filter(user_id=user.id, course__code=course_code)
        # Ensure the student is enrolled in the course
        if not enrollments.exists():
            return JsonResponse({"success": False, "message": "You are not enrolled in this course"}, status=403)
    
    # Fetch attendance data
    attendance_records = (
        Attendance.objects
        .filter(**attendance_filter)  # Applying the dynamic filters based on user type
        .extra(select={'month': "EXTRACT(MONTH FROM marked_date)"}).values('month')
        .annotate(count=Count('id'))
        .order_by('month')
    )

    # Format the data for the chart (month as abbreviated name, count of attendance)
    attendance_data = [
        {
            "month": datetime.strptime(str(record["month"]), "%m").strftime("%b"),
            "count": record["count"]
        }
        for record in attendance_records
    ]

    return JsonResponse({"success": True, "data": attendance_data})


@csrf_exempt
def get_courses(request):
    user = request.user
    user_type = user.userprofile.role    
    
    if user_type == 'admin' or user_type == 'Admin':
        # Admin can fetch all courses
        courses = Course.objects.values('code', 'name')
        course_data = [{"course_code": course["code"], "name": course["name"]} for course in courses]
        return JsonResponse({"courses": course_data})
    
    elif user_type == 'lecturer' or user_type == 'Lecturer':
        # Lecturer fetches courses from the Schedule model where they are the instructor
        schedules = Schedule.objects.filter(instructor_id=user.id).values('enrollment__course__code', 'enrollment__course__name')
        course_data = [{"course_code": schedule["enrollment__course__code"], "name": schedule["enrollment__course__name"]} for schedule in schedules]
        return JsonResponse({"courses": course_data})
    
    elif user_type == 'student' or user_type == 'Student' or user_type == 'classrep' or user_type == 'Classrep':
        # Student fetches courses they are enrolled in (Enrollment model)
        enrollments = Enrollment.objects.filter(user_id=user.id).values('course__code', 'course__name')
        course_data = [{"course_code": enrollment["course__code"], "name": enrollment["course__name"]} for enrollment in enrollments]
        return JsonResponse({"courses": course_data})
    
    else:
        return JsonResponse({"error": "Invalid user type"}, status=400)
    

@csrf_exempt
@require_http_methods(["POST"])
def get_classes(request):
    user = request.user
    user_type = user.userprofile.role
    current_year = user.userprofile.year_of_study
    current_semester = user.userprofile.semester

    highest_course = None
    least_course = None
    highest_attended = None
    least_attended = None
    
        
    if user_type == 'admin' or user_type == 'Admin':
        if current_semester and current_year:

        # For admins: Fetch the least attended and highest attended course this semester and year
            highest_attended = (
                Attendance.objects
                .filter(year=current_year, semester=current_semester, status="present")
                .values('course_code')
                .annotate(count=Count('id'))
                .order_by('-count')  # Order by highest attendance count
                .first()  # Get the course with highest attendance
            )
            
            least_attended = (
                Attendance.objects
                .filter(year=current_year, semester=current_semester, status="present")
                .values('course_code')
                .annotate(count=Count('id'))
                .order_by('count')  # Order by least attendance count
                .first()  # Get the course with least attendance
            ) 
            # Fetch the course details based on the course_code
            highest_course = Course.objects.get(code=highest_attended['course_code']) if highest_attended else None
            least_course = Course.objects.get(code=least_attended['course_code']) if least_attended else None
        else:
            highest_attended = None
            least_attended = None
            highest_course = None
            least_course = None

       

        # Prepare the response
        response_data = {
            "highest_attended": {
                "course_code": highest_course.code if highest_course else "N/A",
                "course_name": highest_course.name if highest_course else "N/A",
                "attendance_count": highest_attended['count'] if highest_attended else 0
            },
            "least_attended": {
                "course_code": least_course.code if least_course else "N/A",
                "course_name": least_course.name if least_course else "N/A",
                "attendance_count": least_attended['count'] if least_attended else 0
            }
        }
        return JsonResponse({"success": True, "data": response_data})

    elif user_type == 'student' or user_type == 'Student' or user_type == 'classrep' or user_type == 'Classrep':
        if current_year and current_semester:
            # For students: Fetch the courses they are enrolled in based on enrollments and schedules
            enrollments = Enrollment.objects.filter(user=user, year=current_year, semester=current_semester)
            schedules = Schedule.objects.filter(enrollment__in=enrollments)

            # Prepare the response with course names and codes
            course_data = [
                {
                    "course_code": schedule.enrollment.course_code,
                    "course_name": schedule.enrollment.course_name,
                }
                for schedule in schedules
            ]
        else:
            course_data = ""

    elif user_type == 'lecturer' or user_type == 'Lecturer':
        if current_year and current_semester:
            
            # For lecturers: Fetch the schedules where the lecturer is the instructor
            lec_schedules = Schedule.objects.filter(instructor_id=user.id, enrollment__year=current_year, enrollment__semester=current_semester)

            # Prepare the response with course names and codes
            course_data = [
                {
                    "course_code": schedule.enrollment.course_code,
                    "course_name": schedule.enrollment.course_name,
                }
                for schedule in lec_schedules
            ]
        else:
            course_data = ""

    else:
        return JsonResponse({"success": False, "message": "Invalid user role"}, status=400)

    return JsonResponse({"success": True, "data": course_data})


def get_latest_active_incident(request):
    try:
        latest_active_incident = Incident.objects.filter(status='Active').order_by('-report_date').first()
        
        if latest_active_incident:
            incident_data = {
                "title": latest_active_incident.title,
                "description": latest_active_incident.description,
                "severity": latest_active_incident.severity,
                "status": latest_active_incident.status,
                "report_date": latest_active_incident.report_date,
                "last_updated": latest_active_incident.last_updated,
                "date": latest_active_incident.date,
            }
            return JsonResponse({"success": True, "data": incident_data})
        else:
            return JsonResponse({"success": False, "message": "No active incidents found."}, status=404)
    except Exception as e:
        return JsonResponse({"success": False, "message": str(e)}, status=500)
    
@login_required
def get_latest_log(request):
    user = request.user  # Fetch the logged-in user
    
    # Check user role
    if user.userprofile.role == 'admin' or user.userprofile.role == 'Admin' or user.userprofile.role == 'lecturer' or user.userprofile.role == 'Lecturer' :
        # If admin, return an empty response (as you specified)
        return JsonResponse({"success": True, "data": None})

    elif user.userprofile.role in ['student', 'Student', 'classrep', 'Classrep']:
        # For students and lecturers, fetch the latest log
        latest_log = Attendance.objects.filter(user_id=user.id).order_by('-marked_date').first()
        
        if latest_log:
            log_data = {
                "course": latest_log.course_name + ' '+ latest_log.course_code,
                "method": latest_log.check_in_method,
                "timestamp": latest_log.marked_date,
            }
            return JsonResponse({"success": True, "data": log_data})
        else:
            return JsonResponse({"success": False, "message": "No logs found for this user."}, status=404)
    else:
        return JsonResponse({"success": False, "message": "Invalid user role."}, status=400)
    
    
@csrf_exempt
@require_http_methods(["GET"])
def fetch_courses(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({"success": False, "message": "You are not authenticated."}, status=401)
    
    try:
        user_id = user.id
        _student = UserProfile.objects.get(id=user_id)
        
        semester_of_student = _student.semester

        eligible_courses = Course.objects.filter(
            semester=semester_of_student
        ).values('id', 'code', 'name', 'description', 'program__name', 'semester')
        
        course_list = list(eligible_courses)

        return JsonResponse({"success": True, "data": course_list}, status=200)

    except UserProfile.DoesNotExist:
        return JsonResponse({"success": False, "message": "Student profile not found."}, status=404)
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)




@csrf_exempt
def download_attendance_pdf(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST requests are allowed."}, status=405)

    try:
        # Parse JSON body
        body = json.loads(request.body).get('data')
        course_id = body.get("selectedCourse")
        semester = body.get("selectedSemester")
        year = body.get("selectedYear")

        # Validate input
        if not (course_id and semester and year):
            return JsonResponse({"error": "Missing parameters"}, status=400)

        # Fetch enrolled students and attendance data
        enrolled_students = Enrollment.objects.filter(course_id=course_id, year=year, semester=semester)

        # Create a PDF response
        response = HttpResponse(content_type="application/pdf")
        response["Content-Disposition"] = f"attachment; filename=Attendance_{course_id}_{year}_semester{semester}.pdf"

        # Initialize the PDF canvas
        pdf_canvas = canvas.Canvas(response, pagesize=A4)
        pdf_canvas.setTitle("Attendance Report")

        # Draw logo at the top center with increased width
        logo_path = os.path.join("images", "logo.png")  # Adjust path accordingly
        padding_top = 20  # Adjust this value for the amount of "padding" you want
        pdf_canvas.drawImage(logo_path, (A4[0] - 3.0 * inch) / 2, 750 - padding_top, width=3.0 * inch, height=1.5 * inch)

        # Move down for the title and metadata
        y_position = 720  # Adjust to start below the logo

        # Course and attendance metadata
        course = Course.objects.get(id=course_id)
        pdf_canvas.setFont("Helvetica-Bold", 12)
        pdf_canvas.drawString(50, y_position, "Attendance Report")
        y_position -= 20
        pdf_canvas.setFont("Helvetica", 10)
        pdf_canvas.drawString(50, y_position, f"Course: {course.name} ({course.code})")
        y_position -= 20
        pdf_canvas.drawString(50, y_position, f"Year: {year}, Semester: {semester}")
        y_position -= 30  # Additional space before the table

        # Table headers and data
        data = [["No.", "Student Name", "Admission Number", "Present", "Absent", "Percentage"]]

        # Populate student attendance data with a count and percentage for each student
        total_days = 12  # Total days for attendance calculation
        for idx, enrollment in enumerate(enrolled_students, start=1):
            student = enrollment.user.userprofile
            present_count = Attendance.objects.filter(course_id=course_id, user_id=enrollment.user_id, status="present").count()
            absent_count = total_days - present_count
            attendance_percentage = (present_count / total_days) * 100  # Calculate percentage

            data.append([
                idx,
                student.full_name,
                student.admission,
                present_count,
                absent_count,
                f"{attendance_percentage:.1f}%"  # Format as a percentage with one decimal place
            ])

        # Define custom color for the header background using #22409a
        header_bg_color = Color(34/255, 64/255, 154/255)  # Converted hex #22409a to RGB
        header_text_color = Color(1, 1, 1)  # White color for text
        row_bg_color = Color(0.95, 0.95, 0.9)  # Light beige color for rows

        # Define table and apply styling with custom colors
        table = Table(data, colWidths=[0.5*inch, 2*inch, 1.5*inch, 1*inch, 1*inch, 1*inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), header_bg_color),  # Apply #22409a to header
            ('TEXTCOLOR', (0, 0), (-1, 0), header_text_color),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('BACKGROUND', (0, 1), (-1, -1), row_bg_color),
        ]))

        # Position the table in the PDF
        table.wrapOn(pdf_canvas, 50, y_position - 20)
        table.drawOn(pdf_canvas, 50, y_position - len(data) * 18)  # Adjust Y position for the table

        # Finalize PDF document
        pdf_canvas.save()

        return response

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON in request body"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
