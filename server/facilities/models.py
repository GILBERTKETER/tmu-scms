
from django.db import models

class Facilities(models.Model):
    facility_name = models.CharField(max_length=200)
    capacity = models.IntegerField()
    status = models.CharField(max_length=50, default="Available")
    facility_type = models.CharField(max_length=100)


class FacilityBooking(models.Model):
    facility = models.ForeignKey(Facilities, on_delete=models.CASCADE, related_name='bookings')
    title = models.CharField(max_length=255)
    booking_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.facility.name} on {self.booking_date}"