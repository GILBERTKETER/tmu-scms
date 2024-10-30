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

from django.core.mail import EmailMessage
from django.template.loader import render_to_string
import os
from django.conf import settings
from .utils import send_email
from .models import UserProfile
@csrf_exempt
def user_registration(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        # Required fields
        first_name = data.get('firstName', "")
        last_name = data.get('lastName', "")
        admission = data.get('admission')
        phone_number = data.get('phone')
        password = data.get('password')
        email = data.get('email')
        cpassword = data.get('cpassword')
        role = data.get('role', None)

        # Optional fields
        yos = data.get('yos', None)
        semester = data.get('semester', None)
        program = data.get('program', None)
        full_name = f"{first_name} {last_name}".strip()

        # Check for required fields
        if not all([first_name, last_name, admission, phone_number, password, cpassword, email]):
            return JsonResponse({"success":False,"message": "All required fields are missing."}, status=400)

        try:
            with transaction.atomic():
                # Check if the user with email, phone, or admission already exists
                if User.objects.filter(email=email).exists():
                    return JsonResponse({"success":False,"message": "Email is already registered."}, status=400)
                if password != cpassword:
                    return JsonResponse({"success":False,"message": "Passwords don't match. Please try again."}, status=401)
                if UserProfile.objects.filter(phone_number=phone_number).exists():
                    return JsonResponse({"success":False,"message": "Phone number is already registered."}, status=400)
                if UserProfile.objects.filter(admission=admission).exists():
                    return JsonResponse({"success":False,"message": "Admission number is already registered."}, status=400)

                # Create the user and user profile
                user = User.objects.create_user(
                    username=email,
                    password=password,
                    email=email,
                    first_name=first_name,
                    last_name=last_name
                )

                # Assign profile details, handling optional fields
                user.userprofile.phone_number = phone_number
                user.userprofile.admission = admission
                user.userprofile.year_of_study = yos
                user.userprofile.semester = semester
                user.userprofile.program = program
                user.userprofile.full_name = full_name
                user.userprofile.role = role
                
                user.userprofile.save()

                # Log the user in and send welcome email
                login(request, user)
                html_content = render_to_string('signup.html', {'firstName': first_name})

                subject = 'Welcome to Tom Mboya Smart Campus Management System'
                send_email(subject, email, html_content)

            return JsonResponse({"success":True,"message": "You are successfully registered."}, status=201)

        except Exception as e:
            return JsonResponse({"success":False,"message": str(e)}, status=400)

    return JsonResponse({"success":False,"message": "Invalid request method."}, status=405)
# def user_registration(request):
#     if request.method == 'POST':
#         data = json.loads(request.body)

#         first_name = data.get('firstName')
#         last_name = data.get('lastName')
#         admission = data.get('admission')
#         phone_number = data.get('phone')
#         password = data.get('password')
#         email = data.get('email')
#         cpassword = data.get('cpassword')
#         role = data.get('role')
        
#         yos = data.get('yos')
#         semester = data.get('semester')
#         program = data.get('program')
#         full_name = first_name + last_name

#         if not all([first_name, last_name, admission, phone_number, password,cpassword, email]):
#             return JsonResponse({"message": "All fields are required."}, status=400)

#         try:
#             with transaction.atomic():
#                 if User.objects.filter(email=email).exists():
#                     return JsonResponse({"message": "Email is already registered."}, status=400)
#                 if password != cpassword: return JsonResponse({"message":"Passwords don't match. Please try again."}, status=401)
#                 if UserProfile.objects.filter(phone_number=phone_number).exists():
#                     return JsonResponse({"message": "Phone number is already registered."}, status=400)

#                 if UserProfile.objects.filter(admission=admission).exists():
#                     return JsonResponse({"message": "Admission number is already registered."}, status=400)

#                 user = User.objects.create_user(
#                     username=email,
#                     password=password,
#                     email=email,
#                     first_name=first_name,
#                     last_name=last_name
#                 )

#                 user.userprofile.phone_number = phone_number
#                 user.userprofile.admission = admission
#                 user.userprofile.year_of_study = yos
#                 user.userprofile.semester = semester
#                 user.userprofile.program = program
#                 user.userprofile.full_name = full_name
#                 user.userprofile.role = role
                
#                 user.userprofile.save()

#                 login(request, user)
#                 html_content = render_to_string('signup.html',{'firstName': first_name})

#                 subject = 'Welcome to Tom Mboya Smart Campus Management System'
#                 send_email(subject, email, html_content)
                
#             return JsonResponse({"message": "You are successfully registered."}, status=201)

#         except Exception as e:
#             return JsonResponse({"message": str(e)}, status=400)

#     return JsonResponse({"message": "Invalid request method."}, status=405)

@csrf_exempt
@require_http_methods(["POST"])
def user_login(request):
    data = json.loads(request.body)
    username = data.get('email')
    password = data.get('password')

    if not username or not password:
        return JsonResponse({"message": "Username and password are required."}, status=400)
    print("user:", username)
    print("password:", password)
    user = authenticate(username=username, password=password)
    print("user:", user)
    
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
        response.set_cookie('sessionid', request.session.session_key)
        
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
            "admission": user.userprofile.admission,
            "full_name":user.userprofile.full_name,
            "semester": user.userprofile.semester,
            "year_of_study": user.userprofile.year_of_study,
            "program":user.userprofile.program
        }
        return JsonResponse({"success":True,"user": user_data})
    else:
        return JsonResponse({"success":False,"user": None}, status=401)
   
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

        html_content = render_to_string('index.html', {'reset_url': reset_url})

        subject = 'Password Reset Request'
        send_email(subject, email, html_content)

        return JsonResponse({'message': 'Password reset link has been sent to your email.', "success": True}, status=200)

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
            email = user.email
            if default_token_generator.check_token(user, token):
                user.set_password(new_password)
                user.save()
                html_content = render_to_string('confirmation.html')

                subject = 'Password Reset Confirmation'
                send_email(subject, email, html_content)
                
                return JsonResponse({'message': 'Password has been reset successfully', "success": True}, status=200)
            else:
                return JsonResponse({'message': 'Invalid token', "success": False}, status=400)

        except (User.DoesNotExist, ValidationError):
            return JsonResponse({'message': 'Invalid UID', "success": False}, status=400)

    return JsonResponse({'message': 'Invalid request method.', "success": False}, status=400)


def get_users_count(request):
    user = request.user
    if user.is_authenticated:
        students = UserProfile.objects.filter(role="student").count()
        admins = UserProfile.objects.filter(role="admin").count()
        class_reps = UserProfile.objects.filter(role="representative").count()
        lecturers = UserProfile.objects.filter(role="lecturer").count()
        
        data = {
            "students": students,
            "admins": admins,
            "class_reps": class_reps,
            "lecturers": lecturers,
        }
        
        return JsonResponse({"success": True, "message": "These are the details", "data": data}, status=200)
    else:
        return JsonResponse({"success": False, "message": "You are not authenticated"}, status=403)
    
    
    
def get_all_users(request):
    user = request.user
    if user.is_authenticated:
        users = UserProfile.objects.all().values()  # Fetches all users and converts them to a list of dictionaries
        return JsonResponse({"success": True, "message": "These are the details", "data": list(users)}, status=200)        
    else:
        return JsonResponse({"success": False, "message": "You are not authenticated"}, status=403)