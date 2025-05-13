#!/bin/bash

# Ensure we stop all background processes when this script exits
trap 'kill $(jobs -p) 2>/dev/null' EXIT

# Function to check if a port is already in use
port_in_use() {
  lsof -i :$1 &>/dev/null
  return $?
}

# Create necessary directories
mkdir -p backend/logs backend/data public/images

# Activate virtual environment
echo "Activating virtual environment..."
source .venv/bin/activate

# Check if the backend port is available
if port_in_use 5001; then
  echo "Warning: Port 5001 is already in use. The backend server may not start correctly."
fi

# Start the backend server
echo "Starting backend server..."
cd backend && python app.py &
BACKEND_PID=$!

# Wait for the backend to start
sleep 3

# Check if backend started successfully
if ! ps -p $BACKEND_PID > /dev/null; then
  echo "Error: Backend server failed to start. Check logs for details."
  exit 1
fi

# Start the frontend server
echo "Starting frontend server..."
cd .. && npm run dev:frontend &
FRONTEND_PID=$!

# Wait for user to press Ctrl+C
echo "Services started. Press Ctrl+C to stop both servers."
wait 