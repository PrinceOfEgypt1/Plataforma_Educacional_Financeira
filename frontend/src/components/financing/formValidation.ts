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

function parsePtBr(raw: string): number {
  const trimmed = raw.trim();
  if (trimmed.includes(",")) {
    // pt-BR format: dots are thousands separators, comma is decimal
    return parseFloat(trimmed.replace(/\./g, "").replace(",", "."));
  }
  return parseFloat(trimmed);
}

function parsePositiveMoney(raw: string): number | null {
  const v = parsePtBr(raw);
  return isFinite(v) && v > 0 ? v : null;
}

function parseNonNegativeMoney(raw: string): number | null {
  const trimmed = raw.trim();
  if (
    trimmed === "" ||
    trimmed === "0" ||
    trimmed === "0.00" ||
    trimmed === "0,00"
  )
    return 0;
  const v = parsePtBr(trimmed);
  return isFinite(v) && v >= 0 ? v : null;
}

function parsePositiveInt(raw: string): number | null {
  const v = parseInt(raw.trim(), 10);
  return isFinite(v) && v > 0 && v === Math.floor(v) ? v : null;
}

function parsePositiveRate(raw: string): number | null {
  const v = parsePtBr(raw);
  return isFinite(v) && v >= 0 ? v : null;
}

const MORTGAGE_MONTHLY_RATE_SUSPICIOUS_LIMIT_PERCENT = 5;

/**
 * Gera mensagem dinâmica para taxa suspeita baseada no valor digitado.
 *
 * CORREÇÃO ITEM 14B: Mensagem personalizada com taxa real em vez de exemplo fixo.
 * CORREÇÃO ITEM 14D-B: Substituído toLocaleString("pt-BR") por formatação manual
 * determinística (toFixed(2).replace(".", ",")) para garantir que a mensagem sempre
 * contenha vírgula como separador decimal, independente do locale do sistema
 * operacional e da disponibilidade de dados ICU no Node.js do ambiente de testes
 * (problema reproduzível em WSL com Node.js sem full-icu).
 */
function formatRatePtBr(rate: number): string {
  return rate.toFixed(2).replace(".", ",");
}

function getSuspiciousRateMessage(digitedRate: number): string {
  const formatted = formatRatePtBr(digitedRate);

  return (
    `Você informou ${formatted}% ao mês. Essa taxa está muito acima do comum ` +
    `para financiamento imobiliário. Confira se a taxa digitada está correta, ` +
    `se ela é mensal ou anual, e se não houve deslocamento da vírgula.`
  );
}

function parseMortgageMonthlyRatePercent(raw: string): number {
  const normalized = raw.trim();

  if (normalized.length === 0) {
    return 0;
  }

  const decimalText = normalized.includes(",")
    ? normalized.replace(/\./g, "").replace(",", ".")
    : normalized;

  const parsed = Number.parseFloat(decimalText);
  return Number.isFinite(parsed) ? parsed : 0;
}

function isMortgageMonthlyRateSuspicious(raw: string): boolean {
  return (
    parseMortgageMonthlyRatePercent(raw) >
    MORTGAGE_MONTHLY_RATE_SUSPICIOUS_LIMIT_PERCENT
  );
}

function validateFinanciamentoDraftBase(
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

export function validateFinanciamentoDraft(
  draft: FinanciamentoDraft,
): ReturnType<typeof validateFinanciamentoDraftBase> {
  const base = validateFinanciamentoDraftBase(draft);

  if (!isMortgageMonthlyRateSuspicious(draft.taxaJurosMensalPercentual)) {
    return base;
  }

  const digitedRate = parseMortgageMonthlyRatePercent(
    draft.taxaJurosMensalPercentual,
  );

  return {
    ok: false as const,
    errors: {
      ...(base.ok ? {} : base.errors),
      taxaJurosMensalPercentual: getSuspiciousRateMessage(digitedRate),
    },
  };
}
