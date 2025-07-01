# app/config.py

import os
from dotenv import load_dotenv

# ─────────────────────── Load Environment ───────────────────────
load_dotenv()

# ─────────────────────── JWT CONFIG ───────────────────────
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))
RESET_TOKEN_EXPIRE_MINUTES = int(os.getenv("RESET_TOKEN_EXPIRE_MINUTES", 15))

# ─────────────────────── DATABASE CONFIG ───────────────────────
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")

# ─────────────────────── EMAIL CONFIG ───────────────────────
EMAIL_SENDER = os.getenv("EMAIL_SENDER", "noreply@example.com")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD", "")
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")

# ─────────────────────── FRONTEND CONFIG ───────────────────────
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

# ─────────────────────── CORS CONFIG ───────────────────────
# รับหลายโดเมนโดยคั่นด้วย comma
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,https://ashy-grass-0d8e88500.1.azurestaticapps.net")
CORS_ORIGINS = [origin.strip() for origin in CORS_ORIGINS.split(",") if origin.strip()]
print("✅ CORS_ORIGINS from config:", CORS_ORIGINS)

# ─────────────────────── ENVIRONMENT MODE ───────────────────────
APP_ENV = os.getenv("APP_ENV", "prod")
