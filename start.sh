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

# Run the backend in the background
echo "Starting backend server..."
cd backend
python app.py &
BACKEND_PID=$!
cd ..

# Give the backend time to start
echo "Waiting for backend to start..."
sleep 3

# Start the frontend
echo "Starting frontend server..."
npm run dev:frontend

# When the frontend is stopped, also stop the backend
trap "echo 'Shutting down...'; kill $BACKEND_PID" EXIT

# Wait for the frontend to finish
wait 