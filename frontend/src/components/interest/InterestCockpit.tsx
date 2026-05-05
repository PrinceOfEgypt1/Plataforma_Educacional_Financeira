"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import { validateInterestDraft } from "@/components/interest/formValidation";
import {
  CautionItem,
  CenterPanel,
  CockpitButton,
  CockpitField,
  CockpitGrid,
  CockpitInputPanel,
  CockpitModal,
  CockpitSlider,
  CockpitSubTabs,
  EduFormula,
  EducationPanel,
  EduText,
  EduTitle,
  InterestCockpitChart,
  InterestCompoundTable,
  InterestSimpleTable,
  LegendItem,
  ModalDisclaimer,
  ModalExample,
  ModalFormula,
  ModalHeading,
  ModalText,
  MoreButton,
  type KpiItem,
  type SubTab,
} from "@/components/ui/cockpit";
import { describeApiError, type InterestApiError } from "@/lib/api/problem";
import { formatBRL, formatRatePct } from "@/lib/money";
import {
  compararJuros,
  simularJurosCompostos,
  simularJurosSimples,
} from "@/services/interest";
import type {
  CompararJurosOut,
  JurosCompostosOut,
  JurosSimplesOut,
} from "@/types/interest";
import { AMORTIZACAO_KEY } from "@/types/interest";

type InterestTab = "simples" | "compostos" | "comparar";
type EduTab = "conceito" | "tabela" | "cuidados" | "analise";
type ModalTab = "js" | "jc" | "comparacao" | "aportes" | "cuidados";

interface Draft {
  readonly principal: string;
  readonly taxaMensalPct: string;
  readonly prazoMeses: number;
}

type AsyncResult<T> =
  | { readonly status: "idle" | "loading" }
  | { readonly status: "ok"; readonly result: T }
  | { readonly status: "error"; readonly error: InterestApiError };

const INTEREST_TABS: readonly SubTab<InterestTab>[] = [
  { id: "simples", label: "Juros simples" },
  { id: "compostos", label: "Juros compostos" },
  { id: "comparar", label: "Comparar" },
];

const EDU_TABS_STANDARD: readonly SubTab<EduTab>[] = [
  { id: "conceito", label: "Conceito" },
  { id: "tabela", label: "Tabela" },
  { id: "cuidados", label: "Cuidados" },
];

const EDU_TABS_COMPARE: readonly SubTab<EduTab>[] = [
  { id: "analise", label: "Análise" },
];

const MODAL_TABS: readonly SubTab<ModalTab>[] = [
  { id: "js", label: "Juros Simples" },
  { id: "jc", label: "Juros Compostos" },
  { id: "comparacao", label: "Comparação" },
  { id: "aportes", label: "Aportes" },
  { id: "cuidados", label: "Cuidados" },
];

const DEFAULT_DRAFT: Draft = {
  principal: "180.000,00",
  taxaMensalPct: "1.5",
  prazoMeses: 60,
};

export function InterestCockpit() {
  const [active, setActive] = useState<InterestTab>("simples");
  const [eduTab, setEduTab] = useState<EduTab>("conceito");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<ModalTab>("js");

  useEffect(() => {
    setEduTab(active === "comparar" ? "analise" : "conceito");
  }, [active]);

  function openModal(tab: ModalTab): void {
    setModalTab(tab);
    setModalOpen(true);
  }

  return (
    <>
      <div data-testid="juros-cockpit" className="contents">
        <CockpitSubTabs
          tabs={INTEREST_TABS}
          active={active}
          onChange={setActive}
          label="Regimes de juros"
        />
        {active === "simples" ? (
          <InterestSimplePane
            eduTab={eduTab}
            setEduTab={setEduTab}
            openModal={openModal}
          />
        ) : null}
        {active === "compostos" ? (
          <InterestCompoundPane
            eduTab={eduTab}
            setEduTab={setEduTab}
            openModal={openModal}
          />
        ) : null}
        {active === "comparar" ? (
          <InterestComparePane
            eduTab={eduTab}
            setEduTab={setEduTab}
            openModal={openModal}
          />
        ) : null}
      </div>
      <InterestEducationModal
        open={modalOpen}
        active={modalTab}
        setActive={setModalTab}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}

function payloadFromDraft(draft: Draft) {
  const validation = validateInterestDraft(
    {
      principal: draft.principal,
      taxaMensalPct: draft.taxaMensalPct,
      prazoMeses: String(draft.prazoMeses),
    },
    { acceptAporte: false },
  );
  if (!validation.ok || validation.value === null) return null;
  return {
    principal: validation.value.principal,
    taxa_mensal: validation.value.taxa_mensal,
    prazo_meses: validation.value.prazo_meses,
  };
}

function useInitialSimulation(
  run: (draft: Draft) => Promise<void>,
  draft: Draft,
) {
  useEffect(() => {
    void run(draft);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}

function InterestSimplePane({
  eduTab,
  setEduTab,
  openModal,
}: {
  readonly eduTab: EduTab;
  readonly setEduTab: (tab: EduTab) => void;
  readonly openModal: (tab: ModalTab) => void;
}) {
  const [draft, setDraft] = useState<Draft>(DEFAULT_DRAFT);
  const [state, setState] = useState<AsyncResult<JurosSimplesOut>>({
    status: "idle",
  });

  const simulate = useCallback(async (current: Draft) => {
    const payload = payloadFromDraft(current);
    if (!payload) return;
    setState({ status: "loading" });
    try {
      setState({ status: "ok", result: await simularJurosSimples(payload) });
    } catch (error) {
      setState({ status: "error", error: error as InterestApiError });
    }
  }, []);

  useInitialSimulation(simulate, draft);

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    void simulate(draft);
  }

  const result = state.status === "ok" ? state.result : null;
  const rows = result?.tables[AMORTIZACAO_KEY] ?? [];
  const summary = result?.summary;
  const kpis: readonly KpiItem[] = [
    {
      label: "Principal (PV)",
      value: summary ? formatBRL(summary.principal) : "...",
    },
    {
      label: "Taxa mensal",
      value: summary ? formatRatePct(summary.taxa_mensal) : "...",
    },
    {
      label: "Juros totais",
      value: summary ? formatBRL(summary.juros_totais) : "...",
    },
    {
      label: "Montante final",
      value: summary ? formatBRL(summary.montante_final) : "...",
      delta: "resultado oficial da API",
      highlight: true,
    },
  ];

  return (
    <CockpitGrid>
      <CockpitInputPanel
        icon="📐"
        title="Juros Simples"
        subtitle="J = P × i × n"
      >
        <form onSubmit={submit} className="contents">
          <InterestFormFields draft={draft} setDraft={setDraft} />
          <CockpitButton busy={state.status === "loading"}>
            ▶ Calcular
          </CockpitButton>
          {state.status === "error" ? <ApiError error={state.error} /> : null}
        </form>
      </CockpitInputPanel>
      <CenterPanel
        kpis={kpis}
        title="EVOLUÇÃO DO SALDO"
        legend={<LegendItem color="#00d4c8">Simples</LegendItem>}
        chart={
          <InterestCockpitChart
            chart={result?.charts[0] ?? null}
            context="Juros simples"
          />
        }
        insight={
          summary ? (
            <>
              A <strong>{formatBRL(summary.principal)}</strong> a{" "}
              <strong>{formatRatePct(summary.taxa_mensal)} a.m.</strong> por{" "}
              <strong>{summary.prazo_meses} meses</strong> gera{" "}
              <strong>{formatBRL(summary.juros_totais)}</strong> de juros
              simples.
            </>
          ) : (
            "Carregando simulação inicial com dados oficiais da API."
          )
        }
      />
      <EducationPanel
        tabs={EDU_TABS_STANDARD}
        active={eduTab}
        onChange={setEduTab}
      >
        {eduTab === "conceito" ? <SimpleConcept openModal={openModal} /> : null}
        {eduTab === "tabela" ? (
          <>
            <EduTitle>📋 Evolução mês a mês</EduTitle>
            <InterestSimpleTable rows={rows} />
          </>
        ) : null}
        {eduTab === "cuidados" ? (
          <InterestCautions openModal={openModal} />
        ) : null}
      </EducationPanel>
    </CockpitGrid>
  );
}

function InterestCompoundPane({
  eduTab,
  setEduTab,
  openModal,
}: {
  readonly eduTab: EduTab;
  readonly setEduTab: (tab: EduTab) => void;
  readonly openModal: (tab: ModalTab) => void;
}) {
  const [draft, setDraft] = useState<Draft>(DEFAULT_DRAFT);
  const [state, setState] = useState<AsyncResult<JurosCompostosOut>>({
    status: "idle",
  });

  const simulate = useCallback(async (current: Draft) => {
    const payload = payloadFromDraft(current);
    if (!payload) return;
    setState({ status: "loading" });
    try {
      setState({ status: "ok", result: await simularJurosCompostos(payload) });
    } catch (error) {
      setState({ status: "error", error: error as InterestApiError });
    }
  }, []);

  useInitialSimulation(simulate, draft);

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    void simulate(draft);
  }

  const result = state.status === "ok" ? state.result : null;
  const rows = result?.tables[AMORTIZACAO_KEY] ?? [];
  const summary = result?.summary;
  const kpis: readonly KpiItem[] = [
    {
      label: "Principal (PV)",
      value: summary ? formatBRL(summary.principal) : "...",
    },
    {
      label: "Taxa mensal",
      value: summary ? formatRatePct(summary.taxa_mensal) : "...",
    },
    {
      label: "Juros totais",
      value: summary ? formatBRL(summary.juros_totais) : "...",
    },
    {
      label: "Montante final",
      value: summary ? formatBRL(summary.montante_final) : "...",
      delta: "capitalização composta",
      highlight: true,
    },
  ];

  return (
    <CockpitGrid>
      <CockpitInputPanel
        icon="📐"
        title="Juros Compostos"
        subtitle="M = P × (1 + i)ⁿ"
      >
        <form onSubmit={submit} className="contents">
          <InterestFormFields draft={draft} setDraft={setDraft} />
          <CockpitButton busy={state.status === "loading"}>
            ▶ Calcular
          </CockpitButton>
          {state.status === "error" ? <ApiError error={state.error} /> : null}
        </form>
      </CockpitInputPanel>
      <CenterPanel
        kpis={kpis}
        title="CRESCIMENTO COMPOSTO"
        legend={<LegendItem color="#f59e0b">Composto</LegendItem>}
        chart={
          <InterestCockpitChart
            chart={result?.charts[0] ?? null}
            context="Juros compostos"
          />
        }
        insight={
          summary ? (
            <>
              No composto, <strong>{formatBRL(summary.principal)}</strong> por{" "}
              <strong>{summary.prazo_meses} meses</strong> chega a{" "}
              <strong>{formatBRL(summary.montante_final)}</strong>, com juros de{" "}
              <strong>{formatBRL(summary.juros_totais)}</strong>.
            </>
          ) : (
            "Carregando crescimento composto com retorno oficial da API."
          )
        }
      />
      <EducationPanel
        tabs={EDU_TABS_STANDARD}
        active={eduTab}
        onChange={setEduTab}
      >
        {eduTab === "conceito" ? (
          <CompoundConcept openModal={openModal} />
        ) : null}
        {eduTab === "tabela" ? (
          <>
            <EduTitle>📋 Evolução mês a mês</EduTitle>
            <InterestCompoundTable rows={rows} />
          </>
        ) : null}
        {eduTab === "cuidados" ? (
          <CompoundCautions openModal={openModal} />
        ) : null}
      </EducationPanel>
    </CockpitGrid>
  );
}

function InterestComparePane({
  eduTab,
  setEduTab,
  openModal,
}: {
  readonly eduTab: EduTab;
  readonly setEduTab: (tab: EduTab) => void;
  readonly openModal: (tab: ModalTab) => void;
}) {
  const [draft, setDraft] = useState<Draft>(DEFAULT_DRAFT);
  const [state, setState] = useState<AsyncResult<CompararJurosOut>>({
    status: "idle",
  });

  const simulate = useCallback(async (current: Draft) => {
    const payload = payloadFromDraft(current);
    if (!payload) return;
    setState({ status: "loading" });
    try {
      setState({ status: "ok", result: await compararJuros(payload) });
    } catch (error) {
      setState({ status: "error", error: error as InterestApiError });
    }
  }, []);

  useInitialSimulation(simulate, draft);

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    void simulate(draft);
  }

  const result = state.status === "ok" ? state.result : null;
  const summary = result?.summary;
  const kpis: readonly KpiItem[] = [
    {
      label: "Simples — montante",
      value: summary ? formatBRL(summary.montante_simples) : "...",
    },
    {
      label: "Composto — montante",
      value: summary ? formatBRL(summary.montante_composto) : "...",
      highlight: true,
    },
    {
      label: "Diferença",
      value: summary ? formatBRL(summary.diferenca) : "...",
    },
    {
      label: "Razão",
      value: summary
        ? `${Number(summary.razao).toLocaleString("pt-BR", {
            maximumFractionDigits: 4,
          })}x`
        : "...",
    },
  ];

  return (
    <CockpitGrid>
      <CockpitInputPanel
        icon="⚖️"
        title="Comparar Regimes"
        subtitle="Simples × Composto"
      >
        <form onSubmit={submit} className="contents">
          <InterestFormFields draft={draft} setDraft={setDraft} max={240} />
          <CockpitButton busy={state.status === "loading"}>
            ▶ Comparar
          </CockpitButton>
          {state.status === "error" ? <ApiError error={state.error} /> : null}
        </form>
      </CockpitInputPanel>
      <CenterPanel
        kpis={kpis}
        title="CRESCIMENTOS SIMPLES × COMPOSTO"
        legend={
          <>
            <LegendItem color="#00d4c8">Simples</LegendItem>
            <LegendItem color="#f59e0b">Composto</LegendItem>
          </>
        }
        chart={
          <InterestCockpitChart
            chart={result?.charts[0] ?? null}
            context="Comparação de regimes"
          />
        }
        insight={
          summary ? (
            <>
              Diferença de <strong>{formatBRL(summary.diferenca)}</strong> entre
              os regimes em <strong>{summary.prazo_meses} meses</strong>.
            </>
          ) : (
            "Carregando comparação oficial entre simples e composto."
          )
        }
      />
      <EducationPanel
        tabs={EDU_TABS_COMPARE}
        active={eduTab}
        onChange={setEduTab}
      >
        <EduTitle>📊 Quando divergem</EduTitle>
        <EduText>
          Para um período, os regimes tendem a ficar próximos. A partir de
          prazos maiores, o composto acumula juros sobre juros e se distancia.
        </EduText>
        <EduFormula>
          Composto &gt; Simples quando o prazo amplia a capitalização
        </EduFormula>
        <EduText>
          Em dívidas, isso ajuda a entender por que atrasos longos custam caro.
          Em investimentos, mostra por que tempo e reinvestimento importam.
        </EduText>
        <MoreButton onClick={() => openModal("comparacao")}>
          📚 Leitura completa →
        </MoreButton>
      </EducationPanel>
    </CockpitGrid>
  );
}

function InterestFormFields({
  draft,
  setDraft,
  max = 360,
}: {
  readonly draft: Draft;
  readonly setDraft: (draft: Draft) => void;
  readonly max?: number;
}) {
  return (
    <>
      <CockpitField
        id="interest-principal"
        label="Principal (PV)"
        value={draft.principal}
        onChange={(principal) => setDraft({ ...draft, principal })}
        unit="R$"
        hint="Valor presente (PV)"
      />
      <CockpitField
        id="interest-taxa"
        label="Taxa mensal"
        value={draft.taxaMensalPct}
        onChange={(taxaMensalPct) => setDraft({ ...draft, taxaMensalPct })}
        type="number"
        step="0.1"
        min="0.01"
        unit="%"
        hint="Ex.: 1,00 = 1% a.m."
      />
      <CockpitSlider
        id="interest-prazo"
        label="Prazo (meses)"
        value={draft.prazoMeses}
        min={1}
        max={max}
        hint={`1 a ${max} meses`}
        onChange={(prazoMeses) => setDraft({ ...draft, prazoMeses })}
      />
    </>
  );
}

function SimpleConcept({
  openModal,
}: {
  readonly openModal: (tab: ModalTab) => void;
}) {
  return (
    <>
      <EduTitle>📖 Juros simples — em uma frase</EduTitle>
      <EduText>
        A taxa incide <strong>sempre sobre o principal original</strong>. O
        crescimento é <strong>linear</strong>: a cada mês entra a mesma quantia.
      </EduText>
      <EduFormula>M = P × (1 + i × n)</EduFormula>
      <EduText>
        <strong>P</strong> = Principal · <strong>i</strong> = Taxa ·{" "}
        <strong>n</strong> = Períodos · <strong>M</strong> = Montante
      </EduText>
      <EduTitle>🔢 Caso de referência</EduTitle>
      <EduText>
        R$1.000 · 1% a.m. · 12 meses → juros <strong>R$120,00</strong> →
        montante <strong>R$1.120,00</strong>.
      </EduText>
      <MoreButton onClick={() => openModal("js")}>
        📚 Aprofundar leitura →
      </MoreButton>
    </>
  );
}

function CompoundConcept({
  openModal,
}: {
  readonly openModal: (tab: ModalTab) => void;
}) {
  return (
    <>
      <EduTitle>📖 Juros sobre juros</EduTitle>
      <EduText>
        A taxa incide sobre o saldo acumulado. O crescimento deixa de ser linear
        e passa a ganhar força com o tempo.
      </EduText>
      <EduFormula>M = P × (1 + i)ⁿ</EduFormula>
      <EduTitle>🔢 Caso de referência</EduTitle>
      <EduText>
        R$1.000 · 1% a.m. · 12 meses → <strong>R$1.126,83</strong>, contra
        R$1.120,00 no simples.
      </EduText>
      <MoreButton onClick={() => openModal("jc")}>
        📚 Aportes e aprofundamento →
      </MoreButton>
    </>
  );
}

function InterestCautions({
  openModal,
}: {
  readonly openModal: (tab: ModalTab) => void;
}) {
  return (
    <>
      <EduTitle>⚠ Atenção</EduTitle>
      <CautionItem icon="🔴">
        <strong>Contratos reais</strong> quase sempre usam regime composto.
      </CautionItem>
      <CautionItem icon="🟡">
        <strong>Prazos longos</strong> ampliam a distância entre os regimes.
      </CautionItem>
      <CautionItem icon="🔵">
        <strong>Produto educacional.</strong> Não substitui contrato real.
      </CautionItem>
      <MoreButton onClick={() => openModal("cuidados")}>
        📋 Ver todos os cuidados →
      </MoreButton>
    </>
  );
}

function CompoundCautions({
  openModal,
}: {
  readonly openModal: (tab: ModalTab) => void;
}) {
  return (
    <>
      <EduTitle>⚠ Cuidados</EduTitle>
      <CautionItem icon="🔴">
        <strong>Dívida longa:</strong> pagar antes reduz a capitalização futura.
      </CautionItem>
      <CautionItem icon="🟡">
        Verifique se a taxa é mensal, anual ou diária antes de comparar.
      </CautionItem>
      <MoreButton onClick={() => openModal("comparacao")}>
        ⚖️ Ver comparação simples × composto →
      </MoreButton>
    </>
  );
}

function ApiError({ error }: { readonly error: InterestApiError }) {
  return <p className="cockpit-error">{describeApiError(error)}</p>;
}

function InterestEducationModal({
  open,
  active,
  setActive,
  onClose,
}: {
  readonly open: boolean;
  readonly active: ModalTab;
  readonly setActive: (tab: ModalTab) => void;
  readonly onClose: () => void;
}) {
  const body = useMemo(() => {
    switch (active) {
      case "js":
        return (
          <>
            <ModalHeading>Juros simples</ModalHeading>
            <ModalText>
              Juros simples aplicam a taxa sempre sobre o principal original. A
              leitura é direta: o acréscimo por período é constante.
            </ModalText>
            <ModalFormula>J = P × i × n · M = P + J</ModalFormula>
            <ModalExample>
              R$1.000 · 1% a.m. · 12 meses → R$120,00 de juros → R$1.120,00.
            </ModalExample>
            <ModalDisclaimer />
          </>
        );
      case "jc":
        return (
          <>
            <ModalHeading>Juros compostos</ModalHeading>
            <ModalText>
              No regime composto, a taxa incide sobre o saldo acumulado. Por
              isso a curva acelera e o prazo passa a ser decisivo.
            </ModalText>
            <ModalFormula>M = P × (1 + i)ⁿ</ModalFormula>
            <ModalExample>
              R$1.000 · 1% a.m. · 12 meses → R$1.126,83.
            </ModalExample>
            <ModalDisclaimer />
          </>
        );
      case "comparacao":
        return (
          <>
            <ModalHeading>Comparação</ModalHeading>
            <ModalText>
              Simples e composto podem parecer próximos no início. A diferença
              aparece quando o prazo cresce e o composto reinveste os juros.
            </ModalText>
            <ModalFormula>
              Composto tende a superar simples quando n &gt; 1
            </ModalFormula>
            <ModalExample>
              Use a aba Comparar para ver a divergência com os mesmos
              parâmetros, sempre com retorno oficial do backend.
            </ModalExample>
            <ModalDisclaimer />
          </>
        );
      case "aportes":
        return (
          <>
            <ModalHeading>Aportes</ModalHeading>
            <ModalText>
              Aporte não é juro: é dinheiro novo entrando no saldo. A leitura
              correta separa principal, valores aportados e remuneração.
            </ModalText>
            <ModalFormula>
              Saldo final = principal + aportes + juros
            </ModalFormula>
            <ModalExample>
              Quando houver aportes, a API retorna total aportado, total
              investido e juros para não misturar origem dos valores.
            </ModalExample>
            <ModalDisclaimer />
          </>
        );
      case "cuidados":
        return (
          <>
            <ModalHeading>Cuidados</ModalHeading>
            <CautionItem icon="🔴">
              Contratos reais geralmente usam composto, tarifas e regras
              próprias de arredondamento.
            </CautionItem>
            <CautionItem icon="🟡">
              Compare taxas na mesma base: mensal com mensal, anual com anual.
            </CautionItem>
            <CautionItem icon="🟡">
              Prazos longos amplificam diferenças pequenas de taxa.
            </CautionItem>
            <CautionItem icon="🔵">
              O simulador é educacional e não substitui análise profissional.
            </CautionItem>
            <ModalDisclaimer />
          </>
        );
      default:
        return null;
    }
  }, [active]);

  return (
    <CockpitModal
      open={open}
      tag="⚡ MÓDULO · JUROS"
      title="Aprenda mais sobre juros"
      tabs={MODAL_TABS}
      active={active}
      onTabChange={setActive}
      onClose={onClose}
    >
      {body}
    </CockpitModal>
  );
}
