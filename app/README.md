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

## Escrever

No início de cada cena do markdown:

```markdown
::cena lugar="a-fileira" tensao="media" tempo="agora" revela="a-folga,breu"
```

`lugar` vem de `src/dados/lugares.ts`; `tensao` é `baixa|media|alta`;
`tempo` é `agora|antes-da-folga|comeco-da-folga`; `revela` lista ids do
glossário. A diretiva some na publicação.

## Ainda não

- Backend (Fase 6): login, progresso entre aparelhos, e-mail semanal, push.
- A proteção de spoiler é do lado do leitor: quem abrir o código-fonte da
  página vê o que ainda não leu. Some de vez na Fase 6, com dados no servidor.
