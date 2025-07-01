from sqlalchemy import Column, Integer, Unicode, DateTime, ForeignKey
from app.database import Base
from datetime import datetime,timezone

class Delivery(Base):
    __tablename__ = "Deliveries"

    deli_id = Column(Integer, primary_key=True)
    deli_ord_id = Column(Integer, ForeignKey("Orders.ord_id"), unique=True)
    deli_whs_id = Column(Integer, ForeignKey("Warehouses.whs_id"))
    deli_date = Column(DateTime)
    deli_route_info = Column(Unicode)  # ใช้ NVARCHAR(MAX) → String (ไม่มี max limit)
    deli_created_by = Column(Unicode(30))
    deli_created_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    deli_updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
 

 