/* ============================================================
   TOGA 3D — nucleo3d.js : o CORAÇÃO TÉCNICO do modo 3D
   ------------------------------------------------------------
   Responsabilidades (e só elas):
   - detectar se o navegador suporta WebGL (suporta);
   - criar o renderer, a cena e as luzes base (iniciar);
   - rodar o loop de quadros (requestAnimationFrame) e
     distribuir o "tick" para quem se registrar (aoFrame);
   - pausar/retomar a renderização quando uma tela cobre
     o mundo (economia de bateria e CPU);
   - reagir a redimensionamento da janela e perda de contexto.

   Padrão do projeto: IIFE que registra TOGA.nucleo3d. Se o
   Three.js não carregou (vendor ausente), o módulo se desativa
   em silêncio — o modo 2D nunca depende deste arquivo.
   ============================================================ */

window.TOGA = window.TOGA || {};

TOGA.nucleo3d = (function () {
  if (!window.THREE) return { suporta: function () { return false; } };

  let renderer = null, scene = null, camera = null;
  let pausado = false, rodando = false;
  let callbacks = [];           // funções chamadas a cada quadro: fn(dt, tempoTotal)
  let ultimoT = 0, tempoTotal = 0;
  let semRender = false;        // modo de teste: simula sem desenhar (debug3d)
  let sol = null, ambiente = null;   // expostos: a luz acompanha o relógio do jogo
  let hemi = null;              // luz fria de preenchimento (contraste cromático)
  let noturno = false;          // o Plantão Noturno muda céu, neblina e luzes

  /* Qualidade 3D: "alta" liga sombras suaves; "baixa" corta
     sombras e limita a resolução (GPUs modestas/celular). */
  function qualidadeAtual() {
    return (TOGA.config && TOGA.config.qualidade3d) || "alta";
  }

  /* ---------- Detecção de suporte ---------- */
  function suporta() {
    try {
      const c = document.createElement("canvas");
      return !!(window.WebGLRenderingContext &&
        (c.getContext("webgl2") || c.getContext("webgl") || c.getContext("experimental-webgl")));
    } catch (e) { return false; }
  }

  /* ---------- Loop de quadros ----------
     dt em segundos, limitado a 0.1s para que uma aba que
     "dormiu" não produza um salto gigante de física.
     No modo SEM RENDER (testes/bots), o relógio é setTimeout:
     requestAnimationFrame depende do compositor e praticamente
     não dispara em ambientes headless sem desenho.           */
  function agendarQuadro() {
    if (semRender) setTimeout(function () { quadro(performance.now()); }, 16);
    else requestAnimationFrame(quadro);
  }

  function quadro(t) {
    if (!rodando) return;
    agendarQuadro();
    if (pausado) { ultimoT = t; return; }
    const dt = Math.min(0.1, (t - ultimoT) / 1000 || 0.016);
    ultimoT = t;
    tempoTotal += dt;
    for (let i = 0; i < callbacks.length; i++) {
      try { callbacks[i](dt, tempoTotal); } catch (e) { /* um tick com erro não derruba o loop */ }
    }
    if (renderer && camera && !semRender) renderer.render(scene, camera);
  }

  /* ---------- Inicialização ---------- */
  function iniciar(containerEl, opcoes) {
    opcoes = opcoes || {};
    semRender = !!opcoes.semRender;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x14161c);
    // a neblina abre o fórum para "respirar"; no celular, mais
    // próxima para cortar a distância de desenho
    const toque = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    scene.fog = toque ? new THREE.Fog(0x2a241e, 18, 46) : new THREE.Fog(0x2a241e, 26, 70);

    camera = new THREE.PerspectiveCamera(58, 16 / 9, 0.1, 80);
    camera.position.set(0, 1.8, 4);

    // Luzes: o quente das madeiras vem do sol e do ambiente;
    // a HEMISFÉRICA fria de cima dá o contraste cromático que
    // impede a cena de virar uma lavagem sépia única.
    ambiente = new THREE.AmbientLight(0xffe2b8, 0.30);
    hemi = new THREE.HemisphereLight(0x9fb4d8 /* céu frio */, 0x4a3a28 /* chão quente */, 0.4);
    sol = new THREE.DirectionalLight(0xffe9c0, 0.85);
    sol.position.set(6, 12, 4);
    // sombra do sol: cobre o fórum inteiro (só pesa na qualidade alta)
    sol.castShadow = true;
    sol.shadow.mapSize.set(1024, 1024);
    sol.shadow.camera.left = -18; sol.shadow.camera.right = 32;
    sol.shadow.camera.top = 20;   sol.shadow.camera.bottom = -14;
    sol.shadow.camera.near = 2;   sol.shadow.camera.far = 40;
    sol.shadow.bias = -0.002;
    scene.add(ambiente, hemi, sol);

    if (!semRender) {
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.outputEncoding = THREE.sRGBEncoding;
      // tone mapping fílmico: devolve riqueza e profundidade de cor
      if (THREE.ACESFilmicToneMapping != null) {
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;
      }
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      aplicarQualidade();
      containerEl.appendChild(renderer.domElement);
      redimensionar();
      window.addEventListener("resize", redimensionar);

      // Perda de contexto WebGL: avisa o jogo para cair no 2D com elegância.
      renderer.domElement.addEventListener("webglcontextlost", function (ev) {
        ev.preventDefault();
        if (TOGA.cena3d && TOGA.cena3d.aoPerderContexto) TOGA.cena3d.aoPerderContexto();
      });
    }

    rodando = true;
    ultimoT = performance.now();
    agendarQuadro();

    // Aba escondida = render pausado (o relógio do jogo é por eventos, nada se perde)
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) pausar(); else if (corpo3dAtivo()) retomar();
    });

    return { scene: scene, camera: camera, renderer: renderer };
  }

  function corpo3dAtivo() { return document.body.classList.contains("modo-3d"); }

  function pausar() { pausado = true; }
  function retomar() { pausado = false; }

  /* Aplica a qualidade no renderer (na partida e ao trocar a
     chave do menu, sem recarregar a página). */
  function aplicarQualidade() {
    if (!renderer) return;
    const alta = qualidadeAtual() !== "baixa";
    renderer.shadowMap.enabled = alta;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, alta ? 2 : 1.25));
    if (scene) scene.traverse(function (o) { if (o.material) o.material.needsUpdate = true; });
    // studs 3D do mundo: só na qualidade alta
    if (TOGA.mundo3d && TOGA.mundo3d.studsMeshes) {
      TOGA.mundo3d.studsMeshes.forEach(function (m) { m.visible = alta; });
    }
    redimensionar();
  }

  /* ---------- Noite (Plantão Noturno) ----------
     Troca céu, neblina e a temperatura da luz hemisférica.
     Quem decide é o cena3d (pela pauta em curso).          */
  function setNoite(sim) {
    sim = !!sim;
    if (sim === noturno || !scene) return;
    noturno = sim;
    if (sim) {
      scene.background.set(0x0b0d14);
      scene.fog.color.set(0x141824);
      if (hemi) { hemi.color.set(0x5a6a98); hemi.groundColor.set(0x222230); hemi.intensity = 0.3; }
    } else {
      scene.background.set(0x14161c);
      scene.fog.color.set(0x2a241e);
      if (hemi) { hemi.color.set(0x9fb4d8); hemi.groundColor.set(0x4a3a28); hemi.intensity = 0.4; }
    }
  }

  function redimensionar() {
    if (!renderer) return;
    const w = window.innerWidth, h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  /* ---------- API pública ---------- */
  return {
    suporta: suporta,
    iniciar: iniciar,
    aoFrame: function (fn) { callbacks.push(fn); },
    removerAoFrame: function (fn) { const i = callbacks.indexOf(fn); if (i >= 0) callbacks.splice(i, 1); },
    pausar: pausar,
    retomar: retomar,
    pausado: function () { return pausado; },
    aplicarQualidade: aplicarQualidade,
    get scene() { return scene; },
    get camera() { return camera; },
    get renderer() { return renderer; },
    get sol() { return sol; },
    get ambiente() { return ambiente; },
    get hemi() { return hemi; },
    setNoite: setNoite,
    get noturno() { return noturno; },
    get tempo() { return tempoTotal; },
    destruir: function () {
      rodando = false;
      callbacks = [];
      if (renderer) { renderer.dispose(); renderer.domElement.remove(); renderer = null; }
      scene = null; camera = null;
    }
  };
})();
