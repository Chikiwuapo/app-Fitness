from django.urls import path
from . import views

urlpatterns = [
	path('diet/', views.DietPlanListCreateView.as_view(), name='diet_plans'),
	path('workout/', views.WorkoutPlanListCreateView.as_view(), name='workout_plans'),
	path('generate/', views.generate_personalized, name='generate_plans'),
] 