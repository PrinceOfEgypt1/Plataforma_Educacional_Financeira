/**
 * Cliente HTTP de baixo nível — axios singleton configurado para a API da PEF.
 *
 * Regras:
 *   - `baseURL` vem de `NEXT_PUBLIC_API_BASE_URL`. Em dev, o default é
 *     `http://localhost:8000/api/v1` (convenção Sprint 2). O prefixo
 *     `/api/v1` está no baseURL para simplificar call sites — cada
 *     service escreve apenas a parte específica (`/interest/simple`).
 *   - Nunca reusar este arquivo para acionar APIs de terceiros.
 *   - Erros são re-lançados. A camada de service traduz via
 *     `toInterestApiError`.
 *   - Header `Idempotency-Key` é opcional e aceito pelo backend
 *     (Doc 06 §6, F3). O client expõe um helper para injetá-lo.
 */

import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

import { unwrapEnvelope } from "./envelope";

const DEFAULT_BASE_URL = "http://localhost:8000/api/v1";

function resolveBaseUrl(): string {
  const fromEnv = process.env["NEXT_PUBLIC_API_BASE_URL"];
  if (typeof fromEnv === "string" && fromEnv.length > 0) {
    return fromEnv.replace(/\/+$/, "");
  }
  return DEFAULT_BASE_URL;
}

function buildInstance(): AxiosInstance {
  return axios.create({
    baseURL: resolveBaseUrl(),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    // 30s cobre com folga os cálculos síncronos do domínio F2 +
    // latência de rede local. Prazo máximo no backend é `prazo<=1200`.
    timeout: 30_000,
  });
}

/**
 * Singleton. Reexposto via `getApiClient()` para facilitar mocks em
 * teste sem alterar call-sites.
 */
let _instance: AxiosInstance | null = null;

export function getApiClient(): AxiosInstance {
  if (_instance === null) {
    _instance = buildInstance();
  }
  return _instance;
}

/** Usado apenas em testes — substitui o singleton por uma instância fake. */
export function __setApiClientForTests(instance: AxiosInstance | null): void {
  _instance = instance;
}

/** Reset sem precisar importar `axios.create()` nos testes. */
export function __resetApiClientForTests(): void {
  _instance = null;
}

// ────────────────────────────────────────────────────────────────
// POST helper — envolve axios + unwrap do envelope
// ────────────────────────────────────────────────────────────────

export interface PostOptions {
  /** Se presente, vai como header `Idempotency-Key`. */
  readonly idempotencyKey?: string;
  /** Aborta a request se o consumidor já trocou de tela. */
  readonly signal?: AbortSignal;
}

/**
 * Executa `POST url` e devolve `data` do envelope.
 *
 * O caller recebe exatamente `TOut` — o envelope em si é detalhe de
 * transporte e não vaza para a UI.
 */
export async function postJson<TIn, TOut>(
  url: string,
  body: TIn,
  options: PostOptions = {},
): Promise<TOut> {
  const config: AxiosRequestConfig = {};
  if (options.idempotencyKey !== undefined) {
    config.headers = { "Idempotency-Key": options.idempotencyKey };
  }
  if (options.signal !== undefined) {
    config.signal = options.signal;
  }
  const response = await getApiClient().post<unknown>(url, body, config);
  return unwrapEnvelope<TOut>(response.data);
}
