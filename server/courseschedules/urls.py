from django.urls import path
from .views import create_schedule,get_scheduled_classes, update_class_details, get_attendance_logs
urlpatterns = [
    path("add-schedule/", view=create_schedule, name="Schedule classess"),
    path("get-scheduled-classes/", view=get_scheduled_classes, name="Get Schedule classess"),
    path("update-class-details/", view=update_class_details, name="Update classes"),
    path('attendance-logs/', view=get_attendance_logs, name='attendance_logs'),

]
