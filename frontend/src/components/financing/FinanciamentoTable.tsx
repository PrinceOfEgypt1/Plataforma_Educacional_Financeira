"use client";

import { useMemo, useState } from "react";

import { formatBRL } from "@/lib/money";
import type {
  FinanciamentoImobSummary,
  FinanciamentoPeriodo,
} from "@/types/financing";

interface FinanciamentoTableProps {
  readonly parcelas: ReadonlyArray<FinanciamentoPeriodo>;
  readonly summary?: FinanciamentoImobSummary;
}

const PAGE_SIZE = 12;

type TotalField = "juros" | "amortizacao" | "encargos" | "prestacao";

function clampPage(page: number, totalPages: number): number {
  return Math.min(Math.max(page, 1), Math.max(totalPages, 1));
}

function getVisibleParcelas(
  parcelas: ReadonlyArray<FinanciamentoPeriodo>,
  startIndex: number,
): ReadonlyArray<FinanciamentoPeriodo> {
  const endIndex = Math.min(startIndex + PAGE_SIZE, parcelas.length);
  const visible: FinanciamentoPeriodo[] = [];

  for (let index = startIndex; index < endIndex; index += 1) {
    const parcela = parcelas[index];

    if (parcela !== undefined) {
      visible.push(parcela);
    }
  }

  return visible;
}

function sumMoney(
  parcelas: ReadonlyArray<FinanciamentoPeriodo>,
  field: TotalField,
): string {
  let total = 0;
  for (const parcela of parcelas) {
    const value = Number.parseFloat(parcela[field]);
    total += Number.isFinite(value) ? value : 0;
  }
  return total.toFixed(2);
}

function getFinalBalance(
  parcelas: ReadonlyArray<FinanciamentoPeriodo>,
): string {
  const last = parcelas[parcelas.length - 1];
  return last?.saldo_final ?? "0.00";
}

export function FinanciamentoTable({
  parcelas,
  summary,
}: FinanciamentoTableProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(Math.ceil(parcelas.length / PAGE_SIZE), 1);
  const currentPage = clampPage(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleParcelas = getVisibleParcelas(parcelas, startIndex);
  const hasEncargos = parcelas.some((p) => parseFloat(p.encargos) > 0);
  const firstVisible = visibleParcelas[0]?.numero ?? 0;
  const lastVisible =
    visibleParcelas[visibleParcelas.length - 1]?.numero ?? firstVisible;
  const caption = `${parcelas.length} parcelas geradas; exibindo parcelas ${firstVisible}-${lastVisible}`;
  const totalPago = summary?.total_pago ?? sumMoney(parcelas, "prestacao");
  const totalJuros = summary?.total_juros ?? sumMoney(parcelas, "juros");
  const totalAmortizado =
    summary?.total_amortizado ?? sumMoney(parcelas, "amortizacao");
  const totalEncargos =
    summary?.total_encargos ?? sumMoney(parcelas, "encargos");
  const saldoFinal = getFinalBalance(parcelas);

  const selected = useMemo(
    () => visibleParcelas[0] ?? parcelas[0],
    [parcelas, visibleParcelas],
  );

  function goToParcel(raw: string) {
    const parcela = Number.parseInt(raw, 10);
    if (!Number.isFinite(parcela)) return;
    setPage(clampPage(Math.ceil(parcela / PAGE_SIZE), totalPages));
  }

  return (
    <section
      className="flex h-full min-h-0 flex-col gap-3 overflow-hidden"
      data-testid="financiamento-table-legacy"
      aria-label="Tabela de parcelas do financiamento"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cyan-300/15 bg-slate-950/40 p-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-50">
            Tabela financeira profissional
          </h3>
          <p
            className="text-xs text-cyan-100/70"
            data-testid="financiamento-table-count-legacy"
          >
            {parcelas.length} parcelas geradas e preservadas no modelo
          </p>
        </div>
        <div
          className="flex flex-wrap items-center gap-2 text-xs"
          aria-label="Navegação por faixas de parcelas"
        >
          <button
            className="rounded-md border border-white/10 px-2 py-1 text-slate-100 disabled:opacity-40"
            type="button"
            disabled={currentPage === 1}
            onClick={() => setPage(1)}
          >
            Primeira
          </button>
          <button
            className="rounded-md border border-white/10 px-2 py-1 text-slate-100 disabled:opacity-40"
            type="button"
            disabled={currentPage === 1}
            onClick={() => setPage(currentPage - 1)}
          >
            Bloco anterior
          </button>
          <span
            className="rounded-md bg-cyan-300/10 px-2 py-1 font-semibold text-cyan-100"
            data-testid="financiamento-table-range-legacy"
          >
            Parcelas {firstVisible}-{lastVisible}
          </span>
          <button
            className="rounded-md border border-white/10 px-2 py-1 text-slate-100 disabled:opacity-40"
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setPage(currentPage + 1)}
          >
            Próximo bloco
          </button>
          <button
            className="rounded-md border border-white/10 px-2 py-1 text-slate-100 disabled:opacity-40"
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setPage(totalPages)}
          >
            Última
          </button>
          <label className="flex items-center gap-1 text-cyan-100/70">
            Ir para parcela
            <input
              className="w-16 rounded-md border border-white/10 bg-slate-900 px-2 py-1 text-slate-50 outline-none focus:border-cyan-300"
              type="number"
              min={1}
              max={parcelas.length}
              onChange={(event) => goToParcel(event.target.value)}
              aria-label="Ir para parcela"
            />
          </label>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div className="min-w-0 overflow-hidden rounded-xl border border-cyan-300/15 bg-slate-950/50">
          <table
            className="w-full table-fixed border-collapse text-[11px] tabular-nums text-slate-200"
            aria-label="Parcelas do financiamento"
          >
            <caption className="sr-only">{caption}</caption>
            <thead>
              <tr className="bg-slate-900 text-cyan-100">
                <th scope="col" className="w-12 px-2 py-2 text-right">
                  #
                </th>
                <th scope="col" className="px-2 py-2 text-right">
                  Saldo
                </th>
                <th scope="col" className="px-2 py-2 text-right">
                  Juros
                </th>
                <th scope="col" className="px-2 py-2 text-right">
                  Amort.
                </th>
                {hasEncargos && (
                  <th scope="col" className="px-2 py-2 text-right">
                    Enc.
                  </th>
                )}
                <th scope="col" className="px-2 py-2 text-right">
                  Parcela
                </th>
                <th scope="col" className="px-2 py-2 text-right">
                  Final
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleParcelas.map((p) => (
                <tr
                  key={p.numero}
                  className="border-t border-white/5 hover:bg-cyan-300/5"
                  data-testid={`parcela-row-${p.numero}`}
                >
                  <th
                    scope="row"
                    className="px-2 py-1.5 text-right font-semibold text-cyan-100"
                  >
                    {p.numero}
                  </th>
                  <td className="truncate px-2 py-1.5 text-right">
                    {formatBRL(p.saldo_inicial)}
                  </td>
                  <td className="truncate px-2 py-1.5 text-right text-amber-200">
                    {formatBRL(p.juros)}
                  </td>
                  <td className="truncate px-2 py-1.5 text-right">
                    {formatBRL(p.amortizacao)}
                  </td>
                  {hasEncargos && (
                    <td className="truncate px-2 py-1.5 text-right text-slate-300">
                      {formatBRL(p.encargos)}
                    </td>
                  )}
                  <td className="truncate px-2 py-1.5 text-right font-semibold text-cyan-100">
                    {formatBRL(p.prestacao)}
                  </td>
                  <td className="truncate px-2 py-1.5 text-right">
                    {formatBRL(p.saldo_final)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr
                className="border-t border-cyan-200/20 bg-cyan-300/10 font-semibold text-cyan-50"
                data-testid="financiamento-table-totals-legacy"
              >
                <th scope="row" className="px-2 py-2 text-right">
                  Total
                </th>
                <td className="truncate px-2 py-2 text-right">
                  {formatBRL(totalPago)}
                </td>
                <td className="truncate px-2 py-2 text-right text-amber-100">
                  {formatBRL(totalJuros)}
                </td>
                <td className="truncate px-2 py-2 text-right">
                  {formatBRL(totalAmortizado)}
                </td>
                {hasEncargos && (
                  <td className="truncate px-2 py-2 text-right">
                    {formatBRL(totalEncargos)}
                  </td>
                )}
                <td className="truncate px-2 py-2 text-right">
                  {formatBRL(totalPago)}
                </td>
                <td className="truncate px-2 py-2 text-right">
                  {formatBRL(saldoFinal)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {selected && (
          <aside
            className="rounded-xl border border-emerald-300/15 bg-emerald-300/10 p-3 text-xs text-emerald-50"
            data-testid="financiamento-parcela-detalhe-legacy"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-200/80">
              Resumo do bloco
            </p>
            <h4 className="mt-1 text-sm font-semibold">
              Faixa {firstVisible}-{lastVisible}
            </h4>
            <dl className="mt-3 space-y-2">
              <div className="flex justify-between gap-3">
                <dt>Parcelas no prazo</dt>
                <dd className="font-semibold">{parcelas.length}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Total de juros</dt>
                <dd className="font-semibold">{formatBRL(totalJuros)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Total pago</dt>
                <dd className="font-semibold">{formatBRL(totalPago)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Saldo final</dt>
                <dd className="font-semibold">{formatBRL(saldoFinal)}</dd>
              </div>
            </dl>
            <p className="mt-3 leading-5 text-emerald-50/75">
              Todos os dados permanecem disponíveis. A interface mostra faixas
              compactas para caber no painel sem rolagem horizontal da página.
            </p>
          </aside>
        )}
      </div>
    </section>
  );
}
