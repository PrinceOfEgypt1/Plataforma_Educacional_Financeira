import { brlInputToDecimalString, pctInputToRateString } from "@/lib/money";

export interface AmortizationFormDraft {
  readonly principal: string;
  readonly taxaPeriodoPct: string;
  readonly nPeriodos: string;
}

export interface ValidatedAmortizationInput {
  readonly principal: string;
  readonly taxa_periodo: string;
  readonly n_periodos: number;
}

export type FieldKey = "principal" | "taxaPeriodoPct" | "nPeriodos";

export type FieldErrors = Partial<Record<FieldKey, string>>;

export interface ValidationResult {
  readonly ok: boolean;
  readonly errors: FieldErrors;
  readonly value: ValidatedAmortizationInput | null;
}

const PERIODOS_MIN = 1;
const PERIODOS_MAX = 1200;

function validatePrincipal(raw: string): { value: string; error?: string } {
  if (raw.trim().length === 0) {
    return { value: "", error: "Informe o valor financiado." };
  }
  const decimal = brlInputToDecimalString(raw);
  const n = Number(decimal);
  if (!Number.isFinite(n)) {
    return { value: "", error: "Valor monetario invalido." };
  }
  if (n <= 0) {
    return { value: "", error: "O principal deve ser maior que zero." };
  }
  return { value: decimal };
}

function validateTaxa(raw: string): { value: string; error?: string } {
  if (raw.trim().length === 0) {
    return { value: "", error: "Informe a taxa do periodo (%)." };
  }
  const rate = pctInputToRateString(raw);
  if (rate.length === 0) {
    return {
      value: "",
      error: "Taxa invalida. Use formato numerico (ex.: 1,00).",
    };
  }
  const n = Number(rate);
  if (n < 0) {
    return { value: "", error: "A taxa nao pode ser negativa." };
  }
  return { value: rate };
}

function validatePeriodos(raw: string): { value: number; error?: string } {
  if (raw.trim().length === 0) {
    return { value: 0, error: "Informe o prazo em periodos." };
  }
  const n = Number(raw.trim());
  if (!Number.isInteger(n)) {
    return { value: 0, error: "O prazo deve ser um numero inteiro." };
  }
  if (n < PERIODOS_MIN || n > PERIODOS_MAX) {
    return {
      value: 0,
      error: `O prazo deve estar entre ${PERIODOS_MIN} e ${PERIODOS_MAX} periodos.`,
    };
  }
  return { value: n };
}

export function validateAmortizationDraft(
  draft: AmortizationFormDraft,
): ValidationResult {
  const principal = validatePrincipal(draft.principal);
  const taxa = validateTaxa(draft.taxaPeriodoPct);
  const periodos = validatePeriodos(draft.nPeriodos);

  const errors: FieldErrors = {};
  if (principal.error) errors.principal = principal.error;
  if (taxa.error) errors.taxaPeriodoPct = taxa.error;
  if (periodos.error) errors.nPeriodos = periodos.error;

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors, value: null };
  }

  return {
    ok: true,
    errors: {},
    value: {
      principal: principal.value,
      taxa_periodo: taxa.value,
      n_periodos: periodos.value,
    },
  };
}
