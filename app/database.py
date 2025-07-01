# app/database.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from .config import DATABASE_URL  # ดึงค่าจาก .env ผ่าน config.py

# สร้าง engine ด้วย DATABASE_URL
engine = create_engine(DATABASE_URL)

# สร้าง session factory
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

# Base สำหรับใช้ inherit ใน model ทั้งหมด
Base = declarative_base()

# Dependency สำหรับใช้ใน router หรือ service
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
