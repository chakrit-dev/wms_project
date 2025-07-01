from sqlalchemy import Column, Integer, Unicode, DateTime, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime, timezone

class OrderDetail(Base):
    __tablename__ = "OrderDetails"

    ordd_id = Column(Integer, primary_key=True, index=True)
    ordd_ord_id = Column(Integer, ForeignKey("Orders.ord_id"), nullable=False)
    ordd_prd_id = Column(Integer, ForeignKey("Products.prd_id"), nullable=False)
    ordd_prd_name = Column(Unicode(100), nullable=False)
    ordd_qty = Column(Integer, nullable=False)
    ordd_unit = Column(Unicode(50), nullable=True)
    ordd_unit_price = Column(Numeric(10, 2), nullable=False)
    ordd_discount = Column(Numeric(10, 2), default=0.00)
    ordd_created_by = Column(Unicode(30))
    ordd_created_at = Column(DateTime, default=datetime.now(timezone.utc))
    ordd_updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    # Relationship กลับไปยัง Order และ Product
    order = relationship("Order", back_populates="details")
    product = relationship("Product", back_populates="order_details")
