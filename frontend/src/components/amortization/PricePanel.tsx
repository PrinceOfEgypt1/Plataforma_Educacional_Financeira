"use client";

import { useState } from "react";

import { ErrorState, EmptyState, LoadingState } from "@/components/states";
import { describeApiError } from "@/lib/api/problem";
import {
  simularPrice,
  type AmortizationApiError,
} from "@/services/amortization/amortizationService";
import type { PriceIn, PriceOut } from "@/types/amortization";
import { AMORTIZATION_TABLE_KEY } from "@/types/amortization";

import { AmortizacaoAlerts } from "./AmortizacaoAlerts";
import { AmortizacaoForm } from "./AmortizacaoForm";
import { AmortizacaoInterpretation } from "./AmortizacaoInterpretation";
import { AmortizacaoSaldoChart } from "./AmortizacaoSaldoChart";
import { PriceSummaryGrid } from "./AmortizacaoSummary";
import { AmortizacaoTable } from "./AmortizacaoTable";
import { IDLE, LOADING, type SimulationState } from "./simulationState";

export function PricePanel() {
  const [state, setState] = useState<SimulationState<PriceOut>>(IDLE);

  async function handleSubmit(payload: PriceIn): Promise<void> {
    setState(LOADING);
    try {
      const result = await simularPrice(payload);
      setState({ status: "ok", result });
    } catch (error) {
      setState({ status: "error", error: error as AmortizationApiError });
    }
  }

  return (
    <section aria-labelledby="amortizacao-price-heading" className="space-y-6">
      <h2 id="amortizacao-price-heading" className="sr-only">
        Simulacao de amortizacao PRICE
      </h2>
      <AmortizacaoForm
        mode="price"
        onSubmit={handleSubmit}
        busy={state.status === "loading"}
      />
      <PriceResultArea state={state} />
    </section>
  );
}

function PriceResultArea({
  state,
}: {
  readonly state: SimulationState<PriceOut>;
}) {
  if (state.status === "idle") {
    return (
      <EmptyState
        title="Sem simulacao ainda"
        description="Preencha os campos para visualizar parcelas, juros e saldo devedor."
      />
    );
  }
  if (state.status === "loading") {
    return (
      <LoadingState
        title="Calculando PRICE..."
        description="Aguarde enquanto o backend monta a tabela de amortizacao."
      />
    );
  }
  if (state.status === "error") {
    return (
      <ErrorState
        title="Nao foi possivel calcular PRICE"
        description={describeApiError(state.error)}
      />
    );
  }

  const { result } = state;
  const rows = result.tables[AMORTIZATION_TABLE_KEY] ?? [];
  const firstChart = result.charts[0];

  return (
    <div className="space-y-6" data-testid="amortizacao-price-result">
      <PriceSummaryGrid summary={result.summary} />
      <AmortizacaoAlerts alerts={result.alerts} />
      {firstChart ? <AmortizacaoSaldoChart chart={firstChart} /> : null}
      <AmortizacaoTable rows={rows} caption="Tabela PRICE" />
      <AmortizacaoInterpretation interpretation={result.interpretation} />
    </div>
  );
}
