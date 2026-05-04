import type { Metadata } from "next";

import {
  AmortizacaoCuidados,
  AmortizacaoGlossario,
  AmortizacaoSaibaMais,
} from "@/components/amortization/AmortizacaoSaibaMais";
import { AmortizacaoTabs } from "@/components/amortization/AmortizacaoTabs";
import { ModuleHeader } from "@/components/shell/ModuleHeader";
import { ProgressiveSection } from "@/components/ui";
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
      {AMORTIZACAO_MODULE ? (
        <ModuleHeader
          module={AMORTIZACAO_MODULE}
          description={description}
          className="mb-6"
        />
      ) : (
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            {title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </header>
      )}

      <AmortizacaoTabs />

      <section className="mt-6 space-y-3" aria-label="Camadas de apoio">
        <ProgressiveSection
          title="Entenda a amortização"
          description="Explicações pedagógicas sob demanda, sem competir com a simulação."
          headingLevel={2}
          testId="amortizacao-aprenda-mais"
          contentClassName="space-y-3"
        >
          <p className="text-sm text-slate-500">
            Conteúdo educacional Nível 1 para ler a tabela, comparar PRICE e SAC
            e separar parcela mensal de custo total.
          </p>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {CONTEUDO_NIVEL_1.map((bloco) => (
              <AmortizacaoSaibaMais key={bloco.slug} content={bloco} />
            ))}
          </div>
        </ProgressiveSection>

        <ProgressiveSection
          title="Glossário da amortização"
          description="Termos técnicos em lista compacta para consulta rápida."
          headingLevel={2}
          testId="amortizacao-glossario"
        >
          <AmortizacaoGlossario entries={GLOSSARIO_MINIMO} />
        </ProgressiveSection>

        <ProgressiveSection
          title="Cuidados educacionais"
          description="Avisos de leitura e contratação como camada de cautela."
          headingLevel={2}
          testId="amortizacao-cuidados"
        >
          <AmortizacaoCuidados alerts={CUIDADOS_EDUCACIONAIS} />
        </ProgressiveSection>
      </section>
    </div>
  );
}
