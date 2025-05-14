# Setting Up Gmail for Your Application

To fix the email verification system, you need to set up Gmail to allow app access. Gmail has security features that prevent direct password authentication from apps, requiring you to create an "App Password" instead.

## Steps to Generate a Gmail App Password

1. **Enable 2-Step Verification for your Gmail account**:
   - Go to your [Google Account](https://myaccount.google.com/)
   - Select "Security" from the left menu
   - Scroll to "Signing in to Google" and select "2-Step Verification"
   - Follow the steps to turn on 2-Step Verification

2. **Create an App Password**:
   - After enabling 2-Step Verification, go back to the [Security](https://myaccount.google.com/security) page
   - Scroll to "Signing in to Google" and select "App passwords"
   - Select "Mail" for the app and "Other (Custom name)" for the device
   - Enter "Crypto Rewards Turkey" as the name
   - Click "Generate"
   - Google will display a 16-character app password

3. **Update Heroku with the App Password**:
   - Run the following command, replacing `YOUR_APP_PASSWORD` with the password you generated:
   ```
   heroku config:set MAIL_PASSWORD=YOUR_APP_PASSWORD -a crypto-rewards-tr-api
   ```

4. **Test the Email System**:
   - After updating the app password, test the registration system again
   - You should now receive verification emails

## Alternative Email Services

If you continue to have issues with Gmail, consider these alternatives:

1. **SendGrid**: A dedicated email service with free tier options
   - Sign up at [SendGrid](https://sendgrid.com/)
   - Get an API key
   - Update the email configuration in your application

2. **MailGun**: Another popular email service
   - Sign up at [MailGun](https://www.mailgun.com/)
   - Get API credentials
   - Update the email configuration

## For Development Testing

If you just want to test the system without setting up real email:

1. **Use a dummy email service** like [Mailtrap](https://mailtrap.io/) which captures emails in a test inbox
2. **Temporarily switch back to auto-activation** by running:
   ```
   ./fix-auto-activate.sh
   ```

This will bypass the email verification requirement while you're developing and testing other features. 