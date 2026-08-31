export interface Evento {
  id: string;
  quando: string;
  titulo: string;
  texto: string;
  revelaEm: number;
  lugar?: string;
}

export const LINHA_DO_TEMPO: Evento[] = [
  { id: 'sete-palhas-cai', quando: 'há cerca de vinte e dois anos', titulo: 'Três espigas apagam',
    texto: 'Uma Manifestação sem nome atinge o planalto de Sete Palhas. Os sobreviventes chamam de "o que passou", e repetem a mesma expressão quando perguntados de novo.',
    lugar: 'sete-palhas', revelaEm: 2 },
  { id: 'o-credor', quando: 'há cerca de vinte anos', titulo: 'O Credor cai sobre a Fileira',
    texto: 'A última Manifestação registrada no Vagaroso. É destruída, mas deixa resíduo denso nas fundações onde atacou — hoje, o Poço.',
    lugar: 'a-fileira', revelaEm: 1 },
  { id: 'comeco-da-folga', quando: 'a partir dali', titulo: 'Começa a Folga',
    texto: 'Vinte anos sem Manifestação nova em lugar nenhum do rio. Boca Grande reduz a taxa de resguardo por falta de necessidade comprovada. Gente volta a construir em terreno abandonado.',
    revelaEm: 2 },
  { id: 'poco-caio', quando: 'ano 20 da Folga', titulo: 'Íris tira Caio do Poço',
    texto: 'Contratada por Mara Sobral. No Poço, a Sala de Espera sobrecarrega e uma voz antiga sugere deixar o rapaz. Ele se levanta sozinho.',
    lugar: 'o-poco', revelaEm: 1 },
  { id: 'mapa-parede', quando: 'três dias depois', titulo: 'O pote de breu secou',
    texto: 'Na Casa do Cais, Almanaque registra que o Vau Queimado não desce barca há três semanas — e não marca nada no mapa, porque não existe marca para "não sei".',
    lugar: 'casa-do-cais', revelaEm: 2 },
  { id: 'terceira-fala', quando: 'na mesma noite', titulo: 'A terceira presença fala',
    texto: '"Ele vai precisar de tinta nova."',
    lugar: 'cindra', revelaEm: 2 },
  { id: 'contrato-junta', quando: 'quatro da tarde', titulo: 'A Junta contrata',
    texto: 'Vitorino Cerqueira paga o dobro para que alguém suba até o Vau Queimado, olhe e desça. O homem que a Junta mandou há nove dias não voltou.',
    lugar: 'cindra', revelaEm: 3 },
  { id: 'guindaste', quando: 'no mesmo cais', titulo: 'A corda do guindaste arrebenta',
    texto: 'Bento avisa e ninguém acredita — foram doze falsos alarmes no mesmo dia. Íris tira um menino do caminho. Vitorino anota o número.',
    lugar: 'cindra', revelaEm: 3 },
  { id: 'subida', quando: 'cinco da manhã', titulo: 'A Boa Hora sobe o rio',
    texto: 'Íris e Bento partem rio acima. Nas Águas Paradas, Bento passa mal e descobre não ter memória nenhuma da viagem que fez ali aos onze anos.',
    lugar: 'aguas-paradas', revelaEm: 4 },
  { id: 'porto-lenha', quando: 'na saída do pântano', titulo: 'Nove pessoas saem da lenha',
    texto: 'O trapiche está vazio, com as redes ainda armadas.',
    lugar: 'porto-de-lenha', revelaEm: 4 },
  { id: 'oito-segundos', quando: 'debaixo do casco', titulo: 'Oito segundos',
    texto: 'A barca gira amarrada dos dois lados e o cabo varre o convés. Sob a água, a Sala de Espera abre inteira e o Frio aparece. Alice corta a volta do cabo em hiperfoco, e depois não sabe a ordem do que fez.',
    lugar: 'porto-de-lenha', revelaEm: 5 },
  { id: 'rio-acima', quando: 'na segunda vigília', titulo: 'O Vau subiu',
    texto: 'Os refugiados informam que o povo do Vau Queimado não desceu o rio fugindo. Subiu.',
    lugar: 'vau-queimado', revelaEm: 5 },
];
