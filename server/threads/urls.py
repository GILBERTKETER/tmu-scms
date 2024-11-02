from django.urls import path
from . import views

urlpatterns = [
    path('incidents/', views.incident_list, name='incident-list'),
    path('reply-incident/', views.reply_incident, name='reply-incident'),
]