/* O site vive em https://<usuario>.github.io/Livro/, e não na raiz do domínio.
   Todo link interno passa por aqui pra não quebrar quando o prefixo mudar. */
export const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

/** Caminho interno já com o prefixo do site. u('/capitulos') → '/Livro/capitulos' */
export const u = (caminho: string) => `${BASE}/${String(caminho).replace(/^\/+/, '')}` || '/';

/** O contrário: tira o prefixo pra comparar com rota conhecida. */
export const semBase = (caminho: string) =>
  BASE && caminho.startsWith(BASE) ? caminho.slice(BASE.length) || '/' : caminho;
