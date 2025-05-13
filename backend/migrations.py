from flask import Flask
from models import db, User, Token
import os
import logging

logger = logging.getLogger("migrations")

def create_tables(app):
    """Create all database tables if they don't exist"""
    with app.app_context():
        try:
            db.create_all()
            logger.info("Database tables created successfully")
            return True
        except Exception as e:
            logger.error(f"Error creating database tables: {str(e)}")
            return False

def init_db(app):
    """Initialize the database connection"""
    try:
        # Configure SQLAlchemy
        db_uri = os.environ.get('DATABASE_URL', 'sqlite:///app.db')
        
        # Handle deprecated Heroku postgres:// URLs
        if db_uri.startswith("postgres://"):
            db_uri = db_uri.replace("postgres://", "postgresql://", 1)
        
        app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        
        # Initialize SQLAlchemy with the app
        db.init_app(app)
        
        # Create tables
        result = create_tables(app)
        return result
    except Exception as e:
        logger.error(f"Database initialization error: {str(e)}")
        return False

if __name__ == "__main__":
    # For running the migration script directly
    app = Flask(__name__)
    
    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Initialize database
    if init_db(app):
        print("Database migration completed successfully.")
    else:
        print("Database migration failed. Check logs for details.") 