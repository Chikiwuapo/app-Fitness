from django.db import models
from django.conf import settings


class Plan(models.Model):
	TYPE_CHOICES = (
		('diet', 'Diet'),
		('workout', 'Workout'),
	)
	LEVEL_CHOICES = (
		('beginner', 'Beginner'),
		('intermediate', 'Intermediate'),
		('advanced', 'Advanced'),
	)
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='plans')
	created_at = models.DateTimeField(auto_now_add=True)
	type = models.CharField(max_length=20, choices=TYPE_CHOICES)
	title = models.CharField(max_length=200)
	description = models.TextField(blank=True)
	calories_per_day = models.PositiveIntegerField(null=True, blank=True)
	level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='beginner')
	content = models.JSONField(default=dict, blank=True)

	class Meta:
		ordering = ['-created_at']

	def __str__(self):
		return f"Plan {self.user.email} - {self.type} - {self.title}"


class DietPlan(models.Model):
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='diet_plans')
	created_at = models.DateTimeField(auto_now_add=True)
	title = models.CharField(max_length=200)
	description = models.TextField(blank=True)
	calories_per_day = models.PositiveIntegerField(null=True, blank=True)
	macros = models.JSONField(default=dict, blank=True)  # e.g., {protein, carbs, fats}

	class Meta:
		ordering = ['-created_at']

	def __str__(self):
		return f"DietPlan {self.user.email} - {self.title}"


class WorkoutPlan(models.Model):
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='workout_plans')
	created_at = models.DateTimeField(auto_now_add=True)
	title = models.CharField(max_length=200)
	description = models.TextField(blank=True)
	schedule = models.JSONField(default=dict, blank=True)  # e.g., days -> exercises

	class Meta:
		ordering = ['-created_at']

	def __str__(self):
		return f"WorkoutPlan {self.user.email} - {self.title}" 