# PEF · 14F-F8E · Protótipo Visual Final-Candidate

**Frente:** 14F-F8E — Reprojeto visual obrigatório pós-reprovação F8D
**Tipo de entrega:** Protótipo visual navegável, off-repo, sem backend, sem fórmula financeira oficial, sem implementação React real.
**Status:** Pronto para avaliação visual humana de Moisés (PO).
**Sprint 5:** Não liberada. A liberação depende da aprovação visual desta entrega.

---

## Como abrir

```
1. Abra o arquivo index.html em um navegador moderno (Chromium, Firefox, Safari, Edge atualizados).
2. Não é necessário backend, servidor, banco de dados ou frontend real.
3. Não há build, npm install ou pnpm install. O arquivo é autônomo e usa apenas:
   - Google Fonts (DM Sans + DM Mono) por CDN
   - HTML/CSS/JS puro inline
```

Caso queira garantir cache e renderização correta em viewport específico:

```
file://<caminho-absoluto>/PEF_14F_F8E_prototipo_visual_final_candidate/index.html
```

ou sirva localmente:

```
python3 -m http.server 8000
# abra http://localhost:8000/index.html
```

---

## O que este protótipo é

- Um **single-page application** estático que demonstra visualmente as **7 etapas** da jornada educacional do módulo Financiamento Imobiliário.
- Cada etapa tem **5 abas internas navegáveis por clique**, totalizando 35 painéis.
- Usa estritamente os tokens visuais Observatory Dark Cards do contrato F8C-v6.3 (paleta, tipografia DM Sans + DM Mono, cards escuros premium).
- Usa o **cenário fixo** definido em contrato (R$ 870.000 imóvel, R$ 700.000 entrada, R$ 170.000 financiado, 120 meses, 0,85% a.m., R$ 205 de encargos).
- Demonstra em contexto real os 7 componentes obrigatórios: **ScoreCard, MetricCard, ChecklistCard, BeforeAfterCard, QuestionCard / Insight, InsightBox, ApplyCard**.

## O que este protótipo NÃO é

- **Não é** implementação React real.
- **Não é** integração com backend.
- **Não é** motor financeiro oficial — os números são demonstrativos e consistentes com o cenário fixo, mas o cálculo oficial precisa ser portado depois.
- **Não é** aceite visual — só o PO Moisés pode declarar isso.
- **Não é** liberação da Sprint 5.

---

## Estrutura da entrega

```
PEF_14F_F8E_prototipo_visual_final_candidate/
├── index.html                              ← protótipo navegável
├── README.md                               ← este arquivo
├── RELATORIO_REPROJETO_VISUAL_F8E.md       ← relatório de execução
├── MATRIZ_ACEITE_VISUAL_F8E.md             ← checklist de aceite visual
├── MATRIZ_COMPARACAO_ANTIRREFERENCIA_F8D.md← comparação honesta vs F8D reprovada
├── DELIVERY_CONTRACT.json                  ← contrato auditável da entrega
├── SHA256SUMS.txt                          ← hashes dos artefatos
├── autovalidacao.sh                        ← script de autovalidação
├── evidencias/
│   └── COMO_VALIDAR_VISUALMENTE.md         ← instrução de captura manual
└── zip/
    └── PEF_14F_F8E_prototipo_visual_final_candidate.zip
```

---

## Próximo passo

1. Moisés abre `index.html`.
2. Moisés navega pelas 7 etapas e pelas 5 abas de cada etapa.
3. Moisés avalia visualmente seguindo `MATRIZ_ACEITE_VISUAL_F8E.md`.
4. Se aprovado: nasce a frente **F8F** com escopo de implementação React real, exigindo fidelidade visual ao protótipo aprovado.
5. Se reprovado: nova rodada de protótipo antes de qualquer linha de React.

---

## Adaptação ambiental honesta

O prompt F8E especificava entrega em `/home/moses/workspace/_deliveries/`. Esta entrega foi materializada em ambiente cloud efêmero (`/home/user/Plataforma_Educacional_Financeira/_deliveries/`) sob a feature branch `claude/quirky-cori-1L5sD` para sobreviver à reciclagem do container. **Nenhum arquivo foi escrito em `frontend/`, `backend/`, `infra/`, `docker/`, API ou fórmulas financeiras. Não há PR aberta. `main` permanece intacta em `991d242`.** Detalhes completos em `RELATORIO_REPROJETO_VISUAL_F8E.md` §7.
