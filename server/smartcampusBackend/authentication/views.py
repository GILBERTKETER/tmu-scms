from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
import json
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str

from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.middleware.csrf import get_token
from .models import UserProfile  
from django.db import transaction
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods

from django.urls import reverse
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.template.loader import render_to_string
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import EmailMessage

@csrf_exempt
def user_registration(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        first_name = data.get('firstName')
        last_name = data.get('lastName')
        admission = data.get('admission')
        phone_number = data.get('phone')
        password = data.get('password')
        email = data.get('email')
        cpassword = data.get('cpassword')

        if not all([first_name, last_name, admission, phone_number, password,cpassword, email]):
            return JsonResponse({"message": "All fields are required."}, status=400)

        try:
            with transaction.atomic():
                if User.objects.filter(email=email).exists():
                    return JsonResponse({"message": "Email is already registered."}, status=400)
                if password != cpassword: return JsonResponse({"message":"Passwords don't match. Please try again."}, status=401)
                if UserProfile.objects.filter(phone_number=phone_number).exists():
                    return JsonResponse({"message": "Phone number is already registered."}, status=400)

                if UserProfile.objects.filter(admission=admission).exists():
                    return JsonResponse({"message": "Admission number is already registered."}, status=400)

                user = User.objects.create_user(
                    username=email,
                    password=password,
                    email=email,
                    first_name=first_name,
                    last_name=last_name
                )

                user.userprofile.phone_number = phone_number
                user.userprofile.admission = admission
                user.userprofile.save()

                login(request, user)

            return JsonResponse({"message": "User registered and logged in successfully."}, status=201)

        except Exception as e:
            return JsonResponse({"message": str(e)}, status=400)

    return JsonResponse({"message": "Invalid request method."}, status=405)

@csrf_exempt
@require_http_methods(["POST"])
def user_login(request):
    data = json.loads(request.body)
    username = data.get('email')
    password = data.get('password')

    if not username or not password:
        return JsonResponse({"message": "Username and password are required."}, status=400)

    user = authenticate(username=username, password=password)

    if user is not None:
        login(request, user)
        
        user_data = {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "phone_number": user.userprofile.phone_number,
            "admission": user.userprofile.admission
        }
        
        response = JsonResponse({
            "message": "User logged in successfully.",
            "user": user_data,
            "logged": True,
        }, status=200)
        
        # Set session cookie
        response.set_cookie('sessionid', request.session.session_key, httponly=True, samesite='Lax')
        
        return response
    else:
        return JsonResponse({"message": "Invalid credentials."}, status=401)

@csrf_exempt
@require_http_methods(["POST"])
def user_logout(request):
    logout(request)
    response = JsonResponse({"message": "Logged out successfully"})
    response.delete_cookie('sessionid')
    return response
@csrf_exempt
@login_required
@require_http_methods(["GET"])
def get_user(request):
    user = request.user
    if user.is_authenticated:
        user_data = {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "phone_number": user.userprofile.phone_number,
            "admission": user.userprofile.admission
        }
        return JsonResponse({"user": user_data})
    else:
        return JsonResponse({"user": None}, status=401)
   
   
@csrf_exempt
def request_password_reset_link(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        user = User.objects.filter(email=email).first()
        if user is None:
            return JsonResponse({'message': 'Email does not exist', "success": False}, status=400)

        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        reset_url = f"http://localhost:3000/auth/reset-password/?uid={uid}&token={token}"

        # Here you would send the reset_url via email

        return JsonResponse({'reset_url': reset_url, "success": True}, status=200)

    return JsonResponse({'message': 'Invalid request method.', "success": False}, status=400)

@csrf_exempt
def reset_password(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        token = data.get('token')
        new_password = data.get('new_password')
        uidb64 = data.get('uid')
        confirmPassword = data.get('confimPassword')

        if (new_password != confirmPassword):
            return JsonResponse({'message':'Passwords do not match. try again.', 'success':False}, status=401)
        if not all([token, new_password, uidb64]):
            return JsonResponse({'message': 'There is an error with your link', "success": False}, status=400)

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)

            # Log the tokens for debugging
            print(f"Generated Token: {token}")
            if default_token_generator.check_token(user, token):
                user.set_password(new_password)
                user.save()
                return JsonResponse({'message': 'Password has been reset successfully', "success": True}, status=200)
            else:
                return JsonResponse({'message': 'Invalid token', "success": False}, status=400)

        except (User.DoesNotExist, ValidationError):
            return JsonResponse({'message': 'Invalid UID', "success": False}, status=400)

    return JsonResponse({'message': 'Invalid request method.', "success": False}, status=400)