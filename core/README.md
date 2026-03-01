# DomAIyn Backend

Django REST API backend for DomAIyn. Built with Django 6, DRF, JWT auth, Google OAuth, and role-based access control.

## Stack

- **Framework**: Django 6 + Django REST Framework
- **Auth**: Session auth + JWT (SimpleJWT) + Google OAuth (allauth)
- **Database**: SQLite (dev) / PostgreSQL (production)
- **Static files**: WhiteNoise
- **Password hashing**: BCrypt

## Setup

### 1. Install dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in `.env` with your values. See `.env.example` for all required variables.

### 3. Run migrations

```bash
python manage.py migrate
```

### 4. Create superadmin

```bash
python manage.py createsuperuser
```

Then log in at `/panel/` and set role to `superadmin` via the Django `/admin/` panel.

### 5. Start development server

```bash
python manage.py runserver
```

## Running Tests

```bash
python manage.py test accounts
```

## Generating a New SECRET_KEY

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/token/` | Obtain JWT access + refresh tokens |
| `POST` | `/api/token/refresh/` | Refresh JWT access token |
| `GET` | `/api/protected/` | Test JWT authentication |
| `POST` | `/api/contact/` | Submit contact form |
| `GET` | `/api/auth-status/` | Check session auth status |

## Admin Panel Routes

| Route | Access |
|-------|--------|
| `/panel/` | Admin dashboard |
| `/panel/users/` | Manage users |
| `/panel/contacts/` | View contact messages |
| `/panel/admins/` | Manage admins (superadmin only) |
| `/panel/reports/` | Usage reports |
