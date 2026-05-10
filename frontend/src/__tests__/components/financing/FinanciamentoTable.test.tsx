import { render, screen, within } from "@testing-library/react";
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
  it("renderiza todas as linhas para 120 parcelas", () => {
    render(<FinanciamentoTable parcelas={makeParcelas(120)} />);
    expect(screen.getByTestId("financiamento-table-count")).toHaveTextContent(
      "120 parcelas",
    );
    for (let i = 1; i <= 120; i += 1) {
      expect(screen.getByTestId(`parcela-row-${i}`)).toBeInTheDocument();
    }
  });

  it("renderiza todas as linhas para 360 parcelas sem cortar", () => {
    render(<FinanciamentoTable parcelas={makeParcelas(360)} />);
    expect(screen.getByTestId("financiamento-table-count")).toHaveTextContent(
      "360 parcelas",
    );
    expect(screen.getByTestId("parcela-row-360")).toBeInTheDocument();
  });

  it("renderiza todas as linhas para 600 parcelas sem cortar", () => {
    render(<FinanciamentoTable parcelas={makeParcelas(600)} />);
    expect(screen.getByTestId("financiamento-table-count")).toHaveTextContent(
      "600 parcelas",
    );
    expect(screen.getByTestId("parcela-row-600")).toBeInTheDocument();
    expect(screen.getByTestId("parcela-row-1")).toBeInTheDocument();
    expect(screen.getByTestId("parcela-mobile-card-600")).toBeInTheDocument();
    expect(screen.getByTestId("parcela-mobile-card-1")).toBeInTheDocument();
  });

  it("não exibe coluna de encargos quando todos são zero", () => {
    render(<FinanciamentoTable parcelas={makeParcelas(5)} />);
    expect(screen.queryByText("Encargos")).not.toBeInTheDocument();
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
    expect(screen.getAllByText("Encargos").length).toBeGreaterThanOrEqual(2);
  });

  it("cumpre semântica mínima de tabela financeira", () => {
    render(<FinanciamentoTable parcelas={makeParcelas(3)} />);

    const table = screen.getByRole("table", {
      name: /parcelas do financiamento/i,
    });
    expect(
      within(table)
        .getByText(/3 parcelas/i)
        .tagName.toLowerCase(),
    ).toBe("caption");
    expect(within(table).getAllByRole("columnheader")).toHaveLength(6);
    expect(within(table).getAllByRole("rowheader")).toHaveLength(3);
    expect(table).toHaveClass("tabular-nums");
  });

  it("oferece representação mobile sem depender de rolagem horizontal", () => {
    render(<FinanciamentoTable parcelas={makeParcelas(2)} />);

    const mobileList = screen.getByTestId("financiamento-mobile-list");
    const firstCard = within(mobileList).getByTestId("parcela-mobile-card-1");

    expect(mobileList).toBeInTheDocument();
    expect(within(firstCard).getByText("Parcela 1")).toBeInTheDocument();
    expect(within(firstCard).getByText("Saldo inicial")).toBeInTheDocument();
    expect(within(firstCard).getByText("Prestação")).toBeInTheDocument();
  });
});
