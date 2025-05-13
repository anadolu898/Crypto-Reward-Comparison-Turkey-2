# Crypto Rewards Comparison Turkey

A website to compare staking, campaign, and other rewards offered by crypto exchanges and DeFi programs available in Turkey.

## Overview

This project provides a platform for Turkish cryptocurrency investors to compare and analyze rewards, staking rates, and campaigns from various exchanges and DeFi platforms operating in Turkey. The website helps users make informed decisions by providing up-to-date information on the best available returns for their crypto assets.

## Features

- **Comprehensive Comparison Tables**: Compare staking APY rates, campaign rewards, and minimum staking amounts across different platforms.
- **Detailed Platform Information**: Access individual platform pages with detailed information on all available offers.
- **Filterable Data**: Filter comparison results by platform, cryptocurrency, APY rate, and more.
- **Subscription System**: Free tier with basic information and premium tier with advanced features.
- **Mobile Responsive Design**: Access the platform from any device with a seamless experience.

## Project Structure

The project is divided into two main components:

### Frontend

- Built with Next.js and React
- Responsive design using Tailwind CSS
- TypeScript for type safety
- Client-side data fetching with Axios

### Backend

- Python with Flask REST API
- Data scrapers for various crypto platforms
- Scheduled data updates
- JSON-based data storage

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Python (v3.8 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/crypto-rewards-comparison-turkey.git
   cd crypto-rewards-comparison-turkey
   ```

2. Install frontend dependencies:
   ```
   npm install
   ```

3. Install backend dependencies:
   ```
   pip install -r backend/requirements.txt
   ```

### Running the Application

You can run the frontend and backend separately or together:

#### Run both frontend and backend together:
```
npm run dev:all
```

#### Run only the frontend:
```
npm run dev:frontend
```

#### Run only the backend:
```
npm run dev:backend
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Testing

### Frontend Testing

To test the frontend:

```bash
npm run test
```

The frontend tests check:
1. Component rendering
2. User interactions
3. API integration

### Backend Testing

To test the backend:

```bash
cd backend
python -m unittest discover tests
```

The backend tests check:
1. API endpoints
2. Data scrapers
3. Data processing functions

### Manual Testing

For manual testing, use the following test accounts:

- **Free Tier**: 
  - Email: test@example.com
  - Password: testpassword123

- **Premium Tier**: 
  - Email: premium@example.com
  - Password: premiumpassword123

## API Endpoints

- `GET /api/rewards` - Get all rewards data from all platforms
- `GET /api/rewards/<platform>` - Get rewards data for a specific platform
- `POST /api/update` - Trigger a manual update of the data (requires API key)

## Deployment

### Frontend

The Next.js frontend can be deployed to Vercel:

```
npm run build
```

### Backend

The Flask backend can be deployed to any Python-supporting platform like Heroku, AWS, or DigitalOcean:

```
cd backend
gunicorn app:app
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Disclaimer

This website provides information for educational purposes only and is not intended as investment advice. Always do your own research before making any investment decisions.

## Contact

If you have any questions or suggestions, please feel free to open an issue or contact us directly.
