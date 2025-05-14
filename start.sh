#!/bin/bash

# Exit on error
set -e

# First kill any existing servers
echo "Stopping any existing servers..."
./kill-servers.sh

# Create necessary directories
echo "Creating required directories..."
mkdir -p backend/data backend/logs

# Activate virtual environment
echo "Activating virtual environment..."
source .venv/bin/activate

# Set up environment variables
echo "Setting up environment variables..."
export FLASK_APP=backend/app.py
export NEXT_PUBLIC_API_URL=http://localhost:5001

# Clear Next.js cache to avoid build issues
echo "Clearing Next.js cache..."
rm -rf .next

# Run the backend in the background
echo "Starting backend server..."
cd backend
python app.py &
BACKEND_PID=$!
cd ..

# Give the backend time to start
echo "Waiting for backend to start..."
sleep 3

# Check if backend is running
if ! kill -0 $BACKEND_PID 2>/dev/null; then
  echo "Backend failed to start. Check logs for details."
  exit 1
fi

# Check health endpoint
echo "Checking backend health..."
if ! curl -s "http://localhost:5001/api/health" | grep -q "healthy"; then
  echo "Backend is not healthy. Check logs for details."
  kill $BACKEND_PID
  exit 1
fi

echo "Backend started successfully and is healthy."

# Start the frontend with explicit port
echo "Starting frontend server..."
npm run dev:frontend

# When the frontend is stopped, also stop the backend
trap "echo 'Shutting down...'; kill $BACKEND_PID 2>/dev/null || true" EXIT

# Wait for the frontend to finish
wait 