from django.urls import path
from . import views

urlpatterns = [
    path('portfolio/', views.handle_portfolio, name='handle_portfolio'),
    path('portfolio/get/', views.get_portfolio, name='get_portfolio'),
]