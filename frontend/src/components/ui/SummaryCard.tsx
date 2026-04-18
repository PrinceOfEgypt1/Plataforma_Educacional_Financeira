/**
 * `<SummaryCard />`
 *
 * Cartão canônico para exibir um número/resultado de destaque com rótulo
 * curto, valor principal e um delta opcional colorido por sinal financeiro.
 * Consome tokens via classes utilitárias + `var(--color-financial-*)` para
 * preservar o contrato anti-drift.
 */
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type SummaryCardTrend = "positive" | "negative" | "neutral" | "warning";

export interface SummaryCardProps {
  readonly label: string;
  readonly value: ReactNode;
  readonly delta?: string;
  readonly trend?: SummaryCardTrend;
  readonly hint?: string;
  readonly className?: string;
}

const TREND_CSS_VAR: Record<SummaryCardTrend, string> = {
  positive: "var(--color-financial-positive)",
  negative: "var(--color-financial-negative)",
  neutral: "var(--color-financial-neutral)",
  warning: "var(--color-financial-warning)",
};

export function SummaryCard({
  label,
  value,
  delta,
  trend = "neutral",
  hint,
  className,
}: SummaryCardProps) {
  return (
    <article
      data-testid="summary-card"
      aria-label={`Resumo: ${label}`}
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-4 shadow-sm",
        className,
      )}
    >
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold text-slate-800">{value}</div>
      {delta && (
        <div
          data-testid="summary-card-delta"
          className="mt-1 text-sm font-medium"
          style={{ color: TREND_CSS_VAR[trend] }}
        >
          {delta}
        </div>
      )}
      {hint && <p className="mt-2 text-xs text-slate-500">{hint}</p>}
    </article>
  );
}
