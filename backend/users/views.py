from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.forms import PasswordResetForm
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, generics
from .models import User, Profile, Survey
from .serializers import RegisterSerializer, UserSerializer, ProfileSerializer, SurveySerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_account(request):
    user = request.user
    user.delete()
    return Response({'detail': 'Cuenta eliminada exitosamente'}, status=status.HTTP_200_OK)


@api_view(['GET'])
def me(request):
    return Response(UserSerializer(request.user).data)


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer

    def get_object(self):
        profile, _ = Profile.objects.get_or_create(user=self.request.user)
        return profile


@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_request(request):
    form = PasswordResetForm(data={'email': request.data.get('email')})
    if form.is_valid():
        # In real implementation, email would be sent here
        return Response({'detail': 'Si el correo existe, se enviarán instrucciones de recuperación.'})
    return Response({'detail': 'Email inválido.'}, status=status.HTTP_400_BAD_REQUEST)


class SurveyListCreateView(generics.ListCreateAPIView):
    serializer_class = SurveySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Survey.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        # Validate and create Survey
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        survey = serializer.save(user=request.user)

        # Map survey fields to profile fields
        profile, _ = Profile.objects.get_or_create(user=request.user)
        profile_payload = {}
        mapping = {
            'age_year': 'age_year',
            'height_cm': 'height_cm',
            'weight_kg': 'weight_kg',
            'sex': 'gender',
            'body_type': 'body_type',
            'activity': 'activity_level',
            'goal': 'goal',
        }
        for s_key, p_key in mapping.items():
            val = serializer.validated_data.get(s_key)
            if val is not None:
                profile_payload[p_key] = val

        # Validate and save Profile updates using ProfileSerializer constraints
        if profile_payload:
            p_ser = ProfileSerializer(instance=profile, data=profile_payload, partial=True)
            p_ser.is_valid(raise_exception=True)
            profile = p_ser.save()

        # Prepare response with both saved resources
        headers = self.get_success_headers(serializer.data)
        return Response({
            'survey': SurveySerializer(survey).data,
            'profile': ProfileSerializer(profile).data,
        }, status=status.HTTP_201_CREATED, headers=headers)