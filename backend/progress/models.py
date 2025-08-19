from django.db import models
from django.conf import settings


class Progress(models.Model):
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='progress_records')
	date = models.DateField()
	weight_kg = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
	waist_cm = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)
	hip_cm = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)
	chest_cm = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)
	notes = models.TextField(blank=True)
	achievements = models.JSONField(default=list, blank=True)  # strings of achievements
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ['-date']
		unique_together = ('user', 'date')

	def __str__(self):
		return f"{self.user.email} {self.date}" 