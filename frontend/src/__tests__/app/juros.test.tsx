import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { pctInputToRateString } from "@/lib/money";
import type {
  CompararJurosOut,
  JurosCompostosOut,
  JurosSimplesOut,
} from "@/types/interest";

class NoopResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

vi.stubGlobal("ResizeObserver", NoopResizeObserver);

vi.mock("next/navigation", () => ({
  usePathname: () => "/juros",
}));

vi.mock("@/services/interest", () => ({
  simularJurosSimples: vi.fn(),
  simularJurosCompostos: vi.fn(),
  compararJuros: vi.fn(),
}));

import JurosPage from "@/app/(app)/juros/page";
import {
  compararJuros,
  simularJurosCompostos,
  simularJurosSimples,
} from "@/services/interest";

const SIMPLE_OUT: JurosSimplesOut = {
  summary: {
    principal: "180000.00",
    taxa_mensal: "0.015000",
    prazo_meses: 60,
    juros_totais: "162000.00",
    montante_final: "342000.00",
  },
  tables: {
    amortizacao: [
      {
        periodo: 1,
        saldo_inicial: "180000.00",
        juros_periodo: "2700.00",
        saldo_final: "182700.00",
      },
    ],
  },
  charts: [
    {
      x_label: "Mês",
      y_label: "Saldo",
      series: [
        {
          label: "Simples",
          kind: "simples",
          points: ["182700.00", "185400.00"],
        },
      ],
    },
  ],
  interpretation: { headline: "Linear", body: "Crescimento linear." },
  alerts: [],
};

const COMPOUND_OUT: JurosCompostosOut = {
  summary: {
    principal: "180000.00",
    taxa_mensal: "0.015000",
    prazo_meses: 60,
    aporte_mensal: "0.00",
    juros_totais: "260000.00",
    total_aportado: "0.00",
    total_investido: "180000.00",
    montante_final: "440000.00",
  },
  tables: {
    amortizacao: [
      {
        periodo: 1,
        saldo_inicial: "180000.00",
        juros_periodo: "2700.00",
        aporte: "0.00",
        saldo_final: "182700.00",
      },
    ],
  },
  charts: [
    {
      x_label: "Mês",
      y_label: "Saldo",
      series: [{ label: "Composto", kind: "composto", points: ["182700.00"] }],
    },
  ],
  interpretation: { headline: "Composto", body: "Crescimento composto." },
  alerts: [],
};

const COMPARE_OUT: CompararJurosOut = {
  summary: {
    principal: "180000.00",
    taxa_mensal: "0.015000",
    prazo_meses: 60,
    montante_simples: "342000.00",
    montante_composto: "440000.00",
    diferenca: "98000.00",
    razao: "1.286550",
  },
  tables: {
    simple: [
      {
        periodo: 1,
        saldo_inicial: "180000.00",
        juros_periodo: "2700.00",
        saldo_final: "182700.00",
      },
    ],
    compound: [
      {
        periodo: 1,
        saldo_inicial: "180000.00",
        juros_periodo: "2700.00",
        aporte: "0.00",
        saldo_final: "182700.00",
      },
    ],
  },
  charts: [
    {
      x_label: "Mês",
      y_label: "Saldo",
      series: [
        { label: "Simples", kind: "simples", points: ["182700.00"] },
        { label: "Composto", kind: "composto", points: ["182700.00"] },
      ],
    },
  ],
  interpretation: { headline: "Diferença", body: "Composto diverge." },
  alerts: [],
};

const simpleMock = vi.mocked(simularJurosSimples);
const compoundMock = vi.mocked(simularJurosCompostos);
const compareMock = vi.mocked(compararJuros);

describe("/juros — Financial Cockpit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    simpleMock.mockResolvedValue(SIMPLE_OUT);
    compoundMock.mockResolvedValue(COMPOUND_OUT);
    compareMock.mockResolvedValue(COMPARE_OUT);
  });

  it("renderiza cockpit com subtabs, KPIs, gráfico central e painel educacional", async () => {
    render(<JurosPage />);

    expect(screen.getByTestId("juros-cockpit")).toBeInTheDocument();
    expect(screen.getByTestId("cockpit-subtab-simples")).toBeInTheDocument();
    expect(screen.getByTestId("cockpit-input-panel")).toBeInTheDocument();
    expect(screen.getByTestId("cockpit-kpi-strip")).toBeInTheDocument();
    expect(screen.getByTestId("cockpit-chart-panel")).toBeInTheDocument();
    expect(screen.getByTestId("cockpit-education-panel")).toBeInTheDocument();
    expect(screen.getByTestId("cockpit-insight-bar")).toBeInTheDocument();

    await waitFor(() => expect(simpleMock).toHaveBeenCalled());
    expect(simpleMock).toHaveBeenCalledWith({
      principal: "180000.00",
      taxa_mensal: "0.015000",
      prazo_meses: 60,
    });
  });

  it("navega por juros compostos e comparar usando os services existentes", async () => {
    const user = userEvent.setup();
    render(<JurosPage />);

    await user.click(screen.getByRole("tab", { name: /juros compostos/i }));
    await waitFor(() => expect(compoundMock).toHaveBeenCalled());
    expect(screen.getByText(/CRESCIMENTO COMPOSTO/i)).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /^Comparar$/i }));
    await waitFor(() => expect(compareMock).toHaveBeenCalled());
    expect(
      screen.getByText(/CRESCIMENTOS SIMPLES × COMPOSTO/i),
    ).toBeInTheDocument();
  });

  it("abre modal educacional com todas as abas obrigatórias", async () => {
    const user = userEvent.setup();
    render(<JurosPage />);

    await user.click(
      screen.getByRole("button", { name: /aprofundar leitura/i }),
    );
    const dialog = screen.getByRole("dialog", {
      name: /aprenda mais sobre juros/i,
    });
    expect(within(dialog).getByTestId("modal-tab-js")).toBeInTheDocument();
    expect(within(dialog).getByTestId("modal-tab-jc")).toBeInTheDocument();
    expect(
      within(dialog).getByTestId("modal-tab-comparacao"),
    ).toBeInTheDocument();
    expect(within(dialog).getByTestId("modal-tab-aportes")).toBeInTheDocument();
    expect(
      within(dialog).getByTestId("modal-tab-cuidados"),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByRole("button", { name: /fechar modal/i }),
    ).toBeInTheDocument();
  });

  it("não usa botão Abrir como mecanismo essencial", async () => {
    render(<JurosPage />);

    await waitFor(() => expect(simpleMock).toHaveBeenCalled());

    expect(
      screen.queryByRole("button", { name: /^abrir/i }),
    ).not.toBeInTheDocument();
  });

  it("aceita vírgula e ponto em taxa sem validação nativa nos três regimes", async () => {
    const user = userEvent.setup();
    render(<JurosPage />);

    const requiredCases = [
      ["1", "0.010000"],
      ["1,5", "0.015000"],
      ["1,50", "0.015000"],
      ["1.5", "0.015000"],
      ["1.50", "0.015000"],
      ["0,8", "0.008000"],
      ["0,80", "0.008000"],
      ["0.8", "0.008000"],
      ["0.80", "0.008000"],
      ["2", "0.020000"],
      ["2,0", "0.020000"],
      ["2,00", "0.020000"],
      ["2.0", "0.020000"],
      ["2.00", "0.020000"],
      ["10,75", "0.107500"],
      ["10.75", "0.107500"],
    ] as const;
    for (const [input, normalized] of requiredCases) {
      expect(pctInputToRateString(input)).toBe(normalized);
    }

    const rateInput = screen.getByLabelText(/taxa mensal/i);
    expect(rateInput).toHaveAttribute("type", "text");
    expect(rateInput).toHaveAttribute("inputmode", "decimal");
    expect(rateInput.closest("form")).toHaveAttribute("novalidate");

    await user.clear(rateInput);
    await user.type(rateInput, "1,50");
    await user.click(screen.getByRole("button", { name: /calcular/i }));
    await waitFor(() =>
      expect(simpleMock).toHaveBeenLastCalledWith({
        principal: "180000.00",
        taxa_mensal: "0.015000",
        prazo_meses: 60,
      }),
    );

    await user.click(screen.getByRole("tab", { name: /juros compostos/i }));
    const compoundRate = screen.getByLabelText(/taxa mensal/i);
    await user.clear(compoundRate);
    await user.type(compoundRate, "0,80");
    await user.click(screen.getByRole("button", { name: /calcular/i }));
    await waitFor(() =>
      expect(compoundMock).toHaveBeenLastCalledWith({
        principal: "180000.00",
        taxa_mensal: "0.008000",
        prazo_meses: 60,
      }),
    );

    await user.click(screen.getByRole("tab", { name: /^Comparar$/i }));
    const compareRate = screen.getByLabelText(/taxa mensal/i);
    await user.clear(compareRate);
    await user.type(compareRate, "10.75");
    await user.click(screen.getByRole("button", { name: /comparar/i }));
    await waitFor(() =>
      expect(compareMock).toHaveBeenLastCalledWith({
        principal: "180000.00",
        taxa_mensal: "0.107500",
        prazo_meses: 60,
      }),
    );
  });

  it("mantém conteúdo educativo completo do cockpit de juros", async () => {
    const user = userEvent.setup();
    render(<JurosPage />);

    expect(
      screen.getByText(/Juros simples — em uma frase/i),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: /^Tabela$/i }));
    expect(screen.getByText(/Evolução mês a mês/i)).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /juros compostos/i }));
    expect(screen.getByText(/Juros sobre juros/i)).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /^Comparar$/i }));
    expect(screen.getByText(/Quando divergem/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /leitura completa/i }));
    const dialog = screen.getByRole("dialog", {
      name: /aprenda mais sobre juros/i,
    });
    await user.click(within(dialog).getByTestId("modal-tab-aportes"));
    expect(
      within(dialog).getByText(/Aportes mensais — entrando dinheiro novo/i),
    ).toBeInTheDocument();
    await user.click(within(dialog).getByTestId("modal-tab-cuidados"));
    expect(
      within(dialog).getByText(/Cuidados gerais — juros/i),
    ).toBeInTheDocument();
  });
});
