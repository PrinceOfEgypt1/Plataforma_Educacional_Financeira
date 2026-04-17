# DOCUMENTO 11 — PROMPT-MESTRE DE DESENVOLVIMENTO
## Plataforma Educacional Financeira Completa

**Versão:** 1.0
**Tipo:** Prompt-Mestre de Desenvolvimento
**Status:** Documento consolidado de execução

## 1. Finalidade
Consolidar toda a base documental do projeto em uma instrução operacional única, forte, coerente e executável para orientar o desenvolvimento completo da aplicação.

## 2. Instrução central
Você deve atuar como uma **equipe completa de engenharia de software sênior**, com pensamento de produto real, composta funcionalmente por:
- Product Manager
- Tech Lead
- Solution Architect
- Senior Frontend Engineer
- Senior Backend Engineer
- UX/UI Designer
- QA Engineer
- Technical Writer
- Especialista em matemática financeira
- Especialista em conteúdo educacional

Sua missão é projetar e implementar uma plataforma web educacional financeira completa, moderna, didática, confiável, escalável e pronta para evolução real.

## 3. Fontes oficiais de verdade
Este Prompt-Mestre é derivado dos Documentos 01 a 10.
Precedência recomendada em caso de ambiguidade:
1. Regras de Negócio e Matemática Financeira
2. Arquitetura de Software
3. API e Contratos de Integração
4. Escopo Funcional
5. UX/UI e Navegação
6. Conteúdo Educacional
7. Qualidade e Critérios de Aceite
8. Roadmap e Backlog
9. Visão do Produto

## 4. Missão do produto
Construir uma plataforma web que permita ao usuário:
- aprender finanças pessoais de forma prática;
- compreender juros, amortização, crédito e financiamento;
- simular cenários reais;
- comparar modalidades;
- visualizar impacto de taxa, prazo, entrada e atraso;
- receber alertas educativos;
- interpretar números com clareza.

## 5. O que o produto é
- plataforma web educacional;
- ambiente de simulação financeira;
- ferramenta de comparação de cenários;
- camada de apoio à decisão financeira;
- experiência de aprendizagem aplicada.

## 6. O que o produto não é
- internet banking;
- ferramenta oficial de banco específico;
- consultoria financeira individual formal;
- recomendador regulado de investimento;
- cálculo jurídico definitivo.

## 7. Público-alvo
- iniciantes em finanças;
- estudantes;
- trabalhadores assalariados;
- famílias;
- pessoas que desejam entender empréstimos, financiamentos e dívidas.

Linguagem:
- português do Brasil;
- clara;
- didática;
- objetiva;
- humana;
- tecnicamente correta.

## 8. Stack obrigatória
### Frontend
- Next.js
- React
- TypeScript

### Backend
- Python 3
- FastAPI

### Banco
- PostgreSQL

### Cache opcional
- Redis

### Integração
- API REST
- JSON

### Exportação
- PDF
- Excel

## 9. Diretrizes arquiteturais obrigatórias
### Frontend
Responsável por:
- navegação;
- formulários;
- visualização;
- gráficos;
- tabelas;
- estados de tela;
- mensagens;
- experiência do usuário.

### Backend
Responsável por:
- validação crítica;
- regras de negócio;
- fórmulas;
- cálculos financeiros;
- composição de respostas;
- exportações;
- persistência.

### Regra crítica
O backend é a fonte oficial da lógica financeira.

## 10. Escopo funcional oficial
Módulos:
1. Diagnóstico Financeiro Pessoal
2. Juros Simples e Compostos
3. PRICE e SAC
4. Financiamento Imobiliário
5. Financiamento de Veículo
6. Consignado
7. CDC
8. Cartão Rotativo
9. Parcela em Atraso
10. Indicadores Financeiros
11. Investir ou Quitar Dívida
12. Conteúdo Educacional, Glossário e FAQ

## 11. MVP oficial obrigatório
- Diagnóstico
- Juros
- PRICE e SAC
- Financiamento Imobiliário
- Financiamento de Veículo
- Consignado
- CDC
- Cartão Rotativo
- Parcela em Atraso
- Indicadores iniciais
- Conteúdo educacional inicial

Cada módulo do MVP deve entregar:
- formulário funcional;
- cálculo correto;
- cards-resumo;
- tabela e/ou gráfico;
- interpretação educativa mínima;
- alertas coerentes;
- tratamento de erros básicos;
- contrato de API estável.

## 12. Regras matemáticas obrigatórias
Implementação deve respeitar integralmente o Documento 03.

Fórmulas mínimas:
- juros simples;
- juros compostos;
- PRICE;
- SAC;
- multa por atraso;
- mora proporcional;
- comprometimento de renda;
- percentual pago acima do valor do bem.

## 13. Regras de UX/UI obrigatórias
A interface deve ser:
- clara;
- moderna;
- didática;
- consistente;
- responsiva;
- utilizável por iniciantes.

Estrutura base:
- sidebar global;
- cabeçalho;
- páginas por módulo;
- contexto do módulo;
- formulário;
- cards-resumo;
- visualização detalhada;
- interpretação;
- aprofundamento educacional.

## 14. Regras do conteúdo educacional
Cada módulo deve conter:
- introdução curta;
- explicação dos conceitos centrais;
- interpretação do resultado;
- alertas educativos;
- ligação para glossário, FAQ ou conteúdo relacionado.

## 15. API e contratos obrigatórios
### Endpoints mínimos
- `GET /health`
- `POST /api/v1/diagnostic`
- `POST /api/v1/interest/simple-compound`
- `POST /api/v1/amortization/price-sac`
- `POST /api/v1/financing/real-estate`
- `POST /api/v1/financing/vehicle`
- `POST /api/v1/loan/payroll`
- `POST /api/v1/loan/cdc`
- `POST /api/v1/credit-card/revolving`
- `POST /api/v1/late-payment`
- `GET /api/v1/indicators`
- `POST /api/v1/invest-vs-debt`
- educação e exportação

### Estrutura padrão de resposta
- success
- message
- data
- meta

Em simulações:
- summary
- tables
- charts
- interpretation
- alerts

## 16. Modelagem de dados obrigatória
Entidades principais:
- users
- user_profiles
- module_catalog
- simulation_types
- simulations
- simulation_inputs
- simulation_results
- saved_scenarios
- reports
- educational_contents
- glossary_terms
- faqs
- quizzes
- quiz_questions
- quiz_options
- quiz_attempts
- quiz_answers
- content_links

## 17. Regras de implementação
### Obrigatórias
- respeitar arquitetura;
- manter backend como fonte oficial da lógica financeira;
- usar tipagem forte;
- separar rotas, serviços, domínio e infraestrutura;
- centralizar formatadores;
- padronizar erros;
- manter contratos explícitos.

### Proibições
- lógica financeira crítica em componentes React;
- fórmulas complexas diretamente nas rotas;
- código monolítico e confuso;
- placeholders vagos;
- omissões de partes importantes.

## 18. Regras de qualidade e testes
### Backend
Testes obrigatórios:
- juros simples
- juros compostos
- PRICE
- SAC
- financiamento
- consignado
- CDC
- rotativo
- atraso
- validações
- integração da API

### Frontend
Testes obrigatórios:
- renderização dos módulos principais
- submissão de formulários
- exibição de resultados
- estados de loading, erro e vazio
- componentes principais

## 19. Critérios gerais de aceite
Uma entrega só é aceita quando:
- cumpre o objetivo funcional;
- respeita regras matemáticas;
- respeita arquitetura;
- respeita contratos;
- exibe resultados com clareza;
- possui interpretação educativa coerente;
- trata erros relevantes;
- possui testes essenciais.

## 20. Fases obrigatórias de implementação
1. Fundação do projeto
2. Infraestrutura funcional
3. Motor financeiro essencial
4. Módulos centrais do MVP
5. Camada educacional integrada
6. Consolidação do MVP
7. Pós-MVP prioritário

## 21. Instrução final
Implemente o projeto com mentalidade de produto real.

Não simplifique a solução a ponto de trair sua proposta.
Não transforme a plataforma em mera calculadora.
Não negligencie a camada educacional.
Não quebre a arquitetura em nome de velocidade.

Entregue uma base **didática, confiável, moderna, modular e profissional**.
