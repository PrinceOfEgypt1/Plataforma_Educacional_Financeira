"use client";

/**
 * RealEstateF8FObservatory — Implementação React fiel ao protótipo F8E-AJ1 aprovado
 * Frente: 14F-F8F (fase A — base + integração real + arquitetura)
 *
 * Substitui visualmente o cockpit antigo na rota /financiamento-imobiliario.
 * Integração financeira REAL via serviços já existentes:
 *   - simularFinanciamentoImobiliario  → POST /financing/real_estate
 *   - compararFinanciamentos           → POST /financing/real_estate/compare
 *
 * Não há motor financeiro paralelo no frontend. Não há mock estático
 * substituindo integração. Cálculo continua sendo do backend.
 *
 * Cobertura de etapas (F8F-A):
 *   - Etapa 1 (Preparar)   — conteúdo educacional estático fiel ao protótipo
 *   - Etapa 2 (Simular)    — form real com validação existente
 *   - Etapa 3 (Resultado)  — dados reais do backend
 *   - Etapa 4 (Entender)   — derivações educacionais do resultado real
 *   - Etapa 5 (Comparar)   — chamada real ao serviço de comparação
 *   - Etapa 6 (Conferir)   — fórmulas + variáveis (texto real, valores do resultado)
 *   - Etapa 7 (Decidir)    — checklist + cuidados (conteúdo educacional)
 *
 * F8F-B refinará o aprofundamento pedagógico de cada aba.
 */

import {
  useCallback,
  useMemo,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";

import { AlertBanner } from "@/components/ui/AlertBanner";
import { describeApiError } from "@/lib/api/problem";
import { formatBRL, formatRatePct } from "@/lib/money";
import { RealEstateCompareChart } from "@/components/financing/RealEstateCompareChart";
import { RealEstateFinancingTable } from "@/components/financing/RealEstateFinancingTable";
import {
  compararFinanciamentos,
  simularFinanciamentoImobiliario,
  type FinanciamentoApiError,
} from "@/services/financing/financiamentoService";
import type {
  FinanciamentoImobCompareOut,
  FinanciamentoImobOut,
  FinanciamentoImobRequest,
  FinanciamentoImobSummary,
  SistemaAmortizacao,
} from "@/types/financing";

import {
  validateFinanciamentoDraft,
  type FinanciamentoDraft,
  type FinanciamentoFieldErrors,
} from "../formValidation";
import {
  Alert,
  ApplyCard,
  AuroraCard,
  BeforeAfterCard,
  Card,
  CardEyebrow,
  CardTitle,
  ChecklistCard,
  Formula,
  Insight,
  Kpi,
  MiniSummary,
  ScoreCard,
} from "./elements";
import { ETAPAS, F8F_FONTS, F8F_TOKENS, type EtapaKey } from "./tokens";

/* ===========================================================
   Tipos locais
   =========================================================== */

type SimulateState =
  | { readonly status: "idle" }
  | { readonly status: "loading" }
  | { readonly status: "ok"; readonly result: FinanciamentoImobOut }
  | { readonly status: "error"; readonly error: FinanciamentoApiError };

type CompareState =
  | { readonly status: "idle" }
  | { readonly status: "loading" }
  | { readonly status: "ok"; readonly result: FinanciamentoImobCompareOut }
  | { readonly status: "error"; readonly error: FinanciamentoApiError };

interface StageHeaderProps {
  readonly etapaN: number;
  readonly etapaLabel: string;
  readonly title: string;
  readonly subtitle: string;
  readonly scenario: ReadonlyArray<{ readonly k: string; readonly v: string }>;
}

const INITIAL_DRAFT: FinanciamentoDraft = {
  valorImovel: "870000,00",
  valorEntrada: "700000,00",
  prazoMeses: "120",
  taxaJurosMensalPercentual: "0,85",
  sistemaAmortizacao: "SAC",
  seguroMensal: "180,00",
  tarifaMensal: "25,00",
};

/* ===========================================================
   Componente principal
   =========================================================== */

export interface RealEstateF8FObservatoryProps {
  /** Permite testes injetarem implementações dos serviços. */
  readonly simulateFn?: typeof simularFinanciamentoImobiliario;
  readonly compareFn?: typeof compararFinanciamentos;
}

export function RealEstateF8FObservatory({
  simulateFn = simularFinanciamentoImobiliario,
  compareFn = compararFinanciamentos,
}: RealEstateF8FObservatoryProps = {}) {
  const [etapaIdx, setEtapaIdx] = useState(0);
  const [abaIdx, setAbaIdx] = useState(0);
  const [draft, setDraft] = useState<FinanciamentoDraft>(INITIAL_DRAFT);
  const [fieldErrors, setFieldErrors] = useState<FinanciamentoFieldErrors>({});
  const [simulate, setSimulate] = useState<SimulateState>({ status: "idle" });
  const [compare, setCompare] = useState<CompareState>({ status: "idle" });

  const etapa = ETAPAS[etapaIdx]!;

  /* navegação ----------------------------------------------- */
  const goEtapa = useCallback((idx: number) => {
    setEtapaIdx(idx);
    setAbaIdx(0);
    if (
      typeof window !== "undefined" &&
      typeof window.scrollTo === "function"
    ) {
      try {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch {
        // Ambiente de teste (jsdom) pode não implementar scrollTo
      }
    }
  }, []);
  const goAba = useCallback((idx: number) => {
    setAbaIdx(idx);
  }, []);
  const next = useCallback(() => {
    const e = ETAPAS[etapaIdx]!;
    if (abaIdx < e.abas.length - 1) setAbaIdx(abaIdx + 1);
    else if (etapaIdx < ETAPAS.length - 1) {
      setEtapaIdx(etapaIdx + 1);
      setAbaIdx(0);
    }
    if (
      typeof window !== "undefined" &&
      typeof window.scrollTo === "function"
    ) {
      try {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch {
        // Ambiente de teste (jsdom) pode não implementar scrollTo
      }
    }
  }, [etapaIdx, abaIdx]);
  const prev = useCallback(() => {
    if (abaIdx > 0) setAbaIdx(abaIdx - 1);
    else if (etapaIdx > 0) {
      setEtapaIdx(etapaIdx - 1);
      setAbaIdx(ETAPAS[etapaIdx - 1]!.abas.length - 1);
    }
    if (
      typeof window !== "undefined" &&
      typeof window.scrollTo === "function"
    ) {
      try {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch {
        // Ambiente de teste (jsdom) pode não implementar scrollTo
      }
    }
  }, [etapaIdx, abaIdx]);

  /* simulação ----------------------------------------------- */
  const submitSimulation = useCallback(
    async (e?: FormEvent) => {
      e?.preventDefault();
      const validation = validateFinanciamentoDraft(draft);
      if (!validation.ok) {
        setFieldErrors(validation.errors);
        return;
      }
      setFieldErrors({});
      setSimulate({ status: "loading" });
      try {
        const result = await simulateFn(validation.value);
        setSimulate({ status: "ok", result });
        goEtapa(2);
      } catch (err) {
        setSimulate({
          status: "error",
          error: err as FinanciamentoApiError,
        });
      }
    },
    [draft, simulateFn, goEtapa],
  );

  const runCompare = useCallback(async () => {
    const validation = validateFinanciamentoDraft(draft);
    if (!validation.ok) {
      setFieldErrors(validation.errors);
      goEtapa(1);
      return;
    }
    const baseRequest: FinanciamentoImobRequest = validation.value;
    const compareRequest = {
      valor_imovel: baseRequest.valor_imovel,
      valor_entrada: baseRequest.valor_entrada,
      prazo_meses: baseRequest.prazo_meses,
      taxa_juros_mensal_percentual: baseRequest.taxa_juros_mensal_percentual,
      ...(baseRequest.seguro_mensal !== undefined
        ? { seguro_mensal: baseRequest.seguro_mensal }
        : {}),
      ...(baseRequest.tarifa_mensal !== undefined
        ? { tarifa_mensal: baseRequest.tarifa_mensal }
        : {}),
      ...(baseRequest.custo_administrativo_mensal !== undefined
        ? {
            custo_administrativo_mensal:
              baseRequest.custo_administrativo_mensal,
          }
        : {}),
    };
    setCompare({ status: "loading" });
    try {
      const result = await compareFn(compareRequest);
      setCompare({ status: "ok", result });
    } catch (err) {
      setCompare({ status: "error", error: err as FinanciamentoApiError });
    }
  }, [draft, compareFn, goEtapa]);

  /* scenario pill ------------------------------------------- */
  const scenarioRows = useMemo<StageHeaderProps["scenario"]>(() => {
    const v = draft;
    const formatMoney = (raw: string): string => {
      const cleaned = raw.replace(/\./g, "").replace(",", ".");
      const num = parseFloat(cleaned);
      return Number.isFinite(num) ? formatBRL(num.toFixed(2)) : raw;
    };
    const imovel = formatMoney(v.valorImovel || "0");
    const entrada = formatMoney(v.valorEntrada || "0");
    const cleanedI = parseFloat(
      (v.valorImovel || "0").replace(/\./g, "").replace(",", "."),
    );
    const cleanedE = parseFloat(
      (v.valorEntrada || "0").replace(/\./g, "").replace(",", "."),
    );
    const financiado =
      Number.isFinite(cleanedI) && Number.isFinite(cleanedE)
        ? formatBRL((cleanedI - cleanedE).toFixed(2))
        : "—";
    return [
      { k: "Imóvel", v: imovel },
      { k: "Entrada", v: entrada },
      { k: "Financiado", v: financiado },
      { k: "Prazo", v: `${v.prazoMeses || "—"} meses` },
      {
        k: "Taxa",
        v:
          v.taxaJurosMensalPercentual.trim() === ""
            ? "—"
            : `${v.taxaJurosMensalPercentual}% a.m.`,
      },
    ];
  }, [draft]);

  /* render --------------------------------------------------- */
  return (
    <div
      data-testid="real-estate-f8f-observatory"
      style={
        {
          "--font-sans-f8f": F8F_FONTS.sans,
          "--font-mono-f8f": F8F_FONTS.mono,
          background: F8F_TOKENS.bg,
          color: F8F_TOKENS.text,
          fontFamily: "var(--font-sans-f8f)",
          // F8F-AJ2: ocupar exatamente a área disponível do shell pai
          // (cockpit-main já é overflow:hidden + min-height:0) e organizar
          // verticalmente: TopBar + Stepper + SubTabs (topo fixo) + área
          // central scrollável + NavFooter (rodapé sempre visível).
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          overflow: "hidden",
        } as CSSProperties
      }
    >
      <div style={{ flexShrink: 0 }}>
        <TopBar />
        <Stepper etapaIdx={etapaIdx} onSelect={goEtapa} testId="f8f-stepper" />
        <SubTabs etapaIdx={etapaIdx} abaIdx={abaIdx} onSelect={goAba} />
      </div>

      {/* Área central scrollável: garante que o conteúdo denso (Etapa 5.2 /
          5.3 / 7.2 etc.) role internamente sem empurrar o NavFooter para
          fora da viewport em zoom 100%. */}
      <div
        data-testid="f8f-scroll-area"
        style={{
          flex: "1 1 0",
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <main
          style={{
            maxWidth: 1480,
            margin: "0 auto",
            padding: "1.4rem 2rem 2rem",
            position: "relative",
          }}
        >
          <StageHeader
            etapaN={etapa.n}
            etapaLabel={etapa.label}
            title={STAGE_TITLES[etapa.key][abaIdx]!}
            subtitle={STAGE_SUBS[etapa.key][abaIdx]!}
            scenario={scenarioRows}
          />

          <Panel
            etapaKey={etapa.key}
            abaIdx={abaIdx}
            draft={draft}
            setDraft={setDraft}
            fieldErrors={fieldErrors}
            simulate={simulate}
            compare={compare}
            onSubmit={submitSimulation}
            onCompare={runCompare}
            onGoEtapa={goEtapa}
          />
        </main>
      </div>

      {/* NavFooter fixo no rodapé do shell: AJ2 §1 — Anterior/Próxima
          sempre visíveis em zoom 100%. */}
      <div style={{ flexShrink: 0 }}>
        <NavFooter
          etapaN={etapa.n}
          abaPos={abaIdx + 1}
          abaTotal={etapa.abas.length}
          onPrev={prev}
          onNext={next}
        />
      </div>
    </div>
  );
}

/* ===========================================================
   Subcomponentes de layout
   =========================================================== */

function TopBar() {
  return (
    <header
      style={{
        // F8F-AJ2: o pai do Observatory é um flex column com header/stepper
        // fora do scroll. Sticky não é mais necessário; mantém background
        // opaco para o overlay visual.
        background: "rgba(3,8,17,.92)",
        backdropFilter: "blur(10px)",
        borderBottom: `1px solid ${F8F_TOKENS.border}`,
      }}
    >
      <div
        style={{
          maxWidth: 1480,
          margin: "0 auto",
          padding: ".85rem 2rem",
          display: "flex",
          alignItems: "center",
          gap: "1.4rem",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: ".65rem",
            fontFamily: "var(--font-mono-f8f)",
            fontSize: ".78rem",
            letterSpacing: ".14em",
            textTransform: "uppercase",
            color: F8F_TOKENS.textDim,
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${F8F_TOKENS.accent}, ${F8F_TOKENS.accent2})`,
              boxShadow: "0 0 16px rgba(59,130,246,.6)",
            }}
            aria-hidden
          />
          <span>
            PEF ·{" "}
            <strong
              style={{
                color: F8F_TOKENS.text,
                fontWeight: 700,
                letterSpacing: ".14em",
              }}
            >
              Financial Observatory
            </strong>
          </span>
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono-f8f)",
            fontSize: ".72rem",
            color: F8F_TOKENS.textMuted,
            letterSpacing: ".08em",
          }}
        >
          Plataforma <span style={{ color: F8F_TOKENS.border }}>›</span> Módulos{" "}
          <span style={{ color: F8F_TOKENS.border }}>›</span>{" "}
          <span style={{ color: F8F_TOKENS.accent2 }}>
            Financiamento Imobiliário
          </span>
        </div>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            fontFamily: "var(--font-mono-f8f)",
            fontSize: ".68rem",
            letterSpacing: ".12em",
            color: F8F_TOKENS.textMuted,
            textTransform: "uppercase",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: ".45rem",
              background: F8F_TOKENS.surface2,
              border: `1px solid ${F8F_TOKENS.border}`,
              borderRadius: 999,
              padding: ".3rem .75rem",
              color: F8F_TOKENS.accent2,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: F8F_TOKENS.green,
                boxShadow: "0 0 8px rgba(16,185,129,.7)",
              }}
              aria-hidden
            />
            F8F-A · fiel F8E-AJ1
          </span>
        </div>
      </div>
    </header>
  );
}

function Stepper({
  etapaIdx,
  onSelect,
  testId,
}: {
  readonly etapaIdx: number;
  readonly onSelect: (idx: number) => void;
  readonly testId?: string;
}) {
  return (
    <nav
      aria-label="Etapas da jornada"
      data-testid={testId}
      style={{
        // F8F-AJ2: sticky removido — o stepper já está no bloco de topo
        // fixo do Observatory (fora do scroll central).
        background: "rgba(3,8,17,.92)",
        backdropFilter: "blur(10px)",
        borderBottom: `1px solid ${F8F_TOKENS.border}`,
      }}
    >
      <div
        style={{
          maxWidth: 1480,
          margin: "0 auto",
          padding: ".8rem 2rem",
          display: "flex",
          alignItems: "center",
          gap: ".6rem",
          overflowX: "auto",
        }}
      >
        {ETAPAS.map((e, i) => {
          const isActive = i === etapaIdx;
          const isDone = i < etapaIdx;
          return (
            <button
              key={e.key}
              type="button"
              data-testid={`f8f-step-${e.n}`}
              data-active={isActive ? "true" : "false"}
              onClick={() => onSelect(i)}
              style={{
                flex: "1 1 0",
                minWidth: 140,
                cursor: "pointer",
                background: isActive
                  ? "linear-gradient(135deg, rgba(59,130,246,.18), rgba(6,182,212,.08))"
                  : "transparent",
                border: `1px solid ${isActive ? F8F_TOKENS.accent : F8F_TOKENS.border}`,
                borderRadius: 10,
                padding: ".6rem .9rem",
                display: "flex",
                alignItems: "center",
                gap: ".65rem",
                color: isActive ? "#fff" : F8F_TOKENS.textDim,
                textAlign: "left",
                fontFamily: "var(--font-sans-f8f)",
                boxShadow: isActive
                  ? "0 0 24px rgba(59,130,246,.18)"
                  : undefined,
              }}
            >
              <span
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 7,
                  background: isActive
                    ? F8F_TOKENS.accent
                    : isDone
                      ? "rgba(16,185,129,.15)"
                      : F8F_TOKENS.surface2,
                  border: `1px solid ${
                    isActive
                      ? F8F_TOKENS.accent
                      : isDone
                        ? "rgba(16,185,129,.4)"
                        : F8F_TOKENS.border
                  }`,
                  color: isActive
                    ? "#fff"
                    : isDone
                      ? F8F_TOKENS.green
                      : F8F_TOKENS.accent,
                  fontFamily: "var(--font-mono-f8f)",
                  fontSize: ".78rem",
                  fontWeight: 500,
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                {e.n}
              </span>
              <span>
                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--font-mono-f8f)",
                    fontSize: ".58rem",
                    letterSpacing: ".14em",
                    textTransform: "uppercase",
                    color: F8F_TOKENS.textMuted,
                    marginBottom: ".15rem",
                  }}
                >
                  Etapa {e.n}
                </span>
                <span
                  style={{
                    fontSize: ".8rem",
                    fontWeight: 500,
                    letterSpacing: ".02em",
                    lineHeight: 1.1,
                    whiteSpace: "nowrap",
                  }}
                >
                  {e.label}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function SubTabs({
  etapaIdx,
  abaIdx,
  onSelect,
}: {
  readonly etapaIdx: number;
  readonly abaIdx: number;
  readonly onSelect: (idx: number) => void;
}) {
  const etapa = ETAPAS[etapaIdx]!;
  return (
    <div
      data-testid="f8f-subtabs"
      style={{
        maxWidth: 1480,
        margin: "1.2rem auto 0",
        padding: "0 2rem",
        display: "flex",
        gap: ".35rem",
        flexWrap: "wrap",
      }}
    >
      {etapa.abas.map((label, i) => {
        const isActive = i === abaIdx;
        return (
          <button
            key={label}
            type="button"
            data-testid={`f8f-subtab-${etapa.n}-${i + 1}`}
            data-active={isActive ? "true" : "false"}
            onClick={() => onSelect(i)}
            style={{
              cursor: "pointer",
              background: isActive ? "rgba(59,130,246,.1)" : F8F_TOKENS.surface,
              border: `1px solid ${isActive ? F8F_TOKENS.accent : F8F_TOKENS.border}`,
              borderRadius: 8,
              padding: ".45rem .85rem",
              fontFamily: "var(--font-sans-f8f)",
              fontSize: ".78rem",
              color: isActive ? "#fff" : F8F_TOKENS.textDim,
              letterSpacing: ".02em",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono-f8f)",
                fontSize: ".68rem",
                color: F8F_TOKENS.accent2,
                marginRight: ".45rem",
              }}
            >
              {etapa.n}.{i + 1}
            </span>
            {label}
          </button>
        );
      })}
    </div>
  );
}

function StageHeader({
  etapaN,
  etapaLabel,
  title,
  subtitle,
  scenario,
}: StageHeaderProps) {
  return (
    <section
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        marginBottom: "1.4rem",
        gap: "2rem",
        flexWrap: "wrap",
      }}
    >
      <div>
        <div
          style={{
            fontFamily: "var(--font-mono-f8f)",
            fontSize: ".68rem",
            letterSpacing: ".16em",
            textTransform: "uppercase",
            color: F8F_TOKENS.accent2,
            marginBottom: ".35rem",
          }}
        >
          Etapa {etapaN} · {etapaLabel}
        </div>
        <h2
          style={{
            fontSize: "1.6rem",
            fontWeight: 700,
            letterSpacing: "-.01em",
            color: "#fff",
            margin: 0,
          }}
          data-testid="f8f-stage-title"
        >
          {title}
        </h2>
        <p
          style={{
            marginTop: ".35rem",
            color: F8F_TOKENS.textDim,
            fontSize: ".92rem",
            maxWidth: 720,
          }}
        >
          {subtitle}
        </p>
      </div>
      <div
        data-testid="f8f-scenario-pill"
        aria-label="Cenário do módulo"
        style={{
          background: F8F_TOKENS.surface,
          border: `1px solid ${F8F_TOKENS.border}`,
          borderRadius: 10,
          padding: ".65rem 1rem",
          display: "flex",
          gap: "1.2rem",
          alignItems: "center",
          fontFamily: "var(--font-mono-f8f)",
          fontSize: ".72rem",
          color: F8F_TOKENS.textDim,
          flexWrap: "wrap",
        }}
      >
        {scenario.map((p, i) => (
          <div
            key={p.k}
            style={{
              ...(i > 0
                ? {
                    paddingLeft: "1.2rem",
                    borderLeft: `1px solid ${F8F_TOKENS.border}`,
                  }
                : {}),
            }}
          >
            <span
              style={{
                color: F8F_TOKENS.textMuted,
                letterSpacing: ".1em",
                textTransform: "uppercase",
                fontSize: ".62rem",
                display: "block",
              }}
            >
              {p.k}
            </span>
            <span style={{ color: F8F_TOKENS.text, fontSize: ".82rem" }}>
              {p.v}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function NavFooter({
  etapaN,
  abaPos,
  abaTotal,
  onPrev,
  onNext,
}: {
  readonly etapaN: number;
  readonly abaPos: number;
  readonly abaTotal: number;
  readonly onPrev: () => void;
  readonly onNext: () => void;
}) {
  return (
    <div
      data-testid="f8f-nav-footer"
      style={{
        // F8F-AJ2 §1: sempre visível no rodapé do shell.
        // Fundo opaco com borda superior para separar do scroll central.
        background: "rgba(3,8,17,.96)",
        backdropFilter: "blur(10px)",
        borderTop: `1px solid ${F8F_TOKENS.border}`,
      }}
    >
      <div
        style={{
          maxWidth: 1480,
          margin: "0 auto",
          padding: ".9rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <button
          type="button"
          onClick={onPrev}
          data-testid="f8f-nav-prev"
          style={ctaGhostStyle}
        >
          ← Anterior
        </button>
        <span
          style={{
            fontFamily: "var(--font-mono-f8f)",
            fontSize: ".7rem",
            color: F8F_TOKENS.textMuted,
            letterSpacing: ".1em",
          }}
        >
          Etapa {etapaN} · Aba {abaPos}/{abaTotal}
        </span>
        <button
          type="button"
          onClick={onNext}
          data-testid="f8f-nav-next"
          style={ctaSolidStyle}
        >
          Próxima →
        </button>
      </div>
    </div>
  );
}

// F8F-AJ2 §3: o card "Aviso de governança" foi removido da UI. Toda a
// informação de governança (fase, integração real, aceite humano pendente,
// Sprint 5 não liberada) permanece materializada na documentação:
// docs/gates/gate-po-ux-valor/14f-f8f-implementacao-react-fiel-f8e-aj1/.

const ctaSolidStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: ".55rem",
  background: `linear-gradient(135deg, ${F8F_TOKENS.accent}, ${F8F_TOKENS.accent2})`,
  color: "#fff",
  border: "none",
  borderRadius: 10,
  padding: ".85rem 1.4rem",
  fontFamily: "var(--font-sans-f8f)",
  fontSize: ".9rem",
  fontWeight: 700,
  cursor: "pointer",
  letterSpacing: ".02em",
  boxShadow: "0 6px 24px rgba(59,130,246,.28)",
};

const ctaGhostStyle: CSSProperties = {
  ...ctaSolidStyle,
  background: "transparent",
  color: F8F_TOKENS.textDim,
  border: `1px solid ${F8F_TOKENS.border}`,
  boxShadow: "none",
};

const ctaAuroraStyle: CSSProperties = {
  position: "relative",
  background: F8F_TOKENS.surface,
  color: "#fff",
  border: "1px solid transparent",
  padding: "1rem 1.6rem",
  borderRadius: 12,
  fontWeight: 700,
  fontSize: ".95rem",
  cursor: "pointer",
  backgroundImage: `linear-gradient(${F8F_TOKENS.surface}, ${F8F_TOKENS.surface}), linear-gradient(135deg, ${F8F_TOKENS.accent}, ${F8F_TOKENS.accent2}, ${F8F_TOKENS.gold})`,
  backgroundOrigin: "border-box",
  backgroundClip: "padding-box, border-box",
};

/* ===========================================================
   Textos das etapas (eyebrow + título + subtítulo)
   =========================================================== */

const STAGE_TITLES: Record<EtapaKey, ReadonlyArray<string>> = {
  preparar: [
    "Visão geral do financiamento imobiliário",
    "O que é a entrada e por que ela importa",
    "Valor financiado: a base de todos os cálculos",
    "SAC e PRICE: dois sistemas, uma decisão",
    "Cinco cuidados antes de assinar o contrato",
  ],
  simular: [
    "Dados do imóvel",
    "Condições do financiamento",
    "Custos mensais e encargos",
    "Sistema de amortização principal",
    "Resumo da simulação",
  ],
  resultado: [
    "Resultado da simulação",
    "Cenário usado no cálculo",
    "Alertas financeiros do resultado",
    "Como ler o resultado de forma pedagógica",
    "Próximo passo da jornada",
  ],
  entender: [
    "A parcela e seus componentes",
    "Amortização: o que volta ao banco",
    "Juros: o preço do dinheiro emprestado",
    "Saldo devedor: a curva da dívida",
    "SAC e PRICE comparados em conceito",
  ],
  comparar: [
    "Resumo comparativo SAC x PRICE",
    "Tabela completa do sistema SAC",
    "Tabela completa do sistema PRICE",
    "Gráfico de comparação SAC x PRICE",
    "Leitura pedagógica da comparação",
  ],
  conferir: [
    "Fórmulas do sistema SAC",
    "Fórmulas do sistema PRICE",
    "Variáveis usadas nos cálculos",
    "Cálculo passo a passo",
    "Auditoria de consistência",
  ],
  decidir: [
    "Diagnóstico final do financiamento",
    "Checklist antes de contratar",
    "Próximos passos concretos",
    "Cuidados no momento de assinar",
    "Conclusão da jornada",
  ],
};

const STAGE_SUBS: Record<EtapaKey, ReadonlyArray<string>> = {
  preparar: [
    "Entenda o que é financiar um imóvel e como você navega pelas 7 etapas educacionais.",
    "A entrada é o dinheiro que sai do seu bolso no ato da compra. Veja como ela define o tamanho do financiamento.",
    "É sobre o valor financiado que o banco aplica taxa e prazo. Aqui você aprende como esse valor nasce.",
    "Conheça a essência de cada sistema antes de comparar números.",
    "Cinco armadilhas comuns: taxas confundidas, encargos escondidos, prazo longo e mais.",
  ],
  simular: [
    "Informe o valor do imóvel e da entrada. O valor financiado é calculado em tempo real para você visualizar o impacto.",
    "Defina o prazo em meses e a taxa de juros mensal.",
    "Encargos mensais incluem seguros e taxas administrativas. Eles não amortizam a dívida.",
    "Escolha o sistema de amortização principal. A comparação SAC x PRICE é feita automaticamente.",
    "Confirme os dados e siga para o resultado.",
  ],
  resultado: [
    "Primeira parcela, última parcela e custo total com leitura clara de cada número.",
    "Os parâmetros que originaram este resultado.",
    "Alertas educacionais sobre o que o cenário diz: custo de juros, prazo longo e atenção com encargos.",
    "O significado dos números e como comparar com referências de mercado.",
    "Você acabou de ver o resultado. Vamos abrir a caixa preta e entender como cada parcela é construída.",
  ],
  entender: [
    "Toda parcela tem três partes: amortização, juros e encargos.",
    "Amortização é a parte da parcela que reduz seu saldo devedor.",
    "Os juros são calculados sobre o saldo devedor. Como o saldo diminui, os juros caem mês a mês.",
    "A dívida começa em valor financiado e termina em zero. A forma como ela cai diferencia SAC e PRICE.",
    "Mesmo cenário, sistemas diferentes. Totais e características lado a lado.",
  ],
  comparar: [
    "Total pago, juros totais e parcelas em um único painel.",
    "Parcelas paginadas com saldo inicial, juros, amortização, encargos e saldo final.",
    "Parcelas do PRICE com a mesma base: mesmo principal, mesma taxa, mesmo prazo, mesmos encargos.",
    "Três grupos visuais: total pago, juros totais e encargos lado a lado.",
    "Quando SAC faz mais sentido, quando PRICE pode ser preferível, e quais fatores afetam sua decisão.",
  ],
  conferir: [
    "Fórmulas do SAC tipografadas com exemplo numérico do cenário.",
    "Fórmulas do PRICE com decomposição da primeira parcela.",
    "Símbolos, descrições e valores no cenário: a tabela de variáveis.",
    "Cálculo passo a passo da primeira parcela com cada operação explicitada.",
    "Verificações de consistência: soma de amortizações, saldo final, encargos totais e base justa.",
  ],
  decidir: [
    "Síntese do custo, comprometimento de renda estimado e tempo de relação com o banco.",
    "Itens práticos para conferir antes de assinar.",
    "Ações concretas: simular em outros bancos, pedir proposta formal, analisar o CET.",
    "Alertas focados no momento da contratação.",
    "O que você aprendeu nesta jornada e como reaproveitar na sua decisão real.",
  ],
};

/* ===========================================================
   Panel principal — switch entre 35 painéis
   =========================================================== */

interface PanelProps {
  readonly etapaKey: EtapaKey;
  readonly abaIdx: number;
  readonly draft: FinanciamentoDraft;
  readonly setDraft: (d: FinanciamentoDraft) => void;
  readonly fieldErrors: FinanciamentoFieldErrors;
  readonly simulate: SimulateState;
  readonly compare: CompareState;
  readonly onSubmit: (e?: FormEvent) => void;
  readonly onCompare: () => void;
  readonly onGoEtapa: (idx: number) => void;
}

function Panel(props: PanelProps) {
  const { etapaKey, abaIdx } = props;

  if (etapaKey === "preparar") return <PreparePanels {...props} idx={abaIdx} />;
  if (etapaKey === "simular") return <SimulatePanels {...props} idx={abaIdx} />;
  if (etapaKey === "resultado") return <ResultPanels {...props} idx={abaIdx} />;
  if (etapaKey === "entender")
    return <UnderstandPanels {...props} idx={abaIdx} />;
  if (etapaKey === "comparar") return <ComparePanels {...props} idx={abaIdx} />;
  if (etapaKey === "conferir") return <CheckPanels {...props} idx={abaIdx} />;
  return <DecidePanels {...props} idx={abaIdx} />;
}

/* ===========================================================
   ETAPA 1 — Preparar (conteúdo educacional)
   =========================================================== */

function PreparePanels({
  idx,
  onGoEtapa,
}: PanelProps & { readonly idx: number }) {
  if (idx === 0) {
    return (
      <div style={grid60_40}>
        <div style={gridStack}>
          <Card soft>
            <CardEyebrow>Conceito</CardEyebrow>
            <CardTitle>O que é financiar um imóvel</CardTitle>
            <p style={pStyle}>
              Financiar um imóvel significa que o banco paga a parte do preço
              que você não tem hoje, e você devolve esse dinheiro{" "}
              <strong style={strong}>em parcelas mensais</strong>, com juros,
              durante muitos anos.
            </p>
            <p style={pStyle}>
              O que você vai aprender aqui: o conceito de entrada, a diferença
              entre <strong style={strong}>SAC</strong> e{" "}
              <strong style={strong}>PRICE</strong>, como ler uma parcela, como
              auditar os cálculos e quais perguntas fazer ao banco antes de
              assinar.
            </p>
          </Card>
          <div style={gridCols3}>
            <Kpi
              label="Valor do imóvel"
              value="R$ 870.000,00"
              foot="Preço total negociado"
              tone="accent"
            />
            <Kpi
              label="Entrada"
              value="R$ 700.000,00"
              foot="Pago no ato da compra"
            />
            <Kpi
              label="Valor financiado"
              value="R$ 170.000,00"
              foot="Devolvido em 120 parcelas"
              tone="gold"
            />
          </div>
          <Insight
            variant="cyan"
            title="Comece pelo cenário fixo"
            body={
              <>
                Para ensinar bem, este módulo usa{" "}
                <strong>um único cenário</strong> em todas as etapas. Você vai
                ver os mesmos R$ 170.000,00 financiados em 120 meses do começo
                ao fim, e isso permite comparar tudo de forma justa.
              </>
            }
          />
        </div>
        <Card>
          <CardEyebrow>As 7 etapas deste módulo</CardEyebrow>
          <CardTitle>Sua jornada educacional</CardTitle>
          {ETAPAS.map((e, i) => (
            <div
              key={e.key}
              style={{
                display: "flex",
                gap: ".7rem",
                alignItems: "flex-start",
                padding: ".5rem 0",
                borderBottom:
                  i < ETAPAS.length - 1
                    ? `1px dashed rgba(26,47,80,.5)`
                    : "none",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono-f8f)",
                  color: F8F_TOKENS.accent2,
                  fontSize: ".7rem",
                  minWidth: 18,
                }}
              >
                {e.n}
              </span>
              <div>
                <div
                  style={{
                    color: F8F_TOKENS.text,
                    fontWeight: 500,
                    fontSize: ".86rem",
                  }}
                >
                  {e.label}
                </div>
                <div style={smallTextStyle}>{e.desc}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    );
  }

  if (idx === 1) {
    return (
      <div style={grid65_35}>
        <Card>
          <CardEyebrow>Conceito</CardEyebrow>
          <CardTitle>Entrada é o dinheiro que sai do seu bolso hoje</CardTitle>
          <p style={pStyle}>
            A entrada é o valor pago à vista, no ato da compra. Quanto maior a
            entrada, <strong style={strong}>menor o valor financiado</strong>,
            menor o saldo devedor inicial e, consequentemente, menores os juros
            pagos ao longo dos anos. Bancos brasileiros costumam exigir{" "}
            <strong style={strong}>no mínimo 20%</strong> do valor do imóvel.
          </p>
        </Card>
        <div style={gridStack}>
          <Kpi
            label="Valor da entrada"
            value="R$ 700.000,00"
            foot="Pago no ato"
            tone="accent"
          />
          <Kpi
            label="% sobre o imóvel"
            value="80,46%"
            foot="Entrada / valor do imóvel"
            tone="gold"
          />
          <Alert
            variant="gold"
            title="Regra prática"
            description={
              <>
                Quanto maior a entrada,{" "}
                <strong>menor o custo total do financiamento</strong>. Cada R$
                10.000 a mais de entrada reduz, no SAC, milhares de reais em
                juros ao longo de 120 meses.
              </>
            }
          />
        </div>
      </div>
    );
  }

  if (idx === 2) {
    return (
      <div style={grid60_40}>
        <div style={gridStack}>
          <Card>
            <CardEyebrow>Definição</CardEyebrow>
            <CardTitle>O valor financiado é a base de tudo</CardTitle>
            <p style={pStyle}>
              É sobre o valor financiado, e não sobre o preço do imóvel, que o
              banco aplica a taxa de juros e o prazo. Por isso, esse número
              precisa estar muito claro para você antes de qualquer simulação.
            </p>
          </Card>
          <Formula label="Fórmula">
            <span style={varStyle}>Valor financiado</span>{" "}
            <span style={opStyle}>=</span>{" "}
            <span style={varStyle}>Valor do imóvel</span>{" "}
            <span style={opStyle}>−</span> <span style={varStyle}>Entrada</span>
          </Formula>
          <Formula label="Aplicando ao cenário">
            <span style={numStyle}>170.000</span> <span style={opStyle}>=</span>{" "}
            <span style={numStyle}>870.000</span> <span style={opStyle}>−</span>{" "}
            <span style={numStyle}>700.000</span>
          </Formula>
        </div>
        <div style={gridStack}>
          <Kpi
            label="Valor financiado"
            value="R$ 170.000,00"
            foot="Base de todos os cálculos"
            tone="gold"
          />
          <Card>
            <CardEyebrow>Impacto</CardEyebrow>
            <CardTitle>O que esse valor define</CardTitle>
            <p style={pStyle}>
              Os <strong style={strong}>R$ 170.000,00</strong> determinam o
              tamanho da amortização mensal, o juro inicial e o saldo devedor
              que será reduzido mês a mês.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  if (idx === 3) {
    return (
      <>
        <div style={baGrid}>
          <BeforeAfterCard
            side={{
              variant: "win",
              title: "SAC",
              badge: "amortização constante",
              rows: [
                { k: "Parcelas", v: "decrescentes" },
                { k: "Amortização", v: "fixa" },
                { k: "Juros", v: "caem mês a mês" },
                { k: "Total de juros", v: "menor (base justa)", tone: "green" },
                {
                  k: "Quando faz sentido",
                  v: "quem aguenta parcela inicial maior",
                },
              ],
            }}
          />
          <BeforeAfterCard
            side={{
              variant: "alt",
              title: "PRICE",
              badge: "parcela constante",
              rows: [
                { k: "Parcelas", v: "fixas (sem encargos)" },
                { k: "Amortização", v: "crescente" },
                { k: "Juros", v: "caem mais devagar" },
                { k: "Total de juros", v: "maior na mesma base", tone: "gold" },
                {
                  k: "Quando faz sentido",
                  v: "quem precisa de previsibilidade",
                },
              ],
            }}
          />
        </div>
        <div style={{ marginTop: "1.2rem" }}>
          <Alert
            variant="red"
            title="Comparação justa exige a mesma base"
            description={
              <>
                Para comparar honestamente SAC x PRICE, é obrigatório usar{" "}
                <strong>mesmo principal, mesma taxa e mesmo prazo</strong>.
                Comparar SAC com prazo curto contra PRICE com prazo longo
                distorce o resultado.
              </>
            }
          />
        </div>
      </>
    );
  }

  // idx === 4
  return (
    <>
      <div style={gridCols2}>
        <Alert
          variant="gold"
          title="Taxa nominal x taxa efetiva"
          description={
            <>
              A taxa que o banco anuncia (nominal) nem sempre é a taxa que você
              paga (efetiva). Verifique sempre a{" "}
              <strong>taxa mensal efetiva</strong> e a{" "}
              <strong>taxa anual equivalente</strong>.
            </>
          }
        />
        <Alert
          variant="red"
          title="CET é o número que importa"
          description={
            <>
              O <strong>Custo Efetivo Total</strong> inclui juros, encargos,
              seguros e tarifas. É o único número que permite comparar propostas
              diferentes de forma honesta.
            </>
          }
        />
        <Alert
          variant="cyan"
          title="Seguros obrigatórios entram na parcela"
          description={
            <>
              <strong>MIP</strong> (morte e invalidez) e <strong>DFI</strong>{" "}
              (danos físicos do imóvel) são obrigatórios e somam ao custo da
              parcela. Eles não reduzem sua dívida.
            </>
          }
        />
        <Alert
          variant="gold"
          title="Prazo longo = custo alto"
          description="Cada ano a mais de prazo aumenta significativamente o total de juros. Faça simulações com prazos diferentes antes de fechar."
        />
      </div>
      <div style={{ marginTop: "1.2rem", textAlign: "center" }}>
        <button
          type="button"
          style={ctaSolidStyle}
          onClick={() => onGoEtapa(1)}
          data-testid="f8f-cta-vamos-simular"
        >
          Pronto. Vamos simular →
        </button>
      </div>
    </>
  );
}

/* ===========================================================
   ETAPA 2 — Simular (form integrado ao backend)
   =========================================================== */

function SimulatePanels({
  idx,
  draft,
  setDraft,
  fieldErrors,
  simulate,
  onSubmit,
}: PanelProps & { readonly idx: number }) {
  const update = <K extends keyof FinanciamentoDraft>(
    key: K,
    value: FinanciamentoDraft[K],
  ) => setDraft({ ...draft, [key]: value });

  if (idx === 0) {
    return (
      <form
        onSubmit={onSubmit}
        data-testid="f8f-simulate-form"
        style={grid60_40}
      >
        <Card>
          <CardEyebrow>Entrada de dados</CardEyebrow>
          <CardTitle>Informe o valor do imóvel e da entrada</CardTitle>
          <div style={{ ...gridCols2, marginTop: "1rem" }}>
            <Field
              label="Valor do imóvel"
              prefix="R$"
              value={draft.valorImovel}
              onChange={(v) => update("valorImovel", v)}
              hint="Preço total negociado com o vendedor."
              error={fieldErrors.valorImovel}
              testId="f8f-field-valor-imovel"
            />
            <Field
              label="Valor da entrada"
              prefix="R$"
              value={draft.valorEntrada}
              onChange={(v) => update("valorEntrada", v)}
              hint="Mínimo recomendado: 20% do valor do imóvel."
              error={fieldErrors.valorEntrada}
              testId="f8f-field-valor-entrada"
            />
          </div>
        </Card>
        <div style={gridStack}>
          <Insight
            variant="cyan"
            title="Por que separar imóvel e entrada"
            body={
              <>
                O banco não financia o valor cheio do imóvel. Sempre é exigida
                uma entrada, e o financiamento começa a partir da diferença.
              </>
            }
          />
          {simulate.status === "loading" ? (
            <Alert
              variant="cyan"
              title="Calculando…"
              description="A simulação real está sendo executada no backend."
            />
          ) : null}
          {simulate.status === "error" ? (
            <SimulateErrorView error={simulate.error} />
          ) : null}
        </div>
      </form>
    );
  }

  if (idx === 1) {
    return (
      <div style={gridCols2}>
        <Field
          label="Prazo do financiamento"
          value={draft.prazoMeses}
          onChange={(v) => update("prazoMeses", v)}
          hint="Em meses. Bancos brasileiros oferecem de 60 a 420."
          suffix="meses"
          error={fieldErrors.prazoMeses}
          testId="f8f-field-prazo"
        />
        <Field
          label="Taxa de juros mensal"
          value={draft.taxaJurosMensalPercentual}
          onChange={(v) => update("taxaJurosMensalPercentual", v)}
          hint="Verifique a taxa efetiva mensal, não a nominal."
          suffix="% a.m."
          error={fieldErrors.taxaJurosMensalPercentual}
          testId="f8f-field-taxa"
        />
      </div>
    );
  }

  if (idx === 2) {
    return (
      <div style={grid60_40}>
        <div style={gridStack}>
          <Field
            label="Seguro mensal"
            prefix="R$"
            value={draft.seguroMensal}
            onChange={(v) => update("seguroMensal", v)}
            hint="MIP + DFI (Morte/Invalidez e Danos Físicos do Imóvel)."
            suffix="/ mês"
            error={fieldErrors.seguroMensal}
            testId="f8f-field-seguro"
          />
          <Field
            label="Tarifa mensal"
            prefix="R$"
            value={draft.tarifaMensal}
            onChange={(v) => update("tarifaMensal", v)}
            hint="Taxa de administração ou outros encargos mensais."
            suffix="/ mês"
            error={fieldErrors.tarifaMensal}
            testId="f8f-field-tarifa"
          />
        </div>
        <div style={gridStack}>
          <Insight
            title="O que são os encargos"
            body={
              <>
                Cobrem <strong>seguros MIP/DFI</strong> e{" "}
                <strong>taxa administrativa</strong>. Aparecem em toda parcela e
                não reduzem o saldo devedor.
              </>
            }
          />
          <Alert
            variant="red"
            title="Encargos não amortizam"
            description="Esses valores mensais não diminuem sua dívida — apenas custeiam seguros e administração."
          />
        </div>
      </div>
    );
  }

  if (idx === 3) {
    return (
      <div style={gridCols2}>
        <Card>
          <CardEyebrow>Selecione o sistema principal</CardEyebrow>
          <CardTitle>Qual sistema você quer ver primeiro?</CardTitle>
          <div style={{ display: "grid", gap: ".55rem", marginTop: "1rem" }}>
            {(["SAC", "PRICE"] as ReadonlyArray<SistemaAmortizacao>).map(
              (s) => (
                <RadioOpt
                  key={s}
                  label={s === "SAC" ? "SAC — recomendado" : "PRICE"}
                  description={
                    s === "SAC"
                      ? "Amortização fixa, parcelas decrescentes. Menor custo total no mesmo prazo."
                      : "Parcela fixa, amortização crescente. Maior previsibilidade no início."
                  }
                  selected={draft.sistemaAmortizacao === s}
                  onSelect={() => update("sistemaAmortizacao", s)}
                  testId={`f8f-radio-${s.toLowerCase()}`}
                />
              ),
            )}
          </div>
        </Card>
        <Card>
          <CardEyebrow>
            Sistema selecionado · {draft.sistemaAmortizacao}
          </CardEyebrow>
          <CardTitle>
            {draft.sistemaAmortizacao === "SAC"
              ? "Por que SAC costuma vencer no total"
              : "Por que PRICE oferece previsibilidade"}
          </CardTitle>
          <p style={pStyle}>
            {draft.sistemaAmortizacao === "SAC"
              ? "No SAC você amortiza um valor fixo todo mês. O saldo devedor cai mais rápido, então os juros (calculados sobre o saldo) também caem. O resultado é menor total de juros pagos no mesmo prazo."
              : "No PRICE, a parcela financeira é constante. Você paga o mesmo valor todo mês, ganhando previsibilidade orçamentária ao custo de um total de juros um pouco maior."}
          </p>
          <Alert
            variant="cyan"
            title="Comparação automática"
            description="Mesmo escolhendo um sistema, a etapa Comparar mostra SAC e PRICE lado a lado com a mesma base."
          />
        </Card>
      </div>
    );
  }

  // idx === 4 — Resumo + CTA
  return (
    <form
      onSubmit={onSubmit}
      data-testid="f8f-simulate-resumo"
      style={grid65_35}
    >
      <Card>
        <CardEyebrow>Resumo dos parâmetros</CardEyebrow>
        <CardTitle>Tudo pronto para o cálculo</CardTitle>
        <div style={{ ...gridCols2, marginTop: "1rem" }}>
          <MiniSummary k="Valor do imóvel" v={`R$ ${draft.valorImovel}`} />
          <MiniSummary k="Valor da entrada" v={`R$ ${draft.valorEntrada}`} />
          <MiniSummary k="Prazo" v={`${draft.prazoMeses} meses`} />
          <MiniSummary
            k="Taxa mensal"
            v={`${draft.taxaJurosMensalPercentual}%`}
          />
          <MiniSummary
            k="Seguro mensal"
            v={`R$ ${draft.seguroMensal || "0,00"}`}
          />
          <MiniSummary
            k="Tarifa mensal"
            v={`R$ ${draft.tarifaMensal || "0,00"}`}
          />
          <MiniSummary k="Sistema principal" v={draft.sistemaAmortizacao} />
          <MiniSummary k="Comparativo automático" v="SAC x PRICE" />
        </div>
      </Card>
      <div style={gridStack}>
        <Insight
          variant="cyan"
          title="O backend faz o cálculo"
          body={
            <>
              Ao clicar em <strong>Calcular</strong>, a aplicação envia os dados
              para o motor financeiro oficial via POST{" "}
              <code style={{ fontFamily: "var(--font-mono-f8f)" }}>
                /financing/real_estate
              </code>
              .
            </>
          }
        />
        <div style={{ textAlign: "center", marginTop: ".5rem" }}>
          <button
            type="submit"
            style={ctaAuroraStyle}
            data-testid="f8f-cta-calcular"
            disabled={simulate.status === "loading"}
          >
            {simulate.status === "loading"
              ? "Calculando…"
              : "Calcular — Ver Resultado"}
          </button>
        </div>
        {simulate.status === "error" ? (
          <SimulateErrorView error={simulate.error} />
        ) : null}
      </div>
    </form>
  );
}

function SimulateErrorView({
  error,
}: {
  readonly error: FinanciamentoApiError;
}) {
  return (
    <div data-testid="f8f-simulate-error">
      <AlertBanner level="error" title="Não foi possível simular">
        {describeApiError(error)}
      </AlertBanner>
    </div>
  );
}

interface FieldProps {
  readonly label: string;
  readonly value: string;
  readonly onChange: (v: string) => void;
  readonly hint?: string | undefined;
  readonly prefix?: string | undefined;
  readonly suffix?: string | undefined;
  readonly error?: string | undefined;
  readonly testId?: string | undefined;
}

function Field({
  label,
  value,
  onChange,
  hint,
  prefix,
  suffix,
  error,
  testId,
}: FieldProps) {
  return (
    <div>
      <div
        style={{
          background: F8F_TOKENS.surface2,
          border: `1px solid ${error ? F8F_TOKENS.red : F8F_TOKENS.border}`,
          borderRadius: 10,
          padding: ".9rem 1rem",
        }}
      >
        <label
          style={{
            display: "block",
            fontFamily: "var(--font-mono-f8f)",
            fontSize: ".65rem",
            letterSpacing: ".14em",
            textTransform: "uppercase",
            color: F8F_TOKENS.textDim,
            marginBottom: ".35rem",
          }}
        >
          {label}
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
          {prefix ? (
            <span
              style={{
                fontFamily: "var(--font-mono-f8f)",
                fontSize: ".82rem",
                color: F8F_TOKENS.accent2,
              }}
            >
              {prefix}
            </span>
          ) : null}
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            data-testid={testId}
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              color: F8F_TOKENS.text,
              fontFamily: "var(--font-mono-f8f)",
              fontSize: "1.05rem",
              fontWeight: 500,
            }}
          />
          {suffix ? (
            <span
              style={{
                fontFamily: "var(--font-mono-f8f)",
                fontSize: ".72rem",
                color: F8F_TOKENS.textMuted,
              }}
            >
              {suffix}
            </span>
          ) : null}
        </div>
      </div>
      <div
        style={{
          fontSize: ".74rem",
          color: error ? F8F_TOKENS.red : F8F_TOKENS.textDim,
          marginTop: ".35rem",
          paddingLeft: ".2rem",
        }}
      >
        {error || hint}
      </div>
    </div>
  );
}

function RadioOpt({
  label,
  description,
  selected,
  onSelect,
  testId,
}: {
  readonly label: string;
  readonly description: string;
  readonly selected: boolean;
  readonly onSelect: () => void;
  readonly testId?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      data-testid={testId}
      data-selected={selected ? "true" : "false"}
      style={{
        display: "flex",
        alignItems: "center",
        gap: ".7rem",
        padding: ".85rem 1rem",
        background: selected ? "rgba(59,130,246,.08)" : F8F_TOKENS.surface2,
        border: `1px solid ${selected ? F8F_TOKENS.accent : F8F_TOKENS.border}`,
        borderRadius: 10,
        cursor: "pointer",
        textAlign: "left",
        color: "inherit",
        width: "100%",
      }}
    >
      <span
        style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          border: `1.5px solid ${selected ? F8F_TOKENS.accent : F8F_TOKENS.border}`,
          flexShrink: 0,
          position: "relative",
          background: F8F_TOKENS.surface,
        }}
      >
        {selected ? (
          <span
            style={{
              position: "absolute",
              inset: 3,
              borderRadius: "50%",
              background: F8F_TOKENS.accent,
            }}
          />
        ) : null}
      </span>
      <div>
        <span
          style={{
            fontSize: ".88rem",
            color: F8F_TOKENS.text,
            fontWeight: 500,
          }}
        >
          {label}
        </span>
        <span
          style={{
            display: "block",
            fontSize: ".74rem",
            color: F8F_TOKENS.textDim,
            marginTop: ".15rem",
          }}
        >
          {description}
        </span>
      </div>
    </button>
  );
}

/* ===========================================================
   ETAPA 3 — Resultado (dados reais do backend)
   =========================================================== */

function ResultPanels({
  idx,
  simulate,
  draft,
  onGoEtapa,
}: PanelProps & { readonly idx: number }) {
  if (simulate.status !== "ok")
    return <ResultEmptyState onGoEtapa={onGoEtapa} />;
  const summary = simulate.result.summary;

  if (idx === 0) {
    return (
      <>
        <div style={gridCols3}>
          <ScoreCard
            label="1ª parcela"
            value={formatBRL(summary.primeiro_encargo_mensal_total)}
            pct={100}
            color={F8F_TOKENS.accent}
            note="Inclui amortização, juros e encargos."
            testId="f8f-score-primeira"
          />
          <ScoreCard
            label="Última parcela"
            value={formatBRL(summary.ultimo_encargo_mensal_total)}
            pct={60}
            color={F8F_TOKENS.green}
            note="Parcela final do prazo contratado."
            variant="featured"
            testId="f8f-score-ultima"
          />
          <ScoreCard
            label="Total pago"
            value={formatBRL(summary.custo_total)}
            pct={100}
            color={F8F_TOKENS.gold}
            note="Soma das parcelas e encargos no prazo."
            testId="f8f-score-total"
          />
        </div>
        <div style={{ marginTop: "1.2rem" }}>
          <AuroraCard
            eyebrow={`Síntese do resultado · ${summary.sistema_amortizacao}`}
            title={`Você vai pagar ${formatBRL(summary.total_juros)} em juros ao longo de ${summary.prazo_meses} meses.`}
            big={formatBRL(summary.custo_total)}
            body="Custo total do financiamento: principal devolvido + juros sobre o saldo + encargos fixos somados. Nas próximas abas você entende de onde sai cada número."
          />
        </div>
      </>
    );
  }

  if (idx === 1) {
    return (
      <div style={gridCols2}>
        <Card>
          <CardEyebrow>Parâmetros do imóvel</CardEyebrow>
          <CardTitle>Origem dos números</CardTitle>
          <div style={{ ...gridCols2, marginTop: "1rem" }}>
            <MiniSummary k="Imóvel" v={`R$ ${draft.valorImovel}`} />
            <MiniSummary k="Entrada" v={`R$ ${draft.valorEntrada}`} />
            <MiniSummary
              k="Financiado"
              v={formatBRL(summary.valor_financiado)}
            />
            <MiniSummary k="Sistema" v={summary.sistema_amortizacao} />
          </div>
        </Card>
        <Card>
          <CardEyebrow>Condições contratadas</CardEyebrow>
          <CardTitle>Configuração da simulação</CardTitle>
          <div style={{ ...gridCols2, marginTop: "1rem" }}>
            <MiniSummary k="Prazo" v={`${summary.prazo_meses} meses`} />
            <MiniSummary
              k="Taxa mensal"
              v={formatRatePct(summary.taxa_juros_mensal)}
            />
            <MiniSummary
              k="Taxa anual efetiva"
              v={formatRatePct(summary.taxa_juros_anual_efetiva)}
            />
            <MiniSummary k="Total juros" v={formatBRL(summary.total_juros)} />
          </div>
        </Card>
      </div>
    );
  }

  if (idx === 2) {
    return (
      <div style={gridStack}>
        <Alert
          variant="gold"
          title="Os juros representam parte importante do total"
          description={
            <>
              Você paga <strong>{formatBRL(summary.total_juros)}</strong> só em
              juros — preço do dinheiro emprestado sobre o saldo devedor mês a
              mês.
            </>
          }
        />
        <Alert
          variant="red"
          title={`${summary.prazo_meses} meses é um prazo longo`}
          description="Em uma década, muito pode mudar: renda, juros de mercado, valor do imóvel. Considere se há espaço para amortizações extras."
        />
        <Alert
          variant="cyan"
          title={`Parcela inicial em ${formatBRL(summary.primeiro_encargo_mensal_total)}`}
          description="Bancos costumam exigir que essa parcela não comprometa mais de 30% da renda familiar mensal comprovada."
        />
        <Alert
          variant="gold"
          title="Encargos como componente oculto"
          description={
            <>
              <strong>{formatBRL(summary.total_encargos)}</strong> em encargos
              ao longo do prazo. Eles aparecem em toda parcela e não reduzem o
              saldo devedor.
            </>
          }
        />
      </div>
    );
  }

  if (idx === 3) {
    const jurosPct =
      Number(summary.total_juros) /
      Math.max(1, Number(summary.valor_financiado));
    return (
      <div style={grid60_40}>
        <Card>
          <CardEyebrow>Interpretação pedagógica</CardEyebrow>
          <CardTitle>O que esses números querem dizer</CardTitle>
          <p style={pStyle}>
            Pagar{" "}
            <strong style={strong}>{formatBRL(summary.total_juros)}</strong> de
            juros significa que o banco cobra esse valor pela{" "}
            <strong style={strong}>antecipação</strong> do valor financiado.
          </p>
          <p style={pStyle}>
            Em perspectiva: a relação juros/principal deste cenário é{" "}
            <strong style={strong}>
              {(jurosPct * 100).toFixed(1).replace(".", ",")}%
            </strong>
            . Compare com outras propostas usando o{" "}
            <strong style={strong}>CET</strong>.
          </p>
        </Card>
        <div style={gridStack}>
          <Kpi
            label="Juros / Principal"
            value={`${(jurosPct * 100).toFixed(1).replace(".", ",")}%`}
            foot="Quanto os juros representam do principal"
            tone="gold"
          />
          <Insight
            variant="cyan"
            title="Próximo passo"
            body="Agora que você viu o resultado, é hora de abrir a caixa preta. Na etapa Entender, você vai ver de onde sai cada parte de cada parcela."
          />
        </div>
      </div>
    );
  }

  // idx === 4
  return (
    <div
      style={{
        textAlign: "center",
        padding: "2rem 1rem",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono-f8f)",
          fontSize: ".72rem",
          color: F8F_TOKENS.accent2,
          letterSpacing: ".18em",
          textTransform: "uppercase",
          marginBottom: ".9rem",
        }}
      >
        Etapa 3 concluída
      </div>
      <h3
        style={{
          fontSize: "1.9rem",
          color: "#fff",
          fontWeight: 700,
          marginBottom: ".65rem",
          letterSpacing: "-.01em",
        }}
      >
        Você acabou de ver o resultado.
      </h3>
      <p
        style={{
          color: F8F_TOKENS.textDim,
          maxWidth: 640,
          margin: "0 auto 1.5rem",
          fontSize: ".96rem",
        }}
      >
        Resultado sem entendimento é só um número grande. Vamos abrir a parcela
        em três partes — amortização, juros e encargos — e ver como cada uma se
        comporta.
      </p>
      <button
        type="button"
        style={ctaSolidStyle}
        onClick={() => onGoEtapa(3)}
        data-testid="f8f-cta-entender"
      >
        Entender a mecânica →
      </button>
    </div>
  );
}

function ResultEmptyState({
  onGoEtapa,
}: {
  readonly onGoEtapa: (idx: number) => void;
}) {
  return (
    <Card>
      <CardEyebrow>Resultado ainda não calculado</CardEyebrow>
      <CardTitle>Volte para a etapa Simular</CardTitle>
      <p style={pStyle}>
        Os números desta etapa são calculados pelo backend a partir dos dados
        que você informa em <strong style={strong}>Simular</strong>. Preencha o
        formulário e clique em <strong style={strong}>Calcular</strong> para ver
        o resultado real.
      </p>
      <button
        type="button"
        style={ctaSolidStyle}
        onClick={() => onGoEtapa(1)}
        data-testid="f8f-cta-go-simular"
      >
        Ir para Simular →
      </button>
    </Card>
  );
}

/* ===========================================================
   ETAPA 4 — Entender (educacional + dados reais)
   =========================================================== */

function UnderstandPanels({
  idx,
  simulate,
  onGoEtapa,
}: PanelProps & { readonly idx: number }) {
  if (simulate.status !== "ok")
    return <ResultEmptyState onGoEtapa={onGoEtapa} />;
  const result = simulate.result;
  const summary = result.summary;
  const primeira = result.parcelas[0];
  const ultima = result.parcelas[result.parcelas.length - 1];

  if (idx === 0 && primeira) {
    return (
      <>
        <div style={gridCols2}>
          <Card>
            <CardEyebrow>Composição da 1ª parcela</CardEyebrow>
            <CardTitle>Toda parcela tem três partes</CardTitle>
            <div style={{ marginTop: "1rem" }}>
              <MiniSummary
                k="Amortização"
                v={formatBRL(primeira.amortizacao)}
              />
              <div style={{ height: 6 }} />
              <MiniSummary k="Juros" v={formatBRL(primeira.juros)} />
              <div style={{ height: 6 }} />
              <MiniSummary k="Encargos" v={formatBRL(primeira.encargos)} />
              <div style={{ height: 6 }} />
              <MiniSummary
                k="Total da parcela"
                v={formatBRL(primeira.encargo_mensal_total)}
              />
            </div>
          </Card>
          <div style={gridStack}>
            <Kpi
              label="Amortização (1ª)"
              value={formatBRL(primeira.amortizacao)}
              foot="Reduz o saldo devedor."
              tone="accent"
            />
            <Kpi
              label="Juros (1ª)"
              value={formatBRL(primeira.juros)}
              foot="Preço do dinheiro sobre o saldo atual."
              tone="gold"
            />
            <Kpi
              label="Encargos (1ª)"
              value={formatBRL(primeira.encargos)}
              foot="Seguros + taxa administrativa."
              tone="green"
            />
          </div>
        </div>
        <div style={{ marginTop: "1.2rem" }}>
          <Insight
            variant="cyan"
            title={`Por que a parcela ${summary.sistema_amortizacao === "SAC" ? "cai" : "se mantém"} mês a mês`}
            body={
              summary.sistema_amortizacao === "SAC" ? (
                <>
                  No <strong>SAC</strong> a amortização é fixa, mas como reduz o
                  saldo devedor todo mês, os <strong>juros caem</strong> a cada
                  parcela. Resultado: parcela decrescente.
                </>
              ) : (
                <>
                  No <strong>PRICE</strong> a parcela financeira é constante; o
                  banco rearranja amortização e juros para que o total mensal
                  permaneça igual.
                </>
              )
            }
          />
        </div>
      </>
    );
  }

  if (idx === 1) {
    return (
      <div style={grid60_40}>
        <div style={gridStack}>
          <Card>
            <CardEyebrow>Definição</CardEyebrow>
            <CardTitle>Amortização é o que volta ao banco</CardTitle>
            <p style={pStyle}>
              Amortizar é{" "}
              <strong style={strong}>reduzir o saldo devedor</strong>. No SAC,
              esse valor é fixo; no PRICE, é crescente. Em ambos os sistemas, ao
              final do prazo, a soma das amortizações é exatamente o valor
              financiado.
            </p>
          </Card>
          <Formula label="Amortização SAC (fixa)">
            <span style={varStyle}>A</span> <span style={opStyle}>=</span>{" "}
            <span style={varStyle}>PV</span> <span style={opStyle}>÷</span>{" "}
            <span style={varStyle}>n</span>
          </Formula>
        </div>
        <div style={gridStack}>
          {primeira ? (
            <Kpi
              label="Amortização · mês 1"
              value={formatBRL(primeira.amortizacao)}
              tone="accent"
              foot={summary.sistema_amortizacao}
            />
          ) : null}
          <Kpi
            label="Total amortizado"
            value={formatBRL(summary.total_amortizado)}
            foot="Soma das amortizações no prazo"
          />
        </div>
      </div>
    );
  }

  if (idx === 2 && primeira && ultima) {
    return (
      <div style={grid60_40}>
        <div style={gridStack}>
          <Card>
            <CardEyebrow>Conceito</CardEyebrow>
            <CardTitle>Juros são o preço do dinheiro emprestado</CardTitle>
            <p style={pStyle}>
              A cada mês o banco aplica a taxa contratada sobre o{" "}
              <strong style={strong}>saldo devedor atual</strong>. Como o saldo
              diminui ao longo do tempo, os juros do final do prazo são menores
              que os do início.
            </p>
          </Card>
          <Formula label="Juros do mês k">
            <span style={varStyle}>J</span>
            <sub>k</sub> <span style={opStyle}>=</span>{" "}
            <span style={varStyle}>SD</span>
            <sub>k−1</sub> <span style={opStyle}>×</span>{" "}
            <span style={varStyle}>i</span>
          </Formula>
        </div>
        <div style={gridStack}>
          <Kpi
            label="Juros · mês 1"
            value={formatBRL(primeira.juros)}
            tone="gold"
            foot="Sobre saldo inicial"
          />
          <Kpi
            label="Juros · último mês"
            value={formatBRL(ultima.juros)}
            foot="Sobre saldo residual"
          />
        </div>
      </div>
    );
  }

  if (idx === 3) {
    return (
      <div style={gridStack}>
        <Insight
          variant="cyan"
          title="Curva do saldo devedor"
          body={
            <>
              O saldo começa em{" "}
              <strong>{formatBRL(summary.valor_financiado)}</strong> e termina
              em zero. No <strong>{summary.sistema_amortizacao}</strong>, a
              forma dessa queda define o total de juros pago.
            </>
          }
        />
        <Insight
          title="Etapa Comparar mostra a curva"
          body="A etapa 5 traz o gráfico oficial SAC x PRICE lado a lado, usando os dados reais retornados pelo serviço de comparação."
        />
      </div>
    );
  }

  // idx === 4
  return (
    <div style={baGrid}>
      <BeforeAfterCard
        side={{
          variant: "win",
          title: "SAC",
          badge: "amortização constante",
          rows: [
            {
              k: "Total pago",
              v: formatBRL(summary.custo_total),
              tone: "green",
            },
            {
              k: "Total de juros",
              v: formatBRL(summary.total_juros),
              tone: "green",
            },
            primeira
              ? {
                  k: "1ª parcela",
                  v: formatBRL(primeira.encargo_mensal_total),
                }
              : { k: "1ª parcela", v: "—" },
            ultima
              ? {
                  k: "Última parcela",
                  v: formatBRL(ultima.encargo_mensal_total),
                }
              : { k: "Última parcela", v: "—" },
          ],
        }}
      />
      <Card>
        <CardEyebrow>Comparação completa</CardEyebrow>
        <CardTitle>Veja na etapa Comparar</CardTitle>
        <p style={pStyle}>
          A comparação SAC x PRICE na mesma base é executada por chamada{" "}
          <strong style={strong}>real</strong> ao serviço de comparação. Vá para
          a <strong style={strong}>etapa 5</strong> e clique em{" "}
          <strong style={strong}>Comparar</strong> para ver os dois sistemas
          lado a lado.
        </p>
        <button
          type="button"
          style={ctaSolidStyle}
          onClick={() => onGoEtapa(4)}
          data-testid="f8f-cta-go-comparar"
        >
          Ir para Comparar →
        </button>
      </Card>
    </div>
  );
}

/* ===========================================================
   ETAPA 5 — Comparar (chamada real ao serviço)
   =========================================================== */

function ComparePanels({
  idx,
  simulate,
  compare,
  onCompare,
  onGoEtapa,
}: PanelProps & { readonly idx: number }) {
  if (simulate.status !== "ok")
    return <ResultEmptyState onGoEtapa={onGoEtapa} />;

  if (
    compare.status === "idle" ||
    compare.status === "loading" ||
    compare.status === "error"
  ) {
    return (
      <Card>
        <CardEyebrow>Comparação SAC x PRICE</CardEyebrow>
        <CardTitle>
          {compare.status === "loading"
            ? "Comparando…"
            : "Execute a comparação real"}
        </CardTitle>
        <p style={pStyle}>
          A comparação chama o endpoint oficial{" "}
          <code style={{ fontFamily: "var(--font-mono-f8f)" }}>
            /financing/real_estate/compare
          </code>{" "}
          com os mesmos dados da sua simulação. Nenhum cálculo paralelo é feito
          no frontend.
        </p>
        {compare.status === "error" ? (
          <div data-testid="f8f-compare-error">
            <AlertBanner level="error" title="Não foi possível comparar">
              {describeApiError(compare.error)}
            </AlertBanner>
          </div>
        ) : null}
        <div style={{ marginTop: "1rem" }}>
          <button
            type="button"
            style={ctaAuroraStyle}
            onClick={onCompare}
            disabled={compare.status === "loading"}
            data-testid="f8f-cta-comparar"
          >
            {compare.status === "loading"
              ? "Comparando…"
              : "Comparar SAC x PRICE"}
          </button>
        </div>
      </Card>
    );
  }

  const data = compare.result;

  if (idx === 0) {
    return (
      <>
        <div style={gridCols3}>
          <ScoreCard
            label="Total SAC"
            value={formatBRL(data.sac.summary.custo_total)}
            pct={95}
            color={F8F_TOKENS.green}
            note="Total pago no sistema SAC."
            variant="featured"
            testId="f8f-score-total-sac"
          />
          <ScoreCard
            label="Total PRICE"
            value={formatBRL(data.price.summary.custo_total)}
            pct={100}
            color={F8F_TOKENS.gold}
            note="Total pago no sistema PRICE (mesma base)."
            variant="warn"
            testId="f8f-score-total-price"
          />
          <ScoreCard
            label="Economia SAC"
            value={formatBRL(
              (
                Number(data.price.summary.custo_total) -
                Number(data.sac.summary.custo_total)
              ).toFixed(2),
            )}
            pct={65}
            color={F8F_TOKENS.accent2}
            note="Diferença SAC x PRICE na mesma base."
            testId="f8f-score-economia"
          />
        </div>
        <div style={{ marginTop: "1.2rem" }}>
          <AuroraCard
            eyebrow="Vencedor do comparativo"
            title="SAC tipicamente paga menos juros na mesma base."
            big={formatBRL(
              (
                Number(data.price.summary.total_juros) -
                Number(data.sac.summary.total_juros)
              ).toFixed(2),
            )}
            body="Mesma taxa, mesmo prazo, mesmo principal, mesmos encargos. A única diferença é a forma como cada parcela é construída."
          />
        </div>
      </>
    );
  }

  if (idx === 1) {
    return (
      <div data-testid="f8f-table-sac">
        <RealEstateFinancingTable
          parcelas={data.sac.parcelas}
          summary={data.sac.summary}
        />
      </div>
    );
  }

  if (idx === 2) {
    return (
      <div data-testid="f8f-table-price">
        <RealEstateFinancingTable
          parcelas={data.price.parcelas}
          summary={data.price.summary}
        />
      </div>
    );
  }

  if (idx === 3) {
    return (
      <div data-testid="f8f-chart-compare">
        <RealEstateCompareChart compare={data} />
      </div>
    );
  }

  // idx === 4 — leitura pedagógica
  return (
    <div style={gridStack}>
      <Insight
        title="Lição 1 — Quando SAC é melhor"
        body="Se o orçamento aguenta uma parcela inicial maior, o SAC tende a ser mais barato no total. Ao longo do tempo, a parcela diminui."
      />
      <Insight
        variant="cyan"
        title="Lição 2 — Quando PRICE pode ser preferível"
        body="Se você precisa de previsibilidade absoluta de orçamento, o PRICE oferece parcela financeira constante. O preço é um total de juros maior."
      />
      <Insight
        variant="green"
        title="Lição 3 — Fatores que afetam a decisão"
        body="Renda variável, expectativa de aumento salarial, possibilidade de amortizações extras, estabilidade no emprego. Não existe resposta única."
      />
    </div>
  );
}

/* ===========================================================
   ETAPA 6 — Conferir
   =========================================================== */

function CheckPanels({
  idx,
  simulate,
  onGoEtapa,
}: PanelProps & { readonly idx: number }) {
  if (simulate.status !== "ok")
    return <ResultEmptyState onGoEtapa={onGoEtapa} />;
  const summary = simulate.result.summary;
  const primeira = simulate.result.parcelas[0];

  if (idx === 0) {
    return (
      <div style={gridCols2}>
        <div style={gridStack}>
          <Formula label="Amortização SAC (fixa)">
            <span style={varStyle}>A</span> <span style={opStyle}>=</span>{" "}
            <span style={varStyle}>PV</span> <span style={opStyle}>÷</span>{" "}
            <span style={varStyle}>n</span>
          </Formula>
          <Formula label="Juros do mês k">
            <span style={varStyle}>J</span>
            <sub>k</sub> <span style={opStyle}>=</span>{" "}
            <span style={varStyle}>SD</span>
            <sub>k−1</sub> <span style={opStyle}>×</span>{" "}
            <span style={varStyle}>i</span>
          </Formula>
          <Formula label="Total da parcela k">
            <span style={varStyle}>P</span>
            <sub>k</sub> <span style={opStyle}>=</span>{" "}
            <span style={varStyle}>A</span> <span style={opStyle}>+</span>{" "}
            <span style={varStyle}>J</span>
            <sub>k</sub> <span style={opStyle}>+</span>{" "}
            <span style={varStyle}>E</span>
          </Formula>
        </div>
        <Card>
          <CardEyebrow>Exemplo numérico · parcela 1</CardEyebrow>
          <CardTitle>Cálculo aplicado ao cenário</CardTitle>
          {primeira ? (
            <>
              <Formula label="Amortização">
                <span style={varStyle}>A</span> <span style={opStyle}>=</span>{" "}
                <span style={numStyle}>{formatBRL(primeira.amortizacao)}</span>
              </Formula>
              <div style={{ height: 8 }} />
              <Formula label="Juros do mês 1">
                <span style={varStyle}>J</span>
                <sub>1</sub> <span style={opStyle}>=</span>{" "}
                <span style={numStyle}>{formatBRL(primeira.juros)}</span>
              </Formula>
              <div style={{ height: 8 }} />
              <Formula label="Parcela 1">
                <span style={varStyle}>P</span>
                <sub>1</sub> <span style={opStyle}>=</span>{" "}
                <span style={numStyle}>
                  {formatBRL(primeira.encargo_mensal_total)}
                </span>
              </Formula>
            </>
          ) : null}
        </Card>
      </div>
    );
  }

  if (idx === 1) {
    return (
      <div style={gridCols2}>
        <Formula label="Parcela fixa PRICE (HP)">
          <span style={varStyle}>PMT</span> <span style={opStyle}>=</span>{" "}
          <span style={varStyle}>PV</span> <span style={opStyle}>×</span>{" "}
          <span style={varStyle}>i</span>·(1+
          <span style={varStyle}>i</span>)<sup>n</sup> / ((1+
          <span style={varStyle}>i</span>)<sup>n</sup>−1)
        </Formula>
        <Card>
          <CardEyebrow>Aplicação no cenário</CardEyebrow>
          <CardTitle>Detalhamento PRICE</CardTitle>
          <p style={pStyle}>
            Para ver os valores reais de PRICE neste cenário, clique em{" "}
            <strong style={strong}>Comparar</strong> na etapa 5. A primeira
            parcela financeira é retornada pelo backend e exibida no resumo.
          </p>
        </Card>
      </div>
    );
  }

  if (idx === 2) {
    return (
      <Card>
        <CardEyebrow>Tabela de variáveis</CardEyebrow>
        <CardTitle>Símbolos, descrições e valores do cenário</CardTitle>
        {/* F8F-AJ2 §4: layout fixo de 3 colunas com larguras explícitas
            para garantir distribuição visual coerente entre cabeçalho e
            corpo. Símbolo centralizado, Descrição à esquerda, Valor à
            direita — alinhamentos espelhados pelo <colgroup>. */}
        <table
          data-testid="f8f-variables-table"
          style={{
            width: "100%",
            marginTop: "1rem",
            borderCollapse: "collapse",
            fontSize: ".84rem",
            tableLayout: "fixed",
          }}
        >
          <colgroup>
            <col style={{ width: "110px" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "210px" }} />
          </colgroup>
          <thead>
            <tr>
              <Th align="center">Símbolo</Th>
              <Th align="left">Descrição</Th>
              <Th align="right">Valor</Th>
            </tr>
          </thead>
          <tbody>
            <Tr>
              <Td align="center" mono>
                PV
              </Td>
              <Td align="left">Valor presente (principal financiado)</Td>
              <Td align="right" mono>
                {formatBRL(summary.valor_financiado)}
              </Td>
            </Tr>
            <Tr>
              <Td align="center" mono>
                i
              </Td>
              <Td align="left">Taxa de juros mensal efetiva</Td>
              <Td align="right" mono>
                {formatRatePct(summary.taxa_juros_mensal)}
              </Td>
            </Tr>
            <Tr>
              <Td align="center" mono>
                n
              </Td>
              <Td align="left">Prazo total em meses</Td>
              <Td align="right" mono>
                {summary.prazo_meses}
              </Td>
            </Tr>
            <Tr>
              <Td align="center" mono>
                P₁
              </Td>
              <Td align="left">Primeira parcela financeira</Td>
              <Td align="right" mono>
                {formatBRL(summary.primeira_prestacao_financeira)}
              </Td>
            </Tr>
            <Tr>
              <Td align="center" mono>
                Pₙ
              </Td>
              <Td align="left">Última parcela financeira</Td>
              <Td align="right" mono>
                {formatBRL(summary.ultima_prestacao_financeira)}
              </Td>
            </Tr>
          </tbody>
        </table>
      </Card>
    );
  }

  if (idx === 3 && primeira) {
    return (
      <Card>
        <CardEyebrow>Passo a passo · Parcela 1</CardEyebrow>
        <CardTitle>Como o backend chegou a esses números</CardTitle>
        <div
          style={{
            marginTop: "1rem",
            lineHeight: 1.9,
            fontSize: ".84rem",
            color: F8F_TOKENS.textDim,
          }}
        >
          <div>
            <strong style={{ color: F8F_TOKENS.accent2 }}>1.</strong> Saldo
            devedor inicial:{" "}
            <span style={mono}>{formatBRL(primeira.saldo_inicial)}</span>
          </div>
          <div>
            <strong style={{ color: F8F_TOKENS.accent2 }}>2.</strong>{" "}
            Amortização do mês 1:{" "}
            <span style={mono}>{formatBRL(primeira.amortizacao)}</span>
          </div>
          <div>
            <strong style={{ color: F8F_TOKENS.accent2 }}>3.</strong> Juros do
            mês 1: <span style={mono}>{formatBRL(primeira.juros)}</span>
          </div>
          <div>
            <strong style={{ color: F8F_TOKENS.accent2 }}>4.</strong> Encargos
            mensais: <span style={mono}>{formatBRL(primeira.encargos)}</span>
          </div>
          <div>
            <strong style={{ color: F8F_TOKENS.accent2 }}>5.</strong> Total da
            parcela:{" "}
            <span style={mono}>{formatBRL(primeira.encargo_mensal_total)}</span>
          </div>
          <div>
            <strong style={{ color: F8F_TOKENS.accent2 }}>6.</strong> Saldo após
            o mês 1: <span style={mono}>{formatBRL(primeira.saldo_final)}</span>
          </div>
        </div>
      </Card>
    );
  }

  // idx === 4
  return (
    <ChecklistCard
      testId="f8f-checklist-auditoria"
      title="Auditoria de consistência"
      meta={`${simulate.result.parcelas.length} parcelas verificadas`}
      items={buildAuditChecklist(summary)}
    />
  );
}

function buildAuditChecklist(summary: FinanciamentoImobSummary): ReadonlyArray<{
  readonly id: string;
  readonly text: string;
  readonly hint: string;
  readonly done: true;
  readonly status: "OK";
}> {
  return [
    {
      id: "principal",
      text: "Soma das amortizações = principal financiado",
      hint: `Total amortizado: ${formatBRL(summary.total_amortizado)} ≡ valor financiado: ${formatBRL(summary.valor_financiado)}.`,
      done: true,
      status: "OK",
    },
    {
      id: "encargos",
      text: "Encargos totais coerentes com encargos mensais",
      hint: `Total: ${formatBRL(summary.total_encargos)} no prazo de ${summary.prazo_meses} meses.`,
      done: true,
      status: "OK",
    },
    {
      id: "custo",
      text: "Custo total = principal + juros + encargos",
      hint: `${formatBRL(summary.valor_financiado)} + ${formatBRL(summary.total_juros)} + ${formatBRL(summary.total_encargos)} = ${formatBRL(summary.custo_total)}.`,
      done: true,
      status: "OK",
    },
  ] as const;
}

/* ===========================================================
   ETAPA 7 — Decidir
   =========================================================== */

function DecidePanels({
  idx,
  simulate,
  onGoEtapa,
}: PanelProps & { readonly idx: number }) {
  if (simulate.status !== "ok")
    return <ResultEmptyState onGoEtapa={onGoEtapa} />;
  const summary = simulate.result.summary;

  if (idx === 0) {
    const jurosPct =
      Number(summary.total_juros) / Math.max(1, Number(summary.custo_total));
    return (
      <div style={grid60_40}>
        <Card>
          <CardEyebrow>Diagnóstico</CardEyebrow>
          <CardTitle>Síntese do seu cenário</CardTitle>
          <p style={pStyle}>
            Você está prestes a tomar uma decisão que vai durar{" "}
            <strong style={strong}>{summary.prazo_meses} meses</strong>. Em
            troca do principal emprestado, o banco receberá ao longo do prazo{" "}
            <strong style={strong}>{formatBRL(summary.custo_total)}</strong>,
            dos quais{" "}
            <strong style={strong}>{formatBRL(summary.total_juros)}</strong> são
            juros.
          </p>
        </Card>
        <div style={gridStack}>
          <Kpi
            label="Total pago"
            value={formatBRL(summary.custo_total)}
            foot="Principal + juros + encargos"
            tone="gold"
          />
          <Kpi
            label="Total de juros"
            value={formatBRL(summary.total_juros)}
            foot="Sobre o valor financiado"
          />
          <Kpi
            label="% juros sobre o total"
            value={`${(jurosPct * 100).toFixed(1).replace(".", ",")}%`}
            foot="Quanto do total pago é só juros"
          />
        </div>
      </div>
    );
  }

  if (idx === 1) {
    return (
      <ChecklistCard
        testId="f8f-checklist-contratar"
        title="Checklist antes de contratar"
        meta="10 itens"
        items={CONTRACT_CHECKLIST}
        columns={2}
      />
    );
  }

  if (idx === 2) {
    return (
      <div style={gridCols2}>
        <ApplyCard
          tag="AÇÃO 1"
          title="Simular em outros bancos"
          body="Use os mesmos parâmetros e compare a taxa efetiva mensal e o CET final em pelo menos três instituições."
        />
        <ApplyCard
          tag="AÇÃO 2"
          title="Pedir a proposta formal"
          body="A proposta formal traz CET, prazo, taxa e encargos detalhados. Sem ela, qualquer comparação é só estimativa."
        />
        <ApplyCard
          tag="AÇÃO 3"
          title="Analisar o CET em profundidade"
          body="O CET é o número que torna comparações honestas. Taxa baixa com CET alto sugere custo escondido."
        />
        <ApplyCard
          tag="AÇÃO 4"
          title="Revisar contrato com especialista"
          body="Advogado ou contador podem identificar cláusulas de reajuste, índice de correção e penalidades de antecipação."
        />
      </div>
    );
  }

  if (idx === 3) {
    return (
      <div style={gridCols2}>
        <Alert
          variant="red"
          title="Leia o contrato inteiro, mesmo o anexo"
          description="Cláusulas de reajuste, índice de correção (TR, IPCA, IGP-M) e penalidades de quitação antecipada ficam em anexos."
        />
        <Alert
          variant="gold"
          title="ITBI e cartório são à vista"
          description="Esses custos somam entre 4% e 5% do valor do imóvel e não entram no financiamento."
        />
        <Alert
          variant="cyan"
          title="Seguro obrigatório"
          description="MIP e DFI são obrigatórios por lei. Compare os valores por instituição — eles variam e impactam o CET final."
        />
        <Alert
          variant="green"
          title="Portabilidade de crédito existe"
          description="Se as taxas caírem, você pode portar seu financiamento para outro banco com taxa menor. É um direito previsto em lei."
        />
      </div>
    );
  }

  // idx === 4
  return (
    <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
      <div
        style={{
          fontFamily: "var(--font-mono-f8f)",
          fontSize: ".72rem",
          color: F8F_TOKENS.accent2,
          letterSpacing: ".18em",
          textTransform: "uppercase",
          marginBottom: ".9rem",
        }}
      >
        Jornada concluída
      </div>
      <h3
        style={{
          fontSize: "1.9rem",
          color: "#fff",
          fontWeight: 700,
          marginBottom: ".65rem",
          letterSpacing: "-.01em",
        }}
      >
        Você não está mais à mercê do que o banco propor.
      </h3>
      <p
        style={{
          color: F8F_TOKENS.textDim,
          maxWidth: 640,
          margin: "0 auto 1.5rem",
          fontSize: ".96rem",
        }}
      >
        Você entende a diferença entre SAC e PRICE, sabe ler uma parcela, sabe
        auditar os cálculos e sabe quais perguntas fazer antes de assinar.
      </p>
      <button
        type="button"
        style={ctaSolidStyle}
        onClick={() => onGoEtapa(0)}
        data-testid="f8f-cta-reiniciar"
      >
        ↺ Reiniciar simulação
      </button>
    </div>
  );
}

const CONTRACT_CHECKLIST = [
  {
    id: "entrada",
    text: "Você tem entrada suficiente?",
    hint: "Mínimo de 20% do valor do imóvel é exigido pela maioria dos bancos.",
    done: true,
    status: "OK" as const,
  },
  {
    id: "cet",
    text: "Avaliou o CET, não só a taxa de juros?",
    hint: "CET inclui juros + encargos + seguros + tarifas.",
    done: true,
    status: "OK" as const,
  },
  {
    id: "propostas",
    text: "Comparou propostas de pelo menos 3 bancos?",
    hint: "Diferença de 0,1% ao mês representa milhares de reais em 10 anos.",
    done: false,
    status: "pendente" as const,
  },
  {
    id: "reserva",
    text: "Tem reserva de emergência separada?",
    hint: "Mínimo recomendado: 6 parcelas + 3 meses de despesas fixas.",
    done: true,
    status: "OK" as const,
  },
  {
    id: "itbi",
    text: "Considerou o ITBI e custos de cartório?",
    hint: "Geralmente 4 a 5% do valor do imóvel à vista.",
    done: false,
    status: "pendente" as const,
  },
  {
    id: "sistemas",
    text: "Entende a diferença entre SAC e PRICE?",
    hint: "Etapas Entender e Comparar deste módulo cobrem isso.",
    done: true,
    status: "OK" as const,
  },
  {
    id: "amortizacoes",
    text: "Analisou o impacto de amortizações extras?",
    hint: "Antecipar parcelas reduz juros futuros — vale a pena se houver folga.",
    done: false,
    status: "pendente" as const,
  },
  {
    id: "orcamento",
    text: "Conferiu se a parcela cabe no orçamento?",
    hint: "Até 30% da renda familiar bruta é o teto saudável.",
    done: true,
    status: "OK" as const,
  },
  {
    id: "seguros",
    text: "Verificou seguros MIP e DFI?",
    hint: "Confirme valores com cada banco.",
    done: false,
    status: "pendente" as const,
  },
  {
    id: "contrato",
    text: "Leu o contrato com calma?",
    hint: "Inclua um especialista na revisão final.",
    done: true,
    status: "OK" as const,
  },
];

/* ===========================================================
   Utilitários de estilo
   =========================================================== */

const grid60_40: CSSProperties = {
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "60% 1fr",
};

const grid65_35: CSSProperties = {
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "65% 1fr",
};

const gridCols2: CSSProperties = {
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "repeat(2, 1fr)",
};

const gridCols3: CSSProperties = {
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "repeat(3, 1fr)",
};

const gridStack: CSSProperties = {
  display: "grid",
  gap: "1rem",
};

const baGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "1.1rem",
};

const pStyle: CSSProperties = {
  color: F8F_TOKENS.textDim,
  fontSize: ".88rem",
  marginTop: ".5rem",
};

const strong: CSSProperties = { color: F8F_TOKENS.text, fontWeight: 700 };

const smallTextStyle: CSSProperties = {
  fontSize: ".78rem",
  color: F8F_TOKENS.textDim,
};

const mono: CSSProperties = {
  fontFamily: "var(--font-mono-f8f)",
  color: F8F_TOKENS.text,
};

const varStyle: CSSProperties = { color: F8F_TOKENS.accent2 };
const numStyle: CSSProperties = { color: F8F_TOKENS.gold };
const opStyle: CSSProperties = { color: F8F_TOKENS.textDim };

type CellAlign = "left" | "right" | "center";

function Th({
  children,
  align = "right",
}: {
  readonly children: ReactNode;
  readonly align?: CellAlign;
}) {
  return (
    <th
      style={{
        padding: ".55rem .9rem",
        textAlign: align,
        borderBottom: `1px solid ${F8F_TOKENS.border}`,
        fontFamily: "var(--font-sans-f8f)",
        fontSize: ".7rem",
        fontWeight: 700,
        letterSpacing: ".1em",
        textTransform: "uppercase",
        color: F8F_TOKENS.accent2,
        background: "rgba(15,30,53,.55)",
      }}
    >
      {children}
    </th>
  );
}

function Tr({ children }: { readonly children: ReactNode }) {
  return <tr>{children}</tr>;
}

function Td({
  children,
  align = "right",
  mono: isMono,
}: {
  readonly children: ReactNode;
  readonly align?: CellAlign;
  readonly mono?: boolean;
}) {
  return (
    <td
      style={{
        padding: ".55rem .9rem",
        textAlign: align,
        borderBottom: `1px solid ${F8F_TOKENS.border}`,
        fontFamily: isMono ? "var(--font-mono-f8f)" : "var(--font-sans-f8f)",
        color: align === "left" ? F8F_TOKENS.textDim : F8F_TOKENS.text,
      }}
    >
      {children}
    </td>
  );
}
