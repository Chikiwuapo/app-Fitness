from django.db import models
from django.conf import settings


class Notification(models.Model):
	TYPE_CHOICES = (
		('reminder', 'Reminder'),
		('achievement', 'Achievement'),
	)
	STATUS_CHOICES = (
		('unread', 'Unread'),
		('read', 'Read'),
	)
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
	created_at = models.DateTimeField(auto_now_add=True)
	type = models.CharField(max_length=20, choices=TYPE_CHOICES)
	message = models.CharField(max_length=255)
	status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='unread')
	metadata = models.JSONField(default=dict, blank=True)

	class Meta:
		ordering = ['-created_at']

	def __str__(self):
		return f"{self.user.email} {self.type} {self.status}" 