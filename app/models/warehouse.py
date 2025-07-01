from sqlalchemy import Column, Integer, Unicode, DateTime, Numeric
from app.database import Base
from datetime import datetime, timezone

class Warehouse(Base):
    __tablename__ = "Warehouses"

    whs_id = Column(Integer, primary_key=True, index=True)
    whs_code = Column(Unicode(10), unique=True, nullable=False)  # ✅ เพิ่มตรงนี้
    whs_name = Column(Unicode(100), nullable=False)
    whs_addr = Column(Unicode(255))
    whs_capacity = Column(Integer)
    whs_phone = Column(Unicode(30))
    whs_contact_person = Column(Unicode(100))
    whs_latitude = Column(Numeric(10, 7))
    whs_longitude = Column(Numeric(10, 7))
    whs_status = Column(Unicode(20), default='active')
    whs_created_by = Column(Unicode(30))
    whs_created_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    whs_updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
