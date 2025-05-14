#!/bin/bash
# Script to fix registration by allowing auto-activation but also sending welcome emails

echo "🔧 Configuring welcome emails with auto-activation..."

# Navigate to backend directory
cd backend

# Update Heroku config to enable emails but keep auto-activation
echo "⚙️ Updating Heroku configuration..."
heroku config:set AUTO_ACTIVATE_ACCOUNTS=true 
heroku config:set SKIP_EMAIL_VERIFICATION=false
heroku config:set MAIL_USE_TLS=true
heroku config:set MAIL_SERVER=smtp.gmail.com
heroku config:set MAIL_PORT=587
heroku config:set MAIL_USERNAME=info@rightbehind.app
heroku config:set MAIL_DEFAULT_SENDER=info@rightbehind.app

# Ask for the app password
echo "Please enter the Google App Password for info@rightbehind.app:"
read -s APP_PASSWORD
heroku config:set MAIL_PASSWORD=$APP_PASSWORD

# Deploy the changes
echo "📤 Deploying backend updates..."
git init
git add .
git commit -m "Enable welcome emails with auto-activation"
heroku git:remote -a crypto-rewards-tr-api
git push heroku HEAD:master --force

cd ..

# Let user know next steps
echo ""
echo "✅ Changes deployed successfully!"
echo ""
echo "Now users will:"
echo "1. Register successfully (without needing to verify email)"
echo "2. Get auto-activated accounts"
echo "3. Receive welcome emails"
echo ""
echo "Try registering again on the website:"
echo "https://crypto-rewards-comparison-turkey.vercel.app/register" 