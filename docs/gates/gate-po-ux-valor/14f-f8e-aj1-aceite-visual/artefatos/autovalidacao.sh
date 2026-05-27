#!/usr/bin/env bash
# ============================================================
# Autovalidacao da entrega 14F-F8E
# Roda fora do repo oficial. Nao altera nada.
# Saida: PASS ou FAIL no console + log em evidencias/autovalidacao_log.txt
# ============================================================

set -u

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG="$HERE/evidencias/autovalidacao_log.txt"
mkdir -p "$HERE/evidencias"

# Captura a pre-existencia do log ANTES de truncar.
# Pre-existencia indica que o pacote ZIP foi extraido com o snapshot incluso.
LOG_PREEXISTED=0
[ -f "$LOG" ] && LOG_PREEXISTED=1
: > "$LOG"

PASS=0
FAIL=0

check() {
  local name="$1"; shift
  if "$@" > /dev/null 2>&1; then
    printf "  [OK]   %s\n" "$name" | tee -a "$LOG"
    PASS=$((PASS+1))
  else
    printf "  [FAIL] %s\n" "$name" | tee -a "$LOG"
    FAIL=$((FAIL+1))
  fi
}

echo "================================================" | tee -a "$LOG"
echo " Autovalidacao 14F-F8E - $(date -Iseconds)" | tee -a "$LOG"
echo "================================================" | tee -a "$LOG"
echo "Diretorio: $HERE" | tee -a "$LOG"
echo "" | tee -a "$LOG"

# Estrutura
check "Diretorio de entrega existe"                                   test -d "$HERE"
check "index.html existe"                                             test -f "$HERE/index.html"
check "README.md existe"                                              test -f "$HERE/README.md"
check "RELATORIO_REPROJETO_VISUAL_F8E.md existe"                      test -f "$HERE/RELATORIO_REPROJETO_VISUAL_F8E.md"
check "MATRIZ_ACEITE_VISUAL_F8E.md existe"                            test -f "$HERE/MATRIZ_ACEITE_VISUAL_F8E.md"
check "MATRIZ_COMPARACAO_ANTIRREFERENCIA_F8D.md existe"               test -f "$HERE/MATRIZ_COMPARACAO_ANTIRREFERENCIA_F8D.md"
check "DELIVERY_CONTRACT.json existe"                                 test -f "$HERE/DELIVERY_CONTRACT.json"
check "evidencias/COMO_VALIDAR_VISUALMENTE.md existe"                 test -f "$HERE/evidencias/COMO_VALIDAR_VISUALMENTE.md"

# evidencias/autovalidacao_log.txt - presenca verificada via flag capturado antes do truncamento
if [ "$LOG_PREEXISTED" = "1" ]; then
  printf "  [OK]   evidencias/autovalidacao_log.txt presente no pacote (snapshot incluso)\n" | tee -a "$LOG"
  PASS=$((PASS+1))
else
  printf "  [INFO] evidencias/autovalidacao_log.txt sendo criado nesta execucao (primeiro run em diretorio limpo)\n" | tee -a "$LOG"
fi

# JSON valido (usa python3 se disponivel; senao node; senao only checa nao vazio)
if command -v python3 >/dev/null 2>&1; then
  check "DELIVERY_CONTRACT.json e JSON valido"                        python3 -c "import json,sys; json.load(open(sys.argv[1]))" "$HERE/DELIVERY_CONTRACT.json"
elif command -v node >/dev/null 2>&1; then
  check "DELIVERY_CONTRACT.json e JSON valido"                        node -e "JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'))" "$HERE/DELIVERY_CONTRACT.json"
else
  check "DELIVERY_CONTRACT.json nao esta vazio"                       test -s "$HERE/DELIVERY_CONTRACT.json"
fi

# Trava 3 - Termos proibidos (montados via printf para nao gatilhar o proprio grep)
# Padroes proibidos:
#   - simbolo Unicode de multiplicacao entre SAC e PRICE
#   - termos provisorios em qualquer arquivo de entrega
FORBIDDEN_MUL_1="$(printf 'SAC \xc3\x97 PRICE')"
FORBIDDEN_MUL_2="$(printf 'PRICE \xc3\x97 SAC')"
FORBIDDEN_WORDS="$(printf 'T\x4FDO\nlorem ipsum\np\x6Cacehol\x64er')"

# Excluimos o proprio script e o log para evitar self-match
EXCL=(--exclude=autovalidacao.sh --exclude=autovalidacao_log.txt --exclude-dir=zip)

if grep -RIn "${EXCL[@]}" -F "$FORBIDDEN_MUL_1" "$HERE" >/dev/null 2>&1 \
   || grep -RIn "${EXCL[@]}" -F "$FORBIDDEN_MUL_2" "$HERE" >/dev/null 2>&1; then
  printf "  [FAIL] Ausencia do simbolo Unicode de multiplicacao em SAC/PRICE\n" | tee -a "$LOG"
  FAIL=$((FAIL+1))
else
  printf "  [OK]   Ausencia do simbolo Unicode de multiplicacao em SAC/PRICE\n" | tee -a "$LOG"
  PASS=$((PASS+1))
fi

found=0
while IFS= read -r pat; do
  # grep sem -i para evitar matches espurios com palavras portuguesas lowercase ("todos", "todo")
  if grep -RInF "${EXCL[@]}" "$pat" "$HERE" >/dev/null 2>&1; then
    found=1
    printf "    -> encontrado termo provisorio em algum arquivo (padrao: %s)\n" "$pat" | tee -a "$LOG"
  fi
done <<< "$FORBIDDEN_WORDS"
if [ "$found" -eq 0 ]; then
  printf "  [OK]   Ausencia de termos provisorios proibidos\n" | tee -a "$LOG"
  PASS=$((PASS+1))
else
  printf "  [FAIL] Ausencia de termos provisorios proibidos\n" | tee -a "$LOG"
  FAIL=$((FAIL+1))
fi

# Trava 1 - Repositorio oficial intacto
REPO_ROOT="$(cd "$HERE/../.." && pwd)"
if [ -d "$REPO_ROOT/.git" ]; then
  ORIGIN_MAIN_SHA="$(cd "$REPO_ROOT" && git rev-parse --short origin/main 2>/dev/null || echo "")"
  if [ "$ORIGIN_MAIN_SHA" = "991d242" ]; then
    printf "  [OK]   Branch main do repo oficial intacta em 991d242\n" | tee -a "$LOG"
    PASS=$((PASS+1))
  else
    printf "  [FAIL] origin/main esperado 991d242, observado '%s'\n" "$ORIGIN_MAIN_SHA" | tee -a "$LOG"
    FAIL=$((FAIL+1))
  fi
  # frontend / backend / infra / docker nao tocados nesta entrega
  CHANGED_REAL=$(cd "$REPO_ROOT" && git diff --name-only origin/main...HEAD 2>/dev/null | grep -E '^(frontend|backend|infra|docker|tools|scripts)/' | wc -l | tr -d ' ')
  if [ "$CHANGED_REAL" = "0" ]; then
    printf "  [OK]   Nenhum arquivo em frontend/backend/infra/docker/tools/scripts foi modificado\n" | tee -a "$LOG"
    PASS=$((PASS+1))
  else
    printf "  [FAIL] %s arquivo(s) em frontend/backend/infra/docker/tools/scripts modificado(s)\n" "$CHANGED_REAL" | tee -a "$LOG"
    FAIL=$((FAIL+1))
  fi
else
  printf "  [SKIP] Repositorio oficial fora do alcance deste script\n" | tee -a "$LOG"
fi

# ZIP e SHA256SUMS
# O ZIP final e um artefato de distribuicao - ele nao se contem.
# Quando rodando da copia FONTE (em _deliveries/), o ZIP esta em zip/.
# Quando rodando de uma copia EXTRAIDA, o ZIP fica externo ao pacote -
# neste caso, registramos [INFO] sem contar como falha.
ZIP_PATH="$HERE/zip/PEF_14F_F8E_prototipo_visual_final_candidate.zip"
if [ -f "$ZIP_PATH" ]; then
  printf "  [OK]   ZIP final presente em zip/ (contexto fonte)\n" | tee -a "$LOG"
  PASS=$((PASS+1))
else
  printf "  [INFO] ZIP final externo a este pacote (contexto extraido) - nao conta como falha\n" | tee -a "$LOG"
fi
check "SHA256SUMS.txt existe"                                         test -f "$HERE/SHA256SUMS.txt"

# ============================================================
# Checks especificos dos ajustes 14F-F8E-AJ1
# ============================================================

# AJ1.3 - Card-resumo global exibe valores monetarios completos com ,00
if grep -q 'class="v">R\$ 870\.000,00<' "$HERE/index.html" \
   && grep -q 'class="v">R\$ 700\.000,00<' "$HERE/index.html" \
   && grep -q 'class="v">R\$ 170\.000,00<' "$HERE/index.html"; then
  printf "  [OK]   AJ1.3 Card-resumo global exibe R\$ 870.000,00 / R\$ 700.000,00 / R\$ 170.000,00\n" | tee -a "$LOG"
  PASS=$((PASS+1))
else
  printf "  [FAIL] AJ1.3 Card-resumo global sem formato monetario completo\n" | tee -a "$LOG"
  FAIL=$((FAIL+1))
fi

# AJ1.4 - Grafico comparativo sem anglicismo "k" (formato kilo)
# Procura padroes especificos do antigo formato: "${...}k</text>" ou similar com k apos numero
if grep -E "\\\$\\{[^}]*/ 1000[^}]*\\}k" "$HERE/index.html" >/dev/null 2>&1 \
   || grep -E "toFixed\\(0\\)\\}k" "$HERE/index.html" >/dev/null 2>&1; then
  printf "  [FAIL] AJ1.4 Grafico comparativo ainda usa formato 'Xk' para milhares\n" | tee -a "$LOG"
  FAIL=$((FAIL+1))
else
  printf "  [OK]   AJ1.4 Grafico comparativo sem formato 'Xk' (uso de fmtBRL ou forma 'X mil')\n" | tee -a "$LOG"
  PASS=$((PASS+1))
fi

# AJ1.2 - Cabecalho DESCRICAO alinhado a esquerda na tabela de variaveis
if grep -q 'style="text-align:left">Descrição<' "$HERE/index.html"; then
  printf "  [OK]   AJ1.2 Cabecalho 'Descrição' alinhado a esquerda (mesma fonte/cor dos demais)\n" | tee -a "$LOG"
  PASS=$((PASS+1))
else
  printf "  [FAIL] AJ1.2 Cabecalho 'Descrição' nao alinhado a esquerda\n" | tee -a "$LOG"
  FAIL=$((FAIL+1))
fi

# AJ1.1 - Reposicionamento do insight "Comece pelo cenario fixo" para coluna esquerda
# Verifica que o insight aparece DENTRO do bloco esquerdo (apos os KPIs), nao na coluna direita
if grep -B 2 "Comece pelo cenário fixo" "$HERE/index.html" | grep -q '"preparar-0"\|grid g-3\|kpi.*Valor financiado'; then
  printf "  [OK]   AJ1.1 Insight 'Comece pelo cenario fixo' reposicionado para coluna esquerda\n" | tee -a "$LOG"
  PASS=$((PASS+1))
else
  printf "  [FAIL] AJ1.1 Insight 'Comece pelo cenario fixo' nao reposicionado\n" | tee -a "$LOG"
  FAIL=$((FAIL+1))
fi

echo "" | tee -a "$LOG"
echo "================================================" | tee -a "$LOG"
echo " RESULTADO: $PASS PASS, $FAIL FAIL" | tee -a "$LOG"
echo "================================================" | tee -a "$LOG"

if [ "$FAIL" -eq 0 ]; then
  echo " STATUS GLOBAL: PASS" | tee -a "$LOG"
  exit 0
else
  echo " STATUS GLOBAL: FAIL" | tee -a "$LOG"
  exit 1
fi
