# Deployment Guide

This document outlines how to deploy the Crypto Rewards Comparison website to production.

## Environment Variables

### Backend Environment Variables

The backend requires the following environment variables:

```
# API Configuration
API_KEY=your_secret_api_key_here
PORT=5000

# CORS Settings
CORS_ORIGINS=http://localhost:3000,https://your-production-frontend.com

# Data Update Settings
UPDATE_INTERVAL_HOURS=6

# Directories (relative to app.py or absolute paths)
DATA_DIR=data
LOGS_DIR=logs
```

### Frontend Environment Variables

The frontend requires the following environment variables:

```
NEXT_PUBLIC_API_BASE_URL=https://your-backend-api-url.com/api
```

## Deploying the Frontend

The frontend is built with Next.js and can be easily deployed to Vercel, Netlify, or any other service that supports Next.js applications.

### Deploying to Vercel (Recommended)

1. Create an account on [Vercel](https://vercel.com/) if you don't have one
2. Install the Vercel CLI: `npm i -g vercel`
3. From the project root, run: `vercel`
4. Follow the prompts to complete the deployment
5. Set the following environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_API_BASE_URL`: URL to your backend API

### Deploying to Other Platforms

To deploy to other platforms, build the application first:

```bash
npm run build
```

Then deploy the `.next` directory according to the platform's instructions.

## Deploying the Backend

The backend can be deployed to platforms like Heroku, DigitalOcean, AWS, or any service that supports Python applications.

### Deploying to Heroku

1. Create a `Procfile` in the backend directory:
   ```
   web: gunicorn app:app
   ```

2. Install the Heroku CLI and log in:
   ```bash
   npm install -g heroku
   heroku login
   ```

3. Create a new Heroku app:
   ```bash
   cd backend
   heroku create crypto-rewards-api
   ```

4. Deploy to Heroku:
   ```bash
   git subtree push --prefix backend heroku main
   ```

5. Set the environment variables:
   ```bash
   heroku config:set API_KEY=your_secret_key
   heroku config:set CORS_ORIGINS=https://your-frontend-domain.com
   heroku config:set UPDATE_INTERVAL_HOURS=6
   ```

### Deploying to DigitalOcean App Platform

1. Create a new app on DigitalOcean App Platform
2. Connect your GitHub repository
3. Configure the app to use the `/backend` directory
4. Set the Build Command: `pip install -r requirements.txt`
5. Set the Run Command: `gunicorn app:app`
6. Add environment variables as needed

## Security Considerations

Before deploying to production, ensure you:

1. Set a strong, unique API key for the backend
2. Enable HTTPS for both frontend and backend
3. Set up proper CORS configuration in the backend
4. Remove any test accounts or mock data
5. Configure rate limiting for API endpoints

## Monitoring and Maintenance

After deployment:

1. Set up monitoring to track application health
2. Configure alerts for any errors or downtime
3. Regularly back up the data
4. Test your scrapers regularly to ensure they're still working
5. Update dependencies regularly to fix security vulnerabilities

## Updating the Deployment

To update the application after making changes:

1. Push changes to your repository
2. If using Vercel or similar services with CI/CD, your app will automatically update
3. For manual deployments, repeat the deployment steps with your new code 