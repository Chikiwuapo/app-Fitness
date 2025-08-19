from django.urls import path
from . import views

urlpatterns = [
	path('', views.ProgressListCreateView.as_view(), name='progress'),
	path('stats/', views.stats, name='progress_stats'),
] 