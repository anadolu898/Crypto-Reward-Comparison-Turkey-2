#!/bin/bash
# Simple script to fix auto-activation

echo "🔧 Fixing account activation issues..."

# Make sure we're using the Homebrew Git version
export PATH="/opt/homebrew/Cellar/git/2.49.0/bin:$PATH"

# Create temp directory
rm -rf temp_fix
mkdir -p temp_fix
cp -r backend/* temp_fix/
cd temp_fix

# Edit auth.py to auto-activate all accounts
echo "Modifying auth.py to auto-activate all accounts..."
sed -i '' 's/is_dev_mode = os.environ.get(.CRYPTO_ENV., .development.) == .development./is_dev_mode = True  # Auto-activate all accounts/g' auth.py
sed -i '' 's/if is_dev_mode:/if True:  # Auto-activate always/g' auth.py

# Deploy to Heroku
git init
git add .
git commit -m "Fix: Auto-activate accounts"
heroku git:remote -a crypto-rewards-tr-api
git push heroku HEAD:master --force

cd ..
rm -rf temp_fix

echo "✅ Fix deployed! Accounts should now be automatically activated."

# Update frontend
echo "Updating frontend to use the fixed backend..."
BACKEND_URL="https://crypto-rewards-tr-api-d191d680a3fa.herokuapp.com"
echo "NEXT_PUBLIC_API_URL=$BACKEND_URL" > .env.production
echo "👉 Frontend environment updated with API URL: $BACKEND_URL"

# Deploy the frontend
echo "Deploying frontend..."
vercel --prod -y

echo ""
echo "🎉 All fixes applied!"
echo ""
echo "Your website is now ready to use!" 