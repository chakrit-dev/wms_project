from sqlalchemy import Column, Integer, String, Float, Unicode, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime, timezone

class Product(Base):
    __tablename__ = "Products"

    prd_id = Column(Integer, primary_key=True, index=True)
    prd_sku = Column(Unicode(50), unique=True, nullable=False)
    prd_name = Column(Unicode(100), nullable=False)

    # ✅ Foreign Key → Categories.cat_code
    prd_category = Column(Unicode(50), ForeignKey("Categories.cat_code"))

    prd_unit_price = Column(Float)
    prd_weight = Column(Float)
    prd_qty = Column(Integer)
    prd_unit = Column(Unicode(30))
    prd_created_by = Column(Unicode(50))
    prd_created_at = Column(DateTime, default=datetime.now(timezone.utc))
    prd_updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    # ✅ JOIN ไปยัง Category
    category = relationship("Category", back_populates="products")

    # ความสัมพันธ์กับ OrderDetail
    order_details = relationship("OrderDetail", back_populates="product", cascade="all, delete-orphan")
