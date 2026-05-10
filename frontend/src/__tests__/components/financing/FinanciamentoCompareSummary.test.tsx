import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FinanciamentoCompareSummary } from "@/components/financing/FinanciamentoCompareSummary";
import type {
  FinanciamentoImobCompareOut,
  SistemaAmortizacao,
} from "@/types/financing";

function summary(sistema: SistemaAmortizacao) {
  return {
    sistema_amortizacao: sistema,
    valor_imovel: "500000.00",
    valor_entrada: "100000.00",
    valor_financiado: "400000.00",
    prazo_meses: 360,
    taxa_juros_mensal: "0.007",
    total_pago: sistema === "PRICE" ? "920000.00" : "810000.00",
    total_juros: sistema === "PRICE" ? "500000.00" : "390000.00",
    total_amortizado: "400000.00",
    total_encargos: "20000.00",
    custo_total: sistema === "PRICE" ? "940000.00" : "830000.00",
    primeira_parcela: sistema === "PRICE" ? "2555.00" : "3800.00",
    ultima_parcela: sistema === "PRICE" ? "2555.00" : "1115.00",
  };
}

const compare: FinanciamentoImobCompareOut = {
  price: {
    summary: summary("PRICE"),
    parcelas: [],
  },
  sac: {
    summary: summary("SAC"),
    parcelas: [],
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

  it("mantém valores financeiros com tabular-nums", () => {
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
