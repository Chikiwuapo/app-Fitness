from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import DietPlan, WorkoutPlan
from .serializers import DietPlanSerializer, WorkoutPlanSerializer


class DietPlanListCreateView(generics.ListCreateAPIView):
	serializer_class = DietPlanSerializer

	def get_queryset(self):
		return DietPlan.objects.filter(user=self.request.user)

	def perform_create(self, serializer):
		serializer.save(user=self.request.user)


class WorkoutPlanListCreateView(generics.ListCreateAPIView):
	serializer_class = WorkoutPlanSerializer

	def get_queryset(self):
		return WorkoutPlan.objects.filter(user=self.request.user)

	def perform_create(self, serializer):
		serializer.save(user=self.request.user)


@api_view(['POST'])
def generate_personalized(request):
	# Stub plan generator based on BMI category or goal in profile
	user = request.user
	diet = DietPlan.objects.create(
		user=user,
		title='Plan de dieta personalizado',
		description='Generado automáticamente',
		calories_per_day=2200,
		macros={'protein': 30, 'carbs': 45, 'fats': 25},
	)
	workout = WorkoutPlan.objects.create(
		user=user,
		title='Plan de entrenamiento personalizado',
		description='Generado automáticamente',
		schedule={'mon': ['Full body A'], 'wed': ['Cardio'], 'fri': ['Full body B']},
	)
	return Response({
		'diet': DietPlanSerializer(diet).data,
		'workout': WorkoutPlanSerializer(workout).data,
	}) 