/**
 * Glossário mínimo do módulo Diagnóstico Financeiro (Sprint 4 — F4).
 *
 * Os termos cobrem os campos de formulário, os KPIs do resultado e os
 * conceitos de saúde financeira exibidos na página `/diagnostico`.
 */

import type { GlossaryEntry } from "./types";

export const GLOSSARIO_MINIMO: ReadonlyArray<GlossaryEntry> = [
  {
    slug: "renda-mensal",
    term: "Renda mensal",
    shortDefinition: "Total líquido recebido por mês, antes de qualquer gasto.",
    fullDefinition:
      "Renda mensal é o valor líquido disponível em um mês típico: salário, " +
      "freelances, aluguéis recebidos e outras fontes regulares, já " +
      "descontados impostos e encargos. É a base do diagnóstico — todas " +
      "as proporções são calculadas em relação a ela.",
    example:
      "Se você recebe R$ 5.000 líquidos por mês, esse é o valor a " +
      "informar, não o salário bruto.",
    relatedModule: "diagnostic",
  },
  {
    slug: "despesa-fixa",
    term: "Despesa fixa",
    shortDefinition: "Gasto mensal previsível com valor estável.",
    fullDefinition:
      "Despesas fixas são comprometimentos mensais com valor determinado: " +
      "aluguel, prestação de financiamento, plano de saúde, mensalidade " +
      "escolar, assinaturas fixas. Elas chegam todo mês, independentemente " +
      "de escolhas ou hábitos.",
    example:
      "Aluguel de R$ 1.500 mais parcela do carro de R$ 800 somam " +
      "R$ 2.300 de despesas fixas.",
    relatedModule: "diagnostic",
  },
  {
    slug: "despesa-variavel",
    term: "Despesa variável",
    shortDefinition: "Gasto mensal que muda conforme hábitos e escolhas.",
    fullDefinition:
      "Despesas variáveis são os gastos que oscilam de mês para mês: " +
      "alimentação, transporte, lazer, vestuário, medicamentos esporádicos. " +
      "Elas dependem dos hábitos e podem ser ajustadas com mais facilidade " +
      "do que as despesas fixas.",
    example:
      "Supermercado de R$ 600, transporte de R$ 200 e lazer de R$ 300 " +
      "totalizam R$ 1.100 de despesas variáveis.",
    relatedModule: "diagnostic",
  },
  {
    slug: "divida-mensal",
    term: "Dívida mensal",
    shortDefinition:
      "Parcelas mensais de empréstimos, cartões ou financiamentos.",
    fullDefinition:
      "Dívida mensal é o total de parcelas pagas por mês em compromissos " +
      "de crédito: cartão de crédito rotativo, empréstimo pessoal, " +
      "crédito consignado, cheque especial. Elas diferem das despesas " +
      "fixas porque representam custo financeiro com encargos.",
    example:
      "Parcela de empréstimo de R$ 400 mais mínimo do cartão de R$ 300 " +
      "resultam em R$ 700 de dívidas mensais.",
    relatedModule: "diagnostic",
  },
  {
    slug: "reserva-emergencia",
    term: "Reserva de emergência",
    shortDefinition:
      "Valor guardado para cobrir imprevistos sem recorrer a crédito.",
    fullDefinition:
      "Reserva de emergência é o dinheiro disponível para cobrir situações " +
      "inesperadas: perda de renda, despesa médica não planejada, conserto " +
      "urgente. O diagnóstico mede a reserva em meses de despesas " +
      "essenciais, não apenas em reais, para facilitar a leitura.",
    example:
      "R$ 8.400 de reserva com despesas essenciais de R$ 2.800 por mês " +
      "equivalem a 3 meses de proteção.",
    relatedModule: "diagnostic",
  },
  {
    slug: "sobra-mensal",
    term: "Sobra mensal",
    shortDefinition: "O que resta da renda depois de pagar despesas e dívidas.",
    fullDefinition:
      "Sobra mensal é calculada pelo backend como: renda mensal menos " +
      "despesas fixas menos despesas variáveis menos dívidas mensais. " +
      "Sobra positiva indica que ainda há margem no orçamento. Sobra " +
      "negativa indica que os gastos superam a renda.",
    example:
      "Renda de R$ 5.000, despesas de R$ 2.800 e dívidas de R$ 500 " +
      "resultam em sobra de R$ 1.700.",
    relatedModule: "diagnostic",
  },
  {
    slug: "comprometimento-renda",
    term: "Comprometimento de renda",
    shortDefinition: "Percentual da renda comprometido com dívidas mensais.",
    fullDefinition:
      "Comprometimento de renda é a proporção da renda mensal destinada " +
      "ao pagamento de dívidas. É calculado como: total de dívidas " +
      "mensais dividido pela renda mensal, multiplicado por 100. Quanto " +
      "maior o percentual, menor a margem para despesas e imprevistos.",
    example:
      "R$ 500 de dívidas sobre renda de R$ 5.000 equivalem a " +
      "comprometimento de 10%.",
    relatedModule: "diagnostic",
  },
  {
    slug: "score-financeiro",
    term: "Score financeiro",
    shortDefinition:
      "Pontuação de 0 a 9 que resume as três dimensões do diagnóstico.",
    fullDefinition:
      "O score combina três pontuações parciais — comprometimento de renda, " +
      "reserva em meses e sobra mensal — cada uma valendo até 3 pontos. " +
      "A soma determina o nível de saúde financeira, com regras de " +
      "rebaixamento quando a sobra é negativa.",
    example:
      "Score 7 de 9 indica desempenho bom na maioria das dimensões, " +
      "com ao menos uma em nível intermediário.",
    relatedModule: "diagnostic",
  },
  {
    slug: "alerta-critico",
    term: "Alerta crítico",
    shortDefinition: "Sinal educacional de dimensão com risco elevado.",
    fullDefinition:
      "Alerta crítico é gerado quando uma dimensão ultrapassa um limiar " +
      "de risco elevado: reserva abaixo de 1 mês, comprometimento " +
      "acima de 40%, sobra negativa. Cada alerta tem um código estável " +
      "e indica qual dimensão precisa de atenção prioritária.",
    example:
      "RESERVA_CRITICA é emitido quando a reserva cobre menos de " +
      "1 mês de despesas essenciais.",
    relatedModule: "diagnostic",
  },
  {
    slug: "alerta-atencao",
    term: "Alerta de atenção",
    shortDefinition: "Sinal educacional de dimensão que merece acompanhamento.",
    fullDefinition:
      "Alerta de atenção (nível warning) é gerado quando uma dimensão " +
      "está em zona de atenção, mas sem risco imediato crítico: reserva " +
      "entre 1 e 3 meses, comprometimento entre 30% e 40%, sobra " +
      "positiva mas mínima.",
    example:
      "RESERVA_INSUFICIENTE é emitido quando a reserva cobre entre " +
      "1 e 3 meses de despesas.",
    relatedModule: "diagnostic",
  },
  {
    slug: "saude-financeira",
    term: "Saúde financeira",
    shortDefinition:
      "Nível geral derivado do score e das regras de rebaixamento.",
    fullDefinition:
      "Saúde financeira é a síntese qualitativa do diagnóstico. Varia de " +
      "crítica a ótima, com níveis intermediários: frágil, moderada e " +
      "boa. O nível é determinado pelo backend com base no score e em " +
      "regras de override — como rebaixamento automático quando a sobra " +
      "é negativa.",
    example:
      "Score 7 com sobra positiva resulta em saúde boa. Score 7 com " +
      "sobra negativa pode resultar em frágil, dependendo da reserva.",
    relatedModule: "diagnostic",
  },
  {
    slug: "diagnostico-financeiro",
    term: "Diagnóstico financeiro",
    shortDefinition: "Análise estruturada da situação financeira atual.",
    fullDefinition:
      "Diagnóstico financeiro é a análise que combina renda, despesas, " +
      "dívidas e reserva para produzir score, nível de saúde e alertas. " +
      "É educacional: mostra sinais da situação atual sem prescrever " +
      "decisões, sem prometer resultados e sem substituir análise " +
      "profissional.",
    example:
      "Um diagnóstico com score 3 e saúde crítica indica múltiplos " +
      "pontos de atenção; um com score 8 e saúde ótima indica equilíbrio " +
      "nas três dimensões.",
    relatedModule: "diagnostic",
  },
];
