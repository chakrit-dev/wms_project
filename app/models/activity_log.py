from sqlalchemy import Column, Integer, Unicode, DateTime, ForeignKey
from app.database import Base
from datetime import datetime,timezone

class ActivityLog(Base):
    __tablename__ = "ActivityLogs"

    log_id = Column(Integer, primary_key=True)
    log_usl_id = Column(Integer, ForeignKey("Userlogin.usl_id"))
    log_username = Column(Unicode(50))
    log_action = Column(Unicode(50))
    log_module = Column(Unicode(50))
    log_record_id = Column(Integer)
    log_description = Column(Unicode)
    log_ip_address = Column(Unicode(45))
    log_timestamp = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
