import type { GlossaryEntry } from "./types";

export const GLOSSARIO_FINANCIAMENTO: ReadonlyArray<GlossaryEntry> = [
  {
    slug: "financiamento-imobiliario",
    term: "Financiamento imobiliário",
    shortDefinition: "Empréstimo de longo prazo para compra de imóvel.",
    fullDefinition:
      "Modalidade de crédito em que o banco paga o imóvel ao vendedor e o comprador devolve o valor em parcelas mensais ao longo de anos, com acréscimo de juros.",
    example:
      "Você financia R$ 240.000 em 360 meses. O banco paga o vendedor e você paga ao banco mês a mês.",
    relatedModule: "financing",
  },
  {
    slug: "valor-imovel",
    term: "Valor do imóvel",
    shortDefinition: "Preço total do imóvel negociado.",
    fullDefinition:
      "O valor total pelo qual o imóvel é comprado e vendido. Sobre esse valor são calculadas a entrada e o valor financiado.",
    example: "Imóvel avaliado em R$ 300.000.",
    relatedModule: "financing",
  },
  {
    slug: "entrada",
    term: "Entrada",
    shortDefinition: "Valor pago à vista no ato da compra.",
    fullDefinition:
      "Parcela do preço do imóvel paga pelo comprador com recursos próprios no momento da contratação do financiamento. Reduz o valor a ser financiado.",
    example: "Entrada de R$ 60.000 em um imóvel de R$ 300.000.",
    relatedModule: "financing",
  },
  {
    slug: "valor-financiado",
    term: "Valor financiado",
    shortDefinition: "Valor pedido emprestado ao banco.",
    fullDefinition:
      "Diferença entre o valor do imóvel e a entrada. É sobre esse valor que os juros são calculados durante todo o financiamento.",
    example:
      "Imóvel de R$ 300.000 com entrada de R$ 60.000: valor financiado = R$ 240.000.",
    relatedModule: "financing",
  },
  {
    slug: "prazo",
    term: "Prazo do financiamento",
    shortDefinition: "Número de meses para pagar o financiamento.",
    fullDefinition:
      "Quantidade total de parcelas mensais do financiamento. Prazos mais longos reduzem a parcela mensal mas aumentam o total de juros pago.",
    example: "360 meses = 30 anos.",
    relatedModule: "financing",
  },
  {
    slug: "taxa-juros-mensal",
    term: "Taxa de juros mensal",
    shortDefinition: "Percentual mensal cobrado sobre o saldo devedor.",
    fullDefinition:
      "Taxa aplicada ao saldo devedor a cada mês para calcular os juros da parcela. Expressa em percentual ao mês (% a.m.).",
    example:
      "Taxa de 0,7% a.m. sobre saldo de R$ 240.000 gera R$ 1.680 de juros no primeiro mês.",
    relatedModule: "financing",
  },
  {
    slug: "amortizacao",
    term: "Amortização",
    shortDefinition: "Parcela da prestação que reduz o saldo devedor.",
    fullDefinition:
      "Componente da parcela mensal que efetivamente reduz o valor devido ao banco. Quanto maior a amortização, mais rápido o saldo devedor diminui.",
    example:
      "No PRICE, a amortização começa pequena e cresce ao longo do contrato.",
    relatedModule: "financing",
  },
  {
    slug: "saldo-devedor",
    term: "Saldo devedor",
    shortDefinition: "Valor que ainda falta pagar ao banco.",
    fullDefinition:
      "Total que ainda resta do valor financiado original. O saldo devedor diminui a cada parcela paga, na proporção da amortização de cada período.",
    example:
      "Após 12 parcelas de um financiamento SAC de R$ 240.000/360m, o saldo devedor cai para cerca de R$ 232.000.",
    relatedModule: "financing",
  },
  {
    slug: "sistema-price",
    term: "Sistema PRICE",
    shortDefinition: "Sistema de parcelas aproximadamente constantes.",
    fullDefinition:
      "Sistema de amortização em que a parcela base é calculada pela fórmula PMT = PV × [i × (1+i)^n] / [(1+i)^n − 1]. As parcelas são aproximadamente iguais; no início mais juros, depois mais amortização.",
    example:
      "Financiamento de R$ 240.000 a 0,7% por 360 meses no PRICE: primeira parcela ≈ R$ 1.797.",
    relatedModule: "financing",
  },
  {
    slug: "sistema-sac",
    term: "Sistema SAC",
    shortDefinition:
      "Sistema de Amortização Constante — parcelas decrescentes.",
    fullDefinition:
      "Sistema em que a amortização mensal é fixa (A = PV / n). Os juros diminuem a cada mês porque o saldo devedor cai, e a prestação total também decresce. Resulta em menor total de juros que o PRICE.",
    example:
      "No SAC, a primeira parcela é maior, mas a última é muito menor que no PRICE.",
    relatedModule: "financing",
  },
  {
    slug: "encargos-mensais",
    term: "Encargos mensais",
    shortDefinition: "Custos adicionais mensais além de juros e amortização.",
    fullDefinition:
      "Valores mensais declarados que se somam à prestação de juros e amortização. Incluem seguro habitacional (MIP/DFI), tarifa de administração e outros custos fixos mensais do contrato.",
    example:
      "Seguro de R$ 150/mês + tarifa de R$ 25/mês = R$ 175 de encargos mensais.",
    relatedModule: "financing",
  },
  {
    slug: "custo-total",
    term: "Custo total",
    shortDefinition: "Total de juros e encargos pagos além do principal.",
    fullDefinition:
      "Soma de todos os juros e encargos mensais pagos ao longo do financiamento, excluindo o valor amortizado. Representa o custo do crédito acima do que foi pedido emprestado.",
    example:
      "Financiamento de R$ 240.000: custo total de R$ 200.000 significa que você pagou R$ 440.000 ao todo.",
    relatedModule: "financing",
  },
];
