from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.account.models import EmailAddress
from .models import User
from django.core.exceptions import ObjectDoesNotExist

class MySocialAccountAdapter(DefaultSocialAccountAdapter):
    def pre_social_login(self, request, sociallogin):
        """
        Invoked just after a user successfully authenticates via a
        social provider, but before the login is actually processed
        (and before the signup form, if any, is rendered).
        """
        # 1. Social login not yet connected to any existing user
        if sociallogin.is_existing:
            return

        # 2. Extract email from social account data
        email = sociallogin.account.extra_data.get('email')
        if not email:
            return

        # 3. Check if a local user exists with this email
        try:
            user = User.objects.get(email=email)
            # 4. Link the social account to the existing user
            sociallogin.connect(request, user)
            
            # 5. Ensure the email is marked as verified in Allauth's system
            # to prevent redundant verification prompts.
            EmailAddress.objects.get_or_create(
                user=user,
                email=email,
                defaults={'verified': True, 'primary': True}
            )
        except User.DoesNotExist:
            # If user doesn't exist, allauth will proceed with normal signup/creation
            pass
