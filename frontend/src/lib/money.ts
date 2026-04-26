/**
 * Helpers de formatação monetária e de taxas — fronteira de apresentação.
 *
 * Regra dura: os valores do backend chegam como string decimal (2 casas
 * para BRL, 6 para taxa). A conversão para `number` só pode ocorrer na
 * borda final de exibição. As helpers abaixo:
 *
 *   - `formatBRL("1234.56")`  → `"R$ 1.234,56"`
 *   - `formatRatePct("0.010000")` → `"1,00%"`
 *
 * **Não** usar este módulo para fazer cálculos — cálculo fica no backend.
 */

const BRL_FORMATTER = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const RATE_FORMATTER = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});

/**
 * Converte string decimal para number. Lança se não for parseável.
 * Uso exclusivamente interno — a UI chama `formatBRL` / `formatRatePct`.
 */
function parseDecimal(value: string): number {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new Error("Valor monetário vazio.");
  }
  const n = Number(trimmed);
  if (!Number.isFinite(n)) {
    throw new Error(`Valor monetário inválido: "${value}".`);
  }
  return n;
}

/** Formata string decimal (2 casas) como moeda brasileira. */
export function formatBRL(value: string): string {
  return BRL_FORMATTER.format(parseDecimal(value));
}

/**
 * Formata string decimal (taxa pura, ex.: `"0.010000"`) como porcentagem
 * localizada (`"1,00%"`).
 */
export function formatRatePct(value: string): string {
  return RATE_FORMATTER.format(parseDecimal(value));
}

/** Converte entrada do formulário (pt-BR: `1.234,56`) em string ASCII decimal. */
export function brlInputToDecimalString(input: string): string {
  const normalized = input
    .replace(/\s+/g, "")
    .replace(/[R$]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  if (normalized.length === 0) return "";
  return normalized;
}

/**
 * Converte entrada do formulário (pt-BR: `"1,00"` ou `"1"` como %) em
 * string decimal pura com 6 casas. Ex.: `"1,00"` → `"0.010000"`.
 */
export function pctInputToRateString(input: string): string {
  const sanitized = input
    .replace(/\s+/g, "")
    .replace("%", "")
    .replace(",", ".");
  if (sanitized.length === 0) return "";
  const n = Number(sanitized);
  if (!Number.isFinite(n)) return "";
  return (n / 100).toFixed(6);
}
