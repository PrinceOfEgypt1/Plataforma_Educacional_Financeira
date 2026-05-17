# Relatório — Item 14F-F0B — Contrato UI/UX do módulo Imóvel

## 1. Resumo executivo

Este item cria o contrato UI/UX executável do módulo Financiamento Imobiliário.

O contrato define, em JSON, regras verificáveis de jornada, views, zonas, CTAs, destinos esperados, duplicações, estados de interface, mobile, tabela, gráfico, acessibilidade, integridade textual e códigos de erro.

Este item não corrige o frontend atual. Ele prepara a base objetiva para que o futuro auditor automático consiga reprovar violações de UI/UX com logs claros.

## 2. Arquivo principal

```txt
docs/governance/frontend/contracts/financiamento-imobiliario.uiux.contract.json
```

## 3. Principais decisões

### 3.1 Contrato por módulo

A PEF passa a tratar o módulo Imóvel como primeiro módulo com contrato UI/UX específico.

### 3.2 CTAs com destino explícito

Botões como `Ver CET`, `Ver interpretação`, `Ver gráfico`, `Abrir tabela`, `Ver memória` e `Ver fontes` possuem destino esperado declarado.

### 3.3 Proibição de destino genérico

O contrato define que CTAs específicos não devem cair em destino genérico quando prometem zona ou view específica.

### 3.4 Propriedade de conteúdo

O contrato define qual zona é dona de cada tipo de conteúdo financeiro, reduzindo duplicações sem propósito.

### 3.5 Erros consumíveis por auditor

O contrato declara códigos como:

- `UX-CTA-001`
- `UX-CTA-002`
- `UX-CARD-001`
- `UX-DUP-001`
- `UX-DUP-INFO-001`
- `UX-MOBILE-001`
- `UX-TABLE-001`
- `UX-CHART-001`
- `UX-STATE-001`
- `UX-A11Y-001`
- `UX-TEXT-001`

## 4. Validações esperadas na materialização

Antes do commit, validar:

```bash
python3 -m json.tool docs/governance/frontend/contracts/financiamento-imobiliario.uiux.contract.json
python3 -m json.tool docs/_meta/living_docs.json
git diff --check
```

Também validar ausência de texto corrompido e marcadores temporários proibidos.

## 5. Limites

Este item não cria o auditor automático.

Este item não altera a tela atual.

Este item não substitui a validação futura do contrato contra o código.

## 6. Próximo passo

Criar o auditor automático do Item 14F-F0C, que deve consumir este contrato e gerar falhas objetivas contra o módulo Imóvel atual.
