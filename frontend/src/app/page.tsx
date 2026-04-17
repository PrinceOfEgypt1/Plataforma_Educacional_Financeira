import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Início",
};

/** Módulos disponíveis na plataforma */
const MODULES = [
  {
    id: "juros",
    href: "/juros",
    title: "Juros Compostos",
    description:
      "Simule crescimento de capital e compare juros simples vs. compostos.",
    status: "em-breve" as const,
  },
  {
    id: "amortizacao",
    href: "/amortizacao",
    title: "Amortização PRICE / SAC",
    description:
      "Compare tabelas de amortização e veja o impacto de cada modalidade.",
    status: "em-breve" as const,
  },
  {
    id: "financiamento",
    href: "/financiamento",
    title: "Financiamento",
    description:
      "Simule financiamentos imobiliários e de veículos com CET detalhado.",
    status: "em-breve" as const,
  },
  {
    id: "emprestimos",
    href: "/emprestimos",
    title: "Empréstimos",
    description:
      "Calcule CET e compare modalidades de crédito pessoal e consignado.",
    status: "em-breve" as const,
  },
  {
    id: "cartao",
    href: "/cartao",
    title: "Cartão de Crédito",
    description:
      "Entenda o custo real do rotativo, parcelamento e antecipação de recebíveis.",
    status: "em-breve" as const,
  },
  {
    id: "indicadores",
    href: "/indicadores",
    title: "Indicadores Econômicos",
    description: "Selic, IPCA, CDI e TR com fonte e data-base oficiais.",
    status: "em-breve" as const,
  },
] as const;

/** Badge de status do módulo */
function StatusBadge({ status }: { status: "disponivel" | "em-breve" }) {
  if (status === "disponivel") {
    return (
      <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
        Disponível
      </span>
    );
  }
  return (
    <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
      Em breve
    </span>
  );
}

/** Card de módulo */
function ModuleCard({
  title,
  description,
  status,
}: {
  title: string;
  description: string;
  status: "disponivel" | "em-breve";
  href: string;
}) {
  return (
    <article
      className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm
                 hover:shadow-md hover:border-blue-200 transition-all duration-200"
      aria-label={`Módulo: ${title}`}
    >
      <h2 className="text-base font-semibold text-slate-800 mb-1">{title}</h2>
      <p className="text-sm text-slate-500 mb-3 leading-relaxed">
        {description}
      </p>
      <StatusBadge status={status} />
    </article>
  );
}

/** Página inicial */
export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-[#1B4F72] text-white px-6 py-6" role="banner">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold tracking-tight">
            Plataforma Educacional Financeira
          </h1>
          <p className="text-sm text-blue-200 mt-1">
            Simuladores e calculadoras para educação financeira pessoal
          </p>
        </div>
      </header>

      {/* Conteúdo */}
      <section className="px-6 py-8" aria-label="Módulos disponíveis">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-lg font-semibold text-slate-700 mb-1">Módulos</h2>
          <p className="text-sm text-slate-400 mb-6">
            Selecione um simulador para começar.
          </p>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            role="list"
            aria-label="Lista de módulos"
          >
            {MODULES.map((mod) => (
              <div key={mod.id} role="listitem">
                <ModuleCard
                  title={mod.title}
                  description={mod.description}
                  status={mod.status}
                  href={mod.href}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t border-slate-200 px-6 py-4 mt-8 text-center"
        role="contentinfo"
      >
        <p className="text-xs text-slate-400">
          Os cálculos são aproximações educacionais. Consulte um profissional
          habilitado para decisões financeiras.
        </p>
      </footer>
    </main>
  );
}
