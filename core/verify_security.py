import os
import django
from django.conf import settings
from django.test import Client

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.test import override_settings

@override_settings(ALLOWED_HOSTS=['testserver', '127.0.0.1', 'localhost'])
def run_tests():
    from accounts.models import ContactMessage
    from django.contrib.auth import get_user_model
    User = get_user_model()
    client = Client()
    
    # 1. Test Login SQL Injection
    print("\n[Test 1] Login SQL Injection")
    response = client.post('/login/', {
        'username': "admin' OR '1'='1",
        'password': 'password123'
    })
    
    print(f"Status Code: {response.status_code}")
    content = response.content.decode()
    if "contains invalid characters" in content:

        print("PASS: SQL Injection attempt blocked.")
    else:
        print("FAIL: SQL Injection attempt NOT blocked.")
        print(content) # Debug if needed

    # 2. Test Valid Login (Mock user)
    # create a test user
    username = 'testuser_sec'
    password = 'TestPassword123!'
    if not User.objects.filter(username=username).exists():
        User.objects.create_user(username=username, email='test@test.com', password=password)
    
    print("\n[Test 2] Valid Login")
    response = client.post('/login/', {
        'username': username,
        'password': password
    })
    
    if response.status_code == 302:
        print("PASS: Valid login redirected correctly.")
    else:
        print(f"FAIL: Valid login failed with status {response.status_code}")

    # 3. Test Email Login
    print("\n[Test 3] Email Login")
    email = 'test_email_login@test.com'
    password = 'TestPassword123!'
    if not User.objects.filter(email=email).exists():
        User.objects.create_user(username='test_email_user', email=email, password=password)
    
    response = client.post('/login/', {
        'username': email, # Using email in the username field
        'password': password
    })
    
    if response.status_code == 302:
        print("PASS: Login with email redirected correctly.")
    else:
        print(f"FAIL: Login with email failed with status {response.status_code}")

    # clean up
    try:
        User.objects.filter(email=email).delete()
    except:
        pass

if __name__ == "__main__":
    run_tests()

