from django.http import JsonResponse
from django.db.models import Max, Count
from django.utils import timezone
from .models import Incident
from django.views.decorators.http import require_GET, require_POST
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
import json
@csrf_exempt
@require_GET
def get_incident_summary(request):
    user = request.user
    if user.is_authenticated:
        
        active_incidents_count = Incident.objects.filter(status__in=["Active", "In Progress"]).count()

        
        now = timezone.now()
        total_incidents_this_month = Incident.objects.filter(
            report_date__year=now.year,
            report_date__month=now.month
        ).count()
        
        last_incident = Incident.objects.latest('report_date')
        last_incident_date = last_incident.report_date if last_incident else None

        highest_severity = Incident.objects.aggregate(max_severity=Max('severity'))
        max_severity = highest_severity['max_severity']

        return JsonResponse({
            'success': True,
            'active_incidents_count': active_incidents_count,
            'total_incidents_this_month': total_incidents_this_month,
            'last_incident_date': last_incident_date,
            'highest_severity': max_severity,
            'message': 'Incident summary retrieved successfully.'
        }, status=200)
        
    else:
        return JsonResponse({"success":False, "message":"You are not authenticated"}, status=401)


@csrf_exempt
@require_GET
def get_all_incidents(request):
    user = request.user
    if user.is_authenticated:
        incidents = Incident.objects.all().values('id', 'title', 'status', 'date', 'severity')
        return JsonResponse({
            "success": True,
            "data": list(incidents)
        })
    return JsonResponse({"success": False, "error": "User not authenticated"}, status=401)


@csrf_exempt
@require_GET
def get_incidents_by_month(request):
    if request.user.is_authenticated:
        current_year = datetime.now().year
        incidents = (
            Incident.objects.filter(date__year=current_year)
            .values("date__month")
            .annotate(count=Count("id"))
            .order_by("date__month")
        )

        monthly_data = [{"month": month, "incidents": 0} for month in range(1, 13)]
        for incident in incidents:
            monthly_data[incident["date__month"] - 1]["incidents"] = incident["count"]

        month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        data = [{"name": month_names[i], "incidents": month["incidents"]} for i, month in enumerate(monthly_data)]

        return JsonResponse({"success": True, "data": data})
    return JsonResponse({"success": False, "error": "User not authenticated"}, status=401)


@csrf_exempt
@require_POST
def add_incident(request):
    if request.user.is_authenticated:

        try:
            data = json.loads(request.body)

            title = data.get('title')
            description = data.get('description')
            status = data.get('status')
            severity = data.get('severity')
            date = data.get('date')

            if not all([title, description, status, severity, date]):
                return JsonResponse({"success":False,'message': 'Missing required fields'}, status=400)

            incident = Incident.objects.create(
                title=title,
                description=description,
                status=status,
                severity=severity,
                date=date
            )
            return JsonResponse({"success":True,'message': 'Incident added successfully'}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"success":False,'message': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({"success":False,'message': str(e)}, status=500)
    else:
        return JsonResponse({"success": False, "message": "User not authenticated"}, status=401)



@csrf_exempt  
def update_incident(request):
    user = request.user
    if user.is_authenticated:
        
        if request.method == 'PUT':
            data = json.loads(request.body)
            incident_id = data.get('id')
            
            try:
                incident = Incident.objects.get(id=incident_id)
                
                incident.title = data.get('title', incident.title)
                incident.status = data.get('status', incident.status)
                incident.date = data.get('date', incident.date)
                incident.severity = data.get('severity', incident.severity)
                incident.save()
                
                return JsonResponse({'success':True, "message":'Incident updated successfully!'}, status=200)
            except Exception as e:
                return JsonResponse({"success":False,'message': str(e)}, status=400)

        return JsonResponse({"success":False,'message': 'Invalid request method.'}, status=405)
  
@csrf_exempt  
def delet_incident(request):
    user = request.user
    if user.is_authenticated:
        
        if request.method == 'DELETE':
            data = json.loads(request.body)
            incident_id = data.get('id')
            incident = Incident.objects.get(id=incident_id)
            
            if incident:
                incident.delete()
                return JsonResponse({'success':True, "message":'Incident deleted successfully!'}, status=200)
            return JsonResponse({"success":False,'message': 'Incident not found.'}, status=404)

        return JsonResponse({"success":False,'message': 'Invalid request method.'}, status=405)
    return JsonResponse({"success":False,'message': 'Invalid request method.'}, status=405)


