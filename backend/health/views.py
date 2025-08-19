from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status, generics
from .serializers import BMICalculateSerializer, HealthMetricSerializer
from .models import HealthMetric


@api_view(['GET'])
@permission_classes([AllowAny])
def ping(request):
	return Response({'message': 'health ok'})


class HealthMetricListCreateView(generics.ListCreateAPIView):
	serializer_class = HealthMetricSerializer

	def get_queryset(self):
		return HealthMetric.objects.filter(user=self.request.user)

	def perform_create(self, serializer):
		data = serializer.validated_data
		height_m = data['height_cm'] / 100
		bmi = float(data['weight_kg']) / (height_m ** 2)
		if bmi < 18.5:
			category = 'Underweight'
		elif bmi < 25:
			category = 'Normal'
		elif bmi < 30:
			category = 'Overweight'
		else:
			category = 'Obese'
		serializer.save(user=self.request.user, bmi=round(bmi, 2), bmi_category=category)


@api_view(['POST'])
@permission_classes([AllowAny])
def bmi_calculate(request):
	serializer = BMICalculateSerializer(data=request.data)
	serializer.is_valid(raise_exception=True)
	height_m = serializer.validated_data['height_cm'] / 100
	bmi = float(serializer.validated_data['weight_kg']) / (height_m ** 2)
	if bmi < 18.5:
		category = 'Underweight'
	elif bmi < 25:
		category = 'Normal'
	elif bmi < 30:
		category = 'Overweight'
	else:
		category = 'Obese'
	return Response({'bmi': round(bmi, 2), 'category': category})