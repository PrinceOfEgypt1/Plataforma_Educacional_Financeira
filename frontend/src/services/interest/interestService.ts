/**
 * Serviço de juros — ponte entre a UI e os três endpoints F3.
 *
 * Regras:
 *   - Este módulo **não** faz nenhum cálculo. O backend é a fonte da
 *     verdade. Qualquer aritmética adicional no frontend é pecado
 *     arquitetural (Doc 06 §3 + CLAUDE.md / FONTE OFICIAL DA VERDADE).
 *   - Lança `InterestApiError` (discriminado) em falhas — a UI faz
 *     pattern-matching sobre `kind`.
 *   - Aceita `AbortSignal` para cancelamento quando o usuário
 *     recalcula rapidamente.
 */

import { postJson, type PostOptions } from "@/lib/api/client";
import { toInterestApiError } from "@/lib/api/problem";
import type {
  CompararJurosIn,
  CompararJurosOut,
  JurosCompostosIn,
  JurosCompostosOut,
  JurosSimplesIn,
  JurosSimplesOut,
} from "@/types/interest";

// Rotas canônicas — declaradas aqui (e só aqui) para facilitar audit.
const PATH_SIMPLE = "/interest/simple" as const;
const PATH_COMPOUND = "/interest/compound" as const;
const PATH_COMPARE = "/interest/compare" as const;

async function post<TIn, TOut>(
  url: string,
  body: TIn,
  options: PostOptions,
): Promise<TOut> {
  try {
    return await postJson<TIn, TOut>(url, body, options);
  } catch (error) {
    throw toInterestApiError(error);
  }
}

export async function simularJurosSimples(
  input: JurosSimplesIn,
  options: PostOptions = {},
): Promise<JurosSimplesOut> {
  return post<JurosSimplesIn, JurosSimplesOut>(PATH_SIMPLE, input, options);
}

export async function simularJurosCompostos(
  input: JurosCompostosIn,
  options: PostOptions = {},
): Promise<JurosCompostosOut> {
  return post<JurosCompostosIn, JurosCompostosOut>(
    PATH_COMPOUND,
    input,
    options,
  );
}

export async function compararJuros(
  input: CompararJurosIn,
  options: PostOptions = {},
): Promise<CompararJurosOut> {
  return post<CompararJurosIn, CompararJurosOut>(PATH_COMPARE, input, options);
}
