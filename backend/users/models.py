from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils.translation import gettext_lazy as _


class UserManager(BaseUserManager):
	use_in_migrations = True

	def _create_user(self, email, password, **extra_fields):
		if not email:
			raise ValueError('El email es obligatorio')
		email = self.normalize_email(email)
		user = self.model(email=email, username=email, **extra_fields)
		user.set_password(password)
		user.save(using=self._db)
		return user

	def create_user(self, email, password=None, **extra_fields):
		extra_fields.setdefault('is_staff', False)
		extra_fields.setdefault('is_superuser', False)
		return self._create_user(email, password, **extra_fields)

	def create_superuser(self, email, password=None, **extra_fields):
		extra_fields.setdefault('is_staff', True)
		extra_fields.setdefault('is_superuser', True)
		if extra_fields.get('is_staff') is not True:
			raise ValueError('Superuser must have is_staff=True.')
		if extra_fields.get('is_superuser') is not True:
			raise ValueError('Superuser must have is_superuser=True.')
		return self._create_user(email, password, **extra_fields)


class User(AbstractUser):
	username = models.CharField(_('username'), max_length=150, unique=True)
	email = models.EmailField(_('email address'), unique=True)
	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = []

	objects = UserManager()

	def __str__(self):
		return self.email


class Profile(models.Model):
	GENDER_CHOICES = (
		('male', 'Male'),
		('female', 'Female'),
		('other', 'Other'),
	)
	user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
	first_name = models.CharField(max_length=100, blank=True)
	last_name = models.CharField(max_length=100, blank=True)
	birth_year = models.PositiveIntegerField(null=True, blank=True)
	age_year = models.PositiveIntegerField(null=True, blank=True)
	gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True)
	height_cm = models.PositiveIntegerField(null=True, blank=True)
	initial_weight_kg = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
	weight_kg = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
	body_type = models.CharField(max_length=50, blank=True)
	activity_level = models.CharField(max_length=50, blank=True)
	goal = models.CharField(max_length=100, blank=True)

	def __str__(self):
		return f"Perfil {self.user.email}"


class Survey(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='surveys')
	created_at = models.DateTimeField(auto_now_add=True)
	age_year = models.PositiveIntegerField(null=True, blank=True)
	height_cm = models.PositiveIntegerField(null=True, blank=True)
	weight_kg = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
	goal = models.CharField(max_length=100, blank=True)
	activity = models.CharField(max_length=100, blank=True)
	sex = models.CharField(max_length=10, blank=True)
	body_type = models.CharField(max_length=50, blank=True)
	data = models.JSONField(default=dict, blank=True)

	class Meta:
		ordering = ['-created_at']

	def __str__(self):
		return f"Survey {self.user.email} {self.created_at:%Y-%m-%d}" 