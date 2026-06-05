/**
 * financiamentoCompareService (F8H) — chamada ao endpoint de comparação.
 *
 * ENTREGA ADITIVA: este service é NOVO. NÃO substitui
 * `frontend/src/services/financing/financiamentoService.ts` nem suas exports
 * vivas (`simularFinanciamentoImobiliario`, `compararFinanciamentos`,
 * `FinanciamentoApiError`). A função pública nova é `compararFinanciamentosF8H`.
 *
 * Governança: NENHUM cálculo financeiro aqui — apenas montagem de payload e
 * transporte HTTP. Backend é a única fonte da verdade.
 */

import type { CompareResponse, UiInputs } from "../../../types/financingF8H";
import { FinancingF8HApiError, FinancingF8HValidationError } from "./errors";
import { buildPayload } from "./buildPayload";

export { buildPayload } from "./buildPayload";

/** Endpoint oficial (relativo à base /api/v1). */
export const COMPARE_PATH = "/financing/real_estate/compare";

function apiBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) {
    throw new FinancingF8HValidationError(
      "NEXT_PUBLIC_API_BASE_URL não configurada (esperado .../api/v1).",
    );
  }
  return base.replace(/\/+$/, "");
}

interface CompareOptions {
  signal?: AbortSignal;
  /** fetch injetável (testes); default global fetch. */
  fetchImpl?: typeof fetch;
}

/**
 * compararFinanciamentosF8H — POST /financing/real_estate/compare.
 * Valida regra de domínio (entrada < imóvel) antes de enviar.
 * Em não-2xx, lê o corpo e lança FinancingF8HApiError com request_id.
 */
export async function compararFinanciamentosF8H(
  inputs: UiInputs,
  options: CompareOptions = {},
): Promise<CompareResponse> {
  if (!(inputs.valorImovel > 0)) {
    throw new FinancingF8HValidationError("valor_imovel deve ser > 0.");
  }
  if (inputs.entrada < 0) {
    throw new FinancingF8HValidationError(
      "valor_entrada não pode ser negativo.",
    );
  }
  if (inputs.entrada >= inputs.valorImovel) {
    throw new FinancingF8HValidationError(
      "valor_entrada deve ser menor que valor_imovel.",
    );
  }
  if (!(inputs.prazoMeses >= 1 && inputs.prazoMeses <= 600)) {
    throw new FinancingF8HValidationError(
      "prazo_meses deve estar entre 1 e 600.",
    );
  }

  const doFetch = options.fetchImpl ?? fetch;
  const payload = buildPayload(inputs);
  const url = `${apiBaseUrl()}${COMPARE_PATH}`;

  const requestInit: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  };

  if (options.signal !== undefined) {
    requestInit.signal = options.signal;
  }

  const res = await doFetch(url, requestInit);

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    body = undefined;
  }

  if (!res.ok) {
    const requestId = extractRequestId(body);
    const errorOptions: { status: number; requestId?: string; body?: unknown } =
      {
        status: res.status,
        body,
      };

    if (requestId !== undefined) {
      errorOptions.requestId = requestId;
    }

    throw new FinancingF8HApiError(
      extractMessage(body) ?? `HTTP ${res.status}`,
      errorOptions,
    );
  }

  return body as CompareResponse;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function extractRequestId(body: unknown): string | undefined {
  if (isRecord(body) && isRecord(body.meta)) {
    const rid = (body.meta as Record<string, unknown>).request_id;
    if (typeof rid === "string") return rid;
  }
  return undefined;
}

function extractMessage(body: unknown): string | undefined {
  if (isRecord(body) && typeof body.message === "string") return body.message;
  return undefined;
}
