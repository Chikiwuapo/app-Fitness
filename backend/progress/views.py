from django.db.models import Avg, Min, Max
from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Progress
from .serializers import ProgressSerializer


class ProgressListCreateView(generics.ListCreateAPIView):
	serializer_class = ProgressSerializer

	def get_queryset(self):
		return Progress.objects.filter(user=self.request.user)

	def perform_create(self, serializer):
		serializer.save(user=self.request.user)


@api_view(['GET'])
def stats(request):
	qs = Progress.objects.filter(user=request.user)
	if not qs.exists():
		return Response({'count': 0, 'min_weight': None, 'max_weight': None, 'avg_weight': None})
	stats = qs.aggregate(
		count=Avg('weight_kg'),
		min_weight=Min('weight_kg'),
		max_weight=Max('weight_kg'),
		avg_weight=Avg('weight_kg'),
	)
	stats['count'] = qs.count()
	return Response(stats) 