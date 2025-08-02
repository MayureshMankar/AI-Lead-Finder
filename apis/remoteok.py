import requests
from bs4 import BeautifulSoup

def fetch_remoteok_jobs(keyword="seo intern"):
    url = "https://remoteok.com/api"
    
    try:
        response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
        response.raise_for_status()
        data = response.json()

        # First entry is metadata
        jobs_data = data[1:] if isinstance(data, list) else []

        keyword_lower = keyword.lower()
        filtered_jobs = []

        for job in jobs_data:
            # Search in position, description, or tags
            position = job.get("position", "").lower()
            description = job.get("description", "").lower()
            tags = " ".join(job.get("tags", [])).lower()

            if keyword_lower in position or keyword_lower in description or keyword_lower in tags:
                # Clean HTML from description
                soup = BeautifulSoup(job.get("description", ""), "html.parser")
                clean_desc = soup.get_text()

                filtered_jobs.append({
                    "position": job.get("position", "N/A"),
                    "company": job.get("company", "N/A"),
                    "location": job.get("location", "Remote"),
                    "tags": job.get("tags", []),
                    "url": job.get("url", ""),
                    "description": clean_desc
                })

        print(f"Found {len(filtered_jobs)} jobs")
        return filtered_jobs

    except requests.exceptions.RequestException as e:
        print(f" RemoteOK API error: {e}")
        return []
