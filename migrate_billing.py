#!/usr/bin/env python3
"""
Database migration script for billing system
Creates all necessary tables and initial data for the billing system
"""

import os
import sys
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from database.billing_models import Base, Subscription, Payment, UsageRecord, Plan, Invoice
from api_server import User, db

# Load environment variables
load_dotenv()

def create_app():
    """Create Flask app for migration"""
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "mysql://root:admd204519@localhost/ai_leads")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.init_app(app)
    return app

def create_tables():
    """Create all billing tables"""
    print("Creating billing tables...")
    
    # Create all tables
    Base.metadata.create_all(db.engine)
    
    # Add stripe_customer_id column to User table if it doesn't exist
    try:
        db.engine.execute("ALTER TABLE user ADD COLUMN stripe_customer_id VARCHAR(255)")
        print("Added stripe_customer_id column to User table")
    except Exception as e:
        if "Duplicate column name" in str(e):
            print("stripe_customer_id column already exists")
        else:
            print(f"Error adding stripe_customer_id column: {e}")
    
    # Add relationships to User table
    try:
        db.engine.execute("ALTER TABLE user ADD COLUMN subscription_id INTEGER")
        print("Added subscription_id column to User table")
    except Exception as e:
        if "Duplicate column name" in str(e):
            print("subscription_id column already exists")
        else:
            print(f"Error adding subscription_id column: {e}")

def create_initial_plans():
    """Create initial subscription plans"""
    print("Creating initial plans...")
    
    plans_data = [
        {
            'name': 'Starter Plan',
            'plan_type': 'starter',
            'billing_cycle': 'monthly',
            'price': 0.0,
            'currency': 'USD',
            'max_messages_per_day': 10,
            'max_scrapes_per_day': 5,
            'max_emails_per_day': 10,
            'max_leads': 100,
            'features': ['10 GPT Messages Per Day', 'LinkedIn & Reddit Scraping', 'Basic Lead Tracking', 'Email Support'],
            'is_active': True
        },
        {
            'name': 'Starter Plan (Yearly)',
            'plan_type': 'starter',
            'billing_cycle': 'yearly',
            'price': 0.0,
            'currency': 'USD',
            'max_messages_per_day': 10,
            'max_scrapes_per_day': 5,
            'max_emails_per_day': 10,
            'max_leads': 100,
            'features': ['10 GPT Messages Per Day', 'LinkedIn & Reddit Scraping', 'Basic Lead Tracking', 'Email Support'],
            'is_active': True
        },
        {
            'name': 'Pro Plan',
            'plan_type': 'pro',
            'billing_cycle': 'monthly',
            'price': 29.0,
            'currency': 'USD',
            'max_messages_per_day': -1,  # Unlimited
            'max_scrapes_per_day': -1,   # Unlimited
            'max_emails_per_day': -1,    # Unlimited
            'max_leads': 1000,
            'features': ['Unlimited GPT Messages', 'All Platform Scraping', 'Advanced Lead Tracking', 'Priority Support', 'Analytics Dashboard', 'AI Resume Matching', 'Custom Templates', 'API Access'],
            'is_active': True
        },
        {
            'name': 'Pro Plan (Yearly)',
            'plan_type': 'pro',
            'billing_cycle': 'yearly',
            'price': 23.0,
            'currency': 'USD',
            'max_messages_per_day': -1,  # Unlimited
            'max_scrapes_per_day': -1,   # Unlimited
            'max_emails_per_day': -1,    # Unlimited
            'max_leads': 1000,
            'features': ['Unlimited GPT Messages', 'All Platform Scraping', 'Advanced Lead Tracking', 'Priority Support', 'Analytics Dashboard', 'AI Resume Matching', 'Custom Templates', 'API Access'],
            'is_active': True
        },
        {
            'name': 'Business Plan',
            'plan_type': 'business',
            'billing_cycle': 'monthly',
            'price': 79.0,
            'currency': 'USD',
            'max_messages_per_day': -1,  # Unlimited
            'max_scrapes_per_day': -1,   # Unlimited
            'max_emails_per_day': -1,    # Unlimited
            'max_leads': 5000,
            'features': ['Everything in Pro', 'Team Collaboration', 'Advanced Analytics', 'Custom Integrations', 'Priority Support', 'White-label Options', 'Advanced Reporting'],
            'is_active': True
        },
        {
            'name': 'Business Plan (Yearly)',
            'plan_type': 'business',
            'billing_cycle': 'yearly',
            'price': 63.0,
            'currency': 'USD',
            'max_messages_per_day': -1,  # Unlimited
            'max_scrapes_per_day': -1,   # Unlimited
            'max_emails_per_day': -1,    # Unlimited
            'max_leads': 5000,
            'features': ['Everything in Pro', 'Team Collaboration', 'Advanced Analytics', 'Custom Integrations', 'Priority Support', 'White-label Options', 'Advanced Reporting'],
            'is_active': True
        },
        {
            'name': 'Enterprise Plan',
            'plan_type': 'enterprise',
            'billing_cycle': 'monthly',
            'price': 0.0,  # Custom pricing
            'currency': 'USD',
            'max_messages_per_day': -1,  # Unlimited
            'max_scrapes_per_day': -1,   # Unlimited
            'max_emails_per_day': -1,    # Unlimited
            'max_leads': -1,  # Unlimited
            'features': ['Everything in Business', 'Unlimited Team Members', 'Custom Integrations', 'Dedicated Support', 'White-label Options', 'SLA Guarantee', 'Custom Training', 'On-premise Deployment'],
            'is_active': True
        },
        {
            'name': 'Enterprise Plan (Yearly)',
            'plan_type': 'enterprise',
            'billing_cycle': 'yearly',
            'price': 0.0,  # Custom pricing
            'currency': 'USD',
            'max_messages_per_day': -1,  # Unlimited
            'max_scrapes_per_day': -1,   # Unlimited
            'max_emails_per_day': -1,    # Unlimited
            'max_leads': -1,  # Unlimited
            'features': ['Everything in Business', 'Unlimited Team Members', 'Custom Integrations', 'Dedicated Support', 'White-label Options', 'SLA Guarantee', 'Custom Training', 'On-premise Deployment'],
            'is_active': True
        }
    ]
    
    for plan_data in plans_data:
        # Check if plan already exists
        existing_plan = Plan.query.filter_by(
            plan_type=plan_data['plan_type'],
            billing_cycle=plan_data['billing_cycle']
        ).first()
        
        if not existing_plan:
            plan = Plan(**plan_data)
            db.session.add(plan)
            print(f"Created {plan_data['name']}")
        else:
            print(f"Plan {plan_data['name']} already exists")
    
    db.session.commit()
    print("Initial plans created successfully!")

def create_starter_subscriptions():
    """Create starter subscriptions for existing users"""
    print("Creating starter subscriptions for existing users...")
    
    users = User.query.all()
    for user in users:
        # Check if user already has a subscription
        existing_subscription = Subscription.query.filter_by(user_id=user.id).first()
        
        if not existing_subscription:
            # Create starter subscription
            subscription = Subscription(
                user_id=user.id,
                plan_type='starter',
                billing_cycle='monthly',
                status='trial',
                amount=0.0,
                current_period_start=datetime.utcnow(),
                current_period_end=datetime.utcnow() + timedelta(days=30),
                trial_end=datetime.utcnow() + timedelta(days=7)
            )
            
            db.session.add(subscription)
            print(f"Created starter subscription for user {user.username}")
    
    db.session.commit()
    print("Starter subscriptions created successfully!")

def main():
    """Main migration function"""
    print("Starting billing system migration...")
    
    app = create_app()
    
    with app.app_context():
        try:
            # Create tables
            create_tables()
            
            # Create initial plans
            create_initial_plans()
            
            # Create starter subscriptions for existing users
            create_starter_subscriptions()
            
            print("\n✅ Billing system migration completed successfully!")
            print("\nNext steps:")
            print("1. Set up your Stripe account and get API keys")
            print("2. Create products and prices in Stripe dashboard")
            print("3. Update the environment variables with your Stripe keys")
            print("4. Set up webhook endpoints in Stripe dashboard")
            print("5. Test the billing system")
            
        except Exception as e:
            print(f"\n❌ Migration failed: {e}")
            db.session.rollback()
            sys.exit(1)

if __name__ == "__main__":
    main() 