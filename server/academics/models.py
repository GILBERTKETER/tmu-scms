from django.db import models
from django.contrib.auth.models import User

class Program(models.Model):
    name = models.CharField(max_length=255, unique=True)  
    description = models.TextField(blank=True)  
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
    year = models.CharField(max_length=200, null=True, blank=True) 
   
    created_at = models.DateTimeField(auto_now_add=True)  
    updated_at = models.DateTimeField(auto_now=True)  

    def __str__(self):
        return f"{self.code} - {self.name} ({self.program.name})"


class Enrollment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    enrolled_on = models.DateTimeField(auto_now_add=True)
    year = models.IntegerField()  # Year in school, e.g., 1, 2, 3, or 4
    semester = models.CharField(max_length=10)  # e.g., 'Spring' or 'Fall'
    course_code = models.CharField(max_length=100, blank=True, null=True)
    course_name = models.CharField(max_length=200, blank=True, null=True)
    scheduled = models.CharField(default=1, max_length=50, blank=True, null=True)
    class Meta:
        unique_together = ('user', 'course', 'year', 'semester')  # Prevent duplicate enrollments

    def __str__(self):
        return f"{self.user.username} enrolled in {self.course.name} - Year {self.year}, {self.semester}"


class Instructor(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  
    bio = models.TextField(blank=True)  
    expertise = models.CharField(max_length=255) 
    courses = models.ManyToManyField(Course, related_name='instructors', blank=True)  

    def __str__(self):
        return self.user.username


class Activities(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  
    activity_name = models.TextField()
    activity_description = models.TextField()
    activity_date = models.DateField()
    activity_start_time = models.TimeField()
    activity_end_time = models.TimeField()
    activity_location = models.TextField()
    
