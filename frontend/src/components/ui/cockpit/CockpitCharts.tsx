"use client";

import {
  CartesianGrid,
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
  AmortizationPeriodRow,
} from "@/types/amortization";
import type { Chart as InterestChart } from "@/types/interest";

interface Point {
  readonly periodo: number;
  readonly [key: string]: number;
}

interface SeriesMeta {
  readonly key: string;
  readonly label: string;
  readonly color: string;
  readonly help: string;
}

const COLORS = {
  teal: "#00d4c8",
  amber: "#f59e0b",
  red: "#f43f5e",
} as const;

function toNumber(value: string): number {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

function money(value: number): string {
  return formatBRL(value.toFixed(2));
}

function buildFromInterest(chart: InterestChart): {
  readonly points: ReadonlyArray<Point>;
  readonly series: ReadonlyArray<SeriesMeta>;
} {
  const series = chart.series.map((item, index) => ({
    key: `s${index}`,
    label: item.label,
    color: item.kind === "composto" ? COLORS.amber : COLORS.teal,
    help:
      item.kind === "composto"
        ? "crescimento acumulado pelo regime composto"
        : "crescimento linear do regime simples",
  }));
  const max = chart.series.reduce(
    (acc, item) => Math.max(acc, item.points.length),
    0,
  );
  const points: Point[] = [];
  for (let index = 0; index < max; index += 1) {
    const point: Record<string, number> = { periodo: index + 1 };
    chart.series.forEach((item, seriesIndex) => {
      const raw = item.points[index];
      if (raw !== undefined) point[`s${seriesIndex}`] = toNumber(raw);
    });
    points.push(point as Point);
  }
  return { points, series };
}

function buildFromAmortizationRows(
  rows: ReadonlyArray<AmortizationPeriodRow>,
  mode: "composition" | "installments",
): {
  readonly points: ReadonlyArray<Point>;
  readonly series: ReadonlyArray<SeriesMeta>;
} {
  if (mode === "installments") {
    return {
      points: rows.map((row) => ({
        periodo: row.periodo,
        parcela: toNumber(row.parcela),
        juros: toNumber(row.juros),
      })),
      series: [
        {
          key: "parcela",
          label: "Parcela",
          color: COLORS.amber,
          help: "valor de parcela retornado pela API",
        },
        {
          key: "juros",
          label: "Juros",
          color: COLORS.red,
          help: "custo financeiro do período retornado pela API",
        },
      ],
    };
  }
  return {
    points: rows.map((row) => ({
      periodo: row.periodo,
      amortizacao: toNumber(row.amortizacao),
      juros: toNumber(row.juros),
    })),
    series: [
      {
        key: "amortizacao",
        label: "Amortização",
        color: COLORS.teal,
        help: "valor que reduz o saldo devedor",
      },
      {
        key: "juros",
        label: "Juros",
        color: COLORS.red,
        help: "custo financeiro do período",
      },
    ],
  };
}

function buildFromAmortizationChart(chart: AmortizationChart): {
  readonly points: ReadonlyArray<Point>;
  readonly series: ReadonlyArray<SeriesMeta>;
} {
  const series = chart.series.map((item, index) => ({
    key: `s${index}`,
    label: item.label,
    color: item.kind === "sac" ? COLORS.amber : COLORS.teal,
    help:
      item.kind === "sac"
        ? "trajetória do sistema SAC"
        : "trajetória do sistema PRICE",
  }));
  const max = chart.series.reduce(
    (acc, item) => Math.max(acc, item.points.length),
    0,
  );
  const points: Point[] = [];
  for (let index = 0; index < max; index += 1) {
    const point: Record<string, number> = { periodo: index + 1 };
    chart.series.forEach((item, seriesIndex) => {
      const raw = item.points[index];
      if (raw !== undefined) point[`s${seriesIndex}`] = toNumber(raw);
    });
    points.push(point as Point);
  }
  return { points, series };
}

function RichTooltip({
  active,
  label,
  payload,
  series,
  context,
}: {
  readonly active: boolean;
  readonly label: string | number | undefined;
  readonly payload:
    | ReadonlyArray<{
        readonly dataKey?: unknown;
        readonly value?: unknown;
      }>
    | undefined;
  readonly series: ReadonlyArray<SeriesMeta>;
  readonly context: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="cockpit-tooltip">
      <div className="cockpit-tooltip-title">
        {context} · Período {String(label)}
      </div>
      {payload.map((entry) => {
        const key = String(entry.dataKey);
        const meta = series.find((item) => item.key === key);
        const value =
          typeof entry.value === "number"
            ? entry.value
            : Number(entry.value ?? 0);
        return (
          <div key={key} className="cockpit-tooltip-row">
            {meta?.label ?? key}: {money(value)}
            {meta ? ` · ${meta.help}` : ""}
          </div>
        );
      })}
    </div>
  );
}

function CockpitLineChart({
  points,
  series,
  context,
}: {
  readonly points: ReadonlyArray<Point>;
  readonly series: ReadonlyArray<SeriesMeta>;
  readonly context: string;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={points as Point[]}
        margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
      >
        <CartesianGrid stroke="rgba(0,212,200,0.10)" strokeDasharray="3 3" />
        <XAxis
          dataKey="periodo"
          tick={{ fill: "#7a8fa8", fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: "rgba(0,212,200,0.16)" }}
        />
        <YAxis
          width={84}
          tickFormatter={money}
          tick={{ fill: "#7a8fa8", fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: "rgba(0,212,200,0.16)" }}
        />
        <Tooltip
          content={(props) => (
            <RichTooltip
              active={props.active ?? false}
              label={props.label}
              payload={props.payload}
              series={series}
              context={context}
            />
          )}
        />
        {series.map((item) => (
          <Line
            key={item.key}
            type="monotone"
            dataKey={item.key}
            name={item.label}
            stroke={item.color}
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 5, strokeWidth: 0 }}
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function InterestCockpitChart({
  chart,
  context,
}: {
  readonly chart: InterestChart | null;
  readonly context: string;
}) {
  if (!chart) return <div className="cockpit-error">Gráfico indisponível.</div>;
  const { points, series } = buildFromInterest(chart);
  return <CockpitLineChart points={points} series={series} context={context} />;
}

export function AmortizationCompositionChart({
  rows,
  context,
  mode = "composition",
}: {
  readonly rows: ReadonlyArray<AmortizationPeriodRow>;
  readonly context: string;
  readonly mode?: "composition" | "installments";
}) {
  const { points, series } = buildFromAmortizationRows(rows, mode);
  return <CockpitLineChart points={points} series={series} context={context} />;
}

export function AmortizationCompareChart({
  chart,
}: {
  readonly chart: AmortizationChart | null;
}) {
  if (!chart) return <div className="cockpit-error">Gráfico indisponível.</div>;
  const { points, series } = buildFromAmortizationChart(chart);
  return (
    <CockpitLineChart points={points} series={series} context="PRICE × SAC" />
  );
}
