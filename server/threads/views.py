# views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Incident, Reply
from django.forms.models import model_to_dict
from django.core.exceptions import ObjectDoesNotExist

@csrf_exempt
def incident_list(request):
    if request.method == 'GET':
        incidents = Incident.objects.all()
        incidents_data = []
        
        for incident in incidents:
            # Include the id explicitly
            incident_dict = {
                'id': str(incident.id),  # Convert UUID to string
                'author': incident.author,
                'content': incident.content,
                'avatar': incident.avatar,
                'created_at': incident.created_at.isoformat()
            }
            
            # Get replies for this incident
            replies = incident.replies.all()
            replies_data = []
            for reply in replies:
                reply_dict = {
                    'id': str(reply.id),  # Convert UUID to string
                    'author': reply.author,
                    'content': reply.content,
                    'avatar': reply.avatar,
                    'created_at': reply.created_at.isoformat()
                }
                replies_data.append(reply_dict)
            
            incident_dict['replies'] = replies_data
            incidents_data.append(incident_dict)
        
        return JsonResponse(incidents_data, safe=False)

    elif request.method == 'POST':
        data = json.loads(request.body)
        incident = Incident.objects.create(
            author=data.get('author'),
            content=data.get('content'),
            avatar="https://github.com/gilbertketer.png"
        )
        
        # Include the id explicitly in response
        response_data = {
            'id': str(incident.id),
            'author': incident.author,
            'content': incident.content,
            'avatar': incident.avatar,
            'created_at': incident.created_at.isoformat(),
            'replies': []
        }
        
        return JsonResponse(response_data)

@csrf_exempt
def reply_incident(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Get the incident_id from request body
            incident_id = data.get('incident_id')
            if not incident_id:
                return JsonResponse({'error': 'incident_id is required'}, status=400)
            
            incident = Incident.objects.get(id=incident_id)
            
            reply = Reply.objects.create(
                incident=incident,
                author=data.get('author'),
                content=data.get('content'),
                avatar="https://github.com/gilbertketer.png"
            )
            
            # Include the id explicitly in response
            response_data = {
                'id': str(reply.id),
                'author': reply.author,
                'content': reply.content,
                'avatar': reply.avatar,
                'created_at': reply.created_at.isoformat()
            }
            
            return JsonResponse(response_data)
            
        except ObjectDoesNotExist:
            return JsonResponse({'error': 'Incident not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)