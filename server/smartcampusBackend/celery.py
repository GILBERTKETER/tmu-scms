from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from celery.schedules import crontab
from celery.schedules import timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smartcampusBackend.settings')

app = Celery('smartcampusBackend')

app.config_from_object('django.conf:settings', namespace='CELERY')


app.conf.beat_schedule = {
    'check-upcoming-classes-every-20-hours': {
        'task': 'notifications.tasks.automatic_function',
        'schedule': timedelta(hours=20),  # Run every 20 hours

    },
    'Update-halls-and-facilities-statuses-every 30-minutes': {
        'task': 'notifications.tasks.update_hall_and_facility_status',
        'schedule': timedelta(minutes=1),

    },
}

app.autodiscover_tasks()

