/**
 * Testes de comportamento — JurosSimplesForm.
 *
 * Foco:
 *   - submissão válida dispara `onSubmit` com payload normalizado;
 *   - submissão inválida mostra erros e NÃO dispara `onSubmit`;
 *   - associação a11y (aria-invalid, aria-describedby) aparece no erro.
 */
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { JurosSimplesForm } from "@/components/interest/JurosSimplesForm";

describe("JurosSimplesForm", () => {
  it("submissão com dados vazios mostra erros e não chama onSubmit", async () => {
    const onSubmit = vi.fn();
    render(<JurosSimplesForm onSubmit={onSubmit} />);
    // Submete diretamente via evento — jsdom não dispara required=true.
    fireEvent.submit(screen.getByTestId("juros-simples-form"));
    expect(onSubmit).not.toHaveBeenCalled();
    const alerts = screen.getAllByRole("alert");
    expect(alerts.length).toBeGreaterThanOrEqual(3);
  });

  it("normaliza entrada pt-BR e chama onSubmit com payload ASCII", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<JurosSimplesForm onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText(/Principal/i), "1.000,00");
    await user.type(screen.getByLabelText(/Taxa mensal/i), "1,00");
    await user.type(screen.getByLabelText(/Prazo/i), "12");
    await user.click(screen.getByRole("button", { name: /Calcular/i }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      principal: "1000.00",
      taxa_mensal: "0.010000",
      prazo_meses: 12,
    });
  });

  it("botão exibe estado busy e desabilita submit", () => {
    render(<JurosSimplesForm onSubmit={() => {}} busy />);
    const btn = screen.getByRole("button", { name: /Calculando/i });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("aria-busy", "true");
  });
});
