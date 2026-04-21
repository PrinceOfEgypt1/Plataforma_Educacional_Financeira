/**
 * Setup global para o Vitest.
 *
 * Registra os matchers de `@testing-library/jest-dom` (por exemplo,
 * `toBeInTheDocument`, `toHaveAttribute`, `toHaveTextContent`).
 *
 * Também provê um polyfill mínimo de `window.matchMedia`, ausente em jsdom —
 * alguns componentes UI podem tocar nele ao decidir variantes responsivas.
 */
import "@testing-library/jest-dom/vitest";

if (typeof window !== "undefined" && typeof window.matchMedia !== "function") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}
