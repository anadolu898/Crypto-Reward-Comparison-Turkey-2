import requests
import json
import time
from datetime import datetime
import os
import logging

class BtcTurkScraper:
    """Scraper for BtcTurk exchange staking rewards and campaigns"""
    
    def __init__(self, data_dir=None, logs_dir=None):
        # Set default directories if not provided
        self.data_dir = data_dir or "backend/data"
        self.logs_dir = logs_dir or "backend/logs"
        
        # Configure logging
        log_file = os.path.join(self.logs_dir, "btcturk.log")
        self.logger = logging.getLogger("btcturk_scraper")
        
        # Only add handlers if they don't exist
        if not self.logger.handlers:
            self.logger.setLevel(logging.INFO)
            formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
            
            file_handler = logging.FileHandler(log_file)
            file_handler.setFormatter(formatter)
            self.logger.addHandler(file_handler)
            
            console_handler = logging.StreamHandler()
            console_handler.setFormatter(formatter)
            self.logger.addHandler(console_handler)
        
        self.base_url = "https://api.btcturk.com"
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Accept": "application/json"
        }
        
        # Ensure data directory exists
        os.makedirs(self.data_dir, exist_ok=True)
        
        # Ensure logs directory exists
        os.makedirs(self.logs_dir, exist_ok=True)
    
    def fetch_staking_data(self):
        """Fetch staking data from BtcTurk"""
        try:
            # In a real implementation, this would use the actual BtcTurk API
            # For demonstration purposes, we'll create sample data
            staking_data = [
                {
                    "coin": "USDT",
                    "apy": "8.0",
                    "lockupPeriod": "30",
                    "minStaking": "100",
                    "features": ["Instant Unstake", "Daily Rewards"],
                    "lastUpdated": datetime.now().isoformat()
                },
                {
                    "coin": "BTC",
                    "apy": "4.5",
                    "lockupPeriod": "60",
                    "minStaking": "0.01",
                    "features": ["Auto Renewal"],
                    "lastUpdated": datetime.now().isoformat()
                },
                {
                    "coin": "ETH",
                    "apy": "5.2",
                    "lockupPeriod": "90",
                    "minStaking": "0.1",
                    "features": ["Daily Rewards", "Flexible Duration"],
                    "lastUpdated": datetime.now().isoformat()
                }
            ]
            
            self.logger.info(f"Successfully fetched staking data for BtcTurk, found {len(staking_data)} offers")
            return staking_data
            
        except Exception as e:
            self.logger.error(f"Error fetching BtcTurk staking data: {str(e)}")
            return []
    
    def fetch_campaign_data(self):
        """Fetch campaign data from BtcTurk"""
        try:
            # In a real implementation, this would use the actual BtcTurk API
            # For demonstration purposes, we'll create sample data
            campaign_data = [
                {
                    "name": "New User Bonus",
                    "description": "Get 10 USDT for signing up and completing KYC",
                    "expiryDate": "2023-12-31",
                    "requirements": ["New Account", "KYC Verification"],
                    "reward": "10 USDT",
                    "lastUpdated": datetime.now().isoformat()
                },
                {
                    "name": "Referral Program",
                    "description": "Earn 50% of your referral's trading fees for 3 months",
                    "expiryDate": "Ongoing",
                    "requirements": ["Verified Account"],
                    "reward": "50% of trading fees",
                    "lastUpdated": datetime.now().isoformat()
                }
            ]
            
            self.logger.info(f"Successfully fetched campaign data for BtcTurk, found {len(campaign_data)} campaigns")
            return campaign_data
            
        except Exception as e:
            self.logger.error(f"Error fetching BtcTurk campaign data: {str(e)}")
            return []
    
    def save_data(self):
        """Save all data to JSON files"""
        try:
            staking_data = self.fetch_staking_data()
            campaign_data = self.fetch_campaign_data()
            
            # Combine data with platform information
            data = {
                "platform": "BtcTurk",
                "website": "https://www.btcturk.com",
                "stakingOffers": staking_data,
                "campaigns": campaign_data,
                "lastUpdated": datetime.now().isoformat()
            }
            
            # Save to file
            output_file = os.path.join(self.data_dir, "btcturk.json")
            with open(output_file, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=4, ensure_ascii=False)
            
            self.logger.info("Successfully saved BtcTurk data to file")
            return True
            
        except Exception as e:
            self.logger.error(f"Error saving BtcTurk data: {str(e)}")
            return False

# Run the scraper if executed directly
if __name__ == "__main__":
    scraper = BtcTurkScraper()
    scraper.save_data() 