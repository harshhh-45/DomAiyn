from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from django.utils import timezone
from django.conf import settings
from django.http import JsonResponse
from django.db.models import Q, Count
from django.db import connection, OperationalError
from django.db.models.functions import TruncDate
from django.views.decorators.csrf import csrf_exempt
from datetime import timedelta
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import json

from .forms import RegisterForm
from .models import PasswordResetOTP, ContactMessage, EmailVerificationOTP
from .utils import check_sql_injection
from .emails import (
    send_email_verification_otp,
    send_password_reset_otp,
    send_welcome_email,
    send_admin_new_signup_notification,
)

User = get_user_model()


def role_required(*roles):
    def decorator(view_func):
        def wrapper(request, *args, **kwargs):
            if not request.user.is_authenticated:
                return redirect('login')
            if request.user.role not in roles:
                messages.error(request, 'Access denied. Insufficient permissions.')
                return redirect('home')
            return view_func(request, *args, **kwargs)
        wrapper.__name__ = view_func.__name__
        return wrapper
    return decorator


def forgot_password(request):
    if request.method == 'POST':
        email = request.POST.get('email', '').strip()
        try:
            user = User.objects.get(email=email)
            otp_code = get_random_string(length=6, allowed_chars='0123456789')
            PasswordResetOTP.objects.filter(user=user).delete()
            PasswordResetOTP.objects.create(user=user, otp=otp_code)
            send_password_reset_otp.delay(email, otp_code, user.username)
            request.session['reset_user'] = user.id
            request.session['otp_verified'] = False
            messages.success(request, f'OTP sent to {email}. Check your inbox.')
            return redirect('verify_otp')
        except User.DoesNotExist:
            messages.error(request, 'No account found with that email address.')
    return render(request, 'forgot_password.html')


def verify_otp(request):
    if request.method == 'POST':
        entered_otp = request.POST.get('otp', '').strip()
        user_id = request.session.get('reset_user')
        if not user_id:
            return redirect('login')

        attempts = request.session.get('otp_attempts', 0)
        if attempts >= 5:
            messages.error(request, 'Too many incorrect attempts. Please restart the process.')
            request.session.pop('reset_user', None)
            request.session.pop('otp_attempts', None)
            request.session.pop('otp_verified', None)
            return redirect('forgot_password')

        otp_obj = PasswordResetOTP.objects.filter(user_id=user_id, otp=entered_otp).last()
        if otp_obj and otp_obj.is_valid():
            request.session.pop('otp_attempts', None)
            request.session['otp_verified'] = True
            messages.success(request, 'OTP verified. Set your new password.')
            return redirect('reset_password')
        else:
            request.session['otp_attempts'] = attempts + 1
            messages.error(request, 'Invalid or expired OTP. Try again.')
    return render(request, 'verify_otp.html')


def reset_password(request):
    user_id = request.session.get('reset_user')
    otp_verified = request.session.get('otp_verified', False)
    if not user_id or not otp_verified:
        return redirect('login')
    if request.method == 'POST':
        password = request.POST.get('password', '')
        user = User.objects.get(id=user_id)
        user.set_password(password)
        user.save()
        request.session.pop('reset_user', None)
        request.session.pop('otp_verified', None)
        messages.success(request, 'Password reset successful. Please login.')
        return redirect('login')
    return render(request, 'reset_password.html')


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_api(request):
    return Response({'message': 'Authenticated', 'role': request.user.role})

def health_check(request):
    status = "ok"
    db_status = "ok"
    try:
        connection.ensure_connection()
    except OperationalError:
        status = "error"
        db_status = "error"
    return JsonResponse({"status": status, "db": db_status})


def auth_status(request):
    if request.user.is_authenticated:
        return JsonResponse({
            'logged_in': True,
            'username': request.user.username,
            'is_staff': request.user.is_staff,
        })
    return JsonResponse({'logged_in': False})


@csrf_exempt
def contact_submit(request):
    if request.method != 'POST':
        return JsonResponse({'success': False, 'error': 'Method not allowed'}, status=405)
    try:
        data = json.loads(request.body)
    except (json.JSONDecodeError, ValueError):
        return JsonResponse({'success': False, 'error': 'Invalid JSON'}, status=400)

    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    phone = data.get('phone', '').strip()
    subject = data.get('subject', '').strip()
    message = data.get('message', '').strip()

    if not all([name, email, subject, message]):
        return JsonResponse({'success': False, 'error': 'Name, email, subject and message are required.'}, status=400)

    ContactMessage.objects.create(name=name, email=email, phone=phone, subject=subject, message=message)
    return JsonResponse({'success': True, 'message': 'Thank you! We will get back to you soon.'})


def register_view(request):
    if request.user.is_authenticated:
        return redirect('home')
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            email = form.cleaned_data['email']
            temp_user = form.save(commit=False)
            hashed_password = temp_user.password

            otp_code = get_random_string(length=6, allowed_chars='0123456789')
            EmailVerificationOTP.objects.filter(email=email).delete()
            EmailVerificationOTP.objects.create(
                email=email,
                otp=otp_code,
                pending_username=username,
                pending_password=hashed_password,
            )
            request.session['pending_email'] = email
            send_email_verification_otp.delay(email, otp_code, username)
            messages.success(request, f'A 6-digit OTP has been sent to {email}.')
            return redirect('verify_email_otp')
    else:
        form = RegisterForm()
    return render(request, 'register.html', {'form': form})


def verify_email_otp(request):
    email = request.session.get('pending_email')
    if not email:
        messages.error(request, 'Session expired. Please register again.')
        return redirect('register')

    if request.method == 'POST':
        entered_otp = request.POST.get('otp', '').strip()
        otp_obj = EmailVerificationOTP.objects.filter(email=email).last()

        if not otp_obj or not otp_obj.is_valid():
            messages.error(request, 'OTP has expired. Please register again.')
            EmailVerificationOTP.objects.filter(email=email).delete()
            del request.session['pending_email']
            return redirect('register')

        if otp_obj.otp != entered_otp:
            messages.error(request, 'Incorrect OTP. Please try again.')
            return render(request, 'verify_email_otp.html', {'email': email})

        user = User(
            username=otp_obj.pending_username,
            email=email,
            password=otp_obj.pending_password,
        )
        user.save()
        otp_obj.delete()
        del request.session['pending_email']

        login(request, user, backend='django.contrib.auth.backends.ModelBackend')
        send_welcome_email.delay(email, user.username)
        send_admin_new_signup_notification.delay(user.username, email)
        messages.success(request, f'Welcome, {user.username}! Your account is ready.')
        return redirect('home')

    return render(request, 'verify_email_otp.html', {'email': email})


def login_view(request):
    if request.user.is_authenticated:
        next_url = request.GET.get('next', '')
        if next_url and next_url.startswith('/'):
            return redirect(next_url)
        return redirect('home')
    if request.method == 'POST':
        login_input = request.POST.get('username', '').strip()[:150]
        password = request.POST.get('password', '')
        next_url = request.POST.get('next', '').strip()

        if not login_input or not password:
            messages.error(request, 'Username/Email and password are required.')
        elif len(password) > 128:
            messages.error(request, 'Invalid input.')
        else:
            try:
                check_sql_injection(login_input, 'Username/Email')
            except ValidationError as e:
                messages.error(request, e.messages[0])
                return render(request, 'login.html', {'next': next_url})

            user_to_auth = User.objects.filter(Q(username=login_input) | Q(email=login_input)).first()
            user = authenticate(request, username=user_to_auth.username, password=password) if user_to_auth else None

            if user is not None:
                if not user.is_active:
                    messages.error(request, 'Your account has been disabled. Contact support.')
                else:
                    login(request, user)
                    # Respect ?next= param — only allow internal URLs for safety
                    if next_url and next_url.startswith('/'):
                        return redirect(next_url)
                    return redirect('home')
            else:
                messages.error(request, 'Invalid username/email or password.')
    next_url = request.GET.get('next', '')
    return render(request, 'login.html', {'next': next_url})


def home_view(request):
    return render(request, 'home_v2.html', {'site_url': settings.SITE_URL})


def logout_view(request):
    logout(request)
    return redirect(settings.SITE_URL)


@role_required('admin', 'superadmin')
def admin_dashboard(request):
    ctx = {
        'total_users': User.objects.count(),
        'new_users': User.objects.filter(date_joined__gte=timezone.now() - timedelta(days=7)).count(),
        'total_contacts': ContactMessage.objects.count(),
        'unread_contacts': ContactMessage.objects.filter(is_read=False).count(),
        'staff_count': User.objects.filter(role__in=['admin', 'superadmin']).count(),
        'recent_users': User.objects.order_by('-date_joined')[:5],
        'recent_contacts': ContactMessage.objects.order_by('-created_at')[:5],
    }
    return render(request, 'dashboard/index.html', ctx)


@role_required('admin', 'superadmin')
def admin_users(request):
    users = User.objects.all().order_by('-date_joined')
    return render(request, 'dashboard/users.html', {'users': users})


@role_required('admin', 'superadmin')
def admin_user_edit(request, user_id):
    user = get_object_or_404(User, id=user_id)
    if user.is_admin and not request.user.is_superadmin:
        messages.error(request, 'Only superadmins can edit admin accounts.')
        return redirect('admin_users')
    if request.method == 'POST':
        try:
            check_sql_injection(request.POST.get('username', ''), 'Username')
            check_sql_injection(request.POST.get('email', ''), 'Email')
            check_sql_injection(request.POST.get('first_name', ''), 'First Name')
            check_sql_injection(request.POST.get('last_name', ''), 'Last Name')

            user.username = request.POST.get('username', user.username)
            user.email = request.POST.get('email', user.email)
            user.first_name = request.POST.get('first_name', user.first_name)
            user.last_name = request.POST.get('last_name', user.last_name)
            user.is_active = request.POST.get('is_active') == 'on'

            if request.user.is_superadmin:
                new_role = request.POST.get('role', user.role)
                user.role = new_role
                user.is_staff = new_role in ('admin', 'superadmin')

            user.full_clean()
            user.save()
            messages.success(request, f'User {user.username} updated.')
            return redirect('admin_users')
        except ValidationError as e:
            messages.error(request, f'Error updating user: {e}')
    return render(request, 'dashboard/user_edit.html', {'u': user})


@role_required('admin', 'superadmin')
def admin_user_delete(request, user_id):
    user = get_object_or_404(User, id=user_id)
    if request.method == 'POST':
        if user == request.user:
            messages.error(request, 'You cannot delete your own account.')
            return redirect('admin_users')
        username = user.username
        user.delete()
        messages.success(request, f'User {username} deleted.')
    return redirect('admin_users')


@role_required('admin', 'superadmin')
def admin_contacts(request):
    contacts = ContactMessage.objects.all().order_by('-created_at')
    return render(request, 'dashboard/contacts.html', {'contacts': contacts})


@role_required('admin', 'superadmin')
def admin_contact_view(request, contact_id):
    contact = get_object_or_404(ContactMessage, id=contact_id)
    contact.is_read = True
    contact.save()
    return render(request, 'dashboard/contact_detail.html', {'contact': contact})


@role_required('admin', 'superadmin')
def admin_contact_delete(request, contact_id):
    contact = get_object_or_404(ContactMessage, id=contact_id)
    if request.method == 'POST':
        contact.delete()
        messages.success(request, 'Message deleted.')
    return redirect('admin_contacts')


@role_required('superadmin')
def admin_admins(request):
    admins = User.objects.filter(role__in=['admin', 'superadmin']).order_by('-date_joined')
    return render(request, 'dashboard/admins.html', {'admins': admins})


@role_required('superadmin')
def admin_admin_create(request):
    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        email = request.POST.get('email', '').strip()
        password = request.POST.get('password', '')
        role = request.POST.get('role', 'admin')
        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already exists.')
        else:
            user = User.objects.create_user(username=username, email=email, password=password)
            user.role = role
            user.is_staff = True
            user.save()
            messages.success(request, f"{role.capitalize()} '{username}' created.")
            return redirect('admin_admins')
    return render(request, 'dashboard/admin_create.html')


@role_required('superadmin')
def admin_admin_delete(request, user_id):
    user = get_object_or_404(User, id=user_id)
    if request.method == 'POST':
        if user == request.user:
            messages.error(request, 'You cannot delete your own account.')
        else:
            user.delete()
            messages.success(request, 'Admin deleted.')
    return redirect('admin_admins')


@role_required('admin', 'superadmin')
def admin_reports(request):
    users_by_day = (
        User.objects
        .filter(date_joined__gte=timezone.now() - timedelta(days=30))
        .annotate(day=TruncDate('date_joined'))
        .values('day')
        .annotate(count=Count('id'))
        .order_by('day')
    )
    ctx = {
        'labels': [str(r['day']) for r in users_by_day],
        'data': [r['count'] for r in users_by_day],
        'total_users': User.objects.count(),
        'active_users': User.objects.filter(is_active=True).count(),
        'staff_users': User.objects.filter(role__in=['admin', 'superadmin']).count(),
        'total_contacts': ContactMessage.objects.count(),
    }
    return render(request, 'dashboard/reports.html', ctx)
