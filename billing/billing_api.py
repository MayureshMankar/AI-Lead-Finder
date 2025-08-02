from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

from billing.stripe_service import StripeBillingService, PlanManager
from database.billing_models import Subscription, Payment, UsageRecord, Plan, Invoice

load_dotenv()

billing_bp = Blueprint('billing', __name__)
stripe_service = StripeBillingService()
plan_manager = PlanManager()

# Global db instance that will be set during initialization
db = None

def init_billing(db_instance):
    """Initialize billing with database instance"""
    global db
    db = db_instance

@billing_bp.route('/api/billing/plans', methods=['GET'])
def get_plans():
    """Get all available subscription plans"""
    try:
        plans = plan_manager.get_all_plans()
        return jsonify({
            'success': True,
            'plans': plans
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@billing_bp.route('/api/billing/subscription', methods=['POST'])
@jwt_required()
def create_subscription():
    """Create a new subscription"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        plan_type = data.get('plan_type')
        billing_cycle = data.get('billing_cycle', 'monthly')
        
        if not plan_type:
            return jsonify({
                'success': False,
                'error': 'Plan type is required'
            }), 400
        
        # Get user from database
        from api_server import User
        user = User.query.get(user_id)
        if not user:
            return jsonify({
                'success': False,
                'error': 'User not found'
            }), 404
        
        # Get plan details
        plan = plan_manager.get_plan(plan_type, billing_cycle)
        if not plan:
            return jsonify({
                'success': False,
                'error': 'Invalid plan'
            }), 400
        
        # Create or get Stripe customer
        if not user.stripe_customer_id:
            customer_id = stripe_service.create_customer(
                email=user.email,
                name=user.username,
                customer_metadata={'user_id': user_id}
            )
            user.stripe_customer_id = customer_id
            db.session.commit()
        else:
            customer_id = user.stripe_customer_id
        
        # Create Stripe subscription
        price_id = plan_manager.get_price_id(plan_type, billing_cycle)
        if not price_id:
            return jsonify({
                'success': False,
                'error': 'Price ID not configured for this plan'
            }), 400
        
        stripe_subscription = stripe_service.create_subscription(
            customer_id=customer_id,
            price_id=price_id,
            trial_days=7 if plan_type == 'starter' else 0
        )
        
        # Create subscription in database
        subscription = Subscription(
            user_id=user_id,
            stripe_subscription_id=stripe_subscription.id,
            stripe_customer_id=customer_id,
            plan_type=plan_type,
            billing_cycle=billing_cycle,
            status='trial' if plan_type == 'starter' else 'active',
            amount=plan['price'],
            current_period_start=datetime.fromtimestamp(stripe_subscription.current_period_start),
            current_period_end=datetime.fromtimestamp(stripe_subscription.current_period_end),
            trial_end=datetime.fromtimestamp(stripe_subscription.trial_end) if stripe_subscription.trial_end else None
        )
        
        db.session.add(subscription)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'subscription': {
                'id': subscription.id,
                'plan_type': subscription.plan_type,
                'billing_cycle': subscription.billing_cycle,
                'status': subscription.status,
                'amount': subscription.amount,
                'current_period_end': subscription.current_period_end.isoformat(),
                'stripe_subscription_id': subscription.stripe_subscription_id
            },
            'client_secret': stripe_subscription.latest_invoice.payment_intent.client_secret if stripe_subscription.latest_invoice and stripe_subscription.latest_invoice.payment_intent else None
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@billing_bp.route('/api/billing/subscription', methods=['GET'])
@jwt_required()
def get_subscription():
    """Get current user's subscription"""
    try:
        user_id = get_jwt_identity()
        
        subscription = Subscription.query.filter_by(user_id=user_id).first()
        if not subscription:
            return jsonify({
                'success': True,
                'subscription': None
            })
        
        # Get plan details
        plan = plan_manager.get_plan(subscription.plan_type, subscription.billing_cycle)
        
        return jsonify({
            'success': True,
            'subscription': {
                'id': subscription.id,
                'plan_type': subscription.plan_type,
                'billing_cycle': subscription.billing_cycle,
                'status': subscription.status,
                'amount': subscription.amount,
                'current_period_start': subscription.current_period_start.isoformat(),
                'current_period_end': subscription.current_period_end.isoformat(),
                'trial_end': subscription.trial_end.isoformat() if subscription.trial_end else None,
                'features': plan.get('features', []),
                'limits': plan.get('limits', {})
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@billing_bp.route('/api/billing/subscription/cancel', methods=['POST'])
@jwt_required()
def cancel_subscription():
    """Cancel subscription"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        at_period_end = data.get('at_period_end', True)
        
        subscription = Subscription.query.filter_by(user_id=user_id).first()
        if not subscription:
            return jsonify({
                'success': False,
                'error': 'No active subscription found'
            }), 404
        
        # Cancel in Stripe
        stripe_service.cancel_subscription(
            subscription.stripe_subscription_id,
            at_period_end=at_period_end
        )
        
        # Update in database
        if at_period_end:
            subscription.status = 'canceled'
        else:
            subscription.status = 'canceled'
            subscription.current_period_end = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Subscription canceled successfully'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@billing_bp.route('/api/billing/subscription/update', methods=['POST'])
@jwt_required()
def update_subscription():
    """Update subscription plan"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        new_plan_type = data.get('plan_type')
        new_billing_cycle = data.get('billing_cycle', 'monthly')
        
        if not new_plan_type:
            return jsonify({
                'success': False,
                'error': 'Plan type is required'
            }), 400
        
        subscription = Subscription.query.filter_by(user_id=user_id).first()
        if not subscription:
            return jsonify({
                'success': False,
                'error': 'No active subscription found'
            }), 404
        
        # Get new plan details
        new_plan = plan_manager.get_plan(new_plan_type, new_billing_cycle)
        if not new_plan:
            return jsonify({
                'success': False,
                'error': 'Invalid plan'
            }), 400
        
        # Update in Stripe
        new_price_id = plan_manager.get_price_id(new_plan_type, new_billing_cycle)
        stripe_service.update_subscription(
            subscription.stripe_subscription_id,
            new_price_id
        )
        
        # Update in database
        subscription.plan_type = new_plan_type
        subscription.billing_cycle = new_billing_cycle
        subscription.amount = new_plan['price']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Subscription updated successfully',
            'subscription': {
                'plan_type': subscription.plan_type,
                'billing_cycle': subscription.billing_cycle,
                'amount': subscription.amount,
                'features': new_plan.get('features', []),
                'limits': new_plan.get('limits', {})
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@billing_bp.route('/api/billing/usage', methods=['GET'])
@jwt_required()
def get_usage():
    """Get current usage for the billing period"""
    try:
        user_id = get_jwt_identity()
        
        subscription = Subscription.query.filter_by(user_id=user_id).first()
        if not subscription:
            return jsonify({
                'success': True,
                'usage': {
                    'messages': 0,
                    'scrapes': 0,
                    'emails': 0
                },
                'limits': {
                    'max_messages_per_day': 10,
                    'max_scrapes_per_day': 5,
                    'max_emails_per_day': 10
                }
            })
        
        # Get current period usage
        period_start = subscription.current_period_start
        period_end = subscription.current_period_end
        
        usage_records = UsageRecord.query.filter(
            UsageRecord.user_id == user_id,
            UsageRecord.date >= period_start,
            UsageRecord.date <= period_end
        ).all()
        
        # Calculate usage by feature
        usage = {
            'messages': 0,
            'scrapes': 0,
            'emails': 0
        }
        
        for record in usage_records:
            if record.feature in usage:
                usage[record.feature] += record.quantity
        
        # Get plan limits
        plan = plan_manager.get_plan(subscription.plan_type, subscription.billing_cycle)
        limits = plan.get('limits', {})
        
        return jsonify({
            'success': True,
            'usage': usage,
            'limits': limits,
            'period_start': period_start.isoformat(),
            'period_end': period_end.isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@billing_bp.route('/api/billing/usage', methods=['POST'])
@jwt_required()
def record_usage():
    """Record usage for a feature"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        feature = data.get('feature')
        quantity = data.get('quantity', 1)
        description = data.get('description')
        
        if not feature:
            return jsonify({
                'success': False,
                'error': 'Feature is required'
            }), 400
        
        subscription = Subscription.query.filter_by(user_id=user_id).first()
        if not subscription:
            return jsonify({
                'success': False,
                'error': 'No active subscription found'
            }), 404
        
        # Record usage
        usage_record = UsageRecord(
            subscription_id=subscription.id,
            user_id=user_id,
            feature=feature,
            quantity=quantity,
            description=description
        )
        
        db.session.add(usage_record)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Usage recorded successfully'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@billing_bp.route('/api/billing/invoices', methods=['GET'])
@jwt_required()
def get_invoices():
    """Get user's invoices"""
    try:
        user_id = get_jwt_identity()
        
        invoices = Invoice.query.filter_by(user_id=user_id).order_by(Invoice.created_at.desc()).limit(10).all()
        
        invoice_list = []
        for invoice in invoices:
            invoice_list.append({
                'id': invoice.id,
                'invoice_number': invoice.invoice_number,
                'amount': invoice.amount,
                'currency': invoice.currency,
                'status': invoice.status,
                'due_date': invoice.due_date.isoformat(),
                'paid_at': invoice.paid_at.isoformat() if invoice.paid_at else None,
                'created_at': invoice.created_at.isoformat()
            })
        
        return jsonify({
            'success': True,
            'invoices': invoice_list
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@billing_bp.route('/api/billing/payment-method', methods=['POST'])
@jwt_required()
def add_payment_method():
    """Add payment method to customer"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        payment_method_id = data.get('payment_method_id')
        if not payment_method_id:
            return jsonify({
                'success': False,
                'error': 'Payment method ID is required'
            }), 400
        
        # Get user
        from api_server import User
        user = User.query.get(user_id)
        if not user or not user.stripe_customer_id:
            return jsonify({
                'success': False,
                'error': 'No Stripe customer found'
            }), 404
        
        # Attach payment method to customer
        import stripe
        stripe.PaymentMethod.attach(
            payment_method_id,
            customer=user.stripe_customer_id
        )
        
        return jsonify({
            'success': True,
            'message': 'Payment method added successfully'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@billing_bp.route('/api/billing/webhook', methods=['POST'])
def stripe_webhook():
    """Handle Stripe webhooks"""
    try:
        payload = request.get_data()
        sig_header = request.headers.get('Stripe-Signature')
        
        if not sig_header:
            return jsonify({'error': 'No signature header'}), 400
        
        # Verify webhook signature
        event = stripe_service.verify_webhook_signature(payload, sig_header)
        
        # Handle different event types
        if event['type'] == 'invoice.payment_succeeded':
            handle_payment_succeeded(event['data']['object'])
        elif event['type'] == 'invoice.payment_failed':
            handle_payment_failed(event['data']['object'])
        elif event['type'] == 'customer.subscription.updated':
            handle_subscription_updated(event['data']['object'])
        elif event['type'] == 'customer.subscription.deleted':
            handle_subscription_deleted(event['data']['object'])
        
        return jsonify({'success': True})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

def handle_payment_succeeded(invoice):
    """Handle successful payment"""
    try:
        subscription = Subscription.query.filter_by(
            stripe_subscription_id=invoice['subscription']
        ).first()
        
        if subscription:
            # Create payment record
            payment = Payment(
                subscription_id=subscription.id,
                user_id=subscription.user_id,
                stripe_payment_intent_id=invoice['payment_intent'],
                stripe_invoice_id=invoice['id'],
                amount=invoice['amount_paid'] / 100,  # Convert from cents
                currency=invoice['currency'],
                status='succeeded',
                description=f"Invoice {invoice['number']}"
            )
            
            db.session.add(payment)
            db.session.commit()
            
    except Exception as e:
        print(f"Error handling payment succeeded: {e}")

def handle_payment_failed(invoice):
    """Handle failed payment"""
    try:
        subscription = Subscription.query.filter_by(
            stripe_subscription_id=invoice['subscription']
        ).first()
        
        if subscription:
            subscription.status = 'past_due'
            db.session.commit()
            
    except Exception as e:
        print(f"Error handling payment failed: {e}")

def handle_subscription_updated(subscription_data):
    """Handle subscription updates"""
    try:
        subscription = Subscription.query.filter_by(
            stripe_subscription_id=subscription_data['id']
        ).first()
        
        if subscription:
            subscription.status = subscription_data['status']
            subscription.current_period_start = datetime.fromtimestamp(subscription_data['current_period_start'])
            subscription.current_period_end = datetime.fromtimestamp(subscription_data['current_period_end'])
            
            db.session.commit()
            
    except Exception as e:
        print(f"Error handling subscription update: {e}")

def handle_subscription_deleted(subscription_data):
    """Handle subscription deletion"""
    try:
        subscription = Subscription.query.filter_by(
            stripe_subscription_id=subscription_data['id']
        ).first()
        
        if subscription:
            subscription.status = 'canceled'
            db.session.commit()
            
    except Exception as e:
        print(f"Error handling subscription deletion: {e}") 