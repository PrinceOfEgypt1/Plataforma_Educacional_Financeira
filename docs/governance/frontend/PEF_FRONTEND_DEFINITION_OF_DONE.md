# PEF — Definition of Done Frontend/UI/UX

## 1. Finalidade

Este documento define quando uma entrega frontend pode ser considerada concluída na Plataforma Educacional Financeira.

Passar em lint, typecheck, testes e build é obrigatório, mas não suficiente.

## 2. Definição de pronto

Uma entrega frontend só está pronta quando atende aos seguintes grupos de critérios.

## 3. Critérios técnicos obrigatórios

A entrega deve passar em:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Quando existir auditor UI/UX executável, também deve passar em:

```bash
pnpm audit:uiux
```

ou no comando equivalente oficial.

## 4. Critérios de escopo

A entrega deve declarar explicitamente:

1. arquivos alterados;
2. arquivos não alterados por regra;
3. se houve alteração de backend;
4. se houve alteração de fórmula;
5. se houve alteração de contrato de API;
6. se houve alteração de lockfile ou dependências;
7. quais critérios da governança foram atendidos;
8. quais critérios continuam pendentes.

## 5. Critérios de UI/UX

A entrega deve provar que:

1. CTAs cumprem sua promessa;
2. cards têm propósito único;
3. zonas/tabs possuem estado ativo claro;
4. não há duplicação sem justificativa;
5. a jornada principal é clara;
6. loading/error/empty/success estão tratados quando aplicável;
7. mobile não está quebrado;
8. elementos essenciais possuem nome acessível;
9. tabelas e gráficos seguem seus contratos mínimos;
10. a tela não materializa texto temporário ou corrompido.

## 6. Critérios pedagógicos

Toda tela educacional financeira deve demonstrar:

1. conceito básico do que está sendo calculado;
2. premissas usadas;
3. resultado principal;
4. interpretação do resultado;
5. caminho para memória de cálculo;
6. limites da simulação;
7. próximos passos ou alertas úteis.

## 7. Critérios de evidência

Para entregas visuais ou de jornada, a entrega deve conter pelo menos uma destas evidências, conforme o caso:

1. testes automatizados de fluxo;
2. saída do auditor UI/UX;
3. screenshots before/after;
4. relatório de acessibilidade;
5. relatório de responsividade;
6. logs de validação técnica.

Quando o auditor UI/UX estiver em modo blocking, sua saída verde substitui parte da evidência manual, mas não substitui aceite final do PO quando a mudança for visualmente relevante.

## 8. Critérios de rejeição por falta de evidência

A entrega não está pronta se:

1. afirma correção sem evidência;
2. usa teste que não valida o comportamento real;
3. ignora erro do auditor;
4. trata erro crítico como backlog sem autorização;
5. altera escopo proibido;
6. entrega apenas relatório quando havia código obrigatório;
7. entrega código sem relatório quando havia exigência de evidência.

## 9. Aceite PO/UX

O aceite PO/UX só pode ocorrer após:

1. gates técnicos verdes;
2. auditor UI/UX sem erros críticos para o escopo;
3. evidências anexadas;
4. decisão explícita do PO.

O PO pode reprovar uma entrega visual mesmo com todos os testes técnicos verdes se a experiência não atingir o padrão oficial.
