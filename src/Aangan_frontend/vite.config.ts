import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  envDir: path.resolve(__dirname, "../../"), // Use root directory for .env files
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    global: 'globalThis',
    'process.env': {
      NODE_ENV: JSON.stringify(mode),
      DFX_NETWORK: JSON.stringify(process.env.VITE_DFX_NETWORK || 'ic'),
      CANISTER_ID_AANGAN_BACKEND: JSON.stringify(process.env.VITE_CANISTER_ID_AANGAN_BACKEND),
      CANISTER_ID_INTERNET_IDENTITY: JSON.stringify(process.env.VITE_CANISTER_ID_INTERNET_IDENTITY || 'rdmx6-jaaaa-aaaaa-aaadq-cai'),
    },
  },
  optimizeDeps: {
    include: ["@dfinity/agent", "@dfinity/candid", "@dfinity/principal"],
  },
}));
