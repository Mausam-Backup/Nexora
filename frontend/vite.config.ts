import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  root: process.cwd(),
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  server: {
    host: "0.0.0.0",
    port: 5000,
    hmr: {
      port: 5000,
    },
    allowedHosts: true,
    cors: true,
  },
  envPrefix: ['VITE_', 'SUPABASE_'],
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(
      process.env.VITE_SUPABASE_URL ||
      process.env.SUPABASE_URL ||
      'https://nyfcwrctaijipmaqozes.supabase.co'
    ),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(
      process.env.VITE_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55ZmN3cmN0YWlqaXBtYXFvemVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1NDgyMjcsImV4cCI6MjEwNDEyNDIyN30.xq6MMy-lHASOy_8SRz-8HniH2jp-MJuUEbrKxvRws-4'
    ),
  },
  plugins: [
    react(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));