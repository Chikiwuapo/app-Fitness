from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from health.views import bmi_calculate

urlpatterns = [
	path('admin/', admin.site.urls),
	# API namespaces
	path('api/auth/', include('users.urls')),
	path('api/health/', include('health.urls')),
	path('api/plans/', include('plans.urls')),
	path('api/progress/', include('progress.urls')),
	path('api/notifications/', include('notifications.urls')),
	# Public endpoints (no auth)
	path('public/calculate-bmi/', bmi_calculate, name='public_calculate_bmi'),
	# legacy api
	path('api/', include('api.urls')),
	path('', lambda request: JsonResponse({"status": "ok", "service": "webFitness API"})),
]