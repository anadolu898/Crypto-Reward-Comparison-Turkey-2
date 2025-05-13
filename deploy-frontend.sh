#!/bin/bash
# Script to deploy the frontend to Vercel

echo "Deploying frontend to Vercel..."

# If you don't have Vercel CLI installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Build the project
echo "Building the project..."
npm run build

# Deploy to Vercel
echo "Deploying to Vercel..."
echo "Follow the prompts to log in and deploy"
echo "For environment variables, set NEXT_PUBLIC_API_BASE_URL to your Heroku API URL"
vercel --prod

echo "Deployment complete!" 