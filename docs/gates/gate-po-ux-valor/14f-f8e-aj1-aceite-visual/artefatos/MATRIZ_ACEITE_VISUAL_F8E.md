# Matriz de Aceite Visual — 14F-F8E

**Uso:** Moisés (PO) preenche esta matriz após abrir `index.html` e navegar pelas 7 etapas e 5 abas de cada etapa. Cada item é binário: aceito (✓) ou não aceito (✗). Itens não aceitos viram pauta da próxima rodada.

---

## A. Direção visual e estética

| # | Critério | Esperado | Aceite |
|---|---|---|---|
| A1 | O protótipo abre direto pelo `index.html` sem dependências de build | abertura instantânea no navegador | [ ] |
| A2 | A tela **não lembra** o cockpit antigo reprovado da F8D | sensação de produto novo | [ ] |
| A3 | A estética **Observatory Dark Cards** é dominante em toda a navegação | fundo `#030811`, cards `#0a1628`, paleta consistente | [ ] |
| A4 | Os cards parecem **integrados**, não colados sobre um layout existente | mesma família de bordas, raios, sombras | [ ] |
| A5 | A hierarquia visual é clara em todas as 35 abas | eyebrow → título → corpo → ação | [ ] |
| A6 | A tipografia DM Sans + DM Mono é aplicada corretamente | mono apenas em números/labels técnicos | [ ] |
| A7 | A densidade visual é confortável, não pesada | espaçamento entre cards ≥ 1rem | [ ] |
| A8 | A aparência geral é de **produto final**, não de teste de componentes | acabamento perceptível em transições, hover, gradientes | [ ] |

## B. Navegação e jornada

| # | Critério | Esperado | Aceite |
|---|---|---|---|
| B1 | O **stepper de 7 etapas** é sempre visível e clicável | sticky no topo, alta visibilidade | [ ] |
| B2 | Cada etapa tem **5 sub-abas navegáveis** | clique na sub-aba troca o painel sem reload | [ ] |
| B3 | Os botões **Anterior / Próxima** funcionam em todas as 35 abas | navegação sequencial fluida | [ ] |
| B4 | A **etapa atual** está visualmente destacada no stepper | gradiente azul/ciano | [ ] |
| B5 | A passagem entre etapas tem **micro-animação** discreta | fade-in suave | [ ] |
| B6 | O **painel de cenário fixo** (R$ 870k, R$ 700k, R$ 170k, 120 meses, 0,85%) está visível em todas as etapas | barra superior fixa | [ ] |
| B7 | CTAs internos como "Pronto. Vamos simular →" e "Calcular — Ver Resultado" levam à etapa correta | navegação por CTA | [ ] |

## C. Componentes obrigatórios em contexto real

| # | Componente | Onde aparece | Aceite |
|---|---|---|---|
| C1 | `ScoreCard` (estilo do guia) | Etapa 3 Resumo e Etapa 5 Resumo Comparativo | [ ] |
| C2 | `MetricCard` com mini-barras | Etapa 5 Resumo Comparativo (Detalhamento SAC e PRICE) | [ ] |
| C3 | `ChecklistCard` com gradiente azul/ciano no header | Etapa 6 Auditoria e Etapa 7 Checklist | [ ] |
| C4 | `BeforeAfterCard` (SAC verde vs PRICE roxo) | Etapa 1 SAC x PRICE e Etapa 4 SAC x PRICE | [ ] |
| C5 | `QuestionCard` ou Insight com marca d'água | Aceitável como InsightBox numerado/marcado em várias etapas | [ ] |
| C6 | `InsightBox` âmbar/ciano/verde/vermelho | Etapas 1, 3, 4, 5, 6, 7 | [ ] |
| C7 | `ApplyCard` com tag, título e bloco mono âmbar | Etapa 7 Próximos Passos | [ ] |

## D. Conteúdo pedagógico e cenário

| # | Critério | Esperado | Aceite |
|---|---|---|---|
| D1 | A jornada **ensina**, não apenas exibe números | explicações curtas e úteis em cada aba | [ ] |
| D2 | O cenário fixo do contrato F8C-v6.3 está aplicado em todos os números | R$ 870k, R$ 700k, R$ 170k, 120m, 0,85%, R$ 205 | [ ] |
| D3 | As fórmulas SAC e PRICE estão tipografadas e legíveis | bloco com borda esquerda azul, fonte mono | [ ] |
| D4 | A tabela completa SAC (120 parcelas paginadas) é navegável | 15 páginas, paginador funcional | [ ] |
| D5 | A tabela completa PRICE (120 parcelas paginadas) é navegável | mesma estrutura, mesma base justa | [ ] |
| D6 | O gráfico de saldo devedor mostra as duas curvas (SAC sólido, PRICE tracejado) | SVG inline com legenda | [ ] |
| D7 | O gráfico de barras Total/Juros/Encargos compara SAC x PRICE | barras agrupadas com valores no topo | [ ] |
| D8 | Cada aba "Cuidados" tem 4 alertas relevantes e diferentes | etapas 1 e 7 com cuidados distintos | [ ] |
| D9 | O checklist de 10 itens da Etapa 7 está completo e prático | dez itens reais, sem item vazio ou genérico | [ ] |
| D10 | A conclusão da Etapa 7 reúne o que o usuário aprendeu | card Aurora central + lista | [ ] |

## E. Layout e responsividade

| # | Critério | Esperado | Aceite |
|---|---|---|---|
| E1 | **Desktop 1920×1080**: sem rolagem horizontal global; rolagem vertical controlada por etapa | usável sem incomôdo | [ ] |
| E2 | **Notebook 1366×768**: stepper sticky + sub-tabs visíveis; cards proporcionais | sem "paredão" de informação | [ ] |
| E3 | **Tablet 768×1024**: grids 2-col viram 1-col onde apropriado; tabelas em contêiner com rolagem horizontal interna | layout não quebra | [ ] |
| E4 | **Mobile 390×844**: cards empilham; pílula de cenário quebra em linhas; fontes legíveis ≥ 12px | uso confortável de toque | [ ] |
| E5 | Tabelas paginadas não causam **scroll vertical global**; têm rolagem horizontal interna | scroll-x apenas dentro do card | [ ] |
| E6 | Gráficos SVG são responsivos (viewBox + preserveAspectRatio) | redimensionam sem quebrar | [ ] |

## F. Nomenclatura e travas de governança

| # | Critério | Esperado | Aceite |
|---|---|---|---|
| F1 | **SAC x PRICE** usa a letra `x` minúscula | nunca o símbolo Unicode `×` | [ ] |
| F2 | Nenhum conteúdo provisório aparece (sem rascunhos, sem marcadores de pendência) | conteúdo final em todas as 35 abas | [ ] |
| F3 | Nenhum bloco diz que os cálculos são oficiais | aviso de governança no rodapé deixa claro | [ ] |
| F4 | O banner inferior de governança está presente e legível | linha azul tracejada com texto claro | [ ] |
| F5 | A status pill "protótipo F8E" aparece no topo | identifica que NÃO é produto live | [ ] |

## G. Capacidade de avaliação humana

| # | Critério | Esperado | Aceite |
|---|---|---|---|
| G1 | Moisés consegue avaliar visualmente sem rodar backend | abertura local autônoma | [ ] |
| G2 | Moisés consegue percorrer as 35 abas em < 5 minutos | navegação direta sem fricção | [ ] |
| G3 | Moisés consegue identificar claramente cada um dos 7 componentes obrigatórios | aparência inequívoca | [ ] |
| G4 | Moisés consegue comparar visualmente este protótipo com o `guia-prompt-checklist.html` de referência | mesma família visual | [ ] |
| G5 | Moisés consegue comparar visualmente este protótipo com a F8D reprovada | diferença evidente | [ ] |

---

## Resultado consolidado (preenchido pelo PO)

```
Itens aceitos: ___ / 38
Itens não aceitos: ___ / 38

Decisão:
[ ] APROVADO — autorizo abrir a frente F8F com escopo de implementação React real, exigindo fidelidade visual a este protótipo.
[ ] REPROVADO — relacionar os itens não aceitos abaixo para nova rodada de protótipo.

Comentários gerais:
_________________________________________________________
_________________________________________________________
```

**Lembrete**: nenhuma IA pode declarar APROVADO. Só Moisés pode marcar o aceite acima.
