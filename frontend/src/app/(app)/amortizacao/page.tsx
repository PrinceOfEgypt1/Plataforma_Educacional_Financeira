import type { Metadata } from "next";

import {
  AmortizacaoCuidados,
  AmortizacaoGlossario,
  AmortizacaoSaibaMais,
} from "@/components/amortization/AmortizacaoSaibaMais";
import { AmortizacaoTabs } from "@/components/amortization/AmortizacaoTabs";
import { MODULES } from "@/config/modules";
import {
  CONTEUDO_NIVEL_1,
  CUIDADOS_EDUCACIONAIS,
  GLOSSARIO_MINIMO,
} from "@/content/amortizacao";

const AMORTIZACAO_MODULE = MODULES.find(
  (module) => module.id === "amortizacao",
);

export const metadata: Metadata = {
  title: AMORTIZACAO_MODULE?.title ?? "Amortizacao PRICE e SAC",
  description:
    AMORTIZACAO_MODULE?.description ??
    "Simule PRICE, SAC e compare os dois sistemas de amortizacao.",
};

export default function AmortizacaoPage() {
  const title = AMORTIZACAO_MODULE?.title ?? "Amortizacao PRICE e SAC";
  const description =
    AMORTIZACAO_MODULE?.description ??
    "Simule PRICE, SAC e compare os dois sistemas de amortizacao.";

  return (
    <div className="mx-auto max-w-6xl" data-testid="amortizacao-page">
      <header className="mb-6">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {AMORTIZACAO_MODULE?.group.label ?? "Modulo"}
        </span>
        <h1
          className="mt-1 text-2xl font-bold tracking-tight"
          style={{ color: "var(--color-brand-primary)" }}
        >
          {title}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </header>

      <AmortizacaoTabs />

      <section
        aria-labelledby="amortizacao-aprenda-mais-heading"
        className="mt-10"
        data-testid="amortizacao-aprenda-mais"
      >
        <h2
          id="amortizacao-aprenda-mais-heading"
          className="mb-4 text-lg font-semibold tracking-tight"
          style={{ color: "var(--color-brand-primary)" }}
        >
          Entenda a amortização
        </h2>
        <p className="mb-4 text-sm text-slate-500">
          Conteúdo educacional Nível 1 para ler a tabela, comparar PRICE e SAC e
          separar parcela mensal de custo total.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {CONTEUDO_NIVEL_1.map((bloco) => (
            <AmortizacaoSaibaMais key={bloco.slug} content={bloco} />
          ))}
        </div>
      </section>

      <section
        aria-labelledby="amortizacao-glossario-heading"
        className="mt-10"
        data-testid="amortizacao-glossario"
      >
        <h2
          id="amortizacao-glossario-heading"
          className="mb-4 text-lg font-semibold tracking-tight"
          style={{ color: "var(--color-brand-primary)" }}
        >
          Glossário da amortização
        </h2>
        <AmortizacaoGlossario entries={GLOSSARIO_MINIMO} />
      </section>

      <section
        aria-labelledby="amortizacao-cuidados-heading"
        className="mt-10"
        data-testid="amortizacao-cuidados"
      >
        <h2
          id="amortizacao-cuidados-heading"
          className="mb-4 text-lg font-semibold tracking-tight"
          style={{ color: "var(--color-brand-primary)" }}
        >
          Cuidados educacionais
        </h2>
        <AmortizacaoCuidados alerts={CUIDADOS_EDUCACIONAIS} />
      </section>
    </div>
  );
}
