from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# ✅ Category ย่อ (เฉพาะ cat_code และ cat_name)
class CategoryShort(BaseModel):
    cat_code: str
    cat_name: str

    class Config:
        from_attributes = True

# Base schema ใช้เป็นแม่แบบร่วม
class ProductBase(BaseModel):
    prd_sku: str
    prd_name: str
    prd_category: Optional[str] = None  # FK → cat_code
    prd_unit_price: Optional[float] = None
    prd_weight: Optional[float] = None
    prd_qty: Optional[int] = 0
    prd_unit: Optional[str] = None
    prd_created_by: Optional[str] = None

# Schema สำหรับ POST / PUT
class ProductCreate(ProductBase):
    pass

# Schema สำหรับการส่งกลับจาก backend
class ProductResponse(BaseModel):
    prd_id: int
    prd_sku: str
    prd_name: str
    prd_category: Optional[str]
    prd_unit_price: float
    prd_weight: float
    prd_qty: int
    prd_unit: str
    prd_created_by: Optional[str]
    prd_created_at: datetime
    prd_updated_at: datetime

    # ✅ เพิ่ม object category ที่ JOIN มา
    category: Optional[CategoryShort]

    class Config:
        from_attributes = True  # ใช้แทน orm_mode=True ใน Pydantic v2+
