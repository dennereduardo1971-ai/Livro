import { defineConfig } from 'astro/config';
import { remarkCena } from './src/plugins/cena.mjs';
import { remarkGlossario } from './src/plugins/glossario.mjs';
import { GLOSSARIO } from './src/dados/glossario';

export default defineConfig({
  site: 'https://dennereduardo1971-ai.github.io',
  base: '/Livro',
  markdown: {
    remarkPlugins: [remarkCena, [remarkGlossario, GLOSSARIO]],
    smartypants: false,
  },
  devToolbar: { enabled: false },
});
