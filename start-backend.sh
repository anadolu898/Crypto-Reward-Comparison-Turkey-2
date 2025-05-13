#!/bin/bash

# Exit on error
set -e

# Kill any existing backend server
echo "Stopping any existing backend server..."
lsof -ti:5001 | xargs kill -9 2>/dev/null || true

# Create necessary directories
echo "Creating required directories..."
mkdir -p backend/data backend/logs

# Activate virtual environment
echo "Activating virtual environment..."
source .venv/bin/activate

# Set up environment variables
echo "Setting up environment variables..."
export FLASK_APP=backend/app.py

# Run the backend in the background
echo "Starting backend server..."
cd backend
python app.py > ../backend/logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Give the backend time to start
echo "Waiting for backend to start..."
sleep 3

# Show status
echo "Backend server started with PID: $BACKEND_PID"
echo "Check backend/logs/backend.log for details"
echo "You can access the API at http://localhost:5001"
echo "To stop the backend, run: lsof -ti:5001 | xargs kill -9" 