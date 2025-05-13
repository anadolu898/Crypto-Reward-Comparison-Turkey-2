import os
import json
import logging
import requests
from datetime import datetime
from abc import ABC, abstractmethod
import warnings

# Suppress SSL verification warnings
warnings.filterwarnings('ignore', message='Unverified HTTPS request')

class BaseScraper(ABC):
    """
    Base class for all cryptocurrency exchange scrapers.
    """
    
    def __init__(self, exchange_name, data_dir="data", logs_dir="logs"):
        """
        Initialize the scraper with exchange name and directory paths.
        
        Args:
            exchange_name (str): Name of the exchange
            data_dir (str): Directory to store scraped data
            logs_dir (str): Directory to store logs
        """
        self.exchange_name = exchange_name.lower()
        self.data_dir = data_dir
        self.logs_dir = logs_dir
        
        # Ensure directories exist
        os.makedirs(data_dir, exist_ok=True)
        os.makedirs(logs_dir, exist_ok=True)
        
        # Setup logging
        self.logger = logging.getLogger(f"{self.exchange_name}_scraper")
        self.logger.setLevel(logging.INFO)
        
        # Check if the logger already has handlers to avoid duplicate handlers
        if not self.logger.handlers:
            # File handler
            file_handler = logging.FileHandler(os.path.join(logs_dir, f"{self.exchange_name}.log"))
            file_handler.setLevel(logging.INFO)
            
            # Create formatter
            formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
            file_handler.setFormatter(formatter)
            
            # Add handlers to the logger
            self.logger.addHandler(file_handler)
        
        # Initialize data storage
        self.staking_data = []
        self.campaign_data = []
    
    def get_url(self, url, headers=None, params=None):
        """
        Make a GET request to the specified URL with optional headers and parameters.
        
        Args:
            url (str): URL to fetch
            headers (dict, optional): Request headers
            params (dict, optional): Query parameters
            
        Returns:
            requests.Response or None: Response object or None if request fails
        """
        try:
            if headers is None:
                headers = {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            
            response = requests.get(url, headers=headers, params=params, timeout=10, verify=False)
            response.raise_for_status()
            return response
        except requests.exceptions.RequestException as e:
            self.logger.error(f"Error fetching {url}: {str(e)}")
            return None
    
    def save_data(self):
        """
        Fetch staking and campaign data, then save to a JSON file.
        
        Returns:
            bool: True if data was saved successfully, False otherwise
        """
        try:
            # Fetch staking data
            self.logger.info(f"Fetching staking data from {self.exchange_name.capitalize()}...")
            self.fetch_staking_data()
            
            # Fetch campaign data
            self.logger.info(f"Fetching campaign data from {self.exchange_name.capitalize()}...")
            self.fetch_campaign_data()
            
            # Prepare data for saving
            data = {
                "exchange": self.exchange_name,
                "updated_at": datetime.utcnow().isoformat(),
                "staking_offers": self.staking_data,
                "campaigns": self.campaign_data
            }
            
            # Save to file
            filename = os.path.join(self.data_dir, f"{self.exchange_name}.json")
            with open(filename, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            
            self.logger.info(f"Successfully saved {self.exchange_name.capitalize()} data to file")
            return True
            
        except Exception as e:
            self.logger.error(f"Error saving {self.exchange_name} data: {str(e)}")
            return False
    
    @abstractmethod
    def fetch_staking_data(self):
        """
        Fetch staking offers from the exchange.
        This method must be implemented by each exchange's scraper.
        """
        pass
    
    @abstractmethod
    def fetch_campaign_data(self):
        """
        Fetch campaign/promotion data from the exchange.
        This method must be implemented by each exchange's scraper.
        """
        pass 