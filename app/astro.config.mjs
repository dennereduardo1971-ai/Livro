import { defineConfig } from 'astro/config';
import { remarkCena } from './src/plugins/cena.mjs';

export default defineConfig({
  site: 'https://casa-do-cais.netlify.app',
  markdown: {
    remarkPlugins: [remarkCena],
    smartypants: false,
  },
  devToolbar: { enabled: false },
});
