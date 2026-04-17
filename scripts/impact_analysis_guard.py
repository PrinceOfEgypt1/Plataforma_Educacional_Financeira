#!/usr/bin/env python3
"""
Impact Analysis Guard — scripts/impact_analysis_guard.py
Plataforma Educacional Financeira

Analisa mudanças no git e reporta impacto por domínio/camada.
Estágio atual: ADVISORY — reporta, nunca bloqueia (exit 0 sempre).
Promoção a WARNING/BLOCKING requer ADR-002/ADR-003.

Uso:
  python scripts/impact_analysis_guard.py
  python scripts/impact_analysis_guard.py --base HEAD~3
  python scripts/impact_analysis_guard.py --files path/a.py path/b.ts
"""
from __future__ import annotations

import argparse
import subprocess
import sys
from dataclasses import dataclass, field
from enum import Enum


class RiskLevel(Enum):
    LOW      = "LOW"
    MEDIUM   = "MEDIUM"
    HIGH     = "HIGH"
    CRITICAL = "CRITICAL"


RISK_ORDER = {RiskLevel.LOW: 0, RiskLevel.MEDIUM: 1,
              RiskLevel.HIGH: 2, RiskLevel.CRITICAL: 3}

# (substring_pattern, risk_level, advisory_message)
LAYER_MAP: dict[str, tuple[str, RiskLevel, str]] = {
    "domain":       ("backend/app/domain/",        RiskLevel.HIGH,
                     "Domínio alterado: rodar testes de mutação (make test-mutation)"),
    "services":     ("backend/app/services/",      RiskLevel.MEDIUM,
                     "Serviço alterado: verificar contratos com API e domain"),
    "api":          ("backend/app/api/",            RiskLevel.HIGH,
                     "Rota de API alterada: rodar make test-contract (schemathesis)"),
    "repositories": ("backend/app/repositories/",  RiskLevel.MEDIUM,
                     "Repositório alterado: verificar queries e índices"),
    "schemas":      ("backend/app/schemas/",        RiskLevel.MEDIUM,
                     "Schema Pydantic alterado: verificar compatibilidade de contrato"),
    "migration":    ("backend/app/db/migrations/", RiskLevel.CRITICAL,
                     "Migration alterada: rodar make migrate-dryrun; revisar rollback"),
    "config":       ("backend/app/core/config",    RiskLevel.CRITICAL,
                     "Config alterada: verificar .env.example e todas as variáveis"),
    "main":         ("backend/app/main.py",         RiskLevel.HIGH,
                     "main.py alterado: verificar middleware, CORS, rotas de health"),
    "fe_components":("frontend/src/components/",   RiskLevel.MEDIUM,
                     "Componentes FE alterados: rodar snapshot visual e axe-core"),
    "fe_lib":       ("frontend/src/lib/",           RiskLevel.MEDIUM,
                     "Lib FE alterada: verificar testes unitários"),
    "fe_app":       ("frontend/src/app/",           RiskLevel.MEDIUM,
                     "Páginas Next.js alteradas: verificar roteamento e states"),
    "fe_tokens":    ("frontend/src/styles/tokens",  RiskLevel.HIGH,
                     "Tokens de design alterados: verificar drift visual em todas as telas"),
    "ci":           (".github/workflows/",          RiskLevel.HIGH,
                     "Pipeline CI alterada: validar em branch de teste antes do merge"),
    "docker":       ("docker/",                     RiskLevel.HIGH,
                     "Docker alterado: rebuild e smoke test em container"),
    "infra":        ("infra/",                      RiskLevel.HIGH,
                     "IaC alterada: rodar terraform plan; revisar impacto"),
    "deps_be":      ("backend/pyproject.toml",      RiskLevel.MEDIUM,
                     "Deps backend alteradas: rodar make deps-audit"),
    "deps_fe":      ("frontend/package.json",       RiskLevel.MEDIUM,
                     "Deps frontend alteradas: rodar pnpm audit"),
    "openapi":      ("docs/api/openapi.json",       RiskLevel.HIGH,
                     "OpenAPI editado manualmente: regenerar via scripts/export_openapi.py"),
    "runbooks":     ("docs/runbooks/",              RiskLevel.LOW,
                     "Runbook alterado: validar que os passos ainda funcionam"),
    "makefile":     ("Makefile",                    RiskLevel.LOW,
                     "Makefile alterado: verificar que make verify ainda passa"),
}

DOMAIN_MAP: dict[str, list[str]] = {
    d: [f"app/domain/{d}", f"app/services/{d}", f"app/api/{d}", f"app/schemas/{d}"]
    for d in [
        "interest", "amortization", "financing", "loans", "credit_card",
        "late_payment", "indicators", "invest_vs_debt", "diagnostic",
        "education", "export",
    ]
}


@dataclass
class ImpactReport:
    changed_files:   list[str] = field(default_factory=list)
    affected_layers: list[str] = field(default_factory=list)
    affected_domains:list[str] = field(default_factory=list)
    risk_level:      RiskLevel = RiskLevel.LOW
    warnings:        list[str] = field(default_factory=list)
    advisories:      list[str] = field(default_factory=list)


def get_changed_files(base: str) -> list[str]:
    for cmd in [
        ["git", "diff", "--name-only", base, "HEAD"],
        ["git", "diff", "--name-only", "--cached"],
        ["git", "diff", "--name-only"],
    ]:
        try:
            r = subprocess.run(cmd, capture_output=True, text=True, check=True)
            files = [f.strip() for f in r.stdout.splitlines() if f.strip()]
            if files:
                return files
        except subprocess.CalledProcessError:
            continue
    return []


def analyze(files: list[str]) -> ImpactReport:
    report = ImpactReport(changed_files=files)
    highest = RiskLevel.LOW

    for f in files:
        for layer_name, (pattern, risk, advisory) in LAYER_MAP.items():
            if pattern in f:
                if layer_name not in report.affected_layers:
                    report.affected_layers.append(layer_name)
                    report.advisories.append(advisory)
                    if RISK_ORDER[risk] > RISK_ORDER[highest]:
                        highest = risk
        for domain, patterns in DOMAIN_MAP.items():
            if any(p in f for p in patterns) and domain not in report.affected_domains:
                report.affected_domains.append(domain)

    report.risk_level = highest

    # Cross-cutting warnings
    critical = [l for l in report.affected_layers
                if LAYER_MAP[l][1] == RiskLevel.CRITICAL]
    if critical:
        report.warnings.append(
            f"Camadas CRÍTICAS modificadas: {', '.join(critical)}. "
            "Revisão obrigatória antes do merge."
        )
    if len(report.affected_domains) >= 3:
        report.warnings.append(
            f"Mudança cross-domain: {len(report.affected_domains)} domínios afetados — "
            "verificar contratos cruzados."
        )
    if "migration" in report.affected_layers and "api" in report.affected_layers:
        report.warnings.append(
            "Migration + API na mesma PR: alto risco de regressão — "
            "preferível separar em PRs distintas."
        )
    return report


def fmt(r: ImpactReport) -> str:
    C = {RiskLevel.LOW:      "\033[32m",
         RiskLevel.MEDIUM:   "\033[33m",
         RiskLevel.HIGH:     "\033[91m",
         RiskLevel.CRITICAL: "\033[35m"}
    R = "\033[0m"; B = "\033[1m"
    c = C[r.risk_level]

    lines = [
        "",
        f"{B}╔══════════════════════════════════════════════════════════════╗{R}",
        f"{B}║   IMPACT ANALYSIS GUARD — Plataforma Educacional Financeira  ║{R}",
        f"{B}║   Estágio: ADVISORY (não bloqueia)  |  ADR-001               ║{R}",
        f"{B}╚══════════════════════════════════════════════════════════════╝{R}",
        "",
        f"  Risco             : {c}{B}{r.risk_level.value}{R}",
        f"  Arquivos alterados: {len(r.changed_files)}",
        f"  Camadas afetadas  : {', '.join(r.affected_layers) or 'nenhuma mapeada'}",
        f"  Domínios afetados : {', '.join(r.affected_domains) or 'nenhum mapeado'}",
        "",
    ]
    if r.changed_files:
        lines.append(f"  {B}Arquivos:{R}")
        for f in r.changed_files[:25]:
            lines.append(f"    • {f}")
        if len(r.changed_files) > 25:
            lines.append(f"    ... +{len(r.changed_files) - 25} arquivo(s)")
        lines.append("")
    if r.warnings:
        lines.append(f"  {B}⚠️  Avisos:{R}")
        for w in r.warnings:
            lines.append(f"    ⚠  {w}")
        lines.append("")
    if r.advisories:
        lines.append(f"  {B}📋 Ações recomendadas:{R}")
        for a in r.advisories:
            lines.append(f"    →  {a}")
        lines.append("")
    else:
        lines.append("  ✅ Nenhuma ação adicional recomendada.")
        lines.append("")
    lines += [
        f"  {B}Estágio: ADVISORY{R} — este agente observa e reporta, nunca bloqueia.",
        "  Critérios de promoção: docs/adr/ADR-001-impact-agent.md",
        "",
    ]
    return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--base",  default="HEAD~1")
    parser.add_argument("--files", nargs="*")
    args = parser.parse_args()

    files = args.files if args.files else get_changed_files(args.base)
    if not files:
        print("\n  ✅ Nenhum arquivo alterado detectado.\n")
        sys.exit(0)

    print(fmt(analyze(files)))
    sys.exit(0)   # ADVISORY: sempre exit 0


if __name__ == "__main__":
    main()
