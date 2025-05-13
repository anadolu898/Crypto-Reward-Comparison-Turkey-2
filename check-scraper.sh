#!/bin/bash

# Script to check the status of the crypto rewards scraper service

echo "Checking Crypto Rewards Scraper Service Status..."

# Path to the plist file
PLIST_PATH="$HOME/Library/LaunchAgents/com.cryptoturkey.scraper.plist"

# Check if service is registered with launchctl
if launchctl list | grep com.cryptoturkey.scraper > /dev/null; then
  echo "✅ Scraper service is registered with launchctl"
else
  echo "❌ Scraper service is NOT registered with launchctl"
fi

# Check for running scraper processes
SCRAPER_PROCS=$(ps aux | grep "[s]craper_service.py" | awk '{print $2}')
if [ -n "$SCRAPER_PROCS" ]; then
  echo "✅ Scraper process is running with PID(s): $SCRAPER_PROCS"
else
  echo "❌ No scraper process is currently running"
fi

# Check if the service definition exists
if [ -f "$PLIST_PATH" ]; then
  echo "✅ Service definition exists at $PLIST_PATH"
else
  echo "❌ Service definition NOT found at $PLIST_PATH"
fi

# Check the last log entries
LOG_FILE="backend/logs/scraper_service.log"
if [ -f "$LOG_FILE" ]; then
  echo ""
  echo "=== Last 10 log entries ==="
  tail -n 10 "$LOG_FILE"
  
  # Check when the last update happened
  LAST_UPDATE=$(grep "Scheduled update completed" "$LOG_FILE" | tail -n 1)
  if [ -n "$LAST_UPDATE" ]; then
    echo ""
    echo "Last successful update: "
    echo "$LAST_UPDATE"
  else
    echo ""
    echo "No completed updates found in the log"
  fi
else
  echo "❌ Log file NOT found at $LOG_FILE"
fi

# Check if data files exist
echo ""
echo "=== Data Files ==="
DATA_DIR="backend/data"
if [ -d "$DATA_DIR" ]; then
  ls -la "$DATA_DIR"
  
  # Check file modification times
  for file in "$DATA_DIR"/*.json; do
    if [ -f "$file" ]; then
      echo ""
      echo "$(basename "$file") last modified: $(stat -f "%Sm" "$file")"
      echo "File size: $(stat -f "%z" "$file") bytes"
      echo "Sample content (first 5 lines):"
      head -n 5 "$file"
      echo "..."
    fi
  done
else
  echo "❌ Data directory NOT found at $DATA_DIR"
fi 