#!/bin/bash
# Script to toggle between email verification and auto-activation

# Function to show the current mode
show_current_mode() {
    echo "Checking current mode..."
    RESULT=$(curl -s https://crypto-rewards-tr-api-d191d680a3fa.herokuapp.com/api/auth/register -H "Content-Type: application/json" -d '{"email":"test12345@example.com", "password":"Password123", "confirmPassword":"Password123", "name":"Test User"}')
    
    if echo "$RESULT" | grep -q "verification_sent"; then
        echo "📧 Current mode: Email Verification (requires email setup)"
    elif echo "$RESULT" | grep -q "auto_activated"; then
        echo "🚀 Current mode: Auto-Activation (no email required)"
    else
        echo "❓ Unknown mode. Response: $RESULT"
    fi
}

# Function to enable auto-activation mode
enable_auto_activation() {
    echo "🔧 Enabling Auto-Activation mode (no email verification required)..."
    
    # Make sure we're using the Homebrew Git version
    export PATH="/opt/homebrew/Cellar/git/2.49.0/bin:$PATH"
    
    # Create temp directory
    rm -rf toggle_temp
    mkdir -p toggle_temp
    cp -r backend/* toggle_temp/
    cd toggle_temp
    
    # Modify auth.py to auto-activate users
    cat > auth_fix.py << 'EOF'
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

    # Find the registration function and replace it
    REGISTER_START=$(grep -n "^@auth_bp.route('/register'" auth.py | cut -d':' -f1)
    NEXT_ROUTE=$(grep -n "^@auth_bp.route" auth.py | awk -F ":" -v start="$REGISTER_START" '$1 > start {print $1; exit}')
    
    # Create a new auth.py with auto-activation
    awk -v start="$REGISTER_START" -v end="$NEXT_ROUTE" '
        NR < start {print}
        NR == start {
            system("cat auth_fix.py")
        }
        NR >= end {print}
    ' auth.py > auth.py.new
    
    # Check if the file was created successfully
    if [ -s auth.py.new ]; then
        mv auth.py.new auth.py
        echo "Successfully updated auth.py to auto-activate users"
    else
        echo "Failed to modify auth.py. Using manual approach..."
        sed -i '' 's/user.is_active = False/user.is_active = True/g' auth.py
        sed -i '' 's/Generate verification token and send email/Auto-activate all accounts/g' auth.py
        sed -i '' 's/token = user.generate_verification_token()/logger.info(f"Auto-activating user {email}")/g' auth.py
        sed -i '' 's/send_result = send_verification_email(user, token)/# No email needed for auto-activation/g' auth.py
        sed -i '' 's/"message": "Kayıt başarılı! Lütfen e-posta adresinizi doğrulayın."/"message": "Kayıt başarılı! Hesabınız aktif edildi."/g' auth.py
        sed -i '' 's/"verification_sent": True/"auto_activated": True/g' auth.py
    fi
    
    # Deploy to Heroku
    git init
    git add .
    git commit -m "Toggle: Enable auto-activation mode"
    heroku git:remote -a crypto-rewards-tr-api
    git push heroku HEAD:master --force
    
    cd ..
    rm -rf toggle_temp
    
    echo "✅ Auto-Activation mode enabled! Users can now register without email verification."
}

# Function to enable email verification mode
enable_email_verification() {
    echo "🔧 Enabling Email Verification mode..."
    
    # Make sure we're using the Homebrew Git version
    export PATH="/opt/homebrew/Cellar/git/2.49.0/bin:$PATH"
    
    # Create temp directory
    rm -rf toggle_temp
    mkdir -p toggle_temp
    cp -r backend/* toggle_temp/
    cd toggle_temp
    
    # Modify auth.py to require email verification
    cat > auth_fix.py << 'EOF'
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
        
        # Users start as inactive and need email verification
        user.is_active = False
        
        db.session.add(user)
        db.session.commit()
        
        # Generate verification token and send email
        token = user.generate_verification_token()
        send_result = send_verification_email(user, token)
        
        if not send_result:
            logger.warning(f"Failed to send verification email to {email}. Please check email credentials.")
            return jsonify({"error": "Verification email could not be sent. Please contact support."}), 500
        
        # Return success message
        return jsonify({
            "message": "Kayıt başarılı! Lütfen e-posta adresinizi doğrulayın.",
            "email": email,
            "verification_sent": True
        }), 201
        
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "Kayıt işlemi sırasında bir hata oluştu"}), 500
EOF

    # Find the registration function and replace it
    REGISTER_START=$(grep -n "^@auth_bp.route('/register'" auth.py | cut -d':' -f1)
    NEXT_ROUTE=$(grep -n "^@auth_bp.route" auth.py | awk -F ":" -v start="$REGISTER_START" '$1 > start {print $1; exit}')
    
    # Create a new auth.py with email verification requirement
    awk -v start="$REGISTER_START" -v end="$NEXT_ROUTE" '
        NR < start {print}
        NR == start {
            system("cat auth_fix.py")
        }
        NR >= end {print}
    ' auth.py > auth.py.new
    
    # Check if the file was created successfully
    if [ -s auth.py.new ]; then
        mv auth.py.new auth.py
        echo "Successfully updated auth.py to require email verification"
    else
        echo "Failed to modify auth.py. Using manual approach..."
        sed -i '' 's/user.is_active = True/user.is_active = False/g' auth.py
        sed -i '' 's/Auto-activate all accounts/Users start as inactive and need email verification/g' auth.py
        sed -i '' 's/logger.info(f"Auto-activating user {email}")/token = user.generate_verification_token()/g' auth.py
        sed -i '' 's/# No email needed for auto-activation/send_result = send_verification_email(user, token)/g' auth.py
        sed -i '' 's/"message": "Kayıt başarılı! Hesabınız aktif edildi."/"message": "Kayıt başarılı! Lütfen e-posta adresinizi doğrulayın."/g' auth.py
        sed -i '' 's/"auto_activated": True/"verification_sent": True/g' auth.py
    fi
    
    # Deploy to Heroku
    git init
    git add .
    git commit -m "Toggle: Enable email verification mode"
    heroku git:remote -a crypto-rewards-tr-api
    git push heroku HEAD:master --force
    
    cd ..
    rm -rf toggle_temp
    
    echo "✅ Email Verification mode enabled! Users now need to verify their email before logging in."
    echo "NOTE: Make sure your email credentials are properly configured in Heroku."
}

# Main menu
echo "📱 Authentication Mode Toggle"
echo "============================="
echo ""
show_current_mode
echo ""
echo "What would you like to do?"
echo ""
echo "1) Enable Auto-Activation mode (no email verification required)"
echo "2) Enable Email Verification mode (requires proper email setup)"
echo "3) Show current mode"
echo "4) Exit"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        enable_auto_activation
        ;;
    2)
        enable_email_verification
        ;;
    3)
        show_current_mode
        ;;
    4)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo "Invalid choice. Exiting..."
        exit 1
        ;;
esac

echo ""
echo "Done! 🎉" 