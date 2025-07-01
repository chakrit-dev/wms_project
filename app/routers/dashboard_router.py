# 📄 app/routers/dashboard_router.py (แก้ไขแบบ X)

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import cast, Date
from datetime import date
from typing import Dict, List
from app.database import get_db
from app import models  # ปลอดภัยจาก circular import

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

# ✅ รองรับทั้ง /dashboard/summary และ /dashboard/summary/
@router.get("/summary")
@router.get("/summary/")
def dashboard_summary(db: Session = Depends(get_db)) -> Dict[str, int]:
    try:
        today = date.today()
        return {
            "totalProducts": db.query(models.Product).count(),
            "totalUsers": db.query(models.Userlogin).count(),
            "totalWarehouses": db.query(models.Warehouse).count(),
            "totalCustomers": db.query(models.Customer).count(),
            "totalOrders": db.query(models.Order).count(),
            "deliveriesToday": db.query(models.Delivery)
                .filter(cast(models.Delivery.deli_date, Date) == today)
                .count(),
            "pendingDeliveries": db.query(models.Order)
                .filter(models.Order.ord_status == "รอดำเนินการ")
                .count()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ✅ รองรับทั้ง /dashboard/movements และ /dashboard/movements/
@router.get("/movements")
@router.get("/movements/")
def dashboard_movements() -> List[Dict[str, str]]:
    return [
        {"product": "สบู่เหลว", "warehouse": "คลังหลัก", "status": "รับเข้า"},
        {"product": "น้ำดื่ม", "warehouse": "คลังย่อย", "status": "เบิกออก"},
        {"product": "กล่องลัง", "warehouse": "คลัง A", "status": "รับเข้า"},
    ]
