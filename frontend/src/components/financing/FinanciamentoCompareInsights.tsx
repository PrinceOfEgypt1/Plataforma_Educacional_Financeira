"use client";

import { formatBRL } from "@/lib/money";
import type { FinanciamentoImobCompareOut } from "@/types/financing";

interface FinanciamentoCompareInsightsProps {
  readonly compare: FinanciamentoImobCompareOut;
}

export function FinanciamentoCompareInsights({
  compare,
}: FinanciamentoCompareInsightsProps) {
  const { comparacao } = compare;
  const difJuros = parseFloat(comparacao.diferenca_total_juros);
  const sacEconomiza = difJuros > 0;

  return (
    <section
      className="rounded-2xl border border-violet-200/15 bg-violet-300/8 p-4"
      data-testid="financiamento-compare-insights"
      aria-label="Explicação comparativa SAC e PRICE"
    >
      <h3 className="text-sm font-semibold text-violet-100">
        Trade-off financeiro
      </h3>
      <p className="mt-2 text-xs leading-5 text-violet-50/85">
        {comparacao.interpretacao_dinamica ?? comparacao.explicacao_pedagogica}
      </p>
      <dl className="mt-3 grid gap-2 text-xs md:grid-cols-2">
        <div className="rounded-xl bg-white/5 border border-white/8 p-2.5">
          <dt className="font-semibold text-slate-300">
            Diferença na primeira parcela
          </dt>
          <dd className="mt-0.5 font-mono text-amber-300">
            {formatBRL(comparacao.diferenca_primeira_parcela)}
          </dd>
        </div>
        <div className="rounded-xl bg-white/5 border border-white/8 p-2.5">
          <dt className="font-semibold text-slate-300">
            Diferença no total de juros
          </dt>
          <dd
            className={`mt-0.5 font-mono ${sacEconomiza ? "text-emerald-300" : "text-slate-200"}`}
          >
            {formatBRL(comparacao.diferenca_total_juros)}
            {sacEconomiza && (
              <span className="ml-1 text-[10px] text-emerald-400">
                (SAC economiza)
              </span>
            )}
          </dd>
        </div>
      </dl>
      {comparacao.recomendacoes.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {comparacao.recomendacoes.map((recomendacao) => (
            <li
              key={recomendacao}
              className="flex gap-2 text-xs text-violet-50/75"
            >
              <span className="text-violet-400 flex-shrink-0">→</span>
              <span>{recomendacao}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
