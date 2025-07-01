# 📄 app/routers/auth_router.py (แก้ไขแบบ X)

from fastapi import APIRouter, HTTPException, Depends, Body
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import datetime, timezone
from pydantic import BaseModel, EmailStr

from app.database import get_db
from app.models.user import Userlogin
from app.models.acl_permission import ACL_Permission
from app.utils.hashing import hash_password, verify_password
from app.utils.jwt_token import create_access_token, create_reset_token, verify_reset_token
from app.utils.email_sender import send_reset_email
from app.schemas import RegisterRequest, RegisterResponse

router = APIRouter(tags=["Auth"])

# ✅ LOGIN → ไม่ให้ login ถ้ายังไม่ approve
@router.post("/login")
@router.post("/login/")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(Userlogin).filter(Userlogin.usl_username == form_data.username).first()

    if not user or not verify_password(form_data.password, user.usl_passwd):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not user.usl_role:
        raise HTTPException(status_code=403, detail="Account is pending approval.")

    results = db.execute(
        text("""
            SELECT p.perm_code
            FROM ACL_RolePermissions rp
            JOIN ACL_Permissions p ON rp.perm_id = p.perm_id
            JOIN ACL_Roles r ON rp.role_id = r.role_id
            WHERE r.role_name = :role
        """),
        {"role": user.usl_role}
    ).fetchall()

    permissions = [row[0].lower() for row in results]

    token_payload = {
        "sub": user.usl_username,
        "role": user.usl_role,
        "permissions": permissions
    }
    token = create_access_token(token_payload)

    return {
        "access_token": token,
        "token_type": "bearer",
        "username": user.usl_username,
        "firstname": user.usl_firstname,
        "lastname": user.usl_lastname,
        "email": user.usl_email,
        "role": user.usl_role,
        "permissions": permissions
    }

#  Forgot Password
class EmailRequest(BaseModel):
    email: EmailStr

@router.post("/forgot-password")
def forgot_password(payload: EmailRequest, db: Session = Depends(get_db)):
    email = payload.email.strip().lower()
    user = db.query(Userlogin).filter(Userlogin.usl_email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email not found.")

    token = create_reset_token({"sub": user.usl_username})
    send_reset_email(email, token)
    return {"msg": "Reset link sent to your email."}

# Reset Password
@router.post("/reset-password")
def reset_password(
    token: str = Body(..., embed=True),
    new_password: str = Body(..., embed=True),
    db: Session = Depends(get_db)
):
    username = verify_reset_token(token)
    if not username:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    user = db.query(Userlogin).filter(Userlogin.usl_username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.usl_passwd = hash_password(new_password)
    user.usl_updated_at = datetime.now(timezone.utc).replace(tzinfo=None, microsecond=0)
    db.commit()
    return {"msg": "Password reset successful"}

# ✅ REGISTER
@router.post("/register", response_model=RegisterResponse)
@router.post("/register/", response_model=RegisterResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    username = payload.username.strip().lower()
    email = payload.email.strip().lower()

    if db.query(Userlogin).filter(Userlogin.usl_username == username).first():
        raise HTTPException(status_code=409, detail="Username already exists")
    if db.query(Userlogin).filter(Userlogin.usl_email == email).first():
        raise HTTPException(status_code=409, detail="Email already exists")

    now = datetime.now(timezone.utc).replace(tzinfo=None, microsecond=0)
    new_user = Userlogin(
        usl_username=username,
        usl_firstname=payload.firstname.strip(),
        usl_lastname=payload.lastname.strip(),
        usl_phone=payload.phone.strip(),
        usl_email=email,
        usl_passwd=hash_password(payload.password),
        usl_requested_role=payload.role,
        usl_role=None,
        usl_created_at=now,
        usl_updated_at=now
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully. Waiting for admin approval."}
