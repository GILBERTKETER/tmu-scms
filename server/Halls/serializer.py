from rest_framework import serializers
from .models import Hall

class HallSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hall
        fields = ['id', 'hall_name', 'hall_capacity', 'booked', 'hall_number']
