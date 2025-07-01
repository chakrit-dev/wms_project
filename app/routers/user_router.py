# ✅ user_router.py (ฉบับเต็ม แบบ X)
from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, cast, String
from datetime import datetime
from typing import List
from app.database import get_db
from app.models.user import Userlogin
from app.models.user_update_log import UserUpdateLog
from app.schemas.auth import RegisterRequest
from app.schemas import UserResponse, UserUpdateLogResponse
from app.utils.hashing import hash_password
from app.utils.jwt_token import get_current_user

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.get("", response_model=List[UserResponse])
@router.get("/", response_model=List[UserResponse])
def get_users(
    search_query: str = Query("", alias="search_query"),
    search_field: str = Query("all", alias="search_field"),
    db: Session = Depends(get_db)
):
    query = search_query.lower()
    field_map = {
        "usl_id": Userlogin.usl_id,
        "usl_username": Userlogin.usl_username,
        "usl_firstname": Userlogin.usl_firstname,
        "usl_lastname": Userlogin.usl_lastname,
        "usl_email": Userlogin.usl_email,
        "usl_phone": Userlogin.usl_phone,
        "usl_role": Userlogin.usl_role,
        "usl_requested_role": Userlogin.usl_requested_role
    }

    if search_field != "all" and search_field not in field_map:
        raise HTTPException(status_code=400, detail="Invalid search field")

    if query:
        if search_field == "all":
            users = db.query(Userlogin).filter(
                or_(
                    cast(Userlogin.usl_id, String).ilike(f"%{query}%"),
                    Userlogin.usl_username.ilike(f"%{query}%"),
                    Userlogin.usl_firstname.ilike(f"%{query}%"),
                    Userlogin.usl_lastname.ilike(f"%{query}%"),
                    Userlogin.usl_email.ilike(f"%{query}%"),
                    Userlogin.usl_phone.ilike(f"%{query}%"),
                    cast(Userlogin.usl_role, String).ilike(f"%{query}%"),
                    cast(Userlogin.usl_requested_role, String).ilike(f"%{query}%")
                )
            ).all()
        else:
            column = field_map[search_field]
            users = db.query(Userlogin).filter(cast(column, String).ilike(f"%{query}%")).all()
    else:
        users = db.query(Userlogin).all()

    return [UserResponse.model_validate(u) for u in users]

@router.post("/", response_model=UserResponse)
def create_user(
    payload: RegisterRequest,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    username = payload.username.strip().lower()
    email = payload.email.strip().lower()

    if db.query(Userlogin).filter(Userlogin.usl_username == username).first():
        raise HTTPException(status_code=409, detail="Username already exists")
    if db.query(Userlogin).filter(Userlogin.usl_email == email).first():
        raise HTTPException(status_code=409, detail="Email already exists")

    now = datetime.now()
    new_user = Userlogin(
        usl_username=username,
        usl_email=email,
        usl_passwd=hash_password(payload.password or "default1234"),
        usl_role=payload.role,
        usl_requested_role=payload.role,
        usl_firstname=payload.firstname,
        usl_lastname=payload.lastname,
        usl_phone=payload.phone,
        usl_created_at=now,
        usl_updated_at=now
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return UserResponse.model_validate(new_user)

@router.put("/{usl_id}", response_model=UserResponse)
def update_user(
    usl_id: int,
    payload: RegisterRequest,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    user = db.query(Userlogin).filter(Userlogin.usl_id == usl_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_username = payload.username.strip().lower()
    new_email = payload.email.strip().lower()

    if db.query(Userlogin).filter(Userlogin.usl_username == new_username, Userlogin.usl_id != usl_id).first():
        raise HTTPException(status_code=409, detail="Username already exists")
    if db.query(Userlogin).filter(Userlogin.usl_email == new_email, Userlogin.usl_id != usl_id).first():
        raise HTTPException(status_code=409, detail="Email already exists")

    user.usl_username = new_username
    user.usl_email = new_email
    user.usl_role = payload.role
    user.usl_requested_role = payload.role
    user.usl_firstname = payload.firstname
    user.usl_lastname = payload.lastname
    user.usl_phone = payload.phone
    user.usl_updated_at = datetime.now()

    log = UserUpdateLog(
        ulog_user_id=usl_id,
        ulog_usl_username=new_username,
        ulog_updated_by=current_user,
        ulog_note=f"Updated role to {payload.role}"
    )
    db.add(log)

    db.commit()
    db.refresh(user)
    return UserResponse.model_validate(user)

@router.put("/approve/{usl_id}")
def approve_user(
    usl_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    user = db.query(Userlogin).filter(Userlogin.usl_id == usl_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.usl_role:
        raise HTTPException(status_code=400, detail="User already approved.")
    if not user.usl_requested_role:
        raise HTTPException(status_code=400, detail="No requested role to approve.")

    user.usl_role = user.usl_requested_role
    user.usl_updated_at = datetime.now()

    log = UserUpdateLog(
        ulog_user_id=usl_id,
        ulog_usl_username=user.usl_username,
        ulog_updated_by=current_user,
        ulog_note=f"Approved user (role: {user.usl_role})"
    )
    db.add(log)

    db.commit()
    return {"message": f"User '{user.usl_username}' approved as {user.usl_role}."}

@router.delete("/{usl_id}")
def delete_user(
    usl_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    user = db.query(Userlogin).filter(Userlogin.usl_id == usl_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.usl_username == current_user:
        raise HTTPException(status_code=400, detail="You cannot delete yourself.")

    db.delete(user)
    db.commit()
    return {"message": "User deleted"}

# ✅ เพิ่ม REJECT แบบ X
@router.delete("/reject/{usl_id}")
def reject_user(
    usl_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    user = db.query(Userlogin).filter(Userlogin.usl_id == usl_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.usl_role:
        raise HTTPException(status_code=400, detail="Cannot reject an already approved user.")

    log = UserUpdateLog(
        ulog_user_id=usl_id,
        ulog_usl_username=user.usl_username,
        ulog_updated_by=current_user,
        ulog_note="Rejected user registration"
    )
    db.add(log)
    db.delete(user)
    db.commit()

    return {"message": f"User '{user.usl_username}' rejected and deleted from the system."}

@router.get("/user-update-logs", response_model=List[UserUpdateLogResponse])
def get_user_update_logs(db: Session = Depends(get_db)):
    logs = db.query(UserUpdateLog).order_by(UserUpdateLog.ulog_update_time.desc()).all()
    return logs
