"use client";

/**
 * ObservatoryDarkCards — Biblioteca de UI primitivas F8C-v6.3
 *
 * Implementa os 7 UI Elements contratados pelo padrão Observatory Dark Cards:
 *   ScoreCard, MetricCard, ChecklistCard, BeforeAfterCard,
 *   QuestionCard, InsightBox, ApplyCard
 *
 * Todos os valores de token, tipografia e espaçamento são inline
 * (extraídos literalmente do guia-prompt-checklist.html aprovado pelo PO).
 * Não depende de Tailwind custom colors para garantir fidelidade visual.
 *
 * Fonte principal: DM Sans (var(--font-dm-sans))
 * Fonte técnica:   DM Mono (var(--font-dm-mono))
 */

import type { CSSProperties, ReactNode } from "react";

// ── Observatory token values ─────────────────────────────────────────────────
// Fonte: bloco :root do guia-prompt-checklist.html
const OBS = {
  bg: "#030811",
  surface: "#0a1628",
  surface2: "#0f1e35",
  border: "#1a2f50",
  accent: "#3b82f6",
  accent2: "#06b6d4",
  gold: "#f59e0b",
  green: "#10b981",
  red: "#ef4444",
  text: "#e2e8f0",
  textMuted: "#64748b",
  textDim: "#94a3b8",
} as const;

const DM_SANS = "var(--font-dm-sans), 'DM Sans', sans-serif";
const DM_MONO = "var(--font-dm-mono), 'DM Mono', monospace";

// ── ScoreCard ────────────────────────────────────────────────────────────────

export interface ScoreCardProps {
  readonly label: string;
  readonly value: string;
  readonly note?: string;
  readonly barPct?: number;
  readonly barColor?: string;
  readonly valueColor?: string;
  readonly highlighted?: boolean;
  readonly highlightColor?: "green" | "cyan";
  readonly testId?: string;
}

export function ScoreCard({
  label,
  value,
  note,
  barPct,
  barColor,
  valueColor,
  highlighted = false,
  highlightColor = "green",
  testId,
}: ScoreCardProps) {
  const highlightBorder =
    highlighted && highlightColor === "green" ? OBS.green : OBS.accent2;
  const shadowColor =
    highlighted && highlightColor === "green"
      ? "rgba(16,185,129,.12)"
      : highlighted
        ? "rgba(6,182,212,.12)"
        : "none";

  const containerStyle: CSSProperties = {
    background: OBS.surface,
    border: `1px solid ${highlighted ? highlightBorder : OBS.border}`,
    borderRadius: "12px",
    padding: "1.4rem 1.2rem",
    boxShadow: highlighted ? `0 0 20px ${shadowColor}` : "none",
    transition: "transform .2s",
  };

  const labelStyle: CSSProperties = {
    fontFamily: DM_SANS,
    fontSize: ".78rem",
    fontWeight: 700,
    letterSpacing: ".08em",
    textTransform: "uppercase",
    color: OBS.textDim,
    marginBottom: ".6rem",
    display: "block",
  };

  const valueStyle: CSSProperties = {
    fontFamily: DM_MONO,
    fontSize: "2.4rem",
    fontWeight: 500,
    lineHeight: 1,
    marginBottom: ".8rem",
    color: valueColor ?? OBS.text,
    display: "block",
  };

  const barContainerStyle: CSSProperties = {
    height: "6px",
    borderRadius: "3px",
    background: OBS.border,
    overflow: "hidden",
    marginBottom: ".6rem",
  };

  const barFillStyle: CSSProperties = {
    height: "100%",
    borderRadius: "3px",
    width: `${Math.min(100, Math.max(0, barPct ?? 0))}%`,
    background: barColor ?? OBS.accent,
  };

  const noteStyle: CSSProperties = {
    fontFamily: DM_SANS,
    fontSize: ".78rem",
    color: OBS.textDim,
  };

  return (
    <div style={containerStyle} data-testid={testId ?? "obs-score-card"}>
      <span style={labelStyle}>{label}</span>
      <span style={valueStyle}>{value}</span>
      {barPct !== undefined && (
        <div style={barContainerStyle}>
          <div style={barFillStyle} />
        </div>
      )}
      {note !== undefined && <p style={noteStyle}>{note}</p>}
    </div>
  );
}

// ── MetricCard ───────────────────────────────────────────────────────────────

export interface MetricRow {
  readonly label: string;
  readonly value: string;
  readonly pct: number;
  readonly color: string;
}

export interface MetricCardProps {
  readonly title: string;
  readonly rows: ReadonlyArray<MetricRow>;
  readonly testId?: string;
}

export function MetricCard({ title, rows, testId }: MetricCardProps) {
  const containerStyle: CSSProperties = {
    background: OBS.surface,
    border: `1px solid ${OBS.border}`,
    borderRadius: "12px",
    padding: "1.2rem 1.4rem",
  };

  const titleStyle: CSSProperties = {
    fontFamily: DM_SANS,
    fontSize: ".85rem",
    fontWeight: 700,
    letterSpacing: ".05em",
    textTransform: "uppercase",
    marginBottom: "1rem",
    color: OBS.accent,
    display: "block",
  };

  const rowStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: ".7rem",
    marginBottom: ".45rem",
  };

  const labelStyle: CSSProperties = {
    fontFamily: DM_SANS,
    fontSize: ".75rem",
    color: OBS.textDim,
    width: "100px",
    flexShrink: 0,
  };

  const barContainerStyle: CSSProperties = {
    flex: 1,
    height: "8px",
    background: OBS.border,
    borderRadius: "4px",
    overflow: "hidden",
  };

  const valStyle: CSSProperties = {
    fontFamily: DM_MONO,
    fontSize: ".75rem",
    width: "32px",
    textAlign: "right",
    color: OBS.textDim,
  };

  return (
    <div style={containerStyle} data-testid={testId ?? "obs-metric-card"}>
      <span style={titleStyle}>{title}</span>
      {rows.map((row) => (
        <div key={row.label} style={rowStyle}>
          <span style={labelStyle}>{row.label}</span>
          <div style={barContainerStyle}>
            <div
              style={{
                height: "100%",
                borderRadius: "4px",
                width: `${Math.min(100, Math.max(0, row.pct))}%`,
                background: row.color,
              }}
            />
          </div>
          <span style={valStyle}>{row.value}</span>
        </div>
      ))}
    </div>
  );
}

// ── ChecklistCard ────────────────────────────────────────────────────────────

export interface ChecklistRow {
  readonly num: string;
  readonly field: string;
  readonly description: string;
  readonly example?: string;
}

export interface ChecklistCardProps {
  readonly header: string;
  readonly rows: ReadonlyArray<ChecklistRow>;
  readonly testId?: string;
}

export function ChecklistCard({ header, rows, testId }: ChecklistCardProps) {
  const containerStyle: CSSProperties = {
    background: OBS.surface,
    border: `1px solid ${OBS.accent}`,
    borderRadius: "14px",
    overflow: "hidden",
  };

  const headerStyle: CSSProperties = {
    background:
      "linear-gradient(90deg, rgba(59,130,246,.15), rgba(6,182,212,.08))",
    padding: "1rem 1.4rem",
    borderBottom: `1px solid ${OBS.border}`,
    fontFamily: DM_SANS,
    fontWeight: 700,
    fontSize: ".85rem",
    letterSpacing: ".06em",
    textTransform: "uppercase",
    color: OBS.accent2,
  };

  const rowStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "30px 160px 1fr",
    gap: "1rem",
    alignItems: "start",
    padding: "1rem 1.4rem",
    borderBottom: `1px solid ${OBS.border}`,
  };

  const numStyle: CSSProperties = {
    fontFamily: DM_MONO,
    fontSize: ".9rem",
    color: OBS.accent,
    fontWeight: 500,
  };

  const fieldStyle: CSSProperties = {
    fontFamily: DM_SANS,
    fontWeight: 700,
    fontSize: ".82rem",
    color: OBS.text,
  };

  const descStyle: CSSProperties = {
    fontFamily: DM_SANS,
    fontSize: ".82rem",
    color: OBS.textDim,
  };

  const exampleStyle: CSSProperties = {
    fontFamily: DM_MONO,
    fontSize: ".75rem",
    color: OBS.gold,
    marginTop: ".3rem",
    background: "rgba(245,158,11,.06)",
    borderRadius: "6px",
    padding: ".3rem .6rem",
    display: "inline-block",
  };

  return (
    <div style={containerStyle} data-testid={testId ?? "obs-checklist-card"}>
      <div style={headerStyle}>{header}</div>
      {rows.map((row, i) => (
        <div
          key={row.num}
          style={{
            ...rowStyle,
            borderBottom:
              i < rows.length - 1 ? `1px solid ${OBS.border}` : "none",
          }}
        >
          <span style={numStyle}>{row.num}</span>
          <span style={fieldStyle}>{row.field}</span>
          <div>
            <span style={descStyle}>{row.description}</span>
            {row.example !== undefined && (
              <span style={exampleStyle}>{row.example}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── BeforeAfterCard ──────────────────────────────────────────────────────────

export interface BeforeAfterSide {
  readonly title: string;
  readonly lines: ReadonlyArray<string>;
  readonly isAfter?: boolean;
}

export interface BeforeAfterCardProps {
  readonly before: BeforeAfterSide;
  readonly after: BeforeAfterSide;
  readonly testId?: string;
}

export function BeforeAfterCard({
  before,
  after,
  testId,
}: BeforeAfterCardProps) {
  const gridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.2rem",
  };

  function buildCard(side: BeforeAfterSide) {
    const isAfter = side.isAfter === true;
    const cardStyle: CSSProperties = {
      background: OBS.surface,
      borderRadius: "12px",
      border: `1px solid ${isAfter ? OBS.green : OBS.border}`,
      overflow: "hidden",
    };

    const topStyle: CSSProperties = {
      display: "flex",
      alignItems: "center",
      gap: ".5rem",
      padding: ".8rem 1.2rem",
      borderBottom: `1px solid ${OBS.border}`,
      fontFamily: DM_SANS,
      fontSize: ".78rem",
      fontWeight: 700,
      letterSpacing: ".08em",
      textTransform: "uppercase",
      color: isAfter ? OBS.green : OBS.red,
    };

    const bodyStyle: CSSProperties = {
      padding: "1.1rem 1.2rem",
      fontFamily: DM_MONO,
      fontSize: ".8rem",
      lineHeight: 1.7,
      color: OBS.textDim,
    };

    return (
      <div style={cardStyle}>
        <div style={topStyle}>{side.title}</div>
        <div style={bodyStyle}>
          {side.lines.map((line, i) => (
            <span key={i} style={{ display: "block", marginBottom: ".15rem" }}>
              {line}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={gridStyle} data-testid={testId ?? "obs-before-after-card"}>
      {buildCard(before)}
      {buildCard({ ...after, isAfter: true })}
    </div>
  );
}

// ── QuestionCard ─────────────────────────────────────────────────────────────

export interface QuestionCardProps {
  readonly ordinal: string;
  readonly titleLabel: string;
  readonly question: string;
  readonly hint?: string;
  readonly testId?: string;
}

export function QuestionCard({
  ordinal,
  titleLabel,
  question,
  hint,
  testId,
}: QuestionCardProps) {
  const containerStyle: CSSProperties = {
    background: OBS.surface,
    border: `1px solid ${OBS.border}`,
    borderRadius: "12px",
    padding: "1.4rem 1.2rem",
    position: "relative",
    overflow: "hidden",
  };

  const watermarkStyle: CSSProperties = {
    position: "absolute",
    top: "-.2rem",
    right: ".6rem",
    fontFamily: DM_MONO,
    fontSize: "4rem",
    fontWeight: 700,
    color: "rgba(59,130,246,.06)",
    lineHeight: 1,
    pointerEvents: "none",
    userSelect: "none",
  };

  const titleLabelStyle: CSSProperties = {
    fontFamily: DM_MONO,
    fontSize: ".7rem",
    letterSpacing: ".1em",
    textTransform: "uppercase",
    color: OBS.accent,
    marginBottom: ".5rem",
    display: "block",
  };

  const questionStyle: CSSProperties = {
    fontFamily: DM_SANS,
    fontSize: ".9rem",
    fontWeight: 600,
    color: "#ffffff",
    marginBottom: ".5rem",
  };

  const hintStyle: CSSProperties = {
    fontFamily: DM_SANS,
    fontSize: ".78rem",
    color: OBS.textDim,
  };

  return (
    <div style={containerStyle} data-testid={testId ?? "obs-question-card"}>
      <span style={watermarkStyle} aria-hidden="true">
        {ordinal}
      </span>
      <span style={titleLabelStyle}>{titleLabel}</span>
      <p style={questionStyle}>{question}</p>
      {hint !== undefined && <p style={hintStyle}>{hint}</p>}
    </div>
  );
}

// ── InsightBox ───────────────────────────────────────────────────────────────

export interface InsightBoxProps {
  readonly icon?: ReactNode;
  readonly children: ReactNode;
  readonly testId?: string;
}

export function InsightBox({ icon, children, testId }: InsightBoxProps) {
  const containerStyle: CSSProperties = {
    background:
      "linear-gradient(135deg, rgba(245,158,11,.08), rgba(245,158,11,.03))",
    border: "1px solid rgba(245,158,11,.25)",
    borderRadius: "12px",
    padding: "1.1rem 1.4rem",
    display: "flex",
    gap: ".9rem",
    alignItems: "flex-start",
  };

  const iconStyle: CSSProperties = {
    fontSize: "1.3rem",
    flexShrink: 0,
  };

  const textStyle: CSSProperties = {
    fontFamily: DM_SANS,
    fontSize: ".85rem",
    color: OBS.textDim,
    lineHeight: 1.6,
  };

  return (
    <div style={containerStyle} data-testid={testId ?? "obs-insight-box"}>
      {icon !== undefined && (
        <span style={iconStyle} aria-hidden="true">
          {icon}
        </span>
      )}
      <div style={textStyle}>{children}</div>
    </div>
  );
}

// Strong helper para InsightBox
export function InsightStrong({ children }: { readonly children: ReactNode }) {
  return <strong style={{ color: OBS.gold }}>{children}</strong>;
}

// ── ApplyCard ────────────────────────────────────────────────────────────────

export interface ApplyCardProps {
  readonly tag: string;
  readonly title: string;
  readonly body?: ReactNode;
  readonly block?: string;
  readonly testId?: string;
}

export function ApplyCard({ tag, title, body, block, testId }: ApplyCardProps) {
  const containerStyle: CSSProperties = {
    background: OBS.surface,
    border: `1px solid ${OBS.border}`,
    borderRadius: "12px",
    padding: "1.2rem 1.4rem",
  };

  const tagStyle: CSSProperties = {
    display: "inline-block",
    background: "rgba(6,182,212,.1)",
    border: "1px solid rgba(6,182,212,.25)",
    borderRadius: "6px",
    padding: ".15rem .5rem",
    fontFamily: DM_SANS,
    fontSize: ".7rem",
    fontWeight: 700,
    letterSpacing: ".06em",
    textTransform: "uppercase",
    color: OBS.accent2,
    marginBottom: ".7rem",
  };

  const titleStyle: CSSProperties = {
    fontFamily: DM_SANS,
    fontWeight: 700,
    fontSize: ".9rem",
    marginBottom: ".4rem",
    color: OBS.text,
    display: "block",
  };

  const bodyStyle: CSSProperties = {
    fontFamily: DM_SANS,
    fontSize: ".82rem",
    color: OBS.textDim,
    lineHeight: 1.6,
  };

  const blockStyle: CSSProperties = {
    fontFamily: DM_MONO,
    fontSize: ".75rem",
    color: OBS.gold,
    background: "rgba(245,158,11,.05)",
    borderRadius: "8px",
    padding: ".7rem .9rem",
    lineHeight: 1.7,
    marginTop: ".6rem",
    display: "block",
  };

  return (
    <div style={containerStyle} data-testid={testId ?? "obs-apply-card"}>
      <span style={tagStyle}>{tag}</span>
      <span style={titleStyle}>{title}</span>
      {body !== undefined && <div style={bodyStyle}>{body}</div>}
      {block !== undefined && <span style={blockStyle}>{block}</span>}
    </div>
  );
}

// ── Grid helpers ─────────────────────────────────────────────────────────────

export function ObsScoreGrid({ children }: { readonly children: ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "1rem",
      }}
      data-testid="obs-score-grid"
    >
      {children}
    </div>
  );
}

export function ObsTaskGrid({ children }: { readonly children: ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "1rem",
      }}
      data-testid="obs-task-grid"
    >
      {children}
    </div>
  );
}

export function ObsQGrid({ children }: { readonly children: ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "1rem",
      }}
      data-testid="obs-q-grid"
    >
      {children}
    </div>
  );
}

export function ObsApplyGrid({ children }: { readonly children: ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "1rem",
      }}
      data-testid="obs-apply-grid"
    >
      {children}
    </div>
  );
}

// ── re-export token palette para uso externo ─────────────────────────────────
export { OBS };
