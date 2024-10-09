import { defineConfig } from 'astro/config';
import AstroPWA from '@vite-pwa/astro';

import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  vite: {
    logLevel: 'info',
    server: {
      fs: {
        // Allow serving files from hoisted root node_modules
        allow: ['../..']
      }
    },
  },
  integrations: [AstroPWA({
    mode: 'production',  // Cambiar a producción para pruebas en dispositivos
    base: '/',
    scope: '/',
    includeAssets: ['favicon.svg'],
    registerType: 'autoUpdate',
    manifest: {
      name: 'Libro del peregrino',
      short_name: 'Guadalupe',
      theme_color: '#ffffff',
      background_color: '#ffffff', // Añadir color de fondo
      display: 'standalone', // Importante para la instalación
      orientation: 'portrait', // Opcional, ajustar según necesidad
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },
    workbox: {
      navigateFallback: '/index.html', // Asegúrate de tener un index.html
      globPatterns: ['**/*.{css,js,html,svg,png,ico,txt,jpg,jpeg}'], // Añadir otros tipos de archivos si es necesario
      runtimeCaching: [
        {
          urlPattern: /^https?:.*\.(?:png|jpg|jpeg|svg|gif|css|js)$/, // Cachear archivos estáticos
          handler: 'CacheFirst',
          options: {
            cacheName: 'static-resources',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
            },
          },
        },
      ],
    },
    devOptions: {
      enabled: true,
      navigateFallbackAllowlist: [/^\//],
    },
    experimental: {
      directoryAndTrailingSlashHandler: true,
    }
  }), icon()],
});