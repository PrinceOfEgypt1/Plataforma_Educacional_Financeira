import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type {
  CompareAmortizationOut,
  PriceOut,
  SacOut,
} from "@/types/amortization";

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

vi.mock("next/navigation", () => ({
  usePathname: () => "/amortizacao",
  useRouter: () => ({ push: () => {} }),
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
  charts: [
    {
      x_label: "Periodo",
      y_label: "Saldo devedor",
      series: [
        {
          label: "PRICE",
          kind: "price",
          points: ["92115.12", "84151.75"],
        },
      ],
    },
  ],
  interpretation: {
    headline: "PRICE mantem parcelas constantes",
    body: "A tabela PRICE reduz o saldo com amortizacao crescente.",
  },
  alerts: [
    {
      code: "PRICE_TOTAL",
      severity: "info",
      message: "Confira o custo total antes de contratar.",
    },
  ],
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
  charts: [
    {
      x_label: "Periodo",
      y_label: "Saldo devedor",
      series: [
        {
          label: "SAC",
          kind: "sac",
          points: ["91666.67", "83333.34"],
        },
      ],
    },
  ],
  interpretation: {
    headline: "SAC reduz parcelas ao longo do tempo",
    body: "A amortizacao constante faz os juros cairem a cada periodo.",
  },
  alerts: [
    {
      code: "SAC_PARCELA",
      severity: "warning",
      message: "A parcela inicial e maior no SAC.",
    },
  ],
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
  tables: {
    price: [PRICE_ROW],
    sac: [SAC_ROW],
  },
  charts: [
    {
      x_label: "Periodo",
      y_label: "Saldo devedor",
      series: [
        { label: "PRICE", kind: "price", points: ["92115.12", "84151.75"] },
        { label: "SAC", kind: "sac", points: ["91666.67", "83333.34"] },
      ],
    },
  ],
  interpretation: {
    headline: "SAC cobra menos juros neste cenario",
    body: "Com taxa positiva e prazo maior que 1, o SAC tem menor total de juros.",
  },
  alerts: [
    {
      code: "COMPARE_SAC",
      severity: "info",
      message: "SAC apresentou menor custo total de juros.",
    },
  ],
};

const simularPriceMock = vi.mocked(simularPrice);
const simularSacMock = vi.mocked(simularSac);
const compararAmortizacaoMock = vi.mocked(compararAmortizacao);

async function fillBaseForm(): Promise<void> {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/Principal \(BRL\)/i), "100.000,00");
  await user.type(screen.getByLabelText(/Taxa do periodo/i), "1,00");
  await user.type(screen.getByLabelText(/Prazo \(periodos\)/i), "12");
}

describe("AmortizacaoPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    simularPriceMock.mockResolvedValue(PRICE_OUT);
    simularSacMock.mockResolvedValue(SAC_OUT);
    compararAmortizacaoMock.mockResolvedValue(COMPARE_OUT);
  });

  it("renderiza modulo real e nao usa placeholder", () => {
    render(<AmortizacaoPage />);

    expect(screen.getByTestId("amortizacao-page")).toBeInTheDocument();
    expect(screen.getByTestId("amortizacao-tabs")).toBeInTheDocument();
    expect(screen.getByTestId("amortizacao-price-form")).toBeInTheDocument();
    expect(
      screen.queryByText(/M[oó]dulo em constru[cç][aã]o/i),
    ).not.toBeInTheDocument();
  });

  it("renderiza conteudo educacional visivel de amortizacao", () => {
    render(<AmortizacaoPage />);

    const aprendaMais = screen.getByTestId("amortizacao-aprenda-mais");
    expect(aprendaMais.tagName.toLowerCase()).toBe("details");
    expect(aprendaMais).not.toHaveAttribute("open");
    expect(
      within(aprendaMais).getByRole("heading", {
        name: /Entenda a amortiza[cç][aã]o/i,
      }),
    ).toBeInTheDocument();
    expect(
      within(aprendaMais).getByText(/PRICE.*parcela constante/i),
    ).toBeInTheDocument();
    expect(
      within(aprendaMais).getByText(/SAC.*amortiza[cç][aã]o constante/i),
    ).toBeInTheDocument();
    expect(within(aprendaMais).getByText(/PRICE x SAC/i)).toBeInTheDocument();
    expect(
      within(aprendaMais).getAllByTestId("amortizacao-saiba-mais-disclaimer")
        .length,
    ).toBeGreaterThan(0);

    const glossario = screen.getByTestId("amortizacao-glossario");
    expect(glossario.tagName.toLowerCase()).toBe("details");
    expect(glossario).not.toHaveAttribute("open");
    expect(within(glossario).getByText("Principal")).toBeInTheDocument();
    expect(within(glossario).getByText("Taxa por período")).toBeInTheDocument();
    expect(within(glossario).getByText("Saldo final")).toBeInTheDocument();

    const cuidados = screen.getByTestId("amortizacao-cuidados");
    expect(cuidados.tagName.toLowerCase()).toBe("details");
    expect(cuidados).not.toHaveAttribute("open");
    expect(
      within(cuidados).getByText("Simulação não substitui contrato"),
    ).toBeInTheDocument();
    expect(
      within(cuidados).getByText("Parcela não é custo total"),
    ).toBeInTheDocument();
  });

  it("valida campos obrigatorios antes de chamar a API", async () => {
    const user = userEvent.setup();
    render(<AmortizacaoPage />);

    await user.click(screen.getByRole("button", { name: /Calcular PRICE/i }));

    expect(screen.getByText(/Informe o valor financiado/i)).toBeInTheDocument();
    expect(screen.getByText(/Informe a taxa do periodo/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Informe o prazo em periodos/i),
    ).toBeInTheDocument();
    expect(simularPriceMock).not.toHaveBeenCalled();
  });

  it("executa happy path PRICE com resumo, tabela, grafico, alerta e interpretacao", async () => {
    const user = userEvent.setup();
    render(<AmortizacaoPage />);

    await fillBaseForm();
    await user.click(screen.getByRole("button", { name: /Calcular PRICE/i }));

    const result = await screen.findByTestId("amortizacao-price-result");
    expect(simularPriceMock).toHaveBeenCalledWith({
      principal: "100000.00",
      taxa_periodo: "0.010000",
      n_periodos: 12,
    });
    expect(
      within(result).getByTestId("summary-price-grid"),
    ).toBeInTheDocument();
    expect(within(result).getAllByText(/R\$ 8\.884,88/).length).toBeGreaterThan(
      0,
    );
    expect(within(result).getByTestId("amortizacao-table")).toBeInTheDocument();
    expect(
      within(result).getByTestId("amortizacao-price-chart-layer"),
    ).not.toHaveAttribute("open");
    expect(
      within(result).getByTestId("amortizacao-price-table-layer"),
    ).not.toHaveAttribute("open");
    expect(within(result).getByText(/R\$ 7\.884,88/)).toBeInTheDocument();
    expect(
      within(result).getByTestId("amortizacao-saldo-chart"),
    ).toBeInTheDocument();
    expect(within(result).getByText(/PRICE_TOTAL/i)).toBeInTheDocument();
    expect(
      within(result).getByRole("heading", {
        name: /PRICE mantem parcelas constantes/i,
      }),
    ).toBeInTheDocument();
  });

  it("mostra estado loading durante chamada PRICE", async () => {
    const user = userEvent.setup();
    let resolvePromise: (value: PriceOut) => void = () => {};
    simularPriceMock.mockReturnValue(
      new Promise<PriceOut>((resolve) => {
        resolvePromise = resolve;
      }),
    );
    render(<AmortizacaoPage />);

    await fillBaseForm();
    await user.click(screen.getByRole("button", { name: /Calcular PRICE/i }));

    expect(screen.getByText(/Calculando PRICE/i)).toBeInTheDocument();

    await act(async () => {
      resolvePromise(PRICE_OUT);
    });

    expect(
      await screen.findByTestId("amortizacao-price-result"),
    ).toBeInTheDocument();
  });

  it("mostra erro de API", async () => {
    const user = userEvent.setup();
    simularPriceMock.mockRejectedValue({
      kind: "problem",
      status: 422,
      title: "Validation Error",
      detail: "principal deve ser maior que zero",
      raw: {},
    });
    render(<AmortizacaoPage />);

    await fillBaseForm();
    await user.click(screen.getByRole("button", { name: /Calcular PRICE/i }));

    expect(
      await screen.findByText(/principal deve ser maior que zero/i),
    ).toBeInTheDocument();
  });

  it("executa happy path SAC", async () => {
    const user = userEvent.setup();
    render(<AmortizacaoPage />);

    await user.click(screen.getByRole("tab", { name: "SAC" }));
    await fillBaseForm();
    await user.click(screen.getByRole("button", { name: /Calcular SAC/i }));

    const result = await screen.findByTestId("amortizacao-sac-result");
    expect(simularSacMock).toHaveBeenCalledWith({
      principal: "100000.00",
      taxa_periodo: "0.010000",
      n_periodos: 12,
    });
    expect(within(result).getByTestId("summary-sac-grid")).toBeInTheDocument();
    expect(within(result).getAllByText(/R\$ 9\.333,33/).length).toBeGreaterThan(
      0,
    );
    expect(within(result).getByText(/SAC_PARCELA/i)).toBeInTheDocument();
    expect(
      within(result).getByTestId("amortizacao-sac-chart-layer"),
    ).not.toHaveAttribute("open");
    expect(
      within(result).getByTestId("amortizacao-sac-table-layer"),
    ).not.toHaveAttribute("open");
    expect(
      within(result).getByRole("heading", {
        name: /SAC reduz parcelas ao longo do tempo/i,
      }),
    ).toBeInTheDocument();
  });

  it("executa happy path compare com tabelas PRICE e SAC", async () => {
    const user = userEvent.setup();
    render(<AmortizacaoPage />);

    await user.click(screen.getByRole("tab", { name: /Comparar/i }));
    await fillBaseForm();
    await user.click(
      screen.getByRole("button", { name: /Comparar sistemas/i }),
    );

    const result = await screen.findByTestId("amortizacao-compare-result");
    expect(compararAmortizacaoMock).toHaveBeenCalledWith({
      principal: "100000.00",
      taxa_periodo: "0.010000",
      n_periodos: 12,
    });
    expect(
      within(result).getByTestId("summary-compare-grid"),
    ).toBeInTheDocument();
    expect(
      within(result).getByTestId("amortizacao-compare-tables"),
    ).toBeInTheDocument();
    expect(
      within(result).getByTestId("amortizacao-compare-chart-layer"),
    ).not.toHaveAttribute("open");
    expect(
      within(result).getByTestId("amortizacao-compare-table-layer"),
    ).not.toHaveAttribute("open");
    expect(within(result).getByText(/COMPARE_SAC/i)).toBeInTheDocument();
    expect(
      within(result).getByRole("heading", {
        name: /SAC cobra menos juros neste cenario/i,
      }),
    ).toBeInTheDocument();
  });
});
