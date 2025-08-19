from rest_framework import serializers
from .models import HealthMetric


class HealthMetricSerializer(serializers.ModelSerializer):
	class Meta:
		model = HealthMetric
		fields = ['id', 'user', 'created_at', 'height_cm', 'weight_kg', 'bmi', 'bmi_category', 'body_fat_pct']
		read_only_fields = ['id', 'user', 'created_at', 'bmi', 'bmi_category']

class BMICalculateSerializer(serializers.Serializer):
	height_cm = serializers.IntegerField(min_value=50, max_value=300)
	weight_kg = serializers.DecimalField(max_digits=5, decimal_places=2, min_value=1)
	body_fat_pct = serializers.DecimalField(max_digits=5, decimal_places=2, required=False) 