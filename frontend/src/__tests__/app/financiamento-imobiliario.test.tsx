import { readFileSync } from "node:fs";
import { join } from "node:path";

import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { FinanciamentoCockpit } from "@/components/financing/FinanciamentoCockpit";
import {
  validateFinanciamentoDraft,
  type FinanciamentoDraft,
} from "@/components/financing/formValidation";
import { MODULES } from "@/config/modules";
import {
  compararFinanciamentos,
  simularFinanciamentoImobiliario,
} from "@/services/financing/financiamentoService";
import type {
  ComponenteCet,
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

const VALID_DRAFT: FinanciamentoDraft = {
  valorImovel: "300000",
  valorEntrada: "60000",
  prazoMeses: "360",
  taxaJurosMensalPercentual: "0,7000",
  sistemaAmortizacao: "PRICE",
  seguroMensal: "80",
  tarifaMensal: "25",
};

function makeParcelas(count: number): ReadonlyArray<FinanciamentoPeriodo> {
  const financed = 240000;
  const amort = financed / count;
  return Array.from({ length: count }, (_, i) => {
    const numero = i + 1;
    const saldoInicial = Math.max(0, financed - i * amort);
    const juros = saldoInicial * 0.007;
    const prestacaoFinanceira = amort + juros;
    const encargos = 105;
    const saldoFinal = Math.max(0, saldoInicial - amort);

    return {
      numero,
      saldo_inicial: saldoInicial.toFixed(2),
      juros: juros.toFixed(2),
      amortizacao: amort.toFixed(2),
      prestacao_financeira: prestacaoFinanceira.toFixed(2),
      mip_mensal: "55.00",
      dfi_dfc_mensal: "25.00",
      seguros_nao_discriminados: false,
      seguro_mensal: "80.00",
      taxa_administracao_mensal: "25.00",
      tarifa_mensal: "25.00",
      custo_admin_mensal: "0.00",
      encargos: encargos.toFixed(2),
      encargo_mensal_total: (prestacaoFinanceira + encargos).toFixed(2),
      prestacao: (prestacaoFinanceira + encargos).toFixed(2),
      saldo_final: saldoFinal.toFixed(2),
    };
  });
}

function makeComponenteCet(
  id: string,
  nome: string,
  valorTotal: string,
  formula: string,
): ComponenteCet {
  return {
    id,
    nome,
    natureza: "calculado",
    categoria: id === "juros" ? "componente_cet" : "componente_encargo",
    valor_total: valorTotal,
    valor_mensal_referencia: "105.00",
    pct_sobre_financiado: "0.120000",
    pct_sobre_total_pago: "0.051420",
    pct_sobre_custo_financeiro_total: "0.082100",
    entra_no_encargo_mensal: true,
    entra_no_custo_total_educacional: true,
    formula,
    explicacao: `${nome} participa da leitura educacional do custo.`,
  };
}

function makeResult(sistema: SistemaAmortizacao): FinanciamentoImobOut {
  const parcelas = makeParcelas(360);
  const first = parcelas[0];
  const last = parcelas[parcelas.length - 1];
  if (first === undefined || last === undefined) {
    throw new Error("massa de parcelas inválida");
  }

  const totalPago = sistema === "PRICE" ? "675720.00" : "560000.00";
  const totalJuros = sistema === "PRICE" ? "395720.00" : "280000.00";
  const primeiraParcela = sistema === "PRICE" ? "1877.00" : "2840.00";
  const ultimaParcela = sistema === "PRICE" ? "1877.00" : "747.00";

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
      primeira_prestacao_financeira: primeiraParcela,
      ultima_prestacao_financeira: ultimaParcela,
      primeiro_encargo_mensal_total: primeiraParcela,
      ultimo_encargo_mensal_total: ultimaParcela,
      total_seguros: "28800.00",
      total_tarifas: "9000.00",
      total_custo_admin: "0.00",
      total_mip: "19800.00",
      total_dfi_dfc: "9000.00",
      seguros_nao_discriminados: false,
      custo_financeiro_total: "200000.00",
      total_pago: totalPago,
      total_juros: totalJuros,
      total_amortizado: "240000.00",
      total_encargos: "37800.00",
      custo_total: sistema === "PRICE" ? "433520.00" : "317800.00",
      primeira_parcela: primeiraParcela,
      ultima_parcela: ultimaParcela,
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
      amortizacao: first.amortizacao,
      juros: first.juros,
      prestacao_financeira: first.prestacao_financeira,
      mip_mensal: "55.00",
      dfi_dfc_mensal: "25.00",
      seguros_total: "80.00",
      seguros_nao_discriminados: false,
      taxa_administracao_mensal: "25.00",
      componentes_acessorios: "105.00",
      seguro_mensal: "80.00",
      tarifa_mensal: "25.00",
      custo_admin_mensal: "0.00",
      encargos: "105.00",
      encargo_mensal_total: first.encargo_mensal_total,
      pct_amortizacao: "27.00",
      pct_juros: "68.76",
      pct_prestacao_financeira: "95.74",
      pct_mip: "2.20",
      pct_dfi_dfc: "1.00",
      pct_seguros: "3.20",
      pct_taxa_administracao: "1.00",
      pct_seguro: "3.20",
      pct_tarifa: "1.00",
      pct_custo_admin: "0.00",
      pct_encargos: "4.26",
    },
    componentes_cet: [
      makeComponenteCet(
        "juros",
        "Juros do financiamento",
        totalJuros,
        "saldo devedor x taxa mensal",
      ),
      makeComponenteCet("seguros", "Seguros MIP e DFI", "28800.00", "55 + 25"),
      makeComponenteCet(
        "tarifa",
        "Taxa de administração",
        "9000.00",
        "25 x 360",
      ),
    ],
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
      formula:
        sistema === "SAC"
          ? "A = PV / n; J_t = SD_{t-1} * i; P_t = A + J_t + encargos"
          : "PMT = PV * i * (1 + i)^n / ((1 + i)^n - 1)",
      variaveis: { PV: "240000.00", i: "0.007000", n: 360 },
      substituicao: "PV=240000.00; i=0.007000; n=360",
      arredondamento: "ROUND_HALF_EVEN para centavos",
      primeira_parcela: first,
      ultima_parcela: last,
      custo_total: "433520.00",
      resultado_final: { total_pago: totalPago, total_juros: totalJuros },
    },
    formulas_usadas: [
      {
        nome: "SAC",
        expressao: "A = PV / n; J_t = SD_{t-1} * i",
        uso: "amortização constante e juros sobre saldo devedor",
      },
      {
        nome: "PRICE",
        expressao: "PMT = PV * [i * (1+i)^n] / [(1+i)^n - 1]",
        uso: "prestação financeira constante",
      },
    ],
    explicacoes_pedagogicas: [
      "SAC começa maior e reduz juros conforme o saldo cai.",
      "PRICE suaviza a parcela inicial, mas pode elevar o total de juros.",
    ],
    alertas: [
      "Simulação educacional sem valor contratual.",
      "Solicite proposta formal antes de contratar.",
    ],
    fontes: [
      {
        nome: "Banco Central do Brasil",
        tipo: "referência institucional",
        observacao: "Referência para CET, crédito e educação financeira.",
      },
      {
        nome: "Instituição financeira",
        tipo: "operacional",
        observacao: "A proposta formal e o CET oficial dependem da IF.",
      },
      {
        nome: "FGTS",
        tipo: "referência institucional",
        observacao:
          "Uso como entrada, amortização ou liquidação depende das regras oficiais.",
      },
    ],
    limites: [
      "Aprovação depende de análise de crédito.",
      "CET oficial inclui custos externos, cartório, avaliação e registro.",
      "FGTS, renda e seguros variam conforme regra e instituição financeira.",
    ],
    metadados_calculo: {
      moeda: "BRL",
      criterio_arredondamento: "ROUND_HALF_EVEN para centavos",
      linhas_tabela: 360,
      prazo_dinamico_respeitado: true,
      contrato_educacional_api: "Item 7",
    },
    mensagens_interface: [
      "Compare SAC e PRICE antes de decidir.",
      "Confira fontes, limites e alertas antes de pedir proposta.",
    ],
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
    interpretacao_dinamica:
      "SAC exige maior fôlego no início, mas reduz juros no cenário comparado.",
    diferenca_primeira_parcela: "-963.00",
    diferenca_ultima_parcela: "1130.00",
    diferenca_total_pago: "115720.00",
    diferenca_total_juros: "115720.00",
    comportamento_saldo_devedor: "SAC reduz o saldo mais cedo.",
    explicacao_pedagogica:
      "SAC começa maior e tende a custar menos; PRICE suaviza a parcela inicial.",
    recomendacoes: [
      "Compare custo total e capacidade de pagamento mensal.",
      "Solicite o CET oficial antes da decisão.",
    ],
  },
};

function sourceText(pathFromFrontend: string): string {
  return readFileSync(join(process.cwd(), pathFromFrontend), "utf8");
}

function forbiddenNeedles(): ReadonlyArray<string> {
  return [
    "TO" + "DO",
    "PLACE" + "HOLDER",
    "place" + "holder",
    "FIX" + "ME",
    "X" + "XX",
    "a defi" + "nir",
    "implementar de" + "pois",
    "pendente de imple" + "mentação",
    "as " + "any",
    ": " + "any",
    "type: ign" + "ore",
    "." + "skip",
    "." + "only",
    "x" + "fail",
  ];
}

function assertNoForbiddenText(text: string): void {
  for (const needle of forbiddenNeedles()) {
    expect(text).not.toContain(needle);
  }
}

function assertNoEncodingDamage(text: string): void {
  const markers = [
    String.fromCharCode(0x00c3) + String.fromCharCode(0x00aa),
    String.fromCharCode(0x00c3) + String.fromCharCode(0x00a7),
    String.fromCharCode(0x00c3) + String.fromCharCode(0x00b3),
    String.fromCharCode(0x00c3) + String.fromCharCode(0x00a1),
    String.fromCharCode(0x00e2) + String.fromCharCode(0x20ac),
    String.fromCharCode(0xfffd),
  ];
  for (const marker of markers) {
    expect(text).not.toContain(marker);
  }
}

async function openSimulation() {
  const user = userEvent.setup();
  render(<FinanciamentoCockpit />);
  await user.click(screen.getByRole("button", { name: "Começar simulação" }));
  return user;
}

async function fillForm(
  user: ReturnType<typeof userEvent.setup>,
  options: Partial<{
    readonly valorImovel: string;
    readonly entrada: string;
    readonly prazo: string;
    readonly taxa: string;
    readonly sistema: SistemaAmortizacao;
    readonly seguro: string;
    readonly tarifa: string;
  }> = {},
) {
  const values = {
    valorImovel: "300000",
    entrada: "60000",
    prazo: "360",
    taxa: "0.7",
    sistema: "PRICE" as SistemaAmortizacao,
    seguro: "80",
    tarifa: "25",
    ...options,
  };

  await user.type(
    screen.getByLabelText(/valor do imóvel/i),
    values.valorImovel,
  );
  await user.type(screen.getByLabelText(/entrada/i), values.entrada);
  await user.type(screen.getByLabelText(/prazo/i), values.prazo);
  await user.type(screen.getByLabelText(/taxa de juros mensal/i), values.taxa);
  await user.selectOptions(
    screen.getByLabelText(/sistema de amortização/i),
    values.sistema,
  );
  await user.type(screen.getByLabelText(/seguro mensal/i), values.seguro);
  await user.type(screen.getByLabelText(/tarifa mensal/i), values.tarifa);
}

async function simulateSuccessfully(
  sistema: SistemaAmortizacao = "PRICE",
  options: Partial<{ readonly taxa: string }> = {},
) {
  const result = makeResult(sistema);
  vi.mocked(simularFinanciamentoImobiliario).mockResolvedValueOnce(result);
  const user = await openSimulation();
  await fillForm(user, { sistema, taxa: options.taxa ?? "0.7" });
  await user.click(screen.getByRole("button", { name: "Gerar simulação" }));
  await waitFor(() =>
    expect(
      screen.getByTestId("financiamento-result-panel"),
    ).toBeInTheDocument(),
  );
  return { user, result };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("F8C — registro e entrada do módulo Imóvel", () => {
  it("mantém o módulo financiamento-imobiliario disponível em modules.ts", () => {
    const moduleEntry = MODULES.find(
      (item) => item.id === "financiamento-imobiliario",
    );

    expect(moduleEntry).toBeDefined();
    expect(moduleEntry?.slug).toBe("financiamento-imobiliario");
    expect(moduleEntry?.href).toBe("/financiamento-imobiliario");
    expect(moduleEntry?.title).toBe("Financiamento Imobiliário");
    expect(moduleEntry?.status).toBe("disponivel");
  });

  it("renderiza a moldura visual F8C com hero aprovado e sem o observatório antigo", () => {
    render(<FinanciamentoCockpit />);

    const cockpit = screen.getByTestId("financiamento-cockpit");
    expect(cockpit).toHaveAttribute("data-no-page-scroll", "true");
    expect(cockpit).toHaveClass("overflow-hidden");
    expect(screen.getByTestId("observatory-brand-label")).toHaveTextContent(
      "Plataforma Educacional Financeira",
    );
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
    expect(screen.queryByText("Financial Observatory")).not.toBeInTheDocument();
  });

  it("mostra stepper de 7 etapas com aria-current no estado ativo", async () => {
    const user = userEvent.setup();
    render(<FinanciamentoCockpit />);

    const stepper = screen.getByTestId("financiamento-f8a-stepper");
    const stepButtons = within(stepper).getAllByRole("button");
    expect(stepButtons).toHaveLength(7);
    expect(
      within(stepper).getByRole("button", { name: /Etapa 1: Preparar/i }),
    ).toHaveAttribute("aria-current", "step");

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

    await user.click(screen.getByRole("button", { name: "Entender" }));
    expect(
      within(stepper).getByRole("button", { name: /Etapa 4: Entender/i }),
    ).toHaveAttribute("aria-current", "step");
  });

  it("mantém abas contextuais internas por etapa sem competir com a ação principal", async () => {
    const user = userEvent.setup();
    render(<FinanciamentoCockpit />);

    const initialTabs = screen.getByTestId("context-tabs-inicio");
    expect(
      within(initialTabs).getByRole("tablist", {
        name: /abas contextuais da etapa inicio/i,
      }),
    ).toBeInTheDocument();
    expect(
      within(initialTabs).getByRole("tab", { name: /visão geral/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Começar simulação" }));
    const simulationTabs = screen.getByTestId("context-tabs-simulacao");
    expect(
      within(simulationTabs).getByRole("tab", { name: /formulário/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Gerar simulação" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /^Simular$/i }),
    ).not.toBeInTheDocument();
  });

  it("renderiza cards principais com CTAs internos alinhados à jornada", () => {
    render(<FinanciamentoCockpit />);

    const expectedCards: ReadonlyArray<readonly [string, string, string]> = [
      [
        "financiamento-card-conceito",
        "Entenda o financiamento imobiliário",
        "Entender",
      ],
      ["financiamento-card-resultado", "Resultado da simulação", "Visualizar"],
      ["financiamento-card-comparacao", "Comparação SAC x PRICE", "Comparar"],
      ["financiamento-card-tabela", "Tabela de parcelas", "Visualizar tabela"],
      ["financiamento-card-memoria", "Memória de cálculo", "Ver memória"],
      ["financiamento-card-fontes", "Fontes, limites e avisos", "Ver fontes"],
    ];

    for (const [testId, title, action] of expectedCards) {
      const card = screen.getByTestId(testId);
      expect(card).toHaveTextContent(title);
      expect(
        within(card).getByRole("button", { name: action }),
      ).toBeInTheDocument();
    }
  });
});

describe("F8C — navegação e service oficial", () => {
  it("navega por CTAs e todo painel interno possui Voltar", async () => {
    const user = userEvent.setup();
    render(<FinanciamentoCockpit />);

    await user.click(
      screen.getByRole("button", { name: "Antes, entender o conceito" }),
    );
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

  it("chama simularFinanciamentoImobiliario com payload oficial ao gerar simulação", async () => {
    vi.mocked(simularFinanciamentoImobiliario).mockResolvedValueOnce(
      makeResult("PRICE"),
    );
    const user = await openSimulation();
    await fillForm(user, { sistema: "PRICE" });

    await user.click(screen.getByRole("button", { name: "Gerar simulação" }));

    await waitFor(() =>
      expect(
        screen.getByTestId("financiamento-result-panel"),
      ).toBeInTheDocument(),
    );
    expect(simularFinanciamentoImobiliario).toHaveBeenCalledTimes(1);
    expect(simularFinanciamentoImobiliario).toHaveBeenCalledWith({
      valor_imovel: "300000.00",
      valor_entrada: "60000.00",
      prazo_meses: 360,
      taxa_juros_mensal_percentual: "0.7000",
      sistema_amortizacao: "PRICE",
      seguro_mensal: "80.00",
      tarifa_mensal: "25.00",
    });
  });

  it("resultado real aparece após simulação sem modal essencial", async () => {
    await simulateSuccessfully("SAC");

    expect(
      screen.getByTestId("financiamento-result-panel"),
    ).toBeInTheDocument();
    expect(screen.getByText(/Cenário SAC/i)).toBeInTheDocument();
    expect(screen.getByText(/Primeira parcela estimada/i)).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("orienta comparação sem dados válidos e leva o usuário para a simulação", async () => {
    const user = userEvent.setup();
    render(<FinanciamentoCockpit />);

    await user.click(screen.getByRole("button", { name: "Comparar" }));

    expect(
      screen.getByText(
        "Preencha os dados da simulação para comparar SAC x PRICE com os mesmos parâmetros.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("financiamento-compact-form"),
    ).toBeInTheDocument();
    expect(compararFinanciamentos).not.toHaveBeenCalled();
  });

  it("compara SAC x PRICE com os mesmos dados preenchidos no formulário", async () => {
    vi.mocked(compararFinanciamentos).mockResolvedValueOnce(compareResult);
    const user = await openSimulation();
    await fillForm(user, { sistema: "SAC" });

    await user.click(
      screen.getByRole("button", { name: "Comparar SAC x PRICE" }),
    );

    await waitFor(() =>
      expect(
        screen.getByTestId("financiamento-compare-summary"),
      ).toBeInTheDocument(),
    );
    expect(compararFinanciamentos).toHaveBeenCalledTimes(1);
    expect(compararFinanciamentos).toHaveBeenCalledWith({
      valor_imovel: "300000.00",
      valor_entrada: "60000.00",
      prazo_meses: 360,
      taxa_juros_mensal_percentual: "0.7000",
      seguro_mensal: "80.00",
      tarifa_mensal: "25.00",
    });
    expect(
      screen.getByTestId("financiamento-compare-chart"),
    ).toBeInTheDocument();
  });
});

describe("F8C — resultado tabbed, pedagogia e próximos passos", () => {
  it("resultado mantém tablist por zonas com abas e painéis equivalentes", async () => {
    const { user } = await simulateSuccessfully("PRICE");

    const zoneNav = screen.getByTestId("result-zone-nav");
    expect(
      within(zoneNav).getByRole("tab", { name: /Zona 1: Resumo/i }),
    ).toHaveAttribute("aria-selected", "true");
    expect(within(zoneNav).getAllByRole("tab")).toHaveLength(5);

    await user.click(
      within(zoneNav).getByRole("tab", { name: /Zona 2: Parcela/i }),
    );
    expect(
      screen.getByTestId("financiamento-anatomia-encargo"),
    ).toBeInTheDocument();
    expect(
      within(zoneNav).getByRole("tab", { name: /Zona 2: Parcela/i }),
    ).toHaveAttribute("aria-selected", "true");
  });

  it("zona de parcela explica anatomia, amortização, juros e encargo mensal", async () => {
    const { user } = await simulateSuccessfully("SAC");
    await user.click(screen.getByRole("tab", { name: /Zona 2: Parcela/i }));

    const anatomy = screen.getByTestId("financiamento-anatomia-encargo");
    expect(anatomy).toHaveTextContent(/prestação financeira/i);
    expect(anatomy).toHaveTextContent(/amortização/i);
    expect(anatomy).toHaveTextContent(/juros/i);
    expect(screen.getByTestId("encargo-mensal-total")).toHaveTextContent(
      /encargo mensal total/i,
    );
  });

  it("zona CET explica composição do custo e não abre painel de fontes por engano", async () => {
    const { user } = await simulateSuccessfully("PRICE");
    await user.click(screen.getByRole("tab", { name: /Zona 3: CET/i }));

    const cet = screen.getByTestId("financiamento-componentes-cet");
    expect(cet).toHaveTextContent(/CET oficial/i);
    expect(cet).toHaveTextContent(/instituição financeira/i);
    expect(cet).toHaveTextContent(/Juros do financiamento/i);
    expect(
      screen.queryByTestId("financiamento-fontes-panel"),
    ).not.toBeInTheDocument();
  });

  it("interpretação educativa usa dados reais do retorno e glossário acessível", async () => {
    const { user } = await simulateSuccessfully("SAC");
    await user.click(
      screen.getByRole("tab", { name: /Zona 4: Interpretação/i }),
    );

    const interpretation = screen.getByTestId("zona4-interpretacao");
    expect(interpretation).toHaveTextContent(/R\$ 280\.000,00 em juros/i);
    expect(interpretation).toHaveTextContent(/SAC/i);
    expect(interpretation).toHaveTextContent(/saldo devedor/i);

    const glossaryButtons = within(interpretation).getAllByRole("button");
    expect(glossaryButtons.length).toBeGreaterThan(0);
    expect(glossaryButtons[0]).toHaveAttribute("tabindex", "0");
    expect(glossaryButtons[0]).toHaveAttribute("aria-describedby");
  });

  it("próximos passos têm CTAs claros, únicos e não redundantes", async () => {
    const { user } = await simulateSuccessfully("PRICE");
    await user.click(
      screen.getByRole("tab", { name: /Zona 5: Próximos passos/i }),
    );

    const zone = screen.getByTestId("zone-proximos-content");
    const buttons = within(zone).getAllByRole("button");
    const labels = buttons.map((button) => button.textContent?.trim() ?? "");

    expect(labels).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/Abrir gráfico comparativo/),
        expect.stringMatching(/Editar simulação/),
        expect.stringMatching(/Abrir tabela/),
        expect.stringMatching(/Ver memória/),
        expect.stringMatching(/Ver fontes/),
        expect.stringMatching(/Ver CET e limites/),
      ]),
    );
    expect(new Set(labels).size).toBe(labels.length);
  });

  it("CTA Ver CET e limites abre a zona CET, não a view de fontes", async () => {
    const { user } = await simulateSuccessfully("PRICE");
    await user.click(
      screen.getByRole("tab", { name: /Zona 5: Próximos passos/i }),
    );

    await user.click(
      screen.getByRole("button", { name: /Ver CET e limites/i }),
    );

    expect(
      screen.getByTestId("financiamento-componentes-cet"),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId("financiamento-fontes-panel"),
    ).not.toBeInTheDocument();
  });

  it("CTAs de resultado levam ao painel correto", async () => {
    const { user } = await simulateSuccessfully("PRICE");

    await user.click(screen.getByRole("button", { name: "Tabela" }));
    expect(screen.getByTestId("financiamento-table")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Voltar" }));

    await user.click(screen.getByRole("button", { name: "Memória" }));
    expect(
      screen.getByTestId("financiamento-memory-panel"),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Voltar" }));

    await user.click(screen.getByRole("button", { name: "Fontes" }));
    expect(
      screen.getByTestId("financiamento-fontes-panel"),
    ).toBeInTheDocument();
  });
});

describe("F8C — tabela, comparação e memória", () => {
  it("tabela preserva todas as 360 parcelas, pagina por blocos e possui tfoot", async () => {
    const { user } = await simulateSuccessfully("SAC");
    await user.click(screen.getByRole("button", { name: "Tabela" }));

    const tableRegion = screen.getByTestId("financiamento-table");
    expect(screen.getByTestId("financiamento-table-count")).toHaveTextContent(
      "360 parcelas geradas e preservadas no modelo",
    );
    expect(screen.getByTestId("financiamento-table-range")).toHaveTextContent(
      /bloco 1\/30/i,
    );
    expect(
      within(tableRegion).getByTestId("parcela-row-1"),
    ).toBeInTheDocument();
    expect(
      within(tableRegion).queryByTestId("parcela-row-360"),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("financiamento-table-totals")).toHaveTextContent(
      /Total/i,
    );
    expect(tableRegion.querySelector("tfoot")).not.toBeNull();

    await user.click(screen.getByRole("button", { name: /Próx/i }));
    expect(screen.getByTestId("financiamento-table-range")).toHaveTextContent(
      /13–24|13-24/i,
    );
  });

  it("arquivo da tabela não usa corte hardcoded e mantém paginação por laço controlado", () => {
    const tableSource = sourceText(
      "src/components/financing/RealEstateFinancingTable.tsx",
    );

    expect(tableSource).not.toContain(".slice(");
    expect(tableSource).toContain("getVisibleRows");
    expect(tableSource).toContain("PAGE_SIZE");
    expect(tableSource).toContain("<tfoot>");
  });

  it("gráfico de comparação SAC x PRICE renderiza com proporção adequada", async () => {
    vi.mocked(compararFinanciamentos).mockResolvedValueOnce(compareResult);
    const user = await openSimulation();
    await fillForm(user);

    await user.click(
      screen.getByRole("button", { name: "Comparar SAC x PRICE" }),
    );

    await waitFor(() =>
      expect(
        screen.getByTestId("financiamento-compare-chart"),
      ).toBeInTheDocument(),
    );
    const chartPanel = screen.getByTestId("compare-chart-pedagogia");
    const chartBox = chartPanel.querySelector("div[style]");
    expect(chartBox).not.toBeNull();
    expect(chartBox).toHaveStyle({ height: "320px" });
    expect(chartPanel).toHaveTextContent(/PRICE/i);
    expect(chartPanel).toHaveTextContent(/SAC/i);
  });

  it("memória de cálculo mostra fórmula, variáveis, valores substituídos e ROUND_HALF_EVEN", async () => {
    const { user } = await simulateSuccessfully("SAC");
    await user.click(screen.getByRole("button", { name: "Memória" }));

    const panel = screen.getByTestId("financiamento-memory-panel");
    expect(panel).toHaveTextContent(/SAC/i);
    expect(panel).toHaveTextContent(/PRICE/i);
    expect(panel).toHaveTextContent(/Valores substituídos/i);
    expect(panel).toHaveTextContent(/PV=240000\.00/i);
    expect(panel).toHaveTextContent(/ROUND_HALF_EVEN/i);
    expect(panel).toHaveTextContent(/1ª parcela/i);
    expect(panel).toHaveTextContent(/última parcela/i);
  });
});

describe("F8C — fontes, limites e educação financeira", () => {
  it("fontes e limites mostram Banco Central, instituição financeira, FGTS, CET e análise de crédito", async () => {
    const { user } = await simulateSuccessfully("PRICE");
    await user.click(screen.getByRole("button", { name: "Fontes" }));

    const panel = screen.getByTestId("financiamento-fontes-panel");
    expect(panel).toHaveTextContent(/A simulação considera/i);
    expect(panel).toHaveTextContent(/A simulação não considera/i);
    expect(panel).toHaveTextContent(/Banco Central do Brasil/i);
    expect(panel).toHaveTextContent(/Instituição financeira/i);
    expect(panel).toHaveTextContent(/FGTS/i);
    expect(panel).toHaveTextContent(/CET/i);
    expect(panel).toHaveTextContent(/análise de crédito/i);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("conceito mantém conteúdo pedagógico sobre renda, FGTS, aprovação, SAC e PRICE", async () => {
    const user = userEvent.setup();
    render(<FinanciamentoCockpit />);

    await user.click(screen.getByRole("button", { name: "Entender" }));
    const panel = screen.getByTestId("financiamento-conceito-panel");

    expect(panel).toHaveTextContent(/SAC/i);
    expect(panel).toHaveTextContent(/PRICE/i);
    expect(panel).toHaveTextContent(/Renda individual ou familiar/i);
    expect(panel).toHaveTextContent(/FGTS/i);
    expect(panel).toHaveTextContent(/aprovação/i);
    expect(panel).toHaveTextContent(/Simulação não é contrato/i);
  });

  it("mantém termos pedagógicos acessíveis em painel aplicável", async () => {
    const { user } = await simulateSuccessfully("PRICE");
    await user.click(
      screen.getByRole("tab", { name: /Zona 4: Interpretação/i }),
    );

    const priceTerm = screen.getByRole("button", { name: "PRICE" });
    expect(priceTerm).toHaveAttribute("tabindex", "0");
    expect(priceTerm).toHaveAttribute("aria-describedby");
  });
});

describe("F8C — validação de taxas suspeitas", () => {
  it("9,75% ao mês gera mensagem dinâmica e bloqueia chamada ao service", async () => {
    const result = validateFinanciamentoDraft({
      ...VALID_DRAFT,
      taxaJurosMensalPercentual: "9,75",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.taxaJurosMensalPercentual).toContain("9,75%");
      expect(result.errors.taxaJurosMensalPercentual).toMatch(
        /acima do comum/i,
      );
    }

    const user = await openSimulation();
    await fillForm(user, { taxa: "9,75" });
    await user.click(screen.getByRole("button", { name: "Gerar simulação" }));

    expect(simularFinanciamentoImobiliario).not.toHaveBeenCalled();
    expect(screen.getByText(/9,75% ao mês/i)).toBeInTheDocument();
  });

  it("13,00% ao mês é bloqueada com mensagem dinâmica", () => {
    const result = validateFinanciamentoDraft({
      ...VALID_DRAFT,
      taxaJurosMensalPercentual: "13,00",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.taxaJurosMensalPercentual).toContain("13,00%");
      expect(result.errors.taxaJurosMensalPercentual).toMatch(/taxa digitada/i);
    }
  });

  it("12,250% ao mês é bloqueada", () => {
    const result = validateFinanciamentoDraft({
      ...VALID_DRAFT,
      taxaJurosMensalPercentual: "12,250",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.taxaJurosMensalPercentual).toContain("12,25%");
    }
  });

  it("1,2500% ao mês é aceita e preserva quatro casas no payload", () => {
    const result = validateFinanciamentoDraft({
      ...VALID_DRAFT,
      taxaJurosMensalPercentual: "1,2500",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.taxa_juros_mensal_percentual).toBe("1.2500");
    }
  });
});

describe("F8C — auditoria antirregressão textual e estrutural", () => {
  it("não exibe banco comercial específico, dano de codificação ou marcadores proibidos", async () => {
    await simulateSuccessfully("PRICE");

    const text = screen.getByTestId("financiamento-cockpit").textContent ?? "";
    for (const bankName of ["Itaú", "Bradesco", "Santander"]) {
      expect(text).not.toContain(bankName);
    }
    assertNoEncodingDamage(text);
    assertNoForbiddenText(text);
  });

  it("arquivos alterados do módulo não trazem marcadores proibidos nem tipagem frouxa", () => {
    const files = [
      "src/components/financing/FinanciamentoCockpit.tsx",
      "src/components/financing/RealEstateFinancingTable.tsx",
      "src/components/financing/RealEstateCompareChart.tsx",
      "src/components/financing/RealEstateMemoryPanel.tsx",
      "src/components/financing/RealEstateSourcesPanel.tsx",
      "src/components/financing/RealEstateObservatoryShell.tsx",
    ];

    for (const file of files) {
      const text = sourceText(file);
      assertNoForbiddenText(text);
      assertNoEncodingDamage(text);
    }
  });

  it("mantém integração real com o service oficial importado pelo cockpit", () => {
    const cockpitSource = sourceText(
      "src/components/financing/FinanciamentoCockpit.tsx",
    );

    expect(cockpitSource).toContain("simularFinanciamentoImobiliario");
    expect(cockpitSource).toContain("compararFinanciamentos");
    expect(cockpitSource).toContain("validateFinanciamentoDraft");
    expect(cockpitSource).not.toContain("fetch(");
    expect(cockpitSource).not.toContain("axios.");
  });
});
