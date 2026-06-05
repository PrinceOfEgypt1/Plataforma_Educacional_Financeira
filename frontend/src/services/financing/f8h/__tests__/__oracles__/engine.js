/* ============================================================
   PEF · Motor Financeiro (engine.js)
   Cálculo real de SAC e PRICE + CET + métricas derivadas.
   Exposto em window.PEF.
   ============================================================ */
(function () {
  "use strict";

  // ---- Formatação ----
  const fmtBRL = (v) =>
    "R$ " +
    (isFinite(v) ? v : 0).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  const fmtBRL0 = (v) =>
    "R$ " + Math.round(isFinite(v) ? v : 0).toLocaleString("pt-BR");
  const fmtInt = (v) => Math.round(v).toLocaleString("pt-BR");
  const fmtPct = (v, d = 2) =>
    (isFinite(v) ? v * 100 : 0).toLocaleString("pt-BR", {
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    }) + "%";
  const fmtPctRaw = (v, d = 2) =>
    (isFinite(v) ? v : 0).toLocaleString("pt-BR", {
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    }) + "%";

  // ---- Conversão de taxas ----
  const mensalParaAnual = (i) => Math.pow(1 + i, 12) - 1;
  const anualParaMensal = (a) => Math.pow(1 + a, 1 / 12) - 1;

  // ---- Tabela de amortização ----
  // system: "SAC" | "PRICE"
  // PV principal, n meses, i taxa mensal (decimal), E encargos mensais fixos
  function buildTable(system, PV, n, i, E) {
    const rows = [];
    if (n <= 0 || PV <= 0) return rows;
    let saldo = PV;
    const A_sac = PV / n;
    let pmt = 0;
    if (system === "PRICE") {
      if (i === 0) pmt = PV / n;
      else {
        const pow = Math.pow(1 + i, n);
        pmt = (PV * i * pow) / (pow - 1);
      }
    }
    for (let k = 1; k <= n; k++) {
      const j = saldo * i;
      let a;
      if (system === "SAC") a = A_sac;
      else a = pmt - j;
      // clamp último resíduo
      if (k === n) a = saldo;
      const parcelaSemEncargo = a + j;
      const total = parcelaSemEncargo + E;
      const sf = Math.max(0, saldo - a);
      rows.push({
        k,
        si: saldo,
        j,
        a,
        e: E,
        p: parcelaSemEncargo,
        t: total,
        sf,
      });
      saldo = sf;
    }
    return rows;
  }

  // ---- CET mensal por bisseção ----
  // Resolve r tal que soma( t_k / (1+r)^k ) = PV  (fluxo recebido = PV)
  // Inclui encargos => custo efetivo total.
  function cetMensal(rows, PV) {
    if (!rows.length || PV <= 0) return 0;
    const npv = (r) => {
      let s = 0;
      for (let k = 0; k < rows.length; k++)
        s += rows[k].t / Math.pow(1 + r, k + 1);
      return s - PV;
    };
    let lo = 0.0000001,
      hi = 2.0; // 0% a 200% a.m.
    // garante mudança de sinal
    if (npv(lo) < 0) return 0;
    for (let it = 0; it < 200; it++) {
      const mid = (lo + hi) / 2;
      const val = npv(mid);
      if (Math.abs(val) < 0.01) return mid;
      if (val > 0) lo = mid;
      else hi = mid;
    }
    return (lo + hi) / 2;
  }

  function summarize(system, PV, n, i, E, rows) {
    if (!rows.length) {
      return {
        system,
        PV,
        n,
        i,
        E,
        parcela1: 0,
        parcelaN: 0,
        parcelaMax: 0,
        parcelaMin: 0,
        jurosTotais: 0,
        encargosTotais: 0,
        totalPago: 0,
        pctJuros: 0,
        cetMes: 0,
        cetAno: 0,
        rows: [],
      };
    }
    let jurosTotais = 0,
      totalPago = 0,
      parcelaMax = -Infinity,
      parcelaMin = Infinity;
    for (const r of rows) {
      jurosTotais += r.j;
      totalPago += r.t;
      if (r.t > parcelaMax) parcelaMax = r.t;
      if (r.t < parcelaMin) parcelaMin = r.t;
    }
    const encargosTotais = E * n;
    const cm = cetMensal(rows, PV);
    return {
      system,
      PV,
      n,
      i,
      E,
      parcela1: rows[0].t,
      parcelaN: rows[rows.length - 1].t,
      parcela1SemEnc: rows[0].p,
      parcelaN_SemEnc: rows[rows.length - 1].p,
      parcelaMax,
      parcelaMin,
      jurosTotais,
      encargosTotais,
      totalPago,
      custoCredito: totalPago - PV,
      pctJuros: totalPago > 0 ? jurosTotais / totalPago : 0,
      cetMes: cm,
      cetAno: mensalParaAnual(cm),
      rows,
    };
  }

  // ---- API principal: computa tudo a partir dos inputs ----
  function compute(inputs) {
    const valorImovel = Math.max(0, inputs.valorImovel || 0);
    const entrada = Math.min(valorImovel, Math.max(0, inputs.entrada || 0));
    const PV = Math.max(0, valorImovel - entrada);
    const n = Math.max(1, Math.round(inputs.prazoMeses || 1));
    const i = Math.max(0, inputs.taxaMensal || 0);
    const E = Math.max(0, inputs.encargos || 0);
    const renda = Math.max(0, inputs.renda || 0);

    const rowsSAC = buildTable("SAC", PV, n, i, E);
    const rowsPRICE = buildTable("PRICE", PV, n, i, E);
    const sac = summarize("SAC", PV, n, i, E, rowsSAC);
    const price = summarize("PRICE", PV, n, i, E, rowsPRICE);

    const economia = price.totalPago - sac.totalPago; // SAC costuma ser menor
    const pctEntrada = valorImovel > 0 ? entrada / valorImovel : 0;

    const comprometimento = (parcela) => (renda > 0 ? parcela / renda : 0);

    return {
      inputs: { valorImovel, entrada, PV, n, i, E, renda },
      pctEntrada,
      taxaAnual: mensalParaAnual(i),
      sac,
      price,
      economiaSACvsPRICE: economia,
      comprometimento,
    };
  }

  window.PEF = {
    fmtBRL,
    fmtBRL0,
    fmtInt,
    fmtPct,
    fmtPctRaw,
    mensalParaAnual,
    anualParaMensal,
    buildTable,
    summarize,
    compute,
    cetMensal,
  };
})();
