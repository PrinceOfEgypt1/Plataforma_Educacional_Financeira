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
          "rounded-md px-3 py-2 text-sm font-medium transition-colors",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          isActive
            ? "bg-slate-100 text-slate-900"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
        )}
        style={isActive ? { color: "var(--color-brand-primary)" } : undefined}
      >
        <span>{module.shortTitle}</span>
        {module.status === "em-construcao" && (
          <span
            className="ml-2 inline-block text-[10px] uppercase tracking-wide
                       px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-600"
            aria-label="Módulo em construção"
          >
            em breve
          </span>
        )}
      </Link>
    </li>
  );
}
