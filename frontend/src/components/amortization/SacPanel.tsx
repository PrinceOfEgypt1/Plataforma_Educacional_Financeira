"use client";

import { useState } from "react";

import { ErrorState, EmptyState, LoadingState } from "@/components/states";
import { ProgressiveSection } from "@/components/ui";
import { describeApiError } from "@/lib/api/problem";
import {
  simularSac,
  type AmortizationApiError,
} from "@/services/amortization/amortizationService";
import type { SacIn, SacOut } from "@/types/amortization";
import { AMORTIZATION_TABLE_KEY } from "@/types/amortization";

import { AmortizacaoAlerts } from "./AmortizacaoAlerts";
import { AmortizacaoForm } from "./AmortizacaoForm";
import { AmortizacaoInterpretation } from "./AmortizacaoInterpretation";
import { AmortizacaoSaldoChart } from "./AmortizacaoSaldoChart";
import { SacSummaryGrid } from "./AmortizacaoSummary";
import { AmortizacaoTable } from "./AmortizacaoTable";
import { IDLE, LOADING, type SimulationState } from "./simulationState";

export function SacPanel() {
  const [state, setState] = useState<SimulationState<SacOut>>(IDLE);

  async function handleSubmit(payload: SacIn): Promise<void> {
    setState(LOADING);
    try {
      const result = await simularSac(payload);
      setState({ status: "ok", result });
    } catch (error) {
      setState({ status: "error", error: error as AmortizationApiError });
    }
  }

  return (
    <section aria-labelledby="amortizacao-sac-heading" className="space-y-6">
      <h2 id="amortizacao-sac-heading" className="sr-only">
        Simulacao de amortizacao SAC
      </h2>
      <AmortizacaoForm
        mode="sac"
        onSubmit={handleSubmit}
        busy={state.status === "loading"}
      />
      <SacResultArea state={state} />
    </section>
  );
}

function SacResultArea({ state }: { readonly state: SimulationState<SacOut> }) {
  if (state.status === "idle") {
    return (
      <EmptyState
        title="Sem simulacao ainda"
        description="Preencha os campos para visualizar a amortizacao constante."
      />
    );
  }
  if (state.status === "loading") {
    return (
      <LoadingState
        title="Calculando SAC..."
        description="Aguarde enquanto o backend monta a tabela de amortizacao."
      />
    );
  }
  if (state.status === "error") {
    return (
      <ErrorState
        title="Nao foi possivel calcular SAC"
        description={describeApiError(state.error)}
      />
    );
  }

  const { result } = state;
  const rows = result.tables[AMORTIZATION_TABLE_KEY] ?? [];
  const firstChart = result.charts[0];

  return (
    <div className="space-y-4" data-testid="amortizacao-sac-result">
      <SacSummaryGrid summary={result.summary} />
      <AmortizacaoInterpretation interpretation={result.interpretation} />
      <AmortizacaoAlerts alerts={result.alerts} />
      {firstChart ? (
        <ProgressiveSection
          title="Gráfico"
          description="Queda do saldo devedor em uma camada dedicada."
          testId="amortizacao-sac-chart-layer"
        >
          <AmortizacaoSaldoChart chart={firstChart} />
        </ProgressiveSection>
      ) : null}
      <ProgressiveSection
        title="Tabela"
        description="Memória de cálculo com rolagem interna, sem ocupar o fluxo principal."
        testId="amortizacao-sac-table-layer"
      >
        <AmortizacaoTable rows={rows} caption="Tabela SAC" />
      </ProgressiveSection>
    </div>
  );
}
