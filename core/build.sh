#!/usr/bin/env bash
# Render Build Script for DomAIyn

set -o errexit  # exit on error

# ── 1. Build React/Vite frontend ──────────────────────────────────────────────
cd frontend
npm ci                  # clean, reproducible install
npm run build           # outputs fresh assets → ../static/dist/
cd ..

# ── 2. Install Python dependencies ───────────────────────────────────────────
pip install -r requirements.txt

# ── 3. Run Django database migrations ────────────────────────────────────────
python manage.py migrate --noinput

# ── 4. Collect static files (WhiteNoise will serve them) ─────────────────────
python manage.py collectstatic --noinput

# Create superuser if needed (set env vars DJANGO_SUPERUSER_* on Render)
# python manage.py createsuperuser --noinput || true
