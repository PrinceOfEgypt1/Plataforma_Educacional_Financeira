import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  __resetApiClientForTests,
  __setApiClientForTests,
} from "@/lib/api/client";
import {
  compararAmortizacao,
  simularPrice,
  simularSac,
} from "@/services/amortization/amortizationService";
import type {
  CompareAmortizationOut,
  PriceOut,
  SacOut,
} from "@/types/amortization";

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
    message: "ok",
    data,
    meta: {
      request_id: "test-req",
      version: "v1",
      generated_at: "2026-05-03T00:00:00Z",
    },
  };
}

const PRICE_OUT: PriceOut = {
  summary: {
    sistema: "PRICE",
    principal: "100000.00",
    taxa_periodo: "0.010000",
    n_periodos: 12,
    parcela: "8884.88",
    total_pago: "106618.53",
    total_juros: "6618.53",
    saldo_final: "0.00",
  },
  tables: { amortizacao: [] },
  charts: [],
  interpretation: { headline: "PRICE", body: "Tabela PRICE calculada." },
  alerts: [],
};

const SAC_OUT: SacOut = {
  summary: {
    sistema: "SAC",
    principal: "100000.00",
    taxa_periodo: "0.010000",
    n_periodos: 12,
    amortizacao_constante: "8333.33",
    parcela_inicial: "9333.33",
    parcela_final: "8416.70",
    total_pago: "106500.00",
    total_juros: "6500.00",
    saldo_final: "0.00",
  },
  tables: { amortizacao: [] },
  charts: [],
  interpretation: { headline: "SAC", body: "Tabela SAC calculada." },
  alerts: [],
};

const COMPARE_OUT: CompareAmortizationOut = {
  summary: {
    principal: "100000.00",
    taxa_periodo: "0.010000",
    n_periodos: 12,
    price: PRICE_OUT.summary,
    sac: SAC_OUT.summary,
    diferenca_juros: "118.53",
    diferenca_total_pago: "118.53",
    menor_total_juros: "SAC",
  },
  tables: { price: [], sac: [] },
  charts: [],
  interpretation: { headline: "Comparacao", body: "SAC tem menor juros." },
  alerts: [],
};

describe("amortizationService", () => {
  beforeEach(() => {
    __resetApiClientForTests();
  });

  afterEach(() => {
    __resetApiClientForTests();
  });

  it("simularPrice chama o endpoint PRICE correto e desembrulha o envelope", async () => {
    const post = vi.fn<Parameters<PostFn>, ReturnType<PostFn>>(
      async (url, body) => {
        expect(url).toBe("/amortization/price");
        expect(body).toEqual({
          principal: "100000.00",
          taxa_periodo: "0.010000",
          n_periodos: 12,
        });
        return makeAxiosResponse<unknown>(200, envelope(PRICE_OUT));
      },
    );
    __setApiClientForTests(makeFakeInstance(post));

    const data = await simularPrice({
      principal: "100000.00",
      taxa_periodo: "0.010000",
      n_periodos: 12,
    });

    expect(data).toEqual(PRICE_OUT);
    expect(post).toHaveBeenCalledOnce();
  });

  it("simularSac chama o endpoint SAC correto", async () => {
    const post = vi.fn<Parameters<PostFn>, ReturnType<PostFn>>(async (url) => {
      expect(url).toBe("/amortization/sac");
      return makeAxiosResponse<unknown>(200, envelope(SAC_OUT));
    });
    __setApiClientForTests(makeFakeInstance(post));

    const data = await simularSac({
      principal: "100000.00",
      taxa_periodo: "0.010000",
      n_periodos: 12,
    });

    expect(data.summary.sistema).toBe("SAC");
  });

  it("compararAmortizacao chama o endpoint compare correto", async () => {
    const post = vi.fn<Parameters<PostFn>, ReturnType<PostFn>>(async (url) => {
      expect(url).toBe("/amortization/compare");
      return makeAxiosResponse<unknown>(200, envelope(COMPARE_OUT));
    });
    __setApiClientForTests(makeFakeInstance(post));

    const data = await compararAmortizacao({
      principal: "100000.00",
      taxa_periodo: "0.010000",
      n_periodos: 12,
    });

    expect(data.summary.menor_total_juros).toBe("SAC");
    expect(data.tables.price).toBeDefined();
    expect(data.tables.sac).toBeDefined();
  });

  it("traduz Problem+JSON em erro kind=problem", async () => {
    const error = makeAxiosError(422, {
      type: "about:blank",
      title: "Validation Error",
      status: 422,
      detail: "principal deve ser maior que zero",
    });
    const post = vi.fn<Parameters<PostFn>, ReturnType<PostFn>>(() => {
      throw error;
    });
    __setApiClientForTests(makeFakeInstance(post));

    await expect(
      simularPrice({
        principal: "0.00",
        taxa_periodo: "0.010000",
        n_periodos: 12,
      }),
    ).rejects.toMatchObject({ kind: "problem", status: 422 });
  });

  it("traduz falha de rede em kind=network", async () => {
    const error = new axios.AxiosError("ECONNREFUSED");
    const post = vi.fn<Parameters<PostFn>, ReturnType<PostFn>>(() => {
      throw error;
    });
    __setApiClientForTests(makeFakeInstance(post));

    await expect(
      simularSac({
        principal: "100000.00",
        taxa_periodo: "0.010000",
        n_periodos: 12,
      }),
    ).rejects.toMatchObject({ kind: "network" });
  });
});
