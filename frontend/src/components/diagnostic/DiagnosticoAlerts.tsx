import { AlertBanner, type AlertLevel } from "@/components/ui/AlertBanner";
import type { DiagnosticAlert, DiagnosticAlertLevel } from "@/types/diagnostic";

const ALERT_CODE_LABELS: Record<string, string> = {
  RESERVA_INSUFICIENTE: "Reserva de emergência insuficiente",
  RESERVA_CRITICA: "Reserva de emergência crítica",
  SOBRA_NEGATIVA: "Despesas superam a renda",
  COMPROMETIMENTO_ALTO: "Comprometimento com dívidas elevado",
  COMPROMETIMENTO_CRITICO: "Comprometimento com dívidas crítico",
};

const ALERT_CODE_DETAIL: Record<string, string> = {
  RESERVA_INSUFICIENTE:
    "Sua reserva cobre menos de 3 meses de despesas. Priorize aumentá-la.",
  RESERVA_CRITICA:
    "Sua reserva cobre menos de 1 mês de despesas. Situação de risco elevado.",
  SOBRA_NEGATIVA:
    "Suas despesas e dívidas superam a renda. Revise seus gastos urgentemente.",
  COMPROMETIMENTO_ALTO:
    "Mais de 20% da renda vai para dívidas. Avalie renegociação.",
  COMPROMETIMENTO_CRITICO:
    "Mais de 30% da renda vai para dívidas. Situação de alto risco financeiro.",
};

function toAlertLevel(level: DiagnosticAlertLevel): AlertLevel {
  return level === "critical" ? "error" : "warning";
}

function getLabel(code: string): string {
  return ALERT_CODE_LABELS[code] ?? code;
}

function getDetail(code: string): string {
  return ALERT_CODE_DETAIL[code] ?? `Atenção: ${code}`;
}

export interface DiagnosticoAlertsProps {
  readonly alerts: ReadonlyArray<DiagnosticAlert>;
}

export function DiagnosticoAlerts({ alerts }: DiagnosticoAlertsProps) {
  if (alerts.length === 0) {
    return (
      <AlertBanner
        level="success"
        title="Sem alertas"
        data-testid="diagnostico-no-alerts"
      >
        Nenhum ponto crítico identificado. Continue acompanhando sua saúde
        financeira.
      </AlertBanner>
    );
  }

  return (
    <div className="flex flex-col gap-2" data-testid="diagnostico-alerts">
      {alerts.map((alert) => (
        <AlertBanner
          key={alert.code}
          level={toAlertLevel(alert.level)}
          title={getLabel(alert.code)}
          data-testid={`diagnostico-alert-${alert.code}`}
        >
          {getDetail(alert.code)}
        </AlertBanner>
      ))}
    </div>
  );
}
