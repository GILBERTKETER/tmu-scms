from django.db import models
from django.utils import timezone

class Announcement(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    published_date = models.DateTimeField(default=timezone.now)
    expiry_date = models.DateTimeField(null=True, blank=True)

    def is_active(self):
        """Check if the announcement is still valid based on expiry date."""
        if self.expiry_date:
            return timezone.now() <= self.expiry_date
        return True

    def __str__(self):
        return self.title
