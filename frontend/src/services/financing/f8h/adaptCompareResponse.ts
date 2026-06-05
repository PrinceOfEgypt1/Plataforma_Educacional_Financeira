/**
 * adaptCompareResponse (F8H) — função PURA: CompareResponse → UiModel.
 *
 * Governança (inegociável):
 *   - NÃO recalcula SAC/PRICE/CET/juros/amortização. Valores financeiros vêm
 *     do backend; aqui só há leitura, parsing decimal e agregações de
 *     EXIBIÇÃO (max/min/razões), nunca fórmulas de amortização.
 *   - Não faz fetch. Toda tradução backend↔UI vive somente aqui.
 *   - Valores ausentes recebem fallback seguro/explícito, sem inventar cálculo.
 */

import type {
  BackendComparacao,
  BackendParcela,
  BackendSummary,
  BackendSystemOut,
  CompareResponse,
  UiInputs,
  UiModel,
  UiRow,
  UiSummary,
} from "../../../types/financingF8H";

/** String decimal do backend → number, validando. Fallback explícito (default 0). */
function dec(value: string | number | null | undefined, fallback = 0): number {
  if (value === null || value === undefined) return fallback;
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) {
    throw new Error(
      `adaptCompareResponse(F8H): decimal inválido: ${String(value)}`,
    );
  }
  return n;
}

function toRow(p: BackendParcela): UiRow {
  return {
    k: p.numero,
    si: dec(p.saldo_inicial),
    j: dec(p.juros),
    a: dec(p.amortizacao),
    e: dec(p.encargos), // encargos puros (0 hoje: seguros_nao_discriminados)
    p: dec(p.prestacao_financeira), // SEM encargos (a + j)
    t: dec(p.prestacao), // total (== encargo_mensal_total)
    sf: dec(p.saldo_final),
  };
}

function adaptSummary(system: BackendSystemOut): UiSummary {
  const s: BackendSummary = system.summary;
  const parcelas: BackendParcela[] = system.parcelas ?? [];
  const rows = parcelas.map(toRow);

  const totalsT = rows.map((r) => r.t);
  const parcelaMax = totalsT.length ? Math.max(...totalsT) : 0;
  const parcelaMin = totalsT.length ? Math.min(...totalsT) : 0;

  const totalPago = dec(s.total_pago);
  const totalJuros = dec(s.total_juros);

  return {
    system: s.sistema_amortizacao as "SAC" | "PRICE",
    PV: dec(s.valor_financiado),
    n: s.prazo_meses,
    i: dec(s.taxa_juros_mensal), // JÁ decimal — não dividir por 100
    E: s.prazo_meses > 0 ? dec(s.total_encargos) / s.prazo_meses : 0,
    parcela1SemEnc: dec(s.primeira_prestacao_financeira),
    parcelaN_SemEnc: dec(s.ultima_prestacao_financeira),
    parcela1: dec(s.primeira_parcela),
    parcelaN: dec(s.ultima_parcela),
    parcelaMax,
    parcelaMin,
    jurosTotais: totalJuros,
    encargosTotais: dec(s.total_encargos),
    totalPago,
    custoCredito: dec(s.custo_total),
    pctJuros: totalPago > 0 ? totalJuros / totalPago : 0,
    taxaEfetivaAnual: dec(s.taxa_juros_anual_efetiva), // do backend; NÃO recalcular
    rows,
  };
}

export function adaptCompareResponse(
  resp: CompareResponse,
  uiInputs: UiInputs,
): UiModel {
  const data = resp.data;
  if (!data || !data.sac || !data.price) {
    throw new Error(
      "adaptCompareResponse(F8H): resposta sem data.sac/data.price.",
    );
  }

  const sac = adaptSummary(data.sac);
  const price = adaptSummary(data.price);
  const comparacao: BackendComparacao | undefined = data.comparacao;

  // Economia: respeitar data.comparacao quando disponível; fallback seguro 0.
  const economiaSACvsPRICE = comparacao
    ? dec(comparacao.diferenca_total_pago)
    : 0;

  const sacSummary = data.sac.summary;

  return {
    inputs: {
      valorImovel: uiInputs.valorImovel,
      entrada: uiInputs.entrada,
      PV: dec(sacSummary.valor_financiado),
      n: sacSummary.prazo_meses,
      i: dec(sacSummary.taxa_juros_mensal),
      E:
        sacSummary.prazo_meses > 0
          ? dec(sacSummary.total_encargos) / sacSummary.prazo_meses
          : 0,
      renda: uiInputs.renda,
    },
    pctEntrada:
      uiInputs.valorImovel > 0 ? uiInputs.entrada / uiInputs.valorImovel : 0,
    taxaAnual: dec(sacSummary.taxa_juros_anual_efetiva),
    sac,
    price,
    economiaSACvsPRICE,
    comprometimento: (parcela: number) =>
      uiInputs.renda > 0 ? parcela / uiInputs.renda : 0,
  };
}
