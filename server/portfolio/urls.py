from django.urls import path
from . import views

urlpatterns = [
    path('portfolio/', views.handle_portfolio, name='handle_portfolio'),
    path('portfolio/get/', views.get_portfolio, name='get_portfolio'),
    path('upload/', views.upload_image, name='upload images'),
    path('students/<str:admission>/', views.student_profile, name='student_profile'),

]