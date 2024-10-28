from django.db import models
from django.contrib.auth.models import User

class Program(models.Model):
    name = models.CharField(max_length=255, unique=True)  
    description = models.TextField(blank=True) 
    duration = models.IntegerField()  
    level = models.CharField(max_length=100)  
    created_at = models.DateTimeField(auto_now_add=True)  
    updated_at = models.DateTimeField(auto_now=True) 

    def __str__(self):
        return self.name


class Course(models.Model):
    code = models.CharField(max_length=10, unique=True) 
    name = models.CharField(max_length=255)  
    description = models.TextField(blank=True)  
    program = models.ForeignKey(Program, related_name='courses', on_delete=models.CASCADE)  
    semester = models.CharField(max_length=100, blank=True)  
    created_at = models.DateTimeField(auto_now_add=True)  
    updated_at = models.DateTimeField(auto_now=True)  

    def __str__(self):
        return f"{self.code} - {self.name} ({self.program.name})"


class Enrollment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  
    course = models.ForeignKey(Course, on_delete=models.CASCADE)  
    enrolled_on = models.DateTimeField(auto_now_add=True) 

    class Meta:
        unique_together = ('user', 'course')  # Prevent duplicate enrollments

    def __str__(self):
        return f"{self.user.username} enrolled in {self.course.name}"


class Instructor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)  
    bio = models.TextField(blank=True)  
    expertise = models.CharField(max_length=255) 
    courses = models.ManyToManyField(Course, related_name='instructors', blank=True)  

    def __str__(self):
        return self.user.username
