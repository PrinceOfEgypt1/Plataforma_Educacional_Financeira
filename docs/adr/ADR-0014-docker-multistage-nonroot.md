# ADR-0014 — Docker multi-stage + usuário não-root

- **Status:** accepted
- **Data:** 2026-04-14
- **Autoria:** Auditoria de Fundação (Prompt 1)

## Contexto
Imagens menores e mais seguras por default.

## Decisão
Dockerfiles multi-stage (build/runtime separados); usuário não-root; SBOM gerado; assinatura Cosign recomendada.

## Alternativas consideradas
Imagem única: maior superfície; usuário root: risco de escape.

## Consequências
Positivas: segurança, tamanho. Negativas: build mais complexo.

## Impacto em documentos
Ver referências cruzadas em `docs/04_Arquitetura_de_Software.md` e documentos vivos correlatos.

## Métricas de validação
Cobertura por testes da Estratégia §4, SLOs do Doc 23 quando aplicáveis, checklist Doc 25 por release.

## Revisão programada
Em cada gatilho de rebaseline do Doc 11 (Prompt-Mestre) ou em caso de incidente correlato.
