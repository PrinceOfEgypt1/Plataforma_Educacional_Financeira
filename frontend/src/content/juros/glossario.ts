/**
 * Glossário mínimo do módulo de Juros (Sprint 2 — F5).
 *
 * Termos exigidos pelo PLANO Sprint 2 §5.5: juros, taxa, aporte, montante.
 * Acrescentamos os termos elementares que o módulo expõe ao usuário em
 * formulários e tabelas: juros simples, juros compostos, principal, prazo.
 *
 * Cada entrada segue o esquema de Doc 08 §13.
 */

import type { GlossaryEntry } from "./types";

export const GLOSSARIO_MINIMO: ReadonlyArray<GlossaryEntry> = [
  {
    slug: "juros",
    term: "Juros",
    shortDefinition:
      "Valor adicional cobrado pelo uso do dinheiro em um período.",
    fullDefinition:
      "Juros são o resultado de aplicar uma taxa sobre um saldo durante um " +
      "período. Em uma dívida, são o custo do crédito; em uma aplicação, " +
      "são o rendimento sobre o valor investido.",
    example:
      "Se a taxa é de 1% ao mês e o saldo do mês é R$ 1.000,00, os juros " +
      "do período são R$ 10,00.",
    relatedModule: "interest",
  },
  {
    slug: "juros-simples",
    term: "Juros simples",
    shortDefinition:
      "Juros calculados sempre sobre o valor inicial (o principal).",
    fullDefinition:
      "No regime simples, a taxa é aplicada sempre sobre o principal, " +
      "ignorando os juros já gerados. Por isso o crescimento do saldo é " +
      "linear: a mesma quantia de juros entra a cada período.",
    example:
      "Caso JS-01 do Doc 15: principal R$ 1.000,00, taxa 1% ao mês, prazo " +
      "12 meses → juros totais R$ 120,00, montante R$ 1.120,00.",
    relatedModule: "interest",
  },
  {
    slug: "juros-compostos",
    term: "Juros compostos",
    shortDefinition:
      "Juros calculados sobre o saldo já acumulado a cada período.",
    fullDefinition:
      "No regime composto, ao final de cada período os juros gerados " +
      "passam a fazer parte do saldo. No período seguinte, a taxa é " +
      "aplicada sobre esse saldo já corrigido. Esse mecanismo é a " +
      'capitalização — popularmente "juros sobre juros".',
    example:
      "Caso JC-01 do Doc 15: principal R$ 1.000,00, taxa 1% ao mês, prazo " +
      "12 meses → montante aproximado R$ 1.126,83.",
    relatedModule: "interest",
  },
  {
    slug: "principal",
    term: "Principal",
    shortDefinition: "Valor inicial sobre o qual o cálculo dos juros começa.",
    fullDefinition:
      "Principal é o ponto de partida de uma simulação: o capital aplicado " +
      "ou o saldo inicial de uma dívida. Aparece como entrada do " +
      "formulário e fica visível no resumo de cada simulação.",
    example: "Em JS-01 e JC-01, o principal é R$ 1.000,00.",
    relatedModule: "interest",
  },
  {
    slug: "taxa",
    term: "Taxa",
    shortDefinition:
      "Percentual aplicado sobre o saldo a cada período do cálculo.",
    fullDefinition:
      "Taxa é o percentual cobrado ou rendido por unidade de tempo. No " +
      "módulo, a taxa é mensal. O backend transporta a taxa como string " +
      'decimal de seis casas (por exemplo, "0.010000" representa 1% ao ' +
      "mês), o que evita perda de precisão na fronteira.",
    example: '1% ao mês → no contrato do backend: "0.010000".',
    relatedModule: "interest",
  },
  {
    slug: "prazo",
    term: "Prazo",
    shortDefinition: "Quantidade de períodos a serem simulados.",
    fullDefinition:
      "Prazo é o número de períodos sobre os quais o cálculo se desdobra. " +
      "No módulo de juros, o período é o mês; portanto o prazo é " +
      "expresso em meses.",
    example:
      "12 meses, em JS-01 e JC-01, equivalem a 12 linhas na tabela de " +
      "evolução.",
    relatedModule: "interest",
  },
  {
    slug: "montante",
    term: "Montante",
    shortDefinition: "Valor final do saldo ao término do prazo simulado.",
    fullDefinition:
      "Montante é o saldo total ao final do prazo. Inclui o principal, os " +
      "juros acumulados e — quando aplicável — os aportes feitos ao longo " +
      "do período. É o número que fecha o painel de resumo.",
    example:
      "JS-01: montante R$ 1.120,00. JC-01: montante aproximado " +
      "R$ 1.126,83.",
    relatedModule: "interest",
  },
  {
    slug: "aporte",
    term: "Aporte",
    shortDefinition:
      "Valor adicionado periodicamente ao saldo, fora do cálculo de juros.",
    fullDefinition:
      "Aporte é uma entrada de dinheiro novo no saldo, geralmente mensal. " +
      "Aporte não é juro: ele aumenta a base sobre a qual a taxa será " +
      "aplicada nos períodos seguintes, mas é registrado em coluna " +
      "separada na tabela de evolução.",
    example:
      "Caso JC-03 do Doc 15: aporte mensal de R$ 100,00 sobre principal " +
      "de R$ 1.000,00, com taxa de 1% ao mês.",
    relatedModule: "interest",
  },
];
