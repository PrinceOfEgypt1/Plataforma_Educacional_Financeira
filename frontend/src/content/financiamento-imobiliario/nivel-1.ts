import { DISCLAIMER_FINANCIAMENTO, type EducationalContent } from "./types";

export const CONTEUDO_NIVEL_1: ReadonlyArray<EducationalContent> = [
  {
    slug: "o-que-e-financiamento-imobiliario",
    version: "1.0.0",
    level: "nivel-1",
    title: "O que é financiamento imobiliário?",
    paragraphs: [
      "Financiamento imobiliário é um empréstimo de longo prazo que permite comprar um imóvel sem pagar o valor total à vista. Você paga uma parte do valor como entrada e financia o restante em parcelas mensais ao longo de anos.",
      "Cada parcela inclui uma parte dos juros cobrados pelo banco e uma parte da amortização, que é a redução do saldo devedor. Com o tempo, você vai pagando o valor que pediu emprestado e, além disso, os juros pelo uso desse dinheiro.",
      "O prazo de um financiamento imobiliário costuma ser longo, entre 10 e 35 anos. Quanto maior o prazo, menor a parcela mensal, mas maior o total de juros pago ao longo do contrato.",
      "Antes de contratar, é importante entender quanto você vai pagar de entrada, qual será a parcela inicial, como ela muda ao longo do tempo e qual sistema de amortização foi escolhido.",
    ],
    disclaimer: DISCLAIMER_FINANCIAMENTO,
  },
  {
    slug: "entrada-e-valor-financiado",
    version: "1.0.0",
    level: "nivel-1",
    title: "Entrada e valor financiado",
    paragraphs: [
      "A entrada é o valor que você paga no ato da compra, com recursos próprios. O valor financiado é a diferença entre o preço do imóvel e a entrada. É sobre o valor financiado que os juros são cobrados.",
      "Quanto maior a entrada, menor o valor financiado e, consequentemente, menores as parcelas e o total de juros pago. Uma entrada maior também pode facilitar a aprovação do crédito e reduzir o risco para o banco.",
      "Muitos programas de financiamento exigem uma entrada mínima de 20% do valor do imóvel. Entradas menores são possíveis em alguns programas habitacionais, mas costumam ter condições específicas.",
      "Calcular a entrada ideal envolve equilibrar quanto você tem disponível hoje, quanto você vai pagar por mês e quanto esse dinheiro poderia render se aplicado. Esta simulação não faz essa análise por você.",
    ],
    disclaimer: DISCLAIMER_FINANCIAMENTO,
  },
  {
    slug: "price-vs-sac",
    version: "1.0.0",
    level: "nivel-1",
    title: "PRICE ou SAC: qual a diferença?",
    paragraphs: [
      "PRICE e SAC são os dois principais sistemas de amortização usados no Brasil. Eles definem como as parcelas são calculadas ao longo do financiamento.",
      "No sistema PRICE, as parcelas são aproximadamente iguais do início ao fim. O valor que você paga por mês não muda muito. No começo, a maior parte da parcela é de juros; com o tempo, a amortização vai aumentando.",
      "No sistema SAC, a amortização é constante ao longo do tempo: você paga a mesma quantia de amortização a cada mês. Como os juros são calculados sobre o saldo devedor, e o saldo diminui, as parcelas vão decrescendo ao longo do contrato.",
      "A parcela inicial do SAC costuma ser maior que a do PRICE, mas o total de juros pago no SAC é menor. A escolha depende da sua capacidade de pagamento hoje e do quanto você quer economizar no longo prazo.",
    ],
    disclaimer: DISCLAIMER_FINANCIAMENTO,
  },
  {
    slug: "juros-e-amortizacao",
    version: "1.0.0",
    level: "nivel-1",
    title: "Juros e amortização: conceitos fundamentais",
    paragraphs: [
      "Cada parcela do financiamento é composta por dois componentes principais: juros e amortização. Os juros são o custo do dinheiro emprestado, calculados sobre o saldo devedor. A amortização é a parte que reduz o que você deve.",
      "No início do financiamento, o saldo devedor ainda é alto. Por isso, os juros de cada parcela são maiores. Com o tempo, o saldo cai e os juros diminuem.",
      "Se você olhar a tabela de parcelas, vai ver que no PRICE a parcela muda pouco, mas a composição interna muda bastante: a amortização cresce e os juros diminuem. No SAC, a amortização é fixa e os juros decrescem.",
      "Entender essa composição ajuda a planejar antecipações: quando você antecipa parcelas, está reduzindo o saldo devedor e, consequentemente, os juros futuros.",
    ],
    disclaimer: DISCLAIMER_FINANCIAMENTO,
  },
  {
    slug: "encargos-declarados",
    version: "1.0.0",
    level: "nivel-1",
    title: "Encargos mensais declarados",
    paragraphs: [
      "Além de juros e amortização, um financiamento real pode incluir encargos mensais declarados como seguro habitacional, tarifa de administração e outros custos fixos.",
      "O seguro habitacional é exigido pela maioria dos bancos. Ele cobre situações como morte, invalidez permanente e danos físicos ao imóvel. O valor varia de acordo com o banco, o valor do imóvel e o perfil do tomador.",
      "A tarifa de administração é cobrada por alguns bancos para cobrir custos operacionais do contrato. Nem todos os contratos têm essa cobrança.",
      "Esta simulação permite incluir esses encargos como valores mensais fixos. Eles são separados dos juros e da amortização para que você visualize claramente o custo de cada componente. Valores reais devem ser confirmados com o banco.",
    ],
    disclaimer: DISCLAIMER_FINANCIAMENTO,
  },
];
