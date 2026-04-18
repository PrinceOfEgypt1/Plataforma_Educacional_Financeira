/**
 * Teste da página Home (grid de módulos).
 *
 * Importa `page.tsx` do grupo `(app)`. Como a shell é montada pelo layout
 * do grupo e não pela Home em si, o render isolado de `<HomePage />` é
 * suficiente para cobrir o contrato: 12 cards, cada qual apontando para
 * o `href` correspondente em `@/config/modules`.
 */
import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";

import HomePage from "@/app/(app)/page";
import { MODULES } from "@/config/modules";

describe("HomePage", () => {
  it("renderiza grid com exatamente 12 módulos", () => {
    render(<HomePage />);
    const list = screen.getByRole("list", { name: /lista de módulos/i });
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(MODULES.length);
    expect(items.length).toBe(12);
  });

  it("cada card aponta para o href correto do módulo", () => {
    render(<HomePage />);
    for (const mod of MODULES) {
      const link = screen.getByRole("link", {
        name: new RegExp(`abrir módulo ${mod.title}`, "i"),
      });
      expect(link).toHaveAttribute("href", mod.href);
    }
  });

  it("renderiza o EducationPanel de contextualização", () => {
    render(<HomePage />);
    expect(
      screen.getByRole("complementary", {
        name: /como a plataforma está organizada/i,
      }),
    ).toBeInTheDocument();
  });
});
