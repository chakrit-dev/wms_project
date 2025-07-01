from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CustomerResponse(BaseModel):
    cus_id: int
    cus_firstname: str
    cus_lastname: str
    cus_email: Optional[str]
    cus_phone: Optional[str]
    cus_addr: Optional[str]
    cus_created_by: Optional[str]
    cus_created_at: datetime
    cus_updated_at: datetime

    class Config:
        from_attributes = True
