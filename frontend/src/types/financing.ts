/**
 * Tipos espelhados do contrato `POST /api/v1/financing/real_estate`.
 *
 * O frontend não calcula amortizações. Estes tipos descrevem o shape
 * que a API devolve para que a UI possa formatar e renderizar os dados
 * com segurança de tipos.
 */

export type MoneyString = string;
export type RateString = string;

export type SistemaAmortizacao = "PRICE" | "SAC";

export interface FinanciamentoImobRequest {
  readonly valor_imovel: MoneyString;
  readonly valor_entrada: MoneyString;
  readonly prazo_meses: number;
  readonly taxa_juros_mensal_percentual: MoneyString;
  readonly sistema_amortizacao: SistemaAmortizacao;
  readonly seguro_mensal?: MoneyString;
  readonly tarifa_mensal?: MoneyString;
  readonly custo_administrativo_mensal?: MoneyString;
}

export interface FinanciamentoPeriodo {
  readonly numero: number;
  readonly saldo_inicial: MoneyString;
  readonly juros: MoneyString;
  readonly amortizacao: MoneyString;
  readonly encargos: MoneyString;
  readonly prestacao: MoneyString;
  readonly saldo_final: MoneyString;
}

export interface FinanciamentoImobSummary {
  readonly sistema_amortizacao: SistemaAmortizacao;
  readonly valor_imovel: MoneyString;
  readonly valor_entrada: MoneyString;
  readonly valor_financiado: MoneyString;
  readonly prazo_meses: number;
  readonly taxa_juros_mensal: RateString;
  readonly total_pago: MoneyString;
  readonly total_juros: MoneyString;
  readonly total_amortizado: MoneyString;
  readonly total_encargos: MoneyString;
  readonly custo_total: MoneyString;
  readonly primeira_parcela: MoneyString;
  readonly ultima_parcela: MoneyString;
}

export interface FinanciamentoImobOut {
  readonly summary: FinanciamentoImobSummary;
  readonly parcelas: ReadonlyArray<FinanciamentoPeriodo>;
}

export interface FinanciamentoProblem {
  readonly type?: string;
  readonly title?: string;
  readonly status?: number;
  readonly detail?: string;
  readonly code?: string;
}
