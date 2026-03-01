# DomAIyn Backend — Deployment Guide

## Recommended Platform: [Railway](https://railway.app)

Railway is the best option for this project — it's nearly free on the Starter plan ($5 credit/month), supports Django natively, provides managed PostgreSQL, and deploys from GitHub in one click.

---

## Pre-Deployment Checklist

Before deploying:

1. **Rotate all secrets** — generate a new `SECRET_KEY`, rotate Gmail App Password, regenerate Google OAuth client secret
2. **Set `DEBUG=False`** in your environment variables
3. **Set `ALLOWED_HOSTS`** to your production domain
4. **Switch database** to PostgreSQL (uncomment `DB_ENGINE` in `.env`)
5. Confirm `.env` is in `.gitignore` and never committed

---

## Deploy to Railway (Recommended)

### 1. Push backend to GitHub

```bash
cd e:\domayl\core
git init
git add .
git commit -m "Initial deployment"
git remote add origin https://github.com/yourusername/domayl-backend.git
git push -u origin main
```

### 2. Create a Railway project

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your backend repository
4. Railway auto-detects Django and will prompt for environment variables

### 3. Add a PostgreSQL database

1. In your Railway project, click **New** → **Database** → **PostgreSQL**
2. Railway automatically sets `DATABASE_URL` — or use individual variables matching your `settings.py`

### 4. Set environment variables in Railway

In **Variables** tab, add:

```
SECRET_KEY=<generated-secret-key>
DEBUG=False
ALLOWED_HOSTS=yourapp.railway.app,yourdomain.com
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-gmail-app-password
ADMIN_NOTIFICATION_EMAIL=your-email@gmail.com
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
SITE_URL=https://yourdomain.com
BACKEND_URL=https://yourapp.railway.app
CORS_ALLOWED_ORIGINS=https://yourdomain.com
DB_ENGINE=django.db.backends.postgresql
DB_NAME=railway
DB_USER=postgres
DB_PASSWORD=<from railway dashboard>
DB_HOST=<from railway dashboard>
DB_PORT=5432
```

### 5. Configure start command

In Railway's **Settings** → **Deploy** → **Start Command**:

```
gunicorn core.wsgi:application --bind 0.0.0.0:$PORT
```

### 6. Run migrations (one-time)

In Railway's **Shell** tab:

```bash
python manage.py migrate
python manage.py collectstatic --no-input
python manage.py createsuperuser
```

---

## Alternative: Render.com

Render is also a great option with a free tier.

1. Go to [render.com](https://render.com) → **New** → **Web Service**
2. Connect your GitHub repo
3. Set **Build Command**: `pip install -r requirements.txt && python manage.py collectstatic --no-input`
4. Set **Start Command**: `gunicorn core.wsgi:application`
5. Add environment variables in the **Environment** tab
6. Add a **PostgreSQL** database from the Render dashboard

---

## Google OAuth — Production Setup

When deploying, update your Google Cloud Console:

1. Go to [console.cloud.google.com](https://console.cloud.google.com) → Credentials
2. Edit your OAuth 2.0 client
3. Add to **Authorized redirect URIs**:
   ```
   https://yourapp.railway.app/accounts/google/login/callback/
   ```
4. Update the `Site` record in Django admin:
   - Go to `/admin/sites/site/`
   - Change domain from `localhost:8000` to `yourapp.railway.app`

---

## Generating a Strong SECRET_KEY

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```
