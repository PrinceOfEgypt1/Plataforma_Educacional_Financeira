/**
 * Tipos espelhados dos contratos `/api/v1/amortization/*`.
 *
 * O frontend nao calcula PRICE/SAC. Estes tipos descrevem o shape que a API
 * devolve para que a UI possa validar, formatar e renderizar os dados com
 * seguranca de tipos.
 */

export type MoneyString = string;
export type RateString = string;

export type AmortizationSystem = "PRICE" | "SAC";

export interface AmortizationIn {
  readonly principal: MoneyString;
  readonly taxa_periodo: RateString;
  readonly n_periodos: number;
}

export type PriceIn = AmortizationIn;
export type SacIn = AmortizationIn;
export type CompareAmortizationIn = AmortizationIn;

export interface AmortizationPeriodRow {
  readonly periodo: number;
  readonly saldo_inicial: MoneyString;
  readonly juros: MoneyString;
  readonly amortizacao: MoneyString;
  readonly parcela: MoneyString;
  readonly saldo_final: MoneyString;
}

export interface PriceSummary {
  readonly sistema: "PRICE";
  readonly principal: MoneyString;
  readonly taxa_periodo: RateString;
  readonly n_periodos: number;
  readonly parcela: MoneyString;
  readonly total_pago: MoneyString;
  readonly total_juros: MoneyString;
  readonly saldo_final: MoneyString;
}

export interface SacSummary {
  readonly sistema: "SAC";
  readonly principal: MoneyString;
  readonly taxa_periodo: RateString;
  readonly n_periodos: number;
  readonly amortizacao_constante: MoneyString;
  readonly parcela_inicial: MoneyString;
  readonly parcela_final: MoneyString;
  readonly total_pago: MoneyString;
  readonly total_juros: MoneyString;
  readonly saldo_final: MoneyString;
}

export type BetterAmortizationCost = "PRICE" | "SAC" | "EMPATE";

export interface CompareAmortizationSummary {
  readonly principal: MoneyString;
  readonly taxa_periodo: RateString;
  readonly n_periodos: number;
  readonly price: PriceSummary;
  readonly sac: SacSummary;
  readonly diferenca_juros: MoneyString;
  readonly diferenca_total_pago: MoneyString;
  readonly menor_total_juros: BetterAmortizationCost;
}

export type AmortizationChartKind = "price" | "sac";

export interface AmortizationChartSeries {
  readonly label: string;
  readonly kind: AmortizationChartKind;
  readonly points: ReadonlyArray<MoneyString>;
}

export interface AmortizationChart {
  readonly x_label: string;
  readonly y_label: string;
  readonly series: ReadonlyArray<AmortizationChartSeries>;
}

export interface AmortizationInterpretation {
  readonly headline: string;
  readonly body: string;
}

export type AmortizationAlertSeverity = "info" | "warning";

export interface AmortizationAlert {
  readonly code: string;
  readonly severity: AmortizationAlertSeverity;
  readonly message: string;
}

export const AMORTIZATION_TABLE_KEY = "amortizacao" as const;

export interface PriceOut {
  readonly summary: PriceSummary;
  readonly tables: Readonly<
    Record<string, ReadonlyArray<AmortizationPeriodRow>>
  >;
  readonly charts: ReadonlyArray<AmortizationChart>;
  readonly interpretation: AmortizationInterpretation;
  readonly alerts: ReadonlyArray<AmortizationAlert>;
}

export interface SacOut {
  readonly summary: SacSummary;
  readonly tables: Readonly<
    Record<string, ReadonlyArray<AmortizationPeriodRow>>
  >;
  readonly charts: ReadonlyArray<AmortizationChart>;
  readonly interpretation: AmortizationInterpretation;
  readonly alerts: ReadonlyArray<AmortizationAlert>;
}

export interface CompareAmortizationTables {
  readonly price: ReadonlyArray<AmortizationPeriodRow>;
  readonly sac: ReadonlyArray<AmortizationPeriodRow>;
}

export interface CompareAmortizationOut {
  readonly summary: CompareAmortizationSummary;
  readonly tables: CompareAmortizationTables;
  readonly charts: ReadonlyArray<AmortizationChart>;
  readonly interpretation: AmortizationInterpretation;
  readonly alerts: ReadonlyArray<AmortizationAlert>;
}
