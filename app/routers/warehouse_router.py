from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from typing import List, Optional
from app.database import SessionLocal
from app import models
from app.schemas.warehouse import WarehouseResponse
from pydantic import BaseModel

router = APIRouter(prefix="/warehouses", tags=["Warehouses"])

# ✅ DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ✅ Pydantic สำหรับ Create/Update
class WarehouseCreateRequest(BaseModel):
    whs_code: Optional[str] = None  # ✅ เพิ่ม whs_code
    whs_name: str
    whs_addr: Optional[str] = None
    whs_capacity: Optional[int] = None
    whs_phone: Optional[str] = None
    whs_status: Optional[str] = "active"
    whs_created_by: Optional[str] = "unknown"

# ✅ GET All warehouses (with optional search)
@router.get("/", response_model=List[WarehouseResponse], response_model_exclude_none=True)
@router.get("", response_model=List[WarehouseResponse], response_model_exclude_none=True)
def get_all_warehouses(
    field: Optional[str] = Query("all"),
    query: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    q = db.query(models.Warehouse)

    if query and query.strip():
        like_query = f"%{query.strip().lower()}%"
        if field == "all":
            q = q.filter(
                models.Warehouse.whs_code.ilike(like_query) |  # ✅ เพิ่ม
                models.Warehouse.whs_name.ilike(like_query) |
                models.Warehouse.whs_addr.ilike(like_query) |
                models.Warehouse.whs_phone.ilike(like_query) |
                models.Warehouse.whs_status.ilike(like_query)
            )
        else:
            attr = getattr(models.Warehouse, field, None)
            if attr is None:
                raise HTTPException(status_code=400, detail=f"Invalid search field: {field}")
            q = q.filter(attr.ilike(like_query))

    return q.order_by(models.Warehouse.whs_id).all()

# ✅ POST Create warehouse
@router.post("/", response_model=WarehouseResponse, response_model_exclude_none=True)
@router.post("", response_model=WarehouseResponse, response_model_exclude_none=True)
def create_warehouse(payload: WarehouseCreateRequest, db: Session = Depends(get_db)):
    now = datetime.now(timezone.utc).replace(tzinfo=None, microsecond=0)
    new_warehouse = models.Warehouse(
        whs_code=payload.whs_code,  # ✅ เพิ่ม
        whs_name=payload.whs_name,
        whs_addr=payload.whs_addr,
        whs_capacity=payload.whs_capacity,
        whs_phone=payload.whs_phone,
        whs_status=payload.whs_status,
        whs_created_by=payload.whs_created_by,
        whs_created_at=now,
        whs_updated_at=now
    )
    db.add(new_warehouse)
    db.commit()
    db.refresh(new_warehouse)
    return new_warehouse

# ✅ PUT Update warehouse
@router.put("/{whs_id}", response_model=WarehouseResponse, response_model_exclude_none=True)
def update_warehouse(whs_id: int, payload: WarehouseCreateRequest, db: Session = Depends(get_db)):
    warehouse = db.query(models.Warehouse).filter(models.Warehouse.whs_id == whs_id).first()
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found")

    warehouse.whs_code = payload.whs_code  # ✅ เพิ่ม
    warehouse.whs_name = payload.whs_name
    warehouse.whs_addr = payload.whs_addr
    warehouse.whs_capacity = payload.whs_capacity
    warehouse.whs_phone = payload.whs_phone
    warehouse.whs_status = payload.whs_status
    warehouse.whs_updated_at = datetime.now(timezone.utc).replace(tzinfo=None, microsecond=0)

    db.commit()
    db.refresh(warehouse)
    return warehouse

# ✅ DELETE Warehouse
@router.delete("/{whs_id}")
def delete_warehouse(whs_id: int, db: Session = Depends(get_db)):
    warehouse = db.query(models.Warehouse).filter(models.Warehouse.whs_id == whs_id).first()
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found")
    db.delete(warehouse)
    db.commit()
    return {"message": "🗑️ Warehouse deleted"}
