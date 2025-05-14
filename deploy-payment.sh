#!/bin/bash
# Script to deploy Stripe payment integration

echo "🚀 Deploying payment system..."

# Navigate to backend directory
cd backend

# Update database with new premium fields
echo "⚙️ Configuring Stripe environment variables..."
echo "Enter your Stripe secret key (sk_test_...):"
read -s STRIPE_SECRET_KEY
heroku config:set STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY

echo "Enter your Stripe webhook secret (whsec_...):"
read -s STRIPE_WEBHOOK_SECRET
heroku config:set STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK_SECRET

echo "Enter your Stripe Monthly price ID (price_...):"
read -s STRIPE_MONTHLY_PRICE_ID
heroku config:set STRIPE_MONTHLY_PRICE_ID=$STRIPE_MONTHLY_PRICE_ID

echo "Enter your Stripe Annual price ID (price_...):"
read -s STRIPE_ANNUAL_PRICE_ID
heroku config:set STRIPE_ANNUAL_PRICE_ID=$STRIPE_ANNUAL_PRICE_ID

# Deploy backend changes
echo "📤 Deploying backend updates..."
git add .
git commit -m "Integrate Stripe payment system"
heroku git:remote -a crypto-rewards-tr-api
git push heroku HEAD:master --force

cd ..

# Deploy frontend
echo "📤 Deploying frontend..."
vercel --prod -y

echo ""
echo "✅ Payment system deployed successfully!"
echo ""
echo "Here's what you need to do next:"
echo "1. Log into your Stripe Dashboard (https://dashboard.stripe.com)"
echo "2. Set up a webhook endpoint at: https://crypto-rewards-tr-api-d191d680a3fa.herokuapp.com/api/payment/webhook"
echo "3. Make sure your webhook listens for these events:"
echo "   - checkout.session.completed"
echo "   - customer.subscription.updated"
echo "   - customer.subscription.deleted"
echo ""
echo "Your payment system is now ready for testing! Users can subscribe at:"
echo "https://crypto-rewards-comparison-turkey.vercel.app/premium" 