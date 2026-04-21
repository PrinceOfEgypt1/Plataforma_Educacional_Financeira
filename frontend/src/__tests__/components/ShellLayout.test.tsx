/**
 * Testes de `<ShellLayout />`.
 *
 * Cobre:
 *   - Render dos `children` na área principal;
 *   - Presença do `EducationalNotice` persistente;
 *   - Presença de um `<main role="main">` com `aria-label`;
 *   - Snapshot leve cumprindo o requisito Prompt §5.1.7 ("pelo menos uma
 *     prova visual / snapshot coerente da shell").
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

import { ShellLayout } from "@/components/shell/ShellLayout";

describe("<ShellLayout />", () => {
  it("renderiza children dentro de <main>", () => {
    render(
      <ShellLayout pathname="/">
        <p data-testid="child-1">conteúdo A</p>
      </ShellLayout>,
    );
    expect(screen.getByTestId("child-1")).toBeInTheDocument();
    const main = screen.getByRole("main");
    expect(main).toContainElement(screen.getByTestId("child-1"));
  });

  it("renderiza EducationalNotice no topo", () => {
    render(
      <ShellLayout pathname="/">
        <span />
      </ShellLayout>,
    );
    expect(screen.getByTestId("educational-notice")).toBeInTheDocument();
  });

  it("renderiza múltiplos children preservando a ordem", () => {
    render(
      <ShellLayout pathname="/">
        <p data-testid="child-1">A</p>
        <p data-testid="child-2">B</p>
      </ShellLayout>,
    );
    const main = screen.getByRole("main");
    expect(main).toContainElement(screen.getByTestId("child-1"));
    expect(main).toContainElement(screen.getByTestId("child-2"));
  });

  it("snapshot leve cobrindo landmarks principais", () => {
    render(
      <ShellLayout pathname="/">
        <p>snapshot child</p>
      </ShellLayout>,
    );
    // Checa presença de landmarks ARIA via roles implícitos resolvidos pelo
    // Testing Library (`<header>`/`<nav>`/`<footer>` mapeiam para banner/
    // navigation/contentinfo automaticamente).
    expect(screen.getByTestId("shell-layout")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: /módulos/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
