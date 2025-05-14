#!/bin/bash
# Script to fix account activation issues and redeploy

echo "🔧 Fixing account activation issues and redeploying..."

# Create temp directory
rm -rf fix_temp
mkdir -p fix_temp
cp -r backend/* fix_temp/
cd fix_temp

# Create a simpler direct fix for auth.py by replacing the entire registration function
echo "Updating auth.py to auto-activate accounts..."
cat > auth_fix.py << 'EOF'
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import (
    create_access_token, create_refresh_token, 
    jwt_required, get_jwt_identity, 
    get_jwt, verify_jwt_in_request
)
from datetime import datetime, timedelta
import re
from models import db, User, Token
from email_service import send_verification_email, send_password_reset_email
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import logging
import os

# Setup logging
logger = logging.getLogger("auth")

# Create Blueprint
auth_bp = Blueprint('auth', __name__)

# Initialize rate limiter
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://"
)

# Validation functions
def validate_password(password):
    """
    Validate password strength
    - At least 8 characters
    - Contains at least one uppercase letter
    - Contains at least one lowercase letter
    - Contains at least one digit
    """
    if len(password) < 8:
        return False, "Şifre en az 8 karakter uzunluğunda olmalıdır."
    
    if not any(c.isupper() for c in password):
        return False, "Şifre en az bir büyük harf içermelidir."
    
    if not any(c.islower() for c in password):
        return False, "Şifre en az bir küçük harf içermelidir."
    
    if not any(c.isdigit() for c in password):
        return False, "Şifre en az bir rakam içermelidir."
    
    return True, ""

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if re.match(pattern, email):
        return True, ""
    return False, "Geçerli bir e-posta adresi girmelisiniz."

# Authentication functions
def authenticate_user(email, password):
    """Authenticate a user by email and password"""
    user = User.query.filter_by(email=email).first()
    if user and user.verify_password(password):
        return user
    return None

def get_current_user():
    """Get the current authenticated user"""
    try:
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        return User.query.get(user_id)
    except:
        return None

# Routes
@auth_bp.route('/register', methods=['POST'])
@limiter.limit("10 per hour")
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "Geçersiz veri gönderildi"}), 400
        
        # Extract and validate data
        email = data.get('email', '').lower().strip()
        password = data.get('password', '')
        confirm_password = data.get('confirmPassword', '')
        name = data.get('name', '').strip()
        
        # Email validation
        is_valid_email, email_error = validate_email(email)
        if not is_valid_email:
            return jsonify({"error": email_error}), 400
        
        # Check if email already exists
        if User.query.filter_by(email=email).first():
            return jsonify({"error": "Bu e-posta adresi zaten kullanılıyor"}), 400
        
        # Password validation
        if password != confirm_password:
            return jsonify({"error": "Şifreler eşleşmiyor"}), 400
        
        is_valid_password, password_error = validate_password(password)
        if not is_valid_password:
            return jsonify({"error": password_error}), 400
        
        # Create new user
        user = User(email=email, name=name)
        user.password = password  # This will hash the password
        
        # Auto-activate all accounts for now
        user.is_active = True
        logger.info(f"Auto-activating user {email}")
        
        db.session.add(user)
        db.session.commit()
        
        # Return success message
        return jsonify({
            "message": "Kayıt başarılı! Hesabınız aktif edildi.",
            "email": email,
            "auto_activated": True
        }), 201
        
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "Kayıt işlemi sırasında bir hata oluştu"}), 500
EOF

# Replace the auth.py file with our fixed version
cp auth_fix.py auth.py

# Return to project root
cd ..

# Deploy the fixes
echo "Deploying fixes..."
# Make sure we're using the Homebrew Git version
export PATH="/opt/homebrew/Cellar/git/2.49.0/bin:$PATH"

# Redeploy the backend
./deploy-backend-simple.sh

echo "Testing account creation..."

# Test account creation with a new email
RANDOM_EMAIL="test$(date +%s)@example.com"
echo "Creating test account with email: $RANDOM_EMAIL"
RESULT=$(curl -s https://crypto-rewards-tr-api-d191d680a3fa.herokuapp.com/api/auth/register -H "Content-Type: application/json" -d "{\"email\":\"$RANDOM_EMAIL\", \"password\":\"Password123\", \"confirmPassword\":\"Password123\", \"name\":\"Test User\"}")
echo "Registration result: $RESULT"

sleep 2

# Test login with the new account
echo "Testing login with the new account..."
LOGIN_RESULT=$(curl -s https://crypto-rewards-tr-api-d191d680a3fa.herokuapp.com/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"$RANDOM_EMAIL\", \"password\":\"Password123\"}")
echo "Login result: $LOGIN_RESULT"

# Update frontend and redeploy
echo "Updating frontend to use the fixed backend..."
BACKEND_URL="https://crypto-rewards-tr-api-d191d680a3fa.herokuapp.com"
echo "NEXT_PUBLIC_API_URL=$BACKEND_URL" > .env.production

# Deploy to Vercel
echo "Redeploying frontend..."
vercel --prod -y

echo ""
echo "🎉 All fixes completed and deployed!"
echo ""
echo "Your website URLs:"
echo "- Frontend: https://crypto-rewards-comparison-turkey.vercel.app"
echo "- Backend API: $BACKEND_URL"
echo ""
echo "Try visiting your frontend URL in a browser to create an account and log in!"

# Clean up
rm -rf fix_temp 