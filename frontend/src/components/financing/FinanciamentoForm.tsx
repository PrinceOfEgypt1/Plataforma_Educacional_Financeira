"use client";

import type { FormEvent } from "react";

import { CockpitField, CockpitInputPanel } from "@/components/ui/cockpit";

import type {
  FinanciamentoDraft,
  FinanciamentoFieldErrors,
} from "./formValidation";

export interface FinanciamentoFormProps {
  readonly draft: FinanciamentoDraft;
  readonly errors: FinanciamentoFieldErrors;
  readonly busy: boolean;
  readonly onChange: (field: keyof FinanciamentoDraft, value: string) => void;
  readonly onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  readonly submitLabel?: string;
  readonly showAmortizacaoSelector?: boolean;
}

export function FinanciamentoForm({
  draft,
  errors,
  busy,
  onChange,
  onSubmit,
  submitLabel = "Simular financiamento",
  showAmortizacaoSelector = true,
}: FinanciamentoFormProps) {
  return (
    <CockpitInputPanel
      icon="🏠"
      title="Financiamento Imobiliário"
      subtitle="Simule as parcelas do seu financiamento"
    >
      <form
        onSubmit={onSubmit}
        noValidate
        data-testid="financiamento-form"
        className="flex flex-col gap-1"
      >
        <CockpitField
          id="valorImovel"
          label="Valor do imóvel (R$)"
          value={draft.valorImovel}
          onChange={(v) => onChange("valorImovel", v)}
          hint="Valor total do imóvel."
          error={errors.valorImovel}
          inputMode="decimal"
        />
        <CockpitField
          id="valorEntrada"
          label="Entrada (R$)"
          value={draft.valorEntrada}
          onChange={(v) => onChange("valorEntrada", v)}
          hint="Valor que você pagará de entrada."
          error={errors.valorEntrada}
          inputMode="decimal"
        />
        <CockpitField
          id="prazoMeses"
          label="Prazo (meses)"
          value={draft.prazoMeses}
          onChange={(v) => onChange("prazoMeses", v)}
          hint="Ex.: 360 = 30 anos."
          error={errors.prazoMeses}
          inputMode="numeric"
        />
        <CockpitField
          id="taxaJurosMensalPercentual"
          label="Taxa de juros mensal (%)"
          value={draft.taxaJurosMensalPercentual}
          onChange={(v) => onChange("taxaJurosMensalPercentual", v)}
          hint="Ex.: 0.7 = 0,7% ao mês."
          error={errors.taxaJurosMensalPercentual}
          inputMode="decimal"
        />

        {showAmortizacaoSelector && (
          <div className="flex flex-col gap-1 mt-1">
            <label className="text-sm font-medium text-gray-700">
              Sistema de amortização
            </label>
            <div
              className="flex gap-3"
              data-testid="sistema-amortizacao-selector"
            >
              {(["PRICE", "SAC"] as const).map((s) => (
                <label
                  key={s}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="sistemaAmortizacao"
                    value={s}
                    checked={draft.sistemaAmortizacao === s}
                    onChange={() => onChange("sistemaAmortizacao", s)}
                    data-testid={`sistema-${s.toLowerCase()}`}
                  />
                  <span className="text-sm">{s}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <CockpitField
          id="seguroMensal"
          label="Seguro mensal (R$)"
          value={draft.seguroMensal}
          onChange={(v) => onChange("seguroMensal", v)}
          hint="Seguro habitacional (opcional)."
          error={errors.seguroMensal}
          inputMode="decimal"
        />
        <CockpitField
          id="tarifaMensal"
          label="Tarifa mensal (R$)"
          value={draft.tarifaMensal}
          onChange={(v) => onChange("tarifaMensal", v)}
          hint="Tarifa administrativa (opcional)."
          error={errors.tarifaMensal}
          inputMode="decimal"
        />

        <button
          className="cockpit-btn-calc"
          type="submit"
          disabled={busy}
          data-testid="financiamento-submit"
        >
          {busy ? "Aguarde…" : submitLabel}
        </button>
      </form>
    </CockpitInputPanel>
  );
}
