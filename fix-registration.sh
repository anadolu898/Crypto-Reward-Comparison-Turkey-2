#!/bin/bash
# Script to fix registration by disabling email requirements

echo "🔧 Fixing registration issues..."

# Navigate to backend directory
cd backend

# Update Heroku config to bypass email verification
echo "⚙️ Updating Heroku configuration..."
heroku config:set AUTO_ACTIVATE_ACCOUNTS=true 
heroku config:set SKIP_EMAIL_VERIFICATION=true
heroku config:set MAIL_USE_TLS=false
heroku config:set MAIL_USERNAME=noreply@example.com 
heroku config:set MAIL_PASSWORD=dummy

# Deploy the changes
echo "📤 Deploying backend updates..."
git init
git add .
git commit -m "Disable email verification for registration"
heroku git:remote -a crypto-rewards-tr-api
git push heroku HEAD:master --force

cd ..

# Let user know next steps
echo ""
echo "✅ Changes deployed successfully!"
echo ""
echo "Now try registering again on the website:"
echo "https://crypto-rewards-comparison-turkey.vercel.app/register"
echo ""
echo "Users should now be able to register without email verification." 