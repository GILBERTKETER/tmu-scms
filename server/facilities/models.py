
from django.db import models

class Facilities(models.Model):
    facility_name = models.CharField(max_length=200)
    capacity = models.IntegerField()
    status = models.CharField(max_length=50, default="Available")
    facility_type = models.CharField(max_length=100)
