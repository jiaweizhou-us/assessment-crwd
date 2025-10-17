#!/bin/bash

# CRWD Development Startup Script
echo "🚀 Starting CRWD Development Environment..."

# Start backend server
echo "📦 Starting backend server..."
cd api
npm start &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo "🌐 Starting frontend server..."
cd ../frontend
npm start &
FRONTEND_PID=$!

# Wait for both servers to start
sleep 3

echo "✅ Development environment started!"
echo "📊 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:5000"
echo ""
echo "Test Login Credentials:"
echo "👤 Regular User: user1 / password123"
echo "👤 Regular User: user2 / password123"
echo "🔐 Admin User: admin / password123"
echo ""
echo "Press Ctrl+C to stop both servers..."

# Keep script running and handle Ctrl+C
trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait