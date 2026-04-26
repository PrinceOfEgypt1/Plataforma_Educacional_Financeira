/**
 * Validação local — **espelha** os limites do backend Pydantic para
 * evitar roundtrip desnecessário.
 *
 * Regra arquitetural: esta validação é de *usabilidade*, não de *verdade*.
 * O backend permanece a autoridade. Se algum limite aqui divergir dos
 * schemas F3, é bug local — o backend ainda vai rejeitar.
 *
 * Limites espelhados (ver `backend/app/schemas/interest/*.py`):
 *   - `principal >= 0`
 *   - `taxa_mensal >= 0`
 *   - `prazo_meses` inteiro em `[1, 1200]`
 *   - `aporte_mensal >= 0` (ou ausente)
 */

import { brlInputToDecimalString, pctInputToRateString } from "@/lib/money";

export interface InterestFormDraft {
  readonly principal: string;
  readonly taxaMensalPct: string;
  readonly prazoMeses: string;
  readonly aporteMensal?: string;
}

export interface ValidatedInterestInput {
  readonly principal: string;
  readonly taxa_mensal: string;
  readonly prazo_meses: number;
  readonly aporte_mensal?: string | null;
}

export type FieldKey =
  | "principal"
  | "taxaMensalPct"
  | "prazoMeses"
  | "aporteMensal";

export type FieldErrors = Partial<Record<FieldKey, string>>;

export interface ValidationResult {
  readonly ok: boolean;
  readonly errors: FieldErrors;
  readonly value: ValidatedInterestInput | null;
}

const PRAZO_MIN = 1;
const PRAZO_MAX = 1200;

function validatePrincipal(raw: string): { value: string; error?: string } {
  if (raw.trim().length === 0) {
    return { value: "", error: "Informe o valor presente." };
  }
  const decimal = brlInputToDecimalString(raw);
  const n = Number(decimal);
  if (!Number.isFinite(n)) {
    return { value: "", error: "Valor monetário inválido." };
  }
  if (n < 0) {
    return { value: "", error: "O principal não pode ser negativo." };
  }
  return { value: decimal };
}

function validateTaxa(raw: string): { value: string; error?: string } {
  if (raw.trim().length === 0) {
    return { value: "", error: "Informe a taxa mensal (%)." };
  }
  const rate = pctInputToRateString(raw);
  if (rate.length === 0) {
    return {
      value: "",
      error: "Taxa inválida. Use formato numérico (ex.: 1,00).",
    };
  }
  const n = Number(rate);
  if (n < 0) {
    return { value: "", error: "A taxa não pode ser negativa." };
  }
  return { value: rate };
}

function validatePrazo(raw: string): { value: number; error?: string } {
  if (raw.trim().length === 0) {
    return { value: 0, error: "Informe o prazo em meses." };
  }
  const n = Number(raw.trim());
  if (!Number.isInteger(n)) {
    return { value: 0, error: "O prazo deve ser um número inteiro." };
  }
  if (n < PRAZO_MIN || n > PRAZO_MAX) {
    return {
      value: 0,
      error: `O prazo deve estar entre ${PRAZO_MIN} e ${PRAZO_MAX} meses.`,
    };
  }
  return { value: n };
}

function validateAporte(raw: string | undefined): {
  value: string | null;
  error?: string;
} {
  if (raw === undefined || raw.trim().length === 0) {
    return { value: null };
  }
  const decimal = brlInputToDecimalString(raw);
  const n = Number(decimal);
  if (!Number.isFinite(n)) {
    return { value: null, error: "Aporte inválido." };
  }
  if (n < 0) {
    return { value: null, error: "O aporte não pode ser negativo." };
  }
  return { value: decimal };
}

export function validateInterestDraft(
  draft: InterestFormDraft,
  options: { readonly requireAporte?: false; readonly acceptAporte: boolean },
): ValidationResult {
  const principal = validatePrincipal(draft.principal);
  const taxa = validateTaxa(draft.taxaMensalPct);
  const prazo = validatePrazo(draft.prazoMeses);
  const aporte = options.acceptAporte
    ? validateAporte(draft.aporteMensal)
    : { value: null as string | null };

  const errors: FieldErrors = {};
  if (principal.error) errors.principal = principal.error;
  if (taxa.error) errors.taxaMensalPct = taxa.error;
  if (prazo.error) errors.prazoMeses = prazo.error;
  if (options.acceptAporte && "error" in aporte && aporte.error) {
    errors.aporteMensal = aporte.error;
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors, value: null };
  }

  const base: ValidatedInterestInput = {
    principal: principal.value,
    taxa_mensal: taxa.value,
    prazo_meses: prazo.value,
    ...(options.acceptAporte ? { aporte_mensal: aporte.value } : {}),
  };
  return { ok: true, errors: {}, value: base };
}
