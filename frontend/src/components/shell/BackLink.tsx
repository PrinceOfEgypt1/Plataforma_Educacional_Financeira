import Link from "next/link";

import { cn } from "@/lib/cn";

export interface BackLinkProps {
  readonly className?: string;
}

export function BackLink({ className }: BackLinkProps) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-slate-200",
        "bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 shadow-sm",
        "transition-colors hover:border-[var(--color-brand-secondary)]",
        "hover:text-[var(--color-brand-primary)] focus:outline-none",
        "focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]",
        "focus-visible:ring-offset-2",
        className,
      )}
      aria-label="Voltar para o dashboard inicial"
      data-testid="back-link"
    >
      <span aria-hidden="true">←</span>
      <span>Voltar</span>
    </Link>
  );
}
