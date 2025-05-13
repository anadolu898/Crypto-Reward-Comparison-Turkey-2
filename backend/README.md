# Crypto Rewards Comparison Backend

This is the backend API for the Crypto Rewards Comparison website, which provides data on staking, campaign, and other rewards offered by crypto exchanges and DeFi programs available in Turkey.

## Setup

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Create a `.env` file with the following variables:
   ```
   # API Configuration
   API_KEY=your_secret_api_key_here
   PORT=5000
   
   # CORS Settings
   CORS_ORIGINS=http://localhost:3000
   
   # Data Update Settings
   UPDATE_INTERVAL_HOURS=6
   
   # Directories (relative to app.py or absolute paths)
   DATA_DIR=data
   LOGS_DIR=logs
   ```

3. Create the data and logs directories:
   ```
   mkdir -p data logs
   ```

## Running the Application

Start the Flask API server:
```
python app.py
```

## API Endpoints

- `GET /api/rewards` - Get all rewards data from all platforms
- `GET /api/rewards/<platform>` - Get rewards data for a specific platform
- `POST /api/update` - Trigger a manual update of the data (requires API key)

## Updating the Data

The application automatically updates the data at the interval specified in `UPDATE_INTERVAL_HOURS` (default: 6 hours).

To manually trigger an update, send a POST request to `/api/update` with the `X-API-Key` header set to the API key specified in your `.env` file.

Example:
```
curl -X POST -H "X-API-Key: your_secret_api_key_here" http://localhost:5000/api/update
```

## Adding New Scrapers

To add a new exchange scraper:

1. Create a new Python file in the `scrapers` directory (e.g., `scrapers/newexchange.py`)
2. Implement the scraper class following the same pattern as existing scrapers
3. Add the new scraper to the `scrapers` dictionary in `app.py`

## Deployment

See the main [DEPLOYMENT.md](../DEPLOYMENT.md) file for deployment instructions. 