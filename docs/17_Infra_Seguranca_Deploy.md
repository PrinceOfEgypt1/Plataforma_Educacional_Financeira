# DOCUMENTO 17 — INFRAESTRUTURA, SEGURANÇA, COMPLIANCE E DEPLOY
## Plataforma Educacional Financeira

**Versão:** 2.0 (reescrito integralmente)
**Tipo:** Infraestrutura, Segurança, Compliance e Deploy
**Status canônico:** VIVO

---

## 1. Finalidade
Definir ambientes, IaC, deploy, segurança aplicada (threat model, gestão de segredos, headers, response a incidente), observabilidade operacional, backup/continuidade e compliance regulatório educacional. Cobre as lacunas L-19 e L-31 da Matriz de Lacunas.

## 2. Ambientes oficiais
| Ambiente | Uso | Dados |
|----------|-----|-------|
| `dev` | local (desenvolvedor/IA) | sintéticos (seeds dev) |
| `ci` | pipelines | sintéticos (seeds ci) |
| `homolog` | testes integrados, validação | sintéticos (seeds homolog) |
| `demo` | apresentação/comercial | curados (seeds demo) |
| `prod` | produção | reais |

Promotion: `ci → homolog → prod`. `demo` paralelo. Sem promoção direta `ci → prod`.

## 3. IaC (Infraestrutura como Código) — política
- Toda infra de homolog/prod é descrita em IaC.
- Stack inicial recomendada: **Terraform** (cloud) + **Helm** (k8s, se for o caso) ou **docker-compose** em VPS pequena no MVP.
- Repositório de IaC: `infra/` no monorepo (ou repo dedicado).
- Mudança em IaC segue mesmo fluxo de PR + revisão + impact agent.
- Estado do Terraform em backend remoto (S3 + DynamoDB lock, ou equivalente).

## 4. Estrutura de execução

### 4.1 Frontend
- Build: `pnpm build` (Next.js).
- Execução: container Node 20+ slim; modo standalone do Next.
- Variáveis públicas: prefixo `NEXT_PUBLIC_`.
- CDN para assets estáticos em produção.

### 4.2 Backend
- Execução: Uvicorn + Gunicorn (workers `2 * CPU + 1`).
- Migrações executadas no deploy via job dedicado (não no boot do app).
- Healthchecks: `/health/live` (liveness), `/health/ready` (readiness).

### 4.3 Banco
- Postgres gerenciado em prod (RDS/Cloud SQL/Neon/Supabase).
- Connection pool: PgBouncer (transaction mode) quando aplicável.
- Backups e PITR conforme Doc 14 §9.

### 4.4 Cache
- Redis 7+ opcional. Ativado por flag `REDIS_URL` populada.
- Sem dependência hard no MVP.

### 4.5 Storage de arquivos
- Dev: filesystem local.
- Homolog/prod: object storage (S3/GCS/MinIO).
- Lifecycle: PDFs/Excel expirados automaticamente conforme Doc 14 §10.

## 5. Containers
Arquivos:
- `docker/frontend.Dockerfile` (multi-stage; `node:20-alpine` build → `node:20-alpine` runtime; usuário não-root).
- `docker/backend.Dockerfile` (multi-stage; `python:3.11-slim`; usuário não-root; `pip --no-cache-dir`).
- `docker/docker-compose.yml` (dev: frontend, backend, db, redis opcional, mailhog futuro).
- `docker/docker-compose.ci.yml` (CI: db efêmero).

Imagem rotulada com `git_sha`, `build_date`, `version`. SBOM gerado (Syft) e assinatura (Cosign) recomendadas.

## 6. Variáveis de ambiente

### 6.1 Frontend
- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_ENV`
- `NEXT_PUBLIC_SENTRY_DSN` (opcional)

### 6.2 Backend
- `APP_ENV` (`dev|ci|homolog|prod`)
- `APP_DEBUG` (`true|false`)
- `APP_SECRET_KEY`
- `DATABASE_URL`
- `REDIS_URL` (opcional)
- `ALLOWED_ORIGINS`
- `LOG_LEVEL`
- `RATE_LIMIT_DEFAULT`
- `IDEMPOTENCY_TTL_SECONDS`
- `STORAGE_BUCKET`
- `SENTRY_DSN` (opcional)
- `OTEL_EXPORTER_OTLP_ENDPOINT` (futuro)

### 6.3 Política de segredos
- Dev: `.env` + `.env.example` versionado **sem** segredos.
- Homolog/prod: vault (Vault, AWS Secrets Manager, Doppler, etc.).
- Pre-commit `gitleaks` + `detect-secrets`.
- Rotação trimestral.
- Principle of least privilege para cada credencial.

## 7. Segurança aplicada — Threat Model (STRIDE)

### 7.1 Spoofing
- Autenticação via senha (argon2id) + sessão segura (cookie HttpOnly/Secure/SameSite=Lax) ou JWT com rotação.
- Sem confiar em `X-Forwarded-User` sem validação.

### 7.2 Tampering
- Validação rigorosa de payload (Pydantic + validators de domínio).
- Idempotência (Doc 06 §9).
- Integridade de migrations e seeds (sem mutação não auditada).

### 7.3 Repudiation
- `audit_log` (Doc 14 §4.21) em ações sensíveis (DSAR, alteração de conta).
- Logs com `correlation_id`.

### 7.4 Information Disclosure
- Sem stack-trace no cliente.
- Sem PII em logs (mascaramento).
- Headers `X-Powered-By` removidos.
- Mensagens de erro humanas, sem detalhe sensível.

### 7.5 Denial of Service
- Rate-limit (Doc 06 §10).
- Body limit (1MB padrão).
- Timeout de servidor (Doc 06 §11).
- WAF/CDN em produção.

### 7.6 Elevation of Privilege
- Roles de DB com privilégios mínimos.
- Endpoints administrativos (futuro) protegidos por escopo.
- Sem código `eval`/`exec` dinâmico.

### 7.7 Mitigações transversais
- Headers de segurança (Doc 06 §14).
- CSP estrito; ajuste por ambiente.
- Cookies seguros.
- HTTPS obrigatório em hml/prod (HSTS preload).

## 8. SAST, DAST, Dependency

| Categoria | Ferramenta | Quando |
|-----------|-----------|--------|
| SAST BE | bandit, semgrep | PR (bloqueante para `high`/`critical`) |
| SAST FE | eslint-plugin-security, semgrep | PR |
| Dependency BE | pip-audit, safety | PR (informativo + abre issue automática) |
| Dependency FE | npm audit, osv-scanner | PR |
| DAST | OWASP ZAP baseline | semanal contra hml |
| Container scan | Trivy/Grype | PR e em build de release |
| IaC scan | tfsec, Checkov | PR em `infra/` |
| Secret scan | gitleaks/detect-secrets | pre-commit + PR |

## 9. Política de autenticação e autorização (futuro Fase B)
- Senha: argon2id com `time_cost=3, memory_cost=64MB, parallelism=4` (parâmetros revisáveis em ADR).
- Sessão preferencial; JWT permitido com rotação curta + refresh seguro.
- E-mail único; verificação por link.
- Reset de senha por link com expiração curta (15 min).
- 2FA opcional (TOTP) — Fase futura.
- Roles iniciais: `user`, `admin` (interno).
- Endpoint `/api/v1/me/*` requer sessão.

## 10. Observabilidade operacional (resumo; detalhe em Doc 23)
- Logs JSON estruturados (structlog).
- Métricas Prometheus em `/metrics`.
- Health: `/health/live`, `/health/ready`, `/health/live`.
- Erros: Sentry (ou equivalente) com mascaramento de PII.
- Tracing OTel (futuro).

## 11. Backup, restore, continuidade
Detalhe em Doc 14 §9. Resumo:
- backup diário + WAL/PITR;
- restore drill trimestral;
- RPO ≤ 5 min; RTO ≤ 60 min em SEV1.

## 12. Resposta a incidente (resumo; detalhe em Doc 24)
- Severidades SEV1..SEV4.
- War room imediata em SEV1/2.
- Post-mortem público interno em ≤ 48h.
- Cada post-mortem gera 1 ação de prevenção + 1 teste de regressão + 1 atualização de runbook.
- Comunicação a stakeholders por canal definido.

## 13. CI/CD (resumo; detalhe em `governanca_qualidade/PIPELINE_E_QUALITY_GATES.md`)
Pipeline mínima:
1. lint, format, typecheck, secret scan, SAST.
2. testes unit/integ/contract.
3. testes regressão (matemática, pedagógica, visual, contrato).
4. cobertura por área (gates).
5. build (FE+BE) + migrate dryrun.
6. agente de impacto.
7. deploy hml (auto se PR aprovado e na main).
8. smoke hml.
9. deploy prod (manual).
10. smoke prod + janela de observação.

## 14. Compliance regulatório educacional (resumo; detalhe em Doc 18)
Aplicação imediata:
- aviso persistente "produto educacional, não consultoria";
- não prometer recomendação formal;
- não apresentar simulação como proposta vinculante de crédito;
- exibir fonte e data-base ao usar Selic, TR, IPCA, taxas médias;
- separar visualmente juros, tarifas, tributos, seguros, encargos.

## 15. Compliance LGPD (resumo; detalhe em Doc 22)
- Inventário de dados pessoais.
- Bases legais documentadas.
- DSAR em 15 dias.
- Sem dados sensíveis coletados no MVP.
- Logs sem PII.

## 16. Critérios de aceite deste documento
Aceito quando:
- ambientes, IaC, containers, variáveis estão definidos;
- threat model STRIDE coberto;
- SAST/DAST/dependency/secret/container/IaC scans definidos com gates;
- política de segredos e rotação clara;
- backup/restore/PITR/retenção referenciados;
- response a incidente referenciado;
- compliance educacional e LGPD referenciados.

## 17. Política de evolução
Documento VIVO. Atualização obrigatória em:
- nova ferramenta de segurança;
- mudança em ambiente/infra;
- mudança em política de segredos;
- novo cabeçalho/policy de segurança;
- novo plano de incidente.
