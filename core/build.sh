#!/usr/bin/env bash
# Render Build Script for DomAIyn

set -o errexit  # exit on error

# Install Python dependencies
pip install -r requirements.txt

# Run Django database migrations
python manage.py migrate --noinput

# Collect static files
python manage.py collectstatic --noinput

# Create superuser if needed (set env vars DJANGO_SUPERUSER_* on Render)
# python manage.py createsuperuser --noinput || true
