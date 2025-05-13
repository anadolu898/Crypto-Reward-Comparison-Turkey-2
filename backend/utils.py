import requests
import logging
import urllib3
import os
from functools import wraps

# Suppress SSL warnings if running in development mode
if os.environ.get('CRYPTO_ENV') != 'production':
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def safe_request(url, headers=None, method='GET', timeout=30, max_retries=3, verify_ssl=None):
    """
    Makes a safe HTTP request with proper error handling and configurable SSL verification.
    
    Args:
        url (str): The URL to request
        headers (dict, optional): Request headers
        method (str, optional): HTTP method (GET, POST)
        timeout (int, optional): Request timeout in seconds
        max_retries (int, optional): Number of retry attempts
        verify_ssl (bool, optional): Whether to verify SSL certificates. If None, checks environment.
    
    Returns:
        tuple: (response_object or None, error_message or None)
    """
    # Default headers if none provided
    if headers is None:
        headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
            "Accept": "application/json, text/plain, */*",
        }
    
    # Determine SSL verification mode
    if verify_ssl is None:
        # Only verify SSL in production environment
        verify_ssl = os.environ.get('CRYPTO_ENV') == 'production'
    
    # Configure session with retries
    session = requests.Session()
    adapter = requests.adapters.HTTPAdapter(max_retries=max_retries)
    session.mount('http://', adapter)
    session.mount('https://', adapter)
    
    for attempt in range(max_retries):
        try:
            if method.upper() == 'GET':
                response = session.get(
                    url,
                    headers=headers,
                    timeout=timeout,
                    verify=verify_ssl
                )
            elif method.upper() == 'POST':
                response = session.post(
                    url,
                    headers=headers,
                    timeout=timeout,
                    verify=verify_ssl
                )
            else:
                return None, f"Unsupported HTTP method: {method}"
            
            # Check if the request was successful
            response.raise_for_status()
            return response, None
            
        except requests.exceptions.SSLError as e:
            error = f"SSL Error: {str(e)}"
            # If we're already not verifying SSL, this is a more serious issue
            if not verify_ssl:
                return None, error
            # Try again without SSL verification on next attempt
            verify_ssl = False
            
        except requests.exceptions.ConnectionError as e:
            error = f"Connection Error: {str(e)}"
            # Sleep before retry
            if attempt < max_retries - 1:
                import time
                time.sleep(1 * (attempt + 1))  # Exponential backoff
                
        except requests.exceptions.Timeout as e:
            error = f"Timeout Error: {str(e)}"
            # Sleep before retry
            if attempt < max_retries - 1:
                import time
                time.sleep(1 * (attempt + 1))  # Exponential backoff
                
        except requests.exceptions.HTTPError as e:
            error = f"HTTP Error: {str(e)}"
            # Don't retry client errors (4xx)
            if response.status_code >= 400 and response.status_code < 500:
                return None, error
                
        except Exception as e:
            error = f"Request Error: {str(e)}"
            
    # If we've exhausted all retries
    return None, error

def with_fallback(fallback_func):
    """
    Decorator to provide fallback data when a function fails.
    
    Args:
        fallback_func (callable): Function to call to get fallback data
        
    Returns:
        callable: Decorated function
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            try:
                result = func(*args, **kwargs)
                # If result is None or empty list/dict, use fallback
                if result is None or (isinstance(result, (list, dict)) and not result):
                    instance = args[0]  # The 'self' instance
                    if hasattr(instance, 'logger'):
                        instance.logger.warning(f"No data returned from {func.__name__}, using fallback data")
                    return fallback_func(*args, **kwargs)
                return result
            except Exception as e:
                # Get the instance (self)
                instance = args[0]
                if hasattr(instance, 'logger'):
                    instance.logger.error(f"Error in {func.__name__}: {str(e)}, using fallback data")
                return fallback_func(*args, **kwargs)
        return wrapper
    return decorator 