import { formatBRL } from "@/lib/money";
import type {
  FinanciamentoImobCompareOut,
  FinanciamentoImobSummary,
} from "@/types/financing";

interface ColProps {
  readonly label: string;
  readonly price: string;
  readonly sac: string;
  readonly highlight?: boolean;
}

function CompareRow({ label, price, sac, highlight = false }: ColProps) {
  const cellClass = highlight ? "font-semibold text-blue-800" : "text-gray-700";
  return (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="py-1.5 pr-3 text-sm text-gray-500 whitespace-nowrap">
        {label}
      </td>
      <td
        className={`py-1.5 px-2 text-sm text-right tabular-nums ${cellClass}`}
      >
        {price}
      </td>
      <td
        className={`py-1.5 px-2 text-sm text-right tabular-nums ${cellClass}`}
      >
        {sac}
      </td>
    </tr>
  );
}

function formatRate(raw: string): string {
  const v = parseFloat(raw);
  if (!Number.isFinite(v)) return raw;
  return `${(v * 100).toFixed(4).replace(".", ",")}%`;
}

function buildRows(
  price: FinanciamentoImobSummary,
  sac: FinanciamentoImobSummary,
): ReadonlyArray<ColProps> {
  const hasEncargos =
    parseFloat(price.total_encargos) > 0 || parseFloat(sac.total_encargos) > 0;

  const rows: ColProps[] = [
    {
      label: "Valor financiado",
      price: formatBRL(price.valor_financiado),
      sac: formatBRL(sac.valor_financiado),
      highlight: true,
    },
    {
      label: "Prazo",
      price: `${price.prazo_meses} meses`,
      sac: `${sac.prazo_meses} meses`,
    },
    {
      label: "Taxa mensal",
      price: formatRate(price.taxa_juros_mensal),
      sac: formatRate(sac.taxa_juros_mensal),
    },
    {
      label: "1ª parcela",
      price: formatBRL(price.primeira_parcela),
      sac: formatBRL(sac.primeira_parcela),
      highlight: true,
    },
    {
      label: "Última parcela",
      price: formatBRL(price.ultima_parcela),
      sac: formatBRL(sac.ultima_parcela),
    },
    {
      label: "Total de juros",
      price: formatBRL(price.total_juros),
      sac: formatBRL(sac.total_juros),
      highlight: true,
    },
    {
      label: "Total pago",
      price: formatBRL(price.total_pago),
      sac: formatBRL(sac.total_pago),
      highlight: true,
    },
  ];

  if (hasEncargos) {
    rows.splice(6, 0, {
      label: "Total encargos",
      price: formatBRL(price.total_encargos),
      sac: formatBRL(sac.total_encargos),
    });
  }

  return rows;
}

function educationalNote(
  price: FinanciamentoImobSummary,
  sac: FinanciamentoImobSummary,
): string {
  const jurosPrice = parseFloat(price.total_juros);
  const jurosSac = parseFloat(sac.total_juros);
  const economia = jurosPrice - jurosSac;
  const priceFirst = parseFloat(price.primeira_parcela);
  const sacFirst = parseFloat(sac.primeira_parcela);
  const diff = sacFirst - priceFirst;
  const economiaStr = formatBRL(economia.toFixed(2));
  const diffStr = formatBRL(diff.toFixed(2));
  return `No SAC, a 1ª parcela é ${diffStr} maior que no PRICE, mas o total de juros é ${economiaStr} menor ao longo do prazo. O SAC amortiza mais capital no início e é mais barato no longo prazo.`;
}

export interface FinanciamentoCompareSummaryProps {
  readonly compare: FinanciamentoImobCompareOut;
}

export function FinanciamentoCompareSummary({
  compare,
}: FinanciamentoCompareSummaryProps) {
  const rows = buildRows(compare.price.summary, compare.sac.summary);
  const note = educationalNote(compare.price.summary, compare.sac.summary);

  return (
    <div
      className="flex flex-col gap-3"
      data-testid="financiamento-compare-summary"
      aria-label="Resumo comparativo PRICE e SAC"
    >
      <h3 className="text-sm font-semibold text-gray-800">
        Resumo comparativo — PRICE × SAC
      </h3>

      <div className="overflow-x-auto border border-gray-100 rounded">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-blue-100 text-blue-900">
              <th className="px-2 py-1.5 text-left font-medium">Indicador</th>
              <th className="px-2 py-1.5 text-right font-semibold">PRICE</th>
              <th className="px-2 py-1.5 text-right font-semibold text-amber-700">
                SAC
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <CompareRow key={row.label} {...row} />
            ))}
          </tbody>
        </table>
      </div>

      <div
        className="cockpit-insight-bar"
        data-testid="financiamento-compare-educational-note"
        role="note"
        aria-label="Interpretação educacional"
      >
        <span aria-hidden="true">📚</span>
        <span className="text-xs">{note}</span>
      </div>

      <p className="text-xs text-gray-500">
        Simulação educacional. Não representa proposta bancária, CET oficial ou
        aprovação de crédito.
      </p>
    </div>
  );
}
