from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from celery.schedules import timedelta  # Only import timedelta; crontab is not used here.

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smartcampusBackend.settings')

# Instantiate Celery app
app = Celery('smartcampusBackend')

# Load settings from Django settings with the CELERY namespace
app.config_from_object('django.conf:settings', namespace='CELERY')

# Configure timezone
app.conf.timezone = 'Africa/Nairobi'
app.conf.enable_utc = False

# Define the periodic task schedule
app.conf.beat_schedule = {
    'check-upcoming-classes-every-minute': {
        'task': 'notifications.tasks.automatic_function',
        'schedule': timedelta(minutes=1),
    },
    'update-halls-and-facilities-statuses-every-minute': {
        'task': 'notifications.tasks.update_hall_and_facility_status',
        'schedule': timedelta(minutes=1),
    },
}

# Discover tasks across Django apps
app.autodiscover_tasks()
