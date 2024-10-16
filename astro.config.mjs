import { defineConfig } from 'astro/config';
import AstroPWA from '@vite-pwa/astro';
import icon from 'astro-icon';

export default defineConfig({
  vite: {
    logLevel: 'info',
    server: {
      fs: {
        allow: ['../..']
      }
    },
  },
  integrations: [AstroPWA({
    mode: 'production',
    base: '/',
    scope: '/',
    includeAssets: ['favicon.svg', 'robots.txt'], // Añadir archivos estáticos adicionales
    registerType: 'autoUpdate',
    manifest: {
      name: 'Libro del peregrino',
      short_name: 'Guadalupe',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
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
          purpose: 'any maskable',
        },
      ],
    },
    workbox: {
      navigateFallback: '/index.html',  // Asegúrate de que este archivo esté en caché
      globPatterns: ['**/*.{css,js,html,svg,png,ico,txt,jpg,jpeg}'],
      runtimeCaching: [
        {
          urlPattern: /^https?.*\.(?:png|jpg|jpeg|svg|gif|css|js)$/,
          handler: 'CacheFirst',  // CacheFirst está bien para recursos estáticos
          options: {
            cacheName: 'static-resources',
            expiration: {
              maxEntries: 60,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
            },
          },
        },
        {
          urlPattern: /\/$/,  // Asegúrate de cachear la página principal y navegación
          handler: 'NetworkFirst',  // La primera vez intenta con la red, luego desde caché
          options: {
            cacheName: 'html-pages',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 7 * 24 * 60 * 60, // 7 días para páginas HTML
            },
          },
        },
      ],
    },
    devOptions: {
      enabled: true,
      navigateFallbackAllowlist: [/^\//],
    },
  }), icon()],
});
