/**
 * `<NavItem />`
 *
 * Item atômico da sidebar. Recebe um `ModuleEntry` e o pathname corrente para
 * decidir se deve renderizar-se como "ativo". O ativo é indicado por
 * `aria-current="page"` (acessibilidade) e por classes visuais derivadas dos
 * tokens (`brand-primary` / `neutral-*`).
 */
import Link from "next/link";

import { cn } from "@/lib/cn";
import type { ModuleEntry } from "@/config/modules";

export interface NavItemProps {
  readonly module: ModuleEntry;
  readonly currentPathname: string;
}

export function NavItem({ module, currentPathname }: NavItemProps) {
  const isActive =
    currentPathname === module.href ||
    currentPathname.startsWith(`${module.href}/`);

  return (
    <li>
      <Link
        href={module.href}
        aria-current={isActive ? "page" : undefined}
        data-active={isActive ? "true" : "false"}
        className={cn(
          "group flex items-center justify-between",
          "rounded-xl px-3 py-2 text-sm font-semibold transition-colors",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          isActive
            ? "bg-[var(--color-brand-soft)] text-[var(--color-brand-primary)]"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
        )}
      >
        <span className="truncate">{module.shortTitle}</span>
        {module.status === "em-construcao" && (
          <span
            className="ml-2 inline-block rounded-full bg-amber-50 px-1.5 py-0.5
                       text-[10px] uppercase tracking-wide text-amber-700
                       ring-1 ring-amber-200"
            aria-label="Módulo em construção"
          >
            em breve
          </span>
        )}
        {module.status === "disponivel" && (
          <span
            className="ml-2 inline-block rounded-full bg-emerald-50 px-1.5 py-0.5
                       text-[10px] uppercase tracking-wide text-emerald-700
                       ring-1 ring-emerald-200"
            aria-label="Módulo disponível"
          >
            ativo
          </span>
        )}
      </Link>
    </li>
  );
}
