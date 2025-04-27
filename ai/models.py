from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    stream = models.CharField(max_length=255, blank=True)
    job_title = models.CharField(max_length=255, blank=True)
    skills = models.TextField(blank=True)  # comma-separated or JSON

    def __str__(self):
        return f"{self.user.username} Profile"
