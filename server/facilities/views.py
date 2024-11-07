from django.http import JsonResponse
import json
from .models import Facilities, FacilityBooking
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
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
    

@csrf_exempt
@require_POST
def book_facility(request):
    user = request.user
    if user.is_authenticated:
        data = json.loads(request.body)
        facility_id = data.get('facility_id')
        title = data.get('title')
        activity_id = data.get('activity_id')

        if not all([facility_id, title, activity_id]):
            return JsonResponse({
                'success': False,
                'message': 'All fields are required.'
            }, status=400)

        try:
            facility = Facilities.objects.get(id=facility_id)
            if facility:
                if facility.status == 'Available':
                    booking = FacilityBooking.objects.create(
                        facility=facility,
                        title=title,
                        activity_id = activity_id
                    )
                    booking.save()
                    facility.status = 'Occupied'
                    facility.save()
                    return JsonResponse({
                        'success': True,
                        'message': 'Facility booked successfully!'
                    }, status=201)
                else:
                    return JsonResponse({
                        'success': False,
                        'message': "The facility is not available for booking."
                    }, status=409)  # Conflict status code
            else:
                return JsonResponse({
                    'success': False,
                    'message': "The facility was not found in the system."
                }, status=404)  # Not found status code

        except Facilities.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': "The facility does not exist."
            }, status=404)  # Not found status code
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': str(e)
            }, status=500)  # Internal server error

    else:
        return JsonResponse({
            'success': False,
            'message': "You are not authenticated."
        }, status=403)  # Forbidden status code