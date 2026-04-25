#!/usr/bin/env bash
# ============================================================================
# pipeline.sh — Pipeline Oficial de Qualidade (PEF)
# ============================================================================
# Fatia F5-E02 (OFF-REPO). Corrige a F5-E01, que permitia SKIP de backend ou
# frontend em modo padrão e ainda assim imprimia "PIPELINE VERDE".
#
# Regras centrais:
#   * Modo padrão  : backend + frontend OBRIGATÓRIOS. Pré-requisito ausente
#                    ou ferramenta faltando => PIPELINE FALHOU. Não há SKIP.
#   * Modo --full  : roda o padrão por completo e, além dele, gates extras.
#                    Apenas uma lista curta e explícita de gates opcionais
#                    pode receber SKIP (e somente em --full).
#   * Bandit       : é gate obrigatório do modo padrão (backend).
#   * Saída        : códigos distintos — 0 verde, 1 falhou, 2 uso/help.
#
# Compatível com: bash 4+ (Linux/macOS/WSL/sandbox). Não usa bashismos raros.
# shellcheck shell=bash
# ============================================================================

set -euo pipefail

# ---------------------------------------------------------------------------
# 1. Constantes e utilidades
# ---------------------------------------------------------------------------

SCRIPT_NAME="$(basename "$0")"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
BACKEND_DIR="${REPO_ROOT}/backend"
FRONTEND_DIR="${REPO_ROOT}/frontend"
VERSION="F5-E02"

# Cores ANSI (desabilitadas automaticamente se stdout não é tty).
if [ -t 1 ]; then
  C_RESET=$'\033[0m'
  C_RED=$'\033[31m'
  C_GREEN=$'\033[32m'
  C_YELLOW=$'\033[33m'
  C_BLUE=$'\033[34m'
  C_BOLD=$'\033[1m'
else
  C_RESET=""; C_RED=""; C_GREEN=""; C_YELLOW=""; C_BLUE=""; C_BOLD=""
fi

MODE="standard"     # standard | full
FAILED=0            # 0=verde até agora, 1=já falhou (em modo de coleta)
ABORT_ON_FAIL=1     # sempre 1 para gates obrigatórios; 0 para opcionais em --full
BACKEND_PY=""       # caminho absoluto para o python do venv (backend)
PNPM_BIN=""         # caminho absoluto para pnpm

log_info()   { printf "%s[INFO]%s %s\n"  "${C_BLUE}"   "${C_RESET}" "$*"; }
log_ok()     { printf "%s[ OK ]%s %s\n"  "${C_GREEN}"  "${C_RESET}" "$*"; }
log_warn()   { printf "%s[WARN]%s %s\n"  "${C_YELLOW}" "${C_RESET}" "$*"; }
log_err()    { printf "%s[FAIL]%s %s\n"  "${C_RED}"    "${C_RESET}" "$*" >&2; }
log_skip()   { printf "%s[SKIP]%s %s\n"  "${C_YELLOW}" "${C_RESET}" "$*"; }
log_section(){ printf "\n%s%s=== %s ===%s\n" "${C_BOLD}" "${C_BLUE}" "$*" "${C_RESET}"; }

die() {
  local step="$1"; shift
  local reason="$*"
  printf "\n%s%s=== PIPELINE FALHOU ===%s\n" "${C_BOLD}" "${C_RED}" "${C_RESET}" >&2
  printf "%sEtapa:%s %s\n"  "${C_BOLD}" "${C_RESET}" "${step}"   >&2
  printf "%sMotivo:%s %s\n" "${C_BOLD}" "${C_RESET}" "${reason}" >&2
  exit 1
}

usage() {
  cat <<EOF
${SCRIPT_NAME} — Pipeline Oficial de Qualidade (PEF) — ${VERSION}

USO:
  ${SCRIPT_NAME}              # modo padrão (rápido, obrigatório antes do push)
  ${SCRIPT_NAME} --full       # modo completo (gates extras, pré-PR)
  ${SCRIPT_NAME} --help       # exibe esta ajuda

MODO PADRÃO (obrigatório):
  Backend  : ruff check, ruff format --check, mypy app/,
             bandit -r app/ -c pyproject.toml, pytest tests/unit -m unit
  Frontend : install --frozen-lockfile, lint, format:check, typecheck,
             test -- --run, build

  Pré-requisitos ausentes (venv, python, pnpm, node, ferramentas) =>
  PIPELINE FALHOU. Não há SKIP em modo padrão.

MODO --full (padrão + extras):
  Backend  : + detect-secrets* + pytest integration* + pytest contract* +
             pytest regression*
  Frontend : + test:coverage (obrigatório) + test:e2e:smoke* + test:a11y*
  (* = gates opcionais em --full; podem receber SKIP com justificativa
       explícita quando a dependência externa não existe.)

CÓDIGOS DE SAÍDA:
  0  PIPELINE VERDE
  1  PIPELINE FALHOU
  2  Uso inválido / ajuda
EOF
}

# ---------------------------------------------------------------------------
# 2. Parser de argumentos
# ---------------------------------------------------------------------------
parse_args() {
  while [ $# -gt 0 ]; do
    case "$1" in
      --full|-f|--Full)    MODE="full" ;;
      -h|--help)           usage; exit 2 ;;
      *) log_err "Argumento desconhecido: $1"; usage; exit 2 ;;
    esac
    shift
  done
}

# ---------------------------------------------------------------------------
# 3. Detecção (não é SKIP, apenas localiza ferramentas)
# ---------------------------------------------------------------------------
detect_backend_python() {
  local candidate="${BACKEND_DIR}/.venv/bin/python"
  if [ -x "${candidate}" ]; then
    BACKEND_PY="${candidate}"
    return 0
  fi
  # Windows-layout venv dentro de WSL/sandbox (defensivo).
  candidate="${BACKEND_DIR}/.venv/Scripts/python.exe"
  if [ -x "${candidate}" ]; then
    BACKEND_PY="${candidate}"
    return 0
  fi
  BACKEND_PY=""
  return 1
}

detect_pnpm() {
  # Preferência: pnpm direto no PATH.
  if command -v pnpm >/dev/null 2>&1; then
    PNPM_BIN="$(command -v pnpm)"
    return 0
  fi
  # Fallback: corepack pnpm.
  if command -v corepack >/dev/null 2>&1; then
    if corepack pnpm --version >/dev/null 2>&1; then
      PNPM_BIN="corepack pnpm"
      return 0
    fi
  fi
  PNPM_BIN=""
  return 1
}

# ---------------------------------------------------------------------------
# 4. Pré-requisitos (abortam em falha — sem SKIP)
# ---------------------------------------------------------------------------
ensure_backend_prerequisites() {
  log_section "Pré-requisito Backend"
  if [ ! -d "${BACKEND_DIR}" ]; then
    die "Pré-requisito Backend" "${BACKEND_DIR} não existe. Este repositório requer backend/."
  fi
  if ! detect_backend_python; then
    die "Pré-requisito Backend" "backend/.venv não encontrado. Crie com: uv venv .venv && uv pip install -e \".[dev]\" (ou equivalente pip)."
  fi
  log_info "Python do venv: ${BACKEND_PY}"

  # Todas as ferramentas do modo padrão devem responder a --version.
  local tool
  for tool in ruff mypy bandit pytest; do
    if ! "${BACKEND_PY}" -m "${tool}" --version >/dev/null 2>&1; then
      die "Pré-requisito Backend — ${tool}" "${BACKEND_PY} -m ${tool} --version falhou. Instale dependências de dev do backend."
    fi
    log_ok "Ferramenta disponível: ${tool}"
  done
}

ensure_frontend_prerequisites() {
  log_section "Pré-requisito Frontend"
  if [ ! -d "${FRONTEND_DIR}" ]; then
    die "Pré-requisito Frontend" "${FRONTEND_DIR} não existe. Este repositório requer frontend/."
  fi
  if ! command -v node >/dev/null 2>&1; then
    die "Pré-requisito Frontend" "Node não encontrado no PATH. Requer Node >= 20."
  fi
  log_info "Node: $(node --version)"
  if ! detect_pnpm; then
    die "Pré-requisito Frontend" "pnpm não encontrado (nem direto, nem via corepack). Rode: corepack enable"
  fi
  log_info "pnpm: ${PNPM_BIN}"
}

# ---------------------------------------------------------------------------
# 5. Runners de comando
# ---------------------------------------------------------------------------
# run_required STEP-NAME  CMD...
#   Executa CMD. Em falha => die. Usado por gates obrigatórios (padrão + full).
run_required() {
  local step="$1"; shift
  log_info "\$ $*"
  if ! ( "$@" ); then
    die "${step}" "Comando falhou: $*"
  fi
  log_ok "${step}"
}

# run_required_in DIR  STEP-NAME  CMD...
run_required_in() {
  local dir="$1"; shift
  local step="$1"; shift
  log_info "[cwd=${dir}] \$ $*"
  if ! ( cd "${dir}" && "$@" ); then
    die "${step}" "Comando falhou em ${dir}: $*"
  fi
  log_ok "${step}"
}

# run_optional_in DIR  STEP-NAME  REASON-IF-MISSING  CHECK-CMD  --  RUN-CMD...
# Usado somente por gates opcionais do modo --full. Se CHECK-CMD falhar
# (dependência ausente), emite SKIP explícito e segue. Se CHECK-CMD passar
# mas RUN-CMD falhar, die — não existe verde silencioso.
run_optional_in() {
  local dir="$1"; shift
  local step="$1"; shift
  local reason="$1"; shift
  # Separador '--' divide CHECK-CMD de RUN-CMD.
  local -a check_cmd=()
  while [ $# -gt 0 ] && [ "$1" != "--" ]; do
    check_cmd+=("$1"); shift
  done
  if [ $# -eq 0 ] || [ "$1" != "--" ]; then
    die "${step} (interno)" "run_optional_in chamado sem separador '--'."
  fi
  shift  # descarta '--'

  if ! ( cd "${dir}" && "${check_cmd[@]}" >/dev/null 2>&1 ); then
    log_skip "${step} — ${reason}"
    return 0
  fi

  log_info "[cwd=${dir}] \$ $*"
  if ! ( cd "${dir}" && "$@" ); then
    die "${step}" "Comando opcional com dependência presente falhou: $*"
  fi
  log_ok "${step}"
}

# ---------------------------------------------------------------------------
# 6. Backend — modo padrão (5 gates, todos obrigatórios)
# ---------------------------------------------------------------------------
backend_standard() {
  log_section "Backend — modo padrão"
  # ruff check
  run_required_in "${BACKEND_DIR}" "backend.ruff_check" \
    "${BACKEND_PY}" -m ruff check .
  # ruff format --check
  run_required_in "${BACKEND_DIR}" "backend.ruff_format_check" \
    "${BACKEND_PY}" -m ruff format --check .
  # mypy app/
  run_required_in "${BACKEND_DIR}" "backend.mypy_app" \
    "${BACKEND_PY}" -m mypy app/
  # bandit (PROMOVIDO para padrão por F5-E02)
  run_required_in "${BACKEND_DIR}" "backend.bandit" \
    "${BACKEND_PY}" -m bandit -r app/ -c pyproject.toml
  # pytest tests/unit -m unit
  run_required_in "${BACKEND_DIR}" "backend.pytest_unit" \
    "${BACKEND_PY}" -m pytest tests/unit -m unit
}

# ---------------------------------------------------------------------------
# 7. Backend — extras de --full (opcionais SKIPáveis)
# ---------------------------------------------------------------------------
backend_full_extras() {
  log_section "Backend — extras do modo --full"

  # detect-secrets (opcional: ferramenta pode não estar instalada).
  run_optional_in "${BACKEND_DIR}" "backend.detect_secrets" \
    "detect-secrets não instalado no venv" \
    "${BACKEND_PY}" -m pip show detect-secrets \
    -- \
    "${BACKEND_PY}" -m detect_secrets scan --baseline .secrets.baseline

  # pytest integration (opcional: depende de Postgres/serviços externos).
  run_optional_in "${BACKEND_DIR}" "backend.pytest_integration" \
    "tests/integration ausente ou sem marker 'integration'" \
    test -d tests/integration \
    -- \
    "${BACKEND_PY}" -m pytest tests/integration -m integration

  # pytest contract (opcional: pasta pode não existir ainda).
  run_optional_in "${BACKEND_DIR}" "backend.pytest_contract" \
    "tests/contract ausente" \
    test -d tests/contract \
    -- \
    "${BACKEND_PY}" -m pytest tests/contract -m contract

  # pytest regression (opcional: pasta pode não existir ainda).
  run_optional_in "${BACKEND_DIR}" "backend.pytest_regression" \
    "tests/regression ausente" \
    test -d tests/regression \
    -- \
    "${BACKEND_PY}" -m pytest tests/regression -m regression
}

# ---------------------------------------------------------------------------
# 8. Frontend — modo padrão (6 gates, todos obrigatórios)
# ---------------------------------------------------------------------------
# shellcheck disable=SC2086
frontend_standard() {
  log_section "Frontend — modo padrão"
  # Separa PNPM_BIN caso seja "corepack pnpm" (2 tokens).
  # Note o uso intencional de $PNPM_BIN sem aspas para honrar esse split.
  run_required_in "${FRONTEND_DIR}" "frontend.install" \
    sh -c "${PNPM_BIN} install --frozen-lockfile"
  run_required_in "${FRONTEND_DIR}" "frontend.lint" \
    sh -c "${PNPM_BIN} lint"
  run_required_in "${FRONTEND_DIR}" "frontend.format_check" \
    sh -c "${PNPM_BIN} format:check"
  run_required_in "${FRONTEND_DIR}" "frontend.typecheck" \
    sh -c "${PNPM_BIN} typecheck"
  run_required_in "${FRONTEND_DIR}" "frontend.test" \
    sh -c "${PNPM_BIN} test -- --run"
  run_required_in "${FRONTEND_DIR}" "frontend.build" \
    sh -c "${PNPM_BIN} build"
}

# ---------------------------------------------------------------------------
# 9. Frontend — extras de --full
# ---------------------------------------------------------------------------
frontend_full_extras() {
  log_section "Frontend — extras do modo --full"

  # test:coverage é OBRIGATÓRIO em --full, não opcional.
  run_required_in "${FRONTEND_DIR}" "frontend.test_coverage" \
    sh -c "${PNPM_BIN} test:coverage"

  # e2e:smoke — opcional: depende de Playwright + browsers instalados.
  run_optional_in "${FRONTEND_DIR}" "frontend.e2e_smoke" \
    "Playwright/browsers não instalados (script test:e2e:smoke ausente ou ambiente sem browsers)" \
    sh -c "${PNPM_BIN} run --silent -- --if-present test:e2e:smoke --help || ${PNPM_BIN} run --silent test:e2e:smoke --help" \
    -- \
    sh -c "${PNPM_BIN} test:e2e:smoke"

  # a11y — opcional.
  run_optional_in "${FRONTEND_DIR}" "frontend.a11y" \
    "Script test:a11y ausente ou tooling de acessibilidade não instalado" \
    sh -c "${PNPM_BIN} run --silent -- --if-present test:a11y --help || ${PNPM_BIN} run --silent test:a11y --help" \
    -- \
    sh -c "${PNPM_BIN} test:a11y"
}

# ---------------------------------------------------------------------------
# 10. Main
# ---------------------------------------------------------------------------
main() {
  parse_args "$@"

  log_section "Pipeline Oficial de Qualidade (${VERSION}) — modo: ${MODE}"
  log_info "Repositório: ${REPO_ROOT}"

  # Pré-requisitos sempre. Modo padrão e --full exigem ambos os domínios.
  ensure_backend_prerequisites
  ensure_frontend_prerequisites

  backend_standard
  frontend_standard

  if [ "${MODE}" = "full" ]; then
    backend_full_extras
    frontend_full_extras
  fi

  printf "\n%s%s=== PIPELINE VERDE ===%s\n" "${C_BOLD}" "${C_GREEN}" "${C_RESET}"
  log_info "Modo: ${MODE}"
  log_info "Todos os gates obrigatórios passaram."
  if [ "${MODE}" = "full" ]; then
    log_info "Gates opcionais de --full: executados ou marcados [SKIP] explicitamente."
  fi
  exit 0
}

main "$@"
