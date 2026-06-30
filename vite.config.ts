import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/rexsmp-website/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.svg'],
      manifest: {
        name: 'RexNotes',
        short_name: 'RexNotes',
        description: 'RexNotes — customizable Obsidian-style notes',
        theme_color: '#1a0c0c',
        background_color: '#120808',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/rexsmp-website/',
        icons: [
          {
            src: 'apple-touch-icon.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: 'apple-touch-icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
  },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
    }),
  ],
  server: {
    host: true,
    port: 5173,
  },
})
