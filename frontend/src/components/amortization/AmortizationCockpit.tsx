"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import { validateAmortizationDraft } from "@/components/amortization/formValidation";
import {
  AmortizationCockpitTable,
  AmortizationCompareChart,
  AmortizationCompositionChart,
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
import { describeApiError } from "@/lib/api/problem";
import { formatBRL, formatRatePct } from "@/lib/money";
import {
  compararAmortizacao,
  simularPrice,
  simularSac,
  type AmortizationApiError,
} from "@/services/amortization/amortizationService";
import type {
  CompareAmortizationOut,
  PriceOut,
  SacOut,
} from "@/types/amortization";
import { AMORTIZATION_TABLE_KEY } from "@/types/amortization";

type AmortizationTab = "price" | "sac" | "comparar";
type EduTab = "tabela" | "glossario" | "cuidados" | "price-sac" | "analise";
type ModalTab =
  | "intro"
  | "price"
  | "sac"
  | "price-sac"
  | "glossario"
  | "cuidados";

interface Draft {
  readonly principal: string;
  readonly taxaPeriodoPct: string;
  readonly nPeriodos: number;
}

type AsyncResult<T> =
  | { readonly status: "idle" | "loading" }
  | { readonly status: "ok"; readonly result: T }
  | { readonly status: "error"; readonly error: AmortizationApiError };

const AMORTIZATION_TABS: readonly SubTab<AmortizationTab>[] = [
  { id: "price", label: "PRICE" },
  { id: "sac", label: "SAC" },
  { id: "comparar", label: "Comparar" },
];

const PRICE_EDU_TABS: readonly SubTab<EduTab>[] = [
  { id: "tabela", label: "Tabela" },
  { id: "glossario", label: "Glossário" },
  { id: "cuidados", label: "Cuidados" },
];

const SAC_EDU_TABS: readonly SubTab<EduTab>[] = [
  { id: "tabela", label: "Tabela" },
  { id: "price-sac", label: "SAC × PRICE" },
];

const COMPARE_EDU_TABS: readonly SubTab<EduTab>[] = [
  { id: "analise", label: "Análise" },
  { id: "tabela", label: "Tabela" },
  { id: "cuidados", label: "Cuidados" },
];

const MODAL_TABS: readonly SubTab<ModalTab>[] = [
  { id: "intro", label: "O que a tabela mostra" },
  { id: "price", label: "PRICE" },
  { id: "sac", label: "SAC" },
  { id: "price-sac", label: "PRICE × SAC" },
  { id: "glossario", label: "Glossário" },
  { id: "cuidados", label: "Cuidados" },
];

const DEFAULT_DRAFT: Draft = {
  principal: "100.000,00",
  taxaPeriodoPct: "1.0",
  nPeriodos: 12,
};

export function AmortizationCockpit() {
  const [active, setActive] = useState<AmortizationTab>("price");
  const [eduTab, setEduTab] = useState<EduTab>("tabela");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<ModalTab>("intro");

  useEffect(() => {
    setEduTab(active === "comparar" ? "analise" : "tabela");
  }, [active]);

  function openModal(tab: ModalTab): void {
    setModalTab(tab);
    setModalOpen(true);
  }

  return (
    <>
      <div data-testid="amortizacao-cockpit" className="contents">
        <CockpitSubTabs
          tabs={AMORTIZATION_TABS}
          active={active}
          onChange={setActive}
          label="Sistemas de amortização"
        />
        {active === "price" ? (
          <PricePane
            eduTab={eduTab}
            setEduTab={setEduTab}
            openModal={openModal}
          />
        ) : null}
        {active === "sac" ? (
          <SacPane
            eduTab={eduTab}
            setEduTab={setEduTab}
            openModal={openModal}
          />
        ) : null}
        {active === "comparar" ? (
          <ComparePane
            eduTab={eduTab}
            setEduTab={setEduTab}
            openModal={openModal}
          />
        ) : null}
      </div>
      <AmortizationEducationModal
        open={modalOpen}
        active={modalTab}
        setActive={setModalTab}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}

function payloadFromDraft(draft: Draft) {
  const validation = validateAmortizationDraft({
    principal: draft.principal,
    taxaPeriodoPct: draft.taxaPeriodoPct,
    nPeriodos: String(draft.nPeriodos),
  });
  if (!validation.ok || validation.value === null) return null;
  return validation.value;
}

function useInitialSimulation(
  run: (draft: Draft) => Promise<void>,
  draft: Draft,
) {
  useEffect(() => {
    void run(draft);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}

function PricePane({
  eduTab,
  setEduTab,
  openModal,
}: {
  readonly eduTab: EduTab;
  readonly setEduTab: (tab: EduTab) => void;
  readonly openModal: (tab: ModalTab) => void;
}) {
  const [draft, setDraft] = useState<Draft>(DEFAULT_DRAFT);
  const [state, setState] = useState<AsyncResult<PriceOut>>({ status: "idle" });

  const simulate = useCallback(async (current: Draft) => {
    const payload = payloadFromDraft(current);
    if (!payload) return;
    setState({ status: "loading" });
    try {
      setState({ status: "ok", result: await simularPrice(payload) });
    } catch (error) {
      setState({ status: "error", error: error as AmortizationApiError });
    }
  }, []);

  useInitialSimulation(simulate, draft);

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    void simulate(draft);
  }

  const result = state.status === "ok" ? state.result : null;
  const rows = result?.tables[AMORTIZATION_TABLE_KEY] ?? [];
  const summary = result?.summary;
  const kpis: readonly KpiItem[] = [
    {
      label: "Parcela fixa",
      value: summary ? formatBRL(summary.parcela) : "...",
    },
    {
      label: "Total pago",
      value: summary ? formatBRL(summary.total_pago) : "...",
    },
    {
      label: "Total juros",
      value: summary ? formatBRL(summary.total_juros) : "...",
    },
    {
      label: "Taxa do período",
      value: summary ? formatRatePct(summary.taxa_periodo) : "...",
      highlight: true,
    },
  ];

  return (
    <CockpitGrid>
      <CockpitInputPanel
        icon="🏦"
        title="Sistema PRICE"
        subtitle="Parcela fixa"
      >
        <form onSubmit={submit} className="contents">
          <AmortizationFields draft={draft} setDraft={setDraft} />
          <CockpitButton busy={state.status === "loading"}>
            ▶ Calcular PRICE
          </CockpitButton>
          {state.status === "error" ? <ApiError error={state.error} /> : null}
        </form>
      </CockpitInputPanel>
      <CenterPanel
        kpis={kpis}
        title="COMPOSIÇÃO DA PARCELA — PRICE"
        legend={
          <>
            <LegendItem color="#00d4c8">Amortização</LegendItem>
            <LegendItem color="#f43f5e">Juros</LegendItem>
          </>
        }
        chart={<AmortizationCompositionChart rows={rows} context="PRICE" />}
        insight={
          summary ? (
            <>
              PMT fixo de <strong>{formatBRL(summary.parcela)}</strong> por{" "}
              <strong>{summary.n_periodos} períodos</strong>. Total pago:{" "}
              <strong>{formatBRL(summary.total_pago)}</strong>. Juros pagos:{" "}
              <strong>{formatBRL(summary.total_juros)}</strong>.
            </>
          ) : (
            "Carregando tabela PRICE com dados oficiais da API."
          )
        }
      />
      <EducationPanel
        tabs={PRICE_EDU_TABS}
        active={eduTab}
        onChange={setEduTab}
      >
        {eduTab === "tabela" ? (
          <>
            <EduTitle>📋 Tabela PRICE</EduTitle>
            <AmortizationCockpitTable rows={rows} />
            <MoreButton onClick={() => openModal("price")}>
              📖 Entender a tabela →
            </MoreButton>
          </>
        ) : null}
        {eduTab === "glossario" ? (
          <PriceGlossary openModal={openModal} />
        ) : null}
        {eduTab === "cuidados" ? <PriceCautions openModal={openModal} /> : null}
      </EducationPanel>
    </CockpitGrid>
  );
}

function SacPane({
  eduTab,
  setEduTab,
  openModal,
}: {
  readonly eduTab: EduTab;
  readonly setEduTab: (tab: EduTab) => void;
  readonly openModal: (tab: ModalTab) => void;
}) {
  const [draft, setDraft] = useState<Draft>(DEFAULT_DRAFT);
  const [state, setState] = useState<AsyncResult<SacOut>>({ status: "idle" });

  const simulate = useCallback(async (current: Draft) => {
    const payload = payloadFromDraft(current);
    if (!payload) return;
    setState({ status: "loading" });
    try {
      setState({ status: "ok", result: await simularSac(payload) });
    } catch (error) {
      setState({ status: "error", error: error as AmortizationApiError });
    }
  }, []);

  useInitialSimulation(simulate, draft);

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    void simulate(draft);
  }

  const result = state.status === "ok" ? state.result : null;
  const rows = result?.tables[AMORTIZATION_TABLE_KEY] ?? [];
  const summary = result?.summary;
  const kpis: readonly KpiItem[] = [
    {
      label: "1ª parcela",
      value: summary ? formatBRL(summary.parcela_inicial) : "...",
    },
    {
      label: "Última parcela",
      value: summary ? formatBRL(summary.parcela_final) : "...",
    },
    {
      label: "Total pago",
      value: summary ? formatBRL(summary.total_pago) : "...",
    },
    {
      label: "Total juros",
      value: summary ? formatBRL(summary.total_juros) : "...",
      highlight: true,
    },
  ];

  return (
    <CockpitGrid>
      <CockpitInputPanel
        icon="📉"
        title="Sistema SAC"
        subtitle="Amortização constante"
      >
        <form onSubmit={submit} className="contents">
          <AmortizationFields draft={draft} setDraft={setDraft} />
          <CockpitButton busy={state.status === "loading"}>
            ▶ Calcular SAC
          </CockpitButton>
          {state.status === "error" ? <ApiError error={state.error} /> : null}
        </form>
      </CockpitInputPanel>
      <CenterPanel
        kpis={kpis}
        title="EVOLUÇÃO DAS PARCELAS SAC"
        legend={
          <>
            <LegendItem color="#f59e0b">Parcela</LegendItem>
            <LegendItem color="#f43f5e">Juros</LegendItem>
          </>
        }
        chart={
          <AmortizationCompositionChart
            rows={rows}
            context="SAC"
            mode="installments"
          />
        }
        insight={
          summary ? (
            <>
              1ª parcela <strong>{formatBRL(summary.parcela_inicial)}</strong>,
              última <strong>{formatBRL(summary.parcela_final)}</strong>. Total
              de juros: <strong>{formatBRL(summary.total_juros)}</strong>.
            </>
          ) : (
            "Carregando tabela SAC com dados oficiais da API."
          )
        }
      />
      <EducationPanel tabs={SAC_EDU_TABS} active={eduTab} onChange={setEduTab}>
        {eduTab === "tabela" ? (
          <>
            <EduTitle>📋 Tabela SAC</EduTitle>
            <AmortizationCockpitTable rows={rows} />
            <MoreButton onClick={() => openModal("sac")}>
              📖 Entender o SAC →
            </MoreButton>
          </>
        ) : null}
        {eduTab === "price-sac" ? <SacVsPrice openModal={openModal} /> : null}
      </EducationPanel>
    </CockpitGrid>
  );
}

function ComparePane({
  eduTab,
  setEduTab,
  openModal,
}: {
  readonly eduTab: EduTab;
  readonly setEduTab: (tab: EduTab) => void;
  readonly openModal: (tab: ModalTab) => void;
}) {
  const [draft, setDraft] = useState<Draft>(DEFAULT_DRAFT);
  const [state, setState] = useState<AsyncResult<CompareAmortizationOut>>({
    status: "idle",
  });

  const simulate = useCallback(async (current: Draft) => {
    const payload = payloadFromDraft(current);
    if (!payload) return;
    setState({ status: "loading" });
    try {
      setState({ status: "ok", result: await compararAmortizacao(payload) });
    } catch (error) {
      setState({ status: "error", error: error as AmortizationApiError });
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
      label: "PRICE — PMT",
      value: summary ? formatBRL(summary.price.parcela) : "...",
    },
    {
      label: "SAC — 1ª parcela",
      value: summary ? formatBRL(summary.sac.parcela_inicial) : "...",
      highlight: true,
    },
    {
      label: "Juros PRICE",
      value: summary ? formatBRL(summary.price.total_juros) : "...",
    },
    {
      label: "Juros SAC",
      value: summary ? formatBRL(summary.sac.total_juros) : "...",
    },
  ];

  return (
    <CockpitGrid>
      <CockpitInputPanel
        icon="⚖️"
        title="Comparar PRICE × SAC"
        subtitle="Mesmos parâmetros, métodos diferentes"
      >
        <form onSubmit={submit} className="contents">
          <AmortizationFields draft={draft} setDraft={setDraft} />
          <CockpitButton busy={state.status === "loading"}>
            ▶ Comparar
          </CockpitButton>
          {state.status === "error" ? <ApiError error={state.error} /> : null}
        </form>
      </CockpitInputPanel>
      <CenterPanel
        kpis={kpis}
        title="EVOLUÇÃO DAS PARCELAS — PRICE × SAC"
        legend={
          <>
            <LegendItem color="#00d4c8">PRICE</LegendItem>
            <LegendItem color="#f59e0b">SAC</LegendItem>
          </>
        }
        chart={<AmortizationCompareChart chart={result?.charts[0] ?? null} />}
        insight={
          summary ? (
            <>
              Menor total de juros neste cenário:{" "}
              <strong>{summary.menor_total_juros}</strong>. Diferença de juros:{" "}
              <strong>{formatBRL(summary.diferenca_juros)}</strong>.
            </>
          ) : (
            "Carregando comparação oficial entre PRICE e SAC."
          )
        }
      />
      <EducationPanel
        tabs={COMPARE_EDU_TABS}
        active={eduTab}
        onChange={setEduTab}
      >
        {eduTab === "analise" ? (
          <CompareAnalysis openModal={openModal} />
        ) : null}
        {eduTab === "tabela" ? (
          <>
            <EduTitle>📋 PRICE e SAC lado a lado</EduTitle>
            <AmortizationCockpitTable rows={result?.tables.price ?? []} />
            <AmortizationCockpitTable rows={result?.tables.sac ?? []} />
          </>
        ) : null}
        {eduTab === "cuidados" ? (
          <CompareCautions openModal={openModal} />
        ) : null}
      </EducationPanel>
    </CockpitGrid>
  );
}

function AmortizationFields({
  draft,
  setDraft,
}: {
  readonly draft: Draft;
  readonly setDraft: (draft: Draft) => void;
}) {
  return (
    <>
      <CockpitField
        id="amort-principal"
        label="Principal (BRL)"
        value={draft.principal}
        onChange={(principal) => setDraft({ ...draft, principal })}
        unit="R$"
        hint="Valor presente financiado"
      />
      <CockpitField
        id="amort-taxa"
        label="Taxa do período"
        value={draft.taxaPeriodoPct}
        onChange={(taxaPeriodoPct) => setDraft({ ...draft, taxaPeriodoPct })}
        type="number"
        step="0.1"
        min="0.01"
        unit="%"
        hint="Ex.: 1,00 = 1% por período"
      />
      <CockpitSlider
        id="amort-prazo"
        label="Prazo (períodos)"
        value={draft.nPeriodos}
        min={1}
        max={360}
        hint="1 a 360 períodos"
        onChange={(nPeriodos) => setDraft({ ...draft, nPeriodos })}
      />
    </>
  );
}

function PriceGlossary({
  openModal,
}: {
  readonly openModal: (tab: ModalTab) => void;
}) {
  return (
    <>
      <EduTitle>📚 Termos essenciais</EduTitle>
      <EduText>
        <strong>PRICE</strong>: sistema de parcela constante.
      </EduText>
      <EduText>
        <strong>PMT</strong>: prestação periódica. Caso de referência:
        R$8.884,88.
      </EduText>
      <EduText>
        <strong>Saldo devedor</strong>: principal ainda não amortizado.
      </EduText>
      <EduText>
        <strong>Total de juros</strong>: soma do custo financeiro dos períodos.
      </EduText>
      <MoreButton onClick={() => openModal("glossario")}>
        📖 Glossário completo →
      </MoreButton>
    </>
  );
}

function PriceCautions({
  openModal,
}: {
  readonly openModal: (tab: ModalTab) => void;
}) {
  return (
    <>
      <EduTitle>⚠ Cuidados PRICE</EduTitle>
      <CautionItem icon="🔴">
        <strong>Amortização invertida:</strong> no início, a parcela contém mais
        juros e menos amortização.
      </CautionItem>
      <CautionItem icon="🟡">
        <strong>Parcela não é custo total.</strong> Compare sempre total pago e
        total de juros.
      </CautionItem>
      <MoreButton onClick={() => openModal("cuidados")}>
        📋 Ver todos os cuidados →
      </MoreButton>
    </>
  );
}

function SacVsPrice({
  openModal,
}: {
  readonly openModal: (tab: ModalTab) => void;
}) {
  return (
    <>
      <EduTitle>⚖️ SAC vs PRICE</EduTitle>
      <EduText>
        <strong>SAC</strong> mantém amortização constante; por isso a parcela
        começa maior e cai ao longo do tempo.
      </EduText>
      <EduText>
        Caso de referência: SAC começa em R$9.333,33 e termina em R$8.416,70.
      </EduText>
      <EduText>
        O trade-off é fluxo de caixa inicial contra custo total de juros.
      </EduText>
      <MoreButton onClick={() => openModal("price-sac")}>
        📊 Comparar PRICE × SAC →
      </MoreButton>
    </>
  );
}

function CompareAnalysis({
  openModal,
}: {
  readonly openModal: (tab: ModalTab) => void;
}) {
  return (
    <>
      <EduTitle>📊 Leitura comparativa</EduTitle>
      <EduText>
        PRICE privilegia previsibilidade da parcela. SAC tende a reduzir juros
        totais, mas exige parcela inicial mais alta.
      </EduText>
      <EduFormula>mesmo principal · mesma taxa · mesmo prazo</EduFormula>
      <MoreButton onClick={() => openModal("price-sac")}>
        📚 Entender a comparação →
      </MoreButton>
    </>
  );
}

function CompareCautions({
  openModal,
}: {
  readonly openModal: (tab: ModalTab) => void;
}) {
  return (
    <>
      <EduTitle>⚠ Cuidados</EduTitle>
      <CautionItem icon="🔴">
        A menor soma de juros nem sempre cabe no orçamento mensal.
      </CautionItem>
      <CautionItem icon="🟡">
        Contratos reais podem incluir seguros, tarifas e CET.
      </CautionItem>
      <MoreButton onClick={() => openModal("cuidados")}>
        📋 Ver cuidados →
      </MoreButton>
    </>
  );
}

function ApiError({ error }: { readonly error: AmortizationApiError }) {
  return <p className="cockpit-error">{describeApiError(error)}</p>;
}

function AmortizationEducationModal({
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
      case "intro":
        return (
          <>
            <ModalHeading>O que a tabela mostra</ModalHeading>
            <ModalText>
              Cada linha apresenta período, parcela, juros, amortização e saldo
              devedor. A regra de fechamento é o saldo final chegar a zero.
            </ModalText>
            <ModalExample>
              Principal R$100.000 · 1% a.m. · 12 períodos → 12 linhas de
              evolução.
            </ModalExample>
            <ModalDisclaimer />
          </>
        );
      case "price":
        return (
          <>
            <ModalHeading>PRICE</ModalHeading>
            <ModalText>
              O sistema PRICE mantém parcela constante. A composição muda por
              dentro: juros caem e amortização cresce.
            </ModalText>
            <ModalFormula>
              PMT constante · juros sobre saldo devedor
            </ModalFormula>
            <ModalExample>
              R$100.000 · 1% a.m. · 12 períodos → parcela R$8.884,88, total de
              juros R$6.618,53.
            </ModalExample>
            <ModalDisclaimer />
          </>
        );
      case "sac":
        return (
          <>
            <ModalHeading>SAC</ModalHeading>
            <ModalText>
              No SAC, a amortização é constante. Como o saldo cai a cada
              período, os juros e as parcelas também caem.
            </ModalText>
            <ModalFormula>
              amortização constante · juros decrescentes
            </ModalFormula>
            <ModalExample>
              R$100.000 · 1% a.m. · 12 períodos → primeira parcela R$9.333,33,
              última R$8.416,70, juros R$6.500,00.
            </ModalExample>
            <ModalDisclaimer />
          </>
        );
      case "price-sac":
        return (
          <>
            <ModalHeading>PRICE × SAC</ModalHeading>
            <ModalText>
              PRICE facilita planejamento por parcela fixa. SAC costuma reduzir
              juros totais, mas começa com prestação mais alta.
            </ModalText>
            <ModalExample>
              Compare fluxo mensal, total pago e juros totais antes de escolher.
            </ModalExample>
            <ModalDisclaimer />
          </>
        );
      case "glossario":
        return (
          <>
            <ModalHeading>Glossário</ModalHeading>
            <ModalExample>
              Principal: valor financiado · Taxa por período: percentual sobre
              saldo · Parcela: juros + amortização · Juros: custo do período ·
              Amortização: redução do saldo · Saldo devedor: principal ainda em
              aberto · Total pago: soma das parcelas · Total de juros: soma dos
              juros · Saldo final: após última linha · Número de períodos:
              linhas da tabela.
            </ModalExample>
            <ModalDisclaimer />
          </>
        );
      case "cuidados":
        return (
          <>
            <ModalHeading>Cuidados</ModalHeading>
            <CautionItem icon="🔴">
              Simulação não substitui contrato, CET ou proposta formal.
            </CautionItem>
            <CautionItem icon="🟡">
              Parcela menor pode significar custo total maior.
            </CautionItem>
            <CautionItem icon="🟡">
              Liquidação antecipada depende das regras contratuais.
            </CautionItem>
            <CautionItem icon="🔵">
              Produto educacional, não consultoria financeira.
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
      tag="📊 MÓDULO · AMORTIZAÇÃO"
      title="Entenda a amortização"
      tabs={MODAL_TABS}
      active={active}
      onTabChange={setActive}
      onClose={onClose}
    >
      {body}
    </CockpitModal>
  );
}
