from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from .models import Hall
import json
from rest_framework.decorators import api_view
from .serializer import HallSerializer
from django.views.decorators.http import require_http_methods

@csrf_exempt
def AddHallView(request):
    if(request.method == 'POST'):
        try:
            # Parse the request body to get the data
            body = json.loads(request.body)
            hall_name = body.get('hallName')
            hall_capacity = body.get('hallCapacity')
            hall_description = body.get('hallDescription')
            hall_number = body.get('hallNumber')
            
            # Check if any required fields are missing
            if not all([hall_name, hall_capacity, hall_number]):
                return JsonResponse({
                    'success': False,
                    'message': 'Missing required fields (hall name, hall capacity, room number).'
                }, status=400)

            # Check if the room number already exists
            if Hall.objects.filter(hall_number=hall_number).exists():
                return JsonResponse({
                    'success': False,
                    'message': 'Room number already exists.'
                }, status=400)

            # Create the new hall entry
            hall = Hall.objects.create(
                hall_name=hall_name,
                hall_capacity=hall_capacity,
                hall_description=hall_description,
                hall_number=hall_number
            )

            return JsonResponse({
                'success': True,
                'message': 'Hall added successfully.',
                'hall': {
                    'id': hall.id,
                    'name': hall.hall_name,
                    'capacity': hall.hall_capacity,
                    'description': hall.hall_description,
                    'room_number': hall.hall_number,
                    'created_at': hall.created_at
                }
            }, status=201)

        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON format.'
            }, status=400)

        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'An error occurred: {str(e)}'
            }, status=500)

@csrf_exempt
def halls_status(request):
    # Count total halls
    total_halls = Hall.objects.count()

    # Count booked halls
    booked_halls = Hall.objects.filter(booked=True).count()

    # Count available halls
    available_halls = total_halls - booked_halls

    # Calculate booked percentage
    if total_halls > 0:
        booked_percentage = (booked_halls / total_halls) * 100
    else:
        booked_percentage = 0

    # Return data as JSON
    data = {
        "total_halls": total_halls,
        "booked_halls": booked_halls,
        "available_halls": available_halls,
        "booked_percentage": round(booked_percentage, 2)  
    }

    return JsonResponse(data)

@csrf_exempt
def get_halls(request):
    halls = Hall.objects.all().values('id', 'hall_name','hall_number', 'hall_capacity', 'booked')
    hall_list = [
        {
            'id': hall['id'],
            'hall_name': hall['hall_name'],
            'hall_number': hall['hall_number'],
            'hall_capacity': hall['hall_capacity'],
            'booked': 'Occupied' if hall['booked'] else 'Available'
        }
        for hall in halls
    ]
    return JsonResponse(hall_list, safe=False)

@csrf_exempt
@require_http_methods(["PUT"])
def update_hall(request):
    try:
        # Parse the JSON data from request body
        data = json.loads(request.body)
        hall_id = data.get('id')
        
        # Retrieve the hall object by ID
        try:
            hall = Hall.objects.get(id=hall_id)
        except Hall.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Hall not found'
            }, status=404)
        
        # Update the hall using the serializer
        serializer = HallSerializer(hall, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({
                'success': True,
                'message': 'Hall updated successfully',
                'data': serializer.data
            }, status=200)
        else:
            return JsonResponse({
                'success': False,
                'message': 'Invalid data provided',
                'errors': serializer.errors
            }, status=400)
            
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON data'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': str(e)
        }, status=500)
        


@csrf_exempt
@require_http_methods(["DELETE"])
def delete_hall(request):
    try:
        data = json.loads(request.body)
        hall_id = data.get('id')
        # Retrieve the hall object by ID
        hall = Hall.objects.get(id=hall_id)
        hall.delete()  # Delete the hall
        return JsonResponse({
            'success': True,
            'message': 'Hall deleted successfully'
        }, status=200)
    except Hall.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'Hall not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': str(e)
        }, status=500)        

