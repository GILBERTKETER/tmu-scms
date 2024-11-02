from django.urls import path
from .views import get_incident_summary, get_all_incidents, get_incidents_by_month, add_incident, delet_incident, update_incident
urlpatterns = [
    path("incident-summary/", view=get_incident_summary,name="get counts for incidents"),
    path("get-all-incidents/", view=get_all_incidents,name="get incidents"),
    path("get-incidents-by-month/", view=get_incidents_by_month,name="get chart details incidents"),
    path('add-incident/', add_incident, name='add_incident'),
    path('delete-incident/', delet_incident, name='delete'),
    path('update-incident/', update_incident, name='update'),

]
