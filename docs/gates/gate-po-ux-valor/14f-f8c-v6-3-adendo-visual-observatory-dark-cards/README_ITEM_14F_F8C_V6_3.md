# README — Item 14F-F8C-v6.3
## Adendo Visual "Observatory Dark Cards" — Módulo Financiamento Imobiliário

**Item:** 14F-F8C-v6.3
**Tipo:** Adendo visual documental/contratual
**Status:** pendente_aprovacao_po
**Base contratual:** F8C-v6.2 (materializada na `main` via PR #69)
**Data de criação:** 2026-05-26
**Responsável pela criação:** IA executora (Claude)
**Aceite visual humano:** PENDENTE — depende exclusivamente de Moisés (PO)

---

## Missão deste adendo

Incorporar ao módulo Financiamento Imobiliário do PEF o padrão visual **Observatory Dark Cards**, baseado no arquivo `guia-prompt-checklist.html` e nas imagens aprovadas pelo PO, usando **DM Sans + DM Mono**, transformando a referência visual aprovada em contrato objetivo, auditável e bloqueante para a futura implementação React.

A exigência principal é **fidelidade visual determinística**: a futura interface do módulo Imóvel deve reproduzir o padrão visual dos cards aprovados pelo PO em tamanho, tipo de fonte, cor de fonte, cor de fundo, bordas, espaçamentos, barras, alinhamentos, distribuição textual, proporções e hierarquia visual.

---

## O que este adendo NÃO faz

- NÃO implementa React.
- NÃO altera arquivos em `frontend/`.
- NÃO altera arquivos em `backend/`.
- NÃO altera fórmulas financeiras.
- NÃO altera API.
- NÃO cria módulo paralelo.
- NÃO usa mock estático.
- NÃO remove ou enfraquece a F8C-v6.2.
- NÃO remove documentos existentes.
- NÃO declara aceite visual humano.
- NÃO declara Sprint 5 liberada.

---

## Arquivos deste adendo

| Arquivo | Função |
|---|---|
| `README_ITEM_14F_F8C_V6_3.md` | Este arquivo — índice e metadados |
| `ADENDO_VISUAL_OBSERVATORY_DARK_CARDS_IMOVEL.md` | Contrato visual completo com regras bloqueantes |
| `DESIGN_SYSTEM_OBSERVATORY_DARK_CARDS.md` | Tokens, tipografia, paleta, espaçamentos e estados |
| `MATRIZ_UI_ELEMENTS_PARA_IMOVEL.md` | Matriz de UI Elements por etapa da jornada |
| `CRITERIOS_ACEITE_VISUAL_OBSERVATORY_CARDS.md` | Critérios binários de aceite visual |
| `CONTRATO_VISUAL_IMOVEL_V6_3.json` | Contrato legível por máquina |
| `AUTOVALIDACAO_E_AUDITORIA.md` | Registro de autovalidação e auditoria |
| `validate-observatory-cards.mjs` | Script de validação estrutural |

---

## Relação com a F8C-v6.2

Este adendo é um **complemento** à F8C-v6.2, não uma substituição. A F8C-v6.2 define:
- A jornada de 7 etapas (Preparar, Simular, Resultado, Entender, Comparar, Conferir, Decidir).
- As abas obrigatórias por etapa.
- O cenário financeiro fixo (imóvel R$ 870.000,00; entrada R$ 700.000,00; financiado R$ 170.000,00; prazo 120 meses; taxa 0,85% a.m.; encargos mensais R$ 205,00; encargos totais R$ 24.600,00).
- As restrições estruturais e invariantes.
- A nomenclatura "SAC x PRICE" (com letra x minúscula).

Este adendo v6.3 acrescenta a especificação visual determinística baseada no padrão Observatory Dark Cards aprovado pelo PO, com tokens de cor, escala tipográfica, espaçamentos, estados, UI Elements específicos e matriz de aplicação por etapa.

---

## Invariantes herdados da F8C-v6.2 — BLOQUEANTES

- A jornada de 7 etapas não pode ser alterada.
- As abas obrigatórias da F8C-v6.2 não podem ser removidas.
- A nomenclatura deve ser "SAC x PRICE" (com letra x minúscula).
- É proibido substituir por "SAC x PRICE" com sinal de multiplicação Unicode.
- É proibido substituir "SAC x PRICE" por "SAC" sozinho.
- Cenário financeiro fixo preservado (ver F8C-v6.2).
- Não alterar backend.
- Não alterar fórmulas financeiras.
- Não criar módulo paralelo.
- Não usar mock estático.
- Não declarar aceite humano.

---

## Próximo passo

O próximo passo é o **aceite visual humano pelo PO (Moisés)**, após revisão dos documentos deste adendo. Somente após aceite humano explícito e documentado a implementação React poderá ser autorizada.

A IA executora não pode declarar aceite visual. A IA executora não pode declarar Sprint 5 liberada.
