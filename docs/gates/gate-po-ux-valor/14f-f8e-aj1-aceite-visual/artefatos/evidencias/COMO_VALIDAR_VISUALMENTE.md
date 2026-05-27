# Como validar visualmente o protótipo F8E

Este ambiente cloud headless não permitiu captura automática de screenshots. Use as instruções abaixo para validar manualmente em **quatro viewports** e anexar as imagens nesta pasta.

---

## Pré-requisito

Abrir `../index.html` em um navegador moderno. Não é necessário backend.

```bash
cd PEF_14F_F8E_prototipo_visual_final_candidate
xdg-open index.html      # Linux
open index.html          # macOS
start index.html         # Windows
```

Ou via servidor local:

```bash
python3 -m http.server 8000
# acessar http://localhost:8000/index.html
```

---

## Quatro capturas obrigatórias

### 1. Desktop · 1920×1080

- Abra DevTools (F12) → **Toggle Device Toolbar** (Ctrl+Shift+M) → **Responsive** → digite `1920 × 1080` no campo de dimensões.
- Navegue até **Etapa 1 · Visão Geral** (estado inicial).
- Capture a tela inteira. Salve como `evidencias/desktop-1920x1080.png`.
- Repita para: **Etapa 3 · Resumo**, **Etapa 5 · Resumo Comparativo**, **Etapa 7 · Conclusão**. Sufixe os arquivos: `-etapa3`, `-etapa5`, `-etapa7`.

### 2. Notebook · 1366×768

- Em **Responsive**, ajuste para `1366 × 768`.
- Capture: **Etapa 2 · Resumo** (CTA Aurora visível) e **Etapa 5 · Tabela SAC** (paginador visível).
- Salve como `evidencias/notebook-1366x768.png` (e variações).

### 3. Tablet · 768×1024

- Em **Responsive**, ajuste para `768 × 1024` (orientação retrato).
- Capture: **Etapa 1 · Visão Geral**, **Etapa 6 · Fórmulas SAC**.
- Salve como `evidencias/tablet-768x1024.png`.

### 4. Mobile · 390×844

- Em **Responsive**, escolha o preset **iPhone 12 Pro** ou ajuste manualmente para `390 × 844`.
- Capture: **Etapa 3 · Resumo**, **Etapa 7 · Conclusão**.
- Salve como `evidencias/mobile-390x844.png`.

---

## Roteiro de avaliação em 5 minutos

| Tempo | Ação |
|---|---|
| 00:00–00:30 | Abrir e percorrer Etapa 1 (5 abas) |
| 00:30–01:00 | Etapa 2 (5 abas), terminar no CTA Aurora |
| 01:00–01:30 | Etapa 3 (5 abas), atenção aos ScoreCards e Aurora |
| 01:30–02:30 | Etapa 4 (5 abas), atenção ao gráfico de saldo e BeforeAfterCard |
| 02:30–03:30 | Etapa 5 (5 abas), atenção às tabelas paginadas e gráfico de barras |
| 03:30–04:00 | Etapa 6 (5 abas), atenção a fórmulas e ChecklistCard de auditoria |
| 04:00–05:00 | Etapa 7 (5 abas), atenção a ChecklistCard, ApplyCards e conclusão Aurora |

---

## Checklist enquanto navega

- O **stepper** muda de estado ao clicar?
- As **sub-tabs** trocam o painel sem reload?
- Os **botões Anterior / Próxima** funcionam em todas as 35 abas?
- A **pílula de cenário fixo** no topo permanece visível?
- O **banner inferior de governança** está claro e visível?
- Os **valores** (R$ 870.000, R$ 700.000, R$ 170.000, 120 meses, 0,85%, R$ 205) aparecem coerentemente?
- A **tabela SAC** e a **tabela PRICE** têm paginação funcional?
- Os **gráficos SVG** redimensionam ao mudar o viewport?
- Em **mobile 390px**, os cards empilham bem?

Use a `MATRIZ_ACEITE_VISUAL_F8E.md` na raiz para registrar formalmente cada item.

---

## Anexação de evidências

Depois da captura, esta pasta deve ficar com:

```
evidencias/
├── COMO_VALIDAR_VISUALMENTE.md     (este arquivo)
├── autovalidacao_log.txt           (gerado pelo script)
├── desktop-1920x1080.png
├── desktop-1920x1080-etapa3.png
├── desktop-1920x1080-etapa5.png
├── desktop-1920x1080-etapa7.png
├── notebook-1366x768.png
├── notebook-1366x768-tabela-sac.png
├── tablet-768x1024.png
├── tablet-768x1024-formulas.png
├── mobile-390x844.png
└── mobile-390x844-etapa7.png
```

Quando essas imagens estiverem em mãos, a auditoria visual fica fechada e o ZIP pode ser regerado com `SHA256SUMS.txt` atualizado.
