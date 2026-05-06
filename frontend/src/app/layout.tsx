import type { Metadata } from "next";
import { IBM_Plex_Mono, Syne } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-syne",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
});

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
    <html lang="pt-BR" className={`${syne.variable} ${ibmPlexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
