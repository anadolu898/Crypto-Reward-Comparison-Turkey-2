import os
import json
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta
import logging
from scrapers.btcturk import BtcTurkScraper
from scrapers.paribu import ParibuScraper
from scrapers.bitexen import BitexenScraper
from scrapers.bitci import BitciScraper
from scrapers.cointr import CoinTRScraper
from scrapers.icrypex import ICRYPEXScraper
from scrapers.bitay import BitayScraper
import threading
import time
import schedule
from dotenv import load_dotenv

# Initialize auth modules
from flask_jwt_extended import JWTManager
from email_service import mail, init_app as init_email
from auth import init_app as init_auth
from migrations import init_db

# Load environment variables
load_dotenv()

# Set crypto environment for SSL configuration
# If not set, default to 'development' for SSL warnings suppression
if 'CRYPTO_ENV' not in os.environ:
    os.environ['CRYPTO_ENV'] = os.environ.get('FLASK_ENV', 'development')

# Setup data and log directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.environ.get('DATA_DIR', os.path.join(BASE_DIR, 'data'))
LOGS_DIR = os.environ.get('LOGS_DIR', os.path.join(BASE_DIR, 'logs'))

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(os.path.join(LOGS_DIR, "api.log")),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger("api")

# Create Flask app
app = Flask(__name__)

# Configure app settings
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', app.config['SECRET_KEY'])
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=7)
app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']

# Email configuration
app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.environ.get('MAIL_USE_TLS', 'True').lower() == 'true'
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_DEFAULT_SENDER', 'noreply@cryptorewards.com')

# Initialize JWT
jwt = JWTManager(app)

# Configure CORS
CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '*')
CORS(app, resources={r"/api/*": {"origins": CORS_ORIGINS}})

# Ensure directories exist
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(LOGS_DIR, exist_ok=True)

# Initialize components
init_db(app)
init_email(app)
init_auth(app)

# List of available scrapers
scrapers = {
    "btcturk": BtcTurkScraper(data_dir=DATA_DIR, logs_dir=LOGS_DIR),
    "paribu": ParibuScraper(data_dir=DATA_DIR, logs_dir=LOGS_DIR),
    "bitexen": BitexenScraper(data_dir=DATA_DIR, logs_dir=LOGS_DIR),
    "bitci": BitciScraper(data_dir=DATA_DIR, logs_dir=LOGS_DIR),
    "cointr": CoinTRScraper(data_dir=DATA_DIR, logs_dir=LOGS_DIR),
    "icrypex": ICRYPEXScraper(data_dir=DATA_DIR, logs_dir=LOGS_DIR),
    "bitay": BitayScraper(data_dir=DATA_DIR, logs_dir=LOGS_DIR)
}

# Route to get data for all platforms
@app.route('/api/rewards', methods=['GET'])
def get_all_rewards():
    try:
        all_data = []
        
        for filename in os.listdir(DATA_DIR):
            if filename.endswith(".json"):
                with open(os.path.join(DATA_DIR, filename), "r", encoding="utf-8") as f:
                    data = json.load(f)
                    all_data.append(data)
        
        return jsonify({
            "success": True,
            "data": all_data,
            "count": len(all_data)
        })
    
    except Exception as e:
        logger.error(f"Error fetching all rewards: {str(e)}")
        return jsonify({
            "success": False,
            "error": "Failed to fetch reward data"
        }), 500

# Route to get data for a specific platform
@app.route('/api/rewards/<platform>', methods=['GET'])
def get_platform_rewards(platform):
    try:
        filename = os.path.join(DATA_DIR, f"{platform.lower()}.json")
        
        if not os.path.exists(filename):
            return jsonify({
                "success": False,
                "error": f"Data for platform '{platform}' not found"
            }), 404
        
        with open(filename, "r", encoding="utf-8") as f:
            data = json.load(f)
        
        return jsonify({
            "success": True,
            "data": data
        })
    
    except Exception as e:
        logger.error(f"Error fetching rewards for platform {platform}: {str(e)}")
        return jsonify({
            "success": False,
            "error": f"Failed to fetch reward data for platform '{platform}'"
        }), 500

# Route to force an update of the data
@app.route('/api/update', methods=['POST'])
def force_update():
    try:
        # Check for API key (simple authentication)
        api_key = request.headers.get('X-API-Key')
        expected_api_key = os.environ.get('API_KEY', 'test_key')
        
        if api_key != expected_api_key:
            return jsonify({
                "success": False,
                "error": "Invalid API key"
            }), 401
        
        # Get platform from request or update all if not specified
        platform = request.args.get('platform', '').lower()
        
        if platform and platform in scrapers:
            # Update specific platform
            success = scrapers[platform].save_data()
            return jsonify({
                "success": success,
                "message": f"Data update for platform '{platform}' {'completed' if success else 'failed'}"
            })
        else:
            # Update all platforms
            results = {}
            for name, scraper in scrapers.items():
                results[name] = scraper.save_data()
            
            return jsonify({
                "success": True,
                "results": results
            })
    
    except Exception as e:
        logger.error(f"Error during forced update: {str(e)}")
        return jsonify({
            "success": False,
            "error": "Failed to update data"
        }), 500

# Function to update all data
def update_all_data():
    logger.info("Scheduled update starting...")
    for name, scraper in scrapers.items():
        try:
            success = scraper.save_data()
            logger.info(f"Update for {name}: {'Success' if success else 'Failed'}")
        except Exception as e:
            logger.error(f"Error updating {name}: {str(e)}")
    logger.info("Scheduled update completed")

# Function to run the scheduler in a separate thread
def run_scheduler():
    # Get update interval from environment variables (default: 6 hours)
    update_interval = int(os.environ.get('UPDATE_INTERVAL_HOURS', 6))
    
    # Schedule the job to run at the specified interval
    schedule.every(update_interval).hours.do(update_all_data)
    
    # Run the scheduler loop
    while True:
        schedule.run_pending()
        time.sleep(60)  # Check every minute

# Run the initial data update
def initial_update():
    logger.info("Initial data update starting...")
    for name, scraper in scrapers.items():
        try:
            scraper.save_data()
        except Exception as e:
            logger.error(f"Error in initial update for {name}: {str(e)}")
    logger.info("Initial data update completed")

if __name__ == "__main__":
    # Run initial data update
    initial_update()
    
    # Start the scheduler in a background thread
    scheduler_thread = threading.Thread(target=run_scheduler, daemon=True)
    scheduler_thread.start()
    
    # Get port from environment variable (for Heroku/production)
    port = int(os.environ.get('PORT', 5001))
    
    # Start the Flask app
    app.run(host='0.0.0.0', port=port, debug=False) 