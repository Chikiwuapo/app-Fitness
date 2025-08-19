from django.db import models
from django.conf import settings


class HealthMetric(models.Model):
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='health_metrics')
	created_at = models.DateTimeField(auto_now_add=True)
	height_cm = models.PositiveIntegerField()
	weight_kg = models.DecimalField(max_digits=5, decimal_places=2)
	bmi = models.DecimalField(max_digits=5, decimal_places=2)
	bmi_category = models.CharField(max_length=50)
	body_fat_pct = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

	class Meta:
		ordering = ['-created_at']

	def __str__(self):
		return f"{self.user.email} {self.created_at:%Y-%m-%d} BMI {self.bmi}" 