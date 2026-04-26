"use client";

/**
 * Formulário — comparação simples × compostos.
 *
 * Não aceita aporte (pretenção didática: mesma carga de entrada).
 */

import { useId, useState, type FormEvent } from "react";

import { FormSection } from "@/components/ui/FormSection";
import type { CompararJurosIn } from "@/types/interest";

import { SubmitBar, TextField } from "./formPrimitives";
import {
  validateInterestDraft,
  type FieldErrors,
  type InterestFormDraft,
} from "./formValidation";

export interface CompararJurosFormProps {
  readonly onSubmit: (payload: CompararJurosIn) => void | Promise<void>;
  readonly busy?: boolean;
  readonly defaultDraft?: InterestFormDraft;
}

const EMPTY_DRAFT: InterestFormDraft = {
  principal: "",
  taxaMensalPct: "",
  prazoMeses: "",
};

export function CompararJurosForm({
  onSubmit,
  busy = false,
  defaultDraft = EMPTY_DRAFT,
}: CompararJurosFormProps) {
  const base = useId();
  const [draft, setDraft] = useState<InterestFormDraft>(defaultDraft);
  const [errors, setErrors] = useState<FieldErrors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const result = validateInterestDraft(draft, { acceptAporte: false });
    if (!result.ok || result.value === null) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    const payload: CompararJurosIn = {
      principal: result.value.principal,
      taxa_mensal: result.value.taxa_mensal,
      prazo_meses: result.value.prazo_meses,
    };
    void onSubmit(payload);
  }

  function reset(): void {
    setDraft(EMPTY_DRAFT);
    setErrors({});
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Comparação juros simples × compostos"
      data-testid="comparar-juros-form"
    >
      <FormSection
        title="Comparar simples × compostos"
        description="Mesma entrada em ambos os regimes. Mostra a diferença
                     numérica e pedagógica."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TextField
            id={`${base}-principal`}
            label="Principal (BRL)"
            value={draft.principal}
            onChange={(v) => setDraft((d) => ({ ...d, principal: v }))}
            placeholder="1.000,00"
            inputMode="decimal"
            required
            suffix="R$"
            error={errors.principal ?? null}
            disabled={busy}
          />
          <TextField
            id={`${base}-taxa`}
            label="Taxa mensal"
            value={draft.taxaMensalPct}
            onChange={(v) => setDraft((d) => ({ ...d, taxaMensalPct: v }))}
            placeholder="1,00"
            inputMode="decimal"
            required
            suffix="%"
            error={errors.taxaMensalPct ?? null}
            disabled={busy}
          />
          <TextField
            id={`${base}-prazo`}
            label="Prazo (meses)"
            value={draft.prazoMeses}
            onChange={(v) => setDraft((d) => ({ ...d, prazoMeses: v }))}
            placeholder="12"
            inputMode="numeric"
            required
            error={errors.prazoMeses ?? null}
            disabled={busy}
          />
        </div>
        <SubmitBar label="Comparar" busy={busy} onReset={reset} />
      </FormSection>
    </form>
  );
}
