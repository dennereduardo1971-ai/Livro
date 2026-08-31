export type Tensao = 'baixa' | 'media' | 'alta';
export type Tempo = 'agora' | 'antes-da-folga' | 'comeco-da-folga';

export interface Lugar {
  id: string;
  nome: string;
  /** posição no SVG do mapa (viewBox 0 0 620 980) */
  x: number;
  y: number;
  /** posição relativa ao longo do rio, 0 = nascente, 1 = foz */
  t: number;
  /** capítulo a partir do qual o lugar aparece nomeado no mapa */
  revelaEm: number;
  descricao: string;
  representa: string;
  /** o que já aconteceu ali — cada item só aparece se o leitor já leu */
  passado: { texto: string; revelaEm: number }[];
  /** estado atual conhecido, se houver */
  estado?: { texto: string; revelaEm: number };
  /** marca de breu: lugar caído numa Manifestação */
  breu?: { nome: string; revelaEm: number };
  /** lugar sem interação (o reboco cru) */
  mudo?: boolean;
}

export const LUGARES: Lugar[] = [
  {
    id: 'reboco-cru',
    nome: 'reboco cru',
    x: 300, y: 52, t: 0,
    revelaEm: 2,
    mudo: true,
    descricao:
      'Acima da Cabeceira o mapa simplesmente para. Faixa de reboco que nenhum escrivão preencheu.',
    representa: 'O rio vem de algum lugar que ninguém mapeou.',
    passado: [],
  },
  {
    id: 'cabeceira',
    nome: 'Cabeceira',
    x: 296, y: 132, t: 0.02,
    revelaEm: 2,
    descricao: 'Nascentes, montanha e minas, no topo do mapa. O metal que a Fileira penhora vem de lá.',
    representa: 'O peso que pode ceder.',
    passado: [
      { texto: 'Caiu numa Manifestação chamada o Teto Baixo, antes da Folga.', revelaEm: 2 },
    ],
    breu: { nome: 'o Teto Baixo', revelaEm: 2 },
  },
  {
    id: 'vau-queimado',
    nome: 'Vau Queimado',
    x: 236, y: 268, t: 0.19,
    revelaEm: 2,
    descricao:
      'Vila de travessia, único ponto em muitas léguas onde o Vagaroso fica raso o bastante pra passar gado.',
    representa: 'O lugar sobre o qual o mapa não tem como dizer nada.',
    passado: [
      {
        texto:
          'A última barca desceu com dez pessoas a mais do que declarou, e nenhuma disse de onde vinha.',
        revelaEm: 2,
      },
      { texto: 'A Junta mandou um homem próprio. Ele não voltou.', revelaEm: 3 },
      { texto: 'O povo do Vau não desceu o rio fugindo. Subiu.', revelaEm: 5 },
    ],
    estado: { texto: 'Não desce barca há três semanas. Almanaque não marcou nada no mapa.', revelaEm: 2 },
  },
  {
    id: 'sete-palhas',
    nome: 'Sete Palhas',
    x: 452, y: 350, t: 0.3,
    revelaEm: 2,
    descricao:
      'Planalto de sete aldeias de plantio, sem nomes individuais para quem registra de longe. No mapa aparecem como sete espigas repetidas. Três estão cobertas de breu.',
    representa: 'O que não recebe nome não recebe registro.',
    passado: [{ texto: 'o que passou', revelaEm: 2 }],
    breu: { nome: 'o que passou', revelaEm: 2 },
  },
  {
    id: 'aguas-paradas',
    nome: 'Águas Paradas',
    x: 176, y: 486, t: 0.45,
    revelaEm: 2,
    descricao:
      'Pântano lateral onde o rio se distrai por algumas semanas antes de lembrar pra onde ia. Região historicamente de febre.',
    representa: 'O medo de quem está do lado.',
    passado: [
      { texto: 'Caiu numa Manifestação chamada a Vizinha, antes da Folga.', revelaEm: 2 },
      {
        texto:
          'Vinte anos depois o pântano ainda produz ruído: cadeiras a mais no fundo do cômodo, conversa em outro andar.',
        revelaEm: 4,
      },
    ],
    estado: {
      texto: 'No ano passado alguém construiu casa nova na beira. Comentaram por uma semana e pararam.',
      revelaEm: 4,
    },
    breu: { nome: 'a Vizinha', revelaEm: 2 },
  },
  {
    id: 'porto-de-lenha',
    nome: 'Porto de lenha',
    x: 246, y: 556, t: 0.55,
    revelaEm: 4,
    descricao:
      'Trapiche de tábuas, barracão sem parede, pilhas de lenha cortada e uma balança. Ponto de reabastecimento obrigatório de quem sobe o rio.',
    representa: 'A pressa de quem saiu sem terminar de sair.',
    passado: [
      { texto: 'Encontrado vazio: serragem clara, prato da balança caído, três redes ainda armadas.', revelaEm: 4 },
      { texto: 'Nove pessoas saíram do meio das pilhas de lenha. Queriam a barca.', revelaEm: 5 },
    ],
  },
  {
    id: 'cindra',
    nome: 'Cindra',
    x: 322, y: 660, t: 0.68,
    revelaEm: 1,
    descricao:
      'Cidade portuária em terraços ao longo de um rio lento e barrento. Cresceu rápido demais com gente fugindo de regiões atingidas.',
    representa: 'A cidade que absorve a dor de fora sem processar nada.',
    passado: [{ texto: 'O preço da farinha vem subindo.', revelaEm: 2 }],
  },
  {
    id: 'a-fileira',
    nome: 'A Fileira',
    x: 386, y: 700, t: 0.7,
    revelaEm: 1,
    descricao:
      'Bairro baixo, perto do rio, de casas de penhor e cobradores. O nome vem das filas que se formam antes do amanhecer.',
    representa: 'A espera como estado permanente.',
    passado: [
      { texto: 'Caiu numa Manifestação chamada o Credor — a última registrada no Vagaroso.', revelaEm: 1 },
      { texto: 'Um X de cobrança novo, a giz, no batente da casa de Mara.', revelaEm: 2 },
    ],
    breu: { nome: 'o Credor', revelaEm: 1 },
  },
  {
    id: 'o-poco',
    nome: 'O Poço',
    x: 424, y: 736, t: 0.71,
    revelaEm: 1,
    descricao:
      'Fundações desabadas de um antigo escritório de cobrança. Ninguém reconstruiu por cima.',
    representa: 'O lugar de onde a dívida convida a desaparecer.',
    passado: [
      { texto: 'Íris tirou Caio de lá antes que ele decidisse não subir.', revelaEm: 1 },
      { texto: 'Alguma coisa subiu junto.', revelaEm: 2 },
    ],
    estado: { texto: 'Resíduo psíquico mais denso conhecido em Cindra.', revelaEm: 1 },
  },
  {
    id: 'casa-do-cais',
    nome: 'A Casa do Cais',
    x: 268, y: 690, t: 0.68,
    revelaEm: 2,
    descricao:
      'Construção baixa de janelas largas na ponta do píer velho. Registra chegadas, saídas, cargas — e guarda recado para gente sem endereço fixo.',
    representa: 'O registro honesto que, por ser honesto, fica incompleto.',
    passado: [
      { texto: 'O mapa desta parede é este mapa. O pote de breu de Almanaque secou de desuso.', revelaEm: 2 },
      { texto: 'Um recado anônimo: dia, hora, píer, e uma moeda de Boca Grande adiantada.', revelaEm: 2 },
    ],
    estado: { texto: 'As presenças de Íris ficam anormalmente quietas lá dentro.', revelaEm: 2 },
  },
  {
    id: 'boca-grande',
    nome: 'Boca Grande',
    x: 268, y: 848, t: 0.94,
    revelaEm: 2,
    descricao:
      'Cidade grande no encontro do Vagaroso com o mar, a oito dias de barca de Cindra.',
    representa: 'A administração que declara o problema encerrado porque ele parou de aparecer no relatório.',
    passado: [
      { texto: 'Reduziu a taxa de resguardo das vilas por falta de necessidade comprovada.', revelaEm: 2 },
      { texto: 'A Junta de Resguardo fica lá. Agora contrata gente de fora da folha.', revelaEm: 3 },
    ],
  },
];

export const POR_ID = new Map(LUGARES.map((l) => [l.id, l]));

/** o traçado do rio Vagaroso — nascente em cima, foz embaixo */
export const RIO =
  'M 300 92 C 288 158, 246 198, 238 262 C 230 326, 262 384, 244 448 C 228 506, 300 546, 314 604 C 328 666, 272 704, 276 764 C 279 812, 268 838, 266 892';
