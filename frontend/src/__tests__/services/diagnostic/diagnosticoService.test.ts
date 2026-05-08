import {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  __resetApiClientForTests,
  __setApiClientForTests,
} from "@/lib/api/client";
import { analisarDiagnostico } from "@/services/diagnostic/diagnosticoService";
import type { DiagnosticAnalyzeResponseData } from "@/types/diagnostic";

import { makeAxiosError, makeAxiosResponse } from "../../_helpers/axiosStubs";

type PostFn = (
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
) => Promise<AxiosResponse<unknown>>;

function makeFakeInstance(post: PostFn): AxiosInstance {
  return { post } as unknown as AxiosInstance;
}

function envelope<T>(data: T): unknown {
  return {
    success: true,
    message: "diagnostico_financeiro_analisado",
    data,
    meta: {
      request_id: "test-req",
      version: "v1",
      generated_at: "2026-05-08T00:00:00Z",
    },
  };
}

const DG01_DATA: DiagnosticAnalyzeResponseData = {
  renda_mensal: "5000.00",
  total_despesas_fixas: "2000.00",
  total_despesas_variaveis: "800.00",
  total_dividas_mensais: "500.00",
  total_reserva_atual: "4000.00",
  sobra_mensal: "1700.00",
  despesas_essenciais_mensais: "2800.00",
  comprometimento_percentual: "10.00",
  sobra_percentual: "34.00",
  reserva_em_meses: "1.43",
  comprometimento_nivel: "baixo",
  reserva_nivel: "insuficiente",
  sobra_nivel: "boa",
  pontos_comprometimento: 3,
  pontos_reserva: 1,
  pontos_sobra: 3,
  score: 7,
  saude_nivel: "boa",
  alertas: [
    { code: "RESERVA_INSUFICIENTE", level: "warning", dimension: "reserva" },
  ],
};

describe("analisarDiagnostico", () => {
  beforeEach(() => {
    __resetApiClientForTests();
  });

  afterEach(() => {
    __resetApiClientForTests();
  });

  it("chama POST /diagnostic/analyze com payload em snake_case", async () => {
    const postMock = vi.fn().mockResolvedValue(
      makeAxiosResponse(200, envelope(DG01_DATA)),
    );
    __setApiClientForTests(makeFakeInstance(postMock));

    await analisarDiagnostico({
      renda_mensal: "5000.00",
      total_despesas_fixas: "2000.00",
      total_despesas_variaveis: "800.00",
      total_dividas_mensais: "500.00",
      total_reserva_atual: "4000.00",
    });

    expect(postMock).toHaveBeenCalledOnce();
    const [url, body] = postMock.mock.calls[0] as [string, unknown];
    expect(url).toBe("/diagnostic/analyze");
    expect(body).toEqual({
      renda_mensal: "5000.00",
      total_despesas_fixas: "2000.00",
      total_despesas_variaveis: "800.00",
      total_dividas_mensais: "500.00",
      total_reserva_atual: "4000.00",
    });
  });

  it("preserva valores decimais como string no payload", async () => {
    const postMock = vi.fn().mockResolvedValue(
      makeAxiosResponse(200, envelope(DG01_DATA)),
    );
    __setApiClientForTests(makeFakeInstance(postMock));

    await analisarDiagnostico({
      renda_mensal: "5000.00",
      total_despesas_fixas: "2000.00",
      total_despesas_variaveis: "800.00",
      total_dividas_mensais: "500.00",
      total_reserva_atual: "4000.00",
    });

    const [, body] = postMock.mock.calls[0] as [string, Record<string, unknown>];
    expect(typeof body["renda_mensal"]).toBe("string");
    expect(typeof body["total_despesas_fixas"]).toBe("string");
    expect(typeof body["total_reserva_atual"]).toBe("string");
  });

  it("retorna data desembrulhada corretamente (caso DG-01)", async () => {
    const postMock = vi.fn().mockResolvedValue(
      makeAxiosResponse(200, envelope(DG01_DATA)),
    );
    __setApiClientForTests(makeFakeInstance(postMock));

    const result = await analisarDiagnostico({
      renda_mensal: "5000.00",
      total_despesas_fixas: "2000.00",
      total_despesas_variaveis: "800.00",
      total_dividas_mensais: "500.00",
      total_reserva_atual: "4000.00",
    });

    expect(result.score).toBe(7);
    expect(result.saude_nivel).toBe("boa");
    expect(result.sobra_mensal).toBe("1700.00");
    expect(result.comprometimento_percentual).toBe("10.00");
    expect(result.reserva_em_meses).toBe("1.43");
    expect(result.alertas).toHaveLength(1);
    expect(result.alertas[0]!.code).toBe("RESERVA_INSUFICIENTE");
  });

  it("trata erro RFC 7807 (422) e lança DiagnosticoApiError kind=problem", async () => {
    const problemBody = {
      type: "about:blank",
      title: "Unprocessable Entity",
      status: 422,
      detail: "renda_mensal deve ser maior que zero",
      code: "VALIDATION_ERROR",
    };
    const postMock = vi.fn().mockRejectedValue(
      makeAxiosError(422, problemBody),
    );
    __setApiClientForTests(makeFakeInstance(postMock));

    await expect(
      analisarDiagnostico({
        renda_mensal: "0.00",
        total_despesas_fixas: "0.00",
        total_despesas_variaveis: "0.00",
        total_dividas_mensais: "0.00",
        total_reserva_atual: "0.00",
      }),
    ).rejects.toMatchObject({ kind: "problem", status: 422 });
  });

  it("trata erro de rede e lança DiagnosticoApiError kind=network", async () => {
    const networkError = new AxiosError("Network Error");
    const postMock = vi.fn().mockRejectedValue(networkError);
    __setApiClientForTests(makeFakeInstance(postMock));

    await expect(
      analisarDiagnostico({
        renda_mensal: "5000.00",
        total_despesas_fixas: "0.00",
        total_despesas_variaveis: "0.00",
        total_dividas_mensais: "0.00",
        total_reserva_atual: "0.00",
      }),
    ).rejects.toMatchObject({ kind: "network" });
  });
});
