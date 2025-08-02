import praw
import os
from dotenv import load_dotenv

load_dotenv()

def get_recent_posts(limit=5, keyword="internship"):
    # Load credentials from .env
    client_id = os.getenv("REDDIT_CLIENT_ID")
    client_secret = os.getenv("REDDIT_CLIENT_SECRET")
    username = os.getenv("REDDIT_USERNAME")
    password = os.getenv("REDDIT_PASSWORD")
    user_agent = os.getenv("REDDIT_USER_AGENT")

    # Check if any credential is missing
    if not all([client_id, client_secret, username, password, user_agent]):
        raise EnvironmentError("❌ Missing one or more Reddit API credentials in .env file.")

    # Initialize Reddit client
    reddit = praw.Reddit(
        client_id=client_id,
        client_secret=client_secret,
        username=username,
        password=password,
        user_agent=user_agent
    )

    subreddits = ["internships", "cscareerquestions", "jobs", "IndiaJobs"]
    results = []

    print(f"\n👨‍💻 Fetching Reddit posts with keyword: '{keyword}' (limit: {limit})...")

    for sub in subreddits:
        for post in reddit.subreddit(sub).new(limit=50):  # Fetch more to filter
            if keyword.lower() in post.title.lower():
                results.append({
                    "title": post.title,
                    "body": post.selftext[:1000],
                    "url": f"https://reddit.com{post.permalink}",
                    "author": post.author.name if post.author else "unknown"
                })
                if len(results) >= limit:
                    break
        if len(results) >= limit:
            break

    print(f"📥 Total posts collected: {len(results)}")
    return results
