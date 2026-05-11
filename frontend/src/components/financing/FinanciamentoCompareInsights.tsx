import { formatBRL } from "@/lib/money";
import type { FinanciamentoImobCompareOut } from "@/types/financing";

interface FinanciamentoCompareInsightsProps {
  readonly compare: FinanciamentoImobCompareOut;
}

export function FinanciamentoCompareInsights({
  compare,
}: FinanciamentoCompareInsightsProps) {
  const { comparacao } = compare;

  return (
    <section
      className="rounded-lg border border-blue-100 bg-blue-50 p-4"
      data-testid="financiamento-compare-insights"
      aria-label="Explicação comparativa SAC e PRICE"
    >
      <h3 className="text-sm font-semibold text-blue-950">
        Trade-off financeiro do piloto
      </h3>
      <p className="mt-2 text-xs leading-5 text-blue-950">
        {comparacao.explicacao_pedagogica}
      </p>
      <dl className="mt-3 grid gap-2 text-xs text-blue-950 md:grid-cols-2">
        <div className="rounded bg-white/70 p-2">
          <dt className="font-semibold">Diferença na primeira parcela</dt>
          <dd>{formatBRL(comparacao.diferenca_primeira_parcela)}</dd>
        </div>
        <div className="rounded bg-white/70 p-2">
          <dt className="font-semibold">Diferença no total de juros</dt>
          <dd>{formatBRL(comparacao.diferenca_total_juros)}</dd>
        </div>
      </dl>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-blue-950">
        {comparacao.recomendacoes.map((recomendacao) => (
          <li key={recomendacao}>{recomendacao}</li>
        ))}
      </ul>
    </section>
  );
}
