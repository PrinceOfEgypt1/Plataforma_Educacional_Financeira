"use client";

import { useEffect, type ReactNode } from "react";

import { cn } from "@/lib/cn";

import type { SubTab } from "./CockpitPrimitives";

export function CockpitModal<T extends string>({
  open,
  tag,
  title,
  tabs,
  active,
  onTabChange,
  onClose,
  children,
}: {
  readonly open: boolean;
  readonly tag: string;
  readonly title: string;
  readonly tabs: ReadonlyArray<SubTab<T>>;
  readonly active: T;
  readonly onTabChange: (id: T) => void;
  readonly onClose: () => void;
  readonly children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    function handleKey(event: KeyboardEvent): void {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div
      className="cockpit-modal-overlay open"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="cockpit-modal-box"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cockpit-modal-title"
      >
        <header className="cockpit-modal-header">
          <div className="cockpit-modal-header-left">
            <span className="cockpit-modal-tag">{tag}</span>
            <h2 className="cockpit-modal-title" id="cockpit-modal-title">
              {title}
            </h2>
          </div>
          <button
            className="cockpit-modal-close"
            type="button"
            aria-label="Fechar modal"
            onClick={onClose}
          >
            ✕
          </button>
        </header>
        <nav className="cockpit-modal-tabs" aria-label={`Abas: ${title}`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={cn("cockpit-modal-tab", tab.id === active && "active")}
              onClick={() => onTabChange(tab.id)}
              data-testid={`modal-tab-${tab.id}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="cockpit-modal-body">{children}</div>
      </section>
    </div>
  );
}

export function ModalHeading({ children }: { readonly children: ReactNode }) {
  return <h3 className="cockpit-modal-h2">{children}</h3>;
}

export function ModalText({ children }: { readonly children: ReactNode }) {
  return <p className="cockpit-modal-p">{children}</p>;
}

export function ModalFormula({ children }: { readonly children: ReactNode }) {
  return <div className="cockpit-modal-formula">{children}</div>;
}

export function ModalExample({ children }: { readonly children: ReactNode }) {
  return <div className="cockpit-modal-example">{children}</div>;
}

export function ModalDisclaimer() {
  return (
    <div className="cockpit-modal-disclaimer">
      Produto educacional. A simulação não substitui contrato, proposta formal
      ou orientação profissional habilitada.
    </div>
  );
}
