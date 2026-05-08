import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { DiagnosticoSaibaMais } from "@/components/diagnostic/DiagnosticoSaibaMais";

describe("DiagnosticoSaibaMais", () => {
  it("renderiza botão 'Entenda o diagnóstico financeiro'", () => {
    render(<DiagnosticoSaibaMais />);
    expect(
      screen.getByTestId("diagnostico-saiba-mais-btn"),
    ).toBeInTheDocument();
  });

  it("não exibe modal por padrão", () => {
    render(<DiagnosticoSaibaMais />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("abre modal ao clicar no botão", async () => {
    const user = userEvent.setup();
    render(<DiagnosticoSaibaMais />);
    await user.click(screen.getByTestId("diagnostico-saiba-mais-btn"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /entenda o diagnóstico financeiro/i,
      }),
    ).toBeInTheDocument();
  });

  it("exibe conteúdo educacional Nível 1 por padrão ao abrir", async () => {
    const user = userEvent.setup();
    render(<DiagnosticoSaibaMais />);
    await user.click(screen.getByTestId("diagnostico-saiba-mais-btn"));
    expect(
      screen.getByText(/diagnóstico financeiro.*o que é/i),
    ).toBeInTheDocument();
  });

  it("fecha modal com Escape", async () => {
    const user = userEvent.setup();
    render(<DiagnosticoSaibaMais />);
    await user.click(screen.getByTestId("diagnostico-saiba-mais-btn"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("navega para aba Glossário e exibe termos", async () => {
    const user = userEvent.setup();
    render(<DiagnosticoSaibaMais />);
    await user.click(screen.getByTestId("diagnostico-saiba-mais-btn"));
    await user.click(screen.getByTestId("modal-tab-glossario"));
    expect(
      screen.getByRole("heading", { name: /glossário do diagnóstico/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Renda mensal/)).toBeInTheDocument();
  });

  it("navega para aba Alertas e exibe conteúdo educacional", async () => {
    const user = userEvent.setup();
    render(<DiagnosticoSaibaMais />);
    await user.click(screen.getByTestId("diagnostico-saiba-mais-btn"));
    await user.click(screen.getByTestId("modal-tab-alertas"));
    expect(
      screen.getByRole("heading", { name: /alertas do diagnóstico/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Despesas superam a renda/i)).toBeInTheDocument();
  });

  it("navega para aba Aviso educacional e exibe disclaimer", async () => {
    const user = userEvent.setup();
    render(<DiagnosticoSaibaMais />);
    await user.click(screen.getByTestId("diagnostico-saiba-mais-btn"));
    await user.click(screen.getByTestId("modal-tab-aviso"));
    expect(
      screen.getByRole("heading", { name: /aviso educacional/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/não substitui análise profissional/i),
    ).toBeInTheDocument();
  });

  it("navega para aba Nível 2 e exibe conteúdo aprofundado", async () => {
    const user = userEvent.setup();
    render(<DiagnosticoSaibaMais />);
    await user.click(screen.getByTestId("diagnostico-saiba-mais-btn"));
    await user.click(screen.getByTestId("modal-tab-nivel-2"));
    expect(
      screen.getAllByText(/equilíbrio financeiro/i).length,
    ).toBeGreaterThan(0);
  });
});
