#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];

    if (!value.startsWith("--")) {
      continue;
    }

    const next = argv[index + 1];

    if (next && !next.startsWith("--")) {
      parsed[value] = next;
      index += 1;
    } else {
      parsed[value] = true;
    }
  }

  return parsed;
}

function runGit(args, fallback = "") {
  try {
    return execFileSync("git", args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch {
    return fallback;
  }
}

function normalize(filePath) {
  return filePath.replaceAll("\\", "/").replace(/^\.\//, "");
}

function repoRoot() {
  const root = runGit(["rev-parse", "--show-toplevel"]);

  if (!root) {
    throw new Error("Este script precisa ser executado dentro de um repositório Git.");
  }

  return root;
}

function escapeRegex(value) {
  return value.replace(/[.+^${}()|[\]\\]/g, "\\$&");
}

function globToRegex(pattern) {
  const normalized = normalize(pattern);
  const regex = normalized
    .split("**")
    .map((part) => part.split("*").map(escapeRegex).join("[^/]*"))
    .join(".*");

  return new RegExp(`^${regex}$`);
}

function matchesPattern(file, pattern) {
  const normalizedFile = normalize(file);
  const normalizedPattern = normalize(pattern);

  if (normalizedPattern.endsWith("/**")) {
    const prefix = normalizedPattern.slice(0, -3);
    return normalizedFile === prefix || normalizedFile.startsWith(`${prefix}/`);
  }

  if (normalizedPattern.endsWith("/")) {
    return normalizedFile.startsWith(normalizedPattern);
  }

  if (normalizedPattern.includes("*")) {
    return globToRegex(normalizedPattern).test(normalizedFile);
  }

  return normalizedFile === normalizedPattern || normalizedFile.startsWith(`${normalizedPattern}/`);
}

function unique(values) {
  return [...new Set(values.filter(Boolean).map(normalize))].sort();
}

function gitChangedFiles(baseRef) {
  const committed = runGit([
    "diff",
    "--name-only",
    "--diff-filter=ACMRTUXB",
    `${baseRef}..HEAD`,
  ])
    .split("\n")
    .filter(Boolean);

  const unstaged = runGit(["diff", "--name-only"]).split("\n").filter(Boolean);
  const staged = runGit(["diff", "--cached", "--name-only"]).split("\n").filter(Boolean);
  const untracked = runGit(["ls-files", "--others", "--exclude-standard"])
    .split("\n")
    .filter(Boolean);

  return unique([...committed, ...unstaged, ...staged, ...untracked]);
}

function collectFiles(targets) {
  const files = [];

  for (const target of targets) {
    const normalizedTarget = normalize(target);

    if (!existsSync(normalizedTarget)) {
      continue;
    }

    const stats = statSync(normalizedTarget);

    if (stats.isFile()) {
      files.push(normalizedTarget);
      continue;
    }

    if (stats.isDirectory()) {
      const stack = [normalizedTarget];

      while (stack.length > 0) {
        const current = stack.pop();

        for (const entry of readdirSync(current, { withFileTypes: true })) {
          const fullPath = normalize(path.join(current, entry.name));

          if (entry.isDirectory()) {
            stack.push(fullPath);
          } else {
            files.push(fullPath);
          }
        }
      }
    }
  }

  return unique(files);
}

function isTextLike(file) {
  return /\.(md|txt|json|js|mjs|ts|tsx|py|yml|yaml|css|html|sh)$/i.test(file);
}

function readText(file) {
  return readFileSync(file, "utf8");
}

const args = parseArgs(process.argv.slice(2));
const contractPath = args["--contract"];

if (!contractPath) {
  console.error(
    "Uso: node scripts/governance/validate-ai-delivery.mjs --contract caminho/contrato.json [--base origin/main] [--report caminho.md]",
  );
  process.exit(2);
}

const root = repoRoot();
process.chdir(root);

if (!existsSync(contractPath)) {
  console.error(`Contrato não encontrado: ${contractPath}`);
  process.exit(2);
}

const contract = JSON.parse(readFileSync(contractPath, "utf8"));
const baseRef = args["--base"] || contract.baseRef || "origin/main";
const reportPath = args["--report"] || contract.reportPath || "";

const failures = [];
const warnings = [];
const report = [];

function fail(message) {
  failures.push(message);
}

function section(title) {
  report.push(`\n## ${title}\n`);
}

function line(value) {
  report.push(value);
}

const changedFiles = gitChangedFiles(baseRef);

section("Validação de Entrega IA");
line(`- Contrato: \`${contractPath}\``);
line(`- Nome: ${contract.name || "sem nome"}`);
line(`- Base Git: \`${baseRef}\``);
line(`- Arquivos alterados detectados: ${changedFiles.length}`);

section("Arquivos alterados");
if (changedFiles.length === 0) {
  line("- Nenhum arquivo alterado detectado.");
} else {
  for (const file of changedFiles) {
    line(`- \`${file}\``);
  }
}

for (const requiredFile of contract.requiredFiles || []) {
  if (!existsSync(requiredFile)) {
    fail(`Arquivo obrigatório ausente: ${requiredFile}`);
  } else if (statSync(requiredFile).isFile() && statSync(requiredFile).size === 0) {
    fail(`Arquivo obrigatório está vazio: ${requiredFile}`);
  }
}

for (const evidenceFile of contract.evidenceFiles || []) {
  if (!existsSync(evidenceFile)) {
    fail(`Evidência obrigatória ausente: ${evidenceFile}`);
  } else if (statSync(evidenceFile).isFile() && statSync(evidenceFile).size === 0) {
    fail(`Evidência obrigatória está vazia: ${evidenceFile}`);
  }
}

if ((contract.allowedChangedPaths || []).length > 0) {
  for (const file of changedFiles) {
    const allowed = contract.allowedChangedPaths.some((pattern) => matchesPattern(file, pattern));

    if (!allowed) {
      fail(`Arquivo alterado fora do escopo permitido: ${file}`);
    }
  }
}

for (const file of changedFiles) {
  const forbidden = (contract.forbiddenChangedPaths || []).some((pattern) =>
    matchesPattern(file, pattern),
  );

  if (forbidden) {
    fail(`Arquivo alterado em escopo proibido: ${file}`);
  }
}

for (const rule of contract.requiredText || []) {
  const file = rule.file;
  const includes = rule.includes || [];

  if (!existsSync(file)) {
    fail(`Arquivo para validação textual não existe: ${file}`);
    continue;
  }

  const content = readText(file);

  for (const expected of includes) {
    if (!content.includes(expected)) {
      fail(`Texto obrigatório ausente em ${file}: ${expected}`);
    }
  }
}

for (const rule of contract.forbiddenText || []) {
  const targets = rule.paths || rule.files || [];
  const patterns = rule.patterns || [];
  const regexMode = rule.regex === true;
  const files = collectFiles(targets).filter(isTextLike);

  for (const file of files) {
    const content = readText(file);

    for (const pattern of patterns) {
      const found = regexMode
        ? new RegExp(pattern, "i").test(content)
        : content.toLowerCase().includes(String(pattern).toLowerCase());

      if (found) {
        fail(`Texto proibido encontrado em ${file}: ${pattern}`);
      }
    }
  }
}

for (const rule of contract.requiredEvidenceText || []) {
  const file = rule.file;
  const includes = rule.includes || [];

  if (!existsSync(file)) {
    fail(`Arquivo de evidência textual não existe: ${file}`);
    continue;
  }

  const content = readText(file);

  for (const expected of includes) {
    if (!content.includes(expected)) {
      fail(`Evidência textual obrigatória ausente em ${file}: ${expected}`);
    }
  }
}

for (const openApiRule of contract.requiredOpenApiPaths || []) {
  const file = openApiRule.file || "docs/api/openapi.json";
  const apiPath = openApiRule.path;

  if (!existsSync(file)) {
    fail(`OpenAPI não encontrado: ${file}`);
    continue;
  }

  const content = readText(file);

  if (!content.includes(`"${apiPath}"`)) {
    fail(`Path OpenAPI obrigatório ausente em ${file}: ${apiPath}`);
  }
}

if (contract.maxChangedFiles && changedFiles.length > contract.maxChangedFiles) {
  fail(`Quantidade de arquivos alterados excede o limite: ${changedFiles.length}/${contract.maxChangedFiles}`);
}

section("Resultado");
if (warnings.length > 0) {
  line("### Avisos");
  for (const message of warnings) {
    line(`- ⚠️ ${message}`);
  }
}

if (failures.length > 0) {
  line("### Falhas");
  for (const message of failures) {
    line(`- ❌ ${message}`);
  }
} else {
  line("- ✅ Validação estrutural aprovada.");
}

line("");
line("> Observação: esta validação é estrutural. Ela não substitui auditoria técnica, aceite visual, revisão pedagógica nem decisão humana do PO.");

if (reportPath) {
  const reportDir = path.dirname(reportPath);
  mkdirSync(reportDir, { recursive: true });
  writeFileSync(reportPath, `${report.join("\n")}\n`, "utf8");
  console.log(`Relatório gerado em: ${reportPath}`);
}

if (failures.length > 0) {
  console.error(`❌ Validação falhou com ${failures.length} falha(s).`);
  process.exit(1);
}

console.log("✅ Validação estrutural aprovada.");
