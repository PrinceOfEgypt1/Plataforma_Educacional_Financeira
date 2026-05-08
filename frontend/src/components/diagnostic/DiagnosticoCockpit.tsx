"use client";

import { useCallback, useState, type FormEvent } from "react";

import { AlertBanner } from "@/components/ui/AlertBanner";
import { CockpitGrid } from "@/components/ui/cockpit";
import { describeApiError } from "@/lib/api/problem";
import {
  analisarDiagnostico,
  type DiagnosticoApiError,
} from "@/services/diagnostic/diagnosticoService";
import type { DiagnosticAnalyzeResponseData } from "@/types/diagnostic";

import { DiagnosticoAlerts } from "./DiagnosticoAlerts";
import { DiagnosticoForm } from "./DiagnosticoForm";
import { DiagnosticoInterpretation } from "./DiagnosticoInterpretation";
import { DiagnosticoSaibaMais } from "./DiagnosticoSaibaMais";
import { DiagnosticoSummary } from "./DiagnosticoSummary";
import {
  validateDiagnosticoDraft,
  type DiagnosticoFieldErrors,
  type DiagnosticoFormDraft,
} from "./formValidation";

const INITIAL_DRAFT: DiagnosticoFormDraft = {
  rendaMensal: "",
  despesasFixas: "",
  despesasVariaveis: "",
  dividasMensais: "",
  reservaAtual: "",
};

type AsyncResult =
  | { readonly status: "idle" }
  | { readonly status: "loading" }
  | { readonly status: "ok"; readonly result: DiagnosticAnalyzeResponseData }
  | { readonly status: "error"; readonly error: DiagnosticoApiError };

export function DiagnosticoCockpit() {
  const [draft, setDraft] = useState<DiagnosticoFormDraft>(INITIAL_DRAFT);
  const [fieldErrors, setFieldErrors] = useState<DiagnosticoFieldErrors>({});
  const [state, setState] = useState<AsyncResult>({ status: "idle" });

  const handleChange = useCallback(
    (field: keyof DiagnosticoFormDraft, value: string) => {
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
      const validation = validateDiagnosticoDraft(draft);
      if (!validation.ok) {
        setFieldErrors(validation.errors);
        return;
      }
      setState({ status: "loading" });
      try {
        const result = await analisarDiagnostico(validation.value!);
        setState({ status: "ok", result });
      } catch (error) {
        setState({ status: "error", error: error as DiagnosticoApiError });
      }
    },
    [draft],
  );

  const busy = state.status === "loading";

  return (
    <div data-testid="diagnostico-cockpit">
      <CockpitGrid>
        <DiagnosticoForm
          draft={draft}
          errors={fieldErrors}
          busy={busy}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />

        <section
          className="cockpit-panel-center flex flex-col gap-4"
          data-testid="diagnostico-result-panel"
          aria-live="polite"
          aria-busy={busy}
        >
          {state.status === "idle" && (
            <div
              className="flex flex-col gap-3"
              data-testid="diagnostico-idle-state"
            >
              <div className="cockpit-insight-bar">
                <span aria-hidden="true">🩺</span>
                <span>
                  Preencha os dados ao lado e clique em{" "}
                  <strong>Analisar situação</strong> para ver seu diagnóstico
                  financeiro.
                </span>
              </div>
              <DiagnosticoSaibaMais />
            </div>
          )}

          {state.status === "loading" && (
            <div
              className="cockpit-insight-bar"
              data-testid="diagnostico-loading-state"
            >
              <span aria-hidden="true">⏳</span>
              <span>Analisando sua situação financeira...</span>
            </div>
          )}

          {state.status === "error" && (
            <div data-testid="diagnostico-error-state">
              <AlertBanner level="error" title="Erro ao analisar">
                {describeApiError(state.error)}
              </AlertBanner>
            </div>
          )}

          {state.status === "ok" && (
            <div
              className="flex flex-col gap-4"
              data-testid="diagnostico-ok-state"
            >
              <DiagnosticoSummary data={state.result} />
              <DiagnosticoAlerts alerts={state.result.alertas} />
              <DiagnosticoInterpretation data={state.result} />
              <DiagnosticoSaibaMais initialTab="nivel-1" />
            </div>
          )}
        </section>
      </CockpitGrid>
    </div>
  );
}
