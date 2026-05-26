"use client";

/**
 * RealEstateSummaryZone — Zona 1: Resumo executivo do financiamento
 *
 * F8D: Zona de Resultado usa ScoreCard (ObsScoreGrid) + InsightBox conforme
 * MATRIZ_UI_ELEMENTS_PARA_IMOVEL.md, etapa Resultado.
 */

import { formatBRL, formatRatePct } from "@/lib/money";
import type { FinanciamentoImobSummary } from "@/types/financing";
import { GlossaryTerm } from "@/components/education/GlossaryTerm";
import {
  ScoreCard,
  InsightBox,
  InsightStrong,
  ObsScoreGrid,
  OBS,
} from "./ObservatoryDarkCards";

interface Props {
  readonly summary: FinanciamentoImobSummary;
}

export function RealEstateSummaryZone({ summary }: Props) {
  const isSAC = summary.sistema_amortizacao === "SAC";
  const pctJuros =
    parseFloat(summary.valor_financiado) > 0
      ? (
          (parseFloat(summary.total_juros) /
            parseFloat(summary.valor_financiado)) *
          100
        ).toFixed(0)
      : "—";

  return (
    <div
      className="space-y-3 overflow-y-auto"
      data-testid="zone-resumo-content"
    >
      {/* ScoreCard grid — Observatory F8D */}
      <ObsScoreGrid>
        <ScoreCard
          label="Primeira parcela"
          value={formatBRL(summary.primeira_parcela)}
          note={
            isSAC
              ? `Cai até ${formatBRL(summary.ultima_parcela)}`
              : `Constante por ${summary.prazo_meses} meses`
          }
          highlighted
          highlightColor="cyan"
          valueColor={OBS.accent2}
          testId="score-card-primeira-parcela"
        />
        <ScoreCard
          label="Total de juros"
          value={formatBRL(summary.total_juros)}
          note={`${pctJuros}% do valor financiado`}
          barPct={Math.min(100, parseFloat(pctJuros) || 0)}
          barColor={OBS.gold}
          valueColor={OBS.gold}
          testId="score-card-total-juros"
        />
        <ScoreCard
          label="Total pago"
          value={formatBRL(summary.total_pago)}
          note="Capital + juros + encargos"
          valueColor={OBS.text}
          testId="score-card-total-pago"
        />
      </ObsScoreGrid>

      {/* Detalhes do cenário + interpretação pedagógica */}
      <div className="grid gap-2.5 sm:grid-cols-2">
        <div className="rounded-xl border border-white/6 bg-slate-900/50 px-3 py-2.5">
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Cenário simulado
          </p>
          {[
            ["Imóvel", formatBRL(summary.valor_imovel)],
            ["Entrada", formatBRL(summary.valor_entrada)],
            ["Financiado", formatBRL(summary.valor_financiado)],
            ["Prazo", `${summary.prazo_meses} meses`],
            ["Taxa mensal", formatRatePct(summary.taxa_juros_mensal)],
            ["Última parcela", `${formatBRL(summary.ultima_parcela)}`],
            ["Sistema", summary.sistema_amortizacao],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-0.5 text-[11px]">
              <span className="text-slate-400">{k}</span>
              <span
                className={`font-mono font-semibold ${k === "Financiado" ? "text-cyan-300" : k === "Sistema" ? "text-cyan-200" : "text-slate-100"}`}
              >
                {v}
              </span>
            </div>
          ))}
        </div>

        {/* InsightBox — Observatory F8D pedagógico */}
        <InsightBox icon="🎓" testId="obs-insight-summary">
          <p>
            No sistema{" "}
            <GlossaryTerm
              term={isSAC ? "SAC" : "PRICE"}
              definition={
                isSAC
                  ? "Sistema de Amortização Constante: amortização igual todo mês; parcela cai progressivamente."
                  : "Sistema Francês: prestação constante; amortização crescente ao longo do prazo."
              }
              accent="cyan"
            />
            {isSAC ? (
              <>
                {" "}
                você paga{" "}
                <InsightStrong>
                  {formatBRL(summary.total_amortizado)}
                </InsightStrong>{" "}
                em{" "}
                <GlossaryTerm
                  term="amortização"
                  definition="Redução efetiva do saldo devedor. No SAC é constante por mês."
                  accent="emerald"
                />{" "}
                constante. Sua parcela vai de{" "}
                <InsightStrong>
                  {formatBRL(summary.primeira_parcela)}
                </InsightStrong>{" "}
                até{" "}
                <InsightStrong>
                  {formatBRL(summary.ultima_parcela)}
                </InsightStrong>
                . Total em juros:{" "}
                <InsightStrong>{formatBRL(summary.total_juros)}</InsightStrong>.
              </>
            ) : (
              <>
                {" "}
                sua parcela é sempre{" "}
                <InsightStrong>
                  {formatBRL(summary.primeira_parcela)}
                </InsightStrong>
                . Total em juros:{" "}
                <InsightStrong>{formatBRL(summary.total_juros)}</InsightStrong>.
              </>
            )}
          </p>
        </InsightBox>
      </div>

      {/* Totais secundários */}
      <div className="grid gap-2.5 sm:grid-cols-3">
        <ScoreCard
          label="Última parcela"
          value={formatBRL(summary.ultima_parcela)}
          note={isSAC ? "Redução ao longo do contrato" : "Igual à primeira"}
          testId="score-card-ultima-parcela"
        />
        <ScoreCard
          label="Prazo total"
          value={`${summary.prazo_meses} meses`}
          note={`${Math.round(summary.prazo_meses / 12)} anos de contrato`}
          testId="score-card-prazo"
        />
        <ScoreCard
          label="Total amortizado"
          value={formatBRL(summary.total_amortizado)}
          note="Saldo zerado ao final"
          valueColor={OBS.green}
          testId="score-card-total-amortizado"
        />
      </div>
    </div>
  );
}
