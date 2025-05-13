#!/bin/bash
# Script to deploy the backend to Heroku

echo "Deploying backend to Heroku..."

# If you don't have Heroku CLI installed
if ! command -v heroku &> /dev/null; then
    echo "Please install the Heroku CLI first: https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Log in to Heroku if not already logged in
if ! heroku auth:whoami &> /dev/null; then
    echo "Please log in to Heroku:"
    heroku login
fi

# Create Heroku app if it doesn't exist
APP_NAME="crypto-rewards-api"
if ! heroku apps:info --app $APP_NAME &> /dev/null; then
    echo "Creating Heroku app: $APP_NAME"
    heroku create $APP_NAME
else
    echo "Using existing Heroku app: $APP_NAME"
fi

# Set up environment variables
echo "Setting up environment variables..."
heroku config:set API_KEY=$(openssl rand -hex 16) --app $APP_NAME
heroku config:set CORS_ORIGINS="http://localhost:3000,https://crypto-rewards-comparison-turkey.vercel.app" --app $APP_NAME
heroku config:set UPDATE_INTERVAL_HOURS=6 --app $APP_NAME

# Deploy to Heroku
echo "Deploying to Heroku..."
git subtree push --prefix backend heroku main

echo "Deployment complete!"
echo "Your API is now available at: https://$APP_NAME.herokuapp.com/api" 