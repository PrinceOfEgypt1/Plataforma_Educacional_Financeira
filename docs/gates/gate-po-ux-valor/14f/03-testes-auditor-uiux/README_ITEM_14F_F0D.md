# PEF — Item 14F-F0D — Testes do auditor UI/UX

## 1. Objetivo

Criar testes automatizados para o auditor `audit:uiux`, materializado no Item 14F-F0C.

## 2. Natureza do item

Este item não corrige a interface do módulo Imóvel.

Este item aumenta a confiabilidade do auditor, provando que ele:

- está integrado ao `frontend/package.json`;
- valida o contrato UI/UX em modo `contract-only`;
- emite JSON estruturado;
- detecta o FAIL atual do módulo Imóvel;
- preserva os códigos e quantidades esperados enquanto o módulo ainda não foi corrigido.

## 3. Teste criado

- `frontend/src/__tests__/scripts/auditorUiux.test.ts`

## 4. Resultado esperado nesta fase

O módulo Imóvel ainda deve reprovar no auditor em modo `--expect-fail`.

A reprovação atual esperada é:

| Severidade | Quantidade |
|---|---:|
| high | 19 |
| medium | 9 |
| low | 0 |
| total | 28 |

## 5. Códigos esperados

| Código | Quantidade |
|---|---:|
| `UX-CTA-001` | 2 |
| `UX-CTA-002` | 2 |
| `UX-DUP-001` | 14 |
| `UX-DUP-002` | 9 |
| `UX-MOBILE-001` | 1 |

## 6. Observação de governança

Quando o módulo Imóvel for corrigido, estes testes deverão evoluir junto com o estado real do produto. Neste momento, eles documentam e protegem o estado objetivo de reprovação que ainda precisa ser tratado em fatias posteriores.
