/**
 * Tokens locais Observatory Dark Cards aplicados ao módulo Financiamento Imobiliário
 * Espelhados em CSS custom properties do contrato F8E-AJ1 (CONTRATO_VISUAL_IMOVEL_V6_3.json)
 *
 * Uso: escopo do RealEstateF8FObservatory. Não são tokens globais do produto.
 */
export const F8F_TOKENS = {
  bg: "#030811",
  surface: "#0a1628",
  surface2: "#0f1e35",
  border: "#1a2f50",
  accent: "#3b82f6",
  accent2: "#06b6d4",
  gold: "#f59e0b",
  green: "#10b981",
  red: "#ef4444",
  alt: "#c084fc",
  text: "#e2e8f0",
  textMuted: "#64748b",
  textDim: "#94a3b8",
} as const;

export const F8F_FONTS = {
  sans: `"DM Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`,
  mono: `"DM Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`,
} as const;

export type EtapaKey =
  | "preparar"
  | "simular"
  | "resultado"
  | "entender"
  | "comparar"
  | "conferir"
  | "decidir";

export interface EtapaDef {
  readonly n: number;
  readonly key: EtapaKey;
  readonly label: string;
  readonly desc: string;
  readonly abas: ReadonlyArray<string>;
}

export const ETAPAS: ReadonlyArray<EtapaDef> = [
  {
    n: 1,
    key: "preparar",
    label: "Preparar",
    desc: "Contexto e fundamentos",
    abas: [
      "Visão Geral",
      "Entrada",
      "Valor Financiado",
      "SAC x PRICE",
      "Cuidados",
    ],
  },
  {
    n: 2,
    key: "simular",
    label: "Simular",
    desc: "Inserir os dados",
    abas: ["Dados do Imóvel", "Condições", "Custos", "Sistema", "Resumo"],
  },
  {
    n: 3,
    key: "resultado",
    label: "Resultado",
    desc: "Ver o cenário calculado",
    abas: ["Resumo", "Cenário", "Alertas", "Interpretação", "Próximo passo"],
  },
  {
    n: 4,
    key: "entender",
    label: "Entender",
    desc: "Mecânica da parcela",
    abas: ["Parcela", "Amortização", "Juros", "Saldo Devedor", "SAC x PRICE"],
  },
  {
    n: 5,
    key: "comparar",
    label: "Comparar",
    desc: "SAC x PRICE lado a lado",
    abas: [
      "Resumo Comparativo",
      "Tabela SAC",
      "Tabela PRICE",
      "Gráfico",
      "Leitura Pedagógica",
    ],
  },
  {
    n: 6,
    key: "conferir",
    label: "Conferir",
    desc: "Fórmulas e auditoria",
    abas: [
      "Fórmulas SAC",
      "Fórmulas PRICE",
      "Variáveis",
      "Passo a Passo",
      "Auditoria",
    ],
  },
  {
    n: 7,
    key: "decidir",
    label: "Decidir",
    desc: "Checklist e próximos passos",
    abas: [
      "Diagnóstico",
      "Checklist",
      "Próximos Passos",
      "Cuidados",
      "Conclusão",
    ],
  },
];
