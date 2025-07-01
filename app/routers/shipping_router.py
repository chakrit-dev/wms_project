# 📄 app/routers/shipping_router.py (แก้แบบ X)

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database import get_db
from app.models.shipping import Shipping
from app import schemas
from app.services.shipping_service import (
    create_shipping,
    get_all_shippings,
    get_shipping,
    update_shipping,
    generate_shipping_code,
    ship_from_inventory,
)

router = APIRouter(
    prefix="/shippings",
    tags=["Shippings"]
)

# ✅ Preview shipping code
@router.get("/generate-code")
def preview_shipping_code(db: Session = Depends(get_db)):
    code = generate_shipping_code(db)
    return {"shp_code": code}

# ✅ สร้าง Shipping + ShippingDetails + ตัด stock ถ้า shipped
@router.post("/", response_model=schemas.ShippingResponse, response_model_exclude_none=True)
@router.post("", response_model=schemas.ShippingResponse, response_model_exclude_none=True)
def create_shipping_endpoint(data: schemas.ShippingCreate, db: Session = Depends(get_db)):
    shipping = create_shipping(db, data)
    if shipping.shp_status == "shipped":
        ship_from_inventory(db, shipping.shp_id)
    return shipping

# ✅ GET ทั้งหมด + search
@router.get("/", response_model=list[schemas.ShippingResponse], response_model_exclude_none=True)
@router.get("", response_model=list[schemas.ShippingResponse], response_model_exclude_none=True)
def list_shippings(
    db: Session = Depends(get_db),
    search_query: str = Query('', alias='search_query'),
    search_field: str = Query('all', alias='search_field')
):
    return get_all_shippings(db, search_query, search_field)

# ✅ GET รายตัว
@router.get("/{shp_id}", response_model=schemas.ShippingResponse, response_model_exclude_none=True)
def get_shipping_detail(shp_id: int, db: Session = Depends(get_db)):
    shipping = get_shipping(db, shp_id)
    if not shipping:
        raise HTTPException(status_code=404, detail="Shipping not found")
    return shipping

# ✅ POST: ตัด stock manual
@router.post("/{shp_id}/ship-from-inventory")
def ship_from_inventory_endpoint(shp_id: int, db: Session = Depends(get_db)):
    result = ship_from_inventory(db, shp_id)
    if not result:
        raise HTTPException(status_code=400, detail="❌ Already shipped or invalid")
    return {"message": "🚚 Inventory deducted from shipping"}

# ✅ PUT
@router.put("/{shp_id}", response_model=schemas.ShippingResponse, response_model_exclude_none=True)
def update_shipping_endpoint(shp_id: int, data: schemas.ShippingCreate, db: Session = Depends(get_db)):
    return update_shipping(db, shp_id, data)

# ✅ DELETE เฉพาะ pending/draft
@router.delete("/{shp_id}")
def delete_shipping(shp_id: int, db: Session = Depends(get_db)):
    shipping = db.query(Shipping).filter(Shipping.shp_id == shp_id).first()
    if not shipping:
        raise HTTPException(status_code=404, detail="Shipping not found")
    if shipping.shp_status not in ['pending', 'draft', 'cancelled']:
        raise HTTPException(status_code=400, detail="❌ Cannot delete this shipping")
    db.delete(shipping)
    db.commit()
    return {"message": "🗑️ Shipping deleted"}
