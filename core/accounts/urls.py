from django.urls import path
from django.views.generic.base import TemplateView
from .views import (
    register_view, login_view, logout_view, home_view, protected_api,
    forgot_password, verify_otp, reset_password,
    admin_dashboard, admin_users, admin_user_edit, admin_user_delete,
    admin_contacts, admin_contact_view, admin_contact_delete,
    admin_admins, admin_admin_create, admin_admin_delete,
    admin_reports, contact_submit, auth_status, verify_email_otp,
    health_check, # Assuming health_check is a new view that needs to be imported
)

urlpatterns = [
    path('', home_view, name='home'),
    path('health/', health_check, name='health_check'),
    
    # SEO directives
    path('robots.txt', TemplateView.as_view(template_name="robots.txt", content_type="text/plain")),
    path('sitemap.xml', TemplateView.as_view(template_name="sitemap.xml", content_type="text/xml")),
    
    # Auth Status API
    path('register/', register_view, name='register'),
    path('verify-email-otp/', verify_email_otp, name='verify_email_otp'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('api/protected/', protected_api),
    path('api/contact/', contact_submit, name='contact_submit'),
    path('api/auth-status/', auth_status, name='auth_status'),
    path('forgot-password/', forgot_password, name='forgot_password'),
    path('verify-otp/', verify_otp, name='verify_otp'),
    path('reset-password/', reset_password, name='reset_password'),
    path('panel/', admin_dashboard, name='admin_dashboard'),
    path('panel/users/', admin_users, name='admin_users'),
    path('panel/users/<int:user_id>/edit/', admin_user_edit, name='admin_user_edit'),
    path('panel/users/<int:user_id>/delete/', admin_user_delete, name='admin_user_delete'),
    path('panel/contacts/', admin_contacts, name='admin_contacts'),
    path('panel/contacts/<int:contact_id>/', admin_contact_view, name='admin_contact_view'),
    path('panel/contacts/<int:contact_id>/delete/', admin_contact_delete, name='admin_contact_delete'),
    path('panel/admins/', admin_admins, name='admin_admins'),
    path('panel/admins/create/', admin_admin_create, name='admin_admin_create'),
    path('panel/admins/<int:user_id>/delete/', admin_admin_delete, name='admin_admin_delete'),
    path('panel/reports/', admin_reports, name='admin_reports'),
]
