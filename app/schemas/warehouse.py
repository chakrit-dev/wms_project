from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class WarehouseResponse(BaseModel):
    whs_id: int
    whs_code: str  # ✅ เพิ่มตรงนี้
    whs_name: str
    whs_addr: Optional[str]
    whs_capacity: Optional[int]
    whs_phone: Optional[str]
    whs_created_by: Optional[str]
    whs_created_at: datetime
    whs_updated_at: datetime

    class Config:
        from_attributes = True
