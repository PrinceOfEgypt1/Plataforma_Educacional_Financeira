"use client";

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
import type {
  AmortizationChart,
  AmortizationChartKind,
} from "@/types/amortization";

interface ChartPoint {
  readonly periodo: number;
  readonly [seriesKey: string]: number;
}

function colorForKind(kind: AmortizationChartKind): string {
  if (kind === "sac") return "var(--color-financial-positive, #16a34a)";
  return "var(--color-financial-neutral, #2563eb)";
}

function buildPoints(chart: AmortizationChart): {
  readonly points: ReadonlyArray<ChartPoint>;
  readonly seriesKeys: ReadonlyArray<{
    readonly key: string;
    readonly label: string;
    readonly kind: AmortizationChartKind;
  }>;
} {
  const seriesKeys = chart.series.map((series, index) => ({
    key: `s${String(index)}`,
    label: series.label,
    kind: series.kind,
  }));
  const maxLen = chart.series.reduce(
    (current, series) => Math.max(current, series.points.length),
    0,
  );
  const points: ChartPoint[] = [];
  for (let index = 0; index < maxLen; index += 1) {
    const point: Record<string, number> = { periodo: index + 1 };
    chart.series.forEach((series, seriesIndex) => {
      const raw = series.points[index];
      if (raw !== undefined) {
        const value = Number(raw);
        if (Number.isFinite(value)) {
          point[`s${String(seriesIndex)}`] = value;
        }
      }
    });
    points.push(point as ChartPoint);
  }
  return { points, seriesKeys };
}

export interface AmortizacaoSaldoChartProps {
  readonly chart: AmortizationChart;
  readonly heightPx?: number;
}

export function AmortizacaoSaldoChart({
  chart,
  heightPx = 320,
}: AmortizacaoSaldoChartProps) {
  const { points, seriesKeys } = buildPoints(chart);
  const hasData = points.length > 0 && seriesKeys.length > 0;

  return (
    <figure
      data-testid="amortizacao-saldo-chart"
      aria-label="Grafico de evolucao do saldo devedor por periodo"
    >
      <figcaption className="sr-only">
        Evolucao do saldo devedor ao longo de {String(points.length)} periodos.
      </figcaption>
      {hasData ? (
        <div style={{ width: "100%", height: heightPx }}>
          <ResponsiveContainer minWidth={1} minHeight={1}>
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
                tickFormatter={(value: number) => formatBRL(value.toFixed(2))}
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
                formatter={(value: number | string) =>
                  formatBRL(
                    typeof value === "number" ? value.toFixed(2) : value,
                  )
                }
                labelFormatter={(value: number | string) =>
                  `Periodo ${String(value)}`
                }
              />
              <Legend />
              {seriesKeys.map((series) => (
                <Line
                  key={series.key}
                  type="monotone"
                  dataKey={series.key}
                  name={series.label}
                  stroke={colorForKind(series.kind)}
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
          Nenhuma serie disponivel para plotar.
        </p>
      )}
    </figure>
  );
}
