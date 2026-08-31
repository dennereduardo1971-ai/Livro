import { defineConfig } from 'astro/config';
import { remarkCena } from './src/plugins/cena.mjs';
import { remarkGlossario } from './src/plugins/glossario.mjs';
import { GLOSSARIO } from './src/dados/glossario';

export default defineConfig({
  site: 'https://casa-do-cais.netlify.app',
  markdown: {
    remarkPlugins: [remarkCena, [remarkGlossario, GLOSSARIO]],
    smartypants: false,
  },
  devToolbar: { enabled: false },
});
