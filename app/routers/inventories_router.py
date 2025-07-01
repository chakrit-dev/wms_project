from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.models.inventory import Inventory
from app.schemas.inventory import InventoryCreate, InventoryResponse
from typing import List
from datetime import datetime, timezone

router = APIRouter(prefix="/inventories", tags=["Inventories"])

@router.get("", response_model=List[InventoryResponse])
@router.get("/", response_model=List[InventoryResponse])
def get_all(db: Session = Depends(get_db)):
    inventories = db.query(Inventory)\
        .options(joinedload(Inventory.product), joinedload(Inventory.warehouse))\
        .all()

    result = []
    for inv in inventories:
        data = inv.__dict__.copy()
        data["prd_name"] = inv.product.prd_name if inv.product else None
        data["warehouse_name"] = inv.warehouse.whs_name if inv.warehouse else None  # ✅ เพิ่ม
        result.append(data)
    return result

@router.get("/low-stock", response_model=List[InventoryResponse])
def get_low_stock(db: Session = Depends(get_db)):
    inventories = db.query(Inventory)\
        .options(joinedload(Inventory.product), joinedload(Inventory.warehouse))\
        .filter(Inventory.inv_qty < Inventory.inv_min_threshold).all()

    result = []
    for inv in inventories:
        data = inv.__dict__.copy()
        data["prd_name"] = inv.product.prd_name if inv.product else None
        data["warehouse_name"] = inv.warehouse.whs_name if inv.warehouse else None
        result.append(data)
    return result

@router.post("/", response_model=InventoryResponse)
def create_inventory(payload: InventoryCreate, db: Session = Depends(get_db)):
    now = datetime.now(timezone.utc).replace(tzinfo=None, microsecond=0)
    inv = Inventory(**payload.dict(), inv_created_at=now, inv_updated_at=now)
    db.add(inv)
    db.commit()
    db.refresh(inv)

    data = inv.__dict__.copy()
    data["prd_name"] = inv.product.prd_name if inv.product else None
    data["warehouse_name"] = inv.warehouse.whs_name if inv.warehouse else None
    return data

@router.put("/{inv_id}", response_model=InventoryResponse)
def update_inventory(inv_id: int, payload: InventoryCreate, db: Session = Depends(get_db)):
    inv = db.query(Inventory)\
        .options(joinedload(Inventory.product), joinedload(Inventory.warehouse))\
        .filter(Inventory.inv_id == inv_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Inventory not found")

    for key, value in payload.dict().items():
        setattr(inv, key, value)
    inv.inv_updated_at = datetime.now(timezone.utc).replace(tzinfo=None, microsecond=0)

    db.commit()
    db.refresh(inv)

    data = inv.__dict__.copy()
    data["prd_name"] = inv.product.prd_name if inv.product else None
    data["warehouse_name"] = inv.warehouse.whs_name if inv.warehouse else None
    return data

@router.delete("/{inv_id}")
def delete_inventory(inv_id: int, db: Session = Depends(get_db)):
    inv = db.query(Inventory).filter(Inventory.inv_id == inv_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Inventory not found")
    db.delete(inv)
    db.commit()
    return {"message": "Inventory deleted"}

@router.post("/{inv_id}/deduct", response_model=InventoryResponse)
def deduct_stock(inv_id: int, qty: int = Query(..., gt=0), db: Session = Depends(get_db)):
    inv = db.query(Inventory)\
        .options(joinedload(Inventory.product), joinedload(Inventory.warehouse))\
        .filter(Inventory.inv_id == inv_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Inventory not found")
    if inv.inv_qty < qty:
        raise HTTPException(status_code=400, detail="❌ Stock not enough")

    inv.inv_qty -= qty
    inv.inv_updated_at = datetime.now(timezone.utc).replace(tzinfo=None, microsecond=0)

    db.commit()
    db.refresh(inv)

    data = inv.__dict__.copy()
    data["prd_name"] = inv.product.prd_name if inv.product else None
    data["warehouse_name"] = inv.warehouse.whs_name if inv.warehouse else None
    return data
