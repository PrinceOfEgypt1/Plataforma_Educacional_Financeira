"use client";

import {
  useCallback,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import { cn } from "@/lib/cn";

import { ComparePanel } from "./ComparePanel";
import { PricePanel } from "./PricePanel";
import { SacPanel } from "./SacPanel";

type TabId = "price" | "sac" | "compare";

interface TabDef {
  readonly id: TabId;
  readonly label: string;
  readonly Panel: () => JSX.Element;
}

const TABS: ReadonlyArray<TabDef> = [
  { id: "price", label: "PRICE", Panel: PricePanel },
  { id: "sac", label: "SAC", Panel: SacPanel },
  { id: "compare", label: "Comparar", Panel: ComparePanel },
];

export function AmortizacaoTabs() {
  const baseId = useId();
  const [current, setCurrent] = useState<TabId>("price");
  const tabRefs = useRef<Map<TabId, HTMLButtonElement | null>>(new Map());

  const focusTab = useCallback((id: TabId) => {
    const element = tabRefs.current.get(id);
    if (element) element.focus();
  }, []);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    const index = TABS.findIndex((tab) => tab.id === current);
    if (index < 0) return;
    const lastIndex = TABS.length - 1;
    let nextIndex = index;
    switch (event.key) {
      case "ArrowRight":
        nextIndex = index === lastIndex ? 0 : index + 1;
        break;
      case "ArrowLeft":
        nextIndex = index === 0 ? lastIndex : index - 1;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = lastIndex;
        break;
      default:
        return;
    }
    event.preventDefault();
    const nextTab = TABS[nextIndex];
    if (!nextTab) return;
    setCurrent(nextTab.id);
    focusTab(nextTab.id);
  }

  const activeTab = TABS.find((tab) => tab.id === current);

  return (
    <div data-testid="amortizacao-tabs" className="flex flex-col gap-4">
      <div
        role="tablist"
        aria-label="Sistema de amortizacao"
        onKeyDown={handleKeyDown}
        className="flex flex-wrap gap-2 border-b border-slate-200"
      >
        {TABS.map((tab) => {
          const selected = tab.id === current;
          return (
            <button
              key={tab.id}
              id={`${baseId}-tab-${tab.id}`}
              ref={(element) => {
                tabRefs.current.set(tab.id, element);
              }}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setCurrent(tab.id)}
              className={cn(
                "-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors",
                selected
                  ? "border-[var(--color-brand-primary)] text-[var(--color-brand-primary)]"
                  : "border-transparent text-slate-500 hover:text-slate-700",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              )}
              data-testid={`amortizacao-tab-${tab.id}`}
            >
              {tab.label}
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
          data-testid={`amortizacao-panel-${activeTab.id}`}
        >
          <activeTab.Panel />
        </div>
      ) : null}
    </div>
  );
}
