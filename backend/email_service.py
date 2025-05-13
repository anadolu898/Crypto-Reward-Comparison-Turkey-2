import os
from flask import current_app, render_template_string
from flask_mail import Message, Mail
import logging

mail = Mail()
logger = logging.getLogger("email_service")

# HTML template for verification email
VERIFICATION_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>E-posta Doğrulama</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .container { padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        .header { background-color: #4f46e5; color: white; padding: 10px 20px; border-radius: 5px 5px 0 0; }
        .footer { font-size: 12px; color: #777; margin-top: 30px; text-align: center; }
        .button { display: inline-block; background-color: #4f46e5; color: white; text-decoration: none; padding: 10px 20px; 
                 border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>E-posta Adresinizi Doğrulayın</h2>
        </div>
        <div class="content">
            <p>Merhaba,</p>
            <p>Crypto Rewards Türkiye platformuna kaydolduğunuz için teşekkür ederiz. Hesabınızı aktifleştirmek için lütfen aşağıdaki bağlantıya tıklayın:</p>
            <p><a href="{{ verification_url }}" class="button">E-posta Adresimi Doğrula</a></p>
            <p>Alternatif olarak, aşağıdaki bağlantıyı tarayıcınıza kopyalayabilirsiniz:</p>
            <p>{{ verification_url }}</p>
            <p>Bu bağlantı 24 saat boyunca geçerlidir.</p>
            <p>Eğer bu hesabı siz oluşturmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
            <p>Saygılarımızla,<br>Crypto Rewards Türkiye Ekibi</p>
        </div>
        <div class="footer">
            <p>Bu e-posta, Crypto Rewards Türkiye platformunda hesap oluşturulması nedeniyle gönderilmiştir.</p>
            <p>© 2025 Crypto Rewards Türkiye. Tüm hakları saklıdır.</p>
        </div>
    </div>
</body>
</html>
"""

# HTML template for password reset email
PASSWORD_RESET_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Şifre Sıfırlama</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .container { padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        .header { background-color: #4f46e5; color: white; padding: 10px 20px; border-radius: 5px 5px 0 0; }
        .footer { font-size: 12px; color: #777; margin-top: 30px; text-align: center; }
        .button { display: inline-block; background-color: #4f46e5; color: white; text-decoration: none; padding: 10px 20px; 
                 border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Şifre Sıfırlama İsteği</h2>
        </div>
        <div class="content">
            <p>Merhaba,</p>
            <p>Crypto Rewards Türkiye hesabınız için bir şifre sıfırlama talebinde bulundunuz. Şifrenizi sıfırlamak için lütfen aşağıdaki bağlantıya tıklayın:</p>
            <p><a href="{{ reset_url }}" class="button">Şifremi Sıfırla</a></p>
            <p>Alternatif olarak, aşağıdaki bağlantıyı tarayıcınıza kopyalayabilirsiniz:</p>
            <p>{{ reset_url }}</p>
            <p>Bu bağlantı 24 saat boyunca geçerlidir.</p>
            <p>Eğer şifre sıfırlama talebinde bulunmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
            <p>Saygılarımızla,<br>Crypto Rewards Türkiye Ekibi</p>
        </div>
        <div class="footer">
            <p>Bu e-posta, Crypto Rewards Türkiye platformunda şifre sıfırlama talebinde bulunulması nedeniyle gönderilmiştir.</p>
            <p>© 2025 Crypto Rewards Türkiye. Tüm hakları saklıdır.</p>
        </div>
    </div>
</body>
</html>
"""

def init_app(app):
    """Initialize mail extension with the app"""
    mail.init_app(app)

def send_verification_email(user, token):
    """Send email verification link to a user"""
    try:
        base_url = os.environ.get('FRONTEND_URL', 'http://localhost:3000')
        verification_url = f"{base_url}/verify-email?token={token}"
        
        msg = Message(
            subject="Crypto Rewards Türkiye - E-posta Doğrulama",
            recipients=[user.email],
            html=render_template_string(VERIFICATION_TEMPLATE, verification_url=verification_url),
            sender=current_app.config['MAIL_DEFAULT_SENDER']
        )
        
        mail.send(msg)
        logger.info(f"Verification email sent to {user.email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send verification email to {user.email}: {str(e)}")
        return False

def send_password_reset_email(user, token):
    """Send password reset link to a user"""
    try:
        base_url = os.environ.get('FRONTEND_URL', 'http://localhost:3000')
        reset_url = f"{base_url}/reset-password?token={token}"
        
        msg = Message(
            subject="Crypto Rewards Türkiye - Şifre Sıfırlama",
            recipients=[user.email],
            html=render_template_string(PASSWORD_RESET_TEMPLATE, reset_url=reset_url),
            sender=current_app.config['MAIL_DEFAULT_SENDER']
        )
        
        mail.send(msg)
        logger.info(f"Password reset email sent to {user.email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send password reset email to {user.email}: {str(e)}")
        return False 