/**
 * `<ErrorState />` — estado de erro reutilizável.
 *
 * Desenhado para renderizar mensagens amigáveis diante de falhas de rede,
 * erros do backend (Problem RFC 7807) ou validações client-side.
 * O botão de `action` é opcional, permitindo tanto recuperação ("Tentar
 * novamente") quanto diagnóstico ("Ver detalhes").
 */
import type { ReactNode } from "react";

export interface ErrorStateProps {
  readonly title?: string;
  readonly description?: string;
  readonly action?: ReactNode;
  /** Texto opcional exibido em tom de diagnóstico (menor, monoespaçado). */
  readonly diagnostics?: string;
}

export function ErrorState({
  title = "Algo deu errado",
  description = "Não foi possível carregar este conteúdo agora.",
  action,
  diagnostics,
}: ErrorStateProps) {
  return (
    <div
      data-testid="error-state"
      role="alert"
      className="flex flex-col items-center justify-center gap-3 py-12 text-center"
    >
      <div
        aria-hidden="true"
        className="flex h-10 w-10 items-center justify-center rounded-full
                   bg-red-50 text-red-600"
        style={{ color: "var(--color-financial-negative)" }}
      >
        !
      </div>
      <h2 className="text-base font-semibold text-slate-800">{title}</h2>
      {description && (
        <p className="max-w-md text-sm text-slate-500">{description}</p>
      )}
      {diagnostics && (
        <pre
          data-testid="error-diagnostics"
          className="max-w-md overflow-x-auto rounded-md bg-slate-50 p-2
                     text-[11px] text-slate-600"
        >
          {diagnostics}
        </pre>
      )}
      {action}
    </div>
  );
}
