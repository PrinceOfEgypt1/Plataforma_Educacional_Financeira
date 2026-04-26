"use client";

/**
 * Gráfico de evolução de saldo — consome `Chart` do envelope F3.
 *
 * Decisão arquitetural:
 *   - `data.charts` já vem pronto para renderização. O frontend apenas
 *     traduz para o formato do recharts.
 *   - Valores das séries são **strings** (money). Convertemos para
 *     number **apenas** na entrada do recharts — exibição usa
 *     `formatBRL`.
 *   - Cores das séries usam tokens CSS da plataforma, não hex literal.
 */

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatBRL } from "@/lib/money";
import type { Chart as ChartModel } from "@/types/interest";

interface ChartPoint {
  readonly periodo: number;
  readonly [seriesKey: string]: number;
}

/** Cor por série — lê tokens CSS em tempo de renderização. */
function colorForKind(kind: "simples" | "composto"): string {
  if (kind === "composto") return "var(--color-financial-positive, #0f766e)";
  return "var(--color-financial-neutral, #475569)";
}

/**
 * Monta os pontos para recharts. Cada série vira uma coluna nomeada
 * `s0`, `s1`… O mapa de rótulos guarda o `label` amigável.
 */
function buildPoints(chart: ChartModel): {
  readonly points: ReadonlyArray<ChartPoint>;
  readonly seriesKeys: ReadonlyArray<{
    readonly key: string;
    readonly label: string;
    readonly kind: "simples" | "composto";
  }>;
} {
  const seriesKeys = chart.series.map((s, idx) => ({
    key: `s${String(idx)}`,
    label: s.label,
    kind: s.kind,
  }));
  const maxLen = chart.series.reduce(
    (acc, s) => Math.max(acc, s.points.length),
    0,
  );
  const points: ChartPoint[] = [];
  for (let i = 0; i < maxLen; i += 1) {
    const point: Record<string, number> = { periodo: i + 1 };
    chart.series.forEach((s, idx) => {
      const raw = s.points[i];
      if (raw !== undefined) {
        const n = Number(raw);
        if (Number.isFinite(n)) {
          point[`s${String(idx)}`] = n;
        }
      }
    });
    points.push(point as ChartPoint);
  }
  return { points, seriesKeys };
}

export interface EvolucaoSaldoChartProps {
  readonly chart: ChartModel;
  readonly heightPx?: number;
}

export function EvolucaoSaldoChart({
  chart,
  heightPx = 320,
}: EvolucaoSaldoChartProps) {
  const { points, seriesKeys } = buildPoints(chart);
  const hasData = points.length > 0 && seriesKeys.length > 0;

  return (
    <figure
      data-testid="evolucao-saldo-chart"
      aria-label="Gráfico de evolução do saldo por período"
    >
      <figcaption className="sr-only">
        Evolução do saldo ao longo de {String(points.length)} períodos.
      </figcaption>
      {hasData ? (
        <div style={{ width: "100%", height: heightPx }}>
          <ResponsiveContainer>
            <LineChart
              data={points as ChartPoint[]}
              margin={{ top: 8, right: 16, bottom: 8, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="periodo"
                label={{
                  value: chart.x_label,
                  position: "insideBottom",
                  offset: -4,
                  fill: "#64748b",
                }}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickFormatter={(v: number) => formatBRL(v.toFixed(2))}
                label={{
                  value: chart.y_label,
                  angle: -90,
                  position: "insideLeft",
                  fill: "#64748b",
                }}
                tick={{ fontSize: 12 }}
                width={96}
              />
              <Tooltip
                formatter={(v: number | string) =>
                  formatBRL(typeof v === "number" ? v.toFixed(2) : v)
                }
                labelFormatter={(v: number | string) => `Período ${String(v)}`}
              />
              <Legend />
              {seriesKeys.map((s) => (
                <Line
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.label}
                  stroke={colorForKind(s.kind)}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-sm text-slate-500">
          Nenhuma série disponível para plotar.
        </p>
      )}
    </figure>
  );
}
