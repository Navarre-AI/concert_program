import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    svelte(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Concert Program',
        short_name: 'Program',
        description: 'Live concert program with lyrics',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#1a1a2e',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /\/api\/concerts\/.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'concert-data',
              expiration: { maxEntries: 20, maxAgeSeconds: 86400 }
            }
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
});
