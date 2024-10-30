from django.urls import path
from .views import add_facility, get_all_facilities_count, get_all_facilities
urlpatterns = [
    path("add-facility/", view=add_facility,name="adding facilities"),
    path("get-all-facilities-count/", view=get_all_facilities_count,name="Count facilities"),
    path("get-all-facilities/", view=get_all_facilities,name="get facilities"),
]
