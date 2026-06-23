# Evidências Visuais — F8F-A

## Justificativa de captura manual

Esta sessão cloud headless não dispõe de Chromium/Playwright para captura
automática de screenshots em múltiplos viewports. Portanto, adotamos a opção
de captura manual orientada (item 10.5 do prompt F8F).

A validação visual final fica sob responsabilidade do PO Moisés, que abre
localmente a rota `/financiamento-imobiliario` e compara contra o protótipo
oficial `docs/gates/gate-po-ux-valor/14f-f8e-aj1-aceite-visual/artefatos/index.html`.

## Como rodar localmente

```bash
git checkout claude/f8f-implementacao-react-fiel-f8e-aj1
cd frontend
pnpm install
pnpm dev
# abrir http://localhost:3000/financiamento-imobiliario
```

## Quatro capturas obrigatórias

### 1. Desktop · 1920×1080
- Abrir DevTools → Toggle Device Toolbar → ajustar para `1920 × 1080`.
- Capturar **Etapa 1 · Visão Geral** (estado inicial).
- Repetir para **Etapa 3 · Resumo** (após clicar em Calcular na Etapa 2.5), **Etapa 5 · Resumo Comparativo** (após clicar em "Comparar SAC x PRICE"), **Etapa 7 · Conclusão**.

### 2. Notebook · 1366×768
- Capturar **Etapa 2 · Resumo** (CTA Aurora visível) e **Etapa 5 · Tabela SAC**.

### 3. Tablet · 768×1024
- Capturar **Etapa 1 · Visão Geral** e **Etapa 6 · Fórmulas SAC**.

### 4. Mobile · 390×844
- Capturar **Etapa 3 · Resumo** e **Etapa 7 · Conclusão**.

## Checklist visual

Ao percorrer as 7 etapas e 35 abas, validar:

- [ ] Stepper sticky com etapa atual destacada por gradiente azul/ciano.
- [ ] Pílula de cenário fixo no topo (Imóvel/Entrada/Financiado/Prazo/Taxa) em formato monetário completo.
- [ ] Banner de governança no rodapé com aviso F8F-A.
- [ ] Status pill "F8F-A · fiel F8E-AJ1" no canto superior direito.
- [ ] Tipografia DM Sans + DM Mono carregadas.
- [ ] Cards com paleta Observatory (`#030811` fundo, `#0a1628` surface, etc).
- [ ] CTA Aurora na Etapa 2.5 visível e clicável.
- [ ] Após clicar Calcular, navegação automática para Etapa 3.
- [ ] Etapa 3 mostra dados reais do backend (3 ScoreCards + AuroraCard).
- [ ] Etapa 5.1 exige clicar em "Comparar" para carregar dados.
- [ ] Tabelas SAC e PRICE (5.2/5.3) paginadas com dados reais.
- [ ] Gráfico (5.4) renderiza com dados do backend.
- [ ] Etapa 6.5 ChecklistCard com 3 verificações OK derivadas do resultado.
- [ ] Etapa 7.5 hero de conclusão com CTA reiniciar.

## Conferência contra protótipo F8E-AJ1

Abra paralelamente em outra aba:
```
docs/gates/gate-po-ux-valor/14f-f8e-aj1-aceite-visual/artefatos/index.html
```

E percorra as mesmas 7 etapas. A matriz `MATRIZ_FIDELIDADE_VISUAL_F8E_AJ1.md`
registra item a item a fidelidade alcançada (63 PASS / 7 PARCIAL / 0 FAIL).

## Estado deste arquivo

Quando as capturas forem realizadas, anexar em:
```
docs/gates/gate-po-ux-valor/14f-f8f-implementacao-react-fiel-f8e-aj1/screenshots/
├── desktop-1920x1080-etapa1.png
├── desktop-1920x1080-etapa3.png
├── desktop-1920x1080-etapa5.png
├── desktop-1920x1080-etapa7.png
├── notebook-1366x768-etapa2.png
├── notebook-1366x768-tabela-sac.png
├── tablet-768x1024-etapa1.png
├── tablet-768x1024-formulas.png
├── mobile-390x844-etapa3.png
└── mobile-390x844-etapa7.png
```

Até que essas capturas estejam disponíveis, a **validação visual humana**
permanece **pendente** e o **aceite visual final segue dependente do PO**.
