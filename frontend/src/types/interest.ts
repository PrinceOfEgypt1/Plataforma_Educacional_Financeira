/**
 * Tipos espelhados — contratos F3 `/api/v1/interest/*`.
 *
 * Decisão de contrato (Doc 06 §4.3, §5.3 — PLANO v1.2):
 *   - Monetários são STRINGS com 2 casas decimais (`"1000.00"`).
 *   - Taxas são STRINGS com 6 casas decimais (`"0.010000"`).
 *   - NUNCA converter para `number` antes de exibir — perda de
 *     precisão. Use as helpers de `@/lib/money` para parse/format
 *     apenas na fronteira de apresentação.
 *   - Forma canônica de `data`:
 *     `{ summary, tables, charts, interpretation, alerts }`.
 *   - Em `/compare`, `tables` é um objeto composto (`TablesComparar`)
 *     com chaves estáveis `simple` e `compound`.
 *
 * Este arquivo NÃO reimplementa regra de negócio. Ele tipa o que o
 * backend devolve. Qualquer divergência entre estes tipos e o
 * backend é bug — o backend é a fonte da verdade.
 */

/** Dinheiro em BRL. String decimal com 2 casas (ex.: `"1000.00"`). */
export type MoneyString = string;

/** Taxa como decimal puro. String com 6 casas (ex.: `"0.010000"`). */
export type RateString = string;

// ────────────────────────────────────────────────────────────────
// Linhas das tabelas
// ────────────────────────────────────────────────────────────────

export interface PeriodoSimplesRow {
  readonly periodo: number;
  readonly saldo_inicial: MoneyString;
  readonly juros_periodo: MoneyString;
  readonly saldo_final: MoneyString;
}

export interface PeriodoCompostoRow {
  readonly periodo: number;
  readonly saldo_inicial: MoneyString;
  readonly juros_periodo: MoneyString;
  readonly aporte: MoneyString;
  readonly saldo_final: MoneyString;
}

// ────────────────────────────────────────────────────────────────
// Summary — por regime
// ────────────────────────────────────────────────────────────────

export interface SummarySimples {
  readonly principal: MoneyString;
  readonly taxa_mensal: RateString;
  readonly prazo_meses: number;
  readonly juros_totais: MoneyString;
  readonly montante_final: MoneyString;
}

export interface SummaryCompostos {
  readonly principal: MoneyString;
  readonly taxa_mensal: RateString;
  readonly prazo_meses: number;
  readonly aporte_mensal: MoneyString;
  readonly juros_totais: MoneyString;
  readonly total_aportado: MoneyString;
  readonly total_investido: MoneyString;
  readonly montante_final: MoneyString;
}

export interface SummaryComparar {
  readonly principal: MoneyString;
  readonly taxa_mensal: RateString;
  readonly prazo_meses: number;
  readonly montante_simples: MoneyString;
  readonly montante_composto: MoneyString;
  readonly diferenca: MoneyString;
  /** `montante_composto / montante_simples` como string com 6 casas. */
  readonly razao: string;
}

// ────────────────────────────────────────────────────────────────
// Charts
// ────────────────────────────────────────────────────────────────

export type ChartKind = "simples" | "composto";

export interface ChartSeries {
  readonly label: string;
  readonly kind: ChartKind;
  /** Saldo ao final de cada período. `points.length === prazo_meses`. */
  readonly points: ReadonlyArray<MoneyString>;
}

export interface Chart {
  readonly x_label: string;
  readonly y_label: string;
  readonly series: ReadonlyArray<ChartSeries>;
}

// ────────────────────────────────────────────────────────────────
// Interpretation + Alerts
// ────────────────────────────────────────────────────────────────

export interface Interpretation {
  readonly headline: string;
  readonly body: string;
}

export type AlertSeverity = "info" | "warning";

export interface InterestAlert {
  readonly code: string;
  readonly severity: AlertSeverity;
  readonly message: string;
}

// ────────────────────────────────────────────────────────────────
// Compare — tables compostas
// ────────────────────────────────────────────────────────────────

export interface TablesComparar {
  readonly simple: ReadonlyArray<PeriodoSimplesRow>;
  readonly compound: ReadonlyArray<PeriodoCompostoRow>;
}

// ────────────────────────────────────────────────────────────────
// Payloads de entrada (request body)
// ────────────────────────────────────────────────────────────────

export interface JurosSimplesIn {
  readonly principal: MoneyString;
  readonly taxa_mensal: RateString;
  readonly prazo_meses: number;
}

export interface JurosCompostosIn {
  readonly principal: MoneyString;
  readonly taxa_mensal: RateString;
  readonly prazo_meses: number;
  /** Opcional: ausente ou `null` = sem aporte. */
  readonly aporte_mensal?: MoneyString | null;
}

export interface CompararJurosIn {
  readonly principal: MoneyString;
  readonly taxa_mensal: RateString;
  readonly prazo_meses: number;
}

// ────────────────────────────────────────────────────────────────
// Cargas úteis de saída (data do envelope)
// ────────────────────────────────────────────────────────────────

/** Chave canônica das tabelas em `/simple` e `/compound`. */
export const AMORTIZACAO_KEY = "amortizacao" as const;

export interface JurosSimplesOut {
  readonly summary: SummarySimples;
  readonly tables: Readonly<Record<string, ReadonlyArray<PeriodoSimplesRow>>>;
  readonly charts: ReadonlyArray<Chart>;
  readonly interpretation: Interpretation;
  readonly alerts: ReadonlyArray<InterestAlert>;
}

export interface JurosCompostosOut {
  readonly summary: SummaryCompostos;
  readonly tables: Readonly<Record<string, ReadonlyArray<PeriodoCompostoRow>>>;
  readonly charts: ReadonlyArray<Chart>;
  readonly interpretation: Interpretation;
  readonly alerts: ReadonlyArray<InterestAlert>;
}

export interface CompararJurosOut {
  readonly summary: SummaryComparar;
  readonly tables: TablesComparar;
  readonly charts: ReadonlyArray<Chart>;
  readonly interpretation: Interpretation;
  readonly alerts: ReadonlyArray<InterestAlert>;
}
