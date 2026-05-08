/**
 * Conteúdo educacional para alertas do diagnóstico financeiro.
 *
 * Os códigos de alerta são gerados pelo backend em UPPER_SNAKE_CASE e
 * nunca recalculados no frontend. Este arquivo apenas descreve o
 * significado educacional de cada código.
 */

import type { AlertEducationalContent } from "./types";

export const ALERTAS_EDUCACIONAIS: ReadonlyArray<AlertEducationalContent> = [
  {
    code: "COMPROMETIMENTO_CRITICO",
    title: "Comprometimento de renda crítico",
    explanation:
      "Mais de 40% da renda mensal está comprometida com dívidas. Isso " +
      "significa que uma fatia grande da renda vai direto para pagamentos " +
      "de crédito, reduzindo muito o espaço para despesas essenciais e " +
      "para guardar reserva.",
    whyItMatters:
      "Quando o comprometimento é muito alto, qualquer variação na renda " +
      "ou nas despesas pode tornar difícil cumprir todos os compromissos. " +
      "A margem de segurança fica pequena.",
    pedagogicalNote:
      "Este é um sinal educacional, não uma sentença. Compreender o " +
      "percentual ajuda a visualizar quanto da renda está preso em " +
      "dívidas e a pensar em estratégias de reorganização ao longo " +
      "do tempo, com orientação profissional se necessário.",
  },
  {
    code: "COMPROMETIMENTO_ALTO",
    title: "Comprometimento de renda elevado",
    explanation:
      "Entre 30% e 40% da renda mensal está comprometida com dívidas. " +
      "Esse nível ainda é manejável, mas já começa a reduzir a " +
      "flexibilidade do orçamento e a capacidade de guardar reserva.",
    whyItMatters:
      "Comprometimento nessa faixa tende a deixar pouco espaço para " +
      "imprevistos. Uma despesa extra ou queda de renda pode pressionar " +
      "o equilíbrio mais rapidamente.",
    pedagogicalNote:
      "Monitorar o comprometimento ao longo do tempo é uma prática " +
      "educacional útil. Reduzir dívidas gradualmente libera renda para " +
      "outros objetivos. O diagnóstico não indica qual dívida priorizar — " +
      "essa decisão depende do contexto pessoal e financeiro.",
  },
  {
    code: "RESERVA_CRITICA",
    title: "Reserva de emergência crítica",
    explanation:
      "A reserva atual cobre menos de 1 mês de despesas essenciais. " +
      "Isso significa que um imprevisto de média duração — como perda " +
      "temporária de renda ou despesa médica — poderia não ser coberto " +
      "sem recorrer a crédito.",
    whyItMatters:
      "Sem reserva de emergência mínima, qualquer imprevisto pode " +
      "transformar-se em dívida. A ausência de proteção aumenta a " +
      "vulnerabilidade financeira no curto prazo.",
    pedagogicalNote:
      "Construir reserva geralmente começa pequeno — mesmo guardar o " +
      "equivalente a 15 dias de despesas é um primeiro passo. O " +
      "diagnóstico mostra a situação atual; a evolução depende das " +
      "escolhas e da situação de cada pessoa.",
  },
  {
    code: "RESERVA_INSUFICIENTE",
    title: "Reserva de emergência insuficiente",
    explanation:
      "A reserva atual cobre entre 1 e 3 meses de despesas essenciais. " +
      "É um colchão inicial, mas abaixo do que a educação financeira " +
      "costuma indicar como referência mínima de conforto.",
    whyItMatters:
      "Reserva entre 1 e 3 meses protege contra imprevistos de curto " +
      "prazo, mas pode não ser suficiente para situações de duração " +
      "maior, como mudança de emprego ou problema de saúde prolongado.",
    pedagogicalNote:
      "A referência de 3 a 6 meses é um ponto de partida educacional, " +
      "não uma regra universal. Quem tem renda variável ou dependentes " +
      "pode precisar de mais. O diagnóstico mostra onde você está — " +
      "a meta individual depende do contexto.",
  },
  {
    code: "SOBRA_NEGATIVA",
    title: "Despesas superam a renda",
    explanation:
      "A soma de despesas fixas, variáveis e dívidas mensais ultrapassa " +
      "a renda informada. Isso significa que o orçamento atual está no " +
      "negativo — mais saindo do que entrando.",
    whyItMatters:
      "Sobra negativa é um dos sinais mais importantes do diagnóstico. " +
      "Mantida por muito tempo, tende a reduzir a reserva ou a gerar " +
      "novas dívidas para cobrir o déficit.",
    pedagogicalNote:
      "Este alerta identifica uma situação que merece atenção imediata. " +
      "Compreender quais categorias pesam mais no orçamento é um primeiro " +
      "passo para reorganização. O diagnóstico não indica qual gasto " +
      "cortar — essa análise depende das prioridades e da situação " +
      "real de cada pessoa.",
  },
  {
    code: "SOBRA_MINIMA",
    title: "Sobra mensal mínima",
    explanation:
      "A sobra mensal é positiva, mas representa menos de 10% da renda. " +
      "O orçamento está equilibrado, mas com margem muito pequena para " +
      "imprevistos ou para guardar reserva.",
    whyItMatters:
      "Sobra mínima significa que qualquer oscilação nas despesas ou " +
      "na renda pode eliminar o equilíbrio. A capacidade de construir " +
      "reserva também fica limitada nesse cenário.",
    pedagogicalNote:
      "Sobra mínima não é emergência, mas é um sinal de que o orçamento " +
      "tem pouca folga. Identificar onde há espaço para ajuste pode " +
      "ajudar a aumentar essa margem ao longo do tempo.",
  },
];

/**
 * Busca o conteúdo educacional de um alerta pelo código.
 * Retorna undefined se o código não tiver conteúdo educacional mapeado.
 */
export function getAlertaEducacional(
  code: string,
): AlertEducationalContent | undefined {
  return ALERTAS_EDUCACIONAIS.find((a) => a.code === code);
}
