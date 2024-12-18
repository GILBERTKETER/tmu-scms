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
from academics.models import Instructor
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
import os
from django.conf import settings
from .utils import send_email
from .models import UserProfile
from academics.models import Enrollment
from django.contrib.auth.hashers import check_password, make_password
from academics.models import Program
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
        role = data.get('role', "student")

        username = admission.replace("/","").lower()
        yos = data.get('year_of_study', None)
        semester = data.get('semester', None)
        program = data.get('program', None)
        full_name = f"{first_name} {last_name}".strip()

       
                    
        if not all([first_name, last_name, admission, phone_number, password, cpassword, email]):
            return JsonResponse({"success":False,"message": "All required fields are missing."}, status=400)

        try:
            with transaction.atomic():
                if User.objects.filter(email=email).exists():
                    return JsonResponse({"success":False,"message": "Email is already registered."}, status=400)
                if password != cpassword:
                    return JsonResponse({"success":False,"message": "Passwords don't match. Please try again."}, status=401)
                if UserProfile.objects.filter(phone_number=phone_number).exists():
                    return JsonResponse({"success":False,"message": "Phone number is already registered."}, status=400)
                if UserProfile.objects.filter(admission=admission).exists():
                    return JsonResponse({"success":False,"message": "Admission number is already registered."}, status=400)

                user = User.objects.create_user(
                    username=username,
                    password=password,
                    email=email,
                    first_name=first_name,
                    last_name=last_name
                )
                

                user.userprofile.phone_number = phone_number
                user.userprofile.admission = admission
                user.userprofile.year_of_study = yos
                user.userprofile.semester = semester
                user.userprofile.program = program
                user.userprofile.full_name = full_name
                user.userprofile.role = role
                user.userprofile.email = email
                
                if role == 'lecturer':
                    instructor = Instructor.objects.create(user_id = user.id)
                    instructor.save()
                
                user.userprofile.save()
                
                login(request, user)
                html_content = render_to_string('signup.html', {'firstName': first_name})

                subject = 'Welcome to Tom Mboya Smart Campus Management System'
                send_email(subject, email, html_content)

            return JsonResponse({"success":True,"message": "You are successfully registered."}, status=201)

        except Exception as e:
            return JsonResponse({"success":False,"message": str(e)}, status=400)

    return JsonResponse({"success":False,"message": "Invalid request method."}, status=405)


@csrf_exempt
@require_http_methods(["POST"])
def user_login(request):
    data = json.loads(request.body)
    username = data.get('admission')
    password = data.get('password')

    if not username or not password:
        return JsonResponse({"message": "Username and password are required."}, status=400)
    
    user = authenticate(username=username.lower(), password=password)
    # print("user:", user)
    
    if user is not None:
        login(request, user)
        
        user_data = {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "phone_number": user.userprofile.phone_number,
            "admission": user.userprofile.admission,
            "programId": user.userprofile.program_id,
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
        
        user_profile = UserProfile.objects.get(user_id = user.id)
        user_year = user_profile.year_of_study
        user_sem = user_profile.semester
        user_prog = user_profile.program_id
        
        if user_year and user_sem and user_prog:
            enrollments = Enrollment.objects.filter(
            user=user, 
            semester=user_sem, 
            year=user_year, 
            # program_id=user_prog
        ).count()
        else:
            enrollments = 0
        
        user_data = {
            "courses_enrolled":enrollments,
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role":user.userprofile.role,
            "phone_number": user.userprofile.phone_number,
            "admission": user.userprofile.admission,
            "full_name":user.userprofile.full_name,
            "semester": user.userprofile.semester,
            "year_of_study": user.userprofile.year_of_study,
            "program":user.userprofile.program_id,
            'profile_image':user.userprofile.profile_image,
            'cover_image':user.userprofile.cover_image,
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
        users = UserProfile.objects.all().values()
        return JsonResponse({"success": True, "message": "These are the details", "data": list(users)}, status=200)        
    else:
        return JsonResponse({"success": False, "message": "You are not authenticated"}, status=403)
    
def get_all_admins(request):
    user = request.user
    if user.is_authenticated:
        admins = UserProfile.objects.filter(role="admin").values()
        return JsonResponse({"success": True, "message": "These are the details", "data": list(admins)}, status=200)
    else:
        return JsonResponse({"success": False, "message": "You are not authenticated"}, status=403)
    
@csrf_exempt  
def update_user(request):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            role = data.get('role')
            
            user = User.objects.get(email=email)
            profile = UserProfile.objects.get(email=email)
            user.email = email  
            user.save()
            profile.email = email
            profile.role = role
            profile.save()
            if role == 'lecturer':
                instructor = Instructor.objects.create(user_id = user.id)
                instructor.save()
            

            return JsonResponse({
                'success': True,
                'message': 'User updated successfully!'
            }, status=200)

        except User.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'User not found.'
            }, status=404)
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON data.'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': str(e)
            }, status=500)

    return JsonResponse({
        'success': False,
        'message': 'Only PUT requests are allowed.'
    }, status=405)
    
    
    
@csrf_exempt
def change_password(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        current_password = data.get('currentPassword')
        new_password = data.get('newPassword')
        confirm_new_password = data.get('confirmNewPassword')

        try:
            user = User.objects.get(email=email)
            
            # Check if the current password is correct
            if not check_password(current_password, user.password):
                return JsonResponse({'success': False, 'message': 'Current password is incorrect.'}, status=400)

            # Check if new passwords match
            if new_password != confirm_new_password:
                return JsonResponse({'success': False, 'message': 'New passwords do not match.'}, status=400)

            # Set new password and save
            user.set_password(new_password)
            user.save()

            return JsonResponse({'success': True, 'message': 'Password successfully updated!'}, status=200)
            
        except User.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'User not found.'}, status=404)
    return JsonResponse({'success': False, 'message': 'Invalid request method.'}, status=405)


@csrf_exempt
def change_email(request):
    user = request.user
    if user.is_authenticated:
        if request.method == 'POST':
            data = json.loads(request.body)
            email = data.get('currentEmail')
            new_email = data.get('newEmail')
            user = User.objects.get(email=email)
            profile = UserProfile.objects.get(email=email)

            try:
                user.email = new_email
                profile.email = new_email
                user.save()
                profile.save()
                return JsonResponse({"success":True, "message":"Your email has been updated successfully."}, status=200)
            except user.DoesNotExist:
                return JsonResponse({"success":False, "message":"The email is not on our records."}, status=404)

        else:
            return JsonResponse({"success":False, "message":"Invalid request method."}, status=405)
    else:
        return JsonResponse({"success":False, "message":"You are not aauthenticated."}, status=403)
    
@csrf_exempt
def change_phone(request):
    user = request.user
    if user.is_authenticated:
        if request.method == 'POST':
            data = json.loads(request.body)
            email = data.get('currentEmail')
            phone_number = data.get('phoneNumber')
            user = User.objects.get(email=email)
            profile = UserProfile.objects.get(email=email)

            try:
                profile.phone_number = phone_number
                profile.save()
                return JsonResponse({"success":True, "message":"Your phone number has been updated successfully."}, status=200)
            except user.DoesNotExist:
                return JsonResponse({"success":False, "message":"You are not on our records."}, status=404)

        else:
            return JsonResponse({"success":False, "message":"Invalid request method."}, status=405)
    else:
        return JsonResponse({"success":False, "message":"You are not aauthenticated."}, status=403)
    

@csrf_exempt
def edit_details(request):
    user = request.user
    data = json.loads(request.body)
    if not user.is_authenticated:
        return JsonResponse({"success":False, "message":"You are not authenticated."}, status=401)
    if request.method != 'PUT':
        return JsonResponse({"success":False, "message":"Invalid request method."}, status=405)
    role = user.userprofile.role
    
    if role == 'lecturer':
        semester = data.get('semester')
        if not semester:
            return JsonResponse({"success":False, "message":"All fields are required."}, status = 403)
        user_profile = UserProfile.objects.get(user_id = user.id)
        user_profile.semester = semester
        user_profile.save()
        return JsonResponse({"success":True, "message":"Your details have beeen updated."}, status=200)
    elif role == 'student' or role == 'classrep':
        semester = data.get('semester')
        year = data.get("year")
        if not all([semester, year]):
            return JsonResponse({"success":False, "message":"All fields are required."}, status = 403)
        user_profile = UserProfile.objects.get(user_id = user.id)
        user_profile.semester = semester
        user_profile.year_of_study = year
        user_profile.save()
        return JsonResponse({"success":True, "message":"Your details have beeen updated."}, status=200)
    else:
        return JsonResponse({"success":False, "message":"Invalid user role."}, status=404)


@csrf_exempt
def complete_user_details(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({"success": False, "message": "You are not authenticated."}, status=401)
    
    if request.method != 'POST':
        return JsonResponse({"success": False, "message": "Invalid request method."}, status=405)

    user_profile = UserProfile.objects.get(user_id=user.id)
    data = json.loads(request.body)
    program_id = data.get('program')
    semester = data.get('semester')
    year = data.get('yearOfStudy')

    # Check if all required fields are provided
    if not all([program_id, semester, year]):
        return JsonResponse({"success": False, "message": "All fields are required."}, status=400)

    # Update the user profile fields
    user_profile.program_id = program_id
    user_profile.year_of_study = year
    user_profile.semester = semester
    user_profile.program = Program.objects.get(id = program_id).name
    user_profile.save()  # Save the updates

    return JsonResponse({"success": True, "message": "Profile updated successfully."}, status=200)