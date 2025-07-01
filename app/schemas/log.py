from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ActivityLogResponse(BaseModel):
    log_id: int
    log_usl_id: Optional[int]
    log_username: str
    log_action: str
    log_module: str
    log_record_id: int
    log_description: str
    log_ip_address: Optional[str]
    log_timestamp: datetime

    class Config:
        from_attributes = True
