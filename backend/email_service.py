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

# HTML template for welcome email (for auto-activation)
WELCOME_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Crypto Rewards Türkiye - Hoş Geldiniz!</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .container { padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        .header { background-color: #4f46e5; color: white; padding: 10px 20px; border-radius: 5px 5px 0 0; }
        .footer { font-size: 12px; color: #777; margin-top: 30px; text-align: center; }
        .button { display: inline-block; background-color: #4f46e5; color: white; text-decoration: none; padding: 10px 20px; 
                 border-radius: 5px; margin: 20px 0; }
        .feature { margin-bottom: 15px; }
        .feature h3 { margin-bottom: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Crypto Rewards Türkiye'ye Hoş Geldiniz!</h2>
        </div>
        <div class="content">
            <p>Merhaba {{ user_name }},</p>
            <p>Crypto Rewards Türkiye platformuna kaydolduğunuz için teşekkür ederiz! Hesabınız başarıyla oluşturuldu ve hemen kullanıma hazır.</p>
            
            <p><a href="{{ login_url }}" class="button">Giriş Yap</a></p>
            
            <p>Platformumuzda neler yapabileceğiniz hakkında kısa bir bilgi:</p>
            
            <div class="feature">
                <h3>🔍 Kripto Ödüllerini Karşılaştırın</h3>
                <p>Türkiye'deki borsaların en iyi staking ödüllerini ve kampanyalarını karşılaştırın.</p>
            </div>
            
            <div class="feature">
                <h3>📊 Piyasa Takibi</h3>
                <p>En güncel kripto para fiyatlarını ve APY oranlarını takip edin.</p>
            </div>
            
            <div class="feature">
                <h3>🔔 Bildirimler</h3>
                <p>Favori kripto varlıklarınız için ödül oranları değiştiğinde bildirim alın.</p>
            </div>
            
            <p>Herhangi bir sorunuz olursa, lütfen bizimle <a href="mailto:info@cryptorewards.tr">info@cryptorewards.tr</a> adresinden iletişime geçin.</p>
            
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
        # Check common email configuration issues
        if 'MAIL_USERNAME' not in current_app.config or not current_app.config['MAIL_USERNAME']:
            logger.error("MAIL_USERNAME is not configured")
        if 'MAIL_PASSWORD' not in current_app.config or not current_app.config['MAIL_PASSWORD']:
            logger.error("MAIL_PASSWORD is not configured")
        if 'MAIL_SERVER' not in current_app.config or not current_app.config['MAIL_SERVER']:
            logger.error("MAIL_SERVER is not configured")
        return False

def send_welcome_email(user):
    """Send welcome email when an account is auto-activated"""
    try:
        base_url = os.environ.get('FRONTEND_URL', 'http://localhost:3000')
        login_url = f"{base_url}/login"
        
        user_name = user.name if user.name else "Değerli Kullanıcımız"
        
        msg = Message(
            subject="Crypto Rewards Türkiye - Hoş Geldiniz!",
            recipients=[user.email],
            html=render_template_string(WELCOME_TEMPLATE, user_name=user_name, login_url=login_url),
            sender=current_app.config.get('MAIL_DEFAULT_SENDER', 'info@rightbehind.app')
        )
        
        mail.send(msg)
        logger.info(f"Welcome email sent to {user.email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send welcome email to {user.email}: {str(e)}")
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