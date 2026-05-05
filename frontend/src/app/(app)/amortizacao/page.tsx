import type { Metadata } from "next";

import { AmortizationCockpit } from "@/components/amortization/AmortizationCockpit";
import { MODULES } from "@/config/modules";

const AMORTIZACAO_MODULE = MODULES.find(
  (module) => module.id === "amortizacao",
);

export const metadata: Metadata = {
  title: AMORTIZACAO_MODULE?.title ?? "Amortização PRICE e SAC",
  description:
    AMORTIZACAO_MODULE?.description ??
    "Simule PRICE, SAC e compare os dois sistemas de amortização.",
};

export default function AmortizacaoPage() {
  return (
    <>
      <h1 className="sr-only">
        {AMORTIZACAO_MODULE?.title ?? "Amortização PRICE e SAC"}
      </h1>
      <AmortizationCockpit />
    </>
  );
}
