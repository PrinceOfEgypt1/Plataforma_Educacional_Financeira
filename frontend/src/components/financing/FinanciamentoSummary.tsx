import { formatBRL } from "@/lib/money";
import type { FinanciamentoImobSummary } from "@/types/financing";

interface SummaryRowProps {
  readonly label: string;
  readonly value: string;
  readonly highlight?: boolean;
}

function SummaryRow({ label, value, highlight = false }: SummaryRowProps) {
  return (
    <div
      className={`flex justify-between items-center py-1 border-b border-gray-100 last:border-0 ${
        highlight ? "font-semibold text-blue-800" : "text-gray-700"
      }`}
    >
      <span className="text-sm">{label}</span>
      <span className="text-sm tabular-nums">{value}</span>
    </div>
  );
}

interface FinanciamentoSummaryProps {
  readonly summary: FinanciamentoImobSummary;
}

export function FinanciamentoSummary({ summary }: FinanciamentoSummaryProps) {
  const hasEncargos = parseFloat(summary.total_encargos) > 0;

  return (
    <div
      className="flex flex-col gap-2"
      data-testid="financiamento-summary-legacy"
      aria-label="Resumo do financiamento"
    >
      <h2 className="text-base font-semibold text-gray-900">
        Resumo — {summary.sistema_amortizacao}
      </h2>

      <div className="bg-blue-50 rounded-lg p-3 flex flex-col gap-0.5">
        <SummaryRow
          label="Valor do imóvel"
          value={formatBRL(summary.valor_imovel)}
        />
        <SummaryRow label="Entrada" value={formatBRL(summary.valor_entrada)} />
        <SummaryRow
          label="Valor financiado"
          value={formatBRL(summary.valor_financiado)}
          highlight
        />
        <SummaryRow label="Prazo" value={`${summary.prazo_meses} meses`} />
        <SummaryRow
          label="Taxa mensal"
          value={`${(parseFloat(summary.taxa_juros_mensal) * 100).toFixed(4).replace(".", ",")}%`}
        />
      </div>

      <div className="bg-gray-50 rounded-lg p-3 flex flex-col gap-0.5">
        <SummaryRow
          label="1ª parcela"
          value={formatBRL(summary.primeira_parcela)}
          highlight
        />
        <SummaryRow
          label="Última parcela"
          value={formatBRL(summary.ultima_parcela)}
        />
        <SummaryRow
          label="Total amortizado"
          value={formatBRL(summary.total_amortizado)}
        />
        <SummaryRow
          label="Total de juros"
          value={formatBRL(summary.total_juros)}
        />
        {hasEncargos && (
          <SummaryRow
            label="Total de encargos"
            value={formatBRL(summary.total_encargos)}
          />
        )}
        <SummaryRow
          label="Total pago"
          value={formatBRL(summary.total_pago)}
          highlight
        />
        <SummaryRow
          label="Custo total (juros + encargos)"
          value={formatBRL(summary.custo_total)}
        />
      </div>

      <p className="text-xs text-gray-500 mt-1">
        Esta simulação é educacional e não representa proposta bancária,
        contrato, CET oficial ou aprovação de crédito.
      </p>
    </div>
  );
}
