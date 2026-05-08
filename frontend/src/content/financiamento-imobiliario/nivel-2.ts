import { DISCLAIMER_FINANCIAMENTO, type EducationalContent } from "./types";

export const CONTEUDO_NIVEL_2: ReadonlyArray<EducationalContent> = [
  {
    slug: "o-que-e-financiamento-imobiliario",
    version: "1.0.0",
    level: "nivel-2",
    title: "Financiamento imobiliário: mecanismo e estrutura",
    paragraphs: [
      "Um financiamento imobiliário é operado sob o Sistema Financeiro de Habitação (SFH) ou o Sistema Financeiro Imobiliário (SFI). No SFH, há limites de valor de imóvel e de taxa de juros. O SFI não tem esses limites e costuma ser usado em imóveis de alto valor.",
      "A taxa de juros contratada pode ser prefixada, pós-fixada (atrelada à TR, IPCA, SELIC ou outro indexador) ou mista. Esta simulação considera taxa fixa mensal por simplicidade educacional. Contratos com correção monetária têm dinâmica diferente.",
      "O Custo Efetivo Total (CET) de um financiamento inclui todos os custos: juros, encargos, seguros, taxas cartoriais e outros. Esta simulação calcula apenas os encargos mensais declarados, que não compõem um CET oficial completo. Use os valores bancários reais para comparação.",
      "O prazo máximo em reais do financiamento afeta diretamente o custo total: um prazo de 360 meses (30 anos) a 0,7% ao mês resulta em um custo total de juros substancialmente maior do que 120 meses, mesmo que a parcela seja menor.",
    ],
    disclaimer: DISCLAIMER_FINANCIAMENTO,
  },
  {
    slug: "entrada-e-valor-financiado",
    version: "1.0.0",
    level: "nivel-2",
    title: "Otimização de entrada e custo do capital",
    paragraphs: [
      "A decisão sobre o tamanho da entrada envolve o custo de oportunidade do capital. Se o dinheiro disponível para entrada renderia mais em investimentos do que a taxa de juros do financiamento, pode fazer sentido dar uma entrada menor e investir o restante.",
      "No entanto, a taxa de juros de um financiamento imobiliário costuma ser maior do que a taxa líquida de retorno de investimentos conservadores, após impostos. Por isso, muitas análises favorecem dar uma entrada maior.",
      "Além do custo financeiro, existe o risco de liquidez: imobilizar muito capital em entrada pode deixar você sem reserva de emergência. O equilíbrio financeiro saudável considera essa reserva como prioritária.",
      "Esta simulação mostra apenas o impacto matemático da entrada sobre o saldo financiado e os juros totais, em reais. A decisão sobre o tamanho ideal da entrada depende do seu contexto financeiro completo.",
    ],
    disclaimer: DISCLAIMER_FINANCIAMENTO,
  },
  {
    slug: "price-vs-sac",
    version: "1.0.0",
    level: "nivel-2",
    title: "PRICE e SAC: análise comparativa profunda",
    paragraphs: [
      "No PRICE, a parcela base é calculada pela fórmula PMT = PV × [i × (1+i)^n] / [(1+i)^n − 1]. O resultado é uma parcela constante onde os juros decrescem e a amortização cresce a cada período.",
      "No SAC, a amortização constante é A = PV / n. Os juros de cada período são J_t = Saldo_t × i. A parcela diminui linearmente: P_t = A + J_t. O SAC sempre resulta em menor total de juros quando i > 0 e n > 1.",
      "A diferença de total de juros entre PRICE e SAC aumenta com a taxa de juros e com o prazo. Em financiamentos longos (30 anos) com taxas moderadas (0,7% ao mês), a diferença pode ser de dezenas de milhares de reais.",
      "A escolha entre PRICE e SAC também considera a capacidade de pagamento inicial: o SAC tem parcela inicial maior, o que pode aumentar a relação prestação/renda exigida pela instituição financeira.",
    ],
    disclaimer: DISCLAIMER_FINANCIAMENTO,
  },
  {
    slug: "juros-e-amortizacao",
    version: "1.0.0",
    level: "nivel-2",
    title: "Composição interna das parcelas e amortização antecipada",
    paragraphs: [
      "No início de um financiamento PRICE de 360 meses a 0,7% ao mês, mais de 70% de cada parcela corresponde a juros. Apenas 30% vai para amortização. Isso acontece porque o saldo devedor ainda é alto e os juros são calculados sobre ele.",
      "A amortização antecipada reduz o saldo devedor fora do cronograma normal. Como os juros futuros são calculados sobre esse saldo, qualquer redução hoje elimina juros de todas as parcelas seguintes.",
      "Os efeitos da antecipação dependem da modalidade contratada: algumas permitem reduzir o prazo mantendo a parcela; outras permitem reduzir a parcela mantendo o prazo. A escolha impacta o total economizado em juros.",
      "Esta simulação não modela amortizações antecipadas. A tabela de parcelas apresenta o cronograma original sem adiantamentos.",
    ],
    disclaimer: DISCLAIMER_FINANCIAMENTO,
  },
  {
    slug: "encargos-declarados",
    version: "1.0.0",
    level: "nivel-2",
    title: "Encargos declarados e CET educacional",
    paragraphs: [
      "O CET oficial de um financiamento inclui todos os custos obrigatórios do contrato: taxa de juros, seguros obrigatórios (MIP e DFI), tarifas e despesas de registro e avaliação. Esse valor deve ser informado pelo banco antes da assinatura.",
      "Esta simulação calcula um custo total educacional que considera apenas os encargos mensais que você informa. Ele não substitui o CET oficial, pois não inclui custos cartoriais, avaliação do imóvel, registro e outros custos pontuais.",
      "O custo total exibido (juros + encargos mensais declarados) ao longo do financiamento pode ser expressivo, especialmente em prazos longos. Visualizar esse valor em reais antes de assinar o contrato é o objetivo educacional desta ferramenta.",
      "Quando comparar propostas de diferentes bancos, use o CET oficial de cada proposta, não apenas a taxa de juros nominal, pois os encargos e seguros variam e impactam o custo real do crédito.",
    ],
    disclaimer: DISCLAIMER_FINANCIAMENTO,
  },
];
