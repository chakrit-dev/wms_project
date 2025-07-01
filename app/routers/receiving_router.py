# 📄 app/routers/receiving_router.py (แบบ X)

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database import get_db
from app.models.receiving import Receiving
from app import schemas
from app.services.receiving_service import (
    create_receiving,
    get_all_receivings,
    get_receiving,
    update_receiving,
    receive_to_inventory,
    generate_receiving_code,
)

router = APIRouter(
    prefix="/receivings",
    tags=["Receivings"]
)

# 📌 Preview receiving code (ใช้ logic จริง)
@router.get("/preview-code")
def preview_receiving_code(db: Session = Depends(get_db)):
    code = generate_receiving_code(db)
    return {"rcv_code": code}

# ✅ สร้าง Receiving + ReceivingDetails + อัปเดต stock (ถ้า approved)
@router.post("/", response_model=schemas.ReceivingResponse, response_model_exclude_none=True)
@router.post("", response_model=schemas.ReceivingResponse, response_model_exclude_none=True)
def create_receiving_endpoint(data: schemas.ReceivingCreate, db: Session = Depends(get_db)):
    receiving = create_receiving(db, data)
    if receiving.rcv_status == "approved":
        receive_to_inventory(db, receiving.rcv_id)
    return receiving

# ✅ GET: รายการ Receiving ทั้งหมด + search
@router.get("/", response_model=list[schemas.ReceivingResponse], response_model_exclude_none=True)
@router.get("", response_model=list[schemas.ReceivingResponse], response_model_exclude_none=True)
def list_receivings(
    db: Session = Depends(get_db),
    search_query: str = Query('', alias='search_query'),
    search_field: str = Query('all', alias='search_field')
):
    return get_all_receivings(db, search_query, search_field)

# ✅ GET: รายการรายตัว (ใช้ในหน้า detail)
@router.get("/{rcv_id}", response_model=schemas.ReceivingResponse, response_model_exclude_none=True)
def get_receiving_detail(rcv_id: int, db: Session = Depends(get_db)):
    receiving = get_receiving(db, rcv_id)
    if not receiving:
        raise HTTPException(status_code=404, detail="Receiving not found")
    return receiving

# ✅ POST: อัปเดตสินค้าเข้า inventory (approve)
@router.post("/{rcv_id}/receive-to-inventory")
def receive_to_inventory_endpoint(rcv_id: int, db: Session = Depends(get_db)):
    result = receive_to_inventory(db, rcv_id)
    if not result:
        raise HTTPException(status_code=400, detail="Invalid or already completed")
    return {"message": "✅ Inventory updated from receiving"}

# ✅ PUT: อัปเดต receiving
@router.put("/{rcv_id}", response_model=schemas.ReceivingResponse, response_model_exclude_none=True)
def update_receiving_endpoint(rcv_id: int, data: schemas.ReceivingUpdate, db: Session = Depends(get_db)):
    return update_receiving(db, rcv_id, data)

# ✅ DELETE: ลบ receiving ถ้าอยู่ในสถานะที่ลบได้
@router.delete("/{rcv_id}")
def delete_receiving(rcv_id: int, db: Session = Depends(get_db)):
    receiving = db.query(Receiving).filter(Receiving.rcv_id == rcv_id).first()
    if not receiving:
        raise HTTPException(status_code=404, detail="Receiving not found")
    if receiving.rcv_status not in ['draft', 'pending', 'cancelled']:
        raise HTTPException(status_code=400, detail="❌ Cannot delete this receiving")
    db.delete(receiving)
    db.commit()
    return {"message": "🗑️ Receiving deleted"}
