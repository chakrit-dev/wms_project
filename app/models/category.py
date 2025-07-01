from sqlalchemy import Column, Integer, Unicode, DateTime
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime, timezone

class Category(Base):
    __tablename__ = "Categories"

    cat_id = Column(Integer, primary_key=True, index=True)
    cat_code = Column(Unicode(10), unique=True, nullable=False)
    cat_name = Column(Unicode(100), nullable=False)
    cat_description = Column(Unicode(255))
    cat_created_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    cat_updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    # ✅ เพิ่มความสัมพันธ์ย้อนกลับจาก Category → Products
    products = relationship("Product", back_populates="category")
