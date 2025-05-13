# Turkish Crypto Rewards Comparison Website

A comprehensive website to compare staking rewards, campaigns, and other offers from cryptocurrency exchanges and platforms available in Turkey.

## Features

- **Live Data Scraping**: Automatically fetches and updates data from major Turkish crypto exchanges
- **Comparison Tool**: Compare staking APY rates, lockup periods, and minimum requirements
- **Platform Details**: View detailed information about each platform's offerings
- **Responsive Design**: Works on desktop and mobile devices

## Supported Platforms

- BtcTurk
- Paribu
- (More to come)

## Tech Stack

- **Frontend**: Next.js, TailwindCSS, React
- **Backend**: Flask (Python), BeautifulSoup for scraping
- **Data**: Real-time data scraped from exchange websites with fallback to mock data

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Python 3.9+
- Virtual environment (recommended)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/crypto-rewards-comparison-turkey.git
   cd crypto-rewards-comparison-turkey
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Set up Python virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

4. Install backend dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```

### Running the application

You can run both the frontend and backend together using:

```bash
./run-dev.sh
```

Or run them separately:

1. Start the backend:
   ```bash
   cd backend
   python app.py
   ```

2. In a separate terminal, start the frontend:
   ```bash
   npm run dev:frontend
   ```

The website will be accessible at http://localhost:3000 and the API at http://localhost:5001/api.

## Project Structure

```
/
├── src/                  # Frontend code
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── lib/              # Utility functions and API client
│   └── styles/           # Global styles
├── backend/              # Backend code
│   ├── scrapers/         # Web scrapers for each platform
│   │   ├── btcturk.py
│   │   └── paribu.py
│   ├── data/             # Scraped data storage
│   ├── logs/             # Backend logs
│   └── app.py            # Flask application
├── public/               # Static assets
└── ...
```

## Data Scraping

The application uses a combination of approaches to get the latest data:

1. First, it attempts to scrape real data from the exchange websites
2. If scraping fails, it falls back to previously saved data
3. If no data exists, it uses hardcoded mock data

Scraping happens:
- When the backend starts
- Every 6 hours automatically
- When manually triggered via API

## Contributing

Contributions are welcome! If you'd like to add support for more platforms or improve the existing ones, please:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This tool is for informational purposes only. Always verify rates and terms directly with the exchanges before making investment decisions.
