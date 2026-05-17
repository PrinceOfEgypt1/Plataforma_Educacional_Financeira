#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const thisFile = fileURLToPath(import.meta.url);
const thisDir = path.dirname(thisFile);
const frontendRoot = path.resolve(thisDir, "..");
const repoRoot = path.resolve(frontendRoot, "..");

const DEFAULT_CONTRACT = path.join(
  repoRoot,
  "docs/governance/frontend/contracts/financiamento-imobiliario.uiux.contract.json",
);

const args = new Set(process.argv.slice(2));
const contractOnly = args.has("--contract-only");
const expectFail = args.has("--expect-fail");
const jsonOutput = args.has("--json");

function joinWord(...parts) {
  return parts.join("");
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function readJson(filePath) {
  return JSON.parse(readText(filePath));
}

function rel(filePath) {
  return path.relative(repoRoot, filePath).replaceAll(path.sep, "/");
}

function resolveRepoPath(relativePath) {
  return path.join(repoRoot, relativePath);
}

function lineOf(text, index) {
  return text.slice(0, index).split(/\r?\n/u).length;
}

function createIssue({
  code,
  severity,
  title,
  file,
  line = null,
  evidence,
  recommendation,
}) {
  return {
    code,
    severity,
    title,
    file,
    line,
    evidence,
    recommendation,
  };
}

function getCodeMeta(contract) {
  const result = new Map();

  for (const item of contract.auditErrorCodes ?? []) {
    if (typeof item?.code === "string") {
      result.set(item.code, {
        severity: item.severity ?? "medium",
        title: item.title ?? item.code,
      });
    }
  }

  return result;
}

function allDeclaredFiles(contract) {
  const source = contract.sourceFiles ?? {};

  return [
    ...(source.routeFiles ?? []),
    ...(source.activeComponentFiles ?? []),
    ...(source.legacyOrCompatibilityFiles ?? []),
    ...(source.testFiles ?? []),
  ];
}

function readContract(contractPath) {
  if (!fs.existsSync(contractPath)) {
    throw new Error(`Contrato não encontrado: ${contractPath}`);
  }

  return readJson(contractPath);
}

function validateContract(contract, contractPath) {
  const issues = [];
  const meta = getCodeMeta(contract);

  const required = [
    ["schemaVersion", contract.schemaVersion],
    ["contractId", contract.contractId],
    ["contractStatus", contract.contractStatus],
    ["module.id", contract.module?.id],
    ["module.route", contract.module?.route],
  ];

  for (const [name, value] of required) {
    if (!value) {
      issues.push(
        createIssue({
          code: "UX-CONTRACT-001",
          severity: "high",
          title: "Contrato UI/UX incompleto.",
          file: rel(contractPath),
          evidence: `Campo obrigatório ausente: ${name}`,
          recommendation:
            "Complete o contrato antes de executar auditoria de UI/UX.",
        }),
      );
    }
  }

  const declared = allDeclaredFiles(contract);

  if (declared.length === 0) {
    issues.push(
      createIssue({
        code: "UX-CONTRACT-002",
        severity: "high",
        title: "Contrato UI/UX sem arquivos declarados.",
        file: rel(contractPath),
        evidence: "sourceFiles não declara arquivos a auditar.",
        recommendation:
          "Declare routeFiles, activeComponentFiles, legacyOrCompatibilityFiles ou testFiles.",
      }),
    );
  }

  for (const relativePath of declared) {
    const fullPath = resolveRepoPath(relativePath);

    if (!fs.existsSync(fullPath)) {
      issues.push(
        createIssue({
          code: "UX-CONTRACT-003",
          severity: "high",
          title: "Arquivo declarado no contrato não existe.",
          file: relativePath,
          evidence: `Arquivo ausente: ${relativePath}`,
          recommendation:
            "Corrija o contrato ou materialize o arquivo esperado.",
        }),
      );
    }
  }

  if (!meta.has("UX-DUP-001") || !meta.has("UX-CTA-002")) {
    issues.push(
      createIssue({
        code: "UX-CONTRACT-004",
        severity: "medium",
        title: "Contrato não declara códigos mínimos de auditoria.",
        file: rel(contractPath),
        evidence:
          "Códigos UX-DUP-001 e UX-CTA-002 são esperados para o auditor inicial.",
        recommendation:
          "Inclua os códigos de erro necessários em auditErrorCodes.",
      }),
    );
  }

  return issues;
}

function staticDataTestIds(text, filePath) {
  const result = [];
  const regex = /data-testid\s*=\s*["']([^"']+)["']/gu;

  for (const match of text.matchAll(regex)) {
    result.push({
      id: match[1],
      file: filePath,
      line: lineOf(text, match.index ?? 0),
    });
  }

  return result;
}

function scanDuplicateTestIds(contract) {
  const issues = [];
  const meta = getCodeMeta(contract);
  const active = contract.sourceFiles?.activeComponentFiles ?? [];
  const legacy = contract.sourceFiles?.legacyOrCompatibilityFiles ?? [];

  const occurrences = new Map();

  for (const group of [
    ["active", active],
    ["legacy", legacy],
  ]) {
    const [kind, files] = group;

    for (const relativePath of files) {
      const fullPath = resolveRepoPath(relativePath);

      if (!fs.existsSync(fullPath)) {
        continue;
      }

      const text = readText(fullPath);

      for (const item of staticDataTestIds(text, relativePath)) {
        const current = occurrences.get(item.id) ?? [];
        current.push({ ...item, kind });
        occurrences.set(item.id, current);
      }
    }
  }

  for (const [id, entries] of occurrences.entries()) {
    const files = new Set(entries.map((item) => item.file));

    if (entries.length > 1 && files.size > 1) {
      const code = "UX-DUP-001";
      const codeMeta = meta.get(code) ?? { severity: "high", title: code };

      for (const item of entries) {
        issues.push(
          createIssue({
            code,
            severity: codeMeta.severity,
            title: codeMeta.title,
            file: item.file,
            line: item.line,
            evidence: `data-testid "${id}" aparece em múltiplos arquivos: ${[...files].join(", ")}`,
            recommendation:
              "Separe identificadores de componentes ativos e legados ou remova o legado do fluxo ativo.",
          }),
        );
      }
    }
  }

  for (const relativePath of legacy) {
    const fullPath = resolveRepoPath(relativePath);

    if (!fs.existsSync(fullPath)) {
      continue;
    }

    const text = readText(fullPath);

    for (const item of staticDataTestIds(text, relativePath)) {
      if (!item.id.endsWith("-legacy")) {
        const code = "UX-DUP-002";
        const codeMeta = meta.get(code) ?? { severity: "medium", title: code };

        issues.push(
          createIssue({
            code,
            severity: codeMeta.severity,
            title: codeMeta.title,
            file: item.file,
            line: item.line,
            evidence: `Componente legado usa data-testid "${item.id}" sem sufixo "-legacy".`,
            recommendation:
              "Renomeie testids legados ou remova o componente legado do contrato.",
          }),
        );
      }
    }
  }

  return issues;
}

function navigationDestinations(text) {
  const result = [];
  const regex = /onNavigate\s*\(\s*["']([^"']+)["']\s*\)/gu;

  for (const match of text.matchAll(regex)) {
    result.push({
      destination: match[1],
      line: lineOf(text, match.index ?? 0),
    });
  }

  return result;
}

function scanCtas(contract) {
  const issues = [];
  const meta = getCodeMeta(contract);
  const active = contract.sourceFiles?.activeComponentFiles ?? [];
  const targetFiles = active.filter((relativePath) =>
    /RealEstateScenarioSidebar|RealEstateNextStepsZone/u.test(relativePath),
  );

  for (const relativePath of targetFiles) {
    const fullPath = resolveRepoPath(relativePath);

    if (!fs.existsSync(fullPath)) {
      continue;
    }

    const text = readText(fullPath);
    const destinations = navigationDestinations(text);

    for (const item of destinations) {
      if (item.destination === "resultado") {
        const code = "UX-CTA-002";
        const codeMeta = meta.get(code) ?? { severity: "high", title: code };

        issues.push(
          createIssue({
            code,
            severity: codeMeta.severity,
            title: codeMeta.title,
            file: relativePath,
            line: item.line,
            evidence: 'CTA navega para destino genérico "resultado".',
            recommendation:
              "Direcione o CTA para a zona específica prometida pelo rótulo ou permita controle explícito da zona ativa.",
          }),
        );
      }
    }

    const byDestination = new Map();

    for (const item of destinations) {
      const current = byDestination.get(item.destination) ?? [];
      current.push(item);
      byDestination.set(item.destination, current);
    }

    for (const [destination, entries] of byDestination.entries()) {
      if (entries.length > 1) {
        const code = "UX-CTA-001";
        const codeMeta = meta.get(code) ?? { severity: "high", title: code };

        issues.push(
          createIssue({
            code,
            severity: codeMeta.severity,
            title: codeMeta.title,
            file: relativePath,
            line: entries[0].line,
            evidence: `Destino "${destination}" aparece ${entries.length} vezes no mesmo componente de CTAs.`,
            recommendation:
              "Diferencie destino, propósito ou justificativa dos CTAs que compartilham a mesma navegação.",
          }),
        );
      }
    }
  }

  return issues;
}

function scanJourney(contract) {
  const issues = [];
  const meta = getCodeMeta(contract);
  const cockpit = "frontend/src/components/financing/FinanciamentoCockpit.tsx";
  const fullPath = resolveRepoPath(cockpit);

  if (!fs.existsSync(fullPath)) {
    return issues;
  }

  const text = readText(fullPath);

  for (let index = 1; index <= (contract.zones?.length ?? 0); index += 1) {
    if (!text.includes(`zone-panel-${index}`)) {
      const code = "UX-JOURNEY-001";
      const codeMeta = meta.get(code) ?? { severity: "high", title: code };

      issues.push(
        createIssue({
          code,
          severity: codeMeta.severity,
          title: codeMeta.title,
          file: cockpit,
          evidence: `Zona declarada no contrato sem painel correspondente: zone-panel-${index}`,
          recommendation: "Crie o painel de zona ou ajuste o contrato.",
        }),
      );
    }
  }

  const requiredViews = contract.views?.map((view) => view.id) ?? [];

  for (const view of requiredViews) {
    if (
      !text.includes(`view === "${view}"`) &&
      !text.includes(`view: "${view}"`)
    ) {
      const code = "UX-JOURNEY-001";
      const codeMeta = meta.get(code) ?? { severity: "high", title: code };

      issues.push(
        createIssue({
          code,
          severity: codeMeta.severity,
          title: codeMeta.title,
          file: cockpit,
          evidence: `View declarada no contrato sem renderização evidente: ${view}`,
          recommendation: "Implemente a view esperada ou ajuste o contrato.",
        }),
      );
    }
  }

  return issues;
}

function scanMobile(contract) {
  const issues = [];
  const meta = getCodeMeta(contract);
  const sidebar =
    "frontend/src/components/financing/RealEstateScenarioSidebar.tsx";
  const fullPath = resolveRepoPath(sidebar);

  if (!fs.existsSync(fullPath)) {
    return issues;
  }

  const text = readText(fullPath);

  const hasFixedWidth =
    text.includes("w-[252px]") || text.includes("w-[260px]");
  const hasBreakpointGuard =
    text.includes("hidden lg:") ||
    text.includes("lg:flex") ||
    text.includes("lg:block") ||
    text.includes("xl:flex");

  if (hasFixedWidth && !hasBreakpointGuard) {
    const code = "UX-MOBILE-001";
    const codeMeta = meta.get(code) ?? { severity: "high", title: code };
    const index = text.indexOf("w-[252px]");

    issues.push(
      createIssue({
        code,
        severity: codeMeta.severity,
        title: codeMeta.title,
        file: sidebar,
        line: index >= 0 ? lineOf(text, index) : null,
        evidence: "Sidebar com largura fixa sem guarda clara de breakpoint.",
        recommendation:
          "Oculte ou transforme a sidebar abaixo do breakpoint definido no contrato.",
      }),
    );
  }

  return issues;
}

function scanTable(contract) {
  const issues = [];
  const meta = getCodeMeta(contract);
  const tableFile =
    "frontend/src/components/financing/RealEstateFinancingTable.tsx";
  const fullPath = resolveRepoPath(tableFile);

  if (!fs.existsSync(fullPath)) {
    return issues;
  }

  const text = readText(fullPath);
  const expectedFragments = [
    'data-testid="financiamento-table"',
    'data-testid="tabela-guia-leitura"',
    'data-testid="financiamento-table-count"',
    'data-testid="financiamento-table-range"',
    'data-testid="financiamento-table-totals"',
    "sticky top-0",
  ];

  const missing = expectedFragments.filter(
    (fragment) => !text.includes(fragment),
  );

  if (missing.length > 0) {
    const code = "UX-TABLE-001";
    const codeMeta = meta.get(code) ?? { severity: "high", title: code };

    issues.push(
      createIssue({
        code,
        severity: codeMeta.severity,
        title: codeMeta.title,
        file: tableFile,
        evidence: `Fragmentos esperados ausentes: ${missing.join(", ")}`,
        recommendation:
          "Ajuste a tabela para cumprir o contrato mínimo de leitura financeira.",
      }),
    );
  }

  return issues;
}

function scanChart(contract) {
  const issues = [];
  const meta = getCodeMeta(contract);
  const chartFile =
    "frontend/src/components/financing/RealEstateCompareChart.tsx";
  const fullPath = resolveRepoPath(chartFile);

  if (!fs.existsSync(fullPath)) {
    return issues;
  }

  const text = readText(fullPath);
  const expectedFragments = [
    'data-testid="financiamento-compare-chart"',
    'data-testid="compare-chart-pedagogia"',
  ];

  const missing = expectedFragments.filter(
    (fragment) => !text.includes(fragment),
  );

  if (missing.length > 0) {
    const code = "UX-CHART-001";
    const codeMeta = meta.get(code) ?? { severity: "medium", title: code };

    issues.push(
      createIssue({
        code,
        severity: codeMeta.severity,
        title: codeMeta.title,
        file: chartFile,
        evidence: `Fragmentos esperados ausentes: ${missing.join(", ")}`,
        recommendation:
          "Ajuste o gráfico para cumprir o contrato mínimo de leitura pedagógica.",
      }),
    );
  }

  return issues;
}

function scanTextIntegrity(contract) {
  const issues = [];
  const meta = getCodeMeta(contract);
  const taskMarker = joinWord("TO", "DO");
  const fixMarker = joinWord("FIX", "ME");
  const tempMarkerUpper = joinWord("PLACE", "HOLDER");
  const tempMarkerLower = "place" + "holder";

  const forbidden = [
    {
      label: "marcador de tarefa pendente",
      regex: new RegExp(`\\b${taskMarker}\\b`, "u"),
    },
    {
      label: "marcador de correção pendente",
      regex: new RegExp(`\\b${fixMarker}\\b`, "u"),
    },
    {
      label: "marcador temporário maiúsculo",
      regex: new RegExp(`\\b${tempMarkerUpper}\\b`, "u"),
    },
    {
      label: "marcador temporário minúsculo",
      regex: new RegExp(`\\b${tempMarkerLower}\\b`, "u"),
    },
    {
      label: "texto com acentuação corrompida",
      regex: /[A-Za-zÀ-ÿ]\?\?[A-Za-zÀ-ÿ]|Mois\?s|Camale\?o/u,
    },
  ];

  const files = allDeclaredFiles(contract).filter((relativePath) =>
    /\.(ts|tsx|md|json)$/u.test(relativePath),
  );

  for (const relativePath of files) {
    const fullPath = resolveRepoPath(relativePath);

    if (!fs.existsSync(fullPath)) {
      continue;
    }

    const text = readText(fullPath);

    for (const item of forbidden) {
      const match = item.regex.exec(text);

      if (match) {
        const code = "UX-TEXT-001";
        const codeMeta = meta.get(code) ?? { severity: "high", title: code };

        issues.push(
          createIssue({
            code,
            severity: codeMeta.severity,
            title: codeMeta.title,
            file: relativePath,
            line: lineOf(text, match.index),
            evidence: item.label,
            recommendation:
              "Remova texto temporário ou corrompido de arquivos materializáveis.",
          }),
        );
      }
    }
  }

  return issues;
}

function runAudit(contract) {
  return [
    ...scanDuplicateTestIds(contract),
    ...scanCtas(contract),
    ...scanJourney(contract),
    ...scanMobile(contract),
    ...scanTable(contract),
    ...scanChart(contract),
    ...scanTextIntegrity(contract),
  ];
}

function summarize(issues) {
  const summary = {
    high: 0,
    medium: 0,
    low: 0,
    total: issues.length,
  };

  for (const issue of issues) {
    const key = issue.severity in summary ? issue.severity : "medium";
    summary[key] += 1;
  }

  return summary;
}

function printTextReport(contract, issues) {
  console.log("PEF UI/UX Audit");
  console.log(`Contrato: ${contract.contractId}`);
  console.log(`Módulo: ${contract.module?.id}`);
  console.log(`Rota: ${contract.module?.route}`);
  console.log("");

  if (issues.length === 0) {
    console.log("Resultado: PASS");
    console.log("Nenhuma violação encontrada.");
    return;
  }

  for (const issue of issues) {
    const location = issue.line ? `${issue.file}:${issue.line}` : issue.file;

    console.log(`FAIL ${issue.code} [${issue.severity}]`);
    console.log(`Título: ${issue.title}`);
    console.log(`Arquivo: ${location}`);
    console.log(`Evidência: ${issue.evidence}`);
    console.log(`Correção esperada: ${issue.recommendation}`);
    console.log("");
  }

  const summary = summarize(issues);

  console.log("Resumo:");
  console.log(`high: ${summary.high}`);
  console.log(`medium: ${summary.medium}`);
  console.log(`low: ${summary.low}`);
  console.log(`total: ${summary.total}`);
  console.log("Resultado: FAIL");
}

function main() {
  const contract = readContract(DEFAULT_CONTRACT);
  const contractIssues = validateContract(contract, DEFAULT_CONTRACT);
  const issues = contractOnly
    ? contractIssues
    : [...contractIssues, ...runAudit(contract)];

  if (jsonOutput) {
    console.log(
      JSON.stringify(
        { contract: contract.contractId, issues, summary: summarize(issues) },
        null,
        2,
      ),
    );
  } else {
    printTextReport(contract, issues);
  }

  const hasBlockingIssues = issues.some((issue) =>
    ["high", "medium"].includes(issue.severity),
  );

  if (expectFail) {
    if (hasBlockingIssues) {
      process.exit(0);
    }

    console.error(
      "ERRO: --expect-fail foi usado, mas o auditor não encontrou violações.",
    );
    process.exit(1);
  }

  process.exit(hasBlockingIssues ? 1 : 0);
}

try {
  main();
} catch (error) {
  console.error("ERRO: auditor UI/UX falhou durante a execução.");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
