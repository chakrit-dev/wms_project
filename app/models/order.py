from sqlalchemy import Column, Integer, Unicode, DateTime, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime, timezone

class Order(Base):
    __tablename__ = "Orders"

    ord_id = Column(Integer, primary_key=True, index=True)
    ord_code = Column(Unicode(50), unique=True, nullable=False)
    ord_cus_id = Column(Integer, ForeignKey("Customers.cus_id"), nullable=True)
    ord_whs_id = Column(Integer, ForeignKey("Warehouses.whs_id"), nullable=True)  #คลังที่ส่งของ
    ord_date = Column(DateTime, default=datetime.now(timezone.utc))  #วันที่สั่ง
    ord_delivery_date = Column(DateTime, nullable=True)              # วันที่จัดส่ง (optional)
    ord_status = Column(Unicode(20), default="pending")              # เช่น pending, shipped, delivered
    ord_total_amount = Column(Numeric(10, 2), default=0.00)
    ord_created_by = Column(Unicode(30))
    ord_created_at = Column(DateTime, default=datetime.now(timezone.utc))
    ord_updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    # ความสัมพันธ์กับ OrderDetails
    details = relationship("OrderDetail", back_populates="order", cascade="all, delete-orphan")
