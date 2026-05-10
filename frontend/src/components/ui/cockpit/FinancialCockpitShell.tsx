"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { getCockpitVisibleModules } from "@/config/modules";

const MODULE_ICONS: Record<string, string> = {
  diagnostico: "🩺",
  juros: "⚡",
  amortizacao: "📊",
  "financiamento-imobiliario": "🏠",
  "financiamento-veiculo": "🚗",
  consignado: "💼",
  cdc: "💳",
  "cartao-rotativo": "💳",
  atraso: "⏰",
  indicadores: "📈",
  "investir-vs-quitar": "⚖️",
  educacao: "📚",
};

export interface FinancialCockpitShellProps {
  readonly children: ReactNode;
  readonly pathname?: string;
}

export function FinancialCockpitShell({
  children,
  pathname,
}: FinancialCockpitShellProps) {
  const currentPath = usePathname();
  const current = pathname ?? currentPath ?? "/";

  const visibleModules = getCockpitVisibleModules();

  return (
    <div className="cockpit-app" data-testid="financial-cockpit-shell">
      <div aria-hidden="true" className="cockpit-glow cockpit-glow-teal" />
      <div aria-hidden="true" className="cockpit-glow cockpit-glow-amber" />
      <header className="cockpit-topbar" role="banner">
        <Link href="/" className="cockpit-logo" aria-label="Início">
          PEF <span>/ Lab</span>
        </Link>
        <nav className="cockpit-module-tabs" aria-label="Módulos">
          {visibleModules.map((module) => {
            const active =
              current === module.href || current.startsWith(`${module.href}/`);
            const statusLabel =
              module.status === "disponivel" ? "ATIVO" : "EM BREVE";
            return (
              <Link
                key={module.id}
                href={module.href as Route}
                className={cn("cockpit-module-tab", active && "active")}
                aria-current={active ? "page" : undefined}
                data-testid={`cockpit-module-${module.id}`}
                data-status={module.status}
              >
                <span aria-hidden="true">{MODULE_ICONS[module.id] ?? "◆"}</span>
                <span>{module.shortTitle}</span>
                <span className="cockpit-badge">{statusLabel}</span>
              </Link>
            );
          })}
        </nav>
        <div className="cockpit-pill-warn">⚠ Produto educacional</div>
      </header>
      <main
        id="main-content"
        role="main"
        aria-label="Conteúdo principal"
        className="cockpit-main"
      >
        {children}
      </main>
    </div>
  );
}
