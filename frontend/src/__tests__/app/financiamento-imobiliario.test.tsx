import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { FinanciamentoCockpit } from "@/components/financing/FinanciamentoCockpit";
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
    prestacao_financeira: "1797.00",
    mip_mensal: "0.00",
    dfi_dfc_mensal: "0.00",
    seguros_nao_discriminados: false,
    seguro_mensal: "80.00",
    taxa_administracao_mensal: "0.00",
    tarifa_mensal: "0.00",
    custo_admin_mensal: "0.00",
    encargos: "80.00",
    encargo_mensal_total: "1877.00",
    prestacao: "1877.00",
    saldo_final: Math.max(0, 239883 - i * 117).toFixed(2),
  }));
}

function makeResult(sistema: SistemaAmortizacao): FinanciamentoImobOut {
  const parcelas = makeParcelas(360);
  const first = parcelas[0];
  const last = parcelas[parcelas.length - 1];
  if (first === undefined || last === undefined) {
    throw new Error("massa de parcelas inválida");
  }

  return {
    summary: {
      sistema_amortizacao: sistema,
      valor_imovel: "300000.00",
      valor_entrada: "60000.00",
      valor_financiado: "240000.00",
      prazo_meses: 360,
      taxa_juros_mensal: "0.007000",
      taxa_juros_anual_nominal: "0.084000",
      taxa_juros_anual_efetiva: "0.087312",
      primeira_prestacao_financeira: "1797.00",
      ultima_prestacao_financeira: "1785.00",
      primeiro_encargo_mensal_total: "1877.00",
      ultimo_encargo_mensal_total: "1785.00",
      total_seguros: "0.00",
      total_tarifas: "0.00",
      total_custo_admin: "0.00",
      total_mip: "0.00",
      total_dfi_dfc: "0.00",
      seguros_nao_discriminados: false,
      custo_financeiro_total: "200000.00",
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
    anatomia_encargo: {
      amortizacao: "117.00",
      juros: "1680.00",
      prestacao_financeira: "1797.00",
      mip_mensal: "0.00",
      dfi_dfc_mensal: "0.00",
      seguros_total: "0.00",
      seguros_nao_discriminados: false,
      taxa_administracao_mensal: "0.00",
      componentes_acessorios: "0.00",
      seguro_mensal: "80.00",
      tarifa_mensal: "0.00",
      custo_admin_mensal: "0.00",
      encargos: "80.00",
      encargo_mensal_total: "1877.00",
      pct_amortizacao: "6.23",
      pct_juros: "89.51",
      pct_prestacao_financeira: "95.74",
      pct_mip: "0.00",
      pct_dfi_dfc: "0.00",
      pct_seguros: "0.00",
      pct_taxa_administracao: "0.00",
      pct_seguro: "4.26",
      pct_tarifa: "0.00",
      pct_custo_admin: "0.00",
      pct_encargos: "4.26",
    },
    componentes_cet: [],
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
    formulas_usadas: [
      {
        nome: "PRICE",
        expressao: "PMT = PV × [ i × (1+i)^n ] ÷ [ (1+i)^n − 1 ]",
        uso: "prestação constante",
      },
    ],
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
    diferenca_primeira_prestacao_financeira: "600.00",
    diferenca_ultima_prestacao_financeira: "-1200.00",
    diferenca_primeiro_encargo_mensal: "600.00",
    diferenca_ultimo_encargo_mensal: "-1200.00",
    interpretacao_dinamica: "SAC economiza. Consulte o CET oficial.",
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

describe("FinanciamentoCockpit F8C", () => {
  it("renderiza a moldura visual fiel ao wireframe aprovado", () => {
    render(<FinanciamentoCockpit />);

    expect(screen.getByTestId("observatory-brand-label")).toHaveTextContent(
      "Plataforma Educacional Financeira",
    );
    expect(
      screen.getByText("Módulo — Financiamento Imobiliário"),
    ).toBeInTheDocument();
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
    expect(screen.queryByText("Financial Observatory")).not.toBeInTheDocument();
  });

  it("mostra stepper de 7 etapas e cards com CTA interno", () => {
    render(<FinanciamentoCockpit />);

    const stepper = screen.getByTestId("financiamento-f8a-stepper");
    for (const label of [
      "Preparar",
      "Simular",
      "Resultado",
      "Entender",
      "Comparar",
      "Conferir",
      "Decidir",
    ]) {
      expect(stepper).toHaveTextContent(label);
    }

    for (const [testId, action] of [
      ["financiamento-card-conceito", "Entender"],
      ["financiamento-card-resultado", "Visualizar"],
      ["financiamento-card-comparacao", "Comparar"],
      ["financiamento-card-tabela", "Visualizar tabela"],
      ["financiamento-card-memoria", "Ver memória"],
      ["financiamento-card-fontes", "Ver fontes"],
    ] as const) {
      expect(screen.getByTestId(testId)).toHaveTextContent(action);
    }
  });

  it("navega por painéis internos com botão Voltar", async () => {
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

  it("usa Gerar simulação como ação inequívoca e chama o service oficial", async () => {
    vi.mocked(simularFinanciamentoImobiliario).mockResolvedValueOnce(
      makeResult("PRICE"),
    );
    const user = await openSimulation();
    await fillForm(user);

    expect(
      screen.queryByRole("button", { name: "Simular" }),
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Gerar simulação" }));

    await waitFor(() =>
      expect(
        screen.getByTestId("financiamento-result-panel"),
      ).toBeInTheDocument(),
    );
    expect(simularFinanciamentoImobiliario).toHaveBeenCalledWith({
      valor_imovel: "300000.00",
      valor_entrada: "60000.00",
      prazo_meses: 360,
      taxa_juros_mensal_percentual: "0.7000",
      sistema_amortizacao: "PRICE",
    });
  });

  it("orienta comparação sem dados válidos e compara SAC x PRICE com os mesmos dados preenchidos", async () => {
    const user = userEvent.setup();
    render(<FinanciamentoCockpit />);

    await user.click(screen.getByRole("button", { name: "Comparar" }));
    expect(
      screen.getByText(
        "Preencha os dados da simulação para comparar SAC x PRICE com os mesmos parâmetros.",
      ),
    ).toBeInTheDocument();

    vi.mocked(compararFinanciamentos).mockResolvedValueOnce(compareResult);
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
  });

  it("exibe tabela profissional com todas as parcelas preservadas e linha de totais", async () => {
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

    await user.click(screen.getByRole("button", { name: "Tabela" }));

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
      "Total",
    );
    expect(document.querySelector("tfoot")).not.toBeNull();
  });

  it("apresenta memória de cálculo pedagógica com fórmula, variáveis, substituição e arredondamento", async () => {
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

    await user.click(screen.getByRole("button", { name: "Memória" }));
    const panel = await screen.findByTestId("financiamento-memory-panel");
    expect(panel).toHaveTextContent("SAC — Amortização Constante");
    expect(panel).toHaveTextContent("PRICE — Parcela Constante");
    expect(panel).toHaveTextContent("Valores substituídos");
    expect(panel).toHaveTextContent("PV=240000.00");
    expect(panel).toHaveTextContent("ROUND_HALF_EVEN");
  });

  it("organiza fontes, limites e alertas institucionais sem modal essencial", async () => {
    const user = userEvent.setup();
    render(<FinanciamentoCockpit />);

    await user.click(screen.getByRole("button", { name: "Ver fontes" }));
    const panel = screen.getByTestId("financiamento-fontes-panel");

    expect(panel).toHaveTextContent("A simulação considera");
    expect(panel).toHaveTextContent("A simulação não considera");
    expect(panel).toHaveTextContent("Banco Central do Brasil");
    expect(panel).toHaveTextContent("Instituição financeira");
    expect(panel).toHaveTextContent("FGTS");
    expect(panel).toHaveTextContent("CET");
    expect(panel).toHaveTextContent("análise de crédito");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("mantém a tela principal sem rolagem de página e sem mojibake", () => {
    render(<FinanciamentoCockpit />);

    const cockpit = screen.getByTestId("financiamento-cockpit");
    expect(cockpit).toHaveAttribute("data-no-page-scroll", "true");
    expect(cockpit).toHaveClass("overflow-hidden");
    const mojibakePattern = new RegExp("\\u00c3[\\u00a9\\u00b3\\u00b5\\u00a3]");
    expect(cockpit.textContent ?? "").not.toMatch(mojibakePattern);
  });
});
