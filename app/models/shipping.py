# 📄 app/models/shipping.py

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, DECIMAL, Date
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime, timezone

class Shipping(Base):
    __tablename__ = "Shippings"

    shp_id = Column(Integer, primary_key=True, index=True)
    shp_code = Column(String(20), unique=True, nullable=False)
    shp_customer_id = Column(Integer, ForeignKey("Customers.cus_id"), nullable=False)
    shp_vehicle_no = Column(String(20), nullable=False)
    shp_driver_name = Column(String(100), nullable=False)
    shp_status = Column(String(20), default="pending")
    shp_created_at = Column(DateTime, default=datetime.now(timezone.utc))
    shp_updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    customer = relationship("Customer", backref="shippings")  # ต้องมี Customer model ด้วย
    details = relationship("ShippingDetail", back_populates="shipping", cascade="all, delete-orphan")


class ShippingDetail(Base):
    __tablename__ = "ShippingDetails"

    shpd_id = Column(Integer, primary_key=True, index=True)
    shpd_shp_id = Column(Integer, ForeignKey("Shippings.shp_id"), nullable=False)
    shpd_prd_id = Column(Integer, ForeignKey("Products.prd_id"), nullable=False)
    shpd_qty = Column(Integer, nullable=False)
    shpd_unit_price = Column(DECIMAL(10, 2), default=0.00)
    shpd_status = Column(String(20), default="normal")
    shpd_expiry_date = Column(Date, nullable=True)

    shipping = relationship("Shipping", back_populates="details")
    product = relationship("Product")  # ต้องมี Product model ด้วย
