from sqlalchemy import Column, Integer, String, DateTime, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime, timezone

class Inventory(Base):
    __tablename__ = "Inventories"

    inv_id = Column(Integer, primary_key=True, index=True)
    inv_whs_id = Column(Integer, ForeignKey("Warehouses.whs_id"), nullable=False)
    inv_prd_id = Column(Integer, ForeignKey("Products.prd_id"), nullable=False)
    inv_qty = Column(Integer, nullable=False)
    inv_unit_price = Column(Numeric(10, 2), default=0.00)
    inv_location_bin = Column(String(20), default='A')
    inv_status = Column(String(30), default='available')
    inv_expiry_date = Column(DateTime, nullable=True)

    inv_min_threshold = Column(Integer, default=5)
    inv_max_capacity = Column(Integer, default=0)

    inv_created_by = Column(String(100), nullable=True)
    inv_created_at = Column(DateTime, default=datetime.now(timezone.utc))
    inv_updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    # ✅ ความสัมพันธ์
    product = relationship("Product", backref="inventories")
    warehouse = relationship("Warehouse", backref="inventories")  # ✅ เพิ่มสำหรับ warehouse_name

    def is_below_threshold(self) -> bool:
        return self.inv_qty < self.inv_min_threshold

    def deduct(self, qty: int) -> bool:
        if self.inv_qty >= qty:
            self.inv_qty -= qty
            return True
        return False
