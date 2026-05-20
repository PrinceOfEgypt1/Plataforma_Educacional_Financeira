"use client";

/**
 * RealEstateScenarioSidebar — Sidebar lateral do cockpit Financial Observatory
 *
 * Exibe métricas compactas do cenário simulado e cards horizontais coloridos
 * de alerta/recomendação pedagógica.
 *
 * Inspirado na sidebar do protótipo Item 14C.
 */

import { formatBRL, formatRatePct } from "@/lib/money";
import type {
  FinanciamentoImobOut,
  FinanciamentoImobSummary,
} from "@/types/financing";

import { RealEstateInsightCard } from "./RealEstateInsightCard";

interface RealEstateScenarioSidebarProps {
  readonly result: FinanciamentoImobOut;
  readonly onNavigate: (view: string) => void;
  /** Setter direto da zona ativa do ResultPanel — garante troca imediata */
  readonly onNavigateZone: (zone: 1 | 2 | 3 | 4 | 5) => void;
}

function ScenarioRow({
  label,
  value,
  accent,
}: {
  readonly label: string;
  readonly value: string;
  readonly accent?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-2 py-0.5">
      <span className="shrink-0 text-[11px] text-slate-400">{label}</span>
      <span
        className={`font-mono text-[11px] font-semibold ${accent === true ? "text-cyan-300" : "text-slate-100"}`}
      >
        {value}
      </span>
    </div>
  );
}

function ResultPill({
  label,
  value,
  tone,
}: {
  readonly label: string;
  readonly value: string;
  readonly tone: "cyan" | "amber" | "emerald" | "violet";
}) {
  const toneMap = {
    cyan: "bg-cyan-400/10 border-cyan-400/25 text-cyan-300",
    amber: "bg-amber-400/10 border-amber-400/25 text-amber-300",
    emerald: "bg-emerald-400/10 border-emerald-400/25 text-emerald-300",
    violet: "bg-violet-400/10 border-violet-400/25 text-violet-300",
  };

  return (
    <div
      className={`rounded-lg border px-2 py-1.5 ${toneMap[tone]}`}
      data-testid="sidebar-result-pill"
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] opacity-70">
        {label}
      </p>
      <p className="mt-0.5 font-mono text-[12px] font-semibold">{value}</p>
    </div>
  );
}

function buildInsightCards(
  summary: FinanciamentoImobSummary,
  onNavigate: (view: string) => void,
  onNavigateZone: (zone: 1 | 2 | 3 | 4 | 5) => void,
) {
  const totalJuros = parseFloat(summary.total_juros);
  const valorFinanciado = parseFloat(summary.valor_financiado);
  const pctJuros =
    valorFinanciado > 0
      ? ((totalJuros / valorFinanciado) * 100).toFixed(0)
      : "—";
  const sistema = summary.sistema_amortizacao;
  const primeiraP = parseFloat(summary.primeira_parcela);
  const ultimaP = parseFloat(summary.ultima_parcela);
  const difParcela = primeiraP - ultimaP;

  return [
    {
      tone: "amber" as const,
      category: "Custo financeiro",
      icon: "⚡",
      title: `Você paga ${pctJuros}% do financiado em juros`,
      description: `${formatBRL(summary.total_juros)} em juros ao longo do contrato.`,
      actionLabel: "Ver interpretação",
      onAction: () => onNavigateZone(4),
      testId: "insight-card-juros",
    },
    {
      tone: "violet" as const,
      category: "Comparação",
      icon: "⚖",
      title: `${sistema} vs. ${sistema === "SAC" ? "PRICE" : "SAC"} — compare antes de decidir`,
      description:
        sistema === "SAC"
          ? `Sua parcela cai ${formatBRL(difParcela.toFixed(2))} ao longo do contrato.`
          : "PRICE tem parcela constante; SAC pode custar menos no total.",
      actionLabel: "Ver gráfico",
      onAction: () => onNavigate("comparacao"),
      testId: "insight-card-comparacao",
    },
    {
      tone: "emerald" as const,
      category: "Pedagógico",
      icon: "📋",
      title: "CET oficial pode ser maior que esta simulação",
      description:
        "Cartório, IOF e avaliação do imóvel não estão incluídos aqui.",
      actionLabel: "Ver CET",
      onAction: () => onNavigateZone(3),
      testId: "insight-card-cet",
    },
  ];
}

export function RealEstateScenarioSidebar({
  result,
  onNavigate,
  onNavigateZone,
}: RealEstateScenarioSidebarProps) {
  const { summary } = result;
  const insights = buildInsightCards(summary, onNavigate, onNavigateZone);

  return (
    <aside
      className="
        hidden lg:flex w-[252px] flex-shrink-0 flex-col border-r border-cyan-200/8
        bg-slate-950/60 overflow-y-auto overflow-x-hidden
      "
      data-testid="observatory-sidebar"
      aria-label="Painel lateral do cenário simulado"
    >
      {/* Cenário */}
      <div className="border-b border-white/5 px-3 py-2.5">
        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          Cenário atual
        </p>
        <ScenarioRow label="Imóvel" value={formatBRL(summary.valor_imovel)} />
        <ScenarioRow label="Entrada" value={formatBRL(summary.valor_entrada)} />
        <ScenarioRow
          label="Financiado"
          value={formatBRL(summary.valor_financiado)}
          accent
        />
        <ScenarioRow label="Prazo" value={`${summary.prazo_meses} meses`} />
        <ScenarioRow
          label="Taxa mensal"
          value={formatRatePct(summary.taxa_juros_mensal)}
        />
        <ScenarioRow label="Sistema" value={summary.sistema_amortizacao} />
      </div>

      {/* Resultados rápidos */}
      <div className="border-b border-white/5 px-3 py-2.5">
        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          Resultados{" "}
          <span className="text-cyan-400">· {summary.sistema_amortizacao}</span>
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          <ResultPill
            label="1ª Parcela"
            value={formatBRL(summary.primeira_parcela)}
            tone="cyan"
          />
          <ResultPill
            label="Última"
            value={formatBRL(summary.ultima_parcela)}
            tone="emerald"
          />
          <ResultPill
            label="Total juros"
            value={formatBRL(summary.total_juros)}
            tone="amber"
          />
          <ResultPill
            label="Total pago"
            value={formatBRL(summary.total_pago)}
            tone="violet"
          />
        </div>
      </div>

      {/* Insight cards horizontais coloridos */}
      <div className="flex flex-col gap-1.5 px-2.5 py-2.5">
        <p className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          Atenção
        </p>
        {insights.map((card) => (
          <RealEstateInsightCard
            key={card.testId}
            category={card.category}
            icon={card.icon}
            title={card.title}
            description={card.description}
            tone={card.tone}
            actionLabel={card.actionLabel}
            onAction={card.onAction}
            testId={card.testId}
          />
        ))}
      </div>
    </aside>
  );
}
