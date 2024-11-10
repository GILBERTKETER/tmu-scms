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
        # 'schedule': timedelta(hours=20),
        'schedule': timedelta(minutes=1),  # Run every 1 minute

    },
}

app.autodiscover_tasks()

