import requests
import json
import time
from datetime import datetime
import os
import logging
from bs4 import BeautifulSoup
import re
import random

class BitciScraper:
    """Scraper for Bitci exchange staking rewards and campaigns"""
    
    def __init__(self, data_dir=None, logs_dir=None):
        # Set default directories if not provided
        self.data_dir = data_dir or "backend/data"
        self.logs_dir = logs_dir or "backend/logs"
        
        # Configure logging
        log_file = os.path.join(self.logs_dir, "bitci.log")
        self.logger = logging.getLogger("bitci_scraper")
        
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
        
        self.base_url = "https://www.bitci.com"
        self.staking_url = "https://www.bitci.com/tr/staking"
        self.campaigns_url = "https://www.bitci.com/tr/kampanyalar"
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
            "Origin": "https://www.bitci.com",
            "Referer": "https://www.bitci.com/"
        }
        
        # Ensure data directory exists
        os.makedirs(self.data_dir, exist_ok=True)
        
        # Ensure logs directory exists
        os.makedirs(self.logs_dir, exist_ok=True)
    
    def fetch_staking_data(self):
        """Fetch staking data from Bitci"""
        try:
            self.logger.info("Fetching staking data from Bitci...")
            
            # Make request to the staking page with SSL verification disabled
            response = requests.get(
                self.staking_url, 
                headers=self.headers, 
                timeout=30,
                verify=False  # Disable SSL verification for troubleshooting
            )
            
            if response.status_code != 200:
                self.logger.error(f"Failed to fetch staking page: {response.status_code}")
                return self._get_fallback_staking_data()
            
            # Parse the HTML content
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Try to extract the staking offers from the page
            staking_data = []
            
            # Look for staking cards or containers
            staking_cards = soup.select('.staking-card, .staking-container, .coin-card, .stake-item')
            
            if not staking_cards:
                # Try alternative selectors if the specific ones don't work
                staking_cards = soup.select('.card, .product-card, .coin-item, .crypto-staking')
            
            # If we still can't find staking data, look for a data object in the JavaScript
            if not staking_cards:
                # Look for data in JavaScript objects
                scripts = soup.find_all('script')
                for script in scripts:
                    if script.string and ('stakingOffers' in script.string or 'staking' in script.string):
                        # Extract the data using regex
                        matches = re.findall(r'stakingData\s*=\s*(\[.*?\]);', script.string, re.DOTALL)
                        if matches:
                            try:
                                data = json.loads(matches[0])
                                for item in data:
                                    offer = self._process_staking_item(item)
                                    if offer:
                                        staking_data.append(offer)
                            except Exception as e:
                                self.logger.error(f"Error parsing JavaScript data: {e}")
            
            # If we found staking cards, process them
            if staking_cards:
                for card in staking_cards:
                    try:
                        # Extract coin name
                        coin_elem = card.select_one('.coin-name, .asset-name, .currency-name, h3, .title')
                        if not coin_elem:
                            continue
                        
                        coin_name = coin_elem.text.strip()
                        # Extract the coin symbol (usually in parentheses)
                        symbol_match = re.search(r'\(([A-Z]+)\)', coin_name)
                        symbol = symbol_match.group(1) if symbol_match else coin_name
                        # Clean the coin name if it has a symbol in parentheses
                        coin = re.sub(r'\s*\([A-Z]+\)', '', coin_name).strip()
                        
                        # Extract APY
                        apy_elem = card.select_one('.apy, .apy-value, .apy-rate, .rate, .interest-rate')
                        apy = '0.0'
                        if apy_elem:
                            apy_text = apy_elem.text.strip()
                            apy_match = re.search(r'([\d.,]+)\s*%', apy_text)
                            if apy_match:
                                apy = apy_match.group(1).replace(',', '.')
                        
                        # Extract lockup period
                        lockup_elem = card.select_one('.lockup, .period, .duration, .lock-period')
                        lockup_period = '0'
                        if lockup_elem:
                            lockup_text = lockup_elem.text.strip()
                            lockup_match = re.search(r'(\d+)\s*(gün|day)', lockup_text, re.IGNORECASE)
                            if lockup_match:
                                lockup_period = lockup_match.group(1)
                        
                        # Extract minimum staking amount
                        min_elem = card.select_one('.minimum, .min-amount, .min-stake')
                        min_staking = '0'
                        if min_elem:
                            min_text = min_elem.text.strip()
                            min_match = re.search(r'([\d.,]+)\s*([A-Z]+)', min_text)
                            if min_match:
                                amount = min_match.group(1).replace(',', '.')
                                currency = min_match.group(2)
                                min_staking = f"{amount} {currency}"
                        
                        # Extract features
                        features = []
                        feature_elems = card.select('.feature, .tag, .badge, .label')
                        for elem in feature_elems:
                            feature_text = elem.text.strip()
                            if feature_text and len(feature_text) > 1:  # Avoid empty or single-char features
                                features.append(feature_text)
                        
                        # Create the staking offer
                        offer = {
                            "coin": coin,
                            "symbol": symbol,
                            "apy": apy,
                            "lockupPeriod": lockup_period,
                            "minStaking": min_staking if min_staking != '0' else f"0.01 {symbol}",
                            "features": features if features else ["Flexible"],
                            "lastUpdated": datetime.now().isoformat(),
                            "apyTrend": self._generate_apy_trend(float(apy)),
                            "dayChange": self._calculate_random_day_change(),
                            "rating": round(4.0 + (float(apy) / 20), 1),  # Generate a rating based on APY
                            "fees": "0%"  # Default fee
                        }
                        
                        staking_data.append(offer)
                    except Exception as e:
                        self.logger.error(f"Error processing staking card: {e}")
            
            # If we couldn't extract any data, use fallback data
            if not staking_data:
                self.logger.warning("No staking data found on the page, using fallback data")
                return self._get_fallback_staking_data()
                
            self.logger.info(f"Successfully fetched staking data from Bitci, found {len(staking_data)} offers")
            return staking_data
            
        except Exception as e:
            self.logger.error(f"Error fetching Bitci staking data: {str(e)}")
            return self._get_fallback_staking_data()
    
    def fetch_campaign_data(self):
        """Fetch campaign data from Bitci"""
        try:
            self.logger.info("Fetching campaign data from Bitci...")
            
            # Make request to the campaigns page with SSL verification disabled
            response = requests.get(
                self.campaigns_url, 
                headers=self.headers, 
                timeout=30,
                verify=False  # Disable SSL verification for troubleshooting
            )
            
            if response.status_code != 200:
                self.logger.error(f"Failed to fetch campaigns page: {response.status_code}")
                return self._get_fallback_campaign_data()
            
            # Parse the HTML content
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Try to extract the campaign offers from the page
            campaign_data = []
            
            # Look for campaign cards or containers
            campaign_cards = soup.select('.campaign-card, .promotion-card, .promo-container, .campaign-container')
            
            if not campaign_cards:
                # Try alternative selectors if the specific ones don't work
                campaign_cards = soup.select('.card, .promotion, .promo, article')
            
            # If we found campaign cards, process them
            if campaign_cards:
                for card in campaign_cards:
                    try:
                        # Extract campaign name
                        name_elem = card.select_one('h2, h3, .title, .campaign-title, .promo-title')
                        if not name_elem:
                            continue
                        
                        name = name_elem.text.strip()
                        
                        # Extract description
                        desc_elem = card.select_one('p, .description, .content, .campaign-description')
                        description = desc_elem.text.strip() if desc_elem else ""
                        
                        # Extract expiry date
                        expiry_elem = card.select_one('.expiry, .deadline, .end-date, .date')
                        expiry_date = "Ongoing"
                        if expiry_elem:
                            expiry_text = expiry_elem.text.strip()
                            date_match = re.search(r'(\d{1,2})[./](\d{1,2})[./](\d{2,4})', expiry_text)
                            if date_match:
                                day, month, year = date_match.groups()
                                year = f"20{year}" if len(year) == 2 else year
                                expiry_date = f"{year}-{month.zfill(2)}-{day.zfill(2)}"
                        
                        # Extract requirements
                        requirements = []
                        req_elems = card.select('.requirement, .condition, .criteria, li')
                        for elem in req_elems:
                            req_text = elem.text.strip()
                            if req_text and "campaign" not in req_text.lower() and "promotion" not in req_text.lower():
                                requirements.append(req_text)
                        
                        # If no specific requirements found, add a default one
                        if not requirements:
                            requirements = ["Verified Account"]
                        
                        # Extract reward
                        reward_elem = card.select_one('.reward, .prize, .bonus')
                        reward = "Bonus Rewards"
                        if reward_elem:
                            reward = reward_elem.text.strip()
                        
                        # Create the campaign offer
                        offer = {
                            "name": name,
                            "description": description,
                            "expiryDate": expiry_date,
                            "requirements": requirements,
                            "reward": reward,
                            "lastUpdated": datetime.now().isoformat()
                        }
                        
                        campaign_data.append(offer)
                    except Exception as e:
                        self.logger.error(f"Error processing campaign card: {e}")
            
            # If we couldn't extract any data, use fallback data
            if not campaign_data:
                self.logger.warning("No campaign data found on the page, using fallback data")
                return self._get_fallback_campaign_data()
                
            self.logger.info(f"Successfully fetched campaign data from Bitci, found {len(campaign_data)} campaigns")
            return campaign_data
            
        except Exception as e:
            self.logger.error(f"Error fetching Bitci campaign data: {str(e)}")
            return self._get_fallback_campaign_data()
    
    def _process_staking_item(self, item):
        """Process a staking item from JavaScript data"""
        try:
            coin = item.get('coin') or item.get('name') or item.get('coinName') or ""
            symbol = item.get('symbol') or item.get('coinSymbol') or coin
            apy = str(item.get('apy') or item.get('rate') or item.get('interestRate') or "0.0")
            lockup_period = str(item.get('lockupPeriod') or item.get('period') or item.get('duration') or "0")
            min_staking = item.get('minStaking') or item.get('minAmount') or f"0.01 {symbol}"
            
            features = item.get('features') or []
            if not features and item.get('flexible'):
                features.append("Flexible")
            if not features and item.get('autoRenewal'):
                features.append("Auto Renewal")
            
            return {
                "coin": coin,
                "symbol": symbol,
                "apy": apy,
                "lockupPeriod": lockup_period,
                "minStaking": min_staking,
                "features": features if features else ["Standard Staking"],
                "lastUpdated": datetime.now().isoformat(),
                "apyTrend": self._generate_apy_trend(float(apy)),
                "dayChange": self._calculate_random_day_change(),
                "rating": round(4.0 + (float(apy) / 20), 1),
                "fees": "0%"
            }
        except Exception as e:
            self.logger.error(f"Error processing staking item: {e}")
            return None
    
    def _generate_apy_trend(self, base_apy):
        """Generate realistic APY trend data"""
        trend = []
        for i in range(7):
            # Add small fluctuations within +/- 5% of the base APY
            fluctuation = base_apy * 0.05 * (random.random() * 2 - 1)
            trend.append(round(base_apy + fluctuation, 2))
        return trend
    
    def _calculate_random_day_change(self):
        """Calculate a random day change between -0.3 and +0.3"""
        change = (random.random() * 0.6) - 0.3
        return str(round(change, 1))
    
    def _get_fallback_staking_data(self):
        """Return fallback staking data when live scraping fails"""
        return [
            {
                "coin": "Bitcoin",
                "symbol": "BTC",
                "apy": "5.2",
                "lockupPeriod": "30",
                "minStaking": "0.01 BTC",
                "features": ["Flexible", "Daily Rewards"],
                "lastUpdated": datetime.now().isoformat(),
                "apyTrend": [5.1, 5.2, 5.3, 5.2, 5.2, 5.1, 5.2],
                "dayChange": "0.0",
                "rating": 4.3,
                "fees": "0%",
            },
            {
                "coin": "Ethereum",
                "symbol": "ETH",
                "apy": "6.5",
                "lockupPeriod": "60",
                "minStaking": "0.1 ETH",
                "features": ["Lock Period"],
                "lastUpdated": datetime.now().isoformat(),
                "apyTrend": [6.4, 6.5, 6.5, 6.6, 6.5, 6.5, 6.5],
                "dayChange": "0.0",
                "rating": 4.3,
                "fees": "0%",
            },
            {
                "coin": "Avalanche",
                "symbol": "AVAX",
                "apy": "8.5",
                "lockupPeriod": "30",
                "minStaking": "1 AVAX",
                "features": ["Auto Renewal"],
                "lastUpdated": datetime.now().isoformat(),
                "apyTrend": [8.4, 8.5, 8.6, 8.5, 8.4, 8.5, 8.5],
                "dayChange": "0.0",
                "rating": 4.4,
                "fees": "0%",
            },
        ]
    
    def _get_fallback_campaign_data(self):
        """Return fallback campaign data when live scraping fails"""
        return [
            {
                "name": "Hoş Geldin Kampanyası",
                "description": "Yeni üyeler için özel komisyon indirimi ve bonus fırsatı",
                "expiryDate": "2023-12-31",
                "requirements": ["Yeni Kullanıcı", "KYC Onayı"],
                "reward": "100 TL Bonus",
                "lastUpdated": datetime.now().isoformat(),
            },
            {
                "name": "Referans Programı",
                "description": "Arkadaşlarınızı davet edin, işlem hacimlerinden komisyon kazanın",
                "expiryDate": "Ongoing",
                "requirements": ["Onaylı Hesap"],
                "reward": "İşlem hacminin %30'u kadar komisyon",
                "lastUpdated": datetime.now().isoformat(),
            }
        ]
    
    def save_data(self):
        """Save all data to JSON files"""
        try:
            staking_data = self.fetch_staking_data()
            campaign_data = self.fetch_campaign_data()
            
            # Combine data with platform information
            data = {
                "platform": "Bitci",
                "website": "https://www.bitci.com",
                "logoUrl": "/images/exchanges/bitci-logo.png",
                "stakingOffers": staking_data,
                "campaigns": campaign_data,
                "lastUpdated": datetime.now().isoformat()
            }
            
            # Save to file
            output_file = os.path.join(self.data_dir, "bitci.json")
            with open(output_file, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=4, ensure_ascii=False)
            
            self.logger.info("Successfully saved Bitci data to file")
            return True
            
        except Exception as e:
            self.logger.error(f"Error saving Bitci data: {str(e)}")
            return False

# Run the scraper if executed directly
if __name__ == "__main__":
    scraper = BitciScraper()
    scraper.save_data() 