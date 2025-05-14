#!/bin/bash
# Script to deploy the latest updates to both backend and frontend

echo "🚀 Deploying updates to backend and frontend..."

# Make sure we use the right Git version
export PATH="/opt/homebrew/Cellar/git/2.49.0/bin:$PATH"

# Deploy backend first
echo "📤 Deploying backend to Heroku..."
cd backend
git init
git add .
git commit -m "Deploy with welcome email and improved notifications"
heroku git:remote -a crypto-rewards-tr-api
git push heroku HEAD:master --force
cd ..

# Deploy frontend
echo "📤 Deploying frontend to Vercel..."
# Ensure the environment variable is set
echo "NEXT_PUBLIC_API_URL=https://crypto-rewards-tr-api-d191d680a3fa.herokuapp.com" > .env.production
vercel --prod -y

echo ""
echo "✅ Deployment completed!"
echo ""
echo "Your website is now ready at:"
echo "Frontend: https://crypto-rewards-comparison-turkey.vercel.app"
echo "Backend API: https://crypto-rewards-tr-api-d191d680a3fa.herokuapp.com"
echo ""
echo "Users will now receive a welcome email when they register and see an improved success notification." 