"use client";

/**
 * FinanciamentoAnatomiaEncargo — Item 13 Correção Visual
 *
 * Tema dark integrado com o cockpit (bg-white/5, slate-*, cyan/emerald/amber).
 * Tema dark: sem fundos claros nem texto escuro no dark mode.
 * MIP e DFI separados quando informados; legado com aviso honesto.
 * Taxa administrativa sempre separada de seguros.
 */

import { formatBRL, formatPct } from "@/lib/money";
import type {
  AnatomiaEncargo,
  FinanciamentoImobSummary,
} from "@/types/financing";

// ── Mapa de cores dark para cada tipo de componente ─────────
const DARK_COLOR: Record<string, string> = {
  amort: "border-emerald-400/40 bg-emerald-400/8 text-emerald-100",
  juros: "border-amber-400/40 bg-amber-400/8 text-amber-100",
  mip: "border-cyan-400/40 bg-cyan-400/8 text-cyan-100",
  dfi: "border-cyan-400/30 bg-cyan-400/6 text-cyan-200",
  seguro: "border-cyan-400/30 bg-cyan-400/6 text-cyan-200",
  taxa: "border-violet-400/40 bg-violet-400/8 text-violet-100",
  admin: "border-slate-400/30 bg-white/5 text-slate-300",
};

interface RowProps {
  readonly label: string;
  readonly sub?: string;
  readonly value: string;
  readonly pct: string;
  readonly colorKey: keyof typeof DARK_COLOR;
  readonly tip?: string;
}

function Row({ label, sub, value, pct, colorKey, tip }: RowProps) {
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-xl border-l-2 px-3 py-2.5 ${DARK_COLOR[colorKey]}`}
      title={tip}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-tight truncate">{label}</p>
        {sub && <p className="mt-0.5 text-[11px] opacity-60 truncate">{sub}</p>}
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold tabular-nums">{value}</p>
        <p className="text-[11px] opacity-60 tabular-nums">{pct}</p>
      </div>
    </div>
  );
}

interface SubtotalRowProps {
  readonly label: string;
  readonly value: string;
  readonly tone: "cyan" | "slate";
}
function SubtotalRow({ label, value, tone }: SubtotalRowProps) {
  const cls =
    tone === "cyan"
      ? "bg-cyan-400/15 text-cyan-100"
      : "bg-white/10 text-slate-100";
  return (
    <div
      className={`flex items-center justify-between rounded-xl px-3 py-2 ${cls}`}
    >
      <span className="text-xs font-bold">= {label}</span>
      <span className="text-sm font-bold tabular-nums">{value}</span>
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
    <div
      className="flex flex-col gap-3"
      data-testid="financiamento-anatomia-encargo"
      aria-label="Composição do encargo mensal"
    >
      {/* ── Descrição ────────────────────────────── */}
      <p className="text-sm leading-6 text-slate-300">
        A parcela mensal de um financiamento tem duas partes principais:{" "}
        <strong className="text-cyan-200">prestação financeira</strong> (o que
        reduz a dívida) e{" "}
        <strong className="text-amber-200">encargos acessórios</strong> (o que
        paga serviços e seguros).
      </p>

      {/* ── Bloco A: Prestação financeira ─────────── */}
      <div className="rounded-xl border border-cyan-200/10 bg-white/3 p-3">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-200/70">
          A · Prestação financeira
        </p>
        <div className="flex flex-col gap-1.5">
          <Row
            label="Amortização"
            sub={
              sistema === "SAC"
                ? "Constante — mesma quantia todo mês, saldo cai linearmente"
                : "Crescente — começa pequena e aumenta com o tempo (PRICE)"
            }
            value={formatBRL(anatomia.amortizacao)}
            pct={formatPct(anatomia.pct_amortizacao)}
            colorKey="amort"
            tip="Reduz o saldo devedor — não é custo financeiro"
          />
          <Row
            label="Juros"
            sub="Calculado sobre o saldo devedor restante — decresce mês a mês"
            value={formatBRL(anatomia.juros)}
            pct={formatPct(anatomia.pct_juros)}
            colorKey="juros"
            tip="Custo financeiro do crédito"
          />
          <div data-testid="prestacao-financeira-total">
            <SubtotalRow
              label="Prestação financeira"
              value={formatBRL(anatomia.prestacao_financeira)}
              tone="cyan"
            />
          </div>
        </div>
      </div>

      {/* ── Bloco B: Encargos acessórios ─────────── */}
      {hasAcessorios && (
        <div className="rounded-xl border border-amber-200/10 bg-white/3 p-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-200/70">
            B · Encargos acessórios
          </p>
          <div className="flex flex-col gap-1.5">
            {hasMip && (
              <Row
                label="MIP — Morte e Invalidez Permanente"
                sub="Seguro de vida habitacional informado individualmente"
                value={formatBRL(anatomia.mip_mensal)}
                pct={formatPct(anatomia.pct_mip)}
                colorKey="mip"
                tip="Não é taxa de administração"
              />
            )}
            {hasDfi && (
              <Row
                label="DFI/DFC — Danos Físicos ao Imóvel"
                sub="Seguro do imóvel informado individualmente"
                value={formatBRL(anatomia.dfi_dfc_mensal)}
                pct={formatPct(anatomia.pct_dfi_dfc)}
                colorKey="dfi"
                tip="Não é taxa de administração"
              />
            )}
            {hasLegado && (
              <Row
                label="Seguros habitacionais (MIP + DFI — agregados)"
                sub="Informe mip_mensal e dfi_dfc_mensal para discriminar individualmente"
                value={formatBRL(anatomia.seguros_total)}
                pct={formatPct(anatomia.pct_seguros)}
                colorKey="seguro"
              />
            )}
            {hasTaxa && (
              <Row
                label="Taxa de administração"
                sub="Custo de gestão do contrato — não é seguro"
                value={formatBRL(anatomia.taxa_administracao_mensal)}
                pct={formatPct(anatomia.pct_taxa_administracao)}
                colorKey="taxa"
              />
            )}
            {hasAdmin && (
              <Row
                label="Outros custos mensais"
                value={formatBRL(anatomia.custo_admin_mensal)}
                pct={formatPct(anatomia.pct_custo_admin)}
                colorKey="admin"
              />
            )}
          </div>
        </div>
      )}

      {/* ── Encargo total ─────────────────────────── */}
      <div
        className="rounded-xl border border-white/15 bg-white/10 p-3"
        data-testid="encargo-mensal-total"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-100">
              A + B · Encargo mensal total
            </p>
            <p className="mt-0.5 text-[11px] text-slate-400">
              prestação financeira
              {hasAcessorios
                ? " + encargos acessórios"
                : " (sem encargos adicionais)"}
            </p>
          </div>
          <p className="text-xl font-bold tabular-nums text-slate-50">
            {formatBRL(anatomia.encargo_mensal_total)}
          </p>
        </div>
      </div>

      {/* ── Fórmula ───────────────────────────────── */}
      <div
        className="rounded-xl border border-white/8 bg-slate-950/50 px-3 py-2"
        data-testid="formula-encargo"
      >
        <p className="font-mono text-[11px] text-slate-400">
          encargo = amortização + juros
          {hasSeguro
            ? hasMip || hasDfi
              ? " + MIP + DFI/DFC"
              : " + seguros"
            : ""}
          {hasTaxa ? " + taxa adm." : ""}
        </p>
      </div>

      <p className="text-[11px] text-slate-500">
        Valores do primeiro período. Simulação educacional — consulte a proposta
        formal.
      </p>
    </div>
  );
}
