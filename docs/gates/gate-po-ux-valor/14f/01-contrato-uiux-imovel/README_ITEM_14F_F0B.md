# PEF — Item 14F-F0B — Contrato UI/UX do módulo Imóvel

## 1. Objetivo

Materializar o contrato UI/UX executável do módulo Financiamento Imobiliário.

Este item cria uma representação legível por máquina das regras que o módulo Imóvel deve obedecer em termos de jornada, zonas, CTAs, duplicações, estados de interface, responsividade, tabela, gráfico, acessibilidade e integridade textual.

## 2. Relação com o Item 14F-F0A

O Item 14F-F0A criou a governança documental frontend/UI/UX da PEF.

O Item 14F-F0B transforma parte dessa governança em contrato específico para o módulo Imóvel, preparando o caminho para o auditor automático do Item 14F-F0C.

## 3. Escopo

Incluído:

- contrato JSON do módulo Imóvel;
- README de contratos UI/UX;
- evidências documentais do item;
- atualização de índice e documentação viva durante a materialização.

Fora de escopo:

- alteração de código frontend;
- alteração de backend;
- alteração de fórmulas financeiras;
- alteração de contrato de API;
- criação do auditor automático;
- correção da interface atual.

## 4. Decisão de governança

Este item não corrige a tela. Ele define o que a tela deve obedecer.

O código atual será reprovado objetivamente apenas na próxima etapa, quando o auditor automático consumir este contrato.

## 5. Próximo passo

Após materialização deste item, o próximo trabalho recomendado é:

```txt
14F-F0C — Criar auditor automático audit:uiux
```
