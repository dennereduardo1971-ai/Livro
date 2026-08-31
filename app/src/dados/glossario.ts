export interface Termo {
  id: string;
  termo: string;
  definicao: string;
  revelaEm: number;
}

/** Definições em voz do mundo — nenhum termo clínico, por regra do universo. */
export const GLOSSARIO: Termo[] = [
  { id: 'sala-de-espera', termo: 'Sala de Espera', revelaEm: 1,
    definicao: 'A técnica de Íris. Ela ouve presenças que ninguém mais ouve, e elas nem sempre mentem nem sempre ajudam. Quem decide o que fazer com o que se ouve é ela — sempre.' },
  { id: 'a-mansa', termo: 'a Mansa', revelaEm: 1,
    definicao: 'Uma das presenças. Cantarola, lembra de comer, chega devagar.' },
  { id: 'a-rapida', termo: 'a Rápida', revelaEm: 1,
    definicao: 'Uma das presenças. Vê antes, fala baixo, quase nunca está errada sobre o que está na frente dos olhos.' },
  { id: 'portador', termo: 'Portador', revelaEm: 1,
    definicao: 'Quem carrega técnica. Palavra de registro, não de identidade — a Junta usa; as pessoas nem sempre.' },
  { id: 'manifestacao', termo: 'Manifestação', revelaEm: 1,
    definicao: 'O que cai sobre um lugar quando o medo de muita gente ao mesmo tempo encontra alguma coisa para virar. Quatro estão marcadas a breu no mapa da Casa do Cais.' },
  { id: 'ferrugem', termo: 'Ferrugem', revelaEm: 1,
    definicao: 'Quem administra o crédito informal da Fileira. Não aparece; a rede dele aparece. Um X baixo, perto do chão, na porta que os cobradores pretendem visitar de novo.' },
  { id: 'o-poco', termo: 'o Poço', revelaEm: 1,
    definicao: 'As fundações do escritório onde o Credor atacou. Ninguém reconstruiu por cima. Perto dele, o número de presenças sobe muito acima do normal.' },
  { id: 'o-credor', termo: 'o Credor', revelaEm: 1,
    definicao: 'A Manifestação que atacou a Fileira há vinte anos, nascida do medo de dívida e de escassez. A última registrada no Vagaroso.' },
  { id: 'a-folga', termo: 'a Folga', revelaEm: 2,
    definicao: 'Os vinte anos sem Manifestação nenhuma em lugar nenhum do rio. Uma geração inteira cresceu achando que o mundo sempre foi assim.' },
  { id: 'breu', termo: 'breu de lampião', revelaEm: 2,
    definicao: 'A tinta preta com que o escrivão cobre, no mapa, o lugar que caiu. Não existe marca para "não sei": o mapa só sabe anotar o que já terminou de acontecer.' },
  { id: 'almanaque', termo: 'Almanaque', revelaEm: 2,
    definicao: 'O escrivão da Casa do Cais. Registra o que sabe e não registra o que não sabe, e é por honestidade que o mapa fica incompleto.' },
  { id: 'taxa-de-resguardo', termo: 'taxa de resguardo', revelaEm: 2,
    definicao: 'O que as vilas do Vagaroso pagavam à Junta. Reduzida durante a Folga por falta de necessidade comprovada.' },
  { id: 'a-terceira', termo: 'a terceira presença', revelaEm: 2,
    definicao: 'Subiu do Poço com Íris e ficou calada três dias. Depois falou: "Ele vai precisar de tinta nova."' },
  { id: 'junta-de-resguardo', termo: 'a Junta de Resguardo', revelaEm: 3,
    definicao: 'Órgão de Boca Grande que cobra a taxa das vilas e mantém registro de quem carrega técnica. Mede a pessoa sem enxergá-la, e às vezes acerta por isso.' },
  { id: 'vitorino', termo: 'Vitorino Cerqueira', revelaEm: 3,
    definicao: 'Homem da Junta. Formulário de três linhas: nome da pessoa, nome que a pessoa dá pra coisa, observações. Aceitou "não informou" sem retaliar.' },
  { id: 'antes-de-cair-o-copo', termo: 'Antes de Cair o Copo', revelaEm: 3,
    definicao: 'A técnica de Bento. Ele sabe antes — e erra doze vezes por dia. O custo não está no lampejo; está em ser o rapaz que avisa.' },
  { id: 'bento', termo: 'Bento', revelaEm: 3,
    definicao: 'Vinte e um anos. A técnica nasceu nele durante a Folga, o que pela via de origem conhecida não deveria ser possível.' },
  { id: 'boa-hora', termo: 'a Boa Hora', revelaEm: 4,
    definicao: 'Barca de casco chato, vinte e seis anos e três cascos diferentes. Sobe o rio com paciência e desce com pressa. Mestre Nestor.' },
  { id: 'enxame', termo: 'Enxame', revelaEm: 4,
    definicao: 'A técnica de Alice. Muitas coisas começadas, a cadeia inteira aberta ao mesmo tempo — e, de vez em quando, oito segundos em que só existe uma.' },
  { id: 'alice', termo: 'Alice', revelaEm: 4,
    definicao: 'Contramestre da Boa Hora. Pergunta tudo, e por isso perguntou "quantos são?" como quem pergunta a profundidade do rio.' },
  { id: 'o-frio', termo: 'o Frio', revelaEm: 5,
    definicao: 'A presença que apareceu embaixo do casco, com a água em cima. Não é nova; é antiga e estava esperando o lugar certo.' },
];
