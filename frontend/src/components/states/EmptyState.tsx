/**
 * `<EmptyState />` — estado vazio reutilizável.
 *
 * Usado quando uma tela poderia mostrar uma lista de resultados mas ainda
 * não há dados — seja pela natureza do módulo (em construção nesta Sprint),
 * seja porque o usuário ainda não preencheu a entrada mínima.
 */
import type { ReactNode } from "react";

export interface EmptyStateProps {
  readonly title?: string;
  readonly description?: string;
  readonly action?: ReactNode;
  /** Ícone textual decorativo (padrão: "∅"). */
  readonly icon?: ReactNode;
}

export function EmptyState({
  title = "Sem dados para exibir",
  description = "Preencha as entradas acima ou aguarde novas simulações.",
  action,
  icon = "∅",
}: EmptyStateProps) {
  return (
    <div
      data-testid="empty-state"
      role="status"
      className="flex flex-col items-center justify-center gap-3 py-12 text-center"
    >
      <div
        aria-hidden="true"
        className="flex h-10 w-10 items-center justify-center rounded-full
                   bg-slate-100 text-slate-500"
      >
        {icon}
      </div>
      <h2 className="text-base font-semibold text-slate-800">{title}</h2>
      {description && (
        <p className="max-w-md text-sm text-slate-500">{description}</p>
      )}
      {action}
    </div>
  );
}
