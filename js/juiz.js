/* ============================================================
   TOGA — juiz.js : QUEM VESTE A TOGA
   ------------------------------------------------------------
   O jogador escolhe quem é o juiz ou a juíza: gênero, tom de
   pele, cabelo. A escolha vale em todo lugar onde o magistrado
   aparece — o boneco 3D, o preview do menu, o cartão do dia —
   e adapta os VOCATIVOS dos textos ("doutor" → "doutora").

   A adaptação de vocativo é cirúrgica e tem limites assumidos:
   - "doutor"/"Doutor" solto (sem nome próprio em seguida) é
     praticamente sempre o juiz — troca segura em todo o jogo;
   - "o senhor" também é usado ENTRE as partes (interrogatórios),
     então só troca nos textos sempre dirigidos ao juiz
     (interlúdios, corredor, despachos) — nunca nas falas de
     audiência.
   ============================================================ */

window.TOGA = window.TOGA || {};

TOGA.juiz = (function () {

  const CHAVE = "toga.juiz.v1";

  /* os mesmos tons de pele usados pelos personagens do jogo */
  const PELES = ["#8a5436", "#a86a48", "#c98e66", "#d8a87f", "#e8c39a"];
  const CABELOS = ["curto", "calvo", "coque", "longo"];
  const CORES_CABELO = ["#241a10", "#574737", "#b9b3a6", "#1d1209"];

  const PADRAO = { genero: "m", pele: "#d8a87f", cabelo: "curto", corCabelo: "#241a10" };

  let cfg = null;

  function get() {
    if (cfg) return cfg;
    try { cfg = Object.assign({}, PADRAO, JSON.parse(localStorage.getItem(CHAVE)) || {}); }
    catch (e) { cfg = Object.assign({}, PADRAO); }
    return cfg;
  }

  function salvar(novo) {
    cfg = Object.assign({}, get(), novo || {});
    try { localStorage.setItem(CHAVE, JSON.stringify(cfg)); } catch (e) {}
    // o mundo 3D, se já estiver de pé, troca o boneco na hora;
    // o retrato do cartão também acompanha
    if (TOGA.cena3d && TOGA.cena3d.aplicarJuiz) TOGA.cena3d.aplicarJuiz();
    if (TOGA.cartao && TOGA.cartao.atualizarRetrato) TOGA.cartao.atualizarRetrato();
    return cfg;
  }

  /* o avatar no formato que cena.js (2D) e boneco.js (3D) entendem */
  function avatar() {
    const c = get();
    return { pele: c.pele, cabelo: c.cabelo, corCabelo: c.corCabelo, traje: "toga" };
  }

  function ehJuiza() { return get().genero === "f"; }

  /* ---------- Vocativos ----------
     "doutor"/"Doutor" NÃO seguido de nome próprio → doutora.
     ("Dr. Estêvão" usa abreviação e fica intacto.)          */
  function adaptar(texto) {
    if (!ehJuiza() || !texto) return texto;
    return String(texto)
      .replace(/\bdoutor\b(?!a)(?!\s+[A-ZÀ-Ú])/g, "doutora")
      .replace(/\bDoutor\b(?!a)(?!\s+[A-ZÀ-Ú])/g, "Doutora")
      // concordância dos artigos/contrações que sobraram
      .replace(/\bao doutora\b/g, "à doutora")
      .replace(/\bdo doutora\b/g, "da doutora")
      .replace(/\bpro doutora\b/g, "pra doutora")
      .replace(/\bo doutora\b/g, "a doutora")
      .replace(/\bO doutora\b/g, "A doutora")
      .replace(/\bAo doutora\b/g, "À doutora");
  }

  /* versão completa, só para textos SEMPRE dirigidos ao juiz
     (interlúdios, corredor, resultado de despachos)          */
  function adaptarDireto(texto) {
    if (!ehJuiza() || !texto) return texto;
    return adaptar(texto)
      .replace(/\bo senhor\b/g, "a senhora")
      .replace(/\bO senhor\b/g, "A senhora")
      .replace(/\bao senhor\b/g, "à senhora")
      .replace(/\bdo senhor\b/g, "da senhora")
      .replace(/\bpro senhor\b/g, "pra senhora");
  }

  return {
    get: get, salvar: salvar, avatar: avatar, ehJuiza: ehJuiza,
    adaptar: adaptar, adaptarDireto: adaptarDireto,
    PELES: PELES, CABELOS: CABELOS, CORES_CABELO: CORES_CABELO
  };
})();
