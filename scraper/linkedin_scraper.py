import os
import time
import json
import urllib.parse
import traceback
from dotenv import load_dotenv

import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

load_dotenv()
LINKEDIN_EMAIL = os.getenv("LINKEDIN_EMAIL")
LINKEDIN_PASSWORD = os.getenv("LINKEDIN_PASSWORD")


def clean_description(text):
    unwanted_starts = [
        "Save", "Apply", "Your profile matches", "Try Premium", "Follow", "Show more", "Show less"
    ]
    result = []
    for line in text.splitlines():
        if any(line.strip().startswith(u) for u in unwanted_starts):
            break
        result.append(line)
    return "\n".join(result).strip()


def get_text_safe(driver, selectors, timeout=5):
    for selector in selectors:
        try:
            element = WebDriverWait(driver, timeout).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, selector))
            )
            return element.text.strip()
        except:
            continue
    return "N/A"


def login_and_scrape_jobs(keyword="SEO intern", location="India", limit=5):
    jobs = []
    options = uc.ChromeOptions()
    options.headless = False
    driver = uc.Chrome(options=options)

    try:
        driver.get("https://www.linkedin.com/login")
        WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.ID, "username"))).send_keys(LINKEDIN_EMAIL)
        driver.find_element(By.ID, "password").send_keys(LINKEDIN_PASSWORD + Keys.RETURN)
        WebDriverWait(driver, 20).until(EC.url_contains("/feed"))

        encoded_keyword = urllib.parse.quote(keyword)
        driver.get(f"https://www.linkedin.com/jobs/search/?keywords={encoded_keyword}&location={location}")
        WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.CLASS_NAME, "job-card-container--clickable")))

        job_cards = driver.find_elements(By.CLASS_NAME, "job-card-container--clickable")
        print(f"🔍 Found {len(job_cards)} job cards")

        for i in range(min(limit, len(job_cards))):
            try:
                print(f"\n🔄 Processing job card #{i+1}")
                job_cards = driver.find_elements(By.CLASS_NAME, "job-card-container--clickable")
                card = job_cards[i]

                try:
                    driver.execute_script("arguments[0].scrollIntoView();", card)
                    card.click()
                except:
                    print("⚠️ Retrying click due to stale element...")
                    time.sleep(1)
                    card = driver.find_elements(By.CLASS_NAME, "job-card-container--clickable")[i]
                    card.click()

                time.sleep(3)

                # Updated CSS Selectors — fallback list
                title = get_text_safe(driver, [
                    "h1.topcard__title", "h2.top-card-layout__title"
                ])
                company = get_text_safe(driver, [
                    "a.topcard__org-name-link", "span.topcard__flavor"
                ])
                location = get_text_safe(driver, [
                    "span.topcard__flavor--bullet", "span.jobs-unified-top-card__bullet"
                ])
                address = get_text_safe(driver, [
                    "span.topcard__flavor--metadata", "span.jobs-unified-top-card__primary-description"
                ])
                url = driver.current_url

                try:
                    desc_elem = WebDriverWait(driver, 10).until(
                        EC.presence_of_element_located((By.CLASS_NAME, "jobs-description-content__text"))
                    )
                    raw_desc = desc_elem.text.strip()
                    description = clean_description(raw_desc)
                except:
                    description = "No description found"

                jobs.append({
                    "title": title,
                    "company": company,
                    "location": location,
                    "company_address": address,
                    "url": url,
                    "details": description
                })

                print(f"✅ Title: {title}\n🏢 Company: {company}\n📍 Location: {location}\n🔗 URL: {url}")

            except Exception:
                print(f"❌ Error on card #{i+1}:\n{traceback.format_exc()}")

        with open("linkedin_jobs.json", "w", encoding="utf-8") as f:
            json.dump(jobs, f, ensure_ascii=False, indent=2)

        return jobs

    except Exception as e:
        print(f"❌ Main error:\n {traceback.format_exc()}")
        return []

    finally:
        driver.quit()
