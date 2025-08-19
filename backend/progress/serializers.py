from rest_framework import serializers
from .models import Progress


class ProgressSerializer(serializers.ModelSerializer):
	class Meta:
		model = Progress
		fields = [
			'id', 'user', 'date', 'weight_kg', 'waist_cm', 'hip_cm', 'chest_cm',
			'notes', 'achievements', 'created_at'
		]
		read_only_fields = ['id', 'user', 'created_at'] 