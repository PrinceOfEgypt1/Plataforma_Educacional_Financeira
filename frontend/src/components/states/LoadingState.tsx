/**
 * `<LoadingState />` — estado de carregamento reutilizável.
 *
 * API uniforme com `ErrorState` e `EmptyState` para reduzir superfície
 * cognitiva ao usuário e à revisão de PR.
 */
import type { ReactNode } from "react";

export interface LoadingStateProps {
  readonly title?: string;
  readonly description?: string;
  readonly action?: ReactNode;
  /** Alinha com screen-readers para anunciar o carregamento. */
  readonly srMessage?: string;
}

export function LoadingState({
  title = "Carregando…",
  description = "Estamos preparando os dados desta tela.",
  action,
  srMessage = "Carregando conteúdo",
}: LoadingStateProps) {
  return (
    <div
      data-testid="loading-state"
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="flex flex-col items-center justify-center gap-3 rounded-2xl
                 border border-slate-200 bg-white px-4 py-12 shadow-sm"
    >
      <span
        aria-hidden="true"
        className="h-8 w-8 animate-spin rounded-full border-2
                   border-slate-200 border-t-[var(--color-brand-primary)]"
      />
      <h2 className="text-base font-semibold text-slate-700">{title}</h2>
      {description && (
        <p className="max-w-md text-center text-sm text-slate-500">
          {description}
        </p>
      )}
      {action}
      <span className="sr-only">{srMessage}</span>
    </div>
  );
}
