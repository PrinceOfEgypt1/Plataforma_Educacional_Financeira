"use client";

import { useCallback, useState, type FormEvent } from "react";

import { AlertBanner } from "@/components/ui/AlertBanner";
import { CockpitActionButton, CockpitGrid } from "@/components/ui/cockpit";
import { describeApiError } from "@/lib/api/problem";
import {
  compararFinanciamentos,
  simularFinanciamentoImobiliario,
  type FinanciamentoApiError,
} from "@/services/financing/financiamentoService";
import type {
  FinanciamentoImobCompareOut,
  FinanciamentoImobOut,
} from "@/types/financing";

import { FinanciamentoCompareChart } from "./FinanciamentoCompareChart";
import { FinanciamentoCompareSummary } from "./FinanciamentoCompareSummary";
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

type ActiveTab = "simular" | "comparar";

type SimulateResult =
  | { readonly status: "idle" }
  | { readonly status: "loading" }
  | { readonly status: "ok"; readonly result: FinanciamentoImobOut }
  | { readonly status: "error"; readonly error: FinanciamentoApiError };

type CompareResult =
  | { readonly status: "idle" }
  | { readonly status: "loading" }
  | { readonly status: "ok"; readonly result: FinanciamentoImobCompareOut }
  | { readonly status: "error"; readonly error: FinanciamentoApiError };

export function FinanciamentoCockpit() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("simular");
  const [draft, setDraft] = useState<FinanciamentoDraft>(INITIAL_DRAFT);
  const [fieldErrors, setFieldErrors] = useState<FinanciamentoFieldErrors>({});
  const [simState, setSimState] = useState<SimulateResult>({ status: "idle" });
  const [cmpState, setCmpState] = useState<CompareResult>({ status: "idle" });

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

  const handleSimulate = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const validation = validateFinanciamentoDraft(draft);
      if (!validation.ok) {
        setFieldErrors(validation.errors);
        return;
      }
      setSimState({ status: "loading" });
      try {
        const result = await simularFinanciamentoImobiliario(validation.value!);
        setSimState({ status: "ok", result });
      } catch (error) {
        setSimState({ status: "error", error: error as FinanciamentoApiError });
      }
    },
    [draft],
  );

  const handleCompare = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const validation = validateFinanciamentoDraft(draft);
      if (!validation.ok) {
        setFieldErrors(validation.errors);
        return;
      }
      const { value } = validation;
      setCmpState({ status: "loading" });
      try {
        const result = await compararFinanciamentos({
          valor_imovel: value!.valor_imovel,
          valor_entrada: value!.valor_entrada,
          prazo_meses: value!.prazo_meses,
          taxa_juros_mensal_percentual: value!.taxa_juros_mensal_percentual,
          ...(value!.seguro_mensal !== undefined
            ? { seguro_mensal: value!.seguro_mensal }
            : {}),
          ...(value!.tarifa_mensal !== undefined
            ? { tarifa_mensal: value!.tarifa_mensal }
            : {}),
        });
        setCmpState({ status: "ok", result });
      } catch (error) {
        setCmpState({ status: "error", error: error as FinanciamentoApiError });
      }
    },
    [draft],
  );

  const isSimBusy = simState.status === "loading";
  const isCmpBusy = cmpState.status === "loading";
  const busy = activeTab === "simular" ? isSimBusy : isCmpBusy;

  return (
    <div data-testid="financiamento-cockpit">
      <div
        className="flex gap-2 mb-4"
        role="tablist"
        aria-label="Modos de análise"
      >
        <CockpitActionButton
          variant={activeTab === "simular" ? "primary" : "secondary"}
          role="tab"
          aria-selected={activeTab === "simular"}
          data-testid="tab-simular"
          onClick={() => setActiveTab("simular")}
        >
          Simular
        </CockpitActionButton>
        <CockpitActionButton
          variant={activeTab === "comparar" ? "comparison" : "secondary"}
          role="tab"
          aria-selected={activeTab === "comparar"}
          data-testid="tab-comparar"
          icon="⚖️"
          onClick={() => setActiveTab("comparar")}
        >
          Comparar SAC × PRICE
        </CockpitActionButton>
      </div>

      <CockpitGrid>
        <FinanciamentoForm
          draft={draft}
          errors={fieldErrors}
          busy={busy}
          onChange={handleChange}
          onSubmit={activeTab === "simular" ? handleSimulate : handleCompare}
          submitLabel={
            activeTab === "comparar"
              ? "Comparar SAC × PRICE"
              : "Simular financiamento"
          }
          showAmortizacaoSelector={activeTab === "simular"}
        />

        {activeTab === "simular" && (
          <section
            className="cockpit-panel-center flex flex-col gap-4"
            data-testid="financiamento-result-panel"
            aria-live="polite"
            aria-busy={isSimBusy}
          >
            <FinanciamentoSaibaMais />

            {simState.status === "idle" && (
              <div
                className="cockpit-insight-bar"
                data-testid="financiamento-idle-state"
              >
                <span aria-hidden="true">🏠</span>
                <span>
                  Preencha os dados ao lado e clique em{" "}
                  <strong>Simular financiamento</strong> para ver as parcelas e
                  o custo total.
                </span>
              </div>
            )}

            {simState.status === "loading" && (
              <div
                className="cockpit-insight-bar"
                data-testid="financiamento-loading-state"
              >
                <span aria-hidden="true">⏳</span>
                <span>Simulando seu financiamento...</span>
              </div>
            )}

            {simState.status === "error" && (
              <div data-testid="financiamento-error-state">
                <AlertBanner level="error" title="Erro na simulação">
                  {describeApiError(simState.error)}
                </AlertBanner>
              </div>
            )}

            {simState.status === "ok" && (
              <div
                className="flex flex-col gap-6"
                data-testid="financiamento-ok-state"
              >
                <FinanciamentoSummary summary={simState.result.summary} />
                <FinanciamentoTable parcelas={simState.result.parcelas} />
              </div>
            )}
          </section>
        )}

        {activeTab === "comparar" && (
          <section
            className="cockpit-panel-center flex flex-col gap-4"
            data-testid="financiamento-compare-panel"
            aria-live="polite"
            aria-busy={isCmpBusy}
          >
            <FinanciamentoSaibaMais initialTab="nivel-2" />

            {cmpState.status === "idle" && (
              <div
                className="cockpit-insight-bar"
                data-testid="financiamento-compare-idle-state"
              >
                <span aria-hidden="true">⚖️</span>
                <span>
                  Preencha os dados ao lado e clique em{" "}
                  <strong>Comparar SAC × PRICE</strong> para ver as diferenças
                  entre os sistemas de amortização.
                </span>
              </div>
            )}

            {cmpState.status === "loading" && (
              <div
                className="cockpit-insight-bar"
                data-testid="financiamento-compare-loading-state"
              >
                <span aria-hidden="true">⏳</span>
                <span>Comparando sistemas de amortização...</span>
              </div>
            )}

            {cmpState.status === "error" && (
              <div data-testid="financiamento-compare-error-state">
                <AlertBanner level="error" title="Erro na comparação">
                  {describeApiError(cmpState.error)}
                </AlertBanner>
              </div>
            )}

            {cmpState.status === "ok" && (
              <div
                className="flex flex-col gap-6"
                data-testid="financiamento-compare-ok-state"
              >
                <FinanciamentoCompareSummary compare={cmpState.result} />
                <FinanciamentoCompareChart compare={cmpState.result} />
              </div>
            )}
          </section>
        )}
      </CockpitGrid>
    </div>
  );
}
