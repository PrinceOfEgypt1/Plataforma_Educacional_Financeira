import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FinanciamentoCompareChart } from "@/components/financing/FinanciamentoCompareChart";
import type {
  FinanciamentoImobCompareOut,
  FinanciamentoImobOut,
  FinanciamentoPeriodo,
  SistemaAmortizacao,
} from "@/types/financing";

class NoopResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

vi.stubGlobal("ResizeObserver", NoopResizeObserver);

function makeParcelas(prazo: number): ReadonlyArray<FinanciamentoPeriodo> {
  return Array.from({ length: prazo }, (_, i) => ({
    numero: i + 1,
    saldo_inicial: "240000.00",
    juros: "1680.00",
    amortizacao: "2000.00",
    mip_mensal: "0.00",
    dfi_dfc_mensal: "0.00",
    seguros_nao_discriminados: false,
    taxa_administracao_mensal: "0.00",
    prestacao_financeira: "3680.00",
    seguro_mensal: "0.00",
    tarifa_mensal: "0.00",
    custo_admin_mensal: "0.00",
    encargo_mensal_total: "3680.00",
    encargos: "0.00",
    prestacao: "3680.00",
    saldo_final: "238000.00",
  }));
}

function makeOut(
  sistema: SistemaAmortizacao,
  prazo: number,
): FinanciamentoImobOut {
  const parcelas = makeParcelas(prazo);
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
      prazo_meses: prazo,
      taxa_juros_mensal: "0.007000",
      taxa_juros_anual_nominal: "0.084000",
      taxa_juros_anual_efetiva: "0.087312",
      primeira_prestacao_financeira: "1797.00",
      ultima_prestacao_financeira: "1785.00",
      primeiro_encargo_mensal_total: "1797.00",
      ultimo_encargo_mensal_total: "1785.00",
      total_seguros: "0.00",
      total_tarifas: "0.00",
      total_custo_admin: "0.00",
      total_mip: "0.00",
      total_dfi_dfc: "0.00",
      seguros_nao_discriminados: false,
      custo_financeiro_total: "200000.00",
      total_pago: "500000.00",
      total_juros: "100000.00",
      total_amortizado: "240000.00",
      total_encargos: "0.00",
      custo_total: "100000.00",
      primeira_parcela: "3680.00",
      ultima_parcela: "3680.00",
    },
    parcelas,
    inputs_normalizados: {
      valor_imovel: "300000.00",
      valor_entrada: "60000.00",
      valor_financiado: "240000.00",
      prazo_meses: prazo,
      taxa_juros_mensal: "0.007000",
      sistema_amortizacao: sistema,
    },
    anatomia_encargo: {
      amortizacao: "667.00",
      juros: "1130.00",
      prestacao_financeira: "1797.00",
      mip_mensal: "0.00",
      dfi_dfc_mensal: "0.00",
      seguros_total: "0.00",
      seguros_nao_discriminados: false,
      taxa_administracao_mensal: "0.00",
      custo_admin_mensal: "0.00",
      componentes_acessorios: "0.00",
      encargo_mensal_total: "1797.00",
      seguro_mensal: "0.00",
      tarifa_mensal: "0.00",
      encargos: "0.00",
      pct_amortizacao: "37.12",
      pct_juros: "62.88",
      pct_prestacao_financeira: "100.00",
      pct_mip: "0.00",
      pct_dfi_dfc: "0.00",
      pct_seguros: "0.00",
      pct_taxa_administracao: "0.00",
      pct_custo_admin: "0.00",
      pct_encargos: "0.00",
      pct_seguro: "0.00",
      pct_tarifa: "0.00",
    },
    componentes_cet: [],
    memoria_calculo: {
      metodo: sistema,
      entradas: {
        valor_imovel: "300000.00",
        valor_entrada: "60000.00",
        valor_financiado: "240000.00",
        prazo_meses: prazo,
        taxa_juros_mensal: "0.007000",
        sistema_amortizacao: sistema,
      },
      formula: "formula",
      variaveis: { PV: "240000.00", i: "0.007000", n: prazo },
      substituicao: "PV=240000.00",
      arredondamento: "ROUND_HALF_EVEN",
      primeira_parcela: first,
      ultima_parcela: last,
      custo_total: "100000.00",
      resultado_final: { total_pago: "500000.00" },
    },
    formulas_usadas: [],
    explicacoes_pedagogicas: [],
    alertas: [],
    fontes: [],
    limites: [],
    metadados_calculo: {
      moeda: "BRL",
      criterio_arredondamento: "ROUND_HALF_EVEN para centavos",
      linhas_tabela: prazo,
      prazo_dinamico_respeitado: true,
      contrato_educacional_api: "Item 7",
    },
    mensagens_interface: [],
    chart_data: {
      saldo_devedor: [],
      prestacoes: [],
      juros_amortizacao: [],
    },
  };
}

function makeCompareOut(prazo: number): FinanciamentoImobCompareOut {
  return {
    price: makeOut("PRICE", prazo),
    sac: makeOut("SAC", prazo),
    comparacao: {
      diferenca_primeira_prestacao_financeira: "600.00",
      diferenca_ultima_prestacao_financeira: "-1200.00",
      diferenca_primeiro_encargo_mensal: "600.00",
      diferenca_ultimo_encargo_mensal: "-1200.00",
      interpretacao_dinamica: "SAC economiza. Consulte o CET oficial.",
      diferenca_primeira_parcela: "100.00",
      diferenca_ultima_parcela: "-100.00",
      diferenca_total_pago: "5000.00",
      diferenca_total_juros: "5000.00",
      comportamento_saldo_devedor: "SAC reduz saldo mais cedo.",
      explicacao_pedagogica: "SAC e PRICE possuem trade-offs diferentes.",
      recomendacoes: ["Compare custo total e capacidade mensal."],
    },
  };
}

describe("FinanciamentoCompareChart", () => {
  it("renderiza com data-testid correto", () => {
    render(<FinanciamentoCompareChart compare={makeCompareOut(12)} />);
    expect(
      screen.getByTestId("financiamento-compare-chart"),
    ).toBeInTheDocument();
  });

  it("renderiza o titulo com PRICE e SAC", () => {
    render(<FinanciamentoCompareChart compare={makeCompareOut(12)} />);
    expect(screen.getByText(/PRICE/i)).toBeInTheDocument();
  });

  it("tem aria-label descritivo para acessibilidade", () => {
    render(<FinanciamentoCompareChart compare={makeCompareOut(12)} />);
    expect(
      screen.getByLabelText(/grafico de comparacao PRICE e SAC/i),
    ).toBeInTheDocument();
  });
});
