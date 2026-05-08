"use client";

import { useState } from "react";

import {
  CockpitModal,
  ModalDisclaimer,
  ModalExample,
  ModalHeading,
  ModalText,
  type SubTab,
} from "@/components/ui/cockpit";
import {
  CONTEUDO_NIVEL_1,
  CONTEUDO_NIVEL_2,
  DISCLAIMER_FINANCIAMENTO,
  GLOSSARIO_FINANCIAMENTO,
} from "@/content/financiamento-imobiliario";

type ModalTab = "nivel-1" | "nivel-2" | "glossario" | "aviso";

const MODAL_TABS: ReadonlyArray<SubTab<ModalTab>> = [
  { id: "nivel-1", label: "Essencial" },
  { id: "nivel-2", label: "Aprofundado" },
  { id: "glossario", label: "Glossário" },
  { id: "aviso", label: "Aviso educacional" },
];

function Nivel1Content() {
  return (
    <>
      {CONTEUDO_NIVEL_1.map((item) => (
        <div key={item.slug} className="mb-6">
          <ModalHeading>{item.title}</ModalHeading>
          {item.paragraphs.map((p, i) => (
            <ModalText key={i}>{p}</ModalText>
          ))}
        </div>
      ))}
      <ModalDisclaimer />
    </>
  );
}

function Nivel2Content() {
  return (
    <>
      {CONTEUDO_NIVEL_2.map((item) => (
        <div key={`${item.slug}-n2`} className="mb-6">
          <ModalHeading>{item.title}</ModalHeading>
          {item.paragraphs.map((p, i) => (
            <ModalText key={i}>{p}</ModalText>
          ))}
        </div>
      ))}
      <ModalDisclaimer />
    </>
  );
}

function GlossarioContent() {
  return (
    <>
      <ModalHeading>Glossário do financiamento imobiliário</ModalHeading>
      <div className="modal-gloss-grid">
        {GLOSSARIO_FINANCIAMENTO.map((entry) => (
          <ModalExample key={entry.slug}>
            <strong>{entry.term}</strong>
            <br />
            {entry.shortDefinition}
            <br />
            <span className="text-xs text-slate-500">{entry.example}</span>
          </ModalExample>
        ))}
      </div>
      <ModalDisclaimer />
    </>
  );
}

function AvisoContent() {
  return (
    <>
      <ModalHeading>Aviso educacional</ModalHeading>
      <ModalText>{DISCLAIMER_FINANCIAMENTO}</ModalText>
      <ModalText>
        Esta ferramenta usa taxa fixa mensal. Financiamentos com correção por
        TR, IPCA ou outros índices têm dinâmica diferente e não são
        representados aqui.
      </ModalText>
      <ModalText>
        O CET (Custo Efetivo Total) oficial inclui custos que esta simulação não
        considera: avaliação do imóvel, registro em cartório, ITBI e outros.
        Sempre consulte a proposta oficial do banco antes de assinar.
      </ModalText>
      <ModalDisclaimer />
    </>
  );
}

export interface FinanciamentoSaibaMaisProps {
  readonly initialTab?: ModalTab;
}

export function FinanciamentoSaibaMais({
  initialTab = "nivel-1",
}: FinanciamentoSaibaMaisProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ModalTab>(initialTab);

  return (
    <>
      <button
        type="button"
        className="cockpit-more-btn"
        data-testid="financiamento-saiba-mais-btn"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
      >
        🏠 Entenda o financiamento imobiliário →
      </button>

      <CockpitModal
        open={open}
        tag="🏠 MÓDULO · FINANCIAMENTO IMOBILIÁRIO"
        title="Entenda o financiamento imobiliário"
        tabs={MODAL_TABS}
        active={activeTab}
        onTabChange={(id) => setActiveTab(id as ModalTab)}
        onClose={() => setOpen(false)}
      >
        {activeTab === "nivel-1" && <Nivel1Content />}
        {activeTab === "nivel-2" && <Nivel2Content />}
        {activeTab === "glossario" && <GlossarioContent />}
        {activeTab === "aviso" && <AvisoContent />}
      </CockpitModal>
    </>
  );
}
