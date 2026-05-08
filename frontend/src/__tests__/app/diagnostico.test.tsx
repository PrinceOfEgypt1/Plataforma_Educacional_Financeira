import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { DiagnosticAnalyzeResponseData } from "@/types/diagnostic";

vi.mock("next/navigation", () => ({
  usePathname: () => "/diagnostico",
}));

vi.mock("@/services/diagnostic/diagnosticoService", () => ({
  analisarDiagnostico: vi.fn(),
}));

import DiagnosticoPage from "@/app/(app)/diagnostico/page";
import { analisarDiagnostico } from "@/services/diagnostic/diagnosticoService";

const DG01: DiagnosticAnalyzeResponseData = {
  renda_mensal: "5000.00",
  total_despesas_fixas: "2000.00",
  total_despesas_variaveis: "800.00",
  total_dividas_mensais: "500.00",
  total_reserva_atual: "4000.00",
  sobra_mensal: "1700.00",
  despesas_essenciais_mensais: "2800.00",
  comprometimento_percentual: "10.00",
  sobra_percentual: "34.00",
  reserva_em_meses: "1.43",
  comprometimento_nivel: "baixo",
  reserva_nivel: "insuficiente",
  sobra_nivel: "boa",
  pontos_comprometimento: 3,
  pontos_reserva: 1,
  pontos_sobra: 3,
  score: 7,
  saude_nivel: "boa",
  alertas: [
    { code: "RESERVA_INSUFICIENTE", level: "warning", dimension: "reserva" },
  ],
};

const DG02: DiagnosticAnalyzeResponseData = {
  renda_mensal: "3000.00",
  total_despesas_fixas: "2200.00",
  total_despesas_variaveis: "700.00",
  total_dividas_mensais: "500.00",
  total_reserva_atual: "0.00",
  sobra_mensal: "-400.00",
  despesas_essenciais_mensais: "2900.00",
  comprometimento_percentual: "16.67",
  sobra_percentual: "-13.33",
  reserva_em_meses: "0.00",
  comprometimento_nivel: "medio",
  reserva_nivel: "insuficiente",
  sobra_nivel: "negativa",
  pontos_comprometimento: 2,
  pontos_reserva: 0,
  pontos_sobra: 1,
  score: 3,
  saude_nivel: "critica",
  alertas: [
    { code: "RESERVA_CRITICA", level: "critical", dimension: "reserva" },
    { code: "SOBRA_NEGATIVA", level: "critical", dimension: "sobra" },
  ],
};

const analisarMock = vi.mocked(analisarDiagnostico);

function fillForm(user: ReturnType<typeof userEvent.setup>) {
  return async (
    renda: string,
    fixas: string,
    variaveis: string,
    dividas: string,
    reserva: string,
  ) => {
    await user.clear(screen.getByLabelText(/renda mensal/i));
    await user.type(screen.getByLabelText(/renda mensal/i), renda);
    await user.clear(screen.getByLabelText(/despesas fixas/i));
    await user.type(screen.getByLabelText(/despesas fixas/i), fixas);
    await user.clear(screen.getByLabelText(/despesas variáveis/i));
    await user.type(screen.getByLabelText(/despesas variáveis/i), variaveis);
    await user.clear(screen.getByLabelText(/dívidas mensais/i));
    await user.type(screen.getByLabelText(/dívidas mensais/i), dividas);
    await user.clear(screen.getByLabelText(/reserva atual/i));
    await user.type(screen.getByLabelText(/reserva atual/i), reserva);
  };
}

describe("/diagnostico — DiagnosticoCockpit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    analisarMock.mockResolvedValue(DG01);
  });

  it("renderiza a página /diagnostico com cockpit (não é mais stub)", () => {
    render(<DiagnosticoPage />);
    expect(screen.getByTestId("diagnostico-cockpit")).toBeInTheDocument();
  });

  it("não exibe texto de stub 'em construção'", () => {
    render(<DiagnosticoPage />);
    expect(screen.queryByText(/em construção/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/em breve/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/ModulePage/i)).not.toBeInTheDocument();
  });

  it("exibe formulário com os 5 campos obrigatórios", () => {
    render(<DiagnosticoPage />);
    expect(screen.getByLabelText(/renda mensal/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/despesas fixas/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/despesas variáveis/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/dívidas mensais/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/reserva atual/i)).toBeInTheDocument();
  });

  it("exibe estado inicial com instrução ao usuário", () => {
    render(<DiagnosticoPage />);
    expect(screen.getByTestId("diagnostico-idle-state")).toBeInTheDocument();
    expect(screen.getByText(/preencha os dados/i)).toBeInTheDocument();
  });

  it("permite preencher os campos", async () => {
    const user = userEvent.setup();
    render(<DiagnosticoPage />);
    const fill = fillForm(user);
    await fill("5000", "2000", "800", "500", "4000");
    expect(screen.getByLabelText(/renda mensal/i)).toHaveValue("5000");
    expect(screen.getByLabelText(/despesas fixas/i)).toHaveValue("2000");
  });

  it("exibe loading ao submeter e chama a API corretamente (DG-01)", async () => {
    let resolvePromise!: (v: DiagnosticAnalyzeResponseData) => void;
    analisarMock.mockReturnValueOnce(
      new Promise((res) => {
        resolvePromise = res;
      }),
    );
    const user = userEvent.setup();
    render(<DiagnosticoPage />);
    const fill = fillForm(user);
    await fill("5000", "2000", "800", "500", "4000");
    await user.click(
      screen.getByRole("button", { name: /analisar situação/i }),
    );
    expect(screen.getByTestId("diagnostico-loading-state")).toBeInTheDocument();
    resolvePromise(DG01);
    await waitFor(() =>
      expect(screen.getByTestId("diagnostico-ok-state")).toBeInTheDocument(),
    );
    expect(analisarMock).toHaveBeenCalledWith({
      renda_mensal: "5000.00",
      total_despesas_fixas: "2000.00",
      total_despesas_variaveis: "800.00",
      total_dividas_mensais: "500.00",
      total_reserva_atual: "4000.00",
    });
  });

  it("exibe resultado de sucesso com KPIs e summary (DG-01)", async () => {
    const user = userEvent.setup();
    render(<DiagnosticoPage />);
    const fill = fillForm(user);
    await fill("5000", "2000", "800", "500", "4000");
    await user.click(
      screen.getByRole("button", { name: /analisar situação/i }),
    );
    await waitFor(() =>
      expect(screen.getByTestId("diagnostico-summary")).toBeInTheDocument(),
    );
    expect(screen.getByText("7 / 9")).toBeInTheDocument();
    expect(screen.getByText(/Saúde: Boa/i)).toBeInTheDocument();
    expect(screen.getByText(/R\$\s*1\.700,00/)).toBeInTheDocument();
  });

  it("exibe alertas retornados pela API (DG-01)", async () => {
    const user = userEvent.setup();
    render(<DiagnosticoPage />);
    const fill = fillForm(user);
    await fill("5000", "2000", "800", "500", "4000");
    await user.click(
      screen.getByRole("button", { name: /analisar situação/i }),
    );
    await waitFor(() =>
      expect(screen.getByTestId("diagnostico-alerts")).toBeInTheDocument(),
    );
    expect(
      screen.getByText(/reserva de emergência insuficiente/i),
    ).toBeInTheDocument();
  });

  it("exibe resultado de sucesso com múltiplos alertas (DG-02)", async () => {
    analisarMock.mockResolvedValueOnce(DG02);
    const user = userEvent.setup();
    render(<DiagnosticoPage />);
    const fill = fillForm(user);
    await fill("3000", "2200", "700", "500", "0");
    await user.click(
      screen.getByRole("button", { name: /analisar situação/i }),
    );
    await waitFor(() =>
      expect(screen.getByTestId("diagnostico-summary")).toBeInTheDocument(),
    );
    expect(screen.getByText("3 / 9")).toBeInTheDocument();
    expect(screen.getByText(/Saúde: Crítica/i)).toBeInTheDocument();
  });

  it("exibe erro amigável quando a API falha", async () => {
    analisarMock.mockRejectedValueOnce({
      kind: "problem",
      status: 422,
      title: "Validation Error",
      detail: "Dados inválidos fornecidos.",
    });
    const user = userEvent.setup();
    render(<DiagnosticoPage />);
    const fill = fillForm(user);
    await fill("5000", "2000", "800", "500", "4000");
    await user.click(
      screen.getByRole("button", { name: /analisar situação/i }),
    );
    await waitFor(() =>
      expect(screen.getByTestId("diagnostico-error-state")).toBeInTheDocument(),
    );
    expect(screen.getByText(/dados inválidos/i)).toBeInTheDocument();
  });

  it("valida campos obrigatórios — não chama API com renda vazia", async () => {
    const user = userEvent.setup();
    render(<DiagnosticoPage />);
    await user.click(
      screen.getByRole("button", { name: /analisar situação/i }),
    );
    expect(analisarMock).not.toHaveBeenCalled();
    expect(screen.getAllByText(/campo obrigatório/i).length).toBeGreaterThan(0);
  });

  it("valida renda mensal zero — não chama API", async () => {
    const user = userEvent.setup();
    render(<DiagnosticoPage />);
    await user.type(screen.getByLabelText(/renda mensal/i), "0");
    await user.type(screen.getByLabelText(/despesas fixas/i), "0");
    await user.type(screen.getByLabelText(/despesas variáveis/i), "0");
    await user.type(screen.getByLabelText(/dívidas mensais/i), "0");
    await user.type(screen.getByLabelText(/reserva atual/i), "0");
    await user.click(
      screen.getByRole("button", { name: /analisar situação/i }),
    );
    expect(analisarMock).not.toHaveBeenCalled();
    expect(
      screen.getByText(/renda mensal deve ser maior que zero/i),
    ).toBeInTheDocument();
  });

  it("exibe interpretação textual do resultado", async () => {
    const user = userEvent.setup();
    render(<DiagnosticoPage />);
    const fill = fillForm(user);
    await fill("5000", "2000", "800", "500", "4000");
    await user.click(
      screen.getByRole("button", { name: /analisar situação/i }),
    );
    await waitFor(() =>
      expect(
        screen.getByTestId("diagnostico-interpretation"),
      ).toBeInTheDocument(),
    );
    expect(screen.getByText(/situação financeira boa/i)).toBeInTheDocument();
  });
});
