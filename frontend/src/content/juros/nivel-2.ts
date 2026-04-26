/**
 * Conteúdo educacional — Nível 2 (Intermediário) para o módulo de Juros.
 *
 * Critérios editoriais (Doc 08 §10):
 *   - Aprofundamento moderado, com mecanismo do cálculo descrito em prosa.
 *   - 5–8 minutos de leitura por bloco.
 *   - Cada afirmação numérica usa um caso de Doc 15 (JS-01 ou JC-01).
 *   - Não substitui Doc 03 (regras formais), apenas explica em PT-BR.
 */

import { DISCLAIMER_EDUCACIONAL, type EducationalContent } from "./types";

const JUROS_SIMPLES_NIVEL_2: EducationalContent = {
  slug: "juros-simples",
  version: "1.0.0",
  level: "nivel-2",
  title: "Juros simples — como o cálculo se desdobra mês a mês",
  paragraphs: [
    "No regime simples, os juros de cada período são sempre o resultado " +
      "de aplicar a taxa sobre o principal. O principal não muda ao longo " +
      "do tempo: ele é a mesma referência fixa do começo ao fim.",
    "Isso significa que, em uma tabela de evolução, a coluna de juros do " +
      "período fica constante, e a coluna de saldo cresce de forma linear. " +
      "Cada linha soma a mesma quantia à anterior.",
    "Tomando o caso JS-01 do Doc 15 — principal de R$ 1.000,00, taxa de " +
      "1% ao mês e prazo de 12 meses — os juros de cada mês são exatamente " +
      "R$ 10,00. Ao final dos 12 meses, foram somados 12 juros mensais " +
      "iguais, totalizando R$ 120,00. O saldo final é R$ 1.120,00.",
    "Por construção, o regime simples não captura o efeito da " +
      "capitalização: ele ignora os juros já gerados ao calcular os " +
      "juros do próximo período. É essa simplicidade que o torna " +
      "didaticamente útil como ponto de partida.",
    "No campo da exibição, o módulo apresenta os totais no painel de " +
      "resumo (juros totais e montante final) e exibe a evolução completa " +
      "na tabela de amortização e no gráfico de evolução do saldo.",
  ],
  disclaimer: DISCLAIMER_EDUCACIONAL,
};

const JUROS_COMPOSTOS_NIVEL_2: EducationalContent = {
  slug: "juros-compostos",
  version: "1.0.0",
  level: "nivel-2",
  title: "Juros compostos — capitalização ao final de cada período",
  paragraphs: [
    "No regime composto, ao final de cada período os juros gerados " +
      "passam a fazer parte do saldo. No período seguinte, a taxa é " +
      "aplicada sobre esse saldo já corrigido — não mais sobre o " +
      "principal original.",
    'É essa operação de "absorver os juros no saldo" que recebe o nome ' +
      "de capitalização. Ela é feita a cada período (mensal, no caso do " +
      "módulo) e está descrita formalmente no Doc 03.",
    "Tomando o caso JC-01 do Doc 15 — principal de R$ 1.000,00, taxa de " +
      "1% ao mês, prazo de 12 meses — o saldo cresce um pouco mais a " +
      "cada mês porque a base do cálculo também cresce. O montante " +
      "final fica em aproximadamente R$ 1.126,83.",
    "A diferença em relação ao regime simples (que daria R$ 1.120,00 " +
      "no caso correspondente) parece pequena: cerca de R$ 6,83 ao " +
      "final dos 12 meses. Esse efeito, no entanto, cresce não " +
      "linearmente conforme o prazo aumenta.",
    "No painel, o resumo de juros compostos inclui campos específicos " +
      "que não existem no regime simples: total aportado, total " +
      "investido (principal + aportes) e juros totais. Esses campos " +
      "ajudam a separar o que é dinheiro novo de quem aportou, do que " +
      "é resultado da capitalização.",
  ],
  disclaimer: DISCLAIMER_EDUCACIONAL,
};

const COMPARACAO_NIVEL_2: EducationalContent = {
  slug: "comparacao-juros",
  version: "1.0.0",
  level: "nivel-2",
  title: "Comparação — diferença absoluta, razão e leitura crítica",
  paragraphs: [
    "A aba de comparação roda os dois regimes — simples e composto — " +
      "com exatamente os mesmos parâmetros de entrada (principal, taxa " +
      "e prazo). O painel de resumo mostra, lado a lado, montante " +
      "simples, montante composto, diferença absoluta e a razão entre " +
      "os dois.",
    "A diferença absoluta é o quanto, em reais, o regime composto " +
      "supera o regime simples no mesmo período. A razão expressa o " +
      "mesmo fato em formato proporcional: quantas vezes o composto é " +
      "maior que o simples.",
    "Em prazos curtos, a razão fica próxima de 1, ou seja, a diferença " +
      "é mínima. Em prazos longos, a razão cresce, refletindo o efeito " +
      "acumulado da capitalização. O gráfico ajuda a visualizar onde a " +
      "diferença começa a se distanciar.",
    "É importante lembrar: o cálculo não diz qual regime é melhor para " +
      "uma decisão sua. Ele só mostra como cada regime evolui sob as " +
      "mesmas premissas. Decisões de aplicar, antecipar ou rolar uma " +
      "dívida envolvem variáveis que não estão na tela e dependem do " +
      "seu contexto pessoal.",
  ],
  disclaimer: DISCLAIMER_EDUCACIONAL,
};

const APORTES_NIVEL_2: EducationalContent = {
  slug: "aportes-mensais",
  version: "1.0.0",
  level: "nivel-2",
  title: "Aportes mensais — modelagem na tabela de evolução",
  paragraphs: [
    "Quando há aporte mensal, a tabela de evolução do regime composto " +
      "ganha uma coluna dedicada. A cada período: parte-se do saldo " +
      "inicial, calculam-se os juros sobre esse saldo, soma-se o " +
      "aporte e fecha-se o saldo final do período.",
    "O total aportado ao longo do prazo aparece em um campo separado " +
      "do resumo, distinto dos juros totais e do principal inicial. " +
      "Essa separação é deliberada: ela evita confundir crescimento por " +
      "capitalização com crescimento por entrada de dinheiro novo.",
    "Para um mesmo principal e mesma taxa, aumentar o aporte aumenta " +
      "o montante final, mas o efeito vem em duas partes: o próprio " +
      "valor aportado e os juros que esse valor gera nos meses " +
      "seguintes.",
    "Aporte zero (ou ausência de aporte) é um caso válido do contrato " +
      "do backend: a entrada `aporte_mensal` é opcional e, quando " +
      "ausente, o cálculo segue como capitalização pura.",
  ],
  disclaimer: DISCLAIMER_EDUCACIONAL,
};

export const CONTEUDO_NIVEL_2: ReadonlyArray<EducationalContent> = [
  JUROS_SIMPLES_NIVEL_2,
  JUROS_COMPOSTOS_NIVEL_2,
  COMPARACAO_NIVEL_2,
  APORTES_NIVEL_2,
];
