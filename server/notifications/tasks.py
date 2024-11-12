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
from .utils import send_message
from authentication.models import UserProfile
from facilities.models import Facilities, FacilityBooking

def format_kenyan_phone_number(phone_number):
    # Ensure the phone number starts with '0' and replace it with '+254'
    if phone_number.startswith("0"):
        return "+254" + phone_number[1:]
    return phone_number


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
        users_to_notify = User.objects.all()
        for user in users_to_notify:
            EventNotification.objects.create(
                user=user,
                message=f"Upcoming event: {event.title} scheduled at {event.start_time.strftime('%I:%M %p')}",
                event_time=event.start_time,
                location=event.address if event.address is not None else (event.link if event.link is not None else "null"),
                expiry_date=expiry_time
            )
            user_profile = UserProfile.objects.get(user_id=user.id)
            user_phone = user_profile.phone_number 
            send_message(to = format_kenyan_phone_number(user_phone), conversation=f"Upcoming event: {event.title} scheduled at {event.start_time.strftime('%I:%M %p')}")

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
                message = f"Upcoming class for {schedule.enrollment.course_name} {schedule.enrollment.course_code} in {hall_location} at {schedule.time_start.strftime('%I:%M %p')}",
                class_start_time=schedule.time_start,
                hall=hall_location,
                expiry_date=expiry_time
            )
            user_profile = UserProfile.objects.get(user_id=user.user_id)
            user_phone = user_profile.phone_number 
            send_message(to = format_kenyan_phone_number(user_phone), conversation=f"Upcoming class for {schedule.enrollment.course_name} {schedule.enrollment.course_code} in {hall_location} at {schedule.time_start.strftime('%I:%M %p')}")
            
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

    # Get all halls to process
    halls = Hall.objects.all()
    
    # Process each hall individually
    for hall in halls:
        # Get today's schedules for this specific hall
        hall_schedules = Schedule.objects.filter(
            hall=hall.id,
            recurring_days__contains=[current_weekday]
        )
        
        # Default state is not booked
        should_be_booked = False
        
        # Check if the hall should be booked right now based on any schedule
        for schedule in hall_schedules:
            start_time = schedule.time_start
            end_time = schedule.time_end
            
            # If current time falls within this schedule period
            if start_time <= current_time <= end_time:
                should_be_booked = True
                break  # Found an active schedule, no need to check others
        
        # Update hall status if it's different from current state
        if hall.booked != should_be_booked:
            hall.booked = should_be_booked
            hall.save()

    # Update facility status based on FacilityBooking
    facilities = Facilities.objects.all()
    
    for facility in facilities:
        # Check if there's an active booking for this facility
        active_booking = FacilityBooking.objects.filter(
            facility=facility,
            activity_date=current_date,
            activity_start_time__lte=current_time,
            activity_end_time__gte=current_time
        ).exists()
        
        # Update facility status based on active booking
        new_status = "Booked" if active_booking else "Available"
        if facility.status != new_status:
            facility.status = new_status
            facility.save()

    return {
        'current weekday':current_weekday,
        'timestamp': current_datetime,
        'halls_updated': Hall.objects.filter(booked=True).count(),
        'facilities_updated': Facilities.objects.filter(status="Booked").count()
    }