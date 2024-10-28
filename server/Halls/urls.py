from django.urls import path
from .views import AddHallView, halls_status, get_halls, update_hall, delete_hall
urlpatterns = [
    path("add-hall/", view=AddHallView, name="add a hall"),
    path('halls-status/', halls_status, name='halls_status'),
    path('get-halls/', get_halls, name='Get halls'),
    path('update-hall/', update_hall, name='update hall'),
    path('delete-hall/', delete_hall, name='Delete hall'),

]
