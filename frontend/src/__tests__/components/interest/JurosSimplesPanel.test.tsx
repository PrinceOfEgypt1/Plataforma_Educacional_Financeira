/**
 * Teste de integração do painel — exercita o ciclo
 * formulário → service → resultado, com axios mockado.
 *
 * **Tipagem forte:** helper `makeAxiosResponse`/`makeAxiosError` constrói
 * as respostas reais (sem `any`). `fakeInstance` faz cast controlado via
 * `unknown` para `AxiosInstance`, compatível com o mínimo usado pelo
 * client (`post`).
 */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type AxiosInstance, type AxiosResponse } from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { JurosSimplesPanel } from "@/components/interest/JurosSimplesPanel";
import {
  __resetApiClientForTests,
  __setApiClientForTests,
} from "@/lib/api/client";
import type { JurosSimplesOut } from "@/types/interest";

import { makeAxiosError, makeAxiosResponse } from "../../_helpers/axiosStubs";

/* ResizeObserver — recharts usa em runtime; jsdom não traz nativamente.
 * Tipado sem `any`: interface local + `vi.stubGlobal`. */
interface MinimalResizeObserver {
  observe(): void;
  unobserve(): void;
  disconnect(): void;
}
class NoopResizeObserver implements MinimalResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}
vi.stubGlobal("ResizeObserver", NoopResizeObserver);

const RESULT: JurosSimplesOut = {
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
  charts: [
    {
      x_label: "Período (meses)",
      y_label: "Saldo (BRL)",
      series: [
        { label: "Simples", kind: "simples", points: ["1000.00", "1010.00"] },
      ],
    },
  ],
  interpretation: { headline: "Tudo certo", body: "Seu saldo crescerá assim." },
  alerts: [],
};

function okResponse<T>(data: T): AxiosResponse<unknown> {
  return makeAxiosResponse<unknown>(200, {
    success: true,
    message: "ok",
    data,
    meta: {
      request_id: "r",
      version: "v1",
      generated_at: "2026-04-24T00:00:00Z",
    },
  });
}

type PostOnly = Pick<AxiosInstance, "post">;

function fakeInstance(
  post: (url: string, data?: unknown) => Promise<AxiosResponse<unknown>>,
): AxiosInstance {
  // `post` aqui é um subset válido do assinatura de AxiosInstance["post"].
  // O cast `unknown → AxiosInstance` é controlado e não contém `any`.
  const partial: PostOnly = { post: post as AxiosInstance["post"] };
  return partial as unknown as AxiosInstance;
}

describe("JurosSimplesPanel", () => {
  beforeEach(() => {
    __resetApiClientForTests();
  });
  afterEach(() => {
    __resetApiClientForTests();
  });

  it("estado inicial mostra EmptyState", () => {
    render(<JurosSimplesPanel />);
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });

  it("happy path: envia form e renderiza summary + tabela + interpretação", async () => {
    const user = userEvent.setup();
    const post = vi.fn(async () => okResponse(RESULT));
    __setApiClientForTests(fakeInstance(post));

    render(<JurosSimplesPanel />);
    await user.type(screen.getByLabelText(/Principal/i), "1000");
    await user.type(screen.getByLabelText(/Taxa mensal/i), "1");
    await user.type(screen.getByLabelText(/Prazo/i), "12");
    await user.click(screen.getByRole("button", { name: /Calcular/i }));

    await waitFor(() =>
      expect(screen.getByTestId("juros-simples-result")).toBeInTheDocument(),
    );
    expect(screen.getByTestId("summary-simples-grid")).toBeInTheDocument();
    expect(screen.getByTestId("amortizacao-simples-table")).toBeInTheDocument();
    expect(screen.getByText(/Tudo certo/i)).toBeInTheDocument();
    expect(post).toHaveBeenCalledWith(
      "/interest/simple",
      { principal: "1000", taxa_mensal: "0.010000", prazo_meses: 12 },
      expect.anything(),
    );
  });

  it("falha 422 mostra ErrorState com detail", async () => {
    const user = userEvent.setup();
    const err = makeAxiosError(422, {
      status: 422,
      title: "Validation Error",
      detail: "taxa_mensal é obrigatória",
    });
    const post = vi.fn(() => {
      throw err;
    });
    __setApiClientForTests(fakeInstance(post));

    render(<JurosSimplesPanel />);
    await user.type(screen.getByLabelText(/Principal/i), "1000");
    await user.type(screen.getByLabelText(/Taxa mensal/i), "1");
    await user.type(screen.getByLabelText(/Prazo/i), "12");
    await user.click(screen.getByRole("button", { name: /Calcular/i }));

    await waitFor(() =>
      expect(screen.getByText(/taxa_mensal/i)).toBeInTheDocument(),
    );
  });
});
