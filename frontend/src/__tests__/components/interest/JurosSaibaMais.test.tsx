/**
 * Testes de unidade — `<JurosSaibaMais />`.
 *
 * Cobre:
 *   - Renderização do título do bloco de conteúdo no `<EducationPanel />`.
 *   - Renderização de cada parágrafo do `paragraphs` em `<p>` distinto.
 *   - Presença do disclaimer "produto educacional, não consultoria"
 *     (Doc 08 §6.4).
 *   - Acessibilidade: o painel é `role="complementary"` (vem de
 *     `<EducationPanel />`) e expõe `aria-label` derivado do título.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { JurosSaibaMais } from "@/components/interest/JurosSaibaMais";
import {
  CONTEUDO_NIVEL_1,
  CONTEUDO_NIVEL_2,
  type EducationalContent,
} from "@/content/juros";

const SAMPLE: EducationalContent = CONTEUDO_NIVEL_1[0]!;

describe("<JurosSaibaMais />", () => {
  it("renderiza o título do bloco no painel educativo", () => {
    render(<JurosSaibaMais content={SAMPLE} />);
    expect(
      screen.getByRole("heading", { name: SAMPLE.title }),
    ).toBeInTheDocument();
  });

  it("renderiza um <p> para cada parágrafo do conteúdo", () => {
    render(<JurosSaibaMais content={SAMPLE} />);
    const paragraphs = screen.getAllByTestId("juros-saiba-mais-paragraph");
    expect(paragraphs).toHaveLength(SAMPLE.paragraphs.length);
    expect(paragraphs[0]?.textContent ?? "").toContain(
      SAMPLE.paragraphs[0]?.slice(0, 30) ?? "",
    );
  });

  it("inclui o disclaimer educacional ao final do bloco", () => {
    render(<JurosSaibaMais content={SAMPLE} />);
    const disclaimer = screen.getByTestId("juros-saiba-mais-disclaimer");
    expect(disclaimer.textContent ?? "").toContain("educacional");
  });

  it("usa role='complementary' herdado do EducationPanel", () => {
    render(<JurosSaibaMais content={SAMPLE} />);
    expect(screen.getByRole("complementary")).toBeInTheDocument();
  });

  it("aceita conteúdo de Nível 2 sem alterações estruturais", () => {
    const sampleN2 = CONTEUDO_NIVEL_2.find((c) => c.slug === "juros-compostos");
    if (!sampleN2) {
      throw new Error("Conteúdo Nível 2 'juros-compostos' não encontrado");
    }
    render(<JurosSaibaMais content={sampleN2} />);
    expect(
      screen.getByRole("heading", { name: sampleN2.title }),
    ).toBeInTheDocument();
  });
});
