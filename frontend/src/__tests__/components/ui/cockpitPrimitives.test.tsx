import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import * as CockpitUi from "@/components/ui/cockpit";
import {
  CockpitButton,
  CockpitEducationPanel,
  CockpitField,
  type SubTab,
} from "@/components/ui/cockpit";
import { EducationPanel } from "@/components/ui";

describe("Cockpit primitives — contrato F3", () => {
  it("exporta CockpitEducationPanel sem conflitar com o EducationPanel base", () => {
    expect(CockpitEducationPanel.name).toBe("CockpitEducationPanel");
    expect(EducationPanel.name).toBe("EducationPanel");
    expect("CockpitEducationPanel" in CockpitUi).toBe(true);
    expect("EducationPanel" in CockpitUi).toBe(false);
  });

  it("renderiza painel educativo cockpit com abas acessíveis", () => {
    const tabs: readonly SubTab<"conceito" | "cuidados">[] = [
      { id: "conceito", label: "Conceito" },
      { id: "cuidados", label: "Cuidados" },
    ];
    const onChange = vi.fn();

    render(
      <CockpitEducationPanel tabs={tabs} active="conceito" onChange={onChange}>
        <p>conteúdo cockpit</p>
      </CockpitEducationPanel>,
    );

    expect(
      screen.getByRole("complementary", {
        name: /conteúdo educativo do módulo/i,
      }),
    ).toHaveTextContent("conteúdo cockpit");
    expect(screen.getByRole("tab", { name: "Conceito" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    fireEvent.click(screen.getByRole("tab", { name: "Cuidados" }));
    expect(onChange).toHaveBeenCalledWith("cuidados");
  });

  it("CockpitField conecta erro a aria-invalid e aria-describedby", () => {
    render(
      <CockpitField
        id="campo-taxa"
        label="Taxa mensal"
        value=""
        onChange={vi.fn()}
        error="Informe uma taxa válida."
      />,
    );

    const input = screen.getByLabelText(/taxa mensal/i);
    const alert = screen.getByRole("alert");

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "campo-taxa-assistive");
    expect(alert).toHaveAttribute("id", "campo-taxa-assistive");
    expect(alert).toHaveTextContent("Informe uma taxa válida.");
  });

  it("CockpitButton expõe estado ocupado de forma acessível", () => {
    render(
      <CockpitButton busy busyLabel="Processando simulação">
        Simular
      </CockpitButton>,
    );

    const button = screen.getByRole("button", {
      name: "Processando simulação",
    });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
  });
});
