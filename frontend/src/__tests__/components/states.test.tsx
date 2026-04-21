/**
 * Testes dos 3 estados reutilizáveis — LoadingState, ErrorState, EmptyState.
 *
 * Cobre:
 *   - Título padrão e customizado;
 *   - Descrição opcional;
 *   - Renderização de `action` (botão passado via prop);
 *   - Roles ARIA apropriados por estado.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { LoadingState, ErrorState, EmptyState } from "@/components/states";

describe("<LoadingState />", () => {
  it("exibe título e descrição padrão", () => {
    render(<LoadingState />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    // "Carregando" aparece em dois pontos intencionais (título visível +
    // mensagem sr-only). `getAllByText` valida a presença de ambos.
    expect(screen.getAllByText(/carregando/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/preparando os dados/i)).toBeInTheDocument();
  });

  it("aceita título customizado", () => {
    render(<LoadingState title="Calculando parcelas" />);
    expect(screen.getByText("Calculando parcelas")).toBeInTheDocument();
  });

  it("renderiza a action quando fornecida", () => {
    render(<LoadingState action={<button type="button">Cancelar</button>} />);
    expect(
      screen.getByRole("button", { name: /cancelar/i }),
    ).toBeInTheDocument();
  });

  it("é marcado como aria-busy=true para screen readers", () => {
    render(<LoadingState />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
  });
});

describe("<ErrorState />", () => {
  it("exibe título e descrição padrão com role alert", () => {
    render(<ErrorState />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText(/algo deu errado/i)).toBeInTheDocument();
  });

  it("renderiza diagnóstico quando fornecido", () => {
    render(<ErrorState diagnostics="NOT_FOUND (404)" />);
    expect(screen.getByTestId("error-diagnostics")).toHaveTextContent(
      /not_found/i,
    );
  });

  it("renderiza action quando fornecida", () => {
    render(
      <ErrorState action={<button type="button">Tentar novamente</button>} />,
    );
    expect(
      screen.getByRole("button", { name: /tentar novamente/i }),
    ).toBeInTheDocument();
  });
});

describe("<EmptyState />", () => {
  it("exibe mensagem padrão com role status", () => {
    render(<EmptyState />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText(/sem dados/i)).toBeInTheDocument();
  });

  it("aceita título, descrição e action customizados", () => {
    render(
      <EmptyState
        title="Sem simulações"
        description="Preencha os campos para começar."
        action={<button type="button">Começar</button>}
      />,
    );
    expect(screen.getByText("Sem simulações")).toBeInTheDocument();
    expect(
      screen.getByText(/preencha os campos para começar/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /começar/i }),
    ).toBeInTheDocument();
  });
});
