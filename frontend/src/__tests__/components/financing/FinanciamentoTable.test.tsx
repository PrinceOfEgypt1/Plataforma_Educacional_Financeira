import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { FinanciamentoTable } from "@/components/financing/FinanciamentoTable";
import type {
  FinanciamentoImobSummary,
  FinanciamentoPeriodo,
} from "@/types/financing";

function makeParcelas(count: number): ReadonlyArray<FinanciamentoPeriodo> {
  return Array.from({ length: count }, (_, i) => ({
    numero: i + 1,
    saldo_inicial: (100000 - i * 300).toFixed(2),
    juros: "500.00",
    amortizacao: "300.00",
    encargos: "50.00",
    prestacao: "850.00",
    saldo_final: Math.max(0, 99700 - i * 300).toFixed(2),
  }));
}

function makeSummary(count: number): FinanciamentoImobSummary {
  return {
    sistema_amortizacao: "PRICE",
    valor_imovel: "150000.00",
    valor_entrada: "50000.00",
    valor_financiado: "100000.00",
    prazo_meses: count,
    taxa_juros_mensal: "0.005000",
    total_pago: (count * 850).toFixed(2),
    total_juros: (count * 500).toFixed(2),
    total_amortizado: (count * 300).toFixed(2),
    total_encargos: (count * 50).toFixed(2),
    custo_total: (count * 550).toFixed(2),
    primeira_parcela: "850.00",
    ultima_parcela: "850.00",
  };
}

describe("FinanciamentoTable", () => {
  it("declara todas as parcelas geradas e exibe apenas a faixa ativa", () => {
    render(
      <FinanciamentoTable
        parcelas={makeParcelas(120)}
        summary={makeSummary(120)}
      />,
    );

    expect(screen.getByTestId("financiamento-table-count")).toHaveTextContent(
      "120 parcelas geradas e preservadas no modelo",
    );
    expect(screen.getByTestId("financiamento-table-range")).toHaveTextContent(
      "Parcelas 1-12",
    );
    expect(screen.getByTestId("parcela-row-1")).toBeInTheDocument();
    expect(screen.getByTestId("parcela-row-12")).toBeInTheDocument();
    expect(screen.queryByTestId("parcela-row-13")).not.toBeInTheDocument();
  });

  it("permite acessar a última faixa de 360 parcelas sem cortar dados", async () => {
    const user = userEvent.setup();
    render(
      <FinanciamentoTable
        parcelas={makeParcelas(360)}
        summary={makeSummary(360)}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Última" }));

    expect(screen.getByTestId("financiamento-table-range")).toHaveTextContent(
      "Parcelas 349-360",
    );
    expect(screen.getByTestId("parcela-row-360")).toBeInTheDocument();
  });

  it("permite ir diretamente para parcela de financiamento longo", async () => {
    const user = userEvent.setup();
    render(
      <FinanciamentoTable
        parcelas={makeParcelas(600)}
        summary={makeSummary(600)}
      />,
    );

    await user.type(screen.getByLabelText("Ir para parcela"), "600");

    expect(screen.getByTestId("financiamento-table-count")).toHaveTextContent(
      "600 parcelas geradas",
    );
    expect(screen.getByTestId("financiamento-table-range")).toHaveTextContent(
      "Parcelas 589-600",
    );
    expect(screen.getByTestId("parcela-row-600")).toBeInTheDocument();
  });

  it("exibe linha final de totais com valores do resumo financeiro", () => {
    render(
      <FinanciamentoTable
        parcelas={makeParcelas(24)}
        summary={makeSummary(24)}
      />,
    );

    const totals = screen.getByTestId("financiamento-table-totals");
    expect(totals).toHaveTextContent("Total");
    expect(totals).toHaveTextContent("R$ 20.400,00");
    expect(totals).toHaveTextContent("R$ 12.000,00");
    expect(totals).toHaveTextContent("R$ 7.200,00");
    expect(totals).toHaveTextContent("R$ 1.200,00");
  });

  it("cumpre semântica de tabela financeira compacta", () => {
    render(
      <FinanciamentoTable
        parcelas={makeParcelas(3)}
        summary={makeSummary(3)}
      />,
    );

    const table = screen.getByRole("table", {
      name: /parcelas do financiamento/i,
    });
    expect(
      within(table)
        .getByText(/3 parcelas geradas/i)
        .tagName.toLowerCase(),
    ).toBe("caption");
    expect(within(table).getAllByRole("columnheader")).toHaveLength(7);
    expect(within(table).getAllByRole("rowheader")).toHaveLength(4);
    expect(table).toHaveClass("table-fixed");
  });

  it("usa painel compacto sem rolagem horizontal da página", () => {
    render(
      <FinanciamentoTable
        parcelas={makeParcelas(24)}
        summary={makeSummary(24)}
      />,
    );

    const tablePanel = screen.getByTestId("financiamento-table");

    expect(tablePanel).toHaveClass("overflow-hidden");
    expect(
      screen.getByTestId("financiamento-parcela-detalhe"),
    ).toHaveTextContent("Todos os dados permanecem disponíveis");
  });

  it("não usa corte por slice na tabela financeira", () => {
    const source = readFileSync(
      resolve("src", "components", "financing", "FinanciamentoTable.tsx"),
      "utf8",
    );
    const forbiddenCall = [".", "slice", "("].join("");
    expect(source).not.toContain(forbiddenCall);
  });
});
