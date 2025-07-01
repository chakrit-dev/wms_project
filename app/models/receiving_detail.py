# 📄 app/models/receiving_detail.py

from sqlalchemy import Column, Integer, ForeignKey, Numeric, DateTime, Unicode
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base

class ReceivingDetail(Base):
    __tablename__ = "ReceivingDetails"

    rcvd_id = Column(Integer, primary_key=True, index=True)
    rcvd_rcv_id = Column(Integer, ForeignKey("Receivings.rcv_id"), nullable=False)  # FK ไปยัง Receiving
    rcvd_prd_id = Column(Integer, ForeignKey("Products.prd_id"), nullable=False)     # FK ไปยัง Product
    rcvd_qty = Column(Integer, nullable=False)  #  จำนวนที่รับ
    rcvd_unit_price = Column(Numeric(10, 2), nullable=False)  #  ราคาต่อหน่วย
    rcvd_unit = Column(Unicode(20), nullable=False)  #  หน่วยนับ เช่น pcs, box
    rcvd_expiry_date = Column(DateTime, nullable=True)  # วันหมดอายุ (ถ้ามี)

    rcvd_created_by = Column(Unicode(50), nullable=True)  # ใครเป็นคนเพิ่ม
    rcvd_created_at = Column(DateTime, default=datetime.now(timezone.utc))  # เวลาเพิ่ม
    rcvd_updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))  # ✔️ เวลาแก้

    #ความสัมพันธ์กับ Receiving
    receiving = relationship("Receiving", back_populates="details")

    # ความสัมพันธ์กับ Product (ใช้ preload ตอน show)
    product = relationship("Product")
