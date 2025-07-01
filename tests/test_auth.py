from fastapi.testclient import TestClient
from main import app
import uuid  # เพิ่มสำหรับสร้างชื่อไม่ซ้ำ

client = TestClient(app)

# --------- /register ---------
def test_register_success():
    unique_username = f"testuser_{uuid.uuid4().hex[:6]}"  # ป้องกันชื่อซ้ำ
    response = client.post("/register", json={
        "usl_user": unique_username,
        "usl_passwd": "123456"
    })
    assert response.status_code in [200, 201]
    assert response.json()["message"] == "User registered successfully"

def test_register_existing_user():
    client.post("/register", json={"usl_user": "duplicate", "usl_passwd": "123456"})
    response = client.post("/register", json={"usl_user": "duplicate", "usl_passwd": "123456"})
    assert response.status_code in [400, 409]
    assert response.json()["detail"] == "Username already exists"

# --------- /login ---------
def test_login_success():
    client.post("/register", json={"usl_user": "loginuser", "usl_passwd": "123456"})
    response = client.post("/login", data={
        "username": "loginuser",
        "password": "123456"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_failure():
    response = client.post("/login", data={
        "username": "invaliduser",
        "password": "wrongpassword"
    })
    assert response.status_code in [400, 401]
    assert response.json()["detail"] == "Incorrect username or password"

