"use client";

import { useMemo, useState } from "react";

import {
  CockpitModal,
  ModalDisclaimer,
  ModalExample,
  ModalHeading,
  ModalText,
  type SubTab,
} from "@/components/ui/cockpit";
import {
  ALERTAS_EDUCACIONAIS,
  CONTEUDO_NIVEL_1,
  CONTEUDO_NIVEL_2,
  DISCLAIMER_DIAGNOSTICO,
  GLOSSARIO_MINIMO,
} from "@/content/diagnostico";

type ModalTab = "nivel-1" | "nivel-2" | "glossario" | "alertas" | "aviso";

const MODAL_TABS: ReadonlyArray<SubTab<ModalTab>> = [
  { id: "nivel-1", label: "Essencial" },
  { id: "nivel-2", label: "Aprofundado" },
  { id: "glossario", label: "Glossário" },
  { id: "alertas", label: "Alertas" },
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
      <ModalHeading>Glossário do diagnóstico financeiro</ModalHeading>
      <div className="modal-gloss-grid">
        {GLOSSARIO_MINIMO.map((entry) => (
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

function AlertasContent() {
  return (
    <>
      <ModalHeading>Alertas do diagnóstico — o que significam</ModalHeading>
      <ModalText>
        Os alertas são gerados automaticamente pelo backend quando uma ou mais
        dimensões financeiras ultrapassam limiares de atenção. Eles são sinais
        educacionais — não prescrições nem diagnósticos definitivos.
      </ModalText>
      {ALERTAS_EDUCACIONAIS.map((alerta) => (
        <div key={alerta.code} className="mb-6">
          <ModalHeading>{alerta.title}</ModalHeading>
          <ModalText>{alerta.explanation}</ModalText>
          <ModalExample>
            <strong>Por que importa:</strong>
            <br />
            {alerta.whyItMatters}
          </ModalExample>
          <ModalText>{alerta.pedagogicalNote}</ModalText>
        </div>
      ))}
      <ModalDisclaimer />
    </>
  );
}

function AvisoContent() {
  return (
    <>
      <ModalHeading>Aviso educacional</ModalHeading>
      <ModalText>{DISCLAIMER_DIAGNOSTICO}</ModalText>
      <ModalExample>
        <strong>O que este diagnóstico faz:</strong>
        <br />
        Analisa renda, despesas, dívidas e reserva para gerar score, nível de
        saúde e alertas educacionais.
      </ModalExample>
      <ModalExample>
        <strong>O que este diagnóstico não faz:</strong>
        <br />
        Não prescreve decisões financeiras. Não garante resultado. Não substitui
        análise de profissional habilitado (contador, planejador financeiro,
        assessor de investimentos). Não usa dados reais de crédito ou
        patrimônio.
      </ModalExample>
      <ModalText>
        A plataforma é um produto educacional. O objetivo é ajudar a entender os
        próprios números — não aconselhar sobre como investi-los, emprestá-los
        ou movimentá-los.
      </ModalText>
    </>
  );
}

export interface DiagnosticoSaibaMaisProps {
  readonly initialTab?: ModalTab;
}

export function DiagnosticoSaibaMais({
  initialTab = "nivel-1",
}: DiagnosticoSaibaMaisProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ModalTab>(initialTab);

  const body = useMemo(() => {
    switch (activeTab) {
      case "nivel-1":
        return <Nivel1Content />;
      case "nivel-2":
        return <Nivel2Content />;
      case "glossario":
        return <GlossarioContent />;
      case "alertas":
        return <AlertasContent />;
      case "aviso":
        return <AvisoContent />;
      default:
        return null;
    }
  }, [activeTab]);

  return (
    <>
      <button
        type="button"
        className="cockpit-more-btn"
        data-testid="diagnostico-saiba-mais-btn"
        onClick={() => setOpen(true)}
      >
        📖 Entenda o diagnóstico financeiro →
      </button>
      <CockpitModal
        open={open}
        tag="🩺 MÓDULO · DIAGNÓSTICO FINANCEIRO"
        title="Entenda o diagnóstico financeiro"
        tabs={MODAL_TABS}
        active={activeTab}
        onTabChange={setActiveTab}
        onClose={() => setOpen(false)}
      >
        {body}
      </CockpitModal>
    </>
  );
}
