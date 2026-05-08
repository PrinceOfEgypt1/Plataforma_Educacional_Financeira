/**
 * Conteúdo educacional — Nível 1 (Essencial) para o Diagnóstico Financeiro.
 *
 * Explica os conceitos básicos do diagnóstico sem recalcular nenhum valor
 * financeiro no frontend. Todos os números exibidos na página vêm da API.
 */

import { DISCLAIMER_DIAGNOSTICO, type EducationalContent } from "./types";

const DIAGNOSTICO_NIVEL_1: EducationalContent = {
  slug: "diagnostico-financeiro",
  version: "1.0.0",
  level: "nivel-1",
  title: "Diagnóstico financeiro — o que é e para que serve",
  paragraphs: [
    "Um diagnóstico financeiro é uma leitura estruturada da sua situação " +
      "atual. Ele considera renda, despesas, dívidas e reserva ao mesmo " +
      "tempo, porque nenhum desses elementos, isolado, conta a história " +
      "completa.",
    "Renda alta não garante equilíbrio financeiro se as despesas e dívidas " +
      "consumirem tudo. Da mesma forma, renda menor pode conviver com " +
      "saúde financeira se houver controle e reserva adequada.",
    "A plataforma calcula o diagnóstico a partir de cinco informações: " +
      "renda mensal, despesas fixas, despesas variáveis, dívidas mensais " +
      "e reserva de emergência atual. O resultado mostra score, nível de " +
      "saúde e alertas — tudo calculado pelo backend, sem recálculo no " +
      "navegador.",
    "O objetivo é educacional: mostrar onde estão os sinais de atenção e " +
      "ajudar na leitura da própria situação. O diagnóstico não substitui " +
      "análise profissional.",
  ],
  disclaimer: DISCLAIMER_DIAGNOSTICO,
};

const DESPESAS_NIVEL_1: EducationalContent = {
  slug: "despesas-fixas-variaveis",
  version: "1.0.0",
  level: "nivel-1",
  title: "Despesas fixas e variáveis — por que separar",
  paragraphs: [
    "Despesas fixas são os compromissos mensais com valor previsível: " +
      "aluguel, prestação, plano de saúde, mensalidade escolar. Elas " +
      "chegam todo mês com o mesmo valor, independentemente do que você " +
      "fizer.",
    "Despesas variáveis são os gastos que mudam de mês para mês: " +
      "alimentação, transporte, lazer, vestuário. Elas dependem dos " +
      "seus hábitos e podem ser ajustadas com mais facilidade.",
    "Separar os dois tipos ajuda a entender quanta rigidez existe no " +
      "seu orçamento. Quando a soma de fixas e variáveis ultrapassa a " +
      "renda, a sobra mensal fica negativa — sinal crítico identificado " +
      "pelo diagnóstico.",
    "No diagnóstico, a soma de despesas fixas mais variáveis forma a " +
      "base das despesas essenciais mensais, usada também para calcular " +
      "quantos meses de reserva você tem disponíveis.",
  ],
  disclaimer: DISCLAIMER_DIAGNOSTICO,
};

const DIVIDAS_NIVEL_1: EducationalContent = {
  slug: "dividas-mensais",
  version: "1.0.0",
  level: "nivel-1",
  title: "Dívidas mensais — comprometimento de renda",
  paragraphs: [
    "Dívidas mensais são as parcelas que você paga todo mês: cartão de " +
      "crédito, empréstimo pessoal, financiamento. Elas reduzem " +
      "diretamente a sobra mensal disponível.",
    "O comprometimento de renda é a fatia da renda que vai para dívidas. " +
      "Se você ganha R$ 5.000 e paga R$ 1.500 em parcelas, seu " +
      "comprometimento é de 30%.",
    "Comprometimento abaixo de 20% é considerado baixo. Acima de 30% " +
      "o diagnóstico emite alerta, porque dívidas altas reduzem o espaço " +
      "para despesas essenciais e emergências. Acima de 40% o alerta " +
      "passa a crítico.",
    "O diagnóstico exibe o comprometimento como percentual da renda " +
      "mensal, calculado exclusivamente pelo backend. A leitura educacional " +
      "é: comprometimento alto não é necessariamente emergência, mas " +
      "merece atenção e análise.",
  ],
  disclaimer: DISCLAIMER_DIAGNOSTICO,
};

const RESERVA_NIVEL_1: EducationalContent = {
  slug: "reserva-emergencia",
  version: "1.0.0",
  level: "nivel-1",
  title: "Reserva de emergência — meses de proteção",
  paragraphs: [
    "Reserva de emergência é o valor guardado para cobrir imprevistos sem " +
      "recorrer a dívidas: conserto do carro, problema de saúde, perda " +
      "temporária de renda.",
    "O diagnóstico mede a reserva em meses de despesas essenciais, não " +
      "apenas em reais. Isso torna a leitura mais intuitiva: se sua " +
      "reserva cobre 3 meses de despesas, você tem 3 meses de proteção.",
    "Menos de 1 mês de reserva é crítico. Entre 1 e 3 meses é " +
      "insuficiente. Entre 3 e 6 meses é mínima. Entre 6 e 12 meses é " +
      "adequada. Acima de 12 meses é confortável.",
    "A reserva ideal varia com a estabilidade da renda. Quem tem renda " +
      "variável ou dependentes tende a precisar de mais meses de proteção. " +
      "O diagnóstico mostra o número calculado — a leitura do contexto " +
      "pessoal é sua.",
  ],
  disclaimer: DISCLAIMER_DIAGNOSTICO,
};

const SOBRA_SAUDE_NIVEL_1: EducationalContent = {
  slug: "sobra-saude-financeira",
  version: "1.0.0",
  level: "nivel-1",
  title: "Sobra mensal e saúde financeira — como ler o resultado",
  paragraphs: [
    "Sobra mensal é o que resta da renda depois de pagar despesas fixas, " +
      "despesas variáveis e dívidas mensais. Sobra positiva indica que " +
      "ainda há margem no orçamento. Sobra negativa é sinal de que os " +
      "gastos ultrapassam a renda — situação que exige atenção.",
    "O score do diagnóstico combina três dimensões: comprometimento de " +
      "renda, reserva em meses e sobra mensal. Cada dimensão contribui " +
      "com até 3 pontos, totalizando no máximo 9.",
    "O nível de saúde financeira é derivado do score e de regras " +
      "específicas. Os níveis vão de crítica a ótima. Sobra negativa " +
      "aplica um rebaixamento automático, independentemente do score — " +
      "porque gastar mais do que se ganha é sempre um sinal importante.",
    "O resultado do diagnóstico é um retrato do momento atual com base " +
      "nos dados informados. Ele não prevê o futuro nem recomenda " +
      "decisões específicas.",
  ],
  disclaimer: DISCLAIMER_DIAGNOSTICO,
};

export const CONTEUDO_NIVEL_1: ReadonlyArray<EducationalContent> = [
  DIAGNOSTICO_NIVEL_1,
  DESPESAS_NIVEL_1,
  DIVIDAS_NIVEL_1,
  RESERVA_NIVEL_1,
  SOBRA_SAUDE_NIVEL_1,
];
