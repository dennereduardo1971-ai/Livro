# app/ — o site da Casa do Cais

Astro. Lê os capítulos direto de `/manuscrito/livro-01/` — não existe cópia.

```bash
cd app
npm install
npm run dev      # http://localhost:4321
npm run build    # gera dist/
```

## O que já está de pé

- **Fase 0** — projeto, leitura do manuscrito, plugin da diretiva `::cena`, `netlify.toml`.
- **Fase 1** — leitor: rolagem contínua, progresso, marcador, corpo de texto ajustável, claro/escuro/vela, aviso de conteúdo.
- **Fase 2** — o mapa: reboco, camadas antigas, rio correndo, lugares, faixa de reboco cru, quatro marcas de breu, zoom e ficha.
- **Fase 3** — o brilho: segue a rolagem, percorre o rio, pulsa em 4s, esquenta com a tensão, esfria em cena de passado, botão flutuante, `prefers-reduced-motion`.
- **Fase 4** — Estado do Livro (git + notas de revisão), boletim do mapa, linha do tempo e glossário com proteção de spoiler.
- **Fase 5** (parcial) — abertura cinematográfica, manifest, service worker de offline, ícone.
- **Verbetes no corpo do texto** — os termos do glossário viram botões
  dentro do capítulo; clicar abre a definição ali mesmo, com atalho para o
  verbete completo.

## Escrever

No início de cada cena do markdown:

```markdown
::cena lugar="a-fileira" tensao="media" tempo="agora" revela="a-folga,breu"
```

`lugar` vem de `src/dados/lugares.ts`; `tensao` é `baixa|media|alta`;
`tempo` é `agora|antes-da-folga|comeco-da-folga`; `revela` lista ids do
glossário. A diretiva some na publicação.

## Verbetes dentro do capítulo

`src/plugins/glossario.mjs` casa os termos de `src/dados/glossario.ts` com
o corpo do capítulo e os transforma em botões. Duas regras:

- **Spoiler** — um termo só vira botão do capítulo `revelaEm` em diante.
  Quem lê o Capítulo 2 não clica em "o Frio".
- **Ruído** — uma ocorrência por seção (`##`). Sublinhar as trinta
  aparições de "Bento" transformaria a página num formulário.

Nada a fazer no markdown: acrescentar um termo ao glossário basta.

> Mexeu no plugin e o build parece ignorar? O conteúdo renderizado fica em
> cache no content layer: `rm -rf node_modules/.astro .astro dist` antes de
> reconstruir. Apagar só `.astro/` não resolve.

## Ainda não

- Backend (Fase 6): login, progresso entre aparelhos, e-mail semanal, push.
- A proteção de spoiler é do lado do leitor: quem abrir o código-fonte da
  página vê o que ainda não leu. Some de vez na Fase 6, com dados no servidor.
