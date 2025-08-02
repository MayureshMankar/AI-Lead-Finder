# 🚀 Professional Billing & Payment System Setup Guide

## Overview

This guide will help you set up a complete professional billing and payment system for your AI Lead Finder application using Stripe. The system includes:

- ✅ **Subscription Management**: Create, update, and cancel subscriptions
- ✅ **Usage Tracking**: Monitor feature usage and enforce limits
- ✅ **Payment Processing**: Secure payment handling with Stripe
- ✅ **Invoice Management**: Automatic invoice generation and tracking
- ✅ **Webhook Handling**: Real-time payment and subscription updates
- ✅ **Billing Dashboard**: User-friendly billing management interface

---

## 📋 Prerequisites

1. **Stripe Account**: Sign up at [stripe.com](https://stripe.com)
2. **MySQL Database**: Running and accessible
3. **Python Environment**: Python 3.8+ with pip
4. **Node.js Environment**: Node.js 18+ with npm

---

## 🔧 Step 1: Stripe Setup

### 1.1 Create Stripe Products and Prices

1. **Log into your Stripe Dashboard**
2. **Create Products** for each plan:
   - Go to Products → Add Product
   - Create products for: Starter, Pro, Business, Enterprise

3. **Create Prices** for each product:
   - For each product, create monthly and yearly prices
   - Note down the Price IDs (they start with `price_`)

### 1.2 Get API Keys

1. **Get your API keys** from Stripe Dashboard:
   - Go to Developers → API Keys
   - Copy your **Publishable Key** and **Secret Key**

2. **Set up Webhooks**:
   - Go to Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/billing/webhook`
   - Select events: `invoice.payment_succeeded`, `invoice.payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy the **Webhook Secret**

---

## 🔧 Step 2: Environment Configuration

### 2.1 Backend Environment

1. **Copy the example environment file**:
   ```bash
   cp env.example .env
   ```

2. **Update your `.env` file** with your actual values:
   ```env
   # Stripe Configuration
   STRIPE_SECRET_KEY=sk_test_your_actual_secret_key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key
   STRIPE_WEBHOOK_SECRET=whsec_your_actual_webhook_secret

   # Stripe Price IDs (replace with your actual price IDs)
   STRIPE_STARTER_MONTHLY_PRICE_ID=price_starter_monthly_actual_id
   STRIPE_STARTER_YEARLY_PRICE_ID=price_starter_yearly_actual_id
   STRIPE_PRO_MONTHLY_PRICE_ID=price_pro_monthly_actual_id
   STRIPE_PRO_YEARLY_PRICE_ID=price_pro_yearly_actual_id
   STRIPE_BUSINESS_MONTHLY_PRICE_ID=price_business_monthly_actual_id
   STRIPE_BUSINESS_YEARLY_PRICE_ID=price_business_yearly_actual_id
   STRIPE_ENTERPRISE_MONTHLY_PRICE_ID=price_enterprise_monthly_actual_id
   STRIPE_ENTERPRISE_YEARLY_PRICE_ID=price_enterprise_yearly_actual_id
   ```

### 2.2 Frontend Environment

1. **Create `.env.local` in the frontend directory**:
   ```bash
   cd ai-lead-finder-ui
   touch .env.local
   ```

2. **Add frontend environment variables**:
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key
   NEXT_PUBLIC_API_URL=http://localhost:5001
   ```

---

## 🔧 Step 3: Database Setup

### 3.1 Install Dependencies

```bash
# Install Python dependencies
pip install -r requirements.txt

# Install frontend dependencies
cd ai-lead-finder-ui
npm install
```

### 3.2 Run Database Migration

```bash
# Run the billing migration script
python migrate_billing.py
```

This will:
- ✅ Create all billing tables
- ✅ Add necessary columns to existing tables
- ✅ Create initial subscription plans
- ✅ Create starter subscriptions for existing users

---

## 🔧 Step 4: Integration

### 4.1 Update User Model

The migration script automatically adds the necessary columns to your User table. If you need to manually update the User model, add these fields:

```python
class User(db.Model):
    # ... existing fields ...
    stripe_customer_id = db.Column(db.String(255), nullable=True)
    subscription_id = db.Column(db.Integer, db.ForeignKey('subscriptions.id'), nullable=True)
    
    # Relationships
    subscription = db.relationship('Subscription', back_populates='user')
    payments = db.relationship('Payment', back_populates='user')
    usage_records = db.relationship('UsageRecord', back_populates='user')
    invoices = db.relationship('Invoice', back_populates='user')
```

### 4.2 Usage Tracking Integration

Add usage tracking to your existing features:

```python
# Example: Track message generation
from billing.billing_api import record_usage

# After generating a message
await record_usage({
    'feature': 'messages',
    'quantity': 1,
    'description': 'Generated AI message'
})
```

---

## 🔧 Step 5: Testing

### 5.1 Start the Application

```bash
# Start backend
python api_server.py

# Start frontend (in another terminal)
cd ai-lead-finder-ui
npm run dev
```

### 5.2 Test the Billing System

1. **Create a test subscription**:
   - Go to `/billing` page
   - Try upgrading to a paid plan
   - Use Stripe test card: `4242 4242 4242 4242`

2. **Test usage tracking**:
   - Use features that should be tracked
   - Check usage in the billing dashboard

3. **Test webhooks** (using Stripe CLI):
   ```bash
   # Install Stripe CLI
   stripe listen --forward-to localhost:5001/api/billing/webhook
   ```

---

## 📊 API Endpoints

### Subscription Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/billing/plans` | GET | Get all available plans |
| `/api/billing/subscription` | GET | Get current subscription |
| `/api/billing/subscription` | POST | Create new subscription |
| `/api/billing/subscription/update` | POST | Update subscription |
| `/api/billing/subscription/cancel` | POST | Cancel subscription |

### Usage Tracking

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/billing/usage` | GET | Get current usage |
| `/api/billing/usage` | POST | Record usage |

### Payment Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/billing/invoices` | GET | Get user invoices |
| `/api/billing/payment-method` | POST | Add payment method |
| `/api/billing/webhook` | POST | Stripe webhook handler |

---

## 🎯 Features Implemented

### ✅ Subscription Plans
- **Starter**: Free plan with limited features
- **Pro**: $29/month or $23/year with unlimited features
- **Business**: $79/month or $63/year with team features
- **Enterprise**: Custom pricing with dedicated support

### ✅ Usage Limits
- **Messages per day**: Track AI message generation
- **Scrapes per day**: Track job scraping
- **Emails per day**: Track email outreach
- **Lead storage**: Track lead database usage

### ✅ Payment Features
- **Secure payments**: Stripe-powered payment processing
- **Automatic billing**: Recurring subscription payments
- **Invoice generation**: Automatic invoice creation
- **Payment history**: Complete payment tracking

### ✅ User Experience
- **Billing dashboard**: Complete subscription management
- **Usage monitoring**: Real-time usage tracking
- **Plan upgrades**: Seamless plan changes
- **Payment methods**: Multiple payment options

---

## 🔒 Security Features

- **Webhook verification**: Secure webhook handling
- **JWT authentication**: Protected billing endpoints
- **Rate limiting**: API request throttling
- **Input validation**: Secure data handling
- **Error handling**: Comprehensive error management

---

## 🚀 Production Deployment

### 1. Update Environment Variables
- Use production Stripe keys
- Set up production database
- Configure production webhook URLs

### 2. SSL Configuration
- Enable HTTPS for webhook endpoints
- Configure SSL certificates
- Set up secure headers

### 3. Monitoring
- Set up Stripe dashboard monitoring
- Configure error logging
- Monitor webhook delivery

---

## 📞 Support

### Common Issues

1. **Webhook not receiving events**:
   - Check webhook endpoint URL
   - Verify webhook secret
   - Check server logs

2. **Payment failures**:
   - Verify Stripe keys
   - Check customer creation
   - Review error logs

3. **Usage not tracking**:
   - Verify usage recording calls
   - Check database connections
   - Review API responses

### Getting Help

- Check Stripe documentation: [stripe.com/docs](https://stripe.com/docs)
- Review application logs
- Test with Stripe test mode first

---

## 🎉 Congratulations!

You now have a complete professional billing and payment system integrated into your AI Lead Finder application. The system is production-ready and includes all the features needed for a successful SaaS business.

**Next Steps:**
1. Test thoroughly in development
2. Set up production environment
3. Configure monitoring and alerts
4. Launch your billing system!

---

*For additional support or questions, refer to the Stripe documentation or contact your development team.* 