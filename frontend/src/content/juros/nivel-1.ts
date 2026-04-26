/**
 * Conteúdo educacional — Nível 1 (Essencial) para o módulo de Juros.
 *
 * Critérios editoriais (Doc 08 §10):
 *   - Mínimo necessário para usar o módulo.
 *   - 2–3 minutos de leitura por bloco.
 *   - Linguagem direta, exemplos cotidianos, sem promessa de rendimento.
 *
 * Exemplos numéricos vêm de Doc 15 (JS-01 e JC-01) — não inventamos números.
 */

import { DISCLAIMER_EDUCACIONAL, type EducationalContent } from "./types";

const JUROS_SIMPLES_NIVEL_1: EducationalContent = {
  slug: "juros-simples",
  version: "1.0.0",
  level: "nivel-1",
  title: "Juros simples — em uma frase",
  paragraphs: [
    "Juros simples são juros que incidem sempre sobre o valor inicial " +
      "(o principal). Mesmo passando o tempo, o cálculo de cada período " +
      "ignora os juros já acumulados.",
    "Por isso o crescimento é linear: a cada mês entra a mesma quantia de " +
      "juros. É como se você somasse parcelas iguais à sua dívida ou ao " +
      "seu saldo, mês a mês.",
    "Exemplo do caso JS-01 do Doc 15: principal de R$ 1.000,00, taxa de " +
      "1% ao mês, prazo de 12 meses. Os juros totais são R$ 120,00 e o " +
      "montante final é R$ 1.120,00.",
    "Os termos que aparecem nas telas são: principal (o valor inicial), " +
      "taxa (o percentual cobrado por período), prazo (quantos períodos) " +
      "e montante (o valor final).",
  ],
  disclaimer: DISCLAIMER_EDUCACIONAL,
};

const JUROS_COMPOSTOS_NIVEL_1: EducationalContent = {
  slug: "juros-compostos",
  version: "1.0.0",
  level: "nivel-1",
  title: "Juros compostos — em uma frase",
  paragraphs: [
    "Juros compostos são juros que, a cada novo período, passam a incidir " +
      "sobre o saldo já acumulado — e não apenas sobre o principal. " +
      'Por isso costumam aparecer descritos como "juros sobre juros".',
    "O efeito prático é que o crescimento não é mais linear: ele acelera " +
      "ao longo do tempo, mesmo quando a taxa é a mesma dos juros simples.",
    "Exemplo do caso JC-01 do Doc 15: principal de R$ 1.000,00, taxa de " +
      "1% ao mês, prazo de 12 meses. O montante final fica em " +
      "aproximadamente R$ 1.126,83 — um pouco acima dos R$ 1.120,00 " +
      "obtidos no caso correspondente de juros simples.",
    "A diferença começa pequena e cresce conforme o prazo aumenta: " +
      "este é o efeito que o módulo ajuda a visualizar nos gráficos e " +
      "nas tabelas de evolução.",
  ],
  disclaimer: DISCLAIMER_EDUCACIONAL,
};

const COMPARACAO_NIVEL_1: EducationalContent = {
  slug: "comparacao-juros",
  version: "1.0.0",
  level: "nivel-1",
  title: "Comparação — quando os compostos superam os simples",
  paragraphs: [
    "Para taxas e prazos iguais, o montante composto fica sempre maior " +
      "ou igual ao montante simples. A diferença é zero quando o prazo é " +
      "muito curto e cresce conforme o prazo aumenta.",
    "Em prazos curtos, a diferença é pequena e pode passar despercebida. " +
      "Em prazos longos, ela tende a se tornar muito relevante.",
    "Em uma dívida, isso significa que pagar mais cedo costuma reduzir " +
      "o efeito da capitalização. Em uma aplicação, manter o valor " +
      "investido por mais tempo costuma aumentar esse mesmo efeito.",
    "Como este é um módulo educacional, ele não recomenda decisões: " +
      "ele mostra os números lado a lado para que você possa entender " +
      "o que está acontecendo.",
  ],
  disclaimer: DISCLAIMER_EDUCACIONAL,
};

const APORTES_NIVEL_1: EducationalContent = {
  slug: "aportes-mensais",
  version: "1.0.0",
  level: "nivel-1",
  title: "Aportes mensais — entrando dinheiro novo no caminho",
  paragraphs: [
    "Aporte mensal é um valor que entra no saldo a cada período, somado " +
      "ao principal. Ele aumenta a base sobre a qual o cálculo passa a " +
      "incidir nos períodos seguintes.",
    "Aporte não é juro. Aporte é dinheiro novo que você coloca; juro é " +
      "o resultado do cálculo aplicado sobre o saldo. As duas coisas " +
      "aparecem em colunas separadas na tabela de evolução.",
    "Quando há aporte mensal, o saldo final passa a ser composto por " +
      "três parcelas: o principal inicial, o total aportado ao longo do " +
      "período e os juros acumulados.",
    "Aumentar o aporte aumenta o total investido, mas não muda a taxa. " +
      "A taxa continua a mesma — o que muda é o tamanho do saldo sobre " +
      "o qual ela é aplicada.",
  ],
  disclaimer: DISCLAIMER_EDUCACIONAL,
};

export const CONTEUDO_NIVEL_1: ReadonlyArray<EducationalContent> = [
  JUROS_SIMPLES_NIVEL_1,
  JUROS_COMPOSTOS_NIVEL_1,
  COMPARACAO_NIVEL_1,
  APORTES_NIVEL_1,
];
