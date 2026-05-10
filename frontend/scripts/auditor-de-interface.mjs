#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SEVERITIES = ["critical-advisory", "warning", "info"];

const RULES = [
  {
    id: "financial-table-no-horizontal-overflow",
    title:
      "Tabelas financeiras sem rolagem horizontal como experiencia principal",
    severity: "critical-advisory",
  },
  {
    id: "financial-table-no-artificial-cut",
    title: "Tabelas financeiras sem cortes artificiais de linhas",
    severity: "critical-advisory",
  },
  {
    id: "financial-table-a11y",
    title: "Tabelas financeiras com caption, scope e numerais tabulares",
    severity: "warning",
  },
  {
    id: "cockpit-sticky-header-scope",
    title: "Sticky header restrito ao cabecalho da tabela do cockpit",
    severity: "warning",
  },
  {
    id: "cockpit-module-registry",
    title: "Topbar do cockpit derivada do registro de modulos",
    severity: "critical-advisory",
  },
  {
    id: "cockpit-education-panel",
    title: "Painel educativo do cockpit sem duplicidade semantica",
    severity: "warning",
  },
  {
    id: "modal-policy-contextual",
    title: "Modais, abas e navegacao contextual documentados",
    severity: "info",
  },
  {
    id: "form-accessibility",
    title: "Campos e botoes com contrato minimo de acessibilidade",
    severity: "warning",
  },
  {
    id: "living-docs-registration",
    title: "Documentacao viva registra o auditor de interface",
    severity: "warning",
  },
];

const FINANCIAL_TABLE_FILES = [
  "src/components/financing/FinanciamentoTable.tsx",
  "src/components/interest/AmortizacaoTables.tsx",
  "src/components/amortization/AmortizacaoTable.tsx",
  "src/components/ui/cockpit/CockpitTables.tsx",
];

const ROW_PRESERVATION_FILES = [
  "src/components/financing/FinanciamentoTable.tsx",
  "src/components/interest/AmortizacaoTables.tsx",
  "src/components/amortization/AmortizacaoTable.tsx",
  "src/components/ui/cockpit/CockpitTables.tsx",
  "src/components/financing/FinanciamentoCockpit.tsx",
  "src/components/interest/InterestCockpit.tsx",
  "src/components/amortization/AmortizationCockpit.tsx",
];

const REQUIRED_FILES = [
  ...FINANCIAL_TABLE_FILES,
  "src/app/globals.css",
  "src/components/ui/cockpit/FinancialCockpitShell.tsx",
  "src/components/ui/cockpit/CockpitPrimitives.tsx",
  "src/components/interest/InterestCockpit.tsx",
  "src/components/amortization/AmortizationCockpit.tsx",
  "src/config/modules.ts",
  "../docs/ui/POLITICA_MODAIS_ABAS.md",
  "../docs/_meta/living_docs.json",
];

function parseArgs(argv) {
  const args = {
    rootDir: path.resolve(fileURLToPath(new URL("..", import.meta.url))),
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--root") {
      const value = argv[index + 1];
      if (!value) {
        throw new Error("Informe um caminho apos --root.");
      }
      args.rootDir = path.resolve(value);
      index += 1;
    }
  }

  return args;
}

function readText(rootDir, relativePath) {
  const absolutePath = path.resolve(rootDir, relativePath);
  return fs.readFileSync(absolutePath, "utf8");
}

function addFinding(findings, rule, status, message, file) {
  findings.push({
    ruleId: rule.id,
    severity: status === "pass" ? "info" : rule.severity,
    status,
    message,
    file,
  });
}

function hasPattern(text, pattern) {
  return pattern.test(text);
}

function countPattern(text, pattern) {
  return [...text.matchAll(pattern)].length;
}

function auditFinancialTables(rootDir, findings) {
  const noOverflowRule = RULES.find(
    (rule) => rule.id === "financial-table-no-horizontal-overflow",
  );
  const noCutRule = RULES.find(
    (rule) => rule.id === "financial-table-no-artificial-cut",
  );
  const a11yRule = RULES.find((rule) => rule.id === "financial-table-a11y");

  for (const relativePath of FINANCIAL_TABLE_FILES) {
    const text = readText(rootDir, relativePath);
    const tableCount = countPattern(text, /<table\b/g);

    if (hasPattern(text, /overflow-x-(auto|scroll)|overflowX\s*:/)) {
      addFinding(
        findings,
        noOverflowRule,
        "fail",
        "Encontrado overflow horizontal em arquivo de tabela financeira.",
        relativePath,
      );
    } else {
      addFinding(
        findings,
        noOverflowRule,
        "pass",
        "Sem overflow horizontal como experiencia principal.",
        relativePath,
      );
    }

    if (hasPattern(text, /\.slice\s*\(/)) {
      addFinding(
        findings,
        noCutRule,
        "fail",
        "Encontrado .slice() em tabela financeira; revisar corte artificial de linhas.",
        relativePath,
      );
    } else {
      addFinding(
        findings,
        noCutRule,
        "pass",
        "Sem .slice() no arquivo de tabela financeira.",
        relativePath,
      );
    }

    if (tableCount === 0) {
      addFinding(
        findings,
        a11yRule,
        "pass",
        "Arquivo financeiro sem elemento <table>; nada a validar nesta regra.",
        relativePath,
      );
      continue;
    }

    const hasCaption = countPattern(text, /<caption\b/g) >= tableCount;
    const hasColumnScope = hasPattern(text, /scope=["']col["']/);
    const hasRowScope = hasPattern(text, /scope=["']row["']/);
    const hasTabularNums = hasPattern(text, /tabular-nums|cockpit-table/);

    if (!hasCaption || !hasColumnScope || !hasRowScope || !hasTabularNums) {
      addFinding(
        findings,
        a11yRule,
        "fail",
        [
          "Contrato incompleto:",
          !hasCaption ? "caption" : null,
          !hasColumnScope ? "scope=col" : null,
          !hasRowScope ? "scope=row" : null,
          !hasTabularNums ? "tabular-nums" : null,
        ]
          .filter(Boolean)
          .join(" "),
        relativePath,
      );
    } else {
      addFinding(
        findings,
        a11yRule,
        "pass",
        "Tabela financeira preserva caption, scope e numerais tabulares.",
        relativePath,
      );
    }
  }

  for (const relativePath of ROW_PRESERVATION_FILES) {
    const text = readText(rootDir, relativePath);
    if (hasPattern(text, /\.slice\s*\(\s*0\s*,?\s*(120|360|420|600)\b/)) {
      addFinding(
        findings,
        noCutRule,
        "fail",
        "Encontrado corte fixo de linhas em volume financeiro relevante.",
        relativePath,
      );
    }
  }
}

function auditCockpitGovernance(rootDir, findings) {
  const stickyRule = RULES.find(
    (rule) => rule.id === "cockpit-sticky-header-scope",
  );
  const registryRule = RULES.find(
    (rule) => rule.id === "cockpit-module-registry",
  );
  const educationRule = RULES.find(
    (rule) => rule.id === "cockpit-education-panel",
  );
  const accessibilityRule = RULES.find(
    (rule) => rule.id === "form-accessibility",
  );

  const css = readText(rootDir, "src/app/globals.css");
  if (
    hasPattern(css, /\.cockpit-table\s+th\s*\{[\s\S]*?position:\s*sticky/) &&
    !hasPattern(
      css,
      /\.cockpit-table\s+thead\s+th\s*\{[\s\S]*?position:\s*sticky/,
    )
  ) {
    addFinding(
      findings,
      stickyRule,
      "fail",
      "Sticky header parece aplicado a th generico, nao apenas a thead th.",
      "src/app/globals.css",
    );
  } else {
    addFinding(
      findings,
      stickyRule,
      "pass",
      "Sticky header restrito ao thead th do cockpit.",
      "src/app/globals.css",
    );
  }

  const shell = readText(
    rootDir,
    "src/components/ui/cockpit/FinancialCockpitShell.tsx",
  );
  const modules = readText(rootDir, "src/config/modules.ts");
  if (hasPattern(shell, /VISIBLE_MODULE_IDS/)) {
    addFinding(
      findings,
      registryRule,
      "fail",
      "FinancialCockpitShell ainda contem VISIBLE_MODULE_IDS.",
      "src/components/ui/cockpit/FinancialCockpitShell.tsx",
    );
  } else if (
    hasPattern(shell, /getCockpitVisibleModules/) &&
    hasPattern(modules, /visibleInCockpit/) &&
    hasPattern(modules, /function\s+getCockpitVisibleModules/)
  ) {
    addFinding(
      findings,
      registryRule,
      "pass",
      "Topbar deriva de visibleInCockpit e getCockpitVisibleModules.",
      "src/components/ui/cockpit/FinancialCockpitShell.tsx",
    );
  } else {
    addFinding(
      findings,
      registryRule,
      "fail",
      "Contrato visibleInCockpit/getCockpitVisibleModules nao foi localizado por completo.",
      "src/config/modules.ts",
    );
  }

  const primitives = readText(
    rootDir,
    "src/components/ui/cockpit/CockpitPrimitives.tsx",
  );
  const interestCockpit = readText(
    rootDir,
    "src/components/interest/InterestCockpit.tsx",
  );
  const amortizationCockpit = readText(
    rootDir,
    "src/components/amortization/AmortizationCockpit.tsx",
  );
  if (
    hasPattern(primitives, /function\s+CockpitEducationPanel/) &&
    !hasPattern(primitives, /function\s+EducationPanel/) &&
    hasPattern(interestCockpit, /CockpitEducationPanel/) &&
    hasPattern(amortizationCockpit, /CockpitEducationPanel/)
  ) {
    addFinding(
      findings,
      educationRule,
      "pass",
      "Cockpit usa CockpitEducationPanel e nao reexporta EducationPanel duplicado.",
      "src/components/ui/cockpit/CockpitPrimitives.tsx",
    );
  } else {
    addFinding(
      findings,
      educationRule,
      "fail",
      "Possivel duplicidade semantica entre EducationPanel base e cockpit.",
      "src/components/ui/cockpit/CockpitPrimitives.tsx",
    );
  }

  if (
    hasPattern(primitives, /aria-busy/) &&
    hasPattern(primitives, /aria-invalid/) &&
    hasPattern(primitives, /aria-describedby/)
  ) {
    addFinding(
      findings,
      accessibilityRule,
      "pass",
      "Primitivos do cockpit preservam aria-busy, aria-invalid e aria-describedby.",
      "src/components/ui/cockpit/CockpitPrimitives.tsx",
    );
  } else {
    addFinding(
      findings,
      accessibilityRule,
      "fail",
      "Contrato minimo de acessibilidade dos primitivos nao foi localizado.",
      "src/components/ui/cockpit/CockpitPrimitives.tsx",
    );
  }
}

function auditDocumentation(rootDir, findings) {
  const modalRule = RULES.find((rule) => rule.id === "modal-policy-contextual");
  const livingDocsRule = RULES.find(
    (rule) => rule.id === "living-docs-registration",
  );

  const modalPolicy = readText(rootDir, "../docs/ui/POLITICA_MODAIS_ABAS.md");
  if (
    hasPattern(modalPolicy, /contextual/i) &&
    hasPattern(modalPolicy, /nao.*navegacao principal/i)
  ) {
    addFinding(
      findings,
      modalRule,
      "pass",
      "Politica documenta modais como apoio contextual, nao navegacao primaria.",
      "../docs/ui/POLITICA_MODAIS_ABAS.md",
    );
  } else {
    addFinding(
      findings,
      modalRule,
      "fail",
      "Politica de modais/abas nao explicita uso contextual.",
      "../docs/ui/POLITICA_MODAIS_ABAS.md",
    );
  }

  const livingDocs = readText(rootDir, "../docs/_meta/living_docs.json");
  if (hasPattern(livingDocs, /AUDITOR_DE_INTERFACE\.md/)) {
    addFinding(
      findings,
      livingDocsRule,
      "pass",
      "Auditor de interface registrado em living_docs.",
      "../docs/_meta/living_docs.json",
    );
  } else {
    addFinding(
      findings,
      livingDocsRule,
      "fail",
      "Auditor de interface ainda nao consta em living_docs.",
      "../docs/_meta/living_docs.json",
    );
  }
}

function ensureRequiredFiles(rootDir) {
  const missing = REQUIRED_FILES.filter(
    (relativePath) => !fs.existsSync(path.resolve(rootDir, relativePath)),
  );
  if (missing.length > 0) {
    throw new Error(`Arquivos obrigatorios ausentes: ${missing.join(", ")}`);
  }
}

export function runInterfaceAudit({ rootDir } = {}) {
  const resolvedRootDir =
    rootDir ?? path.resolve(fileURLToPath(new URL("..", import.meta.url)));
  ensureRequiredFiles(resolvedRootDir);

  const findings = [];
  auditFinancialTables(resolvedRootDir, findings);
  auditCockpitGovernance(resolvedRootDir, findings);
  auditDocumentation(resolvedRootDir, findings);

  const summary = SEVERITIES.reduce(
    (accumulator, severity) => ({
      ...accumulator,
      [severity]: findings.filter((finding) => finding.severity === severity)
        .length,
    }),
    {},
  );

  return {
    tool: "auditor_de_interface",
    mode: "advisory",
    rootDir: resolvedRootDir,
    summary,
    findings,
  };
}

export function formatReport(result) {
  const lines = [
    "auditor_de_interface advisory",
    `mode: ${result.mode}`,
    `root: ${result.rootDir}`,
    "",
    "summary:",
    `  critical-advisory: ${result.summary["critical-advisory"]}`,
    `  warning: ${result.summary.warning}`,
    `  info: ${result.summary.info}`,
    "",
    "findings:",
  ];

  for (const finding of result.findings) {
    const status = finding.status === "pass" ? "OK" : "ADVISORY";
    lines.push(
      `- [${status}] ${finding.severity} ${finding.ruleId} :: ${finding.file} :: ${finding.message}`,
    );
  }

  lines.push("");
  lines.push(
    "Semantica: achados advisory nao bloqueiam a execucao; erros operacionais retornam exit code diferente de zero.",
  );

  return lines.join("\n");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const args = parseArgs(process.argv.slice(2));
    const result = runInterfaceAudit({ rootDir: args.rootDir });
    console.log(formatReport(result));
    process.exitCode = 0;
  } catch (error) {
    console.error("auditor_de_interface operational-error");
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
