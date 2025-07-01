# app/services/inventory_service.py
from sqlalchemy.orm import Session
from app.models.inventory import Inventory
from datetime import datetime,timezone

def increase_inventory(db: Session, whs_id: int, prd_id: int, qty: int, unit_price: float, expiry_date=None):
    existing = db.query(Inventory).filter_by(inv_whs_id=whs_id, inv_prd_id=prd_id).first()
    if existing:
        existing.inv_qty += qty
        existing.inv_unit_price = unit_price
        existing.inv_expiry_date = expiry_date or existing.inv_expiry_date
        existing.inv_updated_at = datetime.utcnow()
    else:
        new_inv = Inventory(
            inv_whs_id=whs_id,
            inv_prd_id=prd_id,
            inv_qty=qty,
            inv_unit_price=unit_price,
            inv_expiry_date=expiry_date,
            inv_status="in_stock",
            inv_location_bin="-",
            inv_created_at= datetime.now(timezone.utc).replace(tzinfo=None, microsecond=0),
            inv_updated_at=datetime.now(timezone.utc).replace(tzinfo=None, microsecond=0)
        )
        db.add(new_inv)
