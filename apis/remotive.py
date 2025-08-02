import requests

def fetch_remotive_jobs(keyword="developer", limit=10):
    url = f"https://remotive.io/api/remote-jobs?search={keyword}"

    try:
        res = requests.get(url, timeout=10)
        res.raise_for_status()
        data = res.json()
        jobs = []

        for job in data.get("jobs", [])[:limit]:
            jobs.append({
                "position": job.get("title"),
                "company": job.get("company_name"),
                "location": job.get("candidate_required_location", "Remote"),
                "tags": job.get("tags", []),
                "url": job.get("url"),
                "description": job.get("description", "")
            })
        return jobs

    except Exception as e:
        print(f"Remotive API error: {e}")  #  emoji removed
        return []
