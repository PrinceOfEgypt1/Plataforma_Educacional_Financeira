import type { Metadata } from "next";
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
  children: React.ReactNode;
}

/**
 * Layout raiz — presente em TODAS as telas.
 * Inclui:
 *  - lang=pt-BR obrigatório (acessibilidade + SEO)
 *  - Banner educacional persistente (requisito regulatório Doc 18)
 *  - Tokens CSS carregados via globals.css
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body>
        {/* Aviso educacional persistente — obrigatório por Doc 18 */}
        <div
          className="educational-notice"
          role="note"
          aria-label="Aviso importante sobre o produto"
        >
          ⚠️ Produto exclusivamente educacional — não constitui consultoria
          financeira nem proposta vinculante de crédito.
        </div>

        {/* Conteúdo principal */}
        <div id="main-content">{children}</div>
      </body>
    </html>
  );
}
