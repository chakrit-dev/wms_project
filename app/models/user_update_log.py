from sqlalchemy import Column, Integer, Unicode, DateTime, ForeignKey
from datetime import datetime
from app.database import Base

class UserUpdateLog(Base):
    __tablename__ = "UserUpdateLogs"

    ulog_id = Column(Integer, primary_key=True, index=True)
    ulog_user_id = Column(Integer, ForeignKey("Userlogin.usl_id"), nullable=False)
    ulog_usl_username = Column(Unicode(50), ForeignKey("Userlogin.usl_username"), nullable=False)
    ulog_updated_by = Column(Unicode(50), nullable=False)
    ulog_update_time = Column(DateTime, default=datetime.now)
    ulog_note = Column(Unicode(255), nullable=True)

