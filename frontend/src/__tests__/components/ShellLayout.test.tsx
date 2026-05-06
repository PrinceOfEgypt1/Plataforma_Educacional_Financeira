import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/juros",
}));

import { ShellLayout } from "@/components/shell/ShellLayout";

describe("<ShellLayout /> — Financial Cockpit", () => {
  it("renderiza children dentro do main do cockpit", () => {
    render(
      <ShellLayout pathname="/juros">
        <p data-testid="child-1">conteúdo A</p>
      </ShellLayout>,
    );

    const main = screen.getByRole("main");
    expect(main).toContainElement(screen.getByTestId("child-1"));
    expect(screen.getByTestId("financial-cockpit-shell")).toBeInTheDocument();
  });

  it("usa topbar de módulos e não renderiza sidebar antiga", () => {
    render(
      <ShellLayout pathname="/amortizacao">
        <span />
      </ShellLayout>,
    );

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: /módulos/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("cockpit-module-juros")).toBeInTheDocument();
    expect(
      screen.getByTestId("cockpit-module-amortizacao"),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("sidebar")).not.toBeInTheDocument();
  });
});
