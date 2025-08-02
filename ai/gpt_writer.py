import os
import requests
from dotenv import load_dotenv
load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY")

def generate_message(lead):
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "openai/gpt-4o-mini",
        "messages": [
            {
                "role": "system",
                "content": "You are a career coach helping a student send replies to internship/job-related Reddit posts."
            },
            {
                "role": "user",
                "content": f"Reddit post:\nTitle: {lead['title']}\nBody: {lead['body']}\nGenerate a smart and concise reply I can DM or comment."
            }
        ]
    }

    response = requests.post(url, headers=headers, json=payload)
    data = response.json()
    return data["choices"][0]["message"]["content"]
