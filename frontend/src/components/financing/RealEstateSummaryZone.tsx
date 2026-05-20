"use client";

/**
 * RealEstateSummaryZone — Zona 1: Resumo executivo do financiamento
 *
 * ITEM 14D-B: Grid de metric cards + bloco de interpretação pedagógica.
 */

import { formatBRL, formatRatePct } from "@/lib/money";
import type { FinanciamentoImobSummary } from "@/types/financing";
import { GlossaryTerm } from "@/components/education/GlossaryTerm";

interface Props {
  readonly summary: FinanciamentoImobSummary;
}

function MetricHero({
  label,
  value,
  note,
}: {
  readonly label: string;
  readonly value: string;
  readonly note: string;
}) {
  return (
    <div className="rounded-xl border border-amber-400/20 bg-gradient-to-br from-slate-900 to-amber-950/10 p-3.5">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300/80">
        {label}
      </p>
      <p className="mt-1 font-mono text-2xl font-semibold leading-none text-slate-50">
        {value}
      </p>
      <p className="mt-1 text-[10px] text-slate-400">{note}</p>
    </div>
  );
}

function MetricCard({
  label,
  value,
  note,
  accent,
}: {
  readonly label: string;
  readonly value: string;
  readonly note: string;
  readonly accent?: "cyan" | "amber" | "emerald" | "violet";
}) {
  const colors = {
    cyan: "text-cyan-300 border-cyan-400/20 bg-cyan-400/6",
    amber: "text-amber-300 border-amber-400/20 bg-amber-400/6",
    emerald: "text-emerald-300 border-emerald-400/20 bg-emerald-400/6",
    violet: "text-violet-300 border-violet-400/20 bg-violet-400/6",
  };
  const cl = colors[accent ?? "cyan"];
  return (
    <div className={`rounded-xl border p-3 ${cl}`}>
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] opacity-70">
        {label}
      </p>
      <p className="mt-1 font-mono text-[15px] font-semibold">{value}</p>
      <p className="mt-0.5 text-[10px] opacity-60">{note}</p>
    </div>
  );
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
      {/* Grid de métricas */}
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        <MetricHero
          label="Primeira parcela estimada"
          value={formatBRL(summary.primeira_parcela)}
          note={`${isSAC ? "Cai progressivamente até " + formatBRL(summary.ultima_parcela) : "Constante em todos os " + summary.prazo_meses + " meses"}`}
        />
        <MetricCard
          label="Última parcela"
          value={formatBRL(summary.ultima_parcela)}
          note={isSAC ? "Redução ao longo do contrato" : "Igual à primeira"}
          accent="amber"
        />
        <MetricCard
          label="Prazo total"
          value={`${summary.prazo_meses} meses`}
          note={`${Math.round(summary.prazo_meses / 12)} anos de contrato`}
          accent="cyan"
        />
        <MetricCard
          label="Total de juros"
          value={formatBRL(summary.total_juros)}
          note={`${pctJuros}% do valor financiado`}
          accent="violet"
        />
        <MetricCard
          label="Total amortizado"
          value={formatBRL(summary.total_amortizado)}
          note="Saldo zerado ao final"
          accent="emerald"
        />
        <MetricCard
          label="Total pago"
          value={formatBRL(summary.total_pago)}
          note="Capital + juros + encargos"
          accent="amber"
        />
      </div>

      {/* Detalhes do cenário */}
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

        {/* Interpretação pedagógica rápida */}
        <div className="rounded-xl border border-emerald-300/15 bg-emerald-400/8 px-3 py-2.5">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300/80">
            Leitura rápida do cenário
          </p>
          <p className="text-[11px] leading-5 text-emerald-50/85">
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
                <strong className="text-emerald-100">
                  {formatBRL(summary.total_amortizado)}
                </strong>{" "}
                em{" "}
                <GlossaryTerm
                  term="amortização"
                  definition="Redução efetiva do saldo devedor. No SAC é constante por mês."
                  accent="emerald"
                />{" "}
                constante. Sua parcela vai de{" "}
                <strong className="text-emerald-100">
                  {formatBRL(summary.primeira_parcela)}
                </strong>{" "}
                até{" "}
                <strong className="text-emerald-100">
                  {formatBRL(summary.ultima_parcela)}
                </strong>
                . Total em juros:{" "}
                <strong className="text-amber-200">
                  {formatBRL(summary.total_juros)}
                </strong>
                .
              </>
            ) : (
              <>
                {" "}
                sua parcela é sempre{" "}
                <strong className="text-emerald-100">
                  {formatBRL(summary.primeira_parcela)}
                </strong>
                . Total em juros:{" "}
                <strong className="text-amber-200">
                  {formatBRL(summary.total_juros)}
                </strong>
                .
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
