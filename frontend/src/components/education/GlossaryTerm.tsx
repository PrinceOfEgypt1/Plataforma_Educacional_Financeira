"use client";

/**
 * GlossaryTerm — Glossário contextual inline com portal (position: fixed)
 *
 * REDESENHO ITEM 14D-B:
 * Tooltip usa createPortal — renderizado no body, nunca cortado por
 * overflow:hidden de containers pai.
 * Posição calculada via getBoundingClientRect em coordenadas viewport.
 * Funciona com mouse, teclado e touch.
 */

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

export interface GlossaryTermProps {
  readonly term: string;
  readonly definition: string;
  readonly example?: string;
  readonly accent?: "cyan" | "amber" | "emerald" | "violet";
}

const ACCENT_CLS: Record<string, string> = {
  cyan: "text-cyan-300 border-cyan-400/60",
  amber: "text-amber-300 border-amber-400/60",
  emerald: "text-emerald-300 border-emerald-400/60",
  violet: "text-violet-300 border-violet-400/60",
};

const TOOLTIP_BORDER: Record<string, string> = {
  cyan: "border-cyan-400/50",
  amber: "border-amber-400/50",
  emerald: "border-emerald-400/50",
  violet: "border-violet-400/50",
};

interface TooltipCoords {
  top: number;
  left: number;
}

export function GlossaryTerm({
  term,
  definition,
  example,
  accent = "cyan",
}: GlossaryTermProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<TooltipCoords>({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const rawId = useId().replace(/:/g, "");
  const tooltipId = `gterm-${rawId}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  const calcCoords = useCallback((): TooltipCoords => {
    if (!ref.current) return { top: 0, left: 0 };
    const rect = ref.current.getBoundingClientRect();
    const TOOLTIP_H = 130;
    const TOOLTIP_W = 240;
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openDown = spaceAbove < TOOLTIP_H + 16 && spaceBelow >= TOOLTIP_H;

    let left = rect.left;
    if (left + TOOLTIP_W > window.innerWidth - 8) {
      left = Math.max(8, window.innerWidth - TOOLTIP_W - 8);
    }

    return {
      top: openDown ? rect.bottom + 6 : rect.top - TOOLTIP_H - 6,
      left,
    };
  }, []);

  const show = useCallback(() => {
    setCoords(calcCoords());
    setOpen(true);
  }, [calcCoords]);

  const hide = useCallback(() => setOpen(false), []);

  const toggle = useCallback(() => {
    if (!open) setCoords(calcCoords());
    setOpen((v) => !v);
  }, [open, calcCoords]);

  useEffect(() => {
    if (!open) return;
    const reposition = () => setCoords(calcCoords());
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [open, calcCoords]);

  const accentCls = ACCENT_CLS[accent] ?? ACCENT_CLS.cyan;
  const borderCls = TOOLTIP_BORDER[accent] ?? TOOLTIP_BORDER.cyan;

  const tooltip =
    open && mounted
      ? createPortal(
          <span
            id={tooltipId}
            role="tooltip"
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              zIndex: 9999,
              width: 240,
            }}
            className={`pointer-events-none rounded-xl border bg-slate-900/98 px-3 py-2.5 text-[11.5px] leading-relaxed text-slate-100 shadow-2xl backdrop-blur-sm ${borderCls}`}
          >
            <span className="block font-semibold text-slate-50">{term}</span>
            <span className="mt-0.5 block text-slate-300">{definition}</span>
            {example !== undefined && (
              <span className="mt-1.5 block border-t border-white/10 pt-1.5 text-[11px] italic text-slate-400">
                {example}
              </span>
            )}
          </span>,
          document.body,
        )
      : null;

  return (
    <span className="relative inline-block" ref={ref}>
      <span
        role="button"
        tabIndex={0}
        aria-describedby={tooltipId}
        className={`cursor-help border-b border-dashed font-medium transition-opacity hover:opacity-90 focus:outline-none focus:ring-1 focus:ring-cyan-400/60 focus:ring-offset-1 focus:ring-offset-transparent ${accentCls}`}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
          if (e.key === "Escape") hide();
        }}
      >
        {term}
      </span>
      {tooltip}
    </span>
  );
}
