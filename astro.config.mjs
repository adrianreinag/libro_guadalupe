// @ts-check
import { defineConfig } from "astro/config";
import AstroPWA from "@vite-pwa/astro";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

import solidJs from "@astrojs/solid-js";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    react(),
    AstroPWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Libro del peregrino',
        short_name: 'Libro',
        // ...otras opciones del manifiesto
      },
      workbox: {
        // Opciones de Workbox, como estrategias de caché
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'] // Incluye todos los tipos de archivos necesarios
      },
    }),
    solidJs()],
});
