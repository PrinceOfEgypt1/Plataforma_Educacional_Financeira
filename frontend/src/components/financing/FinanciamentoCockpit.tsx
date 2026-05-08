"use client";

import { useCallback, useState, type FormEvent } from "react";

import { AlertBanner } from "@/components/ui/AlertBanner";
import { CockpitGrid } from "@/components/ui/cockpit";
import { describeApiError } from "@/lib/api/problem";
import {
  simularFinanciamentoImobiliario,
  type FinanciamentoApiError,
} from "@/services/financing/financiamentoService";
import type { FinanciamentoImobOut } from "@/types/financing";

import { FinanciamentoForm } from "./FinanciamentoForm";
import { FinanciamentoSaibaMais } from "./FinanciamentoSaibaMais";
import { FinanciamentoSummary } from "./FinanciamentoSummary";
import { FinanciamentoTable } from "./FinanciamentoTable";
import {
  validateFinanciamentoDraft,
  type FinanciamentoDraft,
  type FinanciamentoFieldErrors,
} from "./formValidation";

const INITIAL_DRAFT: FinanciamentoDraft = {
  valorImovel: "",
  valorEntrada: "",
  prazoMeses: "",
  taxaJurosMensalPercentual: "",
  sistemaAmortizacao: "PRICE",
  seguroMensal: "",
  tarifaMensal: "",
};

type AsyncResult =
  | { readonly status: "idle" }
  | { readonly status: "loading" }
  | { readonly status: "ok"; readonly result: FinanciamentoImobOut }
  | { readonly status: "error"; readonly error: FinanciamentoApiError };

export function FinanciamentoCockpit() {
  const [draft, setDraft] = useState<FinanciamentoDraft>(INITIAL_DRAFT);
  const [fieldErrors, setFieldErrors] = useState<FinanciamentoFieldErrors>({});
  const [state, setState] = useState<AsyncResult>({ status: "idle" });

  const handleChange = useCallback(
    (field: keyof FinanciamentoDraft, value: string) => {
      setDraft((prev) => ({ ...prev, [field]: value }));
      setFieldErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    [],
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const validation = validateFinanciamentoDraft(draft);
      if (!validation.ok) {
        setFieldErrors(validation.errors);
        return;
      }
      setState({ status: "loading" });
      try {
        const result = await simularFinanciamentoImobiliario(validation.value!);
        setState({ status: "ok", result });
      } catch (error) {
        setState({ status: "error", error: error as FinanciamentoApiError });
      }
    },
    [draft],
  );

  const busy = state.status === "loading";

  return (
    <div data-testid="financiamento-cockpit">
      <CockpitGrid>
        <FinanciamentoForm
          draft={draft}
          errors={fieldErrors}
          busy={busy}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />

        <section
          className="cockpit-panel-center flex flex-col gap-4"
          data-testid="financiamento-result-panel"
          aria-live="polite"
          aria-busy={busy}
        >
          {state.status === "idle" && (
            <div
              className="flex flex-col gap-3"
              data-testid="financiamento-idle-state"
            >
              <div className="cockpit-insight-bar">
                <span aria-hidden="true">🏠</span>
                <span>
                  Preencha os dados ao lado e clique em{" "}
                  <strong>Simular financiamento</strong> para ver as parcelas e
                  o custo total.
                </span>
              </div>
              <FinanciamentoSaibaMais />
            </div>
          )}

          {state.status === "loading" && (
            <div
              className="cockpit-insight-bar"
              data-testid="financiamento-loading-state"
            >
              <span aria-hidden="true">⏳</span>
              <span>Simulando seu financiamento...</span>
            </div>
          )}

          {state.status === "error" && (
            <div data-testid="financiamento-error-state">
              <AlertBanner level="error" title="Erro na simulação">
                {describeApiError(state.error)}
              </AlertBanner>
            </div>
          )}

          {state.status === "ok" && (
            <div
              className="flex flex-col gap-6"
              data-testid="financiamento-ok-state"
            >
              <FinanciamentoSummary summary={state.result.summary} />
              <FinanciamentoTable parcelas={state.result.parcelas} />
              <FinanciamentoSaibaMais initialTab="nivel-2" />
            </div>
          )}
        </section>
      </CockpitGrid>
    </div>
  );
}
