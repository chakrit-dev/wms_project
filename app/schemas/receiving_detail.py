from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.schemas.product import ProductResponse  #  ต้องมี schema ของ Product

# สำหรับ POST: การรับสินค้าแต่ละตัว
class ReceivingDetailCreate(BaseModel):
    rcvd_prd_id: int
    rcvd_qty: int
    rcvd_unit_price: float
    rcvd_unit: str  #  เพิ่ม unit
    rcvd_expiry_date: Optional[datetime] = None

# สำหรับการอ่าน response
class ReceivingDetailResponse(BaseModel):
    rcvd_id: int
    rcvd_rcv_id: int
    rcvd_prd_id: int
    rcvd_qty: int
    rcvd_unit_price: float
    rcvd_unit: str  # เพิ่ม unit
    rcvd_expiry_date: Optional[datetime]
    rcvd_created_at: datetime

    product: Optional[ProductResponse]  # เพิ่ม product ย่อย

    class Config:
        from_attributes = True
