from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
import secrets
import string
import os
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    name = db.Column(db.String(100), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime, nullable=True)
    is_active = db.Column(db.Boolean, default=False)
    email_notifications = db.Column(db.Boolean, default=True)
    
    # Premium subscription fields
    is_premium = db.Column(db.Boolean, default=False)
    premium_since = db.Column(db.DateTime, nullable=True)
    premium_expires = db.Column(db.DateTime, nullable=True)
    stripe_customer_id = db.Column(db.String(255), nullable=True)
    stripe_subscription_id = db.Column(db.String(255), nullable=True)
    
    # Relationship with tokens
    tokens = db.relationship('Token', backref='user', lazy=True, cascade="all, delete-orphan")
    
    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')
    
    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def generate_verification_token(self):
        token = Token(user_id=self.id, token_type='verification')
        db.session.add(token)
        db.session.commit()
        return token.token
    
    def generate_password_reset_token(self):
        token = Token(user_id=self.id, token_type='password_reset')
        db.session.add(token)
        db.session.commit()
        return token.token
    
    def to_dict(self):
        """Convert user object to dictionary"""
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'is_active': self.is_active,
            'email_notifications': self.email_notifications,
            'is_premium': self.is_premium,
            'premium_since': self.premium_since.isoformat() if self.premium_since else None,
            'premium_expires': self.premium_expires.isoformat() if self.premium_expires else None
        }
    
    def __repr__(self):
        return f'<User {self.email}>'

class Token(db.Model):
    __tablename__ = 'tokens'
    
    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(100), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    token_type = db.Column(db.String(20), nullable=False)  # 'verification', 'password_reset', 'api'
    expires_at = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __init__(self, user_id, token_type, expiration_hours=24):
        self.user_id = user_id
        self.token_type = token_type
        self.token = self._generate_token()
        self.expires_at = datetime.utcnow() + timedelta(hours=expiration_hours)
    
    def _generate_token(self):
        alphabet = string.ascii_letters + string.digits
        return ''.join(secrets.choice(alphabet) for _ in range(64))
    
    @property
    def is_expired(self):
        return datetime.utcnow() > self.expires_at
    
    def __repr__(self):
        return f'<Token {self.token_type} for User {self.user_id}>' 