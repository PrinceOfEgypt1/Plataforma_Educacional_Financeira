import type { Metadata } from "next";

import { RealEstateF8FObservatory } from "@/components/financing/realEstateF8F/RealEstateF8FObservatory";
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

/**
 * Rota oficial do módulo Financiamento Imobiliário.
 *
 * Frente 14F-F8F (fase A): substitui o cockpit antigo (FinanciamentoCockpit)
 * pela implementação React fiel ao protótipo visual F8E-AJ1 aprovado pelo PO
 * em 02c6085 (docs/gates/gate-po-ux-valor/14f-f8e-aj1-aceite-visual/).
 *
 * O componente legado FinanciamentoCockpit permanece exportado em
 * src/components/financing/FinanciamentoCockpit.tsx para preservar os 1776
 * linhas de teste existentes (frontend/src/__tests__/app/financiamento-imobiliario.test.tsx)
 * que validam sua lógica isolada. Migração desses testes para o novo shell
 * é planejada em F8F-B (matriz de equivalência registrada em
 * docs/gates/gate-po-ux-valor/14f-f8f-implementacao-react-fiel-f8e-aj1/).
 */
export default function FinanciamentoImobiliarioPage() {
  return (
    <>
      <h1 className="sr-only">
        {FINANCIAMENTO_MODULE?.title ?? "Financiamento Imobiliário"}
      </h1>
      <RealEstateF8FObservatory />
    </>
  );
}
