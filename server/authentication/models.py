from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=15)
    full_name = models.CharField(max_length=255, blank=True, null=True)
    admission = models.CharField(max_length=100)
    year_of_study = models.CharField(max_length=10, blank=True, null=True)
    semester = models.CharField(max_length=10, blank=True, null=True)
    program = models.CharField(max_length=200, blank=True, null=True)
    role = models.CharField(max_length=100, default="student", null=True, blank=True)

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(pre_delete, sender=User)
def delete_user_profile(sender, instance, **kwargs):
    if hasattr(instance, 'userprofile'):
        instance.userprofile.delete()

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.userprofile.save()
