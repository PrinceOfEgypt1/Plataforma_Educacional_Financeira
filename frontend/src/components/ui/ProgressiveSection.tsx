import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface ProgressiveSectionProps {
  readonly title: string;
  readonly description?: string;
  readonly children: ReactNode;
  readonly defaultOpen?: boolean;
  readonly headingLevel?: 2 | 3;
  readonly className?: string;
  readonly contentClassName?: string;
  readonly testId?: string;
}

export function ProgressiveSection({
  title,
  description,
  children,
  defaultOpen = false,
  headingLevel = 3,
  className,
  contentClassName,
  testId,
}: ProgressiveSectionProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <details
      className={cn(
        "group rounded-2xl border border-slate-200 bg-white shadow-sm",
        className,
      )}
      data-testid={testId}
      {...(defaultOpen ? { open: true } : {})}
    >
      <summary
        className="flex cursor-pointer list-none items-center justify-between
                   gap-4 px-4 py-4 text-left focus:outline-none
                   focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]
                   focus-visible:ring-offset-2 sm:px-5"
      >
        <span className="min-w-0">
          <Heading className="text-sm font-semibold text-slate-900">
            {title}
          </Heading>
          {description ? (
            <span className="mt-1 block text-xs leading-5 text-slate-500">
              {description}
            </span>
          ) : null}
        </span>
        <span
          aria-hidden="true"
          className="shrink-0 rounded-full border border-slate-200 px-2.5 py-1
                     text-xs font-semibold text-slate-500 transition-colors
                     group-open:border-[var(--color-brand-secondary)]
                     group-open:text-[var(--color-brand-primary)]"
        >
          <span className="group-open:hidden">Abrir</span>
          <span className="hidden group-open:inline">Fechar</span>
        </span>
      </summary>
      <div
        className={cn(
          "border-t border-slate-100 px-4 pb-4 pt-3 sm:px-5",
          contentClassName,
        )}
      >
        {children}
      </div>
    </details>
  );
}
