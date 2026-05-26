#!/usr/bin/env node
/**
 * validate-observatory-cards.mjs
 * Item 14F-F8C-v6.3 — Adendo Visual Observatory Dark Cards
 * Valida estrutura, tokens, tipografia, UI Elements e invariantes do adendo.
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── helpers ─────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const failures = [];

function check(id, description, condition) {
  if (condition) {
    console.log(`  ✓ [${id}] ${description}`);
    passed++;
  } else {
    console.error(`  ✗ [${id}] ${description}`);
    failed++;
    failures.push({ id, description });
  }
}

function readFile(filename) {
  const p = resolve(__dirname, filename);
  if (!existsSync(p)) return null;
  return readFileSync(p, 'utf8');
}

function allContain(contents, term) {
  return contents.every(c => c !== null && c.includes(term));
}

// ── load files ───────────────────────────────────────────────────────────────

const FILES = [
  'README_ITEM_14F_F8C_V6_3.md',
  'ADENDO_VISUAL_OBSERVATORY_DARK_CARDS_IMOVEL.md',
  'DESIGN_SYSTEM_OBSERVATORY_DARK_CARDS.md',
  'MATRIZ_UI_ELEMENTS_PARA_IMOVEL.md',
  'CRITERIOS_ACEITE_VISUAL_OBSERVATORY_CARDS.md',
  'CONTRATO_VISUAL_IMOVEL_V6_3.json',
  'AUTOVALIDACAO_E_AUDITORIA.md',
  'validate-observatory-cards.mjs',
];

const contents = {};
for (const f of FILES) {
  contents[f] = readFile(f);
}

const allMd = FILES.filter(f => f.endsWith('.md')).map(f => contents[f]);
const allFiles = FILES.map(f => contents[f]);

// ── CHECK 1: existência dos 8 arquivos ──────────────────────────────────────

console.log('\n[1] Existência dos 8 arquivos obrigatórios');
for (const f of FILES) {
  check('1.' + FILES.indexOf(f), `Arquivo existe: ${f}`, contents[f] !== null);
}

// ── CHECK 2: presença de DM Sans ────────────────────────────────────────────

console.log('\n[2] Presença de DM Sans');
check('2.1', 'DM Sans em ADENDO', contents['ADENDO_VISUAL_OBSERVATORY_DARK_CARDS_IMOVEL.md']?.includes('DM Sans'));
check('2.2', 'DM Sans em DESIGN_SYSTEM', contents['DESIGN_SYSTEM_OBSERVATORY_DARK_CARDS.md']?.includes('DM Sans'));
check('2.3', 'DM Sans em CONTRATO JSON', contents['CONTRATO_VISUAL_IMOVEL_V6_3.json']?.includes('DM Sans'));

// ── CHECK 3: presença de DM Mono ────────────────────────────────────────────

console.log('\n[3] Presença de DM Mono');
check('3.1', 'DM Mono em ADENDO', contents['ADENDO_VISUAL_OBSERVATORY_DARK_CARDS_IMOVEL.md']?.includes('DM Mono'));
check('3.2', 'DM Mono em DESIGN_SYSTEM', contents['DESIGN_SYSTEM_OBSERVATORY_DARK_CARDS.md']?.includes('DM Mono'));
check('3.3', 'DM Mono em CONTRATO JSON', contents['CONTRATO_VISUAL_IMOVEL_V6_3.json']?.includes('DM Mono'));

// ── CHECK 4: tokens de cor obrigatórios ─────────────────────────────────────

console.log('\n[4] Tokens de cor obrigatórios');
const TOKEN_VALS = [
  '#030811', '#0a1628', '#0f1e35', '#1a2f50',
  '#3b82f6', '#06b6d4', '#f59e0b', '#10b981',
  '#ef4444', '#e2e8f0', '#64748b', '#94a3b8',
];
const designSystem = contents['DESIGN_SYSTEM_OBSERVATORY_DARK_CARDS.md'] || '';
const adendo = contents['ADENDO_VISUAL_OBSERVATORY_DARK_CARDS_IMOVEL.md'] || '';
const contrato = contents['CONTRATO_VISUAL_IMOVEL_V6_3.json'] || '';

for (const token of TOKEN_VALS) {
  check('4', `Token ${token} presente em DESIGN_SYSTEM`, designSystem.includes(token));
}

// ── CHECK 5: escala tipográfica completa ────────────────────────────────────

console.log('\n[5] Escala tipográfica completa');
const TYPO_TERMS = [
  'Score label', 'Score value', 'Score note',
  'Mini label', 'Mini value',
  'Checklist header', 'Checklist number', 'Checklist field', 'Checklist description', 'Checklist example',
  'Before/After', 'Question title', 'Question text',
  'Apply tag', 'Apply title',
  'Body', 'Header eyebrow', 'Section h2',
];
for (const term of TYPO_TERMS) {
  check('5', `Escala tipográfica contém: "${term}"`, designSystem.includes(term));
}

// ── CHECK 6: tokens de layout ───────────────────────────────────────────────

console.log('\n[6] Tokens de layout');
const LAYOUT_TERMS = [
  '1100px', 'score-grid', 'task-grid', 'ba-grid', 'q-grid', 'apply-grid',
  'repeat(3, 1fr)', 'repeat(2, 1fr)', '1fr 1fr',
];
for (const term of LAYOUT_TERMS) {
  check('6', `Layout token presente: "${term}"`, designSystem.includes(term) || adendo.includes(term));
}

// ── CHECK 7: 7 UI Elements obrigatórios ─────────────────────────────────────

console.log('\n[7] Presença dos 7 UI Elements obrigatórios');
const UI_ELEMENTS = [
  'ScoreCard', 'MetricCard', 'ChecklistCard',
  'BeforeAfterCard', 'QuestionCard', 'InsightBox', 'ApplyCard',
];
for (const el of UI_ELEMENTS) {
  check('7', `UI Element presente: ${el}`, contrato.includes(el));
}

// ── CHECK 8: 7 etapas da jornada ────────────────────────────────────────────

console.log('\n[8] Presença das 7 etapas da jornada');
const ETAPAS = [
  'Preparar', 'Simular', 'Resultado', 'Entender', 'Comparar', 'Conferir', 'Decidir',
];
const matriz = contents['MATRIZ_UI_ELEMENTS_PARA_IMOVEL.md'] || '';
for (const etapa of ETAPAS) {
  check('8', `Etapa presente: ${etapa}`, matriz.includes(etapa));
}

// ── CHECK 9: presença de "SAC x PRICE" ──────────────────────────────────────

console.log('\n[9] Presença de "SAC x PRICE" (letra x minúscula)');
check('9.1', '"SAC x PRICE" em ADENDO', adendo.includes('SAC x PRICE'));
check('9.2', '"SAC x PRICE" em DESIGN_SYSTEM', designSystem.includes('SAC x PRICE'));
check('9.3', '"SAC x PRICE" em MATRIZ', matriz.includes('SAC x PRICE'));

// ── CHECK 10: ausência de sinal de multiplicação Unicode ────────────────────

console.log('\n[10] Ausência de sinal de multiplicação Unicode em "SAC"');
const MULT_SIGN = '×';
const allTextForMult = [adendo, designSystem, matriz, contrato,
  contents['README_ITEM_14F_F8C_V6_3.md'] || '',
  contents['CRITERIOS_ACEITE_VISUAL_OBSERVATORY_CARDS.md'] || ''].join('\n');

// Check for "SAC" followed by multiplication sign (allow it elsewhere)
const sacMultPattern = /SAC\s*×/;
check('10.1', 'Ausência de "SAC × PRICE" com Unicode U+00D7 nos documentos principais', !sacMultPattern.test(allTextForMult));

// ── CHECK 11: declaração de ausência de implementação React ─────────────────

console.log('\n[11] Declaração de ausência de implementação React');
const REACT_TERMS = [
  'implementacao_react_autorizada', 'NÃO implementa React', 'implementação React',
];
check('11.1', 'CONTRATO JSON declara implementacao_react_autorizada', contrato.includes('implementacao_react_autorizada'));
check('11.2', 'ADENDO declara ausência de React', adendo.includes('implementação React') || adendo.includes('NÃO implementa React'));
check('11.3', 'README declara ausência de React', (contents['README_ITEM_14F_F8C_V6_3.md'] || '').includes('React'));

// ── CHECK 12: declaração de frontend/backend proibidos ──────────────────────

console.log('\n[12] Declaração de proibição de frontend/backend');
check('12.1', 'ADENDO proíbe frontend', adendo.includes('frontend'));
check('12.2', 'ADENDO proíbe backend', adendo.includes('backend'));
check('12.3', 'CONTRATO JSON lista frontend como proibido', contrato.includes('alterar frontend'));
check('12.4', 'CONTRATO JSON lista backend como proibido', contrato.includes('alterar backend'));

// ── CHECK 13: JSON válido do contrato v6.3 ──────────────────────────────────

console.log('\n[13] JSON válido do CONTRATO_VISUAL_IMOVEL_V6_3.json');
let contratoJson = null;
try {
  contratoJson = JSON.parse(contrato);
  check('13.1', 'CONTRATO_VISUAL_IMOVEL_V6_3.json é JSON válido', true);
} catch (e) {
  check('13.1', `CONTRATO_VISUAL_IMOVEL_V6_3.json é JSON válido (ERRO: ${e.message})`, false);
}

// ── CHECK 14: implementacao_react_autorizada = false ────────────────────────

console.log('\n[14] Campo implementacao_react_autorizada = false');
check('14.1', 'implementacao_react_autorizada === false', contratoJson?.implementacao_react_autorizada === false);

// ── CHECK 15: fidelidade_visual.interpretacao_livre_permitida = false ────────

console.log('\n[15] Campo fidelidade_visual.interpretacao_livre_permitida = false');
check('15.1', 'interpretacao_livre_permitida === false', contratoJson?.fidelidade_visual?.interpretacao_livre_permitida === false);

// ── CHECK 16: fidelidade_visual.exigir_tamanho_tipo_cor_fontes = true ───────

console.log('\n[16] Campo fidelidade_visual.exigir_tamanho_tipo_cor_fontes = true');
check('16.1', 'exigir_tamanho_tipo_cor_fontes === true', contratoJson?.fidelidade_visual?.exigir_tamanho_tipo_cor_fontes === true);

// ── CHECK 17: fidelidade_visual.exigir_cor_fundo_cards = true ───────────────

console.log('\n[17] Campo fidelidade_visual.exigir_cor_fundo_cards = true');
check('17.1', 'exigir_cor_fundo_cards === true', contratoJson?.fidelidade_visual?.exigir_cor_fundo_cards === true);

// ── CHECK 18: fidelidade_visual.exigir_texto_bem_distribuido = true ──────────

console.log('\n[18] Campo fidelidade_visual.exigir_texto_bem_distribuido = true');
check('18.1', 'exigir_texto_bem_distribuido === true', contratoJson?.fidelidade_visual?.exigir_texto_bem_distribuido === true);

// ── CHECK 19: aprovacao_humana.obrigatoria = true ────────────────────────────

console.log('\n[19] Campo aprovacao_humana.obrigatoria = true');
check('19.1', 'aprovacao_humana.obrigatoria === true', contratoJson?.aprovacao_humana?.obrigatoria === true);

// ── CHECK 20: ia_pode_declarar_aprovado = false ──────────────────────────────

console.log('\n[20] Campo ia_pode_declarar_aprovado = false');
check('20.1', 'ia_pode_declarar_aprovado === false', contratoJson?.aprovacao_humana?.ia_pode_declarar_aprovado === false);

// ── SUMMARY ─────────────────────────────────────────────────────────────────

console.log('\n' + '─'.repeat(60));
console.log(`Resultado: ${passed} checks passaram, ${failed} falharam.`);

if (failed > 0) {
  console.error('\nFalhas bloqueantes:');
  for (const f of failures) {
    console.error(`  ✗ [${f.id}] ${f.description}`);
  }
  console.error('\n[BLOQUEADO] Adendo v6.3 não passa na validação estrutural.');
  process.exit(1);
} else {
  console.log('\n[OK] Todos os checks estruturais passaram.');
  console.log('     Lembrete: aceite visual humano ainda depende do PO (Moisés).');
  console.log('     Implementação React NÃO autorizada até aceite humano explícito.');
  process.exit(0);
}
