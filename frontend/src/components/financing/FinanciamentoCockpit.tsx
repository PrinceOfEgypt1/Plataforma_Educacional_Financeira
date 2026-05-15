"use client";

import { useCallback, useState, type FormEvent } from "react";

import { AlertBanner } from "@/components/ui/AlertBanner";
import { describeApiError } from "@/lib/api/problem";
import { formatBRL, formatRatePct } from "@/lib/money";
import {
  compararFinanciamentos,
  simularFinanciamentoImobiliario,
  type FinanciamentoApiError,
} from "@/services/financing/financiamentoService";
import type {
  FinanciamentoImobCompareOut,
  FinanciamentoImobOut,
  FinanciamentoImobSummary,
} from "@/types/financing";

import { FinanciamentoAnatomiaEncargo } from "./FinanciamentoAnatomiaEncargo";
import { FinanciamentoComponentesCET } from "./FinanciamentoComponentesCET";
import { GlossaryTerm } from "@/components/education/GlossaryTerm";
import { RealEstateFinancingTable } from "./RealEstateFinancingTable";
import { RealEstateCompareChart } from "./RealEstateCompareChart";
import { RealEstateMemoryPanel } from "./RealEstateMemoryPanel";
import { RealEstateSourcesPanel } from "./RealEstateSourcesPanel";
import { RealEstateSummaryZone } from "./RealEstateSummaryZone";
import { RealEstateNextStepsZone } from "./RealEstateNextStepsZone";
import {
  validateFinanciamentoDraft,
  type FinanciamentoDraft,
  type FinanciamentoFieldErrors,
} from "./formValidation";

const INITIAL_DRAFT: FinanciamentoDraft = {
  valorImovel: "",
  valorEntrada: "",
  prazoMeses: "",
  taxaJurosMensalPercentual: "",
  sistemaAmortizacao: "PRICE",
  seguroMensal: "",
  tarifaMensal: "",
};

import { RealEstateObservatoryShell } from "./RealEstateObservatoryShell";
import { RealEstateScenarioSidebar } from "./RealEstateScenarioSidebar";

export type CockpitView =
  | "inicio"
  | "conceito"
  | "simulacao"
  | "resultado"
  | "comparacao"
  | "tabela"
  | "memoria"
  | "fontes";

type SimulateResult =
  | { readonly status: "idle" }
  | { readonly status: "loading" }
  | { readonly status: "ok"; readonly result: FinanciamentoImobOut }
  | { readonly status: "error"; readonly error: FinanciamentoApiError };

type CompareResult =
  | { readonly status: "idle" }
  | { readonly status: "loading" }
  | { readonly status: "ok"; readonly result: FinanciamentoImobCompareOut }
  | { readonly status: "error"; readonly error: FinanciamentoApiError };

interface FeatureCardDefinition {
  readonly label: string;
  readonly title: string;
  readonly summary: string;
  readonly action: string;
  readonly target: CockpitView;
  readonly tone: string;
}

interface PanelHeaderProps {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly onBack: () => void;
}

const FEATURE_CARDS: ReadonlyArray<FeatureCardDefinition> = [
  {
    label: "Conceito",
    title: "Entenda o financiamento imobiliário",
    summary:
      "Aprenda o que é, como funciona e quais fatores influenciam a aprovação.",
    action: "Entender",
    target: "conceito",
    tone: "from-indigo-950 via-indigo-900 to-indigo-700",
  },
  {
    label: "Resultado",
    title: "Resultado da simulação",
    summary: "Veja parcela, juros, encargos, custo total e total pago.",
    action: "Visualizar",
    target: "resultado",
    tone: "from-amber-950 via-amber-900 to-yellow-800",
  },
  {
    label: "Comparação",
    title: "Comparação SAC x PRICE",
    summary:
      "Compare primeira parcela, última parcela, total de juros e custo total.",
    action: "Comparar",
    target: "comparacao",
    tone: "from-violet-950 via-violet-900 to-purple-800",
  },
  {
    label: "Tabela",
    title: "Tabela de parcelas",
    summary:
      "A tabela respeita o prazo informado e preserva todas as parcelas.",
    action: "Visualizar tabela",
    target: "tabela",
    tone: "from-cyan-950 via-cyan-900 to-teal-800",
  },
  {
    label: "Memória",
    title: "Memória de cálculo",
    summary:
      "Veja fórmula, valores substituídos, arredondamento e rastreabilidade.",
    action: "Ver memória",
    target: "memoria",
    tone: "from-emerald-950 via-emerald-900 to-green-800",
  },
  {
    label: "Fontes",
    title: "Fontes, limites e avisos",
    summary:
      "Entenda por que a simulação não substitui análise bancária ou contrato real.",
    action: "Ver fontes",
    target: "fontes",
    tone: "from-slate-800 via-slate-700 to-slate-600",
  },
];

const CONCEPT_ITEMS = [
  {
    title: "O que está sendo financiado",
    body: "Valor do imóvel é o preço de compra. Entrada é a parte paga antes do crédito. Valor financiado é o saldo que será amortizado ao longo do prazo, com juros e encargos informados na simulação.",
  },
  {
    title: "SAC e PRICE em linguagem simples",
    body: "No SAC, a amortização tende a ser constante: a parcela começa maior e cai conforme o saldo devedor diminui. No PRICE, a parcela inicial fica mais suave, mas o custo de juros pode ser maior ao longo do contrato.",
  },
  {
    title: "Renda, FGTS e aprovação",
    body: "Renda individual ou familiar, comprometimento mensal, FGTS, documentação, seguros, avaliação do imóvel e política da instituição influenciam a contratação real. Essas regras variam e precisam ser confirmadas em fontes oficiais.",
  },
  {
    title: "Simulação não é contrato",
    body: "Este módulo ajuda a entender cenários. Contratação real depende de análise de crédito, CET, tarifas, seguros, legislação brasileira aplicável e proposta formal da instituição financeira.",
  },
];

function parseMoney(raw: string): number {
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatDraftMoney(raw: string): string {
  const parsed = Number.parseFloat(raw.replace(/\./g, "").replace(",", "."));
  if (!Number.isFinite(parsed) || parsed <= 0) return "Não informado";
  return formatBRL(parsed.toFixed(2));
}

function computeEntryPercent(summary: FinanciamentoImobSummary | undefined) {
  if (summary === undefined) return "Sem simulação";
  const valorImovel = parseMoney(summary.valor_imovel);
  if (valorImovel <= 0) return "Sem simulação";
  const percent = (parseMoney(summary.valor_entrada) / valorImovel) * 100;
  return `${percent.toFixed(1)}%`;
}

function PanelHeader({
  eyebrow,
  title,
  description,
  onBack,
}: PanelHeaderProps) {
  return (
    <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-200/70">
          {eyebrow}
        </p>
        <h2 className="mt-1 text-xl font-semibold text-slate-50">{title}</h2>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-300">
          {description}
        </p>
      </div>
      <button
        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-200"
        type="button"
        onClick={onBack}
      >
        Voltar
      </button>
    </div>
  );
}
function FeatureCard({
  card,
  onSelect,
}: {
  readonly card: FeatureCardDefinition;
  readonly onSelect: (view: CockpitView) => void;
}) {
  return (
    <article
      className={`flex min-h-[168px] flex-col rounded-2xl bg-gradient-to-br ${card.tone} p-4 shadow-lg shadow-black/20 ring-1 ring-white/10`}
      data-testid={`financiamento-card-${card.target}`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
        {card.label}
      </p>
      <h3 className="mt-2 text-base font-semibold text-white">{card.title}</h3>
      <p className="mt-2 text-xs leading-5 text-white/78">{card.summary}</p>
      <button
        className="mt-auto w-fit rounded-lg bg-white/15 px-3 py-2 text-xs font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white"
        type="button"
        onClick={() => onSelect(card.target)}
      >
        {card.action}
      </button>
    </article>
  );
}

function HomeView({
  summary,
  draft,
  onOpen,
  onCompare,
}: {
  readonly summary: FinanciamentoImobSummary | undefined;
  readonly draft: FinanciamentoDraft;
  readonly onOpen: (view: CockpitView) => void;
  readonly onCompare: () => void;
}) {
  function activateCard(target: CockpitView) {
    if (target === "comparacao") {
      onCompare();
      return;
    }
    onOpen(target);
  }

  return (
    <section
      className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-4"
      data-testid="financiamento-home"
    >
      <div className="grid min-h-0 gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-3xl border border-cyan-200/10 bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/50 p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200/80">
            Financiamento Imobiliário
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold text-white">
            Entenda cada parcela antes de assinar o contrato.
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            Uma jornada educativa para simular, comparar SAC x PRICE, conferir
            tabela, rastrear memória de cálculo e entender fontes, limites e
            alertas antes de conversar com a instituição financeira.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              className="rounded-xl bg-cyan-300 px-4 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-100"
              type="button"
              onClick={() => onOpen("simulacao")}
            >
              Começar simulação
            </button>
            <button
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-200"
              type="button"
              onClick={() => onOpen("conceito")}
            >
              Antes, entender o conceito
            </button>
          </div>
        </div>

        <aside
          className="rounded-3xl border border-amber-200/15 bg-amber-300/10 p-5"
          data-testid="financiamento-scenario-panel"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-100/75">
            Cenário atual
          </p>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-amber-50/70">Imóvel</dt>
              <dd className="font-semibold text-slate-50">
                {summary
                  ? formatBRL(summary.valor_imovel)
                  : formatDraftMoney(draft.valorImovel)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-amber-50/70">Entrada</dt>
              <dd className="font-semibold text-slate-50">
                {summary ? computeEntryPercent(summary) : "Sem simulação"}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-amber-50/70">Prazo</dt>
              <dd className="font-semibold text-slate-50">
                {summary ? `${summary.prazo_meses} meses` : "Não informado"}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-amber-50/70">Tabela</dt>
              <dd className="font-semibold text-slate-50">
                {summary ? "Gerada" : "Aguardando dados"}
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-xs leading-5 text-amber-50/75">
            Depois da simulação, este painel resume o cenário e libera
            resultado, tabela, comparação, memória e fontes.
          </p>
        </aside>
      </div>

      <div className="grid min-h-0 grid-cols-1 gap-3 overflow-hidden md:grid-cols-2 xl:grid-cols-3">
        {FEATURE_CARDS.map((card) => (
          <FeatureCard
            key={`${card.label}-${card.target}`}
            card={card}
            onSelect={activateCard}
          />
        ))}
      </div>
    </section>
  );
}

function FieldError({ message }: { readonly message: string | undefined }) {
  if (message === undefined) return null;

  return (
    <p className="mt-1 text-[10px] font-medium text-rose-200">{message}</p>
  );
}

function CompactInput({
  label,
  helper,
  field,
  value,
  error,
  onChange,
}: {
  readonly label: string;
  readonly helper: string;
  readonly field: keyof FinanciamentoDraft;
  readonly value: string;
  readonly error: string | undefined;
  readonly onChange: (field: keyof FinanciamentoDraft, value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-100/65">
        {label}
      </span>
      <input
        className="mt-1 w-full rounded-lg border border-cyan-200/10 bg-slate-950/70 px-3 py-2 text-sm font-semibold text-slate-50 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
        inputMode="decimal"
        value={value}
        onChange={(event) => onChange(field, event.target.value)}
        aria-label={label}
        aria-invalid={error !== undefined}
        aria-describedby={`${String(field)}-hint`}
      />
      <span
        id={`${String(field)}-hint`}
        className="mt-1 block text-[10px] leading-4 text-slate-400"
      >
        {helper}
      </span>
      <FieldError message={error} />
    </label>
  );
}

function CompactSimulationForm({
  draft,
  errors,
  busy,
  guidance,
  onChange,
  onSubmit,
}: {
  readonly draft: FinanciamentoDraft;
  readonly errors: FinanciamentoFieldErrors;
  readonly busy: boolean;
  readonly guidance: string | undefined;
  readonly onChange: (field: keyof FinanciamentoDraft, value: string) => void;
  readonly onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form
      className="flex h-full min-h-0 flex-col rounded-2xl border border-cyan-200/10 bg-slate-950/45 p-4"
      onSubmit={onSubmit}
      data-testid="financiamento-compact-form"
      aria-label="Formulário de simulação do financiamento imobiliário"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-200/70">
            Dados da simulação
          </p>
          <h3 className="text-base font-semibold text-slate-50">
            Preencha o cenário real
          </h3>
        </div>
        <button
          className="shrink-0 rounded-lg bg-cyan-300 px-3 py-2 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
          type="submit"
          data-testid="financiamento-submit"
          disabled={busy}
        >
          {busy ? "Gerando..." : "Gerar simulação"}
        </button>
      </div>

      {guidance !== undefined && (
        <div
          className="mb-3 rounded-xl border border-violet-200/20 bg-violet-300/10 p-3 text-sm leading-6 text-violet-50"
          role="status"
        >
          {guidance}
        </div>
      )}

      <div className="grid min-h-0 grid-cols-1 gap-2 md:grid-cols-2">
        <CompactInput
          label="Valor do imóvel (R$)"
          helper="Preço total do imóvel negociado. Define o valor máximo da operação."
          field="valorImovel"
          value={draft.valorImovel}
          error={errors.valorImovel}
          onChange={onChange}
        />
        <CompactInput
          label="Entrada (R$)"
          helper="Valor pago à vista com recursos próprios. Quanto maior a entrada, menor o valor financiado e menores os juros totais."
          field="valorEntrada"
          value={draft.valorEntrada}
          error={errors.valorEntrada}
          onChange={onChange}
        />
        <CompactInput
          label="Prazo (meses)"
          helper="Quantidade de parcelas mensais. Prazo maior → parcela menor, mas total de juros maior."
          field="prazoMeses"
          value={draft.prazoMeses}
          error={errors.prazoMeses}
          onChange={onChange}
        />
        <CompactInput
          label="Taxa de juros mensal (%)"
          helper="Taxa mensal aplicada sobre o saldo devedor. Para simular 1,25% ao mês, digite 1,2500. Taxas acima de 5% ao mês são bloqueadas para evitar erro de digitação."
          field="taxaJurosMensalPercentual"
          value={draft.taxaJurosMensalPercentual}
          error={errors.taxaJurosMensalPercentual}
          onChange={onChange}
        />

        <label className="block">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-100/65">
            Sistema
          </span>
          <select
            className="mt-1 w-full rounded-lg border border-cyan-200/10 bg-slate-950/70 px-3 py-2 text-sm font-semibold text-slate-50 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
            value={draft.sistemaAmortizacao}
            onChange={(event) =>
              onChange("sistemaAmortizacao", event.target.value)
            }
            aria-label="Sistema de amortização"
          >
            <option value="PRICE">PRICE</option>
            <option value="SAC">SAC</option>
          </select>
          <span className="mt-1 block text-[10px] leading-4 text-slate-400">
            Escolha o sistema inicial; a comparação calcula SAC e PRICE.
          </span>
          <FieldError message={errors.sistemaAmortizacao} />
        </label>

        <CompactInput
          label="Seguro mensal (R$)"
          helper="Seguro habitacional (MIP + DFI): cobre morte/invalidez e danos físicos ao imóvel. Opcional nesta simulação — consulte o valor real na proposta formal."
          field="seguroMensal"
          value={draft.seguroMensal}
          error={errors.seguroMensal}
          onChange={onChange}
        />
        <CompactInput
          label="Tarifa mensal (R$)"
          helper="Taxa de administração mensal do contrato. Muitos contratos não têm essa cobrança — verifique na proposta formal. Não é seguro."
          field="tarifaMensal"
          value={draft.tarifaMensal}
          error={errors.tarifaMensal}
          onChange={onChange}
        />

        <div className="rounded-xl border border-emerald-300/15 bg-emerald-300/10 p-3 text-xs leading-5 text-emerald-50 md:col-span-2">
          <strong className="text-emerald-100">Leitura educativa:</strong>{" "}
          renda, FGTS, seguros, tarifas, CET, documentação e análise de crédito
          mudam a contratação real e aparecem nas fontes e limites.
        </div>
      </div>
    </form>
  );
}

function ConceptPanel({ onBack }: { readonly onBack: () => void }) {
  return (
    <section className="h-full min-h-0 overflow-hidden">
      <PanelHeader
        eyebrow="Conceito"
        title="Antes dos números, entenda o contrato"
        description="O financiamento imobiliário combina entrada, crédito, amortização, juros, seguros, tarifas e análise da instituição. A simulação ajuda a enxergar essas peças antes de assinar."
        onBack={onBack}
      />
      <div
        className="grid min-h-0 grid-cols-1 gap-3 lg:grid-cols-2"
        data-testid="financiamento-conceito-panel"
      >
        {CONCEPT_ITEMS.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-cyan-200/10 bg-slate-950/45 p-4"
          >
            <h3 className="text-sm font-semibold text-cyan-100">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function SimulationPanel({
  draft,
  errors,
  guidance,
  simState,
  cmpState,
  onBack,
  onChange,
  onSubmit,
  onCompare,
}: {
  readonly draft: FinanciamentoDraft;
  readonly errors: FinanciamentoFieldErrors;
  readonly guidance: string | undefined;
  readonly simState: SimulateResult;
  readonly cmpState: CompareResult;
  readonly onBack: () => void;
  readonly onChange: (field: keyof FinanciamentoDraft, value: string) => void;
  readonly onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  readonly onCompare: () => void;
}) {
  return (
    <section className="h-full min-h-0 overflow-hidden">
      <PanelHeader
        eyebrow="Simulação"
        title="Gerar cenário de financiamento"
        description="Preencha os dados uma vez. O mesmo cenário alimenta resultado, tabela, memória e comparação SAC x PRICE."
        onBack={onBack}
      />
      <div className="grid h-[calc(100%-74px)] min-h-0 gap-4 lg:grid-cols-[520px_minmax(0,1fr)]">
        <CompactSimulationForm
          draft={draft}
          errors={errors}
          busy={simState.status === "loading"}
          guidance={guidance}
          onChange={onChange}
          onSubmit={onSubmit}
        />
        <div className="grid min-h-0 content-start gap-3">
          <div className="rounded-2xl border border-cyan-200/10 bg-cyan-300/10 p-4 text-sm leading-6 text-cyan-50">
            Preencha valor do imóvel, entrada, prazo e taxa mensal. Depois use{" "}
            <strong>Gerar simulação</strong> para ver os resultados ou{" "}
            <strong>Comparar SAC x PRICE</strong> para calcular os dois sistemas
            com os mesmos parâmetros.
          </div>
          <button
            className="rounded-2xl border border-violet-200/20 bg-violet-300/10 p-4 text-left text-violet-50 transition hover:bg-violet-300/15 focus:outline-none focus:ring-2 focus:ring-violet-200 disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            aria-label="Comparar SAC x PRICE"
            onClick={onCompare}
            disabled={cmpState.status === "loading"}
          >
            <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-200/75">
              Comparação
            </span>
            <span className="mt-1 block text-lg font-semibold">
              Comparar SAC x PRICE
            </span>
            <span className="mt-2 block text-sm leading-6 text-violet-50/80">
              Calcula primeira parcela, última parcela, total de juros, total
              pago e leitura pedagógica para os dois sistemas.
            </span>
          </button>
          {simState.status === "error" && (
            <AlertBanner level="error" title="Erro na simulação">
              {describeApiError(simState.error)}
            </AlertBanner>
          )}
          {cmpState.status === "error" && (
            <AlertBanner level="error" title="Erro na comparação">
              {describeApiError(cmpState.error)}
            </AlertBanner>
          )}
        </div>
      </div>
    </section>
  );
}

function LockedPanel({
  eyebrow,
  title,
  onBack,
  onStart,
}: {
  readonly eyebrow: string;
  readonly title: string;
  readonly onBack: () => void;
  readonly onStart: () => void;
}) {
  return (
    <section className="h-full min-h-0 overflow-hidden">
      <PanelHeader
        eyebrow={eyebrow}
        title={title}
        description="Simule primeiro para liberar esta visão com dados reais do cenário informado."
        onBack={onBack}
      />
      <div
        className="grid h-[calc(100%-74px)] place-items-center rounded-2xl border border-dashed border-cyan-200/20 bg-slate-950/35 p-6 text-center"
        data-testid="financiamento-idle-state"
      >
        <div className="max-w-md">
          <h3 className="text-lg font-semibold text-slate-50">
            Simule primeiro para liberar esta visão.
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            A plataforma precisa das entradas de valor, prazo, taxa e sistema
            para gerar resultado, tabela, comparação e memória com
            rastreabilidade.
          </p>
          <button
            className="mt-4 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-100"
            type="button"
            onClick={onStart}
          >
            Ir para simulação
          </button>
        </div>
      </div>
    </section>
  );
}

type ResultZone = 1 | 2 | 3 | 4 | 5;

function ResultPanel({
  result,
  onBack,
  onOpen,
}: {
  readonly result: FinanciamentoImobOut;
  readonly onBack: () => void;
  readonly onOpen: (view: CockpitView) => void;
}) {
  const { summary } = result;
  const [activeZone, setActiveZone] = useState<ResultZone>(1);

  const ZONES = [
    { n: 1 as ResultZone, label: "Resumo" },
    { n: 2 as ResultZone, label: "Parcela" },
    { n: 3 as ResultZone, label: "CET" },
    { n: 4 as ResultZone, label: "Interpretação" },
    { n: 5 as ResultZone, label: "Próximos passos" },
  ] as const;

  return (
    <section
      className="flex h-full min-h-0"
      data-testid="financiamento-result-panel"
    >
      {/* ── Sidebar lateral com cenário e insight cards ─────── */}
      <RealEstateScenarioSidebar
        result={result}
        onNavigate={onOpen as (view: string) => void}
      />

      {/* ── Painel principal (header + zonas) ──────────────── */}
      <div className="flex min-w-0 flex-1 flex-col">
        <PanelHeader
          eyebrow="Resultado"
          title={`Cenário ${summary.sistema_amortizacao} — do que é feita a sua parcela`}
          description="Navegue entre as zonas usando as abas abaixo. Cada zona apresenta uma visão específica do seu financiamento."
          onBack={onBack}
        />

        {/* ── Navegação tabbed entre zonas ───────────────────── */}
        <nav
          role="tablist"
          aria-label="Navegação entre zonas do resultado"
          className="flex gap-0.5 border-b border-white/8 px-1 pb-0 overflow-x-clip"
          data-testid="result-zone-nav"
        >
          {ZONES.map(({ n, label }) => (
            <button
              key={n}
              id={`zone-tab-${n}`}
              type="button"
              role="tab"
              aria-label={`Ir para Zona ${n}: ${label}`}
              aria-selected={activeZone === n}
              aria-controls={`zone-panel-${n}`}
              onClick={() => setActiveZone(n)}
              className={`
              flex items-center gap-1.5 whitespace-nowrap rounded-none
              border-b-2 px-3 py-2 text-[11px] font-medium transition-colors
              focus:outline-none focus:ring-1 focus:ring-cyan-400/50 focus:ring-inset
              ${
                activeZone === n
                  ? "border-cyan-400 text-cyan-300"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }
            `}
            >
              <span
                className={`
                flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full
                text-[9px] font-bold
                ${activeZone === n ? "bg-cyan-400 text-slate-950" : "bg-white/10 text-slate-400"}
              `}
              >
                {n}
              </span>
              {label}
            </button>
          ))}
        </nav>

        {/* ── Barra de ação rápida — navegação para outras views ─ */}
        <div className="flex gap-1.5 border-b border-white/5 bg-slate-950/30 px-2 py-1.5">
          {(
            [
              { label: "Tabela", view: "tabela" as CockpitView },
              { label: "Comparar", view: "comparacao" as CockpitView },
              { label: "Memória", view: "memoria" as CockpitView },
              { label: "Fontes", view: "fontes" as CockpitView },
            ] as const
          ).map((item) => (
            <button
              key={item.view}
              type="button"
              onClick={() => onOpen(item.view)}
              className="rounded-md border border-white/8 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-slate-400 transition hover:bg-white/10 hover:text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* ── Painel de zona ativo (single-panel, sem scroll de tela) ─── */}
        <div
          className="flex-1 min-h-0 overflow-hidden"
          data-testid="financiamento-result-zone-container"
        >
          {/* Renderização condicional da zona ativa */}
          {activeZone === 1 && (
            <div
              role="tabpanel"
              id="zone-panel-1"
              aria-labelledby="zone-tab-1"
              className="h-full overflow-y-auto p-1"
            >
              <RealEstateSummaryZone summary={summary} />
            </div>
          )}

          {/* ZONA 2 — Anatomia do encargo (renderização condicional) */}
          {activeZone === 2 && (
            <div
              role="tabpanel"
              id="zone-panel-2"
              aria-labelledby="zone-tab-2"
              className="h-full overflow-y-auto pr-2"
            >
              <section
                className="rounded-2xl border border-cyan-200/10 bg-slate-950/60 p-4"
                data-testid="financiamento-item13-panels"
                aria-label="Anatomia do encargo mensal"
              >
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-200/70">
                  Zona 2 · Do que é feita a sua parcela?
                </p>
                <FinanciamentoAnatomiaEncargo
                  anatomia={result.anatomia_encargo}
                  summary={result.summary}
                />
              </section>
            </div>
          )}

          {/* ZONA 3 — Componentes do CET (renderização condicional) */}
          {activeZone === 3 && (
            <div
              role="tabpanel"
              id="zone-panel-3"
              aria-labelledby="zone-tab-3"
              className="h-full overflow-y-auto pr-2"
            >
              <section
                className="rounded-2xl border border-violet-200/15 bg-slate-950/50 p-4"
                aria-label="Componentes do custo e do CET demonstrativo"
              >
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-violet-200/70">
                  Zona 3 · O que pesa no custo do financiamento?
                </p>
                <FinanciamentoComponentesCET
                  componentes={result.componentes_cet}
                />
              </section>
            </div>
          )}

          {/* ZONA 4 — Interpretação pedagógica (renderização condicional) */}
          {activeZone === 4 && (
            <div
              role="tabpanel"
              id="zone-panel-4"
              aria-labelledby="zone-tab-4"
              className="h-full overflow-y-auto pr-2"
            >
              <section
                className="rounded-2xl border border-emerald-200/15 bg-emerald-300/10 p-4"
                aria-label="Interpretação pedagógica"
                data-testid="zona4-interpretacao"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-200/70">
                  Zona 4 · O que esses números significam para você?
                </p>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  {summary.sistema_amortizacao === "SAC" ? (
                    <>
                      No sistema{" "}
                      <GlossaryTerm
                        term="SAC"
                        definition="Sistema de Amortização Constante: a amortização é igual todo mês. A parcela começa maior e diminui progressivamente."
                        accent="cyan"
                      />{" "}
                      você paga uma{" "}
                      <GlossaryTerm
                        term="amortização constante"
                        definition="Parcela fixa de redução do saldo devedor. No SAC é sempre a mesma quantia."
                        example={`Nesta simulação: ${formatBRL(summary.total_amortizado)} ÷ ${summary.prazo_meses} meses.`}
                        accent="emerald"
                      />{" "}
                      todo mês. Como os{" "}
                      <GlossaryTerm
                        term="juros caem progressivamente"
                        definition="Os juros são calculados sobre o saldo devedor, que diminui a cada mês — por isso os juros caem junto."
                        accent="amber"
                      />{" "}
                      junto com o{" "}
                      <GlossaryTerm
                        term="saldo devedor"
                        definition="Valor ainda devido. Cai a cada amortização mensal. Começa em 100% do financiado e chega a R$ 0,00 no fim."
                        accent="cyan"
                      />
                      , sua parcela vai de{" "}
                      <strong className="text-emerald-100">
                        {formatBRL(summary.primeira_parcela)}
                      </strong>{" "}
                      até{" "}
                      <strong className="text-emerald-100">
                        {formatBRL(summary.ultima_parcela)}
                      </strong>{" "}
                      na última mensalidade.
                    </>
                  ) : (
                    <>
                      No sistema{" "}
                      <GlossaryTerm
                        term="PRICE"
                        definition="Tabela Price: a prestação financeira (juros + amortização) é constante. A amortização começa pequena e cresce."
                        accent="violet"
                      />{" "}
                      sua{" "}
                      <GlossaryTerm
                        term="prestação financeira"
                        definition="Parcela base = juros do mês + amortização. No PRICE essa soma é constante por toda a duração do contrato."
                        accent="violet"
                      />{" "}
                      permanece estável em{" "}
                      <strong className="text-emerald-100">
                        {formatBRL(
                          summary.primeira_prestacao_financeira ??
                            summary.primeira_parcela,
                        )}
                      </strong>{" "}
                      ao longo dos {summary.prazo_meses} meses.
                    </>
                  )}
                </p>
                <p className="mt-2 text-xs leading-5 text-emerald-50/65">
                  Ao longo dos {summary.prazo_meses} meses, você paga{" "}
                  <strong className="text-amber-300">
                    {formatBRL(summary.total_juros)} em juros
                  </strong>{" "}
                  — o equivalente a{" "}
                  {(
                    (parseFloat(summary.total_juros) /
                      parseFloat(summary.valor_financiado)) *
                    100
                  ).toFixed(1)}
                  % do{" "}
                  <GlossaryTerm
                    term="valor financiado"
                    definition="Valor do imóvel menos a entrada. É sobre esse montante que os juros são calculados."
                    accent="cyan"
                  />
                  . O{" "}
                  <GlossaryTerm
                    term="saldo devedor"
                    definition="Valor ainda devido. Começa em 100% do financiado e chega a R$ 0,00 no final do contrato."
                    accent="cyan"
                  />{" "}
                  parte de{" "}
                  <strong className="text-slate-200">
                    {formatBRL(summary.valor_financiado)}
                  </strong>{" "}
                  e chega a R$ 0,00 na última parcela.
                </p>
                {/* Chips de insight dinâmicos */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="rounded-lg bg-emerald-400/10 px-2 py-1 text-[11px] text-emerald-300 ring-1 ring-emerald-400/20">
                    📉 Parcela: {formatBRL(summary.primeira_parcela)} →{" "}
                    {formatBRL(summary.ultima_parcela)}
                  </span>
                  <span className="rounded-lg bg-cyan-400/10 px-2 py-1 text-[11px] text-cyan-300 ring-1 ring-cyan-400/20">
                    🏦 Saldo final: R$ 0,00 ✓
                  </span>
                  <span className="rounded-lg bg-amber-400/10 px-2 py-1 text-[11px] text-amber-300 ring-1 ring-amber-400/20">
                    💰 Custo financeiro:{" "}
                    {formatBRL(
                      summary.custo_financeiro_total ?? summary.custo_total,
                    )}
                  </span>
                </div>
              </section>
            </div>
          )}

          {/* ZONA 5 — Próximos passos 14D-B (RealEstateNextStepsZone) */}
          {activeZone === 5 && (
            <div
              role="tabpanel"
              id="zone-panel-5"
              aria-labelledby="zone-tab-5"
              className="h-full overflow-y-auto p-1"
            >
              <RealEstateNextStepsZone
                onNavigate={onOpen as (v: string) => void}
              />
            </div>
          )}
        </div>
      </div>
      {/* end flex-1 main col */}
    </section>
  );
}

function CompareMetric({
  label,
  price,
  sac,
}: {
  readonly label: string;
  readonly price: string;
  readonly sac: string;
}) {
  return (
    <article className="rounded-xl border border-white/10 bg-white/5 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-100/70">
        {label}
      </p>
      <div className="mt-2 grid gap-2 text-xs">
        <div className="flex items-center justify-between gap-3 rounded-lg bg-cyan-300/10 px-2 py-1.5">
          <span className="font-semibold text-cyan-100">PRICE</span>
          <span className="font-mono text-slate-50">{price}</span>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-lg bg-amber-300/10 px-2 py-1.5">
          <span className="font-semibold text-amber-100">SAC</span>
          <span className="font-mono text-slate-50">{sac}</span>
        </div>
      </div>
    </article>
  );
}

function ComparePanel({
  compare,
  onBack,
}: {
  readonly compare: FinanciamentoImobCompareOut;
  readonly onBack: () => void;
}) {
  const pPrice1 = parseFloat(compare.price.summary.primeira_parcela);
  const pSac1 = parseFloat(compare.sac.summary.primeira_parcela);
  const pPriceN = parseFloat(compare.price.summary.ultima_parcela);
  const pSacN = parseFloat(compare.sac.summary.ultima_parcela);
  const jPrice = parseFloat(compare.price.summary.total_juros);
  const jSac = parseFloat(compare.sac.summary.total_juros);
  const difJuros = jPrice - jSac;
  const difInicio = pSac1 - pPrice1;
  const prazo = compare.price.summary.prazo_meses;
  const pctEconomia = jPrice > 0 ? ((difJuros / jPrice) * 100).toFixed(1) : "0";
  const sacMaisCaro = pSac1 > pPrice1;
  const interpretacao =
    compare.comparacao.interpretacao_dinamica ??
    compare.comparacao.explicacao_pedagogica;

  return (
    <section className="flex h-full min-h-0 flex-col">
      <PanelHeader
        eyebrow="Comparação"
        title="SAC × PRICE — mesmos parâmetros"
        description="A mesma simulação calculada nos dois sistemas para você decidir com clareza."
        onBack={onBack}
      />
      <div
        className="flex-1 min-h-0 overflow-y-auto space-y-3"
        data-testid="financiamento-compare-summary"
      >
        {/* Gráfico — protagonismo visual */}
        <RealEstateCompareChart compare={compare} />

        {/* Grid comparativo com valores dinâmicos */}
        <div className="grid gap-2 md:grid-cols-2">
          <CompareMetric
            label="Primeira parcela"
            price={formatBRL(compare.price.summary.primeira_parcela)}
            sac={formatBRL(compare.sac.summary.primeira_parcela)}
          />
          <CompareMetric
            label="Última parcela"
            price={formatBRL(compare.price.summary.ultima_parcela)}
            sac={formatBRL(compare.sac.summary.ultima_parcela)}
          />
          <CompareMetric
            label="Total de juros"
            price={formatBRL(compare.price.summary.total_juros)}
            sac={formatBRL(compare.sac.summary.total_juros)}
          />
          <CompareMetric
            label="Total pago"
            price={formatBRL(compare.price.summary.total_pago)}
            sac={formatBRL(compare.sac.summary.total_pago)}
          />
        </div>

        {/* Interpretação dinâmica — padrão da referência */}
        <article
          className="rounded-2xl border border-violet-200/15 bg-violet-300/8 p-4"
          data-testid="compare-interpretacao-dinamica"
        >
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-200/70 mb-2">
            🎓 O que essa comparação significa no seu cenário
          </h3>
          {interpretacao && (
            <p className="text-sm leading-6 text-violet-50/90">
              {interpretacao}
            </p>
          )}
          {!interpretacao && (
            <p className="text-sm leading-6 text-violet-50/90">
              Escolher{" "}
              <GlossaryTerm
                term="SAC"
                definition="Sistema de Amortização Constante: amortização fixa, parcela decresce."
                accent="cyan"
              />{" "}
              em vez de{" "}
              <GlossaryTerm
                term="PRICE"
                definition="Tabela Price: prestação financeira constante, amortização cresce progressivamente."
                accent="violet"
              />{" "}
              {difJuros > 0 ? (
                <>
                  representa uma{" "}
                  <strong className="text-emerald-300">
                    economia de {formatBRL(difJuros.toFixed(2))}
                  </strong>{" "}
                  ao longo dos {prazo} meses — redução de{" "}
                  <strong className="text-emerald-300">{pctEconomia}%</strong>{" "}
                  nos juros totais.
                </>
              ) : (
                <>gera custo total similar neste cenário.</>
              )}
            </p>
          )}
          {/* Como decidir — dinâmico */}
          <div className="mt-3 rounded-xl bg-violet-900/30 border border-violet-400/20 p-3 text-xs leading-5 text-violet-100">
            <strong className="text-violet-200">Como decidir?</strong>{" "}
            {sacMaisCaro ? (
              <>
                Se sua renda comporta a parcela inicial do SAC (
                <strong>{formatBRL(pSac1.toFixed(2))}</strong>), a economia de{" "}
                {formatBRL(difJuros.toFixed(2))} ao longo de {prazo} meses tende
                a ser a escolha financeiramente mais vantajosa. Se a parcela do
                PRICE ({formatBRL(pPrice1.toFixed(2))}) é o limite da sua
                margem, o PRICE permite contratar agora com parcela menor — mas
                você pagará mais juros ao longo do contrato.
              </>
            ) : (
              <>
                Neste cenário, o PRICE começa com parcela mais alta. Compare a
                última parcela de cada sistema: SAC (
                {formatBRL(pSacN.toFixed(2))}) vs PRICE (
                {formatBRL(pPriceN.toFixed(2))}) para entender o comportamento
                ao longo do contrato.
              </>
            )}{" "}
            Solicite sempre o{" "}
            <GlossaryTerm
              term="CET"
              definition="Custo Efetivo Total — taxa que representa o custo real completo da operação. Solicite à instituição financeira."
              accent="violet"
            />{" "}
            oficial de cada proposta antes de decidir.
          </div>
          {/* Chips de resumo */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {sacMaisCaro && difInicio > 0 && (
              <span className="rounded-lg bg-amber-400/10 px-2 py-1 text-[11px] text-amber-300 ring-1 ring-amber-400/20">
                SAC inicia {formatBRL(difInicio.toFixed(2))} maior
              </span>
            )}
            {difJuros > 0 && (
              <span className="rounded-lg bg-emerald-400/10 px-2 py-1 text-[11px] text-emerald-300 ring-1 ring-emerald-400/20">
                SAC economiza {formatBRL(difJuros.toFixed(2))} em juros
              </span>
            )}
            <span className="rounded-lg bg-cyan-400/10 px-2 py-1 text-[11px] text-cyan-300 ring-1 ring-cyan-400/20">
              {compare.comparacao.comportamento_saldo_devedor}
            </span>
          </div>
        </article>

        {/* Recomendações */}
        {compare.comparacao.recomendacoes.length > 0 && (
          <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 mb-2">
              Recomendações
            </h3>
            <ul className="space-y-1.5 text-xs leading-5 text-slate-300">
              {compare.comparacao.recomendacoes.map((r) => (
                <li key={r} className="flex gap-2">
                  <span className="text-cyan-400 flex-shrink-0">→</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

function TablePanel({
  result,
  onBack,
}: {
  readonly result: FinanciamentoImobOut;
  readonly onBack: () => void;
}) {
  const sistema = result.summary.sistema_amortizacao;
  const n = result.parcelas.length;
  const primeira = result.parcelas[0];
  const ultima = result.parcelas[n - 1];

  return (
    <section className="flex h-full min-h-0 flex-col">
      <PanelHeader
        eyebrow="Tabela"
        title={`${n} parcelas — ${sistema}`}
        description="Todas as parcelas do contrato preservadas. Role para ler e use o guia ao lado para entender cada coluna."
        onBack={onBack}
      />
      <div className="flex-1 min-h-0 overflow-y-auto space-y-3">
        {/* ── Guia de leitura da tabela ────────────── */}
        <div
          className="rounded-2xl border border-cyan-200/10 bg-slate-950/45 p-4"
          data-testid="tabela-guia-leitura-cockpit"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-200/70 mb-2">
            Como ler esta tabela
          </p>
          <p className="text-sm leading-6 text-slate-300">
            Cada linha é um mês do contrato. O{" "}
            <GlossaryTerm
              term="saldo devedor"
              definition="Quanto você ainda deve à instituição financeira. Começa igual ao valor financiado e chega a R$ 0,00 na última parcela."
              accent="cyan"
            />{" "}
            começa em{" "}
            <strong className="text-slate-100">
              {formatBRL(result.summary.valor_financiado)}
            </strong>{" "}
            e deve chegar a R$ 0,00 no mês {n}. Os{" "}
            <GlossaryTerm
              term="juros"
              definition="Calculados sobre o saldo devedor daquele mês. Caem progressivamente no SAC conforme o saldo diminui."
              accent="amber"
            />{" "}
            são calculados sobre esse saldo — por isso caem mês a mês
            {sistema === "SAC" ? " no SAC" : ""}. A{" "}
            <GlossaryTerm
              term="amortização"
              definition="Parcela que reduz efetivamente o saldo devedor. No SAC é constante; no PRICE cresce progressivamente."
              accent="emerald"
            />{" "}
            {sistema === "SAC"
              ? "é sempre a mesma: " + formatBRL(primeira?.amortizacao ?? "0")
              : "começa menor e cresce ao longo do contrato (PRICE)"}
            .
          </p>
          {/* Chips com dados reais */}
          {primeira && ultima && (
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 text-[11px]">
              {[
                {
                  label: "1ª parcela",
                  val: formatBRL(
                    primeira.encargo_mensal_total ?? primeira.prestacao,
                  ),
                  color: "text-cyan-300",
                },
                {
                  label: "1ºs juros",
                  val: formatBRL(primeira.juros),
                  color: "text-amber-300",
                },
                {
                  label: "Última parcela",
                  val: formatBRL(
                    ultima.encargo_mensal_total ?? ultima.prestacao,
                  ),
                  color: "text-teal-300",
                },
                {
                  label: "Saldo final",
                  val: formatBRL(ultima.saldo_final) + " ✓",
                  color: "text-emerald-300",
                },
              ].map(({ label, val, color }) => (
                <div
                  key={label}
                  className="rounded-lg border border-white/8 bg-white/4 px-2 py-1.5"
                >
                  <p className="text-slate-500">{label}</p>
                  <p className={`font-semibold tabular-nums ${color}`}>{val}</p>
                </div>
              ))}
            </div>
          )}
          <p className="mt-2 text-[11px] text-slate-500">
            Confira que o saldo final da última linha é R$ 0,00 para confirmar
            que o fechamento está correto.
          </p>
        </div>

        {/* ── Tabela redesenhada 14D-B ────────────── */}
        <RealEstateFinancingTable
          parcelas={result.parcelas}
          summary={result.summary}
        />
      </div>
    </section>
  );
}

export function FinanciamentoCockpit() {
  const [view, setView] = useState<CockpitView>("inicio");
  const [, setHistory] = useState<ReadonlyArray<CockpitView>>([]);
  const [draft, setDraft] = useState<FinanciamentoDraft>(INITIAL_DRAFT);
  const [fieldErrors, setFieldErrors] = useState<FinanciamentoFieldErrors>({});
  const [guidance, setGuidance] = useState<string | undefined>(undefined);
  const [simState, setSimState] = useState<SimulateResult>({ status: "idle" });
  const [cmpState, setCmpState] = useState<CompareResult>({ status: "idle" });

  const openView = useCallback(
    (nextView: CockpitView) => {
      setHistory((prev) => [...prev, view]);
      setView(nextView);
    },
    [view],
  );

  const goBack = useCallback(() => {
    setHistory((prev) => {
      const last = prev[prev.length - 1];
      if (last !== undefined) {
        setView(last);
        return prev.filter((_, index) => index < prev.length - 1);
      }
      setView("inicio");
      return prev;
    });
  }, []);

  const handleChange = useCallback(
    (field: keyof FinanciamentoDraft, value: string) => {
      setDraft((prev) => ({ ...prev, [field]: value }));
      setGuidance(undefined);
      setFieldErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    [],
  );

  const handleSimulate = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const validation = validateFinanciamentoDraft(draft);
      if (!validation.ok) {
        setFieldErrors(validation.errors);
        return;
      }
      setGuidance(undefined);
      setSimState({ status: "loading" });
      try {
        const result = await simularFinanciamentoImobiliario(validation.value);
        setSimState({ status: "ok", result });
        openView("resultado");
      } catch (error) {
        setSimState({ status: "error", error: error as FinanciamentoApiError });
      }
    },
    [draft, openView],
  );

  const handleCompare = useCallback(async () => {
    const validation = validateFinanciamentoDraft(draft);
    if (!validation.ok) {
      setFieldErrors(validation.errors);
      setGuidance(
        "Preencha os dados da simulação para comparar SAC x PRICE com os mesmos parâmetros.",
      );
      if (view !== "simulacao") {
        openView("simulacao");
      }
      return;
    }
    const value = validation.value;
    setGuidance(undefined);
    setCmpState({ status: "loading" });
    try {
      const result = await compararFinanciamentos({
        valor_imovel: value.valor_imovel,
        valor_entrada: value.valor_entrada,
        prazo_meses: value.prazo_meses,
        taxa_juros_mensal_percentual: value.taxa_juros_mensal_percentual,
        ...(value.seguro_mensal !== undefined
          ? { seguro_mensal: value.seguro_mensal }
          : {}),
        ...(value.tarifa_mensal !== undefined
          ? { tarifa_mensal: value.tarifa_mensal }
          : {}),
      });
      setCmpState({ status: "ok", result });
      openView("comparacao");
    } catch (error) {
      setCmpState({ status: "error", error: error as FinanciamentoApiError });
      openView("comparacao");
    }
  }, [draft, openView, view]);

  const simulated = simState.status === "ok" ? simState.result : undefined;
  const compared = cmpState.status === "ok" ? cmpState.result : undefined;
  const summary = simulated?.summary;

  return (
    <div
      className="h-[calc(100vh-7rem)] min-h-0 overflow-hidden rounded-3xl border border-cyan-200/10 bg-[#0a101e] text-slate-100 shadow-2xl shadow-black/35"
      data-testid="financiamento-cockpit"
      data-no-page-scroll="true"
    >
      <RealEstateObservatoryShell
        scenario={
          summary !== undefined
            ? {
                sistema: summary.sistema_amortizacao,
                valorFinanciado: formatBRL(summary.valor_financiado),
                prazoMeses: summary.prazo_meses,
                taxaMensal: formatRatePct(summary.taxa_juros_mensal),
                valid: true,
              }
            : undefined
        }
      >
        <main
          className="h-full min-h-0 overflow-hidden p-4"
          data-testid="financiamento-main-panel"
        >
          {view === "inicio" && (
            <HomeView
              summary={summary}
              draft={draft}
              onOpen={openView}
              onCompare={handleCompare}
            />
          )}

          {view === "conceito" && <ConceptPanel onBack={goBack} />}

          {view === "simulacao" && (
            <SimulationPanel
              draft={draft}
              errors={fieldErrors}
              guidance={guidance}
              simState={simState}
              cmpState={cmpState}
              onBack={goBack}
              onChange={handleChange}
              onSubmit={handleSimulate}
              onCompare={handleCompare}
            />
          )}

          {view === "resultado" &&
            (simulated ? (
              <ResultPanel
                result={simulated}
                onBack={goBack}
                onOpen={openView}
              />
            ) : (
              <LockedPanel
                eyebrow="Resultado"
                title="Resultado da simulação"
                onBack={goBack}
                onStart={() => openView("simulacao")}
              />
            ))}

          {view === "comparacao" &&
            (compared ? (
              <ComparePanel compare={compared} onBack={goBack} />
            ) : cmpState.status === "loading" ? (
              <LockedPanel
                eyebrow="Comparação"
                title="Comparando SAC x PRICE"
                onBack={goBack}
                onStart={() => openView("simulacao")}
              />
            ) : (
              <LockedPanel
                eyebrow="Comparação"
                title="Comparação SAC x PRICE"
                onBack={goBack}
                onStart={() => openView("simulacao")}
              />
            ))}

          {view === "tabela" &&
            (simulated ? (
              <TablePanel result={simulated} onBack={goBack} />
            ) : (
              <LockedPanel
                eyebrow="Tabela"
                title="Tabela de parcelas"
                onBack={goBack}
                onStart={() => openView("simulacao")}
              />
            ))}

          {view === "memoria" &&
            (simulated ? (
              <section className="flex h-full min-h-0 flex-col">
                <PanelHeader
                  eyebrow="Memória de cálculo"
                  title="Da entrada ao resultado, sem caixa-preta"
                  description="Fórmulas, variáveis substituídas e passo a passo auditável."
                  onBack={goBack}
                />
                <div className="min-h-0 flex-1 overflow-y-auto">
                  <RealEstateMemoryPanel
                    memoria={simulated.memoria_calculo}
                    formulasUsadas={simulated.formulas_usadas}
                  />
                </div>
              </section>
            ) : (
              <LockedPanel
                eyebrow="Memória"
                title="Memória de cálculo"
                onBack={goBack}
                onStart={() => openView("simulacao")}
              />
            ))}

          {view === "fontes" && (
            <section className="flex h-full min-h-0 flex-col">
              <PanelHeader
                eyebrow="Fontes, limites e alertas"
                title="O que a simulação mostra — e o que ela não promete"
                description="Entenda limites, o que o CET é, e o que perguntar à instituição financeira."
                onBack={goBack}
              />
              <div className="min-h-0 flex-1 overflow-y-auto">
                <RealEstateSourcesPanel result={simulated} />
              </div>
            </section>
          )}
        </main>
      </RealEstateObservatoryShell>
    </div>
  );
}
