from pydantic import BaseModel, EmailStr, Field

class RegisterRequest(BaseModel):
    username: str = Field(..., min_length=4, max_length=20, example="chakrit")
    firstname: str = Field(..., min_length=1, example="Chakrit")     #  เพิ่ม
    lastname: str = Field(..., min_length=1, example="Techasilp")     #  เพิ่ม
    phone: str = Field(..., min_length=9, max_length=15, example="0812345678")  #  เพิ่ม
    email: EmailStr = Field(..., example="user@example.com")
    password: str = Field(..., min_length=6, max_length=100, example="chakrit555")
    role: str = Field(default="user", example="user")

class RegisterResponse(BaseModel):
    message: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    name: str
    role: str
    email: str
