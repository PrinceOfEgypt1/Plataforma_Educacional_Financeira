# =========================================================================
# pipeline.ps1 - Pipeline Oficial de Qualidade (PEF) - F5-E03 (OFF-REPO)
# =========================================================================
# F5-E03 corrige a F5-E02. A E02 estava sintaticamente invalida no parser
# real do PowerShell (MissingArrayIndexExpression / MissingEndCurlyBrace /
# TerminatorExpectedAtEndOfString). Esta versao foi reescrita para:
#   - ser ASCII pura (sem em-dash, sem acentos, sem caractere fora 0x20-0x7E)
#     em todo o conteudo do script. Evita ambiguidade de encoding em PS 5.1.
#   - eliminar a here-string (@" ... "@) substituindo por arrays de strings
#     processadas com Write-Host. Remove a fonte mais comum de erro de
#     terminador.
#   - substituir slicing inline ($arr[1..($arr.Count-1)]) por helpers que
#     verificam Count antes de acessar indice. Remove a causa de
#     MissingArrayIndexExpression.
#   - manter intacta a politica F5-E02:
#       * backend obrigatorio em modo padrao;
#       * frontend obrigatorio em modo padrao;
#       * Bandit no modo padrao;
#       * SKIP apenas em gates opcionais de -Full;
#       * exit code 1 para falha, 0 para verde, 2 para help.
#
# Compatibilidade: PowerShell 5.1+ (Windows) ou PowerShell 7+ (pwsh).
# F5-E04: este arquivo e bit-a-bit identico ao da F5-E03 (parser aprovado
# pelo operador Windows com PARSE_ERRORS=0 e -Help exit code 2). A E04 nao
# alterou pipeline.ps1; corrigiu apenas o erro de empacotamento que deixou
# a doc operacional ausente do DRAFT.
# =========================================================================

[CmdletBinding()]
param(
    [switch]$Full,
    [switch]$Help
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# -------------------------------------------------------------------------
# 0. Constantes
# -------------------------------------------------------------------------
$script:Version     = 'F5-E03'
$script:ScriptDir   = Split-Path -Parent $MyInvocation.MyCommand.Path
$script:RepoRoot    = (Resolve-Path (Join-Path $script:ScriptDir '..')).Path
$script:BackendDir  = Join-Path $script:RepoRoot 'backend'
$script:FrontendDir = Join-Path $script:RepoRoot 'frontend'
$script:BackendPy   = $null
$script:PnpmExe     = $null      # caminho do executavel pnpm (ou corepack)
$script:PnpmPrefix  = @()        # args fixos antes dos args reais (ex: 'pnpm' quando via corepack)

# -------------------------------------------------------------------------
# 1. Logging (sem caractere especial)
# -------------------------------------------------------------------------
function Write-Info    { param([string]$Msg) Write-Host ('[INFO] ' + $Msg) -ForegroundColor Blue }
function Write-Ok      { param([string]$Msg) Write-Host ('[ OK ] ' + $Msg) -ForegroundColor Green }
function Write-WarnMsg { param([string]$Msg) Write-Host ('[WARN] ' + $Msg) -ForegroundColor Yellow }
function Write-ErrMsg  { param([string]$Msg) Write-Host ('[FAIL] ' + $Msg) -ForegroundColor Red }
function Write-SkipMsg { param([string]$Msg) Write-Host ('[SKIP] ' + $Msg) -ForegroundColor Yellow }
function Write-Section { param([string]$Msg) Write-Host ('') ; Write-Host ('=== ' + $Msg + ' ===') -ForegroundColor Blue }

function Stop-Pipeline {
    param(
        [Parameter(Mandatory=$true)] [string]$Step,
        [Parameter(Mandatory=$true)] [string]$Reason
    )
    Write-Host ''
    Write-Host '=== PIPELINE FALHOU ===' -ForegroundColor Red
    Write-Host ('Etapa:  ' + $Step)
    Write-Host ('Motivo: ' + $Reason)
    exit 1
}

# -------------------------------------------------------------------------
# 2. Help (sem here-string; usa array de strings)
# -------------------------------------------------------------------------
function Show-Usage {
    $lines = @(
        'pipeline.ps1 - Pipeline Oficial de Qualidade (PEF) - ' + $script:Version,
        '',
        'USO:',
        '  .\scripts\pipeline.ps1              modo padrao (obrigatorio antes do push)',
        '  .\scripts\pipeline.ps1 -Full        modo completo (pre-PR)',
        '  .\scripts\pipeline.ps1 -Help        exibe esta ajuda',
        '',
        'MODO PADRAO (obrigatorio):',
        '  Backend  : ruff check, ruff format --check, mypy app/,',
        '             bandit -r app/ -c pyproject.toml, pytest tests/unit -m unit',
        '  Frontend : install --frozen-lockfile, lint, format:check, typecheck,',
        '             test -- --run, build',
        '',
        '  Pre-requisitos ausentes (venv, python, pnpm, node, ferramentas) =>',
        '  PIPELINE FALHOU. Nao ha SKIP em modo padrao.',
        '',
        'MODO -Full (padrao + extras):',
        '  Backend  : + detect-secrets* + pytest integration* + pytest contract*',
        '             + pytest regression*',
        '  Frontend : + test:coverage (obrigatorio) + test:e2e:smoke* + test:a11y*',
        '  (* = gates opcionais em -Full; podem receber SKIP com justificativa',
        '       explicita quando a dependencia externa nao existe.)',
        '',
        'CODIGOS DE SAIDA:',
        '  0  PIPELINE VERDE',
        '  1  PIPELINE FALHOU',
        '  2  Uso invalido / ajuda'
    )
    foreach ($line in $lines) { Write-Host $line }
}

# -------------------------------------------------------------------------
# 3. Deteccao
# -------------------------------------------------------------------------
function Get-BackendPython {
    $windowsPy = Join-Path $script:BackendDir '.venv\Scripts\python.exe'
    if (Test-Path -LiteralPath $windowsPy -PathType Leaf) { return $windowsPy }
    $linuxPy = Join-Path $script:BackendDir '.venv/bin/python'
    if (Test-Path -LiteralPath $linuxPy -PathType Leaf) { return $linuxPy }
    return $null
}

function Initialize-PnpmInvocation {
    # Preferencia: pnpm direto no PATH.
    $cmd = Get-Command pnpm -ErrorAction SilentlyContinue
    if ($null -ne $cmd) {
        $script:PnpmExe    = $cmd.Source
        $script:PnpmPrefix = @()
        return $true
    }
    # Fallback: corepack pnpm.
    $core = Get-Command corepack -ErrorAction SilentlyContinue
    if ($null -ne $core) {
        try {
            & $core.Source pnpm --version *> $null
            $rc = $LASTEXITCODE
            if ($rc -eq 0) {
                $script:PnpmExe    = $core.Source
                $script:PnpmPrefix = @('pnpm')
                return $true
            }
        } catch {
            # cai para falso
        }
    }
    $script:PnpmExe    = $null
    $script:PnpmPrefix = @()
    return $false
}

# -------------------------------------------------------------------------
# 4. Pre-requisitos (abortam em falha; sem SKIP)
# -------------------------------------------------------------------------
function Assert-BackendPrerequisites {
    Write-Section 'Pre-requisito Backend'
    if (-not (Test-Path -LiteralPath $script:BackendDir -PathType Container)) {
        Stop-Pipeline 'Pre-requisito Backend' ($script:BackendDir + ' nao existe. Este repositorio requer backend/.')
    }
    $py = Get-BackendPython
    if ($null -eq $py) {
        Stop-Pipeline 'Pre-requisito Backend' 'backend\.venv nao encontrado. Crie com: uv venv .venv ; uv pip install -e ".[dev]"'
    }
    $script:BackendPy = $py
    Write-Info ('Python do venv: ' + $script:BackendPy)

    $tools = @('ruff','mypy','bandit','pytest')
    foreach ($tool in $tools) {
        $ok = $false
        try {
            & $script:BackendPy -m $tool --version *> $null
            if ($LASTEXITCODE -eq 0) { $ok = $true }
        } catch {
            $ok = $false
        }
        if (-not $ok) {
            Stop-Pipeline ('Pre-requisito Backend - ' + $tool) ($script:BackendPy + ' -m ' + $tool + ' --version falhou. Instale dependencias de dev do backend.')
        }
        Write-Ok ('Ferramenta disponivel: ' + $tool)
    }
}

function Assert-FrontendPrerequisites {
    Write-Section 'Pre-requisito Frontend'
    if (-not (Test-Path -LiteralPath $script:FrontendDir -PathType Container)) {
        Stop-Pipeline 'Pre-requisito Frontend' ($script:FrontendDir + ' nao existe. Este repositorio requer frontend/.')
    }
    $nodeCmd = Get-Command node -ErrorAction SilentlyContinue
    if ($null -eq $nodeCmd) {
        Stop-Pipeline 'Pre-requisito Frontend' 'Node nao encontrado no PATH. Requer Node 20 ou superior.'
    }
    $nodeVer = & $nodeCmd.Source --version
    Write-Info ('Node: ' + $nodeVer)

    $hasPnpm = Initialize-PnpmInvocation
    if (-not $hasPnpm) {
        Stop-Pipeline 'Pre-requisito Frontend' 'pnpm nao encontrado (nem direto, nem via corepack). Rode: corepack enable'
    }
    $shown = $script:PnpmExe
    if ($script:PnpmPrefix.Count -gt 0) {
        $shown = $shown + ' ' + ($script:PnpmPrefix -join ' ')
    }
    Write-Info ('pnpm: ' + $shown)
}

# -------------------------------------------------------------------------
# 5. Runners
# -------------------------------------------------------------------------
function Invoke-Required {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true)] [string]$Step,
        [Parameter(Mandatory=$true)] [string]$WorkDir,
        [Parameter(Mandatory=$true)] [string]$Executable,
        [Parameter(Mandatory=$true)] [string[]]$Arguments
    )
    Write-Info ('[cwd=' + $WorkDir + '] $ ' + $Executable + ' ' + ($Arguments -join ' '))
    $code = 1
    Push-Location $WorkDir
    try {
        & $Executable @Arguments
        $code = $LASTEXITCODE
    } finally {
        Pop-Location
    }
    if ($code -ne 0) {
        Stop-Pipeline $Step ('Comando falhou (exit=' + $code + '): ' + $Executable + ' ' + ($Arguments -join ' '))
    }
    Write-Ok $Step
}

function Invoke-PnpmRequired {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true)] [string]$Step,
        [Parameter(Mandatory=$true)] [string[]]$PnpmArgs
    )
    $invokeArgs = @()
    if ($script:PnpmPrefix.Count -gt 0) { $invokeArgs = $invokeArgs + $script:PnpmPrefix }
    $invokeArgs = $invokeArgs + $PnpmArgs
    Invoke-Required -Step $Step -WorkDir $script:FrontendDir -Executable $script:PnpmExe -Arguments $invokeArgs
}

function Invoke-Optional {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true)] [string]$Step,
        [Parameter(Mandatory=$true)] [string]$ReasonIfMissing,
        [Parameter(Mandatory=$true)] [scriptblock]$CheckScript,
        [Parameter(Mandatory=$true)] [scriptblock]$RunScript
    )
    $checkOk = $true
    try {
        & $CheckScript *> $null
        if ($LASTEXITCODE -ne 0) { $checkOk = $false }
    } catch {
        $checkOk = $false
    }
    if (-not $checkOk) {
        Write-SkipMsg ($Step + ' - ' + $ReasonIfMissing)
        return
    }
    Write-Info ('Executando opcional: ' + $Step)
    $code = 1
    try {
        & $RunScript
        $code = $LASTEXITCODE
    } catch {
        Stop-Pipeline $Step ('Comando opcional falhou: ' + $_.Exception.Message)
    }
    if ($code -ne 0) {
        Stop-Pipeline $Step ('Comando opcional com dependencia presente falhou (exit=' + $code + ').')
    }
    Write-Ok $Step
}

# -------------------------------------------------------------------------
# 6. Backend - modo padrao (5 gates obrigatorios, inclui Bandit)
# -------------------------------------------------------------------------
function Invoke-BackendStandard {
    Write-Section 'Backend - modo padrao'
    Invoke-Required -Step 'backend.ruff_check' `
        -WorkDir $script:BackendDir -Executable $script:BackendPy `
        -Arguments @('-m','ruff','check','.')
    Invoke-Required -Step 'backend.ruff_format_check' `
        -WorkDir $script:BackendDir -Executable $script:BackendPy `
        -Arguments @('-m','ruff','format','--check','.')
    Invoke-Required -Step 'backend.mypy_app' `
        -WorkDir $script:BackendDir -Executable $script:BackendPy `
        -Arguments @('-m','mypy','app/')
    # Bandit promovido para padrao por F5-E02 (mantido em F5-E03).
    Invoke-Required -Step 'backend.bandit' `
        -WorkDir $script:BackendDir -Executable $script:BackendPy `
        -Arguments @('-m','bandit','-r','app/','-c','pyproject.toml')
    Invoke-Required -Step 'backend.pytest_unit' `
        -WorkDir $script:BackendDir -Executable $script:BackendPy `
        -Arguments @('-m','pytest','tests/unit','-m','unit')
}

# -------------------------------------------------------------------------
# 7. Backend - extras de -Full (opcionais SKIPaveis)
# -------------------------------------------------------------------------
function Test-DirExists {
    param([string]$Path)
    if (Test-Path -LiteralPath $Path -PathType Container) {
        $global:LASTEXITCODE = 0
    } else {
        $global:LASTEXITCODE = 1
    }
}

function Invoke-BackendFullExtras {
    Write-Section 'Backend - extras do modo -Full'

    Invoke-Optional -Step 'backend.detect_secrets' `
        -ReasonIfMissing 'detect-secrets nao instalado no venv' `
        -CheckScript {
            Push-Location $script:BackendDir
            try {
                & $script:BackendPy -m pip show detect-secrets *> $null
            } finally {
                Pop-Location
            }
        } `
        -RunScript {
            Push-Location $script:BackendDir
            try {
                & $script:BackendPy -m detect_secrets scan --baseline .secrets.baseline
            } finally {
                Pop-Location
            }
        }

    Invoke-Optional -Step 'backend.pytest_integration' `
        -ReasonIfMissing 'tests/integration ausente' `
        -CheckScript { Test-DirExists (Join-Path $script:BackendDir 'tests/integration') } `
        -RunScript {
            Push-Location $script:BackendDir
            try {
                & $script:BackendPy -m pytest tests/integration -m integration
            } finally {
                Pop-Location
            }
        }

    Invoke-Optional -Step 'backend.pytest_contract' `
        -ReasonIfMissing 'tests/contract ausente' `
        -CheckScript { Test-DirExists (Join-Path $script:BackendDir 'tests/contract') } `
        -RunScript {
            Push-Location $script:BackendDir
            try {
                & $script:BackendPy -m pytest tests/contract -m contract
            } finally {
                Pop-Location
            }
        }

    Invoke-Optional -Step 'backend.pytest_regression' `
        -ReasonIfMissing 'tests/regression ausente' `
        -CheckScript { Test-DirExists (Join-Path $script:BackendDir 'tests/regression') } `
        -RunScript {
            Push-Location $script:BackendDir
            try {
                & $script:BackendPy -m pytest tests/regression -m regression
            } finally {
                Pop-Location
            }
        }
}

# -------------------------------------------------------------------------
# 8. Frontend - modo padrao (6 gates obrigatorios)
# -------------------------------------------------------------------------
function Invoke-FrontendStandard {
    Write-Section 'Frontend - modo padrao'
    if (-not (Test-Path -LiteralPath (Join-Path $script:FrontendDir 'node_modules') -PathType Container)) {
        Invoke-PnpmRequired -Step 'frontend.install' -PnpmArgs @('install','--frozen-lockfile')
    } else {
        Write-Ok 'frontend.install (node_modules existente; install nao executado)'
    }
    Invoke-PnpmRequired -Step 'frontend.lint'         -PnpmArgs @('lint')
    Invoke-PnpmRequired -Step 'frontend.format_check' -PnpmArgs @('format:check')
    Invoke-PnpmRequired -Step 'frontend.typecheck'    -PnpmArgs @('typecheck')
    Invoke-PnpmRequired -Step 'frontend.test'         -PnpmArgs @('test','--','--run')
    Invoke-PnpmRequired -Step 'frontend.build'        -PnpmArgs @('build')
}

# -------------------------------------------------------------------------
# 9. Frontend - extras de -Full
# -------------------------------------------------------------------------
function Test-PackageJsonScript {
    param(
        [string]$ScriptName
    )
    $pkgJson = Join-Path $script:FrontendDir 'package.json'
    if (-not (Test-Path -LiteralPath $pkgJson -PathType Leaf)) {
        $global:LASTEXITCODE = 1
        return
    }
    try {
        $pkg = Get-Content -Raw -LiteralPath $pkgJson | ConvertFrom-Json
    } catch {
        $global:LASTEXITCODE = 1
        return
    }
    if ($null -eq $pkg) { $global:LASTEXITCODE = 1; return }
    if ($null -eq $pkg.scripts) { $global:LASTEXITCODE = 1; return }
    $found = $false
    foreach ($prop in $pkg.scripts.PSObject.Properties) {
        if ($prop.Name -eq $ScriptName -and $null -ne $prop.Value -and $prop.Value -ne '') {
            $found = $true
            break
        }
    }
    if ($found) {
        $global:LASTEXITCODE = 0
    } else {
        $global:LASTEXITCODE = 1
    }
}

function Invoke-FrontendFullExtras {
    Write-Section 'Frontend - extras do modo -Full'

    # test:coverage e OBRIGATORIO em -Full.
    Invoke-PnpmRequired -Step 'frontend.test_coverage' -PnpmArgs @('test:coverage')

    Invoke-Optional -Step 'frontend.e2e_smoke' `
        -ReasonIfMissing 'Script test:e2e:smoke ausente ou Playwright/browsers nao instalados' `
        -CheckScript { Test-PackageJsonScript 'test:e2e:smoke' } `
        -RunScript {
            Push-Location $script:FrontendDir
            try {
                $runArgs = @()
                if ($script:PnpmPrefix.Count -gt 0) { $runArgs = $runArgs + $script:PnpmPrefix }
                $runArgs = $runArgs + @('test:e2e:smoke')
                & $script:PnpmExe @runArgs
            } finally {
                Pop-Location
            }
        }

    Invoke-Optional -Step 'frontend.a11y' -ReasonIfMissing 'Script test:a11y ausente ou tooling de acessibilidade nao instalado' -CheckScript { Test-PackageJsonScript 'test:a11y' } `
        -RunScript {
            Push-Location $script:FrontendDir
            try {
                $runArgs = @()
                if ($script:PnpmPrefix.Count -gt 0) { $runArgs = $runArgs + $script:PnpmPrefix }
                $runArgs = $runArgs + @('test:a11y')
                & $script:PnpmExe @runArgs
            } finally {
                Pop-Location
            }
        }
}

# -------------------------------------------------------------------------
# 10. Main
# -------------------------------------------------------------------------
function Invoke-Main {
    if ($Help) {
        Show-Usage
        exit 2
    }

    $mode = 'standard'
    if ($Full) { $mode = 'full' }

    Write-Section ('Pipeline Oficial de Qualidade (' + $script:Version + ') - modo: ' + $mode)
    Write-Info ('Repositorio: ' + $script:RepoRoot)

    Assert-BackendPrerequisites
    Assert-FrontendPrerequisites

    Invoke-BackendStandard
    Invoke-FrontendStandard

    if ($Full) {
        Invoke-BackendFullExtras
        Invoke-FrontendFullExtras
    }

    Write-Host ''
    Write-Host '=== PIPELINE VERDE ===' -ForegroundColor Green
    Write-Info ('Modo: ' + $mode)
    Write-Info 'Todos os gates obrigatorios passaram.'
    if ($Full) {
        Write-Info 'Gates opcionais de -Full: executados ou marcados [SKIP] explicitamente.'
    }
    exit 0
}

Invoke-Main


