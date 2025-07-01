from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class OrderDetailResponse(BaseModel):
    ordd_id: int
    ordd_ord_id: int
    ordd_prd_id: int
    ordd_prd_name: str
    ordd_qty: int
    ordd_unit: str
    ordd_unit_price: float
    ordd_discount: float
    ordd_created_by: Optional[str]
    ordd_created_at: datetime
    ordd_updated_at: datetime

    class Config:
        from_attributes = True
