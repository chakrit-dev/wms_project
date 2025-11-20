# ระบบบริหารจัดการคลังสินค้าและการขนส่ง (WMS)

โครงการนี้เป็นระบบบริหารจัดการคลังสินค้าและการขนส่ง (Warehouse & Transportation Management System) ที่พัฒนาด้วยภาษา Python (FastAPI) และ React 
เพื่อบริหารข้อมูลคลังสินค้า สินค้า การจัดส่ง และการควบคุมสิทธิ์ของผู้ใช้งาน โดยมีการออกแบบการทดสอบซอฟต์แวร์เบื้องต้นในบางฟีเจอร์ เพื่อใช้เป็นผลงานประกอบการสมัครงานในสายงาน Quality Assurance (QA) หรือ Software Tester

## รายละเอียดการทดสอบระบบ

ในการทดสอบระบบครั้งนี้ ได้เลือกทดสอบเฉพาะบางส่วนของระบบที่สำคัญต่อการยืนยันความถูกต้องของฟังก์ชันหลัก ได้แก่:

- ฟังก์ชันการเข้าสู่ระบบ (Login)
- ฟังก์ชันการสมัครสมาชิก (Register)
- การกำหนดสิทธิ์การเข้าถึงเมนูใน Sidebar ตามบทบาทของผู้ใช้ (Access Control List - ACL)

รูปแบบการทดสอบที่ใช้ ได้แก่:

- **Manual Testing**: การเขียน Test Case เพื่อทดสอบการทำงานตามเงื่อนไขที่กำหนด ตรวจสอบข้อความผิดพลาด การจัดการข้อมูลที่ไม่ถูกต้อง และการทำงานของระบบตามที่ออกแบบ
- **Automated Testing**: การใช้ Robot Framework และ Selenium สำหรับทดสอบการทำงานของระบบแบบอัตโนมัติในส่วนของหน้า UI
- **SQL Validation**: การตรวจสอบข้อมูลในฐานข้อมูลหลังจากการทำงานของระบบ เพื่อให้มั่นใจว่าข้อมูลถูกบันทึกและแสดงผลอย่างถูกต้อง

## เทคโนโลยีที่ใช้

- **Backend**: Python (FastAPI), SQLAlchemy  
- **Frontend**: React, TailwindCSS, shadcn/ui  
- **Database**: Azure SQL (รองรับ PostgreSQL)  
- **Testing Tools**: Robot Framework, Selenium, Postman, SQL Query  
- **Deployment**: Azure Static Web App, Azure App Service  

## ลิงก์ผลงาน

- **ระบบตัวอย่าง (Demo)**  
  https://ashy-grass-0d8e88500.1.azurestaticapps.net

- **GitHub Repository (Source Code)**  
  https://github.com/chakrit-dev/wms_project

- **Portfolio (PDF)**  
  https://drive.google.com/file/d/1agXSEH_Xl_VK_p6HLPG_26ZiK-_rcQ43/view?usp=sharing

## ผู้พัฒนา

ชาคริต เตชะศิลปภักดี  
Email: chakrit.tec@gmail.com  
GitHub: https://github.com/chakrit-dev  
Portfolio: ดูได้จากลิงก์ PDF ที่แนบไว้ด้านบน
