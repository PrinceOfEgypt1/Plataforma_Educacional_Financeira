"use client";

import type { FormEvent } from "react";

import {
  CockpitButton,
  CockpitField,
  CockpitInputPanel,
} from "@/components/ui/cockpit";

import type {
  DiagnosticoFieldErrors,
  DiagnosticoFormDraft,
} from "./formValidation";

export interface DiagnosticoFormProps {
  readonly draft: DiagnosticoFormDraft;
  readonly errors: DiagnosticoFieldErrors;
  readonly busy: boolean;
  readonly onChange: (field: keyof DiagnosticoFormDraft, value: string) => void;
  readonly onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function DiagnosticoForm({
  draft,
  errors,
  busy,
  onChange,
  onSubmit,
}: DiagnosticoFormProps) {
  return (
    <CockpitInputPanel
      icon="🩺"
      title="Diagnóstico Financeiro"
      subtitle="Informe seus dados mensais"
    >
      <form
        onSubmit={onSubmit}
        noValidate
        data-testid="diagnostico-form"
        className="flex flex-col gap-1"
      >
        <CockpitField
          id="rendaMensal"
          label="Renda mensal (R$)"
          value={draft.rendaMensal}
          onChange={(v) => onChange("rendaMensal", v)}
          hint="Soma de todos os rendimentos."
          error={errors.rendaMensal}
          inputMode="decimal"
        />
        <CockpitField
          id="despesasFixas"
          label="Despesas fixas (R$)"
          value={draft.despesasFixas}
          onChange={(v) => onChange("despesasFixas", v)}
          hint="Aluguel, planos, mensalidades."
          error={errors.despesasFixas}
          inputMode="decimal"
        />
        <CockpitField
          id="despesasVariaveis"
          label="Despesas variáveis (R$)"
          value={draft.despesasVariaveis}
          onChange={(v) => onChange("despesasVariaveis", v)}
          hint="Mercado, lazer, transporte."
          error={errors.despesasVariaveis}
          inputMode="decimal"
        />
        <CockpitField
          id="dividasMensais"
          label="Dívidas mensais (R$)"
          value={draft.dividasMensais}
          onChange={(v) => onChange("dividasMensais", v)}
          hint="Parcelas de empréstimos e cartão."
          error={errors.dividasMensais}
          inputMode="decimal"
        />
        <CockpitField
          id="reservaAtual"
          label="Reserva atual (R$)"
          value={draft.reservaAtual}
          onChange={(v) => onChange("reservaAtual", v)}
          hint="Valor disponível em emergências."
          error={errors.reservaAtual}
          inputMode="decimal"
        />
        <CockpitButton busy={busy}>Analisar situação</CockpitButton>
      </form>
    </CockpitInputPanel>
  );
}
