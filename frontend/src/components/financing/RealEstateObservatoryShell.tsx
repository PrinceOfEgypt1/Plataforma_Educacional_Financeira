"use client";

/**
 * RealEstateObservatoryShell — Shell visual do cockpit Financial Observatory
 *
 * Componente de layout que envolve o cockpit de financiamento imobiliário
 * com a identidade visual "Financial Observatory" definida no protótipo Item 14C.
 *
 * Responsável por:
 * - Header interno com título do módulo, scenario pill e status chip
 * - Identidade visual premium (dark, layers, accent ciano)
 * - data-testid="financial-observatory" para identificação nos testes
 * - Separação clara de layout entre header e conteúdo principal
 */

import type { ReactNode } from "react";

interface ScenarioPill {
  readonly sistema: string;
  readonly valorFinanciado: string;
  readonly prazoMeses: number;
  readonly taxaMensal: string;
  readonly valid: boolean;
}

interface RealEstateObservatoryShellProps {
  readonly children: ReactNode;
  readonly scenario?: ScenarioPill | undefined;
}

export function RealEstateObservatoryShell({
  children,
  scenario,
}: RealEstateObservatoryShellProps) {
  return (
    <div
      className="flex h-full min-h-0 flex-col"
      data-testid="financial-observatory"
      aria-label="Financial Observatory — Simulador Imobiliário"
    >
      {/* ── Observatory Header ──────────────────────────────── */}
      <header
        className="
          flex flex-shrink-0 flex-wrap items-center gap-2 border-b
          border-cyan-200/8 bg-gradient-to-r from-slate-950 via-slate-900/90 to-cyan-950/30
          px-3 py-2
        "
        data-testid="observatory-header"
      >
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div
            className="
              flex h-6 w-6 flex-shrink-0 items-center justify-center
              rounded-md bg-gradient-to-br from-cyan-400 to-violet-500 text-xs
            "
            aria-hidden="true"
          >
            🏦
          </div>
          <span
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-200/80"
            data-testid="observatory-brand-label"
          >
            Financial Observatory
          </span>
        </div>

        {/* Scenario pill — visível apenas quando há simulação */}
        {scenario !== undefined && scenario.valid && (
          <div
            className="
              flex items-center gap-1.5 rounded-full border border-cyan-200/15
              bg-slate-800/80 px-2.5 py-0.5
            "
            data-testid="observatory-scenario-pill"
          >
            <span
              className="
                h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400
                shadow-[0_0_5px_rgba(52,211,153,0.8)]
              "
              aria-hidden="true"
            />
            <span className="font-mono text-[10px] font-semibold text-cyan-300">
              {scenario.sistema}
            </span>
            <span className="text-[10px] text-slate-400">
              · {scenario.valorFinanciado} · {scenario.prazoMeses} meses ·{" "}
              {scenario.taxaMensal}/mês
            </span>
          </div>
        )}

        <div className="ml-auto flex items-center gap-1.5">
          {scenario?.valid === true ? (
            <span
              className="
                rounded-full border border-emerald-400/30 bg-emerald-400/10
                px-2 py-0.5 text-[10px] font-bold text-emerald-300
              "
              data-testid="observatory-status-valid"
            >
              ● Simulação válida
            </span>
          ) : (
            <span
              className="
                rounded-full border border-slate-600/50 bg-slate-700/40
                px-2 py-0.5 text-[10px] font-bold text-slate-500
              "
            >
              Aguardando dados
            </span>
          )}
          <span
            className="
              rounded-full border border-amber-400/30 bg-amber-400/10
              px-2 py-0.5 text-[10px] font-bold text-amber-400
            "
          >
            Educacional
          </span>
        </div>
      </header>

      {/* ── Conteúdo principal ─────────────────────────────── */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
