import { formatBRL } from "@/lib/money";
import type { FinanciamentoPeriodo } from "@/types/financing";

interface FinanciamentoTableProps {
  readonly parcelas: ReadonlyArray<FinanciamentoPeriodo>;
}

export function FinanciamentoTable({ parcelas }: FinanciamentoTableProps) {
  const hasEncargos = parcelas.some((p) => parseFloat(p.encargos) > 0);
  const caption = `Parcelas do financiamento (${parcelas.length} parcelas)`;

  return (
    <div
      className="flex flex-col gap-2"
      data-testid="financiamento-table"
      aria-label="Tabela de parcelas do financiamento"
    >
      <h3 className="text-sm font-semibold text-gray-800">
        Tabela de parcelas
        <span
          className="text-gray-500 font-normal ml-1"
          data-testid="financiamento-table-count"
        >
          ({parcelas.length} parcelas)
        </span>
      </h3>

      <div
        className="grid gap-2 md:hidden"
        data-testid="financiamento-mobile-list"
      >
        {parcelas.map((p) => (
          <article
            key={p.numero}
            className="rounded border border-gray-100 bg-white p-3 shadow-sm"
            data-testid={`parcela-mobile-card-${p.numero}`}
            aria-label={`Parcela ${p.numero}`}
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <h4 className="text-sm font-semibold text-blue-900">
                Parcela {p.numero}
              </h4>
              <span className="text-sm font-semibold text-blue-800 tabular-nums">
                {formatBRL(p.prestacao)}
              </span>
            </div>
            <dl className="grid grid-cols-1 gap-1 text-xs text-gray-600">
              <div className="flex items-center justify-between gap-3">
                <dt>Saldo inicial</dt>
                <dd className="font-medium tabular-nums">
                  {formatBRL(p.saldo_inicial)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt>Juros</dt>
                <dd className="font-medium text-amber-700 tabular-nums">
                  {formatBRL(p.juros)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt>Amortização</dt>
                <dd className="font-medium tabular-nums">
                  {formatBRL(p.amortizacao)}
                </dd>
              </div>
              {hasEncargos && (
                <div className="flex items-center justify-between gap-3">
                  <dt>Encargos</dt>
                  <dd className="font-medium tabular-nums">
                    {formatBRL(p.encargos)}
                  </dd>
                </div>
              )}
              <div className="flex items-center justify-between gap-3">
                <dt>Prestação</dt>
                <dd className="font-semibold text-blue-800 tabular-nums">
                  {formatBRL(p.prestacao)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt>Saldo final</dt>
                <dd className="font-medium tabular-nums">
                  {formatBRL(p.saldo_final)}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="hidden max-h-[32rem] overflow-y-auto rounded border border-gray-100 md:block">
        <table
          className="w-full border-collapse text-xs tabular-nums"
          aria-label="Parcelas do financiamento"
        >
          <caption className="sr-only">{caption}</caption>
          <thead className="sticky top-0 z-10">
            <tr className="bg-blue-100 text-blue-900">
              <th scope="col" className="px-2 py-1 text-right">
                #
              </th>
              <th scope="col" className="px-2 py-1 text-right">
                Saldo inicial
              </th>
              <th scope="col" className="px-2 py-1 text-right">
                Juros
              </th>
              <th scope="col" className="px-2 py-1 text-right">
                Amortização
              </th>
              {hasEncargos && (
                <th scope="col" className="px-2 py-1 text-right">
                  Encargos
                </th>
              )}
              <th scope="col" className="px-2 py-1 text-right font-semibold">
                Prestação
              </th>
              <th scope="col" className="px-2 py-1 text-right">
                Saldo final
              </th>
            </tr>
          </thead>
          <tbody>
            {parcelas.map((p) => (
              <tr
                key={p.numero}
                className="border-b border-gray-100 hover:bg-gray-50"
                data-testid={`parcela-row-${p.numero}`}
              >
                <th
                  scope="row"
                  className="px-2 py-1 text-right font-medium text-gray-500"
                >
                  {p.numero}
                </th>
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
    </div>
  );
}
