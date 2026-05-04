/**
 * `<Header />`
 *
 * Barra superior da shell. Renderiza o título da plataforma e um breadcrumb
 * minimal derivado do pathname corrente (via `usePathname`), casando com o
 * módulo através de `findModuleByPathname`.
 *
 * A F2 reforça o header como orientação persistente: breadcrumb, status
 * educacional e ponto de leitura claro para a página atual.
 */
"use client";

import { usePathname } from "next/navigation";

import { findModuleByPathname } from "@/config/modules";

export interface HeaderProps {
  readonly pathname?: string;
}

export function Header({ pathname }: HeaderProps) {
  const realPath = usePathname();
  const current = pathname ?? realPath ?? "/";
  const mod = findModuleByPathname(current);

  return (
    <header
      role="banner"
      data-testid="header"
      className="flex min-h-16 items-center justify-between gap-4
                 border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm
                 backdrop-blur sm:px-6 lg:px-8"
    >
      <div className="flex min-w-0 items-center gap-2 text-sm">
        <span className="font-semibold text-slate-700">Dashboard</span>
        <span aria-hidden="true" className="text-slate-300">
          /
        </span>
        <span
          data-testid="breadcrumb-current"
          className="truncate font-semibold text-[var(--color-brand-primary)]"
          style={{ color: "var(--color-brand-primary)" }}
        >
          {mod ? mod.title : "Início"}
        </span>
      </div>
      <div
        className="hidden rounded-full border border-emerald-200 bg-emerald-50
                   px-3 py-1 text-xs font-semibold text-emerald-700 sm:block"
      >
        Produto educacional
      </div>
    </header>
  );
}
