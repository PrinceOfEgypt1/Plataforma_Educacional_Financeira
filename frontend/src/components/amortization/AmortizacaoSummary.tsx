import { SummaryCard } from "@/components/ui/SummaryCard";
import { formatBRL, formatRatePct } from "@/lib/money";
import type {
  CompareAmortizationSummary,
  PriceSummary,
  SacSummary,
} from "@/types/amortization";

export function PriceSummaryGrid({
  summary,
}: {
  readonly summary: PriceSummary;
}) {
  return (
    <div
      data-testid="summary-price-grid"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
    >
      <SummaryCard label="Principal" value={formatBRL(summary.principal)} />
      <SummaryCard
        label="Taxa por periodo"
        value={formatRatePct(summary.taxa_periodo)}
      />
      <SummaryCard
        label="Prazo"
        value={`${String(summary.n_periodos)} periodos`}
      />
      <SummaryCard label="Parcela" value={formatBRL(summary.parcela)} />
      <SummaryCard label="Total pago" value={formatBRL(summary.total_pago)} />
      <SummaryCard
        label="Total de juros"
        value={formatBRL(summary.total_juros)}
        trend="warning"
      />
    </div>
  );
}

export function SacSummaryGrid({ summary }: { readonly summary: SacSummary }) {
  return (
    <div
      data-testid="summary-sac-grid"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
    >
      <SummaryCard label="Principal" value={formatBRL(summary.principal)} />
      <SummaryCard
        label="Taxa por periodo"
        value={formatRatePct(summary.taxa_periodo)}
      />
      <SummaryCard
        label="Prazo"
        value={`${String(summary.n_periodos)} periodos`}
      />
      <SummaryCard
        label="Amortizacao constante"
        value={formatBRL(summary.amortizacao_constante)}
      />
      <SummaryCard
        label="Parcela inicial"
        value={formatBRL(summary.parcela_inicial)}
      />
      <SummaryCard
        label="Parcela final"
        value={formatBRL(summary.parcela_final)}
      />
      <SummaryCard label="Total pago" value={formatBRL(summary.total_pago)} />
      <SummaryCard
        label="Total de juros"
        value={formatBRL(summary.total_juros)}
        trend="warning"
      />
    </div>
  );
}

export function CompareSummaryGrid({
  summary,
}: {
  readonly summary: CompareAmortizationSummary;
}) {
  return (
    <div
      data-testid="summary-compare-grid"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
    >
      <SummaryCard label="Principal" value={formatBRL(summary.principal)} />
      <SummaryCard
        label="Taxa por periodo"
        value={formatRatePct(summary.taxa_periodo)}
      />
      <SummaryCard
        label="Prazo"
        value={`${String(summary.n_periodos)} periodos`}
      />
      <SummaryCard
        label="Juros PRICE"
        value={formatBRL(summary.price.total_juros)}
      />
      <SummaryCard
        label="Juros SAC"
        value={formatBRL(summary.sac.total_juros)}
      />
      <SummaryCard
        label="Diferenca de juros"
        value={formatBRL(summary.diferenca_juros)}
        trend="positive"
        hint={`Menor custo em juros: ${summary.menor_total_juros}.`}
      />
    </div>
  );
}
