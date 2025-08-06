#!/bin/bash

# Deployment script for Render
echo "🚀 Starting deployment..."

# Clean install to prevent module corruption
echo "🧹 Cleaning previous installations..."
rm -rf node_modules
rm -f package-lock.json

echo "📦 Installing dependencies..."
npm install --production=false

echo "🔍 Verifying Express installation..."
if [ ! -d "node_modules/express" ]; then
    echo "❌ Express not found, retrying..."
    npm install express@^4.19.2 --save
fi

echo "✅ Deployment preparation complete!"
echo "🌐 Starting server..." 