from django.contrib import admin
from .models import User, Profile, Survey

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
	list_display = ('id', 'email', 'is_active', 'is_staff')
	search_fields = ('email',)

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
	list_display = ('user', 'gender', 'height_cm', 'weight_kg', 'goal')
	search_fields = ('user__email',)

@admin.register(Survey)
class SurveyAdmin(admin.ModelAdmin):
	list_display = ('user', 'created_at', 'goal', 'activity')
	search_fields = ('user__email',) 