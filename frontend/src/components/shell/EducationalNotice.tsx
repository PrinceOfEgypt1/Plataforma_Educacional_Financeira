/**
 * `<EducationalNotice />`
 *
 * Banner educacional persistente — obrigatório pelo Doc 18 (conformidade
 * regulatória) e presente em todas as telas desde a Sprint 0. A Fatia 2 da
 * Sprint 1 extrai o banner do `RootLayout` para um componente próprio, a fim
 * de torná-lo testável isoladamente e reusável por eventuais layouts não-shell
 * (`/login`, `/embed`) no futuro.
 *
 * Acessibilidade:
 *   - `role="note"` e `aria-label` descritivo;
 *   - contraste mínimo 4.5:1 (brand-secondary sobre branco) — validado em
 *     `tokens.test.ts` / `INVENTARIO_TELAS.md`.
 */
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface EducationalNoticeProps {
  readonly children?: ReactNode;
  readonly className?: string;
}

const DEFAULT_MESSAGE =
  "Produto exclusivamente educacional — não constitui consultoria " +
  "financeira nem proposta vinculante de crédito.";

export function EducationalNotice({
  children,
  className,
}: EducationalNoticeProps) {
  return (
    <div
      className={cn("educational-notice", className)}
      role="note"
      aria-label="Aviso importante sobre o produto"
      data-testid="educational-notice"
    >
      {children ?? (
        <>
          <span aria-hidden="true">⚠️ </span>
          {DEFAULT_MESSAGE}
        </>
      )}
    </div>
  );
}
