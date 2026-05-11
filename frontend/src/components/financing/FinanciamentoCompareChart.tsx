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
import type { FinanciamentoImobCompareOut } from "@/types/financing";

interface ChartPoint {
  readonly periodo: number;
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
  const points: ChartPoint[] = [];
  for (let i = 0; i < len; i += 1) {
    const priceParcela = compare.price.parcelas[i];
    const sacParcela = compare.sac.parcelas[i];
    points.push({
      periodo: i + 1,
      price:
        priceParcela !== undefined ? parseFloat(priceParcela.prestacao) : 0,
      sac: sacParcela !== undefined ? parseFloat(sacParcela.prestacao) : 0,
    });
  }
  return points;
}

function money(value: number): string {
  return formatBRL(value.toFixed(2));
}

export interface FinanciamentoCompareChartProps {
  readonly compare: FinanciamentoImobCompareOut;
}

export function FinanciamentoCompareChart({
  compare,
}: FinanciamentoCompareChartProps) {
  const points = buildPoints(compare);

  return (
    <div
      className="flex flex-col gap-2"
      data-testid="financiamento-compare-chart"
    >
      <h3 className="text-sm font-semibold text-gray-800">
        Evolucao da prestacao - PRICE x SAC
      </h3>
      <div
        className="w-full"
        style={{ height: 260 }}
        aria-label="Grafico de comparacao PRICE e SAC"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={points as ChartPoint[]}
            margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
          >
            <CartesianGrid
              stroke="rgba(0,212,200,0.10)"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="periodo"
              tick={{ fill: "#7a8fa8", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(0,212,200,0.16)" }}
              label={{
                value: "Mes",
                position: "insideBottomRight",
                offset: -4,
                fill: "#7a8fa8",
                fontSize: 11,
              }}
            />
            <YAxis
              width={84}
              tickFormatter={money}
              tick={{ fill: "#7a8fa8", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(0,212,200,0.16)" }}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                money(value),
                name === "price" ? "PRICE" : "SAC",
              ]}
              labelFormatter={(label) => `Mes ${String(label)}`}
            />
            <Legend
              formatter={(value) => (value === "price" ? "PRICE" : "SAC")}
            />
            <Line
              type="monotone"
              dataKey="price"
              name="price"
              stroke="#00d4c8"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="sac"
              name="sac"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
