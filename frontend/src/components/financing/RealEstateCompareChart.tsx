"use client";

/**
 * RealEstateCompareChart — Gráfico PRICE × SAC redesenhado
 *
 * ITEM 14D-B: Redesenho visual próximo ao protótipo Financial Observatory.
 * - Proporção equilibrada (height: 320px)
 * - Grid discreto com strokeDasharray
 * - Legenda limpa com chips coloridos
 * - Linha de cruzamento com label contextual
 * - Cards de insight abaixo do gráfico
 * - Bloco pedagógico de interpretação
 */

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatBRL } from "@/lib/money";
import type { FinanciamentoImobCompareOut } from "@/types/financing";

const PRICE_COLOR = "#9B72EF";
const SAC_COLOR = "#F5A623";

interface ChartPoint {
  readonly mes: number;
  readonly price: number;
  readonly sac: number;
}

function buildPoints(
  compare: FinanciamentoImobCompareOut,
): ReadonlyArray<ChartPoint> {
  const len = Math.max(
    compare.price.parcelas.length,
    compare.sac.parcelas.length,
  );
  const step = Math.max(1, Math.floor(len / 100));
  const pts: ChartPoint[] = [];
  for (let i = 0; i < len; i += step) {
    const pp = compare.price.parcelas[i];
    const sp = compare.sac.parcelas[i];
    pts.push({
      mes: i + 1,
      price: pp ? parseFloat(pp.encargo_mensal_total ?? pp.prestacao) : 0,
      sac: sp ? parseFloat(sp.encargo_mensal_total ?? sp.prestacao) : 0,
    });
  }
  const last = len - 1;
  if (last > 0 && (pts.at(-1)?.mes ?? 0) < last + 1) {
    const pp = compare.price.parcelas[last];
    const sp = compare.sac.parcelas[last];
    if (pp && sp) {
      pts.push({
        mes: last + 1,
        price: parseFloat(pp.encargo_mensal_total ?? pp.prestacao),
        sac: parseFloat(sp.encargo_mensal_total ?? sp.prestacao),
      });
    }
  }
  return pts;
}

function findCrossover(points: ReadonlyArray<ChartPoint>): number | null {
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    if (prev && curr && prev.sac > prev.price && curr.sac <= curr.price) {
      return curr.mes;
    }
  }
  return null;
}

function money(v: number): string {
  return formatBRL(v.toFixed(2));
}

export interface RealEstateCompareChartProps {
  readonly compare: FinanciamentoImobCompareOut;
}

export function RealEstateCompareChart({
  compare,
}: RealEstateCompareChartProps) {
  const points = buildPoints(compare);
  const crossover = findCrossover(points);
  const pPrice1 = parseFloat(compare.price.summary.primeira_parcela);
  const pSac1 = parseFloat(compare.sac.summary.primeira_parcela);
  const pPriceN = parseFloat(compare.price.summary.ultima_parcela);
  const pSacN = parseFloat(compare.sac.summary.ultima_parcela);
  const difJuros =
    parseFloat(compare.price.summary.total_juros) -
    parseFloat(compare.sac.summary.total_juros);
  const prazo = compare.price.summary.prazo_meses;

  return (
    <div
      className="flex flex-col gap-3"
      data-testid="financiamento-compare-chart"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[13px] font-semibold text-slate-100">
            Evolução da parcela — PRICE × SAC
          </h3>
          <p className="mt-0.5 text-[11px] text-slate-400">
            Mesmo cenário · {prazo} meses
          </p>
        </div>
        <div className="flex gap-2">
          <span className="flex items-center gap-1.5 text-[10px] text-slate-300">
            <span
              className="inline-block h-2.5 w-5 rounded-sm"
              style={{ background: PRICE_COLOR }}
            />
            PRICE
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-slate-300">
            <span
              className="inline-block h-2.5 w-5 rounded-sm"
              style={{ background: SAC_COLOR }}
            />
            SAC
          </span>
        </div>
      </div>

      {/* Gráfico */}
      <div
        className="rounded-xl border border-cyan-200/10 bg-slate-950/50 p-3"
        data-testid="compare-chart-pedagogia"
      >
        <figure
          aria-label={`Gráfico PRICE vs SAC. PRICE: ${money(pPrice1)} → ${money(pPriceN)}. SAC: ${money(pSac1)} → ${money(pSacN)}.`}
        >
          <figcaption className="sr-only">
            Evolução da parcela ao longo de {prazo} meses. PRICE:{" "}
            {money(pPrice1)} até {money(pPriceN)}. SAC: {money(pSac1)} até{" "}
            {money(pSacN)}.
            {crossover !== null
              ? ` O SAC passa a ser mais barato a partir do mês ${crossover}.`
              : ""}
          </figcaption>
          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={points as ChartPoint[]}
                margin={{ top: 6, right: 6, bottom: 4, left: 0 }}
              >
                <CartesianGrid
                  stroke="rgba(100,116,139,0.12)"
                  strokeDasharray="4 4"
                  vertical={false}
                />
                <XAxis
                  dataKey="mes"
                  tick={{ fill: "#4D6A8A", fontSize: 9 }}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(100,116,139,0.15)" }}
                  label={{
                    value: "Mês",
                    position: "insideBottomRight",
                    offset: -4,
                    fill: "#4D6A8A",
                    fontSize: 9,
                  }}
                />
                <YAxis
                  width={75}
                  tickFormatter={money}
                  tick={{ fill: "#4D6A8A", fontSize: 9 }}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(100,116,139,0.15)" }}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0C1528",
                    border: "1px solid rgba(100,116,139,0.25)",
                    borderRadius: "10px",
                    fontSize: "11px",
                    color: "#e2e8f0",
                  }}
                  formatter={(v: number, n: string) => [
                    money(v),
                    n === "price" ? "PRICE" : "SAC",
                  ]}
                  labelFormatter={(l: number) => `Mês ${l}`}
                />
                {crossover !== null && (
                  <ReferenceLine
                    x={crossover}
                    stroke="rgba(255,255,255,0.15)"
                    strokeDasharray="4 3"
                    label={{
                      value: `~mês ${crossover}`,
                      position: "insideTopRight",
                      fill: "#4D6A8A",
                      fontSize: 9,
                    }}
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke={PRICE_COLOR}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0, fill: PRICE_COLOR }}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="sac"
                  stroke={SAC_COLOR}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0, fill: SAC_COLOR }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </figure>
      </div>

      {/* Cards de insight */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-violet-400/25 bg-violet-400/8 p-2.5">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-violet-400/70">
            PRICE
          </p>
          <p className="mt-0.5 font-mono text-[12px] font-semibold text-violet-200">
            {money(pPrice1)}
          </p>
          <p className="text-[9px] text-violet-300/60">parcela constante</p>
        </div>
        <div className="rounded-xl border border-amber-400/25 bg-amber-400/8 p-2.5">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-amber-400/70">
            SAC
          </p>
          <p className="mt-0.5 font-mono text-[12px] font-semibold text-amber-200">
            {money(pSac1)} → {money(pSacN)}
          </p>
          <p className="text-[9px] text-amber-300/60">parcela cai todo mês</p>
        </div>
        {difJuros > 0 && (
          <div className="rounded-xl border border-emerald-400/25 bg-emerald-400/8 p-2.5">
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-400/70">
              Economia SAC
            </p>
            <p className="mt-0.5 font-mono text-[12px] font-semibold text-emerald-200">
              {money(difJuros)}
            </p>
            <p className="text-[9px] text-emerald-300/60">em juros totais</p>
          </div>
        )}
      </div>

      {/* Insight pedagógico */}
      <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/8 px-3 py-2.5 text-[11px] leading-5 text-cyan-100/85">
        <strong className="text-cyan-200">Como interpretar:</strong> O SAC
        começa{" "}
        <span className="font-semibold text-amber-300">
          {money(Math.abs(pSac1 - pPrice1))} mais{" "}
          {pSac1 > pPrice1 ? "caro" : "barato"}
        </span>{" "}
        por mês, mas{" "}
        {difJuros > 0 ? (
          <>
            economiza{" "}
            <span className="font-semibold text-emerald-300">
              {money(difJuros)}
            </span>{" "}
            em juros ao longo do contrato.
          </>
        ) : (
          <>os juros totais são similares nos dois sistemas.</>
        )}{" "}
        {crossover !== null && (
          <>A partir do mês {crossover}, as parcelas SAC ficam menores.</>
        )}
      </div>
    </div>
  );
}
