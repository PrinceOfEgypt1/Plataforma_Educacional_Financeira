import type { Metadata } from "next";

import { FinanciamentoCockpit } from "@/components/financing/FinanciamentoCockpit";
import { MODULES } from "@/config/modules";

const FINANCIAMENTO_MODULE = MODULES.find(
  (m) => m.id === "financiamento-imobiliario",
);

export const metadata: Metadata = {
  title: FINANCIAMENTO_MODULE?.title ?? "Financiamento Imobiliário",
  description:
    FINANCIAMENTO_MODULE?.description ??
    "Simule prazos, entrada e sistema de amortização para compra de imóvel.",
};

export default function FinanciamentoImobiliarioPage() {
  return (
    <>
      <h1 className="sr-only">
        {FINANCIAMENTO_MODULE?.title ?? "Financiamento Imobiliário"}
      </h1>
      <FinanciamentoCockpit />
    </>
  );
}
