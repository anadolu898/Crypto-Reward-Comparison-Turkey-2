#!/usr/bin/env python3
"""
Dedicated server script for continuous scraping of crypto reward data
"""

import os
import json
import time
import logging
import threading
import datetime
import urllib3
from scrapers.btcturk import BtcTurkScraper
from scrapers.paribu import ParibuScraper
import schedule
from dotenv import load_dotenv

# Disable SSL warnings since we're using verify=False in our scrapers
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Load environment variables
load_dotenv()

# Setup data and log directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.environ.get('DATA_DIR', os.path.join(BASE_DIR, 'data'))
LOGS_DIR = os.environ.get('LOGS_DIR', os.path.join(BASE_DIR, 'logs'))

# Ensure directories exist
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(LOGS_DIR, exist_ok=True)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(os.path.join(LOGS_DIR, "scraper_service.log")),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger("scraper_service")

# List of available scrapers
scrapers = {
    "btcturk": BtcTurkScraper(data_dir=DATA_DIR, logs_dir=LOGS_DIR),
    "paribu": ParibuScraper(data_dir=DATA_DIR, logs_dir=LOGS_DIR)
}

# Function to update all data
def update_all_data():
    logger.info(f"Scheduled update starting at {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    for name, scraper in scrapers.items():
        try:
            logger.info(f"Starting scrape for {name}")
            success = scraper.save_data()
            logger.info(f"Update for {name}: {'Success' if success else 'Failed'}")
            
            # Log a summary of the data
            try:
                filepath = os.path.join(DATA_DIR, f"{name.lower()}.json")
                if os.path.exists(filepath):
                    with open(filepath, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        staking_count = len(data.get('stakingOffers', []))
                        campaign_count = len(data.get('campaigns', []))
                        logger.info(f"{name} data summary: {staking_count} staking offers, {campaign_count} campaigns")
            except Exception as e:
                logger.error(f"Error summarizing data for {name}: {str(e)}")
                
        except Exception as e:
            logger.error(f"Error updating {name}: {str(e)}")
    
    logger.info(f"Scheduled update completed at {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

# Function to run the scheduler in a separate thread
def run_scheduler():
    # Get update interval from environment variables (default: 3 hours)
    update_interval = int(os.environ.get('UPDATE_INTERVAL_HOURS', 3))
    
    # Schedule the job to run at the specified interval
    schedule.every(update_interval).hours.do(update_all_data)
    
    # Add a daily full refresh at midnight
    schedule.every().day.at("00:00").do(update_all_data)
    
    logger.info(f"Scheduler set up with {update_interval}h interval and daily refresh at midnight")
    
    # Run the scheduler loop
    while True:
        schedule.run_pending()
        time.sleep(60)  # Check every minute

def main():
    try:
        logger.info("=== Crypto Scraper Service Started ===")
        logger.info(f"Data directory: {DATA_DIR}")
        logger.info(f"Logs directory: {LOGS_DIR}")
        
        # Run initial data update
        logger.info("Performing initial data update...")
        update_all_data()
        
        # Start the scheduler in a background thread
        logger.info("Starting scheduler...")
        scheduler_thread = threading.Thread(target=run_scheduler, daemon=True)
        scheduler_thread.start()
        
        # Keep the main thread alive
        while True:
            time.sleep(3600)  # Sleep for an hour
            logger.info("Scraper service is still running")
            
    except KeyboardInterrupt:
        logger.info("Service interrupted by user")
    except Exception as e:
        logger.critical(f"Critical error in scraper service: {str(e)}")
        raise
    finally:
        logger.info("=== Scraper Service Shutting Down ===")

if __name__ == "__main__":
    main() 