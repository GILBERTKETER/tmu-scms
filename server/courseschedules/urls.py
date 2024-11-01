from django.urls import path
from .views import create_schedule,get_scheduled_classes
urlpatterns = [
    path("add-schedule/", view=create_schedule, name="Schedule classess"),
    path("get-scheduled-classes/", view=get_scheduled_classes, name="Get Schedule classess"),
]
