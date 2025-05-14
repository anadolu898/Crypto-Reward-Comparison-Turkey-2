# Deployment Notes

## Current Status

The website has been successfully deployed to Vercel at the following URL:

https://crypto-rewards-comparison-turkey-afc85yy3x.vercel.app

However, we encountered an issue with Heroku deployment due to Git version compatibility. The error message is:

```
Heroku does not support Git client version git/2.39.3 (Apple Git-146).
Please upgrade to the latest Git version.
```

## Complete Deployment Steps

To complete the full deployment, follow these steps:

### Backend Deployment (Heroku)

1. Update your Git version:
   ```
   brew upgrade git
   ```

2. After updating Git, run the deployment script again:
   ```
   ./deploy-combined.sh
   ```
   
   Select option 3 to deploy the backend only.

3. Once deployed, get the Heroku app URL for the backend.

### Connect Frontend to Backend

1. Add the backend URL as an environment variable in Vercel:
   ```
   vercel env add NEXT_PUBLIC_API_URL
   ```
   
   Enter the backend URL (e.g., https://crypto-rewards-tr-api.herokuapp.com).

2. Redeploy the frontend with the updated environment variable:
   ```
   vercel --prod
   ```

## Alternative Approach: Firebase Deployment

If Heroku deployment continues to be problematic, consider deploying the backend to Firebase or another platform:

1. Create a Firebase project
2. Set up Firebase Cloud Functions to run your Flask API
3. Deploy the backend code to Firebase
4. Update the frontend environment variable to point to the Firebase function URL

## Development Environment

For local development, the application is configured to work with auto user activation without email verification. This makes it easier to test the account creation feature.

## Email Configuration

For the production environment, you'll need to set up email credentials in the Heroku environment variables:

```
heroku config:set MAIL_SERVER=smtp.gmail.com MAIL_PORT=587 MAIL_USE_TLS=True MAIL_USERNAME=your-email@gmail.com MAIL_PASSWORD=your-app-password MAIL_DEFAULT_SENDER=noreply@cryptorewards.com -a your-heroku-app-name
``` 