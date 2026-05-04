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
import { ModuleHeader } from "@/components/shell/ModuleHeader";

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
    <div
      className="mx-auto max-w-4xl space-y-6"
      data-testid={`module-page-${mod.id}`}
    >
      <ModuleHeader module={mod} />

      <AlertBanner level="info" title="Módulo em breve">
        Esta área faz parte do roadmap da plataforma. Ela já tem navegação,
        contexto e retorno claro para o dashboard, mas ainda não executa
        simulações.
      </AlertBanner>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <EmptyState
          title="Simulador ainda não disponível"
          description="Esta tela receberá formulário, resultado, interpretação
                       educativa e estados padronizados em uma fatia futura."
          icon="•"
        />
      </div>

      <div>
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
