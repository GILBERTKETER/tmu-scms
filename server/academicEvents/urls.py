from django.urls import path
from .views import add_event, get_events
urlpatterns = [
    path("add-event/", view=add_event, name="Add event"),
    path("get-events/", view=get_events, name="Get events"),
]
