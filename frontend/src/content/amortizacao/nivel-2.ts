/**
 * Conteúdo educacional — Nível 2 (Intermediário) para Amortização PRICE/SAC.
 *
 * Este nível aprofunda a leitura da tabela, mas preserva o backend como
 * fonte oficial dos cálculos.
 */

import { DISCLAIMER_EDUCACIONAL, type EducationalContent } from "./types";

const AMORTIZACAO_NIVEL_2: EducationalContent = {
  slug: "amortizacao",
  version: "1.0.0",
  level: "nivel-2",
  title: "Amortização — fechamento financeiro da tabela",
  paragraphs: [
    "Cada linha de uma tabela de amortização precisa fechar: juros do " +
      "período mais amortização devem resultar exatamente na parcela " +
      "exibida. Essa regra evita que centavos arredondados criem totais " +
      "incoerentes.",
    "Os totais seguem a mesma lógica. A soma das parcelas deve bater com " +
      "o total pago, a soma dos juros com o total de juros e a soma das " +
      "amortizações com o principal financiado.",
    "O saldo final R$ 0,00 indica que todo o principal foi amortizado na " +
      "simulação. A última linha pode absorver pequenos ajustes de " +
      "centavos para preservar esse fechamento.",
    "Essas garantias foram implementadas no domínio puro da Sprint 3/F2 " +
      "e expostas pela API na Sprint 3/F3. A interface apenas apresenta " +
      "os campos retornados.",
  ],
  disclaimer: DISCLAIMER_EDUCACIONAL,
};

const PRICE_NIVEL_2: EducationalContent = {
  slug: "sistema-price",
  version: "1.0.0",
  level: "nivel-2",
  title: "PRICE — composição muda dentro da parcela fixa",
  paragraphs: [
    "A fórmula PRICE calcula uma prestação constante para o prazo todo. " +
      "Depois disso, cada linha separa a parcela em juros do período e " +
      "amortização do saldo.",
    "Como o saldo devedor é maior no começo, os juros iniciais também " +
      "são maiores. A amortização inicial fica menor e cresce conforme " +
      "o saldo cai.",
    "No exemplo PR-01 do Doc 15, a primeira linha tem juros de " +
      "R$ 1.000,00, amortização de R$ 7.884,88 e parcela de " +
      "R$ 8.884,88. A soma da linha fecha a parcela exibida.",
    "A principal vantagem pedagógica da PRICE é observar uma parcela " +
      "estável com composição dinâmica. A principal cautela é não " +
      "confundir estabilidade mensal com menor custo total.",
  ],
  disclaimer: DISCLAIMER_EDUCACIONAL,
};

const SAC_NIVEL_2: EducationalContent = {
  slug: "sistema-sac",
  version: "1.0.0",
  level: "nivel-2",
  title: "SAC — saldo cai mais cedo",
  paragraphs: [
    "No SAC, a amortização base é o principal dividido pelo número de " +
      "períodos. Essa amortização constante reduz o saldo devedor de " +
      "forma mais direta ao longo da tabela.",
    "Como os juros são calculados sobre o saldo devedor, a queda do " +
      "saldo reduz os juros seguintes. Por isso a parcela tende a " +
      "diminuir com o passar dos períodos.",
    "No exemplo SAC-01 do Doc 15, a primeira linha tem juros de " +
      "R$ 1.000,00, amortização de R$ 8.333,33 e parcela de " +
      "R$ 9.333,33. A parcela final exibida é R$ 8.416,70.",
    "A leitura correta não é escolher um sistema por nome. É observar " +
      "se o fluxo das parcelas, o total pago e as demais condições do " +
      "contrato fazem sentido no cenário analisado.",
  ],
  disclaimer: DISCLAIMER_EDUCACIONAL,
};

const COMPARACAO_NIVEL_2: EducationalContent = {
  slug: "comparacao-price-sac",
  version: "1.0.0",
  level: "nivel-2",
  title: "PRICE x SAC — parcela mensal e custo total",
  paragraphs: [
    "A comparação da plataforma mantém principal, taxa e prazo iguais " +
      "para PRICE e SAC. Assim, a diferença observada vem do desenho " +
      "da amortização, não de entradas diferentes.",
    "PRICE tende a organizar o fluxo como uma parcela constante. SAC " +
      "tende a concentrar amortização mais cedo e reduzir parcelas ao " +
      "longo do tempo. Esses dois desenhos respondem a necessidades " +
      "diferentes de leitura.",
    "No caso PR-01/SAC-01 do Doc 15, o total de juros do SAC fica " +
      "R$ 118,53 abaixo do total de juros PRICE. Essa diferença aparece " +
      "porque a amortização do principal acontece em ritmos diferentes.",
    "Mesmo assim, a simulação não modela todos os elementos de um " +
      "financiamento real. Tarifas, seguros, impostos, indexadores e " +
      "regras contratuais podem mudar o custo efetivo.",
  ],
  disclaimer: DISCLAIMER_EDUCACIONAL,
};

export const CONTEUDO_NIVEL_2: ReadonlyArray<EducationalContent> = [
  AMORTIZACAO_NIVEL_2,
  PRICE_NIVEL_2,
  SAC_NIVEL_2,
  COMPARACAO_NIVEL_2,
];
