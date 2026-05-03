import type { Route } from "next";

/**
 * Fonte única dos 12 módulos navegáveis da Plataforma Educacional Financeira.
 *
 * Consumido por:
 *   - `Sidebar` (navegação principal);
 *   - `Header` (breadcrumb derivado do `usePathname`);
 *   - `app/page.tsx` (grid de cards da Home);
 *   - `__tests__/app/routes.test.tsx` (varredura determinística).
 *
 * A lista é deliberadamente tipada como `readonly` e marcada `as const`
 * para dar a garantia de que nenhum consumidor possa mutá-la em runtime.
 *
 * Rastreabilidade:
 *   - Prompt Sprint 1 §5.1.2 (12 rotas-base navegáveis);
 *   - PLANO_EXECUCAO_SPRINT_1.md v1.1 §5.4 (nomenclatura e slugs);
 *   - Doc 06 §§ de domínio (API paths canônicos — observar `/cartao-rotativo`).
 *
 * Sprint 2 / F4:
 *   - `juros` passa de "em-construcao" → "disponivel" porque a página
 *     real consome os endpoints F3 `/api/v1/interest/*`. Os demais
 *     módulos permanecem como placeholder.
 *
 * Sprint 3 / F4:
 *   - `amortizacao` passa de "em-construcao" → "disponivel" porque a página
 *     real consome os endpoints F3 `/api/v1/amortization/*`.
 */

export type ModuleStatus = "disponivel" | "em-construcao";

export interface ModuleGroup {
  readonly id: string;
  readonly label: string;
}

export interface ModuleEntry {
  readonly id: string;
  readonly slug: string;
  readonly href: Route;
  readonly title: string;
  readonly shortTitle: string;
  readonly description: string;
  readonly group: ModuleGroup;
  readonly status: ModuleStatus;
}

const G = {
  diagnostico: { id: "diagnostico", label: "Diagnóstico" },
  basicos: { id: "basicos", label: "Cálculos Básicos" },
  financiamentos: { id: "financiamentos", label: "Financiamentos" },
  emprestimos: { id: "emprestimos", label: "Empréstimos" },
  cartao: { id: "cartao", label: "Cartão" },
  divida: { id: "divida", label: "Dívida" },
  referencia: { id: "referencia", label: "Referência" },
  decisao: { id: "decisao", label: "Decisão" },
  educacao: { id: "educacao", label: "Educação" },
} as const;

export const MODULES: readonly ModuleEntry[] = [
  {
    id: "diagnostico",
    slug: "diagnostico",
    href: "/diagnostico",
    title: "Diagnóstico Financeiro",
    shortTitle: "Diagnóstico",
    description:
      "Faça um mapeamento inicial de receitas, despesas e dívidas para " +
      "orientar os próximos passos.",
    group: G.diagnostico,
    status: "em-construcao",
  },
  {
    id: "juros",
    slug: "juros",
    href: "/juros",
    title: "Juros Simples e Compostos",
    shortTitle: "Juros",
    description:
      "Compare crescimento simples vs. composto e entenda o efeito do " +
      "tempo sobre o capital.",
    group: G.basicos,
    status: "disponivel",
  },
  {
    id: "amortizacao",
    slug: "amortizacao",
    href: "/amortizacao",
    title: "Amortização — PRICE e SAC",
    shortTitle: "Amortização",
    description:
      "Visualize a diferença entre tabelas PRICE e SAC e o impacto de cada " +
      "uma na parcela e no custo total.",
    group: G.basicos,
    status: "disponivel",
  },
  {
    id: "financiamento-imobiliario",
    slug: "financiamento-imobiliario",
    href: "/financiamento-imobiliario",
    title: "Financiamento Imobiliário",
    shortTitle: "Imóvel",
    description:
      "Simule prazos, entrada e sistema de amortização para compra de " +
      "imóvel com CET detalhado.",
    group: G.financiamentos,
    status: "em-construcao",
  },
  {
    id: "financiamento-veiculo",
    slug: "financiamento-veiculo",
    href: "/financiamento-veiculo",
    title: "Financiamento de Veículo",
    shortTitle: "Veículo",
    description:
      "Compare CDC, leasing e consórcio para aquisição de veículo, com " +
      "atenção ao custo efetivo total.",
    group: G.financiamentos,
    status: "em-construcao",
  },
  {
    id: "consignado",
    slug: "consignado",
    href: "/consignado",
    title: "Empréstimo Consignado",
    shortTitle: "Consignado",
    description:
      "Entenda a margem consignável, a taxa típica do consignado e quando " +
      "essa modalidade faz sentido.",
    group: G.emprestimos,
    status: "em-construcao",
  },
  {
    id: "cdc",
    slug: "cdc",
    href: "/cdc",
    title: "CDC / Crédito Pessoal",
    shortTitle: "CDC",
    description:
      "Compare CDC e crédito pessoal — prazos, taxas e quando renegociar " +
      "antes de tomar a decisão.",
    group: G.emprestimos,
    status: "em-construcao",
  },
  {
    id: "cartao-rotativo",
    slug: "cartao-rotativo",
    href: "/cartao-rotativo",
    title: "Cartão de Crédito / Rotativo",
    shortTitle: "Cartão",
    description:
      "Entenda o custo real do rotativo, do parcelamento da fatura e das " +
      "alternativas de saída.",
    group: G.cartao,
    status: "em-construcao",
  },
  {
    id: "atraso",
    slug: "atraso",
    href: "/atraso",
    title: "Parcela em Atraso",
    shortTitle: "Atraso",
    description:
      "Projete juros de mora, multa e correção sobre parcela atrasada para " +
      "negociar com clareza.",
    group: G.divida,
    status: "em-construcao",
  },
  {
    id: "indicadores",
    slug: "indicadores",
    href: "/indicadores",
    title: "Indicadores Financeiros",
    shortTitle: "Indicadores",
    description:
      "Selic, IPCA, CDI e TR com fonte e data-base — utilizados como " +
      "referência nas simulações.",
    group: G.referencia,
    status: "em-construcao",
  },
  {
    id: "investir-vs-quitar",
    slug: "investir-vs-quitar",
    href: "/investir-vs-quitar",
    title: "Investir ou Quitar Dívida",
    shortTitle: "Investir × Quitar",
    description:
      "Ajuda a decidir entre aplicar em renda fixa ou antecipar a quitação " +
      "de uma dívida existente.",
    group: G.decisao,
    status: "em-construcao",
  },
  {
    id: "educacao",
    slug: "educacao",
    href: "/educacao",
    title: "Glossário, FAQ e Conteúdo",
    shortTitle: "Educação",
    description:
      "Glossário de termos financeiros, FAQ sobre as simulações e " +
      "conteúdo educativo complementar.",
    group: G.educacao,
    status: "em-construcao",
  },
] as const;

/**
 * Retorna o módulo correspondente a um pathname (ex.: "/juros").
 * Aceita pathnames profundos (ex.: "/juros/resultado") buscando o módulo cuja
 * raiz bate com o primeiro segmento.
 */
export function findModuleByPathname(pathname: string): ModuleEntry | null {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  const direct = MODULES.find((m) => m.href === normalized);
  if (direct) return direct;
  const firstSegment = normalized.split("/").filter(Boolean)[0];
  if (!firstSegment) return null;
  return MODULES.find((m) => m.slug === firstSegment) ?? null;
}

/** Agrupamento auxiliar para a Sidebar (preserva a ordem da lista). */
export function groupModules(
  modules: readonly ModuleEntry[] = MODULES,
): ReadonlyArray<{
  group: ModuleGroup;
  items: readonly ModuleEntry[];
}> {
  const order: ModuleGroup[] = [];
  const bucket = new Map<string, ModuleEntry[]>();
  for (const mod of modules) {
    if (!bucket.has(mod.group.id)) {
      bucket.set(mod.group.id, []);
      order.push(mod.group);
    }
    bucket.get(mod.group.id)!.push(mod);
  }
  return order.map((g) => ({
    group: g,
    items: bucket.get(g.id)!,
  }));
}
