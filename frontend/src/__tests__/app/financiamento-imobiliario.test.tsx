import { render, screen, waitFor, within } from "@testing-library/react";
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
    saldo_inicial: (240000 - i * 117).toFixed(2),
    juros: "1680.00",
    amortizacao: "117.00",
    encargos: "80.00",
    prestacao: "1877.00",
    saldo_final: Math.max(0, 239883 - i * 117).toFixed(2),
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

async function openSimulation() {
  const user = userEvent.setup();
  render(<FinanciamentoCockpit />);
  await user.click(screen.getByRole("button", { name: "Começar simulação" }));
  return user;
}

async function fillForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/valor do imóvel/i), "300000");
  await user.type(screen.getByLabelText(/entrada/i), "60000");
  await user.type(screen.getByLabelText(/prazo/i), "360");
  await user.type(screen.getByLabelText(/taxa de juros mensal/i), "0.7");
}

describe("FinanciamentoCockpit", () => {
  it("renderiza hero educacional premium sem rolagem da tela principal", () => {
    render(<FinanciamentoCockpit />);

    const cockpit = screen.getByTestId("financiamento-cockpit");
    expect(cockpit).toBeInTheDocument();
    expect(cockpit).toHaveAttribute("data-no-page-scroll", "true");
    expect(cockpit).toHaveClass("overflow-hidden");
    expect(
      screen.getByRole("heading", {
        name: "Entenda cada parcela antes de assinar o contrato.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Começar simulação" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Antes, entender o conceito" }),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("financiamento-scenario-panel"),
    ).toHaveTextContent("Cenário atual");
  });

  it("renderiza cards principais com CTA interno", () => {
    render(<FinanciamentoCockpit />);

    expect(screen.getByTestId("financiamento-card-conceito")).toHaveTextContent(
      "Entender",
    );
    expect(
      screen.getByTestId("financiamento-card-resultado"),
    ).toHaveTextContent("Visualizar");
    expect(
      screen.getByTestId("financiamento-card-comparacao"),
    ).toHaveTextContent("Comparar");
    expect(screen.getByTestId("financiamento-card-tabela")).toHaveTextContent(
      "Visualizar tabela",
    );
    expect(screen.getByTestId("financiamento-card-memoria")).toHaveTextContent(
      "Ver memória",
    );
  });

  it("navega por cards e todo painel interno possui Voltar", async () => {
    const user = userEvent.setup();
    render(<FinanciamentoCockpit />);

    await user.click(screen.getByRole("button", { name: "Entender" }));
    expect(
      screen.getByTestId("financiamento-conceito-panel"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Voltar" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Voltar" }));
    await user.click(screen.getByRole("button", { name: "Visualizar tabela" }));
    expect(screen.getByTestId("financiamento-idle-state")).toHaveTextContent(
      "Simule primeiro",
    );
    expect(screen.getByRole("button", { name: "Voltar" })).toBeInTheDocument();
  });

  it("não mantém ambiguidade de Simular e usa Gerar simulação como ação", async () => {
    const user = await openSimulation();

    expect(
      screen.queryByRole("tab", { name: /simular/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Simular" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Gerar simulação" }),
    ).toHaveAttribute("type", "submit");

    await user.click(screen.getByRole("button", { name: "Voltar" }));
    expect(
      screen.getByRole("button", { name: "Começar simulação" }),
    ).toBeInTheDocument();
  });

  it("simula, mostra resultado premium, tabela, memória e não usa modal essencial", async () => {
    vi.mocked(simularFinanciamentoImobiliario).mockResolvedValueOnce(
      makeResult("PRICE"),
    );
    const user = await openSimulation();
    await fillForm(user);

    await user.click(screen.getByRole("button", { name: "Gerar simulação" }));

    await waitFor(() =>
      expect(
        screen.getByTestId("financiamento-result-panel"),
      ).toBeInTheDocument(),
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByText(/Resumo premium/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Ver tabela" }));
    expect(screen.getByTestId("financiamento-table-count")).toHaveTextContent(
      "360 parcelas geradas",
    );
    expect(screen.getByTestId("financiamento-table-totals")).toHaveTextContent(
      "Total",
    );

    await user.click(screen.getByRole("button", { name: "Voltar" }));
    await user.click(screen.getByRole("button", { name: "Ver memória" }));
    expect(screen.getByTestId("financiamento-memory-panel")).toHaveTextContent(
      "PMT = PV",
    );
    expect(screen.getByTestId("financiamento-memory-panel")).toHaveTextContent(
      "Arredondamento",
    );
  });

  it("orienta quando comparação SAC x PRICE é acionada sem dados válidos", async () => {
    const user = userEvent.setup();
    render(<FinanciamentoCockpit />);

    await user.click(screen.getByRole("button", { name: "Comparar" }));

    expect(
      screen.getByText(
        "Preencha os dados da simulação para comparar SAC x PRICE com os mesmos parâmetros.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Gerar simulação" }),
    ).toBeInTheDocument();
  });

  it("executa comparação SAC x PRICE com os mesmos dados preenchidos", async () => {
    vi.mocked(compararFinanciamentos).mockResolvedValueOnce(compareResult);
    const user = await openSimulation();
    await fillForm(user);

    await user.click(
      screen.getByRole("button", { name: "Comparar SAC x PRICE" }),
    );

    await waitFor(() =>
      expect(
        screen.getByTestId("financiamento-compare-summary"),
      ).toBeInTheDocument(),
    );
    expect(compararFinanciamentos).toHaveBeenCalledWith({
      valor_imovel: "300000.00",
      valor_entrada: "60000.00",
      prazo_meses: 360,
      taxa_juros_mensal_percentual: "0.7000",
    });
    expect(
      screen.getByTestId("financiamento-compare-chart"),
    ).toBeInTheDocument();
    expect(screen.getByText(/SAC começa maior/i)).toBeInTheDocument();
  });

  it("exibe fontes, limites e alertas com conteúdo institucional", async () => {
    const user = userEvent.setup();
    render(<FinanciamentoCockpit />);

    await user.click(screen.getByRole("button", { name: "Ver fontes" }));

    const panel = screen.getByTestId("financiamento-fontes-panel");
    expect(panel).toHaveTextContent("A simulação considera");
    expect(panel).toHaveTextContent("A simulação não considera");
    expect(panel).toHaveTextContent("Banco Central do Brasil");
    expect(panel).toHaveTextContent("Caixa Econômica Federal");
    expect(panel).toHaveTextContent("FGTS");
    expect(panel).toHaveTextContent("CET");
    expect(panel).toHaveTextContent("análise de crédito");
  });

  it("mantém tabela completa com linha de totais e prazo preservado", async () => {
    vi.mocked(simularFinanciamentoImobiliario).mockResolvedValueOnce(
      makeResult("SAC"),
    );
    const user = await openSimulation();
    await fillForm(user);

    await user.click(screen.getByRole("button", { name: "Gerar simulação" }));
    await waitFor(() =>
      expect(
        screen.getByTestId("financiamento-result-panel"),
      ).toBeInTheDocument(),
    );
    await user.click(screen.getByRole("button", { name: "Ver tabela" }));

    const table = screen.getByRole("table", {
      name: /parcelas do financiamento/i,
    });
    expect(screen.getByTestId("financiamento-table-count")).toHaveTextContent(
      "360 parcelas geradas e preservadas no modelo",
    );
    expect(
      within(table).getByText(/360 parcelas geradas/i),
    ).toBeInTheDocument();
    expect(screen.getByTestId("financiamento-table-totals")).toHaveTextContent(
      "R$ 560.000,00",
    );
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
