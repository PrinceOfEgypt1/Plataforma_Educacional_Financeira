import type { Metadata } from "next";

import { AmortizacaoTabs } from "@/components/amortization/AmortizacaoTabs";
import { MODULES } from "@/config/modules";

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
    </div>
  );
}
