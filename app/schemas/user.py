#  app/schemas/user_schema.py

from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserResponse(BaseModel):
    usl_id: int
    usl_username: str
    usl_firstname: str
    usl_lastname: str
    usl_phone: Optional[str] = None
    usl_email: Optional[EmailStr] = None
    usl_role: Optional[str] = None              #  role จริง (null ถ้ายังไม่ approve)
    usl_requested_role: Optional[str] = None    #  role ที่ user ขอไว้
    usl_created_at: datetime
    usl_updated_at: datetime

    class Config:
        from_attributes = True  #  รองรับ model ที่มาจาก SQLAlchemy
