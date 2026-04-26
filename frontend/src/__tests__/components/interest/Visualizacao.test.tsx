/**
 * Testes de visualização — summary grids, tabelas, interpretação e alertas.
 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AmortizacaoSimplesTable } from "@/components/interest/AmortizacaoTables";
import { JurosAlerts } from "@/components/interest/JurosAlerts";
import { JurosInterpretation } from "@/components/interest/JurosInterpretation";
import {
  SummaryCompararGrid,
  SummaryCompostosGrid,
  SummarySimplesGrid,
} from "@/components/interest/SummaryGrid";

describe("SummarySimplesGrid", () => {
  it("renderiza os cinco cards canônicos", () => {
    render(
      <SummarySimplesGrid
        summary={{
          principal: "1000.00",
          taxa_mensal: "0.010000",
          prazo_meses: 12,
          juros_totais: "120.00",
          montante_final: "1120.00",
        }}
      />,
    );
    const cards = screen.getAllByTestId("summary-card");
    expect(cards.length).toBe(5);
    expect(screen.getByText(/Principal/i)).toBeInTheDocument();
    expect(screen.getByText(/Montante final/i)).toBeInTheDocument();
  });
});

describe("SummaryCompostosGrid", () => {
  it("renderiza os oito cards canônicos", () => {
    render(
      <SummaryCompostosGrid
        summary={{
          principal: "1000.00",
          taxa_mensal: "0.010000",
          prazo_meses: 12,
          aporte_mensal: "50.00",
          juros_totais: "126.83",
          total_aportado: "600.00",
          total_investido: "1600.00",
          montante_final: "1726.83",
        }}
      />,
    );
    const cards = screen.getAllByTestId("summary-card");
    expect(cards.length).toBe(8);
    expect(screen.getByText(/Total investido/i)).toBeInTheDocument();
    expect(screen.getByText(/Aporte mensal/i)).toBeInTheDocument();
  });
});

describe("SummaryCompararGrid", () => {
  it("mostra razão como hint do card diferença", () => {
    render(
      <SummaryCompararGrid
        summary={{
          principal: "1000.00",
          taxa_mensal: "0.010000",
          prazo_meses: 12,
          montante_simples: "1120.00",
          montante_composto: "1126.83",
          diferenca: "6.83",
          razao: "1.006098",
        }}
      />,
    );
    expect(screen.getByText(/1\.006098/)).toBeInTheDocument();
  });
});

describe("AmortizacaoSimplesTable", () => {
  it("renderiza linhas com scope=row e cabeçalho de coluna", () => {
    render(
      <AmortizacaoSimplesTable
        rows={[
          {
            periodo: 1,
            saldo_inicial: "1000.00",
            juros_periodo: "10.00",
            saldo_final: "1010.00",
          },
          {
            periodo: 2,
            saldo_inicial: "1010.00",
            juros_periodo: "10.10",
            saldo_final: "1020.10",
          },
        ]}
      />,
    );
    const region = screen.getByRole("region");
    expect(region).toHaveAttribute("aria-label");
    const rowHeaders = screen.getAllByRole("rowheader");
    expect(rowHeaders.length).toBe(2);
  });
});

describe("JurosInterpretation", () => {
  it("separa body em parágrafos em quebras duplas", () => {
    render(
      <JurosInterpretation
        interpretation={{
          headline: "Resultado",
          body: "Primeiro parágrafo.\n\nSegundo parágrafo.",
        }}
      />,
    );
    const p = screen.getAllByText(/parágrafo/);
    expect(p.length).toBe(2);
  });
});

describe("JurosAlerts", () => {
  it("oculta container quando lista está vazia", () => {
    const { container } = render(<JurosAlerts alerts={[]} />);
    expect(container.querySelector("[data-testid='juros-alerts']")).toBeNull();
  });

  it("renderiza warning como role=alert e info como role=status", () => {
    render(
      <JurosAlerts
        alerts={[
          { code: "HIGH_RATE", severity: "warning", message: "Taxa alta" },
          { code: "NOTE", severity: "info", message: "Ok" },
        ]}
      />,
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
