/**
 * Testes de renderização da página de Financiamento Imobiliário.
 *
 * Verifica que o cockpit renderiza, que o formulário tem os campos
 * esperados e que o módulo está marcado como disponível.
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FinanciamentoCockpit } from "@/components/financing/FinanciamentoCockpit";
import { MODULES } from "@/config/modules";

vi.mock("@/services/financing/financiamentoService", () => ({
  simularFinanciamentoImobiliario: vi.fn(),
  compararFinanciamentos: vi.fn(),
}));

describe("FinanciamentoCockpit", () => {
  it("renderiza o cockpit com data-testid correto", () => {
    render(<FinanciamentoCockpit />);
    expect(screen.getByTestId("financiamento-cockpit")).toBeInTheDocument();
  });

  it("renderiza o formulário com data-testid correto", () => {
    render(<FinanciamentoCockpit />);
    expect(screen.getByTestId("financiamento-form")).toBeInTheDocument();
  });

  it("exibe campo de valor do imóvel", () => {
    render(<FinanciamentoCockpit />);
    expect(screen.getByLabelText(/valor do imóvel/i)).toBeInTheDocument();
  });

  it("exibe campo de entrada", () => {
    render(<FinanciamentoCockpit />);
    expect(screen.getByLabelText(/entrada/i)).toBeInTheDocument();
  });

  it("exibe campo de prazo", () => {
    render(<FinanciamentoCockpit />);
    expect(screen.getByLabelText(/prazo/i)).toBeInTheDocument();
  });

  it("exibe campo de taxa de juros mensal", () => {
    render(<FinanciamentoCockpit />);
    expect(screen.getByLabelText(/taxa de juros mensal/i)).toBeInTheDocument();
  });

  it("exibe seletor de sistema de amortização", () => {
    render(<FinanciamentoCockpit />);
    expect(
      screen.getByTestId("sistema-amortizacao-selector"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("sistema-price")).toBeInTheDocument();
    expect(screen.getByTestId("sistema-sac")).toBeInTheDocument();
  });

  it("exibe botão de submit", () => {
    render(<FinanciamentoCockpit />);
    expect(screen.getByTestId("financiamento-submit")).toBeInTheDocument();
  });

  it("exibe estado idle com instrução ao usuário", () => {
    render(<FinanciamentoCockpit />);
    expect(screen.getByTestId("financiamento-idle-state")).toBeInTheDocument();
  });

  it("exibe botão Saiba Mais no estado idle", () => {
    render(<FinanciamentoCockpit />);
    expect(
      screen.getByTestId("financiamento-saiba-mais-btn"),
    ).toBeInTheDocument();
  });
});

describe("modules.ts — financiamento-imobiliario", () => {
  it("módulo financiamento-imobiliario está marcado como disponivel", () => {
    const modulo = MODULES.find((m) => m.id === "financiamento-imobiliario");
    expect(modulo).toBeDefined();
    expect(modulo?.status).toBe("disponivel");
  });

  it("módulo tem href correto", () => {
    const modulo = MODULES.find((m) => m.id === "financiamento-imobiliario");
    expect(modulo?.href).toBe("/financiamento-imobiliario");
  });
});
