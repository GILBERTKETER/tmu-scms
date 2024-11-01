from django.urls import path
from .views import get_programs, add_course, add_program, fetch_courses, enroll_student, get_enrolled_courses, discard_course, get_unscheduled_courses,get_instructors, add_activity, get_activities, delete_activity, update_activity

urlpatterns = [
    path('programs/', get_programs, name='program-list'),
    path('add-course/', add_course, name='course-create'),
    path('add-program/', add_program, name='program-create'),
    path('get-courses/', fetch_courses, name='fetch_courses'),
    path('enroll-course/', enroll_student, name='enroll courses'),
    path('get-enrolled-courses/', get_enrolled_courses, name='enrolled courses'),
    path('de-enroll-course/', discard_course, name='Discard courses'),
    path('get-unscheduled-courses/', get_unscheduled_courses, name='Get unscheduled courses'),
    path('get-instructors/', get_instructors, name='Get course instructors'),
    path('add-activity/', add_activity, name='Adding activities'),
    path('get-activities/', get_activities, name='Adding activities'),
    path('delete-activity/', delete_activity, name='Delete activities'),
    path('update-activity/', update_activity, name='Update activities'),

]
