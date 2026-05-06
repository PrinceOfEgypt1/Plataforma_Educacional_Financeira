# DOCUMENTO 07 — UX/UI E NAVEGAÇÃO
## Plataforma Educacional Financeira Completa

**Versão:** 1.0
**Tipo:** UX/UI e Navegação
**Status:** Base oficial da experiência do usuário, interface e navegação

## 1. Finalidade
Definir como o usuário irá interagir com a plataforma, como a experiência será organizada e quais princípios visuais e funcionais deverão orientar a interface.

## 2. Papel da UX/UI no produto
A UX/UI é parte central da proposta de valor. Ela precisa cumprir simultaneamente papel:
- de orientação;
- pedagógico;
- analítico;
- emocional.

## 3. Objetivo central da experiência
O usuário deve sentir que:
- entender finanças é possível;
- os números estão organizados de forma clara;
- a aplicação o acompanha didaticamente;
- cada simulação gera aprendizado prático;
- a navegação é simples mesmo com muitos módulos.

## 4. Princípios de UX oficiais
- clareza antes de densidade;
- didática antes de espetáculo;
- resultado com contexto;
- comparação visível;
- progressão natural;
- consistência;
- simplicidade para iniciantes;
- profundidade opcional.

## 5. Arquitetura de informação
### Áreas recomendadas
- Início e orientação
- Saúde financeira
- Juros e financiamento
- Crédito e endividamento
- Indicadores e decisão
- Aprendizado

## 6. Modelo de navegação oficial
- navegação global persistente;
- navegação contextual por módulo;
- atalhos orientados por jornada.

## 7. Navegação global
Preferencialmente:
- sidebar fixa no desktop;
- menu recolhível em telas menores.

A sidebar deve conter:
- nome/logo da plataforma;
- acesso ao início;
- agrupamento dos módulos por área;
- destaque do item ativo;
- acesso a conteúdo educacional.

## 8. Estrutura oficial das páginas
Rotas recomendadas:
- `/`
- `/diagnostico`
- `/juros`
- `/amortizacao`
- `/financiamento-imobiliario`
- `/financiamento-veiculo`
- `/emprestimo-consignado`
- `/credito-pessoal`
- `/cartao-rotativo`
- `/parcela-atraso`
- `/indicadores`
- `/investir-ou-quitar`
- `/educacao`
- `/glossario`
- `/faq`

## 9. Estrutura padrão de cada módulo
1. título e contexto;
2. área de entrada;
3. ação principal;
4. resumo principal;
5. visualização detalhada;
6. interpretação educativa;
7. aprofundamento.

### 9.1 Materialização Sprint 3 — `/amortizacao`

Na Sprint 3 / F5, a página `/amortizacao` passa a seguir a estrutura
completa de módulo: simulador PRICE/SAC/Comparar no topo e, abaixo da
área operacional, uma seção visível de aprofundamento educacional.

A seção usa:

- `data-testid="amortizacao-aprenda-mais"` para os blocos Nível 1;
- `data-testid="amortizacao-glossario"` para o glossário mínimo;
- `data-testid="amortizacao-cuidados"` para cuidados educacionais.

Esse conteúdo não substitui a interpretação do resultado retornada pela
API. Ele complementa a simulação com explicações estáticas e versionadas
sobre PRICE, SAC, comparação, glossário e limites educacionais.

### 9.2 Materialização Sprint 3.5 — Financial Cockpit

Na Sprint 3.5, a experiência dos módulos ativos passou a usar o padrão
Financial Cockpit em `/juros` e `/amortizacao`.

Esse padrão usa:

- topbar global com módulos;
- subtabs por assunto dentro do módulo;
- painel esquerdo para entradas;
- área central para KPIs, gráfico/tabela e insight;
- painel direito para conteúdo educacional contextual;
- modais para aprofundamento;
- rolagem de página evitada no desktop, com rolagem interna controlada quando
  inevitável em telas menores.

Para os módulos ainda não implementados, a navegação deve exibir estado
`Em breve` sem simular funcionalidade inexistente.

## 10. Layout oficial
### Desktop
- sidebar à esquerda;
- cabeçalho superior;
- conteúdo principal ao centro;
- área de apoio contextual opcional à direita.

### Mobile/Tablet
- menu recolhível;
- coluna única;
- cards empilhados;
- tabelas adaptadas ou com scroll horizontal controlado.

## 11. Formulários
Princípios:
- clareza;
- agrupamento lógico;
- validação amigável;
- baixa ambiguidade.

Regras:
- rótulo claro em cada campo;
- moeda em R$ quando aplicável;
- periodicidade visível em campos de taxa;
- unidade visível em prazos;
- erro próximo ao campo.

## 12. Botões e ações
Ação principal:
- Calcular / Simular / Comparar

Ações secundárias:
- Limpar
- Carregar exemplo
- Exportar
- Ver explicação
- Salvar cenário

## 13. Exibição dos resultados
Hierarquia:
1. resultado-chave;
2. comparação;
3. evidência visual;
4. evidência detalhada;
5. interpretação.

## 14. Cards-resumo
Devem mostrar:
- valor financiado;
- total pago;
- total de juros;
- parcela inicial;
- comprometimento da renda;
- diferença entre cenários;
- custo adicional.

## 15. Tabelas
- cabeçalhos claros;
- valores monetários padronizados;
- boa legibilidade;
- detalhamento, não substituição do resumo.

## 16. Gráficos
Usar para:
- evolução temporal;
- comparação entre cenários;
- composição da parcela;
- queda do saldo devedor;
- crescimento da dívida;
- impacto dos juros.

## 17. Alertas
Níveis:
- informativo
- positivo
- atenção
- risco

Cores sugeridas:
- azul
- verde
- amarelo
- vermelho

## 18. Conteúdo educativo contextual
Pode aparecer como:
- bloco abaixo do resultado;
- accordion;
- painel lateral;
- tooltip controlado;
- link para aprofundamento.

## 19. Página inicial
Deve conter:
- apresentação curta;
- propósito da plataforma;
- acesso rápido aos módulos;
- sugestão de jornada inicial.

## 20. Fluxos principais
- aprendizado inicial;
- crédito imediato;
- tomada de decisão;
- fluxo educacional.

## 21. Estados da interface
Toda tela importante deve tratar:
- estado inicial;
- carregamento;
- sucesso;
- vazio;
- erro.

## 22. Responsividade
A plataforma deve funcionar bem em:
- desktop;
- notebook;
- tablet;
- smartphone.

## 23. Acessibilidade
Requisitos mínimos:
- contraste adequado;
- rótulos claros;
- foco visível;
- sem dependência exclusiva de cor;
- hierarquia semântica de títulos.

## 24. Linguagem e microcopy
A linguagem deve ser:
- clara;
- simples;
- humana;
- respeitosa;
- didática;
- objetiva.

## 25. Sistema de componentes
Componentes mínimos recomendados:
- Header
- Sidebar
- PageContainer
- ModuleHeader
- FinancialForm
- FormSection
- SummaryCard
- ComparisonCard
- AlertBanner
- DataTable
- ComparisonChart
- FormulaExplanation
- EducationPanel
- FAQSection
- GlossaryLink
- ExportButton
- EmptyState
- ErrorState
- LoadingState
