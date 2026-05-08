import type { Metadata } from "next";

import { DiagnosticoCockpit } from "@/components/diagnostic/DiagnosticoCockpit";
import { MODULES } from "@/config/modules";

const DIAGNOSTICO_MODULE = MODULES.find((m) => m.id === "diagnostico");

export const metadata: Metadata = {
  title: DIAGNOSTICO_MODULE?.title ?? "Diagnóstico Financeiro",
  description:
    DIAGNOSTICO_MODULE?.description ??
    "Avalie sua saúde financeira com base em renda, despesas, dívidas e reserva.",
};

export default function DiagnosticoPage() {
  return (
    <>
      <h1 className="sr-only">
        {DIAGNOSTICO_MODULE?.title ?? "Diagnóstico Financeiro"}
      </h1>
      <DiagnosticoCockpit />
    </>
  );
}
