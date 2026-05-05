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
        <form onSubmit={submit} className="contents" noValidate>
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
        <form onSubmit={submit} className="contents" noValidate>
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
        <form onSubmit={submit} className="contents" noValidate>
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
          Para n = 1, simples e composto são iguais. Para n &gt; 1, o composto
          supera o simples — a diferença cresce de forma não-linear.
        </EduText>
        <EduFormula>Composto &gt; Simples (n &gt; 1)</EduFormula>
        <EduTitle>🔢 Caso de referência</EduTitle>
        <EduText>
          R$1.000 · 1% a.m. · 12 meses: simples R$1.120 vs composto R$1.126,83.
          Em prazos longos a diferença se torna muito relevante.
        </EduText>
        <EduText>
          Na dívida: pagar mais cedo reduz a capitalização. No investimento:
          manter mais tempo aumenta o efeito.
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
        A cada período, os juros incidem sobre o saldo acumulado. O crescimento
        é exponencial — não linear.
      </EduText>
      <EduFormula>M = P × (1 + i)ⁿ</EduFormula>
      <EduTitle>🔢 Caso de referência</EduTitle>
      <EduText>
        R$1.000 · 1% a.m. · 12 meses → montante <strong>R$1.126,83</strong> vs
        R$1.120,00 no simples. Diferença cresce com o prazo.
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
        <strong>Não confunda regimes.</strong> Contratos reais quase sempre usam
        juros compostos.
      </CautionItem>
      <CautionItem icon="🟡">
        <strong>Taxa por período importa.</strong> Compare sempre mensal com
        mensal, anual com anual.
      </CautionItem>
      <CautionItem icon="🟡">
        <strong>Prazos longos</strong> ampliam diferenças pequenas de taxa.
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
      <CautionItem icon="🔵">
        Use a comparação para entender ordem de grandeza, não para substituir
        contrato, CET ou assessoria.
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
            <ModalHeading>📖 Juros simples — em uma frase</ModalHeading>
            <ModalText>
              Juros simples são juros que incidem sempre sobre o{" "}
              <strong>valor inicial (o principal)</strong>. Mesmo passando o
              tempo, o cálculo de cada período ignora os juros já acumulados.
            </ModalText>
            <ModalText>
              Por isso o crescimento é <strong>linear</strong>: a cada mês entra
              a mesma quantia de juros. É como se você somasse parcelas iguais à
              sua dívida ou ao seu saldo, mês a mês.
            </ModalText>
            <ModalFormula>M = P × (1 + i × n)</ModalFormula>
            <ModalText>
              Os termos que aparecem nas telas são: <strong>principal</strong>{" "}
              (o valor inicial), <strong>taxa</strong> (o percentual cobrado por
              período), <strong>prazo</strong> (quantos períodos) e{" "}
              <strong>montante</strong> (o valor final).
            </ModalText>
            <ModalExample>
              <strong>Caso de referência JS-01:</strong>
              <br />
              Principal R$1.000,00 · Taxa 1% a.m. · Prazo 12 meses
              <br />
              Juros R$120,00 · Montante R$1.120,00
            </ModalExample>
            <ModalDisclaimer />
          </>
        );
      case "jc":
        return (
          <>
            <ModalHeading>📖 Juros compostos — em uma frase</ModalHeading>
            <ModalText>
              Juros compostos são juros que, a cada novo período, passam a
              incidir sobre o <strong>saldo já acumulado</strong> — e não apenas
              sobre o principal. Por isso costumam aparecer descritos como{" "}
              <strong>juros sobre juros</strong>.
            </ModalText>
            <ModalText>
              O efeito prático é que o crescimento não é mais linear: ele{" "}
              <strong>acelera ao longo do tempo</strong>, mesmo quando a taxa é
              a mesma dos juros simples.
            </ModalText>
            <ModalFormula>M = P × (1 + i)ⁿ</ModalFormula>
            <ModalExample>
              <strong>Caso de referência JC-01:</strong>
              <br />
              Principal R$1.000,00 · Taxa 1% a.m. · Prazo 12 meses
              <br />
              Montante R$1.126,83 · Diferença de R$6,83 contra o simples
            </ModalExample>
            <ModalText>
              Quanto maior o prazo, maior tende a ser a diferença entre os dois
              regimes, porque cada período parte de uma base acumulada maior.
            </ModalText>
            <ModalDisclaimer />
          </>
        );
      case "comparacao":
        return (
          <>
            <ModalHeading>
              ⚖️ Comparação — quando os compostos superam os simples
            </ModalHeading>
            <ModalText>
              Para n = 1, simples e composto chegam ao mesmo resultado. A partir
              de n &gt; 1, o composto supera o simples porque os juros de um
              período passam a compor a base do período seguinte.
            </ModalText>
            <ModalText>
              A divergência cresce de forma não-linear: em 12 meses ela pode
              parecer pequena; em 60 meses, 120 meses ou mais, tende a se tornar
              muito relevante.
            </ModalText>
            <ModalExample>
              <strong>Mesmas condições · Resultado diferente:</strong>
              <br />
              R$1.000 · 1% a.m. · 12 meses → simples R$1.120,00 · composto
              R$1.126,83.
            </ModalExample>
            <ModalText>
              Na dívida, pagar mais cedo reduz a capitalização futura. No
              investimento, manter mais tempo aumenta o efeito dos juros sobre
              juros.
            </ModalText>
            <ModalDisclaimer />
          </>
        );
      case "aportes":
        return (
          <>
            <ModalHeading>
              ➕ Aportes mensais — entrando dinheiro novo no caminho
            </ModalHeading>
            <ModalText>
              Aporte mensal é um valor que entra no saldo a cada período, somado
              ao principal. Ele aumenta a base sobre a qual o cálculo passa a
              incidir nos períodos seguintes.
            </ModalText>
            <ModalText>
              <strong>Aporte não é juro.</strong> Aporte é dinheiro novo que
              você coloca; juro é o resultado do cálculo aplicado sobre o saldo.
              As duas coisas aparecem em colunas separadas na tabela de
              evolução.
            </ModalText>
            <ModalText>
              Quando há aporte mensal, o saldo final passa a ser composto por
              três parcelas: o <strong>principal inicial</strong>, o{" "}
              <strong>total aportado</strong> ao longo do período e os{" "}
              <strong>juros acumulados</strong>.
            </ModalText>
            <ModalFormula>
              Saldo final = principal + aportes + juros
            </ModalFormula>
            <ModalExample>
              <strong>Efeito dos aportes:</strong>
              <br />
              Mais aportes aumentam o saldo e podem ampliar os juros futuros,
              mas o dinheiro novo não deve ser confundido com rentabilidade.
            </ModalExample>
            <ModalDisclaimer />
          </>
        );
      case "cuidados":
        return (
          <>
            <ModalHeading>⚠ Cuidados gerais — juros</ModalHeading>
            <CautionItem icon="🔴">
              <strong>Não confunda regimes.</strong> Contratos reais quase
              sempre usam juros compostos. Usar juros simples para estimar uma
              dívida real tende a subestimar o custo.
            </CautionItem>
            <CautionItem icon="🟡">
              <strong>Prazos longos amplificam tudo.</strong> Uma diferença de
              0,1% na taxa pode representar valores significativos em 10 ou 20
              anos.
            </CautionItem>
            <CautionItem icon="🟡">
              <strong>Base da taxa importa.</strong> Taxa mensal, anual e diária
              não são intercambiáveis sem conversão adequada.
            </CautionItem>
            <CautionItem icon="🔵">
              <strong>Produto educacional.</strong> A simulação ajuda a entender
              o mecanismo, mas não substitui contrato, CET ou análise
              profissional.
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
