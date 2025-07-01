from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class OrderResponse(BaseModel):
    ord_id: int
    ord_code: str
    ord_cus_id: Optional[int]
    ord_date: Optional[datetime]
    ord_status: Optional[str]
    ord_total_amount: float
    ord_created_by: Optional[str]
    ord_created_at: datetime
    ord_updated_at: datetime

    class Config:
        from_attributes = True
