"use client";

/**
 * Formulário de simulação — juros simples.
 *
 * Controlled component. Não dispara efeitos colaterais — apenas chama
 * `onSubmit(payload)` quando a validação local passa.
 */

import { useId, useState, type FormEvent } from "react";

import { FormSection } from "@/components/ui/FormSection";
import type { JurosSimplesIn } from "@/types/interest";

import { SubmitBar, TextField } from "./formPrimitives";
import {
  validateInterestDraft,
  type FieldErrors,
  type InterestFormDraft,
} from "./formValidation";

export interface JurosSimplesFormProps {
  readonly onSubmit: (payload: JurosSimplesIn) => void | Promise<void>;
  readonly busy?: boolean;
  readonly defaultDraft?: InterestFormDraft;
}

const EMPTY_DRAFT: InterestFormDraft = {
  principal: "",
  taxaMensalPct: "",
  prazoMeses: "",
};

export function JurosSimplesForm({
  onSubmit,
  busy = false,
  defaultDraft = EMPTY_DRAFT,
}: JurosSimplesFormProps) {
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
    const payload: JurosSimplesIn = {
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
      aria-label="Simulação de juros simples"
      data-testid="juros-simples-form"
    >
      <FormSection
        title="Juros simples"
        description="Informe principal, taxa mensal e prazo. O cálculo é feito no servidor."
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
            hint="Valor presente (PV)."
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
            hint="Ex.: 1,00 = 1% a.m."
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
            hint="Entre 1 e 1200."
            error={errors.prazoMeses ?? null}
            disabled={busy}
          />
        </div>
        <SubmitBar
          label="Calcular juros simples"
          busy={busy}
          onReset={reset}
          hint="Envio autenticado com Content-Type: application/json."
        />
      </FormSection>
    </form>
  );
}
