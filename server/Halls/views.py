from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from .models import Hall
import json
from rest_framework.decorators import api_view
from .serializer import HallSerializer
from django.views.decorators.http import require_http_methods
from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from courseschedules.models import Schedule
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



@csrf_exempt
def get_halls_all_details(request):
    current_time = timezone.localtime(timezone.now())
    current_day = current_time.strftime('%A').lower()
    current_time = current_time.time()
    
    weekdays = [
        'monday', 'tuesday', 'wednesday', 
        'thursday', 'friday'
    ]
    
    halls = Hall.objects.all().values('id', 'hall_name', 'hall_number', 'hall_capacity', 'booked')
    hall_list = []
    
    for hall in halls:
        schedules = Schedule.objects.filter(
            hall=hall['id']
        ).select_related('enrollment').values(
            'recurring_days',
            'time_start', 
            'time_end',
            'enrollment__course_name',
            'enrollment__id',
            'enrollment__course_code'
        )
        
        # Initialize weekly schedule
        weekly_schedule = {day: [] for day in weekdays}
        
        # Track current class if any
        current_class = None
        next_class = None
        
        # Organize schedules by day
        for schedule in schedules:
            for day in schedule['recurring_days']:
                if day.lower() in weekdays:
                    schedule_info = {
                        'start_time': schedule['time_start'].strftime('%I:%M %p'),
                        'end_time': schedule['time_end'].strftime('%I:%M %p'),
                        'course_name': schedule['enrollment__course_name'],
                        'course_code': schedule['enrollment__course_code'],
                        'enrollment_id': schedule['enrollment__id'],
                        'raw_start_time': schedule['time_start'],
                        'raw_end_time': schedule['time_end']
                    }
                    
                    weekly_schedule[day.lower()].append(schedule_info)
                    
                    # Check if this is current or next class
                    if day.lower() == current_day:
                        if schedule['time_start'] <= current_time <= schedule['time_end']:
                            current_class = {
                                'course_name': schedule['enrollment__course_name'],
                                'course_code': schedule['enrollment__course_code'],
                                'end_time': schedule['time_end'].strftime('%I:%M %p')
                            }
                        elif schedule['time_start'] > current_time and (
                            next_class is None or schedule['time_start'] < next_class['raw_start_time']
                        ):
                            next_class = {
                                'course_name': schedule['enrollment__course_name'],
                                'course_code': schedule['enrollment__course_code'],
                                'start_time': schedule['time_start'].strftime('%I:%M %p'),
                                'raw_start_time': schedule['time_start']
                            }
        
        # Sort schedules by start time for each day
        for day in weekly_schedule:
            weekly_schedule[day] = sorted(
                weekly_schedule[day],
                key=lambda x: x['raw_start_time']
            )
            # Remove raw time fields used for sorting
            for schedule in weekly_schedule[day]:
                del schedule['raw_start_time']
                del schedule['raw_end_time']
        
        hall_details = {
            'id': hall['id'],
            'hall_name': hall['hall_name'],
            'hall_number': hall['hall_number'],
            'hall_capacity': hall['hall_capacity'],
            'current_status': {
                'status': 'Occupied' if hall['booked'] else 'Available',
                'current_class': current_class,
                'next_class': next_class
            },
            'weekly_schedule': {
                day.capitalize(): {
                    'schedules': weekly_schedule[day],
                    'total_classes': len(weekly_schedule[day])
                }
                for day in weekdays
            }
        }
        
        hall_list.append(hall_details)
    
    return JsonResponse({
        'success': True,
        'halls': hall_list,
        'current_day': current_day.capitalize(),
        'current_time': current_time.strftime('%I:%M %p'),
        'message': 'Halls retrieved successfully'
    })
