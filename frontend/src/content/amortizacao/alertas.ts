/**
 * Cuidados educacionais exibidos no módulo de Amortização.
 */

import type { EducationalAlert } from "./types";

export const CUIDADOS_EDUCACIONAIS: ReadonlyArray<EducationalAlert> = [
  {
    slug: "simulacao-nao-e-contrato",
    title: "Simulação não substitui contrato",
    description:
      "Os valores exibidos ajudam a entender PRICE e SAC, mas um contrato " +
      "real pode incluir tarifas, seguros, impostos, indexadores e regras " +
      "de vencimento que não estão nesta simulação.",
    severity: "warning",
  },
  {
    slug: "parcela-nao-e-custo-total",
    title: "Parcela não é custo total",
    description:
      "Uma parcela inicial menor pode facilitar a leitura do fluxo mensal, " +
      "mas o total pago e o total de juros mostram outra parte importante " +
      "da comparação.",
    severity: "info",
  },
  {
    slug: "taxa-prazo-sensiveis",
    title: "Taxa e prazo mudam muito o resultado",
    description:
      "Pequenas mudanças na taxa ou no número de períodos podem alterar " +
      "o custo total. Compare cenários mantendo claro o que mudou em cada " +
      "entrada.",
    severity: "info",
  },
  {
    slug: "centavos-fechamento",
    title: "Centavos precisam fechar a tabela",
    description:
      "A exibição arredonda valores monetários, mas a soma das linhas " +
      "continua coerente: juros mais amortização fecham a parcela, e o " +
      "saldo final deve chegar a R$ 0,00.",
    severity: "info",
  },
];
