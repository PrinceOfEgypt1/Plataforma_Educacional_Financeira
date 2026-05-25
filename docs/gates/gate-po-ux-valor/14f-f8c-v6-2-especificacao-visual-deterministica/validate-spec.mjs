#!/usr/bin/env node
/**
 * validate-spec.mjs — Validação Estrutural da Especificação Visual Determinística
 * Item 14F-F8C-v6.2 — Módulo Imóvel
 *
 * Exit code 0 = tudo passou
 * Exit code 1 = falha estrutural encontrada
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = resolve(__dirname);

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
let failures = 0;
let warnings = 0;

function pass(msg) {
  console.log(`  ✓  ${msg}`);
}

function fail(msg) {
  console.error(`  ✗  FALHA: ${msg}`);
  failures++;
}

function section(title) {
  console.log(`\n── ${title}`);
}

function readFile(filename) {
  const path = resolve(BASE, filename);
  if (!existsSync(path)) return null;
  return readFileSync(path, 'utf8');
}

function containsAll(content, terms, filename, context) {
  let ok = true;
  for (const term of terms) {
    if (!content.includes(term)) {
      fail(`${filename}: termo obrigatório ausente "${term}" [${context}]`);
      ok = false;
    }
  }
  return ok;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Presença de todos os arquivos obrigatórios
// ─────────────────────────────────────────────────────────────────────────────
section('1. Presença dos arquivos obrigatórios');

const requiredFiles = [
  'ESPECIFICACAO_VISUAL_DETERMINISTICA_IMOVEL.md',
  'DESIGN_SYSTEM_IMOVEL_DETERMINISTICO.md',
  'MATRIZ_ETAPAS_ABAS_COMPONENTES.md',
  'MATRIZ_CRITERIOS_ACEITE_VISUAL.md',
  'CONTRATO_VISUAL_IMOVEL_V6_2.json',
  'WIREFRAME_TEXTUAL_DETERMINISTICO.md',
  'AUTOVALIDACAO_E_AUDITORIA.md',
  'validate-spec.mjs',
];

for (const f of requiredFiles) {
  if (existsSync(resolve(BASE, f))) {
    pass(f);
  } else {
    fail(`Arquivo ausente: ${f}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Presença das 7 etapas em documentos chave
// ─────────────────────────────────────────────────────────────────────────────
section('2. Presença das 7 etapas');

const etapas = ['Preparar', 'Simular', 'Resultado', 'Entender', 'Comparar', 'Conferir', 'Decidir'];

const wireframe = readFile('WIREFRAME_TEXTUAL_DETERMINISTICO.md');
const especificacao = readFile('ESPECIFICACAO_VISUAL_DETERMINISTICA_IMOVEL.md');
const matriz = readFile('MATRIZ_ETAPAS_ABAS_COMPONENTES.md');
const criterios = readFile('MATRIZ_CRITERIOS_ACEITE_VISUAL.md');
const contrato = readFile('CONTRATO_VISUAL_IMOVEL_V6_2.json');

if (wireframe) {
  for (const etapa of etapas) {
    if (wireframe.includes(`Etapa`) && wireframe.includes(etapa)) {
      pass(`Etapa "${etapa}" presente no wireframe`);
    } else {
      fail(`Etapa "${etapa}" ausente no WIREFRAME_TEXTUAL_DETERMINISTICO.md`);
    }
  }
} else {
  fail('WIREFRAME_TEXTUAL_DETERMINISTICO.md não pôde ser lido');
}

if (especificacao) {
  for (const etapa of etapas) {
    if (especificacao.includes(etapa)) {
      pass(`Etapa "${etapa}" presente na especificação`);
    } else {
      fail(`Etapa "${etapa}" ausente em ESPECIFICACAO_VISUAL_DETERMINISTICA_IMOVEL.md`);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Presença das abas obrigatórias por etapa — NOME EXATO
// ─────────────────────────────────────────────────────────────────────────────
section('3. Presença das abas obrigatórias por etapa (nome exato)');

// Nome canônico das abas. "SAC x PRICE" usa a letra "x" minúscula como
// separador, NÃO o sinal de multiplicação "\u00D7". Isto é exigência da auditoria.
const abasObrigatorias = {
  'Preparar':  ['Visão Geral', 'Entrada', 'Valor Financiado', 'SAC x PRICE', 'Cuidados'],
  'Simular':   ['Dados do Imóvel', 'Condições', 'Custos', 'Sistema', 'Resumo'],
  'Resultado': ['Resumo', 'Cenário', 'Alertas', 'Interpretação'],
  'Entender':  ['Parcela', 'Amortização', 'Juros', 'Saldo Devedor', 'SAC x PRICE'],
  'Comparar':  ['Resumo Comparativo', 'Tabela SAC', 'Tabela PRICE', 'Gráfico', 'Leitura Pedagógica'],
  'Conferir':  ['Fórmulas SAC', 'Fórmulas PRICE', 'Variáveis', 'Passo a Passo', 'Auditoria'],
  'Decidir':   ['Diagnóstico', 'Checklist', 'Próximos Passos', 'Cuidados', 'Conclusão'],
};

// Documentos onde a presença das abas por nome EXATO é obrigatória.
const docsObrigatoriosParaAbas = {
  'ESPECIFICACAO_VISUAL_DETERMINISTICA_IMOVEL.md': especificacao,
  'MATRIZ_ETAPAS_ABAS_COMPONENTES.md': matriz,
  'WIREFRAME_TEXTUAL_DETERMINISTICO.md': wireframe,
};

for (const [filename, content] of Object.entries(docsObrigatoriosParaAbas)) {
  if (!content) {
    fail(`${filename}: documento não pôde ser lido`);
    continue;
  }
  for (const [etapa, abas] of Object.entries(abasObrigatorias)) {
    for (const aba of abas) {
      // Match EXATO (substring direto, sem regex que pudesse mascarar).
      if (content.includes(aba)) {
        pass(`Aba "${aba}" (${etapa}) presente em ${filename}`);
      } else {
        fail(`Aba obrigatória ausente por nome EXATO: "${aba}" (etapa ${etapa}) em ${filename}`);
      }
    }
  }
}

// Verificação adicional no CONTRATO JSON: abas por nome exato na estrutura.
if (contrato) {
  try {
    const obj = JSON.parse(contrato);
    const abasPorEtapa = obj?.arquitetura_navegacao?.camada_2?.abas_por_etapa;
    if (abasPorEtapa) {
      const mapEtapaParaKey = {
        'Preparar':  'preparar',
        'Simular':   'simular',
        'Resultado': 'resultado',
        'Entender':  'entender',
        'Comparar':  'comparar',
        'Conferir':  'conferir',
        'Decidir':   'decidir',
      };
      for (const [etapa, abas] of Object.entries(abasObrigatorias)) {
        const key = mapEtapaParaKey[etapa];
        const abasContrato = abasPorEtapa[key] || [];
        for (const aba of abas) {
          if (abasContrato.includes(aba)) {
            pass(`Contrato JSON: aba "${aba}" presente em ${key}[]`);
          } else {
            fail(`Contrato JSON: aba "${aba}" ausente em arquitetura_navegacao.camada_2.abas_por_etapa.${key} (esperado match exato)`);
          }
        }
      }
    }
  } catch (e) {
    fail(`Contrato JSON: erro ao validar abas — ${e.message}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3.B. ANTI-SUBSTITUIÇÃO: "SAC" sozinho como aba em Preparar/Entender é proibido
// ─────────────────────────────────────────────────────────────────────────────
section('3.B. Anti-substituição: "SAC" sozinho não pode substituir "SAC x PRICE"');

// Detecta padrões como "Aba 1.X — SAC" ou "Aba 4.X — SAC" sem "x PRICE" depois.
// Cobre formatos comuns do wireframe e da matriz:
//   ### Aba 1.4 — SAC
//   ### Aba 4.5 — SAC
//   ### Aba 1.4 — SAC \u00D7 PRICE  (sinal U+00D7 — também proibido se restasse)
const padroesSubstituicao = [
  // wireframe: "### Aba 1.X — SAC" sem "x PRICE"
  /^#{1,6}\s*Aba\s+1\.\d+\s*[—–-]\s*SAC\s*$/m,
  /^#{1,6}\s*Aba\s+4\.\d+\s*[—–-]\s*SAC\s*$/m,
  // matriz: "### Aba 1.X — SAC" sem "x PRICE"
  // padrão de tabela markdown: "| Aba 1.4 | SAC |" sem "x PRICE"
  // Detecta o sinal de multiplicação U+00D7 (proibido — usar letra x)
  /^#{1,6}\s*Aba\s+1\.\d+\s*[—–-]\s*SAC\s*\u00D7\s*PRICE/m,
  /^#{1,6}\s*Aba\s+4\.\d+\s*[—–-]\s*SAC\s*\u00D7\s*PRICE/m,
];

for (const [filename, content] of Object.entries(docsObrigatoriosParaAbas)) {
  if (!content) continue;
  let problemasNoArquivo = 0;
  for (const padrao of padroesSubstituicao) {
    if (padrao.test(content)) {
      const linhaIdx = content.split('\n').findIndex(l => padrao.test(l));
      fail(`${filename}:${linhaIdx + 1} — padrão proibido detectado: ${padrao}`);
      problemasNoArquivo++;
    }
  }
  if (problemasNoArquivo === 0) {
    pass(`${filename}: sem substituição "SAC" sozinho nas abas Preparar/Entender`);
  }
}

// Adicional: contar substring "\u00D7 PRICE" para garantir zero ocorrências do
// caractere de multiplicação (que invalida a busca exata da auditoria).
let totalMultiplicacao = 0;
for (const [filename, content] of Object.entries(docsObrigatoriosParaAbas)) {
  if (!content) continue;
  const matches = content.match(/\u00D7 PRICE/g) || [];
  if (matches.length > 0) {
    fail(`${filename}: ${matches.length} ocorrência(s) do sinal "\u00D7" (multiplicação) em "\u00D7 PRICE" — deveria ser "x" (letra)`);
    totalMultiplicacao += matches.length;
  }
}
if (totalMultiplicacao === 0) {
  pass('Nenhuma ocorrência do sinal "\u00D7" (multiplicação) em "\u00D7 PRICE" — usar sempre letra "x"');
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Presença do cenário financeiro fixo
// ─────────────────────────────────────────────────────────────────────────────
section('4. Cenário financeiro fixo nos documentos');

const cenarioTermos = [
  '870.000',
  '700.000',
  '170.000',
  '120',
  '0,85',
  '205',
  '24.600',
];

for (const doc of [especificacao, wireframe, matriz]) {
  if (doc) {
    for (const termo of cenarioTermos) {
      if (doc.includes(termo)) {
        pass(`Cenário "${termo}" presente`);
      } else {
        fail(`Cenário "${termo}" AUSENTE em um dos documentos principais`);
      }
    }
    break; // Checa apenas o primeiro disponível para não repetir
  }
}

// Checar no contrato JSON
if (contrato) {
  const contratoObj = JSON.parse(contrato);
  const cf = contratoObj.cenario_financeiro_fixo;
  if (!cf) {
    fail('CONTRATO_VISUAL_IMOVEL_V6_2.json: cenario_financeiro_fixo ausente');
  } else {
    if (cf.valor_imovel === 870000) pass('Contrato: valor_imovel = 870000');
    else fail(`Contrato: valor_imovel esperado 870000, encontrado ${cf.valor_imovel}`);

    if (cf.entrada === 700000) pass('Contrato: entrada = 700000');
    else fail(`Contrato: entrada esperado 700000, encontrado ${cf.entrada}`);

    if (cf.valor_financiado === 170000) pass('Contrato: valor_financiado = 170000');
    else fail(`Contrato: valor_financiado esperado 170000, encontrado ${cf.valor_financiado}`);

    if (cf.prazo_meses === 120) pass('Contrato: prazo_meses = 120');
    else fail(`Contrato: prazo_meses esperado 120, encontrado ${cf.prazo_meses}`);

    if (cf.taxa_mensal === 0.0085) pass('Contrato: taxa_mensal = 0.0085');
    else fail(`Contrato: taxa_mensal esperado 0.0085, encontrado ${cf.taxa_mensal}`);

    if (cf.encargos_mensais === 205) pass('Contrato: encargos_mensais = 205');
    else fail(`Contrato: encargos_mensais esperado 205, encontrado ${cf.encargos_mensais}`);

    if (cf.encargos_totais === 24600) pass('Contrato: encargos_totais = 24600');
    else fail(`Contrato: encargos_totais esperado 24600, encontrado ${cf.encargos_totais}`);

    if (cf.IMUTAVEL === true) pass('Contrato: IMUTAVEL = true');
    else fail('Contrato: flag IMUTAVEL ausente ou false');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Regra de comparação justa SAC x PRICE
// ─────────────────────────────────────────────────────────────────────────────
section('5. Regra de comparação justa SAC x PRICE');

const regraJustaCandidatos = [especificacao, wireframe, criterios, contrato];
const termosJustaComparacao = [
  'base justa',
  'mesma taxa',
  'mesmo prazo',
  'mesmo principal',
];

for (const termo of termosJustaComparacao) {
  let found = false;
  for (const doc of regraJustaCandidatos) {
    if (doc && doc.toLowerCase().includes(termo.toLowerCase())) {
      found = true;
      break;
    }
  }
  if (found) pass(`Regra base justa: "${termo}" presente`);
  else fail(`Regra base justa: "${termo}" ausente em todos os documentos`);
}

if (contrato) {
  const contratoObj = JSON.parse(contrato);
  const rj = contratoObj?.cenario_financeiro_fixo?.regra_comparacao_justa;
  if (rj) {
    if (rj.mesmo_principal === true) pass('Contrato: regra_comparacao_justa.mesmo_principal = true');
    else fail('Contrato: regra_comparacao_justa.mesmo_principal não é true');
    if (rj.mesmo_prazo === true) pass('Contrato: regra_comparacao_justa.mesmo_prazo = true');
    else fail('Contrato: regra_comparacao_justa.mesmo_prazo não é true');
    if (rj.mesma_taxa === true) pass('Contrato: regra_comparacao_justa.mesma_taxa = true');
    else fail('Contrato: regra_comparacao_justa.mesma_taxa não é true');
  } else {
    fail('Contrato: regra_comparacao_justa ausente em cenario_financeiro_fixo');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. Regras de rolagem
// ─────────────────────────────────────────────────────────────────────────────
section('6. Regras de rolagem');

const termosRolagem = ['824px', 'overflow', 'rolagem', 'scrollbar', '1920', '1080'];

for (const termo of termosRolagem) {
  let found = false;
  for (const doc of [especificacao, wireframe, contrato]) {
    if (doc && doc.includes(termo)) { found = true; break; }
  }
  if (found) pass(`Regra rolagem: "${termo}" presente`);
  else fail(`Regra rolagem: "${termo}" ausente nos documentos principais`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. Regras de Aurora Gradient Border
// ─────────────────────────────────────────────────────────────────────────────
section('7. Regras de Aurora Gradient Border');

const designSystem = readFile('DESIGN_SYSTEM_IMOVEL_DETERMINISTICO.md');

const termosAurora = ['Aurora', 'aurora', 'Gradient Border', 'gradient border'];
let auroraFound = false;
for (const doc of [designSystem, especificacao, contrato]) {
  for (const t of termosAurora) {
    if (doc && doc.includes(t)) { auroraFound = true; break; }
  }
  if (auroraFound) break;
}
if (auroraFound) pass('Aurora Gradient Border mencionado nos documentos');
else fail('Aurora Gradient Border ausente em todos os documentos');

if (designSystem) {
  if (designSystem.includes('prefers-reduced-motion')) pass('Design System: prefers-reduced-motion presente');
  else fail('Design System: regra prefers-reduced-motion ausente');
  if (designSystem.includes('máximo 2') || designSystem.includes('max') || designSystem.includes('2 elementos')) pass('Design System: limite de 2 elementos aurora por tela mencionado');
  else fail('Design System: limite de elementos aurora por tela ausente');
}

if (contrato) {
  const contratoObj = JSON.parse(contrato);
  const aurora = contratoObj?.aurora_gradient_border;
  if (aurora) {
    if (aurora.max_elementos_por_tela === 2) pass('Contrato: max_elementos_por_tela = 2');
    else fail(`Contrato: max_elementos_por_tela esperado 2, encontrado ${aurora.max_elementos_por_tela}`);
    if (Array.isArray(aurora.usos_permitidos) && aurora.usos_permitidos.length >= 3) pass('Contrato: usos_permitidos definidos');
    else fail('Contrato: usos_permitidos ausente ou insuficiente');
  } else {
    fail('Contrato: aurora_gradient_border ausente');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. Critérios de aceite
// ─────────────────────────────────────────────────────────────────────────────
section('8. Critérios de aceite');

if (criterios) {
  if (criterios.includes('BLOQUEANTE')) pass('MATRIZ_CRITERIOS_ACEITE_VISUAL: critérios BLOQUEANTE presentes');
  else fail('MATRIZ_CRITERIOS_ACEITE_VISUAL: nenhum critério BLOQUEANTE encontrado');
  if (criterios.includes('RECOMENDADO')) pass('MATRIZ_CRITERIOS_ACEITE_VISUAL: critérios RECOMENDADO presentes');
  else fail('MATRIZ_CRITERIOS_ACEITE_VISUAL: nenhum critério RECOMENDADO encontrado');
  if (criterios.includes('Como Validar') || criterios.includes('Como validar')) pass('MATRIZ_CRITERIOS_ACEITE_VISUAL: coluna "Como Validar" presente');
  else fail('MATRIZ_CRITERIOS_ACEITE_VISUAL: coluna "Como Validar" ausente');
  if (criterios.includes('Evidência') || criterios.includes('evidência')) pass('MATRIZ_CRITERIOS_ACEITE_VISUAL: coluna "Evidência Esperada" presente');
  else fail('MATRIZ_CRITERIOS_ACEITE_VISUAL: coluna "Evidência" ausente');
} else {
  fail('MATRIZ_CRITERIOS_ACEITE_VISUAL.md não pôde ser lido');
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. Matriz etapa/aba/componente
// ─────────────────────────────────────────────────────────────────────────────
section('9. Matriz etapa/aba/componente');

if (matriz) {
  const camposMatrix = ['Objetivo', 'Layout', 'Componentes', 'Critério de aceite'];
  for (const campo of camposMatrix) {
    if (matriz.includes(campo)) pass(`Matriz: coluna/campo "${campo}" presente`);
    else fail(`Matriz: coluna/campo "${campo}" ausente`);
  }
  for (const etapa of etapas) {
    if (matriz.includes(`Etapa`) && matriz.includes(etapa)) pass(`Matriz: etapa "${etapa}" presente`);
    else fail(`Matriz: etapa "${etapa}" ausente`);
  }
} else {
  fail('MATRIZ_ETAPAS_ABAS_COMPONENTES.md não pôde ser lido');
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. Ausência de termos proibidos (placeholders usados como conteúdo real)
// ─────────────────────────────────────────────────────────────────────────────
section('10. Ausência de termos proibidos (placeholders como conteúdo)');

// Regras de detecção:
// - "TODO" somente uppercase com word boundary (evita falso positivo com "todos" em PT-BR)
// - "placeholder", "definir depois", "ajustar futuramente", "a definir" somente quando NÃO
//   precedidos por aspas, "Nenhum", "Proibido", "ausência", "evitar" — indicadores de que
//   o termo aparece numa REGRA de proibição, não como conteúdo de especificação.
// - "TBD" e "WIP" com word boundary, case-insensitive (siglas em inglês sem contexto PT)

function hasProhibitedTerm(content) {
  const lines = content.split('\n');
  const issues = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // TODO standalone uppercase (não "todos", não "todo", não entre aspas como referência à regra)
    if (/\bTODO\b/.test(line)) {
      const isQuoted = /["'`]TODO["'`]/.test(line);
      const isRuleContext = /nenhum|proibido|ausência|ausencia|evitar|critério|não deve|proibições/i.test(line);
      if (!isQuoted && !isRuleContext) {
        issues.push({ lineNum, line: line.trim(), term: 'TODO' });
      }
    }

    // placeholder — apenas quando não está numa linha de regra/proibição
    if (/placeholder/i.test(line)) {
      const isRuleContext = /nenhum|proibido|ausência|ausencia|evitar|não deve|critério|não usar/i.test(line);
      const isQuoted = /["'`]placeholder["'`]/.test(line);
      if (!isRuleContext && !isQuoted) {
        issues.push({ lineNum, line: line.trim(), term: 'placeholder' });
      }
    }

    // "definir depois" — apenas fora de contexto de regra
    if (/definir depois/i.test(line)) {
      const isRuleContext = /nenhum|proibido|ausência|ausencia|evitar|critério|não deve/i.test(line);
      const isQuoted = /["'`]definir depois["'`]/.test(line);
      if (!isRuleContext && !isQuoted) {
        issues.push({ lineNum, line: line.trim(), term: 'definir depois' });
      }
    }

    // "ajustar futuramente" — apenas fora de contexto de regra
    if (/ajustar futuramente/i.test(line)) {
      const isRuleContext = /nenhum|proibido|ausência|ausencia|evitar|critério|não deve/i.test(line);
      const isQuoted = /["'`]ajustar futuramente["'`]/.test(line);
      if (!isRuleContext && !isQuoted) {
        issues.push({ lineNum, line: line.trim(), term: 'ajustar futuramente' });
      }
    }

    // TBD / WIP standalone (siglas em inglês que indicam conteúdo inacabado)
    if (/\bTBD\b/.test(line) || /\bWIP\b/.test(line)) {
      issues.push({ lineNum, line: line.trim(), term: 'TBD/WIP' });
    }
  }

  return issues;
}

const docsParaChecar = {
  'ESPECIFICACAO_VISUAL_DETERMINISTICA_IMOVEL.md': especificacao,
  'DESIGN_SYSTEM_IMOVEL_DETERMINISTICO.md': designSystem,
  'MATRIZ_ETAPAS_ABAS_COMPONENTES.md': matriz,
  'MATRIZ_CRITERIOS_ACEITE_VISUAL.md': criterios,
  'WIREFRAME_TEXTUAL_DETERMINISTICO.md': wireframe,
};

for (const [filename, content] of Object.entries(docsParaChecar)) {
  if (!content) continue;
  const issues = hasProhibitedTerm(content);
  if (issues.length === 0) {
    pass(`Sem termos proibidos como conteúdo em ${filename}`);
  } else {
    for (const issue of issues) {
      fail(`Termo proibido "${issue.term}" em ${filename}:${issue.lineNum} — "${issue.line.substring(0,80)}"`);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. Confirmação de que a entrega é documental (não implementação React)
// ─────────────────────────────────────────────────────────────────────────────
section('11. Natureza da entrega (documental, não React)');

// Checar que não existem arquivos .tsx, .ts, .jsx, .css fora do esperado
import { readdirSync } from 'fs';
const files = readdirSync(BASE);
const reactFiles = files.filter(f =>
  f.endsWith('.tsx') || f.endsWith('.jsx') || f.endsWith('.ts') && f !== 'validate-spec.mjs'
);

if (reactFiles.length === 0) {
  pass('Nenhum arquivo React/TypeScript encontrado no diretório — entrega é documental');
} else {
  fail(`Arquivos React/TypeScript encontrados (indevidos): ${reactFiles.join(', ')}`);
}

if (especificacao) {
  if (especificacao.includes('NÃO é para implementar React') || especificacao.includes('Implementação React') || especificacao.includes('Fora do escopo')) {
    pass('Especificação: escopo não-React declarado explicitamente');
  } else {
    fail('Especificação: ausência de declaração explícita de não-implementação React');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. Contrato JSON — validação de estrutura
// ─────────────────────────────────────────────────────────────────────────────
section('12. Integridade do CONTRATO_VISUAL_IMOVEL_V6_2.json');

if (contrato) {
  try {
    const obj = JSON.parse(contrato);
    pass('JSON válido (parse sem erros)');

    const camposObrigatorios = [
      'cenario_financeiro_fixo',
      'arquitetura_navegacao',
      'design_system',
      'restricoes_rolagem',
      'restricoes_tabelas',
      'restricoes_formularios',
      'aurora_gradient_border',
      'restricoes_graficos',
      'regras_bloqueantes',
      'aprovacao_humana',
    ];

    for (const campo of camposObrigatorios) {
      if (obj[campo] !== undefined) pass(`Contrato: campo "${campo}" presente`);
      else fail(`Contrato: campo "${campo}" ausente`);
    }

    // Verificar aprovacao_humana
    if (obj.aprovacao_humana?.obrigatoria === true) pass('Contrato: aprovacao_humana.obrigatoria = true');
    else fail('Contrato: aprovacao_humana.obrigatoria não é true');

    if (obj.aprovacao_humana?.ia_pode_declarar_aprovado === false) pass('Contrato: ia_pode_declarar_aprovado = false');
    else fail('Contrato: ia_pode_declarar_aprovado deve ser false');

    // Verificar 7 etapas no contrato
    const etapasContrato = obj?.arquitetura_navegacao?.camada_1?.etapas;
    if (Array.isArray(etapasContrato) && etapasContrato.length === 7) {
      pass('Contrato: 7 etapas definidas em arquitetura_navegacao');
    } else {
      fail(`Contrato: esperado 7 etapas, encontrado ${etapasContrato?.length ?? 0}`);
    }

    // Verificar abas por etapa
    const abasContrato = obj?.arquitetura_navegacao?.camada_2?.abas_por_etapa;
    if (abasContrato) {
      for (const etapaKey of ['preparar', 'simular', 'resultado', 'entender', 'comparar', 'conferir', 'decidir']) {
        if (Array.isArray(abasContrato[etapaKey]) && abasContrato[etapaKey].length >= 4) {
          pass(`Contrato: abas da etapa "${etapaKey}" definidas (${abasContrato[etapaKey].length} abas)`);
        } else {
          fail(`Contrato: abas da etapa "${etapaKey}" ausentes ou insuficientes`);
        }
      }
    } else {
      fail('Contrato: abas_por_etapa ausente');
    }

  } catch (e) {
    fail(`CONTRATO_VISUAL_IMOVEL_V6_2.json: JSON inválido — ${e.message}`);
  }
} else {
  fail('CONTRATO_VISUAL_IMOVEL_V6_2.json não pôde ser lido');
}

// ─────────────────────────────────────────────────────────────────────────────
// Resultado Final
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n' + '═'.repeat(60));
if (failures === 0) {
  console.log(`\n  RESULTADO: PASSOU — 0 falhas estruturais encontradas.\n`);
  console.log('  Esta entrega foi autoverificada estruturalmente, mas');
  console.log('  permanece pendente de aprovação visual e funcional do PO.\n');
  process.exit(0);
} else {
  console.error(`\n  RESULTADO: FALHOU — ${failures} falha(s) estrutural(is) encontrada(s).\n`);
  console.error('  Corrija as falhas antes de declarar a entrega como completa.\n');
  process.exit(1);
}
