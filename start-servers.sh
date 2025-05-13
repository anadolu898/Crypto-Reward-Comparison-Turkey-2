#!/bin/bash

# Exit on error
set -e

echo "Starting both servers..."

# Kill any running servers on ports 3000 and 5001
echo "Stopping any existing servers..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:5001 | xargs kill -9 2>/dev/null || true

# Make sure data and logs directories exist
mkdir -p backend/data backend/logs

# Activate virtual environment
echo "Activating virtual environment..."
source .venv/bin/activate

# Start the backend in the background
echo "Starting backend server..."
cd backend
export FLASK_APP=app.py
python app.py &
BACKEND_PID=$!
cd ..

# Give the backend a moment to start
sleep 2

# Start the frontend
echo "Starting frontend server..."
npm run dev:frontend

# When the user terminates with Ctrl+C, kill the backend too
trap "kill $BACKEND_PID" EXIT

# Wait for frontend to finish
wait 