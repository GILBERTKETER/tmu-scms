from django.urls import path
from .views import StudentDashboardView, LecturerDashboardView, AdminDashboardView
urlpatterns = [
    path("student/statscards/",view=StudentDashboardView, name="Statistical details"),
    path("lecturer/statscards/",view=LecturerDashboardView, name="Statistical details"),
    path("admin/statscards/",view=AdminDashboardView, name="Statistical details"),
]
