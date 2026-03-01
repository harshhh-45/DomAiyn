import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.sites.models import Site

site = Site.objects.get(pk=1)
site.domain = 'localhost:8000'
site.name = 'DomAIyn Local'
site.save()

print(f"Updated Site ID {site.id} to {site.domain}")
