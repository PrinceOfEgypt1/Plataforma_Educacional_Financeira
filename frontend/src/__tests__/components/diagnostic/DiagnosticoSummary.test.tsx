import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DiagnosticoSummary } from "@/components/diagnostic/DiagnosticoSummary";
import type { DiagnosticAnalyzeResponseData } from "@/types/diagnostic";

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

describe("DiagnosticoSummary", () => {
  it("exibe score do caso DG-01", () => {
    render(<DiagnosticoSummary data={DG01} />);
    expect(screen.getByText("7 / 9")).toBeInTheDocument();
  });

  it("exibe saúde financeira como hint do score (DG-01)", () => {
    render(<DiagnosticoSummary data={DG01} />);
    expect(screen.getByText(/Saúde: Boa/i)).toBeInTheDocument();
  });

  it("exibe sobra mensal formatada em BRL", () => {
    render(<DiagnosticoSummary data={DG01} />);
    expect(screen.getByText(/R\$\s*1\.700,00/)).toBeInTheDocument();
  });

  it("exibe comprometimento percentual", () => {
    render(<DiagnosticoSummary data={DG01} />);
    expect(screen.getByText(/10,0%/)).toBeInTheDocument();
  });

  it("exibe reserva em meses", () => {
    render(<DiagnosticoSummary data={DG01} />);
    expect(screen.getByText(/1,4 meses/)).toBeInTheDocument();
  });

  it("exibe despesas essenciais mensais", () => {
    render(<DiagnosticoSummary data={DG01} />);
    expect(screen.getByText(/R\$\s*2\.800,00/)).toBeInTheDocument();
  });

  it("exibe classificações dos níveis", () => {
    render(<DiagnosticoSummary data={DG01} />);
    expect(screen.getByText("Baixo")).toBeInTheDocument();
    expect(screen.getByText("Insuficiente")).toBeInTheDocument();
    expect(screen.getAllByText("Boa").length).toBeGreaterThan(0);
  });

  it("renderiza caso DG-02 com score 3 e saúde crítica", () => {
    render(<DiagnosticoSummary data={DG02} />);
    expect(screen.getByText("3 / 9")).toBeInTheDocument();
    expect(screen.getByText(/Saúde: Crítica/i)).toBeInTheDocument();
  });

  it("tem data-testid diagnostico-summary", () => {
    render(<DiagnosticoSummary data={DG01} />);
    expect(screen.getByTestId("diagnostico-summary")).toBeInTheDocument();
  });
});
