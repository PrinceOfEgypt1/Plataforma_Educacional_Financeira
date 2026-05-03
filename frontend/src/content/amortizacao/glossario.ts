/**
 * Glossário mínimo do módulo de Amortização (Sprint 3 — F5).
 *
 * Os termos cobrem os campos de formulário, resumo, tabela e comparação
 * exibidos na página `/amortizacao`.
 */

import type { GlossaryEntry } from "./types";

export const GLOSSARIO_MINIMO: ReadonlyArray<GlossaryEntry> = [
  {
    slug: "principal",
    term: "Principal",
    shortDefinition: "Valor financiado que será amortizado ao longo do prazo.",
    fullDefinition:
      "Principal é o valor inicial da dívida na simulação. Ele aparece no " +
      "formulário como valor financiado e deve ser totalmente reduzido " +
      "pela soma das amortizações até o saldo final.",
    example: "No caso PR-01/SAC-01 do Doc 15, o principal é R$ 100.000,00.",
    relatedModule: "amortization",
  },
  {
    slug: "taxa-periodo",
    term: "Taxa por período",
    shortDefinition:
      "Percentual aplicado sobre o saldo devedor em cada período.",
    fullDefinition:
      "Taxa por período é o percentual usado para calcular os juros de " +
      "cada linha da tabela. Na tela, a taxa é informada pelo usuário e " +
      "enviada ao backend como decimal.",
    example: "1% ao mês corresponde ao decimal 0.010000 no contrato da API.",
    relatedModule: "amortization",
  },
  {
    slug: "numero-periodos",
    term: "Número de períodos",
    shortDefinition: "Quantidade de parcelas ou linhas da simulação.",
    fullDefinition:
      "Número de períodos é o prazo usado para montar a tabela de " +
      "amortização. Cada período gera uma linha com saldo inicial, juros, " +
      "amortização, parcela e saldo final.",
    example: "Prazo de 12 períodos gera 12 linhas na tabela.",
    relatedModule: "amortization",
  },
  {
    slug: "parcela",
    term: "Parcela",
    shortDefinition: "Valor pago em um período da simulação.",
    fullDefinition:
      "Parcela é a soma dos juros do período com a amortização do período. " +
      "Na PRICE ela permanece constante; no SAC ela tende a diminuir.",
    example:
      "Na primeira linha PRICE do caso PR-01, R$ 1.000,00 de juros + " +
      "R$ 7.884,88 de amortização = R$ 8.884,88 de parcela.",
    relatedModule: "amortization",
  },
  {
    slug: "juros",
    term: "Juros",
    shortDefinition:
      "Custo financeiro calculado sobre o saldo devedor do período.",
    fullDefinition:
      "Juros são calculados aplicando a taxa por período sobre o saldo " +
      "devedor. Eles compõem a parcela, mas não reduzem o principal.",
    example:
      "Com saldo devedor de R$ 100.000,00 e taxa de 1% ao mês, os juros " +
      "da primeira linha são R$ 1.000,00.",
    relatedModule: "amortization",
  },
  {
    slug: "amortizacao",
    term: "Amortização",
    shortDefinition: "Parte da parcela que reduz o saldo devedor.",
    fullDefinition:
      "Amortização é a fração da parcela que abate o principal. A soma " +
      "das amortizações da tabela deve fechar o valor financiado.",
    example:
      "No SAC-01, a amortização base fica em R$ 8.333,33 por período, com " +
      "ajuste de centavos no fechamento final.",
    relatedModule: "amortization",
  },
  {
    slug: "saldo-devedor",
    term: "Saldo devedor",
    shortDefinition: "Valor do principal que ainda falta amortizar.",
    fullDefinition:
      "Saldo devedor é o valor remanescente da dívida depois de cada " +
      "amortização. Ele serve como base para calcular os juros do período " +
      "seguinte.",
    example:
      "Depois da primeira parcela PRICE do caso PR-01, o saldo exibido é " +
      "R$ 92.115,12.",
    relatedModule: "amortization",
  },
  {
    slug: "total-pago",
    term: "Total pago",
    shortDefinition: "Soma de todas as parcelas da simulação.",
    fullDefinition:
      "Total pago é a soma das parcelas de todos os períodos. Ele inclui " +
      "o principal amortizado e os juros pagos ao longo do prazo.",
    example: "No PR-01, o total pago PRICE é R$ 106.618,53.",
    relatedModule: "amortization",
  },
  {
    slug: "total-juros",
    term: "Total de juros",
    shortDefinition: "Soma dos juros cobrados em todos os períodos.",
    fullDefinition:
      "Total de juros é a parcela do total pago que representa custo " +
      "financeiro. Ele ajuda a comparar sistemas com o mesmo principal, " +
      "taxa e prazo.",
    example:
      "No PR-01/SAC-01, os totais de juros são R$ 6.618,53 na PRICE e " +
      "R$ 6.500,00 no SAC.",
    relatedModule: "amortization",
  },
  {
    slug: "saldo-final",
    term: "Saldo final",
    shortDefinition: "Saldo devedor depois da última parcela.",
    fullDefinition:
      "Saldo final é o saldo devedor ao fim da simulação. Em uma tabela " +
      "financeiramente fechada, ele deve ser R$ 0,00.",
    example: "Nos casos PR-01 e SAC-01, o saldo final exibido é R$ 0,00.",
    relatedModule: "amortization",
  },
  {
    slug: "price",
    term: "PRICE",
    shortDefinition: "Sistema de amortização com parcela constante.",
    fullDefinition:
      "PRICE calcula uma prestação constante e altera a composição entre " +
      "juros e amortização ao longo do prazo. A amortização cresce conforme " +
      "o saldo devedor diminui.",
    example: "No PR-01, a parcela PRICE é R$ 8.884,88.",
    relatedModule: "amortization",
  },
  {
    slug: "sac",
    term: "SAC",
    shortDefinition: "Sistema de amortização com amortização constante.",
    fullDefinition:
      "SAC mantém a amortização do principal praticamente constante. Como " +
      "o saldo cai mais cedo, os juros e as parcelas tendem a diminuir.",
    example:
      "No SAC-01, a parcela inicial é R$ 9.333,33 e a parcela final é " +
      "R$ 8.416,70.",
    relatedModule: "amortization",
  },
];
