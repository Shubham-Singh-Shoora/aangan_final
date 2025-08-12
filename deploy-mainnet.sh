#!/bin/bash

# Aangan Deployment Script
# This script helps deploy Aangan to the Internet Computer mainnet with proper Internet Identity integration

echo "🚀 Aangan Deployment Script"
echo "================================"

# Check if dfx is installed
if ! command -v dfx &> /dev/null; then
    echo "❌ dfx is not installed. Please install dfx first: https://internetcomputer.org/docs/current/developer-docs/setup/install/"
    exit 1
fi

# Check if user is logged in to dfx
if ! dfx identity get-principal &> /dev/null; then
    echo "❌ Not logged in to dfx. Please run 'dfx identity new <name>' and 'dfx identity use <name>' first"
    exit 1
fi

echo "✅ dfx is installed and you are logged in"

# Switch to ic network
echo "🌐 Switching to IC network..."
dfx --network ic identity get-principal

# Deploy to mainnet
echo "📦 Deploying backend canister to IC mainnet..."
dfx deploy --network ic Aangan_backend

# Get the backend canister ID
BACKEND_CANISTER_ID=$(dfx canister --network ic id Aangan_backend)
echo "✅ Backend deployed with ID: $BACKEND_CANISTER_ID"

# Update environment variables
echo "🔧 Updating environment variables..."
echo "CANISTER_ID_AANGAN_BACKEND=$BACKEND_CANISTER_ID" > src/Aangan_frontend/.env.local
echo "DFX_NETWORK=ic" >> src/Aangan_frontend/.env.local
echo "CANISTER_ID_INTERNET_IDENTITY=rdmx6-jaaaa-aaaaa-aaadq-cai" >> src/Aangan_frontend/.env.local

# Build frontend
echo "🏗️  Building frontend..."
cd src/Aangan_frontend
npm run build
cd ../..

# Deploy frontend
echo "🌐 Deploying frontend to IC mainnet..."
dfx deploy --network ic Aangan_frontend

# Get the frontend canister ID
FRONTEND_CANISTER_ID=$(dfx canister --network ic id Aangan_frontend)
echo "✅ Frontend deployed with ID: $FRONTEND_CANISTER_ID"

echo ""
echo "🎉 Deployment completed successfully!"
echo "================================"
echo "Backend Canister ID: $BACKEND_CANISTER_ID"
echo "Frontend Canister ID: $FRONTEND_CANISTER_ID"
echo ""
echo "🌍 Your app is live at:"
echo "https://$FRONTEND_CANISTER_ID.ic0.app"
echo ""
echo "🔐 Internet Identity: https://identity.ic0.app"
echo ""
echo "⚠️  Note: Make sure to update your frontend environment variables with the backend canister ID"
echo "   and redeploy if you haven't already done so."
