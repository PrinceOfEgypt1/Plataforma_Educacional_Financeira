/**
 * Renderização dos alertas do envelope F3.
 *
 * Semântica:
 *   - `severity: "warning"` → `AlertBanner level="warning"` (role="alert")
 *   - `severity: "info"` → `AlertBanner level="info"` (role="status")
 *
 * Nunca silencia alertas — se a API mandou, o usuário precisa ver.
 */
import { AlertBanner } from "@/components/ui/AlertBanner";
import type { InterestAlert } from "@/types/interest";

export interface JurosAlertsProps {
  readonly alerts: ReadonlyArray<InterestAlert>;
}

export function JurosAlerts({ alerts }: JurosAlertsProps) {
  if (alerts.length === 0) return null;
  return (
    <div className="flex flex-col gap-2" data-testid="juros-alerts">
      {alerts.map((a) => (
        <AlertBanner
          key={a.code}
          level={a.severity === "warning" ? "warning" : "info"}
          title={a.code}
        >
          {a.message}
        </AlertBanner>
      ))}
    </div>
  );
}
