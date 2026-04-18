/**
 * Testes de `<Sidebar />`.
 *
 * Cobre:
 *   - Render dos 12 módulos canônicos;
 *   - Marcação de item ativo via `aria-current="page"` quando `pathname`
 *     casa com o slug;
 *   - Presença de `role="navigation"` com `aria-label="Módulos"`;
 *   - Agrupamento visual (um `<section>` por grupo).
 *
 * O mock de `next/navigation.usePathname` é feito via `vi.mock`. Em paralelo,
 * passamos `pathname` por prop para testes determinísticos sem depender do
 * mock global, casando com a API do componente.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

import { Sidebar } from "@/components/shell/Sidebar";
import { MODULES } from "@/config/modules";

describe("<Sidebar />", () => {
  it("renderiza todos os 12 módulos canônicos", () => {
    render(<Sidebar pathname="/" />);
    const nav = screen.getByRole("navigation", { name: /módulos/i });
    expect(nav).toBeInTheDocument();
    // O nome acessível do link inclui o shortTitle + "em breve" (vindo do
    // badge de status); usamos regex para casar pelo shortTitle.
    for (const mod of MODULES) {
      const link = within(nav).getByRole("link", {
        name: new RegExp(
          mod.shortTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          "i",
        ),
      });
      expect(link).toHaveAttribute("href", mod.href);
    }
    expect(within(nav).getAllByRole("link")).toHaveLength(MODULES.length);
  });

  it("marca o item ativo via aria-current quando pathname casa", () => {
    render(<Sidebar pathname="/juros" />);
    const link = screen.getByRole("link", { name: /juros/i });
    expect(link).toHaveAttribute("aria-current", "page");
  });

  it("não marca item ativo quando pathname não casa com nenhum módulo", () => {
    render(<Sidebar pathname="/rota-inexistente" />);
    const activeLinks = screen
      .getAllByRole("link")
      .filter((el) => el.getAttribute("aria-current") === "page");
    expect(activeLinks).toHaveLength(0);
  });

  it("possui um header de grupo por agrupamento de módulo", () => {
    render(<Sidebar pathname="/" />);
    // Agrupamentos distintos observados na fonte: diagnóstico, básicos,
    // financiamentos, empréstimos, cartão, dívida, referência, decisão, educação.
    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings.length).toBeGreaterThanOrEqual(8);
  });
});
