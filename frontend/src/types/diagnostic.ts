/**
 * Tipos espelhados do contrato `POST /api/v1/diagnostic/analyze`.
 *
 * O frontend não calcula score, saúde, comprometimento nem reserva.
 * Estes tipos descrevem o shape que a API devolve para que a UI possa
 * formatar e renderizar os dados com segurança de tipos.
 */

export type MoneyString = string;

export type NivelComprometimento = "baixo" | "medio" | "alto" | "critico";
export type NivelReserva = "insuficiente" | "adequada" | "boa" | "excelente";
export type NivelSobra = "negativa" | "baixa" | "boa" | "excelente";
export type NivelSaude = "critica" | "ruim" | "regular" | "boa" | "excelente";
export type DiagnosticAlertLevel = "warning" | "critical";

export interface DiagnosticAlert {
  readonly code: string;
  readonly level: DiagnosticAlertLevel;
  readonly dimension: string;
}

export interface DiagnosticAnalyzeRequest {
  readonly renda_mensal: MoneyString;
  readonly total_despesas_fixas: MoneyString;
  readonly total_despesas_variaveis: MoneyString;
  readonly total_dividas_mensais: MoneyString;
  readonly total_reserva_atual: MoneyString;
}

export interface DiagnosticAnalyzeResponseData {
  readonly renda_mensal: MoneyString;
  readonly total_despesas_fixas: MoneyString;
  readonly total_despesas_variaveis: MoneyString;
  readonly total_dividas_mensais: MoneyString;
  readonly total_reserva_atual: MoneyString;
  readonly sobra_mensal: MoneyString;
  readonly despesas_essenciais_mensais: MoneyString;
  readonly comprometimento_percentual: MoneyString;
  readonly sobra_percentual: MoneyString;
  readonly reserva_em_meses: MoneyString;
  readonly comprometimento_nivel: NivelComprometimento;
  readonly reserva_nivel: NivelReserva;
  readonly sobra_nivel: NivelSobra;
  readonly pontos_comprometimento: number;
  readonly pontos_reserva: number;
  readonly pontos_sobra: number;
  readonly score: number;
  readonly saude_nivel: NivelSaude;
  readonly alertas: ReadonlyArray<DiagnosticAlert>;
}

export interface DiagnosticProblem {
  readonly type?: string;
  readonly title?: string;
  readonly status?: number;
  readonly detail?: string;
  readonly code?: string;
}
