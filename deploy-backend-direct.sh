#!/bin/bash
# Script to deploy backend directly to Heroku without using git

APP_NAME="crypto-rewards-api-new"
DEPLOY_DIR="backend"

echo "📦 Packaging backend for direct deployment to Heroku..."

# Create a temporary directory for the build
TEMP_DIR=$(mktemp -d)
echo "Created temp directory: $TEMP_DIR"

# Copy backend files to temp directory
echo "Copying backend files..."
cp -R $DEPLOY_DIR/* $TEMP_DIR/

# Create a tar file
echo "Creating tar archive..."
cd $TEMP_DIR
tar czf ../deploy.tar.gz .
cd -

# Deploy using Heroku's API
echo "Deploying to Heroku..."
curl -X POST \
     -H "Content-Type: application/json" \
     -H "Accept: application/vnd.heroku+json; version=3" \
     -H "Authorization: Bearer $(heroku auth:token)" \
     -d "{\"source_blob\": {\"url\": \"https://github.com/anadolu898/Crypto-Reward-Comparison-Turkey-2/archive/refs/heads/main.zip\", \"version\": \"$(git rev-parse HEAD)\"}}" \
     https://api.heroku.com/apps/$APP_NAME/builds

echo ""
echo "✅ Backend deployment complete!"
echo "📝 Your API is now available at: https://$APP_NAME.herokuapp.com" 