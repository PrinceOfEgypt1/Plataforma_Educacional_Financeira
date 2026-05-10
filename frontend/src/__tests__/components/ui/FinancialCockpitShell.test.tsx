import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FinancialCockpitShell } from "@/components/ui/cockpit/FinancialCockpitShell";
import {
  getCockpitVisibleModules,
  MODULES,
  type ModuleEntry,
} from "@/config/modules";

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
    const visibleModules = getCockpitVisibleModules();
    for (const mod of visibleModules) {
      const tab = screen.getByTestId(`cockpit-module-${mod.id}`);
      expect(tab).toHaveAttribute("data-status", mod.status);
      expect(tab).toHaveTextContent(
        mod.status === "disponivel" ? "ATIVO" : "EM BREVE",
      );
    }
  });

  it("renderiza exatamente os módulos marcados como visíveis no cockpit", () => {
    render(
      <FinancialCockpitShell pathname="/">
        <div />
      </FinancialCockpitShell>,
    );

    const visibleModules = getCockpitVisibleModules();
    const renderedTabs = screen.getAllByTestId(/^cockpit-module-/);

    expect(renderedTabs).toHaveLength(visibleModules.length);
    expect(visibleModules.map((module) => module.id)).toEqual([
      "diagnostico",
      "juros",
      "amortizacao",
      "financiamento-imobiliario",
      "consignado",
      "cdc",
      "cartao-rotativo",
      "investir-vs-quitar",
    ]);
  });

  it("inclui novo módulo visível pela função de configuração, sem editar a shell", () => {
    const base = MODULES[0];
    if (!base) throw new Error("MODULES deve conter ao menos um módulo");

    const extraModule: ModuleEntry = {
      id: "simulador-futuro",
      slug: "simulador-futuro",
      href: "/simulador-futuro" as ModuleEntry["href"],
      title: "Simulador Futuro",
      shortTitle: "Futuro",
      description: base.description,
      group: base.group,
      status: base.status,
      visibleInCockpit: true,
    };

    expect(
      getCockpitVisibleModules([...MODULES, extraModule]).at(-1)?.id,
    ).toBe("simulador-futuro");
  });
});
