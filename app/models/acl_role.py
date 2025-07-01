# models/role.py
from sqlalchemy import Column, Integer, String
from app.database import Base

class Role(Base):
    __tablename__ = "ACL_Roles"

    role_id = Column(Integer, primary_key=True, index=True)
    role_name = Column(String(50), unique=True, nullable=False)

    def __repr__(self):
        return f"<Role(id={self.role_id}, name='{self.role_name}')>"