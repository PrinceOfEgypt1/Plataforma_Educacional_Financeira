import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FinanciamentoCompareSummary } from "@/components/financing/FinanciamentoCompareSummary";
import type {
  FinanciamentoImobCompareOut,
  FinanciamentoImobOut,
  FinanciamentoImobSummary,
  FinanciamentoPeriodo,
  SistemaAmortizacao,
} from "@/types/financing";

function summary(sistema: SistemaAmortizacao): FinanciamentoImobSummary {
  return {
    sistema_amortizacao: sistema,
    valor_imovel: "500000.00",
    valor_entrada: "100000.00",
    valor_financiado: "400000.00",
    prazo_meses: 360,
    taxa_juros_mensal: "0.007",
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
    total_pago: sistema === "PRICE" ? "920000.00" : "810000.00",
    total_juros: sistema === "PRICE" ? "500000.00" : "390000.00",
    total_amortizado: "400000.00",
    total_encargos: "20000.00",
    custo_total: sistema === "PRICE" ? "940000.00" : "830000.00",
    primeira_parcela: sistema === "PRICE" ? "2555.00" : "3800.00",
    ultima_parcela: sistema === "PRICE" ? "2555.00" : "1115.00",
  };
}

const row: FinanciamentoPeriodo = {
  numero: 1,
  saldo_inicial: "400000.00",
  juros: "2800.00",
  amortizacao: "1000.00",
  mip_mensal: "0.00",
  dfi_dfc_mensal: "0.00",
  seguros_nao_discriminados: false,
  taxa_administracao_mensal: "0.00",
  prestacao_financeira: "3800.00",
  seguro_mensal: "0.00",
  tarifa_mensal: "0.00",
  custo_admin_mensal: "0.00",
  encargo_mensal_total: "3800.00",
  encargos: "0.00",
  prestacao: "3800.00",
  saldo_final: "399000.00",
};

function out(sistema: SistemaAmortizacao): FinanciamentoImobOut {
  return {
    summary: summary(sistema),
    parcelas: [row],
    inputs_normalizados: {
      valor_imovel: "500000.00",
      valor_entrada: "100000.00",
      valor_financiado: "400000.00",
      prazo_meses: 360,
      taxa_juros_mensal: "0.007",
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
        valor_imovel: "500000.00",
        valor_entrada: "100000.00",
        valor_financiado: "400000.00",
        prazo_meses: 360,
        taxa_juros_mensal: "0.007",
        sistema_amortizacao: sistema,
      },
      formula: "formula",
      variaveis: { PV: "400000.00", i: "0.007", n: 360 },
      substituicao: "PV=400000.00",
      arredondamento: "ROUND_HALF_EVEN",
      primeira_parcela: row,
      ultima_parcela: row,
      custo_total: "940000.00",
      resultado_final: { total_pago: "920000.00" },
    },
    formulas_usadas: [],
    explicacoes_pedagogicas: [],
    alertas: [],
    fontes: [],
    limites: [],
    metadados_calculo: {
      moeda: "BRL",
      criterio_arredondamento: "ROUND_HALF_EVEN para centavos",
      linhas_tabela: 360,
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

const compare: FinanciamentoImobCompareOut = {
  price: out("PRICE"),
  sac: out("SAC"),
  comparacao: {
    diferenca_primeira_prestacao_financeira: "1245.00",
    diferenca_ultima_prestacao_financeira: "-1440.00",
    diferenca_primeiro_encargo_mensal: "1245.00",
    diferenca_ultimo_encargo_mensal: "-1440.00",
    diferenca_primeira_parcela: "1245.00",
    diferenca_ultima_parcela: "-1440.00",
    diferenca_total_pago: "110000.00",
    diferenca_total_juros: "110000.00",
    comportamento_saldo_devedor: "SAC reduz o saldo mais cedo.",
    explicacao_pedagogica: "SAC comeca maior e tende a custar menos.",
    interpretacao_dinamica: "No cenário, SAC economiza. Consulte CET oficial.",
    recomendacoes: ["Compare parcela inicial e custo total."],
  },
};

describe("FinanciamentoCompareSummary", () => {
  it("usa cards responsivos em vez de tabela larga", () => {
    render(<FinanciamentoCompareSummary compare={compare} />);

    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    const cards = screen.getByTestId("financiamento-compare-cards");
    expect(cards.tagName.toLowerCase()).toBe("dl");
    expect(
      within(cards).getByTestId("financiamento-compare-row-total-pago"),
    ).toHaveTextContent("PRICE");
    expect(
      within(cards).getByTestId("financiamento-compare-row-total-pago"),
    ).toHaveTextContent("SAC");
  });

  it("mantem valores financeiros com tabular-nums", () => {
    render(<FinanciamentoCompareSummary compare={compare} />);

    const totalJuros = screen.getByTestId(
      "financiamento-compare-row-total-de-juros",
    );
    const values = totalJuros.querySelectorAll(".tabular-nums");

    expect(values).toHaveLength(2);
    expect(totalJuros).toHaveTextContent("R$ 500.000,00");
    expect(totalJuros).toHaveTextContent("R$ 390.000,00");
  });
});
