import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  style: {
    postcss: {
      plugins: [
        // Aquí podrías añadir otros plugins de PostCSS si lo necesitas
      ],
    },
  },
});
