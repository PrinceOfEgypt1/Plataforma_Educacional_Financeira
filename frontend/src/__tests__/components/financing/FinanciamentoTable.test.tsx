import { render, screen } from "@testing-library/react";
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
    expect(screen.getByText("Encargos")).toBeInTheDocument();
  });
});
