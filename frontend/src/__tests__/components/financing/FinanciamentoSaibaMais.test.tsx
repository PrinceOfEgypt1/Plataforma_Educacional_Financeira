import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { FinanciamentoSaibaMais } from "@/components/financing/FinanciamentoSaibaMais";

describe("FinanciamentoSaibaMais", () => {
  it("renderiza botão 'Entenda o financiamento imobiliário'", () => {
    render(<FinanciamentoSaibaMais />);
    expect(
      screen.getByTestId("financiamento-saiba-mais-btn"),
    ).toBeInTheDocument();
  });

  it("não exibe modal por padrão", () => {
    render(<FinanciamentoSaibaMais />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("abre modal ao clicar no botão", async () => {
    const user = userEvent.setup();
    render(<FinanciamentoSaibaMais />);
    await user.click(screen.getByTestId("financiamento-saiba-mais-btn"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /entenda o financiamento imobiliário/i,
      }),
    ).toBeInTheDocument();
  });

  it("exibe conteúdo Nível 1 por padrão ao abrir", async () => {
    const user = userEvent.setup();
    render(<FinanciamentoSaibaMais />);
    await user.click(screen.getByTestId("financiamento-saiba-mais-btn"));
    expect(
      screen.getAllByText(/financiamento imobiliário/i).length,
    ).toBeGreaterThan(0);
  });

  it("fecha modal com Escape", async () => {
    const user = userEvent.setup();
    render(<FinanciamentoSaibaMais />);
    await user.click(screen.getByTestId("financiamento-saiba-mais-btn"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("navega para aba Glossário e exibe termos", async () => {
    const user = userEvent.setup();
    render(<FinanciamentoSaibaMais />);
    await user.click(screen.getByTestId("financiamento-saiba-mais-btn"));
    await user.click(screen.getByRole("tab", { name: /glossário/i }));
    expect(
      screen.getByRole("heading", {
        name: /glossário do financiamento imobiliário/i,
      }),
    ).toBeInTheDocument();
  });

  it("navega para aba Aviso educacional", async () => {
    const user = userEvent.setup();
    render(<FinanciamentoSaibaMais />);
    await user.click(screen.getByTestId("financiamento-saiba-mais-btn"));
    await user.click(screen.getByRole("tab", { name: /aviso educacional/i }));
    expect(
      screen.getByRole("heading", { name: /aviso educacional/i }),
    ).toBeInTheDocument();
  });

  it("navega para aba Nível 2 e exibe conteúdo", async () => {
    const user = userEvent.setup();
    render(<FinanciamentoSaibaMais />);
    await user.click(screen.getByTestId("financiamento-saiba-mais-btn"));
    await user.click(screen.getByRole("tab", { name: /aprofundado/i }));
    expect(screen.getAllByText(/financiamento/i).length).toBeGreaterThan(0);
  });
});
