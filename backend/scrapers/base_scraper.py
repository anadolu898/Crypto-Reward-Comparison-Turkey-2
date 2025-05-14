import os
import json
import logging
import requests
from datetime import datetime
from abc import ABC, abstractmethod
import warnings
import time
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

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
        
        # Create a session with enhanced retry capability
        self.session = requests.Session()
        retry_strategy = Retry(
            total=5,  # Increased from 3 to 5
            backoff_factor=2,  # Increased from 1 to 2 for exponential backoff
            status_forcelist=[429, 500, 502, 503, 504],
            allowed_methods=["GET", "POST"],  # Allow retry for both GET and POST
        )
        adapter = HTTPAdapter(max_retries=retry_strategy)
        self.session.mount("http://", adapter)
        self.session.mount("https://", adapter)
    
    def get_url(self, url, headers=None, params=None):
        """
        Make a GET request to the specified URL with optional headers and parameters.
        Includes enhanced retry mechanism and better error handling.
        
        Args:
            url (str): URL to fetch
            headers (dict, optional): Request headers
            params (dict, optional): Query parameters
            
        Returns:
            requests.Response or None: Response object or None if request fails
        """
        if headers is None:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        
        max_attempts = 3
        current_attempt = 0
        wait_time = 1  # Start with 1 second wait
        
        while current_attempt < max_attempts:
            current_attempt += 1
            
            # Try with different SSL verification strategies
            try:
                # First attempt: Try with verification and normal timeout
                if current_attempt == 1:
                    response = self.session.get(url, headers=headers, params=params, timeout=15, verify=True)
                # Second attempt: Try without verification and normal timeout
                elif current_attempt == 2:
                    self.logger.warning(f"Retry {current_attempt} for {url}: without SSL verification")
                    response = self.session.get(url, headers=headers, params=params, timeout=15, verify=False)
                # Third attempt: Try without verification and longer timeout
                else:
                    self.logger.warning(f"Retry {current_attempt} for {url}: without SSL verification and extended timeout")
                    response = self.session.get(url, headers=headers, params=params, timeout=30, verify=False)
                
                response.raise_for_status()
                return response
                
            except (requests.exceptions.SSLError, requests.exceptions.RequestException) as e:
                error_type = "SSL Error" if isinstance(e, requests.exceptions.SSLError) else "Request Error"
                self.logger.warning(f"{error_type} on attempt {current_attempt}/{max_attempts} for {url}: {str(e)}")
                
                # If it's the last attempt, log the error as fatal and return None
                if current_attempt >= max_attempts:
                    self.logger.error(f"All attempts failed for {url}: {str(e)}")
                    return None
                
                # Exponential backoff
                time.sleep(wait_time)
                wait_time *= 2  # Double the wait time for next attempt
    
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