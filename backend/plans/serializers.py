from rest_framework import serializers
from .models import DietPlan, WorkoutPlan


class DietPlanSerializer(serializers.ModelSerializer):
	class Meta:
		model = DietPlan
		fields = ['id', 'user', 'created_at', 'title', 'description', 'calories_per_day', 'macros']
		read_only_fields = ['id', 'user', 'created_at']


class WorkoutPlanSerializer(serializers.ModelSerializer):
	class Meta:
		model = WorkoutPlan
		fields = ['id', 'user', 'created_at', 'title', 'description', 'schedule']
		read_only_fields = ['id', 'user', 'created_at'] 