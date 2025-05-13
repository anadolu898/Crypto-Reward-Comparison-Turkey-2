#!/bin/bash

# Script to start the crypto rewards scraper service

echo "Starting Crypto Rewards Scraper Service..."

# Ensure we have the right directories
mkdir -p backend/logs backend/data

# Make sure backend/logs/launcher-error.log is empty
> backend/logs/launcher-error.log
> backend/logs/launcher-output.log

# Copy the plist file to the user's LaunchAgents directory
PLIST_PATH="$HOME/Library/LaunchAgents/com.cryptoturkey.scraper.plist"

echo "Copying service definition to $PLIST_PATH"
cp crypto-scraper.plist "$PLIST_PATH"

# Load the service
echo "Loading the service with launchctl..."
launchctl unload "$PLIST_PATH" 2>/dev/null
launchctl load -w "$PLIST_PATH"

# Check if the service is running
if launchctl list | grep com.cryptoturkey.scraper > /dev/null; then
  echo "✅ Scraper service started successfully!"
  echo "  - The service will run in the background even when you close this terminal"
  echo "  - Data will be scraped at regular intervals (3-hour default)"
  echo "  - Logs are available at: backend/logs/scraper_service.log"
else
  echo "❌ Failed to start scraper service. Check the logs for errors."
  echo "   Try running: python3 backend/scraper_service.py"
  echo "   to see direct error output."
fi

echo ""
echo "You can stop the service anytime by running: ./stop-scraper.sh"