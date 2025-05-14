#!/bin/bash
# Script to fix email configuration issues and redeploy

echo "🔧 Updating email handling in the application..."

# Update Heroku environment variables with app password
# For Google accounts, make sure to generate an app password in your account security settings
echo "⚙️ Updating email credentials on Heroku..."
cd backend
heroku config:set MAIL_USERNAME=info@rightbehind.app
# Use app password instead of regular password
echo "Please enter the Google App Password for info@rightbehind.app:"
read -s APP_PASSWORD
heroku config:set MAIL_PASSWORD=$APP_PASSWORD
cd ..

echo "📤 Deploying updates to both backend and frontend..."

# Deploy backend first
echo "📤 Deploying backend to Heroku..."
cd backend
git init
git add .
git commit -m "Improve email error handling and user feedback"
heroku git:remote -a crypto-rewards-tr-api
git push heroku HEAD:master --force
cd ..

# Deploy frontend
echo "📤 Deploying frontend to Vercel..."
# Ensure the environment variable is set
echo "NEXT_PUBLIC_API_URL=https://crypto-rewards-tr-api-d191d680a3fa.herokuapp.com" > .env.production
vercel --prod -y

echo ""
echo "✅ Email handling improvements deployed!"
echo ""
echo "👉 Important notes:"
echo "1. Users can still register even if email sending fails"
echo "2. The success message has been updated to not promise email delivery"
echo "3. Detailed email error logging has been added to help troubleshoot"
echo ""
echo "To check the logs for email issues, run: heroku logs --tail" 