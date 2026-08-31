/**
 * Liga ao glossário os termos que aparecem no corpo do capítulo. Cada
 * ocorrência vira um botão discreto; o painel com a definição é montado
 * na página de leitura.
 *
 * Duas regras governam o que é ligado:
 *
 * 1. Spoiler — um termo só vira botão em capítulos a partir daquele em
 *    que ele se revela. Quem lê o Capítulo 2 não clica em "o Frio".
 * 2. Ruído — uma ocorrência por seção (`##`). Sublinhar as trinta
 *    aparições de "Bento" transformaria a página num formulário.
 */
const NUMERO_DO_CAPITULO = /capitulo-(\d+)/;
const ARTIGO = /^[ao]\s+/i;

const escapar = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** o núcleo do termo, sem o artigo: "a Mansa" procura por "Mansa" */
function padrao(termo) {
  const nucleo = termo.replace(ARTIGO, '');
  const [primeira, ...resto] = nucleo;
  const inicio =
    primeira.toLowerCase() === primeira.toUpperCase()
      ? escapar(primeira)
      : `[${escapar(primeira.toUpperCase())}${escapar(primeira.toLowerCase())}]`;
  /* o corpo do capítulo vem quebrado em linhas de 72 colunas: entre uma
     palavra e a seguinte pode haver \n em vez de espaço */
  const corpo = escapar(resto.join('')).replace(/\\?\s+/g, '\\s+');
  return new RegExp(`(?<![\\p{L}\\p{M}])${inicio}${corpo}(?![\\p{L}\\p{M}])`, 'u');
}

export function remarkGlossario(glossario) {
  /* termos longos primeiro: "Vitorino Cerqueira" antes de qualquer "Vitorino" */
  const termos = [...glossario]
    .sort((a, b) => b.termo.length - a.termo.length)
    .map((t) => ({ ...t, padrao: padrao(t.termo) }));

  return (arvore, arquivo) => {
    const caminho = arquivo?.history?.[0] ?? arquivo?.path ?? '';
    const capitulo = Number(NUMERO_DO_CAPITULO.exec(caminho)?.[1] ?? 0);
    if (!capitulo) return;

    const disponiveis = termos.filter((t) => t.revelaEm <= capitulo);
    if (!disponiveis.length) return;

    /* uma vez por seção; o `##` seguinte reabre todos */
    let usados = new Set();

    const quebrar = (no) => {
      for (const termo of disponiveis) {
        if (usados.has(termo.id)) continue;
        const achado = termo.padrao.exec(no.value);
        if (!achado) continue;
        usados.add(termo.id);
        const antes = no.value.slice(0, achado.index);
        const depois = no.value.slice(achado.index + achado[0].length);
        const botao = {
          type: 'html',
          value:
            `<button type="button" class="termo" data-termo="${termo.id}"` +
            ` aria-label="O que é ${termo.termo}?">${achado[0]}</button>`,
        };
        return [...(antes ? quebrar({ type: 'text', value: antes }) : []), botao,
          ...(depois ? quebrar({ type: 'text', value: depois }) : [])];
      }
      return [no];
    };

    /* sempre para a frente: a ocorrência marcada é a primeira que se lê */
    const visitar = (no) => {
      if (!no.children) return;
      for (let i = 0; i < no.children.length; i++) {
        const filho = no.children[i];
        /* nada de mexer em link, código ou no que já é html */
        if (filho.type === 'link' || filho.type === 'inlineCode' || filho.type === 'code' || filho.type === 'html') continue;
        if (filho.type === 'text') {
          /* o nó inteiro pode virar um botão só — em *Boa Hora*, por exemplo */
          const partes = quebrar(filho);
          if (partes[0] !== filho) {
            no.children.splice(i, 1, ...partes);
            i += partes.length - 1;
          }
          continue;
        }
        visitar(filho);
      }
    };

    for (const bloco of arvore.children ?? []) {
      if (bloco.type === 'heading') {
        if (bloco.depth === 2) usados = new Set();
        continue;
      }
      visitar(bloco);
    }
  };
}
