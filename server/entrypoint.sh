#!/bin/bash

set -e

# Run database migrations
echo "Running database migrations..."
python manage.py migrate

# Start Celery worker
echo "Starting Celery worker..."
celery -A smartcampusBackend worker --loglevel=info -P solo &

# Start Celery beat
echo "Starting Celery beat..."
celery -A smartcampusBackend beat --loglevel=info &

# Start Django development server
echo "Starting Django development server..."
python manage.py runserver 0.0.0.0:8080