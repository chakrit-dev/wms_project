from sqlalchemy import Column, Integer, String,Unicode
from app.database import Base

# models/acl_role_permission.py
from sqlalchemy import Column, Integer, ForeignKey
from app.database import Base

class ACLRolePermission(Base):
    __tablename__ = 'ACL_RolePermissions'

    id = Column(Integer, primary_key=True, index=True)
    role_name = Column(Unicode(50), nullable=False)  # เช่น 'admin', 'warehouse'
    perm_code = Column(Unicode(50), ForeignKey("ACL_Permission.perm_code"), nullable=False)