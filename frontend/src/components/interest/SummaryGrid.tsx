/**
 * Grids de cards de resumo, um por regime.
 *
 * Reutilizam `<SummaryCard />` da UI compartilhada — não duplicam estilo.
 */
import { SummaryCard } from "@/components/ui/SummaryCard";
import { formatBRL, formatRatePct } from "@/lib/money";
import type {
  SummarySimples,
  SummaryCompostos,
  SummaryComparar,
} from "@/types/interest";

export interface SummarySimplesGridProps {
  readonly summary: SummarySimples;
}

export function SummarySimplesGrid({ summary }: SummarySimplesGridProps) {
  return (
    <div
      data-testid="summary-simples-grid"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5"
    >
      <SummaryCard
        label="Principal (PV)"
        value={formatBRL(summary.principal)}
      />
      <SummaryCard
        label="Taxa mensal"
        value={formatRatePct(summary.taxa_mensal)}
      />
      <SummaryCard
        label="Prazo"
        value={`${String(summary.prazo_meses)} meses`}
      />
      <SummaryCard
        label="Juros totais"
        value={formatBRL(summary.juros_totais)}
        trend="positive"
      />
      <SummaryCard
        label="Montante final"
        value={formatBRL(summary.montante_final)}
      />
    </div>
  );
}

export interface SummaryCompostosGridProps {
  readonly summary: SummaryCompostos;
}

export function SummaryCompostosGrid({ summary }: SummaryCompostosGridProps) {
  return (
    <div
      data-testid="summary-compostos-grid"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
    >
      <SummaryCard
        label="Principal (PV)"
        value={formatBRL(summary.principal)}
      />
      <SummaryCard
        label="Taxa mensal"
        value={formatRatePct(summary.taxa_mensal)}
      />
      <SummaryCard
        label="Prazo"
        value={`${String(summary.prazo_meses)} meses`}
      />
      <SummaryCard
        label="Aporte mensal"
        value={formatBRL(summary.aporte_mensal)}
      />
      <SummaryCard
        label="Total aportado"
        value={formatBRL(summary.total_aportado)}
      />
      <SummaryCard
        label="Total investido"
        value={formatBRL(summary.total_investido)}
        hint="Principal + soma dos aportes."
      />
      <SummaryCard
        label="Juros totais"
        value={formatBRL(summary.juros_totais)}
        trend="positive"
      />
      <SummaryCard
        label="Montante final"
        value={formatBRL(summary.montante_final)}
      />
    </div>
  );
}

export interface SummaryCompararGridProps {
  readonly summary: SummaryComparar;
}

export function SummaryCompararGrid({ summary }: SummaryCompararGridProps) {
  return (
    <div
      data-testid="summary-comparar-grid"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
    >
      <SummaryCard
        label="Principal (PV)"
        value={formatBRL(summary.principal)}
      />
      <SummaryCard
        label="Taxa mensal"
        value={formatRatePct(summary.taxa_mensal)}
      />
      <SummaryCard
        label="Prazo"
        value={`${String(summary.prazo_meses)} meses`}
      />
      <SummaryCard
        label="Montante — simples"
        value={formatBRL(summary.montante_simples)}
      />
      <SummaryCard
        label="Montante — compostos"
        value={formatBRL(summary.montante_composto)}
      />
      <SummaryCard
        label="Diferença"
        value={formatBRL(summary.diferenca)}
        trend="positive"
        hint={`Razão composto/simples: ${summary.razao}`}
      />
    </div>
  );
}
