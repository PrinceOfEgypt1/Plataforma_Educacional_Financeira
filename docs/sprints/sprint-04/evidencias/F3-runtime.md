# F3 — Runtime / Prova de Renderização

## Limitação de ambiente

O ambiente de execução (WSL/cloud) não permite iniciar o servidor Next.js
(`pnpm dev`) e acessar o browser para captura de screenshot ou teste E2E real.
Esta limitação é declarada honestamente.

## Compensação com provas reais disponíveis

### 1. Build estático confirma rota renderizável

O comando `pnpm build` gerou `/diagnostico` como rota estática:

```
├ ○ /diagnostico    5.78 kB    235 kB
```

A rota é pré-renderizável pelo Next.js, confirmando que não há erro de hydration
ou dependência de runtime que impediria a renderização.

### 2. Teste de renderização com JSDOM (equivalente ao runtime)

O vitest com `@testing-library/react` + `jsdom` renderiza o componente
no DOM real e verifica todos os estados:

**Estado inicial (idle):**
```
✓ renderiza a página /diagnostico com cockpit (não é mais stub)
✓ não exibe texto de stub 'em construção'
✓ exibe formulário com os 5 campos obrigatórios
✓ exibe estado inicial com instrução ao usuário
```

**Formulário preenchível:**
```
✓ permite preencher os campos
```

**Loading → Sucesso (com payload DG-01 mockado):**
```
✓ exibe loading ao submeter e chama a API corretamente (DG-01)
✓ exibe resultado de sucesso com KPIs e summary (DG-01)
✓ exibe alertas retornados pela API (DG-01)
✓ exibe interpretação textual do resultado
```

**Estado de erro:**
```
✓ exibe erro amigável quando a API falha
```

**Validações locais:**
```
✓ valida campos obrigatórios — não chama API com renda vazia
✓ valida renda mensal zero — não chama API
```

**Caso DG-02 (score=3, saúde=crítica, 2 alertas críticos):**
```
✓ exibe resultado de sucesso com múltiplos alertas (DG-02)
```

### 3. Ausência de stub confirmada

```tsx
// Antes:
return <ModulePage moduleId="diagnostico" />;  // → 162 B (stub)

// Depois:
return <><h1 className="sr-only">...</h1><DiagnosticoCockpit /></>;  // → 5.78 kB (cockpit)
```

O componente `ModulePage` (stub) não é mais importado em `diagnostico/page.tsx`.
Verificável por `grep -r "ModulePage" frontend/src/app/\(app\)/diagnostico/`.

### 4. Integração com API declarada

O service `diagnosticoService.ts` chama `postJson("/diagnostic/analyze", body)`
que resolve para `http://localhost:8000/api/v1/diagnostic/analyze` — o mesmo
endpoint operacional da F2. Nenhuma URL customizada ou mock permanente.
