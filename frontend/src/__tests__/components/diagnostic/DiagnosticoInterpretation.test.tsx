import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DiagnosticoInterpretation } from "@/components/diagnostic/DiagnosticoInterpretation";
import type { DiagnosticAnalyzeResponseData } from "@/types/diagnostic";

function makeData(saude_nivel: string): DiagnosticAnalyzeResponseData {
  return {
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
    saude_nivel: saude_nivel as DiagnosticAnalyzeResponseData["saude_nivel"],
    alertas: [],
  };
}

describe("DiagnosticoInterpretation", () => {
  it("renderiza interpretação para saude_nivel 'boa'", () => {
    render(<DiagnosticoInterpretation data={makeData("boa")} />);
    expect(
      screen.getByTestId("diagnostico-interpretation"),
    ).toBeInTheDocument();
    expect(screen.getByText(/situação financeira boa/i)).toBeInTheDocument();
  });

  it("renderiza interpretação para saude_nivel 'critica'", () => {
    render(<DiagnosticoInterpretation data={makeData("critica")} />);
    expect(
      screen.getByText(/situação financeira crítica/i),
    ).toBeInTheDocument();
  });

  it("exibe aviso de caráter educacional", () => {
    render(<DiagnosticoInterpretation data={makeData("boa")} />);
    expect(screen.getByText(/educacional/i)).toBeInTheDocument();
    expect(screen.getByText(/não substitui/i)).toBeInTheDocument();
  });

  it("renderiza sem erros para todos os níveis de saúde conhecidos", () => {
    const niveis = ["critica", "ruim", "regular", "boa", "excelente"];
    for (const nivel of niveis) {
      const { unmount } = render(
        <DiagnosticoInterpretation data={makeData(nivel)} />,
      );
      expect(
        screen.getByTestId("diagnostico-interpretation"),
      ).toBeInTheDocument();
      unmount();
    }
  });
});
