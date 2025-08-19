from django.urls import path
from . import views

urlpatterns = [
	path('', views.NotificationListView.as_view(), name='notifications'),
	path('<int:pk>/read/', views.mark_read, name='mark_read'),
] 