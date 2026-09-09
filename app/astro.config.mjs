import { defineConfig } from 'astro/config';
import { remarkCena } from './src/plugins/cena.mjs';

export default defineConfig({
  site: 'https://dennereduardo1971-ai.github.io',
  base: '/Livro',
  markdown: {
    remarkPlugins: [remarkCena],
    smartypants: false,
  },
  devToolbar: { enabled: false },
});
