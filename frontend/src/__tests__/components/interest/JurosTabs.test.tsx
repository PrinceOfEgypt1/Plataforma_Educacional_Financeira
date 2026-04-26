/**
 * Testes WAI-ARIA — JurosTabs.
 *
 * Valida:
 *   - role=tablist + 3 role=tab;
 *   - aba corrente com aria-selected=true e tabindex=0;
 *   - ArrowRight / ArrowLeft / Home / End movem a aba corrente.
 */
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { JurosTabs } from "@/components/interest/JurosTabs";

describe("JurosTabs — a11y", () => {
  it("expõe role=tablist com 3 tabs e aria-selected correto", () => {
    render(<JurosTabs />);
    const tablist = screen.getByRole("tablist");
    expect(tablist).toHaveAttribute("aria-label", "Regime de juros");
    const tabs = screen.getAllByRole("tab");
    expect(tabs.length).toBe(3);
    const selected = tabs.filter(
      (t) => t.getAttribute("aria-selected") === "true",
    );
    expect(selected.length).toBe(1);
  });

  it("ArrowRight e ArrowLeft navegam entre tabs", () => {
    render(<JurosTabs />);
    const tablist = screen.getByRole("tablist");
    fireEvent.keyDown(tablist, { key: "ArrowRight" });
    let selected = screen
      .getAllByRole("tab")
      .filter((t) => t.getAttribute("aria-selected") === "true");
    expect(selected[0]).toHaveTextContent(/Juros compostos/i);
    fireEvent.keyDown(tablist, { key: "ArrowRight" });
    selected = screen
      .getAllByRole("tab")
      .filter((t) => t.getAttribute("aria-selected") === "true");
    expect(selected[0]).toHaveTextContent(/Comparar/i);
    fireEvent.keyDown(tablist, { key: "ArrowRight" });
    selected = screen
      .getAllByRole("tab")
      .filter((t) => t.getAttribute("aria-selected") === "true");
    expect(selected[0]).toHaveTextContent(/Juros simples/i);
  });

  it("Home e End levam para primeira e última", () => {
    render(<JurosTabs />);
    const tablist = screen.getByRole("tablist");
    fireEvent.keyDown(tablist, { key: "End" });
    let selected = screen
      .getAllByRole("tab")
      .filter((t) => t.getAttribute("aria-selected") === "true");
    expect(selected[0]).toHaveTextContent(/Comparar/i);
    fireEvent.keyDown(tablist, { key: "Home" });
    selected = screen
      .getAllByRole("tab")
      .filter((t) => t.getAttribute("aria-selected") === "true");
    expect(selected[0]).toHaveTextContent(/Juros simples/i);
  });

  it("painel corrente aparece com role=tabpanel e aria-labelledby", () => {
    render(<JurosTabs />);
    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveAttribute("aria-labelledby");
    expect(panel).toHaveAttribute("tabindex", "0");
  });
});
