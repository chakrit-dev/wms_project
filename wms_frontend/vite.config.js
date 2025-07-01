import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config(); // ✅ โหลดตัวแปร env เช่น VITE_API_BASE_URL

export default defineConfig({
  plugins: [react()],
  base: '/', // ✅ ถ้า deploy บน Azure Static Web App ให้ใช้ root path
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    fs: {
      strict: false,
    },
  },
});
