import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { DiagnosticoForm } from "@/components/diagnostic/DiagnosticoForm";
import type { DiagnosticoFormDraft } from "@/components/diagnostic/formValidation";

const EMPTY_DRAFT: DiagnosticoFormDraft = {
  rendaMensal: "",
  despesasFixas: "",
  despesasVariaveis: "",
  dividasMensais: "",
  reservaAtual: "",
};

const FILLED_DRAFT: DiagnosticoFormDraft = {
  rendaMensal: "5000",
  despesasFixas: "2000",
  despesasVariaveis: "800",
  dividasMensais: "500",
  reservaAtual: "4000",
};

describe("DiagnosticoForm", () => {
  it("renderiza os 5 campos e o botão de submit", () => {
    render(
      <DiagnosticoForm
        draft={EMPTY_DRAFT}
        errors={{}}
        busy={false}
        onChange={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );
    expect(screen.getByLabelText(/renda mensal/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/despesas fixas/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/despesas variáveis/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/dívidas mensais/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/reserva atual/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /analisar situação/i }),
    ).toBeInTheDocument();
  });

  it("exibe valores do draft nos inputs", () => {
    render(
      <DiagnosticoForm
        draft={FILLED_DRAFT}
        errors={{}}
        busy={false}
        onChange={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );
    expect(screen.getByLabelText(/renda mensal/i)).toHaveValue("5000");
    expect(screen.getByLabelText(/despesas fixas/i)).toHaveValue("2000");
  });

  it("chama onChange quando o usuário digita em um campo", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <DiagnosticoForm
        draft={EMPTY_DRAFT}
        errors={{}}
        busy={false}
        onChange={onChange}
        onSubmit={vi.fn()}
      />,
    );
    await user.type(screen.getByLabelText(/renda mensal/i), "3");
    expect(onChange).toHaveBeenCalledWith("rendaMensal", expect.any(String));
  });

  it("exibe erros de validação nos hints dos campos", () => {
    render(
      <DiagnosticoForm
        draft={EMPTY_DRAFT}
        errors={{ rendaMensal: "Campo obrigatório." }}
        busy={false}
        onChange={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );
    expect(screen.getByText("Campo obrigatório.")).toBeInTheDocument();
  });

  it("desabilita o botão quando busy=true", () => {
    render(
      <DiagnosticoForm
        draft={FILLED_DRAFT}
        errors={{}}
        busy={true}
        onChange={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("chama onSubmit ao clicar no botão", async () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    const user = userEvent.setup();
    render(
      <DiagnosticoForm
        draft={FILLED_DRAFT}
        errors={{}}
        busy={false}
        onChange={vi.fn()}
        onSubmit={onSubmit}
      />,
    );
    await user.click(screen.getByRole("button", { name: /analisar situação/i }));
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("tem noValidate para desabilitar validação nativa do browser", () => {
    render(
      <DiagnosticoForm
        draft={EMPTY_DRAFT}
        errors={{}}
        busy={false}
        onChange={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );
    expect(screen.getByTestId("diagnostico-form")).toHaveAttribute("novalidate");
  });
});
