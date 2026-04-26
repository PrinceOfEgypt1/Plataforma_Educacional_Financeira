/**
 * `/juros` — página real do módulo "Juros simples e compostos".
 *
 * F4 (PR #9): tabs (simples / compostos / comparar) + formulário por
 * regime + resultado tipado (summary + chart + tabela + interpretação +
 * alertas). O cálculo **sempre** é feito no backend
 * (F3 — `/api/v1/interest/*`). A página NÃO reimplementa domínio.
 *
 * F5 (Sprint 2 — Conteúdo Educacional + Docs vivos): a página agora
 * exibe, abaixo das tabs de simulação, uma seção "Aprenda mais sobre
 * juros" com quatro blocos de conteúdo Nível 1 (juros simples, juros
 * compostos, comparação, aportes). Cada bloco é renderizado pelo
 * componente `<JurosSaibaMais />`, que reusa `<EducationPanel />` e
 * carrega o disclaimer "produto educacional, não consultoria"
 * (Doc 08 §6.4). Os textos vêm de `frontend/src/content/juros/nivel-1.ts`,
 * estão alinhados ao Doc 15 (JS-01, JC-01) e foram revisados na
 * `F5-revisao-editorial.md`.
 */
import type { Metadata } from "next";

import { JurosSaibaMais, JurosTabs } from "@/components/interest";
import { MODULES } from "@/config/modules";
import { CONTEUDO_NIVEL_1 } from "@/content/juros";

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

      <section
        aria-labelledby="juros-aprenda-mais-heading"
        className="mt-10"
        data-testid="juros-aprenda-mais"
      >
        <h2
          id="juros-aprenda-mais-heading"
          className="mb-4 text-lg font-semibold tracking-tight"
          style={{ color: "var(--color-brand-primary)" }}
        >
          Aprenda mais sobre juros
        </h2>
        <p className="mb-4 text-sm text-slate-500">
          Conteúdo educacional Nível 1 (essencial). Para aprofundamento,
          consulte o Doc 08 do projeto.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {CONTEUDO_NIVEL_1.map((bloco) => (
            <JurosSaibaMais key={bloco.slug} content={bloco} />
          ))}
        </div>
      </section>
    </div>
  );
}
