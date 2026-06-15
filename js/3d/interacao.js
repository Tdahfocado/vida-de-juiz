/* ============================================================
   TOGA 3D — interacao.js : a TECLA "E"
   ------------------------------------------------------------
   O jogador interage com o mundo por PROXIMIDADE + OLHAR:
   a cada quadro, dentre os interagíveis visíveis, procura o
   mais próximo que esteja (a) no raio de alcance e (b) mais ou
   menos à frente da câmera. Achou? Mostra o prompt
   "E — abrir os autos". Apertou E? Executa a ação.

   Cada interagível é um objeto:
     { id, pos: {x,z}, raio, rotulo: ()=>string|string,
       visivel: ()=>bool, acao: ()=>void }

   A lista é declarada pelo cena3d.js, com ações que apontam
   para o MESMO ui.js do modo 2D — o mundo 3D é só um novo
   jeito de apertar os mesmos botões.
   ============================================================ */

window.TOGA = window.TOGA || {};

TOGA.interacao3d = (function () {
  if (!window.THREE) return {};

  let lista = [];
  let persistentes = [];     // itens que SOBREVIVEM ao definir() (ex.: o cachorro)
  let focado = null;

  /* anel dourado no chão sob o interagível focado — o jogador
     VÊ onde a tecla E vai agir, antes de ler o prompt */
  let anel = null;
  function mostrarAnel(item) {
    const scene = TOGA.nucleo3d && TOGA.nucleo3d.scene;
    if (!scene) return;
    if (!anel) {
      anel = new THREE.Mesh(
        new THREE.RingGeometry(0.42, 0.55, 28),
        new THREE.MeshBasicMaterial({ color: 0xe7cf9a, transparent: true, opacity: 0.5,
                                      side: THREE.DoubleSide, depthWrite: false }));
      anel.rotation.x = -Math.PI / 2;
      scene.add(anel);
    }
    anel.visible = true;
    anel.position.set(item.pos.x, 0.03, item.pos.z);
    const pulso = 1 + Math.sin(performance.now() / 280) * 0.08;
    anel.scale.setScalar(pulso);
    anel.material.opacity = 0.38 + Math.sin(performance.now() / 280) * 0.14;
  }
  function esconderAnel() {
    if (anel) anel.visible = false;
  }

  function elPrompt() { return document.getElementById("prompt-interacao"); }
  function elTexto() { return document.getElementById("prompt-interacao-texto"); }

  function telaMundoAtiva() {
    const t = document.getElementById("tela-mundo");
    return t && t.classList.contains("ativa");
  }

  function rotuloDe(item) {
    return typeof item.rotulo === "function" ? item.rotulo() : item.rotulo;
  }

  function tick() {
    if (!telaMundoAtiva() || !TOGA.controles3d.ativo) { esconder(); return; }
    // mensagem aberta tem prioridade: o prompt sai de cena até
    // o jogador terminar de ler (E avança a mensagem, não a ação)
    if (TOGA.cena3d && TOGA.cena3d.toastAberto && TOGA.cena3d.toastAberto()) { esconder(); return; }
    const e = TOGA.controles3d.estado();
    if (!e) { esconder(); return; }

    let melhor = null, melhorDist = Infinity;
    for (let i = 0; i < lista.length; i++) {
      const it = lista[i];
      if (it.visivel && !it.visivel()) continue;
      const dx = it.pos.x - e.pos.x, dz = it.pos.z - e.pos.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist > (it.raio || 1.6)) continue;
      // "estar olhando": produto escalar entre direção da câmera e direção ao alvo
      const dot = (dx / (dist || 1)) * e.dir.x + (dz / (dist || 1)) * e.dir.z;
      if (dist > 0.5 && dot < 0.25) continue;
      if (dist < melhorDist) { melhor = it; melhorDist = dist; }
    }

    const focadoAntes = focado && focado.id;
    focado = melhor;
    if (melhor) {
      elTexto().textContent = rotuloDe(melhor);
      elPrompt().hidden = false;
      mostrarAnel(melhor);
      // um blip suave quando um interagível NOVO entra em foco
      if (melhor.id !== focadoAntes && TOGA.audio) TOGA.audio.tocar("foco");
    } else esconder();
  }

  function esconder() {
    focado = null;
    const p = elPrompt();
    if (p) p.hidden = true;
    esconderAnel();
  }

  function dispararFocado() {
    if (!telaMundoAtiva() || !focado) return false;
    const it = focado;
    esconder();
    it.acao();
    return true;
  }

  document.addEventListener("keydown", function (ev) {
    if (ev.key !== "e" && ev.key !== "E") return;
    if (!telaMundoAtiva()) return;
    // 1º: mensagem aberta consome o E (avança/fecha a leitura)
    if (TOGA.cena3d && TOGA.cena3d.avancarToast && TOGA.cena3d.avancarToast()) {
      ev.preventDefault();
      return;
    }
    // 2º: sem mensagem na tela, o E interage normalmente
    if (dispararFocado()) ev.preventDefault();
  });

  // No toque (e no mouse), o próprio aviso é um botão.
  const promptEl = elPrompt();
  if (promptEl) promptEl.addEventListener("click", dispararFocado);

  return {
    // definir troca a lista da ÁREA, mas reconcatena os persistentes
    // (senão o cachorro some toda vez que se troca de cena/volta ao fórum)
    definir: function (novaLista) { lista = (novaLista || []).concat(persistentes); },
    adicionar: function (item) { persistentes.push(item); lista.push(item); },
    dispararFocado: dispararFocado,
    tick: tick,
    listar: function () {
      return lista.map(function (it) {
        return { id: it.id, rotulo: rotuloDe(it), visivel: !it.visivel || it.visivel() };
      });
    },
    /* clique direto no objeto/NPC: dado um Raycaster, devolve o
       interagível mais próximo do raio (ou null). O controles usa
       para "andar até e agir" em vez de só mover.            */
    alvoDoRaio: function (raycaster) {
      let melhor = null, melhorD = 1.1;     // tolerância lateral do clique
      for (let i = 0; i < lista.length; i++) {
        const it = lista[i];
        if (it.visivel && !it.visivel()) continue;
        if (!it.pos) continue;
        const p = new THREE.Vector3(it.pos.x, 0.9, it.pos.z);
        const d = raycaster.ray.distanceToPoint(p);
        if (d < melhorD) { melhor = it; melhorD = d; }
      }
      return melhor ? { id: melhor.id, pos: melhor.pos, raio: melhor.raio || 1.6 } : null;
    },

    disparar: function (id) {       // usado pelo debug3d/bot
      const it = lista.find(function (x) { return x.id === id; });
      if (!it) return false;
      if (it.visivel && !it.visivel()) return false;
      it.acao();
      return true;
    }
  };
})();
