import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Início",
};

export default function HomePage() {
  return (
    <section className="cockpit-coming-soon" data-testid="home-page">
      <div className="cockpit-empty-state">
        <div className="big" aria-hidden="true">
          ✦
        </div>
        <h1>Plataforma Educacional Financeira</h1>
        <p>
          Cockpit educacional para simular juros e amortização com dados
          oficiais da API. Escolha um módulo ativo na topbar ou avance pelos
          atalhos abaixo.
        </p>
        <div className="mt-5 flex gap-3">
          <Link className="cockpit-btn-more" href="/juros">
            ⚡ Juros
          </Link>
          <Link className="cockpit-btn-more" href="/amortizacao">
            📊 Amortização
          </Link>
        </div>
      </div>
    </section>
  );
}
