# models.py in schedules app
from django.db import models
from django.contrib.auth.models import User
from academics.models import Enrollment, Instructor
from academics.models import Course
from django.utils import timezone

class Schedule(models.Model):
    enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE, related_name="schedules")
    instructor = models.ForeignKey(Instructor, on_delete=models.CASCADE, related_name="instructor_schedules")
    hall = models.CharField(max_length=100)
    date = models.DateField(blank=True, null=True)
    time_start = models.TimeField()
    time_end = models.TimeField()
    recurring_days = models.JSONField(blank=True, null=True)
    
    qr_session_key = models.CharField(max_length=64, unique=True, null=True, blank=True)
    qr_generated_at = models.DateTimeField(null=True, blank=True)
    qr_expires_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"Schedule for {self.enrollment.course_name} - Instructor: {self.instructor.username}"
    
    def is_session_valid(self):
        """Check if the session is still valid based on expiration."""
        return self.qr_expires_at and self.qr_expires_at > timezone.now()
class Attendance(models.Model):
    STATUS_CHOICES = [
        ('present', 'Present'),
        ('absent', 'Absent'),
    ]

    CHECK_IN_METHOD_CHOICES = [
        ('manual', 'Manual'),
        ('rfid', 'RFID'),
        ('fingerprint', 'Fingerprint'),
        ('qrCode', 'Qrcode')
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='attendance_records')
    schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE, related_name="attendances")
    course_code = models.CharField(max_length=50)
    course_name = models.CharField(max_length=50)
    course_hall = models.CharField(max_length=50)
    marked_date = models.DateField(auto_now_add=True)  
    day_of_class = models.CharField(max_length=20) 
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)  
    check_in_method = models.CharField(max_length=15, choices=CHECK_IN_METHOD_CHOICES)

    def __str__(self):
        return f"{self.user.username} - {self.course_name} - {self.status} on {self.marked_date.strftime('%Y-%m-%d %H:%M')}"