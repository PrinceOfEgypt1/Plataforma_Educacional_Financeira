import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FinancialCockpitShell } from "@/components/ui/cockpit/FinancialCockpitShell";
import { MODULES } from "@/config/modules";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("FinancialCockpitShell — topbar deriva de MODULES", () => {
  it("renderiza o shell com data-testid correto", () => {
    render(
      <FinancialCockpitShell pathname="/">
        <div>conteúdo</div>
      </FinancialCockpitShell>,
    );
    expect(screen.getByTestId("financial-cockpit-shell")).toBeInTheDocument();
  });

  it("exibe módulo financiamento-imobiliario na topbar", () => {
    render(
      <FinancialCockpitShell pathname="/">
        <div />
      </FinancialCockpitShell>,
    );
    expect(
      screen.getByTestId("cockpit-module-financiamento-imobiliario"),
    ).toBeInTheDocument();
  });

  it("exibe módulo diagnóstico na topbar", () => {
    render(
      <FinancialCockpitShell pathname="/">
        <div />
      </FinancialCockpitShell>,
    );
    expect(
      screen.getByTestId("cockpit-module-diagnostico"),
    ).toBeInTheDocument();
  });

  it("módulo financiamento-imobiliario mostra status ATIVO quando disponivel em MODULES", () => {
    const modulo = MODULES.find((m) => m.id === "financiamento-imobiliario");
    expect(modulo?.status).toBe("disponivel");

    render(
      <FinancialCockpitShell pathname="/">
        <div />
      </FinancialCockpitShell>,
    );
    const tab = screen.getByTestId("cockpit-module-financiamento-imobiliario");
    expect(tab).toHaveAttribute("data-status", "disponivel");
    expect(tab).toHaveTextContent("ATIVO");
  });

  it("status dos módulos visíveis na topbar é derivado de MODULES (não hardcoded)", () => {
    render(
      <FinancialCockpitShell pathname="/">
        <div />
      </FinancialCockpitShell>,
    );
    const availableModules = MODULES.filter((m) => m.status === "disponivel");
    for (const mod of availableModules) {
      const tab = screen.queryByTestId(`cockpit-module-${mod.id}`);
      if (tab) {
        expect(tab).toHaveAttribute("data-status", "disponivel");
        expect(tab).toHaveTextContent("ATIVO");
      }
    }
  });
});
