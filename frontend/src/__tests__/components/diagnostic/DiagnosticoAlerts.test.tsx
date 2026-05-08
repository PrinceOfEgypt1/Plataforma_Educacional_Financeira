import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DiagnosticoAlerts } from "@/components/diagnostic/DiagnosticoAlerts";
import type { DiagnosticAlert } from "@/types/diagnostic";

const WARNING_ALERT: DiagnosticAlert = {
  code: "RESERVA_INSUFICIENTE",
  level: "warning",
  dimension: "reserva",
};

const CRITICAL_ALERT: DiagnosticAlert = {
  code: "SOBRA_NEGATIVA",
  level: "critical",
  dimension: "sobra",
};

describe("DiagnosticoAlerts", () => {
  it("exibe mensagem neutra quando não há alertas", () => {
    render(<DiagnosticoAlerts alerts={[]} />);
    expect(screen.getByText(/sem alertas/i)).toBeInTheDocument();
    expect(screen.getByText(/nenhum ponto crítico/i)).toBeInTheDocument();
  });

  it("renderiza alerta de warning com label correto", () => {
    render(<DiagnosticoAlerts alerts={[WARNING_ALERT]} />);
    expect(
      screen.getByText(/reserva de emergência insuficiente/i),
    ).toBeInTheDocument();
    expect(screen.getByTestId("diagnostico-alerts")).toBeInTheDocument();
  });

  it("renderiza alerta crítico com label correto", () => {
    render(<DiagnosticoAlerts alerts={[CRITICAL_ALERT]} />);
    expect(screen.getByText(/despesas superam a renda/i)).toBeInTheDocument();
  });

  it("renderiza múltiplos alertas", () => {
    render(
      <DiagnosticoAlerts alerts={[WARNING_ALERT, CRITICAL_ALERT]} />,
    );
    expect(screen.getByText(/reserva de emergência insuficiente/i)).toBeInTheDocument();
    expect(screen.getByText(/despesas superam a renda/i)).toBeInTheDocument();
  });

  it("não inventa alerta — exibe apenas os retornados pela API", () => {
    render(<DiagnosticoAlerts alerts={[WARNING_ALERT]} />);
    expect(
      screen.queryByText(/comprometimento/i),
    ).not.toBeInTheDocument();
  });

  it("aplica data-level=warning para alerta de warning", () => {
    render(<DiagnosticoAlerts alerts={[WARNING_ALERT]} />);
    const banner = screen.getByTestId("alert-banner");
    expect(banner).toHaveAttribute("data-level", "warning");
  });

  it("aplica data-level=error para alerta crítico", () => {
    render(<DiagnosticoAlerts alerts={[CRITICAL_ALERT]} />);
    const banner = screen.getByTestId("alert-banner");
    expect(banner).toHaveAttribute("data-level", "error");
  });
});
