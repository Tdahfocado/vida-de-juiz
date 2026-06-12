/* ============================================================
   TOGA — audio.js : SOM com plano B
   ------------------------------------------------------------
   Cada som tem até duas fontes, nesta ordem:

   1. ARQUIVO em assets/audio/ — tocado via HTMLAudioElement,
      que funciona em file:// (fetch/decodeAudioData NÃO
      funcionam em file://, por isso nada de Web Audio para
      arquivos). A pasta pode estar VAZIA: aí vale o plano B.
   2. SÍNTESE via Web Audio — o navegador "fabrica" o som,
      como o martelo do cena.js sempre fez.

   Ou seja: colocar bons .mp3 na pasta MELHORA o jogo; não
   colocar nada não quebra coisa alguma. Tudo respeita a chave
   de som do menu (TOGA.som.ligado).
   ============================================================ */

window.TOGA = window.TOGA || {};

TOGA.audio = (function () {

  /* ---------- Web Audio: contexto preguiçoso ---------- */
  let ctx = null;
  function audioCtx() {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  }

  function ruido(duracao, ganho, aoFiltro) {
    try {
      const c = audioCtx(), t = c.currentTime;
      const fonte = c.createBufferSource();
      const buf = c.createBuffer(1, c.sampleRate * duracao, c.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
      fonte.buffer = buf;
      const g = c.createGain();
      g.gain.value = ganho;
      let no = fonte;
      if (aoFiltro) { const f = aoFiltro(c); no.connect(f); no = f; }
      no.connect(g).connect(c.destination);
      fonte.start(t);
    } catch (e) { /* sem áudio? o jogo segue */ }
  }

  function tom(freqIni, freqFim, duracao, ganho, tipo) {
    try {
      const c = audioCtx(), t = c.currentTime;
      const osc = c.createOscillator();
      const g = c.createGain();
      osc.type = tipo || "sine";
      osc.frequency.setValueAtTime(freqIni, t);
      if (freqFim !== freqIni) osc.frequency.exponentialRampToValueAtTime(Math.max(1, freqFim), t + duracao);
      g.gain.setValueAtTime(ganho, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + duracao);
      osc.connect(g).connect(c.destination);
      osc.start(t); osc.stop(t + duracao + 0.05);
    } catch (e) { /* idem */ }
  }

  /* ---------- Os sons do fórum (síntese) ---------- */
  function sintPapel()   { ruido(0.14, 0.18, function (c) { const f = c.createBiquadFilter(); f.type = "highpass"; f.frequency.value = 1400; return f; }); }
  function sintPassos()  { ruido(0.05, 0.10, function (c) { const f = c.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 600; return f; }); }
  function sintMurmurio(){ ruido(0.7, 0.10, function (c) { const f = c.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 420; return f; }); }
  function sintSino()    { tom(880, 880, 0.7, 0.16, "sine"); tom(1318, 1318, 0.5, 0.08, "sine"); }
  function sintAlgemas() {
    tom(2600, 2100, 0.05, 0.12, "square");
    setTimeout(function () { tom(2200, 1700, 0.06, 0.10, "square"); }, 70);
    setTimeout(function () { ruido(0.04, 0.08, function (c) { const f = c.createBiquadFilter(); f.type = "highpass"; f.frequency.value = 3000; return f; }); }, 40);
  }
  function sintGrave()   { tom(96, 44, 0.55, 0.30, "triangle"); }
  function sintMartelo() { if (TOGA.cena2d && TOGA.cena2d.somMartelo) TOGA.cena2d.somMartelo(); }
  function sintFoco()    { tom(1320, 1100, 0.07, 0.06, "sine"); }   // blip suave ao focar
  function sintLatido()  {
    tom(520, 380, 0.08, 0.16, "square");
    setTimeout(function () { tom(560, 400, 0.09, 0.14, "square"); }, 130);
  }

  /* ---------- Registro: arquivo (opcional) + plano B ---------- */
  const SONS = {
    papel:    { src: "assets/audio/papel.mp3",     vol: 0.5,  sintese: sintPapel },
    passos:   { src: "assets/audio/passos.mp3",    vol: 0.28, sintese: sintPassos },
    murmurio: { src: "assets/audio/murmurio.mp3",  vol: 0.45, sintese: sintMurmurio },
    sino:     { src: "assets/audio/sino.mp3",      vol: 0.5,  sintese: sintSino },
    algemas:  { src: "assets/audio/algemas.mp3",   vol: 0.5,  sintese: sintAlgemas },
    grave:    { sintese: sintGrave },
    martelo:  { sintese: sintMartelo },
    foco:     { sintese: sintFoco },
    latido:   { sintese: sintLatido },
    ambiente: { src: "assets/audio/forum-ambiente.mp3", vol: 0.16, loop: true }
  };

  function ligado() { return TOGA.som && TOGA.som.ligado; }

  /* Carrega o <audio> uma única vez (na primeira tentativa de
     uso). Enquanto carrega — ou se o arquivo não existir — o
     som usa a síntese; quando "canplaythrough" chega, o
     arquivo assume dali em diante. */
  function carregar(s) {
    if (s.falhou || s.el || !s.src) { if (!s.el) s.falhou = true; return; }
    try {
      s.el = new Audio(s.src);
      s.el.volume = s.vol == null ? 1 : s.vol;
      s.el.loop = !!s.loop;
      s.el.addEventListener("canplaythrough", function () {
        s.pronto = true;
        if (s.aoCarregar) s.aoCarregar();
      }, { once: true });
      s.el.addEventListener("error", function () { s.falhou = true; s.el = null; });
    } catch (e) { s.falhou = true; }
  }

  function tocar(nome) {
    const s = SONS[nome];
    if (!s || !ligado()) return;
    carregar(s);
    if (s.pronto && s.el) {
      try {
        // clona para permitir sobreposição (dois papéis seguidos etc.)
        const inst = s.loop ? s.el : s.el.cloneNode();
        if (!s.loop) inst.volume = s.el.volume;
        const p = inst.play();
        if (p && p.catch) p.catch(function () { if (s.sintese) s.sintese(); });
        return;
      } catch (e) { /* cai na síntese */ }
    }
    if (s.sintese) s.sintese();
  }

  /* ---------- Som ambiente (loop) + "ducking" ---------- */
  let ambienteLigado = false;
  function ambiente(ligar) {
    const s = SONS.ambiente;
    ambienteLigado = !!ligar;
    carregar(s);
    if (!s.el) return;                     // sem arquivo: silêncio (sem síntese de fundo)
    if (!s.pronto) {                       // ainda baixando: toca quando estiver pronto
      s.aoCarregar = function () { if (ambienteLigado && ligado()) s.el.play().catch(function () {}); };
      return;
    }
    if (ligar && ligado()) { s.el.volume = s.vol; s.el.play().catch(function () {}); }
    else s.el.pause();
  }
  /* abaixa o fundo enquanto outra coisa importa (narração) */
  function ducking(ativo) {
    const s = SONS.ambiente;
    if (s.el && !s.falhou) s.el.volume = ativo ? s.vol * 0.3 : s.vol;
  }

  /* A chave de som do menu desliga o ambiente na hora */
  function aoMudarSom() {
    if (!ligado()) { if (SONS.ambiente.el) SONS.ambiente.el.pause(); }
    else if (ambienteLigado) ambiente(true);
  }

  /* ---------- Passos com cadência (modo 3D) ---------- */
  let ultimoPasso = 0;
  function passo() {
    const agora = performance.now();
    if (agora - ultimoPasso < 350) return;
    ultimoPasso = agora;
    tocar("passos");
  }

  return { tocar: tocar, ambiente: ambiente, ducking: ducking, passo: passo, aoMudarSom: aoMudarSom };
})();
