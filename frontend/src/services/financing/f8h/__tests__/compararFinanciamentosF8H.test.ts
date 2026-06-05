import { describe, it, expect, beforeAll, afterAll } from "vitest";
import {
  compararFinanciamentosF8H,
  COMPARE_PATH,
} from "../financiamentoCompareService";
import { adaptCompareResponse } from "../adaptCompareResponse";
import { FinancingF8HApiError } from "../errors";
import { REAL_SCENARIOS } from "./fixtures";
import type { UiInputs } from "../../../../types/financingF8H";

function mustScenario(index: number) {
  const scenario = REAL_SCENARIOS[index];
  if (scenario === undefined) {
    throw new Error(`Cenário F8H ausente: ${index}`);
  }
  return scenario;
}

const ORIGINAL = process.env.NEXT_PUBLIC_API_BASE_URL;
beforeAll(() => {
  process.env.NEXT_PUBLIC_API_BASE_URL = "http://localhost:8000/api/v1";
});
afterAll(() => {
  process.env.NEXT_PUBLIC_API_BASE_URL = ORIGINAL;
});

const inputs: UiInputs = {
  valorImovel: 1_000_000,
  entrada: 820_000,
  prazoMeses: 120,
  taxaMensal: 0.0085,
  renda: 20_000,
  sistema: "SAC",
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("D. compararFinanciamentosF8H — HTTP/transporte", () => {
  it("happy path: chama o endpoint oficial e adapta a resposta real", async () => {
    const sc = mustScenario(0);
    let calledUrl = "";
    let sentBody: unknown;
    const fetchImpl = (async (url: string, init?: RequestInit) => {
      calledUrl = url;
      sentBody = JSON.parse(String(init?.body));
      return jsonResponse(sc.response);
    }) as unknown as typeof fetch;

    const resp = await compararFinanciamentosF8H(inputs, { fetchImpl });
    expect(calledUrl).toBe(`http://localhost:8000/api/v1${COMPARE_PATH}`);
    expect(
      (sentBody as Record<string, unknown>).taxa_juros_mensal_percentual,
    ).toBe("0.8500");
    expect(adaptCompareResponse(resp, inputs).sac.rows.length).toBe(120);
  });

  it("4xx/5xx → FinancingF8HApiError com request_id", async () => {
    const errBody = {
      success: false,
      message: "Validation error.",
      meta: { request_id: "req-xyz-123" },
    };
    const fetchImpl = (async () =>
      jsonResponse(errBody, 422)) as unknown as typeof fetch;
    await expect(
      compararFinanciamentosF8H(inputs, { fetchImpl }),
    ).rejects.toMatchObject({
      name: "FinancingF8HApiError",
      status: 422,
      requestId: "req-xyz-123",
    });
    try {
      await compararFinanciamentosF8H(inputs, { fetchImpl });
    } catch (e) {
      expect(e).toBeInstanceOf(FinancingF8HApiError);
    }
  });

  it("AbortSignal cancela sem erro não-tratado", async () => {
    const controller = new AbortController();
    const fetchImpl = (async (_u: string, init?: RequestInit) => {
      if (init?.signal?.aborted)
        throw new DOMException("Aborted", "AbortError");
      return jsonResponse(mustScenario(0).response);
    }) as unknown as typeof fetch;
    controller.abort();
    await expect(
      compararFinanciamentosF8H(inputs, {
        fetchImpl,
        signal: controller.signal,
      }),
    ).rejects.toMatchObject({ name: "AbortError" });
  });
});
