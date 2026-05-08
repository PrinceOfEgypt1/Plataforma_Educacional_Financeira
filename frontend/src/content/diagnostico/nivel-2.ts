/**
 * Conteúdo educacional — Nível 2 (Intermediário) para o Diagnóstico
 * Financeiro.
 *
 * Aprofunda a leitura das dimensões financeiras sem recalcular nenhum
 * valor no frontend. Os resultados continuam vindo exclusivamente da API.
 */

import { DISCLAIMER_DIAGNOSTICO, type EducationalContent } from "./types";

const RENDA_DESPESAS_NIVEL_2: EducationalContent = {
  slug: "diagnostico-financeiro",
  version: "1.0.0",
  level: "nivel-2",
  title: "Renda, despesas, dívidas e reserva — como se relacionam",
  paragraphs: [
    "A saúde financeira não depende de um único número. Renda alta com " +
      "dívidas altas pode resultar em sobra negativa. Renda menor com " +
      "despesas controladas e reserva adequada pode resultar em saúde " +
      "boa ou ótima.",
    "O diagnóstico olha para as quatro variáveis ao mesmo tempo porque " +
      "elas se influenciam. Dívidas altas reduzem a sobra. Reserva baixa " +
      "aumenta a exposição a imprevistos. Despesas fixas elevadas " +
      "diminuem a flexibilidade para ajustar o orçamento.",
    "Quando sobra mensal é negativa e reserva está abaixo de 1 mês, o " +
      "diagnóstico aplica o rebaixamento máximo de saúde para crítica. " +
      "Esse critério existe porque a combinação dos dois fatores cria " +
      "vulnerabilidade imediata: o orçamento já está no limite e não há " +
      "proteção para imprevistos.",
    "A leitura correta do diagnóstico é sistêmica: score e nível de saúde " +
      "são sínteses de múltiplas dimensões, não uma única métrica isolada.",
  ],
  disclaimer: DISCLAIMER_DIAGNOSTICO,
};

const COMPROMETIMENTO_NIVEL_2: EducationalContent = {
  slug: "dividas-mensais",
  version: "1.0.0",
  level: "nivel-2",
  title: "Por que dívida mensal alta pressiona o orçamento",
  paragraphs: [
    "Dívida mensal pressiona o orçamento de duas formas simultâneas: " +
      "reduz a sobra disponível e aumenta o comprometimento percentual " +
      "da renda. Quanto mais alta a dívida em relação à renda, menor " +
      "a margem para lidar com variações nos gastos.",
    "Comprometimento abaixo de 20% preserva espaço para despesas " +
      "essenciais e reserva. Entre 20% e 30% começa a restringir. " +
      "Acima de 30% o comprometimento alto reduz significativamente a " +
      "capacidade de absorver mudanças. Acima de 40% o risco de " +
      "desequilíbrio é elevado.",
    "O diagnóstico calcula o comprometimento apenas sobre dívidas " +
      "mensais, não sobre despesas essenciais totais. Isso significa que " +
      "mesmo com comprometimento baixo, despesas fixas e variáveis " +
      "altas podem ainda assim gerar sobra negativa.",
    "A leitura pedagógica é: comprometimento e sobra são dimensões " +
      "complementares. Analisar apenas um deles pode dar uma visão " +
      "incompleta da situação.",
  ],
  disclaimer: DISCLAIMER_DIAGNOSTICO,
};

const RESERVA_NIVEL_2: EducationalContent = {
  slug: "reserva-emergencia",
  version: "1.0.0",
  level: "nivel-2",
  title: "Por que reserva em meses é mais intuitiva que apenas valor em reais",
  paragraphs: [
    "R$ 10.000 de reserva significa coisas muito diferentes para duas " +
      "pessoas com despesas mensais distintas. Para quem gasta R$ 2.000 " +
      "por mês, são 5 meses de proteção. Para quem gasta R$ 5.000, " +
      "são apenas 2 meses.",
    "Medir a reserva em meses de despesas essenciais torna a leitura " +
      "proporcional ao custo de vida da pessoa. Isso é mais útil do que " +
      "comparar o valor em reais sem o contexto das despesas mensais.",
    "A plataforma usa as despesas essenciais — soma de fixas e variáveis " +
      "— como denominador do cálculo de reserva em meses. Esse " +
      "denominador vem exclusivamente do backend, com precisão de " +
      "dois decimais.",
    "A referência de 3 a 6 meses de reserva é amplamente usada em " +
      "educação financeira como ponto de atenção. O diagnóstico não " +
      "prescreve uma meta individual — apenas classifica o que foi " +
      "informado e sinaliza quando está abaixo de limites comuns.",
  ],
  disclaimer: DISCLAIMER_DIAGNOSTICO,
};

const GANHAR_BEM_NIVEL_2: EducationalContent = {
  slug: "despesas-fixas-variaveis",
  version: "1.0.0",
  level: "nivel-2",
  title: "Diferença entre ganhar bem e ter equilíbrio financeiro",
  paragraphs: [
    "Equilíbrio financeiro não é sinônimo de renda alta. Ele depende " +
      "da relação entre o que entra e o que sai — e da capacidade de " +
      "manter reserva para imprevistos.",
    "Uma pessoa com renda de R$ 15.000 e despesas fixas de R$ 8.000, " +
      "dívidas de R$ 5.000 e sem reserva pode ter sobra negativa e " +
      "saúde crítica. Uma pessoa com renda de R$ 4.000, despesas de " +
      "R$ 2.500 e reserva de 6 meses pode ter saúde boa.",
    "O score do diagnóstico captura essa relação: ele não premia renda " +
      "alta, mas sim proporções saudáveis entre as dimensões avaliadas. " +
      "Isso é o que torna a ferramenta educacionalmente relevante " +
      "para diferentes perfis de renda.",
    "A leitura mais importante é: o diagnóstico mostra a estrutura atual, " +
      "não a capacidade de geração de renda futura. Melhorar a estrutura " +
      "de gastos e reserva pode mudar o resultado sem alterar a renda.",
  ],
  disclaimer: DISCLAIMER_DIAGNOSTICO,
};

const SCORE_ALERTAS_NIVEL_2: EducationalContent = {
  slug: "sobra-saude-financeira",
  version: "1.0.0",
  level: "nivel-2",
  title: "Como interpretar score e alertas sem transformar em recomendação",
  paragraphs: [
    "O score do diagnóstico vai de 0 a 9 e é composto por três pontuações " +
      "parciais: comprometimento, reserva e sobra. Cada dimensão contribui " +
      "com até 3 pontos. A soma determina o nível de saúde — com regras " +
      "de rebaixamento quando a sobra é negativa.",
    "Alertas são gerados quando uma dimensão ultrapassa limiares " +
      "específicos: comprometimento acima de 30%, reserva abaixo de 3 " +
      "meses, sobra negativa ou mínima. Cada alerta tem um código " +
      "estável e um nível — warning ou critical.",
    "A presença de alerta não é diagnóstico médico nem prescrição " +
      "financeira. É um sinal educacional que indica qual dimensão merece " +
      "atenção. A decisão sobre o que fazer com esse sinal é da pessoa, " +
      "preferencialmente com apoio de profissional habilitado.",
    "Score alto não significa que tudo está perfeito para sempre. Score " +
      "baixo não significa catástrofe inevitável. Ambos são leituras " +
      "do momento atual com base nos dados informados — e podem mudar " +
      "conforme a situação real mudar.",
  ],
  disclaimer: DISCLAIMER_DIAGNOSTICO,
};

export const CONTEUDO_NIVEL_2: ReadonlyArray<EducationalContent> = [
  RENDA_DESPESAS_NIVEL_2,
  COMPROMETIMENTO_NIVEL_2,
  RESERVA_NIVEL_2,
  GANHAR_BEM_NIVEL_2,
  SCORE_ALERTAS_NIVEL_2,
];
