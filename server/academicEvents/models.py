from django.db import models

class AcademicCalendar(models.Model):
    EVENT_TYPE_CHOICES = [
        ('public', 'Public'),
        ('private', 'Private'),
    ]

    title = models.CharField(max_length=150, help_text="Enter a short title for the event")
    date = models.DateField(help_text="Enter the date of the event")
    start_time = models.TimeField(help_text="Event start time")
    end_time = models.TimeField(help_text="Event end time")
    description = models.TextField(max_length=500, blank=True, null=True, help_text="Optional: Brief description of the event")
    event_type = models.CharField(max_length=7, choices=EVENT_TYPE_CHOICES, help_text="Indicate if the event is public or private")
    created_at = models.DateTimeField(auto_now_add=True, help_text="The date and time when this event was created")
    updated_at = models.DateTimeField(auto_now=True, help_text="The date and time when this event was last updated")
    link = models.URLField(blank=True, null=True) 
    address = models.CharField(max_length=255, blank=True, null=True)
    is_online = models.CharField(max_length=255, blank=True,null=True)
    class Meta:
        verbose_name = "Academic Calendar Event"
        verbose_name_plural = "Academic Calendar Events"
        ordering = ['date', 'start_time']

    def __str__(self):
        return f"{self.title} - {self.date} ({self.event_type})"
