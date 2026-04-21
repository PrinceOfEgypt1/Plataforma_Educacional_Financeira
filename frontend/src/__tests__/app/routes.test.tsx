/**
 * Teste dinâmico de rotas-base — para cada módulo, importa o respectivo
 * `page.tsx` via `import()` e valida:
 *   - Renderização do título do módulo (cabeçalho);
 *   - Presença do `EducationPanel` (role complementary);
 *   - Presença do `AlertBanner` indicando "em construção".
 *
 * Como todas as 12 páginas delegam ao mesmo `<ModulePage moduleId=... />`,
 * esse teste cobre simultaneamente (a) o fato de que todas as 12 rotas
 * existem no filesystem e (b) o contrato do template central.
 */
import type { ReactElement } from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { MODULES } from "@/config/modules";

describe("Rotas-base dos 12 módulos", () => {
  for (const mod of MODULES) {
    it(`/${mod.slug} renderiza título, alert-banner e education-panel`, async () => {
      const mod_ = await import(`@/app/(app)/${mod.slug}/page`);
      const Page = mod_.default as () => ReactElement;
      render(<Page />);

      // Título aparece no cabeçalho (h1).
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent(mod.title);

      // AlertBanner de "em construção" (warning)
      const alert = screen.getByRole("alert");
      expect(alert).toHaveTextContent(/em construção/i);

      // EducationPanel com aria-label derivado do shortTitle
      const panel = screen.getByRole("complementary", {
        name: new RegExp(`sobre ${mod.shortTitle}`, "i"),
      });
      expect(panel).toBeInTheDocument();
    });
  }
});
