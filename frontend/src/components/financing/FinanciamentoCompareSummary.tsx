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
  const valueClass = highlight
    ? "font-semibold text-blue-800"
    : "font-medium text-gray-700";
  return (
    <div
      className="rounded border border-gray-100 bg-white p-3"
      data-testid={`financiamento-compare-row-${label
        .toLowerCase()
        .replaceAll(" ", "-")}`}
    >
      <dt className="mb-2 text-sm font-medium text-gray-600">{label}</dt>
      <dd
        className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2"
        aria-label={`Comparação de ${label}`}
      >
        <div className="flex items-center justify-between gap-3 rounded bg-blue-50/60 px-2 py-1.5">
          <span className="text-xs font-semibold text-blue-900">PRICE</span>
          <span className={`text-right tabular-nums ${valueClass}`}>
            {price}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 rounded bg-amber-50/70 px-2 py-1.5">
          <span className="text-xs font-semibold text-amber-800">SAC</span>
          <span className={`text-right tabular-nums ${valueClass}`}>{sac}</span>
        </div>
      </dd>
    </div>
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
        Resumo comparativo — PRICE x SAC
      </h3>

      <dl
        className="grid grid-cols-1 gap-2 lg:grid-cols-2"
        data-testid="financiamento-compare-cards"
      >
        {rows.map((row) => (
          <CompareRow key={row.label} {...row} />
        ))}
      </dl>

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
