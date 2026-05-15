"use client";

/**
 * RealEstateFinancingTable — Tabela financeira educativa redesenhada
 *
 * ITEM 14D-B: Redesenho visual completo inspirado no protótipo Financial Observatory.
 * - Guia de leitura com cores de cada coluna
 * - Paginação por blocos com label dinâmico
 * - Highlights na 1ª e última linha visível
 * - Aside pedagógico contextual
 * - Sem scroll horizontal
 * - tfoot semanticamente correto (total pago na coluna Parcela, não Saldo)
 */

import { useMemo, useState } from "react";

import { formatBRL } from "@/lib/money";
import type {
  FinanciamentoImobSummary,
  FinanciamentoPeriodo,
} from "@/types/financing";

interface Props {
  readonly parcelas: ReadonlyArray<FinanciamentoPeriodo>;
  readonly summary?: FinanciamentoImobSummary;
}

const PAGE_SIZE = 12;

function clamp(v: number, min: number, max: number): number {
  return Math.min(Math.max(v, min), max);
}

function sumField(
  rows: ReadonlyArray<FinanciamentoPeriodo>,
  field: "juros" | "amortizacao" | "encargos" | "prestacao",
): string {
  let t = 0;
  for (const r of rows) {
    const v = parseFloat(r[field]);
    t += Number.isFinite(v) ? v : 0;
  }
  return t.toFixed(2);
}

export function RealEstateFinancingTable({ parcelas, summary }: Props) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(Math.ceil(parcelas.length / PAGE_SIZE), 1);
  const curr = clamp(page, 1, totalPages);
  const start = (curr - 1) * PAGE_SIZE;
  const visible = useMemo(
    () => parcelas.slice(start, start + PAGE_SIZE),
    [parcelas, start],
  );

  const hasEncargos = parcelas.some((p) => parseFloat(p.encargos) > 0);
  const firstNum = visible[0]?.numero ?? 0;
  const lastNum = visible[visible.length - 1]?.numero ?? firstNum;

  const totalPago = summary?.total_pago ?? sumField(parcelas, "prestacao");
  const totalJuros = summary?.total_juros ?? sumField(parcelas, "juros");
  const totalAmort =
    summary?.total_amortizado ?? sumField(parcelas, "amortizacao");
  const totalEnc = hasEncargos
    ? (summary?.total_encargos ?? sumField(parcelas, "encargos"))
    : null;
  const saldoFinal = parcelas[parcelas.length - 1]?.saldo_final ?? "0.00";

  const sistemaLabel = summary?.sistema_amortizacao ?? "SAC";
  const isSAC = sistemaLabel === "SAC";

  return (
    <section
      className="flex h-full min-h-0 flex-col gap-2.5"
      data-testid="financiamento-table"
      aria-label="Tabela de parcelas do financiamento"
    >
      {/* ── Guia de leitura ─────────────────────── */}
      <div
        className="flex items-start gap-2.5 rounded-xl border border-cyan-300/15 bg-slate-950/50 px-3 py-2.5"
        data-testid="tabela-guia-leitura"
      >
        <span className="mt-0.5 text-base" aria-hidden="true">
          📖
        </span>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-300">
            Guia de leitura
          </p>
          <p className="text-[11px] font-semibold text-slate-200">
            Como ler esta tabela
          </p>
          <p className="mt-0.5 text-[11px] leading-4.5 text-slate-400">
            <span className="font-semibold text-slate-300">Saldo inicial</span>{" "}
            — valor ainda devido.{" "}
            <span className="font-semibold text-amber-300">Juros</span> — custo
            do mês sobre o saldo.{" "}
            <span className="font-semibold text-emerald-300">Amort.</span> —
            redução real da dívida.{" "}
            <span className="font-semibold text-cyan-300">Parcela</span> — total
            a pagar no mês.
          </p>
        </div>
      </div>

      {/* ── Layout principal: tabela + aside ──── */}
      <div className="grid min-h-0 flex-1 gap-2.5 overflow-hidden lg:grid-cols-[minmax(0,1fr)_220px]">
        {/* Tabela */}
        <div className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border border-cyan-300/12 bg-slate-950/50">
          {/* Controles de paginação */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-white/5 bg-slate-900/60 px-2.5 py-1.5">
            <span className="sr-only" data-testid="financiamento-table-count">
              {parcelas.length} parcelas geradas e preservadas no modelo
            </span>
            <span
              className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500"
              data-testid="financiamento-table-range"
            >
              {parcelas.length} parcelas geradas · bloco {curr}/{totalPages} ·{" "}
              {firstNum}–{lastNum}
            </span>
            <div className="ml-auto flex items-center gap-1">
              <button
                type="button"
                disabled={curr === 1}
                onClick={() => setPage(1)}
                className="rounded-md border border-white/10 px-2 py-0.5 text-[10px] text-slate-300 disabled:opacity-30 hover:border-cyan-400/40 hover:text-cyan-200"
              >
                ««
              </button>
              <button
                type="button"
                disabled={curr === 1}
                onClick={() => setPage(curr - 1)}
                className="rounded-md border border-white/10 px-2 py-0.5 text-[10px] text-slate-300 disabled:opacity-30 hover:border-cyan-400/40 hover:text-cyan-200"
              >
                ‹ Ant.
              </button>
              <span className="rounded-md bg-cyan-400/12 px-2 py-0.5 text-[10px] font-semibold text-cyan-200">
                {firstNum}–{lastNum}
              </span>
              <button
                type="button"
                disabled={curr === totalPages}
                onClick={() => setPage(curr + 1)}
                className="rounded-md border border-white/10 px-2 py-0.5 text-[10px] text-slate-300 disabled:opacity-30 hover:border-cyan-400/40 hover:text-cyan-200"
              >
                Próx. ›
              </button>
              <button
                type="button"
                disabled={curr === totalPages}
                onClick={() => setPage(totalPages)}
                className="rounded-md border border-white/10 px-2 py-0.5 text-[10px] text-slate-300 disabled:opacity-30 hover:border-cyan-400/40 hover:text-cyan-200"
              >
                »»
              </button>
            </div>
          </div>

          {/* Scroll interno da tabela */}
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
            <table
              className="w-full border-collapse text-[11px] tabular-nums"
              aria-label="Parcelas do financiamento"
            >
              <caption className="sr-only">
                {parcelas.length} parcelas geradas e preservadas no modelo ·
                sistema {sistemaLabel} · exibindo {firstNum}–{lastNum}
              </caption>
              <thead className="sticky top-0 z-10">
                <tr className="bg-slate-900 text-[9px] uppercase tracking-[0.1em]">
                  <th
                    scope="col"
                    className="w-10 px-2 py-2 text-right text-slate-400"
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-2 text-right text-slate-400"
                  >
                    Saldo
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-2 text-right text-amber-400/80"
                  >
                    Juros
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-2 text-right text-emerald-400/80"
                  >
                    Amort.
                  </th>
                  {hasEncargos && (
                    <th
                      scope="col"
                      className="px-2 py-2 text-right text-slate-400"
                    >
                      Enc.
                    </th>
                  )}
                  <th
                    scope="col"
                    className="px-2 py-2 text-right text-cyan-400/80"
                  >
                    Parcela
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-2 text-right text-slate-400"
                  >
                    Final
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((p, idx) => {
                  const isFirst = idx === 0;
                  const isLast = idx === visible.length - 1;
                  const highlight = isFirst || isLast;
                  return (
                    <tr
                      key={p.numero}
                      className={`border-t border-white/4 transition-colors hover:bg-cyan-300/5 ${highlight ? "bg-cyan-400/6" : ""}`}
                      data-testid={`parcela-row-${p.numero}`}
                    >
                      <th
                        scope="row"
                        className={`px-2 py-1.5 text-right text-[10px] font-semibold ${highlight ? "text-cyan-200" : "text-slate-500"}`}
                      >
                        {p.numero}
                      </th>
                      <td className="px-2 py-1.5 text-right text-slate-300">
                        {formatBRL(p.saldo_inicial)}
                      </td>
                      <td className="px-2 py-1.5 text-right font-medium text-amber-300">
                        {formatBRL(p.juros)}
                      </td>
                      <td className="px-2 py-1.5 text-right text-emerald-300">
                        {formatBRL(p.amortizacao)}
                      </td>
                      {hasEncargos && (
                        <td className="px-2 py-1.5 text-right text-slate-400">
                          {formatBRL(p.encargos)}
                        </td>
                      )}
                      <td className="px-2 py-1.5 text-right font-semibold text-cyan-200">
                        {formatBRL(p.prestacao)}
                      </td>
                      <td className="px-2 py-1.5 text-right text-slate-400">
                        {formatBRL(p.saldo_final)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr
                  className="border-t border-cyan-200/20 bg-cyan-400/8 text-[10px] font-semibold"
                  data-testid="financiamento-table-totals"
                >
                  <th
                    scope="row"
                    className="px-2 py-2 text-right text-slate-300"
                  >
                    Total
                  </th>
                  {/* Saldo total não tem soma significativa — deixar vazio */}
                  <td className="px-2 py-2 text-right text-slate-500">—</td>
                  <td className="px-2 py-2 text-right text-amber-200">
                    {formatBRL(totalJuros)}
                  </td>
                  <td className="px-2 py-2 text-right text-emerald-200">
                    {formatBRL(totalAmort)}
                  </td>
                  {hasEncargos && totalEnc !== null && (
                    <td className="px-2 py-2 text-right text-slate-300">
                      {formatBRL(totalEnc)}
                    </td>
                  )}
                  {/* Total pago fica na coluna Parcela — não na coluna Saldo */}
                  <td className="px-2 py-2 text-right text-cyan-100">
                    {formatBRL(totalPago)}
                  </td>
                  <td className="px-2 py-2 text-right text-emerald-300">
                    {formatBRL(saldoFinal)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Aside pedagógico */}
        <aside
          className="rounded-xl border border-emerald-300/15 bg-emerald-400/8 p-3"
          data-testid="financiamento-parcela-detalhe"
        >
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-300/80">
            Leitura pedagógica
          </p>
          <h4 className="mt-1 text-[12px] font-semibold text-slate-100">
            {sistemaLabel} · Bloco {curr}
          </h4>
          <p className="mt-0.5 text-[10px] text-emerald-300/70">
            Parcelas {firstNum}–{lastNum}
          </p>

          <dl className="mt-3 space-y-2">
            <div>
              <dt className="text-[10px] font-semibold text-emerald-200/80">
                1ª parcela do bloco
              </dt>
              <dd className="font-mono text-[12px] font-semibold text-slate-100">
                {formatBRL(visible[0]?.prestacao ?? "0.00")}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold text-emerald-200/80">
                Última parcela do bloco
              </dt>
              <dd className="font-mono text-[12px] font-semibold text-slate-100">
                {formatBRL(visible[visible.length - 1]?.prestacao ?? "0.00")}
              </dd>
            </div>

            <div className="border-t border-emerald-300/15 pt-2">
              <dt className="text-[10px] font-semibold text-emerald-200/80">
                Totais do contrato
              </dt>
              <dd className="mt-1 space-y-1">
                {[
                  {
                    label: "Parcelas",
                    val: String(parcelas.length),
                    mono: true,
                  },
                  { label: "Juros", val: formatBRL(totalJuros), mono: true },
                  {
                    label: "Total pago",
                    val: formatBRL(totalPago),
                    mono: true,
                  },
                  {
                    label: "Saldo final",
                    val: formatBRL(saldoFinal),
                    mono: true,
                    em: true,
                  },
                ].map(({ label, val, em }) => (
                  <div
                    key={label}
                    className="flex justify-between gap-1 text-[10px]"
                  >
                    <span className="text-emerald-300/60">{label}:</span>
                    <span
                      className={`font-semibold ${em === true ? "text-emerald-300" : "text-slate-100"}`}
                    >
                      {val}
                    </span>
                  </div>
                ))}
              </dd>
            </div>
          </dl>

          <div className="mt-3 border-t border-emerald-300/15 pt-3">
            <p className="text-[10px] leading-4.5 text-emerald-50/70">
              {isSAC ? (
                <>
                  <strong className="text-emerald-200">SAC:</strong> Amortização
                  constante — o saldo cai linearmente. Juros e parcela diminuem
                  todo mês.
                </>
              ) : (
                <>
                  <strong className="text-emerald-200">PRICE:</strong> Parcela
                  constante — amortização cresce e juros caem, compensando-se ao
                  longo do prazo.
                </>
              )}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
