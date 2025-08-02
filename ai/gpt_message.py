import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY")

def generate_message(job):
    """
    Generates a personalized cover letter / DM message for the given job dictionary.
    """
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    # Extract user information
    user_name = job.get('user_name', '')
    user_email = job.get('user_email', '')
    user_skills = job.get('user_skills', '')
    user_experience = job.get('user_experience', '')
    user_location = job.get('user_location', '')
    user_linkedin = job.get('user_linkedin', '')
    user_portfolio = job.get('user_portfolio', '')

    prompt = f"""Job Title: {job.get('position', 'N/A')}
Company: {job.get('company', 'N/A')}
Location: {job.get('location', 'Remote')}
Tags: {', '.join(job.get('tags', []))}
URL: {job.get('url', 'N/A')}
Description: {job.get('description', '')[:1000]}

Applicant Information:
Name: {user_name}
Email: {user_email}
Skills: {user_skills}
Experience: {user_experience}
Location: {user_location}
LinkedIn: {user_linkedin}
Portfolio: {user_portfolio}

Write a personalized, professional, and compelling cold email that:
1. Shows genuine interest in the company and position
2. Highlights relevant skills and experience
3. Explains why you're a good fit for the role
4. Includes a clear call-to-action
5. Sounds natural and enthusiastic
6. Is concise (150-200 words max)
7. Includes your contact information

Make it sound like a real person wrote it, not a template.
"""

    payload = {
        "model": "openai/gpt-4o-mini",
        "messages": [
            {
                "role": "system",
                "content": "You are an expert career coach helping professionals write compelling cold emails for job applications. Generate personalized, professional messages that stand out."
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        data = response.json()
        return data["choices"][0]["message"]["content"]
    except Exception as e:
        return f"❌ Failed to generate message due to error: {e}"
