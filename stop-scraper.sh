#!/bin/bash

# Script to stop the crypto rewards scraper service

echo "Stopping Crypto Rewards Scraper Service..."

# Path to the plist file
PLIST_PATH="$HOME/Library/LaunchAgents/com.cryptoturkey.scraper.plist"

# Unload the service
if [ -f "$PLIST_PATH" ]; then
  echo "Unloading service from launchctl..."
  launchctl unload "$PLIST_PATH"
  
  # Check if it's stopped
  if ! launchctl list | grep com.cryptoturkey.scraper > /dev/null; then
    echo "✅ Scraper service stopped successfully!"
  else
    echo "❌ Failed to stop service. You may need to restart your computer to fully stop it."
    echo "   Or try: launchctl remove com.cryptoturkey.scraper"
  fi
else
  echo "❌ Service definition not found at $PLIST_PATH"
  echo "   The service may not be installed or was already removed."
fi

# Optionally, find and kill any running Python processes
echo "Checking for running scraper processes..."
SCRAPER_PROCS=$(ps aux | grep "[s]craper_service.py" | awk '{print $2}')

if [ -n "$SCRAPER_PROCS" ]; then
  echo "Found running scraper processes. Terminating them..."
  for pid in $SCRAPER_PROCS; do
    echo "Killing process ID: $pid"
    kill -9 $pid
  done
  echo "All scraper processes terminated."
else
  echo "No running scraper processes found."
fi

echo ""
echo "You can start the service again by running: ./start-scraper.sh" 