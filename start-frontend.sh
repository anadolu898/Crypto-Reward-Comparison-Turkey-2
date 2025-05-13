#!/bin/bash

# Exit on error
set -e

# Kill any existing frontend server
echo "Stopping any existing frontend server..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Set environment variables for the frontend
echo "Setting up environment variables..."
export NEXT_PUBLIC_API_URL=http://localhost:5001

# Start the frontend
echo "Starting frontend server..."
npm run dev:frontend > frontend.log 2>&1 &
FRONTEND_PID=$!

# Give the frontend time to start
echo "Waiting for frontend to start..."
sleep 5

# Show status
echo "Frontend server started with PID: $FRONTEND_PID"
echo "Check frontend.log for details"
echo "You can access the website at http://localhost:3000"
echo "To stop the frontend, run: lsof -ti:3000 | xargs kill -9" 