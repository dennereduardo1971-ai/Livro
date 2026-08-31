import { getCollection, type CollectionEntry } from 'astro:content';

export interface Capitulo {
  entrada: CollectionEntry<'capitulos'>;
  numero: number;
  slug: string;
  titulo: string;
  partes: string[];
  palavras: number;
}

const NUMERO = /capitulo-(\d+)/;

export async function listarCapitulos(): Promise<Capitulo[]> {
  const entradas = await getCollection('capitulos');
  return entradas
    .map((entrada) => {
      const numero = Number(NUMERO.exec(entrada.id)?.[1] ?? 0);
      const corpo = entrada.body ?? '';
      const partes = [...corpo.matchAll(/^##\s+[IVX]+\.\s+(.+)$/gm)].map((m) => m[1].trim());
      return {
        entrada,
        numero,
        slug: `capitulo-${numero}`,
        titulo: `Capítulo ${numero}`,
        partes,
        palavras: corpo.split(/\s+/).filter(Boolean).length,
      };
    })
    .sort((a, b) => a.numero - b.numero);
}
