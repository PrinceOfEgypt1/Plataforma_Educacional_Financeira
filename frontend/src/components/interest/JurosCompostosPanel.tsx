"use client";

import { useState } from "react";

import { ErrorState, EmptyState, LoadingState } from "@/components/states";
import { ProgressiveSection } from "@/components/ui";
import { describeApiError, type InterestApiError } from "@/lib/api/problem";
import { simularJurosCompostos } from "@/services/interest";
import type { JurosCompostosIn, JurosCompostosOut } from "@/types/interest";

import { AmortizacaoCompostaTable } from "./AmortizacaoTables";
import { EvolucaoSaldoChart } from "./EvolucaoSaldoChart";
import { JurosAlerts } from "./JurosAlerts";
import { JurosCompostosForm } from "./JurosCompostosForm";
import { JurosInterpretation } from "./JurosInterpretation";
import { IDLE, LOADING, type SimulationState } from "./JurosSimulationState";
import { SummaryCompostosGrid } from "./SummaryGrid";

const AMORTIZACAO_KEY = "amortizacao";

export function JurosCompostosPanel() {
  const [state, setState] = useState<SimulationState<JurosCompostosOut>>(IDLE);

  async function handleSubmit(payload: JurosCompostosIn): Promise<void> {
    setState(LOADING);
    try {
      const result = await simularJurosCompostos(payload);
      setState({ status: "ok", result });
    } catch (err) {
      setState({ status: "error", error: err as InterestApiError });
    }
  }

  return (
    <section aria-labelledby="juros-compostos-heading" className="space-y-6">
      <h2 id="juros-compostos-heading" className="sr-only">
        Simulação de juros compostos
      </h2>
      <JurosCompostosForm
        onSubmit={handleSubmit}
        busy={state.status === "loading"}
      />
      <CompostosResultArea state={state} />
    </section>
  );
}

function CompostosResultArea({
  state,
}: {
  readonly state: SimulationState<JurosCompostosOut>;
}) {
  if (state.status === "idle") {
    return (
      <EmptyState
        title="Sem simulação ainda"
        description="Preencha o formulário para ver a evolução do saldo."
      />
    );
  }
  if (state.status === "loading") {
    return (
      <LoadingState
        title="Calculando juros compostos…"
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
    <div className="space-y-4" data-testid="juros-compostos-result">
      <SummaryCompostosGrid summary={result.summary} />
      <JurosInterpretation interpretation={result.interpretation} />
      <JurosAlerts alerts={result.alerts} />
      {firstChart ? (
        <ProgressiveSection
          title="Gráfico"
          description="Evolução composta do saldo em uma camada dedicada."
          testId="juros-compostos-chart-layer"
        >
          <EvolucaoSaldoChart chart={firstChart} />
        </ProgressiveSection>
      ) : null}
      <ProgressiveSection
        title="Tabela"
        description="Memória de cálculo com rolagem interna."
        testId="juros-compostos-table-layer"
      >
        <AmortizacaoCompostaTable rows={rows} />
      </ProgressiveSection>
    </div>
  );
}
