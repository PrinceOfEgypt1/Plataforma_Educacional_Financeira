/**
 * Testes do service â€” com axios stubbed por `__setApiClientForTests`.
 *
 * Verificamos:
 *   - happy path: envelope desembrulhado corretamente;
 *   - falha 422: erro traduzido em `kind=problem`;
 *   - falha 405: erro traduzido em `kind=method_not_allowed`;
 *   - rede: erro traduzido em `kind=network`.
 *
 * **Tipagem forte:** respostas/erros axios sÃ£o construÃ­dos pelos helpers
 * em `_helpers/axiosStubs.ts`, usando `AxiosHeaders` e
 * `InternalAxiosRequestConfig` reais â€” sem `any`.
 */
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
  compararJuros,
  simularJurosCompostos,
  simularJurosSimples,
} from "@/services/interest";
import type {
  CompararJurosOut,
  JurosCompostosOut,
  JurosSimplesOut,
} from "@/types/interest";

import { makeAxiosError, makeAxiosResponse } from "../../_helpers/axiosStubs";

type PostFn = (
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
) => Promise<AxiosResponse<unknown>>;

function makeFakeInstance(post: PostFn): AxiosInstance {
  // SÃ³ `post` Ã© usado pelo client; o cast aqui Ã© para AxiosInstance,
  // nÃ£o para `any`. `unknown` intermedeia o upcast controlado.
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
      generated_at: "2026-04-24T00:00:00Z",
    },
  };
}

const SIMPLES_OUT: JurosSimplesOut = {
  summary: {
    principal: "1000.00",
    taxa_mensal: "0.010000",
    prazo_meses: 12,
    juros_totais: "120.00",
    montante_final: "1120.00",
  },
  tables: {
    amortizacao: [
      {
        periodo: 1,
        saldo_inicial: "1000.00",
        juros_periodo: "10.00",
        saldo_final: "1010.00",
      },
    ],
  },
  charts: [],
  interpretation: { headline: "h", body: "b" },
  alerts: [],
};

const COMPOSTOS_OUT: JurosCompostosOut = {
  summary: {
    principal: "1000.00",
    taxa_mensal: "0.010000",
    prazo_meses: 12,
    aporte_mensal: "0.00",
    juros_totais: "126.83",
    total_aportado: "0.00",
    total_investido: "1000.00",
    montante_final: "1126.83",
  },
  tables: { amortizacao: [] },
  charts: [],
  interpretation: { headline: "h", body: "b" },
  alerts: [],
};

const COMPARAR_OUT: CompararJurosOut = {
  summary: {
    principal: "1000.00",
    taxa_mensal: "0.010000",
    prazo_meses: 12,
    montante_simples: "1120.00",
    montante_composto: "1126.83",
    diferenca: "6.83",
    razao: "1.006098",
  },
  tables: { simple: [], compound: [] },
  charts: [],
  interpretation: { headline: "h", body: "b" },
  alerts: [],
};

describe("interestService", () => {
  beforeEach(() => {
    __resetApiClientForTests();
  });
  afterEach(() => {
    __resetApiClientForTests();
  });

  it("simularJurosSimples envia ao endpoint correto e desembrulha o envelope", async () => {
    const post = vi.fn<Parameters<PostFn>, ReturnType<PostFn>>(async (url) => {
      expect(url).toBe("/interest/simple");
      return makeAxiosResponse<unknown>(200, envelope(SIMPLES_OUT));
    });
    __setApiClientForTests(makeFakeInstance(post));
    const data = await simularJurosSimples({
      principal: "1000.00",
      taxa_mensal: "0.010000",
      prazo_meses: 12,
    });
    expect(data).toEqual(SIMPLES_OUT);
    expect(post).toHaveBeenCalledOnce();
  });

  it("simularJurosCompostos passa aporte opcional quando informado", async () => {
    const post = vi.fn<Parameters<PostFn>, ReturnType<PostFn>>(
      async (url, body) => {
        expect(url).toBe("/interest/compound");
        expect(body).toMatchObject({ aporte_mensal: "50.00" });
        return makeAxiosResponse<unknown>(200, envelope(COMPOSTOS_OUT));
      },
    );
    __setApiClientForTests(makeFakeInstance(post));
    await simularJurosCompostos({
      principal: "1000.00",
      taxa_mensal: "0.010000",
      prazo_meses: 12,
      aporte_mensal: "50.00",
    });
  });

  it("compararJuros retorna TablesComparar com simple/compound", async () => {
    const post = vi.fn<Parameters<PostFn>, ReturnType<PostFn>>(async () =>
      makeAxiosResponse<unknown>(200, envelope(COMPARAR_OUT)),
    );
    __setApiClientForTests(makeFakeInstance(post));
    const data = await compararJuros({
      principal: "1000.00",
      taxa_mensal: "0.010000",
      prazo_meses: 12,
    });
    expect(data.tables.simple).toBeDefined();
    expect(data.tables.compound).toBeDefined();
    expect(data.summary.razao).toBe("1.006098");
  });

  it("traduz 422 em kind=problem", async () => {
    const err = makeAxiosError(422, {
      type: "about:blank",
      title: "Validation Error",
      status: 422,
      detail: "taxa_mensal deve ser >= 0",
    });
    const post = vi.fn<Parameters<PostFn>, ReturnType<PostFn>>(() => {
      throw err;
    });
    __setApiClientForTests(makeFakeInstance(post));
    await expect(
      simularJurosSimples({
        principal: "1000.00",
        taxa_mensal: "-1",
        prazo_meses: 12,
      }),
    ).rejects.toMatchObject({ kind: "problem", status: 422 });
  });

  it("traduz 405 nativo em kind=method_not_allowed", async () => {
    const err = makeAxiosError(
      405,
      { detail: "Method Not Allowed" },
      { allow: "POST" },
    );
    const post = vi.fn<Parameters<PostFn>, ReturnType<PostFn>>(() => {
      throw err;
    });
    __setApiClientForTests(makeFakeInstance(post));
    await expect(
      simularJurosSimples({
        principal: "1000.00",
        taxa_mensal: "0.010000",
        prazo_meses: 12,
      }),
    ).rejects.toMatchObject({ kind: "method_not_allowed", status: 405 });
  });

  it("traduz falha de rede em kind=network", async () => {
    const err = new axios.AxiosError("ECONNREFUSED");
    const post = vi.fn<Parameters<PostFn>, ReturnType<PostFn>>(() => {
      throw err;
    });
    __setApiClientForTests(makeFakeInstance(post));
    await expect(
      simularJurosSimples({
        principal: "1000.00",
        taxa_mensal: "0.010000",
        prazo_meses: 12,
      }),
    ).rejects.toMatchObject({ kind: "network" });
  });
});
