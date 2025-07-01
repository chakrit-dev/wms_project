#app/models/user.py

from sqlalchemy import Column, Integer, Unicode, DateTime
from app.database import Base
from datetime import datetime, timezone

def utcnow():
    return datetime.now(timezone.utc).replace(tzinfo=None, microsecond=0)

class Userlogin(Base):
    __tablename__ = "Userlogin"

    usl_id = Column(Integer, primary_key=True, index=True)
    usl_username = Column(Unicode(50), unique=True, nullable=False)
    usl_firstname = Column(Unicode(30), nullable=False)
    usl_lastname = Column(Unicode(30), nullable=False)
    usl_phone = Column(Unicode(30))
    usl_email = Column(Unicode(50))
    usl_passwd = Column(Unicode(150), nullable=False)

    usl_role = Column(Unicode(20), nullable=True)  # role จริง (เป็น null ตอนสมัคร)
    usl_requested_role = Column(Unicode(20), nullable=False)  # role ที่ user ขอ (warehouse, driver, etc.)

    usl_created_at = Column(DateTime, default=utcnow)  # เวลาสร้าง (ไม่ควรมี onupdate)
    usl_updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)  #เวลาที่ถูกแก้ไขล่าสุด
