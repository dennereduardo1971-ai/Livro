# Plano — Aplicativo de Leitura Interativa

> Documento vivo. Decisões tomadas nas 7 rodadas de refinamento.
> Fonte da verdade para a construção do site. Atualizar aqui antes de
> mudar código.

---

## 1. O que estamos construindo

Um site de leitura interativa, instalável no celular, publicado
semanalmente, cuja identidade visual é **o mapa da Casa do Cais** — o
mapa pintado no reboco que já é objeto canônico do Livro 1.

O leitor abre o app, vê uma abertura cinematográfica, entra no mapa, e
lê. Enquanto lê, um **brilho** acompanha em que lugar do mundo a cena
está acontecendo. Toda semana o mapa muda um pouco: breu novo escorre,
lugares acendem, a linha do tempo cresce.

### O princípio de design que rege tudo

O mundo tem uma regra: **"não existe marca para *não sei*"**. O mapa de
Cindra só sabe anotar o que já terminou de acontecer.

Por isso o brilho **não é tinta na parede** — é luz do aplicativo,
sobreposta, de outra matéria. Visualmente ele nunca deve parecer
pertencer ao reboco. O leitor vê o presente; o mundo, não. Essa é a
diferença que o app inteiro respeita.

Três materiais, três comportamentos, nunca misturados:

| Camada | O que é | Comportamento |
|---|---|---|
| **Reboco** | o mundo permanente | textura, gerações de tinta, imóvel |
| **Breu** | o que já terminou | opaco, escorrido, fosco, só cresce |
| **Luz** | o presente do leitor | emissiva, pulsante, sem peso, transitória |

---

## 2. Decisões fechadas

| Tema | Decisão |
|---|---|
| Tela inicial | Abertura cinematográfica → mapa |
| Público | Aberto, com login opcional (v2) |
| Dispositivo | Celular primeiro |
| Escopo v1 | Fatia vertical completa, no ar |
| Estética do mapa | Parede de reboco, fiel ao cânone |
| Técnica do mapa | SVG vetorial + texturas |
| Toque num lugar | Ficha do lugar + zoom cinematográfico |
| Marcas de breu | Aparecem conforme o leitor avança |
| Natureza do brilho | Camada do leitor, por cima |
| O brilho segue | A posição de leitura do usuário |
| Pulso | Lento, respiratório (~4s) |
| Lugares não visitados | Visíveis, apagados |
| Mapa durante a leitura | Só sob demanda (botão flutuante) |
| Navegação do capítulo | Rolagem contínua |
| Recursos de leitura | Progresso, marcador, tipografia, modo vela |
| Glossário | Sim, com proteção de spoiler |
| Boletim semanal | O que mudou no mapa + "de onde você parou" |
| Status de escrita | Painel vivo (rascunho / revisão / publicado) |
| Linha do tempo | Sim, revelada progressivamente |
| Aviso | PWA instalável + push + e-mail semanal |
| Animação | Lenta e respiratória (400–700ms) |
| Vida do mapa | Rio correndo, parallax leve, grão de luz variável |
| Som | Nenhum |
| Acessibilidade v1 | Reduzir movimento, contraste/fonte, aviso de conteúdo |
| Publicação | Escrever `.md` → push → site atualiza sozinho |
| Marcação de cena | Diretiva no início da cena |
| Hospedagem | Netlify |
| Backend | v2 (v1 guarda progresso no aparelho) |

---

## 3. Arquitetura técnica

### Pilha escolhida

- **Astro** — gerador de site. Nativo em markdown, entrega quase zero
  JavaScript por padrão (leitura rápida no celular) e permite "ilhas"
  interativas só onde precisa: o mapa e o leitor. É a escolha certa
  para um site que é 90% texto e 10% interação pesada.
- **TypeScript** — segurança nos dados de lugares e cenas.
- **CSS nativo + Web Animations API** — animações fluidas sem carregar
  biblioteca. `View Transitions` do Astro para as trocas de tela.
- **SVG inline** — o mapa. Cada lugar, o rio e cada marca de breu são
  elementos independentes, endereçáveis e animáveis por código.
- **IntersectionObserver** — o que move o brilho conforme a rolagem.
- **`@vite-pwa/astro`** — instalação no celular, offline e push.
- **Netlify** — publicação automática a cada push no GitHub.
- **Supabase** (v2) — login, progresso sincronizado, lista de e-mails.

### Por que não outra coisa

Next.js seria peso de servidor sem necessidade — não há dado dinâmico
na v1. Canvas/WebGL daria efeitos mais espetaculares e custaria bateria,
acessibilidade e manutenção; SVG com filtros entrega a parede de reboco
com folga.

### Estrutura de pastas

```
/manuscrito/        ← intocado, continua sendo a fonte da verdade
/universo/          ← intocado, a bíblia
/revisao/           ← intocado
/app/
  src/
    content/
      capitulos/    ← ligação simbólica para /manuscrito/
    dados/
      lugares.ts    ← lugares + coordenadas no SVG + estado
      manifestacoes.ts
      linha-do-tempo.ts
      glossario.ts  ← termo → definição + capítulo de liberação
    componentes/
      Mapa/         ← o SVG, as camadas, o brilho
      Leitor/       ← tipografia, progresso, marcador
      Abertura/     ← a animação de entrada
      Boletim/      ← o que mudou nesta semana
      Timeline/
    plugins/
      cena.ts       ← lê as diretivas ::cena do markdown
    paginas/
```

Os capítulos **não são copiados** para dentro do app. O app lê
`/manuscrito/` direto. Só existe uma cópia de cada capítulo no mundo, e
ela continua sendo a sua.

---

## 4. Como o texto conversa com o mapa

### A diretiva de cena

No início de cada cena do markdown, uma linha:

```markdown
## I. O Pagamento

::cena lugar="a-fileira" tensao="media"

Íris dormiu quase dois dias inteiros e acordou com a sensação...
```

Ela desaparece na publicação — vira uma âncora invisível no HTML. Leva
cinco segundos para escrever e dá controle total. O capítulo continua
sendo markdown legível, e nada muda no seu fluxo de escrita atual com os
agentes.

### Atributos disponíveis

| Atributo | Valores | Efeito |
|---|---|---|
| `lugar` | id de `lugares.ts` | move o brilho |
| `tensao` | `baixa` `media` `alta` | temperatura e estabilidade do brilho |
| `tempo` | `agora` `antes-da-folga` `comeco-da-folga` | a luz muda de cor em cena de passado |
| `revela` | ids do glossário | destrava termos e eventos da linha do tempo |

`tempo` merece atenção: cenas do passado de Íris (Sete Palhas, o silo)
não devem mover o brilho como se a trama tivesse viajado até lá. A luz
vira fria e sem pulso — memória, não presente.

### O mecanismo

`IntersectionObserver` observa cada âncora de cena. Quando uma entra na
faixa de leitura, o mapa recebe o novo lugar e o brilho **percorre o rio
ou a estrada** até ele, em vez de saltar — vendendo a geografia do
mundo. Em modo "reduzir movimento", ele simplesmente troca de posição.

---

## 5. O mapa em camadas

De baixo para cima, tudo SVG no mesmo documento:

1. **Reboco** — textura por `feTurbulence`, com deriva de luz muito
   lenta (o lampião). Praticamente subliminar.
2. **Camadas antigas** — desenhos de gerações anteriores de escrivães,
   em opacidade baixa. Aparecem ao dar zoom. Recompensa quem explora.
3. **Rio Vagaroso** — traçado com corrente lenta e contínua, animada por
   `stroke-dashoffset`. Nunca para.
4. **Lugares** — Cabeceira, Vau Queimado, Sete Palhas (sete espigas),
   Águas Paradas, Cindra, Boca Grande. Cinza baixo enquanto a trama não
   chegou; ganham cor quando chega.
5. **Faixa de reboco cru** — acima da Cabeceira. Nunca preenchida.
   Nenhuma interação. Ela existe para ser notada e incomodar.
6. **Breu** — as quatro marcas históricas, com escorrimento. Quando um
   lugar novo cai, o breu escorre na tela em ~3s: uma revelação por
   capítulo, no máximo.
7. **Luz** — o brilho. Sobreposto, `mix-blend-mode`, pulso de 4s.

### Toque num lugar

Zoom cinematográfico: a câmera aproxima em ~600ms, o resto do mapa
desfoca e escurece, e a ficha sobe de baixo — descrição física, o que
representa, o que já aconteceu ali **e o leitor já leu**, e o estado
atual quando houver ("não desce barca há três semanas").

Sete Palhas é o caso especial: a Manifestação não tem nome e não pode
ganhar um. A ficha mostra `o que passou` e para. Se o leitor tocar de
novo, mostra a mesma coisa — como os sobreviventes fazem.

---

## 6. Proteção de spoiler

Uma única regra, aplicada em todo lugar: **o app só mostra o que o
leitor já leu.**

O progresso de leitura é um número — o último capítulo concluído. Cada
item de dado (lugar, marca de breu, evento da linha do tempo, termo do
glossário) carrega um campo `revelaEm`. Se `revelaEm > progresso`, o
item aparece apagado, bloqueado ou não aparece.

Isso vale para o mapa, a ficha de lugar, a linha do tempo e o glossário.
Um leitor no Capítulo 2 e outro no Capítulo 40 veem mundos diferentes —
e essa é a graça.

---

## 7. Painel "Estado do Livro"

Alimentado automaticamente pelo repositório, sem trabalho manual:

- **Capítulos publicados** — arquivos em `/manuscrito/`.
- **Status de cada um** — derivado de `/revisao/notas-por-capitulo.md`:
  rascunho → em revisão → publicado.
- **Última atualização** — data do último commit.
- **O que mudou no mapa** — comparação entre o estado do mapa desta
  semana e o da anterior. É o boletim principal.
- **De onde você parou** — quantos capítulos acumularam desde a última
  visita, com botão de continuar.

---

## 8. Fases de construção

### Fase 0 — Fundação (você não vê nada ainda)
Projeto Astro dentro de `/app`, leitura dos capítulos de
`/manuscrito/`, plugin da diretiva `::cena`, `lugares.ts` com as
coordenadas, publicação automática no Netlify funcionando.
**Entregável:** um site feio no ar, com os dois capítulos legíveis.

### Fase 1 — O leitor
Tipografia séria para leitura longa, rolagem contínua, barra de
progresso, marcador automático, controles de fonte, modo claro/escuro/
vela, aviso de conteúdo sensível.
**Entregável:** um site em que dá gosto ler no celular.

### Fase 2 — O mapa
O SVG completo, as camadas, o reboco, o rio correndo, os lugares, as
quatro marcas de breu, zoom e ficha de lugar.
**Entregável:** o mapa da Casa do Cais, navegável.

### Fase 3 — O brilho
Sincronização entre rolagem e mapa, deslocamento pelo rio, pulso,
temperatura por tensão, luz fria para cenas de passado, botão flutuante
de mapa durante a leitura, `prefers-reduced-motion`.
**Entregável:** o recurso que define o app.

### Fase 4 — Estado vivo
Painel Estado do Livro, boletim semanal, linha do tempo progressiva,
glossário com proteção de spoiler, marcação de capítulo não lido.
**Entregável:** um site que recompensa voltar toda semana.

### Fase 5 — Aplicativo
PWA instalável, ícone, offline nos capítulos já lidos, abertura
cinematográfica, polimento de todas as animações, acessibilidade
completa.
**Entregável:** a v1 pronta, profissional.

### Fase 6 — v2 (depois)
Supabase: login, progresso sincronizado entre aparelhos, lista de
e-mails, notificação push, domínio próprio.

---

## 9. O que você precisa fazer

Nada agora — a Fase 0 e 1 não dependem de você. Quando chegarmos lá:

**Antes da Fase 0 terminar (publicação):**
- Autorizar a conexão do Netlify com o repositório. Eu preparo tudo e te
  digo o botão exato para apertar.

**Durante a Fase 2 (o mapa):**
- Decidir a paleta: as cores do reboco, do breu e da luz. Vou te mostrar
  três opções prontas para escolher.
- Conferir as posições dos lugares no mapa. Eu proponho uma geografia
  coerente com o texto e você corrige o que estiver errado — é o seu
  mundo.

**Durante a Fase 3 (o brilho):**
- Adicionar as diretivas `::cena` nos Capítulos 1 e 2. Eu faço uma
  proposta baseada no texto e você aprova ou ajusta.

**Antes da Fase 5:**
- Escrever o texto do aviso de conteúdo sensível e escolher os recursos
  de apoio (CVV 188, por exemplo) — isso é seu, não meu.
- Decidir o nome do livro e do site. Hoje o README diz "[Nome do
  Livro]".

**Na Fase 6, se quiser domínio próprio:**
- Comprar o domínio. Eu configuro o resto.

**Você não precisa instalar nada.** Todo o desenvolvimento acontece
aqui, e o site publica sozinho a partir do GitHub.

---

## 10. Rotina semanal, depois de pronto

1. `/novo-capitulo` → escreve → `/checar-consistencia` → `/revisar-capitulo`
2. Adiciona as diretivas `::cena` (cinco segundos por cena)
3. Atualiza `/universo/` se algo novo virou canônico
4. Commit e push
5. O site republica sozinho em cerca de um minuto: capítulo no ar, mapa
   atualizado, breu novo escorrido, boletim gerado, leitores avisados

Seu fluxo de escrita não muda. Ganha um passo de cinco segundos.
