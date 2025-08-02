import os
import re
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

def extract_email(text):
    match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
    if match:
        email = match.group(0).strip().rstrip(".")
        # Clean trailing junk like '.Please' or 'Please'
        email = re.sub(r'\.?(please|Please)$', '', email)
        return email
    return None


def send_email(to, subject, body):  # <-- change to match usage
    from_email = os.getenv("EMAIL_ADDRESS")
    from_password = os.getenv("EMAIL_PASSWORD")

    msg = MIMEMultipart()
    msg["From"] = from_email
    msg["To"] = to  # <-- use `to` not `to_email`
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(from_email, from_password)
            server.send_message(msg)
        print(f"✅ Email sent to {to}")
    except Exception as e:
        print(f"❌ Email failed: {e}")
