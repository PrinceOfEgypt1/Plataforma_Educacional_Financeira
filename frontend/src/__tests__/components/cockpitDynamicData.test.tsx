import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  AmortizationCockpitTable,
  AmortizationCompareTable,
  InterestCompoundTable,
  InterestSimpleTable,
  buildAmortizationCompareChartData,
  buildAmortizationRowsChartData,
  buildInterestChartData,
} from "@/components/ui/cockpit";
import type { AmortizationPeriodRow } from "@/types/amortization";
import type {
  Chart as InterestChart,
  PeriodoCompostoRow,
  PeriodoSimplesRow,
} from "@/types/interest";

function money(value: number): string {
  return value.toFixed(2);
}

function interestSimpleRows(count: number): ReadonlyArray<PeriodoSimplesRow> {
  return Array.from({ length: count }, (_, index) => {
    const period = index + 1;
    return {
      periodo: period,
      saldo_inicial: money(1000 + index * 10),
      juros_periodo: "10.00",
      saldo_final: money(1000 + period * 10),
    };
  });
}

function interestCompoundRows(
  count: number,
): ReadonlyArray<PeriodoCompostoRow> {
  return interestSimpleRows(count).map((row) => ({
    ...row,
    aporte: "0.00",
  }));
}

function amortizationRows(count: number): ReadonlyArray<AmortizationPeriodRow> {
  return Array.from({ length: count }, (_, index) => {
    const period = index + 1;
    return {
      periodo: period,
      saldo_inicial: money(100000 - index * 1000),
      juros: money(1000 - index),
      amortizacao: "1000.00",
      parcela: money(2000 - index),
      saldo_final: money(100000 - period * 1000),
    };
  });
}

function expectBodyRowCount(testId: string, count: number): void {
  const table = screen.getByTestId(testId);
  expect(within(table).getAllByRole("row")).toHaveLength(count + 1);
}

describe("Financial Cockpit — períodos dinâmicos", () => {
  it("renderiza uma linha por período nas tabelas de juros", () => {
    render(
      <>
        <InterestSimpleTable rows={interestSimpleRows(24)} />
        <InterestCompoundTable rows={interestCompoundRows(24)} />
      </>,
    );

    expectBodyRowCount("cockpit-table-simple", 24);
    expectBodyRowCount("cockpit-table-compound", 24);
  });

  it("renderiza uma linha por período em PRICE, SAC e comparação", () => {
    render(
      <>
        <AmortizationCockpitTable rows={amortizationRows(60)} />
        <AmortizationCompareTable
          priceRows={amortizationRows(60)}
          sacRows={amortizationRows(60)}
        />
      </>,
    );

    expectBodyRowCount("cockpit-table-amortization", 60);
    expectBodyRowCount("cockpit-table-amortization-compare", 60);
  });

  it("prepara um ponto por período nos gráficos de juros", () => {
    const chart: InterestChart = {
      x_label: "Mês",
      y_label: "Saldo",
      series: [
        {
          label: "Simples",
          kind: "simples",
          points: Array.from({ length: 24 }, (_, index) => money(index + 1)),
        },
      ],
    };

    expect(buildInterestChartData(chart).points).toHaveLength(24);
  });

  it("prepara um ponto por período nos gráficos de PRICE, SAC e comparação", () => {
    expect(
      buildAmortizationRowsChartData(amortizationRows(60), "composition")
        .points,
    ).toHaveLength(60);
    expect(
      buildAmortizationRowsChartData(amortizationRows(60), "installments")
        .points,
    ).toHaveLength(60);
    expect(
      buildAmortizationCompareChartData({
        x_label: "Período",
        y_label: "Parcela",
        series: [
          {
            label: "PRICE",
            kind: "price",
            points: Array.from({ length: 60 }, (_, index) => money(index + 1)),
          },
          {
            label: "SAC",
            kind: "sac",
            points: Array.from({ length: 60 }, (_, index) => money(index + 1)),
          },
        ],
      }).points,
    ).toHaveLength(60);
  });
});
