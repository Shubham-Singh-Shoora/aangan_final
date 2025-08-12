// Simple test script to check environment variables
console.log('🔍 Environment Variables Check:');
console.log('VITE_CANISTER_ID_AANGAN_BACKEND:', import.meta.env.VITE_CANISTER_ID_AANGAN_BACKEND);
console.log('VITE_CANISTER_ID_INTERNET_IDENTITY:', import.meta.env.VITE_CANISTER_ID_INTERNET_IDENTITY);
console.log('VITE_DFX_NETWORK:', import.meta.env.VITE_DFX_NETWORK);
console.log('VITE_HOST:', import.meta.env.VITE_HOST);

// Test if canister ID is properly set
if (import.meta.env.VITE_CANISTER_ID_AANGAN_BACKEND) {
    console.log('✅ Backend canister ID is set');
} else {
    console.error('❌ Backend canister ID is not set');
}

export { };
