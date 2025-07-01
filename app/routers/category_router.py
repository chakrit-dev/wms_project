# ✅ app/routers/category_router.py (แก้แบบ X)

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.database import get_db
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from datetime import datetime

router = APIRouter(
    prefix="/categories",  # ✅ จะทำให้ทุก route เริ่มต้นด้วย /categories
    tags=["Category"]
)

# ✅ generate hybrid cat_code เช่น COS01, SKN02
def generate_cat_code(cat_id: int, cat_name: str):
    prefix_map = {
        "เครื่องสำอาง": "COS",
        "ผลิตภัณฑ์ดูแลผิว": "SKN",
        "อาหารเสริม": "SUP",
        "สินค้าสุขภาพทั่วไป": "HLT",
        "อุปกรณ์เสริมความงาม": "ACC"
    }
    prefix = prefix_map.get(cat_name.strip(), "GEN")
    return f"{prefix}{str(cat_id).zfill(2)}"

# ✅ CREATE Category
@router.post("", response_model=CategoryResponse)
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    new_cat = Category(
        cat_name=category.cat_name,
        cat_description=category.cat_description,
    )
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)

    # generate cat_code AFTER getting ID
    new_cat.cat_code = generate_cat_code(new_cat.cat_id, new_cat.cat_name)
    db.commit()

    return new_cat

# ✅ GET all Categories
@router.get("", response_model=list[CategoryResponse])
def get_all_categories(db: Session = Depends(get_db)):
    return db.query(Category).order_by(Category.cat_id).all()

# ✅ GET Category by ID
@router.get("/{cat_id}", response_model=CategoryResponse)
def get_category(cat_id: int, db: Session = Depends(get_db)):
    cat = db.query(Category).filter(Category.cat_id == cat_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    return cat

# ✅ UPDATE Category
@router.put("/{cat_id}", response_model=CategoryResponse)
def update_category(cat_id: int, updated_data: CategoryUpdate, db: Session = Depends(get_db)):
    cat = db.query(Category).filter(Category.cat_id == cat_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")

    cat.cat_name = updated_data.cat_name
    cat.cat_description = updated_data.cat_description
    cat.cat_updated_at = datetime.utcnow()
    cat.cat_code = generate_cat_code(cat.cat_id, cat.cat_name)

    db.commit()
    db.refresh(cat)
    return cat

# ✅ DELETE Category
@router.delete("/{cat_id}")
def delete_category(cat_id: int, db: Session = Depends(get_db)):
    cat = db.query(Category).filter(Category.cat_id == cat_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")

    db.delete(cat)
    db.commit()
    return {"message": f"Category ID {cat_id} deleted successfully"}
