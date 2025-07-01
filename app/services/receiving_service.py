from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, or_
from datetime import datetime
import pytz
from fastapi import HTTPException
from app.models.receiving import Receiving
from app.models.receiving_detail import ReceivingDetail
from app.models.inventory import Inventory
from app import schemas

#  ใช้เวลาแบบประเทศไทย
def get_bangkok_now():
    tz = pytz.timezone("Asia/Bangkok")
    return datetime.now(tz).replace(tzinfo=None)  #  ตัด tzinfo ออก

# ใช้เวลาไทยในการสร้างเลข code
def generate_receiving_code(db: Session):
    today_str = get_bangkok_now().strftime('%Y%m%d')
    prefix = f"RCV-{today_str}"
    count_today = db.query(func.count()).filter(
        Receiving.rcv_code.like(f"{prefix}-%")
    ).scalar()
    running = f"{count_today + 1:04d}"
    return f"{prefix}-{running}"

def create_receiving(db: Session, data: schemas.ReceivingCreate):
    rcv_code = generate_receiving_code(db)
    now = get_bangkok_now()

    receiving = Receiving(
        rcv_code=rcv_code,
        rcv_whs_id=data.rcv_whs_id,
        rcv_status=data.rcv_status,
        rcv_date=now,
        rcv_created_by=data.rcv_created_by,
        rcv_created_at=now,
        rcv_updated_at=now,
        rcv_updated_by=data.rcv_created_by
    )
    db.add(receiving)
    db.flush()

    for item in data.details:
        detail = ReceivingDetail(
            rcvd_rcv_id=receiving.rcv_id,
            rcvd_prd_id=item.rcvd_prd_id,
            rcvd_qty=item.rcvd_qty,
            rcvd_unit_price=item.rcvd_unit_price,
            rcvd_expiry_date=item.rcvd_expiry_date,
            rcvd_unit=item.rcvd_unit,
            rcvd_created_by=data.rcv_created_by,
            rcvd_created_at=now,
            rcvd_updated_at=now
        )
        db.add(detail)

    db.commit()
    db.refresh(receiving)
    return receiving

def get_receiving(db: Session, rcv_id: int):
    return db.query(Receiving)\
        .options(joinedload(Receiving.details).joinedload(ReceivingDetail.product))\
        .filter_by(rcv_id=rcv_id).first()

def get_all_receivings(db: Session, search_query: str = '', search_field: str = 'all'):
    query = db.query(Receiving).options(joinedload(Receiving.details))
    if search_query:
        q = f"%{search_query.lower()}%"
        if search_field == "rcv_code":
            query = query.filter(func.lower(Receiving.rcv_code).like(q))
        elif search_field == "rcv_status":
            query = query.filter(func.lower(Receiving.rcv_status).like(q))
        else:
            query = query.filter(
                or_(
                    func.lower(Receiving.rcv_code).like(q),
                    func.lower(Receiving.rcv_status).like(q),
                )
            )
    return query.order_by(Receiving.rcv_date.desc()).all()

def receive_to_inventory(db: Session, rcv_id: int):
    receiving = db.query(Receiving)\
        .options(joinedload(Receiving.details))\
        .filter_by(rcv_id=rcv_id).first()
    if not receiving:
        return None

    if receiving.rcv_status == 'received':
        return None

    now = get_bangkok_now()

    for item in receiving.details:
        existing = db.query(Inventory).filter_by(
            inv_whs_id=receiving.rcv_whs_id,
            inv_prd_id=item.rcvd_prd_id
        ).first()

        if existing:
            existing.inv_qty += item.rcvd_qty
            existing.inv_updated_at = now
        else:
            new_inv = Inventory(
                inv_whs_id=receiving.rcv_whs_id,
                inv_prd_id=item.rcvd_prd_id,
                inv_qty=item.rcvd_qty,
                inv_unit_price=item.rcvd_unit_price,
                inv_location_bin="A",
                inv_status="available",
                inv_expiry_date=item.rcvd_expiry_date,
                inv_created_by=receiving.rcv_updated_by or receiving.rcv_created_by,
                inv_updated_at=now,
                inv_created_at=now
            )
            db.add(new_inv)

    receiving.rcv_status = "received"
    receiving.rcv_updated_at = now

    db.commit()
    db.refresh(receiving)
    return receiving

def update_receiving(db: Session, rcv_id: int, data: schemas.ReceivingUpdate):
    receiving = db.query(Receiving).filter_by(rcv_id=rcv_id).first()
    if not receiving:
        raise HTTPException(status_code=404, detail="Receiving not found")

    now = get_bangkok_now()

    receiving.rcv_code = data.rcv_code
    receiving.rcv_date = data.rcv_date or now
    receiving.rcv_whs_id = data.rcv_whs_id
    receiving.rcv_status = data.rcv_status
    receiving.rcv_updated_at = now
    receiving.rcv_updated_by = data.rcv_updated_by

    db.query(ReceivingDetail).filter_by(rcvd_rcv_id=rcv_id).delete()

    for item in data.details:
        new_detail = ReceivingDetail(
            rcvd_rcv_id=rcv_id,
            rcvd_prd_id=item.rcvd_prd_id,
            rcvd_qty=item.rcvd_qty,
            rcvd_unit_price=item.rcvd_unit_price,
            rcvd_expiry_date=item.rcvd_expiry_date,
            rcvd_unit=item.rcvd_unit,
            rcvd_created_by=data.rcv_updated_by,
            rcvd_created_at=now,
            rcvd_updated_at=now
        )
        db.add(new_detail)

    db.commit()
    db.refresh(receiving)
    return receiving
