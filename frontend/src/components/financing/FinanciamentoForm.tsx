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
}

export function FinanciamentoForm({
  draft,
  errors,
  busy,
  onChange,
  onSubmit,
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
          hint={errors.valorImovel ?? "Valor total do imóvel."}
          inputMode="decimal"
        />
        <CockpitField
          id="valorEntrada"
          label="Entrada (R$)"
          value={draft.valorEntrada}
          onChange={(v) => onChange("valorEntrada", v)}
          hint={errors.valorEntrada ?? "Valor que você pagará de entrada."}
          inputMode="decimal"
        />
        <CockpitField
          id="prazoMeses"
          label="Prazo (meses)"
          value={draft.prazoMeses}
          onChange={(v) => onChange("prazoMeses", v)}
          hint={errors.prazoMeses ?? "Ex.: 360 = 30 anos."}
          inputMode="numeric"
        />
        <CockpitField
          id="taxaJurosMensalPercentual"
          label="Taxa de juros mensal (%)"
          value={draft.taxaJurosMensalPercentual}
          onChange={(v) => onChange("taxaJurosMensalPercentual", v)}
          hint={errors.taxaJurosMensalPercentual ?? "Ex.: 0.7 = 0,7% ao mês."}
          inputMode="decimal"
        />

        <div className="flex flex-col gap-1 mt-1">
          <label className="text-sm font-medium text-gray-700">
            Sistema de amortização
          </label>
          <div
            className="flex gap-3"
            data-testid="sistema-amortizacao-selector"
          >
            {(["PRICE", "SAC"] as const).map((s) => (
              <label key={s} className="flex items-center gap-1 cursor-pointer">
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

        <CockpitField
          id="seguroMensal"
          label="Seguro mensal (R$)"
          value={draft.seguroMensal}
          onChange={(v) => onChange("seguroMensal", v)}
          hint={errors.seguroMensal ?? "Seguro habitacional (opcional)."}
          inputMode="decimal"
        />
        <CockpitField
          id="tarifaMensal"
          label="Tarifa mensal (R$)"
          value={draft.tarifaMensal}
          onChange={(v) => onChange("tarifaMensal", v)}
          hint={errors.tarifaMensal ?? "Tarifa administrativa (opcional)."}
          inputMode="decimal"
        />

        <button
          className="cockpit-btn-calc"
          type="submit"
          disabled={busy}
          data-testid="financiamento-submit"
        >
          {busy ? "Simulando…" : "Simular financiamento"}
        </button>
      </form>
    </CockpitInputPanel>
  );
}
