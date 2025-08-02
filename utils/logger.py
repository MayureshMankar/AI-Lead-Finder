# utils/logger.py
import csv
import os

LOG_PATH = "storage/email_log.csv"

def log_email_sent(job, email, message):
    file_exists = os.path.isfile(LOG_PATH)

    with open(LOG_PATH, mode='a', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        
        if not file_exists:
            writer.writerow(["Title", "Company", "Email", "Job URL", "Message"])
        
        writer.writerow([
            job.get("position", "N/A"),
            job.get("company", "N/A"),
            email,
            job.get("url", "N/A"),
            message.replace("\n", " ").strip()
        ])
