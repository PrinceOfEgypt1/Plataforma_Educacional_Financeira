/**
 * `<Header />`
 *
 * Barra superior da shell. Renderiza o título da plataforma e um breadcrumb
 * minimal derivado do pathname corrente (via `usePathname`), casando com o
 * módulo através de `findModuleByPathname`.
 *
 * Intencionalmente simples nesta Sprint — não há menu de usuário, tema ou
 * notificações. A estrutura é suficiente para evoluir sem rewrite.
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
      className="flex h-14 items-center justify-between
                 border-b border-slate-200 bg-white px-6"
    >
      <div className="flex min-w-0 items-center gap-2 text-sm">
        <span className="font-semibold text-slate-700">Plataforma</span>
        <span aria-hidden="true" className="text-slate-300">
          /
        </span>
        <span
          data-testid="breadcrumb-current"
          className="truncate font-medium text-slate-500"
          style={{ color: "var(--color-brand-primary)" }}
        >
          {mod ? mod.title : "Início"}
        </span>
      </div>
      <div className="text-xs text-slate-400" aria-hidden="true">
        v1 · educacional
      </div>
    </header>
  );
}
