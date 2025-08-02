"""
Production Configuration for AI Lead Finder
Only includes working features for deployment
"""

# Working Scrapers
WORKING_SCRAPERS = {
    'linkedin': {
        'enabled': True,
        'name': 'LinkedIn',
        'description': 'Professional job listings',
        'requires_credentials': True,
        'rate_limit': 5,  # requests per minute
        'max_results': 20
    }
}

# Disabled Scrapers (for future expansion)
DISABLED_SCRAPERS = {
    'reddit': {
        'enabled': False,
        'reason': 'Requires Reddit API credentials',
        'future_plan': 'Add Reddit API integration'
    },
    'glassdoor': {
        'enabled': False,
        'reason': 'Blocked by anti-bot protection',
        'future_plan': 'Use official Glassdoor API'
    },
    'indeed': {
        'enabled': False,
        'reason': 'Blocked by anti-bot protection',
        'future_plan': 'Use official Indeed API'
    }
}

# Production Settings
PRODUCTION_SETTINGS = {
    'max_concurrent_searches': 2,
    'request_timeout': 30,
    'rate_limit_window': 60,  # seconds
    'max_requests_per_window': 10,
    'enable_mock_data': False,  # Disable in production
    'log_level': 'INFO'
}

# Required Environment Variables
REQUIRED_ENV_VARS = [
    'LINKEDIN_EMAIL',
    'LINKEDIN_PASSWORD',
    'DATABASE_URL',
    'JWT_SECRET_KEY',
    'MAIL_USERNAME',
    'MAIL_PASSWORD'
]

# Optional Environment Variables
OPTIONAL_ENV_VARS = [
    'OPENROUTER_API_KEY',  # For AI message generation
    'STRIPE_SECRET_KEY',   # For billing
    'STRIPE_PUBLISHABLE_KEY'
]

def get_working_platforms():
    """Get list of currently working platforms"""
    return [name for name, config in WORKING_SCRAPERS.items() if config['enabled']]

def get_disabled_platforms():
    """Get list of disabled platforms with reasons"""
    return DISABLED_SCRAPERS

def validate_production_setup():
    """Validate that all required components are configured"""
    import os
    missing_vars = []
    
    for var in REQUIRED_ENV_VARS:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        raise EnvironmentError(f"Missing required environment variables: {', '.join(missing_vars)}")
    
    return True

def get_production_status():
    """Get current production status"""
    return {
        'working_scrapers': len(get_working_platforms()),
        'total_scrapers': len(WORKING_SCRAPERS) + len(DISABLED_SCRAPERS),
        'disabled_scrapers': len(DISABLED_SCRAPERS),
        'ready_for_deployment': len(get_working_platforms()) > 0
    } 