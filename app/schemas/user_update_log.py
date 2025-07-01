from pydantic import BaseModel
from datetime import datetime

class UserUpdateLogResponse(BaseModel):
    ulog_id: int
    ulog_user_id: int
    ulog_usl_username: str
    ulog_updated_by: str
    ulog_update_time: datetime
    ulog_note: str | None

    class Config:
       from_attributes = True
