import { brlInputToDecimalString } from "@/lib/money";

export interface DiagnosticoFormDraft {
  readonly rendaMensal: string;
  readonly despesasFixas: string;
  readonly despesasVariaveis: string;
  readonly dividasMensais: string;
  readonly reservaAtual: string;
}

export interface ValidatedDiagnosticoInput {
  readonly renda_mensal: string;
  readonly total_despesas_fixas: string;
  readonly total_despesas_variaveis: string;
  readonly total_dividas_mensais: string;
  readonly total_reserva_atual: string;
}

export type DiagnosticoFieldKey = keyof DiagnosticoFormDraft;

export type DiagnosticoFieldErrors = Partial<Record<DiagnosticoFieldKey, string>>;

export interface DiagnosticoValidationResult {
  readonly ok: boolean;
  readonly errors: DiagnosticoFieldErrors;
  readonly value: ValidatedDiagnosticoInput | null;
}

function parseMoneyField(
  raw: string,
): { value: string; error?: string } {
  const trimmed = raw.trim();
  if (trimmed.length === 0) {
    return { value: "", error: "Campo obrigatório." };
  }
  const decimal = brlInputToDecimalString(trimmed);
  const n = Number(decimal);
  if (!Number.isFinite(n)) {
    return { value: "", error: "Valor monetário inválido." };
  }
  if (n < 0) {
    return { value: "", error: "O valor não pode ser negativo." };
  }
  return { value: n.toFixed(2) };
}

function parseRendaMensal(
  raw: string,
): { value: string; error?: string } {
  const result = parseMoneyField(raw);
  if (result.error) return result;
  if (Number(result.value) <= 0) {
    return { value: "", error: "A renda mensal deve ser maior que zero." };
  }
  return result;
}

export function validateDiagnosticoDraft(
  draft: DiagnosticoFormDraft,
): DiagnosticoValidationResult {
  const renda = parseRendaMensal(draft.rendaMensal);
  const fixas = parseMoneyField(draft.despesasFixas);
  const variaveis = parseMoneyField(draft.despesasVariaveis);
  const dividas = parseMoneyField(draft.dividasMensais);
  const reserva = parseMoneyField(draft.reservaAtual);

  const errors: DiagnosticoFieldErrors = {};
  if (renda.error) errors.rendaMensal = renda.error;
  if (fixas.error) errors.despesasFixas = fixas.error;
  if (variaveis.error) errors.despesasVariaveis = variaveis.error;
  if (dividas.error) errors.dividasMensais = dividas.error;
  if (reserva.error) errors.reservaAtual = reserva.error;

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors, value: null };
  }

  return {
    ok: true,
    errors: {},
    value: {
      renda_mensal: renda.value,
      total_despesas_fixas: fixas.value,
      total_despesas_variaveis: variaveis.value,
      total_dividas_mensais: dividas.value,
      total_reserva_atual: reserva.value,
    },
  };
}
