# 📄 services/shipping_service.py (โครงสร้างเหมือน receiving_service)

from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, or_
from datetime import datetime
import pytz
from fastapi import HTTPException
from app.models.shipping import Shipping, ShippingDetail
from app.models.inventory import Inventory
from app import schemas

# เวลาไทย

def get_bangkok_now():
    tz = pytz.timezone("Asia/Bangkok")
    return datetime.now(tz).replace(tzinfo=None)


def generate_shipping_code(db: Session):
    today_str = get_bangkok_now().strftime('%Y%m%d')
    prefix = f"SHP-{today_str}"
    count_today = db.query(func.count()).filter(
        Shipping.shp_code.like(f"{prefix}-%")
    ).scalar()
    running = f"{count_today + 1:04d}"
    return f"{prefix}-{running}"


def create_shipping(db: Session, data: schemas.ShippingCreate):
    shp_code = generate_shipping_code(db)
    now = get_bangkok_now()

    shipping = Shipping(
        shp_code=shp_code,
        shp_customer_id=data.shp_customer_id,
        shp_vehicle_no=data.shp_vehicle_no,
        shp_driver_name=data.shp_driver_name,
        shp_status=data.shp_status,
        shp_created_by=data.shp_created_by,
        shp_updated_by=data.shp_created_by,
        shp_created_at=now,
        shp_updated_at=now
    )
    db.add(shipping)
    db.flush()

    for item in data.details:
        detail = ShippingDetail(
            shpd_shp_id=shipping.shp_id,
            shpd_prd_id=item.shpd_prd_id,
            shpd_qty=item.shpd_qty,
            shpd_unit_price=item.shpd_unit_price,
            shpd_status=item.shpd_status,
            shpd_expiry_date=item.shpd_expiry_date,
            shpd_created_by=data.shp_created_by,
            shpd_created_at=now,
            shpd_updated_at=now
        )
        db.add(detail)

    db.commit()
    db.refresh(shipping)
    return shipping


def get_shipping(db: Session, shp_id: int):
    return db.query(Shipping)\
        .options(joinedload(Shipping.details))\
        .filter_by(shp_id=shp_id).first()


def get_all_shippings(db: Session, search_query: str = '', search_field: str = 'all'):
    query = db.query(Shipping).options(joinedload(Shipping.details))
    if search_query:
        q = f"%{search_query.lower()}%"
        if search_field == "shp_code":
            query = query.filter(func.lower(Shipping.shp_code).like(q))
        elif search_field == "shp_status":
            query = query.filter(func.lower(Shipping.shp_status).like(q))
        else:
            query = query.filter(
                or_(
                    func.lower(Shipping.shp_code).like(q),
                    func.lower(Shipping.shp_status).like(q),
                )
            )
    return query.order_by(Shipping.shp_created_at.desc()).all()


def ship_from_inventory(db: Session, shp_id: int):
    shipping = db.query(Shipping)\
        .options(joinedload(Shipping.details))\
        .filter_by(shp_id=shp_id).first()

    if not shipping:
        return None

    if shipping.shp_status == 'shipped':
        return None

    now = get_bangkok_now()

    for item in shipping.details:
        inventory = db.query(Inventory).filter_by(
            inv_prd_id=item.shpd_prd_id,
            inv_status='available'
        ).order_by(Inventory.inv_expiry_date.asc()).first()

        if not inventory or inventory.inv_qty < item.shpd_qty:
            raise HTTPException(status_code=400, detail=f"ไม่พอสำหรับ {item.shpd_prd_id}")

        inventory.inv_qty -= item.shpd_qty
        inventory.inv_updated_at = now

    shipping.shp_status = 'shipped'
    shipping.shp_updated_at = now

    db.commit()
    db.refresh(shipping)
    return shipping


def update_shipping(db: Session, shp_id: int, data: schemas.ShippingCreate):
    shipping = db.query(Shipping).filter_by(shp_id=shp_id).first()
    if not shipping:
        raise HTTPException(status_code=404, detail="Shipping not found")

    now = get_bangkok_now()

    shipping.shp_customer_id = data.shp_customer_id
    shipping.shp_vehicle_no = data.shp_vehicle_no
    shipping.shp_driver_name = data.shp_driver_name
    shipping.shp_status = data.shp_status
    shipping.shp_updated_at = now
    shipping.shp_updated_by = data.shp_created_by

    db.query(ShippingDetail).filter_by(shpd_shp_id=shp_id).delete()

    for item in data.details:
        new_detail = ShippingDetail(
            shpd_shp_id=shp_id,
            shpd_prd_id=item.shpd_prd_id,
            shpd_qty=item.shpd_qty,
            shpd_unit_price=item.shpd_unit_price,
            shpd_status=item.shpd_status,
            shpd_expiry_date=item.shpd_expiry_date,
            shpd_created_by=data.shp_created_by,
            shpd_created_at=now,
            shpd_updated_at=now
        )
        db.add(new_detail)

    db.commit()
    db.refresh(shipping)
    return shipping
