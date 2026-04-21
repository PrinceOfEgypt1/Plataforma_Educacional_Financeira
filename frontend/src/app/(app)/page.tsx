import type { Metadata } from "next";
import Link from "next/link";

import { MODULES } from "@/config/modules";
import { EducationPanel } from "@/components/ui/EducationPanel";

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
  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-6">
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: "var(--color-brand-primary)" }}
        >
          Plataforma Educacional Financeira
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Simuladores e calculadoras para educação financeira pessoal. Selecione
          um módulo para começar.
        </p>
      </header>

      <section aria-label="Módulos disponíveis" className="mb-8">
        <h2 className="mb-1 text-lg font-semibold text-slate-700">Módulos</h2>
        <p className="mb-4 text-sm text-slate-500">
          Nesta Sprint os módulos estão em construção — cada tela já entrega
          contexto e aviso claro do que virá.
        </p>

        <ul
          role="list"
          aria-label="Lista de módulos"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {MODULES.map((mod) => (
            <li key={mod.id}>
              <Link
                href={mod.href}
                aria-label={`Abrir módulo ${mod.title}`}
                className="block rounded-xl border border-slate-200 bg-white p-5
                           shadow-sm transition-all duration-200
                           hover:border-blue-200 hover:shadow-md
                           focus:outline-none focus-visible:ring-2
                           focus-visible:ring-offset-2"
              >
                <h3 className="text-base font-semibold text-slate-800">
                  {mod.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">
                  {mod.description}
                </p>
                <span
                  className="mt-3 inline-block rounded-full bg-slate-100 px-2
                             py-0.5 text-xs font-medium text-slate-500"
                >
                  Em construção
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <EducationPanel title="Como a plataforma está organizada">
        <p>
          Cada módulo representa uma situação financeira típica. A partir da
          Sprint 2 os cálculos passarão a rodar contra a API do backend,
          respeitando o envelope de sucesso e o contrato de erros RFC 7807
          materializados na Fatia 1.
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
