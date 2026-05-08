import type { FinanciamentoImobRequest } from "@/types/financing";

export interface FinanciamentoDraft {
  readonly valorImovel: string;
  readonly valorEntrada: string;
  readonly prazoMeses: string;
  readonly taxaJurosMensalPercentual: string;
  readonly sistemaAmortizacao: "PRICE" | "SAC";
  readonly seguroMensal: string;
  readonly tarifaMensal: string;
}

export type FinanciamentoFieldErrors = Partial<
  Record<keyof FinanciamentoDraft, string>
>;

type ValidationResult =
  | { readonly ok: true; readonly value: FinanciamentoImobRequest }
  | { readonly ok: false; readonly errors: FinanciamentoFieldErrors };

function parsePositiveMoney(raw: string): number | null {
  const v = parseFloat(raw.replace(",", "."));
  return isFinite(v) && v > 0 ? v : null;
}

function parseNonNegativeMoney(raw: string): number | null {
  if (raw === "" || raw === "0" || raw === "0.00") return 0;
  const v = parseFloat(raw.replace(",", "."));
  return isFinite(v) && v >= 0 ? v : null;
}

function parsePositiveInt(raw: string): number | null {
  const v = parseInt(raw, 10);
  return isFinite(v) && v > 0 && v === Math.floor(v) ? v : null;
}

function parsePositiveRate(raw: string): number | null {
  const v = parseFloat(raw.replace(",", "."));
  return isFinite(v) && v >= 0 ? v : null;
}

export function validateFinanciamentoDraft(
  draft: FinanciamentoDraft,
): ValidationResult {
  const errors: FinanciamentoFieldErrors = {};

  const valorImovel = parsePositiveMoney(draft.valorImovel);
  if (valorImovel === null) {
    errors.valorImovel = "Informe um valor de imóvel maior que zero.";
  }

  const valorEntrada = parseNonNegativeMoney(draft.valorEntrada);
  if (valorEntrada === null) {
    errors.valorEntrada = "Informe um valor de entrada válido (≥ 0).";
  }

  if (
    valorImovel !== null &&
    valorEntrada !== null &&
    valorEntrada >= valorImovel
  ) {
    errors.valorEntrada = "A entrada deve ser menor que o valor do imóvel.";
  }

  const prazoMeses = parsePositiveInt(draft.prazoMeses);
  if (prazoMeses === null) {
    errors.prazoMeses = "Informe um prazo em meses (número inteiro > 0).";
  }

  const taxa = parsePositiveRate(draft.taxaJurosMensalPercentual);
  if (taxa === null) {
    errors.taxaJurosMensalPercentual = "Informe uma taxa mensal válida (≥ 0).";
  }

  const seguro = parseNonNegativeMoney(draft.seguroMensal);
  if (seguro === null) {
    errors.seguroMensal = "Informe um valor de seguro válido (≥ 0).";
  }

  const tarifa = parseNonNegativeMoney(draft.tarifaMensal);
  if (tarifa === null) {
    errors.tarifaMensal = "Informe um valor de tarifa válido (≥ 0).";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  const base = {
    valor_imovel: valorImovel!.toFixed(2),
    valor_entrada: valorEntrada!.toFixed(2),
    prazo_meses: prazoMeses!,
    taxa_juros_mensal_percentual: taxa!.toFixed(4),
    sistema_amortizacao: draft.sistemaAmortizacao,
  } satisfies Omit<FinanciamentoImobRequest, "seguro_mensal" | "tarifa_mensal">;

  return {
    ok: true,
    value: {
      ...base,
      ...(seguro! > 0 ? { seguro_mensal: seguro!.toFixed(2) } : {}),
      ...(tarifa! > 0 ? { tarifa_mensal: tarifa!.toFixed(2) } : {}),
    },
  };
}
