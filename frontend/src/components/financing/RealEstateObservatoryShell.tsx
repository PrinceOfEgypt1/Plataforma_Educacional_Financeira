"use client";

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
      className="financiamento-f8c-shell flex h-full min-h-0 flex-col bg-[#F1F5F9] text-slate-800"
      data-testid="financial-observatory"
      aria-label="Plataforma Educacional Financeira — Módulo Financiamento Imobiliário"
    >
      <header
        className="flex h-[60px] flex-shrink-0 items-center justify-between gap-4 bg-gradient-to-r from-[#0F2747] via-[#153A66] to-[#1E5B9A] px-7 text-white shadow-[0_4px_14px_rgba(15,39,71,0.18)]"
        data-testid="observatory-header"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl bg-white/14 text-lg ring-1 ring-white/18"
            aria-hidden="true"
          >
            🏠
          </div>
          <div className="min-w-0">
            <p
              className="truncate text-[15px] font-extrabold leading-5"
              data-testid="observatory-brand-label"
            >
              Plataforma Educacional Financeira
            </p>
            <p className="truncate text-[11px] font-medium text-blue-100/80">
              Módulo — Financiamento Imobiliário
            </p>
          </div>
        </div>

        <div className="ml-auto flex min-w-0 items-center gap-2">
          <span className="hidden rounded-full border border-white/18 bg-white/12 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white md:inline-flex">
            Módulo Imóvel
          </span>
          {scenario !== undefined && scenario.valid && (
            <span
              className="hidden max-w-[420px] truncate rounded-full border border-emerald-200/35 bg-emerald-50/12 px-3 py-1 text-[11px] font-semibold text-emerald-50 lg:inline-flex"
              data-testid="observatory-scenario-pill"
            >
              {scenario.sistema} · {scenario.valorFinanciado} ·{" "}
              {scenario.prazoMeses} meses · {scenario.taxaMensal}/mês
            </span>
          )}
          <span
            className="rounded-full border border-amber-100/45 bg-amber-100/18 px-3 py-1 text-[11px] font-bold text-amber-50"
            data-testid={
              scenario?.valid === true
                ? "observatory-status-valid"
                : "observatory-status-waiting"
            }
          >
            {scenario?.valid === true
              ? "Simulação válida"
              : "DADOS DEMONSTRATIVOS"}
          </span>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
