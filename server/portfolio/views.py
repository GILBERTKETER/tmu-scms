from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json
from .models import PersonalInfo, Skill, Experience, Education, Project, SocialMedia
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings


@login_required
@csrf_exempt
@require_http_methods(["POST"])
def handle_portfolio(request):
    try:
        data = json.loads(request.body)
        user = request.user


        # Handle Personal Info
        personal_info_data = data.get('personalInfo', {})
        personal_info, created = PersonalInfo.objects.update_or_create(
            user=user,
            defaults={
                'full_name': personal_info_data.get('fullName'),
                'email': personal_info_data.get('email'),
                'phone': personal_info_data.get('phone'),
                'location': personal_info_data.get('location'),
                'summary': personal_info_data.get('summary'),
            }
        )

        # Handle Skills
        Skill.objects.filter(user=user).delete()
        skills_data = data.get('skills', [])
        for skill_name in skills_data:
            Skill.objects.create(user=user, name=skill_name)

        # Handle Experiences
        Experience.objects.filter(user=user).delete()
        experiences_data = data.get('experiences', [])
        for exp_data in experiences_data:
            Experience.objects.create(
                user=user,
                company=exp_data.get('company'),
                position=exp_data.get('position'),
                duration=exp_data.get('duration'),
                description=exp_data.get('description')
            )

        # Handle Education
        Education.objects.filter(user=user).delete()
        education_data = data.get('education', [])
        for edu_data in education_data:
            Education.objects.create(
                user=user,
                institution=edu_data.get('institution'),
                degree=edu_data.get('degree'),
                year=edu_data.get('year'),
                gpa=edu_data.get('gpa')
            )

        # Handle Projects
        Project.objects.filter(user=user).delete()
        projects_data = data.get('projects', [])
        for proj_data in projects_data:
            Project.objects.create(
                user=user,
                name=proj_data.get('name'),
                description=proj_data.get('description'),
                technologies=proj_data.get('technologies'),
                link=proj_data.get('link')
            )

        # Handle Social Media
        SocialMedia.objects.filter(user=user).delete()
        social_media_data = data.get('socialMedia', [])
        for social_data in social_media_data:
            SocialMedia.objects.create(
                user=user,
                platform=social_data.get('platform'),
                username=social_data.get('username'),
                url=social_data.get('url'),
                description=social_data.get('description')
            )

        return JsonResponse({
            'status': 'success',
            'message': 'Portfolio saved successfully'
        })

    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)


@csrf_exempt
def upload_image(request):
    if request.method == 'POST' and request.FILES.get('file'):
        file = request.FILES['file']
        filename = request.POST.get('filename')
        file_type = request.POST.get('type') 
        user_id = request.POST.get('id')
        
        try:
            profile_user = PersonalInfo.objects.get(user_id=user_id)
        except PersonalInfo.DoesNotExist:
            return JsonResponse({'message': 'User not found'}, status=404)
        
        file_path = f'{filename}'
        if default_storage.exists(file_path):
            default_storage.delete(file_path) 
        
        saved_file_path = default_storage.save(file_path, ContentFile(file.read()))
        
        if file_type == 'profile':
            profile_user.profile_image = saved_file_path
        elif file_type == 'cover':
            profile_user.cover_image = saved_file_path
        else:
            return JsonResponse({'message': 'Invalid file type'}, status=400)

        profile_user.save() 

        file_url = f"{settings.MEDIA_URL}{saved_file_path}"
        return JsonResponse({'message': 'File uploaded successfully', 'file_url': file_url}, status=200)
    
    return JsonResponse({'message': 'No file provided'}, status=400)

@login_required
@csrf_exempt
@require_http_methods(["GET"])
def get_portfolio(request):
    try:
        user = request.user
        
        # Fetch all portfolio data
        personal_info = PersonalInfo.objects.filter(user=user).first()
        skills = Skill.objects.filter(user=user)
        experiences = Experience.objects.filter(user=user)
        education = Education.objects.filter(user=user)
        projects = Project.objects.filter(user=user)
        social_media = SocialMedia.objects.filter(user=user)

        # Format response
        portfolio_data = {
            'personalInfo': {
                'fullName': personal_info.full_name if personal_info else '',
                'email': personal_info.email if personal_info else '',
                'phone': personal_info.phone if personal_info else '',
                'location': personal_info.location if personal_info else '',
                'summary': personal_info.summary if personal_info else '',
                'profile_image': personal_info.profile_image if personal_info else '',
                'cover_image': personal_info.cover_image if personal_info else '',
            },
            'skills': [skill.name for skill in skills],
            'experiences': [{
                'company': exp.company,
                'position': exp.position,
                'duration': exp.duration,
                'description': exp.description
            } for exp in experiences],
            'education': [{
                'institution': edu.institution,
                'degree': edu.degree,
                'year': edu.year,
                'gpa': edu.gpa
            } for edu in education],
            'projects': [{
                'name': proj.name,
                'description': proj.description,
                'technologies': proj.technologies,
                'link': proj.link
            } for proj in projects],
            'socialMedia': [{
                'platform': social.platform,
                'username': social.username,
                'url': social.url,
                'description': social.description
            } for social in social_media]
        }

        return JsonResponse({
            'status': 'success',
            'data': portfolio_data
        })

    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)