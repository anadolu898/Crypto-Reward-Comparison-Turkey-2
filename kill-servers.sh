#!/bin/bash

echo "Stopping any running servers..."

# Kill any processes using ports 3000-3003 (Next.js)
for port in 3000 3001 3002 3003; do
  pid=$(lsof -ti:$port 2>/dev/null)
  if [ ! -z "$pid" ]; then
    echo "Killing process $pid on port $port"
    kill -9 $pid 2>/dev/null || echo "Failed to kill process on port $port"
  else
    echo "No process found on port $port"
  fi
done

# Kill any processes using port 5001 (Flask backend)
pid=$(lsof -ti:5001 2>/dev/null)
if [ ! -z "$pid" ]; then
  echo "Killing process $pid on port 5001"
  kill -9 $pid 2>/dev/null || echo "Failed to kill process on port 5001"
else
  echo "No process found on port 5001"
fi

# Kill any Python processes that might be our Flask app
echo "Looking for Python processes to clean up..."

# Look for app.py processes
app_pids=$(ps aux | grep -i "python.*app.py" | grep -v grep | awk '{print $2}')
if [ ! -z "$app_pids" ]; then
  echo "Found app.py processes: $app_pids"
  for pid in $app_pids; do
    kill -9 $pid 2>/dev/null && echo "Killed process $pid" || echo "Failed to kill process $pid"
  done
fi

# Look for scraper processes
scraper_pids=$(ps aux | grep -i "scraper_service.py" | grep -v grep | awk '{print $2}')
if [ ! -z "$scraper_pids" ]; then
  echo "Found scraper processes: $scraper_pids"
  for pid in $scraper_pids; do
    kill -9 $pid 2>/dev/null && echo "Killed process $pid" || echo "Failed to kill process $pid"
  done
fi

# Clear Next.js build cache
if [ -d ".next" ]; then
  echo "Clearing Next.js build cache..."
  rm -rf .next
fi

echo "All servers stopped!" 