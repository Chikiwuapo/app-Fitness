from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
	path('register/', views.register, name='register'),
	path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
	path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
	path('me/', views.me, name='me'),
	path('profile/', views.ProfileView.as_view(), name='profile'),
	path('password/reset/', views.password_reset_request, name='password_reset'),
	path('surveys/', views.SurveyListCreateView.as_view(), name='surveys'),
	path('delete-account/', views.delete_account, name='delete_account'),
] 