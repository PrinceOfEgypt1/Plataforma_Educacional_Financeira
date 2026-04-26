"use client";

import { useState } from "react";

import { ErrorState, EmptyState, LoadingState } from "@/components/states";
import { describeApiError, type InterestApiError } from "@/lib/api/problem";
import { compararJuros } from "@/services/interest";
import type { CompararJurosIn, CompararJurosOut } from "@/types/interest";

import { CompararTabelas } from "./AmortizacaoTables";
import { CompararJurosForm } from "./CompararJurosForm";
import { EvolucaoSaldoChart } from "./EvolucaoSaldoChart";
import { JurosAlerts } from "./JurosAlerts";
import { JurosInterpretation } from "./JurosInterpretation";
import { IDLE, LOADING, type SimulationState } from "./JurosSimulationState";
import { SummaryCompararGrid } from "./SummaryGrid";

export function CompararJurosPanel() {
  const [state, setState] = useState<SimulationState<CompararJurosOut>>(IDLE);

  async function handleSubmit(payload: CompararJurosIn): Promise<void> {
    setState(LOADING);
    try {
      const result = await compararJuros(payload);
      setState({ status: "ok", result });
    } catch (err) {
      setState({ status: "error", error: err as InterestApiError });
    }
  }

  return (
    <section aria-labelledby="comparar-juros-heading" className="space-y-6">
      <h2 id="comparar-juros-heading" className="sr-only">
        Comparação juros simples × compostos
      </h2>
      <CompararJurosForm
        onSubmit={handleSubmit}
        busy={state.status === "loading"}
      />
      <CompararResultArea state={state} />
    </section>
  );
}

function CompararResultArea({
  state,
}: {
  readonly state: SimulationState<CompararJurosOut>;
}) {
  if (state.status === "idle") {
    return (
      <EmptyState
        title="Sem comparação ainda"
        description="Use a mesma entrada nos dois regimes para visualizar a diferença."
      />
    );
  }
  if (state.status === "loading") {
    return (
      <LoadingState
        title="Comparando regimes…"
        description="Aguarde enquanto o backend calcula ambos."
      />
    );
  }
  if (state.status === "error") {
    return (
      <ErrorState
        title="Não foi possível comparar"
        description={describeApiError(state.error)}
      />
    );
  }
  const { result } = state;
  const firstChart = result.charts[0];
  return (
    <div className="space-y-6" data-testid="comparar-juros-result">
      <SummaryCompararGrid summary={result.summary} />
      <JurosAlerts alerts={result.alerts} />
      {firstChart ? <EvolucaoSaldoChart chart={firstChart} /> : null}
      <CompararTabelas
        simple={result.tables.simple}
        compound={result.tables.compound}
      />
      <JurosInterpretation interpretation={result.interpretation} />
    </div>
  );
}
