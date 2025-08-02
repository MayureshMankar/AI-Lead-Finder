import praw
import os
from dotenv import load_dotenv
load_dotenv()

def send_dm(username, subject, message):
    try:
        reddit = praw.Reddit(
            client_id=os.getenv("REDDIT_CLIENT_ID"),
            client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
            username=os.getenv("REDDIT_USERNAME"),
            password=os.getenv("REDDIT_PASSWORD"),
            user_agent=os.getenv("REDDIT_USER_AGENT")
        )

        reddit.redditor(username).message(subject, message)
        print(f"✅ DM sent to u/{username}")
    except Exception as e:
        print(f"❌ Failed to send DM to u/{username}: {e}")
