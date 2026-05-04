/**
 * Teste da página Home (grid de módulos).
 *
 * Importa `page.tsx` do grupo `(app)`. Como a shell é montada pelo layout
 * do grupo e não pela Home em si, o render isolado de `<HomePage />` é
 * suficiente para cobrir o contrato: módulos disponíveis priorizados,
 * módulos futuros agrupados em seção própria e cada card apontando para o
 * `href` correspondente em `@/config/modules`.
 */
import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";

import HomePage from "@/app/(app)/page";
import { MODULES } from "@/config/modules";

describe("HomePage", () => {
  it("separa módulos disponíveis e módulos em breve", () => {
    render(<HomePage />);
    const availableList = screen.getByRole("list", {
      name: /^lista de módulos$/i,
    });
    const plannedList = screen.getByRole("list", {
      name: /^lista de módulos em breve$/i,
    });

    expect(within(availableList).getAllByRole("listitem")).toHaveLength(
      MODULES.filter((mod) => mod.status === "disponivel").length,
    );
    expect(within(plannedList).getAllByRole("listitem")).toHaveLength(
      MODULES.filter((mod) => mod.status === "em-construcao").length,
    );
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
