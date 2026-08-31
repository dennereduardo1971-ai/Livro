import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Os capítulos não são copiados para dentro do app: o site lê
 * /manuscrito/ direto. Só existe uma cópia de cada capítulo no mundo.
 */
const capitulos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: '../manuscrito/livro-01' }),
  schema: z.object({}).passthrough(),
});

export const collections = { capitulos };
