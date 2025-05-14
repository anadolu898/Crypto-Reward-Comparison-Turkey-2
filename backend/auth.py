from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import (
    create_access_token, create_refresh_token, 
    jwt_required, get_jwt_identity, 
    get_jwt, verify_jwt_in_request
)
from datetime import datetime, timedelta
import re
from models import db, User, Token
from email_service import send_verification_email, send_password_reset_email, send_welcome_email
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
        
        # Send welcome email for auto-activated accounts
        try:
            send_welcome_email(user)
            logger.info(f"Welcome email sent to {email}")
        except Exception as e:
            logger.error(f"Failed to send welcome email: {str(e)}")
        
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

@auth_bp.route('/login', methods=['POST'])
@limiter.limit("20 per hour")
def login():
    """Login a user"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "Geçersiz veri gönderildi"}), 400
        
        email = data.get('email', '').lower().strip()
        password = data.get('password', '')
        remember_me = data.get('rememberMe', False)
        
        user = authenticate_user(email, password)
        
        if not user:
            return jsonify({"error": "Geçersiz e-posta veya şifre"}), 401
        
        if not user.is_active:
            return jsonify({
                "error": "Hesabınız henüz aktifleştirilmemiş",
                "needsVerification": True,
                "email": email
            }), 401
        
        # Set token expiration based on remember_me
        expires = timedelta(days=30) if remember_me else timedelta(hours=24)
        
        # Create tokens
        access_token = create_access_token(
            identity=user.id, 
            expires_delta=expires,
            additional_claims={"email": user.email}
        )
        
        refresh_token = create_refresh_token(
            identity=user.id,
            expires_delta=timedelta(days=60) if remember_me else timedelta(days=7)
        )
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            "message": "Giriş başarılı",
            "accessToken": access_token,
            "refreshToken": refresh_token,
            "user": user.to_dict()
        }), 200
        
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return jsonify({"error": "Giriş sırasında bir hata oluştu"}), 500

@auth_bp.route('/refresh', methods=['POST'])
def refresh():
    """Refresh an access token using a refresh token"""
    try:
        verify_jwt_in_request(refresh=True)
        user_id = get_jwt_identity()
        
        user = User.query.get(user_id)
        if not user or not user.is_active:
            return jsonify({"error": "Geçersiz veya aktif olmayan kullanıcı"}), 401
        
        # Create new access token
        access_token = create_access_token(
            identity=user_id,
            additional_claims={"email": user.email}
        )
        
        return jsonify({
            "accessToken": access_token,
            "user": user.to_dict()
        }), 200
        
    except Exception as e:
        logger.error(f"Token refresh error: {str(e)}")
        return jsonify({"error": "Oturum yenileme sırasında bir hata oluştu"}), 401

@auth_bp.route('/verify-email', methods=['POST'])
@limiter.limit("10 per hour")
def verify_email():
    """Verify a user's email with a token"""
    try:
        data = request.get_json()
        token_value = data.get('token', '')
        
        if not token_value:
            return jsonify({"error": "Doğrulama tokeni eksik"}), 400
        
        # Find the token
        token = Token.query.filter_by(token=token_value, token_type='verification').first()
        
        if not token:
            return jsonify({"error": "Geçersiz doğrulama tokeni"}), 400
        
        if token.is_expired:
            # Delete expired token
            db.session.delete(token)
            db.session.commit()
            return jsonify({"error": "Doğrulama tokeni süresi dolmuş", "expired": True}), 400
        
        # Activate the user
        user = User.query.get(token.user_id)
        if not user:
            return jsonify({"error": "Kullanıcı bulunamadı"}), 404
        
        user.is_active = True
        
        # Remove the used token
        db.session.delete(token)
        db.session.commit()
        
        return jsonify({
            "message": "E-posta adresiniz başarıyla doğrulandı. Şimdi giriş yapabilirsiniz."
        }), 200
        
    except Exception as e:
        logger.error(f"Email verification error: {str(e)}")
        return jsonify({"error": "Doğrulama işlemi sırasında bir hata oluştu"}), 500

@auth_bp.route('/resend-verification', methods=['POST'])
@limiter.limit("5 per hour")
def resend_verification():
    """Resend verification email"""
    try:
        data = request.get_json()
        email = data.get('email', '').lower().strip()
        
        if not email:
            return jsonify({"error": "E-posta adresi gerekli"}), 400
        
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({"error": "Bu e-posta adresine sahip bir kullanıcı bulunamadı"}), 404
        
        if user.is_active:
            return jsonify({"error": "Bu hesap zaten aktif"}), 400
        
        # Delete old verification tokens
        Token.query.filter_by(user_id=user.id, token_type='verification').delete()
        db.session.commit()
        
        # Generate new token and send email
        token = user.generate_verification_token()
        send_verification_email(user, token)
        
        return jsonify({
            "message": "Doğrulama e-postası tekrar gönderildi. Lütfen gelen kutunuzu kontrol edin."
        }), 200
        
    except Exception as e:
        logger.error(f"Resend verification error: {str(e)}")
        return jsonify({"error": "Doğrulama e-postasını gönderirken bir hata oluştu"}), 500

@auth_bp.route('/forgot-password', methods=['POST'])
@limiter.limit("5 per hour")
def forgot_password():
    """Send password reset email"""
    try:
        data = request.get_json()
        email = data.get('email', '').lower().strip()
        
        if not email:
            return jsonify({"error": "E-posta adresi gerekli"}), 400
        
        user = User.query.filter_by(email=email).first()
        
        # Don't reveal if the user exists or not
        if not user:
            return jsonify({
                "message": "Şifre sıfırlama talimatları, hesap varsa e-posta adresinize gönderilecektir."
            }), 200
        
        # Delete old password reset tokens
        Token.query.filter_by(user_id=user.id, token_type='password_reset').delete()
        db.session.commit()
        
        # Generate new token and send email
        token = user.generate_password_reset_token()
        send_password_reset_email(user, token)
        
        return jsonify({
            "message": "Şifre sıfırlama talimatları e-posta adresinize gönderildi."
        }), 200
        
    except Exception as e:
        logger.error(f"Forgot password error: {str(e)}")
        return jsonify({"error": "Şifre sıfırlama e-postasını gönderirken bir hata oluştu"}), 500

@auth_bp.route('/reset-password', methods=['POST'])
@limiter.limit("5 per hour")
def reset_password():
    """Reset user password with a token"""
    try:
        data = request.get_json()
        token_value = data.get('token', '')
        new_password = data.get('password', '')
        confirm_password = data.get('confirmPassword', '')
        
        if not token_value:
            return jsonify({"error": "Sıfırlama tokeni eksik"}), 400
        
        if new_password != confirm_password:
            return jsonify({"error": "Şifreler eşleşmiyor"}), 400
        
        is_valid_password, password_error = validate_password(new_password)
        if not is_valid_password:
            return jsonify({"error": password_error}), 400
        
        # Find the token
        token = Token.query.filter_by(token=token_value, token_type='password_reset').first()
        
        if not token:
            return jsonify({"error": "Geçersiz sıfırlama tokeni"}), 400
        
        if token.is_expired:
            # Delete expired token
            db.session.delete(token)
            db.session.commit()
            return jsonify({"error": "Sıfırlama tokeni süresi dolmuş", "expired": True}), 400
        
        # Reset the user's password
        user = User.query.get(token.user_id)
        if not user:
            return jsonify({"error": "Kullanıcı bulunamadı"}), 404
        
        user.password = new_password
        
        # Ensure user is active (in case they hadn't activated yet)
        user.is_active = True
        
        # Remove the used token
        db.session.delete(token)
        db.session.commit()
        
        return jsonify({
            "message": "Şifreniz başarıyla sıfırlandı. Şimdi giriş yapabilirsiniz."
        }), 200
        
    except Exception as e:
        logger.error(f"Reset password error: {str(e)}")
        return jsonify({"error": "Şifre sıfırlama sırasında bir hata oluştu"}), 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    """Get current user profile"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"error": "Kullanıcı bulunamadı"}), 404
        
        return jsonify({
            "user": user.to_dict()
        }), 200
        
    except Exception as e:
        logger.error(f"Get profile error: {str(e)}")
        return jsonify({"error": "Profil bilgilerini alırken bir hata oluştu"}), 500

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update user profile"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"error": "Kullanıcı bulunamadı"}), 404
        
        data = request.get_json()
        if not data:
            return jsonify({"error": "Geçersiz veri gönderildi"}), 400
        
        # Update name
        if 'name' in data:
            user.name = data['name'].strip()
        
        # Update email notifications preference
        if 'emailNotifications' in data:
            user.email_notifications = bool(data['emailNotifications'])
        
        db.session.commit()
        
        return jsonify({
            "message": "Profil başarıyla güncellendi",
            "user": user.to_dict()
        }), 200
        
    except Exception as e:
        logger.error(f"Update profile error: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "Profil güncellenirken bir hata oluştu"}), 500

@auth_bp.route('/change-password', methods=['PUT'])
@jwt_required()
def change_password():
    """Change user password"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"error": "Kullanıcı bulunamadı"}), 404
        
        data = request.get_json()
        if not data:
            return jsonify({"error": "Geçersiz veri gönderildi"}), 400
        
        current_password = data.get('currentPassword', '')
        new_password = data.get('newPassword', '')
        confirm_password = data.get('confirmPassword', '')
        
        if not user.verify_password(current_password):
            return jsonify({"error": "Mevcut şifre yanlış"}), 400
        
        if new_password != confirm_password:
            return jsonify({"error": "Şifreler eşleşmiyor"}), 400
        
        is_valid_password, password_error = validate_password(new_password)
        if not is_valid_password:
            return jsonify({"error": password_error}), 400
        
        user.password = new_password
        db.session.commit()
        
        return jsonify({
            "message": "Şifreniz başarıyla değiştirildi"
        }), 200
        
    except Exception as e:
        logger.error(f"Change password error: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "Şifre değiştirirken bir hata oluştu"}), 500

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout the current user"""
    try:
        # In a stateless JWT system, the client simply discards the tokens
        # Here we could add the token to a blocklist if needed
        return jsonify({
            "message": "Başarıyla çıkış yapıldı"
        }), 200
        
    except Exception as e:
        logger.error(f"Logout error: {str(e)}")
        return jsonify({"error": "Çıkış yapılırken bir hata oluştu"}), 500

def init_app(app):
    """Initialize authentication module with the Flask app"""
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    limiter.init_app(app) 