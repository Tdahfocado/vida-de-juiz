/* ============================================================
   TOGA — narrador.js : NARRAÇÃO POR VOZ (acessibilidade)
   ------------------------------------------------------------
   Lê as falas da audiência em voz alta usando a Web Speech API
   (speechSynthesis) — funciona OFFLINE com as vozes instaladas
   no sistema do jogador. Procura uma voz pt-BR; aceita pt-PT
   como reserva; sem voz em português, avisa na chave do menu.

   É experimental porque a qualidade da voz varia muito de um
   sistema para outro — por isso é uma chave própria, desligada
   por padrão. Enquanto narra, o som ambiente abaixa ("ducking")
   para a voz não brigar com o fórum.
   ============================================================ */

window.TOGA = window.TOGA || {};

TOGA.narrador = (function () {
  const suportado = "speechSynthesis" in window;
  let ligado = false;
  let voz = null;

  function escolherVoz() {
    if (!suportado) return null;
    const vozes = window.speechSynthesis.getVoices() || [];
    return vozes.find(v => v.lang === "pt-BR") ||
           vozes.find(v => (v.lang || "").indexOf("pt") === 0) || null;
  }

  // as vozes carregam de forma assíncrona em alguns navegadores
  if (suportado) {
    voz = escolherVoz();
    window.speechSynthesis.addEventListener &&
      window.speechSynthesis.addEventListener("voiceschanged", function () { voz = escolherVoz(); });
  }

  function falar(texto) {
    if (!ligado || !suportado || !texto) return;
    try {
      window.speechSynthesis.cancel();          // a fala nova interrompe a anterior
      const u = new SpeechSynthesisUtterance(texto);
      if (voz) u.voice = voz;
      u.lang = (voz && voz.lang) || "pt-BR";
      u.rate = 1.05;
      if (TOGA.audio) {
        TOGA.audio.ducking(true);
        u.onend = u.onerror = function () { TOGA.audio.ducking(false); };
      }
      window.speechSynthesis.speak(u);
    } catch (e) { /* sem voz? o jogo segue mudo */ }
  }

  function calar() {
    if (suportado) try { window.speechSynthesis.cancel(); } catch (e) {}
    if (TOGA.audio) TOGA.audio.ducking(false);
  }

  return {
    get suportado() { return suportado; },
    get temVozPt() { return !!(voz || escolherVoz()); },
    get ligado() { return ligado; },
    set ligado(v) { ligado = !!v; if (!v) calar(); },
    falar: falar,
    calar: calar
  };
})();
