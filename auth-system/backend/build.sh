#!/bin/bash

echo "🚀 Starting Render build process..."

# Set Node.js version
export NODE_VERSION=18.20.4

# Clean previous installations
echo "🧹 Cleaning previous installations..."
rm -rf node_modules
rm -f package-lock.json

# Install dependencies
echo "📦 Installing dependencies..."
npm install --no-optional --legacy-peer-deps

# Verify Express installation
echo "🔍 Verifying Express installation..."
if [ ! -d "node_modules/express" ]; then
    echo "❌ Express not found, installing separately..."
    npm install express@4.19.2 --save --no-optional
fi

# Check if router module exists
if [ ! -f "node_modules/express/lib/router/index.js" ]; then
    echo "❌ Express router missing, reinstalling Express..."
    npm uninstall express
    npm install express@4.19.2 --save --no-optional --force
fi

# List Express files for debugging
echo "📋 Express installation check:"
ls -la node_modules/express/lib/ || echo "Express lib directory not found"

# Final verification
echo "✅ Build verification:"
npm list express
node -e "console.log('Express test:', require('express'))" || echo "Express require failed"

echo "🎉 Build process completed!" 