"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

interface CockpitModule {
  readonly id: string;
  readonly href: Route;
  readonly icon: string;
  readonly label: string;
  readonly status: "ATIVO" | "EM BREVE";
  readonly match: ReadonlyArray<string>;
}

const COCKPIT_MODULES: readonly CockpitModule[] = [
  {
    id: "juros",
    href: "/juros",
    icon: "⚡",
    label: "Juros",
    status: "ATIVO",
    match: ["/juros"],
  },
  {
    id: "amortizacao",
    href: "/amortizacao",
    icon: "📊",
    label: "Amortização",
    status: "ATIVO",
    match: ["/amortizacao"],
  },
  {
    id: "imovel",
    href: "/financiamento-imobiliario",
    icon: "🏠",
    label: "Imóvel",
    status: "EM BREVE",
    match: ["/financiamento-imobiliario"],
  },
  {
    id: "consignado",
    href: "/consignado",
    icon: "💼",
    label: "Consignado",
    status: "EM BREVE",
    match: ["/consignado"],
  },
  {
    id: "cdc",
    href: "/cdc",
    icon: "🚗",
    label: "CDC",
    status: "EM BREVE",
    match: ["/cdc", "/financiamento-veiculo"],
  },
  {
    id: "cartao",
    href: "/cartao-rotativo",
    icon: "💳",
    label: "Cartão",
    status: "EM BREVE",
    match: ["/cartao-rotativo"],
  },
  {
    id: "investir",
    href: "/investir-vs-quitar",
    icon: "⚖️",
    label: "Investir × Quitar",
    status: "EM BREVE",
    match: ["/investir-vs-quitar"],
  },
];

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

  return (
    <div className="cockpit-app" data-testid="financial-cockpit-shell">
      <div aria-hidden="true" className="cockpit-glow cockpit-glow-teal" />
      <div aria-hidden="true" className="cockpit-glow cockpit-glow-amber" />
      <header className="cockpit-topbar" role="banner">
        <Link href="/" className="cockpit-logo" aria-label="Início">
          PEF <span>/ Lab</span>
        </Link>
        <nav className="cockpit-module-tabs" aria-label="Módulos">
          {COCKPIT_MODULES.map((module) => {
            const active = module.match.some(
              (path) => current === path || current.startsWith(`${path}/`),
            );
            return (
              <Link
                key={module.id}
                href={module.href}
                className={cn("cockpit-module-tab", active && "active")}
                aria-current={active ? "page" : undefined}
                data-testid={`cockpit-module-${module.id}`}
              >
                <span aria-hidden="true">{module.icon}</span>
                <span>{module.label}</span>
                <span className="cockpit-badge">{module.status}</span>
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
