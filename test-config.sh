#!/bin/bash

# Test script to verify Internet Identity integration is working

echo "🔍 Checking Aangan configuration..."
echo ""

# Check if .env file exists and has required variables
if [ -f "/mnt/d/BlockDev/Aangan/src/Aangan_frontend/.env" ]; then
    echo "✅ .env file found"
    echo "📋 Environment variables:"
    cat /mnt/d/BlockDev/Aangan/src/Aangan_frontend/.env | grep -E "^VITE_" | while read line; do
        echo "   $line"
    done
else
    echo "❌ .env file not found"
fi

echo ""

# Check if dfx is running
if pgrep -f "dfx start" > /dev/null; then
    echo "✅ DFX replica is running"
else
    echo "❌ DFX replica is not running"
    echo "💡 Run: dfx start --background"
fi

echo ""

# Check if backend canister is deployed
CANISTER_ID=$(dfx canister id Aangan_backend 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ Backend canister deployed: $CANISTER_ID"
else
    echo "❌ Backend canister not deployed"
    echo "💡 Run: dfx deploy Aangan_backend"
fi

echo ""

# Check if Internet Identity is accessible
echo "🌐 Checking Internet Identity connectivity..."
curl -s --max-time 5 "https://identity.ic0.app" > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Internet Identity is accessible"
else
    echo "⚠️  Internet Identity might not be accessible (check internet connection)"
fi

echo ""
echo "🎯 Next steps:"
echo "1. Start development server: cd src/Aangan_frontend && npm run dev"
echo "2. Open browser to: http://localhost:8080"
echo "3. Click 'Login with Internet Identity'"
echo "4. If errors persist, check browser console for detailed error messages"
