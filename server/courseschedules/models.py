# models.py in schedules app
from django.db import models
from django.contrib.auth.models import User
from academics.models import Enrollment, Instructor
from academics.models import Course

class Schedule(models.Model):
    enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE, related_name="schedules")
    instructor = models.ForeignKey(Instructor, on_delete=models.CASCADE, related_name="instructor_schedules")
    hall = models.CharField(max_length=100)
    date = models.DateField(blank=True, null=True)
    time_start = models.TimeField()
    time_end = models.TimeField()
    recurring_days = models.JSONField(blank=True, null=True)
    
    def __str__(self):
        return f"Schedule for {self.enrollment.course_name} - Instructor: {self.instructor.username}"
