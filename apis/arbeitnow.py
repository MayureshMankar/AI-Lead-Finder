import requests
from bs4 import BeautifulSoup

def fetch_arbeitnow_jobs(keyword="developer"):
    url = "https://www.arbeitnow.com/api/job-board-api"

    try:
        response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
        response.raise_for_status()
        data = response.json()

        keyword_lower = keyword.lower()
        filtered_jobs = []

        for job in data.get("data", []):
            title = job.get("title", "").lower()
            description = job.get("description", "").lower()
            tags = " ".join(job.get("tags", [])).lower()

            if keyword_lower in title or keyword_lower in description or keyword_lower in tags:
                soup = BeautifulSoup(job.get("description", ""), "html.parser")
                clean_desc = soup.get_text()

                filtered_jobs.append({
                    "position": job.get("title", "N/A"),
                    "company": job.get("company_name", "N/A"),
                    "location": job.get("location", "Remote"),
                    "tags": job.get("tags", []),
                    "url": job.get("url", ""),
                    "description": clean_desc
                })

        print(f"Found {len(filtered_jobs)} jobs")
        return filtered_jobs

    except requests.exceptions.RequestException as e:
        print(f" Arbeitnow API error: {e}")
        return []
