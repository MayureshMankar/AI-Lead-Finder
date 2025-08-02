import os
import random
import json
import webbrowser

from ai.gpt_message import generate_message
from ai.gpt_writer import generate_message as generate_reddit_message
from emailer.send_email import extract_email, send_email
from messanger.message_utils import personalize_message
from messanger.reddit_dm import send_dm
from scraper.linkedin_scraper import login_and_scrape_jobs
from scraper.reddit_scraper import get_recent_posts
from utils.logger import log_email_sent

from apis.remotive import fetch_remotive_jobs
from apis.remoteok import fetch_remoteok_jobs
from apis.arbeitnow import fetch_arbeitnow_jobs

LOG_FILE = "storage/sent_log.json"

# ==========================
# 🔧 Helper Functions
# ==========================

def load_sent_log():
    if not os.path.exists(LOG_FILE):
        return {"emails": [], "job_urls": []}
    with open(LOG_FILE, "r") as f:
        return json.load(f)

def save_sent_log(log):
    with open(LOG_FILE, "w") as f:
        json.dump(log, f, indent=2)

def has_been_sent(email, url, log):
    return email in log["emails"] or url in log["job_urls"]

def print_job(job):
    print("\n=============================")
    print(f"Title: {job.get('position', 'N/A')}")
    print(f"Company: {job.get('company', 'N/A')}")
    print(f"Location: {job.get('location', 'Remote')}")
    print(f"Tags: {', '.join(job.get('tags', []))}")
    print(f"URL: {job.get('url', 'N/A')}")
    print(f"Description:\n{job.get('description', '')[:300]}...")
    print("=============================")

# ==========================
# 📩 Email Jobs from APIs
# ==========================

def process_email_jobs(source="all", keyword="developer", limit=10, return_jobs=False):
    log = load_sent_log()
    jobs = []

    if source in ("remoteok", "all"):
        print("📡 Fetching jobs from RemoteOK...")
        jobs += fetch_remoteok_jobs(keyword)

    if source in ("arbeitnow", "all"):
        print("📡 Fetching jobs from Arbeitnow...")
        jobs += fetch_arbeitnow_jobs(keyword)

    if source in ("remotive", "all"):
        print("📡 Fetching jobs from Remotive...")
        jobs += fetch_remotive_jobs(keyword)

    # Shuffle and limit
    random.shuffle(jobs)
    jobs = jobs[:limit]
    print(f"\n✅ Total jobs collected: {len(jobs)}")

    if return_jobs:
        # Return only simplified job details for frontend use
        simplified_jobs = []
        for job in jobs:
            simplified_jobs.append({
                "position": job.get("position", "N/A"),
                "company": job.get("company", "N/A"),
                "location": job.get("location", "Remote"),
                "tags": job.get("tags", []),
                "url": job.get("url", "N/A")
            })
        return simplified_jobs

    # CLI mode (prompt-based interaction)
    for job in jobs:
        print_job(job)
        url = job.get("url")
        description = job.get("description", "")
        email = extract_email(description)

        if has_been_sent(email, url, log):
            print(f"⚠️ Already contacted: {email} / {url}")
            continue

        if email:
            print(f"📧 Email found: {email}")
            raw_message = generate_message(job)
            message = personalize_message(raw_message)
            print(f"\n📨 GPT Message:\n{message}\n")
            confirm = input(f"Do you want to send this email to {email}? (y/n): ").strip().lower()
            if confirm == "y":
                send_email(email, f"Regarding {job.get('position', 'Internship')}", message)
                log_email_sent(job, email, message)
                log["emails"].append(email)
                log["job_urls"].append(url)
                save_sent_log(log)
                print(f"✅ Email sent to {email}")
            else:
                print("❌ Skipped sending email.")
        else:
            print("⚠️ No email found.")
            if input("👉 Open job link in browser? (y/n): ").lower() == 'y':
                webbrowser.open(url)



# ==========================
# 🔎 LinkedIn Scraper Logic
# ==========================

def process_linkedin_jobs(keyword="seo intern", limit=3):
    print("\n🔎 Fetching LinkedIn Jobs...")
    jobs = login_and_scrape_jobs(keyword=keyword, limit=limit)
    for job in jobs:
        print("\n=============================")
        print("Title:", job["title"])
        print("Company:", job["company"])
        print("Location:", job["location"])
        print("Address:", job["company_address"])
        print("URL:", job["url"])
        print("Details:\n", job["details"][:500])
        print("=============================")

# ==========================
# 🧠 Reddit DMs Logic
# ==========================

def process_reddit_posts(limit=10, keyword="internship"):
    print(f"\n👨‍💻 Fetching Reddit posts with keyword: '{keyword}' (limit: {limit})...")
    leads = get_recent_posts(limit=limit, keyword=keyword)

    print(f"📥 Total posts collected: {len(leads)}")

    for lead in leads:
        print("\n----------------------------")
        print("Title:", lead['title'])
        print("Author:", lead['author'])
        print("URL:", lead['url'])
        print("Body:", lead['body'][:300] + '...' if len(lead['body']) > 300 else lead['body'])
        print("----------------------------")

        message = generate_reddit_message(lead)
        print("Generated Message:\n", message)

        send = input(f"Send DM to u/{lead['author']}? (y/n): ").strip().lower()
        if send == "y":
            send_dm(lead['author'], "Saw your post about internships", message)
            print(f"✅ DM sent to u/{lead['author']}")
        else:
            print("❌ Skipped.")
        print("=" * 60)

# ==========================
# 🔄 Main Entry Point
# ==========================

def main():
    print("🚀 Starting AI Lead Finder...\n")
    process_email_jobs()
    process_linkedin_jobs()
    process_reddit_posts()

if __name__ == "__main__":
    main()
