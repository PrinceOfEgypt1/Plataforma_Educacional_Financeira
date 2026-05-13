"use client";

/**
 * FinanciamentoComponentesCET — Microadendo Final Item 13
 *
 * CET demonstrativo com categorias pedagógicas:
 *   base_operacao | componente_encargo | componente_cet |
 *   custo_inicial | totalizador_indicador
 *
 * Amortização: componente_encargo, NÃO é custo do CET.
 * Valor financiado: ausente dos componentes.
 * Total pago: totalizador_indicador.
 * Dois percentuais por componente (financiado, total pago, custo financeiro).
 * * Sem linguagem regulatória absoluta. Sem percentuais fixos de ITBI/cartório.
 */

import { formatBRL, formatPct } from "@/lib/money";
import type { ComponenteCet, ComponenteCetCategoria } from "@/types/financing";

const NATUREZA_LABEL: Record<string, string> = {
  calculado: "Calculado",
  informado: "Informado",
  nao_calculado: "Não calculado",
  alerta: "Alerta",
};

const NATUREZA_CLS: Record<string, string> = {
  calculado: "bg-green-100 text-green-800",
  informado: "bg-blue-100 text-blue-800",
  nao_calculado: "bg-gray-100 text-gray-500",
  alerta: "bg-orange-100 text-orange-700",
};

const CATEGORIA_LABEL: Record<ComponenteCetCategoria, string> = {
  base_operacao: "Base da operação",
  componente_encargo: "Componente do encargo",
  componente_cet: "Componente do CET",
  custo_inicial: "Custo inicial",
  totalizador_indicador: "Totalizador / Indicador",
};

const CATEGORIA_CLS: Record<ComponenteCetCategoria, string> = {
  base_operacao: "bg-slate-100 text-slate-700",
  componente_encargo: "bg-cyan-100 text-cyan-800",
  componente_cet: "bg-purple-100 text-purple-800",
  custo_inicial: "bg-orange-100 text-orange-800",
  totalizador_indicador: "bg-indigo-100 text-indigo-800",
};

interface RowProps {
  readonly c: ComponenteCet;
  readonly idx: number;
}

function ComponenteRow({ c, idx }: RowProps) {
  const isOmitido = c.natureza === "nao_calculado" || c.natureza === "alerta";
  const rowCls = isOmitido
    ? "opacity-60 bg-white"
    : idx % 2 === 0
      ? "bg-white"
      : "bg-gray-50";

  return (
    <tr
      className={`border-b border-gray-100 ${rowCls}`}
      data-testid={`componente-cet-row-${c.id}`}
    >
      <td className="px-3 py-2">
        <p className="text-sm font-medium text-gray-900">{c.nome}</p>
        <p className="text-xs text-gray-400 font-mono truncate max-w-xs mt-0.5">
          {c.formula}
        </p>
      </td>
      <td className="px-2 py-2 text-center">
        <span
          className={`text-xs font-semibold rounded-full px-2 py-0.5 whitespace-nowrap ${CATEGORIA_CLS[c.categoria] ?? ""}`}
        >
          {CATEGORIA_LABEL[c.categoria] ?? c.categoria}
        </span>
      </td>
      <td className="px-2 py-2 text-center">
        <span
          className={`text-xs font-semibold rounded-full px-2 py-0.5 ${NATUREZA_CLS[c.natureza] ?? ""}`}
        >
          {NATUREZA_LABEL[c.natureza] ?? c.natureza}
        </span>
      </td>
      <td className="px-3 py-2 text-right tabular-nums text-sm font-semibold text-gray-800">
        {isOmitido ? (
          <span className="text-gray-400">—</span>
        ) : (
          formatBRL(c.valor_total)
        )}
      </td>
      <td className="px-2 py-2 text-right tabular-nums text-xs text-gray-600">
        {isOmitido ? "—" : formatPct(c.pct_sobre_financiado)}
      </td>
      <td className="px-2 py-2 text-right tabular-nums text-xs text-gray-600">
        {isOmitido ? "—" : formatPct(c.pct_sobre_total_pago)}
      </td>
      <td className="px-2 py-2 text-right tabular-nums text-xs text-gray-600">
        {isOmitido || parseFloat(c.pct_sobre_custo_financeiro_total) === 0
          ? "—"
          : formatPct(c.pct_sobre_custo_financeiro_total)}
      </td>
      <td className="px-2 py-2 text-center text-sm">
        {c.entra_no_encargo_mensal ? (
          <span className="text-green-700 font-bold">✓</span>
        ) : (
          <span className="text-gray-400">—</span>
        )}
      </td>
    </tr>
  );
}

interface Props {
  readonly componentes: ReadonlyArray<ComponenteCet>;
}

export function FinanciamentoComponentesCET({ componentes }: Props) {
  // Agrupar por categoria
  const grupos: Partial<Record<ComponenteCetCategoria, ComponenteCet[]>> = {};
  for (const c of componentes) {
    if (!grupos[c.categoria]) grupos[c.categoria] = [];
    grupos[c.categoria]!.push(c);
  }

  const reais = componentes.filter(
    (c) => c.natureza === "calculado" || c.natureza === "informado",
  );

  return (
    <section
      className="flex flex-col gap-3"
      data-testid="financiamento-componentes-cet"
      aria-label="Componentes do CET demonstrativo e do custo da simulação"
    >
      <div>
        <h3 className="text-sm font-semibold text-gray-900">
          Componentes do CET demonstrativo e do custo da simulação
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Este demonstrativo não substitui o CET oficial. O CET oficial deve ser
          solicitado à instituição financeira antes da contratação.
        </p>
      </div>

      {/* Cards de resumo */}
      {reais.length > 0 && (
        <div
          className="grid grid-cols-2 gap-2 sm:grid-cols-3"
          data-testid="componentes-cet-resumo"
        >
          {reais.map((c) => (
            <div
              key={c.id}
              className="rounded-lg border border-gray-100 bg-gray-50 p-2.5"
              data-testid={`componente-cet-card-${c.id}`}
            >
              <p className="text-xs text-gray-500 leading-tight truncate">
                {c.nome}
              </p>
              <p className="mt-1 text-sm font-bold tabular-nums text-gray-900">
                {formatBRL(c.valor_total)}
              </p>
              <p className="text-xs text-gray-500 tabular-nums">
                {formatPct(c.pct_sobre_financiado)}{" "}
                <span className="text-gray-400">do financiado</span>
              </p>
              {parseFloat(c.pct_sobre_total_pago) > 0 && (
                <p className="text-xs text-gray-400 tabular-nums">
                  {formatPct(c.pct_sobre_total_pago)} do total pago
                </p>
              )}
              {parseFloat(c.pct_sobre_custo_financeiro_total) > 0 && (
                <p className="text-xs text-gray-400 tabular-nums">
                  {formatPct(c.pct_sobre_custo_financeiro_total)} do custo
                  financeiro
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tabela detalhada */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table
          className="w-full border-collapse text-left"
          data-testid="componentes-cet-tabela"
        >
          <thead>
            <tr className="border-b border-gray-200 bg-gray-100">
              <th className="px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Componente / Fórmula
              </th>
              <th className="px-2 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide text-center">
                Categoria
              </th>
              <th className="px-2 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide text-center">
                Natureza
              </th>
              <th className="px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide text-right">
                Total
              </th>
              <th className="px-2 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide text-right">
                % Financiado
              </th>
              <th className="px-2 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide text-right">
                % Total pago
              </th>
              <th className="px-2 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide text-right">
                % Custo fin.
              </th>
              <th className="px-2 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide text-center">
                No encargo?
              </th>
            </tr>
          </thead>
          <tbody>
            {componentes.map((comp, i) => (
              <ComponenteRow key={comp.id} c={comp} idx={i} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Legenda */}
      <div className="flex flex-wrap gap-2 text-xs">
        {(
          Object.entries(CATEGORIA_CLS) as [ComponenteCetCategoria, string][]
        ).map(([k, cls]) => (
          <span
            key={k}
            className={`rounded-full px-2 py-0.5 font-medium ${cls}`}
          >
            {CATEGORIA_LABEL[k]}
          </span>
        ))}
      </div>

      <p className="text-xs text-gray-400">
        Amortização não é custo financeiro. Valor financiado não é componente de
        custo. Custos de contratação variam e devem ser verificados na proposta
        formal.
      </p>
    </section>
  );
}
