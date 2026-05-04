"use client";

import { useState } from "react";

import { ErrorState, EmptyState, LoadingState } from "@/components/states";
import { ProgressiveSection } from "@/components/ui";
import { describeApiError } from "@/lib/api/problem";
import {
  compararAmortizacao,
  type AmortizationApiError,
} from "@/services/amortization/amortizationService";
import type {
  CompareAmortizationIn,
  CompareAmortizationOut,
} from "@/types/amortization";

import { AmortizacaoAlerts } from "./AmortizacaoAlerts";
import { AmortizacaoForm } from "./AmortizacaoForm";
import { AmortizacaoInterpretation } from "./AmortizacaoInterpretation";
import { AmortizacaoSaldoChart } from "./AmortizacaoSaldoChart";
import { CompareSummaryGrid } from "./AmortizacaoSummary";
import { CompareTables } from "./AmortizacaoTable";
import { IDLE, LOADING, type SimulationState } from "./simulationState";

export function ComparePanel() {
  const [state, setState] =
    useState<SimulationState<CompareAmortizationOut>>(IDLE);

  async function handleSubmit(payload: CompareAmortizationIn): Promise<void> {
    setState(LOADING);
    try {
      const result = await compararAmortizacao(payload);
      setState({ status: "ok", result });
    } catch (error) {
      setState({ status: "error", error: error as AmortizationApiError });
    }
  }

  return (
    <section
      aria-labelledby="amortizacao-compare-heading"
      className="space-y-6"
    >
      <h2 id="amortizacao-compare-heading" className="sr-only">
        Comparacao PRICE e SAC
      </h2>
      <AmortizacaoForm
        mode="compare"
        onSubmit={handleSubmit}
        busy={state.status === "loading"}
      />
      <CompareResultArea state={state} />
    </section>
  );
}

function CompareResultArea({
  state,
}: {
  readonly state: SimulationState<CompareAmortizationOut>;
}) {
  if (state.status === "idle") {
    return (
      <EmptyState
        title="Sem comparacao ainda"
        description="Use a mesma entrada para comparar custo total e juros."
      />
    );
  }
  if (state.status === "loading") {
    return (
      <LoadingState
        title="Comparando PRICE e SAC..."
        description="Aguarde enquanto o backend calcula os dois sistemas."
      />
    );
  }
  if (state.status === "error") {
    return (
      <ErrorState
        title="Nao foi possivel comparar"
        description={describeApiError(state.error)}
      />
    );
  }

  const { result } = state;
  const firstChart = result.charts[0];

  return (
    <div className="space-y-4" data-testid="amortizacao-compare-result">
      <CompareSummaryGrid summary={result.summary} />
      <AmortizacaoInterpretation interpretation={result.interpretation} />
      <AmortizacaoAlerts alerts={result.alerts} />
      {firstChart ? (
        <ProgressiveSection
          title="Gráfico"
          description="Comparação visual do saldo devedor por sistema."
          testId="amortizacao-compare-chart-layer"
        >
          <AmortizacaoSaldoChart chart={firstChart} />
        </ProgressiveSection>
      ) : null}
      <ProgressiveSection
        title="Tabelas"
        description="Memória de cálculo PRICE e SAC com rolagem interna."
        testId="amortizacao-compare-table-layer"
      >
        <CompareTables price={result.tables.price} sac={result.tables.sac} />
      </ProgressiveSection>
    </div>
  );
}
