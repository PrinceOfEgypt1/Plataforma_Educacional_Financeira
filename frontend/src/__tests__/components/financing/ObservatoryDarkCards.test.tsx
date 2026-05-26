/**
 * ObservatoryDarkCards — Testes dos 7 UI primitivos F8C-v6.3
 *
 * Verifica renderização, testIds, tokens e contratos visuais básicos.
 */

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import {
  ScoreCard,
  MetricCard,
  ChecklistCard,
  BeforeAfterCard,
  QuestionCard,
  InsightBox,
  InsightStrong,
  ApplyCard,
  ObsScoreGrid,
  ObsTaskGrid,
  ObsQGrid,
  ObsApplyGrid,
  OBS,
} from "@/components/financing/ObservatoryDarkCards";

// ── OBS token palette ────────────────────────────────────────────────────────

describe("OBS token palette", () => {
  it("expõe os 12 tokens com valores corretos", () => {
    expect(OBS.bg).toBe("#030811");
    expect(OBS.surface).toBe("#0a1628");
    expect(OBS.surface2).toBe("#0f1e35");
    expect(OBS.border).toBe("#1a2f50");
    expect(OBS.accent).toBe("#3b82f6");
    expect(OBS.accent2).toBe("#06b6d4");
    expect(OBS.gold).toBe("#f59e0b");
    expect(OBS.green).toBe("#10b981");
    expect(OBS.red).toBe("#ef4444");
    expect(OBS.text).toBe("#e2e8f0");
    expect(OBS.textMuted).toBe("#64748b");
    expect(OBS.textDim).toBe("#94a3b8");
  });
});

// ── ScoreCard ────────────────────────────────────────────────────────────────

describe("ScoreCard", () => {
  it("renderiza label e value", () => {
    render(<ScoreCard label="Primeira parcela" value="R$ 2.000,00" />);
    expect(screen.getByText("Primeira parcela")).toBeInTheDocument();
    expect(screen.getByText("R$ 2.000,00")).toBeInTheDocument();
  });

  it("usa testId padrão obs-score-card", () => {
    render(<ScoreCard label="L" value="V" />);
    expect(screen.getByTestId("obs-score-card")).toBeInTheDocument();
  });

  it("usa testId customizado", () => {
    render(<ScoreCard label="L" value="V" testId="score-custom" />);
    expect(screen.getByTestId("score-custom")).toBeInTheDocument();
  });

  it("exibe note quando fornecida", () => {
    render(<ScoreCard label="L" value="V" note="Nota pedagógica" />);
    expect(screen.getByText("Nota pedagógica")).toBeInTheDocument();
  });

  it("não exibe note quando ausente", () => {
    render(<ScoreCard label="L" value="V" />);
    expect(screen.queryByText("Nota pedagógica")).not.toBeInTheDocument();
  });

  it("renderiza barra de progresso quando barPct é fornecido", () => {
    const { container } = render(
      <ScoreCard label="L" value="V" barPct={60} barColor={OBS.gold} />,
    );
    const bars = container.querySelectorAll(
      'div[style*="width: 60%"], div[style*="width:60%"]',
    );
    expect(bars.length).toBeGreaterThan(0);
  });
});

// ── MetricCard ───────────────────────────────────────────────────────────────

describe("MetricCard", () => {
  const rows = [
    { label: "SAC", value: "60%", pct: 60, color: OBS.green },
    { label: "PRICE", value: "40%", pct: 40, color: OBS.accent },
  ];

  it("renderiza title e rows", () => {
    render(<MetricCard title="Distribuição" rows={rows} />);
    expect(screen.getByText("Distribuição")).toBeInTheDocument();
    expect(screen.getByText("SAC")).toBeInTheDocument();
    expect(screen.getByText("PRICE")).toBeInTheDocument();
  });

  it("usa testId padrão obs-metric-card", () => {
    render(<MetricCard title="T" rows={[]} />);
    expect(screen.getByTestId("obs-metric-card")).toBeInTheDocument();
  });

  it("usa testId customizado", () => {
    render(<MetricCard title="T" rows={[]} testId="metric-custom" />);
    expect(screen.getByTestId("metric-custom")).toBeInTheDocument();
  });
});

// ── ChecklistCard ────────────────────────────────────────────────────────────

describe("ChecklistCard", () => {
  const rows = [
    {
      num: "01",
      field: "Valor do imóvel",
      description: "Preço de mercado.",
      example: "R$ 500.000",
    },
    {
      num: "02",
      field: "Entrada",
      description: "Percentual mínimo.",
    },
  ];

  it("renderiza header e rows", () => {
    render(<ChecklistCard header="Dados necessários" rows={rows} />);
    expect(screen.getByText("Dados necessários")).toBeInTheDocument();
    expect(screen.getByText("Valor do imóvel")).toBeInTheDocument();
    expect(screen.getByText("Entrada")).toBeInTheDocument();
  });

  it("exibe example quando presente", () => {
    render(<ChecklistCard header="H" rows={rows} />);
    expect(screen.getByText("R$ 500.000")).toBeInTheDocument();
  });

  it("usa testId padrão obs-checklist-card", () => {
    render(<ChecklistCard header="H" rows={[]} />);
    expect(screen.getByTestId("obs-checklist-card")).toBeInTheDocument();
  });
});

// ── BeforeAfterCard ──────────────────────────────────────────────────────────

describe("BeforeAfterCard", () => {
  const before = {
    title: "PRICE",
    lines: ["1ª parcela: R$ 1.800,00", "Total juros: R$ 90.000,00"],
  };
  const after = {
    title: "SAC",
    lines: ["1ª parcela: R$ 2.100,00", "Total juros: R$ 70.000,00"],
  };

  it("renderiza os dois lados", () => {
    render(<BeforeAfterCard before={before} after={after} />);
    expect(screen.getByText("PRICE")).toBeInTheDocument();
    expect(screen.getByText("SAC")).toBeInTheDocument();
  });

  it("exibe linhas de conteúdo de ambos os lados", () => {
    render(<BeforeAfterCard before={before} after={after} />);
    expect(screen.getByText("1ª parcela: R$ 1.800,00")).toBeInTheDocument();
    expect(screen.getByText("1ª parcela: R$ 2.100,00")).toBeInTheDocument();
  });

  it("usa testId padrão obs-before-after-card", () => {
    render(<BeforeAfterCard before={before} after={after} />);
    expect(screen.getByTestId("obs-before-after-card")).toBeInTheDocument();
  });

  it("usa testId customizado", () => {
    render(
      <BeforeAfterCard
        before={before}
        after={after}
        testId="compare-before-after-card"
      />,
    );
    expect(screen.getByTestId("compare-before-after-card")).toBeInTheDocument();
  });
});

// ── QuestionCard ─────────────────────────────────────────────────────────────

describe("QuestionCard", () => {
  it("renderiza ordinal, titleLabel e question", () => {
    render(
      <QuestionCard
        ordinal="01"
        titleLabel="Antes de simular"
        question="Qual o valor do imóvel?"
      />,
    );
    expect(screen.getByText("Antes de simular")).toBeInTheDocument();
    expect(screen.getByText("Qual o valor do imóvel?")).toBeInTheDocument();
  });

  it("exibe hint quando fornecido", () => {
    render(
      <QuestionCard
        ordinal="01"
        titleLabel="T"
        question="Q"
        hint="Dica contextual"
      />,
    );
    expect(screen.getByText("Dica contextual")).toBeInTheDocument();
  });

  it("usa testId padrão obs-question-card", () => {
    render(<QuestionCard ordinal="01" titleLabel="T" question="Q" />);
    expect(screen.getByTestId("obs-question-card")).toBeInTheDocument();
  });

  it("usa testId customizado", () => {
    render(
      <QuestionCard
        ordinal="01"
        titleLabel="T"
        question="Q"
        testId="home-question-card-renda"
      />,
    );
    expect(screen.getByTestId("home-question-card-renda")).toBeInTheDocument();
  });
});

// ── InsightBox ───────────────────────────────────────────────────────────────

describe("InsightBox", () => {
  it("renderiza children", () => {
    render(
      <InsightBox>
        <p>Conteúdo pedagógico importante</p>
      </InsightBox>,
    );
    expect(
      screen.getByText("Conteúdo pedagógico importante"),
    ).toBeInTheDocument();
  });

  it("renderiza icon quando fornecido", () => {
    render(<InsightBox icon="💡">Texto</InsightBox>);
    expect(screen.getByText("💡")).toBeInTheDocument();
  });

  it("usa testId padrão obs-insight-box", () => {
    render(<InsightBox>T</InsightBox>);
    expect(screen.getByTestId("obs-insight-box")).toBeInTheDocument();
  });

  it("usa testId customizado", () => {
    render(<InsightBox testId="home-insight-box">T</InsightBox>);
    expect(screen.getByTestId("home-insight-box")).toBeInTheDocument();
  });
});

// ── InsightStrong ────────────────────────────────────────────────────────────

describe("InsightStrong", () => {
  it("renderiza children em strong com cor gold", () => {
    render(
      <InsightBox>
        <InsightStrong>R$ 1.234,56</InsightStrong>
      </InsightBox>,
    );
    const el = screen.getByText("R$ 1.234,56");
    expect(el.tagName).toBe("STRONG");
    expect(el).toHaveStyle({ color: OBS.gold });
  });
});

// ── ApplyCard ────────────────────────────────────────────────────────────────

describe("ApplyCard", () => {
  it("renderiza tag e title", () => {
    render(<ApplyCard tag="Dica" title="Solicite o CET oficial" />);
    expect(screen.getByText("Dica")).toBeInTheDocument();
    expect(screen.getByText("Solicite o CET oficial")).toBeInTheDocument();
  });

  it("renderiza body quando fornecido", () => {
    render(<ApplyCard tag="T" title="Tt" body={<span>Corpo do card</span>} />);
    expect(screen.getByText("Corpo do card")).toBeInTheDocument();
  });

  it("renderiza block quando fornecido", () => {
    render(<ApplyCard tag="T" title="Tt" block="Código exemplo de bloco" />);
    expect(screen.getByText("Código exemplo de bloco")).toBeInTheDocument();
  });

  it("usa testId padrão obs-apply-card", () => {
    render(<ApplyCard tag="T" title="Tt" />);
    expect(screen.getByTestId("obs-apply-card")).toBeInTheDocument();
  });
});

// ── Grid helpers ─────────────────────────────────────────────────────────────

describe("Grid helpers", () => {
  it("ObsScoreGrid renderiza com testId obs-score-grid", () => {
    render(
      <ObsScoreGrid>
        <div>filho</div>
      </ObsScoreGrid>,
    );
    expect(screen.getByTestId("obs-score-grid")).toBeInTheDocument();
  });

  it("ObsTaskGrid renderiza com testId obs-task-grid", () => {
    render(
      <ObsTaskGrid>
        <div>filho</div>
      </ObsTaskGrid>,
    );
    expect(screen.getByTestId("obs-task-grid")).toBeInTheDocument();
  });

  it("ObsQGrid renderiza com testId obs-q-grid", () => {
    render(
      <ObsQGrid>
        <div>filho</div>
      </ObsQGrid>,
    );
    expect(screen.getByTestId("obs-q-grid")).toBeInTheDocument();
  });

  it("ObsApplyGrid renderiza com testId obs-apply-grid", () => {
    render(
      <ObsApplyGrid>
        <div>filho</div>
      </ObsApplyGrid>,
    );
    expect(screen.getByTestId("obs-apply-grid")).toBeInTheDocument();
  });
});
