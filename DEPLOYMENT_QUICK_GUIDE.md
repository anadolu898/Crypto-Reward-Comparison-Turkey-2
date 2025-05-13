# Quick Deployment Guide

This guide outlines the steps to deploy your Crypto Rewards Comparison website to production.

## What You'll Need

- **Heroku Account**: For hosting the backend API
- **Vercel Account**: For hosting the frontend website
- **Git**: To push your code

## Deployment Options

You have several ways to deploy your application:

### Option 1: Use the Combined Deployment Script (Recommended)

This script guides you through the entire process:

```bash
./deploy-combined.sh
```

The script will:
1. Let you choose to deploy backend, frontend, or both
2. Set up the necessary environment variables
3. Deploy to the appropriate platforms

### Option 2: Manual Deployment

#### Deploy the Backend to Heroku

```bash
./deploy-backend.sh
```

This script will:
1. Create a Heroku application
2. Set up required environment variables
3. Deploy your backend code

#### Deploy the Frontend to Vercel

```bash
./deploy-frontend.sh
```

This script will:
1. Build your frontend code
2. Deploy it to Vercel
3. Connect it to your backend API

## After Deployment

1. **Verify Backend API**: Visit your Heroku URL (https://crypto-rewards-api.herokuapp.com/)
2. **Verify Frontend**: Visit your Vercel URL (provided at the end of deployment)
3. **Test Authentication**: Register a new account and verify login works
4. **Check Data**: Verify reward data is being loaded from Turkish exchanges

## Updating Your Deployment

After making changes to your code:

1. Push changes to GitHub
2. Re-run the deployment script for the component you updated

## Troubleshooting

- **Backend Issues**: Check Heroku logs with `heroku logs --tail --app crypto-rewards-api`
- **Frontend Issues**: Check Vercel deployment logs in the Vercel dashboard
- **Connection Issues**: Verify the API URL is correctly set in frontend environment variables 