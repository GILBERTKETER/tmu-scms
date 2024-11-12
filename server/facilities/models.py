
from django.db import models
from academics.models import Activities
class Facilities(models.Model):
    facility_name = models.CharField(max_length=200)
    capacity = models.IntegerField()
    status = models.CharField(max_length=50, default="Available")
    facility_type = models.CharField(max_length=100)


class FacilityBooking(models.Model):
    facility = models.ForeignKey(Facilities, on_delete=models.CASCADE, related_name='bookings')
    activity_id = models.IntegerField(blank=True, null=True)
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    activity_start_time = models.TimeField()
    activity_end_time = models.TimeField()
    activity_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"{self.title} - {self.facility.name} on {self.booking_date}"