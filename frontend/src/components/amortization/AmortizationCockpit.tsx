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
  AmortizationCompareTable,
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
        <form onSubmit={submit} className="contents" noValidate>
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
        <form onSubmit={submit} className="contents" noValidate>
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
        <form onSubmit={submit} className="contents" noValidate>
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
            <EduTitle>📋 Tabela Comparativa</EduTitle>
            <AmortizationCompareTable
              priceRows={result?.tables.price ?? []}
              sacRows={result?.tables.sac ?? []}
            />
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
        <strong>SAC</strong>: amortização constante, parcela inicial maior e
        queda gradual ao longo do prazo.
      </EduText>
      <EduText>
        <strong>Total juros</strong>: SAC tende a cobrar menos juros porque o
        saldo devedor cai mais rápido.
      </EduText>
      <EduText>
        <strong>Trade-off</strong>: fluxo de caixa inicial mais pesado contra
        custo total menor.
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
      <EduTitle>⚖️ PRICE × SAC — o essencial</EduTitle>
      <EduText>
        PRICE privilegia previsibilidade da parcela. SAC tende a reduzir juros
        totais, mas exige parcela inicial mais alta.
      </EduText>
      <EduTitle>🔢 Caso de referência</EduTitle>
      <EduText>
        R$100.000 · 1% a.m. · 12 períodos → PRICE parcela R$8.884,88 e juros
        R$6.618,53; SAC começa em R$9.333,33, termina em R$8.416,70 e soma
        R$6.500,00 de juros.
      </EduText>
      <MoreButton onClick={() => openModal("price-sac")}>
        📖 Leitura completa →
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
        A menor soma de juros nem sempre cabe no orçamento mensal no começo do
        contrato.
      </CautionItem>
      <CautionItem icon="🟡">
        Contratos reais podem incluir seguros, tarifas e CET.
      </CautionItem>
      <CautionItem icon="🔵">
        Compare fluxo mensal, total pago e saldo devedor antes de escolher um
        sistema.
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
            <ModalHeading>📋 Amortização — o que a tabela mostra</ModalHeading>
            <ModalText>
              Amortização é a parte da parcela que reduz o saldo devedor. A
              tabela mostra, período a período, quanto foi pago, quanto virou
              juros, quanto reduziu a dívida e qual saldo permanece.
            </ModalText>
            <ModalText>
              A leitura correta separa custo financeiro de devolução do
              principal. Juros remuneram o tempo e o risco; amortização devolve
              o valor financiado.
            </ModalText>
            <ModalText>
              Cada linha apresenta período, parcela, juros, amortização e saldo
              devedor, permitindo acompanhar a trajetória completa até o final.
            </ModalText>
            <ModalExample>
              <strong>Regra de fechamento da tabela:</strong>
              <br />
              Uma tabela consistente termina com saldo final igual a zero, ou
              residual apenas de arredondamento documentado.
            </ModalExample>
            <ModalText>
              Por isso a tabela deve ter uma linha por período real retornado
              pela API, sem truncar o prazo escolhido.
            </ModalText>
            <ModalDisclaimer />
          </>
        );
      case "price":
        return (
          <>
            <ModalHeading>🏦 PRICE — parcela constante</ModalHeading>
            <ModalText>
              O sistema PRICE mantém a parcela constante ao longo do contrato.
              Essa previsibilidade facilita planejamento, mas a composição da
              parcela muda por dentro.
            </ModalText>
            <ModalText>
              No início, como o saldo devedor ainda é alto, a parte de juros é
              maior e a amortização é menor. Com o tempo, os juros caem e a
              amortização aumenta.
            </ModalText>
            <ModalFormula>
              PMT constante · juros sobre saldo devedor
            </ModalFormula>
            <ModalExample>
              <strong>Caso de referência PR-01:</strong>
              <br />
              Principal R$100.000 · Taxa 1% a.m. · Prazo 12 períodos
              <br />
              Parcela R$8.884,88 · Total de juros R$6.618,53
            </ModalExample>
            <ModalText>
              A vantagem visual do PRICE é enxergar o mesmo valor de parcela em
              todos os períodos, enquanto a tabela revela a troca interna entre
              juros e amortização.
            </ModalText>
            <ModalDisclaimer />
          </>
        );
      case "sac":
        return (
          <>
            <ModalHeading>📉 SAC — amortização constante</ModalHeading>
            <ModalText>
              No SAC, a amortização é constante: a mesma fatia do principal é
              reduzida em cada período. Como o saldo cai mais rápido, os juros
              também caem.
            </ModalText>
            <ModalText>
              O efeito prático é uma parcela inicial maior e parcelas
              decrescentes ao longo do tempo. O custo total de juros costuma ser
              menor que no PRICE para as mesmas condições.
            </ModalText>
            <ModalFormula>
              amortização constante · juros decrescentes
            </ModalFormula>
            <ModalExample>
              <strong>Caso de referência SAC-01:</strong>
              <br />
              Principal R$100.000 · Taxa 1% a.m. · Prazo 12 períodos
              <br />
              Primeira parcela R$9.333,33 · Última R$8.416,70 · Total de juros
              R$6.500,00
            </ModalExample>
            <ModalText>
              SAC exige mais fôlego no início, mas acelera a redução do saldo
              devedor.
            </ModalText>
            <ModalDisclaimer />
          </>
        );
      case "price-sac":
        return (
          <>
            <ModalHeading>⚖️ PRICE × SAC — leitura lado a lado</ModalHeading>
            <ModalText>
              PRICE e SAC usam os mesmos ingredientes — principal, taxa e prazo
              — mas distribuem a amortização de formas diferentes.
            </ModalText>
            <ModalText>
              PRICE entrega parcela constante e previsibilidade mensal. SAC
              acelera a amortização, reduz saldo mais rápido e tende a diminuir
              o total de juros.
            </ModalText>
            <ModalExample>
              <strong>Caso de referência:</strong>
              <br />
              R$100.000 · 1% a.m. · 12 períodos → PRICE: parcela R$8.884,88 e
              juros R$6.618,53 · SAC: primeira R$9.333,33, última R$8.416,70 e
              juros R$6.500,00.
            </ModalExample>
            <ModalText>
              A escolha não é apenas matemática: envolve fluxo de caixa,
              capacidade de pagamento no começo e leitura do custo total.
            </ModalText>
            <ModalDisclaimer />
          </>
        );
      case "glossario":
        return (
          <>
            <ModalHeading>📚 Glossário da amortização</ModalHeading>
            <div className="modal-gloss-grid">
              <ModalExample>
                <strong>Principal</strong>
                <br />
                Valor financiado que será amortizado ao longo do prazo.
              </ModalExample>
              <ModalExample>
                <strong>Taxa por período</strong>
                <br />
                Percentual aplicado sobre o saldo devedor de cada período.
              </ModalExample>
              <ModalExample>
                <strong>Parcela</strong>
                <br />
                Valor pago no período: juros mais amortização.
              </ModalExample>
              <ModalExample>
                <strong>Juros do período</strong>
                <br />
                Custo financeiro calculado sobre o saldo devedor.
              </ModalExample>
              <ModalExample>
                <strong>Amortização</strong>
                <br />
                Parte da parcela que reduz efetivamente a dívida.
              </ModalExample>
              <ModalExample>
                <strong>Saldo devedor</strong>
                <br />
                Principal ainda não amortizado após cada pagamento.
              </ModalExample>
              <ModalExample>
                <strong>Total pago</strong>
                <br />
                Soma de todas as parcelas ao final do prazo.
              </ModalExample>
              <ModalExample>
                <strong>Total de juros</strong>
                <br />
                Soma dos juros cobrados em todos os períodos.
              </ModalExample>
              <ModalExample>
                <strong>Saldo final</strong>
                <br />
                Valor remanescente após a última linha da tabela.
              </ModalExample>
              <ModalExample>
                <strong>Número de períodos</strong>
                <br />
                Quantidade de linhas esperada na tabela.
              </ModalExample>
            </div>
            <ModalDisclaimer />
          </>
        );
      case "cuidados":
        return (
          <>
            <ModalHeading>⚠ Cuidados educacionais</ModalHeading>
            <CautionItem icon="🔴">
              <strong>Simulação não substitui contrato.</strong> Os valores
              exibidos ajudam a entender PRICE e SAC, mas um contrato real pode
              incluir tarifas, seguros, impostos, indexadores e regras de
              vencimento.
            </CautionItem>
            <CautionItem icon="🟡">
              <strong>Parcela menor não significa custo menor.</strong> Compare
              sempre total pago, total de juros e evolução do saldo devedor.
            </CautionItem>
            <CautionItem icon="🟡">
              <strong>Liquidação antecipada muda a leitura.</strong> O impacto
              depende das regras contratuais e do método usado para recalcular o
              saldo.
            </CautionItem>
            <CautionItem icon="🔵">
              <strong>Produto educacional.</strong> A ferramenta explica a
              mecânica dos sistemas, mas não recomenda contratação nem substitui
              análise profissional.
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
