/**
 * `/juros` — página real do módulo "Juros simples e compostos" (F4).
 *
 * Substitui o placeholder `ModulePage` por uma experiência completa:
 *   - tabs (simples / compostos / comparar)
 *   - formulário por regime
 *   - resultado tipado (summary + chart + tabela + interpretação + alertas)
 *
 * O cálculo **sempre** é feito no backend (F3 — `/api/v1/interest/*`).
 * A página NÃO reimplementa domínio.
 */
import type { Metadata } from "next";

import { JurosTabs } from "@/components/interest";
import { MODULES } from "@/config/modules";

const JUROS_MODULE = MODULES.find((m) => m.id === "juros");

export const metadata: Metadata = {
  title: JUROS_MODULE?.title ?? "Juros simples e compostos",
  description:
    JUROS_MODULE?.description ??
    "Simule juros simples, juros compostos e compare os dois regimes.",
};

export default function JurosPage() {
  const title = JUROS_MODULE?.title ?? "Juros simples e compostos";
  const description =
    JUROS_MODULE?.description ??
    "Simule juros simples, juros compostos e compare os dois regimes.";

  return (
    <div className="mx-auto max-w-6xl" data-testid="juros-page">
      <header className="mb-6">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {JUROS_MODULE?.group.label ?? "Módulo"}
        </span>
        <h1
          className="mt-1 text-2xl font-bold tracking-tight"
          style={{ color: "var(--color-brand-primary)" }}
        >
          {title}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </header>
      <JurosTabs />
    </div>
  );
}
