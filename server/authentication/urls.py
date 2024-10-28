from django.urls import path
from . import views


urlpatterns = [
    path("signup/", views.user_registration,name="User Registration"),
    path("signin/", views.user_login,name="User authentication"),
    path("signout/", views.user_logout,name="log out"),
    path("get-user/", views.get_user,name="Get user"),
    path('reset-password/', views.reset_password, name='reset_password'),
    path('requestlink/', views.request_password_reset_link, name='Request link'),

]
