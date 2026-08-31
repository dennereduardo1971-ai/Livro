# [Nome do Livro] — Projeto de Escrita Contínua

## Premissa central
Fantasia com sistema de poderes amplo e um sistema de batalha instigante, mas o
motor real da história é **saúde mental**. Cada elemento fantástico — poder,
regra do sistema de magia, criatura, facção — deve, em algum nível, ecoar ou
iluminar algo sobre como a mente humana lida com sofrimento, percepção
distorcida da realidade, dissociação, obsessão, medo, luto, etc.

O tom é **contemplativo**: mesmo as cenas de ação devem deixar espaço para
reflexão. Batalhas não são só coreografia — são metáforas em movimento.

## Como este repositório funciona
- `/universo/` — a "bíblia" do mundo. Fonte da verdade. Se não está aqui,
  não é canônico ainda.
- `/universo/arco-romance.md` — a régua do arco Íris × Alice: escada de
  sete degraus, objetos recorrentes e os dois toques obrigatórios por
  capítulo. Consultar antes de escrever qualquer capítulo.
- `/manuscrito/` — os capítulos de verdade, em markdown, um arquivo por
  capítulo.
- `/app/` — o site de leitura (Astro), publicado no GitHub Pages a cada
  push pela ação em `.github/workflows/pages.yml`.
- `/revisao/` — histórico de notas de revisão por capítulo.
- `.claude/agents/` — os três subagentes (ideias, lógica do universo,
  revisor). Ver seção abaixo.
- `.claude/commands/` — atalhos (slash commands) para rodar o fluxo de
  trabalho.

**Regra de ouro:** nada entra em `/manuscrito/` como definitivo sem passar
pelo agente de lógica do universo (consistência) e pelo agente revisor
(qualidade). Ideias soltas ficam em `/universo/ideias-em-aberto.md` até
serem aprovadas.

## Guia de estilo
- Ponto de vista: 3ª pessoa limitada, um POV por capítulo (Livro 1 é o
  POV de Íris, salvo indicação em contrário).
- Tempo verbal: passado.
- Nível de explicitação do sistema de magia: mostrar, nunca explicar —
  nenhuma frase do tipo "seu poder representava X"; o eco psicológico
  tem que ser sentido pela cena, não traduzido pro leitor (ver regra de
  ouro em `universo/sistema-de-poderes.md`).
- Como tratar o tema de saúde mental: nunca como metáfora fácil ou "vilão é
  louco" — sempre com camada de interioridade real, evitando romantização
  ou estigmatização.

## Fluxo de trabalho sugerido
1. `/novo-capitulo` — aciona o agente de ideias para gerar direções para o
   próximo capítulo/cena.
2. Você escolhe/ajusta a direção.
3. `/checar-consistencia` — aciona o agente de lógica do universo antes de
   escrever a cena, pra validar que a ideia não quebra nada estabelecido.
4. Escreve o capítulo (você ou com ajuda direta do Claude Code).
5. `/revisar-capitulo` — aciona o agente revisor sobre o capítulo escrito.
6. Commit no git com mensagem descritiva (ex: `cap-07: introduz poder de
   dissociação da I.`).
