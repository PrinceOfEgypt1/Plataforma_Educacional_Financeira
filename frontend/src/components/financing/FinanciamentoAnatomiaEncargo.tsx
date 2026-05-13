"use client";

/**
 * FinanciamentoAnatomiaEncargo — Microadendo Final Item 13
 *
 * Exibe MIP e DFI/DFC separados quando informados individualmente.
 * Quando apenas seguro_mensal legado: exibe como "não discriminado na entrada".
 * Taxa administrativa NUNCA entra em seguros_total.
 * * Sem linguagem regulatória absoluta. Sem nome de banco específico.
 */

import { formatBRL, formatPct } from "@/lib/money";
import type {
  AnatomiaEncargo,
  FinanciamentoImobSummary,
} from "@/types/financing";

interface RowProps {
  readonly label: string;
  readonly sub?: string;
  readonly value: string;
  readonly pct: string;
  readonly color: "blue" | "teal" | "amber" | "orange" | "gray" | "rose";
  readonly tip?: string;
}

const COLOR: Record<string, string> = {
  blue: "bg-blue-50 border-blue-400 text-blue-900",
  teal: "bg-teal-50 border-teal-400 text-teal-900",
  amber: "bg-amber-50 border-amber-400 text-amber-800",
  orange: "bg-orange-50 border-orange-400 text-orange-800",
  gray: "bg-gray-50 border-gray-300 text-gray-700",
  rose: "bg-rose-50 border-rose-400 text-rose-800",
};

function Row({ label, sub, value, pct, color, tip }: RowProps) {
  return (
    <div
      className={`flex items-center justify-between gap-2 rounded border-l-2 px-3 py-2 ${COLOR[color]}`}
      title={tip}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{label}</p>
        {sub && <p className="text-xs opacity-70 truncate">{sub}</p>}
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold tabular-nums">{value}</p>
        <p className="text-xs opacity-70 tabular-nums">{pct}</p>
      </div>
    </div>
  );
}

interface Props {
  readonly anatomia: AnatomiaEncargo;
  readonly summary: FinanciamentoImobSummary;
}

export function FinanciamentoAnatomiaEncargo({ anatomia, summary }: Props) {
  const hasMip = parseFloat(anatomia.mip_mensal) > 0;
  const hasDfi = parseFloat(anatomia.dfi_dfc_mensal) > 0;
  const hasLegado =
    !hasMip && !hasDfi && parseFloat(anatomia.seguros_total) > 0;
  const hasSeguro = hasMip || hasDfi || hasLegado;
  const hasTaxa = parseFloat(anatomia.taxa_administracao_mensal) > 0;
  const hasAdmin = parseFloat(anatomia.custo_admin_mensal) > 0;
  const hasAcessorios = hasSeguro || hasTaxa || hasAdmin;
  const sistema = summary.sistema_amortizacao;

  return (
    <section
      className="rounded-lg border border-gray-200 bg-white p-4 flex flex-col gap-3"
      data-testid="financiamento-anatomia-encargo"
      aria-label="Composição do encargo mensal"
    >
      <div>
        <h3 className="text-sm font-semibold text-gray-900">
          Composição do encargo mensal
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Valores do primeiro período — {sistema}
        </p>
      </div>

      {/* Prestação financeira */}
      <div className="flex flex-col gap-1.5">
        <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
          Prestação financeira
        </p>
        <Row
          label="Amortização"
          sub={
            sistema === "SAC"
              ? "Constante — mesma quantia todo mês"
              : "Crescente — aumenta ao longo do contrato"
          }
          value={formatBRL(anatomia.amortizacao)}
          pct={formatPct(anatomia.pct_amortizacao)}
          color="teal"
          tip="Reduz o saldo devedor"
        />
        <Row
          label="Juros"
          sub="Calculado sobre o saldo devedor — decresce com o tempo"
          value={formatBRL(anatomia.juros)}
          pct={formatPct(anatomia.pct_juros)}
          color="blue"
          tip="Custo financeiro do crédito"
        />
        <div
          className="flex justify-between items-center rounded bg-blue-200 px-3 py-1.5"
          data-testid="prestacao-financeira-total"
        >
          <span className="text-xs font-bold text-blue-900">
            = Prestação financeira
          </span>
          <span className="text-sm font-bold tabular-nums text-blue-900">
            {formatBRL(anatomia.prestacao_financeira)}
          </span>
        </div>
      </div>

      {/* Encargos acessórios */}
      {hasAcessorios && (
        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
            Encargos acessórios
          </p>

          {/* MIP individual */}
          {hasMip && (
            <Row
              label="MIP — Seguro de Morte e Invalidez Permanente"
              sub="Informado individualmente"
              value={formatBRL(anatomia.mip_mensal)}
              pct={formatPct(anatomia.pct_mip)}
              color="amber"
              tip="Seguro de vida habitacional — não é taxa de administração"
            />
          )}

          {/* DFI/DFC individual */}
          {hasDfi && (
            <Row
              label="DFI/DFC — Seguro de Danos Físicos ao Imóvel"
              sub="Informado individualmente"
              value={formatBRL(anatomia.dfi_dfc_mensal)}
              pct={formatPct(anatomia.pct_dfi_dfc)}
              color="amber"
              tip="Seguro do imóvel — não é taxa de administração"
            />
          )}

          {/* Seguro legado */}
          {hasLegado && (
            <Row
              label="Seguros habitacionais (MIP + DFI/DFC)"
              sub="Não discriminado na entrada — informado de forma agregada"
              value={formatBRL(anatomia.seguros_total)}
              pct={formatPct(anatomia.pct_seguros)}
              color="amber"
              tip="Para separar MIP e DFI, informe os campos individuais"
            />
          )}

          {/* Taxa administrativa — SEMPRE separada de seguros */}
          {hasTaxa && (
            <Row
              label="Taxa de administração"
              sub="Não é seguro — custo de gestão do contrato"
              value={formatBRL(anatomia.taxa_administracao_mensal)}
              pct={formatPct(anatomia.pct_taxa_administracao)}
              color="orange"
            />
          )}

          {hasAdmin && (
            <Row
              label="Outros custos mensais"
              value={formatBRL(anatomia.custo_admin_mensal)}
              pct={formatPct(anatomia.pct_custo_admin)}
              color="gray"
            />
          )}
        </div>
      )}

      {/* Total */}
      <div
        className="flex justify-between items-center rounded-lg bg-gray-800 px-3 py-2.5"
        data-testid="encargo-mensal-total"
      >
        <div>
          <p className="text-sm font-bold text-white">= Encargo mensal total</p>
          <p className="text-xs text-gray-300">
            prestação financeira{hasAcessorios ? " + encargos acessórios" : ""}
          </p>
        </div>
        <span className="text-base font-bold tabular-nums text-white">
          {formatBRL(anatomia.encargo_mensal_total)}
        </span>
      </div>

      {/* Fórmula */}
      <div
        className="rounded bg-gray-50 border border-gray-200 px-3 py-2"
        data-testid="formula-encargo"
      >
        <p className="text-xs font-mono text-gray-700">
          encargo_mensal_total = amortização + juros
          {hasSeguro
            ? hasMip || hasDfi
              ? " + MIP + DFI/DFC"
              : " + seguros"
            : ""}
          {hasTaxa ? " + taxa adm." : ""}
        </p>
      </div>

      <p className="text-xs text-gray-400">
        Simulação educacional. Consulte a proposta formal para valores reais.
      </p>
    </section>
  );
}
