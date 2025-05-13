#!/bin/bash

echo "Stopping any running servers..."

# Kill any processes using ports 3000-3003 (Next.js)
for port in 3000 3001 3002 3003; do
  pid=$(lsof -ti:$port)
  if [ ! -z "$pid" ]; then
    echo "Killing process $pid on port $port"
    kill -9 $pid
  else
    echo "No process found on port $port"
  fi
done

# Kill any processes using port 5001 (Flask backend)
pid=$(lsof -ti:5001)
if [ ! -z "$pid" ]; then
  echo "Killing process $pid on port 5001"
  kill -9 $pid
else
  echo "No process found on port 5001"
fi

# Kill any Python processes that might be our Flask app
ps aux | grep -i "python.*app.py" | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null || true
ps aux | grep -i "scraper_service.py" | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null || true

echo "All servers stopped!" 