import os
import stripe
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from dotenv import load_dotenv

load_dotenv()

# Initialize Stripe
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
STRIPE_WEBHOOK_SECRET = os.getenv('STRIPE_WEBHOOK_SECRET')

class StripeBillingService:
    def __init__(self):
        self.stripe = stripe
        
    def create_customer(self, email: str, name: str, customer_metadata: Dict = None) -> str:
        """Create a Stripe customer"""
        try:
            customer = self.stripe.Customer.create(
                email=email,
                name=name,
                metadata=customer_metadata or {}
            )
            return customer.id
        except Exception as e:
            raise Exception(f"Failed to create Stripe customer: {str(e)}")
    
    def create_subscription(self, customer_id: str, price_id: str, trial_days: int = 7) -> Dict:
        """Create a Stripe subscription"""
        try:
            subscription = self.stripe.Subscription.create(
                customer=customer_id,
                items=[{'price': price_id}],
                trial_period_days=trial_days,
                payment_behavior='default_incomplete',
                payment_settings={'save_default_payment_method': 'on_subscription'},
                expand=['latest_invoice.payment_intent']
            )
            return subscription
        except Exception as e:
            raise Exception(f"Failed to create Stripe subscription: {str(e)}")
    
    def cancel_subscription(self, subscription_id: str, at_period_end: bool = True) -> Dict:
        """Cancel a Stripe subscription"""
        try:
            if at_period_end:
                subscription = self.stripe.Subscription.modify(
                    subscription_id,
                    cancel_at_period_end=True
                )
            else:
                subscription = self.stripe.Subscription.cancel(subscription_id)
            return subscription
        except Exception as e:
            raise Exception(f"Failed to cancel Stripe subscription: {str(e)}")
    
    def update_subscription(self, subscription_id: str, price_id: str) -> Dict:
        """Update a Stripe subscription"""
        try:
            subscription = self.stripe.Subscription.retrieve(subscription_id)
            self.stripe.SubscriptionItem.modify(
                subscription['items']['data'][0].id,
                price=price_id
            )
            return self.stripe.Subscription.retrieve(subscription_id)
        except Exception as e:
            raise Exception(f"Failed to update Stripe subscription: {str(e)}")
    
    def create_payment_intent(self, amount: int, currency: str = 'usd', 
                            customer_id: str = None, payment_metadata: Dict = None) -> Dict:
        """Create a payment intent for one-time payments"""
        try:
            payment_intent = self.stripe.PaymentIntent.create(
                amount=amount,
                currency=currency,
                customer=customer_id,
                metadata=payment_metadata or {},
                automatic_payment_methods={'enabled': True}
            )
            return payment_intent
        except Exception as e:
            raise Exception(f"Failed to create payment intent: {str(e)}")
    
    def create_invoice(self, customer_id: str, amount: int, currency: str = 'usd',
                      description: str = None, invoice_metadata: Dict = None) -> Dict:
        """Create a Stripe invoice"""
        try:
            invoice = self.stripe.Invoice.create(
                customer=customer_id,
                description=description,
                metadata=invoice_metadata or {}
            )
            
            # Add invoice item
            self.stripe.InvoiceItem.create(
                customer=customer_id,
                invoice=invoice.id,
                amount=amount,
                currency=currency,
                description=description or "AI Lead Finder Service"
            )
            
            return invoice
        except Exception as e:
            raise Exception(f"Failed to create Stripe invoice: {str(e)}")
    
    def get_customer(self, customer_id: str) -> Dict:
        """Retrieve a Stripe customer"""
        try:
            return self.stripe.Customer.retrieve(customer_id)
        except Exception as e:
            raise Exception(f"Failed to retrieve Stripe customer: {str(e)}")
    
    def get_subscription(self, subscription_id: str) -> Dict:
        """Retrieve a Stripe subscription"""
        try:
            return self.stripe.Subscription.retrieve(subscription_id)
        except Exception as e:
            raise Exception(f"Failed to retrieve Stripe subscription: {str(e)}")
    
    def get_invoice(self, invoice_id: str) -> Dict:
        """Retrieve a Stripe invoice"""
        try:
            return self.stripe.Invoice.retrieve(invoice_id)
        except Exception as e:
            raise Exception(f"Failed to retrieve Stripe invoice: {str(e)}")
    
    def list_customer_invoices(self, customer_id: str, limit: int = 10) -> List[Dict]:
        """List invoices for a customer"""
        try:
            invoices = self.stripe.Invoice.list(
                customer=customer_id,
                limit=limit
            )
            return invoices.data
        except Exception as e:
            raise Exception(f"Failed to list customer invoices: {str(e)}")
    
    def create_refund(self, payment_intent_id: str, amount: int = None, reason: str = 'requested_by_customer') -> Dict:
        """Create a refund"""
        try:
            refund_data = {
                'payment_intent': payment_intent_id,
                'reason': reason
            }
            if amount:
                refund_data['amount'] = amount
                
            refund = self.stripe.Refund.create(**refund_data)
            return refund
        except Exception as e:
            raise Exception(f"Failed to create refund: {str(e)}")
    
    def verify_webhook_signature(self, payload: bytes, sig_header: str) -> Dict:
        """Verify webhook signature"""
        try:
            event = self.stripe.Webhook.construct_event(
                payload, sig_header, STRIPE_WEBHOOK_SECRET
            )
            return event
        except ValueError as e:
            raise Exception(f"Invalid payload: {str(e)}")
        except stripe.error.SignatureVerificationError as e:
            raise Exception(f"Invalid signature: {str(e)}")

class PlanManager:
    """Manage subscription plans and pricing"""
    
    def __init__(self):
        self.plans = {
            'starter': {
                'monthly': {
                    'price_id': os.getenv('STRIPE_STARTER_MONTHLY_PRICE_ID'),
                    'price': 0,
                    'features': ['10 GPT Messages Per Day', 'LinkedIn & Reddit Scraping', 'Basic Lead Tracking', 'Email Support'],
                    'limits': {
                        'max_messages_per_day': 10,
                        'max_scrapes_per_day': 5,
                        'max_emails_per_day': 10,
                        'max_leads': 100
                    }
                },
                'yearly': {
                    'price_id': os.getenv('STRIPE_STARTER_YEARLY_PRICE_ID'),
                    'price': 0,
                    'features': ['10 GPT Messages Per Day', 'LinkedIn & Reddit Scraping', 'Basic Lead Tracking', 'Email Support'],
                    'limits': {
                        'max_messages_per_day': 10,
                        'max_scrapes_per_day': 5,
                        'max_emails_per_day': 10,
                        'max_leads': 100
                    }
                }
            },
            'pro': {
                'monthly': {
                    'price_id': os.getenv('STRIPE_PRO_MONTHLY_PRICE_ID'),
                    'price': 29,
                    'features': ['Unlimited GPT Messages', 'All Platform Scraping', 'Advanced Lead Tracking', 'Priority Support', 'Analytics Dashboard', 'AI Resume Matching', 'Custom Templates', 'API Access'],
                    'limits': {
                        'max_messages_per_day': -1,  # Unlimited
                        'max_scrapes_per_day': -1,   # Unlimited
                        'max_emails_per_day': -1,    # Unlimited
                        'max_leads': 1000
                    }
                },
                'yearly': {
                    'price_id': os.getenv('STRIPE_PRO_YEARLY_PRICE_ID'),
                    'price': 23,
                    'features': ['Unlimited GPT Messages', 'All Platform Scraping', 'Advanced Lead Tracking', 'Priority Support', 'Analytics Dashboard', 'AI Resume Matching', 'Custom Templates', 'API Access'],
                    'limits': {
                        'max_messages_per_day': -1,  # Unlimited
                        'max_scrapes_per_day': -1,   # Unlimited
                        'max_emails_per_day': -1,    # Unlimited
                        'max_leads': 1000
                    }
                }
            },
            'business': {
                'monthly': {
                    'price_id': os.getenv('STRIPE_BUSINESS_MONTHLY_PRICE_ID'),
                    'price': 79,
                    'features': ['Everything in Pro', 'Team Collaboration', 'Advanced Analytics', 'Custom Integrations', 'Priority Support', 'White-label Options', 'Advanced Reporting'],
                    'limits': {
                        'max_messages_per_day': -1,  # Unlimited
                        'max_scrapes_per_day': -1,   # Unlimited
                        'max_emails_per_day': -1,    # Unlimited
                        'max_leads': 5000
                    }
                },
                'yearly': {
                    'price_id': os.getenv('STRIPE_BUSINESS_YEARLY_PRICE_ID'),
                    'price': 63,
                    'features': ['Everything in Pro', 'Team Collaboration', 'Advanced Analytics', 'Custom Integrations', 'Priority Support', 'White-label Options', 'Advanced Reporting'],
                    'limits': {
                        'max_messages_per_day': -1,  # Unlimited
                        'max_scrapes_per_day': -1,   # Unlimited
                        'max_emails_per_day': -1,    # Unlimited
                        'max_leads': 5000
                    }
                }
            },
            'enterprise': {
                'monthly': {
                    'price_id': os.getenv('STRIPE_ENTERPRISE_MONTHLY_PRICE_ID'),
                    'price': 0,  # Custom pricing
                    'features': ['Everything in Business', 'Unlimited Team Members', 'Custom Integrations', 'Dedicated Support', 'White-label Options', 'SLA Guarantee', 'Custom Training', 'On-premise Deployment'],
                    'limits': {
                        'max_messages_per_day': -1,  # Unlimited
                        'max_scrapes_per_day': -1,   # Unlimited
                        'max_emails_per_day': -1,    # Unlimited
                        'max_leads': -1  # Unlimited
                    }
                },
                'yearly': {
                    'price_id': os.getenv('STRIPE_ENTERPRISE_YEARLY_PRICE_ID'),
                    'price': 0,  # Custom pricing
                    'features': ['Everything in Business', 'Unlimited Team Members', 'Custom Integrations', 'Dedicated Support', 'White-label Options', 'SLA Guarantee', 'Custom Training', 'On-premise Deployment'],
                    'limits': {
                        'max_messages_per_day': -1,  # Unlimited
                        'max_scrapes_per_day': -1,   # Unlimited
                        'max_emails_per_day': -1,    # Unlimited
                        'max_leads': -1  # Unlimited
                    }
                }
            }
        }
    
    def get_plan(self, plan_type: str, billing_cycle: str) -> Dict:
        """Get plan details"""
        return self.plans.get(plan_type, {}).get(billing_cycle, {})
    
    def get_all_plans(self) -> Dict:
        """Get all plans"""
        return self.plans
    
    def get_price_id(self, plan_type: str, billing_cycle: str) -> str:
        """Get Stripe price ID for a plan"""
        plan = self.get_plan(plan_type, billing_cycle)
        return plan.get('price_id')
    
    def get_plan_limits(self, plan_type: str, billing_cycle: str) -> Dict:
        """Get plan limits"""
        plan = self.get_plan(plan_type, billing_cycle)
        return plan.get('limits', {})
    
    def get_plan_features(self, plan_type: str, billing_cycle: str) -> List[str]:
        """Get plan features"""
        plan = self.get_plan(plan_type, billing_cycle)
        return plan.get('features', []) 