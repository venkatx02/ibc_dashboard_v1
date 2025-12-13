import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/ibc_dashboard_v1/'  // Must have trailing slash!
})