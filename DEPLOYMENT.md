# Aangan Deployment Guide

## Setting Up Canister IDs

To fix the "Canister ID is required" error, you need to set the backend canister ID in your environment variables.

### Option 1: Using DFX (Recommended)

1. **Deploy your backend canister:**
   ```bash
   cd /mnt/d/BlockDev/Aangan
   dfx deploy Aangan_backend --network ic
   ```

2. **Get your canister ID:**
   ```bash
   dfx canister id Aangan_backend --network ic
   ```

3. **Update your .env file:**
   Edit `/mnt/d/BlockDev/Aangan/src/Aangan_frontend/.env` and add:
   ```
   VITE_CANISTER_ID_AANGAN_BACKEND=your-actual-canister-id-here
   ```

### Option 2: Manual Configuration

If you already have a deployed canister, you can manually set the canister ID:

1. **Find your canister ID** from your dfx deployment logs or dfx.json
2. **Update the .env file** as shown above

### For Local Development

If you want to test locally:

1. **Start local replica:**
   ```bash
   dfx start --clean
   ```

2. **Deploy locally:**
   ```bash
   dfx deploy
   ```

3. **Update .env for local:**
   ```
   VITE_CANISTER_ID_AANGAN_BACKEND=your-local-canister-id
   VITE_DFX_NETWORK=local
   VITE_HOST=http://localhost:4943
   ```

### Restart Development Server

After updating the .env file, restart your development server:
```bash
cd src/Aangan_frontend
npm run dev
```

## Troubleshooting

- **"global is not defined"**: Fixed with Vite configuration updates
- **"Unable to fetch root key"**: Only affects local development, not production
- **"Canister ID is required"**: Set VITE_CANISTER_ID_AANGAN_BACKEND in .env file

## Internet Identity Integration

The app is configured to use mainnet Internet Identity (`rdmx6-jaaaa-aaaaa-aaadq-cai`) for reliable authentication, even in development. This ensures:

- ✅ Consistent authentication experience
- ✅ No local Internet Identity setup required
- ✅ Works across different environments

Your users can create Internet Identity accounts at: https://identity.ic0.app
