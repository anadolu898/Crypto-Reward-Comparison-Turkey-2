# Just the modified registration function that will auto-activate accounts
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
        
        # Auto-activate all accounts (remove environment check)
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