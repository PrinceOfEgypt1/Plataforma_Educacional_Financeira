# DOCUMENTO 14 — ESPECIFICAÇÃO FÍSICA DE DADOS E PERSISTÊNCIA
## Plataforma Educacional Financeira

**Versão:** 2.0 (reescrito integralmente)
**Tipo:** Especificação Física de Dados e Persistência
**Status canônico:** VIVO

---

## 1. Finalidade
Converter a modelagem lógica (Doc 05) em especificação física para PostgreSQL: tabelas, colunas, tipos, chaves, índices, constraints, soft-delete, política de migrations (expand-and-contract), backup/restore/PITR, retenção, seeds e fixtures.

## 2. Diretrizes físicas oficiais

### 2.1 Banco de dados
- SGBD: PostgreSQL 15+.
- Charset: UTF-8.
- Timezone no banco: UTC; conversão à UI no frontend.
- Collation padrão: `pt_BR.UTF-8` para colunas textuais quando ordenação local importa.

### 2.2 Convenções de nomenclatura
- Tabelas em `snake_case` plural.
- Colunas em `snake_case`.
- PK: `id`.
- FK: `<entidade>_id`.
- Timestamps: `created_at`, `updated_at`, `deleted_at` (quando soft delete).

### 2.3 Identificadores
- UUID v7 (preferencial; ordenável temporalmente) ou v4 nas entidades principais.
- `gen_random_uuid()` (ou função equivalente para v7) como default.

### 2.4 Tipos preferenciais
- Monetário: `numeric(14,2)` ou `numeric(18,4)` quando exigir precisão maior.
- Percentual/fator: `numeric(10,8)`.
- Texto curto controlado: `varchar(N)`; texto longo: `text`.
- Bool: `boolean`.
- Datas: `timestamptz` para eventos; `date` para datas civis.
- JSON: `jsonb` (sempre `jsonb`, nunca `json`).

## 3. Extensões e pré-requisitos
```sql
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";   -- opcional
create extension if not exists "btree_gin";   -- opcional para índices auxiliares
```

## 4. Especificação física inicial das tabelas

(Mantém todas as 18 tabelas do v1.0: `users`, `user_profiles`, `module_catalog`, `simulation_types`, `simulations`, `simulation_inputs`, `simulation_results`, `saved_scenarios`, `reports`, `educational_contents`, `glossary_terms`, `faqs`, `quizzes`, `quiz_questions`, `quiz_options`, `quiz_attempts`, `quiz_answers`, `content_links` — íntegras quanto às colunas e índices listados na v1.0.)

### Aditivos v2.0

#### 4.19 Tabela `idempotency_keys`
- `key uuid primary key`
- `payload_hash varchar(64) not null`
- `route varchar(120) not null`
- `response_payload jsonb not null`
- `status_code smallint not null`
- `created_at timestamptz not null default now()`
- `expires_at timestamptz not null`
Índices: `expires_at`.

#### 4.20 Tabela `dsar_requests` (LGPD — Doc 22)
- `id uuid primary key default gen_random_uuid()`
- `user_id uuid references users(id)`
- `request_type varchar(20) not null check (request_type in ('access','delete','correct','portability'))`
- `status varchar(20) not null default 'received'`
- `requested_at timestamptz not null default now()`
- `fulfilled_at timestamptz`
- `notes text`
Índices: `user_id`, `requested_at desc`.

#### 4.21 Tabela `audit_log` (apenas eventos sensíveis)
- `id bigserial primary key`
- `actor_id uuid`
- `action varchar(80) not null`
- `entity varchar(60) not null`
- `entity_id uuid`
- `meta jsonb`
- `created_at timestamptz not null default now()`
Índices: `(actor_id, created_at desc)`, `(entity, entity_id)`.

## 5. Constraints recomendadas
Inclui as do v1.0 (`display_order >= 0`, `score in [0,100]`, `monthly_income >= 0`, `finished_at >= started_at`) e adiciona:
- `simulation_inputs.payload` requer chave `version` >= '1.0'.
- `simulation_results.summary_payload` requer chave `version`.
- `idempotency_keys.expires_at > created_at`.

## 6. Política de migrations (expand-and-contract — obrigatória)

### 6.1 Princípios
- Toda migration tem `upgrade()` **e** `downgrade()` testados.
- Mudança destrutiva é **proibida** no mesmo PR que introduz substituto.

### 6.2 Padrão de mudança em 4 PRs
1. **Expand**: adiciona coluna/tabela nova; dual-write se necessário.
2. **Backfill**: script idempotente popula dados.
3. **Read switch**: leitura passa para o novo campo.
4. **Contract**: remove o antigo após N sprints (mínimo 2).

### 6.3 Política de locking
- `ALTER TABLE ... SET NOT NULL` proibido em tabelas grandes; usar `NOT VALID` + `VALIDATE CONSTRAINT`.
- Criação de índice em produção via `CREATE INDEX CONCURRENTLY`.
- Migrations longas executadas em janela controlada com plano de rollback.

### 6.4 Ferramenta
- Alembic.
- Branch de migrations linear (sem merges complexos).
- Migration validada em CI com `migrate:dryrun` em base efêmera.

## 7. Estratégia de seed (resumo; detalhe em Doc 26)

Seeds por ambiente: `dev`, `ci`, `homolog`, `demo`. Comando: `python -m app.seeds.run --env <env>`.

Categorias mínimas:
- `module_catalog`, `simulation_types`
- glossário inicial, FAQ inicial
- indicadores iniciais
- conteúdos educativos introdutórios

## 8. Política de soft delete
Soft delete obrigatório em:
- `users`, `simulations`, `educational_contents`.

`deleted_at` define exclusão lógica. Filtros padrão excluem registros com `deleted_at not null`. Hard-delete reservado a fluxo de DSAR (Doc 22).

## 9. Política de backup, restore e PITR

| Item | Política |
|------|----------|
| Backup automático | diário em produção (snapshot do provedor) |
| WAL/PITR | habilitado em produção (RPO ≤ 5 min) |
| Retenção | snapshots 30 dias; WAL 7 dias |
| Restore drill | trimestral em ambiente isolado (RB-006) |
| RTO | ≤ 60 min em SEV1 |
| RPO | ≤ 5 min |
| Backup de homologação | semanal |
| Backup local (dev) | dump on demand |

## 10. Política de retenção (cruza com Doc 22)
| Categoria | Retenção |
|-----------|----------|
| Conta ativa | enquanto ativa |
| Conta inativa > 24m | aviso + exclusão |
| `simulations` (sem usuário) | 90 dias |
| `simulations` (com usuário) | enquanto conta ativa |
| `audit_log` | 5 anos |
| `dsar_requests` | 5 anos |
| `reports` (artefato) | 12 meses (metadado em `reports`; arquivo em storage com lifecycle) |

## 11. Segurança em repouso e em trânsito
- TLS 1.2+ em trânsito.
- Cripto em repouso: TDE no provedor quando disponível; volumes cifrados.
- Hash de senha: `argon2id` (parâmetros conforme Doc 22).
- Roles de aplicação com privilégios mínimos.
- Sem `SUPERUSER` no app role.

## 12. Política de seeds vs fixtures vs dados reais
- Seeds: dados iniciais por ambiente (sempre sintéticos).
- Fixtures: dados de teste (sintéticos).
- Dados reais: nunca em dev/CI/homolog; nunca em fixtures.

## 13. Estratégia inicial de migrações
Ordem inicial igual ao v1.0 (1..18) + as novas (19..21 — `idempotency_keys`, `dsar_requests`, `audit_log`).

## 14. Política de monitoramento de banco
- Métricas básicas: conexões ativas, tempo médio de query, locks longos, slow queries (> 1s).
- Alertas em `pg_stat_activity` quando há query > 30s.
- Auditoria mensal de índices não-utilizados.

## 15. Critérios de aceite deste documento
Aceito quando:
- backend gera migrations a partir dele;
- política expand-and-contract está clara e exequível;
- backup/restore/PITR/retenção definidos;
- soft delete e DSAR cobertos;
- novas tabelas v2.0 (`idempotency_keys`, `dsar_requests`, `audit_log`) presentes.

## 16. Política de evolução
Documento VIVO. Atualização obrigatória em:
- nova tabela/coluna/índice/constraint;
- mudança em política de retenção/backup;
- mudança em estratégia de migrations;
- mudança em política de soft delete.
