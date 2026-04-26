/**
 * Primitivas de formulário usadas pelos três formulários de juros.
 *
 * São **primitivas**: não conhecem domínio. Cada formulário as compõe
 * com seus próprios rótulos, placeholders e estado.
 */
import type { ChangeEvent, ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface TextFieldProps {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly onChange: (next: string) => void;
  readonly placeholder?: string;
  readonly hint?: ReactNode;
  readonly error?: string | null;
  readonly inputMode?: "decimal" | "numeric" | "text";
  readonly autoComplete?: string;
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly suffix?: string;
}

export function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  hint,
  error,
  inputMode = "text",
  autoComplete,
  required,
  disabled,
  suffix,
}: TextFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-red-600">
            *
          </span>
        ) : null}
      </label>
      <div
        className={cn(
          "flex items-stretch overflow-hidden rounded border bg-white",
          error ? "border-red-500" : "border-slate-300",
          disabled ? "opacity-60" : "",
        )}
      >
        <input
          id={id}
          type="text"
          inputMode={inputMode}
          autoComplete={autoComplete ?? "off"}
          value={value}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
          className="w-full bg-transparent px-3 py-2 text-sm text-slate-900
                     outline-none focus:ring-2 focus:ring-offset-0"
        />
        {suffix ? (
          <span
            aria-hidden="true"
            className="flex items-center border-l border-slate-200
                       bg-slate-50 px-3 text-xs font-medium text-slate-500"
          >
            {suffix}
          </span>
        ) : null}
      </div>
      {hint ? (
        <p id={hintId} className="text-xs text-slate-500">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="text-xs font-medium text-red-600"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

export interface SubmitBarProps {
  readonly label: string;
  readonly busy: boolean;
  readonly disabled?: boolean;
  readonly onReset?: () => void;
  readonly hint?: string;
}

export function SubmitBar({
  label,
  busy,
  disabled,
  onReset,
  hint,
}: SubmitBarProps) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-3">
      <button
        type="submit"
        disabled={busy || disabled}
        aria-busy={busy}
        className="inline-flex items-center justify-center rounded
                   bg-[var(--color-brand-primary)] px-4 py-2 text-sm
                   font-semibold text-white shadow-sm
                   transition-opacity hover:opacity-90
                   focus:outline-none focus-visible:ring-2
                   focus-visible:ring-offset-2
                   disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? "Calculando…" : label}
      </button>
      {onReset ? (
        <button
          type="button"
          onClick={onReset}
          disabled={busy}
          className="text-sm font-medium text-slate-500 hover:text-slate-700
                     disabled:opacity-50"
        >
          Limpar
        </button>
      ) : null}
      {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
    </div>
  );
}
