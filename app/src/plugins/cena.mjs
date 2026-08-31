/**
 * Lê as diretivas `::cena` do markdown e as transforma em âncoras
 * invisíveis no HTML. A diretiva some da página; sobra um alvo para o
 * IntersectionObserver mover o brilho do mapa.
 *
 *   ::cena lugar="a-fileira" tensao="media" tempo="agora" revela="o-poco"
 */
const ATRIBUTO = /([a-z]+)\s*=\s*"([^"]*)"/g;

export function remarkCena() {
  return (arvore, arquivo) => {
    let n = 0;
    const visitar = (no, pai, indice) => {
      if (no.type === 'paragraph' && no.children?.[0]?.type === 'text') {
        const bruto = no.children.map((f) => f.value ?? '').join('');
        if (bruto.trimStart().startsWith('::cena')) {
          const atributos = {};
          for (const [, chave, valor] of bruto.matchAll(ATRIBUTO)) atributos[chave] = valor;
          const id = `cena-${++n}`;
          const dados = [
            `data-lugar="${atributos.lugar ?? ''}"`,
            `data-tensao="${atributos.tensao ?? 'media'}"`,
            `data-tempo="${atributos.tempo ?? 'agora'}"`,
            atributos.revela ? `data-revela="${atributos.revela}"` : '',
          ]
            .filter(Boolean)
            .join(' ');
          pai.children[indice] = {
            type: 'html',
            value: `<span class="ancora-cena" id="${id}" ${dados} aria-hidden="true"></span>`,
          };
          return;
        }
      }
      if (no.children) {
        for (let i = no.children.length - 1; i >= 0; i--) visitar(no.children[i], no, i);
      }
    };
    visitar(arvore, null, -1);
    if (arquivo?.data) arquivo.data.cenas = n;
  };
}
