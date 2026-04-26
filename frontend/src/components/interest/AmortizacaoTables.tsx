/**
 * Tabelas de amortização — um componente por regime + uma variante lado-a-lado
 * usada pela comparação.
 *
 * Observação a11y:
 *   - `<table>` com `<caption>` (texto visível opcional, screen-reader
 *     sempre);
 *   - `<th scope="col">` e `<th scope="row">` para navegação assistiva;
 *   - `role="region"` + `aria-label` no container quando há scroll
 *     horizontal — permite que leitores de tela anunciem o container.
 *
 * Para `prazo_meses` grande (até 1200), a tabela pode ficar longa.
 * Esta entrega renderiza integralmente e confia no scroll nativo do
 * container; virtualização fica como melhoria futura (não bloqueante).
 */
import { formatBRL } from "@/lib/money";
import type { PeriodoCompostoRow, PeriodoSimplesRow } from "@/types/interest";

export interface SimplesTableProps {
  readonly rows: ReadonlyArray<PeriodoSimplesRow>;
  readonly caption?: string;
}

export function AmortizacaoSimplesTable({
  rows,
  caption = "Tabela de amortização — juros simples",
}: SimplesTableProps) {
  return (
    <div
      role="region"
      aria-label={caption}
      className="max-h-[480px] overflow-auto rounded border border-slate-200"
      data-testid="amortizacao-simples-table"
    >
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="sticky top-0 bg-slate-50">
          <tr>
            <th scope="col" className="px-3 py-2 text-left font-semibold">
              Período
            </th>
            <th scope="col" className="px-3 py-2 text-right font-semibold">
              Saldo inicial
            </th>
            <th scope="col" className="px-3 py-2 text-right font-semibold">
              Juros do período
            </th>
            <th scope="col" className="px-3 py-2 text-right font-semibold">
              Saldo final
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.periodo}
              className="border-t border-slate-100 even:bg-slate-50/50"
            >
              <th scope="row" className="px-3 py-1.5 text-left font-medium">
                {r.periodo}
              </th>
              <td className="px-3 py-1.5 text-right tabular-nums">
                {formatBRL(r.saldo_inicial)}
              </td>
              <td className="px-3 py-1.5 text-right tabular-nums">
                {formatBRL(r.juros_periodo)}
              </td>
              <td className="px-3 py-1.5 text-right tabular-nums">
                {formatBRL(r.saldo_final)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export interface CompostaTableProps {
  readonly rows: ReadonlyArray<PeriodoCompostoRow>;
  readonly caption?: string;
}

export function AmortizacaoCompostaTable({
  rows,
  caption = "Tabela de amortização — juros compostos",
}: CompostaTableProps) {
  return (
    <div
      role="region"
      aria-label={caption}
      className="max-h-[480px] overflow-auto rounded border border-slate-200"
      data-testid="amortizacao-composta-table"
    >
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="sticky top-0 bg-slate-50">
          <tr>
            <th scope="col" className="px-3 py-2 text-left font-semibold">
              Período
            </th>
            <th scope="col" className="px-3 py-2 text-right font-semibold">
              Saldo inicial
            </th>
            <th scope="col" className="px-3 py-2 text-right font-semibold">
              Juros do período
            </th>
            <th scope="col" className="px-3 py-2 text-right font-semibold">
              Aporte
            </th>
            <th scope="col" className="px-3 py-2 text-right font-semibold">
              Saldo final
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.periodo}
              className="border-t border-slate-100 even:bg-slate-50/50"
            >
              <th scope="row" className="px-3 py-1.5 text-left font-medium">
                {r.periodo}
              </th>
              <td className="px-3 py-1.5 text-right tabular-nums">
                {formatBRL(r.saldo_inicial)}
              </td>
              <td className="px-3 py-1.5 text-right tabular-nums">
                {formatBRL(r.juros_periodo)}
              </td>
              <td className="px-3 py-1.5 text-right tabular-nums">
                {formatBRL(r.aporte)}
              </td>
              <td className="px-3 py-1.5 text-right tabular-nums">
                {formatBRL(r.saldo_final)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export interface CompararTabelasProps {
  readonly simple: ReadonlyArray<PeriodoSimplesRow>;
  readonly compound: ReadonlyArray<PeriodoCompostoRow>;
}

export function CompararTabelas({ simple, compound }: CompararTabelasProps) {
  return (
    <div
      data-testid="comparar-tabelas"
      className="grid grid-cols-1 gap-4 lg:grid-cols-2"
    >
      <AmortizacaoSimplesTable
        rows={simple}
        caption="Tabela de amortização — regime simples"
      />
      <AmortizacaoCompostaTable
        rows={compound}
        caption="Tabela de amortização — regime composto"
      />
    </div>
  );
}
