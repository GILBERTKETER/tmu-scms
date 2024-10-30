from django.http import JsonResponse
import json
from .models import Facilities
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def add_facility(request):
    if request.method == "POST":
        user = request.user
        if user.is_authenticated:
            try:
                data = json.loads(request.body)
                facility_name = data.get('name')
                capacity = data.get('capacity')
                facility_type = data.get('type')
                
                # Create a new facility instance and save it
                facility = Facilities(
                    facility_name=facility_name,
                    capacity=capacity,
                    facility_type=facility_type
                )
                facility.save()
                
                return JsonResponse({
                    "success": True,
                    "message": "Facility added successfully!"
                }, status=201)

            except json.JSONDecodeError:
                return JsonResponse({
                    "success": False,
                    "message": "Invalid JSON data."
                }, status=400)
            except Exception as e:
                return JsonResponse({
                    "success": False,
                    "message": str(e)
                }, status=500)
        else:
            return JsonResponse({
                "success": False,
                "message": "You are not authenticated."
            }, status=403)
    else:
        return JsonResponse({
            "success": False,
            "message": "Invalid request method. Please use POST."
        }, status=405)


def get_all_facilities_count(request):
    user = request.user
    if user.is_authenticated:
        total_facilities = Facilities.objects.count()
        
        available_facilities = Facilities.objects.filter(status="Available").count()
        booked_facilities = Facilities.objects.filter(status="Occupied").count()

        # Count for specific types
        facility_types = ['library', 'computer_lab', 'physics_lab', 'biology_lab']
        
        # Initialize a dictionary to hold counts for each type
        type_counts = {}
        
        for facility_type in facility_types:
            total_count = Facilities.objects.filter(facility_type=facility_type).count()
            available_count = Facilities.objects.filter(facility_type=facility_type, status="Available").count()
            booked_count = Facilities.objects.filter(facility_type=facility_type, status="Occupied").count()
            
            type_counts[facility_type] = {
                "total": total_count,
                "available": available_count,
                "booked": booked_count,
            }

        # Create a response data dictionary
        response_data = {
            "success": True,
            "total_facilities": total_facilities,
            "available_facilities": available_facilities,
            "booked_facilities": booked_facilities,
            "type_counts": type_counts,  # Add the type counts to the response
        }
        
        return JsonResponse(response_data)

    else:
        return JsonResponse({
            "success": False,
            "message": "You are not authenticated."
        }, status=403)
        
        
def get_all_facilities(request):
    user = request.user
    if user.is_authenticated:
        facilities = Facilities.objects.all().values('id', 'facility_name', 'capacity', 'status', 'facility_type')
        facility_list = list(facilities) 

        return JsonResponse({
            "success": True,
            "facilities": facility_list
        })

    return JsonResponse({
        "success": False,
        "message": "You are not authenticated."
    }, status=403)