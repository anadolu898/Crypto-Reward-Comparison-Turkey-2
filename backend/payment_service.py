import os
import stripe
import logging
from datetime import datetime, timedelta
from flask import current_app, Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User

# Set up logging
logger = logging.getLogger("payment_service")

# Set up Stripe API key
stripe.api_key = os.environ.get('STRIPE_SECRET_KEY', 'sk_test_your_test_key')

# Create Blueprint
payment_bp = Blueprint('payment', __name__)

# Plan IDs and prices (can be moved to environment variables later)
PLANS = {
    'monthly': {
        'name': 'Premium Monthly',
        'price_id': os.environ.get('STRIPE_MONTHLY_PRICE_ID', 'price_your_monthly_id'),
        'amount': 9900,  # 99.00 TRY
        'currency': 'try',
        'interval': 'month'
    },
    'annual': {
        'name': 'Premium Annual',
        'price_id': os.environ.get('STRIPE_ANNUAL_PRICE_ID', 'price_your_annual_id'),
        'amount': 99900,  # 999.00 TRY
        'currency': 'try',
        'interval': 'year'
    }
}

@payment_bp.route('/create-checkout-session', methods=['POST'])
@jwt_required()
def create_checkout_session():
    """Create a Stripe Checkout Session for subscription"""
    try:
        data = request.get_json()
        plan_id = data.get('plan', 'monthly')
        
        if plan_id not in PLANS:
            return jsonify({'error': 'Invalid plan selected'}), 400
        
        plan = PLANS[plan_id]
        
        # Get the current user
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Create or retrieve Stripe customer
        if not user.stripe_customer_id:
            customer = stripe.Customer.create(
                email=user.email,
                name=user.name,
                metadata={'user_id': user.id}
            )
            user.stripe_customer_id = customer.id
            db.session.commit()
        
        # Get success/cancel URLs
        success_url = os.environ.get('FRONTEND_URL', 'http://localhost:3000') + '/payment/success?session_id={CHECKOUT_SESSION_ID}'
        cancel_url = os.environ.get('FRONTEND_URL', 'http://localhost:3000') + '/payment/cancel'
        
        # Create checkout session
        checkout_session = stripe.checkout.Session.create(
            customer=user.stripe_customer_id,
            payment_method_types=['card'],
            line_items=[{
                'price': plan['price_id'],
                'quantity': 1,
            }],
            mode='subscription',
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={
                'user_id': user.id,
                'plan': plan_id
            }
        )
        
        return jsonify({'checkout_url': checkout_session.url})
    
    except Exception as e:
        logger.error(f"Checkout session creation failed: {str(e)}")
        return jsonify({'error': 'Failed to create checkout session'}), 500

@payment_bp.route('/webhook', methods=['POST'])
def webhook():
    """Handle Stripe webhook events"""
    payload = request.get_data(as_text=True)
    sig_header = request.headers.get('Stripe-Signature')
    
    try:
        # Verify webhook signature using your webhook secret
        webhook_secret = os.environ.get('STRIPE_WEBHOOK_SECRET', 'whsec_your_webhook_secret')
        event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
        
        # Handle the event
        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            handle_checkout_completed(session)
        elif event['type'] == 'customer.subscription.updated':
            subscription = event['data']['object']
            handle_subscription_updated(subscription)
        elif event['type'] == 'customer.subscription.deleted':
            subscription = event['data']['object']
            handle_subscription_deleted(subscription)
        
        return jsonify({'success': True})
    
    except stripe.error.SignatureVerificationError:
        logger.error("Invalid webhook signature")
        return jsonify({'error': 'Invalid signature'}), 400
    except Exception as e:
        logger.error(f"Webhook error: {str(e)}")
        return jsonify({'error': 'Webhook error'}), 500

def handle_checkout_completed(session):
    """Process a successful checkout session"""
    try:
        user_id = session.get('metadata', {}).get('user_id')
        
        if not user_id:
            logger.error("No user_id in session metadata")
            return
        
        user = User.query.get(user_id)
        if not user:
            logger.error(f"User {user_id} not found")
            return
        
        # Get subscription details
        subscription_id = session.get('subscription')
        if subscription_id:
            subscription = stripe.Subscription.retrieve(subscription_id)
            
            # Update user premium status
            user.is_premium = True
            user.premium_since = datetime.utcnow()
            user.stripe_subscription_id = subscription_id
            
            # Calculate expiration based on subscription
            current_period_end = subscription.get('current_period_end')
            if current_period_end:
                user.premium_expires = datetime.fromtimestamp(current_period_end)
            
            db.session.commit()
            logger.info(f"User {user_id} upgraded to premium")
        
    except Exception as e:
        logger.error(f"Error processing checkout: {str(e)}")

def handle_subscription_updated(subscription):
    """Handle a subscription update event"""
    try:
        customer_id = subscription.get('customer')
        user = User.query.filter_by(stripe_customer_id=customer_id).first()
        
        if not user:
            logger.error(f"No user found for customer {customer_id}")
            return
        
        # Update subscription status
        status = subscription.get('status')
        current_period_end = subscription.get('current_period_end')
        
        if status == 'active':
            user.is_premium = True
            if current_period_end:
                user.premium_expires = datetime.fromtimestamp(current_period_end)
        elif status in ['canceled', 'unpaid', 'past_due']:
            # Don't immediately remove premium status,
            # wait until it expires based on what they've paid
            pass
        
        db.session.commit()
        logger.info(f"Subscription updated for user {user.id}: status={status}")
        
    except Exception as e:
        logger.error(f"Error updating subscription: {str(e)}")

def handle_subscription_deleted(subscription):
    """Handle a subscription deletion event"""
    try:
        customer_id = subscription.get('customer')
        user = User.query.filter_by(stripe_customer_id=customer_id).first()
        
        if not user:
            logger.error(f"No user found for customer {customer_id}")
            return
        
        # Set expiration to the end of the current period
        # (they've already paid for this period)
        current_period_end = subscription.get('current_period_end')
        if current_period_end:
            user.premium_expires = datetime.fromtimestamp(current_period_end)
        
        db.session.commit()
        logger.info(f"Subscription canceled for user {user.id}")
        
    except Exception as e:
        logger.error(f"Error handling subscription deletion: {str(e)}")

def init_app(app):
    """Initialize payment module with the app"""
    app.register_blueprint(payment_bp, url_prefix='/api/payment') 