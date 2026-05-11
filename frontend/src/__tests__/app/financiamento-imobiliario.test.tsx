import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { FinanciamentoCockpit } from "@/components/financing/FinanciamentoCockpit";
import { MODULES } from "@/config/modules";
import {
  compararFinanciamentos,
  simularFinanciamentoImobiliario,
} from "@/services/financing/financiamentoService";
import type {
  FinanciamentoImobCompareOut,
  FinanciamentoImobOut,
  FinanciamentoPeriodo,
  SistemaAmortizacao,
} from "@/types/financing";

vi.mock("@/services/financing/financiamentoService", () => ({
  simularFinanciamentoImobiliario: vi.fn(),
  compararFinanciamentos: vi.fn(),
}));

class NoopResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

vi.stubGlobal("ResizeObserver", NoopResizeObserver);

function makeParcelas(count: number): ReadonlyArray<FinanciamentoPeriodo> {
  return Array.from({ length: count }, (_, i) => ({
    numero: i + 1,
    saldo_inicial: "240000.00",
    juros: "1680.00",
    amortizacao: "117.00",
    encargos: "80.00",
    prestacao: "1877.00",
    saldo_final: "239883.00",
  }));
}

function makeResult(sistema: SistemaAmortizacao): FinanciamentoImobOut {
  const parcelas = makeParcelas(360);
  const first = parcelas[0];
  const last = parcelas[parcelas.length - 1];
  if (first === undefined || last === undefined) {
    throw new Error("parcelas de teste devem existir");
  }
  return {
    summary: {
      sistema_amortizacao: sistema,
      valor_imovel: "300000.00",
      valor_entrada: "60000.00",
      valor_financiado: "240000.00",
      prazo_meses: 360,
      taxa_juros_mensal: "0.007000",
      total_pago: sistema === "PRICE" ? "675720.00" : "560000.00",
      total_juros: sistema === "PRICE" ? "395720.00" : "280000.00",
      total_amortizado: "240000.00",
      total_encargos: "28800.00",
      custo_total: sistema === "PRICE" ? "424520.00" : "308800.00",
      primeira_parcela: sistema === "PRICE" ? "1877.00" : "2840.00",
      ultima_parcela: sistema === "PRICE" ? "1877.00" : "747.00",
    },
    parcelas,
    inputs_normalizados: {
      valor_imovel: "300000.00",
      valor_entrada: "60000.00",
      valor_financiado: "240000.00",
      prazo_meses: 360,
      taxa_juros_mensal: "0.007000",
      sistema_amortizacao: sistema,
    },
    memoria_calculo: {
      metodo: sistema,
      entradas: {
        valor_imovel: "300000.00",
        valor_entrada: "60000.00",
        valor_financiado: "240000.00",
        prazo_meses: 360,
        taxa_juros_mensal: "0.007000",
        sistema_amortizacao: sistema,
      },
      formula: "PMT = PV * i * (1 + i)^n / ((1 + i)^n - 1)",
      variaveis: { PV: "240000.00", i: "0.007000", n: 360 },
      substituicao: "PV=240000.00; i=0.007000; n=360",
      arredondamento: "ROUND_HALF_EVEN para centavos",
      primeira_parcela: first,
      ultima_parcela: last,
      custo_total: "424520.00",
      resultado_final: { total_pago: "675720.00" },
    },
    formulas_usadas: [],
    explicacoes_pedagogicas: [],
    alertas: ["Simulação educacional sem valor contratual."],
    fontes: [
      {
        nome: "Banco Central do Brasil",
        tipo: "referência institucional",
        observacao: "Referência para CET e educação financeira.",
      },
    ],
    limites: ["Aprovação depende de análise de crédito."],
    metadados_calculo: {
      moeda: "BRL",
      criterio_arredondamento: "ROUND_HALF_EVEN para centavos",
      linhas_tabela: 360,
      prazo_dinamico_respeitado: true,
      contrato_educacional_api: "Item 7",
    },
    mensagens_interface: ["Compare SAC e PRICE antes de decidir."],
    chart_data: {
      saldo_devedor: [],
      prestacoes: [],
      juros_amortizacao: [],
    },
  };
}

const compareResult: FinanciamentoImobCompareOut = {
  price: makeResult("PRICE"),
  sac: makeResult("SAC"),
  comparacao: {
    diferenca_primeira_parcela: "-963.00",
    diferenca_ultima_parcela: "1130.00",
    diferenca_total_pago: "115720.00",
    diferenca_total_juros: "115720.00",
    comportamento_saldo_devedor: "SAC reduz o saldo mais cedo.",
    explicacao_pedagogica:
      "SAC começa maior e tende a custar menos; PRICE suaviza a parcela inicial.",
    recomendacoes: ["Compare custo total e capacidade de pagamento mensal."],
  },
};

async function fillForm() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/valor do imóvel/i), "300000");
  await user.type(screen.getByLabelText(/entrada/i), "60000");
  await user.type(screen.getByLabelText(/prazo/i), "360");
  await user.type(screen.getByLabelText(/taxa de juros mensal/i), "0.7");
  return user;
}

describe("FinanciamentoCockpit", () => {
  it("renderiza cockpit premium compacto sem rolagem da tela principal", () => {
    render(<FinanciamentoCockpit />);

    const cockpit = screen.getByTestId("financiamento-cockpit");
    expect(cockpit).toBeInTheDocument();
    expect(cockpit).toHaveAttribute("data-no-page-scroll", "true");
    expect(cockpit).toHaveClass("overflow-hidden");
  });

  it("renderiza abas principais e conteúdo educacional de conceito", async () => {
    const user = userEvent.setup();
    render(<FinanciamentoCockpit />);

    expect(screen.getByRole("tab", { name: "Conceito" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Simular" })).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "Comparar SAC x PRICE" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Entender" }));
    expect(screen.getByText("Como o financiamento nasce")).toBeInTheDocument();
    expect(screen.getByText("Renda, FGTS e aprovação")).toBeInTheDocument();
  });

  it("troca de aba por CTA interno dos cards, incluindo Visualizar tabela", async () => {
    const user = userEvent.setup();
    render(<FinanciamentoCockpit />);

    await user.click(screen.getByRole("button", { name: "Visualizar tabela" }));

    expect(screen.getByRole("tab", { name: "Tabela" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(
      screen.getByText(/Simule para liberar esta visão/i),
    ).toBeInTheDocument();
  });

  it("mantém formulário de simulação completo e botão real de submissão visível", () => {
    render(<FinanciamentoCockpit />);

    expect(screen.getByLabelText(/valor do imóvel/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/entrada/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/prazo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/taxa de juros mensal/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/sistema de amortização/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/seguro mensal/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tarifa mensal/i)).toBeInTheDocument();

    expect(screen.getByTestId("financiamento-submit")).toHaveAttribute(
      "type",
      "submit",
    );
    expect(screen.getByRole("button", { name: "Simular" })).toBeInTheDocument();
  });

  it("simula, mostra resultado, memória e tabela sem modal essencial", async () => {
    vi.mocked(simularFinanciamentoImobiliario).mockResolvedValueOnce(
      makeResult("PRICE"),
    );
    render(<FinanciamentoCockpit />);
    const user = await fillForm();

    await user.click(screen.getByTestId("financiamento-submit"));

    await waitFor(() =>
      expect(screen.getByTestId("financiamento-summary")).toBeInTheDocument(),
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Ver memória" }));
    expect(screen.getByTestId("financiamento-memory-panel")).toHaveTextContent(
      "Valores substituídos",
    );

    await user.click(screen.getByRole("button", { name: "Visualizar tabela" }));
    expect(screen.getByTestId("financiamento-table-count")).toHaveTextContent(
      "360 parcelas geradas",
    );
    expect(screen.getByTestId("financiamento-table")).toHaveClass(
      "overflow-hidden",
    );
  });

  it("executa comparação SAC x PRICE e exibe gráfico em painel próprio", async () => {
    vi.mocked(compararFinanciamentos).mockResolvedValueOnce(compareResult);
    render(<FinanciamentoCockpit />);
    const user = await fillForm();

    await user.click(
      screen.getByRole("button", { name: "Comparar SAC x PRICE" }),
    );

    await waitFor(() =>
      expect(
        screen.getByTestId("financiamento-compare-summary"),
      ).toBeInTheDocument(),
    );
    expect(
      screen.getByTestId("financiamento-compare-chart"),
    ).toBeInTheDocument();
    expect(screen.getByText(/SAC começa maior/i)).toBeInTheDocument();
  });

  it("exibe fontes e limites com aviso educacional e fontes oficiais", async () => {
    const user = userEvent.setup();
    render(<FinanciamentoCockpit />);

    await user.click(screen.getByRole("button", { name: "Ver fontes" }));

    expect(screen.getByTestId("financiamento-fontes-panel")).toHaveTextContent(
      "Banco Central do Brasil",
    );
    expect(screen.getByText(/Caixa Econômica Federal/i)).toBeInTheDocument();
    expect(screen.getByText(/Simulação educacional/i)).toBeInTheDocument();
  });
});

describe("modules.ts — financiamento-imobiliario", () => {
  it("módulo financiamento-imobiliario está marcado como disponivel", () => {
    const modulo = MODULES.find((m) => m.id === "financiamento-imobiliario");
    expect(modulo).toBeDefined();
    expect(modulo?.status).toBe("disponivel");
  });

  it("módulo tem href correto", () => {
    const modulo = MODULES.find((m) => m.id === "financiamento-imobiliario");
    expect(modulo?.href).toBe("/financiamento-imobiliario");
  });
});
