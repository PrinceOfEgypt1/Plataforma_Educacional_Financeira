"""Lint pedagogico deterministico - Sprint 2 / F5.

Roda sem dependencias externas (apenas stdlib). Varre arquivos de
conteudo educacional do frontend e dos docs vivos relevantes e aplica
um subset das regras do Doc 08 sec.20:

  Bloqueios (contam para EXIT != 0):
    - termos de promessa de retorno ("vai render X%", "rendimento garantido");
    - moralismo ("e irresponsavel", "obviamente", "voce deveria");
    - placeholders ("Lorem ipsum", "TODO", "FIXME", "placeholder");
    - aviso educacional ausente no corpus de juros (palavra
      "educacional" deve aparecer em pelo menos um arquivo).

  Avisos (registrados, nao bloqueiam, exceto com --strict):
    - termos-chave do glossario minimo ausentes do corpus;
    - anti-padrao de a11y ("clique aqui").

A implementacao completa (contagem por sigla, leitura cruzada com
glossario, regras de cor/icone, telemetria) fica para a Sprint 7
conforme roadmap (Doc 08 sec.20 e Gate Forense).

Saida no formato `<path>:<linha>: <severidade>: <mensagem>` para que
operador e CI possam parsear. EXIT=0 quando nao houver bloqueio;
EXIT=1 quando houver.

Uso:
    python -m tools.edu_lint
    python -m tools.edu_lint frontend/src/content docs/08_*.md
    python -m tools.edu_lint --strict
"""

from __future__ import annotations

import argparse
import re
import sys
from collections.abc import Iterable, Iterator, Sequence
from dataclasses import dataclass
from pathlib import Path

# Cada regra: (severidade, padrao regex, mensagem).
# Severidades: "block" (bloqueio) e "warn" (aviso).
RULES: list[tuple[str, re.Pattern[str], str]] = [
    ("block", re.compile(r"\bvai render\b", re.IGNORECASE),
     "promessa de retorno ('vai render') vetada (Doc 08 sec.6.4)"),
    ("block", re.compile(r"\brendimento garantido\b", re.IGNORECASE),
     "promessa de retorno ('rendimento garantido') vetada (Doc 08 sec.6.4)"),
    ("block", re.compile(r"\bvoce deveria\b", re.IGNORECASE),
     "imperativo aconselhativo ('voce deveria') vetado (Doc 08 sec.6.1)"),
    ("block", re.compile(r"\bvocê deveria\b", re.IGNORECASE),
     "imperativo aconselhativo ('voce deveria') vetado (Doc 08 sec.6.1)"),
    ("block", re.compile(r"\bobviamente\b", re.IGNORECASE),
     "moralismo ('obviamente') vetado (Doc 08 sec.6.1)"),
    ("block", re.compile(r"\be irresponsavel\b", re.IGNORECASE),
     "moralismo ('e irresponsavel') vetado (Doc 08 sec.6.3)"),
    ("block", re.compile(r"\bé irresponsável\b", re.IGNORECASE),
     "moralismo ('e irresponsavel') vetado (Doc 08 sec.6.3)"),
    ("block", re.compile(r"lorem ipsum", re.IGNORECASE),
     "placeholder 'lorem ipsum' nao pode chegar ao conteudo"),
    ("block", re.compile(r"\bplaceholder\b", re.IGNORECASE),
     "termo 'placeholder' presente em arquivo de conteudo"),
    ("block", re.compile(r"\bTODO\b"),
     "marcador 'TODO' presente em arquivo de conteudo"),
    ("block", re.compile(r"\bFIXME\b"),
     "marcador 'FIXME' presente em arquivo de conteudo"),
    ("warn", re.compile(r"\bclique aqui\b", re.IGNORECASE),
     "anti-padrao de a11y ('clique aqui') - preferir texto descritivo"),
]

TERMOS_CHAVE_JUROS = [
    "juros simples",
    "juros compostos",
    "principal",
    "taxa",
    "prazo",
    "montante",
    "aporte",
]

AVISO_EDU = re.compile(r"\beducacional\b", re.IGNORECASE)

DEFAULT_PATHS = [
    "frontend/src/content",
    "docs/08_Conteudo_Educacional.md",
]

ANALYZABLE_SUFFIXES = {".ts", ".tsx", ".md", ".txt"}

# Documentos que DEFINEM o lint pedagogico citam termos proibidos como
# exemplos. Esses arquivos sao excluidos da varredura para evitar
# falso-positivo - eles sao a propria especificacao das regras.
SELF_REFERENTIAL_PATHS = (
    "docs/08_Conteudo_Educacional.md",
    "tools/edu_lint/",
)


def _is_self_referential(path: Path) -> bool:
    s = str(path).replace("\\", "/")
    return any(marker in s for marker in SELF_REFERENTIAL_PATHS)



@dataclass(frozen=True)
class Finding:
    path: Path
    line: int
    severity: str
    message: str


def iter_files(paths: Sequence[str]) -> Iterator[Path]:
    seen: set[Path] = set()
    for raw in paths:
        p = Path(raw)
        if not p.exists():
            continue
        if p.is_file():
            if (
                p.suffix in ANALYZABLE_SUFFIXES
                and not _is_self_referential(p)
                and p not in seen
            ):
                seen.add(p)
                yield p
            continue
        for child in sorted(p.rglob("*")):
            if (
                child.is_file()
                and child.suffix in ANALYZABLE_SUFFIXES
                and not _is_self_referential(child)
                and child not in seen
            ):
                seen.add(child)
                yield child


def lint_file(path: Path) -> list[Finding]:
    findings: list[Finding] = []
    try:
        text = path.read_text(encoding="utf-8")
    except OSError as exc:
        return [Finding(path, 0, "block", f"erro de leitura: {exc}")]
    for lineno, line in enumerate(text.splitlines(), start=1):
        for sev, pattern, message in RULES:
            if pattern.search(line):
                findings.append(Finding(path, lineno, sev, message))
    return findings


def lint_corpus_disclaimer(paths: Sequence[Path]) -> list[Finding]:
    """Bloqueia se o corpus juros nao contem mencao a 'educacional'."""
    juros_files = [p for p in paths if "content/juros" in str(p)]
    if not juros_files:
        return []
    corpus = "\n".join(p.read_text(encoding="utf-8") for p in juros_files)
    if AVISO_EDU.search(corpus):
        return []
    return [
        Finding(
            juros_files[0],
            0,
            "block",
            "aviso educacional ausente no corpus juros - Doc 08 sec.6.4 "
            "exige mencao a 'educacional' em pelo menos um arquivo.",
        ),
    ]


def lint_corpus_terms(paths: Sequence[Path]) -> list[Finding]:
    """Avisa quando o corpus juros nao cita os termos-chave do glossario."""
    juros_files = [p for p in paths if "content/juros" in str(p)]
    if not juros_files:
        return []
    corpus = "\n".join(p.read_text(encoding="utf-8") for p in juros_files)
    findings: list[Finding] = []
    corpus_lower = corpus.lower()
    for termo in TERMOS_CHAVE_JUROS:
        if termo not in corpus_lower:
            findings.append(
                Finding(
                    juros_files[0],
                    0,
                    "warn",
                    f"termo-chave do glossario ausente no corpus: '{termo}'",
                ),
            )
    return findings


def format_finding(f: Finding) -> str:
    return f"{f.path}:{f.line}: {f.severity}: {f.message}"


def run(paths: Sequence[str], *, strict: bool) -> int:
    files = list(iter_files(paths))
    findings: list[Finding] = []
    for p in files:
        findings.extend(lint_file(p))
    findings.extend(lint_corpus_disclaimer(files))
    findings.extend(lint_corpus_terms(files))

    blocks = [f for f in findings if f.severity == "block"]
    warns = [f for f in findings if f.severity == "warn"]

    for f in findings:
        print(format_finding(f))

    print()
    print(f"edu_lint: {len(files)} arquivo(s) analisado(s)")
    print(f"edu_lint: {len(blocks)} bloqueio(s), {len(warns)} aviso(s)")

    if blocks:
        return 1
    if warns and strict:
        return 1
    return 0


def main(argv: Iterable[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="edu_lint", description=__doc__)
    parser.add_argument(
        "paths",
        nargs="*",
        default=DEFAULT_PATHS,
        help="Arquivos ou pastas a varrer (default: paths canonicos).",
    )
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Tratar avisos como bloqueio (EXIT=1).",
    )
    args = parser.parse_args(list(argv) if argv is not None else None)
    return run(args.paths, strict=args.strict)


if __name__ == "__main__":
    raise SystemExit(main())
