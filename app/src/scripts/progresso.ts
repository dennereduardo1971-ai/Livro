/**
 * v1 guarda tudo no aparelho. Uma única regra rege o resto do app:
 * o site só mostra o que o leitor já leu.
 */
const CHAVE_PROGRESSO = 'cais:progresso';
const CHAVE_MARCADOR = 'cais:marcador';
const CHAVE_VISITA = 'cais:ultima-visita';
const CHAVE_TEMA = 'cais:tema';
const CHAVE_FONTE = 'cais:fonte';

const numero = (v: string | null, padrao: number) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : padrao;
};

const seguro = <T>(f: () => T, padrao: T): T => {
  try { return f(); } catch { return padrao; }
};

export const progresso = {
  /** último capítulo concluído */
  ler: () => seguro(() => numero(localStorage.getItem(CHAVE_PROGRESSO), 0), 0),
  concluir(capitulo: number) {
    seguro(() => {
      if (capitulo > this.ler()) localStorage.setItem(CHAVE_PROGRESSO, String(capitulo));
    }, undefined);
  },
  definir: (capitulo: number) =>
    seguro(() => localStorage.setItem(CHAVE_PROGRESSO, String(Math.max(0, capitulo))), undefined),
  esquecer: () => seguro(() => localStorage.removeItem(CHAVE_PROGRESSO), undefined),
};

export const marcador = {
  guardar: (slug: string, fracao: number) =>
    seguro(() => localStorage.setItem(`${CHAVE_MARCADOR}:${slug}`, fracao.toFixed(4)), undefined),
  ler: (slug: string) => seguro(() => numero(localStorage.getItem(`${CHAVE_MARCADOR}:${slug}`), 0), 0),
  ultimo: () =>
    seguro(() => {
      let melhor: { slug: string; fracao: number } | null = null;
      for (let i = 0; i < localStorage.length; i++) {
        const chave = localStorage.key(i);
        if (!chave?.startsWith(`${CHAVE_MARCADOR}:`)) continue;
        const slug = chave.slice(CHAVE_MARCADOR.length + 1);
        const fracao = numero(localStorage.getItem(chave), 0);
        const n = Number(slug.split('-')[1] ?? 0);
        if (!melhor || n > Number(melhor.slug.split('-')[1] ?? 0)) melhor = { slug, fracao };
      }
      return melhor;
    }, null),
};

export const visita = {
  ler: () => seguro(() => numero(localStorage.getItem(CHAVE_VISITA), 0), 0),
  registrar: () => seguro(() => localStorage.setItem(CHAVE_VISITA, String(Date.now())), undefined),
};

export type Tema = 'claro' | 'escuro' | 'vela';

export const tema = {
  ler: (): Tema => seguro(() => (localStorage.getItem(CHAVE_TEMA) as Tema) || 'claro', 'claro'),
  aplicar(t: Tema) {
    document.documentElement.dataset.tema = t;
    seguro(() => localStorage.setItem(CHAVE_TEMA, t), undefined);
  },
};

export const fonte = {
  ler: () => seguro(() => numero(localStorage.getItem(CHAVE_FONTE), 18), 18),
  aplicar(px: number) {
    const v = Math.min(26, Math.max(15, px));
    document.documentElement.style.setProperty('--tamanho-leitura', `${v}px`);
    seguro(() => localStorage.setItem(CHAVE_FONTE, String(v)), undefined);
    return v;
  },
};
