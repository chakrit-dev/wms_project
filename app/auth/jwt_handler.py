from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError, ExpiredSignatureError
from os import getenv

SECRET_KEY = getenv("SECRET_KEY")
ALGORITHM = getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

def create_access_token(data: dict, expires_minutes: int = ACCESS_TOKEN_EXPIRE_MINUTES):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except ExpiredSignatureError:
        return {"error": "Token expired"}
    except JWTError:
        return None

def create_reset_token(data: dict):
    return create_access_token(data, expires_minutes=15)

def verify_reset_token(token: str):
    payload = decode_access_token(token)
    return payload.get("sub") if payload and isinstance(payload, dict) else None
