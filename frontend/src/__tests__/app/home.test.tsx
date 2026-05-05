import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "@/app/(app)/page";

describe("HomePage — cockpit compacto", () => {
  it("prioriza apresentação curta e atalhos para módulos ativos", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        name: /plataforma educacional financeira/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /juros/i })).toHaveAttribute(
      "href",
      "/juros",
    );
    expect(screen.getByRole("link", { name: /amortização/i })).toHaveAttribute(
      "href",
      "/amortizacao",
    );
  });
});
