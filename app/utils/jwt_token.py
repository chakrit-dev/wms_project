from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone
import os
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

# อ่านค่าจาก .env
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")  # ใช้สำหรับ get_current_user

#  สร้าง JWT Token สำหรับรีเซ็ตรหัสผ่าน
def create_reset_token(data: dict, expires_delta: int = 15):
    now = datetime.now(timezone.utc).replace(microsecond=0)
    expire = now + timedelta(minutes=expires_delta)
    to_encode = data.copy()
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

#  ตรวจสอบ JWT Token ที่ส่งมาจากลิงก์รีเซ็ตรหัสผ่าน
def verify_reset_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")  # คืนค่าชื่อผู้ใช้หรืออีเมลจาก token
    except JWTError:
        return None

#  สร้าง JWT Token สำหรับ Login
def create_access_token(data: dict, expires_minutes: int = 60):
    now = datetime.now(timezone.utc).replace(microsecond=0)
    expire = now + timedelta(minutes=expires_minutes)
    to_encode = data.copy()
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# ใช้ใน Depends เพื่อดึงชื่อผู้ใช้ที่ login จาก JWT token
def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token: no username in sub")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    

#  เพิ่ม role ลงไปใน payload ด้วย
def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=60)):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc).replace(microsecond=0) + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

