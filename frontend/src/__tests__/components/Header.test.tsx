/**
 * Testes de `<Header />`.
 *
 * Cobre:
 *   - Presença do `role="banner"` obrigatório;
 *   - Breadcrumb exibindo "Início" na rota raiz;
 *   - Breadcrumb resolvendo o nome curto do módulo em rota conhecida;
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
    expect(
      screen.queryByRole("link", { name: /^início$/i }),
    ).not.toBeInTheDocument();
  });

  it("exibe o título do módulo quando pathname bate com um slug", () => {
    render(<Header pathname="/amortizacao" />);
    expect(screen.getByTestId("breadcrumb-current")).toHaveTextContent(
      /^amortização$/i,
    );
  });

  it("não usa o termo genérico Dashboard no breadcrumb", () => {
    render(<Header pathname="/juros" />);
    expect(screen.queryByText(/dashboard/i)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^início$/i })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("cai para 'Início' em pathname desconhecido", () => {
    render(<Header pathname="/rota-que-nao-existe" />);
    expect(screen.getByTestId("breadcrumb-current")).toHaveTextContent(
      /início/i,
    );
  });
});
