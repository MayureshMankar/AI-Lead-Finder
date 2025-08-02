"""
Usage tracking utility for billing system
Provides easy-to-use functions for tracking feature usage
"""

import requests
import os
from typing import Dict, Optional
from dotenv import load_dotenv

load_dotenv()

class UsageTracker:
    """Utility class for tracking feature usage"""
    
    def __init__(self, api_url: str = None, token: str = None):
        self.api_url = api_url or os.getenv('NEXT_PUBLIC_API_URL', 'http://localhost:5001')
        self.token = token
    
    def set_token(self, token: str):
        """Set authentication token"""
        self.token = token
    
    def track_usage(self, feature: str, quantity: int = 1, description: str = None) -> bool:
        """
        Track usage for a specific feature
        
        Args:
            feature: Feature name (e.g., 'messages', 'scrapes', 'emails')
            quantity: Number of units used
            description: Optional description of the usage
            
        Returns:
            bool: True if tracking was successful, False otherwise
        """
        if not self.token:
            print("Warning: No authentication token set for usage tracking")
            return False
        
        try:
            response = requests.post(
                f"{self.api_url}/api/billing/usage",
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {self.token}"
                },
                json={
                    "feature": feature,
                    "quantity": quantity,
                    "description": description
                },
                timeout=5
            )
            
            if response.status_code == 200:
                return True
            else:
                print(f"Usage tracking failed: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            print(f"Error tracking usage: {e}")
            return False
    
    def track_message_generation(self, message_count: int = 1, description: str = None):
        """Track AI message generation usage"""
        return self.track_usage(
            feature='messages',
            quantity=message_count,
            description=description or f"Generated {message_count} AI message(s)"
        )
    
    def track_job_scraping(self, scrape_count: int = 1, platform: str = None):
        """Track job scraping usage"""
        description = f"Scraped {scrape_count} job(s)"
        if platform:
            description += f" from {platform}"
        
        return self.track_usage(
            feature='scrapes',
            quantity=scrape_count,
            description=description
        )
    
    def track_email_sending(self, email_count: int = 1, description: str = None):
        """Track email sending usage"""
        return self.track_usage(
            feature='emails',
            quantity=email_count,
            description=description or f"Sent {email_count} email(s)"
        )
    
    def track_lead_storage(self, lead_count: int = 1, description: str = None):
        """Track lead storage usage"""
        return self.track_usage(
            feature='leads',
            quantity=lead_count,
            description=description or f"Stored {lead_count} lead(s)"
        )

# Global usage tracker instance
usage_tracker = UsageTracker()

def track_usage(feature: str, quantity: int = 1, description: str = None) -> bool:
    """
    Global function for tracking usage
    
    Args:
        feature: Feature name
        quantity: Number of units used
        description: Optional description
        
    Returns:
        bool: Success status
    """
    return usage_tracker.track_usage(feature, quantity, description)

def track_message_generation(message_count: int = 1, description: str = None) -> bool:
    """Track AI message generation"""
    return usage_tracker.track_message_generation(message_count, description)

def track_job_scraping(scrape_count: int = 1, platform: str = None) -> bool:
    """Track job scraping"""
    return usage_tracker.track_job_scraping(scrape_count, platform)

def track_email_sending(email_count: int = 1, description: str = None) -> bool:
    """Track email sending"""
    return usage_tracker.track_email_sending(email_count, description)

def track_lead_storage(lead_count: int = 1, description: str = None) -> bool:
    """Track lead storage"""
    return usage_tracker.track_lead_storage(lead_count, description)

def set_usage_token(token: str):
    """Set authentication token for usage tracking"""
    usage_tracker.set_token(token)

# Decorator for automatic usage tracking
def track_feature_usage(feature: str, quantity: int = 1):
    """
    Decorator to automatically track feature usage
    
    Usage:
        @track_feature_usage('messages', 1)
        def generate_message():
            # Your function code
            pass
    """
    def decorator(func):
        def wrapper(*args, **kwargs):
            result = func(*args, **kwargs)
            track_usage(feature, quantity, f"Function: {func.__name__}")
            return result
        return wrapper
    return decorator

# Context manager for usage tracking
class UsageContext:
    """Context manager for tracking usage within a block of code"""
    
    def __init__(self, feature: str, quantity: int = 1, description: str = None):
        self.feature = feature
        self.quantity = quantity
        self.description = description
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is None:  # Only track if no exception occurred
            track_usage(self.feature, self.quantity, self.description)

# Example usage functions
def example_usage():
    """Example of how to use the usage tracking system"""
    
    # Set authentication token (usually done during login)
    set_usage_token("your-jwt-token-here")
    
    # Track different types of usage
    track_message_generation(1, "Generated LinkedIn message")
    track_job_scraping(5, "LinkedIn")
    track_email_sending(3, "Follow-up emails")
    track_lead_storage(10, "Imported leads")
    
    # Using decorator
    @track_feature_usage('messages', 1)
    def generate_ai_message():
        # Your AI message generation code
        return "Generated message"
    
    # Using context manager
    with UsageContext('scrapes', 1, 'LinkedIn scraping'):
        # Your scraping code
        pass

if __name__ == "__main__":
    example_usage() 