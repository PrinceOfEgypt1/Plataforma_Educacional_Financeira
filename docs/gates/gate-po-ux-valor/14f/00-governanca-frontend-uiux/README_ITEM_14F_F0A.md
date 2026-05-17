# PEF — Item 14F-F0A — Governança documental frontend/UI/UX

Este pacote materializa a primeira base documental do programa de excelência frontend/UI/UX da Plataforma Educacional Financeira.

## Objetivo

Criar a régua oficial de qualidade que permitirá transformar problemas de interface, jornada e experiência do usuário em critérios verificáveis, auditáveis e, nas próximas fatias, executáveis por scripts/gates.

## Escopo desta entrega

Esta entrega cria apenas documentos de governança. Ela não altera código de aplicação, backend, fórmulas, contratos de API, dependências, lockfiles, testes, workflows ou planilha operacional.

## Arquivos incluídos

- `docs/governance/frontend/PEF_FRONTEND_EXCELLENCE_STANDARD.md`
- `docs/governance/frontend/PEF_UI_UX_SCORECARD.md`
- `docs/governance/frontend/PEF_FRONTEND_DEFINITION_OF_DONE.md`
- `docs/governance/frontend/PEF_FRONTEND_REJECTION_CRITERIA.md`
- `docs/governance/frontend/PEF_MODULE_JOURNEY_TEMPLATE.md`
- `docs/governance/frontend/PEF_COMPONENT_PURPOSE_STANDARD.md`
- `docs/governance/frontend/PEF_FINANCIAL_TABLE_UX_STANDARD.md`
- `docs/governance/frontend/PEF_FINANCIAL_CHART_UX_STANDARD.md`

## Relação com as próximas fatias

A próxima fatia deve criar o contrato UI/UX executável do módulo Financiamento Imobiliário. Depois disso, o auditor automático deve usar os critérios desta governança para reprovar objetivamente violações como:

- botões diferentes levando ao mesmo destino sem justificativa;
- cards diferentes com a mesma ação real;
- label de CTA incompatível com destino;
- duplicação de informações entre zonas;
- `data-testid` duplicado;
- componente legado tratado como ativo;
- navegação longa por rolagem quando o padrão exige painel/zonas;
- sidebar fixa em mobile;
- tabela ou gráfico sem contrato mínimo de leitura;
- estados loading/error/empty ausentes ou não testados;
- texto temporário, mojibake ou marcador de implementação pendente.

## Decisão esperada após materialização

Após este pacote ser materializado e versionado, a PEF passa a ter uma régua formal para reprovar entregas de frontend que apenas compilam, mas não entregam experiência, clareza, pedagogia, acessibilidade e qualidade visual.
