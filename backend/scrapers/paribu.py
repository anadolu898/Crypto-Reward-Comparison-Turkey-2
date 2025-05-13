import requests
import json
import time
from datetime import datetime
import os
import logging

class ParibuScraper:
    """Scraper for Paribu exchange staking rewards and campaigns"""
    
    def __init__(self, data_dir=None, logs_dir=None):
        # Set default directories if not provided
        self.data_dir = data_dir or "backend/data"
        self.logs_dir = logs_dir or "backend/logs"
        
        # Configure logging
        log_file = os.path.join(self.logs_dir, "paribu.log")
        self.logger = logging.getLogger("paribu_scraper")
        
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
        
        self.base_url = "https://www.paribu.com"
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Accept": "application/json"
        }
        
        # Ensure data directory exists
        os.makedirs(self.data_dir, exist_ok=True)
        
        # Ensure logs directory exists
        os.makedirs(self.logs_dir, exist_ok=True)
    
    def fetch_staking_data(self):
        """Fetch staking data from Paribu"""
        try:
            # In a real implementation, this would use the actual Paribu API or web scraping
            # For demonstration purposes, we'll create sample data
            staking_data = [
                {
                    "coin": "ETH",
                    "apy": "7.5",
                    "lockupPeriod": "60",
                    "minStaking": "0.1",
                    "features": ["Auto Renewal"],
                    "lastUpdated": datetime.now().isoformat()
                },
                {
                    "coin": "DOT",
                    "apy": "12.0",
                    "lockupPeriod": "30",
                    "minStaking": "5",
                    "features": ["Flexible Duration", "Weekly Rewards"],
                    "lastUpdated": datetime.now().isoformat()
                },
                {
                    "coin": "ADA",
                    "apy": "8.2",
                    "lockupPeriod": "45",
                    "minStaking": "100",
                    "features": ["Daily Rewards", "No Lock-up"],
                    "lastUpdated": datetime.now().isoformat()
                },
                {
                    "coin": "AVAX",
                    "apy": "9.0",
                    "lockupPeriod": "30",
                    "minStaking": "1",
                    "features": ["Auto Compound"],
                    "lastUpdated": datetime.now().isoformat()
                }
            ]
            
            self.logger.info(f"Successfully fetched staking data for Paribu, found {len(staking_data)} offers")
            return staking_data
            
        except Exception as e:
            self.logger.error(f"Error fetching Paribu staking data: {str(e)}")
            return []
    
    def fetch_campaign_data(self):
        """Fetch campaign data from Paribu"""
        try:
            # In a real implementation, this would use the actual Paribu API or web scraping
            # For demonstration purposes, we'll create sample data
            campaign_data = [
                {
                    "name": "Referral Program",
                    "description": "Earn 30% of your referral's trading fees for 6 months",
                    "expiryDate": "Ongoing",
                    "requirements": ["Verified Account"],
                    "reward": "30% of trading fees",
                    "lastUpdated": datetime.now().isoformat()
                },
                {
                    "name": "Trading Competition",
                    "description": "Top 100 traders by volume win a share of 10,000 USDT",
                    "expiryDate": "2023-08-31",
                    "requirements": ["Minimum 5,000 TRY trading volume"],
                    "reward": "Share of 10,000 USDT",
                    "lastUpdated": datetime.now().isoformat()
                },
                {
                    "name": "Learn & Earn",
                    "description": "Complete educational quizzes to earn free crypto",
                    "expiryDate": "2023-09-15",
                    "requirements": ["Verified Account", "Quiz Completion"],
                    "reward": "Up to 25 USDT in various tokens",
                    "lastUpdated": datetime.now().isoformat()
                }
            ]
            
            self.logger.info(f"Successfully fetched campaign data for Paribu, found {len(campaign_data)} campaigns")
            return campaign_data
            
        except Exception as e:
            self.logger.error(f"Error fetching Paribu campaign data: {str(e)}")
            return []
    
    def save_data(self):
        """Save all data to JSON files"""
        try:
            staking_data = self.fetch_staking_data()
            campaign_data = self.fetch_campaign_data()
            
            # Combine data with platform information
            data = {
                "platform": "Paribu",
                "website": "https://www.paribu.com",
                "stakingOffers": staking_data,
                "campaigns": campaign_data,
                "lastUpdated": datetime.now().isoformat()
            }
            
            # Save to file
            output_file = os.path.join(self.data_dir, "paribu.json")
            with open(output_file, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=4, ensure_ascii=False)
            
            self.logger.info("Successfully saved Paribu data to file")
            return True
            
        except Exception as e:
            self.logger.error(f"Error saving Paribu data: {str(e)}")
            return False

# Run the scraper if executed directly
if __name__ == "__main__":
    scraper = ParibuScraper()
    scraper.save_data() 