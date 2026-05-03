/**
 * Conteúdo educacional — Nível 1 (Essencial) para Amortização PRICE/SAC.
 *
 * O texto explica a leitura mínima da tela sem reimplementar cálculo no
 * frontend. Os números de exemplo são os casos canônicos PR-01 e SAC-01 do
 * Doc 15, materializados pelo domínio/backend nas fatias F2/F3.
 */

import { DISCLAIMER_EDUCACIONAL, type EducationalContent } from "./types";

const AMORTIZACAO_NIVEL_1: EducationalContent = {
  slug: "amortizacao",
  version: "1.0.0",
  level: "nivel-1",
  title: "Amortização — o que a tabela mostra",
  paragraphs: [
    "Amortização é a parte da parcela que reduz o saldo devedor. Em cada " +
      "linha da tabela, a parcela é dividida entre juros do período e " +
      "amortização do principal.",
    "O saldo devedor começa no valor financiado e diminui conforme a " +
      "amortização acontece. Quando a tabela fecha corretamente, o saldo " +
      "final chega a R$ 0,00 no último período.",
    "A soma das parcelas forma o total pago. A soma dos juros mostra o " +
      "custo financeiro da simulação. Esses totais ajudam a comparar " +
      "sistemas sem olhar apenas para a primeira parcela.",
    "Na plataforma, PRICE e SAC usam a mesma API de amortização. A página " +
      "exibe os resultados calculados pelo backend e acrescenta esta " +
      "explicação para apoiar a leitura.",
  ],
  disclaimer: DISCLAIMER_EDUCACIONAL,
};

const PRICE_NIVEL_1: EducationalContent = {
  slug: "sistema-price",
  version: "1.0.0",
  level: "nivel-1",
  title: "PRICE — parcela constante",
  paragraphs: [
    "No sistema PRICE, a parcela exibida é constante ao longo do prazo. " +
      "A composição interna muda: no começo, uma parte maior da parcela " +
      "vai para juros; com o tempo, a amortização cresce.",
    "Esse formato facilita enxergar um valor mensal estável, mas a " +
      "tabela continua sendo essencial para entender quanto de cada " +
      "parcela realmente reduz o saldo devedor.",
    "No caso canônico de R$ 100.000,00, taxa de 1% ao mês e 12 períodos, " +
      "a parcela PRICE exibida pela plataforma é R$ 8.884,88.",
    "A parcela menor no início não deve ser lida isoladamente. O custo " +
      "total depende da taxa, do prazo e da forma como juros e " +
      "amortização se distribuem ao longo da tabela.",
  ],
  disclaimer: DISCLAIMER_EDUCACIONAL,
};

const SAC_NIVEL_1: EducationalContent = {
  slug: "sistema-sac",
  version: "1.0.0",
  level: "nivel-1",
  title: "SAC — amortização constante",
  paragraphs: [
    "No SAC, a amortização do principal é constante em quase todo o " +
      "prazo. Como o saldo devedor cai a cada período, os juros também " +
      "diminuem e as parcelas tendem a ficar menores.",
    "Esse formato costuma começar com parcela mais alta que a PRICE no " +
      "mesmo cenário, porque a redução do principal acontece mais cedo.",
    "No caso canônico de R$ 100.000,00, taxa de 1% ao mês e 12 períodos, " +
      "a parcela inicial SAC é R$ 9.333,33 e a parcela final é " +
      "R$ 8.416,70.",
    "Para taxa positiva e prazo maior que um período, o SAC tende a gerar " +
      "menor total de juros neste modelo matemático, mas contratos reais " +
      "podem incluir tarifas, seguros, impostos e outras regras.",
  ],
  disclaimer: DISCLAIMER_EDUCACIONAL,
};

const COMPARACAO_NIVEL_1: EducationalContent = {
  slug: "comparacao-price-sac",
  version: "1.0.0",
  level: "nivel-1",
  title: "PRICE x SAC — leitura lado a lado",
  paragraphs: [
    "Comparar PRICE e SAC exige olhar dois aspectos ao mesmo tempo: fluxo " +
      "das parcelas e custo total. Um sistema pode começar mais leve no " +
      "mês e ainda assim acumular mais juros ao longo do prazo.",
    "A aba Comparar usa o mesmo principal, a mesma taxa e o mesmo prazo " +
      "para os dois sistemas. Isso deixa a diferença mais clara, porque " +
      "a comparação muda apenas o método de amortização.",
    "No caso canônico de R$ 100.000,00, 1% ao mês e 12 períodos, o total " +
      "de juros PRICE é R$ 6.618,53 e o total de juros SAC é R$ 6.500,00.",
    "A leitura pedagógica é: parcela mensal, total pago e total de juros " +
      "respondem perguntas diferentes. A decisão fora da plataforma " +
      "depende de contrato, orçamento, risco e condições efetivas.",
  ],
  disclaimer: DISCLAIMER_EDUCACIONAL,
};

export const CONTEUDO_NIVEL_1: ReadonlyArray<EducationalContent> = [
  AMORTIZACAO_NIVEL_1,
  PRICE_NIVEL_1,
  SAC_NIVEL_1,
  COMPARACAO_NIVEL_1,
];
