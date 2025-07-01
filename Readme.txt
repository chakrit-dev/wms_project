ปลดบล็อคกันรันสคริป .ps1
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned

Activate Venv
.\venv\Scripts\activate.ps1

Test_Connection.py
python -m app.test_connection


 รีโหลด FastAPI (กรณีใช้ uvicorn)
uvicorn main:app --reload


pip freeze > requirements.txt

ลบ pycache ในโปรเจกต์


delete pycache in project
//all folder  __pycache__
Get-ChildItem -Recurse -Directory -Filter "__pycache__" | Remove-Item -Recurse -Force
//all item .pyc
Get-ChildItem -Recurse -Filter "*.pyc" | Remove-Item -Force




pip install -r requirements.txt

ลบ Venv เดิม 
Remove-Item -Recurse -Force .\venv

สร้าง venv ใหม่
python -m venv venv


unit test ติดตั้ง pip pytest ก่อน
pytest tests/test_auth.py

npm run dev


ล้าง git บน repos
Remove-Item -Recurse -Force .git
git init
git add . 
git commit -m "♻️ Reset full repo from local"
git remote add origin https://github.com/chakrit-dev/wms_project.git
git push origin main --force






#ดึงเฉพาะที่แก้ไข ขึ้น git 
git checkout dev        # พัฒนาใน dev
git pull origin dev     # ดึงล่าสุด
# ทำงาน แก้โค้ด...
git add .
git commit -m "✨ เพิ่มหน้า Dashboard Summary และแก้ API Inventory"
git push origin dev     # ส่งขึ้น GitHub


ลบ __pycache__
Get-ChildItem -Recurse -Directory -Filter "__pycache__" | Remove-Item -Recurse -Force
