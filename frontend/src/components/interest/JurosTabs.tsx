"use client";

/**
 * `<JurosTabs />` — componente de tabs WAI-ARIA (role=tablist/tab/tabpanel)
 * que hospeda os três painéis de simulação.
 *
 * Implementação mínima (sem dependência externa):
 *   - Setas horizontais movem o foco e mudam a aba corrente (padrão
 *     APG — Authoring Practices Guide).
 *   - `Home` / `End` levam para primeira / última.
 *   - `tabindex` é -1 em abas inativas (contido dentro do próprio tablist).
 *
 * Cada painel continua `keep-alive` no DOM quando ativo — quando inativo,
 * é unmounted para liberar memória dos resultados de simulações antigas.
 */

import {
  useCallback,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import { cn } from "@/lib/cn";

import { CompararJurosPanel } from "./CompararJurosPanel";
import { JurosCompostosPanel } from "./JurosCompostosPanel";
import { JurosSimplesPanel } from "./JurosSimplesPanel";

type TabId = "simples" | "compostos" | "comparar";

interface TabDef {
  readonly id: TabId;
  readonly label: string;
  readonly Panel: () => JSX.Element;
}

const TABS: ReadonlyArray<TabDef> = [
  { id: "simples", label: "Juros simples", Panel: JurosSimplesPanel },
  { id: "compostos", label: "Juros compostos", Panel: JurosCompostosPanel },
  { id: "comparar", label: "Comparar", Panel: CompararJurosPanel },
];

export function JurosTabs() {
  const baseId = useId();
  const [current, setCurrent] = useState<TabId>("simples");
  const tabRefs = useRef<Map<TabId, HTMLButtonElement | null>>(new Map());

  const focusTab = useCallback((id: TabId) => {
    const el = tabRefs.current.get(id);
    if (el) el.focus();
  }, []);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    const idx = TABS.findIndex((t) => t.id === current);
    if (idx < 0) return;
    const lastIdx = TABS.length - 1;
    let nextIdx = idx;
    switch (event.key) {
      case "ArrowRight":
        nextIdx = idx === lastIdx ? 0 : idx + 1;
        break;
      case "ArrowLeft":
        nextIdx = idx === 0 ? lastIdx : idx - 1;
        break;
      case "Home":
        nextIdx = 0;
        break;
      case "End":
        nextIdx = lastIdx;
        break;
      default:
        return;
    }
    event.preventDefault();
    const nextTab = TABS[nextIdx];
    if (!nextTab) return;
    setCurrent(nextTab.id);
    focusTab(nextTab.id);
  }

  const activeTab = TABS.find((t) => t.id === current);

  return (
    <div data-testid="juros-tabs" className="flex flex-col gap-4">
      <div
        role="tablist"
        aria-label="Regime de juros"
        onKeyDown={handleKeyDown}
        className="flex flex-wrap gap-2 border-b border-slate-200"
      >
        {TABS.map((t) => {
          const selected = t.id === current;
          return (
            <button
              key={t.id}
              id={`${baseId}-tab-${t.id}`}
              ref={(el) => {
                tabRefs.current.set(t.id, el);
              }}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${t.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setCurrent(t.id)}
              className={cn(
                "-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors",
                selected
                  ? "border-[var(--color-brand-primary)] text-[var(--color-brand-primary)]"
                  : "border-transparent text-slate-500 hover:text-slate-700",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              )}
              data-testid={`juros-tab-${t.id}`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      {activeTab ? (
        <div
          role="tabpanel"
          id={`${baseId}-panel-${activeTab.id}`}
          aria-labelledby={`${baseId}-tab-${activeTab.id}`}
          tabIndex={0}
          data-testid={`juros-panel-${activeTab.id}`}
        >
          <activeTab.Panel />
        </div>
      ) : null}
    </div>
  );
}
