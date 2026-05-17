import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

type AuditSummary = {
  high: number;
  medium: number;
  low: number;
  total: number;
};

type AuditIssue = {
  code: string;
  severity: string;
  title: string;
  file: string;
  evidence: string;
};

type AuditPayload = {
  contract: string;
  issues: AuditIssue[];
  summary: AuditSummary;
};

type AuditorRun = {
  status: number | null;
  stdout: string;
  stderr: string;
};

const frontendRoot = process.cwd();
const auditorPath = resolve(frontendRoot, "scripts/auditor-uiux.mjs");
const packagePath = resolve(frontendRoot, "package.json");

function runAuditor(args: string[]): AuditorRun {
  const result = spawnSync(process.execPath, [auditorPath, ...args], {
    cwd: frontendRoot,
    encoding: "utf-8",
  });

  return {
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
  };
}

function parseJsonPayload(stdout: string): AuditPayload {
  return JSON.parse(stdout.trim()) as AuditPayload;
}

function countByCode(issues: AuditIssue[]): Record<string, number> {
  return issues.reduce<Record<string, number>>((accumulator, issue) => {
    accumulator[issue.code] = (accumulator[issue.code] ?? 0) + 1;
    return accumulator;
  }, {});
}

describe("auditor-uiux", () => {
  it("está integrado ao package.json do frontend", () => {
    const packageJson = JSON.parse(readFileSync(packagePath, "utf-8")) as {
      scripts?: Record<string, string>;
    };

    expect(packageJson.scripts?.["audit:uiux"]).toBe(
      "node scripts/auditor-uiux.mjs",
    );
  });

  it("valida o contrato em modo contract-only", () => {
    const result = runAuditor(["--contract-only"]);

    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toContain(
      "Contrato: PEF-UIUX-CONTRACT-FINANCIAMENTO-IMOBILIARIO",
    );
    expect(result.stdout).toContain("Resultado: PASS");
    expect(result.stdout).toContain("Nenhuma violação encontrada.");
  });

  it("emite JSON estruturado com zero violações após F4C", () => {
    const result = runAuditor(["--json"]);
    const payload = parseJsonPayload(result.stdout);

    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
    expect(payload.contract).toBe(
      "PEF-UIUX-CONTRACT-FINANCIAMENTO-IMOBILIARIO",
    );
    expect(payload.summary).toEqual({
      high: 0,
      medium: 0,
      low: 0,
      total: 0,
    });
    expect(payload.issues).toHaveLength(0);
  });

  it("não reporta nenhum código de violação", () => {
    const result = runAuditor(["--json"]);
    const payload = parseJsonPayload(result.stdout);
    const byCode = countByCode(payload.issues);

    expect(result.status).toBe(0);
    expect(byCode).toEqual({});
  });

  it("--expect-fail falha quando não há violações", () => {
    const result = runAuditor(["--expect-fail"]);

    // Com zero violações, --expect-fail deve retornar erro
    expect(result.status).toBe(1);
    expect(result.stdout).toContain("Nenhuma violação encontrada");
  });
});
