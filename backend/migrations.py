from flask import Flask
from models import db, User, Token
import os
import logging
from sqlalchemy import inspect, text

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

def migrate_premium_fields():
    """Add premium subscription fields if they don't exist"""
    try:
        with db.engine.connect() as conn:
            # Check if columns exist
            inspector = inspect(db.engine)
            existing_columns = [col['name'] for col in inspector.get_columns('users')]
            
            # Add missing columns
            with conn.begin():
                if 'premium_since' not in existing_columns:
                    conn.execute(text("ALTER TABLE users ADD COLUMN premium_since TIMESTAMP"))
                
                if 'premium_expires' not in existing_columns and 'premium_expires_at' not in existing_columns:
                    conn.execute(text("ALTER TABLE users ADD COLUMN premium_expires TIMESTAMP"))
                
                if 'stripe_customer_id' not in existing_columns:
                    conn.execute(text("ALTER TABLE users ADD COLUMN stripe_customer_id VARCHAR(255)"))
                
                if 'stripe_subscription_id' not in existing_columns:
                    conn.execute(text("ALTER TABLE users ADD COLUMN stripe_subscription_id VARCHAR(255)"))
                
                # Rename old column if it exists
                if 'premium_expires_at' in existing_columns and 'premium_expires' not in existing_columns:
                    conn.execute(text("ALTER TABLE users RENAME COLUMN premium_expires_at TO premium_expires"))
            
            logger.info("Premium subscription fields added to users table")
    except Exception as e:
        logger.error(f"Error migrating premium fields: {str(e)}")

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
        migrate_premium_fields()
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