#!/bin/bash
# Simple backend deployment script

echo "🚀 Deploying backend to Heroku..."

# Make sure we're using the Homebrew Git version
export PATH="/opt/homebrew/Cellar/git/2.49.0/bin:$PATH"

# Set up necessary config
echo "Setting up environment variables..."
heroku config:set SECRET_KEY=$(openssl rand -hex 16) -a crypto-rewards-tr-api
heroku config:set JWT_SECRET_KEY=$(openssl rand -hex 16) -a crypto-rewards-tr-api
heroku config:set CRYPTO_ENV=production -a crypto-rewards-tr-api
heroku config:set CORS_ORIGINS="https://crypto-rewards-comparison-turkey-9115b17ww.vercel.app,http://localhost:3000" -a crypto-rewards-tr-api
heroku config:set FRONTEND_URL=https://crypto-rewards-comparison-turkey-9115b17ww.vercel.app -a crypto-rewards-tr-api

# Make sure we're using the Python buildpack
heroku buildpacks:clear -a crypto-rewards-tr-api
heroku buildpacks:set heroku/python -a crypto-rewards-tr-api

# Create a temporary directory for deployment
echo "Preparing files for deployment..."
rm -rf deploy_temp
mkdir -p deploy_temp
cp -r backend/* deploy_temp/
cd deploy_temp

# Remove any nested git directories
if [ -d ".git" ]; then
  rm -rf .git
fi

if [ -d "deploy" ]; then
  rm -rf deploy
fi

# Initialize Git
git init
git add .
git commit -m "Deploy backend"

# Deploy to Heroku
echo "Pushing to Heroku..."
heroku git:remote -a crypto-rewards-tr-api
git push heroku HEAD:master --force

echo "✅ Backend deployment complete!"
cd ..
rm -rf deploy_temp 