/**
 * Testes de `<Header />`.
 *
 * Cobre:
 *   - Presença do `role="banner"` obrigatório;
 *   - Breadcrumb exibindo "Início" na rota raiz;
 *   - Breadcrumb resolvendo o `title` do módulo em rota conhecida;
 *   - Breadcrumb caindo para "Início" em rota desconhecida.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

import { Header } from "@/components/shell/Header";

describe("<Header />", () => {
  it("renderiza com role banner", () => {
    render(<Header pathname="/" />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("exibe 'Início' quando pathname é /", () => {
    render(<Header pathname="/" />);
    expect(screen.getByTestId("breadcrumb-current")).toHaveTextContent(
      /início/i,
    );
  });

  it("exibe o título do módulo quando pathname bate com um slug", () => {
    render(<Header pathname="/amortizacao" />);
    expect(screen.getByTestId("breadcrumb-current")).toHaveTextContent(
      /amortiza/i,
    );
  });

  it("cai para 'Início' em pathname desconhecido", () => {
    render(<Header pathname="/rota-que-nao-existe" />);
    expect(screen.getByTestId("breadcrumb-current")).toHaveTextContent(
      /início/i,
    );
  });
});
