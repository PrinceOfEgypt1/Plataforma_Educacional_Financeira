#!/usr/bin/env python3
"""
Export OpenAPI spec — scripts/export_openapi.py

Exporta o schema OpenAPI da aplicação FastAPI para docs/api/openapi.json.
Execute sempre que rotas ou schemas forem alterados.

Uso:
  python scripts/export_openapi.py
  python scripts/export_openapi.py --output docs/api/openapi.json
  python scripts/export_openapi.py --check   # valida sem sobrescrever
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent
BACKEND_DIR  = PROJECT_ROOT / "backend"
DEFAULT_OUT  = PROJECT_ROOT / "docs" / "api" / "openapi.json"

sys.path.insert(0, str(BACKEND_DIR))

os.environ.setdefault("APP_ENV",          "ci")
os.environ.setdefault("DATABASE_URL",     "postgresql+psycopg://postgres:postgres@localhost:5432/pef_dev")  # pragma: allowlist secret
os.environ.setdefault("ALLOWED_ORIGINS",  '["http://localhost:3000"]')
os.environ.setdefault("APP_SECRET_KEY",   "export-only-not-real")   # noqa: S105


def export_spec(output: Path, check_only: bool = False) -> dict:
    from app.main import app  # type: ignore[import]

    schema = app.openapi()

    if check_only:
        if output.exists():
            existing = json.loads(output.read_text())
            if existing == schema:
                print(f"✅ openapi.json sincronizado: {output}")
                return schema
            print(f"❌ openapi.json DESATUALIZADO: {output}")
            print("   Execute: python scripts/export_openapi.py")
            sys.exit(1)
        print(f"❌ openapi.json não encontrado: {output}")
        sys.exit(1)

    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(schema, indent=2, ensure_ascii=False) + "\n")

    paths   = list(schema.get("paths", {}).keys())
    schemas = len(schema.get("components", {}).get("schemas", {}))
    print(f"✅ OpenAPI spec exportado : {output}")
    print(f"   openapi version        : {schema.get('openapi', 'n/a')}")
    print(f"   api version            : {schema.get('info', {}).get('version', 'n/a')}")
    print(f"   endpoints              : {len(paths)}")
    print(f"   component schemas      : {schemas}")
    print(f"   paths                  : {paths}")
    return schema


def main() -> None:
    parser = argparse.ArgumentParser(description="Export FastAPI OpenAPI spec")
    parser.add_argument("--output", default=str(DEFAULT_OUT))
    parser.add_argument("--check",  action="store_true")
    args = parser.parse_args()
    export_spec(Path(args.output), check_only=args.check)


if __name__ == "__main__":
    main()
