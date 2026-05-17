# PEF — Contratos UI/UX Executáveis

## 1. Finalidade

Esta pasta guarda contratos UI/UX em formato legível por máquina.

Os contratos fazem a ponte entre a governança documental frontend/UI/UX da PEF e os futuros auditores automáticos.

## 2. Relação com a governança

Os contratos derivam dos documentos oficiais em `docs/governance/frontend/`.

A finalidade não é substituir os documentos de governança, mas transformar critérios de qualidade em regras verificáveis.

## 3. Contratos disponíveis

| Contrato | Módulo | Finalidade |
|---|---|---|
| `financiamento-imobiliario.uiux.contract.json` | Financiamento Imobiliário | Define jornada, zonas, CTAs, regras de duplicação, estados, mobile, tabela, gráfico, acessibilidade e códigos de erro para auditoria futura. |

## 4. Uso previsto

Nas próximas fatias, o auditor automático deverá carregar estes contratos e gerar erros objetivos quando o frontend violar a governança.

Exemplo de uso futuro:

```bash
pnpm audit:uiux
```

## 5. Regra de manutenção

Todo contrato deve:

1. declarar módulo e rota;
2. listar arquivos relevantes;
3. declarar jornada esperada;
4. declarar CTAs e destinos;
5. declarar regras de duplicação;
6. declarar estados obrigatórios;
7. declarar regras de mobile, tabela, gráfico e acessibilidade;
8. declarar códigos de erro consumíveis por auditor.
