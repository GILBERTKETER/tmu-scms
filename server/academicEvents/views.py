from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
import json
from .models import AcademicCalendar
@csrf_exempt
def add_event(request):
    if request.method == 'POST':
        if not request.user.is_authenticated:
            return JsonResponse({'success':False,'error': 'User is not authenticated'}, status=403)

        try:
            data = json.loads(request.body)

            title = data.get('title')
            date = data.get('date')
            time_range = data.get('time', [])
            start_time = time_range[0] if len(time_range) > 0 else None
            end_time = time_range[1] if len(time_range) > 1 else None
            description = data.get('description')
            visibility = data.get('visibility')
            is_online = data.get('online') 
            link = data.get('link') if is_online else None
            address = data.get('address') if not is_online else None

            if not (title and date and start_time and end_time and description and visibility):
                return JsonResponse({'success':False,'error': 'All required fields are not provided'}, status=400)

            event = AcademicCalendar.objects.create(
                title=title,
                date=date,
                start_time=start_time,
                end_time=end_time,
                description=description,
                event_type=visibility,
                link=link, 
                address=address,
                is_online=is_online
            )
            event.save()

            return JsonResponse({'success':True, 'message': 'Event created successfully', 'event_id': event.id}, status=201)
        except json.JSONDecodeError:
            return JsonResponse({'success':False,'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'success':False,'error': str(e)}, status=500)

    return JsonResponse({'success':False,'error': 'Invalid request method'}, status=405)


@csrf_exempt
def get_events(request):
    events = AcademicCalendar.objects.all().values('id','title', 'date', 'start_time','event_type','is_online','link','address', 'end_time','description')
    return JsonResponse(list(events), safe=False)

@csrf_exempt
def delete_event(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({"success": False, "message": "You are not authenticated."}, status=401)
        
    if request.method != 'DELETE':
        return JsonResponse({"success": False, "message": "Request method Invalid."}, status=405)
    try:
        data = json.loads(request.body)
        eventId = data.get('eventId')
        if not eventId:
            return JsonResponse({"success": False, "message": "Event ID is required."}, status=400)
            
        try:
            existing_event = AcademicCalendar.objects.get(id=eventId)
            
            existing_event.delete()
            return JsonResponse({
            "success": True, 
            "message": "The event has been deleted successfully.",  
        }, status=200)
        except AcademicCalendar.DoesNotExist:
            return JsonResponse({"success": False, "message": "The event was not found in the system."}, status=404)
    except Exception as e:
        return JsonResponse({"success": False, "message": f"An error occurred: {str(e)}"}, status=500)

@csrf_exempt
def edit_events(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({"success": False, "message": "You are not authenticated."}, status=401)
        
    if request.method != 'PUT':
        return JsonResponse({"success": False, "message": "Request method Invalid."}, status=405)
    
    try:
        event = json.loads(request.body)
        data = event.get('event')
        event_id = data.get('id')
        if not event_id:
            return JsonResponse({"success": False, "message": "Event ID is required."}, status=400)
            
        try:
            existing_event = AcademicCalendar.objects.get(id=event_id)
        except AcademicCalendar.DoesNotExist:
            return JsonResponse({"success": False, "message": "The event was not found in the system."}, status=404)
        
        title = data.get('title')
        date = data.get('date')
        if not title or not date:
            return JsonResponse({"success": False, "message": "Title and date are required fields."}, status=400)
            
        time_range = data.get('time', [])
        start_time = time_range[0] if len(time_range) > 0 else None
        end_time = time_range[1] if len(time_range) > 1 else None
        
        is_online = data.get('online', False)
        link = data.get('link') if is_online else None
        address = data.get('address') if not is_online else None
        
        existing_event.title = title
        existing_event.date = date
        existing_event.start_time = start_time
        existing_event.end_time = end_time
        existing_event.description = data.get('description')
        existing_event.event_type = data.get('visibility')
        existing_event.link = link
        existing_event.address = address
        
        existing_event.save()
        
        return JsonResponse({
            "success": True, 
            "message": "The event has been updated successfully.",
              
        }, status=200)
            
    except json.JSONDecodeError:
        return JsonResponse({"success": False, "message": "Invalid JSON data."}, status=400)
    except Exception as e:
        return JsonResponse({"success": False, "message": f"An error occurred: {str(e)}"}, status=500)