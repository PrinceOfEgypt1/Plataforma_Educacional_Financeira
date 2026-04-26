"use client";

/**
 * Formulário de simulação — juros compostos.
 * Inclui campo opcional de aporte mensal postecipado.
 */

import { useId, useState, type FormEvent } from "react";

import { FormSection } from "@/components/ui/FormSection";
import type { JurosCompostosIn } from "@/types/interest";

import { SubmitBar, TextField } from "./formPrimitives";
import {
  validateInterestDraft,
  type FieldErrors,
  type InterestFormDraft,
} from "./formValidation";

export interface JurosCompostosFormProps {
  readonly onSubmit: (payload: JurosCompostosIn) => void | Promise<void>;
  readonly busy?: boolean;
  readonly defaultDraft?: InterestFormDraft;
}

const EMPTY_DRAFT: InterestFormDraft = {
  principal: "",
  taxaMensalPct: "",
  prazoMeses: "",
  aporteMensal: "",
};

export function JurosCompostosForm({
  onSubmit,
  busy = false,
  defaultDraft = EMPTY_DRAFT,
}: JurosCompostosFormProps) {
  const base = useId();
  const [draft, setDraft] = useState<InterestFormDraft>(defaultDraft);
  const [errors, setErrors] = useState<FieldErrors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const result = validateInterestDraft(draft, { acceptAporte: true });
    if (!result.ok || result.value === null) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    const payload: JurosCompostosIn = {
      principal: result.value.principal,
      taxa_mensal: result.value.taxa_mensal,
      prazo_meses: result.value.prazo_meses,
      ...(result.value.aporte_mensal !== null &&
      result.value.aporte_mensal !== undefined
        ? { aporte_mensal: result.value.aporte_mensal }
        : {}),
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
      aria-label="Simulação de juros compostos"
      data-testid="juros-compostos-form"
    >
      <FormSection
        title="Juros compostos"
        description="Aporte mensal é opcional. Quando vazio, a simulação é de juros
                     compostos puros (FV = PV × (1 + i)^n)."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          <TextField
            id={`${base}-aporte`}
            label="Aporte mensal (opcional)"
            value={draft.aporteMensal ?? ""}
            onChange={(v) => setDraft((d) => ({ ...d, aporteMensal: v }))}
            placeholder="100,00"
            inputMode="decimal"
            suffix="R$"
            hint="Vazio = sem aporte. Aplicado ao final de cada mês."
            error={errors.aporteMensal ?? null}
            disabled={busy}
          />
        </div>
        <SubmitBar
          label="Calcular juros compostos"
          busy={busy}
          onReset={reset}
        />
      </FormSection>
    </form>
  );
}
