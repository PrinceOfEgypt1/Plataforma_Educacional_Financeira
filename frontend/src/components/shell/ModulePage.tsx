/**
 * `<ModulePage />` — template reutilizado pelas 12 páginas de módulo
 * navegáveis da Sprint 1.
 *
 * Cada `page.tsx` dos slugs canônicos importa este componente e injeta o
 * `moduleId`. Isso mantém as páginas individuais enxutas, sem lógica
 * duplicada, mas preserva uma entrada por rota (obrigatória pelo App
 * Router do Next.js para que `metadata` e links funcionem por rota).
 *
 * Exibe, para cada módulo:
 *   - Cabeçalho com grupo, título e descrição;
 *   - `AlertBanner` explicitando que o módulo está em construção;
 *   - `EmptyState` indicando ausência de simulações;
 *   - `EducationPanel` com contexto educativo específico.
 */
import type { Metadata } from "next";

import { MODULES, type ModuleEntry } from "@/config/modules";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { EducationPanel } from "@/components/ui/EducationPanel";
import { EmptyState } from "@/components/states";

export function buildModuleMetadata(moduleId: string): Metadata {
  const mod = MODULES.find((m) => m.id === moduleId);
  if (!mod) return { title: "Módulo" };
  return { title: mod.title, description: mod.description };
}

export interface ModulePageProps {
  readonly moduleId: string;
}

export function ModulePage({ moduleId }: ModulePageProps) {
  const mod: ModuleEntry | undefined = MODULES.find((m) => m.id === moduleId);

  if (!mod) {
    return (
      <EmptyState
        title="Módulo não encontrado"
        description={`Nenhum módulo com id "${moduleId}" está registrado.`}
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl" data-testid={`module-page-${mod.id}`}>
      <header className="mb-6">
        <span
          className="text-[11px] font-semibold uppercase tracking-wider
                     text-slate-400"
        >
          {mod.group.label}
        </span>
        <h1
          className="mt-1 text-2xl font-bold tracking-tight"
          style={{ color: "var(--color-brand-primary)" }}
        >
          {mod.title}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{mod.description}</p>
      </header>

      <AlertBanner level="warning" title="Módulo em construção">
        A calculadora deste módulo será integrada à API da plataforma a partir
        da próxima Sprint. Até lá, esta página serve como ponto de entrada
        navegável e descrição do escopo.
      </AlertBanner>

      <div className="mt-6">
        <EmptyState
          title="Ainda não há simulações para este módulo"
          description="Em breve, esta tela receberá formulário de entrada e
                       apresentação de resultado padronizada."
        />
      </div>

      <div className="mt-6">
        <EducationPanel title={`Sobre ${mod.shortTitle}`}>
          <p>{mod.description}</p>
          <p className="text-xs text-slate-500">
            Os cálculos oferecidos serão sempre aproximações educacionais.
            Consulte sempre o contrato ou um profissional habilitado.
          </p>
        </EducationPanel>
      </div>
    </div>
  );
}
