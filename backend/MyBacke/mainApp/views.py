from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth import authenticate, login, logout
# Create your views here.

@api_view(['GET'])
def sample_data(request):
    data = {"message": "Hello from Django"}
    return Response(data)



@csrf_exempt
def register_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        confirm_password = data.get('confirm_password')

        if password != confirm_password:
            return JsonResponse({'error': 'Passwords do not match'}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Username already exists'}, status=400)

        if User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Email already exists'}, status=400)

        user = User.objects.create(
            username=username,
            email=email,
            password=make_password(password)
        )
        return JsonResponse({'message': 'User registered successfully'})
    return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            # Fetch the user_id after successful login
            user_id = user.id
            return JsonResponse({'message': 'Login successful', 'user_id': user_id})
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)
    return JsonResponse({'error': 'Invalid request method'}, status=405)


def logout_user(request):
    logout(request)
    return JsonResponse({'message': 'Logout successful'})


def get_user_by_id(request, user_id):
    try:
        # Retrieve user by user_id
        user = User.objects.get(id=user_id)
        return JsonResponse({
            'username': user.username,
            'email': user.email,
            'user_id': user.id
        })
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)