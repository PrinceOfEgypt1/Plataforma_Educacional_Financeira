import { formatBRL } from "@/lib/money";
import type { FinanciamentoPeriodo } from "@/types/financing";

interface FinanciamentoTableProps {
  readonly parcelas: ReadonlyArray<FinanciamentoPeriodo>;
  readonly maxRows?: number;
}

export function FinanciamentoTable({
  parcelas,
  maxRows = 24,
}: FinanciamentoTableProps) {
  const visible = parcelas.slice(0, maxRows);
  const hasMore = parcelas.length > maxRows;
  const hasEncargos = parcelas.some((p) => parseFloat(p.encargos) > 0);

  return (
    <div
      className="flex flex-col gap-2"
      data-testid="financiamento-table"
      aria-label="Tabela de parcelas do financiamento"
    >
      <h3 className="text-sm font-semibold text-gray-800">
        Tabela de parcelas
        {hasMore && (
          <span className="text-gray-500 font-normal ml-1">
            (exibindo {maxRows} de {parcelas.length})
          </span>
        )}
      </h3>
      <div className="overflow-x-auto">
        <table
          className="w-full text-xs border-collapse"
          aria-label="Parcelas do financiamento"
        >
          <thead>
            <tr className="bg-blue-100 text-blue-900">
              <th className="px-2 py-1 text-right">#</th>
              <th className="px-2 py-1 text-right">Saldo inicial</th>
              <th className="px-2 py-1 text-right">Juros</th>
              <th className="px-2 py-1 text-right">Amortização</th>
              {hasEncargos && (
                <th className="px-2 py-1 text-right">Encargos</th>
              )}
              <th className="px-2 py-1 text-right font-semibold">Prestação</th>
              <th className="px-2 py-1 text-right">Saldo final</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((p) => (
              <tr
                key={p.numero}
                className="border-b border-gray-100 hover:bg-gray-50"
                data-testid={`parcela-row-${p.numero}`}
              >
                <td className="px-2 py-1 text-right text-gray-500">
                  {p.numero}
                </td>
                <td className="px-2 py-1 text-right">
                  {formatBRL(p.saldo_inicial)}
                </td>
                <td className="px-2 py-1 text-right text-amber-700">
                  {formatBRL(p.juros)}
                </td>
                <td className="px-2 py-1 text-right">
                  {formatBRL(p.amortizacao)}
                </td>
                {hasEncargos && (
                  <td className="px-2 py-1 text-right text-gray-500">
                    {formatBRL(p.encargos)}
                  </td>
                )}
                <td className="px-2 py-1 text-right font-semibold text-blue-800">
                  {formatBRL(p.prestacao)}
                </td>
                <td className="px-2 py-1 text-right">
                  {formatBRL(p.saldo_final)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hasMore && (
        <p className="text-xs text-gray-400 text-center">
          … e mais {parcelas.length - maxRows} parcelas
        </p>
      )}
    </div>
  );
}
