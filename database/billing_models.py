from datetime import datetime, timedelta
from enum import Enum
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float, Text, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class SubscriptionStatus(Enum):
    ACTIVE = "active"
    CANCELED = "canceled"
    PAST_DUE = "past_due"
    UNPAID = "unpaid"
    TRIAL = "trial"

class PlanType(Enum):
    STARTER = "starter"
    PRO = "pro"
    BUSINESS = "business"
    ENTERPRISE = "enterprise"

class BillingCycle(Enum):
    MONTHLY = "monthly"
    YEARLY = "yearly"

class PaymentStatus(Enum):
    PENDING = "pending"
    SUCCEEDED = "succeeded"
    FAILED = "failed"
    REFUNDED = "refunded"

class Subscription(Base):
    __tablename__ = 'subscriptions'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    stripe_subscription_id = Column(String(255), unique=True, nullable=True)
    stripe_customer_id = Column(String(255), nullable=True)
    
    plan_type = Column(String(50), nullable=False, default=PlanType.STARTER.value)
    billing_cycle = Column(String(20), nullable=False, default=BillingCycle.MONTHLY.value)
    status = Column(String(20), nullable=False, default=SubscriptionStatus.TRIAL.value)
    
    current_period_start = Column(DateTime, nullable=False, default=datetime.utcnow)
    current_period_end = Column(DateTime, nullable=False)
    trial_end = Column(DateTime, nullable=True)
    
    amount = Column(Float, nullable=False, default=0.0)
    currency = Column(String(3), nullable=False, default='USD')
    
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="subscription")
    payments = relationship("Payment", back_populates="subscription")
    usage_records = relationship("UsageRecord", back_populates="subscription")
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if not self.current_period_end:
            self.current_period_end = self.current_period_start + timedelta(days=30)
        if not self.trial_end:
            self.trial_end = self.current_period_start + timedelta(days=7)

class Payment(Base):
    __tablename__ = 'payments'
    
    id = Column(Integer, primary_key=True)
    subscription_id = Column(Integer, ForeignKey('subscriptions.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    
    stripe_payment_intent_id = Column(String(255), unique=True, nullable=True)
    stripe_invoice_id = Column(String(255), nullable=True)
    
    amount = Column(Float, nullable=False)
    currency = Column(String(3), nullable=False, default='USD')
    status = Column(String(20), nullable=False, default=PaymentStatus.PENDING.value)
    
    description = Column(Text, nullable=True)
    payment_metadata = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    subscription = relationship("Subscription", back_populates="payments")
    user = relationship("User", back_populates="payments")

class UsageRecord(Base):
    __tablename__ = 'usage_records'
    
    id = Column(Integer, primary_key=True)
    subscription_id = Column(Integer, ForeignKey('subscriptions.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    
    date = Column(DateTime, nullable=False, default=datetime.utcnow)
    feature = Column(String(50), nullable=False)  # 'messages', 'scrapes', 'emails'
    quantity = Column(Integer, nullable=False, default=1)
    description = Column(Text, nullable=True)
    
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    
    # Relationships
    subscription = relationship("Subscription", back_populates="usage_records")
    user = relationship("User", back_populates="usage_records")

class Plan(Base):
    __tablename__ = 'plans'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    plan_type = Column(String(50), nullable=False, unique=True)
    billing_cycle = Column(String(20), nullable=False)
    
    price = Column(Float, nullable=False)
    currency = Column(String(3), nullable=False, default='USD')
    
    # Feature limits
    max_messages_per_day = Column(Integer, nullable=False, default=10)
    max_scrapes_per_day = Column(Integer, nullable=False, default=5)
    max_emails_per_day = Column(Integer, nullable=False, default=10)
    max_leads = Column(Integer, nullable=False, default=100)
    
    # Features
    features = Column(JSON, nullable=False, default=list)
    is_active = Column(Boolean, nullable=False, default=True)
    
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

class Invoice(Base):
    __tablename__ = 'invoices'
    
    id = Column(Integer, primary_key=True)
    subscription_id = Column(Integer, ForeignKey('subscriptions.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    
    stripe_invoice_id = Column(String(255), unique=True, nullable=True)
    invoice_number = Column(String(50), unique=True, nullable=False)
    
    amount = Column(Float, nullable=False)
    currency = Column(String(3), nullable=False, default='USD')
    status = Column(String(20), nullable=False, default='draft')
    
    due_date = Column(DateTime, nullable=False)
    paid_at = Column(DateTime, nullable=True)
    
    items = Column(JSON, nullable=False, default=list)
    
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    subscription = relationship("Subscription")
    user = relationship("User", back_populates="invoices") 