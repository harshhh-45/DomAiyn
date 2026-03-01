import re
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

User = get_user_model()

# Allowed characters for username — alphanumeric + underscore + hyphen only
USERNAME_RE = re.compile(r'^[\w.-]{3,30}$')
from .utils import check_sql_injection


class RegisterForm(UserCreationForm):
    email = forms.EmailField(
        required=True,
        max_length=254,
        widget=forms.EmailInput(attrs={'autocomplete': 'email'}),
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']

    def clean_username(self):
        username = self.cleaned_data.get('username', '').strip()
        if not USERNAME_RE.match(username):
            raise ValidationError(
                "Username must be 3–30 characters and contain only letters, numbers, dots, hyphens, or underscores."
            )
        check_sql_injection(username, 'Username')
        return username

    def clean_email(self):
        email = self.cleaned_data.get('email', '').strip().lower()
        check_sql_injection(email, 'Email')
        if User.objects.filter(email=email).exists():
            raise ValidationError("An account with this email already exists.")
        return email

    def clean_password1(self):
        password = self.cleaned_data.get('password1', '')
        if len(password) < 8:
            raise ValidationError("Password must be at least 8 characters.")
        if not re.search(r'[A-Z]', password):
            raise ValidationError("Password must contain at least one uppercase letter.")
        if not re.search(r'[0-9]', password):
            raise ValidationError("Password must contain at least one number.")
        return password
