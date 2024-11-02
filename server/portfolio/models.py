from django.db import models
from django.contrib.auth.models import User
from django.core.validators import URLValidator, EmailValidator

class PersonalInfo(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='personal_info')
    full_name = models.CharField(max_length=255)
    email = models.EmailField(validators=[EmailValidator()])
    phone = models.CharField(max_length=20)
    location = models.CharField(max_length=255)
    summary = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.full_name}'s Personal Info"

class Skill(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='skills')
    name = models.CharField(max_length=100)

    class Meta:
        unique_together = ['user', 'name']

    def __str__(self):
        return self.name

class Experience(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='experiences')
    company = models.CharField(max_length=255)
    position = models.CharField(max_length=255)
    duration = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.position} at {self.company}"

class Education(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='education')
    institution = models.CharField(max_length=255)
    degree = models.CharField(max_length=255)
    year = models.CharField(max_length=4)
    gpa = models.CharField(max_length=10, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.degree} from {self.institution}"

class Project(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')
    name = models.CharField(max_length=255)
    description = models.TextField()
    technologies = models.CharField(max_length=255)
    link = models.URLField(blank=True, null=True, validators=[URLValidator()])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class SocialMedia(models.Model):
    PLATFORM_CHOICES = [
        ('linkedin', 'LinkedIn'),
        ('twitter', 'Twitter/X'),
        ('instagram', 'Instagram'),
        ('facebook', 'Facebook'),
        ('youtube', 'YouTube'),
        ('tiktok', 'TikTok'),
        ('behance', 'Behance'),
        ('dribbble', 'Dribbble'),
        ('medium', 'Medium'),
        ('stackoverflow', 'Stack Overflow'),
        ('github', 'GitHub'),
        ('other', 'Other'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='social_media')
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES)
    username = models.CharField(max_length=255)
    url = models.URLField(validators=[URLValidator()])
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'platform']

    def __str__(self):
        return f"{self.platform} - {self.username}"