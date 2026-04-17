# DOCUMENTO 22 — LGPD E TRATAMENTO DE DADOS

**Versão:** 1.0
**Status:** HÍBRIDO (núcleo de bases legais é estático; políticas operacionais vivas)

---

## 1. Princípios

A Plataforma Educacional Financeira é uma ferramenta **educacional**. Não é instituição financeira, não realiza operações reguladas e não substitui aconselhamento. Mesmo assim, **trata dados pessoais** quando o usuário cria conta, persiste simulações, recebe e-mail (futuro) ou utiliza qualquer recurso identificável.

A LGPD aplica-se desde o primeiro dado pessoal coletado.

## 2. Bases legais aplicáveis

| Tratamento | Base legal LGPD |
|------------|-----------------|
| Cadastro de usuário | Consentimento (Art. 7º, I) |
| Persistência de simulações | Execução de contrato com o titular (Art. 7º, V) |
| Comunicação operacional (e-mail de recuperação) | Execução de contrato (Art. 7º, V) |
| Métricas anonimizadas de uso do produto | Legítimo interesse (Art. 7º, IX) com balanceamento documentado |
| Logs técnicos com IP/identificadores temporários | Cumprimento de obrigação legal e segurança (Art. 7º, II e VI) |

## 3. Dados pessoais tratados (inventário)

| Categoria | Exemplo | Sensibilidade | Política |
|-----------|---------|---------------|---------|
| Identificação | Nome, e-mail | comum | Cripto em trânsito; hashing de senha (argon2id); exclusão sob solicitação |
| Comportamento | Simulações, módulos acessados | comum | Anonimização para métricas agregadas |
| Técnico | IP, user-agent (logs) | comum | Retenção curta (≤ 90 dias) |
| Sensíveis | **Nenhum** dado sensível é tratado | — | Proibido coletar (sem CPF detalhado de terceiros, sem dados de saúde, etc.) |

> **Não coletamos CPF**, não coletamos dados bancários reais, não acessamos contas de terceiros. Caso isso mude (Open Finance), exige rebaseline e novo ADR.

## 4. Direitos do titular (DSAR — Data Subject Access Request)

A plataforma deve oferecer mecanismos para:
1. Confirmação de existência de tratamento (Art. 18, I).
2. Acesso aos dados (Art. 18, II).
3. Correção (Art. 18, III).
4. Anonimização, bloqueio ou eliminação (Art. 18, IV).
5. Portabilidade (Art. 18, V).
6. Eliminação dos dados tratados com base em consentimento (Art. 18, VI).
7. Revogação de consentimento (Art. 8º, §5).

Implementação técnica:
- Endpoint `POST /api/v1/me/dsar` com tipos: `access`, `delete`, `correct`, `portability`.
- Atendimento em ≤ 15 dias.
- Logs de DSAR mantidos por 5 anos.

## 5. Retenção e descarte

| Categoria | Retenção |
|-----------|----------|
| Conta ativa | enquanto o usuário mantiver |
| Conta inativa > 24 meses | aviso por e-mail e exclusão |
| Logs de aplicação | 90 dias |
| Logs de auditoria de DSAR | 5 anos |
| Backups | 30 dias |
| Dados após eliminação solicitada | até 30 dias para eliminar de backups |

## 6. Segurança aplicada

- Cripto em trânsito (TLS 1.2+).
- Cripto em repouso (Postgres com TDE quando o provedor permitir; volumes cifrados).
- Hashing de senha: `argon2id` com parâmetros recomendados.
- Acesso a base por menor privilégio (roles dedicados).
- Segredos via vault (não em `.env` em produção).
- Rotação trimestral de segredos.
- Pen-test anual (futuro).

## 7. Privacy by design (no produto)

- Toda nova feature passa por **DPIA leve** (avaliação de impacto à privacidade) registrada em ADR quando coletar novo dado.
- Banner de consentimento granular (necessários, analytics, marketing).
- Cookies só `HttpOnly`, `Secure`, `SameSite=Lax`.
- Sem trackers de terceiros no fluxo educacional.

## 8. Anonimização para métricas

- Métricas de produto consomem `event_id` aleatório por sessão; sem ligação direta com `user_id`.
- Pipeline de métricas usa `k-anonimato` (k≥5) antes de exportar.

## 9. Logs e PII

- Sem PII nos logs (CPF/email mascarados; ex.: `m***@e***.com`).
- Lint customizado bloqueia PII em logs no PR.

## 10. Política para a Claude Code

1. Toda nova rota que aceite ou retorne dado pessoal exige checklist DPIA preenchido na PR.
2. Sem testes com dados reais; somente fixtures sintéticos (Doc 26).
3. Sem print/console.log de payload com PII.
4. Toda inclusão de novo dado pessoal exige atualização deste documento (apêndice vivo).

## 11. Apêndice vivo

<!-- BEGIN APÊNDICE VIVO -->
- Versão de inventário de dados em vigor: `v1`.
- Mudanças após v1 são registradas aqui.
<!-- END APÊNDICE VIVO -->
