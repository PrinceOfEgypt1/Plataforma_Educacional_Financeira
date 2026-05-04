/**
 * `<AlertBanner />`
 *
 * Faixa de alerta em nível `info | success | warning | error` pensada para
 * transmitir ao usuário orientação pontual dentro de um módulo (ex.: "O CET
 * aproximado não substitui a consulta ao contrato"). Cada nível mapeia para
 * uma CSS var do Design System para manter anti-drift.
 */
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type AlertLevel = "info" | "success" | "warning" | "error";

export interface AlertBannerProps {
  readonly level?: AlertLevel;
  readonly title?: string;
  readonly children: ReactNode;
  readonly className?: string;
}

const LEVEL_VAR: Record<AlertLevel, string> = {
  info: "var(--color-info)",
  success: "var(--color-success)",
  warning: "var(--color-warning)",
  error: "var(--color-error)",
};

const LEVEL_ROLE: Record<AlertLevel, "status" | "alert"> = {
  info: "status",
  success: "status",
  warning: "alert",
  error: "alert",
};

const LEVEL_LABEL: Record<AlertLevel, string> = {
  info: "Aviso informativo",
  success: "Aviso de sucesso",
  warning: "Aviso importante",
  error: "Aviso de erro",
};

const LEVEL_SURFACE: Record<AlertLevel, string> = {
  info: "border-blue-100 bg-blue-50/70",
  success: "border-emerald-100 bg-emerald-50/70",
  warning: "border-amber-100 bg-amber-50/70",
  error: "border-red-100 bg-red-50/70",
};

export function AlertBanner({
  level = "info",
  title,
  children,
  className,
}: AlertBannerProps) {
  return (
    <div
      data-testid="alert-banner"
      data-level={level}
      role={LEVEL_ROLE[level]}
      aria-label={LEVEL_LABEL[level]}
      className={cn(
        "flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-sm",
        LEVEL_SURFACE[level],
        className,
      )}
      style={{
        borderLeftWidth: 4,
        borderLeftColor: LEVEL_VAR[level],
      }}
    >
      <span
        aria-hidden="true"
        className="mt-0.5 h-2 w-2 shrink-0 rounded-full"
        style={{ backgroundColor: LEVEL_VAR[level] }}
      />
      <div className="min-w-0">
        {title && <div className="font-semibold text-slate-800">{title}</div>}
        <div className="text-slate-600">{children}</div>
      </div>
    </div>
  );
}
