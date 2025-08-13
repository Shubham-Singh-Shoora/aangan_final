#!/bin/bash

echo "🛑 Stopping DFX..."
dfx stop

echo "🧹 Cleaning up old state..."
rm -rf .dfx/local

echo "🚀 Starting DFX with clean state..."
dfx start --clean --background

echo "⏳ Waiting for DFX to be ready..."
sleep 5

echo "📦 Deploying all canisters..."
dfx deploy

echo "✅ DFX restart complete!"
echo "Backend Canister ID: $(dfx canister id Aangan_backend)"
echo "Frontend URL: http://localhost:4943/?canisterId=$(dfx canister id Aangan_frontend)"
