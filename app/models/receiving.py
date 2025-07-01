#  app/models/receiving.py

from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, Unicode, DateTime
from app.database import Base
from sqlalchemy.sql import func
from datetime import datetime

class Receiving(Base):
    __tablename__ = "Receivings"

    rcv_id = Column(Integer, primary_key=True, index=True)
    rcv_code = Column(Unicode(50), nullable=False)  #  รหัส Receiving เช่น RCV-YYMMDD-XXXX
    rcv_whs_id = Column(Integer, nullable=False)  #  FK ไปยัง Warehouse
    rcv_status = Column(Unicode(20), default="draft")  #  draft, pending, approved, received
    rcv_date = Column(DateTime, default=func.now())  #  วันที่รับจริง
    rcv_created_by = Column(Unicode(100))  #  ผู้สร้าง
    rcv_created_at = Column(DateTime, default=datetime.now)  #  เวลา create
    rcv_updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())  # ✔️ เวลา update
    rcv_updated_by = Column(Unicode(50), nullable=True)  #  ผู้แก้ไขล่าสุด

    #Relationship: 1 receiving มีหลาย detail
    details = relationship(
        "ReceivingDetail",
        back_populates="receiving",
        cascade="all, delete-orphan",
        foreign_keys="ReceivingDetail.rcvd_rcv_id"
    )
