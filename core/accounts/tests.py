from django.test import TestCase, Client, override_settings
from django.urls import reverse
from django.contrib.auth import get_user_model
from .models import PasswordResetOTP, EmailVerificationOTP, ContactMessage
import json

User = get_user_model()


@override_settings(SECURE_SSL_REDIRECT=False, EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
class AuthTests(TestCase):
    def setUp(self):
        self.client = Client(enforce_csrf_checks=False)
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='StrongPass123!',
            role='user',
        )

    def test_login_valid_credentials(self):
        response = self.client.post(reverse('login'), {
            'username': 'testuser',
            'password': 'StrongPass123!',
        })
        self.assertRedirects(response, reverse('home'), fetch_redirect_response=False)

    def test_login_invalid_credentials(self):
        response = self.client.post(reverse('login'), {
            'username': 'testuser',
            'password': 'wrongpassword',
        })
        self.assertEqual(response.status_code, 200)

    def test_login_with_email(self):
        response = self.client.post(reverse('login'), {
            'username': 'test@example.com',
            'password': 'StrongPass123!',
        })
        self.assertEqual(response.status_code, 302)

    def test_logout(self):
        self.client.login(username='testuser', password='StrongPass123!')
        response = self.client.get(reverse('logout'))
        self.assertEqual(response.status_code, 302)

    def test_home_requires_login(self):
        response = self.client.get(reverse('home'))
        self.assertEqual(response.status_code, 302)

    def test_register_page_loads(self):
        response = self.client.get(reverse('register'))
        self.assertEqual(response.status_code, 200)

    def test_forgot_password_unknown_email(self):
        response = self.client.post(reverse('forgot_password'), {
            'email': 'nobody@example.com',
        })
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'No account found')

    def test_forgot_password_valid_email(self):
        response = self.client.post(reverse('forgot_password'), {
            'email': 'test@example.com',
        })
        self.assertEqual(response.status_code, 302)
        self.assertTrue(PasswordResetOTP.objects.filter(user=self.user).exists())

    def test_otp_bypass_blocked(self):
        session = self.client.session
        session['reset_user'] = self.user.id
        session['otp_verified'] = False
        session.save()
        response = self.client.get(reverse('reset_password'))
        self.assertRedirects(response, reverse('login'), fetch_redirect_response=False)

    def test_reset_password_requires_otp_verified(self):
        session = self.client.session
        session['reset_user'] = self.user.id
        session['otp_verified'] = True
        session.save()
        response = self.client.post(reverse('reset_password'), {
            'password': 'NewStrongPass123!',
        })
        self.assertEqual(response.status_code, 302)


@override_settings(SECURE_SSL_REDIRECT=False, EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
class RBACTests(TestCase):
    def setUp(self):
        self.client = Client(enforce_csrf_checks=False)
        self.user = User.objects.create_user(
            username='plainuser', email='plain@example.com', password='Pass123!', role='user'
        )
        self.admin = User.objects.create_user(
            username='adminuser', email='admin@example.com', password='Pass123!', role='admin', is_staff=True
        )
        self.superadmin = User.objects.create_user(
            username='superadmin', email='super@example.com', password='Pass123!', role='superadmin', is_staff=True
        )

    def test_regular_user_cannot_access_panel(self):
        self.client.login(username='plainuser', password='Pass123!')
        response = self.client.get(reverse('admin_dashboard'))
        self.assertEqual(response.status_code, 302)

    def test_admin_can_access_dashboard(self):
        self.client.login(username='adminuser', password='Pass123!')
        response = self.client.get(reverse('admin_dashboard'))
        self.assertEqual(response.status_code, 200)

    def test_admin_cannot_access_admins_panel(self):
        self.client.login(username='adminuser', password='Pass123!')
        response = self.client.get(reverse('admin_admins'))
        self.assertEqual(response.status_code, 302)

    def test_superadmin_can_access_admins_panel(self):
        self.client.login(username='superadmin', password='Pass123!')
        response = self.client.get(reverse('admin_admins'))
        self.assertEqual(response.status_code, 200)

    def test_admin_cannot_edit_another_admin(self):
        self.client.login(username='adminuser', password='Pass123!')
        response = self.client.post(
            reverse('admin_user_edit', args=[self.superadmin.id]),
            {'username': 'hacked', 'email': 'hacked@example.com'},
        )
        self.assertEqual(response.status_code, 302)
        self.superadmin.refresh_from_db()
        self.assertEqual(self.superadmin.username, 'superadmin')

    def test_admin_cannot_delete_self(self):
        self.client.login(username='adminuser', password='Pass123!')
        self.client.post(reverse('admin_user_delete', args=[self.admin.id]))
        self.assertTrue(User.objects.filter(username='adminuser').exists())

    def test_unauthenticated_redirected_from_panel(self):
        response = self.client.get(reverse('admin_dashboard'))
        self.assertEqual(response.status_code, 302)


@override_settings(SECURE_SSL_REDIRECT=False)
class ContactTests(TestCase):
    def setUp(self):
        self.client = Client(enforce_csrf_checks=False)

    def test_contact_submit_valid(self):
        response = self.client.post(
            reverse('contact_submit'),
            data=json.dumps({
                'name': 'John',
                'email': 'john@example.com',
                'subject': 'Test',
                'message': 'Hello there',
            }),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue(ContactMessage.objects.filter(email='john@example.com').exists())

    def test_contact_submit_missing_fields(self):
        response = self.client.post(
            reverse('contact_submit'),
            data=json.dumps({'name': 'John'}),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 400)
