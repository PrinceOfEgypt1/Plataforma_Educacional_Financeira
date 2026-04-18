import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Plataforma Educacional Financeira",
    template: "%s | Plataforma Educacional Financeira",
  },
  description:
    "Simuladores e calculadoras para educação financeira pessoal. " +
    "Produto exclusivamente educacional — não constitui consultoria financeira.",
  keywords: [
    "finanças",
    "educação financeira",
    "simulador",
    "juros",
    "amortização",
    "PRICE",
    "SAC",
  ],
  robots: { index: true, follow: true },
};

interface RootLayoutProps {
  children: ReactNode;
}

/**
 * Layout raiz — responsável apenas pelo contrato de HTML/`lang` e pela
 * renderização dos filhos. O banner educacional e a shell (sidebar + header)
 * migraram para o layout do grupo `(app)` a partir da Sprint 1, permitindo
 * introduzir rotas sem shell no futuro (`/login`, `/embed`) sem rewrite.
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
