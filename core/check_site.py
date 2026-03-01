import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.sites.models import Site

try:
    site = Site.objects.get(pk=1)
    print(f"Site ID: {site.id}")
    print(f"Domain: {site.domain}")
    print(f"Name: {site.name}")
except Site.DoesNotExist:
    print("Site content ID 1 does not exist.")
