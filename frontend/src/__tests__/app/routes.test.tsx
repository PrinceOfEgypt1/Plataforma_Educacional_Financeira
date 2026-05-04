/**
 * Teste dinâmico de rotas-base — para cada módulo, importa o respectivo
 * `page.tsx` via `import()` e valida contrato adequado ao status.
 *
 * Sprint 1 / 2 estabeleceu dois contratos distintos por status:
 *
 *   - `status === "em-construcao"` — página delega ao template
 *     `<ModulePage />`, que obriga título + ação de voltar +
 *     AlertBanner("em breve") + EducationPanel("sobre {shortTitle}"). É o
 *     contrato herdado e segue válido para os módulos que ainda não foram
 *     implementados.
 *
 *   - `status === "disponivel"` — o módulo tem sua própria página real.
 *     O contrato mínimo é: título do módulo como h1.
 *
 * Sprint 2 / F4 marcou `juros` como `disponivel`. Por isso este arquivo
 * foi reestruturado em dois blocos — um por status.
 */
import type { ReactElement } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { MODULES } from "@/config/modules";

/* -------------------------------------------------------------------------
 * Polyfill mínimo de ResizeObserver — recharts usa em runtime. Tipado sem
 * `any`: interface local + registro via `vi.stubGlobal` (aceita `unknown`).
 * ------------------------------------------------------------------------- */
interface MinimalResizeObserver {
  observe(): void;
  unobserve(): void;
  disconnect(): void;
}
class NoopResizeObserver implements MinimalResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}
vi.stubGlobal("ResizeObserver", NoopResizeObserver);

const emConstrucao = MODULES.filter((m) => m.status === "em-construcao");
const disponiveis = MODULES.filter((m) => m.status === "disponivel");

describe("Rotas-base — módulos em construção", () => {
  if (emConstrucao.length === 0) {
    it.skip("(nenhum módulo em-construcao no momento)", () => {});
  }
  for (const mod of emConstrucao) {
    it(`/${mod.slug} renderiza título, ação de voltar, aviso e education-panel`, async () => {
      const mod_ = await import(`@/app/(app)/${mod.slug}/page`);
      const Page = mod_.default as () => ReactElement;
      render(<Page />);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent(mod.title);

      const back = screen.getByRole("link", {
        name: /voltar para o dashboard inicial/i,
      });
      expect(back).toHaveAttribute("href", "/");

      const notice = screen.getByRole("status", {
        name: /aviso informativo/i,
      });
      expect(notice).toHaveTextContent(/em breve/i);

      const panel = screen.getByRole("complementary", {
        name: new RegExp(`sobre ${mod.shortTitle}`, "i"),
      });
      expect(panel).toBeInTheDocument();
    });
  }
});

describe("Rotas-base — módulos disponíveis", () => {
  if (disponiveis.length === 0) {
    it.skip("(nenhum módulo disponivel no momento)", () => {});
  }
  for (const mod of disponiveis) {
    it(`/${mod.slug} renderiza título do módulo e ação de voltar`, async () => {
      const mod_ = await import(`@/app/(app)/${mod.slug}/page`);
      const Page = mod_.default as () => ReactElement;
      render(<Page />);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent(mod.title);
      const back = screen.getByRole("link", {
        name: /voltar para o dashboard inicial/i,
      });
      expect(back).toHaveAttribute("href", "/");
    });
  }
});
