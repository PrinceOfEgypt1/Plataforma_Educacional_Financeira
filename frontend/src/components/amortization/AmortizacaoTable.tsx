import { formatBRL } from "@/lib/money";
import type { AmortizationPeriodRow } from "@/types/amortization";

export interface AmortizacaoTableProps {
  readonly rows: ReadonlyArray<AmortizationPeriodRow>;
  readonly caption?: string;
  readonly testId?: string;
}

export function AmortizacaoTable({
  rows,
  caption = "Tabela de amortizacao",
  testId = "amortizacao-table",
}: AmortizacaoTableProps) {
  return (
    <div
      role="region"
      aria-label={caption}
      className="max-h-[520px] overflow-auto rounded border border-slate-200"
      data-testid={testId}
    >
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="sticky top-0 bg-slate-50">
          <tr>
            <ColumnHeader align="left">Periodo</ColumnHeader>
            <ColumnHeader>Saldo inicial</ColumnHeader>
            <ColumnHeader>Juros</ColumnHeader>
            <ColumnHeader>Amortizacao</ColumnHeader>
            <ColumnHeader>Parcela</ColumnHeader>
            <ColumnHeader>Saldo final</ColumnHeader>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.periodo}
              className="border-t border-slate-100 even:bg-slate-50/50"
            >
              <th scope="row" className="px-3 py-1.5 text-left font-medium">
                {row.periodo}
              </th>
              <MoneyCell value={row.saldo_inicial} />
              <MoneyCell value={row.juros} />
              <MoneyCell value={row.amortizacao} />
              <MoneyCell value={row.parcela} />
              <MoneyCell value={row.saldo_final} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export interface CompareTablesProps {
  readonly price: ReadonlyArray<AmortizationPeriodRow>;
  readonly sac: ReadonlyArray<AmortizationPeriodRow>;
}

export function CompareTables({ price, sac }: CompareTablesProps) {
  return (
    <div
      data-testid="amortizacao-compare-tables"
      className="grid grid-cols-1 gap-4 xl:grid-cols-2"
    >
      <AmortizacaoTable
        rows={price}
        caption="Tabela de amortizacao PRICE"
        testId="amortizacao-price-table"
      />
      <AmortizacaoTable
        rows={sac}
        caption="Tabela de amortizacao SAC"
        testId="amortizacao-sac-table"
      />
    </div>
  );
}

function ColumnHeader({
  children,
  align = "right",
}: {
  readonly children: string;
  readonly align?: "left" | "right";
}) {
  return (
    <th
      scope="col"
      className={
        align === "left"
          ? "px-3 py-2 text-left font-semibold"
          : "px-3 py-2 text-right font-semibold"
      }
    >
      {children}
    </th>
  );
}

function MoneyCell({ value }: { readonly value: string }) {
  return (
    <td className="px-3 py-1.5 text-right tabular-nums">{formatBRL(value)}</td>
  );
}
