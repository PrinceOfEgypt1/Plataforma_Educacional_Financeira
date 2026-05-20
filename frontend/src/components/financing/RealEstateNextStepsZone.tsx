"use client";

/**
 * RealEstateNextStepsZone — Zona 5: Próximos passos com Step HCards
 *
 * ITEM 14D-B: Grid de 6 step HCards, cada um com CTA único e distinto.
 */

interface StepHCard {
  readonly tone: "cyan" | "violet" | "amber" | "emerald" | "rose";
  readonly icon: string;
  readonly category: string;
  readonly title: string;
  readonly description: string;
  readonly actionLabel: string;
  readonly onAction: () => void;
}

interface Props {
  readonly onNavigate: (view: string) => void;
  /** Setter direto da zona ativa do ResultPanel */
  readonly onNavigateZone: (zone: 1 | 2 | 3 | 4 | 5) => void;
}

const TONE_STYLES = {
  cyan: {
    wrapper: "border-cyan-400/20 bg-cyan-400/5 hover:border-cyan-400/35",
    icon: "bg-cyan-400/15",
    cat: "text-cyan-300/80",
    btn: "border-cyan-400/35 bg-cyan-400/12 text-cyan-200 hover:bg-cyan-400/20",
  },
  violet: {
    wrapper: "border-violet-400/20 bg-violet-400/5 hover:border-violet-400/35",
    icon: "bg-violet-400/15",
    cat: "text-violet-300/80",
    btn: "border-violet-400/35 bg-violet-400/12 text-violet-200 hover:bg-violet-400/20",
  },
  amber: {
    wrapper: "border-amber-400/20 bg-amber-400/5 hover:border-amber-400/35",
    icon: "bg-amber-400/15",
    cat: "text-amber-300/80",
    btn: "border-amber-400/35 bg-amber-400/12 text-amber-200 hover:bg-amber-400/20",
  },
  emerald: {
    wrapper:
      "border-emerald-400/20 bg-emerald-400/5 hover:border-emerald-400/35",
    icon: "bg-emerald-400/15",
    cat: "text-emerald-300/80",
    btn: "border-emerald-400/35 bg-emerald-400/12 text-emerald-200 hover:bg-emerald-400/20",
  },
  rose: {
    wrapper: "border-rose-400/20 bg-rose-400/5 hover:border-rose-400/35",
    icon: "bg-rose-400/15",
    cat: "text-rose-300/80",
    btn: "border-rose-400/35 bg-rose-400/12 text-rose-200 hover:bg-rose-400/20",
  },
};

function HCard({ card }: { readonly card: StepHCard }) {
  const s = TONE_STYLES[card.tone];
  return (
    <article
      className={`flex gap-2.5 rounded-xl border p-3 transition-colors ${s.wrapper}`}
    >
      <div
        className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-base ${s.icon}`}
        aria-hidden="true"
      >
        {card.icon}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={`text-[10px] font-bold uppercase tracking-[0.14em] ${s.cat}`}
        >
          {card.category}
        </p>
        <p className="mt-0.5 text-[12px] font-semibold leading-tight text-slate-100">
          {card.title}
        </p>
        <p className="mt-1 text-[11px] leading-4.5 text-slate-400">
          {card.description}
        </p>
        <button
          type="button"
          onClick={card.onAction}
          className={`mt-2 rounded-md border px-2 py-0.5 text-[10px] font-semibold transition-colors focus:outline-none focus:ring-1 focus:ring-current ${s.btn}`}
        >
          {card.actionLabel} →
        </button>
      </div>
    </article>
  );
}

export function RealEstateNextStepsZone({ onNavigate, onNavigateZone }: Props) {
  const cards: StepHCard[] = [
    {
      tone: "violet",
      icon: "⚖️",
      category: "Comparação",
      title: "Comparar SAC × PRICE lado a lado",
      description:
        "Veja os dois sistemas com o mesmo cenário e entenda como a escolha afeta seu orçamento.",
      actionLabel: "Abrir gráfico comparativo",
      onAction: () => onNavigate("comparacao"),
    },
    {
      tone: "amber",
      icon: "📐",
      category: "Revisão",
      title: "Revisar a taxa de juros digitada",
      description:
        "Pequenas variações de taxa impactam drasticamente o custo total. Verifique se a taxa está correta.",
      actionLabel: "Editar simulação",
      onAction: () => onNavigate("simulacao"),
    },
    {
      tone: "cyan",
      icon: "📊",
      category: "Análise",
      title: "Examinar a tabela completa",
      description:
        "Veja parcela a parcela como evolui o saldo devedor, os juros e a amortização.",
      actionLabel: "Abrir tabela",
      onAction: () => onNavigate("tabela"),
    },
    {
      tone: "emerald",
      icon: "🧮",
      category: "Auditoria",
      title: "Verificar a memória de cálculo",
      description:
        "Confira fórmulas, variáveis substituídas e o passo a passo de cada parcela.",
      actionLabel: "Ver memória",
      onAction: () => onNavigate("memoria"),
    },
    {
      tone: "cyan",
      icon: "📚",
      category: "Educação",
      title: "Conferir fontes, limites e alertas",
      description:
        "Entenda o que esta simulação considera e o que ela não calcula — antes de ir ao banco.",
      actionLabel: "Ver fontes",
      onAction: () => onNavigate("fontes"),
    },
    {
      tone: "rose",
      icon: "🏦",
      category: "Ação externa",
      title: "Solicitar proposta formal",
      description:
        "Com esses dados em mãos, solicite proposta formal e CET oficial em pelo menos duas IFs.",
      actionLabel: "Ver CET e limites",
      onAction: () => onNavigateZone(3),
    },
  ];

  return (
    <div className="space-y-2" data-testid="zone-proximos-content">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
        O que fazer agora?
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {cards.map((card) => (
          <HCard key={card.title} card={card} />
        ))}
      </div>
    </div>
  );
}
