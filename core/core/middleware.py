from django.shortcuts import redirect
from django.contrib.auth import logout
from django.contrib import messages
from django.utils import timezone
from django.core.cache import cache
from django.http import HttpResponse
import time
import secrets
import base64


class AdminAccessMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        path = request.path
        if path.startswith('/admin/') or path.startswith('/panel/'):
            if not request.user.is_authenticated:
                return redirect(f'/login/?next={path}')
            if not (request.user.is_admin or request.user.is_superuser or request.user.is_staff):
                messages.error(request, 'Access denied. Admin accounts only.')
                return redirect('home')
        return self.get_response(request)


class SessionIdleMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.timeout = 900

    def __call__(self, request):
        if request.user.is_authenticated:
            last_activity = request.session.get('last_activity')
            now = time.time()
            if last_activity and (now - last_activity) > self.timeout:
                logout(request)
                messages.warning(request, 'You were logged out due to inactivity.')
                return redirect('/login/')
            request.session['last_activity'] = now
        return self.get_response(request)


class SecurityHeadersMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    @staticmethod
    def _generate_nonce():
        return base64.b64encode(secrets.token_bytes(16)).decode('ascii')

    def __call__(self, request):
        nonce = self._generate_nonce()
        request.csp_nonce = nonce
        response = self.get_response(request)
        response['X-Frame-Options'] = 'DENY'
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-XSS-Protection'] = '1; mode=block'
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        response['Permissions-Policy'] = 'geolocation=(), microphone=(), camera=()'
        response['Content-Security-Policy'] = (
            f"default-src 'self'; "
            f"script-src 'self' 'nonce-{nonce}' https://accounts.google.com https://cdn.jsdelivr.net; "
            f"style-src 'self' 'unsafe-inline' 'nonce-{nonce}' https://fonts.googleapis.com https://cdn.jsdelivr.net; "
            f"font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net; "
            f"img-src 'self' data: https:; "
            f"connect-src 'self'; "
            f"frame-ancestors 'none';"
        )
        return response


class LoginRateLimitMiddleware:
    MAX_ATTEMPTS = 5
    WINDOW_SECONDS = 15 * 60

    def __init__(self, get_response):
        self.get_response = get_response

    def _get_client_ip(self, request):
        x_forwarded = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded:
            return x_forwarded.split(',')[0].strip()
        return request.META.get('REMOTE_ADDR', '0.0.0.0')

    def _cache_key(self, ip):
        return f'login_attempts_{ip}'

    def __call__(self, request):
        if request.path == '/login/' and request.method == 'POST':
            ip = self._get_client_ip(request)
            key = self._cache_key(ip)
            if cache.get(key, 0) >= self.MAX_ATTEMPTS:
                return HttpResponse(
                    '<html><body style="font-family:sans-serif;text-align:center;padding:60px;background:#0a0a0a;color:#fff">'
                    '<h2 style="color:#f87171">⚠️ Too Many Login Attempts</h2>'
                    '<p>You have been temporarily blocked due to too many failed login attempts.</p>'
                    '<p style="color:#9ca3af">Please wait <strong>15 minutes</strong> before trying again.</p>'
                    '</body></html>',
                    status=429,
                    content_type='text/html'
                )

        response = self.get_response(request)

        if request.path == '/login/' and request.method == 'POST':
            ip = self._get_client_ip(request)
            key = self._cache_key(ip)
            if response.status_code == 200:
                cache.set(key, cache.get(key, 0) + 1, self.WINDOW_SECONDS)
            elif response.status_code in (301, 302):
                cache.delete(key)

        return response
