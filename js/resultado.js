/* ============================================================
   TOGA — resultado.js : O CÓDIGO DO RESULTADO
   ------------------------------------------------------------
   Estatística de turma SEM servidor e SEM coleta de dados:

   1. ao fim do dia, o aluno clica em "copiar código" — um
      texto curto (base64 do histórico + notas) vai para a
      área de transferência;
   2. o aluno manda o código ao professor por onde preferir
      (papel, chat da turma, e-mail);
   3. o professor cola os códigos em tools/painel-professor.html
      e vê a distribuição das escolhas da turma, decisão por
      decisão, e as médias por eixo.

   O código carrega APENAS as decisões do jogo — nenhum nome,
   nenhum dado pessoal. Quem identifica o aluno é o professor,
   fora do jogo, se quiser.
   ============================================================ */

window.TOGA = window.TOGA || {};

TOGA.resultado = (function () {

  const PREFIXO = "TOGA1.";
  const MAPA_ACERTO = { otimo: "o", bom: "b", ruim: "r", grave: "g", neutro: "n" };
  const DE_ACERTO = { o: "otimo", b: "bom", r: "ruim", g: "grave", n: "neutro" };

  /* base64 seguro para acentos (o histórico tem rótulos em português) */
  function paraB64(s) { return btoa(unescape(encodeURIComponent(s))); }
  function deB64(s) { return decodeURIComponent(escape(atob(s))); }

  function gerar() {
    const e = TOGA.motor.estado;
    if (!e) return "";
    const dados = {
      v: 1,
      p: e.pauta,
      r: [e.reputacao.tec, e.reputacao.hum, e.reputacao.cel, e.reputacao.imp, e.estresse || 0],
      // cada decisão: [caso, cena, índice da opção, acerto]
      // (saves antigos não guardavam o índice: vai o rótulo no lugar)
      h: e.historico.map(h => [
        h.caso, h.cena,
        (h.opcao == null ? (h.rotulo || "") : h.opcao),
        MAPA_ACERTO[h.acerto] || "n"
      ])
    };
    return PREFIXO + paraB64(JSON.stringify(dados));
  }

  function ler(codigo) {
    codigo = String(codigo || "").trim();
    if (codigo.indexOf(PREFIXO) !== 0) return null;
    try {
      const d = JSON.parse(deB64(codigo.slice(PREFIXO.length)));
      if (!d || d.v !== 1 || !Array.isArray(d.h)) return null;
      return {
        pauta: d.p,
        reputacao: { tec: d.r[0], hum: d.r[1], cel: d.r[2], imp: d.r[3] },
        estresse: d.r[4] || 0,
        historico: d.h.map(item => ({
          caso: item[0], cena: item[1],
          opcao: (typeof item[2] === "number") ? item[2] : null,
          rotulo: (typeof item[2] === "string") ? item[2] : null,
          acerto: DE_ACERTO[item[3]] || "neutro"
        }))
      };
    } catch (e) { return null; }
  }

  /* copia para a área de transferência, com plano B universal */
  function copiar(aoTerminar) {
    const codigo = gerar();
    if (!codigo) return;
    function avisar(ok) { if (aoTerminar) aoTerminar(ok, codigo); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(codigo).then(
        function () { avisar(true); },
        function () { window.prompt("Copie o código do seu resultado:", codigo); avisar(false); }
      );
    } else {
      window.prompt("Copie o código do seu resultado:", codigo);
      avisar(false);
    }
  }

  return { gerar: gerar, ler: ler, copiar: copiar };
})();
