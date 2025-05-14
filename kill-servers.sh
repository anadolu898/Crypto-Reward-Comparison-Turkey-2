#!/bin/bash

echo "Stopping any running servers..."

# Kill any process running on port 3000 (Next.js)
if lsof -i :3000 >/dev/null 2>&1; then
    echo "Killing process on port 3000..."
    lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9 || true
fi

# Kill any process running on port 5001 (Flask)
if lsof -i :5001 >/dev/null 2>&1; then
    echo "Killing process on port 5001..."
    lsof -i :5001 | grep LISTEN | awk '{print $2}' | xargs kill -9 || true
fi

# Kill any node or python processes related to our app
echo "Killing any remaining node or python processes..."
pkill -f "node.*next" || true
pkill -f "python.*app.py" || true

# Clear Next.js build cache
if [ -d ".next" ]; then
  echo "Clearing Next.js build cache..."
  rm -rf .next
fi

echo "All servers stopped!" 