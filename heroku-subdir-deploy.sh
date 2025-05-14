#!/bin/bash
# Script to deploy a subdirectory to Heroku using the subdir buildpack

APP_NAME="crypto-rewards-tr-api"
SUBDIRECTORY="backend"

echo "🔧 Setting up Heroku buildpacks for subdirectory deployment..."
# First, add the subdirectory buildpack
heroku buildpacks:clear -a $APP_NAME
heroku buildpacks:add -a $APP_NAME https://github.com/timanovsky/subdir-heroku-buildpack.git
# Then add the Python buildpack
heroku buildpacks:add -a $APP_NAME heroku/python

echo "🔧 Setting the PROJECT_PATH to $SUBDIRECTORY..."
# Set the subdirectory path
heroku config:set PROJECT_PATH=$SUBDIRECTORY -a $APP_NAME

echo "🔧 Setting up environment variables..."
heroku config:set API_KEY=$(openssl rand -hex 16) -a $APP_NAME
heroku config:set CORS_ORIGINS="http://localhost:3000,https://crypto-rewards-comparison-turkey-fvfhj1etx.vercel.app" -a $APP_NAME
heroku config:set UPDATE_INTERVAL_HOURS=6 -a $APP_NAME

echo "🚀 Setting up GitHub automatic deployments..."
echo "Please manually connect GitHub in the Heroku dashboard:"
echo "URL: https://dashboard.heroku.com/apps/$APP_NAME/deploy/github"

echo "✅ Setup complete!"
echo "Now go to the Heroku dashboard and manually deploy from the 'Deploy' tab."
echo "URL: https://dashboard.heroku.com/apps/$APP_NAME/deploy/github" 