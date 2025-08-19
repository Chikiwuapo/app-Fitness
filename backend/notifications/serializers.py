from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
	class Meta:
		model = Notification
		fields = ['id', 'user', 'created_at', 'type', 'message', 'status', 'metadata']
		read_only_fields = ['id', 'user', 'created_at'] 