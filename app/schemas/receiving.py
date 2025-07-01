from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.schemas.product import ProductResponse  # ต้องมี schema ของ Product

#  สำหรับ POST: การรับสินค้าแต่ละตัว
class ReceivingDetailCreate(BaseModel):
    rcvd_prd_id: int
    rcvd_qty: int
    rcvd_unit_price: float
    rcvd_unit: str
    rcvd_expiry_date: Optional[datetime] = None

#  สำหรับ Response แต่ละ detail
class ReceivingDetailResponse(BaseModel):
    rcvd_id: int
    rcvd_rcv_id: int
    rcvd_prd_id: int
    rcvd_qty: int
    rcvd_unit_price: float
    rcvd_unit: str
    rcvd_expiry_date: Optional[datetime]
    rcvd_created_at: Optional[datetime]

    product: Optional[ProductResponse]  # preload product

    class Config:
        from_attributes = True

#  สำหรับสร้าง Receiving
class ReceivingCreate(BaseModel):
    rcv_whs_id: int
    rcv_status: str
    rcv_created_by: str
    details: List[ReceivingDetailCreate]

#  สำหรับแก้ไข Receiving
class ReceivingUpdate(BaseModel):
    rcv_code: str
    rcv_whs_id: int
    rcv_date: Optional[datetime]
    rcv_status: str
    rcv_updated_by: str
    details: Optional[List[ReceivingDetailCreate]] = []

    class Config:
        from_attributes = True

#  สำหรับแสดง Receiving
class ReceivingResponse(BaseModel):
    rcv_id: int
    rcv_code: str
    rcv_whs_id: int
    rcv_created_by: str
    rcv_date: Optional[datetime]
    rcv_status: str
    rcv_created_at: Optional[datetime]
    rcv_updated_at: Optional[datetime]

    details: Optional[List[ReceivingDetailResponse]] = []

    class Config:
        from_attributes = True
