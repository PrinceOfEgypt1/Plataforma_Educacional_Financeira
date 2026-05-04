/**
 * `<Sidebar />`
 *
 * Navegação principal da shell. Agrupa os 12 módulos por `group.label` e
 * delega o render de cada entrada ao `NavItem`. Marca a rota corrente via
 * `usePathname()` do Next App Router.
 *
 * Acessibilidade:
 *   - `role="navigation"` implícito pelo `<nav>` + `aria-label="Módulos"`;
 *   - cada grupo é um `<section>` com `<h2>` visualmente discreto porém
 *     nomeável por leitores de tela.
 */
"use client";

import { usePathname } from "next/navigation";

import { NavItem } from "./NavItem";
import { MODULES, groupModules } from "@/config/modules";

export interface SidebarProps {
  readonly pathname?: string;
}

export function Sidebar({ pathname }: SidebarProps) {
  const realPath = usePathname();
  const current = pathname ?? realPath ?? "/";
  const grouped = groupModules(MODULES);

  return (
    <nav
      aria-label="Módulos"
      data-testid="sidebar"
      className="h-full w-full shrink-0 overflow-y-auto
                 border-r border-slate-200 bg-white px-3 py-5 shadow-sm"
    >
      <div className="mb-5 rounded-2xl bg-[var(--color-brand-soft)] px-3 py-4">
        <span
          className="text-[11px] font-semibold uppercase tracking-wider
                     text-[var(--color-brand-secondary)]"
        >
          Plataforma
        </span>
        <h2 className="mt-1 text-sm font-bold leading-5 text-slate-900">
          Plataforma Educacional Financeira
        </h2>
        <p className="mt-2 text-xs leading-5 text-slate-600">
          Simule, compare e aprenda com contexto.
        </p>
      </div>

      {grouped.map(({ group, items }) => (
        <section
          key={group.id}
          aria-labelledby={`nav-group-${group.id}`}
          className="mb-4"
        >
          <h3
            id={`nav-group-${group.id}`}
            className="px-3 pb-1 text-[11px] font-semibold uppercase
                       tracking-wider text-slate-500"
          >
            {group.label}
          </h3>
          <ul className="space-y-0.5" role="list">
            {items.map((m) => (
              <NavItem key={m.id} module={m} currentPathname={current} />
            ))}
          </ul>
        </section>
      ))}
    </nav>
  );
}
