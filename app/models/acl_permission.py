# ต้องตรงกับชื่อ class ที่สร้างไว้จริงใน models
from sqlalchemy import Column, Integer, String,Unicode
from app.database import Base


class ACL_Permission(Base):
    __tablename__ = "ACL_Permissions"

    perm_id = Column(Integer, primary_key=True, index=True)
    perm_code = Column(Unicode(50), nullable=False, unique=True)
    perm_desc = Column(Unicode(100), nullable=True)


# แก้ชื่อไฟล์ให้ถูกต้อง: `app/models/acl_permission.py`
# แก้ชื่อ import ที่ auth_router.py แบบนี้:
# from app.models.acl_permission import ACLPermission
