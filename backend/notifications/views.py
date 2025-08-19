from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Notification
from .serializers import NotificationSerializer


class NotificationListView(generics.ListAPIView):
	serializer_class = NotificationSerializer

	def get_queryset(self):
		return Notification.objects.filter(user=self.request.user)


@api_view(['POST'])
def mark_read(request, pk):
	try:
		n = Notification.objects.get(pk=pk, user=request.user)
	except Notification.DoesNotExist:
		return Response({'detail': 'Notificación no encontrada'}, status=status.HTTP_404_NOT_FOUND)
	n.status = 'read'
	n.save()
	return Response(NotificationSerializer(n).data) 