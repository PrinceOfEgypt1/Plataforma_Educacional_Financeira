import type { Metadata } from "next";

import { EmptyState } from "@/components/states";
import { MODULES, type ModuleEntry } from "@/config/modules";

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
    <section
      className="cockpit-coming-soon"
      data-testid={`module-page-${mod.id}`}
    >
      <div className="cockpit-empty-state">
        <div className="big" aria-hidden="true">
          {iconForModule(mod.id)}
        </div>
        <h1>Módulo {mod.title} — Em breve</h1>
        <p>{mod.description}</p>
        <span>
          Experiência será integrada em fatia futura, sem funcionalidade falsa.
        </span>
      </div>
    </section>
  );
}

function iconForModule(moduleId: string): string {
  const icons: Record<string, string> = {
    diagnostico: "🧭",
    "financiamento-imobiliario": "🏠",
    "financiamento-veiculo": "🚗",
    consignado: "💼",
    cdc: "🚗",
    "cartao-rotativo": "💳",
    atraso: "⏱️",
    indicadores: "📈",
    "investir-vs-quitar": "⚖️",
    educacao: "📚",
  };
  return icons[moduleId] ?? "✨";
}
