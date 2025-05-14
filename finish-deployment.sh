#!/bin/bash
# Script to finish the deployment automatically

# Kill any running processes
echo "Stopping any running processes..."
./kill-servers.sh

# Check if the backend is accessible
echo "Testing backend connection..."
BACKEND_URL="https://crypto-rewards-tr-api-d191d680a3fa.herokuapp.com"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BACKEND_URL/api/rewards)

if [ $STATUS -eq 200 ]; then
    echo "✅ Backend is accessible! Status code: $STATUS"
else
    echo "❌ Could not access backend. Status code: $STATUS"
    echo "Attempting to redeploy backend..."
    
    # Redeploy backend
    ./deploy-backend-simple.sh
    
    # Check again
    echo "Testing backend connection again..."
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BACKEND_URL/api/rewards)
    
    if [ $STATUS -eq 200 ]; then
        echo "✅ Backend redeployment successful!"
    else
        echo "❌ Backend still not accessible. Please try manually later."
    fi
fi

# Deploy frontend with environment variable
echo "Deploying frontend with correct API URL..."
echo "NEXT_PUBLIC_API_URL=$BACKEND_URL" > .env.production

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod -y

echo ""
echo "🎉 Deployment process complete!"
echo ""
echo "Your website URLs:"
echo "- Frontend: https://crypto-rewards-comparison-turkey-9115b17ww.vercel.app"
echo "- Backend API: $BACKEND_URL"
echo ""
echo "Try visiting your frontend URL in your browser to see your website!" 