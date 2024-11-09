from django.db import models
import uuid

class Incident(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.CharField(max_length=255)
    content = models.TextField()
    avatar = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.author}'s incident on {self.created_at}"

class Reply(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    incident = models.ForeignKey(Incident, related_name='replies', on_delete=models.CASCADE)
    author = models.CharField(max_length=255)
    content = models.TextField()
    avatar = models.CharField(max_length=255, default="https://github.com/gilbertketer.png")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Reply by {self.author} on {self.created_at}"