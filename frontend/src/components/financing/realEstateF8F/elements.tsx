/**
 * Elementos visuais reutilizáveis do shell F8F-A
 * Replicam, em React puro, os blocos do protótipo F8E-AJ1 aprovado
 * (ScoreCard, KPI, InsightBox, ChecklistCard, BeforeAfterCard, ApplyCard, Formula, Alert)
 *
 * Todos os tokens visuais vêm de `tokens.ts` (escopo local F8F).
 */

import type { CSSProperties, ReactNode } from "react";

import { F8F_TOKENS } from "./tokens";

/* ── Card base ─────────────────────────────────────────────────────── */

export interface CardProps {
  readonly children: ReactNode;
  readonly soft?: boolean;
  readonly className?: string;
  readonly style?: CSSProperties;
  readonly testId?: string;
}

export function Card({
  children,
  soft,
  className = "",
  style,
  testId,
}: CardProps) {
  const bg = soft
    ? `linear-gradient(180deg, ${F8F_TOKENS.surface}, ${F8F_TOKENS.surface2})`
    : F8F_TOKENS.surface;
  return (
    <div
      data-testid={testId}
      className={className}
      style={{
        background: bg,
        border: `1px solid ${F8F_TOKENS.border}`,
        borderRadius: 14,
        padding: "1.3rem 1.4rem",
        position: "relative",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function CardEyebrow({ children }: { readonly children: ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-mono-f8f)",
        fontSize: ".65rem",
        letterSpacing: ".16em",
        textTransform: "uppercase",
        color: F8F_TOKENS.accent2,
        marginBottom: ".25rem",
      }}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children }: { readonly children: ReactNode }) {
  return (
    <div
      style={{
        fontSize: "1rem",
        fontWeight: 700,
        color: "#fff",
        letterSpacing: "-.005em",
        lineHeight: 1.3,
        marginBottom: ".55rem",
      }}
    >
      {children}
    </div>
  );
}

/* ── KPI ───────────────────────────────────────────────────────────── */

export interface KpiProps {
  readonly label: string;
  readonly value: string;
  readonly foot?: string;
  readonly tone?: "accent" | "gold" | "green" | "default";
  readonly testId?: string;
}

const KPI_TONES: Record<NonNullable<KpiProps["tone"]>, string> = {
  default: F8F_TOKENS.text,
  accent: F8F_TOKENS.accent2,
  gold: F8F_TOKENS.gold,
  green: F8F_TOKENS.green,
};

export function Kpi({
  label,
  value,
  foot,
  tone = "default",
  testId,
}: KpiProps) {
  return (
    <div
      data-testid={testId}
      style={{
        background: F8F_TOKENS.surface,
        border: `1px solid ${F8F_TOKENS.border}`,
        borderRadius: 14,
        padding: "1.2rem 1.3rem",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono-f8f)",
          fontSize: ".65rem",
          letterSpacing: ".14em",
          textTransform: "uppercase",
          color: F8F_TOKENS.textDim,
          marginBottom: ".5rem",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono-f8f)",
          fontSize: "1.7rem",
          fontWeight: 500,
          lineHeight: 1,
          color: KPI_TONES[tone],
          letterSpacing: "-.01em",
        }}
      >
        {value}
      </div>
      {foot ? (
        <div
          style={{
            marginTop: ".55rem",
            fontSize: ".74rem",
            color: F8F_TOKENS.textDim,
          }}
        >
          {foot}
        </div>
      ) : null}
    </div>
  );
}

/* ── ScoreCard ─────────────────────────────────────────────────────── */

export interface ScoreCardProps {
  readonly label: string;
  readonly value: string;
  readonly pct: number;
  readonly color: string;
  readonly note: string;
  readonly variant?: "default" | "featured" | "warn";
  readonly testId?: string;
}

export function ScoreCard({
  label,
  value,
  pct,
  color,
  note,
  variant = "default",
  testId,
}: ScoreCardProps) {
  const borderColor =
    variant === "featured" ? F8F_TOKENS.green : F8F_TOKENS.border;
  const shadow =
    variant === "featured" ? "0 0 28px rgba(16,185,129,.14)" : undefined;
  const valueColor =
    variant === "featured"
      ? F8F_TOKENS.green
      : variant === "warn"
        ? F8F_TOKENS.gold
        : F8F_TOKENS.text;
  return (
    <div
      data-testid={testId}
      style={{
        background: F8F_TOKENS.surface,
        border: `1px solid ${borderColor}`,
        borderRadius: 14,
        padding: "1.4rem 1.3rem",
        boxShadow: shadow,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono-f8f)",
          fontSize: ".68rem",
          fontWeight: 500,
          letterSpacing: ".14em",
          textTransform: "uppercase",
          color: F8F_TOKENS.textDim,
          marginBottom: ".55rem",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono-f8f)",
          fontSize: "2rem",
          fontWeight: 500,
          lineHeight: 1,
          marginBottom: ".65rem",
          color: valueColor,
        }}
      >
        {value}
      </div>
      <div
        style={{
          height: 6,
          borderRadius: 3,
          background: F8F_TOKENS.border,
          overflow: "hidden",
          marginBottom: ".6rem",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: color,
            borderRadius: 3,
            transition: "width .6s ease",
          }}
        />
      </div>
      <div
        style={{
          fontSize: ".76rem",
          color: F8F_TOKENS.textDim,
          lineHeight: 1.45,
        }}
      >
        {note}
      </div>
    </div>
  );
}

/* ── InsightBox ───────────────────────────────────────────────────── */

export type InsightVariant = "default" | "cyan" | "green" | "red";

export interface InsightProps {
  readonly title: string;
  readonly body: ReactNode;
  readonly variant?: InsightVariant;
}

const INSIGHT_STYLES: Record<
  InsightVariant,
  {
    background: string;
    border: string;
    iconBg: string;
    iconColor: string;
    icon: string;
  }
> = {
  default: {
    background:
      "linear-gradient(135deg, rgba(245,158,11,.1), rgba(245,158,11,.03))",
    border: "rgba(245,158,11,.28)",
    iconBg: "rgba(245,158,11,.15)",
    iconColor: F8F_TOKENS.gold,
    icon: "★",
  },
  cyan: {
    background:
      "linear-gradient(135deg, rgba(6,182,212,.1), rgba(6,182,212,.03))",
    border: "rgba(6,182,212,.28)",
    iconBg: "rgba(6,182,212,.15)",
    iconColor: F8F_TOKENS.accent2,
    icon: "i",
  },
  green: {
    background:
      "linear-gradient(135deg, rgba(16,185,129,.1), rgba(16,185,129,.03))",
    border: "rgba(16,185,129,.28)",
    iconBg: "rgba(16,185,129,.15)",
    iconColor: F8F_TOKENS.green,
    icon: "✓",
  },
  red: {
    background:
      "linear-gradient(135deg, rgba(239,68,68,.1), rgba(239,68,68,.03))",
    border: "rgba(239,68,68,.32)",
    iconBg: "rgba(239,68,68,.18)",
    iconColor: F8F_TOKENS.red,
    icon: "!",
  },
};

export function Insight({ title, body, variant = "default" }: InsightProps) {
  const s = INSIGHT_STYLES[variant];
  return (
    <div
      style={{
        background: s.background,
        border: `1px solid ${s.border}`,
        borderRadius: 12,
        padding: "1.05rem 1.35rem",
        display: "flex",
        gap: ".9rem",
        alignItems: "flex-start",
      }}
    >
      <span
        style={{
          width: 36,
          height: 36,
          borderRadius: 9,
          background: s.iconBg,
          display: "grid",
          placeItems: "center",
          fontSize: "1rem",
          flexShrink: 0,
          color: s.iconColor,
        }}
        aria-hidden
      >
        {s.icon}
      </span>
      <div
        style={{
          fontSize: ".87rem",
          color: F8F_TOKENS.textDim,
          lineHeight: 1.55,
        }}
      >
        <span
          style={{
            display: "block",
            color: "#fff",
            fontWeight: 700,
            fontSize: ".92rem",
            marginBottom: ".25rem",
          }}
        >
          {title}
        </span>
        {body}
      </div>
    </div>
  );
}

/* ── Alert ─────────────────────────────────────────────────────────── */

export interface AlertProps {
  readonly variant: "gold" | "red" | "cyan" | "green";
  readonly title: string;
  readonly description: ReactNode;
}

const ALERT_COLORS: Record<AlertProps["variant"], string> = {
  gold: F8F_TOKENS.gold,
  red: F8F_TOKENS.red,
  cyan: F8F_TOKENS.accent2,
  green: F8F_TOKENS.green,
};

const ALERT_ICONS: Record<AlertProps["variant"], string> = {
  gold: "⚠",
  red: "!",
  cyan: "i",
  green: "✓",
};

export function Alert({ variant, title, description }: AlertProps) {
  const color = ALERT_COLORS[variant];
  return (
    <div
      style={{
        background: F8F_TOKENS.surface,
        border: `1px solid ${F8F_TOKENS.border}`,
        borderLeft: `3px solid ${color}`,
        borderRadius: 10,
        padding: ".95rem 1.2rem",
        display: "flex",
        gap: ".85rem",
        alignItems: "flex-start",
      }}
    >
      <span
        style={{
          fontSize: "1rem",
          color,
          flexShrink: 0,
          lineHeight: 1,
          paddingTop: ".15rem",
        }}
        aria-hidden
      >
        {ALERT_ICONS[variant]}
      </span>
      <div>
        <div
          style={{
            color: "#fff",
            fontWeight: 700,
            fontSize: ".88rem",
            marginBottom: ".15rem",
          }}
        >
          {title}
        </div>
        <div
          style={{
            color: F8F_TOKENS.textDim,
            fontSize: ".8rem",
            lineHeight: 1.5,
          }}
        >
          {description}
        </div>
      </div>
    </div>
  );
}

/* ── Formula block ─────────────────────────────────────────────────── */

export interface FormulaProps {
  readonly label: string;
  readonly children: ReactNode;
}

export function Formula({ label, children }: FormulaProps) {
  return (
    <div
      style={{
        background: F8F_TOKENS.surface2,
        border: `1px solid ${F8F_TOKENS.border}`,
        borderLeft: `3px solid ${F8F_TOKENS.accent}`,
        borderRadius: 10,
        padding: "1rem 1.2rem",
        fontFamily: "var(--font-mono-f8f)",
        fontSize: ".85rem",
        color: F8F_TOKENS.text,
        lineHeight: 1.7,
        overflowX: "auto",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-sans-f8f)",
          fontSize: ".65rem",
          letterSpacing: ".14em",
          textTransform: "uppercase",
          color: F8F_TOKENS.textMuted,
          display: "block",
          marginBottom: ".45rem",
        }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

/* ── ChecklistCard ─────────────────────────────────────────────────── */

export interface ChecklistItem {
  readonly id: string;
  readonly text: string;
  readonly hint?: string;
  readonly done: boolean;
  readonly status: "OK" | "pendente";
}

export interface ChecklistCardProps {
  readonly title: string;
  readonly meta: string;
  readonly items: ReadonlyArray<ChecklistItem>;
  readonly testId?: string;
}

export function ChecklistCard({
  title,
  meta,
  items,
  testId,
}: ChecklistCardProps) {
  return (
    <div
      data-testid={testId}
      style={{
        background: F8F_TOKENS.surface,
        border: `1px solid ${F8F_TOKENS.accent}`,
        borderRadius: 14,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(90deg, rgba(59,130,246,.16), rgba(6,182,212,.08))",
          padding: ".95rem 1.4rem",
          borderBottom: `1px solid ${F8F_TOKENS.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontWeight: 700,
            fontSize: ".82rem",
            letterSpacing: ".08em",
            textTransform: "uppercase",
            color: F8F_TOKENS.accent2,
          }}
        >
          {title}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono-f8f)",
            fontSize: ".7rem",
            color: F8F_TOKENS.textDim,
          }}
        >
          {meta}
        </span>
      </div>
      {items.map((it, i) => (
        <div
          key={it.id}
          style={{
            display: "grid",
            gridTemplateColumns: "28px 1fr auto",
            gap: "1rem",
            padding: ".9rem 1.4rem",
            borderBottom:
              i < items.length - 1 ? `1px solid ${F8F_TOKENS.border}` : "none",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 5,
              border: `1.5px solid ${it.done ? F8F_TOKENS.green : F8F_TOKENS.border}`,
              background: it.done ? F8F_TOKENS.green : F8F_TOKENS.surface2,
              display: "grid",
              placeItems: "center",
              color: it.done ? "#021" : "transparent",
              fontSize: ".75rem",
              fontWeight: 700,
            }}
            aria-hidden
          >
            {it.done ? "✓" : ""}
          </div>
          <div style={{ fontSize: ".85rem", color: F8F_TOKENS.text }}>
            {it.text}
            {it.hint ? (
              <span
                style={{
                  display: "block",
                  fontSize: ".74rem",
                  color: F8F_TOKENS.textDim,
                  marginTop: ".15rem",
                }}
              >
                {it.hint}
              </span>
            ) : null}
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono-f8f)",
              fontSize: ".68rem",
              letterSpacing: ".1em",
              textTransform: "uppercase",
              color:
                it.status === "OK" ? F8F_TOKENS.green : F8F_TOKENS.textMuted,
            }}
          >
            {it.status}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── BeforeAfterCard (SAC vs PRICE) ────────────────────────────────── */

export interface BaCardSide {
  readonly variant: "win" | "alt";
  readonly title: string;
  readonly badge: string;
  readonly rows: ReadonlyArray<{
    readonly k: string;
    readonly v: string;
    readonly tone?: "green" | "gold" | "default";
  }>;
}

export function BeforeAfterCard({ side }: { readonly side: BaCardSide }) {
  const borderColor =
    side.variant === "win" ? F8F_TOKENS.green : "rgba(168,85,247,.4)";
  const headColor = side.variant === "win" ? F8F_TOKENS.green : F8F_TOKENS.alt;
  return (
    <div
      style={{
        background: F8F_TOKENS.surface,
        border: `1px solid ${borderColor}`,
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: ".8rem 1.2rem",
          borderBottom: `1px solid ${F8F_TOKENS.border}`,
          fontFamily: "var(--font-mono-f8f)",
          fontSize: ".72rem",
          letterSpacing: ".12em",
          textTransform: "uppercase",
          color: headColor,
        }}
      >
        <span>{side.title}</span>
        <span
          style={{
            fontFamily: "var(--font-sans-f8f)",
            fontSize: ".68rem",
            letterSpacing: ".08em",
            padding: ".15rem .55rem",
            borderRadius: 5,
            background: F8F_TOKENS.surface2,
            border: `1px solid ${F8F_TOKENS.border}`,
            color: F8F_TOKENS.textDim,
            textTransform: "none",
          }}
        >
          {side.badge}
        </span>
      </div>
      <div
        style={{
          padding: "1rem 1.2rem",
          fontFamily: "var(--font-mono-f8f)",
          fontSize: ".8rem",
          lineHeight: 1.7,
          color: F8F_TOKENS.textDim,
        }}
      >
        {side.rows.map((r, i) => (
          <div
            key={r.k}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: ".25rem 0",
              borderBottom:
                i < side.rows.length - 1
                  ? `1px dashed rgba(26,47,80,.5)`
                  : "none",
            }}
          >
            <span style={{ color: F8F_TOKENS.textMuted }}>{r.k}</span>
            <span
              style={{
                color:
                  r.tone === "green"
                    ? F8F_TOKENS.green
                    : r.tone === "gold"
                      ? F8F_TOKENS.gold
                      : F8F_TOKENS.text,
              }}
            >
              {r.v}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── ApplyCard ─────────────────────────────────────────────────────── */

export interface ApplyCardProps {
  readonly tag: string;
  readonly title: string;
  readonly body: string;
}

export function ApplyCard({ tag, title, body }: ApplyCardProps) {
  return (
    <div
      style={{
        background: F8F_TOKENS.surface,
        border: `1px solid ${F8F_TOKENS.border}`,
        borderRadius: 12,
        padding: "1.2rem 1.35rem",
      }}
    >
      <span
        style={{
          display: "inline-block",
          background: "rgba(6,182,212,.1)",
          border: "1px solid rgba(6,182,212,.25)",
          borderRadius: 6,
          padding: ".18rem .55rem",
          fontFamily: "var(--font-mono-f8f)",
          fontSize: ".62rem",
          fontWeight: 500,
          letterSpacing: ".14em",
          textTransform: "uppercase",
          color: F8F_TOKENS.accent2,
          marginBottom: ".7rem",
        }}
      >
        {tag}
      </span>
      <div
        style={{
          fontWeight: 700,
          fontSize: ".94rem",
          marginBottom: ".35rem",
          color: "#fff",
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono-f8f)",
          fontSize: ".78rem",
          color: F8F_TOKENS.gold,
          background: "rgba(245,158,11,.05)",
          border: "1px solid rgba(245,158,11,.12)",
          borderRadius: 8,
          padding: ".75rem .95rem",
          lineHeight: 1.65,
        }}
      >
        {body}
      </div>
    </div>
  );
}

/* ── Aurora card (síntese de destaque) ─────────────────────────────── */

export function AuroraCard({
  eyebrow,
  title,
  big,
  body,
}: {
  readonly eyebrow: string;
  readonly title: string;
  readonly big?: string;
  readonly body: ReactNode;
}) {
  return (
    <div
      style={{
        position: "relative",
        background: F8F_TOKENS.surface,
        borderRadius: 14,
        padding: "1.5rem 1.7rem",
        overflow: "hidden",
        border: "1px solid transparent",
        backgroundImage: `linear-gradient(${F8F_TOKENS.surface}, ${F8F_TOKENS.surface}), linear-gradient(135deg, ${F8F_TOKENS.accent}, ${F8F_TOKENS.accent2}, ${F8F_TOKENS.gold})`,
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono-f8f)",
          fontSize: ".68rem",
          letterSpacing: ".16em",
          textTransform: "uppercase",
          color: F8F_TOKENS.accent2,
          marginBottom: ".55rem",
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          fontSize: "1.3rem",
          color: "#fff",
          fontWeight: 700,
          marginBottom: ".35rem",
          letterSpacing: "-.01em",
        }}
      >
        {title}
      </div>
      {big ? (
        <div
          style={{
            fontFamily: "var(--font-mono-f8f)",
            fontSize: "2.3rem",
            color: F8F_TOKENS.green,
            fontWeight: 500,
            lineHeight: 1,
            margin: ".75rem 0 .35rem",
          }}
        >
          {big}
        </div>
      ) : null}
      <div
        style={{
          color: F8F_TOKENS.textDim,
          fontSize: ".9rem",
          lineHeight: 1.55,
        }}
      >
        {body}
      </div>
    </div>
  );
}

/* ── miniSummary ───────────────────────────────────────────────────── */

export function MiniSummary({
  k,
  v,
}: {
  readonly k: string;
  readonly v: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: ".55rem .75rem",
        background: F8F_TOKENS.surface2,
        border: `1px solid ${F8F_TOKENS.border}`,
        borderRadius: 8,
        fontSize: ".82rem",
      }}
    >
      <span style={{ color: F8F_TOKENS.textDim }}>{k}</span>
      <span
        style={{
          fontFamily: "var(--font-mono-f8f)",
          color: F8F_TOKENS.text,
        }}
      >
        {v}
      </span>
    </div>
  );
}
