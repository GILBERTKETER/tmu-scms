from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from .models import ClassNotification, EventNotification, ActivityNotification
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_notifications(request):
    try:
        user_id = request.user.id
        current_time = timezone.localtime(timezone.now())

        # Fetch all types of non-expired notifications for the user
        event_notifications = EventNotification.objects.filter(
            user_id=user_id,
            expiry_date__gt=current_time
        ).values(
            'id',
            'message',
            'event_time',
            'location',
            'expiry_date',
        ).order_by('-expiry_date')

        class_notifications = ClassNotification.objects.filter(
            user_id=user_id,
            expiry_date__gt=current_time
        ).values(
            'id',
            'message',
            'class_start_time',
            'hall',
            'expiry_date'
        ).order_by('-expiry_date')

        activity_notifications = ActivityNotification.objects.filter(
            user_id=user_id,
            expiry_date__gt=current_time
        ).values(
            'id',
            'message',
            'activity_time',
            'location',
            'expiry_date'
        ).order_by('-expiry_date')

        # Combine all notifications
        all_notifications = []
        
        for notification in event_notifications:
            all_notifications.append({
                'id': notification['id'],
                'type': 'event',
                'message': notification['message'],
                'time': notification['event_time'],
                'location': notification['location'],
                'expiry_date': notification['expiry_date'],

            })

        for notification in class_notifications:
            all_notifications.append({
                'id': notification['id'],
                'type': 'class',
                'message': notification['message'],
                'time': notification['class_start_time'],
                'location': notification['hall'],
                'expiry_date': notification['expiry_date'],

            })

        for notification in activity_notifications:
            all_notifications.append({
                'id': notification['id'],
                'type': 'activity',
                'message': notification['message'],
                'time': notification['activity_time'],
                'location': notification['location'],
                'expiry_date': notification['expiry_date'],
            })

        # Sort all notifications by creation time
        all_notifications.sort(key=lambda x: x['expiry_date'], reverse=True)

        return Response({
            'notifications': all_notifications,
            'total_count': len(all_notifications)
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {'error': f'Error fetching notifications: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )