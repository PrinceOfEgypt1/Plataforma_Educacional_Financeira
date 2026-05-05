"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface SubTab<T extends string> {
  readonly id: T;
  readonly label: string;
}

export function CockpitSubTabs<T extends string>({
  tabs,
  active,
  onChange,
  label,
}: {
  readonly tabs: ReadonlyArray<SubTab<T>>;
  readonly active: T;
  readonly onChange: (id: T) => void;
  readonly label: string;
}) {
  return (
    <nav className="cockpit-sub-tabs" aria-label={label} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          className={cn("cockpit-sub-tab", tab.id === active && "active")}
          aria-selected={tab.id === active}
          onClick={() => onChange(tab.id)}
          data-testid={`cockpit-subtab-${tab.id}`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

export function CockpitGrid({ children }: { readonly children: ReactNode }) {
  return <section className="cockpit-content-grid">{children}</section>;
}

export function CockpitInputPanel({
  icon,
  title,
  subtitle,
  children,
}: {
  readonly icon: string;
  readonly title: string;
  readonly subtitle: string;
  readonly children: ReactNode;
}) {
  return (
    <aside className="cockpit-panel-inputs" data-testid="cockpit-input-panel">
      <div className="cockpit-panel-header">
        <div className="cockpit-panel-icon" aria-hidden="true">
          {icon}
        </div>
        <div>
          <div className="cockpit-panel-title">{title}</div>
          <div className="cockpit-panel-sub">{subtitle}</div>
        </div>
      </div>
      <div className="cockpit-panel-body">{children}</div>
    </aside>
  );
}

export interface CockpitFieldProps {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly unit?: string;
  readonly hint?: string;
  readonly type?: "text" | "number";
  readonly step?: string;
  readonly min?: string;
  readonly inputMode?: "decimal" | "numeric";
}

export function CockpitField({
  id,
  label,
  value,
  onChange,
  unit,
  hint,
  type = "text",
  step,
  min,
  inputMode = "decimal",
}: CockpitFieldProps) {
  return (
    <label className="cockpit-field-group" htmlFor={id}>
      <span className="cockpit-field-label">{label}</span>
      <span className="cockpit-field-input-wrap">
        <input
          id={id}
          type={type}
          value={value}
          step={step}
          min={min}
          inputMode={inputMode}
          onChange={(event) => onChange(event.target.value)}
        />
        {unit ? <span className="cockpit-field-unit">{unit}</span> : null}
      </span>
      {hint ? <span className="cockpit-field-hint">{hint}</span> : null}
    </label>
  );
}

export function CockpitSlider({
  id,
  label,
  value,
  min,
  max,
  hint,
  onChange,
}: {
  readonly id: string;
  readonly label: string;
  readonly value: number;
  readonly min: number;
  readonly max: number;
  readonly hint: string;
  readonly onChange: (value: number) => void;
}) {
  return (
    <div className="cockpit-field-group">
      <label className="cockpit-field-label" htmlFor={id}>
        {label}
      </label>
      <div className="cockpit-slider-row">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <div className="cockpit-slider-val">{value}</div>
      </div>
      <div className="cockpit-field-hint">{hint}</div>
    </div>
  );
}

export function CockpitButton({
  children,
  busy,
}: {
  readonly children: ReactNode;
  readonly busy?: boolean;
}) {
  return (
    <button className="cockpit-btn-calc" type="submit" disabled={busy}>
      {busy ? "Calculando..." : children}
    </button>
  );
}

export interface KpiItem {
  readonly label: string;
  readonly value: string;
  readonly delta?: string;
  readonly highlight?: boolean;
}

export function KpiStrip({
  items,
}: {
  readonly items: ReadonlyArray<KpiItem>;
}) {
  return (
    <div className="cockpit-kpi-strip" data-testid="cockpit-kpi-strip">
      {items.map((item) => (
        <div
          key={item.label}
          className={cn("cockpit-kpi-card", item.highlight && "highlight")}
        >
          <div className="cockpit-kpi-label">{item.label}</div>
          <div className="cockpit-kpi-value">{item.value}</div>
          {item.delta ? (
            <div className="cockpit-kpi-delta">{item.delta}</div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function CenterPanel({
  kpis,
  title,
  legend,
  chart,
  insight,
}: {
  readonly kpis: ReadonlyArray<KpiItem>;
  readonly title: string;
  readonly legend: ReactNode;
  readonly chart: ReactNode;
  readonly insight: ReactNode;
}) {
  return (
    <section
      className="cockpit-panel-center"
      data-testid="cockpit-center-panel"
    >
      <KpiStrip items={kpis} />
      <div className="cockpit-chart-panel" data-testid="cockpit-chart-panel">
        <div className="cockpit-chart-header">
          <div className="cockpit-chart-title">{title}</div>
          <div className="cockpit-chart-legend">{legend}</div>
        </div>
        <div className="cockpit-chart-body">{chart}</div>
      </div>
      <div className="cockpit-insight-bar" data-testid="cockpit-insight-bar">
        <span className="icon" aria-hidden="true">
          💡
        </span>
        <span>{insight}</span>
      </div>
    </section>
  );
}

export function LegendItem({
  color,
  children,
}: {
  readonly color: string;
  readonly children: ReactNode;
}) {
  return (
    <span className="cockpit-legend-item">
      <span className="cockpit-legend-dot" style={{ background: color }} />
      {children}
    </span>
  );
}

export function EducationPanel<T extends string>({
  tabs,
  active,
  onChange,
  children,
}: {
  readonly tabs: ReadonlyArray<SubTab<T>>;
  readonly active: T;
  readonly onChange: (id: T) => void;
  readonly children: ReactNode;
}) {
  return (
    <aside className="cockpit-panel-edu" data-testid="cockpit-education-panel">
      <div className="cockpit-edu-tabs" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            className={cn("cockpit-edu-tab", tab.id === active && "active")}
            aria-selected={tab.id === active}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="cockpit-edu-content">{children}</div>
    </aside>
  );
}

export function EduTitle({ children }: { readonly children: ReactNode }) {
  return <div className="cockpit-edu-section-title">{children}</div>;
}

export function EduText({ children }: { readonly children: ReactNode }) {
  return <p className="cockpit-edu-text">{children}</p>;
}

export function EduFormula({ children }: { readonly children: ReactNode }) {
  return <div className="cockpit-edu-formula">{children}</div>;
}

export function MoreButton({
  children,
  onClick,
}: {
  readonly children: ReactNode;
  readonly onClick: () => void;
}) {
  return (
    <button type="button" className="cockpit-btn-more" onClick={onClick}>
      {children}
    </button>
  );
}

export function CautionItem({
  icon,
  children,
}: {
  readonly icon: string;
  readonly children: ReactNode;
}) {
  return (
    <div className="cockpit-caution-item">
      <span className="cockpit-caution-icon" aria-hidden="true">
        {icon}
      </span>
      <div className="cockpit-caution-text">{children}</div>
    </div>
  );
}
