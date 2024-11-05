from django.urls import path
from .views import create_schedule,get_scheduled_classes, update_class_details, get_attendance_logs, verify_qrcode, generate_qrcode, check_in_students,check_in_students_rfid
urlpatterns = [
    path("add-schedule/", view=create_schedule, name="Schedule classess"),
    path("get-scheduled-classes/", view=get_scheduled_classes, name="Get Schedule classess"),
    path("update-class-details/", view=update_class_details, name="Update classes"),
    path('attendance-logs/', view=get_attendance_logs, name='attendance_logs'),
    path('verify-qr/', view=verify_qrcode, name='Verify qr code'),
    path('generate-qr/', view=generate_qrcode, name='Generate qr code'),
    path('check-in-students/', view=check_in_students, name='Manual Checkin'),
    path('check-in-students/rfid/', view=check_in_students_rfid, name='Rfid Checkin'),

]
