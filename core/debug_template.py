import os
import django
import sys

# Add current directory to path
sys.path.append(os.getcwd())

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.conf import settings
from django.template.loader import render_to_string
from django.test import RequestFactory
from django.contrib.auth.models import AnonymousUser

def debug_render(template_name):
    print(f"\n--- DEBUGGING {template_name} ---")
    # For Django to find it via loader, it needs to be in a place it looks
    # settings.TEMPLATES[0]['DIRS'] or app/templates
    
    try:
        request = RequestFactory().get('/')
        request.user = AnonymousUser()
        rendered = render_to_string(template_name, {'site_url': settings.SITE_URL}, request)
        print("SUCCESSFULLY RENDERED")
        print(f"Rendered snippet (auth status):")
        for line in rendered.splitlines():
            if 'isAuthenticated' in line:
                print(line.strip())
    except Exception as e:
        print(f"ERROR RENDERING: {type(e).__name__}: {e}")
        # Try to find the file and print it
        for template_dir in settings.TEMPLATES[0]['DIRS']:
            path = os.path.join(template_dir, template_name)
            if os.path.exists(path):
                print(f"Found in DIRS: {path}")
                with open(path, 'r', encoding='utf-8') as f:
                    print(f"CONTENT:\n{f.read()}")
        
        # Check accounts app
        path = os.path.join(settings.BASE_DIR, 'accounts', 'templates', template_name)
        if os.path.exists(path):
            print(f"Found in accounts/templates: {path}")
            with open(path, 'r', encoding='utf-8') as f:
                print(f"CONTENT:\n{f.read()}")

if __name__ == "__main__":
    debug_render('home_v2.html')
