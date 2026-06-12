/* ============================================================
   TOGA 3D — carro3d.js : O JUIZ AO VOLANTE
   ------------------------------------------------------------
   A viagem até a ESMEC — dirigida pelo próprio juiz, sem
   motorista. Minigame com regras de trânsito de verdade:

     1. cinto ANTES de dar a partida;
     2. semáforo — parar no vermelho;
     3. faixa de pedestres — gente atravessando tem prioridade;
     4. radar educativo — 60 km/h;
     5. estacionar na vaga em frente à ESMEC.

   Cada infração fica registrada (e vira manchete no epílogo);
   a viagem limpa rende a conquista "Cidadão ao volante".

   No toque/qualidade baixa, o carro segue sozinho (piloto
   automático obedece às regras) — o jogador só assiste e
   aprende. A estrada vive em x ≈ +600 no mesmo scene.
   ============================================================ */

window.TOGA = window.TOGA || {};

TOGA.carro3d = (function () {
  if (!window.THREE) return null;

  const SX = 600;                  // eixo central da avenida
  const FIM = 452;                 // fundo da vaga
  let construida = false;
  let grupoCarro = null, luzSemaforo = null, pedestres = [];
  let ativo = false, autopilot = false, turbo = 1;
  let estado = null;               // { z, x, v, infracoes[], fase... }
  let aoChegarCb = null;
  let teclas = {};

  function mat(cor) { return TOGA.texturas3d.matPlastico(cor); }
  function matTex(tex, rx, ry) {
    const t = tex.clone(); t.needsUpdate = true; t.repeat.set(rx || 1, ry || 1);
    return new THREE.MeshLambertMaterial({ map: t });
  }

  /* ================= A AVENIDA ================= */
  function construir(scene) {
    if (construida) return;
    construida = true;

    function caixa(w, h, d, x, y, z, material, semSombra) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
      m.position.set(x, y, z);
      m.castShadow = !semSombra;
      m.receiveShadow = true;
      scene.add(m);
      return m;
    }

    // pista (mão dupla) + canteiros
    const pista = new THREE.Mesh(new THREE.PlaneGeometry(8.4, FIM + 40),
      TOGA.texturas3d.asfalto ? matTex(TOGA.texturas3d.asfalto(), 2, 60) : mat(0x3a3d42));
    pista.rotation.x = -Math.PI / 2;
    pista.position.set(SX, 0.01, FIM / 2 - 10);
    pista.receiveShadow = true;
    scene.add(pista);
    const grama = new THREE.Mesh(new THREE.PlaneGeometry(60, FIM + 60), mat(0x47603c));
    grama.rotation.x = -Math.PI / 2;
    grama.position.set(SX, -0.02, FIM / 2 - 10);
    scene.add(grama);

    // prédios cenográficos alternados
    for (let z = 20; z < FIM - 40; z += 34) {
      const lado = (z / 34) % 2 ? 1 : -1;
      caixa(8, 6 + (z % 5), 12, SX + lado * 12, 3 + (z % 5) / 2, z, mat([0x8a8378, 0xb98b4a, 0x7d8186, 0xd99a8a][(z / 34) % 4 | 0]));
    }
    // postes
    for (let z = 10; z < FIM; z += 40) {
      const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 3.8, 8), mat(0x55585e));
      haste.position.set(SX - 5, 1.9, z);
      scene.add(haste);
    }

    // 1) SEMÁFORO em z=138 (linha de retenção em 137)
    const posteS = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 4.6, 8), mat(0x33373d));
    posteS.position.set(SX + 5, 2.3, 138);
    scene.add(posteS);
    const caixaS = caixa(0.5, 1.2, 0.4, SX + 5, 4.4, 138, mat(0x22262c), true);
    luzSemaforo = new THREE.Mesh(new THREE.CircleGeometry(0.16, 12),
      new THREE.MeshBasicMaterial({ color: 0xc94f4f }));
    luzSemaforo.position.set(SX + 5, 4.6, 137.75);
    luzSemaforo.rotation.y = Math.PI;
    scene.add(luzSemaforo);
    caixa(8.4, 0.02, 0.4, SX, 0.03, 137, mat(0xe8e6da), true); // linha de retenção

    // 2) FAIXA DE PEDESTRES em z=258
    for (let i = 0; i < 6; i++) {
      caixa(1.0, 0.02, 3.4, SX - 3.5 + i * 1.45, 0.03, 259.8, mat(0xe8e6da), true);
    }
    caixa(8.4, 0.02, 0.4, SX, 0.03, 257, mat(0xe8e6da), true); // retenção da faixa

    // 3) RADAR em z=330 (placa + totem)
    caixa(0.16, 2.6, 0.16, SX + 4.8, 1.3, 320, mat(0x8a8f96), true);
    const placaRadar = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.0),
      new THREE.MeshLambertMaterial({
        map: TOGA.texturas3d.letreiro
          ? TOGA.texturas3d.letreiro("60", "#e8e6da", "#9c1f1a", "FISCALIZAÇÃO ELETRÔNICA")
          : null }));
    placaRadar.position.set(SX + 4.8, 2.2, 319.8);
    placaRadar.rotation.y = Math.PI;
    scene.add(placaRadar);
    caixa(0.3, 1.1, 0.3, SX + 4.6, 0.55, 338, mat(0xd8c84a), true); // o totem do radar

    // 4) chegada: silhueta da ESMEC ao fundo + a VAGA demarcada
    caixa(14, 4.5, 2, SX, 2.25, FIM + 18,
      TOGA.texturas3d.granitoRosa ? matTex(TOGA.texturas3d.granitoRosa(), 4, 2) : mat(0xb08572));
    const letr = new THREE.Mesh(new THREE.PlaneGeometry(4, 1),
      new THREE.MeshLambertMaterial({
        map: TOGA.texturas3d.letreiro ? TOGA.texturas3d.letreiro("E S M E C", "#b08572", "#2b2118") : null }));
    letr.position.set(SX, 3.6, FIM + 16.9);
    letr.rotation.y = Math.PI;
    scene.add(letr);
    for (let i = 0; i < 3; i++) {
      caixa(0.1, 0.02, 5, SX + 5.4, 0.04, 438 + i * 5.2, mat(0xe8e6da), true);
    }
    caixa(4.8, 0.015, 4.6, SX + 5.4 - 2.5, 0.03, 443.5, mat(0x9fc3ae), true); // a vaga verde
    [SX - 8, SX + 10].forEach(function (px) {
      const tronco = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.16, 3.2, 8), mat(0x8a6a4a));
      tronco.position.set(px, 1.6, FIM - 6);
      scene.add(tronco);
    });

    // pedestres da faixa (entram em cena na hora certa)
    for (let i = 0; i < 2; i++) {
      const p = TOGA.boneco3d.criar(
        { id: "pedestreFaixa" + i,
          avatar: { pele: i ? "#8a5436" : "#d8a87f", cabelo: i ? "coque" : "curto",
                    corCabelo: "#241a10", traje: "camisa", corTraje: i ? "#7a4a3a" : "#4a5a6e" } }, {});
      p.grupo.position.set(SX - 6.5 - i * 1.2, 0, 259.8);
      p.grupo.rotation.y = Math.PI / 2;
      p.grupo.visible = false;
      scene.add(p.grupo);
      pedestres.push(p);
    }

    // O CARRO DO JUIZ
    grupoCarro = new THREE.Group();
    const corpo = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.5, 3.6), mat(0x33424f));
    corpo.position.y = 0.55; corpo.castShadow = true;
    const cabine = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.5, 1.8), mat(0x222831));
    cabine.position.set(0, 1.0, -0.2);
    const farolE = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.12, 0.06),
      new THREE.MeshBasicMaterial({ color: 0xffe2a8 }));
    farolE.position.set(-0.55, 0.55, 1.83);
    const farolD = farolE.clone(); farolD.position.x = 0.55;
    grupoCarro.add(corpo, cabine, farolE, farolD);
    [[-0.85, 1.1], [0.85, 1.1], [-0.85, -1.1], [0.85, -1.1]].forEach(function (p) {
      const roda = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.2, 10), mat(0x15110c));
      roda.rotation.z = Math.PI / 2;
      roda.position.set(p[0], 0.3, p[1]);
      grupoCarro.add(roda);
    });
    grupoCarro.visible = false;
    scene.add(grupoCarro);

    TOGA.nucleo3d.aoFrame(tick);
  }

  /* ================= HUD ================= */
  function hud() {
    let el = document.getElementById("hud-carro");
    if (!el) {
      el = document.createElement("div");
      el.id = "hud-carro";
      el.innerHTML = '<span class="vel">0</span><span class="unid">km/h</span>' +
                     '<span class="dica" id="hud-carro-dica"></span>';
      document.body.appendChild(el);
    }
    return el;
  }
  function dica(txt) {
    const d = document.getElementById("hud-carro-dica");
    if (d) d.textContent = txt || "";
  }

  function infracao(rotulo, msg) {
    if (estado.infracoes.indexOf(rotulo) >= 0) return;
    estado.infracoes.push(rotulo);
    if (TOGA.cena3d && TOGA.cena3d.toastMundo) TOGA.cena3d.toastMundo(msg);
  }

  /* ================= A VIAGEM ================= */
  function iniciarViagem(opts) {
    opts = opts || {};
    construir(TOGA.nucleo3d.scene);
    aoChegarCb = opts.aoChegar || null;
    autopilot = !!opts.autopilot ||
      (TOGA.config && TOGA.config.qualidade3d === "baixa") ||
      (window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
    turbo = opts.turbo || (TOGA.config && TOGA.config._turboViagem) || 1;

    estado = {
      z: 4, x: SX + 2.1, v: 0,
      infracoes: [],
      cinto: false,
      semaforo: "vermelho", paradoDesde: 0, semaforoOk: false,
      faixaAtiva: false, faixaOk: false,
      radarPego: false,
      chegou: false
    };
    grupoCarro.visible = true;
    grupoCarro.position.set(estado.x, 0, estado.z);
    grupoCarro.rotation.y = 0;
    luzSemaforo.material.color.set(0xc94f4f);
    pedestres.forEach(function (p) { p.grupo.visible = false; });

    TOGA.controles3d.desativar();
    if (TOGA.cena3d && TOGA.cena3d.esconderJogador) TOGA.cena3d.esconderJogador(true);
    ligarTeclas();
    hud();

    // o CINTO, antes de tudo
    perguntaCinto(function (afivelou) {
      estado.cinto = afivelou;
      if (!afivelou) {
        infracao("cinto", "🚨 O alerta do painel apita o caminho inteiro. Dirigir sem cinto é infração grave (CTB, art. 167) — e o exemplo, esse não tem multa: cobra-se em respeito.");
      } else if (TOGA.cena3d && TOGA.cena3d.toastMundo) {
        TOGA.cena3d.toastMundo("🚗 Cinto afivelado, retrovisor no lugar. A ESMEC fica no fim da avenida — respeite a sinalização e estacione na vaga verde.");
      }
      ativo = true;
      dica(autopilot ? "o carro segue as regras sozinho — observe" : "W/▲ acelera · S/▼ freia · A/D muda de faixa");
    });
  }

  function perguntaCinto(cb) {
    if (autopilot) { cb(true); return; }
    const p = document.createElement("div");
    p.className = "painel-visita";
    p.innerHTML = '<div class="cartao-visita"><h3>🚗 Antes de dar a partida</h3>' +
      '<p class="texto-visita">O carro é o seu de sempre — sem motorista, sem placa especial. ' +
      'A mão procura a chave; o hábito decide o resto.</p></div>';
    const cartao = p.querySelector(".cartao-visita");
    [["Dar a partida direto — a ESMEC espera, o caminho é curto", false],
     ["Afivelar o cinto antes de girar a chave", true]].forEach(function (op) {
      const b = document.createElement("button");
      b.className = "opcao opcao-visita";
      b.textContent = op[0];
      b.addEventListener("click", function () { p.remove(); cb(op[1]); });
      cartao.appendChild(b);
    });
    document.body.appendChild(p);
  }

  function ligarTeclas() {
    teclas = {};
    window.addEventListener("keydown", aoTecla);
    window.addEventListener("keyup", aoSoltar);
  }
  function desligarTeclas() {
    window.removeEventListener("keydown", aoTecla);
    window.removeEventListener("keyup", aoSoltar);
  }
  function aoTecla(e) { teclas[e.key.toLowerCase()] = true; }
  function aoSoltar(e) { teclas[e.key.toLowerCase()] = false; }

  function tick(dt) {
    if (!ativo || !estado) return;
    dt = Math.min(dt * turbo, 0.12 * turbo);
    const e = estado;

    /* ---- controles (ou piloto automático) ---- */
    const VMAX = 25;                       // 90 km/h
    if (autopilot) {
      let alvoV = 14;
      if (e.semaforo === "vermelho" && e.z > 110 && e.z < 137) alvoV = Math.max(0, (135 - e.z) * 0.6);
      if (e.faixaAtiva && e.z > 230 && e.z < 256.5) alvoV = Math.max(0, (254.5 - e.z) * 0.6);
      if (e.z > 315 && e.z < 345) alvoV = Math.min(alvoV, 15);
      if (e.z > 420) alvoV = Math.max(0.6, (442 - e.z) * 0.35);
      if (e.z > 438) { e.x += (SX + 2.9 - e.x) * Math.min(1, 2 * dt); }
      if (e.z > 441.5) alvoV = 0;
      e.v += (alvoV - e.v) * Math.min(1, 2.2 * dt);
      if (alvoV === 0 && e.v < 0.5) e.v = 0;
    } else {
      const acel = (teclas["w"] || teclas["arrowup"]) ? 8
                 : (teclas["s"] || teclas["arrowdown"]) ? -14 : -2.2;
      e.v = Math.max(-4, Math.min(VMAX, e.v + acel * dt));
      if (!teclas["w"] && !teclas["arrowup"] && !teclas["s"] && !teclas["arrowdown"] &&
          Math.abs(e.v) < 0.6) e.v = 0;
      const lado = (teclas["a"] || teclas["arrowleft"]) ? -1
                 : (teclas["d"] || teclas["arrowright"]) ? 1 : 0;
      e.x = Math.max(SX + 0.6, Math.min(SX + 3.2, e.x + lado * 3.2 * dt));
    }
    e.z += e.v * dt;
    if (e.z < 2) { e.z = 2; e.v = Math.max(0, e.v); }
    if (e.z > FIM + 6) { e.z = FIM + 6; e.v = 0; dica("a vaga ficou para trás — dê ré (S/▼)"); }

    /* ---- 1) o semáforo ---- */
    if (e.semaforo === "vermelho") {
      if (e.v < 0.3 && e.z > 124 && e.z < 137) {
        e.paradoDesde += dt;
        if (e.paradoDesde > 1.4) {
          e.semaforo = "verde";
          luzSemaforo.material.color.set(0x6fbf6f);
          if (!e.semaforoOk) { e.semaforoOk = true;
            if (TOGA.cena3d) TOGA.cena3d.toastMundo("🚦 Verde. Do carro ao lado, um senhor de bigode reconhece você da audiência dos vizinhos e acena. Juiz parado no sinal ensina mais trânsito que campanha de maio."); }
        }
      } else { e.paradoDesde = 0; }
      if (e.z > 137.6) {
        e.semaforo = "verde";
        luzSemaforo.material.color.set(0x6fbf6f);
        infracao("semaforo", "🚨 Você avançou o sinal vermelho (CTB, art. 208). O flash do cruzamento não pergunta a profissão de ninguém — e a cidade viu a toga passar por cima da regra.");
      }
    }

    /* ---- 2) a faixa de pedestres ---- */
    if (!e.faixaAtiva && !e.faixaOk && e.z > 225) {
      e.faixaAtiva = true;
      e.faixaT = 0;
      pedestres.forEach(function (p, i) {
        p.grupo.visible = true;
        p.grupo.position.set(SX - 6.5 - i * 1.2, 0, 259.8);
      });
    }
    if (e.faixaAtiva) {
      e.faixaT += dt;
      pedestres.forEach(function (p) {
        p.grupo.position.x += 1.5 * dt;
        p.grupo.userData.andando = true;
      });
      const todosForam = pedestres.every(function (p) { return p.grupo.position.x > SX + 5.5; });
      if (todosForam) {
        e.faixaAtiva = false;
        e.faixaOk = true;
        pedestres.forEach(function (p) { p.grupo.visible = false; });
      }
      if (e.z > 257.4 && !todosForam) {
        infracao("faixa", "🚨 Pedestre na faixa tem prioridade (CTB, art. 214) — e os dois que atravessavam reconheceram o carro do fórum. Amanhã a comarca inteira sabe.");
        e.faixaAtiva = false;
        e.faixaOk = true;
        pedestres.forEach(function (p) { p.grupo.visible = false; });
      }
    }

    /* ---- 3) o radar ---- */
    if (!e.radarPego && e.z > 320 && e.z < 345 && e.v > 17.4) {
      e.radarPego = true;
      infracao("radar", "📸 O totem amarelo pisca: acima de 60 km/h na via fiscalizada. A notificação chega no CPF, não no cargo — como deve ser.");
    }

    /* ---- 4) a vaga ---- */
    if (!e.chegou && e.v === 0 && e.z > 439 && e.z < 448 && e.x > SX + 1.8) {
      e.chegou = true;
      concluir();
    }

    /* ---- carro, câmera e HUD ---- */
    grupoCarro.position.set(e.x, 0, e.z);
    grupoCarro.rotation.y = 0;
    const cam = TOGA.nucleo3d.camera;
    cam.position.set(e.x, 3.1, e.z - 6.5);
    cam.lookAt(e.x, 1.0, e.z + 6);
    const velEl = document.querySelector("#hud-carro .vel");
    if (velEl) velEl.textContent = Math.round(Math.abs(e.v) * 3.6);
    if (!autopilot) {
      if (e.semaforo === "vermelho" && e.z > 100 && e.z < 137) dica("🚦 sinal VERMELHO à frente — pare na linha");
      else if (e.faixaAtiva) dica("🚶 pedestres na faixa — pare e espere");
      else if (e.z > 310 && e.z < 345) dica("📸 radar 60 km/h");
      else if (e.z > 420) dica("🅿 estacione na vaga VERDE, à direita, e pare o carro");
      else dica("W/▲ acelera · S/▼ freia · A/D muda de faixa");
    }
  }

  function concluir() {
    ativo = false;
    desligarTeclas();
    const inf = estado.infracoes.slice();
    const el = document.getElementById("hud-carro");
    if (el) el.remove();
    grupoCarro.visible = false;
    if (TOGA.cena3d && TOGA.cena3d.esconderJogador) TOGA.cena3d.esconderJogador(false);
    if (aoChegarCb) aoChegarCb({ infracoes: inf });
  }

  /* aborta no meio (voltar ao fórum sem terminar) */
  function cancelar() {
    if (!ativo) return;
    ativo = false;
    desligarTeclas();
    const el = document.getElementById("hud-carro");
    if (el) el.remove();
    grupoCarro.visible = false;
    if (TOGA.cena3d && TOGA.cena3d.esconderJogador) TOGA.cena3d.esconderJogador(false);
  }

  return {
    iniciarViagem: iniciarViagem,
    cancelar: cancelar,
    get ativo() { return ativo; },
    get SX() { return SX; }
  };
})();
