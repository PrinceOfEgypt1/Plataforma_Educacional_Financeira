"use client";

import { usePathname } from "next/navigation";

import { NavItem } from "./NavItem";
import { MODULES, groupModules } from "@/config/modules";

export interface MobileModuleNavProps {
  readonly pathname?: string;
}

export function MobileModuleNav({ pathname }: MobileModuleNavProps) {
  const realPath = usePathname();
  const current = pathname ?? realPath ?? "/";
  const grouped = groupModules(MODULES);

  return (
    <nav
      aria-label="Menu compacto"
      className="border-b border-slate-200 bg-white px-4 py-3 md:hidden"
      data-testid="mobile-module-nav"
    >
      <details className="group rounded-xl border border-slate-200 bg-slate-50/70">
        <summary
          className="flex cursor-pointer list-none items-center justify-between
                     gap-3 px-4 py-3 text-sm font-semibold text-slate-800
                     focus:outline-none focus-visible:ring-2
                     focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2"
        >
          <span>Módulos da plataforma</span>
          <span
            aria-hidden="true"
            className="text-slate-400 transition-transform group-open:rotate-180"
          >
            ˅
          </span>
        </summary>
        <div className="border-t border-slate-200 px-2 py-3">
          {grouped.map(({ group, items }) => (
            <section
              key={group.id}
              aria-labelledby={`mobile-nav-group-${group.id}`}
              className="mb-3 last:mb-0"
            >
              <h3
                id={`mobile-nav-group-${group.id}`}
                className="px-2 pb-1 text-[11px] font-semibold uppercase
                           tracking-wider text-slate-400"
              >
                {group.label}
              </h3>
              <ul className="space-y-1" role="list">
                {items.map((module) => (
                  <NavItem
                    key={module.id}
                    module={module}
                    currentPathname={current}
                  />
                ))}
              </ul>
            </section>
          ))}
        </div>
      </details>
    </nav>
  );
}
