from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from .models import EventNotification, ActivityNotification, ClassNotification
from academics.models import Course, Enrollment, Activities
from courseschedules.models import Schedule
from academicEvents.models import AcademicCalendar
from safetymonitoring.models import Incident
from django.contrib.auth.models import User
from Halls.models import Hall
from django.db.models import Q


from facilities.models import Facilities, FacilityBooking

@shared_task
def automatic_function():
    # Get current time and calculate time window
    current_time_date = timezone.localtime(timezone.now())
    current_time = current_time_date.time()
    one_hour_later = (current_time_date + timedelta(hours=1)).time()
    today = current_time_date.date()
    expiry_time = current_time_date + timedelta(hours=24)
    current_weekday = today.strftime('%A').lower()
    

    # Create Event Notifications - events starting within the next hour
    upcoming_events = AcademicCalendar.objects.filter(
        date=today,
        start_time__gt=current_time,
        start_time__lte=one_hour_later
    )
    
    for event in upcoming_events:
        users_to_notify = User.objects.all()  # Adjust this queryset as needed
        for user in users_to_notify:
            EventNotification.objects.create(
                user=user,
                message=f"Upcoming event: {event.title} scheduled at {event.start_time}",
                event_time=event.start_time,
                location=event.address if event.address is not None else (event.link if event.link is not None else "null"),
                expiry_date=expiry_time
            )

    # Create Class Notifications - classes starting within the next hour
    upcoming_classes = Schedule.objects.filter(
        (
            # Date-specific classes
            (Q(date=today) & Q(date__isnull=False)) |
            # Recurring classes for current weekday
            (Q(date__isnull=True) & Q(recurring_days__contains=current_weekday))
        ),
        time_start__gt=current_time,
        time_start__lte=one_hour_later
    )
    
    for schedule in upcoming_classes:
        enrolled_users = Enrollment.objects.filter(id=schedule.enrollment_id)
        for user in enrolled_users:
            hall = Hall.objects.get(id=schedule.hall)
            hall_location = f"{hall.hall_name} {hall.hall_number}"
            ClassNotification.objects.create(
                user_id=user.user_id,
                course_id=schedule.enrollment.course_id,
                message=f"Upcoming class for {schedule.enrollment.course_name} {schedule.enrollment.course_code} in {hall_location} at {schedule.time_start.strftime('%H:%M')}",
                class_start_time=schedule.time_start,
                hall=hall_location,
                expiry_date=expiry_time
            )

    # Create Activity Notifications - activities starting within the next hour
    upcoming_activities = Activities.objects.filter(
        activity_date=today,
        activity_start_time__gt=current_time,
        activity_start_time__lte=one_hour_later
    )
    
    for activity in upcoming_activities:
        course = Course.objects.filter(id=activity.course_id).first()

        ActivityNotification.objects.create(
            user_id=activity.user.id,
            course=f"{course.name} {course.code}",
            message=f"Upcoming activity: {activity.activity_name} in {activity.activity_location} at {activity.activity_start_time.strftime('%H:%M')}",
            activity_time=activity.activity_start_time,
            location=activity.activity_location,
            expiry_date=expiry_time
        )
        



@shared_task
def update_hall_and_facility_status():
   
    current_datetime = timezone.localtime(timezone.now())
    current_time = current_datetime.time()
    current_date = current_datetime.date()
    current_weekday = current_datetime.strftime('%A').lower()  

    # Get all schedules for today
    today_schedules = Schedule.objects.filter(
        Q(date=current_date) |  # One-time schedules for today
        Q(recurring_days__contains=[current_weekday])  # Recurring schedules for this weekday
    )

    # Check each schedule
    for schedule in today_schedules:
        start_time = schedule.time_start
        end_time = schedule.time_end

        # If the current time falls within a scheduled period
        if start_time <= current_time <= end_time:
            # Update hall status
            try:
                hall = Hall.objects.get(hall_number=schedule.hall)
                hall.booked = True
                hall.save()
            except Hall.DoesNotExist:
                # Log error or handle case where hall doesn't exist
                print(f"Hall {schedule.hall} not found")

    # Update facility status based on FacilityBooking
    facility_bookings = FacilityBooking.objects.filter(
        created_at__date=current_date
    )

    # Update booked facilities
    for booking in facility_bookings:
        facility = booking.facility
        facility.status = "Booked"
        facility.save()

    return {
        'timestamp': current_datetime,
        'halls_updated': Hall.objects.filter(booked=True).count(),
        'facilities_updated': Facilities.objects.filter(status="Booked").count()
    }
