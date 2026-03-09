import os
import django
from django.contrib.auth import get_user_model

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

User = get_user_model()

admin_username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
admin_email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
admin_password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'admin123')

user = User.objects.filter(username=admin_username).first()
if not user:
    print(f"Creating superuser: {admin_username}")
    User.objects.create_superuser(admin_username, admin_email, admin_password)
else:
    print(f"Superuser {admin_username} already exists. Updating password...")
    user.set_password(admin_password)
    user.email = admin_email
    user.save()
    print("Password updated successfully.")
