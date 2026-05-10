# AUDITOR DE INTERFACE — MODO ADVISORY

Status: VIVO
Sprint: 4.5/F5
Escopo: governança visual, tabelas financeiras, cockpit e documentação viva

## 1. Objetivo

O `auditor_de_interface` é uma ferramenta local e leve para verificar, de forma
estática, sinais de regressão visual e estrutural introduzidos nas fases F2, F3
e F4 da Sprint 4.5.

Ele existe para apoiar Moisés/Camaleão e a revisão humana. Ele não substitui
auditoria visual, screenshots, navegação em browser, validação por pixel ou
decisão formal de governança.

## 2. Como executar

```bash
pnpm --dir frontend audit:interface
```

O script executado é:

```bash
node frontend/scripts/auditor-de-interface.mjs
```

## 3. Semântica de severidade

| Severidade          | Significado                                                         |
| ------------------- | ------------------------------------------------------------------- |
| `critical-advisory` | Achado com alto risco de regressão de contrato visual ou governança |
| `warning`           | Achado relevante que exige triagem e justificativa                  |
| `info`              | Regra satisfeita ou evidência informativa                           |

Enquanto estiver em modo advisory, achados retornam exit code `0`. Erros
operacionais, como arquivo obrigatório ausente ou falha de leitura, retornam exit
code diferente de zero.

## 4. Regras cobertas na F5

### Tabelas financeiras

- ausência de `overflow-x-auto`, `overflow-x-scroll` ou `overflowX` como
  experiência principal;
- ausência de `.slice()` em tabelas financeiras e pontos de preservação de
  linhas;
- presença de `<caption>`;
- uso de `scope="col"` e `scope="row"`;
- valores financeiros com numerais tabulares via `tabular-nums` ou
  `.cockpit-table`.

### Cockpit

- sticky header restrito a `.cockpit-table thead th`;
- ausência de `VISIBLE_MODULE_IDS` em `FinancialCockpitShell`;
- uso de `visibleInCockpit` e `getCockpitVisibleModules`;
- uso de `CockpitEducationPanel` sem reintroduzir `EducationPanel` duplicado no
  namespace do cockpit;
- preservação de `aria-busy`, `aria-invalid` e `aria-describedby` nos primitivos.

### Documentação viva

- política de modais e abas confirma modal como apoio contextual, não navegação
  principal;
- `docs/_meta/living_docs.json` registra este documento.

## 5. Limites explícitos

O auditor não executa browser, não captura screenshots, não compara pixels e não
valida percepção visual final. Também não decide sozinho se uma exceção é
aceitável: alertas remanescentes devem ser documentados, classificados por
severidade, justificados e vinculados a decisão formal de Moisés/Camaleão.

## 6. Critério operacional da F5

A F5 considera o auditor materializado quando:

- o comando `pnpm --dir frontend audit:interface` existe;
- o relatório lista regras e severidades;
- achados advisory não bloqueiam por exit code;
- erros operacionais falham;
- a documentação viva registra a ferramenta e seus limites.
