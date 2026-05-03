import { AlertBanner } from "@/components/ui/AlertBanner";
import type { AmortizationAlert } from "@/types/amortization";

export interface AmortizacaoAlertsProps {
  readonly alerts: ReadonlyArray<AmortizationAlert>;
}

export function AmortizacaoAlerts({ alerts }: AmortizacaoAlertsProps) {
  if (alerts.length === 0) return null;
  return (
    <div className="flex flex-col gap-2" data-testid="amortizacao-alerts">
      {alerts.map((alert) => (
        <AlertBanner
          key={alert.code}
          level={alert.severity === "warning" ? "warning" : "info"}
          title={alert.code}
        >
          {alert.message}
        </AlertBanner>
      ))}
    </div>
  );
}
