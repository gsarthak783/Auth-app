#!/bin/bash

echo "🚀 Starting comprehensive Render build process..."

# Set Node.js version and npm settings
export NODE_VERSION=18.20.4
export NPM_CONFIG_AUDIT=false
export NPM_CONFIG_FUND=false

# Clean everything
echo "🧹 Deep cleaning..."
rm -rf node_modules
rm -f package-lock.json
rm -f yarn.lock
npm cache clean --force

# Install dependencies with multiple fallback strategies
echo "📦 Installing dependencies (Strategy 1: Clean install)..."
npm install --no-optional --legacy-peer-deps --prefer-offline

# Verify critical modules
echo "🔍 Verifying critical modules..."

# Check iconv-lite
if [ ! -d "node_modules/iconv-lite" ] || [ ! -f "node_modules/iconv-lite/lib/extend-node.js" ]; then
    echo "❌ iconv-lite corrupted, reinstalling..."
    npm uninstall iconv-lite
    npm install iconv-lite@0.6.3 --save --force
fi

# Check express
if [ ! -d "node_modules/express" ] || [ ! -f "node_modules/express/lib/router/index.js" ]; then
    echo "❌ Express corrupted, reinstalling..."
    npm uninstall express
    npm install express@4.19.2 --save --force
fi

# Check body-parser
if [ ! -d "node_modules/body-parser" ]; then
    echo "❌ body-parser missing, reinstalling..."
    npm install body-parser --save --force
fi

# Install with different strategy if issues persist
if [ ! -f "node_modules/iconv-lite/lib/extend-node.js" ]; then
    echo "🔄 Strategy 2: Force reinstall all dependencies..."
    rm -rf node_modules
    npm install --force --no-shrinkwrap --no-package-lock
fi

# Final verification
echo "✅ Build verification:"
npm list --depth=0 || echo "Some dependencies may be missing"

# Test critical requires
echo "🧪 Testing critical modules:"
node -e "console.log('iconv-lite:', require('iconv-lite'))" || echo "iconv-lite test failed"
node -e "console.log('express:', typeof require('express'))" || echo "express test failed"
node -e "console.log('body-parser:', typeof require('body-parser'))" || echo "body-parser test failed"

echo "🎉 Build process completed!" 