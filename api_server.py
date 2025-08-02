from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from passlib.hash import bcrypt
from cli import process_email_jobs
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
import secrets
import datetime
import re
from functools import wraps
from collections import defaultdict
import time
import os
from dotenv import load_dotenv
import json

# Import scraping and AI functions
from main import process_email_jobs, process_linkedin_jobs
from ai.gpt_message import generate_message
from emailer.send_email import extract_email, send_email

# Import unified search
from scraper.unified_search import unified_search, get_search_suggestions, get_trending_searches

# Import billing routes
from billing.billing_api import billing_bp

# Load environment variables
load_dotenv('email_config.env')

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "admd204519"  # Change this!
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql://root:admd204519@localhost/ai_leads"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(hours=24)

# Add debug mode for development
app.config["DEBUG"] = True

# Email Configuration
app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USERNAME"] = os.getenv("MAIL_USERNAME")  # Set your Gmail
app.config["MAIL_PASSWORD"] = os.getenv("MAIL_PASSWORD")  # Set your app password
app.config["MAIL_DEFAULT_SENDER"] = os.getenv("MAIL_USERNAME")

CORS(app)
jwt = JWTManager(app)
db = SQLAlchemy(app)
mail = Mail(app)

# Register billing blueprint
app.register_blueprint(billing_bp)

# Initialize billing with database instance
from billing.billing_api import init_billing
init_billing(db)

# Rate limiting
request_counts = defaultdict(list)
MAX_REQUESTS = 50  # Max requests per window (increased for development)
WINDOW_SIZE = 60

# In-memory storage for reset tokens (temporary solution)
reset_tokens = {}  # {token: {"email": email, "expires": datetime}}  # Time window in seconds

def send_password_reset_email(user_email, reset_token):
    """Send password reset email to user"""
    try:
        reset_url = f"http://localhost:3000/reset-password?token={reset_token}"
        
        msg = Message(
            subject="Reset Your AI Lead Finder Password",
            recipients=[user_email],
            html=f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="margin: 0; font-size: 24px;">AI Lead Finder</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9;">Password Reset Request</p>
                </div>
                
                <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #333; margin-bottom: 20px;">Hello!</h2>
                    
                    <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
                        We received a request to reset your password for your AI Lead Finder account. 
                        If you didn't make this request, you can safely ignore this email.
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{reset_url}" 
                           style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                  color: white; 
                                  padding: 15px 30px; 
                                  text-decoration: none; 
                                  border-radius: 25px; 
                                  display: inline-block; 
                                  font-weight: bold;
                                  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                            Reset Password
                        </a>
                    </div>
                    
                    <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
                        Or copy and paste this link into your browser:
                    </p>
                    <p style="background: #e9ecef; padding: 10px; border-radius: 5px; word-break: break-all; color: #495057;">
                        {reset_url}
                    </p>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
                        <p style="color: #999; font-size: 14px; margin-bottom: 10px;">
                            <strong>Important:</strong> This link will expire in 1 hour for security reasons.
                        </p>
                        <p style="color: #999; font-size: 14px; margin: 0;">
                            If you have any questions, please contact our support team.
                        </p>
                    </div>
                </div>
            </div>
            """
        )
        
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

def send_welcome_email(user_email, username):
    """Send welcome email to new user"""
    try:
        msg = Message(
            subject="Welcome to AI Lead Finder! 🎉",
            recipients=[user_email],
            html=f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="margin: 0; font-size: 24px;">Welcome to AI Lead Finder!</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9;">Your account has been created successfully</p>
                </div>
                
                <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #333; margin-bottom: 20px;">Hello {username}! 👋</h2>
                    
                    <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
                        Welcome to AI Lead Finder! We're excited to have you on board. 
                        You're now ready to start automating your job search and outreach.
                    </p>
                    
                    <div style="background: #e8f5e8; border-left: 4px solid #28a745; padding: 15px; margin: 25px 0;">
                        <h3 style="color: #155724; margin: 0 0 10px 0;">What you can do now:</h3>
                        <ul style="color: #155724; margin: 0; padding-left: 20px;">
                            <li>Scrape jobs from multiple platforms</li>
                            <li>Generate personalized outreach messages</li>
                            <li>Track your leads and responses</li>
                            <li>Manage your outreach campaigns</li>
                        </ul>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="http://localhost:3000/dashboard" 
                           style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                  color: white; 
                                  padding: 15px 30px; 
                                  text-decoration: none; 
                                  border-radius: 25px; 
                                  display: inline-block; 
                                  font-weight: bold;
                                  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                            Get Started
                        </a>
                    </div>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
                        <p style="color: #999; font-size: 14px; margin: 0;">
                            If you have any questions, feel free to reach out to our support team.
                        </p>
                    </div>
                </div>
            </div>
            """
        )
        
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Error sending welcome email: {e}")
        return False

def rate_limit(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        ip = request.remote_addr
        now = time.time()
        
        # Clean old requests
        request_counts[ip] = [req_time for req_time in request_counts[ip] if now - req_time < WINDOW_SIZE]
        
        # Check if limit exceeded
        if len(request_counts[ip]) >= MAX_REQUESTS:
            return jsonify({"msg": "Too many requests. Please try again later."}), 429
        
        # Add current request
        request_counts[ip].append(now)
        
        return f(*args, **kwargs)
    return decorated_function

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    try:
        # Test database connection
        db.session.execute(db.text('SELECT 1'))
        
        # Initialize scraper status
        remoteok_working = False
        remoteok_error = None
        arbeitnow_working = False
        arbeitnow_error = None
        remotive_working = False
        remotive_error = None
        
        # Test API scrapers
        try:
            from apis.remoteok import fetch_remoteok_jobs
            remoteok_test = fetch_remoteok_jobs("python")
            remoteok_working = len(remoteok_test) > 0
        except Exception as e:
            remoteok_working = False
            remoteok_error = str(e)
        
        try:
            from apis.arbeitnow import fetch_arbeitnow_jobs
            arbeitnow_test = fetch_arbeitnow_jobs("python")
            arbeitnow_working = len(arbeitnow_test) > 0
        except Exception as e:
            arbeitnow_working = False
            arbeitnow_error = str(e)
        
        try:
            from apis.remotive import fetch_remotive_jobs
            remotive_test = fetch_remotive_jobs("python", 5)
            remotive_working = len(remotive_test) > 0
        except Exception as e:
            remotive_working = False
            remotive_error = str(e)
        
        return jsonify({
            "status": "healthy", 
            "database": "connected",
            "scrapers": {
                "remoteok": {"working": remoteok_working, "error": remoteok_error},
                "arbeitnow": {"working": arbeitnow_working, "error": arbeitnow_error},
                "remotive": {"working": remotive_working, "error": remotive_error}
            }
        }), 200
    except Exception as e:
        return jsonify({"status": "unhealthy", "database": "disconnected", "error": str(e)}), 500

# Security headers
@app.after_request
def add_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    return response 

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)
    password = db.Column(db.String(200), nullable=False)
    leads = db.relationship('Lead', backref='user', lazy=True)
    
    def get_email_verified(self):
        """Safely get email_verified status"""
        return False  # Default to False for existing users

class Lead(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    position = db.Column(db.String(120))
    company = db.Column(db.String(120))
    location = db.Column(db.String(120))
    tags = db.Column(db.String(500))  # Comma-separated
    url = db.Column(db.String(500))
    status = db.Column(db.String(50))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    description = db.Column(db.Text, nullable=True)
    platform = db.Column(db.String(50), nullable=True)
    response_received = db.Column(db.Boolean, default=False)
    response_date = db.Column(db.DateTime, nullable=True)
    follow_up_date = db.Column(db.DateTime, nullable=True)
    salary = db.Column(db.String(120), nullable=True)
    requirements = db.Column(db.Text)
    benefits = db.Column(db.Text)
    contact_info = db.Column(db.Text)

def validate_password(password):
    """Validate password strength"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not re.search(r"[A-Z]", password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r"[a-z]", password):
        return False, "Password must contain at least one lowercase letter"
    if not re.search(r"\d", password):
        return False, "Password must contain at least one number"
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False, "Password must contain at least one special character"
    return True, "Password is strong"

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

@app.route('/api/register', methods=['POST'])
@rate_limit
def register():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    
    # Validation
    if not username or not email or not password:
        return jsonify({"msg": "Username, email, and password are required"}), 400
    
    # Username: must be non-empty and unique
    if User.query.filter_by(username=username).first():
        return jsonify({"msg": "Username already exists"}), 400
    # Email: must be valid and unique
    if not validate_email(email):
        return jsonify({"msg": "Please enter a valid email address"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Email already exists"}), 400
    
    is_valid, password_msg = validate_password(password)
    if not is_valid:
        return jsonify({"msg": password_msg}), 400
    
    # Create user
    hashed_pw = bcrypt.hash(password)
    user = User(username=username, email=email, password=hashed_pw)
    db.session.add(user)
    db.session.commit()
    
    # Send welcome email
    send_welcome_email(email, username)
    
    return jsonify({"msg": "Registration successful! Welcome email sent."}), 201

from sqlalchemy import or_

@app.route('/api/login', methods=['POST'])
@rate_limit
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"msg": "No data provided"}), 400
            
        identifier = data.get("username")  # Can be either username or email
        password = data.get("password")

        if not identifier or not password:
            return jsonify({"msg": "Username/email and password required"}), 400

        # Search by username OR email
        user = User.query.filter(or_(User.username == identifier, User.email == identifier)).first()

        if user and bcrypt.verify(password, user.password):
            token = create_access_token(identity=user.username)
            return jsonify({
                "access_token": token,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "email_verified": user.get_email_verified()
                }
            })

        return jsonify({"msg": "Invalid username/email or password"}), 401
    except Exception as e:
        print(f"Error in login: {e}")
        return jsonify({"msg": "Login failed"}), 500

@app.route('/api/forgot-password', methods=['POST'])
@rate_limit
def forgot_password():
    data = request.get_json()
    email = data.get("email")
    
    if not email:
        return jsonify({"msg": "Email is required"}), 400
    
    if not validate_email(email):
        return jsonify({"msg": "Please enter a valid email address"}), 400
    
    user = User.query.filter_by(email=email).first()
    if not user:
        # Don't reveal if email exists or not for security
        return jsonify({"msg": "If an account with this email exists, reset instructions have been sent."}), 200
    
    # Generate reset token and store in memory
    reset_token = secrets.token_urlsafe(32)
    reset_tokens[reset_token] = {
        "email": email,
        "expires": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }
    
    # Send password reset email
    email_sent = send_password_reset_email(email, reset_token)
    
    if email_sent:
        return jsonify({"msg": "Password reset instructions have been sent to your email."}), 200
    else:
        return jsonify({"msg": "Failed to send email. Please try again later."}), 500

@app.route('/api/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    token = data.get("token")
    new_password = data.get("new_password")
    
    if not token or not new_password:
        return jsonify({"msg": "Token and new password are required"}), 400
    
    is_valid, password_msg = validate_password(new_password)
    if not is_valid:
        return jsonify({"msg": password_msg}), 400
    
    # Validate token from in-memory storage
    if token not in reset_tokens:
        return jsonify({"msg": "Invalid or expired reset token"}), 400
    
    token_data = reset_tokens[token]
    if token_data["expires"] < datetime.datetime.utcnow():
        # Clean up expired token
        del reset_tokens[token]
        return jsonify({"msg": "Reset token has expired"}), 400
    
    # Find user by email
    user = User.query.filter_by(email=token_data["email"]).first()
    if not user:
        return jsonify({"msg": "User not found"}), 400
    
    # Update password and clean up token
    user.password = bcrypt.hash(new_password)
    db.session.commit()
    del reset_tokens[token]
    
    return jsonify({"msg": "Password has been reset successfully"}), 200

@app.route('/api/verify-token', methods=['GET'])
@jwt_required()
def verify_token():
    try:
        username = get_jwt_identity()
        if not username:
            return jsonify({"msg": "Invalid token"}), 422
        
        user = User.query.filter_by(username=username).first()
        
        if not user:
            return jsonify({"msg": "User not found"}), 404
        
        return jsonify({
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "email_verified": user.get_email_verified()
            }
        }), 200
    except Exception as e:
        print(f"Error in verify-token: {e}")
        return jsonify({"msg": "Token verification failed"}), 422


@app.route('/api/user-profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    """Get user profile for email generation"""
    username = get_jwt_identity()
    user = User.query.filter_by(username=username).first()
    
    if not user:
        return jsonify({"msg": "User not found"}), 404
    
    return jsonify({
        "username": user.username,
        "email": user.email
    }), 200

@app.route('/api/logout', methods=['POST'])
@jwt_required()
def logout():
    # In a real application, you might want to blacklist the token
    # For now, we'll just return success
    return jsonify({"msg": "Logged out successfully"}), 200

@app.route('/api/test-email', methods=['POST'])
def test_email():
    """Test endpoint to verify email functionality"""
    data = request.get_json()
    test_email = data.get("email")
    
    if not test_email:
        return jsonify({"msg": "Email address required"}), 400
    
    try:
        msg = Message(
            subject="AI Lead Finder - Email Test",
            recipients=[test_email],
            html="""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px;">
                    <h1 style="margin: 0;">Email Test Successful! 🎉</h1>
                </div>
                <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                    <p>This is a test email to verify that your email configuration is working correctly.</p>
                    <p>If you received this email, your AI Lead Finder email system is ready to go!</p>
                </div>
            </div>
            """
        )
        
        mail.send(msg)
        return jsonify({"msg": "Test email sent successfully!"}), 200
    except Exception as e:
        return jsonify({"msg": f"Failed to send test email: {str(e)}"}), 500


@app.route('/api/scrape', methods=['POST'])
@jwt_required()
def scrape_jobs():
    data = request.get_json()
    keyword = data.get('keyword', 'developer')
    location = data.get('location', 'Remote')
    limit = int(data.get('limit', 10))
    source = data.get('source', 'all')  # 'api', 'linkedin', 'all' - api includes remoteok, arbeitnow, remotive
    username = get_jwt_identity()
    user = User.query.filter_by(username=username).first()

    try:
        jobs = []
        
        # Scrape from API sources (RemoteOK, Remotive, Arbeitnow)
        if source in ['api', 'all']:
            print(f"Starting API scraping for keyword: {keyword}, limit: {limit}")
            api_jobs = process_email_jobs(source="all", keyword=keyword, limit=limit, return_jobs=True)
            print(f"API scraping returned {len(api_jobs)} jobs")
            jobs.extend(api_jobs)
        
        # LinkedIn scraping disabled for initial launch - will be added later
        # if source in ['linkedin', 'all']:
        #     try:
        #         linkedin_jobs = process_linkedin_jobs(keyword=keyword, limit=limit)
        #         # Convert LinkedIn jobs to standard format
        #         for job in linkedin_jobs:
        #             jobs.append({
        #                 "position": job.get("title", "N/A"),
        #                 "company": job.get("company", "N/A"),
        #                 "location": job.get("location", "Remote"),
        #                 "tags": [],
        #                 "url": job.get("url", "N/A"),
        #                 "description": job.get("details", ""),
        #                 "source": "linkedin"
        #             })
        #     except Exception as e:
        #         print(f"LinkedIn scraping error: {e}")
        
        # Remove old leads and save new ones
        print(f"Removing old leads for user {user.id}")
        Lead.query.filter_by(user_id=user.id).delete()
        
        print(f"Saving {len(jobs)} new leads to database")
        for job in jobs:
            lead = Lead(
                position=job.get('position'),
                company=job.get('company'),
                location=job.get('location'),
                tags=",".join(job.get('tags', [])),
                url=job.get('url'),
                status='new',
                user_id=user.id
            )
            db.session.add(lead)
        
        db.session.commit()
        print(f"Successfully saved {len(jobs)} leads to database")
        
        return jsonify({
            'jobs': jobs, 
            'count': len(jobs),
            'message': f'Successfully scraped {len(jobs)} jobs from {source}'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/scrape/linkedin', methods=['POST'])
@jwt_required()
def scrape_linkedin_jobs():
    """Scrape jobs specifically from LinkedIn"""
    data = request.get_json()
    keyword = data.get('keyword', 'developer')
    location = data.get('location', 'Remote')
    limit = int(data.get('limit', 5))
    username = get_jwt_identity()
    user = User.query.filter_by(username=username).first()

    try:
        # Check if LinkedIn credentials are available
        if not os.getenv("LINKEDIN_EMAIL") or not os.getenv("LINKEDIN_PASSWORD"):
            return jsonify({
                'error': 'LinkedIn credentials not configured. Please set LINKEDIN_EMAIL and LINKEDIN_PASSWORD in environment variables.'
            }), 400

        # Scrape LinkedIn jobs
        linkedin_jobs = process_linkedin_jobs(keyword=keyword, limit=limit)
        
        # Convert to standard format
        jobs = []
        for job in linkedin_jobs:
            jobs.append({
                "position": job.get("title", "N/A"),
                "company": job.get("company", "N/A"),
                "location": job.get("location", "Remote"),
                "tags": [],
                "url": job.get("url", "N/A"),
                "description": job.get("details", ""),
                "source": "linkedin"
            })
        
        # Save to database
        for job in jobs:
            lead = Lead(
                position=job.get('position'),
                company=job.get('company'),
                location=job.get('location'),
                tags=",".join(job.get('tags', [])),
                url=job.get('url'),
                status='new',
                user_id=user.id
            )
            db.session.add(lead)
        
        db.session.commit()
        
        return jsonify({
            'jobs': jobs, 
            'count': len(jobs),
            'message': f'Successfully scraped {len(jobs)} jobs from LinkedIn'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==========================
# 🔍 Unified Search Endpoints
# ==========================

@app.route("/api/search/jobs", methods=["POST"])
@jwt_required()
def search_jobs():
    """Unified job search across multiple platforms"""
    try:
        data = request.get_json()
        query = data.get("query", "")
        location = data.get("location", "")
        platforms = data.get("platforms", ["api"])  # Default to API scrapers only for initial launch
        max_results = data.get("max_results", 50)
        filters = data.get("filters", {})
        
        # Perform unified search
        import asyncio
        results = asyncio.run(unified_search.search_jobs(
            query=query,
            location=location,
            platforms=platforms,
            max_results=max_results,
            filters=filters
        ))
        
        return jsonify({
            "success": True,
            "results": results
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route("/api/search/suggestions", methods=["GET"])
def get_suggestions():
    """Get search suggestions based on query"""
    try:
        query = request.args.get("query", "")
        suggestions = get_search_suggestions(query)
        
        return jsonify({
            "success": True,
            "suggestions": suggestions
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route("/api/search/trending", methods=["GET"])
def get_trending():
    """Get trending job searches"""
    try:
        trending = get_trending_searches()
        
        return jsonify({
            "success": True,
            "trending": trending
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/leads', methods=['GET'])
@jwt_required()
def get_leads():
    username = get_jwt_identity()
    user = User.query.filter_by(username=username).first()
    leads = Lead.query.filter_by(user_id=user.id).all()
    output = []
    for lead in leads:
        output.append({
            "id": lead.id,  # <-- Add this line
            "position": lead.position,
            "company": lead.company,
            "location": lead.location,
            "tags": lead.tags.split(",") if lead.tags else [],
            "url": lead.url,
            "status": lead.status
        })
    return jsonify({'output': output})

@app.route('/api/leads', methods=['POST'])
@jwt_required()
def create_lead():
    """Create a new lead"""
    username = get_jwt_identity()
    user = User.query.filter_by(username=username).first()
    
    data = request.get_json()
    print(f"[DEBUG] Incoming lead data: {data}")
    position = data.get('position')
    company = data.get('company')
    location = data.get('location')
    url = data.get('url')
    tags = data.get('tags', '')
    status = data.get('status', 'active')

    # Accept tags as array or string
    if isinstance(tags, list):
        tags = ','.join(tags)
    elif not isinstance(tags, str):
        tags = str(tags)

    missing_fields = [field for field in ['position', 'company', 'location', 'url'] if not data.get(field)]
    if missing_fields:
        error_msg = f"Missing required fields: {', '.join(missing_fields)}"
        print(f"[ERROR] {error_msg}")
        return jsonify({"error": error_msg}), 400
    
    # Check if lead already exists (by URL)
    existing_lead = Lead.query.filter_by(url=url, user_id=user.id).first()
    if existing_lead:
        print(f"[ERROR] Lead already exists for url: {url}")
        return jsonify({"error": "Lead already exists"}), 409
    
    # Create new lead
    new_lead = Lead(
        position=position,
        company=company,
        location=location,
        url=url,
        tags=tags,
        status=status,
        user_id=user.id
    )
    
    try:
        db.session.add(new_lead)
        db.session.commit()
        print(f"[DEBUG] Lead created successfully: {new_lead.id}")
        return jsonify({
            "message": "Lead created successfully",
            "lead": {
                "id": new_lead.id,
                "position": new_lead.position,
                "company": new_lead.company,
                "location": new_lead.location,
                "url": new_lead.url,
                "tags": new_lead.tags.split(",") if new_lead.tags else [],
                "status": new_lead.status
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        print(f"[ERROR] Failed to create lead: {e}")
        return jsonify({"error": f"Failed to create lead: {str(e)}"}), 500

@app.route('/api/lead/<int:lead_id>', methods=['GET'])
@jwt_required()
def get_lead_detail(lead_id):
    username = get_jwt_identity()
    user = User.query.filter_by(username=username).first()

    lead = Lead.query.filter_by(id=lead_id, user_id=user.id).first()
    if not lead:
        return jsonify({"msg": "Lead not found"}), 404

    return jsonify({
        "id": lead.id,
        "position": lead.position,
        "company": lead.company,
        "location": lead.location,
        "tags": lead.tags.split(","),
        "url": lead.url,
        "status": lead.status
    })

@app.route('/api/lead/<int:lead_id>', methods=['PUT'])
@jwt_required()
def update_lead(lead_id):
    import json
    user = get_jwt_identity()
    data = request.get_json()
    print(f"UPDATE LEAD: Received PUT request for lead {lead_id}")
    print(f"UPDATE LEAD: Data received: {data}")
    lead = Lead.query.filter_by(id=lead_id).first()
    if not lead:
        return jsonify({'msg': 'Lead not found'}), 404
    # Only allow updating certain fields
    for field in [
        'position', 'company', 'location', 'url', 'description', 'notes', 'status',
        'salary', 'requirements', 'benefits', 'contact_info', 'custom_fields'
    ]:
        if field in data:
            # Serialize lists/dicts to JSON for requirements, benefits, contact_info
            if field == 'requirements':
                setattr(lead, field, json.dumps(data[field] if data[field] is not None else []))
            elif field == 'benefits':
                setattr(lead, field, json.dumps(data[field] if data[field] is not None else []))
            elif field == 'contact_info':
                val = data[field] if data[field] is not None else {}
                setattr(lead, field, json.dumps(val))
            elif field == 'tags':
                val = data[field]
                if isinstance(val, list):
                    val = ','.join(val)
                elif not isinstance(val, str):
                    val = str(val)
                setattr(lead, field, val)
            else:
                setattr(lead, field, data[field])
    db.session.commit()
    print(f"UPDATE LEAD: Successfully updated lead {lead_id}")
    print(f"UPDATE LEAD: Description after update: {lead.description}")
    print(f"UPDATE LEAD: Salary after update: {lead.salary}")
    print(f"UPDATE LEAD: Requirements after update: {lead.requirements}")
    print(f"UPDATE LEAD: Benefits after update: {lead.benefits}")
    
    # Deserialize for response
    response_data = {
        'id': lead.id,
        'position': lead.position,
        'company': lead.company,
        'location': lead.location,
        'url': lead.url,
        'status': lead.status,
        'tags': lead.tags.split(',') if lead.tags else [],
        'description': lead.description,
        'notes': lead.notes,
        'created_at': lead.created_at,
        'updated_at': lead.updated_at,
        'platform': lead.platform,
        'salary': lead.salary,
        'requirements': json.loads(lead.requirements) if lead.requirements else [],
        'benefits': json.loads(lead.benefits) if lead.benefits else [],
        'contact_info': json.loads(lead.contact_info) if lead.contact_info else {},
        'custom_fields': json.loads(lead.custom_fields) if getattr(lead, 'custom_fields', None) else []
    }
    print(f"UPDATE LEAD: Sending response: {response_data}")
    return jsonify(response_data)

@app.route('/api/lead/<int:lead_id>', methods=['DELETE'])
@jwt_required()
def delete_lead(lead_id):
    user = get_jwt_identity()
    lead = Lead.query.filter_by(id=lead_id).first()
    if not lead:
        return jsonify({'msg': 'Lead not found'}), 404
    db.session.delete(lead)
    db.session.commit()
    return jsonify({'msg': 'Lead deleted'})

# Add missing endpoints for Priority 1 and 2 features
@app.route('/api/leads/<int:lead_id>/emails', methods=['GET'])
@jwt_required()
def get_lead_emails(lead_id):
    """Get email history for a lead"""
    user = get_jwt_identity()
    lead = Lead.query.filter_by(id=lead_id).first()
    if not lead:
        return jsonify({'msg': 'Lead not found'}), 404
    
    # Mock email history for now
    emails = [
        {
            'id': 1,
            'subject': f"Application for {lead.position}",
            'sent_at': lead.created_at.isoformat(),
            'status': 'sent',
            'template_used': 'Initial Outreach'
        }
    ]
    return jsonify({'emails': emails})

@app.route('/api/leads/<int:lead_id>/activity', methods=['GET'])
@jwt_required()
def get_lead_activity(lead_id):
    """Get activity log for a lead"""
    user = get_jwt_identity()
    lead = Lead.query.filter_by(id=lead_id).first()
    if not lead:
        return jsonify({'msg': 'Lead not found'}), 404
    
    # Mock activity log
    activities = [
        {
            'id': 1,
            'type': 'created',
            'description': 'Lead created',
            'timestamp': lead.created_at.isoformat(),
            'user': user
        },
        {
            'id': 2,
            'type': 'status_changed',
            'description': f'Status changed to {lead.status}',
            'timestamp': lead.updated_at.isoformat(),
            'user': user
        }
    ]
    return jsonify({'activities': activities})

@app.route('/api/leads/duplicates', methods=['GET'])
@jwt_required()
def get_duplicate_leads():
    """Get duplicate leads based on company and position"""
    user = get_jwt_identity()
    company = request.args.get('company')
    position = request.args.get('position')
    
    if not company or not position:
        return jsonify({'duplicates': []})
    
    # Mock duplicate detection
    duplicates = [
        {
            'id': 'duplicate-1',
            'position': position,
            'company': company,
            'location': 'New York, NY',
            'status': 'active',
            'created_at': datetime.datetime.utcnow().isoformat(),
            'similarity': 85
        }
    ]
    return jsonify({'duplicates': duplicates})

@app.route('/api/leads/<int:lead_id>/calendar', methods=['GET', 'POST'])
@jwt_required()
def lead_calendar(lead_id):
    """Get or create calendar events for a lead"""
    user = get_jwt_identity()
    lead = Lead.query.filter_by(id=lead_id).first()
    if not lead:
        return jsonify({'msg': 'Lead not found'}), 404
    
    if request.method == 'GET':
        # Mock calendar events
        events = [
            {
                'id': 1,
                'title': f'Follow-up: {lead.position}',
                'date': lead.follow_up_date.isoformat() if lead.follow_up_date else datetime.datetime.utcnow().isoformat(),
                'type': 'follow_up',
                'description': f'Follow up with {lead.company} regarding {lead.position} position'
            }
        ]
        return jsonify({'events': events})
    
    elif request.method == 'POST':
        data = request.get_json()
        # Mock creating a new event
        new_event = {
            'id': 2,
            'title': data.get('title', 'New Event'),
            'date': data.get('date', datetime.datetime.utcnow().isoformat()),
            'type': data.get('type', 'follow_up'),
            'description': data.get('description', '')
        }
        return jsonify({'event': new_event})


@app.route('/api/leads/<int:lead_id>', methods=['PATCH'])
@jwt_required()
def update_lead_status(lead_id):
    username = get_jwt_identity()
    user = User.query.filter_by(username=username).first()
    lead = Lead.query.filter_by(id=lead_id, user_id=user.id).first()
    if not lead:
        return jsonify({"msg": "Lead not found"}), 404
    data = request.get_json()
    status = data.get("status")
    if status is not None:
        lead.status = status
        db.session.commit()
        return jsonify({"msg": "Status updated"})
    return jsonify({"msg": "No status provided"}), 400

@app.route('/api/change-password', methods=['POST'])
@jwt_required()
def change_password():
    username = get_jwt_identity()
    user = User.query.filter_by(username=username).first()
    data = request.get_json()
    old_password = data.get("old_password")
    new_password = data.get("new_password")
    if not user or not old_password or not new_password:
        return jsonify({"msg": "Missing data"}), 400
    if not bcrypt.verify(old_password, user.password):
        return jsonify({"msg": "Old password incorrect"}), 400
    user.password = bcrypt.hash(new_password)
    db.session.commit()
    return jsonify({"msg": "Password changed successfully"})

@app.route('/api/change-email', methods=['POST'])
@jwt_required()
def change_email():
    username = get_jwt_identity()
    user = User.query.filter_by(username=username).first()
    data = request.get_json()
    new_email = data.get("new_email")
    password = data.get("password")
    
    if not user or not new_email or not password:
        return jsonify({"msg": "Missing data"}), 400

    if not bcrypt.verify(password, user.password):
        return jsonify({"msg": "Password incorrect"}), 400

    if User.query.filter_by(email=new_email).first():
        return jsonify({"msg": "Email already in use"}), 400

    user.email = new_email
    db.session.commit()

    return jsonify({"msg": "Email changed successfully"})


# ==========================
# �� Email Outreach Endpoints
# ==========================

@app.route('/api/generate-message', methods=['POST'])
@jwt_required()
def generate_outreach_message():
    """Generate a personalized outreach message for a job"""
    data = request.get_json()
    job_data = data.get('job')
    user_credentials = data.get('user_credentials', {})
    
    if not job_data:
        return jsonify({"error": "Job data is required"}), 400
    
    try:
        # Get current user info
        username = get_jwt_identity()
        user = User.query.filter_by(username=username).first()
        
        # Create enhanced job data with user info
        enhanced_job_data = {
            **job_data,
            "user_name": user_credentials.get('name', username),
            "user_email": user.email,
            "user_skills": user_credentials.get('skills', ''),
            "user_experience": user_credentials.get('experience', ''),
            "user_location": user_credentials.get('location', ''),
            "user_linkedin": user_credentials.get('linkedin', ''),
            "user_portfolio": user_credentials.get('portfolio', '')
        }
        
        # Generate personalized message using AI
        message = generate_message(enhanced_job_data)
        return jsonify({
            "message": message,
            "job": job_data
        })
    except Exception as e:
        return jsonify({"error": f"Failed to generate message: {str(e)}"}), 500


@app.route('/api/send-outreach', methods=['POST'])
@jwt_required()
def send_outreach_email():
    """Send an outreach email to a company"""
    data = request.get_json()
    job_data = data.get('job')
    email = data.get('email')
    custom_message = data.get('message')
    
    if not job_data or not email:
        return jsonify({"error": "Job data and email are required"}), 400
    
    try:
        # Use custom message if provided, otherwise generate one
        if not custom_message:
            custom_message = generate_message(job_data)
        
        # Send the email
        subject = f"Regarding {job_data.get('position', 'Opportunity')} at {job_data.get('company', 'your company')}"
        send_email(email, subject, custom_message)
        
        # Update lead status
        username = get_jwt_identity()
        user = User.query.filter_by(username=username).first()
        
        # Find the lead by URL and update status
        lead = Lead.query.filter_by(url=job_data.get('url'), user_id=user.id).first()
        if lead:
            lead.status = 'emailed'
            db.session.commit()
        
        return jsonify({
            "message": "Outreach email sent successfully!",
            "email": email,
            "subject": subject
        })
        
    except Exception as e:
        return jsonify({"error": f"Failed to send email: {str(e)}"}), 500


@app.route('/api/extract-email', methods=['POST'])
@jwt_required()
def extract_job_email():
    """Extract email from job description"""
    data = request.get_json()
    description = data.get('description', '')
    
    if not description:
        return jsonify({"error": "Job description is required"}), 400
    
    try:
        email = extract_email(description)
        return jsonify({
            "email": email,
            "found": email is not None
        })
    except Exception as e:
        return jsonify({"error": f"Failed to extract email: {str(e)}"}), 500


@app.route('/api/bulk-outreach', methods=['POST'])
@jwt_required()
def bulk_outreach():
    """Send bulk outreach emails to multiple jobs"""
    data = request.get_json()
    jobs = data.get('jobs', [])
    custom_message = data.get('message')
    user_credentials = data.get('user_credentials', {})
    
    if not jobs:
        return jsonify({"error": "Jobs list is required"}), 400
    
    username = get_jwt_identity()
    user = User.query.filter_by(username=username).first()
    
    results = []
    success_count = 0
    
    for job in jobs:
        try:
            # Extract email from job description
            email = extract_email(job.get('description', ''))
            
            if not email:
                results.append({
                    "job": job.get('position'),
                    "company": job.get('company'),
                    "status": "no_email_found",
                    "error": "No email found in job description"
                })
                continue
            
            # Create enhanced job data with user info
            enhanced_job_data = {
                **job,
                "user_name": user_credentials.get('name', username),
                "user_email": user.email,
                "user_skills": user_credentials.get('skills', ''),
                "user_experience": user_credentials.get('experience', ''),
                "user_location": user_credentials.get('location', ''),
                "user_linkedin": user_credentials.get('linkedin', ''),
                "user_portfolio": user_credentials.get('portfolio', '')
            }
            
            # Generate or use custom message
            message = custom_message if custom_message else generate_message(enhanced_job_data)
            
            # Send email
            subject = f"Regarding {job.get('position', 'Opportunity')} at {job.get('company', 'your company')}"
            send_email(email, subject, message)
            
            # Update lead status
            lead = Lead.query.filter_by(url=job.get('url'), user_id=user.id).first()
            if lead:
                lead.status = 'emailed'
            
            results.append({
                "job": job.get('position'),
                "company": job.get('company'),
                "email": email,
                "status": "sent",
                "subject": subject
            })
            success_count += 1
            
        except Exception as e:
            results.append({
                "job": job.get('position'),
                "company": job.get('company'),
                "status": "error",
                "error": str(e)
            })
    
    db.session.commit()
    
    return jsonify({
        "results": results,
        "total": len(jobs),
        "successful": success_count,
        "failed": len(jobs) - success_count
    })


with app.app_context():
    # Create tables if they don't exist
    db.create_all()

if __name__ == '__main__':
    app.run(port=5001, debug=True)