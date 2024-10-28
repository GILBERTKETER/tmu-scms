from django.db import models
from django.utils import timezone

class Hall(models.Model):
    hall_name = models.CharField(max_length=100)
    hall_capacity = models.PositiveIntegerField()
    hall_description = models.TextField(blank=True, null=True)
    hall_number = models.CharField(max_length=10, unique=True) 
    created_at = models.DateTimeField(default=timezone.now)
    booked = models.BooleanField(default=False)  

    class Meta:
        ordering = ['-created_at']  

    def __str__(self):
        return f"{self.hall_name} (Room {self.hall_number})"
