"use client";

import { useCallback, useState, type FormEvent, type ReactNode } from "react";

import { AlertBanner } from "@/components/ui/AlertBanner";
import { describeApiError } from "@/lib/api/problem";
import { formatBRL, formatRatePct } from "@/lib/money";
import {
  compararFinanciamentos,
  simularFinanciamentoImobiliario,
  type FinanciamentoApiError,
} from "@/services/financing/financiamentoService";
import type {
  FinanciamentoFonte,
  FinanciamentoImobCompareOut,
  FinanciamentoImobOut,
  FinanciamentoImobSummary,
  FinanciamentoMemoriaCalculo,
} from "@/types/financing";

import { FinanciamentoCompareChart } from "./FinanciamentoCompareChart";
import { FinanciamentoTable } from "./FinanciamentoTable";
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

type CockpitView =
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

const OFFICIAL_SOURCES: ReadonlyArray<FinanciamentoFonte> = [
  {
    nome: "Banco Central do Brasil",
    tipo: "institucional",
    observacao:
      "Referência para educação financeira, crédito, CET e relacionamento com instituições financeiras.",
  },
  {
    nome: "Caixa Econômica Federal",
    tipo: "institucional",
    observacao:
      "Referência pública para condições habitacionais; regras reais variam conforme produto, renda e análise.",
  },
  {
    nome: "FGTS",
    tipo: "institucional",
    observacao:
      "Pode ser usado como entrada, amortização ou liquidação quando as regras oficiais forem atendidas.",
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

function MetricCard({
  label,
  value,
  note,
  tone = "cyan",
}: {
  readonly label: string;
  readonly value: string;
  readonly note: string;
  readonly tone?: "cyan" | "amber" | "emerald" | "violet";
}) {
  const toneClass = {
    cyan: "border-cyan-200/15 bg-cyan-300/10 text-cyan-100",
    amber: "border-amber-200/20 bg-amber-300/10 text-amber-100",
    emerald: "border-emerald-200/15 bg-emerald-300/10 text-emerald-100",
    violet: "border-violet-200/20 bg-violet-300/10 text-violet-100",
  }[tone];

  return (
    <article className={`rounded-2xl border p-4 ${toneClass}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] opacity-75">
        {label}
      </p>
      <p className="mt-2 font-mono text-xl font-semibold text-slate-50">
        {value}
      </p>
      <p className="mt-2 text-xs leading-5 text-slate-300">{note}</p>
    </article>
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
          helper="Preço total do imóvel."
          field="valorImovel"
          value={draft.valorImovel}
          error={errors.valorImovel}
          onChange={onChange}
        />
        <CompactInput
          label="Entrada (R$)"
          helper="Valor pago antes do crédito."
          field="valorEntrada"
          value={draft.valorEntrada}
          error={errors.valorEntrada}
          onChange={onChange}
        />
        <CompactInput
          label="Prazo (meses)"
          helper="Quantidade total de parcelas."
          field="prazoMeses"
          value={draft.prazoMeses}
          error={errors.prazoMeses}
          onChange={onChange}
        />
        <CompactInput
          label="Taxa de juros mensal (%)"
          helper="Taxa usada nesta simulação."
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
          helper="Opcional, se informado."
          field="seguroMensal"
          value={draft.seguroMensal}
          error={errors.seguroMensal}
          onChange={onChange}
        />
        <CompactInput
          label="Tarifa mensal (R$)"
          helper="Opcional, se informado."
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
  return (
    <section className="h-full min-h-0 overflow-hidden">
      <PanelHeader
        eyebrow="Resultado"
        title={`Resumo premium — ${summary.sistema_amortizacao}`}
        description="Os números estão agrupados por significado: cenário, parcelas, custo e interpretação pedagógica."
        onBack={onBack}
      />
      <div
        className="grid h-[calc(100%-74px)] min-h-0 gap-3 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)]"
        data-testid="financiamento-result-panel"
      >
        <section className="rounded-2xl border border-amber-200/15 bg-gradient-to-br from-slate-950 via-amber-950/25 to-slate-950 p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-100/75">
            Resumo principal
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-50">
            {formatBRL(summary.primeira_parcela)}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Primeira parcela estimada para um financiamento de{" "}
            {formatBRL(summary.valor_financiado)} em {summary.prazo_meses}{" "}
            meses, com taxa mensal de {formatRatePct(summary.taxa_juros_mensal)}
            .
          </p>
          <dl className="mt-4 grid gap-2 text-sm">
            <div className="flex justify-between gap-3 rounded-xl bg-white/5 p-3">
              <dt className="text-slate-300">Valor do imóvel</dt>
              <dd className="font-semibold text-slate-50">
                {formatBRL(summary.valor_imovel)}
              </dd>
            </div>
            <div className="flex justify-between gap-3 rounded-xl bg-white/5 p-3">
              <dt className="text-slate-300">Entrada</dt>
              <dd className="font-semibold text-slate-50">
                {formatBRL(summary.valor_entrada)}
              </dd>
            </div>
            <div className="flex justify-between gap-3 rounded-xl bg-white/5 p-3">
              <dt className="text-slate-300">Valor financiado</dt>
              <dd className="font-semibold text-slate-50">
                {formatBRL(summary.valor_financiado)}
              </dd>
            </div>
          </dl>
        </section>

        <section className="grid min-h-0 gap-3 md:grid-cols-2">
          <MetricCard
            label="Última parcela"
            value={formatBRL(summary.ultima_parcela)}
            note="Mostra queda, estabilidade ou suavização do sistema escolhido."
            tone="cyan"
          />
          <MetricCard
            label="Total amortizado"
            value={formatBRL(summary.total_amortizado)}
            note="Parte do pagamento que reduz o saldo financiado."
            tone="emerald"
          />
          <MetricCard
            label="Total de juros"
            value={formatBRL(summary.total_juros)}
            note="Custo financeiro acumulado ao longo do prazo."
            tone="amber"
          />
          <MetricCard
            label="Custo total"
            value={formatBRL(summary.custo_total)}
            note="Juros somados aos encargos informados nesta simulação."
            tone="violet"
          />
          <article className="rounded-2xl border border-white/10 bg-white/5 p-4 md:col-span-2">
            <h3 className="text-sm font-semibold text-slate-50">
              Interpretação pedagógica
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Compare a primeira parcela com a última, confira a tabela e abra a
              memória de cálculo para enxergar como entrada, fórmula,
              amortização, juros e encargos chegam ao total pago.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                className="rounded-lg bg-cyan-300 px-3 py-2 text-xs font-bold text-slate-950"
                type="button"
                onClick={() => onOpen("tabela")}
              >
                Ver tabela
              </button>
              <button
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-100"
                type="button"
                onClick={() => onOpen("memoria")}
              >
                Ver memória
              </button>
            </div>
          </article>
        </section>
      </div>
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
  return (
    <section className="h-full min-h-0 overflow-hidden">
      <PanelHeader
        eyebrow="Comparação"
        title="SAC x PRICE com os mesmos parâmetros"
        description="A comparação usa as mesmas entradas da simulação para mostrar esforço inicial, custo total, juros e comportamento da parcela."
        onBack={onBack}
      />
      <div
        className="grid h-[calc(100%-74px)] min-h-0 gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]"
        data-testid="financiamento-compare-summary"
      >
        <div className="grid min-h-0 gap-3 md:grid-cols-2">
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
          <article className="rounded-2xl border border-violet-200/20 bg-violet-300/10 p-4 md:col-span-2">
            <h3 className="text-sm font-semibold text-violet-100">
              Leitura pedagógica
            </h3>
            <p className="mt-2 text-sm leading-6 text-violet-50/85">
              {compare.comparacao.explicacao_pedagogica}
            </p>
            <p className="mt-2 text-xs leading-5 text-violet-50/70">
              {compare.comparacao.comportamento_saldo_devedor}
            </p>
          </article>
        </div>
        <FinanciamentoCompareChart compare={compare} />
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
  return (
    <section className="h-full min-h-0 overflow-hidden">
      <PanelHeader
        eyebrow="Tabela"
        title={`${result.parcelas.length} parcelas geradas`}
        description="A tabela preserva o prazo inteiro no modelo e exibe faixas compactas, com linha final de totais para auditoria financeira."
        onBack={onBack}
      />
      <div className="h-[calc(100%-74px)] min-h-0">
        <FinanciamentoTable
          parcelas={result.parcelas}
          summary={result.summary}
        />
      </div>
    </section>
  );
}

function FormulaCard({
  title,
  children,
}: {
  readonly title: string;
  readonly children: ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-emerald-200/15 bg-emerald-300/10 p-4">
      <h3 className="text-sm font-semibold text-emerald-100">{title}</h3>
      <div className="mt-3 space-y-2 text-sm leading-6 text-emerald-50/85">
        {children}
      </div>
    </article>
  );
}

function MemoryPanel({
  memoria,
  onBack,
}: {
  readonly memoria: FinanciamentoMemoriaCalculo;
  readonly onBack: () => void;
}) {
  const primeira = memoria.primeira_parcela;
  const ultima = memoria.ultima_parcela;
  return (
    <section className="h-full min-h-0 overflow-hidden">
      <PanelHeader
        eyebrow="Memória de cálculo"
        title="Da entrada ao resultado, sem caixa-preta"
        description="A memória mostra fórmulas, variáveis, valores substituídos, arredondamento e como conferir a primeira e a última parcela na tabela."
        onBack={onBack}
      />
      <div
        className="grid h-[calc(100%-74px)] min-h-0 gap-3 lg:grid-cols-[minmax(0,1fr)_320px]"
        data-testid="financiamento-memory-panel"
      >
        <div className="grid min-h-0 gap-3 overflow-hidden">
          <FormulaCard title="SAC — blocos de cálculo">
            <p>
              <strong>Amortização mensal:</strong> A = Valor financiado ÷ prazo
            </p>
            <p>
              <strong>Juros do mês:</strong> saldo devedor anterior × taxa
              mensal
            </p>
            <p>
              <strong>Parcela:</strong> amortização + juros do mês + encargos
            </p>
            <p>
              <strong>Saldo final:</strong> saldo anterior − amortização
            </p>
          </FormulaCard>
          <FormulaCard title="PRICE — parcela fixa base">
            <p className="rounded-xl bg-slate-950/55 p-3 font-mono text-xs text-emerald-100">
              PMT = PV × [ i × (1 + i)^n ] ÷ [ (1 + i)^n − 1 ]
            </p>
            <p>
              PV é o valor financiado, i é a taxa mensal, n é o prazo em meses e
              PMT é a parcela sem encargos mensais.
            </p>
          </FormulaCard>
          <FormulaCard title="Valores substituídos e rastreabilidade">
            <p>{memoria.substituicao}</p>
            <dl className="grid gap-2 text-xs md:grid-cols-3">
              {Object.entries(memoria.variaveis).map(([key, value]) => (
                <div
                  key={key}
                  className="rounded-xl border border-white/10 bg-white/5 p-3"
                >
                  <dt className="text-emerald-100">{key}</dt>
                  <dd className="mt-1 font-mono text-slate-50">
                    {String(value)}
                  </dd>
                </div>
              ))}
            </dl>
          </FormulaCard>
        </div>
        <aside className="rounded-2xl border border-amber-200/20 bg-amber-300/10 p-4 text-amber-50">
          <h3 className="text-sm font-semibold">Passo a passo auditável</h3>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt>1ª parcela</dt>
              <dd className="font-semibold">{formatBRL(primeira.prestacao)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Juros iniciais</dt>
              <dd className="font-semibold">{formatBRL(primeira.juros)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Amortização inicial</dt>
              <dd className="font-semibold">
                {formatBRL(primeira.amortizacao)}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Última parcela</dt>
              <dd className="font-semibold">{formatBRL(ultima.prestacao)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Saldo final</dt>
              <dd className="font-semibold">{formatBRL(ultima.saldo_final)}</dd>
            </div>
          </dl>
          <p className="mt-4 text-sm leading-6 text-amber-50/80">
            Arredondamento: {memoria.arredondamento}. Confira os mesmos valores
            na tabela para rastrear entrada, fórmula, cálculo e resultado.
          </p>
        </aside>
      </div>
    </section>
  );
}

function SourcesPanel({
  result,
  onBack,
}: {
  readonly result: FinanciamentoImobOut | undefined;
  readonly onBack: () => void;
}) {
  const fontes =
    result !== undefined && result.fontes.length > 0
      ? result.fontes
      : OFFICIAL_SOURCES;
  const alertas =
    result === undefined
      ? [
          "Simulação educacional não substitui contrato real.",
          "CET, seguros, tarifas, renda, documentação, avaliação do imóvel e política da instituição podem alterar a contratação.",
          "Aprovação depende de análise de crédito e regras vigentes da instituição financeira.",
        ]
      : [...result.alertas, ...result.limites, ...result.mensagens_interface];

  return (
    <section className="h-full min-h-0 overflow-hidden">
      <PanelHeader
        eyebrow="Fontes, limites e alertas"
        title="O que a simulação mostra e o que ela não promete"
        description="Este painel separa finalidade educacional, limites práticos e fontes institucionais para evitar interpretação contratual indevida."
        onBack={onBack}
      />
      <div
        className="grid h-[calc(100%-74px)] min-h-0 gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.75fr)]"
        data-testid="financiamento-fontes-panel"
      >
        <div className="grid min-h-0 gap-3">
          <article className="rounded-2xl border border-cyan-200/10 bg-slate-950/45 p-4">
            <h3 className="text-sm font-semibold text-cyan-100">
              A simulação considera
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Valor do imóvel, entrada, valor financiado, prazo, taxa mensal,
              sistema SAC ou PRICE, seguros e tarifas quando informados.
            </p>
          </article>
          <article className="rounded-2xl border border-amber-200/20 bg-amber-300/10 p-4">
            <h3 className="text-sm font-semibold text-amber-100">
              A simulação não considera
            </h3>
            <p className="mt-2 text-sm leading-6 text-amber-50/80">
              Proposta bancária formal, aprovação de crédito, variação da renda,
              política específica da instituição, avaliação final do imóvel,
              documentação, regras vigentes de FGTS e CET oficial atualizado.
            </p>
          </article>
          <div className="grid gap-3 md:grid-cols-3">
            {fontes.map((fonte) => (
              <article
                key={`${fonte.nome}-${fonte.tipo}`}
                className="rounded-xl border border-white/10 bg-white/5 p-3"
              >
                <p className="text-xs font-semibold text-slate-50">
                  {fonte.nome}
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-cyan-200/70">
                  {fonte.tipo}
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-300">
                  {fonte.observacao}
                </p>
              </article>
            ))}
          </div>
        </div>
        <aside className="rounded-2xl border border-rose-200/20 bg-rose-300/10 p-4">
          <h3 className="text-sm font-semibold text-rose-100">
            Alertas antes de contratar
          </h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-rose-50/85">
            {alertas.map((alerta) => (
              <li key={alerta}>- {alerta}</li>
            ))}
          </ul>
        </aside>
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
      className="h-[calc(100vh-7rem)] min-h-0 overflow-hidden rounded-3xl border border-cyan-200/10 bg-[#0a101e] p-4 text-slate-100 shadow-2xl shadow-black/35"
      data-testid="financiamento-cockpit"
      data-no-page-scroll="true"
    >
      <main
        className="h-full min-h-0 overflow-hidden rounded-3xl border border-cyan-200/10 bg-slate-900/80 p-4"
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
            <ResultPanel result={simulated} onBack={goBack} onOpen={openView} />
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
            <MemoryPanel memoria={simulated.memoria_calculo} onBack={goBack} />
          ) : (
            <LockedPanel
              eyebrow="Memória"
              title="Memória de cálculo"
              onBack={goBack}
              onStart={() => openView("simulacao")}
            />
          ))}

        {view === "fontes" && (
          <SourcesPanel result={simulated} onBack={goBack} />
        )}
      </main>
    </div>
  );
}
