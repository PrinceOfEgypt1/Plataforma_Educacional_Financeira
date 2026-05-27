/**
 * Testes do shell F8F-A — Implementação React fiel ao protótipo F8E-AJ1
 *
 * Cobertura:
 *   - renderização da experiência nova (sem cockpit antigo)
 *   - presença do stepper de 7 etapas
 *   - navegação entre etapas
 *   - presença das 5 sub-abas por etapa
 *   - card-resumo (scenario pill) com formato monetário completo
 *   - integração real com serviço de simulação (mock injetado via props)
 *   - estado de erro do backend exibido
 *   - estado inicial vazio do resultado quando ainda não houve simulação
 *   - banner de governança presente
 *   - ausência do símbolo Unicode de multiplicação em SAC/PRICE
 */
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { RealEstateF8FObservatory } from "@/components/financing/realEstateF8F/RealEstateF8FObservatory";
import type {
  FinanciamentoImobOut,
  FinanciamentoImobSummary,
  FinanciamentoPeriodo,
} from "@/types/financing";

class NoopResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}
vi.stubGlobal("ResizeObserver", NoopResizeObserver);

function makeSummary(): FinanciamentoImobSummary {
  return {
    sistema_amortizacao: "SAC",
    valor_imovel: "870000.00",
    valor_entrada: "700000.00",
    valor_financiado: "170000.00",
    prazo_meses: 120,
    taxa_juros_mensal: "0.008500",
    taxa_juros_anual_nominal: "0.102000",
    taxa_juros_anual_efetiva: "0.106785",
    primeira_prestacao_financeira: "2861.67",
    ultima_prestacao_financeira: "1428.71",
    primeiro_encargo_mensal_total: "3066.67",
    ultimo_encargo_mensal_total: "1633.71",
    total_pago: "282022.50",
    total_juros: "87422.50",
    total_amortizado: "170000.00",
    total_mip: "0.00",
    total_dfi_dfc: "0.00",
    total_seguros: "0.00",
    total_tarifas: "0.00",
    total_custo_admin: "0.00",
    seguros_nao_discriminados: false,
    total_encargos: "24600.00",
    custo_total: "282022.50",
    custo_financeiro_total: "257422.50",
    primeira_parcela: "3066.67",
    ultima_parcela: "1633.71",
  };
}

function makeParcela(n: number): FinanciamentoPeriodo {
  return {
    numero: n,
    saldo_inicial: "170000.00",
    juros: "1445.00",
    amortizacao: "1416.67",
    prestacao_financeira: "2861.67",
    mip_mensal: "0.00",
    dfi_dfc_mensal: "0.00",
    seguros_nao_discriminados: false,
    seguro_mensal: "180.00",
    taxa_administracao_mensal: "0.00",
    tarifa_mensal: "25.00",
    custo_admin_mensal: "0.00",
    encargos: "205.00",
    encargo_mensal_total: "3066.67",
    prestacao: "3066.67",
    saldo_final: "168583.33",
  };
}

function makeResult(): FinanciamentoImobOut {
  return {
    summary: makeSummary(),
    parcelas: [makeParcela(1)],
  } as FinanciamentoImobOut;
}

describe("RealEstateF8FObservatory", () => {
  it("renderiza o shell F8E-AJ1 sem referenciar o cockpit antigo", () => {
    const simulate = vi.fn();
    const compare = vi.fn();
    render(
      <RealEstateF8FObservatory simulateFn={simulate} compareFn={compare} />,
    );
    expect(
      screen.getByTestId("real-estate-f8f-observatory"),
    ).toBeInTheDocument();
    expect(screen.getByText(/Financial Observatory/i)).toBeInTheDocument();
    expect(screen.getAllByText(/F8F-A/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/cockpit antigo/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/cockpit · financiamento/i),
    ).not.toBeInTheDocument();
  });

  it("renderiza o stepper de 7 etapas, todas com label", () => {
    render(<RealEstateF8FObservatory />);
    const stepper = screen.getByTestId("f8f-stepper");
    expect(within(stepper).getByTestId("f8f-step-1")).toBeInTheDocument();
    expect(within(stepper).getByTestId("f8f-step-7")).toBeInTheDocument();
    for (const label of [
      "Preparar",
      "Simular",
      "Resultado",
      "Entender",
      "Comparar",
      "Conferir",
      "Decidir",
    ]) {
      expect(within(stepper).getByText(label)).toBeInTheDocument();
    }
  });

  it("clicar em uma etapa do stepper troca o painel principal", async () => {
    const user = userEvent.setup();
    render(<RealEstateF8FObservatory />);
    await user.click(screen.getByTestId("f8f-step-2"));
    expect(
      screen.getByRole("heading", { name: /Dados do imóvel/i }),
    ).toBeInTheDocument();
  });

  it("mostra 5 sub-abas por etapa", () => {
    render(<RealEstateF8FObservatory />);
    const subtabs = screen.getByTestId("f8f-subtabs");
    expect(within(subtabs).getByTestId("f8f-subtab-1-1")).toBeInTheDocument();
    expect(within(subtabs).getByTestId("f8f-subtab-1-5")).toBeInTheDocument();
  });

  it("card-resumo exibe valores em formato monetário completo (com vírgula)", () => {
    render(<RealEstateF8FObservatory />);
    const pill = screen.getByTestId("f8f-scenario-pill");
    expect(within(pill).getByText("R$ 870.000,00")).toBeInTheDocument();
    expect(within(pill).getByText("R$ 700.000,00")).toBeInTheDocument();
    expect(within(pill).getByText("R$ 170.000,00")).toBeInTheDocument();
  });

  it("o estado inicial de Resultado pede que o usuário vá para Simular", async () => {
    const user = userEvent.setup();
    render(<RealEstateF8FObservatory />);
    await user.click(screen.getByTestId("f8f-step-3"));
    expect(screen.getByTestId("f8f-cta-go-simular")).toBeInTheDocument();
  });

  it("integra o serviço real de simulação ao clicar em Calcular", async () => {
    const user = userEvent.setup();
    const simulate = vi.fn(() => Promise.resolve(makeResult()));
    const compare = vi.fn();
    render(
      <RealEstateF8FObservatory simulateFn={simulate} compareFn={compare} />,
    );
    await user.click(screen.getByTestId("f8f-step-2"));
    await user.click(screen.getByTestId("f8f-subtab-2-5"));
    await user.click(screen.getByTestId("f8f-cta-calcular"));
    await waitFor(() => {
      expect(simulate).toHaveBeenCalledTimes(1);
    });
    const call = simulate.mock.calls[0]?.[0];
    expect(call?.valor_imovel).toBe("870000.00");
    expect(call?.valor_entrada).toBe("700000.00");
    expect(call?.prazo_meses).toBe(120);
    expect(call?.sistema_amortizacao).toBe("SAC");
    // após sucesso, foi para Resultado e mostra o score primeiro
    await waitFor(() => {
      expect(screen.getByTestId("f8f-score-primeira")).toBeInTheDocument();
    });
  });

  it("exibe erro quando o backend recusa a simulação", async () => {
    const user = userEvent.setup();
    const simulate = vi.fn(() =>
      Promise.reject({
        kind: "validation",
        status: 422,
        detail: "Taxa fora do intervalo permitido",
        fieldErrors: {},
      }),
    );
    const compare = vi.fn();
    render(
      <RealEstateF8FObservatory simulateFn={simulate} compareFn={compare} />,
    );
    await user.click(screen.getByTestId("f8f-step-2"));
    await user.click(screen.getByTestId("f8f-subtab-2-5"));
    await user.click(screen.getByTestId("f8f-cta-calcular"));
    await waitFor(() => {
      expect(screen.getByTestId("f8f-simulate-error")).toBeInTheDocument();
    });
    expect(simulate).toHaveBeenCalledTimes(1);
  });

  it("rotula a comparação SAC x PRICE usando a letra x (nunca o símbolo Unicode)", () => {
    render(<RealEstateF8FObservatory />);
    const root = screen.getByTestId("real-estate-f8f-observatory");
    expect(root.textContent ?? "").not.toContain("×");
  });

  it("o banner de governança lembra que aceite humano segue pendente", () => {
    render(<RealEstateF8FObservatory />);
    const banner = screen.getByTestId("f8f-governance-banner");
    expect(banner).toBeInTheDocument();
    expect(within(banner).getByText(/Sprint 5/i)).toBeInTheDocument();
  });
});
