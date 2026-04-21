/**
 * `<FormSection />`
 *
 * Envelope semântico para agrupar controles de formulário sob um mesmo rótulo.
 * Implementado sobre `<fieldset>`/`<legend>` para preservar a estrutura
 * acessível nativa; aceita um `description` opcional para contextualizar o
 * grupo de campos.
 */
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface FormSectionProps {
  readonly title: string;
  readonly description?: string;
  readonly children: ReactNode;
  readonly className?: string;
}

export function FormSection({
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <fieldset
      data-testid="form-section"
      className={cn(
        "rounded-lg border border-slate-200 bg-white p-4",
        className,
      )}
    >
      <legend className="px-2 text-sm font-semibold text-slate-700">
        {title}
      </legend>
      {description && (
        <p className="mb-3 text-xs text-slate-500">{description}</p>
      )}
      <div className="flex flex-col gap-3">{children}</div>
    </fieldset>
  );
}
