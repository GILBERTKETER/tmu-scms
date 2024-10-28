from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
import json
from .models import AcademicCalendar
@csrf_exempt
# @login_required
def add_event(request):
    if request.method == 'POST':
        # if not request.user.is_authenticated:
        #     return JsonResponse({'success':False,'error': 'User is not authenticated'}, status=403)

        try:
            data = json.loads(request.body)

            # Extract the data fields from the JSON body
            title = data.get('title')
            date = data.get('date')
            time_range = data.get('time', [])
            start_time = time_range[0] if len(time_range) > 0 else None
            end_time = time_range[1] if len(time_range) > 1 else None
            description = data.get('description')
            visibility = data.get('visibility')
            is_online = data.get('online')  # online = True means the event is online
            link = data.get('link') if is_online else None
            address = data.get('address') if not is_online else None

            # Validate required fields
            if not (title and date and start_time and end_time and description and visibility):
                return JsonResponse({'success':False,'error': 'All required fields are not provided'}, status=400)

            # Create and save the event
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

            # Return a success response
            return JsonResponse({'success':True, 'message': 'Event created successfully', 'event_id': event.id}, status=201)
        except json.JSONDecodeError:
            return JsonResponse({'success':False,'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'success':False,'error': str(e)}, status=500)

    return JsonResponse({'success':False,'error': 'Invalid request method'}, status=405)


@csrf_exempt
def get_events(request):
    events = AcademicCalendar.objects.all().values('title', 'date', 'start_time','event_type','is_online','link','address', 'end_time','description')
    return JsonResponse(list(events), safe=False)
