#  utils/email_sender.py
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import EMAIL_SENDER, EMAIL_PASSWORD, FRONTEND_URL


def send_reset_email(to_email: str, token: str):
    if not EMAIL_SENDER or not EMAIL_PASSWORD:
        raise ValueError("EMAIL_SENDER or EMAIL_PASSWORD not found in environment variables.")

    #  ตรวจสอบว่าเป็น ASCII เท่านั้น
    try:
        EMAIL_PASSWORD.encode('ascii')
    except UnicodeEncodeError:
        raise ValueError("EMAIL_PASSWORD contains non-ASCII characters. Please retype it.")

    # สร้างลิงก์รีเซ็ตรหัสผ่านแบบ dynamic ตาม FRONTEND_URL
    reset_url = f"{FRONTEND_URL}/reset-password?token={token}"

    # สร้าง email body
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "[WMS System] Password Reset Request"
    msg["From"] = EMAIL_SENDER
    msg["To"] = to_email

    html = f"""
    <html>
    <body style="font-family:sans-serif; color:#333;">
        <p>Hello,</p>
        <p>You requested to reset your password. Click the link below:</p>
        <p><a href="{reset_url}" target="_blank">Reset Password</a></p>
        <p style="color:gray;">This link will expire in 15 minutes.</p>
    </body>
    </html>
    """
    msg.attach(MIMEText(html, "html", _charset="utf-8"))  #  รองรับภาษาไทยถ้ามี

    #  ส่งอีเมลผ่าน Gmail SMTP
    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(EMAIL_SENDER, EMAIL_PASSWORD)
            server.sendmail(EMAIL_SENDER, to_email, msg.as_string())
        print(f"Email sent to {to_email}")
    except smtplib.SMTPAuthenticationError as e:
        print("SMTPAuthenticationError:", e)
        raise
    except Exception as e:
        print("Failed to send email:", e)
        raise
