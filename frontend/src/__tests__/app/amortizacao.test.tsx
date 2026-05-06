import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { pctInputToRateString } from "@/lib/money";
import type {
  CompareAmortizationOut,
  PriceOut,
  SacOut,
} from "@/types/amortization";

class NoopResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

vi.stubGlobal("ResizeObserver", NoopResizeObserver);

vi.mock("next/navigation", () => ({
  usePathname: () => "/amortizacao",
}));

vi.mock("@/services/amortization/amortizationService", () => ({
  simularPrice: vi.fn(),
  simularSac: vi.fn(),
  compararAmortizacao: vi.fn(),
}));

import AmortizacaoPage from "@/app/(app)/amortizacao/page";
import {
  compararAmortizacao,
  simularPrice,
  simularSac,
} from "@/services/amortization/amortizationService";

const PRICE_ROW = {
  periodo: 1,
  saldo_inicial: "100000.00",
  juros: "1000.00",
  amortizacao: "7884.88",
  parcela: "8884.88",
  saldo_final: "92115.12",
};

const SAC_ROW = {
  periodo: 1,
  saldo_inicial: "100000.00",
  juros: "1000.00",
  amortizacao: "8333.33",
  parcela: "9333.33",
  saldo_final: "91666.67",
};

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
  tables: { amortizacao: [PRICE_ROW] },
  charts: [],
  interpretation: { headline: "PRICE", body: "Parcela constante." },
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
  tables: { amortizacao: [SAC_ROW] },
  charts: [],
  interpretation: { headline: "SAC", body: "Parcela decrescente." },
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
  tables: { price: [PRICE_ROW], sac: [SAC_ROW] },
  charts: [
    {
      x_label: "Período",
      y_label: "Saldo",
      series: [
        { label: "PRICE", kind: "price", points: ["92115.12"] },
        { label: "SAC", kind: "sac", points: ["91666.67"] },
      ],
    },
  ],
  interpretation: { headline: "Comparar", body: "SAC cobra menos juros." },
  alerts: [],
};

const priceMock = vi.mocked(simularPrice);
const sacMock = vi.mocked(simularSac);
const compareMock = vi.mocked(compararAmortizacao);

describe("/amortizacao — Financial Cockpit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    priceMock.mockResolvedValue(PRICE_OUT);
    sacMock.mockResolvedValue(SAC_OUT);
    compareMock.mockResolvedValue(COMPARE_OUT);
  });

  it("renderiza cockpit PRICE com subtabs, KPIs, gráfico e painel direito", async () => {
    render(<AmortizacaoPage />);

    expect(screen.getByTestId("amortizacao-cockpit")).toBeInTheDocument();
    expect(screen.getByTestId("cockpit-subtab-price")).toBeInTheDocument();
    expect(screen.getByTestId("cockpit-input-panel")).toBeInTheDocument();
    expect(screen.getByTestId("cockpit-kpi-strip")).toBeInTheDocument();
    expect(screen.getByTestId("cockpit-chart-panel")).toBeInTheDocument();
    expect(screen.getByTestId("cockpit-education-panel")).toBeInTheDocument();
    expect(screen.getByTestId("cockpit-insight-bar")).toBeInTheDocument();

    await waitFor(() => expect(priceMock).toHaveBeenCalled());
    expect(priceMock).toHaveBeenCalledWith({
      principal: "100000.00",
      taxa_periodo: "0.010000",
      n_periodos: 12,
    });
  });

  it("navega por SAC e Comparar usando os services existentes", async () => {
    const user = userEvent.setup();
    render(<AmortizacaoPage />);

    await user.click(screen.getByRole("tab", { name: /^SAC$/i }));
    await waitFor(() => expect(sacMock).toHaveBeenCalled());
    expect(screen.getByText(/EVOLUÇÃO DAS PARCELAS SAC/i)).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /^Comparar$/i }));
    await waitFor(() => expect(compareMock).toHaveBeenCalled());
    expect(
      screen.getByText(/EVOLUÇÃO DAS PARCELAS — PRICE × SAC/i),
    ).toBeInTheDocument();
  });

  it("abre modal de amortização com as seis abas obrigatórias", async () => {
    const user = userEvent.setup();
    render(<AmortizacaoPage />);

    await user.click(
      screen.getByRole("button", { name: /entender a tabela/i }),
    );
    const dialog = screen.getByRole("dialog", {
      name: /entenda a amortização/i,
    });
    expect(
      within(dialog).getByText(/O que a tabela mostra/i),
    ).toBeInTheDocument();
    expect(within(dialog).getByTestId("modal-tab-price")).toBeInTheDocument();
    expect(within(dialog).getByTestId("modal-tab-sac")).toBeInTheDocument();
    expect(
      within(dialog).getByTestId("modal-tab-price-sac"),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByTestId("modal-tab-glossario"),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByTestId("modal-tab-cuidados"),
    ).toBeInTheDocument();
  });

  it("aceita vírgula e ponto na taxa sem validação nativa em PRICE, SAC e Comparar", async () => {
    const user = userEvent.setup();
    render(<AmortizacaoPage />);

    for (const [input, normalized] of [
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
    ] as const) {
      expect(pctInputToRateString(input)).toBe(normalized);
    }

    const priceRate = screen.getByLabelText(/taxa do período/i);
    expect(priceRate).toHaveAttribute("type", "text");
    expect(priceRate).toHaveAttribute("inputmode", "decimal");
    expect(priceRate.closest("form")).toHaveAttribute("novalidate");

    await user.clear(priceRate);
    await user.type(priceRate, "1,50");
    await user.click(screen.getByRole("button", { name: /calcular price/i }));
    await waitFor(() =>
      expect(priceMock).toHaveBeenLastCalledWith({
        principal: "100000.00",
        taxa_periodo: "0.015000",
        n_periodos: 12,
      }),
    );

    await user.click(screen.getByRole("tab", { name: /^SAC$/i }));
    const sacRate = screen.getByLabelText(/taxa do período/i);
    await user.clear(sacRate);
    await user.type(sacRate, "0,80");
    await user.click(screen.getByRole("button", { name: /calcular sac/i }));
    await waitFor(() =>
      expect(sacMock).toHaveBeenLastCalledWith({
        principal: "100000.00",
        taxa_periodo: "0.008000",
        n_periodos: 12,
      }),
    );

    await user.click(screen.getByRole("tab", { name: /^Comparar$/i }));
    const compareRate = screen.getByLabelText(/taxa do período/i);
    await user.clear(compareRate);
    await user.type(compareRate, "10.75");
    await user.click(screen.getByRole("button", { name: /comparar/i }));
    await waitFor(() =>
      expect(compareMock).toHaveBeenLastCalledWith({
        principal: "100000.00",
        taxa_periodo: "0.107500",
        n_periodos: 12,
      }),
    );
  });

  it("mantém conteúdo educativo completo do cockpit de amortização", async () => {
    const user = userEvent.setup();
    render(<AmortizacaoPage />);

    expect(screen.getAllByText(/Tabela PRICE/i).length).toBeGreaterThan(0);

    await user.click(screen.getByRole("tab", { name: /^SAC$/i }));
    expect(screen.getByText(/Tabela SAC/i)).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: /SAC × PRICE/i }));
    expect(screen.getByText(/SAC vs PRICE/i)).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /^Comparar$/i }));
    expect(screen.getByText(/PRICE × SAC — o essencial/i)).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: /^Tabela$/i }));
    expect(screen.getByText(/Tabela Comparativa/i)).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /^Análise$/i }));
    await user.click(screen.getByRole("button", { name: /leitura completa/i }));
    const dialog = screen.getByRole("dialog", {
      name: /entenda a amortização/i,
    });
    await user.click(within(dialog).getByTestId("modal-tab-glossario"));
    expect(
      within(dialog).getByText(/Glossário da amortização/i),
    ).toBeInTheDocument();
    expect(within(dialog).getByText(/^Principal$/i)).toBeInTheDocument();
    expect(within(dialog).getByText(/Número de períodos/i)).toBeInTheDocument();
    await user.click(within(dialog).getByTestId("modal-tab-cuidados"));
    expect(
      within(dialog).getByText(/Cuidados educacionais/i),
    ).toBeInTheDocument();
  });
});
