from django.urls import path
from . import views

urlpatterns = [
	path('test/', views.ping, name='health_test'),
	path('bmi/', views.bmi_calculate, name='bmi_calculate'),
	path('metrics/', views.HealthMetricListCreateView.as_view(), name='metrics'),
] 