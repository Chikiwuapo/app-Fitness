from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import User, Profile, Survey


class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ['id', 'email', 'first_name']


class RegisterSerializer(serializers.ModelSerializer):
	password = serializers.CharField(write_only=True, min_length=8)
	name = serializers.CharField(write_only=True, required=False, allow_blank=True)

	class Meta:
		model = User
		fields = ['email', 'password', 'name']

	def create(self, validated_data):
		name = validated_data.pop('name', '').strip()
		user = User.objects.create_user(**validated_data)
		if name:
			user.first_name = name
			user.save(update_fields=['first_name'])
		Profile.objects.create(user=user, first_name=name or '')
		return user


class LoginSerializer(serializers.Serializer):
	email = serializers.EmailField()
	password = serializers.CharField(write_only=True)

	def validate(self, attrs):
		email = attrs.get('email')
		password = attrs.get('password')
		user = authenticate(email=email, password=password)
		if not user:
			raise serializers.ValidationError('Credenciales inválidas')
		attrs['user'] = user
		return attrs


class ProfileSerializer(serializers.ModelSerializer):
	user = UserSerializer(read_only=True)
	# Validation constraints per form requirements
	age_year = serializers.IntegerField(min_value=10, max_value=120, required=False, allow_null=True)
	height_cm = serializers.IntegerField(min_value=50, max_value=300, required=False, allow_null=True)
	weight_kg = serializers.DecimalField(max_digits=5, decimal_places=2, min_value=1, max_value=500, required=False, allow_null=True)
	initial_weight_kg = serializers.DecimalField(max_digits=5, decimal_places=2, min_value=1, max_value=500, required=False, allow_null=True)
	gender = serializers.ChoiceField(choices=[('male','Male'), ('female','Female'), ('other','Other')], required=False, allow_null=True)

	class Meta:
		model = Profile
		fields = [
			'user', 'first_name', 'last_name', 'birth_year', 'gender',
			'height_cm', 'initial_weight_kg', 'weight_kg', 'body_type', 'activity_level', 'goal', 'age_year',
		]


class SurveySerializer(serializers.ModelSerializer):
	# Apply same validation rules so questionnaire respects constraints
	age_year = serializers.IntegerField(min_value=10, max_value=120, required=False, allow_null=True)
	height_cm = serializers.IntegerField(min_value=50, max_value=300, required=False, allow_null=True)
	weight_kg = serializers.DecimalField(max_digits=5, decimal_places=2, min_value=1, max_value=500, required=False, allow_null=True)
	sex = serializers.ChoiceField(choices=[('male','Male'), ('female','Female'), ('other','Other')], required=False, allow_null=True)

	class Meta:
		model = Survey
		fields = [
			'id', 'user', 'created_at', 'age_year', 'height_cm', 'weight_kg',
			'goal', 'activity', 'sex', 'body_type', 'data'
		]
		read_only_fields = ['id', 'user', 'created_at']