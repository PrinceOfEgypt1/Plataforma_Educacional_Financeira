/**
 * Testes — JurosCompostosForm.
 */
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { JurosCompostosForm } from "@/components/interest/JurosCompostosForm";

describe("JurosCompostosForm", () => {
  it("permite aporte vazio (simulação pura sem aporte)", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<JurosCompostosForm onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText(/Principal/i), "1.000,00");
    await user.type(screen.getByLabelText(/Taxa mensal/i), "1,00");
    await user.type(screen.getByLabelText(/Prazo/i), "12");
    // Deixa aporte vazio.
    await user.click(screen.getByRole("button", { name: /Calcular/i }));
    expect(onSubmit).toHaveBeenCalledWith({
      principal: "1000.00",
      taxa_mensal: "0.010000",
      prazo_meses: 12,
    });
  });

  it("inclui aporte_mensal no payload quando preenchido", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<JurosCompostosForm onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText(/Principal/i), "1000");
    await user.type(screen.getByLabelText(/Taxa mensal/i), "1");
    await user.type(screen.getByLabelText(/Prazo/i), "6");
    await user.type(screen.getByLabelText(/Aporte mensal/i), "200,00");
    await user.click(screen.getByRole("button", { name: /Calcular/i }));
    expect(onSubmit).toHaveBeenCalledWith({
      principal: "1000",
      taxa_mensal: "0.010000",
      prazo_meses: 6,
      aporte_mensal: "200.00",
    });
  });

  it("rejeita aporte negativo com aria-invalid", () => {
    const onSubmit = vi.fn();
    render(<JurosCompostosForm onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText(/Principal/i), {
      target: { value: "1000" },
    });
    fireEvent.change(screen.getByLabelText(/Taxa mensal/i), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByLabelText(/Prazo/i), {
      target: { value: "12" },
    });
    fireEvent.change(screen.getByLabelText(/Aporte mensal/i), {
      target: { value: "-100" },
    });
    fireEvent.submit(screen.getByTestId("juros-compostos-form"));
    expect(onSubmit).not.toHaveBeenCalled();
    const aporte = screen.getByLabelText(/Aporte mensal/i);
    expect(aporte).toHaveAttribute("aria-invalid", "true");
  });
});
