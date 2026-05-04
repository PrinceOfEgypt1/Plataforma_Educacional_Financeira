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

import Link from "next/link";
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
      <nav
        aria-label="Localização"
        className="flex min-w-0 items-center gap-2 text-sm"
      >
        {mod ? (
          <>
            <Link
              href="/"
              className="font-semibold text-slate-600 transition-colors
                         hover:text-[var(--color-brand-primary)]
                         focus:outline-none focus-visible:ring-2
                         focus-visible:ring-[var(--color-focus)]
                         focus-visible:ring-offset-2"
            >
              Início
            </Link>
            <span aria-hidden="true" className="text-slate-300">
              /
            </span>
          </>
        ) : null}
        <span
          data-testid="breadcrumb-current"
          className="truncate font-semibold text-[var(--color-brand-primary)]"
          style={{ color: "var(--color-brand-primary)" }}
        >
          {mod ? mod.shortTitle : "Início"}
        </span>
      </nav>
      <div
        className="hidden rounded-full border border-emerald-200 bg-emerald-50
                   px-3 py-1 text-xs font-semibold text-emerald-700 sm:block"
      >
        Produto educacional
      </div>
    </header>
  );
}
