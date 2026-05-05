# F2 - Testes executados

## Cobertura adicionada/atualizada

- `/juros` renderiza cockpit, subtabs, KPIs, grafico central, painel educacional
  e insight inferior.
- `/juros` navega por Juros Simples, Juros Compostos e Comparar usando services
  existentes.
- `/juros` abre modal educacional com Juros Simples, Juros Compostos,
  Comparacao, Aportes e Cuidados.
- `/amortizacao` renderiza cockpit PRICE com subtabs, KPIs, grafico, painel
  direito e insight.
- `/amortizacao` navega por PRICE, SAC e Comparar usando services existentes.
- `/amortizacao` abre modal com O que a tabela mostra, PRICE, SAC, PRICE x SAC,
  Glossario e Cuidados.
- Shell global renderiza topbar sem sidebar antiga.
- Modulos em breve renderizam empty state elegante.
- Governanca de frontend verifica ausencia de calculo financeiro critico novo
  e ausencia de botao "Abrir" como mecanismo essencial.

## Resultado

`pnpm test -- --run`

Resultado obtido:

```text
Test Files  25 passed (25)
Tests       177 passed (177)
```

Aviso nao bloqueante observado: warning conhecido de Recharts/jsdom sobre
dimensao zero em ambiente de teste. Nao houve falha de teste.

## Grep de seguranca - calculo financeiro

Comando executado:

```bash
grep -RInE "Math\\.pow|\\*\\*|principal.*taxa|taxa.*principal|total_juros\\s*=|total_pago\\s*=|saldo_final\\s*=|amortizacao\\s*=|juros\\s*=|pmt\\s*=|montante\\s*=" frontend/src || true
```

Resultado: o grep encontrou comentarios, fixtures de teste, tipos, textos
educacionais e strings canonicas existentes. Nao foi identificado calculo
financeiro critico novo no frontend; o cockpit usa apenas parse/formatacao de
valores retornados pelos services/API para renderizar KPIs, graficos, tabelas e
insights.
