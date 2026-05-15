"use client";

/**
 * FinanciamentoComponentesCET — Item 13 Correção Visual
 *
 * Tema dark integrado com o cockpit.
 * Tema dark: sem fundos claros, texto escuro ou bordas cinzas no dark mode.
 * 5 categorias pedagógicas + 3 percentuais por componente.
 * Sem .slice() hardcoded.
 */

import { formatBRL, formatPct } from "@/lib/money";
import type { ComponenteCet, ComponenteCetCategoria } from "@/types/financing";

const NATUREZA_LABEL: Record<string, string> = {
  calculado: "Calculado",
  informado: "Informado",
  nao_calculado: "Não calc.",
  alerta: "Alerta",
};

const NATUREZA_CLS: Record<string, string> = {
  calculado: "bg-emerald-400/15 text-emerald-200 ring-1 ring-emerald-400/20",
  informado: "bg-cyan-400/15 text-cyan-200 ring-1 ring-cyan-400/20",
  nao_calculado: "bg-white/8 text-slate-400 ring-1 ring-white/10",
  alerta: "bg-amber-400/15 text-amber-200 ring-1 ring-amber-400/20",
};

const CATEGORIA_LABEL: Record<ComponenteCetCategoria, string> = {
  base_operacao: "Base",
  componente_encargo: "Encargo",
  componente_cet: "CET",
  custo_inicial: "Custo inicial",
  totalizador_indicador: "Totalizador",
};

const CATEGORIA_CLS: Record<ComponenteCetCategoria, string> = {
  base_operacao: "bg-slate-400/15 text-slate-300 ring-1 ring-slate-400/20",
  componente_encargo: "bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-400/20",
  componente_cet: "bg-violet-400/15 text-violet-200 ring-1 ring-violet-400/20",
  custo_inicial: "bg-amber-400/15 text-amber-200 ring-1 ring-amber-400/20",
  totalizador_indicador:
    "bg-indigo-400/15 text-indigo-200 ring-1 ring-indigo-400/20",
};

interface RowProps {
  readonly c: ComponenteCet;
  readonly idx: number;
}

function ComponenteRow({ c, idx }: RowProps) {
  const isOmitido = c.natureza === "nao_calculado" || c.natureza === "alerta";
  const rowCls = isOmitido
    ? "opacity-50"
    : idx % 2 === 0
      ? "bg-white/3"
      : "bg-transparent";

  return (
    <tr
      className={`border-b border-white/5 ${rowCls}`}
      data-testid={`componente-cet-row-${c.id}`}
    >
      <td className="px-3 py-2.5">
        <p className="text-sm font-medium text-slate-100 leading-tight">
          {c.nome}
        </p>
        <p className="mt-0.5 font-mono text-[10px] text-slate-500 truncate max-w-xs">
          {c.formula}
        </p>
      </td>
      <td className="px-2 py-2.5 text-center">
        <span
          className={`inline-block rounded-full px-1.5 py-0.5 text-[10px] font-semibold whitespace-nowrap ${CATEGORIA_CLS[c.categoria] ?? ""}`}
        >
          {CATEGORIA_LABEL[c.categoria] ?? c.categoria}
        </span>
      </td>
      <td className="px-2 py-2.5 text-center">
        <span
          className={`inline-block rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${NATUREZA_CLS[c.natureza] ?? ""}`}
        >
          {NATUREZA_LABEL[c.natureza] ?? c.natureza}
        </span>
      </td>
      <td className="px-3 py-2.5 text-right">
        {isOmitido ? (
          <span className="text-slate-600 text-xs">—</span>
        ) : (
          <span className="tabular-nums text-sm font-semibold text-slate-50">
            {formatBRL(c.valor_total)}
          </span>
        )}
      </td>
      <td className="px-2 py-2.5 text-right tabular-nums text-xs text-slate-400">
        {isOmitido ? "—" : formatPct(c.pct_sobre_financiado)}
      </td>
      <td className="px-2 py-2.5 text-right tabular-nums text-xs text-slate-400">
        {isOmitido ? "—" : formatPct(c.pct_sobre_total_pago)}
      </td>
      <td className="px-2 py-2.5 text-right tabular-nums text-xs text-slate-400">
        {isOmitido || parseFloat(c.pct_sobre_custo_financeiro_total) === 0
          ? "—"
          : formatPct(c.pct_sobre_custo_financeiro_total)}
      </td>
      <td className="px-2 py-2.5 text-center text-sm">
        {c.entra_no_encargo_mensal ? (
          <span className="font-bold text-emerald-400">✓</span>
        ) : (
          <span className="text-slate-600">—</span>
        )}
      </td>
    </tr>
  );
}

interface Props {
  readonly componentes: ReadonlyArray<ComponenteCet>;
}

export function FinanciamentoComponentesCET({ componentes }: Props) {
  const reais = componentes.filter(
    (c) => c.natureza === "calculado" || c.natureza === "informado",
  );

  return (
    <div
      className="flex flex-col gap-3"
      data-testid="financiamento-componentes-cet"
      aria-label="Componentes do CET demonstrativo e do custo da simulação"
    >
      {/* ── Descrição ──────────────────────────────── */}
      <p className="text-sm leading-6 text-slate-300">
        Cada parcela carrega componentes distintos. Alguns são{" "}
        <strong className="text-violet-200">custos financeiros</strong> (juros,
        seguros, tarifas) e outros são{" "}
        <strong className="text-cyan-200">devolução do principal</strong>{" "}
        (amortização). O CET oficial engloba tudo isso — solicite-o à
        instituição financeira antes de contratar.
      </p>

      {/* ── Cards de resumo ────────────────────────── */}
      {reais.length > 0 && (
        <div
          className="grid grid-cols-2 gap-2 sm:grid-cols-3"
          data-testid="componentes-cet-resumo"
        >
          {reais.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border border-white/8 bg-white/5 p-2.5"
              data-testid={`componente-cet-card-${c.id}`}
            >
              <p className="text-[11px] text-slate-400 leading-tight truncate">
                {c.nome}
              </p>
              <p className="mt-1.5 text-base font-bold tabular-nums text-slate-50">
                {formatBRL(c.valor_total)}
              </p>
              <div className="mt-1 space-y-0.5">
                <p className="text-[11px] text-slate-400 tabular-nums">
                  {formatPct(c.pct_sobre_financiado)}{" "}
                  <span className="text-slate-600">do financiado</span>
                </p>
                {parseFloat(c.pct_sobre_total_pago) > 0 && (
                  <p className="text-[11px] text-slate-500 tabular-nums">
                    {formatPct(c.pct_sobre_total_pago)} do total pago
                  </p>
                )}
                {parseFloat(c.pct_sobre_custo_financeiro_total) > 0 && (
                  <p className="text-[11px] text-violet-400 tabular-nums">
                    {formatPct(c.pct_sobre_custo_financeiro_total)} do custo
                    fin.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Tabela detalhada ───────────────────────── */}
      <div
        className="overflow-x-auto rounded-xl border border-white/8"
        data-testid="componentes-cet-tabela"
      >
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              {[
                "Componente / Fórmula",
                "Categoria",
                "Natureza",
                "Total",
                "% Financiado",
                "% Total pago",
                "% Custo fin.",
                "Encargo?",
              ].map((h, i) => (
                <th
                  key={h}
                  className={`px-2 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400 ${i === 0 ? "px-3" : ""} ${i >= 3 ? "text-right" : ""} ${i === 7 ? "text-center" : ""}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {componentes.map((comp, i) => (
              <ComponenteRow key={comp.id} c={comp} idx={i} />
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Legenda ────────────────────────────────── */}
      <div className="flex flex-wrap gap-1.5">
        {(
          Object.entries(CATEGORIA_CLS) as [ComponenteCetCategoria, string][]
        ).map(([k, cls]) => (
          <span
            key={k}
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${cls}`}
          >
            {CATEGORIA_LABEL[k]}
          </span>
        ))}
      </div>

      <p className="text-[11px] text-slate-500">
        Amortização não é custo financeiro. Custos de contratação (ITBI,
        cartório) variam por município e operação — verifique na proposta
        formal.
      </p>
    </div>
  );
}
