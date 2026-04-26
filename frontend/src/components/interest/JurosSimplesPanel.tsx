"use client";

/**
 * Orquestrador da aba "juros simples" — une formulário, estado de
 * simulação e visualização do resultado.
 */

import { useState } from "react";

import { ErrorState, EmptyState, LoadingState } from "@/components/states";
import { describeApiError, type InterestApiError } from "@/lib/api/problem";
import { simularJurosSimples } from "@/services/interest";
import type { JurosSimplesIn, JurosSimplesOut } from "@/types/interest";

import { AmortizacaoSimplesTable } from "./AmortizacaoTables";
import { EvolucaoSaldoChart } from "./EvolucaoSaldoChart";
import { JurosAlerts } from "./JurosAlerts";
import { JurosInterpretation } from "./JurosInterpretation";
import { JurosSimplesForm } from "./JurosSimplesForm";
import { IDLE, LOADING, type SimulationState } from "./JurosSimulationState";
import { SummarySimplesGrid } from "./SummaryGrid";

const AMORTIZACAO_KEY = "amortizacao";

export function JurosSimplesPanel() {
  const [state, setState] = useState<SimulationState<JurosSimplesOut>>(IDLE);

  async function handleSubmit(payload: JurosSimplesIn): Promise<void> {
    setState(LOADING);
    try {
      const result = await simularJurosSimples(payload);
      setState({ status: "ok", result });
    } catch (err) {
      setState({ status: "error", error: err as InterestApiError });
    }
  }

  return (
    <section aria-labelledby="juros-simples-heading" className="space-y-6">
      <h2 id="juros-simples-heading" className="sr-only">
        Simulação de juros simples
      </h2>
      <JurosSimplesForm
        onSubmit={handleSubmit}
        busy={state.status === "loading"}
      />
      <ResultArea state={state} />
    </section>
  );
}

function ResultArea({
  state,
}: {
  readonly state: SimulationState<JurosSimplesOut>;
}) {
  if (state.status === "idle") {
    return (
      <EmptyState
        title="Sem simulação ainda"
        description="Preencha o formulário e clique em calcular para ver o resultado."
      />
    );
  }
  if (state.status === "loading") {
    return (
      <LoadingState
        title="Calculando juros simples…"
        description="Aguarde enquanto o backend processa a simulação."
      />
    );
  }
  if (state.status === "error") {
    return (
      <ErrorState
        title="Não foi possível calcular"
        description={describeApiError(state.error)}
      />
    );
  }
  const { result } = state;
  const rows = result.tables[AMORTIZACAO_KEY] ?? [];
  const firstChart = result.charts[0];
  return (
    <div className="space-y-6" data-testid="juros-simples-result">
      <SummarySimplesGrid summary={result.summary} />
      <JurosAlerts alerts={result.alerts} />
      {firstChart ? <EvolucaoSaldoChart chart={firstChart} /> : null}
      <AmortizacaoSimplesTable rows={rows} />
      <JurosInterpretation interpretation={result.interpretation} />
    </div>
  );
}
