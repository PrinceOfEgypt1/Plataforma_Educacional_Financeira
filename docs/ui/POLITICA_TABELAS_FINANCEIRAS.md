# POLITICA DE TABELAS FINANCEIRAS

**Projeto:** Plataforma Educacional Financeira
**Sprint:** 4.5 / F2
**Status:** documento vivo
**Base:** F0, F1 e contrato oficial de UI Components

---

## 1. Resumo executivo

Esta politica define como tabelas financeiras devem ser projetadas,
documentadas e futuramente implementadas na Plataforma Educacional Financeira.

A decisao oficial da F2 e adotar abordagem hibrida: todas as tabelas devem
obedecer a um contrato visual comum, mas a implementacao concreta pode usar um
wrapper/base comum, um componente base ou componentes por dominio quando a
semantica financeira exigir.

---

## 2. Principios

1. Integridade dos dados vem antes da composicao visual.
2. Tabela financeira nao pode esconder, cortar ou truncar linhas essenciais.
3. Rolagem horizontal nao deve ser a experiencia principal.
4. Rolagem vertical e permitida para prazos longos.
5. Cabecalho fixo e obrigatorio quando houver rolagem vertical relevante.
6. Numeros financeiros devem ser escaneaveis e comparaveis.
7. Mobile deve ter representacao propria quando a tabela ficar larga demais.
8. Acessibilidade e parte do contrato, nao acabamento opcional.

---

## 3. Definicao de tabela financeira

E tabela financeira qualquer estrutura tabular que apresente valores
monetarios, juros, saldo, parcelas, prazos, taxas, comparacoes entre cenarios,
totalizadores ou memoria de calculo.

Exemplos atuais:

- tabela de juros simples;
- tabela de juros compostos;
- tabela PRICE;
- tabela SAC;
- comparacao PRICE x SAC;
- tabela de parcelas de financiamento;
- resumo comparativo PRICE x SAC quando renderizado como `<table>`.

---

## 4. Regras proibidas

| Regra proibida | Motivo |
|---|---|
| `overflow-x-auto` como wrapper principal | Transfere problema de layout ao usuario |
| `overflow-hidden` que oculte dados financeiros | Pode esconder informacao material |
| `.slice(...)` ou limite fixo de linhas | Pode falsear prazo/custo total |
| Colunas essenciais ocultas sem alternativa equivalente | Prejudica leitura financeira |
| Tabela larga como unica experiencia mobile | Cria navegacao ruim e risco de erro |
| Paginacao falsa sem totalizadores consistentes | Quebra auditoria do calculo |
| Cabecalho sem semantica | Prejudica leitores de tela |

Excecoes devem ser documentadas na PR, classificadas por severidade e
vinculadas a uma decisao formal de Moises/Camaleao.

---

## 5. Regras obrigatorias

Toda tabela financeira deve possuir:

- titulo ou contexto claro;
- `<caption>` visivel ou `sr-only`;
- `scope="col"` em cabecalhos de coluna;
- `scope="row"` quando houver identificador de linha;
- `tabular-nums` ou fonte numerica equivalente;
- alinhamento consistente para valores monetarios;
- cabecalho fixo quando houver `max-height` e rolagem vertical;
- rolagem vertical para prazos longos;
- totalizadores quando aplicavel;
- disclaimer educacional quando a tabela puder parecer proposta formal;
- estrategia mobile definida.

---

## 6. Estrategias por viewport

### Desktop

- Tabelas de ate 6 colunas devem caber na largura util sem rolagem horizontal.
- Para prazos longos, usar altura maxima e rolagem vertical.
- Cabecalho deve permanecer fixo.
- Graficos e KPIs devem resumir antes da tabela detalhada.

### Tablet

- Reduzir padding e tamanho de texto de forma controlada.
- Colunas secundarias podem virar detalhe expansivel.
- Nao esconder coluna essencial sem alternativa.

### Mobile

Para tabelas largas, usar uma destas estrategias:

1. cards por parcela;
2. accordion expansivel por periodo;
3. tabela simplificada com detalhe expandido;
4. toggle de colunas secundarias apenas quando nao esconder informacao
   essencial.

Scroll horizontal pode existir como fallback tecnico temporario, mas nao como
experiencia principal aceita para tabelas financeiras novas.

---

## 7. Estrategias por largura de tabela

| Tamanho | Regra |
|---|---|
| Ate 4 colunas | Pode permanecer tabela responsiva simples |
| 5 a 6 colunas | Exige planejamento de largura, padding, sticky header e mobile |
| 7+ colunas | Exige decisao formal de UX antes de implementar |

---

## 8. Estrategia para 120/360/420/600 linhas

Tabelas financeiras devem suportar prazos longos sem corte artificial:

- 120 linhas: renderizacao integral esperada.
- 360 linhas: renderizacao integral com rolagem vertical e cabecalho fixo.
- 420 linhas: mesma regra de 360; validar desempenho e leitura.
- 600 linhas: renderizacao integral ou estrategia equivalente aprovada que
  preserve acesso a todas as linhas.

Se a F3/F4 identificar limite real de performance, a solucao deve preservar a
integridade da leitura, por exemplo virtualizacao acessivel, busca por periodo
ou exportacao complementar. Limite fixo silencioso e proibido.

---

## 9. Decisao de arquitetura

A F2 adota abordagem hibrida:

- contrato visual comum obrigatorio;
- componentes por dominio permitidos;
- wrapper/base comum recomendado para reduzir duplicacao;
- `FinancialTable` unico nao e obrigatorio nesta fase;
- F3/F4 decidem implementacao concreta com base no contrato.

Essa decisao evita uma abstracao monolitica prematura e tambem evita que cada
modulo invente sua propria tabela.

---

## 10. Padrao correto ilustrativo

```tsx
<FinancialTableFrame title=\"Tabela PRICE\" maxHeight=\"32rem\">
  <table>
    <caption className=\"sr-only\">Tabela PRICE periodo a periodo</caption>
    <thead className=\"sticky top-0\">
      <tr>
        <th scope=\"col\">Periodo</th>
        <th scope=\"col\">Juros</th>
        <th scope=\"col\">Amortizacao</th>
        <th scope=\"col\">Parcela</th>
        <th scope=\"col\">Saldo final</th>
      </tr>
    </thead>
    <tbody>
      {rows.map((row) => (
        <tr key={row.periodo}>
          <th scope=\"row\">{row.periodo}</th>
          <td className=\"tabular-nums\">{formatBRL(row.juros)}</td>
        </tr>
      ))}
    </tbody>
  </table>
</FinancialTableFrame>
```

O nome `FinancialTableFrame` e ilustrativo. A F3/F4 podem escolher outro nome
desde que cumpram o contrato.

---

## 11. Padroes incorretos ilustrativos

```tsx
<div className=\"overflow-x-auto\">
  <table>{rows.slice(0, 24).map(renderRow)}</table>
</div>
```

Problemas:

- usa scroll horizontal como solucao principal;
- corta linhas;
- nao evidencia acesso ao prazo completo.

```tsx
<div className=\"overflow-hidden\">
  <table>{rows.map(renderRow)}</table>
</div>
```

Problema: pode ocultar dados financeiros sem aviso.

---

## 12. Criterios para o futuro auditor_de_interface

O auditor deve sinalizar, em modo advisory:

- `overflow-x-auto` em wrapper de tabela financeira;
- `overflow-hidden` em container de dados financeiros;
- `.slice(` em componente de tabela;
- `max-height` sem cabecalho fixo;
- ausencia de `caption`;
- ausencia de `scope` em cabecalhos;
- ausencia de `tabular-nums` ou equivalente em valores monetarios;
- tabelas de 7+ colunas sem decisao formal registrada.

Enquanto advisory, o auditor nao bloqueia automaticamente. Alertas
remanescentes devem ser documentados, justificados, classificados por
severidade e rastreados.

---

## 13. Checklist de conformidade

- [ ] A tabela exibe todas as linhas relevantes.
- [ ] Nao ha `.slice` ou limite fixo silencioso.
- [ ] Nao ha `overflow-x-auto` como experiencia principal.
- [ ] Ha `caption`.
- [ ] Ha `scope` em cabecalhos.
- [ ] Valores usam numeros tabulares.
- [ ] Cabecalho e fixo quando ha scroll vertical.
- [ ] Mobile possui estrategia propria.
- [ ] Totalizadores existem quando aplicavel.
- [ ] Disclaimer educacional aparece quando necessario.

---

*Fim do POLITICA_TABELAS_FINANCEIRAS.md — Sprint 4.5/F2.*
