# utils/hashing.py
from passlib.context import CryptContext

# กำหนด context สำหรับ bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ฟังก์ชันเข้ารหัสรหัสผ่าน
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# ฟังก์ชันตรวจสอบรหัสผ่านที่ผู้ใช้กรอก ว่าตรงกับที่เข้ารหัสไว้หรือไม่
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
