from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# ✅ ใช้ร่วมกันในทั้ง Create/Update
class CategoryBase(BaseModel):
    cat_name: str
    cat_description: Optional[str] = None

# ✅ สำหรับ POST
class CategoryCreate(CategoryBase):
    cat_code: str  # ← ต้องมีตอนสร้างหมวดใหม่

# ✅ สำหรับ PUT/PATCH
class CategoryUpdate(CategoryBase):
    pass  # ไม่ควรให้แก้ cat_code ผ่าน endpoint

# ✅ สำหรับ Response
class CategoryResponse(CategoryBase):
    cat_id: int
    cat_code: str
    cat_created_at: datetime
    cat_updated_at: datetime

    class Config:
        from_attributes = True
