import type { Metadata } from "next";
import Link from "next/link";

import { MODULES, type ModuleEntry } from "@/config/modules";
import { EducationPanel } from "@/components/ui/EducationPanel";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Início",
};

/**
 * Home da plataforma — grid dos 12 módulos canônicos.
 *
 * Cada card renderiza title, description, badge de status e é **um link**
 * para a rota do módulo. A fonte de dados é `@/config/modules` (fonte única
 * da Sprint 1 §5.4 do PLANO).
 */
export default function HomePage() {
  const available = MODULES.filter((mod) => mod.status === "disponivel");
  const planned = MODULES.filter((mod) => mod.status === "em-construcao");

  return (
    <div className="mx-auto max-w-6xl">
      <header
        className="mb-8 overflow-hidden rounded-2xl border border-slate-200
                   bg-white shadow-sm"
      >
        <div className="border-l-4 border-[var(--color-brand-primary)] p-6 sm:p-8">
          <span
            className="rounded-full bg-[var(--color-learning-soft)] px-3 py-1
                       text-[11px] font-semibold uppercase tracking-wider
                       text-[var(--color-learning)]"
          >
            Educação financeira aplicada
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Plataforma Educacional Financeira
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
            Simule juros e amortização com contexto didático. Comece pelos
            módulos disponíveis e acompanhe os próximos blocos planejados.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/juros"
              className="rounded-full bg-[var(--color-brand-primary)] px-4 py-2
                         text-sm font-semibold text-white shadow-sm
                         transition-opacity hover:opacity-90 focus:outline-none
                         focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]
                         focus-visible:ring-offset-2"
            >
              Abrir juros
            </Link>
            <Link
              href="/amortizacao"
              className="rounded-full border border-emerald-200 bg-emerald-50
                         px-4 py-2 text-sm font-semibold text-emerald-700
                         transition-colors hover:border-emerald-300
                         focus:outline-none focus-visible:ring-2
                         focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2"
            >
              Ver amortização
            </Link>
          </div>
        </div>
      </header>

      <section aria-label="Módulos disponíveis" className="mb-8">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Módulos disponíveis
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Entradas reais já conectadas à API e protegidas por testes.
            </p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {available.length} disponíveis
          </span>
        </div>

        <ul
          role="list"
          aria-label="Lista de módulos"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          {available.map((mod) => (
            <li key={mod.id}>
              <ModuleCard module={mod} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Módulos em breve" className="mb-8">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Próximos módulos
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Áreas planejadas com propósito claro, ainda sem simulação ativa.
            </p>
          </div>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            {planned.length} em breve
          </span>
        </div>

        <ul
          role="list"
          aria-label="Lista de módulos em breve"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {planned.map((mod) => (
            <li key={mod.id}>
              <ModuleCard module={mod} />
            </li>
          ))}
        </ul>
      </section>

      <EducationPanel title="Como a plataforma está organizada">
        <p>
          Cada módulo representa uma situação financeira típica. Módulos
          disponíveis já consomem a API do backend; módulos em breve mostram
          escopo e caminho de evolução sem prometer funcionalidade inexistente.
        </p>
        <p className="text-xs text-slate-500">
          Os valores exibidos nas simulações são sempre aproximações
          educacionais — não substituem a consulta ao contrato ou a um
          profissional habilitado.
        </p>
      </EducationPanel>
    </div>
  );
}

function ModuleCard({ module }: { readonly module: ModuleEntry }) {
  const available = module.status === "disponivel";
  return (
    <Link
      href={module.href}
      aria-label={`Abrir módulo ${module.title}`}
      className={cn(
        "block h-full rounded-2xl border bg-white p-5 shadow-sm",
        "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        "focus:outline-none focus-visible:ring-2",
        "focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2",
        available
          ? "border-emerald-200 hover:border-emerald-300"
          : "border-slate-200 hover:border-amber-200",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-slate-900">
          {module.title}
        </h3>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold",
            available
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700",
          )}
        >
          {available ? "Disponível" : "Em breve"}
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        {module.description}
      </p>
      <span className="mt-4 inline-flex text-sm font-semibold text-[var(--color-brand-primary)]">
        {available ? "Abrir simulador" : "Ver escopo planejado"}
      </span>
    </Link>
  );
}
