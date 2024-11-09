from django.urls import path
from .views import StudentDashboardView, LecturerDashboardView, AdminDashboardView, active_announcements, add_announcement, get_courses, get_attendance_data, get_classes, get_latest_active_incident, get_latest_log, fetch_courses, download_attendance_pdf
urlpatterns = [
    path("student/statscards/",view=StudentDashboardView, name="Statistical details"),
    path("lecturer/statscards/",view=LecturerDashboardView, name="Statistical details"),
    path('announcements/', view = active_announcements, name='active_announcements'),
    path('announcements/add/', view = add_announcement, name='add_announcement'),
    path("admin/statscards/",view=AdminDashboardView, name="Statistical details"),
    path("courses/",view=get_courses, name="courses details"),
    path("get-attendance-data/",view=get_attendance_data, name="Attendance details"),
    path("get-classes/",view=get_classes, name="classes details"),
    path('latest-active-incident/', view=get_latest_active_incident, name='latest_active_incident'),
    path('latest-log/', view=get_latest_log, name='latest log'),
    path('get-courses/admins/', view=fetch_courses, name='courses'),
    path("download-attendance/", view=download_attendance_pdf, name="download_attendance_pdf"),


]
