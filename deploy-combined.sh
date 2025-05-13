#!/bin/bash
# Combined deployment script for both backend and frontend

echo "🚀 Starting combined deployment process..."

# Ask which part to deploy
echo ""
echo "What would you like to deploy?"
echo "1) Deploy both frontend and backend"
echo "2) Deploy frontend only"
echo "3) Deploy backend only"
read -p "Enter your choice (1-3): " DEPLOY_CHOICE

# Deploy Backend (Heroku)
deploy_backend() {
    echo ""
    echo "🌐 Deploying backend to Heroku..."
    
    # Check if Heroku CLI is installed
    if ! command -v heroku &> /dev/null; then
        echo "⚠️ Please install the Heroku CLI first:"
        echo "    https://devcenter.heroku.com/articles/heroku-cli"
        return 1
    fi
    
    # Log in to Heroku if needed
    if ! heroku auth:whoami &> /dev/null; then
        echo "📝 Please log in to Heroku:"
        heroku login
    fi
    
    # Create or use existing app
    APP_NAME="crypto-rewards-api"
    if ! heroku apps:info --app $APP_NAME &> /dev/null; then
        echo "📦 Creating new Heroku app: $APP_NAME"
        heroku create $APP_NAME
    else
        echo "📦 Using existing Heroku app: $APP_NAME"
    fi
    
    # Set up environment variables
    echo "🔧 Setting up environment variables..."
    heroku config:set API_KEY=$(openssl rand -hex 16) --app $APP_NAME
    heroku config:set CORS_ORIGINS="http://localhost:3000,https://crypto-rewards-comparison-turkey.vercel.app" --app $APP_NAME
    heroku config:set UPDATE_INTERVAL_HOURS=6 --app $APP_NAME
    
    # Deploy to Heroku
    echo "🚀 Pushing code to Heroku..."
    git subtree push --prefix backend heroku main
    
    # Show result
    BACKEND_URL="https://$APP_NAME.herokuapp.com"
    echo "✅ Backend deployed successfully!"
    echo "   API URL: $BACKEND_URL"
    
    # Return the backend URL
    echo $BACKEND_URL
}

# Deploy Frontend (Vercel)
deploy_frontend() {
    echo ""
    echo "🖥️ Deploying frontend to Vercel..."
    BACKEND_URL=$1
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        echo "📥 Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    # Build the project
    echo "🔨 Building the project..."
    npm run build
    
    # Set up environment variables for Vercel
    if [ ! -z "$BACKEND_URL" ]; then
        echo "🔧 Setting API URL to: $BACKEND_URL"
        # Create .env file for Vercel deployment
        echo "NEXT_PUBLIC_API_BASE_URL=$BACKEND_URL" > .env
    fi
    
    # Deploy to Vercel
    echo "🚀 Deploying to Vercel..."
    echo "   Follow the prompts to log in and deploy"
    vercel --prod
    
    echo "✅ Frontend deployment complete!"
}

# Execute based on user choice
case $DEPLOY_CHOICE in
    1)
        BACKEND_URL=$(deploy_backend)
        deploy_frontend $BACKEND_URL
        echo ""
        echo "🎉 Full deployment completed successfully!"
        ;;
    2)
        echo ""
        read -p "Enter the backend API URL (or leave empty to use the default): " BACKEND_URL
        deploy_frontend $BACKEND_URL
        echo ""
        echo "🎉 Frontend deployment completed successfully!"
        ;;
    3)
        deploy_backend
        echo ""
        echo "🎉 Backend deployment completed successfully!"
        ;;
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "Thank you for using the deployment script! 👋" 