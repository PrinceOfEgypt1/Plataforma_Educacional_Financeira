import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

class NoopResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

vi.stubGlobal("ResizeObserver", NoopResizeObserver);

import { FinanciamentoCompareChart } from "@/components/financing/FinanciamentoCompareChart";
import type { FinanciamentoImobCompareOut } from "@/types/financing";

function makeCompareOut(prazo: number): FinanciamentoImobCompareOut {
  const parcelas = Array.from({ length: prazo }, (_, i) => ({
    numero: i + 1,
    saldo_inicial: "240000.00",
    juros: "1680.00",
    amortizacao: "2000.00",
    encargos: "0.00",
    prestacao: "3680.00",
    saldo_final: "238000.00",
  }));
  const summary = {
    sistema_amortizacao: "PRICE" as const,
    valor_imovel: "300000.00",
    valor_entrada: "60000.00",
    valor_financiado: "240000.00",
    prazo_meses: prazo,
    taxa_juros_mensal: "0.007000",
    total_pago: "500000.00",
    total_juros: "100000.00",
    total_amortizado: "240000.00",
    total_encargos: "0.00",
    custo_total: "100000.00",
    primeira_parcela: "3680.00",
    ultima_parcela: "3680.00",
  };
  return {
    price: { summary, parcelas },
    sac: {
      summary: { ...summary, sistema_amortizacao: "SAC" as const },
      parcelas,
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

  it("renderiza o título com PRICE e SAC", () => {
    render(<FinanciamentoCompareChart compare={makeCompareOut(12)} />);
    expect(screen.getByText(/PRICE × SAC/i)).toBeInTheDocument();
  });

  it("tem aria-label descritivo para acessibilidade", () => {
    render(<FinanciamentoCompareChart compare={makeCompareOut(12)} />);
    expect(
      screen.getByLabelText(/gráfico de comparação PRICE e SAC/i),
    ).toBeInTheDocument();
  });
});
