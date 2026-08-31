/**
 * Gera uma versão de página única do site, para leitura e teste rápido
 * fora da hospedagem. Reaproveita o HTML e o CSS já construídos em dist/.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { LUGARES, RIO } from '/tmp/lugares.mjs';

const ler = (p) => readFileSync(`dist/${p}`, 'utf8');
/** extrai um elemento inteiro contando profundidade de tags — sem chutar o fim */
const extrair = (html, abre, tag) => {
  const inicio = html.indexOf(abre);
  if (inicio < 0) return '';
  const re = new RegExp(`<${tag}(\\s|>)|</${tag}>`, 'g');
  re.lastIndex = inicio;
  let profundidade = 0;
  let m;
  while ((m = re.exec(html))) {
    if (m[0].startsWith('</')) {
      profundidade--;
      if (profundidade === 0) return html.slice(inicio, m.index + m[0].length);
    } else profundidade++;
  }
  return '';
};

const paginas = ['index.html', 'capitulo-1/index.html', 'capitulo-2/index.html',
  'capitulo-3/index.html', 'capitulo-4/index.html', 'capitulo-5/index.html',
  'capitulos/index.html', 'glossario/index.html', 'linha-do-tempo/index.html', 'estado/index.html'];

/* o Astro embute folhas pequenas na própria página e emite as maiores em _astro */
const vistos = new Set();
const cssEmbutido = paginas
  .flatMap((p) => [...ler(p).matchAll(/<style>([\s\S]*?)<\/style>/g)].map((m) => m[1]))
  .filter((bloco) => (vistos.has(bloco) ? false : vistos.add(bloco)))
  .join('\n');
const cssArquivos = readdirSync('dist/_astro')
  .filter((f) => f.endsWith('.css'))
  .map((f) => readFileSync(`dist/_astro/${f}`, 'utf8'))
  .join('\n');
const css = cssArquivos + '\n' + cssEmbutido;

const capitulos = [1, 2, 3, 4, 5].map((n) => ({
  numero: n,
  artigo: extrair(ler(`capitulo-${n}/index.html`), '<article', 'article'),
}));

const indexHtml = ler('index.html');
const mapaCompleto = extrair(indexHtml, '<div class="mapa"', 'div');
const cromoLeitor = ler('capitulo-1/index.html');
const barraProgresso = extrair(cromoLeitor, '<div class="progresso"', 'div');
const painelTipografia = extrair(cromoLeitor, '<div id="painel-tipografia"', 'div');
const aviso = extrair(cromoLeitor, '<aside class="aviso', 'aside');
const botaoMapa = extrair(cromoLeitor, '<button id="abrir-mapa"', 'button');
const glossario = extrair(ler('glossario/index.html'), '<main', 'main');
const tempo = extrair(ler('linha-do-tempo/index.html'), '<main', 'main');
const estado = extrair(ler('estado/index.html'), '<main', 'main');

for (const [nome, valor] of Object.entries({ mapaCompleto, barraProgresso, painelTipografia, aviso, botaoMapa, glossario, tempo, estado })) {
  if (!valor) throw new Error(`não consegui extrair: ${nome}`);
}
for (const c of capitulos) if (!c.artigo) throw new Error(`capítulo ${c.numero} sem artigo`);

const runtime = readFileSync('artefato/runtime.js', 'utf8')
  .replace('__LUGARES__', JSON.stringify(LUGARES))
  .replace('__RIO__', JSON.stringify(RIO))
  .replace('__CAPITULOS__', JSON.stringify(capitulos.map((c) => c.numero)));

const secoes = `
<section data-rota="mapa"><div class="envoltorio">${mapaCompleto}<p class="dica subtitulo">Toque num lugar da parede. O que estiver apagado, você ainda não leu.</p></div></section>
<section data-rota="capitulos" hidden>
  <div class="envoltorio">
    <h1>Capítulos</h1>
    <p class="subtitulo">Publicação semanal. O mapa acompanha o que você já leu.</p>
    <ul class="lista-capitulos">
      ${capitulos.map((c) => `<li class="cartao"><button data-abrir="${c.numero}"><span class="titulo-cap">Capítulo ${c.numero}</span><span class="selo estado-leitura" data-numero="${c.numero}">não lido</span></button></li>`).join('')}
    </ul>
  </div>
</section>
<section data-rota="leitor" hidden>
  ${barraProgresso}
  ${painelTipografia}
  ${aviso}
  <main class="leitura" data-numero="1">
    <div id="corpo-capitulo">${capitulos[0].artigo}</div>
    <nav class="fim">
      <button id="cap-anterior">‹ anterior</button>
      <button id="cap-proximo">próximo ›</button>
    </nav>
  </main>
  ${botaoMapa}
  <div id="gaveta-mapa" hidden>
    <button class="fechar-gaveta" aria-label="Fechar mapa">✕</button>
    ${mapaCompleto}
  </div>
</section>
<section data-rota="glossario" hidden>${glossario}</section>
<section data-rota="tempo" hidden>${tempo}</section>
<section data-rota="estado" hidden>${estado}</section>
`;

const artigos = capitulos
  .map((c) => `<template data-capitulo="${c.numero}">${c.artigo}</template>`)
  .join('\n');

const html = `<title>A Casa do Cais</title>
<style>
${css}
.lista-capitulos { list-style: none; padding: 0; margin: 1.5rem 0 0; display: grid; gap: 0.7rem; }
.lista-capitulos button { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 1rem; background: none; border: 0; padding: 0; color: inherit; cursor: pointer; font: inherit; }
.titulo-cap { font-family: var(--serifa); font-size: 1.15rem; }
.fim button { font: inherit; background: none; border: 0; color: var(--tinta-fraca); cursor: pointer; font-size: 0.85rem; }
.fim button:hover { color: var(--realce); }
.fim button[disabled] { opacity: 0.3; cursor: default; }
section[data-rota] { min-height: 60vh; }
.aviso[hidden], #painel-tipografia[hidden], #gaveta-mapa[hidden], section[hidden] { display: none !important; }
</style>
<nav class="barra">
  <button class="marca" data-ir="mapa">A Casa do Cais</button>
  <button data-ir="capitulos">capítulos</button>
  <button data-ir="tempo">tempo</button>
  <button data-ir="glossario">glossário</button>
  <button data-ir="estado">estado</button>
</nav>
${secoes}
<footer><p>O mapa só sabe anotar o que já terminou de acontecer.</p></footer>
<div hidden>${artigos}</div>
<script>
${runtime}
</script>
`;

writeFileSync('artefato/casa-do-cais.html', html);
console.log('gerado:', (html.length / 1024).toFixed(0), 'kB');
