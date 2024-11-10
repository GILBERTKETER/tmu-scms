from django.db import models
from django.contrib.auth.models import User
from academics.models import Course



class EventNotification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    event_time = models.TimeField()
    location = models.TextField()
    expiry_date = models.DateTimeField()

    def __str__(self):
        return f"Event Notification for {self.user.username} - Event at {self.event_time}"


class ClassNotification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    class_start_time = models.TimeField()
    hall = models.TextField()
    expiry_date = models.DateTimeField()

    def __str__(self):
        return f"Class Notification for {self.user.username} - {self.course.name}"
    
    
class ActivityNotification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.TextField(default="")
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    activity_time = models.TimeField()
    location = models.TextField()
    expiry_date = models.DateTimeField()

    def __str__(self):
        return f"Activity Notification for {self.user.username} - Activity: {self.message[:20]}"