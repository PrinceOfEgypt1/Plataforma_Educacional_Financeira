/**
 * Smoke + integração — `/juros` renderiza o módulo real e expõe o
 * conteúdo educacional da F5 abaixo das tabs.
 *
 * Camadas validadas:
 *   1. F4 (PR #9): tabs + formulário inicial (juros simples).
 *   2. F5 (Sprint 2): seção "Aprenda mais sobre juros" com os quatro
 *      blocos de Nível 1, ligados ao backend educacional via
 *      `frontend/src/content/juros/nivel-1.ts`. Cada bloco é renderizado
 *      pelo `<JurosSaibaMais />` dentro de um `<EducationPanel />`
 *      (`role="complementary"` herdado).
 */
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

/* ResizeObserver — recharts usa em runtime; jsdom não traz nativamente.
 * Tipado sem `any`: interface local + `vi.stubGlobal`. */
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

vi.mock("next/navigation", () => ({
  usePathname: () => "/juros",
  useRouter: () => ({ push: () => {} }),
}));

import JurosPage from "@/app/(app)/juros/page";
import { CONTEUDO_NIVEL_1 } from "@/content/juros";

describe("JurosPage — F4 (módulo real, não placeholder)", () => {
  it("renderiza tabs e formulário inicial (juros simples)", () => {
    render(<JurosPage />);
    expect(screen.getByTestId("juros-page")).toBeInTheDocument();
    expect(screen.getByTestId("juros-tabs")).toBeInTheDocument();
    expect(screen.getByTestId("juros-simples-form")).toBeInTheDocument();
    // NÃO deve aparecer o texto do placeholder genérico.
    expect(screen.queryByText(/Módulo em construção/i)).not.toBeInTheDocument();
  });
});

describe("JurosPage — F5 (conteúdo educacional integrado)", () => {
  it("renderiza a seção 'Aprenda mais sobre juros' abaixo das tabs", () => {
    render(<JurosPage />);
    const secao = screen.getByTestId("juros-aprenda-mais");
    expect(secao).toBeInTheDocument();
    expect(secao.tagName.toLowerCase()).toBe("details");
    expect(secao).not.toHaveAttribute("open");
    expect(
      within(secao).getByRole("heading", {
        name: /aprenda mais sobre juros/i,
        level: 2,
      }),
    ).toBeInTheDocument();
  });

  it.each(CONTEUDO_NIVEL_1)(
    "expõe o bloco de Nível 1 '$slug' com seu título completo",
    (bloco) => {
      render(<JurosPage />);
      // Cada bloco vira um EducationPanel (role=complementary) com h3=título.
      expect(
        screen.getByRole("heading", { name: bloco.title }),
      ).toBeInTheDocument();
    },
  );

  it("renderiza um EducationPanel por bloco (4 ao todo) — role=complementary", () => {
    render(<JurosPage />);
    const paineis = screen.getAllByRole("complementary");
    // 4 = quatro blocos de Nível 1 da F5; o módulo real (F4) não usa
    // EducationPanel fora deles na rota /juros antes da simulação.
    expect(paineis.length).toBe(CONTEUDO_NIVEL_1.length);
  });

  it("o bloco 'juros-simples' Nível 1 cita os números canônicos de JS-01", () => {
    render(<JurosPage />);

    const paineis = screen.getAllByRole("complementary");
    const painelJurosSimples = paineis.find((painel) =>
      within(painel).queryByRole("heading", {
        name: /juros simples/i,
      }),
    );

    expect(painelJurosSimples).toBeDefined();

    const escopoJurosSimples = within(painelJurosSimples!);

    // Fragmentos literais que o teste de coerência numérica
    // (`conteudo.test.ts`) também verifica no nível dos dados — aqui
    // garantimos que eles chegam ao bloco correto renderizado pela rota /juros.
    expect(escopoJurosSimples.getByText(/1\.000,00/)).toBeInTheDocument();
    expect(escopoJurosSimples.getByText(/1\.120,00/)).toBeInTheDocument();
  });

  it("o disclaimer 'produto educacional, não consultoria' aparece na rota /juros", () => {
    render(<JurosPage />);
    // Cada bloco carrega o mesmo DISCLAIMER_EDUCACIONAL — devem aparecer
    // 4 cópias (uma por painel). getAllByText falha se não existir.
    const ocorrencias = screen.getAllByText(/educacional/i);
    expect(ocorrencias.length).toBeGreaterThanOrEqual(CONTEUDO_NIVEL_1.length);
  });
});
