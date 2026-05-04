/**
 * `<EducationPanel />`
 *
 * Painel educativo lateral/inferior que acompanha simulações com explicações
 * didáticas curtas. Usa `role="complementary"` (Doc 18 — requisito de rótulo
 * educativo persistente por tela) para que leitores de tela o reconheçam.
 */
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface EducationPanelProps {
  readonly title: string;
  readonly children: ReactNode;
  readonly className?: string;
}

export function EducationPanel({
  title,
  children,
  className,
}: EducationPanelProps) {
  return (
    <aside
      data-testid="education-panel"
      role="complementary"
      aria-label={`Conteúdo educativo: ${title}`}
      className={cn(
        "rounded-2xl border p-4 text-sm leading-relaxed shadow-sm",
        "border-blue-100 bg-blue-50/60 text-slate-700",
        className,
      )}
    >
      <h3
        className="mb-1 text-sm font-semibold"
        style={{ color: "var(--color-brand-primary)" }}
      >
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </aside>
  );
}
