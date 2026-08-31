import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

/** O painel se alimenta do repositório, sem trabalho manual. */
export interface EstadoCapitulo {
  numero: number;
  status: 'rascunho' | 'em revisão' | 'publicado';
  notas: number;
  ultimoCommit: string;
}

const git = (comando: string) => {
  try {
    return execSync(comando, { cwd: '..', encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
};

export function notasPorCapitulo(): Map<number, number> {
  const mapa = new Map<number, number>();
  try {
    const texto = readFileSync('../revisao/notas-por-capitulo.md', 'utf8');
    for (const [, n] of texto.matchAll(/^##\s+Cap[íi]tulo\s+(\d+)/gm)) {
      const numero = Number(n);
      mapa.set(numero, (mapa.get(numero) ?? 0) + 1);
    }
  } catch {}
  return mapa;
}

export function estadoDoCapitulo(numero: number, notas: number): EstadoCapitulo {
  const arquivo = `manuscrito/livro-01/capitulo-0${numero}.md`;
  const ultimoCommit = git(`git log -1 --format=%cs -- ${arquivo}`);
  const status: EstadoCapitulo['status'] = notas >= 2 ? 'publicado' : notas === 1 ? 'em revisão' : 'rascunho';
  return { numero, status, notas, ultimoCommit };
}

export function ultimaAtualizacao(): string {
  return git('git log -1 --format=%cs') || '—';
}

export function ultimosCommits(n = 6): { data: string; assunto: string }[] {
  return git(`git log -${n} --format=%cs%x09%s`)
    .split('\n')
    .filter(Boolean)
    .map((linha) => {
      const [data, ...resto] = linha.split('\t');
      return { data, assunto: resto.join(' ') };
    });
}
