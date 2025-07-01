from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session, joinedload
from datetime import datetime, timezone
from typing import List, Optional
from app.database import SessionLocal
from app import models
from app.schemas.product import ProductResponse
from pydantic import BaseModel, Field

router = APIRouter(prefix="/products", tags=["Products"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ✅ Schema สำหรับ POST/PUT
class ProductCreateRequest(BaseModel):
    prd_sku: str = Field(..., min_length=1)
    prd_name: str = Field(..., min_length=1)
    prd_category: str = Field(..., min_length=1)  # cat_code
    prd_unit_price: float
    prd_weight: float
    prd_qty: int
    prd_unit: str = Field(..., min_length=1)
    prd_created_by: str = Field(..., min_length=1)

# ✅ GET All Products (JOIN category)
@router.get("", response_model=List[ProductResponse])
@router.get("/", response_model=List[ProductResponse])
def get_all_products(
    field: Optional[str] = Query(None),
    query: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    q = db.query(models.Product).options(joinedload(models.Product.category))

    if field and query and query.strip():
        if field == "all":
            like_query = f"%{query.lower()}%"
            q = q.filter(
                (models.Product.prd_name.ilike(like_query)) |
                (models.Product.prd_category.ilike(like_query)) |
                (models.Product.prd_sku.ilike(like_query)) |
                (models.Product.prd_unit.ilike(like_query))
            )
        else:
            attr = getattr(models.Product, field, None)
            if attr is None:
                raise HTTPException(status_code=400, detail=f"Invalid search field: {field}")
            try:
                val = float(query) if '.' in query else int(query)
                q = q.filter(attr == val)
            except ValueError:
                q = q.filter(attr.ilike(f"%{query}%"))

    return q.order_by(models.Product.prd_id).all()

# ✅ POST Create
@router.post("", response_model=ProductResponse)
@router.post("/", response_model=ProductResponse)
def create_product(payload: ProductCreateRequest, db: Session = Depends(get_db)):
    if not payload.prd_category:
        raise HTTPException(status_code=400, detail="Product category is required.")

    # ✅ ตรวจสอบว่า category มีอยู่จริง
    category = db.query(models.Category).filter(models.Category.cat_code == payload.prd_category).first()
    if not category:
        raise HTTPException(status_code=400, detail="Invalid product category code.")

    now = datetime.now(timezone.utc).replace(tzinfo=None, microsecond=0)

    new_product = models.Product(
        prd_sku=payload.prd_sku,
        prd_name=payload.prd_name,
        prd_category=payload.prd_category,
        prd_unit_price=payload.prd_unit_price,
        prd_weight=payload.prd_weight,
        prd_qty=payload.prd_qty,
        prd_unit=payload.prd_unit,
        prd_created_by=payload.prd_created_by,
        prd_created_at=now,
        prd_updated_at=now
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

# ✅ PUT Update
@router.put("/{prd_id}", response_model=ProductResponse)
def update_product(prd_id: int, payload: ProductCreateRequest, db: Session = Depends(get_db)):
    if not payload.prd_category:
        raise HTTPException(status_code=400, detail="Product category is required.")

    # ✅ ตรวจสอบว่าหมวดหมู่มีอยู่จริง
    category = db.query(models.Category).filter(models.Category.cat_code == payload.prd_category).first()
    if not category:
        raise HTTPException(status_code=400, detail="Invalid product category code.")

    product = db.query(models.Product).filter(models.Product.prd_id == prd_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    product.prd_sku = payload.prd_sku
    product.prd_name = payload.prd_name
    product.prd_category = payload.prd_category
    product.prd_unit_price = payload.prd_unit_price
    product.prd_weight = payload.prd_weight
    product.prd_qty = payload.prd_qty
    product.prd_unit = payload.prd_unit
    product.prd_created_by = payload.prd_created_by
    product.prd_updated_at = datetime.now(timezone.utc).replace(tzinfo=None, microsecond=0)

    db.commit()
    db.refresh(product)
    return product

# ✅ DELETE
@router.delete("/{prd_id}")
def delete_product(prd_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.prd_id == prd_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return {"message": "Product deleted"}
