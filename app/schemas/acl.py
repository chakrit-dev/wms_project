#  schemas/acl.py
from pydantic import BaseModel

class PermissionResponse(BaseModel):
    perm_code: str
    perm_desc: str

    class Config:
        from_attributes = True
