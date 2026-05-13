export type MoneyString = string;
export type RateString = string;

export type SistemaAmortizacao = "PRICE" | "SAC";

export interface FinanciamentoImobRequest {
  readonly valor_imovel: MoneyString;
  readonly valor_entrada: MoneyString;
  readonly prazo_meses: number;
  readonly taxa_juros_mensal_percentual: MoneyString;
  readonly sistema_amortizacao: SistemaAmortizacao;
  // Legados (retrocompat)
  readonly seguro_mensal?: MoneyString;
  readonly tarifa_mensal?: MoneyString;
  readonly custo_administrativo_mensal?: MoneyString;
  // Granulares
  readonly mip_mensal?: MoneyString;
  readonly dfi_dfc_mensal?: MoneyString;
  readonly taxa_administracao_mensal?: MoneyString;
}

export interface FinanciamentoPeriodo {
  readonly numero: number;
  readonly saldo_inicial: MoneyString;
  readonly juros: MoneyString;
  readonly amortizacao: MoneyString;
  readonly prestacao_financeira: MoneyString; // juros + amortizacao
  readonly mip_mensal: MoneyString; // MIP individual
  readonly dfi_dfc_mensal: MoneyString; // DFI/DFC individual
  readonly seguros_nao_discriminados: boolean; // true se só legado
  readonly seguro_mensal: MoneyString; // mip + dfi (ou legado)
  readonly taxa_administracao_mensal: MoneyString; // taxa adm (não é seguro)
  readonly tarifa_mensal: MoneyString; // alias retrocompat
  readonly custo_admin_mensal: MoneyString; // outros
  readonly encargos: MoneyString; // seguros + taxa + custo_admin
  readonly encargo_mensal_total: MoneyString; // prestacao + encargos
  readonly prestacao: MoneyString; // alias retrocompat
  readonly saldo_final: MoneyString;
}

export interface FinanciamentoImobSummary {
  readonly sistema_amortizacao: SistemaAmortizacao;
  readonly valor_imovel: MoneyString;
  readonly valor_entrada: MoneyString;
  readonly valor_financiado: MoneyString;
  readonly prazo_meses: number;
  readonly taxa_juros_mensal: RateString;
  // Taxas anuais (6 casas decimais)
  readonly taxa_juros_anual_nominal: RateString;
  readonly taxa_juros_anual_efetiva: RateString;
  // Prestação financeira (sem encargos acessórios)
  readonly primeira_prestacao_financeira: MoneyString;
  readonly ultima_prestacao_financeira: MoneyString;
  // Encargo mensal total (com encargos)
  readonly primeiro_encargo_mensal_total: MoneyString;
  readonly ultimo_encargo_mensal_total: MoneyString;
  // Totais
  readonly total_pago: MoneyString;
  readonly total_juros: MoneyString;
  readonly total_amortizado: MoneyString;
  readonly total_mip: MoneyString;
  readonly total_dfi_dfc: MoneyString;
  readonly total_seguros: MoneyString;
  readonly total_tarifas: MoneyString;
  readonly total_custo_admin: MoneyString;
  readonly seguros_nao_discriminados: boolean;
  readonly total_encargos: MoneyString;
  readonly custo_total: MoneyString;
  readonly custo_financeiro_total: MoneyString;
  // Retrocompat
  readonly primeira_parcela: MoneyString;
  readonly ultima_parcela: MoneyString;
}

export type ComponenteCetNatureza =
  | "calculado"
  | "informado"
  | "nao_calculado"
  | "alerta";

export type ComponenteCetCategoria =
  | "base_operacao"
  | "componente_encargo"
  | "componente_cet"
  | "custo_inicial"
  | "totalizador_indicador";

export interface ComponenteCet {
  readonly id: string;
  readonly nome: string;
  readonly natureza: ComponenteCetNatureza;
  readonly categoria: ComponenteCetCategoria;
  readonly valor_total: MoneyString;
  readonly valor_mensal_referencia: MoneyString;
  readonly pct_sobre_financiado: RateString;
  readonly pct_sobre_total_pago: RateString;
  readonly pct_sobre_custo_financeiro_total: RateString;
  readonly entra_no_encargo_mensal: boolean;
  readonly entra_no_custo_total_educacional: boolean;
  readonly formula: string;
  readonly explicacao: string;
}

export interface AnatomiaEncargo {
  readonly amortizacao: MoneyString;
  readonly juros: MoneyString;
  readonly prestacao_financeira: MoneyString;
  readonly mip_mensal: MoneyString;
  readonly dfi_dfc_mensal: MoneyString;
  readonly seguros_total: MoneyString;
  readonly seguros_nao_discriminados: boolean;
  readonly taxa_administracao_mensal: MoneyString;
  readonly custo_admin_mensal: MoneyString;
  readonly componentes_acessorios: MoneyString;
  readonly encargo_mensal_total: MoneyString;
  // Aliases legados
  readonly seguro_mensal: MoneyString;
  readonly tarifa_mensal: MoneyString;
  readonly encargos: MoneyString;
  // Percentuais
  readonly pct_amortizacao: RateString;
  readonly pct_juros: RateString;
  readonly pct_prestacao_financeira: RateString;
  readonly pct_mip: RateString;
  readonly pct_dfi_dfc: RateString;
  readonly pct_seguros: RateString;
  readonly pct_taxa_administracao: RateString;
  readonly pct_custo_admin: RateString;
  readonly pct_encargos: RateString;
  readonly pct_seguro: RateString;
  readonly pct_tarifa: RateString;
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
  readonly anatomia_encargo: AnatomiaEncargo;
  readonly componentes_cet: ReadonlyArray<ComponenteCet>;
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
  readonly diferenca_primeira_prestacao_financeira: MoneyString;
  readonly diferenca_ultima_prestacao_financeira: MoneyString;
  readonly diferenca_primeiro_encargo_mensal: MoneyString;
  readonly diferenca_ultimo_encargo_mensal: MoneyString;
  readonly diferenca_total_pago: MoneyString;
  readonly diferenca_total_juros: MoneyString;
  // Retrocompat
  readonly diferenca_primeira_parcela: MoneyString;
  readonly diferenca_ultima_parcela: MoneyString;
  readonly comportamento_saldo_devedor: string;
  readonly explicacao_pedagogica: string;
  readonly interpretacao_dinamica: string;
  readonly recomendacoes: ReadonlyArray<string>;
}

export interface FinanciamentoImobCompareOut {
  readonly price: FinanciamentoImobOut;
  readonly sac: FinanciamentoImobOut;
  readonly comparacao: FinanciamentoComparacaoEducacional;
}
