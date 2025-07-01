from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DeliveryResponse(BaseModel):
    deli_id: int
    deli_ord_id: int
    deli_whs_id: int
    deli_date: Optional[datetime]
    deli_route_info: Optional[str]
    deli_created_by: Optional[str]
    deli_created_at: datetime
    deli_updated_at: datetime

    class Config:
        from_attributes = True
