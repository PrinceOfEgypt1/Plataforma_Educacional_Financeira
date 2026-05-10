# CONTRATO EDUCACIONAL DA API — GATE PO/UX/VALOR

## 1. Identificação do documento

| Campo | Registro |
| --- | --- |
| Projeto | Plataforma Educacional Financeira |
| Gate | Gate PO/UX/Valor — Reestruturação Educacional e Auditável |
| Item | Item 7 — Definir contrato educacional da API |
| Documento | Contrato educacional da API |
| Base considerada | main @ 81a64c7 |
| Estado | Sprint 5 congelada; Gate aberto |

A Plataforma Educacional Financeira só deve avançar quando cada módulo for capaz de calcular corretamente, explicar de forma clara, mostrar memória de cálculo, comparar cenários, alertar riscos, citar fontes e encantar o usuário.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 2. Contexto do contrato educacional da API

O Item 6 definiu o Padrão Oficial de Telas e mostrou que uma interface educacional precisa receber muito mais do que um número final. Este contrato nasce para orientar a futura resposta da API, de modo que cada tela possa renderizar resultado, interpretação, memória, fontes, limites, alertas, tabelas, gráficos e comparações com evidência auditável.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 3. Problema que este contrato resolve

O problema central é impedir que a interface improvise pedagogia a partir de respostas numéricas pobres. Quando a API retorna apenas um valor, a tela não consegue provar fórmula, substituição, arredondamento, fonte, limite, risco ou comparação. Isso fragiliza o aceite do PO e repete a diferença entre funcionamento técnico e valor educacional percebido.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 4. O que é o contrato educacional da API

É um contrato documental e normativo para respostas financeiras estruturadas. Ele define campos canônicos, obrigações condicionais, exemplos de payload, contraexemplos proibidos e critérios de reprovação. O contrato prepara implementação futura, mas não cria rota, schema executável, modelo Pydantic, JSON Schema aplicado ou alteração de backend neste item.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 5. O que este contrato não é

Este contrato não implementa a API, não altera rotas, não altera backend, não altera frontend, não altera testes, não atualiza planilha, não libera a Sprint 5 e não conclui o Gate PO/UX/Valor. Também não substitui OpenAPI, JSON Schema ou Pydantic futuros; ele define a semântica educacional que essas ferramentas deverão formalizar depois.

Declarações literais obrigatórias de escopo negativo:

- Este contrato não altera rotas
- Este contrato não altera backend
- Este contrato não altera frontend
- Este contrato não altera testes
- Este contrato não atualiza planilha
- Este contrato não libera a Sprint 5
- Este contrato não conclui o Gate PO/UX/Valor

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 6. Relação com o Padrão Oficial de Telas do Item 6

O Padrão Oficial de Telas exige que a tela mostre cálculo, interpretação, memória, tabela, fontes, limites, alertas e ações. Este contrato traduz essas exigências em campos de API para que a interface não precise adivinhar significado.

| Necessidade da tela do Item 6 | Campo ou bloco exigido na API | Evidência esperada | Critério de reprovação |
| --- | --- | --- | --- |
| Mostrar resultado principal | result.primaryValue e result.summary | Valor, unidade, escala e resumo | Retornar número solto sem unidade |
| Explicar resultado | interpretation e educationalExplanation | Fatos, inferências e limitações | Deixar a interface adivinhar texto |
| Mostrar memória | memoriaCalculo | Fórmula, substituições, etapas e arredondamento | Resultado financeiro sem memória |
| Citar fontes e limites | sources e limits | Fonte, data, uso e limitação | Omitir fonte necessária |
| Comparar cenários | comparison.scenarios e tradeOffs | Diferenças e conclusão educacional | Declarar opção melhor sem contexto |
| Alimentar tabela longa | table.columns, table.rows, table.totals | Linhas conforme prazo ou critério claro | Cortar tabela sem declarar limite |
| Alimentar gráficos | chartData.series | Escala, unidade, legenda e leitura | Enviar série sem unidade |
| Alertar riscos | alerts e risks | Severidade, mensagem e sugestão educativa | Gerar recomendação personalizada |

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 7. Princípios do contrato educacional

Os princípios são: estabilidade de campos, camelCase sem acentos, textos exibíveis em português correto, separação entre dados calculados e interpretação, rastreabilidade, obrigação de memória para cálculo relevante, fontes datadas quando aplicável, limites explícitos, alerta sem recomendação personalizada e evidência suficiente para Value Gate e aceite do PO.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 8. Responsabilidades da API

A API futura deverá calcular ou organizar dados calculados, normalizar entradas, validar campos, retornar resultado com unidade, estruturar interpretação, fornecer memória de cálculo, declarar fontes, limites, alertas, riscos, comparações, tabelas e dados de gráfico. Também deverá diferenciar erro de validação, erro técnico e indisponibilidade de fonte oficial.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 9. Responsabilidades da interface

A interface deverá renderizar os blocos recebidos sem alterar significado, preservar hierarquia pedagógica, mostrar estados corretos, não ocultar conteúdo essencial, respeitar fontes e limites, informar alertas sem transformar orientação em recomendação personalizada e não fabricar memória de cálculo quando a API não fornecer evidência suficiente.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 10. Responsabilidades compartilhadas entre API e interface

API e interface compartilham responsabilidade sobre clareza, acessibilidade, rastreabilidade e aceitação pedagógica. A API fornece estrutura e evidência; a interface transforma essa estrutura em experiência visual. Quando uma evidência estiver ausente, a interface deve exibir limitação ou bloquear aprovação no Value Gate, não completar lacunas com texto improvisado.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 11. Envelope-base de resposta educacional

O envelope-base deve combinar metadados, entradas, validação, resultado, interpretação, memória, fontes, limites, alertas, comparação, tabela, gráfico, metadados educacionais e auditoria. A lógica central é: resultado + interpretação + memória + fontes + limites + alertas + tabela/comparação quando aplicável.

```json
{
  "schemaVersion": "1.0.0",
  "requestId": "req_simular_financiamento_exemplo",
  "moduleId": "financiamento_imobiliario",
  "operationId": "simular_financiamento",
  "generatedAt": "2026-05-10T00:00:00Z",
  "locale": "pt-BR",
  "currency": "BRL",
  "calculationMode": "educationalSimulation",
  "rawInput": {
    "valor": 10000,
    "taxaMensal": 0.01,
    "prazoMeses": 12
  },
  "normalizedInput": {
    "principal": 10000.0,
    "monthlyRate": 0.01,
    "termMonths": 12
  },
  "validation": {
    "status": "valid",
    "messages": []
  },
  "result": {
    "primaryValue": {
      "label": "Parcela estimada",
      "value": 1120.0,
      "unit": "BRL",
      "scale": 2
    },
    "secondaryValues": [
      {
        "label": "Custo total estimado",
        "value": 13440.0,
        "unit": "BRL",
        "scale": 2
      }
    ],
    "summary": [
      "Exemplo ilustrativo para demonstrar estrutura do contrato."
    ]
  },
  "interpretation": {
    "title": "Leitura educacional do resultado",
    "text": "Este exemplo mostra como a API deve entregar interpretação junto com o número calculado.",
    "facts": [
      "O valor foi calculado a partir das entradas normalizadas."
    ],
    "inferences": [
      "A interpretação depende das premissas informadas."
    ],
    "limitations": [
      "Exemplo ilustrativo; não substitui contrato real."
    ]
  },
  "educationalExplanation": {
    "level": "introductory",
    "concepts": [
      "juros",
      "prazo",
      "custo total"
    ],
    "text": "A explicação deve ajudar a interface a ensinar o conceito sem improvisar conteúdo crítico."
  },
  "memoriaCalculo": {
    "formulas": [
      {
        "formulaName": "Fórmula ilustrativa",
        "formulaExpression": "resultado = entrada ajustada por taxa e prazo",
        "formulaDescription": "Expressão simplificada para demonstrar o contrato educacional."
      }
    ],
    "substituicoes": [
      {
        "symbol": "principal",
        "value": 10000.0,
        "unit": "BRL"
      },
      {
        "symbol": "monthlyRate",
        "value": 0.01,
        "unit": "percentual"
      }
    ],
    "etapas": [
      {
        "stepIndex": 1,
        "description": "Normalizar entradas.",
        "value": 10000.0
      },
      {
        "stepIndex": 2,
        "description": "Aplicar regra do módulo.",
        "value": 1120.0
      }
    ],
    "arredondamento": {
      "mode": "halfUp",
      "precision": 2,
      "scale": "currency"
    },
    "resultadoFinal": {
      "value": 1120.0,
      "unit": "BRL"
    }
  },
  "sources": [
    {
      "sourceId": "premissa_manual_exemplo",
      "sourceName": "Premissa manual informada pelo usuário",
      "sourceType": "manualAssumption",
      "sourceUrlOrReference": null,
      "referenceDate": "2026-05-10",
      "retrievedAt": null,
      "isOfficial": false,
      "usageNote": "Usada apenas para exemplo estrutural.",
      "limitation": "Não representa taxa contratual real."
    }
  ],
  "limits": [
    {
      "id": "educational_simulation",
      "severity": "info",
      "title": "Simulação educacional",
      "message": "O resultado é estimativo e não substitui análise profissional ou contrato real.",
      "educationalMeaning": "Ajuda a entender o cálculo, não a contratar produto financeiro.",
      "actionSuggestion": "Confira fontes, premissas e contrato real antes de decidir."
    }
  ],
  "alerts": [],
  "comparison": null,
  "table": null,
  "chartData": null,
  "educationalMetadata": {
    "learningObjectives": [
      "entender resultado",
      "auditar cálculo"
    ],
    "difficulty": "basic"
  },
  "audit": {
    "contractVersion": "gate-po-ux-valor-item-07",
    "trace": [
      "examplePayload"
    ]
  }
}
```

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 12. Metadados obrigatórios da resposta

Metadados obrigatórios incluem `schemaVersion`, `requestId`, `moduleId`, `operationId`, `generatedAt`, `locale`, `currency` quando houver moeda e `calculationMode` quando houver cálculo. Esses campos sustentam rastreabilidade, auditoria, versionamento, internacionalização futura e distinção entre cálculo determinístico, simulação estimada, diagnóstico e comparação.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 13. Entrada bruta e entrada normalizada

`rawInput` preserva a entrada como recebida, enquanto `normalizedInput` registra a forma usada no cálculo. A separação é obrigatória porque o usuário pode informar taxa, prazo ou valor em formato visual, mas a auditoria precisa enxergar a conversão para número, unidade, escala e período usado pela regra financeira.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 14. Validação de entrada e mensagens de correção

A validação deve retornar `validation.status` e mensagens com `field`, `code`, `message`, `suggestion` e `severity`. Erro genérico é proibido porque não ensina o usuário a corrigir a entrada. Mensagem de validação deve ser pedagógica, específica, recuperável e segura para renderização direta pela interface.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 15. Resultado principal

`result.primaryValue` deve incluir valor, unidade, escala, rótulo e, quando necessário, período de referência. `secondaryValues` e `summary` complementam a leitura. Resultado principal sem unidade ou resumo não atende ao padrão, pois obriga a interface a supor se o número representa moeda, taxa, prazo, parcela ou custo total.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 16. Interpretação educacional do resultado

`interpretation` deve separar `facts`, `inferences` e `limitations`. Fatos vêm diretamente do cálculo; inferências são leituras educacionais; limitações indicam o que a simulação não cobre. Essa separação impede que uma inferência pareça certeza contratual e ajuda o usuário a entender o resultado sem receber recomendação indevida.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 17. Memória de cálculo

Para qualquer cálculo financeiro relevante, `memoriaCalculo` é obrigatória. Ela deve permitir que a interface mostre nome do cálculo, fórmula usada, descrição, valores substituídos, etapas intermediárias, arredondamento, resultado final, relação com tabela e relação com fonte, regra ou premissa. Payload com resultado sem memória deve ser reprovado.

Payload que contém resultado financeiro relevante sem memória de cálculo estruturada deve ser considerado insuficiente para o padrão futuro da plataforma.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 18. Fórmulas

A fórmula deve ser representada por `formulaName`, `formulaExpression` e `formulaDescription`. A expressão pode ser matemática, textual ou estruturada, desde que auditável. A descrição deve explicar o significado da fórmula para usuário leigo, sem sacrificar precisão técnica. Fórmula escondida em texto livre não é suficiente para auditoria futura.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 19. Substituições de valores

`substitutions` deve listar símbolos, valores, unidades, origem e descrição. A interface precisa mostrar não apenas a fórmula genérica, mas a substituição dos dados informados pelo usuário. Isso evita a experiência de calculadora opaca e permite verificar se taxa, prazo, capital e unidade foram normalizados corretamente.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 20. Etapas intermediárias

`steps` deve conter `stepIndex`, descrição, expressão ou regra aplicada, valor intermediário, unidade e observação quando necessário. Etapas intermediárias são essenciais em amortização, financiamento, comparação e diagnóstico. Sem etapas, a memória vira decoração e não permite auditoria linha a linha ou validação pedagógica pelo PO.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 21. Arredondamento, precisão e escala

`rounding`, `precision` e `scale` devem explicar casas decimais, modo de arredondamento, escala monetária, escala percentual e possível diferença centesimal. Cálculo financeiro sem critério de arredondamento pode produzir divergências entre tabela, gráfico e resultado principal, fragilizando confiança e teste futuro.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 22. Unidades, moeda, taxa e prazo

Valores devem carregar unidade explícita. Moeda deve usar `currency`; taxas devem diferenciar percentual, decimal, mensal, anual, efetiva, nominal ou equivalente quando aplicável; prazo deve indicar meses, anos, dias corridos ou dias úteis. Unidade ausente é critério de reprovação porque impede interpretação correta pela interface.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 23. Fontes oficiais, referências e datas

`sources` deve conter `sourceId`, `sourceName`, `sourceType`, `sourceUrlOrReference`, `referenceDate`, `retrievedAt`, `isOfficial`, `usageNote` e `limitation`. URL não é obrigatória quando a fonte for lei, normativa, fórmula interna ou premissa manual. O contrato deve diferenciar fonte oficial, fórmula matemática, premissa manual, regra interna, dado externo e indicador econômico futuro.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 24. Limites da simulação

`limits` deve declarar o que a simulação não cobre: contrato real, tarifas ausentes, seguros, IOF, perfil de crédito, dados oficiais indisponíveis, premissas manuais ou simplificações didáticas. Limite não é detalhe jurídico periférico; é componente educacional de confiança e deve ser renderizável pela interface.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 25. Alertas e riscos

`warnings`, `alerts` e `risks` devem estruturar `id`, `severity`, `title`, `message`, `educationalMeaning` e `actionSuggestion`. Alerta não é recomendação personalizada. É proibido retornar mensagens como 'Você deve escolher SAC'. A forma correta explica trade-offs, dependências contratuais e necessidade de análise contextual.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 26. Comparações de cenários

`comparison` deve conter `comparisonId`, `scenarios`, `scenarioId`, `scenarioName`, `inputs`, `result`, `differences`, `absoluteDifference`, `percentageDifference`, `tradeOffs`, `educationalConclusion` e `notPersonalRecommendation`. Comparação deve explicar consequências, não eleger vencedor universal. Cenários incompletos devem ser declarados como limitados.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 27. Tabelas financeiras

Tabelas financeiras devem permitir renderização dinâmica conforme prazo. A API deve retornar ou permitir derivar colunas, linhas, totais e política de completude. Ela não pode cortar linhas sem critério declarado.

- Financiamento de 120 meses deve permitir 120 linhas.
- Financiamento de 360 meses deve permitir 360 linhas.
- Financiamento de 600 meses deve permitir 600 linhas.
- A API deve retornar `columns`, `rows`, `rowIndex`, `periodNumber`, `periodLabel`, `openingBalance`, `interestAmount`, `amortizationAmount`, `installmentAmount`, `endingBalance` e `totals`.
- Este item não implementa paginação, mas permite que contrato futuro declare paginação, limite ou resumo desde que a interface saiba que a tabela não está completa.
- Contrato que corta linhas sem declarar limite, paginação, resumo ou critério de exibição deve ser reprovado.
- Contrato que permite cortar linhas sem declarar limite, paginação, resumo ou critério de exibição deve ser considerado insuficiente.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 28. Dados para gráficos

`chartData` deve conter `chartType`, `title`, `description`, `xAxis`, `yAxis`, `series`, `unit`, `source` e `educationalReading`. Gráfico é útil quando responde uma pergunta financeira clara. Dados sem unidade, escala, legenda ou leitura educacional devem ser reprovados por criarem visual decorativo ou enganoso.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 29. Metadados educacionais

`educationalMetadata` deve informar objetivos de aprendizagem, nível de dificuldade, conceitos envolvidos, abas sugeridas, dependências de fonte, necessidade de memória, necessidade de tabela e alertas pedagógicos. Esses metadados ajudam a interface a organizar o conteúdo sem deduzir pedagogia a partir de nomes de campos ou texto visual.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 30. Estados de sucesso

Em sucesso, a resposta deve trazer validação válida, resultado principal, interpretação, memória quando houver cálculo, limites, auditoria e blocos condicionais aplicáveis. Sucesso parcial deve ser distinguido de sucesso pleno quando fonte estiver indisponível, premissa for manual ou tabela for entregue em forma resumida.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 31. Estados de erro de validação

Erro de validação deve preservar metadados, indicar `validation.status` como `invalid`, listar mensagens por campo e não retornar resultado financeiro como se fosse confiável. A interface deve conseguir orientar correção sem tratar o erro como falha técnica. Contraexemplo proibido: retornar apenas `{ "error": "Dados inválidos" }`.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 32. Estados de erro técnico

Erro técnico deve indicar falha operacional, não erro do usuário. Deve preservar `requestId`, `moduleId`, `operationId`, status técnico seguro, mensagem exibível e ação possível. Não deve expor stack trace, segredo, caminho interno ou detalhe inseguro. A interface precisa diferenciar tentar novamente de corrigir campo.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 33. Estados de fonte oficial indisponível

Quando fonte oficial futura estiver indisponível, a resposta deve retornar estado claro, fonte marcada como indisponível, data de tentativa, limitação e alerta educacional. A interface não deve apresentar dado antigo como oficial atualizado. A indisponibilidade pode permitir simulação com premissa manual, desde que isso fique explícito.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 34. Contrato para diagnóstico financeiro

Diagnóstico financeiro deve retornar resumo de renda, despesas, saldo, comprometimento e alertas de risco, sempre com interpretação educacional e limites. O contrato deve impedir classificação opaca. Se houver inferência sobre saúde financeira, ela deve separar fato, inferência e limitação, evitando parecer consultoria personalizada.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 35. Contrato para juros simples

Juros simples deve retornar capital, taxa, prazo, juros, montante, fórmula linear, substituição e tabela de evolução quando útil. A explicação deve diferenciar crescimento linear de crescimento composto e indicar quando a simulação é didática, sem sugerir que todo contrato real usa essa regra.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 36. Contrato para juros compostos

Juros compostos deve retornar capital, taxa, prazo, montante, juros acumulados, fórmula exponencial, substituições, etapas e interpretação sobre efeito do tempo. A API deve diferenciar taxa mensal, anual, nominal, efetiva e equivalente quando aplicável, sempre declarando unidade e arredondamento.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 37. Contrato para comparação de juros

Comparação de juros simples e compostos deve retornar cenários, diferenças, tabela ou gráfico de evolução, trade-offs e conclusão educacional. O contrato deve mostrar por que os resultados divergem ao longo do tempo, sem afirmar que uma modalidade é sempre melhor em qualquer contexto.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 38. Contrato para amortização PRICE

PRICE deve retornar parcela, juros por período, amortização, saldo devedor, tabela completa conforme prazo, memória do cálculo da parcela e alertas sobre custo total. A API deve permitir que a interface explique parcela constante e ritmo de amortização sem improvisar texto a partir da tabela.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 39. Contrato para amortização SAC

SAC deve retornar amortização constante, juros por período, parcela decrescente, saldo devedor, tabela completa conforme prazo e memória de cálculo. A API deve explicar impacto de parcela inicial maior e custo total, mantendo limites contratuais e fontes quando aplicáveis.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 40. Contrato para comparação PRICE x SAC

Comparação PRICE x SAC deve retornar cenários estruturados, custo total, parcela inicial, parcela final, juros totais, evolução do saldo, trade-offs e conclusão educacional não personalizada. É proibido retornar 'SAC é melhor' sem contexto de renda, contrato, taxa, prazo e preferência de fluxo de caixa.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 41. Contrato para financiamento imobiliário

Financiamento imobiliário deve combinar entrada, valor financiado, taxa, prazo, sistema de amortização, tabela longa, memória, comparação, fontes, limites e alertas. A API deve sustentar renderização de 120, 360 ou 600 meses conforme prazo, sem hardcode e sem ocultar evidência central.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 42. Exemplos obrigatórios de payload correto

Os payloads abaixo são exemplos ilustrativos reduzidos. Eles demonstram a estrutura essencial, não representam valores contratuais, não substituem cálculo final e não autorizam implementação automática sem validação futura.

### Exemplo — Diagnóstico financeiro

```json
{
  "schemaVersion": "1.0.0",
  "requestId": "req_analisar_situacao_exemplo",
  "moduleId": "diagnostico_financeiro",
  "operationId": "analisar_situacao",
  "generatedAt": "2026-05-10T00:00:00Z",
  "locale": "pt-BR",
  "currency": "BRL",
  "calculationMode": "educationalSimulation",
  "rawInput": {
    "valor": 10000,
    "taxaMensal": 0.01,
    "prazoMeses": 12
  },
  "normalizedInput": {
    "principal": 10000.0,
    "monthlyRate": 0.01,
    "termMonths": 12
  },
  "validation": {
    "status": "valid",
    "messages": []
  },
  "result": {
    "primaryValue": {
      "label": "Saldo mensal estimado",
      "value": 1120.0,
      "unit": "BRL",
      "scale": 2
    },
    "secondaryValues": [
      {
        "label": "Custo total estimado",
        "value": 13440.0,
        "unit": "BRL",
        "scale": 2
      }
    ],
    "summary": [
      "Exemplo ilustrativo para demonstrar estrutura do contrato."
    ]
  },
  "interpretation": {
    "title": "Leitura educacional do resultado",
    "text": "Este exemplo mostra como a API deve entregar interpretação junto com o número calculado.",
    "facts": [
      "O valor foi calculado a partir das entradas normalizadas."
    ],
    "inferences": [
      "A interpretação depende das premissas informadas."
    ],
    "limitations": [
      "Exemplo ilustrativo; não substitui contrato real."
    ]
  },
  "educationalExplanation": {
    "level": "introductory",
    "concepts": [
      "juros",
      "prazo",
      "custo total"
    ],
    "text": "A explicação deve ajudar a interface a ensinar o conceito sem improvisar conteúdo crítico."
  },
  "memoriaCalculo": {
    "formulas": [
      {
        "formulaName": "Fórmula ilustrativa",
        "formulaExpression": "resultado = entrada ajustada por taxa e prazo",
        "formulaDescription": "Expressão simplificada para demonstrar o contrato educacional."
      }
    ],
    "substituicoes": [
      {
        "symbol": "principal",
        "value": 10000.0,
        "unit": "BRL"
      },
      {
        "symbol": "monthlyRate",
        "value": 0.01,
        "unit": "percentual"
      }
    ],
    "etapas": [
      {
        "stepIndex": 1,
        "description": "Normalizar entradas.",
        "value": 10000.0
      },
      {
        "stepIndex": 2,
        "description": "Aplicar regra do módulo.",
        "value": 1120.0
      }
    ],
    "arredondamento": {
      "mode": "halfUp",
      "precision": 2,
      "scale": "currency"
    },
    "resultadoFinal": {
      "value": 1120.0,
      "unit": "BRL"
    }
  },
  "sources": [
    {
      "sourceId": "premissa_manual_exemplo",
      "sourceName": "Premissa manual informada pelo usuário",
      "sourceType": "manualAssumption",
      "sourceUrlOrReference": null,
      "referenceDate": "2026-05-10",
      "retrievedAt": null,
      "isOfficial": false,
      "usageNote": "Usada apenas para exemplo estrutural.",
      "limitation": "Não representa taxa contratual real."
    }
  ],
  "limits": [
    {
      "id": "educational_simulation",
      "severity": "info",
      "title": "Simulação educacional",
      "message": "O resultado é estimativo e não substitui análise profissional ou contrato real.",
      "educationalMeaning": "Ajuda a entender o cálculo, não a contratar produto financeiro.",
      "actionSuggestion": "Confira fontes, premissas e contrato real antes de decidir."
    }
  ],
  "alerts": [],
  "comparison": null,
  "table": null,
  "chartData": null,
  "educationalMetadata": {
    "learningObjectives": [
      "entender resultado",
      "auditar cálculo"
    ],
    "difficulty": "basic"
  },
  "audit": {
    "contractVersion": "gate-po-ux-valor-item-07",
    "trace": [
      "examplePayload"
    ]
  }
}
```

### Exemplo — Juros simples

```json
{
  "schemaVersion": "1.0.0",
  "requestId": "req_calcular_juros_simples_exemplo",
  "moduleId": "juros_simples",
  "operationId": "calcular_juros_simples",
  "generatedAt": "2026-05-10T00:00:00Z",
  "locale": "pt-BR",
  "currency": "BRL",
  "calculationMode": "educationalSimulation",
  "rawInput": {
    "valor": 10000,
    "taxaMensal": 0.01,
    "prazoMeses": 12
  },
  "normalizedInput": {
    "principal": 10000.0,
    "monthlyRate": 0.01,
    "termMonths": 12
  },
  "validation": {
    "status": "valid",
    "messages": []
  },
  "result": {
    "primaryValue": {
      "label": "Montante com juros simples",
      "value": 1120.0,
      "unit": "BRL",
      "scale": 2
    },
    "secondaryValues": [
      {
        "label": "Custo total estimado",
        "value": 13440.0,
        "unit": "BRL",
        "scale": 2
      }
    ],
    "summary": [
      "Exemplo ilustrativo para demonstrar estrutura do contrato."
    ]
  },
  "interpretation": {
    "title": "Leitura educacional do resultado",
    "text": "Este exemplo mostra como a API deve entregar interpretação junto com o número calculado.",
    "facts": [
      "O valor foi calculado a partir das entradas normalizadas."
    ],
    "inferences": [
      "A interpretação depende das premissas informadas."
    ],
    "limitations": [
      "Exemplo ilustrativo; não substitui contrato real."
    ]
  },
  "educationalExplanation": {
    "level": "introductory",
    "concepts": [
      "juros",
      "prazo",
      "custo total"
    ],
    "text": "A explicação deve ajudar a interface a ensinar o conceito sem improvisar conteúdo crítico."
  },
  "memoriaCalculo": {
    "formulas": [
      {
        "formulaName": "Fórmula ilustrativa",
        "formulaExpression": "resultado = entrada ajustada por taxa e prazo",
        "formulaDescription": "Expressão simplificada para demonstrar o contrato educacional."
      }
    ],
    "substituicoes": [
      {
        "symbol": "principal",
        "value": 10000.0,
        "unit": "BRL"
      },
      {
        "symbol": "monthlyRate",
        "value": 0.01,
        "unit": "percentual"
      }
    ],
    "etapas": [
      {
        "stepIndex": 1,
        "description": "Normalizar entradas.",
        "value": 10000.0
      },
      {
        "stepIndex": 2,
        "description": "Aplicar regra do módulo.",
        "value": 1120.0
      }
    ],
    "arredondamento": {
      "mode": "halfUp",
      "precision": 2,
      "scale": "currency"
    },
    "resultadoFinal": {
      "value": 1120.0,
      "unit": "BRL"
    }
  },
  "sources": [
    {
      "sourceId": "premissa_manual_exemplo",
      "sourceName": "Premissa manual informada pelo usuário",
      "sourceType": "manualAssumption",
      "sourceUrlOrReference": null,
      "referenceDate": "2026-05-10",
      "retrievedAt": null,
      "isOfficial": false,
      "usageNote": "Usada apenas para exemplo estrutural.",
      "limitation": "Não representa taxa contratual real."
    }
  ],
  "limits": [
    {
      "id": "educational_simulation",
      "severity": "info",
      "title": "Simulação educacional",
      "message": "O resultado é estimativo e não substitui análise profissional ou contrato real.",
      "educationalMeaning": "Ajuda a entender o cálculo, não a contratar produto financeiro.",
      "actionSuggestion": "Confira fontes, premissas e contrato real antes de decidir."
    }
  ],
  "alerts": [],
  "comparison": null,
  "table": null,
  "chartData": null,
  "educationalMetadata": {
    "learningObjectives": [
      "entender resultado",
      "auditar cálculo"
    ],
    "difficulty": "basic"
  },
  "audit": {
    "contractVersion": "gate-po-ux-valor-item-07",
    "trace": [
      "examplePayload"
    ]
  }
}
```

### Exemplo — Juros compostos

```json
{
  "schemaVersion": "1.0.0",
  "requestId": "req_calcular_juros_compostos_exemplo",
  "moduleId": "juros_compostos",
  "operationId": "calcular_juros_compostos",
  "generatedAt": "2026-05-10T00:00:00Z",
  "locale": "pt-BR",
  "currency": "BRL",
  "calculationMode": "educationalSimulation",
  "rawInput": {
    "valor": 10000,
    "taxaMensal": 0.01,
    "prazoMeses": 12
  },
  "normalizedInput": {
    "principal": 10000.0,
    "monthlyRate": 0.01,
    "termMonths": 12
  },
  "validation": {
    "status": "valid",
    "messages": []
  },
  "result": {
    "primaryValue": {
      "label": "Montante com juros compostos",
      "value": 1120.0,
      "unit": "BRL",
      "scale": 2
    },
    "secondaryValues": [
      {
        "label": "Custo total estimado",
        "value": 13440.0,
        "unit": "BRL",
        "scale": 2
      }
    ],
    "summary": [
      "Exemplo ilustrativo para demonstrar estrutura do contrato."
    ]
  },
  "interpretation": {
    "title": "Leitura educacional do resultado",
    "text": "Este exemplo mostra como a API deve entregar interpretação junto com o número calculado.",
    "facts": [
      "O valor foi calculado a partir das entradas normalizadas."
    ],
    "inferences": [
      "A interpretação depende das premissas informadas."
    ],
    "limitations": [
      "Exemplo ilustrativo; não substitui contrato real."
    ]
  },
  "educationalExplanation": {
    "level": "introductory",
    "concepts": [
      "juros",
      "prazo",
      "custo total"
    ],
    "text": "A explicação deve ajudar a interface a ensinar o conceito sem improvisar conteúdo crítico."
  },
  "memoriaCalculo": {
    "formulas": [
      {
        "formulaName": "Fórmula ilustrativa",
        "formulaExpression": "resultado = entrada ajustada por taxa e prazo",
        "formulaDescription": "Expressão simplificada para demonstrar o contrato educacional."
      }
    ],
    "substituicoes": [
      {
        "symbol": "principal",
        "value": 10000.0,
        "unit": "BRL"
      },
      {
        "symbol": "monthlyRate",
        "value": 0.01,
        "unit": "percentual"
      }
    ],
    "etapas": [
      {
        "stepIndex": 1,
        "description": "Normalizar entradas.",
        "value": 10000.0
      },
      {
        "stepIndex": 2,
        "description": "Aplicar regra do módulo.",
        "value": 1120.0
      }
    ],
    "arredondamento": {
      "mode": "halfUp",
      "precision": 2,
      "scale": "currency"
    },
    "resultadoFinal": {
      "value": 1120.0,
      "unit": "BRL"
    }
  },
  "sources": [
    {
      "sourceId": "premissa_manual_exemplo",
      "sourceName": "Premissa manual informada pelo usuário",
      "sourceType": "manualAssumption",
      "sourceUrlOrReference": null,
      "referenceDate": "2026-05-10",
      "retrievedAt": null,
      "isOfficial": false,
      "usageNote": "Usada apenas para exemplo estrutural.",
      "limitation": "Não representa taxa contratual real."
    }
  ],
  "limits": [
    {
      "id": "educational_simulation",
      "severity": "info",
      "title": "Simulação educacional",
      "message": "O resultado é estimativo e não substitui análise profissional ou contrato real.",
      "educationalMeaning": "Ajuda a entender o cálculo, não a contratar produto financeiro.",
      "actionSuggestion": "Confira fontes, premissas e contrato real antes de decidir."
    }
  ],
  "alerts": [],
  "comparison": null,
  "table": null,
  "chartData": null,
  "educationalMetadata": {
    "learningObjectives": [
      "entender resultado",
      "auditar cálculo"
    ],
    "difficulty": "basic"
  },
  "audit": {
    "contractVersion": "gate-po-ux-valor-item-07",
    "trace": [
      "examplePayload"
    ]
  }
}
```

### Exemplo — Comparação juros simples x compostos

```json
{
  "schemaVersion": "1.0.0",
  "requestId": "req_comparar_price_sac_exemplo",
  "moduleId": "comparacao_juros",
  "operationId": "comparar_juros",
  "generatedAt": "2026-05-10T00:00:00Z",
  "locale": "pt-BR",
  "currency": "BRL",
  "calculationMode": "educationalSimulation",
  "rawInput": {
    "valor": 10000,
    "taxaMensal": 0.01,
    "prazoMeses": 12
  },
  "normalizedInput": {
    "principal": 10000.0,
    "monthlyRate": 0.01,
    "termMonths": 12
  },
  "validation": {
    "status": "valid",
    "messages": []
  },
  "result": {
    "primaryValue": {
      "label": "Comparação educacional",
      "value": 1120.0,
      "unit": "BRL",
      "scale": 2
    },
    "secondaryValues": [
      {
        "label": "Custo total estimado",
        "value": 13440.0,
        "unit": "BRL",
        "scale": 2
      }
    ],
    "summary": [
      "Exemplo ilustrativo para demonstrar estrutura do contrato."
    ]
  },
  "interpretation": {
    "title": "Leitura educacional do resultado",
    "text": "Este exemplo mostra como a API deve entregar interpretação junto com o número calculado.",
    "facts": [
      "O valor foi calculado a partir das entradas normalizadas."
    ],
    "inferences": [
      "A interpretação depende das premissas informadas."
    ],
    "limitations": [
      "Exemplo ilustrativo; não substitui contrato real."
    ]
  },
  "educationalExplanation": {
    "level": "introductory",
    "concepts": [
      "juros",
      "prazo",
      "custo total"
    ],
    "text": "A explicação deve ajudar a interface a ensinar o conceito sem improvisar conteúdo crítico."
  },
  "memoriaCalculo": {
    "formulas": [
      {
        "formulaName": "Fórmula ilustrativa",
        "formulaExpression": "resultado = entrada ajustada por taxa e prazo",
        "formulaDescription": "Expressão simplificada para demonstrar o contrato educacional."
      }
    ],
    "substituicoes": [
      {
        "symbol": "principal",
        "value": 10000.0,
        "unit": "BRL"
      },
      {
        "symbol": "monthlyRate",
        "value": 0.01,
        "unit": "percentual"
      }
    ],
    "etapas": [
      {
        "stepIndex": 1,
        "description": "Normalizar entradas.",
        "value": 10000.0
      },
      {
        "stepIndex": 2,
        "description": "Aplicar regra do módulo.",
        "value": 1120.0
      }
    ],
    "arredondamento": {
      "mode": "halfUp",
      "precision": 2,
      "scale": "currency"
    },
    "resultadoFinal": {
      "value": 1120.0,
      "unit": "BRL"
    }
  },
  "sources": [
    {
      "sourceId": "premissa_manual_exemplo",
      "sourceName": "Premissa manual informada pelo usuário",
      "sourceType": "manualAssumption",
      "sourceUrlOrReference": null,
      "referenceDate": "2026-05-10",
      "retrievedAt": null,
      "isOfficial": false,
      "usageNote": "Usada apenas para exemplo estrutural.",
      "limitation": "Não representa taxa contratual real."
    }
  ],
  "limits": [
    {
      "id": "educational_simulation",
      "severity": "info",
      "title": "Simulação educacional",
      "message": "O resultado é estimativo e não substitui análise profissional ou contrato real.",
      "educationalMeaning": "Ajuda a entender o cálculo, não a contratar produto financeiro.",
      "actionSuggestion": "Confira fontes, premissas e contrato real antes de decidir."
    }
  ],
  "alerts": [],
  "comparison": {
    "comparisonId": "cmp_price_sac_exemplo",
    "scenarios": [
      {
        "scenarioId": "price",
        "scenarioName": "PRICE",
        "inputs": {
          "termMonths": 360
        },
        "result": {
          "totalCost": 420000.0
        }
      },
      {
        "scenarioId": "sac",
        "scenarioName": "SAC",
        "inputs": {
          "termMonths": 360
        },
        "result": {
          "totalCost": 390000.0
        }
      }
    ],
    "differences": [
      {
        "metric": "totalCost",
        "absoluteDifference": 30000.0,
        "percentageDifference": 7.14
      }
    ],
    "tradeOffs": [
      "SAC pode reduzir juros totais em certos cenários, mas tende a exigir parcela inicial maior.",
      "PRICE pode facilitar previsibilidade de parcela, mas pode elevar custo total."
    ],
    "educationalConclusion": "A comparação é educacional e depende de contrato, renda, taxa e condições específicas.",
    "notPersonalRecommendation": true
  },
  "table": null,
  "chartData": null,
  "educationalMetadata": {
    "learningObjectives": [
      "entender resultado",
      "auditar cálculo"
    ],
    "difficulty": "basic"
  },
  "audit": {
    "contractVersion": "gate-po-ux-valor-item-07",
    "trace": [
      "examplePayload"
    ]
  }
}
```

### Exemplo — Amortização PRICE

```json
{
  "schemaVersion": "1.0.0",
  "requestId": "req_simular_financiamento_exemplo",
  "moduleId": "amortizacao_price",
  "operationId": "simular_price",
  "generatedAt": "2026-05-10T00:00:00Z",
  "locale": "pt-BR",
  "currency": "BRL",
  "calculationMode": "educationalSimulation",
  "rawInput": {
    "valor": 10000,
    "taxaMensal": 0.01,
    "prazoMeses": 12
  },
  "normalizedInput": {
    "principal": 10000.0,
    "monthlyRate": 0.01,
    "termMonths": 12
  },
  "validation": {
    "status": "valid",
    "messages": []
  },
  "result": {
    "primaryValue": {
      "label": "Parcela estimada",
      "value": 1120.0,
      "unit": "BRL",
      "scale": 2
    },
    "secondaryValues": [
      {
        "label": "Custo total estimado",
        "value": 13440.0,
        "unit": "BRL",
        "scale": 2
      }
    ],
    "summary": [
      "Exemplo ilustrativo para demonstrar estrutura do contrato."
    ]
  },
  "interpretation": {
    "title": "Leitura educacional do resultado",
    "text": "Este exemplo mostra como a API deve entregar interpretação junto com o número calculado.",
    "facts": [
      "O valor foi calculado a partir das entradas normalizadas."
    ],
    "inferences": [
      "A interpretação depende das premissas informadas."
    ],
    "limitations": [
      "Exemplo ilustrativo; não substitui contrato real."
    ]
  },
  "educationalExplanation": {
    "level": "introductory",
    "concepts": [
      "juros",
      "prazo",
      "custo total"
    ],
    "text": "A explicação deve ajudar a interface a ensinar o conceito sem improvisar conteúdo crítico."
  },
  "memoriaCalculo": {
    "formulas": [
      {
        "formulaName": "Fórmula ilustrativa",
        "formulaExpression": "resultado = entrada ajustada por taxa e prazo",
        "formulaDescription": "Expressão simplificada para demonstrar o contrato educacional."
      }
    ],
    "substituicoes": [
      {
        "symbol": "principal",
        "value": 10000.0,
        "unit": "BRL"
      },
      {
        "symbol": "monthlyRate",
        "value": 0.01,
        "unit": "percentual"
      }
    ],
    "etapas": [
      {
        "stepIndex": 1,
        "description": "Normalizar entradas.",
        "value": 10000.0
      },
      {
        "stepIndex": 2,
        "description": "Aplicar regra do módulo.",
        "value": 1120.0
      }
    ],
    "arredondamento": {
      "mode": "halfUp",
      "precision": 2,
      "scale": "currency"
    },
    "resultadoFinal": {
      "value": 1120.0,
      "unit": "BRL"
    }
  },
  "sources": [
    {
      "sourceId": "premissa_manual_exemplo",
      "sourceName": "Premissa manual informada pelo usuário",
      "sourceType": "manualAssumption",
      "sourceUrlOrReference": null,
      "referenceDate": "2026-05-10",
      "retrievedAt": null,
      "isOfficial": false,
      "usageNote": "Usada apenas para exemplo estrutural.",
      "limitation": "Não representa taxa contratual real."
    }
  ],
  "limits": [
    {
      "id": "educational_simulation",
      "severity": "info",
      "title": "Simulação educacional",
      "message": "O resultado é estimativo e não substitui análise profissional ou contrato real.",
      "educationalMeaning": "Ajuda a entender o cálculo, não a contratar produto financeiro.",
      "actionSuggestion": "Confira fontes, premissas e contrato real antes de decidir."
    }
  ],
  "alerts": [],
  "comparison": null,
  "table": {
    "columns": [
      {
        "key": "periodNumber",
        "label": "Mês",
        "unit": "mes"
      },
      {
        "key": "openingBalance",
        "label": "Saldo inicial",
        "unit": "BRL"
      },
      {
        "key": "interestAmount",
        "label": "Juros",
        "unit": "BRL"
      },
      {
        "key": "amortizationAmount",
        "label": "Amortização",
        "unit": "BRL"
      },
      {
        "key": "installmentAmount",
        "label": "Parcela",
        "unit": "BRL"
      },
      {
        "key": "endingBalance",
        "label": "Saldo final",
        "unit": "BRL"
      }
    ],
    "rows": [
      {
        "rowIndex": 0,
        "periodNumber": 1,
        "periodLabel": "Mês 1",
        "openingBalance": 100000.0,
        "interestAmount": 1000.0,
        "amortizationAmount": 250.0,
        "installmentAmount": 1250.0,
        "endingBalance": 99750.0
      },
      {
        "rowIndex": 1,
        "periodNumber": 2,
        "periodLabel": "Mês 2",
        "openingBalance": 99750.0,
        "interestAmount": 997.5,
        "amortizationAmount": 250.0,
        "installmentAmount": 1247.5,
        "endingBalance": 99500.0
      }
    ],
    "rowCountPolicy": {
      "expectedRows": 360,
      "isComplete": false,
      "displayNote": "Exemplo reduzido; contrato real deve permitir linhas conforme prazo."
    },
    "totals": {
      "interestTotal": 1000.0,
      "amortizationTotal": 500.0
    }
  },
  "chartData": {
    "chartType": "line",
    "title": "Evolução do saldo devedor",
    "description": "Mostra a redução do saldo ao longo dos meses.",
    "xAxis": {
      "label": "Mês",
      "unit": "mes"
    },
    "yAxis": {
      "label": "Saldo",
      "unit": "BRL"
    },
    "series": [
      {
        "name": "Saldo devedor",
        "unit": "BRL",
        "points": [
          {
            "x": 1,
            "y": 99750.0
          },
          {
            "x": 2,
            "y": 99500.0
          }
        ]
      }
    ],
    "educationalReading": "A curva ajuda a entender o ritmo de redução da dívida."
  },
  "educationalMetadata": {
    "learningObjectives": [
      "entender resultado",
      "auditar cálculo"
    ],
    "difficulty": "basic"
  },
  "audit": {
    "contractVersion": "gate-po-ux-valor-item-07",
    "trace": [
      "examplePayload"
    ]
  }
}
```

### Exemplo — Amortização SAC

```json
{
  "schemaVersion": "1.0.0",
  "requestId": "req_simular_financiamento_exemplo",
  "moduleId": "amortizacao_sac",
  "operationId": "simular_sac",
  "generatedAt": "2026-05-10T00:00:00Z",
  "locale": "pt-BR",
  "currency": "BRL",
  "calculationMode": "educationalSimulation",
  "rawInput": {
    "valor": 10000,
    "taxaMensal": 0.01,
    "prazoMeses": 12
  },
  "normalizedInput": {
    "principal": 10000.0,
    "monthlyRate": 0.01,
    "termMonths": 12
  },
  "validation": {
    "status": "valid",
    "messages": []
  },
  "result": {
    "primaryValue": {
      "label": "Parcela estimada",
      "value": 1120.0,
      "unit": "BRL",
      "scale": 2
    },
    "secondaryValues": [
      {
        "label": "Custo total estimado",
        "value": 13440.0,
        "unit": "BRL",
        "scale": 2
      }
    ],
    "summary": [
      "Exemplo ilustrativo para demonstrar estrutura do contrato."
    ]
  },
  "interpretation": {
    "title": "Leitura educacional do resultado",
    "text": "Este exemplo mostra como a API deve entregar interpretação junto com o número calculado.",
    "facts": [
      "O valor foi calculado a partir das entradas normalizadas."
    ],
    "inferences": [
      "A interpretação depende das premissas informadas."
    ],
    "limitations": [
      "Exemplo ilustrativo; não substitui contrato real."
    ]
  },
  "educationalExplanation": {
    "level": "introductory",
    "concepts": [
      "juros",
      "prazo",
      "custo total"
    ],
    "text": "A explicação deve ajudar a interface a ensinar o conceito sem improvisar conteúdo crítico."
  },
  "memoriaCalculo": {
    "formulas": [
      {
        "formulaName": "Fórmula ilustrativa",
        "formulaExpression": "resultado = entrada ajustada por taxa e prazo",
        "formulaDescription": "Expressão simplificada para demonstrar o contrato educacional."
      }
    ],
    "substituicoes": [
      {
        "symbol": "principal",
        "value": 10000.0,
        "unit": "BRL"
      },
      {
        "symbol": "monthlyRate",
        "value": 0.01,
        "unit": "percentual"
      }
    ],
    "etapas": [
      {
        "stepIndex": 1,
        "description": "Normalizar entradas.",
        "value": 10000.0
      },
      {
        "stepIndex": 2,
        "description": "Aplicar regra do módulo.",
        "value": 1120.0
      }
    ],
    "arredondamento": {
      "mode": "halfUp",
      "precision": 2,
      "scale": "currency"
    },
    "resultadoFinal": {
      "value": 1120.0,
      "unit": "BRL"
    }
  },
  "sources": [
    {
      "sourceId": "premissa_manual_exemplo",
      "sourceName": "Premissa manual informada pelo usuário",
      "sourceType": "manualAssumption",
      "sourceUrlOrReference": null,
      "referenceDate": "2026-05-10",
      "retrievedAt": null,
      "isOfficial": false,
      "usageNote": "Usada apenas para exemplo estrutural.",
      "limitation": "Não representa taxa contratual real."
    }
  ],
  "limits": [
    {
      "id": "educational_simulation",
      "severity": "info",
      "title": "Simulação educacional",
      "message": "O resultado é estimativo e não substitui análise profissional ou contrato real.",
      "educationalMeaning": "Ajuda a entender o cálculo, não a contratar produto financeiro.",
      "actionSuggestion": "Confira fontes, premissas e contrato real antes de decidir."
    }
  ],
  "alerts": [],
  "comparison": null,
  "table": {
    "columns": [
      {
        "key": "periodNumber",
        "label": "Mês",
        "unit": "mes"
      },
      {
        "key": "openingBalance",
        "label": "Saldo inicial",
        "unit": "BRL"
      },
      {
        "key": "interestAmount",
        "label": "Juros",
        "unit": "BRL"
      },
      {
        "key": "amortizationAmount",
        "label": "Amortização",
        "unit": "BRL"
      },
      {
        "key": "installmentAmount",
        "label": "Parcela",
        "unit": "BRL"
      },
      {
        "key": "endingBalance",
        "label": "Saldo final",
        "unit": "BRL"
      }
    ],
    "rows": [
      {
        "rowIndex": 0,
        "periodNumber": 1,
        "periodLabel": "Mês 1",
        "openingBalance": 100000.0,
        "interestAmount": 1000.0,
        "amortizationAmount": 250.0,
        "installmentAmount": 1250.0,
        "endingBalance": 99750.0
      },
      {
        "rowIndex": 1,
        "periodNumber": 2,
        "periodLabel": "Mês 2",
        "openingBalance": 99750.0,
        "interestAmount": 997.5,
        "amortizationAmount": 250.0,
        "installmentAmount": 1247.5,
        "endingBalance": 99500.0
      }
    ],
    "rowCountPolicy": {
      "expectedRows": 360,
      "isComplete": false,
      "displayNote": "Exemplo reduzido; contrato real deve permitir linhas conforme prazo."
    },
    "totals": {
      "interestTotal": 1000.0,
      "amortizationTotal": 500.0
    }
  },
  "chartData": {
    "chartType": "line",
    "title": "Evolução do saldo devedor",
    "description": "Mostra a redução do saldo ao longo dos meses.",
    "xAxis": {
      "label": "Mês",
      "unit": "mes"
    },
    "yAxis": {
      "label": "Saldo",
      "unit": "BRL"
    },
    "series": [
      {
        "name": "Saldo devedor",
        "unit": "BRL",
        "points": [
          {
            "x": 1,
            "y": 99750.0
          },
          {
            "x": 2,
            "y": 99500.0
          }
        ]
      }
    ],
    "educationalReading": "A curva ajuda a entender o ritmo de redução da dívida."
  },
  "educationalMetadata": {
    "learningObjectives": [
      "entender resultado",
      "auditar cálculo"
    ],
    "difficulty": "basic"
  },
  "audit": {
    "contractVersion": "gate-po-ux-valor-item-07",
    "trace": [
      "examplePayload"
    ]
  }
}
```

### Exemplo — Comparação PRICE x SAC

```json
{
  "schemaVersion": "1.0.0",
  "requestId": "req_comparar_price_sac_exemplo",
  "moduleId": "comparacao_price_sac",
  "operationId": "comparar_price_sac",
  "generatedAt": "2026-05-10T00:00:00Z",
  "locale": "pt-BR",
  "currency": "BRL",
  "calculationMode": "educationalSimulation",
  "rawInput": {
    "valor": 10000,
    "taxaMensal": 0.01,
    "prazoMeses": 12
  },
  "normalizedInput": {
    "principal": 10000.0,
    "monthlyRate": 0.01,
    "termMonths": 12
  },
  "validation": {
    "status": "valid",
    "messages": []
  },
  "result": {
    "primaryValue": {
      "label": "Comparação educacional",
      "value": 1120.0,
      "unit": "BRL",
      "scale": 2
    },
    "secondaryValues": [
      {
        "label": "Custo total estimado",
        "value": 13440.0,
        "unit": "BRL",
        "scale": 2
      }
    ],
    "summary": [
      "Exemplo ilustrativo para demonstrar estrutura do contrato."
    ]
  },
  "interpretation": {
    "title": "Leitura educacional do resultado",
    "text": "Este exemplo mostra como a API deve entregar interpretação junto com o número calculado.",
    "facts": [
      "O valor foi calculado a partir das entradas normalizadas."
    ],
    "inferences": [
      "A interpretação depende das premissas informadas."
    ],
    "limitations": [
      "Exemplo ilustrativo; não substitui contrato real."
    ]
  },
  "educationalExplanation": {
    "level": "introductory",
    "concepts": [
      "juros",
      "prazo",
      "custo total"
    ],
    "text": "A explicação deve ajudar a interface a ensinar o conceito sem improvisar conteúdo crítico."
  },
  "memoriaCalculo": {
    "formulas": [
      {
        "formulaName": "Fórmula ilustrativa",
        "formulaExpression": "resultado = entrada ajustada por taxa e prazo",
        "formulaDescription": "Expressão simplificada para demonstrar o contrato educacional."
      }
    ],
    "substituicoes": [
      {
        "symbol": "principal",
        "value": 10000.0,
        "unit": "BRL"
      },
      {
        "symbol": "monthlyRate",
        "value": 0.01,
        "unit": "percentual"
      }
    ],
    "etapas": [
      {
        "stepIndex": 1,
        "description": "Normalizar entradas.",
        "value": 10000.0
      },
      {
        "stepIndex": 2,
        "description": "Aplicar regra do módulo.",
        "value": 1120.0
      }
    ],
    "arredondamento": {
      "mode": "halfUp",
      "precision": 2,
      "scale": "currency"
    },
    "resultadoFinal": {
      "value": 1120.0,
      "unit": "BRL"
    }
  },
  "sources": [
    {
      "sourceId": "premissa_manual_exemplo",
      "sourceName": "Premissa manual informada pelo usuário",
      "sourceType": "manualAssumption",
      "sourceUrlOrReference": null,
      "referenceDate": "2026-05-10",
      "retrievedAt": null,
      "isOfficial": false,
      "usageNote": "Usada apenas para exemplo estrutural.",
      "limitation": "Não representa taxa contratual real."
    }
  ],
  "limits": [
    {
      "id": "educational_simulation",
      "severity": "info",
      "title": "Simulação educacional",
      "message": "O resultado é estimativo e não substitui análise profissional ou contrato real.",
      "educationalMeaning": "Ajuda a entender o cálculo, não a contratar produto financeiro.",
      "actionSuggestion": "Confira fontes, premissas e contrato real antes de decidir."
    }
  ],
  "alerts": [],
  "comparison": {
    "comparisonId": "cmp_price_sac_exemplo",
    "scenarios": [
      {
        "scenarioId": "price",
        "scenarioName": "PRICE",
        "inputs": {
          "termMonths": 360
        },
        "result": {
          "totalCost": 420000.0
        }
      },
      {
        "scenarioId": "sac",
        "scenarioName": "SAC",
        "inputs": {
          "termMonths": 360
        },
        "result": {
          "totalCost": 390000.0
        }
      }
    ],
    "differences": [
      {
        "metric": "totalCost",
        "absoluteDifference": 30000.0,
        "percentageDifference": 7.14
      }
    ],
    "tradeOffs": [
      "SAC pode reduzir juros totais em certos cenários, mas tende a exigir parcela inicial maior.",
      "PRICE pode facilitar previsibilidade de parcela, mas pode elevar custo total."
    ],
    "educationalConclusion": "A comparação é educacional e depende de contrato, renda, taxa e condições específicas.",
    "notPersonalRecommendation": true
  },
  "table": null,
  "chartData": null,
  "educationalMetadata": {
    "learningObjectives": [
      "entender resultado",
      "auditar cálculo"
    ],
    "difficulty": "basic"
  },
  "audit": {
    "contractVersion": "gate-po-ux-valor-item-07",
    "trace": [
      "examplePayload"
    ]
  }
}
```

### Exemplo — Financiamento imobiliário

```json
{
  "schemaVersion": "1.0.0",
  "requestId": "req_simular_financiamento_exemplo",
  "moduleId": "financiamento_imobiliario",
  "operationId": "simular_financiamento",
  "generatedAt": "2026-05-10T00:00:00Z",
  "locale": "pt-BR",
  "currency": "BRL",
  "calculationMode": "educationalSimulation",
  "rawInput": {
    "valor": 10000,
    "taxaMensal": 0.01,
    "prazoMeses": 12
  },
  "normalizedInput": {
    "principal": 10000.0,
    "monthlyRate": 0.01,
    "termMonths": 12
  },
  "validation": {
    "status": "valid",
    "messages": []
  },
  "result": {
    "primaryValue": {
      "label": "Parcela estimada",
      "value": 1120.0,
      "unit": "BRL",
      "scale": 2
    },
    "secondaryValues": [
      {
        "label": "Custo total estimado",
        "value": 13440.0,
        "unit": "BRL",
        "scale": 2
      }
    ],
    "summary": [
      "Exemplo ilustrativo para demonstrar estrutura do contrato."
    ]
  },
  "interpretation": {
    "title": "Leitura educacional do resultado",
    "text": "Este exemplo mostra como a API deve entregar interpretação junto com o número calculado.",
    "facts": [
      "O valor foi calculado a partir das entradas normalizadas."
    ],
    "inferences": [
      "A interpretação depende das premissas informadas."
    ],
    "limitations": [
      "Exemplo ilustrativo; não substitui contrato real."
    ]
  },
  "educationalExplanation": {
    "level": "introductory",
    "concepts": [
      "juros",
      "prazo",
      "custo total"
    ],
    "text": "A explicação deve ajudar a interface a ensinar o conceito sem improvisar conteúdo crítico."
  },
  "memoriaCalculo": {
    "formulas": [
      {
        "formulaName": "Fórmula ilustrativa",
        "formulaExpression": "resultado = entrada ajustada por taxa e prazo",
        "formulaDescription": "Expressão simplificada para demonstrar o contrato educacional."
      }
    ],
    "substituicoes": [
      {
        "symbol": "principal",
        "value": 10000.0,
        "unit": "BRL"
      },
      {
        "symbol": "monthlyRate",
        "value": 0.01,
        "unit": "percentual"
      }
    ],
    "etapas": [
      {
        "stepIndex": 1,
        "description": "Normalizar entradas.",
        "value": 10000.0
      },
      {
        "stepIndex": 2,
        "description": "Aplicar regra do módulo.",
        "value": 1120.0
      }
    ],
    "arredondamento": {
      "mode": "halfUp",
      "precision": 2,
      "scale": "currency"
    },
    "resultadoFinal": {
      "value": 1120.0,
      "unit": "BRL"
    }
  },
  "sources": [
    {
      "sourceId": "premissa_manual_exemplo",
      "sourceName": "Premissa manual informada pelo usuário",
      "sourceType": "manualAssumption",
      "sourceUrlOrReference": null,
      "referenceDate": "2026-05-10",
      "retrievedAt": null,
      "isOfficial": false,
      "usageNote": "Usada apenas para exemplo estrutural.",
      "limitation": "Não representa taxa contratual real."
    }
  ],
  "limits": [
    {
      "id": "educational_simulation",
      "severity": "info",
      "title": "Simulação educacional",
      "message": "O resultado é estimativo e não substitui análise profissional ou contrato real.",
      "educationalMeaning": "Ajuda a entender o cálculo, não a contratar produto financeiro.",
      "actionSuggestion": "Confira fontes, premissas e contrato real antes de decidir."
    }
  ],
  "alerts": [],
  "comparison": null,
  "table": {
    "columns": [
      {
        "key": "periodNumber",
        "label": "Mês",
        "unit": "mes"
      },
      {
        "key": "openingBalance",
        "label": "Saldo inicial",
        "unit": "BRL"
      },
      {
        "key": "interestAmount",
        "label": "Juros",
        "unit": "BRL"
      },
      {
        "key": "amortizationAmount",
        "label": "Amortização",
        "unit": "BRL"
      },
      {
        "key": "installmentAmount",
        "label": "Parcela",
        "unit": "BRL"
      },
      {
        "key": "endingBalance",
        "label": "Saldo final",
        "unit": "BRL"
      }
    ],
    "rows": [
      {
        "rowIndex": 0,
        "periodNumber": 1,
        "periodLabel": "Mês 1",
        "openingBalance": 100000.0,
        "interestAmount": 1000.0,
        "amortizationAmount": 250.0,
        "installmentAmount": 1250.0,
        "endingBalance": 99750.0
      },
      {
        "rowIndex": 1,
        "periodNumber": 2,
        "periodLabel": "Mês 2",
        "openingBalance": 99750.0,
        "interestAmount": 997.5,
        "amortizationAmount": 250.0,
        "installmentAmount": 1247.5,
        "endingBalance": 99500.0
      }
    ],
    "rowCountPolicy": {
      "expectedRows": 360,
      "isComplete": false,
      "displayNote": "Exemplo reduzido; contrato real deve permitir linhas conforme prazo."
    },
    "totals": {
      "interestTotal": 1000.0,
      "amortizationTotal": 500.0
    }
  },
  "chartData": {
    "chartType": "line",
    "title": "Evolução do saldo devedor",
    "description": "Mostra a redução do saldo ao longo dos meses.",
    "xAxis": {
      "label": "Mês",
      "unit": "mes"
    },
    "yAxis": {
      "label": "Saldo",
      "unit": "BRL"
    },
    "series": [
      {
        "name": "Saldo devedor",
        "unit": "BRL",
        "points": [
          {
            "x": 1,
            "y": 99750.0
          },
          {
            "x": 2,
            "y": 99500.0
          }
        ]
      }
    ],
    "educationalReading": "A curva ajuda a entender o ritmo de redução da dívida."
  },
  "educationalMetadata": {
    "learningObjectives": [
      "entender resultado",
      "auditar cálculo"
    ],
    "difficulty": "basic"
  },
  "audit": {
    "contractVersion": "gate-po-ux-valor-item-07",
    "trace": [
      "examplePayload"
    ]
  }
}
```

### Exemplo — Erro de validação

```json
{
  "schemaVersion": "1.0.0",
  "requestId": "req_erro_validacao",
  "moduleId": "financiamento_imobiliario",
  "operationId": "simular_financiamento",
  "generatedAt": "2026-05-10T00:00:00Z",
  "locale": "pt-BR",
  "validation": {
    "status": "invalid",
    "messages": [
      {
        "field": "prazoMeses",
        "code": "INVALID_RANGE",
        "message": "O prazo deve estar entre 1 e 600 meses.",
        "suggestion": "Informe um prazo em meses. Exemplo: 360.",
        "severity": "error"
      }
    ]
  },
  "result": null,
  "interpretation": null,
  "memoriaCalculo": null,
  "limits": [],
  "alerts": []
}
```

### Exemplo — Fonte oficial indisponível

```json
{
  "schemaVersion": "1.0.0",
  "requestId": "req_consultar_indicador_exemplo",
  "moduleId": "indicadores_oficiais",
  "operationId": "consultar_indicador",
  "generatedAt": "2026-05-10T00:00:00Z",
  "locale": "pt-BR",
  "currency": "BRL",
  "calculationMode": "educationalSimulation",
  "rawInput": {
    "valor": 10000,
    "taxaMensal": 0.01,
    "prazoMeses": 12
  },
  "normalizedInput": {
    "principal": 10000.0,
    "monthlyRate": 0.01,
    "termMonths": 12
  },
  "validation": {
    "status": "validWithWarnings",
    "messages": []
  },
  "result": {
    "primaryValue": {
      "label": "Indicador indisponível",
      "value": 1120.0,
      "unit": "BRL",
      "scale": 2
    },
    "secondaryValues": [
      {
        "label": "Custo total estimado",
        "value": 13440.0,
        "unit": "BRL",
        "scale": 2
      }
    ],
    "summary": [
      "Exemplo ilustrativo para demonstrar estrutura do contrato."
    ]
  },
  "interpretation": {
    "title": "Leitura educacional do resultado",
    "text": "Este exemplo mostra como a API deve entregar interpretação junto com o número calculado.",
    "facts": [
      "O valor foi calculado a partir das entradas normalizadas."
    ],
    "inferences": [
      "A interpretação depende das premissas informadas."
    ],
    "limitations": [
      "Exemplo ilustrativo; não substitui contrato real."
    ]
  },
  "educationalExplanation": {
    "level": "introductory",
    "concepts": [
      "juros",
      "prazo",
      "custo total"
    ],
    "text": "A explicação deve ajudar a interface a ensinar o conceito sem improvisar conteúdo crítico."
  },
  "memoriaCalculo": {
    "formulas": [
      {
        "formulaName": "Fórmula ilustrativa",
        "formulaExpression": "resultado = entrada ajustada por taxa e prazo",
        "formulaDescription": "Expressão simplificada para demonstrar o contrato educacional."
      }
    ],
    "substituicoes": [
      {
        "symbol": "principal",
        "value": 10000.0,
        "unit": "BRL"
      },
      {
        "symbol": "monthlyRate",
        "value": 0.01,
        "unit": "percentual"
      }
    ],
    "etapas": [
      {
        "stepIndex": 1,
        "description": "Normalizar entradas.",
        "value": 10000.0
      },
      {
        "stepIndex": 2,
        "description": "Aplicar regra do módulo.",
        "value": 1120.0
      }
    ],
    "arredondamento": {
      "mode": "halfUp",
      "precision": 2,
      "scale": "currency"
    },
    "resultadoFinal": {
      "value": 1120.0,
      "unit": "BRL"
    }
  },
  "sources": [
    {
      "sourceId": "fonte_oficial_indisponivel",
      "sourceName": "Fonte oficial futura",
      "sourceType": "officialUnavailable",
      "sourceUrlOrReference": null,
      "referenceDate": null,
      "retrievedAt": "2026-05-10T00:00:00Z",
      "isOfficial": true,
      "usageNote": "Fonte indisponível no momento da simulação.",
      "limitation": "Não usar como dado oficial atualizado."
    }
  ],
  "limits": [
    {
      "id": "educational_simulation",
      "severity": "info",
      "title": "Simulação educacional",
      "message": "O resultado é estimativo e não substitui análise profissional ou contrato real.",
      "educationalMeaning": "Ajuda a entender o cálculo, não a contratar produto financeiro.",
      "actionSuggestion": "Confira fontes, premissas e contrato real antes de decidir."
    }
  ],
  "alerts": [
    {
      "id": "official_source_unavailable",
      "severity": "warning",
      "title": "Fonte oficial indisponível",
      "message": "A fonte oficial não foi recuperada nesta simulação.",
      "educationalMeaning": "O usuário deve saber que a referência pode estar desatualizada.",
      "actionSuggestion": "Verifique a fonte oficial antes de tomar decisão real."
    }
  ],
  "comparison": null,
  "table": null,
  "chartData": null,
  "educationalMetadata": {
    "learningObjectives": [
      "entender resultado",
      "auditar cálculo"
    ],
    "difficulty": "basic"
  },
  "audit": {
    "contractVersion": "gate-po-ux-valor-item-07",
    "trace": [
      "examplePayload"
    ]
  }
}
```

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 43. Contraexemplos proibidos de payload

Os contraexemplos abaixo devem ser usados como critérios de reprovação. Eles mostram padrões que deixam a interface dependente de adivinhação, reduzem auditabilidade, confundem simulação com contrato ou transformam alerta em recomendação personalizada.

Contraexemplos literais reforçados:

- Payload que contém resultado financeiro relevante sem memória de cálculo estruturada
- Contrato que permite cortar linhas sem declarar limite, paginação, resumo ou critério de exibição

### Contraexemplo — Payload que retorna apenas número

```json
{
  "resultado": 1234.56
}
```

**Critério de reprovação:** Reprovar porque não há interpretação, unidade, memória, fonte, limite ou auditoria.

### Contraexemplo — Payload sem memória de cálculo

```json
{
  "result": {
    "primaryValue": {
      "value": 1234.56
    }
  }
}
```

**Critério de reprovação:** Reprovar quando houver cálculo financeiro relevante sem `memoriaCalculo`.

### Contraexemplo — Payload sem unidade

```json
{
  "primaryValue": {
    "value": 12.5
  }
}
```

**Critério de reprovação:** Reprovar porque a interface não sabe se o valor é moeda, taxa, meses ou percentual.

### Contraexemplo — Payload sem arredondamento

```json
{
  "memoriaCalculo": {
    "formulas": [],
    "etapas": []
  }
}
```

**Critério de reprovação:** Reprovar porque a auditoria não consegue reproduzir casas decimais e escala.

### Contraexemplo — Payload com tabela cortada sem critério

```json
{
  "table": {
    "rows": [
      {
        "periodNumber": 1
      }
    ],
    "totals": {}
  }
}
```

**Critério de reprovação:** Reprovar porque não declara limite, paginação, resumo ou incompletude.

### Contraexemplo — Payload com gráfico sem escala

```json
{
  "chartData": {
    "series": [
      {
        "points": [
          1,
          2,
          3
        ]
      }
    ]
  }
}
```

**Critério de reprovação:** Reprovar porque gráfico sem unidade e eixo pode induzir erro.

### Contraexemplo — Payload com fonte ausente quando necessária

```json
{
  "sources": []
}
```

**Critério de reprovação:** Reprovar quando houver indicador externo, norma, taxa oficial ou referência exigível.

### Contraexemplo — Payload que confunde simulação com contrato

```json
{
  "message": "Contrato aprovado com esta parcela."
}
```

**Critério de reprovação:** Reprovar porque a plataforma é educacional e não substitui contrato real.

### Contraexemplo — Payload que dá recomendação personalizada

```json
{
  "recommendation": "Você deve escolher SAC."
}
```

**Critério de reprovação:** Reprovar porque alerta educacional não é recomendação financeira personalizada.

### Contraexemplo — Payload que não diferencia erro de validação e erro técnico

```json
{
  "error": "Dados inválidos"
}
```

**Critério de reprovação:** Reprovar porque a interface não sabe se deve orientar correção ou reportar falha técnica.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 44. Relação futura com OpenAPI, JSON Schema e FastAPI/Pydantic

OpenAPI deverá documentar rotas e respostas; JSON Schema deverá validar estrutura; FastAPI/Pydantic poderá materializar modelos tipados no futuro. Neste item, essas referências servem como princípio, não implementação. O contrato educacional define semântica, exemplos, contraexemplos e critérios que essas ferramentas deverão respeitar quando forem usadas.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 45. Relação com auditoria das telas atuais do Item 8

O Item 8 deverá verificar se APIs, mocks ou dados atuais já fornecem resultado, interpretação, memória, fontes, limites, alertas, tabelas e comparações, ou se as telas improvisam essas camadas. A auditoria deve apontar lacunas por módulo e risco de divergência entre experiência e contrato futuro.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 46. Relação com prototipação do Item 10

O protótipo deverá considerar que a API futura entregará `result`, `interpretation`, `memoriaCalculo`, `table`, `comparison`, `sources`, `limits`, `alerts` e `chartData`. O protótipo não deve ser desenhado como se a interface recebesse apenas números, porque isso esconderia dependências educacionais críticas.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 47. Relação com Value Gate do Item 11

O Value Gate deverá reprovar módulo cujo contrato permita tela que calcula mas não explica, não audita, não cita fontes, não informa limites, não alerta riscos, corta tabela essencial ou transforma comparação em recomendação personalizada. Este contrato fornece critérios objetivos para essa reprovação documental e futura.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 48. Relação com aceite do PO do Item 13

O PO não deve aceitar tela que depende de adivinhação visual ou texto improvisado porque a API não entrega estrutura educacional suficiente. O aceite deve poder verificar evidências do payload: resultado, interpretação, memória, fontes, limites, alertas, tabela, comparação e critérios de auditoria.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 49. Critérios de aceite deste contrato

Critérios mínimos: 52 seções numeradas, pelo menos 700 linhas, campos canônicos definidos, envelope-base proposto, memória obrigatória, tabelas longas tratadas, fontes e limites estruturados, exemplos corretos, contraexemplos proibidos, critérios de reprovação, relação com Itens 6, 8, 10, 11 e 13, e Sprint 5 congelada.

Critérios literais de reprovação que devem permanecer auditáveis:

- Payload que contém resultado financeiro relevante sem memória de cálculo estruturada
- Contrato que permite cortar linhas sem declarar limite, paginação, resumo ou critério de exibição

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 50. Escopo proibido neste item

É proibido alterar backend, frontend, testes, rotas, modelos Pydantic reais, schema executável, pipeline, package.json, pyproject.toml, lockfiles, planilha operacional, protótipo, módulo-piloto, Value Gate implementado, Sprint 5 ou status do Gate. Também é proibido criar rascunhos, backups, arquivos temporários, placeholders ou evidências fabricadas.

Declarações literais obrigatórias de escopo negativo:

- Este contrato não altera rotas
- Este contrato não altera backend
- Este contrato não altera frontend
- Este contrato não altera testes
- Este contrato não atualiza planilha
- Este contrato não libera a Sprint 5
- Este contrato não conclui o Gate PO/UX/Valor

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 51. Próximos passos

O próximo item recomendado é o Item 8 — Auditar telas atuais. A auditoria deverá usar este contrato para verificar se as telas atuais recebem dados educacionais suficientes ou improvisam interpretação, memória, fontes, limites e alertas. Depois disso, o Gate seguirá para prototipação, Value Gate, piloto, aceite e replicação, sem liberar Sprint 5 antecipadamente.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## 52. Veredito final do Item 7

O Item 7 define um contrato educacional de API claro, auditável e estruturado. Ele orienta respostas futuras capazes de ensinar, explicar, auditar, comparar, alertar, citar fontes e sustentar aceite do PO. Este contrato não implementa, não altera código, não atualiza planilha, não conclui o Gate e não libera a Sprint 5. A Sprint 5 permanece congelada.

Regra operacional: referência técnica deve virar princípio adotado, campo do contrato, exemplo correto, contraexemplo proibido, evidência exigida e critério de reprovação. A API futura deve reduzir ambiguidade, não empurrar interpretação crítica para a interface e não permitir que telas educacionais recebam apenas números soltos.

### Campos, evidências e reprovação

Campos relevantes devem ser estáveis, sem acentos e em camelCase. Textos exibíveis podem estar em português claro e UTF-8 correto. Evidência esperada: payload estruturado, renderizável pela interface e auditável pelo Value Gate. Critério de reprovação: ausência de campo obrigatório, ambiguidade semântica, número solto, recomendação personalizada ou impossibilidade de explicar o cálculo.

## Anexo A — Tabela de campos canônicos

| Campo | Obrigatoriedade | Função |
| --- | --- | --- |
| schemaVersion | Obrigatório sempre | Versão semântica do contrato educacional usado no payload. |
| requestId | Obrigatório sempre | Identificador rastreável da requisição ou simulação. |
| moduleId | Obrigatório sempre | Identifica o módulo financeiro que produziu a resposta. |
| operationId | Obrigatório sempre | Identifica a operação educacional executada. |
| generatedAt | Obrigatório sempre | Data/hora de geração da resposta em formato ISO 8601. |
| locale | Obrigatório sempre | Idioma e região dos textos exibíveis, preferencialmente pt-BR. |
| currency | Obrigatório quando houver valor monetário | Moeda usada nos valores financeiros. |
| calculationMode | Obrigatório quando houver cálculo | Indica se o cálculo é determinístico, estimado, comparativo ou diagnóstico. |
| rawInput | Obrigatório sempre | Entrada bruta recebida da interface ou fluxo. |
| normalizedInput | Obrigatório sempre | Entrada normalizada para cálculo e auditoria. |
| validation | Obrigatório sempre | Status e mensagens estruturadas de validação. |
| result | Obrigatório em sucesso | Resultado principal e valores secundários. |
| summary | Obrigatório em sucesso | Resumo textual curto do resultado. |
| primaryValue | Obrigatório em sucesso | Valor principal, com unidade e escala. |
| secondaryValues | Opcional conforme módulo | Valores auxiliares relevantes. |
| interpretation | Obrigatório em sucesso | Leitura educacional do resultado. |
| educationalExplanation | Obrigatório quando houver conceito relevante | Explicação didática do conceito ou regra. |
| memoriaCalculo | Obrigatório quando houver cálculo financeiro relevante | Memória estruturada do cálculo. |
| formula | Obrigatório dentro da memória | Objeto de fórmula individual. |
| formulaName | Obrigatório dentro da fórmula | Nome humano da fórmula. |
| formulaExpression | Obrigatório dentro da fórmula | Expressão matemática ou representação textual. |
| formulaDescription | Obrigatório dentro da fórmula | Descrição didática da fórmula. |
| substitutions | Obrigatório dentro da memória | Valores substituídos na fórmula. |
| steps | Obrigatório dentro da memória | Etapas intermediárias auditáveis. |
| rounding | Obrigatório quando houver arredondamento | Critério de precisão, escala e casas decimais. |
| precision | Obrigatório quando houver número decimal | Precisão adotada no cálculo. |
| scale | Obrigatório quando houver valor monetário/taxa | Escala de exibição e cálculo. |
| assumptions | Obrigatório quando houver premissa | Premissas explícitas do cálculo. |
| sources | Obrigatório quando houver fonte externa | Fontes, referências, datas e limitações. |
| limits | Obrigatório sempre | Limites da simulação e do uso do resultado. |
| warnings | Opcional conforme severidade | Avisos não bloqueantes. |
| alerts | Obrigatório quando houver risco | Alertas educacionais ou financeiros. |
| risks | Obrigatório quando houver risco financeiro | Riscos estruturados com severidade. |
| comparison | Obrigatório quando houver comparação | Comparação estruturada de cenários. |
| scenarios | Obrigatório dentro de comparison | Cenários comparados. |
| table | Obrigatório quando houver tabela financeira | Tabela dinâmica com colunas, linhas e totais. |
| columns | Obrigatório dentro de table | Definição das colunas renderizáveis. |
| rows | Obrigatório dentro de table | Linhas completas ou paginadas com critério declarado. |
| totals | Obrigatório quando houver somatórios | Totais, subtotais e agregações. |
| chartData | Obrigatório quando houver gráfico | Dados estruturados para gráfico útil. |
| series | Obrigatório dentro de chartData | Séries com unidades e escala. |
| educationalMetadata | Obrigatório em sucesso | Metadados de aprendizagem e complexidade. |
| audit | Obrigatório sempre | Rastro técnico e documental para auditoria. |
| trace | Opcional controlado | Rastro interno seguro, sem dados sensíveis indevidos. |
