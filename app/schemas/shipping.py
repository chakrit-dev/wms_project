# 📄 app/schemas/shipping.py

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date


# 🚚 Shipping Detail (ย่อย)
class ShippingDetailCreate(BaseModel):
    shpd_prd_id: int
    shpd_qty: int
    shpd_unit_price: Optional[float] = 0.00
    shpd_status: Optional[str] = "normal"
    shpd_expiry_date: Optional[date] = None


class ShippingDetailResponse(ShippingDetailCreate):
    shpd_id: int

    class Config:
        from_attributes = True


# 🚚 Shipping Header
class ShippingCreate(BaseModel):
    shp_code: str
    shp_customer_id: int
    shp_vehicle_no: str
    shp_driver_name: str
    shp_status: Optional[str] = "pending"
    details: List[ShippingDetailCreate]  # แนบรายการสินค้าเลย


class ShippingResponse(ShippingCreate):
    shp_id: int
    shp_created_at: Optional[datetime]
    shp_updated_at: Optional[datetime]
    details: List[ShippingDetailResponse]

    class Config:
        from_attributes = True
