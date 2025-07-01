from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date
from app.schemas.product import ProductResponse
from app.schemas.warehouse import WarehouseResponse  # ✅ เพิ่ม

class InventoryCreate(BaseModel):
    inv_whs_id: int
    inv_prd_id: int
    inv_qty: int
    inv_min_threshold: Optional[int] = 5
    inv_max_capacity: Optional[int] = 0
    inv_location_bin: Optional[str] = "A"
    inv_status: Optional[str] = "available"
    inv_expiry_date: Optional[date] = None
    inv_created_by: Optional[str] = "system"

class InventoryResponse(InventoryCreate):
    inv_id: int
    inv_created_at: Optional[datetime]
    inv_updated_at: Optional[datetime]

    prd_name: Optional[str] = None
    product: Optional[ProductResponse] = None

    warehouse_name: Optional[str] = None  # ✅ เพิ่ม field ชื่อคลัง
    warehouse: Optional[WarehouseResponse] = None

    class Config:
        from_attributes = True
