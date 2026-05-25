"use client";

import {
  CartesianGrid,
  Legend,
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

interface ChartPoint {
  readonly mes: number;
  readonly price: number;
  readonly sac: number;
}

const PRICE_COLOR = "#a78bfa";
const SAC_COLOR = "#fb923c";

function buildPoints(
  compare: FinanciamentoImobCompareOut,
): ReadonlyArray<ChartPoint> {
  const len = Math.max(
    compare.price.parcelas.length,
    compare.sac.parcelas.length,
  );
  const step = Math.max(1, Math.floor(len / 120));
  const points: ChartPoint[] = [];
  for (let i = 0; i < len; i += step) {
    const pp = compare.price.parcelas[i];
    const sp = compare.sac.parcelas[i];
    points.push({
      mes: i + 1,
      price: pp ? parseFloat(pp.encargo_mensal_total ?? pp.prestacao) : 0,
      sac: sp ? parseFloat(sp.encargo_mensal_total ?? sp.prestacao) : 0,
    });
  }
  const last = len - 1;
  if (last > 0 && (points.at(-1)?.mes ?? 0) < last + 1) {
    const pp = compare.price.parcelas[last];
    const sp = compare.sac.parcelas[last];
    if (pp && sp) {
      points.push({
        mes: last + 1,
        price: parseFloat(pp.encargo_mensal_total ?? pp.prestacao),
        sac: parseFloat(sp.encargo_mensal_total ?? sp.prestacao),
      });
    }
  }
  return points;
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

export interface FinanciamentoCompareChartProps {
  readonly compare: FinanciamentoImobCompareOut;
}

export function FinanciamentoCompareChart({
  compare,
}: FinanciamentoCompareChartProps) {
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
  const sacMaisCaro = pSac1 > pPrice1;

  return (
    <div
      className="flex flex-col gap-3 rounded-2xl border border-cyan-200/10 bg-slate-950/45 p-4"
      data-testid="financiamento-compare-chart-legacy"
    >
      {/* Título e descrição pedagógica */}
      <div>
        <h3 className="text-sm font-semibold text-cyan-100">
          Evolução da prestação — PRICE × SAC
        </h3>
        <p
          className="mt-1 text-[11.5px] leading-5 text-slate-400"
          data-testid="compare-chart-pedagogia-legacy"
        >
          {sacMaisCaro ? (
            <>
              O SAC começa{" "}
              <span className="font-semibold text-amber-300">
                {money(pSac1 - pPrice1)} mais alto
              </span>{" "}
              ({money(pSac1)} vs {money(pPrice1)}).{" "}
              {crossover
                ? `A partir do mês ${crossover}, as parcelas do SAC passam a ser menores.`
                : "As parcelas do SAC se tornam menores ao longo do prazo."}
              {difJuros > 0 && (
                <>
                  {" "}
                  Economia em juros:{" "}
                  <span className="font-semibold text-emerald-300">
                    {money(difJuros)}
                  </span>{" "}
                  ao longo dos {prazo} meses.
                </>
              )}
            </>
          ) : (
            <>O PRICE começa com parcela mais alta neste cenário.</>
          )}
        </p>
      </div>

      {/* Gráfico com proporção equilibrada */}
      <figure
        aria-label={`Gráfico PRICE vs SAC. PRICE: ${money(pPrice1)} até ${money(pPriceN)}. SAC: ${money(pSac1)} até ${money(pSacN)}.`}
      >
        <figcaption className="sr-only">
          Evolução mensal da prestação ao longo de {prazo} meses. PRICE começa
          em {money(pPrice1)} e termina em {money(pPriceN)}. SAC começa em{" "}
          {money(pSac1)} e termina em {money(pSacN)}.
        </figcaption>
        {/* CORREÇÃO ITEM 14B: Altura aumentada de 230 para 360px para melhor expressividade */}
        <div
          style={{
            width: "100%",
            maxWidth: "900px",
            height: 360,
            margin: "0 auto",
          }}
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={200}
            minHeight={300}
          >
            <LineChart
              data={points as ChartPoint[]}
              margin={{ top: 8, right: 8, bottom: 4, left: 0 }}
            >
              <CartesianGrid
                stroke="rgba(100,116,139,0.15)"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="mes"
                tick={{ fill: "#7a8fa8", fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: "rgba(100,116,139,0.2)" }}
                label={{
                  value: "Mês",
                  position: "insideBottomRight",
                  offset: -4,
                  fill: "#64748b",
                  fontSize: 10,
                }}
              />
              <YAxis
                width={80}
                tickFormatter={money}
                tick={{ fill: "#7a8fa8", fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: "rgba(100,116,139,0.2)" }}
              />
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid rgba(100,116,139,0.3)",
                  borderRadius: "8px",
                  fontSize: "11px",
                  color: "#e2e8f0",
                }}
                formatter={(v: number, n: string) => [
                  money(v),
                  n === "price" ? "PRICE" : "SAC",
                ]}
                labelFormatter={(l: number) => `Mês ${l}`}
              />
              <Legend
                formatter={(value) => (
                  <span
                    style={{
                      fontSize: "11px",
                      color: value === "price" ? PRICE_COLOR : SAC_COLOR,
                    }}
                  >
                    {value === "price" ? "PRICE" : "SAC"}
                  </span>
                )}
              />
              {crossover && (
                <ReferenceLine
                  x={crossover}
                  stroke="rgba(255,255,255,0.2)"
                  strokeDasharray="4 2"
                  label={{
                    value: `~mês ${crossover}`,
                    position: "insideTopRight",
                    fill: "#64748b",
                    fontSize: 9,
                  }}
                />
              )}
              <Line
                type="monotone"
                dataKey="price"
                name="price"
                stroke={PRICE_COLOR}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: PRICE_COLOR }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="sac"
                name="sac"
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

      {/* Chips de insight compactos em grid responsivo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        <span className="rounded-lg bg-violet-400/10 px-2.5 py-2 text-[11px] font-medium text-violet-300 ring-1 ring-violet-400/20">
          <span className="block text-[9px] uppercase tracking-wider opacity-70">
            PRICE
          </span>
          <span className="block mt-0.5 font-semibold">
            {money(pPrice1)} → {money(pPriceN)}
          </span>
        </span>
        <span className="rounded-lg bg-amber-400/10 px-2.5 py-2 text-[11px] font-medium text-amber-300 ring-1 ring-amber-400/20">
          <span className="block text-[9px] uppercase tracking-wider opacity-70">
            SAC
          </span>
          <span className="block mt-0.5 font-semibold">
            {money(pSac1)} → {money(pSacN)}
          </span>
        </span>
        {difJuros > 0 && (
          <span className="rounded-lg bg-emerald-400/10 px-2.5 py-2 text-[11px] font-medium text-emerald-300 ring-1 ring-emerald-400/20">
            <span className="block text-[9px] uppercase tracking-wider opacity-70">
              Economia SAC
            </span>
            <span className="block mt-0.5 font-semibold">
              {money(difJuros)} em juros
            </span>
          </span>
        )}
      </div>
    </div>
  );
}
