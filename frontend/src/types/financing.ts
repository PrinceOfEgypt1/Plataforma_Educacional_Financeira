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

export interface FinanciamentoInputsNormalizados {
  readonly valor_imovel: MoneyString;
  readonly valor_entrada: MoneyString;
  readonly valor_financiado: MoneyString;
  readonly prazo_meses: number;
  readonly taxa_juros_mensal: RateString;
  readonly sistema_amortizacao: SistemaAmortizacao;
}

export interface FinanciamentoFormulaUsada {
  readonly nome: string;
  readonly expressao: string;
  readonly uso: string;
}

export interface FinanciamentoFonte {
  readonly nome: string;
  readonly tipo: string;
  readonly observacao: string;
}

export interface FinanciamentoChartPoint {
  readonly periodo: number;
  readonly valor: MoneyString;
}

export interface FinanciamentoJurosAmortizacaoPoint {
  readonly periodo: number;
  readonly juros: MoneyString;
  readonly amortizacao: MoneyString;
}

export interface FinanciamentoChartData {
  readonly saldo_devedor: ReadonlyArray<FinanciamentoChartPoint>;
  readonly prestacoes: ReadonlyArray<FinanciamentoChartPoint>;
  readonly juros_amortizacao: ReadonlyArray<FinanciamentoJurosAmortizacaoPoint>;
}

export interface FinanciamentoMemoriaCalculo {
  readonly metodo: SistemaAmortizacao;
  readonly entradas: FinanciamentoInputsNormalizados;
  readonly formula: string;
  readonly variaveis: Readonly<
    Record<string, MoneyString | RateString | number>
  >;
  readonly substituicao: string;
  readonly arredondamento: string;
  readonly primeira_parcela: FinanciamentoPeriodo;
  readonly ultima_parcela: FinanciamentoPeriodo;
  readonly custo_total: MoneyString;
  readonly resultado_final: Readonly<Record<string, MoneyString>>;
}

export interface FinanciamentoMetadadosCalculo {
  readonly moeda: string;
  readonly criterio_arredondamento: string;
  readonly linhas_tabela: number;
  readonly prazo_dinamico_respeitado: boolean;
  readonly contrato_educacional_api: string;
}

export interface FinanciamentoImobOut {
  readonly summary: FinanciamentoImobSummary;
  readonly parcelas: ReadonlyArray<FinanciamentoPeriodo>;
  readonly inputs_normalizados: FinanciamentoInputsNormalizados;
  readonly memoria_calculo: FinanciamentoMemoriaCalculo;
  readonly formulas_usadas: ReadonlyArray<FinanciamentoFormulaUsada>;
  readonly explicacoes_pedagogicas: ReadonlyArray<string>;
  readonly alertas: ReadonlyArray<string>;
  readonly fontes: ReadonlyArray<FinanciamentoFonte>;
  readonly limites: ReadonlyArray<string>;
  readonly metadados_calculo: FinanciamentoMetadadosCalculo;
  readonly mensagens_interface: ReadonlyArray<string>;
  readonly chart_data: FinanciamentoChartData;
}

export interface FinanciamentoProblem {
  readonly type?: string;
  readonly title?: string;
  readonly status?: number;
  readonly detail?: string;
  readonly code?: string;
}

export interface FinanciamentoImobCompareRequest {
  readonly valor_imovel: MoneyString;
  readonly valor_entrada: MoneyString;
  readonly prazo_meses: number;
  readonly taxa_juros_mensal_percentual: MoneyString;
  readonly seguro_mensal?: MoneyString;
  readonly tarifa_mensal?: MoneyString;
  readonly custo_administrativo_mensal?: MoneyString;
}

export interface FinanciamentoComparacaoEducacional {
  readonly diferenca_primeira_parcela: MoneyString;
  readonly diferenca_ultima_parcela: MoneyString;
  readonly diferenca_total_pago: MoneyString;
  readonly diferenca_total_juros: MoneyString;
  readonly comportamento_saldo_devedor: string;
  readonly explicacao_pedagogica: string;
  readonly recomendacoes: ReadonlyArray<string>;
}

export interface FinanciamentoImobCompareOut {
  readonly price: FinanciamentoImobOut;
  readonly sac: FinanciamentoImobOut;
  readonly comparacao: FinanciamentoComparacaoEducacional;
}
