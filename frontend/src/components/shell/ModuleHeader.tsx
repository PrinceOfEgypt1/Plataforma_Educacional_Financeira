import { BackLink } from "./BackLink";
import { cn } from "@/lib/cn";
import type { ModuleEntry } from "@/config/modules";

export interface ModuleHeaderProps {
  readonly module: ModuleEntry;
  readonly eyebrow?: string;
  readonly description?: string;
  readonly showBackLink?: boolean;
  readonly className?: string;
}

const STATUS_COPY: Record<ModuleEntry["status"], string> = {
  disponivel: "Disponível",
  "em-construcao": "Em breve",
};

const STATUS_CLASS: Record<ModuleEntry["status"], string> = {
  disponivel: "border-emerald-200 bg-emerald-50 text-emerald-700",
  "em-construcao": "border-amber-200 bg-amber-50 text-amber-700",
};

export function ModuleHeader({
  module,
  eyebrow,
  description,
  showBackLink = true,
  className,
}: ModuleHeaderProps) {
  return (
    <header
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm",
        "sm:p-6",
        className,
      )}
      data-testid="module-header"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="rounded-full bg-[var(--color-learning-soft)] px-2.5 py-1
                       text-[11px] font-semibold uppercase tracking-wider
                       text-[var(--color-learning)]"
          >
            {eyebrow ?? module.group.label}
          </span>
          <span
            className={cn(
              "rounded-full border px-2.5 py-1 text-[11px] font-semibold",
              "uppercase tracking-wider",
              STATUS_CLASS[module.status],
            )}
            data-testid="module-status"
          >
            {STATUS_COPY[module.status]}
          </span>
        </div>
        {showBackLink ? <BackLink /> : null}
      </div>

      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          {module.title}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
          {description ?? module.description}
        </p>
      </div>
    </header>
  );
}
