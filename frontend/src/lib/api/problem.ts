/**
 * Tradução de erros de transporte em objetos tipados para a UI.
 *
 * O backend da PEF respeita duas convenções de corpo em caso de erro
 * (Doc 06 §4.2 + E04 F3):
 *
 *   1. **Problem+JSON (RFC 7807)** — emitido pelo handler global em
 *      422 e demais erros de domínio. Corpo canônico:
 *        { type, title, status, detail, code, errors? }.
 *   2. **Starlette nativo** — emitido pelo roteador quando o verbo
 *      não é permitido em uma rota existente (405). Corpo:
 *        { detail: "Method Not Allowed" }.
 *      Header `Allow` presente. Esta assimetria é intencional e está
 *      registrada como pendência aberta (backlog pós-F3).
 *
 * Esta camada **não** decide comportamento; ela classifica e
 * empacota, entregando à UI um valor discriminado (`kind`) pronto
 * para pattern-matching.
 */

import { AxiosError, type AxiosResponse } from "axios";

// ────────────────────────────────────────────────────────────────
// Shapes literais do corpo de erro
// ────────────────────────────────────────────────────────────────

export interface ProblemDetailsBody {
  readonly type?: string;
  readonly title?: string;
  readonly status?: number;
  readonly detail?: string;
  readonly code?: string;
  readonly errors?: ReadonlyArray<unknown>;
  readonly [key: string]: unknown;
}

export interface StarletteNativeBody {
  readonly detail: string;
}

// ────────────────────────────────────────────────────────────────
// Erros discriminados devolvidos à UI
// ────────────────────────────────────────────────────────────────

export type InterestApiError =
  | ProblemApiError
  | MethodNotAllowedApiError
  | NetworkApiError
  | UnknownApiError;

export interface ProblemApiError {
  readonly kind: "problem";
  readonly status: number;
  readonly title: string;
  readonly detail: string;
  readonly code?: string;
  readonly errors?: ReadonlyArray<unknown>;
  readonly raw: ProblemDetailsBody;
}

export interface MethodNotAllowedApiError {
  readonly kind: "method_not_allowed";
  readonly status: 405;
  readonly detail: string;
  readonly allow?: string;
}

export interface NetworkApiError {
  readonly kind: "network";
  readonly message: string;
}

export interface UnknownApiError {
  readonly kind: "unknown";
  readonly status?: number;
  readonly message: string;
  readonly raw?: unknown;
}

// ────────────────────────────────────────────────────────────────
// Classificação
// ────────────────────────────────────────────────────────────────

function isProblemBody(value: unknown): value is ProblemDetailsBody {
  if (value === null || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  // Pydantic/FastAPI sempre emite ao menos um destes três em Problem+JSON:
  return (
    typeof v["status"] === "number" ||
    typeof v["title"] === "string" ||
    typeof v["type"] === "string"
  );
}

function isNativeBody(value: unknown): value is StarletteNativeBody {
  if (value === null || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v["detail"] === "string";
}

function classifyResponse(response: AxiosResponse<unknown>): InterestApiError {
  const { status, data, headers } = response;
  // Prioridade 1: Problem+JSON.
  if (isProblemBody(data)) {
    return {
      kind: "problem",
      status: typeof data.status === "number" ? data.status : status,
      title: typeof data.title === "string" ? data.title : "Erro de validação",
      detail:
        typeof data.detail === "string"
          ? data.detail
          : "Não foi possível processar a requisição.",
      ...(typeof data.code === "string" ? { code: data.code } : {}),
      ...(Array.isArray(data.errors) ? { errors: data.errors } : {}),
      raw: data,
    };
  }
  // Prioridade 2: 405 com corpo nativo do Starlette (assimetria E04).
  if (status === 405 && isNativeBody(data)) {
    const allowHeader =
      typeof headers?.allow === "string"
        ? headers.allow
        : typeof headers?.Allow === "string"
          ? headers.Allow
          : undefined;
    return {
      kind: "method_not_allowed",
      status: 405,
      detail: data.detail,
      ...(allowHeader !== undefined ? { allow: allowHeader } : {}),
    };
  }
  // Fallback: status + texto.
  return {
    kind: "unknown",
    status,
    message:
      isNativeBody(data) && data.detail
        ? data.detail
        : `Resposta inesperada (HTTP ${String(status)}).`,
    raw: data,
  };
}

/**
 * Normaliza qualquer erro propagado pelo axios em um `InterestApiError`.
 *
 * - `AxiosError` com `response` → classifica pelo corpo.
 * - `AxiosError` sem `response` → `network`.
 * - Qualquer outra coisa → `unknown`.
 */
export function toInterestApiError(error: unknown): InterestApiError {
  if (error instanceof AxiosError) {
    if (error.response) {
      return classifyResponse(error.response);
    }
    return {
      kind: "network",
      message:
        error.message ||
        "Falha de rede ao consultar a API. Verifique sua conexão.",
    };
  }
  if (error instanceof Error) {
    return { kind: "unknown", message: error.message };
  }
  return {
    kind: "unknown",
    message: "Erro desconhecido.",
    raw: error,
  };
}

/** Mensagem humana curta, pronta para `AlertBanner` ou `ErrorState`. */
export function describeApiError(error: InterestApiError): string {
  switch (error.kind) {
    case "problem":
      return error.detail;
    case "method_not_allowed":
      return error.detail;
    case "network":
      return error.message;
    case "unknown":
      return error.message;
  }
}
