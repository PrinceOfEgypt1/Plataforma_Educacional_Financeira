import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { FinanciamentoTable } from "@/components/financing/FinanciamentoTable";
import type { FinanciamentoPeriodo } from "@/types/financing";

function makeParcelas(count: number): ReadonlyArray<FinanciamentoPeriodo> {
  return Array.from({ length: count }, (_, i) => ({
    numero: i + 1,
    saldo_inicial: "100000.00",
    juros: "500.00",
    amortizacao: "300.00",
    encargos: "0.00",
    prestacao: "800.00",
    saldo_final: "99700.00",
  }));
}

describe("FinanciamentoTable", () => {
  it("declara todas as parcelas geradas e exibe apenas a faixa ativa", () => {
    render(<FinanciamentoTable parcelas={makeParcelas(120)} />);

    expect(screen.getByTestId("financiamento-table-count")).toHaveTextContent(
      "120 parcelas geradas",
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
    render(<FinanciamentoTable parcelas={makeParcelas(360)} />);

    await user.click(screen.getByRole("button", { name: "Última" }));

    expect(screen.getByTestId("financiamento-table-range")).toHaveTextContent(
      "Parcelas 349-360",
    );
    expect(screen.getByTestId("parcela-row-360")).toBeInTheDocument();
  });

  it("permite ir diretamente para parcela de financiamento longo", async () => {
    const user = userEvent.setup();
    render(<FinanciamentoTable parcelas={makeParcelas(600)} />);

    await user.type(screen.getByLabelText("Ir para parcela"), "600");

    expect(screen.getByTestId("financiamento-table-count")).toHaveTextContent(
      "600 parcelas geradas",
    );
    expect(screen.getByTestId("financiamento-table-range")).toHaveTextContent(
      "Parcelas 589-600",
    );
    expect(screen.getByTestId("parcela-row-600")).toBeInTheDocument();
  });

  it("não exibe coluna de encargos quando todos são zero", () => {
    render(<FinanciamentoTable parcelas={makeParcelas(5)} />);
    expect(screen.queryByText("Enc.")).not.toBeInTheDocument();
  });

  it("exibe coluna de encargos quando há encargos positivos", () => {
    const parcelas: ReadonlyArray<FinanciamentoPeriodo> = [
      {
        numero: 1,
        saldo_inicial: "100000.00",
        juros: "500.00",
        amortizacao: "300.00",
        encargos: "50.00",
        prestacao: "850.00",
        saldo_final: "99700.00",
      },
    ];
    render(<FinanciamentoTable parcelas={parcelas} />);
    expect(screen.getByText("Enc.")).toBeInTheDocument();
  });

  it("cumpre semântica mínima de tabela financeira compacta", () => {
    render(<FinanciamentoTable parcelas={makeParcelas(3)} />);

    const table = screen.getByRole("table", {
      name: /parcelas do financiamento/i,
    });
    expect(
      within(table)
        .getByText(/3 parcelas geradas/i)
        .tagName.toLowerCase(),
    ).toBe("caption");
    expect(within(table).getAllByRole("columnheader")).toHaveLength(6);
    expect(within(table).getAllByRole("rowheader")).toHaveLength(3);
    expect(table).toHaveClass("table-fixed");
  });

  it("usa painel compacto sem rolagem horizontal ou vertical própria", () => {
    render(<FinanciamentoTable parcelas={makeParcelas(24)} />);

    const tablePanel = screen.getByTestId("financiamento-table");

    expect(tablePanel).toHaveClass("overflow-hidden");
    expect(
      screen.getByTestId("financiamento-parcela-detalhe"),
    ).toHaveTextContent("Todos os dados permanecem disponíveis");
  });
});
