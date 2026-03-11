import logging
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.utils.html import strip_tags

logger = logging.getLogger(__name__)

ADMIN_EMAIL = getattr(settings, 'ADMIN_NOTIFICATION_EMAIL', settings.EMAIL_HOST_USER)
SITE_URL = getattr(settings, 'SITE_URL', 'http://localhost:5173')
BACKEND_URL = getattr(settings, 'BACKEND_URL', 'http://localhost:8000')


def _send(subject, html_body, to_email):
    plain = strip_tags(html_body)
    from_email = f'DomAIyn <{settings.EMAIL_HOST_USER}>'
    msg = EmailMultiAlternatives(
        subject=subject,
        body=plain,
        from_email=from_email,
        to=[to_email],
    )
    msg.attach_alternative(html_body, 'text/html')
    try:
        logger.info(f"[EMAIL INFO] Attempting to send '{subject}' to {to_email} using {settings.EMAIL_HOST_USER}")
        msg.send(fail_silently=False)
        logger.info(f"[EMAIL SUCCESS] Sent to {to_email}")
        return True
    except Exception as e:
        logger.error(f'[EMAIL ERROR] Failed to send to {to_email}. Error: {e}')
        # Log settings for debugging (mask password)
        logger.debug(f"Email Config: HOST={settings.EMAIL_HOST}, PORT={settings.EMAIL_PORT}, USER={settings.EMAIL_HOST_USER}")
        return False

def send_email_verification_otp(email, otp, username):
    subject = 'Verify your DomAIyn email address'
    html = f"""
    <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;background:#0d0d1a;color:#fff;border-radius:12px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#7c3aed,#2563eb);padding:32px;text-align:center">
        <h1 style="margin:0;font-size:24px;letter-spacing:1px">DomAIyn</h1>
        <p style="margin:8px 0 0;opacity:.8;font-size:14px">Email Verification</p>
      </div>
      <div style="padding:32px">
        <p style="font-size:16px">Hi <strong>{username}</strong>,</p>
        <p style="color:rgba(255,255,255,.7)">Enter this OTP to verify your email and complete registration:</p>
        <div style="background:#1a1a2e;border:1px solid rgba(124,58,237,.4);border-radius:10px;padding:24px;text-align:center;margin:24px 0">
          <span style="font-size:36px;font-weight:700;letter-spacing:10px;color:#a78bfa">{otp}</span>
        </div>
        <p style="color:rgba(255,255,255,.5);font-size:13px">⏱ Expires in <strong>10 minutes</strong>.</p>
        <p style="color:rgba(255,255,255,.5);font-size:13px">If you didn't request this, ignore this email.</p>
      </div>
      <div style="background:#0a0a14;padding:16px;text-align:center;font-size:12px;color:rgba(255,255,255,.3)">
        © 2025 DomAIyn Labs · domaiynlabs@gmail.com
      </div>
    </div>
    """
    return _send(subject, html, email)

def send_password_reset_otp(email, otp, username):
    subject = 'DomAIyn — Password Reset OTP'
    html = f"""
    <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;background:#0d0d1a;color:#fff;border-radius:12px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#dc2626,#7c3aed);padding:32px;text-align:center">
        <h1 style="margin:0;font-size:24px;letter-spacing:1px">DomAIyn</h1>
        <p style="margin:8px 0 0;opacity:.8;font-size:14px">Password Reset</p>
      </div>
      <div style="padding:32px">
        <p style="font-size:16px">Hi <strong>{username}</strong>,</p>
        <p style="color:rgba(255,255,255,.7)">Use this OTP to reset your password:</p>
        <div style="background:#1a1a2e;border:1px solid rgba(220,38,38,.4);border-radius:10px;padding:24px;text-align:center;margin:24px 0">
          <span style="font-size:36px;font-weight:700;letter-spacing:10px;color:#f87171">{otp}</span>
        </div>
        <p style="color:rgba(255,255,255,.5);font-size:13px">⏱ Expires in <strong>5 minutes</strong>.</p>
        <p style="color:rgba(255,255,255,.5);font-size:13px">If you didn't request this, ignore this email.</p>
      </div>
      <div style="background:#0a0a14;padding:16px;text-align:center;font-size:12px;color:rgba(255,255,255,.3)">
        © 2025 DomAIyn Labs · domaiynlabs@gmail.com
      </div>
    </div>
    """
    return _send(subject, html, email)

def send_welcome_email(email, username):
    subject = 'Welcome to DomAIyn! 🚀'
    html = f"""
    <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;background:#0d0d1a;color:#fff;border-radius:12px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#7c3aed,#2563eb,#ec4899);padding:40px;text-align:center">
        <h1 style="margin:0;font-size:28px;letter-spacing:2px">DomAIyn</h1>
        <p style="margin:8px 0 0;opacity:.9;font-size:15px">Welcome aboard! 🎉</p>
      </div>
      <div style="padding:32px">
        <p style="font-size:18px">Hi <strong>{username}</strong>,</p>
        <p style="color:rgba(255,255,255,.8);line-height:1.7">
          Your account has been successfully created. You're now part of the DomAIyn community —
          where we evaluate AI systems for safety, consistency, and reliability.
        </p>
        <div style="background:#1a1a2e;border-left:4px solid #7c3aed;border-radius:6px;padding:16px;margin:24px 0">
          <p style="margin:0;color:rgba(255,255,255,.7);font-size:14px">
            🔐 Your account is protected with our security system.<br>
            📧 This email is verified and linked to your account.
          </p>
        </div>
        <a href="{SITE_URL}" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#2563eb);color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;margin-top:8px">
          Visit DomAIyn →
        </a>
      </div>
      <div style="background:#0a0a14;padding:16px;text-align:center;font-size:12px;color:rgba(255,255,255,.3)">
        © 2025 DomAIyn Labs · domaiynlabs@gmail.com
      </div>
    </div>
    """
    return _send(subject, html, email)

def send_admin_new_signup_notification(username, email):
    subject = f'[DomAIyn Admin] New signup: {username}'
    html = f"""
    <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;background:#0d0d1a;color:#fff;border-radius:12px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#059669,#0d9488);padding:24px 32px">
        <h2 style="margin:0;font-size:18px"> New User Registered</h2>
      </div>
      <div style="padding:24px 32px">
        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td style="padding:8px 0;color:rgba(255,255,255,.5);font-size:13px;width:120px">Username</td>
            <td style="padding:8px 0;font-weight:600">{username}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:rgba(255,255,255,.5);font-size:13px">Email</td>
            <td style="padding:8px 0">{email}</td>
          </tr>
        </table>
        <a href="{BACKEND_URL}/panel/users/" style="display:inline-block;background:#1a1a2e;border:1px solid rgba(255,255,255,.1);color:#fff;text-decoration:none;padding:10px 20px;border-radius:8px;font-size:13px;margin-top:16px">
          View in Admin Panel →
        </a>
      </div>
      <div style="background:#0a0a14;padding:12px;text-align:center;font-size:11px;color:rgba(255,255,255,.3)">
        DomAIyn Admin Notification System
      </div>
    </div>
    """
    if ADMIN_EMAIL:
        return _send(subject, html, ADMIN_EMAIL)
    return False
