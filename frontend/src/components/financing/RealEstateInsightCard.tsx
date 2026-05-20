"use client";

/**
 * RealEstateInsightCard — Card horizontal colorido para alertas e recomendações pedagógicas
 *
 * Implementa o padrão visual "horizontal alert card" do protótipo Financial Observatory.
 * Usado na sidebar e nas zonas do cockpit para recomendações, alertas e CTAs educativas.
 *
 * Cada card possui:
 * - Categoria discreta (label superior)
 * - Ícone colorido compacto
 * - Título curto e objetivo
 * - Descrição contextual
 * - Botão interno opcional com navegação para zona relevante
 * - Cor temática: amber | emerald | violet | cyan | rose
 */

import type { ReactNode } from "react";

export type InsightCardTone =
  | "amber"
  | "emerald"
  | "violet"
  | "cyan"
  | "rose"
  | "slate";

interface RealEstateInsightCardProps {
  /** Categoria discreta exibida acima do título */
  readonly category: string;
  /** Ícone ou emoji compacto */
  readonly icon: ReactNode;
  /** Título curto e objetivo */
  readonly title: string;
  /** Descrição pedagógica */
  readonly description: string;
  /** Cor temática do card */
  readonly tone: InsightCardTone;
  /** Rótulo do botão interno (opcional) */
  readonly actionLabel?: string;
  /** Handler do botão interno */
  readonly onAction?: () => void;
  /** data-testid para testes */
  readonly testId?: string;
}

const TONE_CLASSES: Record<
  InsightCardTone,
  {
    wrapper: string;
    icon: string;
    cat: string;
    btn: string;
  }
> = {
  amber: {
    wrapper: "border-amber-400/25 bg-amber-400/8 hover:border-amber-400/40",
    icon: "bg-amber-400/20 text-amber-300",
    cat: "text-amber-300/80",
    btn: "border-amber-400/40 bg-amber-400/15 text-amber-200 hover:bg-amber-400/25",
  },
  emerald: {
    wrapper:
      "border-emerald-400/25 bg-emerald-400/8 hover:border-emerald-400/40",
    icon: "bg-emerald-400/20 text-emerald-300",
    cat: "text-emerald-300/80",
    btn: "border-emerald-400/40 bg-emerald-400/15 text-emerald-200 hover:bg-emerald-400/25",
  },
  violet: {
    wrapper: "border-violet-400/25 bg-violet-400/8 hover:border-violet-400/40",
    icon: "bg-violet-400/20 text-violet-300",
    cat: "text-violet-300/80",
    btn: "border-violet-400/40 bg-violet-400/15 text-violet-200 hover:bg-violet-400/25",
  },
  cyan: {
    wrapper: "border-cyan-400/25 bg-cyan-400/8 hover:border-cyan-400/40",
    icon: "bg-cyan-400/20 text-cyan-300",
    cat: "text-cyan-300/80",
    btn: "border-cyan-400/40 bg-cyan-400/15 text-cyan-200 hover:bg-cyan-400/25",
  },
  rose: {
    wrapper: "border-rose-400/25 bg-rose-400/8 hover:border-rose-400/40",
    icon: "bg-rose-400/20 text-rose-300",
    cat: "text-rose-300/80",
    btn: "border-rose-400/40 bg-rose-400/15 text-rose-200 hover:bg-rose-400/25",
  },
  slate: {
    wrapper: "border-white/12 bg-white/4 hover:border-white/20",
    icon: "bg-white/12 text-slate-300",
    cat: "text-slate-400",
    btn: "border-white/20 bg-white/8 text-slate-200 hover:bg-white/15",
  },
};

export function RealEstateInsightCard({
  category,
  icon,
  title,
  description,
  tone,
  actionLabel,
  onAction,
  testId,
}: RealEstateInsightCardProps) {
  const cls = TONE_CLASSES[tone];

  return (
    <article
      className={`
        flex gap-2.5 rounded-xl border p-2.5 transition-colors
        ${cls.wrapper}
      `}
      data-testid={testId ?? "insight-card"}
    >
      {/* Ícone */}
      <div
        className={`
          mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center
          rounded-lg text-sm
          ${cls.icon}
        `}
        aria-hidden="true"
      >
        {icon}
      </div>

      {/* Corpo */}
      <div className="min-w-0 flex-1">
        <p
          className={`text-[10px] font-bold uppercase tracking-[0.14em] ${cls.cat}`}
        >
          {category}
        </p>
        <p className="mt-0.5 text-[12px] font-semibold leading-tight text-slate-100">
          {title}
        </p>
        <p className="mt-0.5 text-[11px] leading-4 text-slate-400">
          {description}
        </p>
        {actionLabel !== undefined && onAction !== undefined && (
          <button
            type="button"
            onClick={onAction}
            className={`
              mt-1.5 rounded-md border px-2 py-0.5
              text-[10px] font-semibold transition-colors
              focus:outline-none focus:ring-1 focus:ring-offset-1
              focus:ring-offset-transparent focus:ring-current
              ${cls.btn}
            `}
          >
            {actionLabel} →
          </button>
        )}
      </div>
    </article>
  );
}
