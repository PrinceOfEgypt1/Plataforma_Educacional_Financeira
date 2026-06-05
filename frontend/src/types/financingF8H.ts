/**
 * Tipos da camada de dados F8H do Simulador de Financiamento Imobiliário.
 *
 * ENTREGA ADITIVA E RETROCOMPATÍVEL:
 *   - Este arquivo é NOVO (`financingF8H.ts`). NÃO substitui nem remove
 *     `frontend/src/types/financing.ts` (contrato vivo do projeto).
 *   - Os aliases de contrato do backend derivam de `./openapiF8H` (gerado do
 *     OpenAPI 3.1.0 real), também NOVO, para não colidir com os tipos vivos.
 *   - Caso a F8H precise reaproveitar tipos vivos no futuro, pode importá-los
 *     de `./financing` — mas nunca removê-los/substituí-los.
 *
 * Governança: nenhum cálculo financeiro vive aqui. Tipos apenas.
 */

import type { components } from "./openapiF8H";

type Schemas = components["schemas"];

/* ------------------------------------------------------------------ */
/* Aliases de contrato do backend (sobre openapiF8H — NOVO/aditivo)    */
/* ------------------------------------------------------------------ */

/**
 * Encargos opcionais: têm `default` no servidor, então o cliente pode omiti-los.
 * O gerador os marca como presentes; tornamos opcionais para refletir o
 * contrato real (omissão é válida) — sem enfraquecer nenhuma validação.
 */
type EncargoKeys =
  | "seguro_mensal"
  | "tarifa_mensal"
  | "custo_administrativo_mensal"
  | "mip_mensal"
  | "dfi_dfc_mensal"
  | "taxa_administracao_mensal";

type RawComparePayload = Schemas["FinanciamentoImobCompareIn"];

/** Payload do POST /financing/real_estate/compare. */
export type ComparePayload = Omit<RawComparePayload, EncargoKeys> &
  Partial<Pick<RawComparePayload, EncargoKeys>>;

/** Envelope de resposta de sucesso da comparação. */
export type CompareResponse =
  Schemas["ResponseEnvelope_FinanciamentoImobCompareOut_"];

/** Carga útil tipada de `data` (price + sac + comparacao). */
export type CompareData = Schemas["FinanciamentoImobCompareOut"];

/** Resultado de um sistema (PRICE ou SAC): summary + parcelas + extras. */
export type BackendSystemOut = Schemas["FinanciamentoImobOut"];

/** Resumo (summary) de um sistema de amortização. */
export type BackendSummary = Schemas["FinanciamentoImobSummary"];

/** Linha de parcela (uma por período). */
export type BackendParcela = Schemas["FinanciamentoPeriodoRow"];

/** Comparação educacional PRICE x SAC. */
export type BackendComparacao = Schemas["FinanciamentoComparacaoEducacional"];

/** Metadados do envelope (request_id, version, generated_at). */
export type ResponseMeta = Schemas["Meta"];

/* ------------------------------------------------------------------ */
/* Entradas de UI                                                      */
/* ------------------------------------------------------------------ */

export interface UiEncargosInput {
  seguroMensal?: number;
  tarifaMensal?: number;
  custoAdministrativoMensal?: number;
  mipMensal?: number;
  dfiDfcMensal?: number;
  taxaAdministracaoMensal?: number;
}

export interface UiInputs {
  valorImovel: number;
  entrada: number;
  prazoMeses: number;
  /** Taxa mensal em DECIMAL (ex.: 0.0085 = 0,85% a.m.). */
  taxaMensal: number;
  /** Renda mensal — SOMENTE UI (comprometimento). Não vai ao backend. */
  renda: number;
  sistema: "SAC" | "PRICE";
  encargos?: UiEncargosInput;
}

/* ------------------------------------------------------------------ */
/* Contrato de UI CONGELADO (o adapter reproduz exatamente esta forma) */
/* ------------------------------------------------------------------ */

export interface UiRow {
  k: number; // número da parcela
  si: number; // saldo inicial
  j: number; // juros
  a: number; // amortização
  e: number; // encargos puros
  p: number; // prestação financeira (a + j), SEM encargos
  t: number; // prestação total (com encargos)
  sf: number; // saldo final
}

export interface UiSummary {
  system: "SAC" | "PRICE";
  PV: number; // valor financiado
  n: number; // prazo em meses
  i: number; // taxa MENSAL decimal
  E: number; // encargo mensal médio
  parcela1: number; // COM encargos
  parcelaN: number; // COM encargos
  parcela1SemEnc: number;
  parcelaN_SemEnc: number;
  parcelaMax: number; // agregação de exibição
  parcelaMin: number; // agregação de exibição
  jurosTotais: number;
  encargosTotais: number;
  totalPago: number;
  custoCredito: number;
  pctJuros: number; // razão de exibição
  taxaEfetivaAnual: number; // do backend (ex-"cetAno")
  rows: UiRow[];
}

export interface UiModel {
  inputs: {
    valorImovel: number;
    entrada: number;
    PV: number;
    n: number;
    i: number;
    E: number;
    renda: number;
  };
  pctEntrada: number;
  taxaAnual: number;
  sac: UiSummary;
  price: UiSummary;
  /** Vem de data.comparacao.diferenca_total_pago (não subtrair localmente). */
  economiaSACvsPRICE: number;
  comprometimento: (parcela: number) => number;
}
