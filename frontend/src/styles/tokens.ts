/**
 * Design System Tokens — Plataforma Educacional Financeira
 * Fonte canônica: este arquivo + Doc 16 (Design System)
 *
 * Regra anti-drift:
 *   1. Nunca escrever cores/tamanhos hardcoded em componentes.
 *   2. Sempre importar deste arquivo ou usar as CSS vars de tokens.css.
 *   3. Qualquer adição aqui deve ser refletida em tokens.css e vice-versa.
 *   4. O impact agent detecta mudanças neste arquivo como risco HIGH.
 */

export const tokens = {
  colors: {
    brand: {
      primary: "#1B4F72" as const, // Azul confiança — cor principal
      secondary: "#2E75B6" as const, // Azul médio — CTAs secundários
      accent: "#27AE60" as const, // Verde — destaques positivos
    },
    semantic: {
      success: "#16A34A" as const,
      warning: "#D97706" as const,
      error: "#DC2626" as const,
      info: "#2563EB" as const,
    },
    /** Cores exclusivas para contexto financeiro */
    financial: {
      positive: "#16A34A" as const, // ganho, economia, retorno
      negative: "#DC2626" as const, // custo, juro, perda
      neutral: "#2563EB" as const, // informativo, taxa de referência
      warning: "#D97706" as const, // atenção, risco moderado
    },
    neutral: {
      50: "#F8FAFC" as const,
      100: "#F1F5F9" as const,
      200: "#E2E8F0" as const,
      300: "#CBD5E1" as const,
      400: "#94A3B8" as const,
      500: "#64748B" as const,
      600: "#475569" as const,
      700: "#334155" as const,
      800: "#1E293B" as const,
      900: "#0F172A" as const,
    },
  },
  typography: {
    fontFamily: {
      sans: "Inter, system-ui, -apple-system, sans-serif" as const,
      mono: "JetBrains Mono, Consolas, monospace" as const,
    },
    fontSize: {
      xs: "0.75rem" as const,
      sm: "0.875rem" as const,
      base: "1rem" as const,
      lg: "1.125rem" as const,
      xl: "1.25rem" as const,
      "2xl": "1.5rem" as const,
      "3xl": "1.875rem" as const,
    },
    fontWeight: {
      normal: "400" as const,
      medium: "500" as const,
      semibold: "600" as const,
      bold: "700" as const,
    },
  },
  spacing: {
    page: "1.5rem" as const,
    section: "2rem" as const,
    card: "1.25rem" as const,
    inline: "0.5rem" as const,
  },
  borderRadius: {
    card: "0.75rem" as const,
    button: "0.5rem" as const,
    badge: "9999px" as const,
    input: "0.375rem" as const,
  },
  shadow: {
    card: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)" as const,
    elevated:
      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)" as const,
  },
  /** Breakpoints — usar via Tailwind (sm/md/lg/xl) ou CSS vars */
  breakpoints: {
    mobile: "375px" as const,
    tablet: "768px" as const,
    desktop: "1280px" as const,
    wide: "1920px" as const,
  },
} as const;

export type ColorToken = typeof tokens.colors;
export type TypographyToken = typeof tokens.typography;
export type Tokens = typeof tokens;
