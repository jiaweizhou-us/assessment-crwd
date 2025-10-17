#!/bin/bash

# CRWD Application Startup Script
echo "Starting CRWD Application..."

# Start the backend server
echo "Starting backend server on port 5000..."
cd api && npm start &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start the frontend React app
echo "Starting frontend React app on port 3000..."
cd ./frontend && npm start &
FRONTEND_PID=$!

echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Application started successfully!"
echo "Backend API: http://localhost:5000"
echo "Frontend App: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup when script is terminated
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

# Set trap to cleanup on script termination
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait