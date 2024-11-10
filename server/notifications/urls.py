# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('notifications/get/', views.get_user_notifications, name='user-notifications'),
]