#!/bin/bash

echo "🚀 Preparing CRWD Platform for Vercel Deployment..."

# Check if we're in the right directory
if [ ! -f "vercel.json" ]; then
    echo "❌ Error: vercel.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm run install:all

# Test frontend build
echo "🔨 Testing frontend build..."
cd frontend
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful!"
else
    echo "❌ Frontend build failed!"
    exit 1
fi

cd ..

# Test API structure
echo "🔧 Checking API structure..."
if [ -f "api/index.js" ]; then
    echo "✅ API entry point found"
else
    echo "❌ API entry point missing"
    exit 1
fi

echo ""
echo "🎉 Pre-deployment checks completed successfully!"
echo ""
echo "Next steps:"
echo "1. Make sure your code is committed to Git"
echo "2. Run 'vercel' for preview deployment"
echo "3. Run 'vercel --prod' for production deployment"
echo ""
echo "Test credentials for deployed app:"
echo "👤 Regular Users: user1/user2 with password123"
echo "🔐 Admin User: admin with password123"