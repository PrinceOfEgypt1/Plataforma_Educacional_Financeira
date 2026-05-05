import type { Metadata } from "next";

import { InterestCockpit } from "@/components/interest/InterestCockpit";
import { MODULES } from "@/config/modules";

const JUROS_MODULE = MODULES.find((module) => module.id === "juros");

export const metadata: Metadata = {
  title: JUROS_MODULE?.title ?? "Juros simples e compostos",
  description:
    JUROS_MODULE?.description ??
    "Simule juros simples, juros compostos e compare os dois regimes.",
};

export default function JurosPage() {
  return (
    <>
      <h1 className="sr-only">
        {JUROS_MODULE?.title ?? "Juros Simples e Compostos"}
      </h1>
      <InterestCockpit />
    </>
  );
}
