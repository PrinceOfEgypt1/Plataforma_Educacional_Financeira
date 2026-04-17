# DOCUMENTO 05 — MODELAGEM DE DADOS
## Plataforma Educacional Financeira Completa

**Versão:** 1.0
**Tipo:** Modelagem de Dados
**Status:** Base oficial de modelagem lógica de dados

## 1. Finalidade
Definir a estrutura lógica dos dados da plataforma, suas entidades, atributos, relacionamentos, regras de integridade e diretrizes de persistência.

## 2. Papel da modelagem
A modelagem deve dar suporte a quatro dimensões:
- identidade;
- simulação;
- conteúdo educacional;
- governança operacional.

## 3. Tecnologia oficial
**PostgreSQL**

## 4. Princípios de modelagem
- clareza semântica;
- integridade;
- evolução controlada;
- separação de contextos;
- auditabilidade;
- equilíbrio entre normalização e praticidade.

## 5. Macrodomínios de dados
1. usuários e perfil
2. simulações financeiras
3. conteúdo educacional
4. avaliação e aprendizagem
5. relatórios e exportações

## 6. Entidades principais
1. `users`
2. `user_profiles`
3. `module_catalog`
4. `simulation_types`
5. `simulations`
6. `simulation_inputs`
7. `simulation_results`
8. `saved_scenarios`
9. `reports`
10. `educational_contents`
11. `glossary_terms`
12. `faqs`
13. `quizzes`
14. `quiz_questions`
15. `quiz_options`
16. `quiz_attempts`
17. `quiz_answers`
18. `content_links`

## 7. Entidades e propósitos

### `users`
Representa a identidade principal do usuário.
Campos sugeridos:
- id
- full_name
- email
- password_hash ou identificador externo
- is_active
- is_verified
- created_at
- updated_at

### `user_profiles`
Armazena dados complementares:
- user_id
- monthly_income
- financial_goal
- preferred_language
- preferred_currency
- education_level
- created_at
- updated_at

### `module_catalog`
Catálogo dos módulos funcionais.
Campos:
- code
- name
- slug
- description
- is_active
- display_order

### `simulation_types`
Define tipos de simulação disponíveis.
Campos:
- module_id
- code
- name
- description
- is_active

### `simulations`
Representa uma execução de simulação.
Campos:
- user_id opcional
- simulation_type_id
- title opcional
- status
- executed_at
- created_at
- updated_at

### `simulation_inputs`
Persistência das entradas da simulação.
Campos:
- simulation_id
- payload
- input_version
- created_at
- updated_at

### `simulation_results`
Persistência dos resultados.
Campos:
- simulation_id
- summary_payload
- table_payload
- chart_payload
- result_version
- created_at
- updated_at

### `saved_scenarios`
Cenários salvos pelo usuário.
Campos:
- user_id
- simulation_id
- name
- description
- is_favorite

### `reports`
Relatórios gerados.
Campos:
- user_id opcional
- simulation_id opcional
- report_type
- file_format
- title
- storage_path
- generated_at

### `educational_contents`
Conteúdos educativos estruturados.
Campos:
- module_id opcional
- content_type
- title
- slug
- summary
- body
- difficulty_level
- is_published
- display_order

### `glossary_terms`
Glossário financeiro.
Campos:
- term
- slug
- definition
- example
- related_module_id opcional

### `faqs`
Perguntas frequentes.
Campos:
- module_id opcional
- question
- answer
- display_order
- is_published

### `quizzes`
Quizzes educativos.
Campos:
- module_id opcional
- title
- description
- difficulty_level
- is_published

### `quiz_questions`
Perguntas do quiz.
Campos:
- quiz_id
- question_text
- question_type
- explanation
- display_order

### `quiz_options`
Alternativas da pergunta.
Campos:
- question_id
- option_text
- is_correct
- display_order

### `quiz_attempts`
Tentativas de quiz.
Campos:
- quiz_id
- user_id
- score
- started_at
- finished_at

### `quiz_answers`
Respostas dadas em uma tentativa.
Campos:
- attempt_id
- question_id
- selected_option_id
- is_correct
- answered_at

### `content_links`
Relaciona conteúdos, glossário, FAQ e módulos.
Campos:
- source_type
- source_id
- target_type
- target_id
- relation_type

## 8. Relações principais
- users 1:1 user_profiles
- users 1:N simulations
- users 1:N saved_scenarios
- users 1:N reports
- users 1:N quiz_attempts
- module_catalog 1:N simulation_types
- module_catalog 1:N educational_contents
- module_catalog 1:N faqs
- module_catalog 1:N quizzes
- simulation_types 1:N simulations
- simulations 1:1 simulation_inputs
- simulations 1:1 simulation_results
- quizzes 1:N quiz_questions
- quiz_questions 1:N quiz_options
- quizzes 1:N quiz_attempts
- quiz_attempts 1:N quiz_answers

## 9. Estratégia híbrida relacional + payload estruturado
Dados adequados a modelagem relacional clássica:
- usuários;
- perfis;
- módulos;
- quizzes;
- perguntas;
- alternativas;
- relatórios;
- glossário;
- FAQs.

Dados adequados a estrutura semiestruturada:
- entradas de simulação;
- resultados de simulação;
- tabelas dinâmicas;
- séries de gráfico.

## 10. Regras de integridade
- `users.email` único quando presente;
- `module_catalog.code` único;
- `simulation_types.code` único;
- `educational_contents.slug` único;
- `glossary_terms.slug` único;
- não existir perfil sem usuário;
- não existir simulação sem tipo válido;
- não existir questão sem quiz;
- não existir alternativa sem questão.

## 11. Identificadores
Recomendação: **UUID** para entidades principais.

## 12. Auditoria
Campos mínimos recomendados:
- created_at
- updated_at

Entidades críticas podem evoluir para:
- created_by
- updated_by
- deleted_at (soft delete)
- status

## 13. Escopo de dados do MVP
### Núcleo mínimo recomendado
- module_catalog
- simulation_types
- simulations
- simulation_inputs
- simulation_results
- educational_contents
- glossary_terms
- faqs

### Núcleo desejável logo após o MVP
- users
- user_profiles
- reports
- quizzes
- quiz_questions
- quiz_options
