from django.urls import path
from .views import add_event, get_events, edit_events, delete_event
urlpatterns = [
    path("add-event/", view=add_event, name="Add event"),
    path("get-events/", view=get_events, name="Get events"),
    path("edit-calendar-events/", view=edit_events, name="Edit events"),
    path("delete-calendar-events/", view=delete_event, name="Delete events"),
]
