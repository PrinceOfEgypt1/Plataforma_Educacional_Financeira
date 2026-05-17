# Materialização orientada — Item 14F-F0A

## Objetivo

Materializar os documentos deste pacote no repositório local da Plataforma Educacional Financeira usando branch limpa baseada em `origin/main`.

## Estratégia recomendada

Como pode existir uma branch local anterior com alterações F1/F1-A não aprovadas, recomenda-se criar um `git worktree` separado baseado em `origin/main`.

## Diretório sugerido do worktree

```txt
/home/moses/workspace/Plataforma_Educacional_Financeira_item14f_f0a
```

## Branch sugerida

```txt
gate-po-ux-valor/item-14f-f0a-governanca-frontend-uiux
```

## Validações mínimas

```bash
git diff --check
python3 -m json.tool docs/_meta/living_docs.json >/tmp/living_docs_validado.json
```

Se forem alterados índices/metadados do projeto, validar também a consistência do `docs/00_INDICE_GERAL.md` e do `docs/_meta/living_docs.json`.

## Observação

Este pacote não deve ser aplicado sobre a branch local de F1/F1-A ainda não aprovada, para evitar misturar tentativa técnica de UI com fundação de governança documental.
