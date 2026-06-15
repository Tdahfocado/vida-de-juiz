/* ============================================================
   TOGA 3D — carro3d.js : O JUIZ AO VOLANTE
   ------------------------------------------------------------
   A viagem até a ESMEC — dirigida pelo próprio juiz, sem
   motorista. Minigame com regras de trânsito de verdade:

     1. cinto ANTES de dar a partida;
     2. semáforo — parar no vermelho;
     3. ônibus no ponto — ultrapassar só com a pista livre;
     4. faixa de pedestres — quem atravessa tem prioridade;
     5. radar educativo — 60 km/h;
     6. estacionar na vaga (com nota de baliza).

   E a parte da DIVERSÃO: motor sintetizado que sobe de tom,
   buzina (B) com reações, tráfego no sentido contrário, um
   evento aleatório por viagem (vendedor de água no sinal,
   ciclista — 1,5 m do CTB —, quebra-molas) e a RÁDIO COMARCA
   FM (R), que lê as manchetes que o SEU jogo gerou.

   Cada infração fica registrada (e vira manchete no epílogo);
   a viagem limpa rende a conquista "Cidadão ao volante".
   No toque/qualidade baixa, o carro obedece às regras sozinho.
   A estrada vive em x ≈ +600 no mesmo scene.
   ============================================================ */

window.TOGA = window.TOGA || {};

TOGA.carro3d = (function () {
  if (!window.THREE) return null;

  const SX = 600;                  // eixo central da avenida
  const FIM = 452;                 // fundo da vaga
  let construida = false;
  let grupoCarro = null, rodas = [];
  let luzSemaforo = null, pedestres = [];
  let trafego = [];                // os carros do sentido contrário
  let onibus = null, ciclista = null, vendedor = null, lombada = null, farolVaga = null;
  let ativo = false, autopilot = false, turbo = 1;
  let estado = null;
  let aoChegarCb = null;
  let teclas = {};

  function mat(cor) { return TOGA.texturas3d.matPlastico(cor); }
  function matTex(tex, rx, ry) {
    const t = tex.clone(); t.needsUpdate = true; t.repeat.set(rx || 1, ry || 1);
    return new THREE.MeshLambertMaterial({ map: t });
  }

  function fazerCarro(cor) {
    const g = new THREE.Group();
    const corpo = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.5, 3.6), mat(cor));
    corpo.position.y = 0.55; corpo.castShadow = true;
    const cabine = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.5, 1.8), mat(0x222831));
    cabine.position.set(0, 1.0, -0.2);
    g.add(corpo, cabine);
    const minhasRodas = [];
    [[-0.85, 1.1], [0.85, 1.1], [-0.85, -1.1], [0.85, -1.1]].forEach(function (p) {
      const roda = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.2, 10), mat(0x15110c));
      roda.rotation.z = Math.PI / 2;
      roda.position.set(p[0], 0.3, p[1]);
      g.add(roda);
      minhasRodas.push(roda);
    });
    return { grupo: g, rodas: minhasRodas };
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

    // prédios cenográficos alternados + outdoors cearenses
    for (let z = 20; z < FIM - 40; z += 34) {
      const lado = (z / 34) % 2 ? 1 : -1;
      caixa(8, 6 + (z % 5), 12, SX + lado * 12, 3 + (z % 5) / 2, z,
        mat([0x6e655a, 0x8a6a3a, 0x5e6166, 0xa3766a][(z / 34) % 4 | 0]));
    }
    if (TOGA.texturas3d.letreiro) {
      [["FORRÓ DO JUÍZO FINAL — SÁB.", 70, "#7c3030"],
       ["CUSCUZ DA D. LOURDES — 24h", 210, "#2f4a3e"],
       ["COMARCA FM 96,1 — A VOZ DO FÓRUM", 370, "#2a3d7c"]].forEach(function (o) {
        const placa = new THREE.Mesh(new THREE.PlaneGeometry(5, 1.6),
          new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.letreiro(o[0], o[2], "#f4ecd9") }));
        placa.position.set(SX - 7.4, 3.4, o[1]);
        placa.rotation.y = Math.PI / 3;
        scene.add(placa);
        caixa(0.16, 3.4, 0.16, SX - 7.4, 1.7, o[1], mat(0x55585e), true);
      });
    }
    for (let z = 10; z < FIM; z += 40) {
      const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 3.8, 8), mat(0x55585e));
      haste.position.set(SX - 5, 1.9, z);
      scene.add(haste);
    }

    // 1) SEMÁFORO em z=138 (linha de retenção em 137)
    const posteS = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 4.6, 8), mat(0x33373d));
    posteS.position.set(SX + 5, 2.3, 138);
    scene.add(posteS);
    caixa(0.5, 1.2, 0.4, SX + 5, 4.4, 138, mat(0x22262c), true);
    luzSemaforo = new THREE.Mesh(new THREE.CircleGeometry(0.16, 12),
      new THREE.MeshBasicMaterial({ color: 0xc94f4f }));
    luzSemaforo.position.set(SX + 5, 4.6, 137.75);
    luzSemaforo.rotation.y = Math.PI;
    scene.add(luzSemaforo);
    caixa(8.4, 0.02, 0.4, SX, 0.045, 137, mat(0xd8d4c8), true); // linha de retenção

    // 2) PONTO DE ÔNIBUS em z≈192 (a parada na SUA pista)
    caixa(2.4, 0.1, 1.2, SX + 6.2, 2.3, 192, mat(0x8a8f96), true);   // cobertura
    caixa(0.12, 2.3, 0.12, SX + 5.4, 1.15, 191.5, mat(0x55585e), true);
    caixa(0.12, 2.3, 0.12, SX + 7.0, 1.15, 192.5, mat(0x55585e), true);
    onibus = new THREE.Group();
    const busCorpo = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.9, 7.5), mat(0xd8a44a));
    busCorpo.position.y = 1.25; busCorpo.castShadow = true;
    const busJanelas = new THREE.Mesh(new THREE.BoxGeometry(2.24, 0.6, 6.5),
      new THREE.MeshPhongMaterial({ color: 0x222b38, shininess: 70 }));
    busJanelas.position.y = 1.7;
    onibus.add(busCorpo, busJanelas);
    [[-1.0, 2.6], [1.0, 2.6], [-1.0, -2.6], [1.0, -2.6]].forEach(function (p) {
      const roda = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.26, 10), mat(0x15110c));
      roda.rotation.z = Math.PI / 2;
      roda.position.set(p[0], 0.42, p[1]);
      onibus.add(roda);
    });
    onibus.position.set(SX + 2.4, 0, 188);
    onibus.visible = false;
    scene.add(onibus);

    // 3) FAIXA DE PEDESTRES em z=258
    for (let i = 0; i < 6; i++) {
      caixa(1.0, 0.02, 3.4, SX - 3.5 + i * 1.45, 0.045, 259.8, mat(0xd8d4c8), true);
    }
    caixa(8.4, 0.02, 0.4, SX, 0.045, 257, mat(0xd8d4c8), true); // retenção da faixa

    // 4) RADAR em z=330 (placa + totem)
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

    // QUEBRA-MOLAS (evento aleatório) em z=96, com placa
    lombada = caixa(8.4, 0.16, 1.1, SX, 0.08, 96, mat(0xd8c84a), true);
    lombada.visible = false;
    const placaLombada = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.1),
      new THREE.MeshLambertMaterial({
        map: TOGA.texturas3d.letreiro ? TOGA.texturas3d.letreiro("20", "#d8c84a", "#15110c", "SALIÊNCIA") : null }));
    placaLombada.position.set(SX + 4.8, 1.6, 88);
    placaLombada.rotation.y = Math.PI;
    placaLombada.visible = false;
    scene.add(placaLombada);
    lombada.userData.placa = placaLombada;

    // chegada: silhueta da ESMEC ao fundo + a VAGA demarcada
    caixa(14, 4.5, 2, SX, 2.25, FIM + 18,
      TOGA.texturas3d.granitoRosa ? matTex(TOGA.texturas3d.granitoRosa(), 4, 2) : mat(0xb08572));
    const letr = new THREE.Mesh(new THREE.PlaneGeometry(4, 1),
      new THREE.MeshLambertMaterial({
        map: TOGA.texturas3d.letreiro ? TOGA.texturas3d.letreiro("E S M E C", "#b08572", "#2b2118") : null }));
    letr.position.set(SX, 3.6, FIM + 16.9);
    letr.rotation.y = Math.PI;
    scene.add(letr);
    for (let i = 0; i < 3; i++) {
      caixa(0.1, 0.02, 5, SX + 5.4, 0.055, 438 + i * 5.2, mat(0xd8d4c8), true);
    }
    caixa(4.8, 0.015, 4.6, SX + 2.9, 0.045, 443.5, mat(0x86ab95), true); // a vaga verde
    // o FAROL da vaga: coluna translúcida pulsante, visível de longe
    farolVaga = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.4, 7, 12, 1, true),
      new THREE.MeshBasicMaterial({ color: 0x9fc3ae, transparent: true, opacity: 0.3,
        side: THREE.DoubleSide, depthWrite: false }));
    farolVaga.position.set(SX + 2.9, 3.5, 443.5);
    scene.add(farolVaga);
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

    // o VENDEDOR DE ÁGUA do semáforo (evento aleatório)
    vendedor = TOGA.boneco3d.criar(
      { id: "vendedorAgua",
        avatar: { pele: "#a86a48", cabelo: "curto", corCabelo: "#241a10",
                  traje: "camisa", corTraje: "#c94f4f" } }, {});
    vendedor.grupo.position.set(SX + 4.4, 0, 132);
    vendedor.grupo.rotation.y = -Math.PI / 2;
    vendedor.segurar("copo", "dir");
    vendedor.grupo.visible = false;
    scene.add(vendedor.grupo);

    // o CICLISTA (evento aleatório): bike simples + condutor
    ciclista = new THREE.Group();
    [[0, 0.35, 0.55], [0, 0.35, -0.55]].forEach(function (p) {
      const roda = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.06, 12), mat(0x15110c));
      roda.rotation.z = Math.PI / 2;
      roda.position.set(p[0], p[1], p[2]);
      ciclista.add(roda);
    });
    const quadro = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 1.1), mat(0xc94f4f));
    quadro.position.y = 0.6;
    ciclista.add(quadro);
    const condutor = TOGA.boneco3d.criar(
      { id: "ciclistaCond", avatar: { pele: "#c98e66", cabelo: "curto", corCabelo: "#241a10",
        traje: "camisa", corTraje: "#2f4a3e" } }, { sentado: true });
    condutor.grupo.position.set(0, 0.55, 0);
    ciclista.add(condutor.grupo);
    ciclista.position.set(SX + 3.6, 0, 280);
    ciclista.visible = false;
    scene.add(ciclista);

    // TRÁFEGO no sentido contrário (pista esquerda, vindo da ESMEC)
    [0x8a3a3a, 0x3a5a8a, 0xb9b3a6].forEach(function (cor, i) {
      const c = fazerCarro(cor);
      c.grupo.position.set(SX - 2.1, 0, 80 + i * 150);
      c.grupo.rotation.y = Math.PI;
      scene.add(c.grupo);
      trafego.push({ grupo: c.grupo, rodas: c.rodas, z: 80 + i * 150, vel: 9 + i * 1.5 });
    });

    // O CARRO DO JUIZ
    const meu = fazerCarro(0x33424f);
    grupoCarro = meu.grupo;
    rodas = meu.rodas;
    const farolE = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.12, 0.06),
      new THREE.MeshBasicMaterial({ color: 0xffe2a8 }));
    farolE.position.set(-0.55, 0.55, 1.83);
    const farolD = farolE.clone(); farolD.position.x = 0.55;
    grupoCarro.add(farolE, farolD);
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
    let radio = document.getElementById("hud-radio");
    if (!radio) {
      radio = document.createElement("div");
      radio.id = "hud-radio";
      radio.innerHTML = '<span class="freq">📻 COMARCA FM 96,1</span>' +
                        '<span class="prog" id="hud-radio-texto">no ar</span>';
      document.body.appendChild(radio);
    }
    return el;
  }
  function dica(txt) {
    const d = document.getElementById("hud-carro-dica");
    if (d) d.textContent = txt || "";
  }

  /* ================= A RÁDIO COMARCA FM ================= */
  function montarPlaylist() {
    const itens = [];
    const e = TOGA.motor && TOGA.motor.estado;
    if (e && TOGA.manchetes) {
      TOGA.manchetes.forEach(function (m) {
        try {
          if (m.condicao(e.flags || {}, e.reputacao || {})) {
            itens.push("“" + m.titulo + "” — noticia hoje a " + (m.fonte || "imprensa da comarca") + ".");
          }
        } catch (err) {}
      });
    }
    if (!itens.length) {
      itens.push("Previsão do tempo: sol o dia inteiro, com pancadas de processo ao fim da tarde.");
    }
    itens.push("Agora na programação: clássicos do forró para quem respeita o semáforo.");
    itens.push("A Comarca FM lembra: na faixa, quem manda é o pedestre. Bom trânsito, doutor.");
    return itens.sort(function () { return Math.random() - 0.5; });
  }
  function tickRadio(dt) {
    const r = estado.radio;
    const el = document.getElementById("hud-radio");
    if (!el) return;
    el.style.display = r.ligada ? "flex" : "none";
    if (!r.ligada) return;
    r.t += dt;
    if (r.t > 7) {
      r.t = 0;
      r.i = (r.i + 1) % r.playlist.length;
      const prog = document.getElementById("hud-radio-texto");
      if (prog) prog.textContent = r.playlist[r.i];
    }
  }
  function ligarRadio(ligar) {
    const r = estado.radio;
    r.ligada = ligar === undefined ? !r.ligada : !!ligar;
    if (r.ligada) {
      if (TOGA.audio) TOGA.audio.tocar("vinheta");
      r.t = 99;     // troca o item na hora
    }
  }

  function infracao(rotulo, msg) {
    if (estado.infracoes.indexOf(rotulo) >= 0) return;
    estado.infracoes.push(rotulo);
    if (TOGA.cena3d && TOGA.cena3d.toastMundo) TOGA.cena3d.toastMundo(msg);
    // a Comarca FM noticia NA HORA (a cidade é pequena)
    const NOTAS = {
      cinto: "🚨 plantão da Comarca FM: ouvinte jura ter visto o alerta de cinto piscando num sedã conhecido. O painel não mente, doutor.",
      semaforo: "🚨 plantão da Comarca FM: flagrante no cruzamento da avenida — e o carro era de quem menos se esperava.",
      faixa: "🚨 plantão da Comarca FM: pedestres relatam susto na faixa. 'A toga passou voando', diz testemunha.",
      radar: "🚨 plantão da Comarca FM: o radar da avenida registrou velocidade acima do limite. A notificação, dizem, vai no CPF.",
      buzina: "🚨 plantão da Comarca FM: buzinaço solitário na faixa de pedestres. A cidade inteira ouviu.",
      ciclista: "🚨 plantão da Comarca FM: ciclista relata 'ventinho de retrovisor' na avenida. O metro e meio é lei, lembra o locutor.",
      contrafluxo: "🚨 plantão da Comarca FM: 'quase manchete' — dois carros se cruzaram a um fôlego na avenida. Respirem, ouvintes."
    };
    if (estado.radio && NOTAS[rotulo]) {
      estado.radio.playlist.splice(estado.radio.i + 1, 0, NOTAS[rotulo]);
      estado.radio.t = 99;   // entra no ar imediatamente
    }
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

    // o evento aleatório da viagem: 0 vendedor · 1 ciclista · 2 quebra-molas
    const evento = (typeof opts.evento === "number") ? opts.evento : Math.floor(Math.random() * 3);

    estado = {
      z: 4, x: SX + 2.1, v: 0,
      infracoes: [],
      cinto: false,
      semaforo: "vermelho", paradoDesde: 0, semaforoOk: false,
      onibusFase: "longe", onibusT: 0,
      faixaAtiva: false, faixaOk: false,
      radarPego: false,
      evento: evento, eventoFeito: false, aguaComprada: false,
      buzinou: 0, lado: 0,
      radio: { ligada: true, playlist: montarPlaylist(), i: -1, t: 99 },
      chegou: false
    };
    grupoCarro.visible = true;
    grupoCarro.position.set(estado.x, 0, estado.z);
    grupoCarro.rotation.set(0, 0, 0);
    luzSemaforo.material.color.set(0xc94f4f);
    pedestres.forEach(function (p) { p.grupo.visible = false; });
    onibus.visible = true;
    onibus.position.set(SX + 2.4, 0, 188);
    vendedor.grupo.visible = (evento === 0);
    ciclista.visible = (evento === 1);
    ciclista.position.set(SX + 3.6, 0, 280);
    lombada.visible = (evento === 2);
    lombada.userData.placa.visible = (evento === 2);

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
        TOGA.cena3d.toastMundo("🚗 Cinto afivelado, retrovisor no lugar, Comarca FM no ar (R liga/desliga · B buzina). A ESMEC fica no fim da avenida — respeite a sinalização e estacione na vaga verde.");
      }
      ativo = true;
      if (TOGA.audio && TOGA.audio.motor) TOGA.audio.motor(true);
      dica(autopilot ? "o carro segue as regras sozinho — observe" : "W/▲ acelera · S/▼ freia · A/D faixa · B buzina · R rádio");
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
  function aoTecla(e) {
    const k = e.key.toLowerCase();
    teclas[k] = true;
    if (!ativo || !estado) return;
    if (k === "b") buzinar();
    if (k === "r") ligarRadio();
    if (k === "e") comprarAgua();
  }
  function aoSoltar(e) { teclas[e.key.toLowerCase()] = false; }

  function buzinar() {
    if (TOGA.audio) TOGA.audio.tocar("buzina");
    estado.buzinou++;
    const e = estado;
    // buzinar para apressar quem atravessa: feio (CTB, art. 41)
    if (e.faixaAtiva && e.z > 240 && e.z < 258) {
      infracao("buzina", "🚨 Buzinar para apressar pedestre na faixa (CTB, art. 41): a buzina é aviso, não chicote. Os dois olham para o carro do fórum — e seguem no MESMO passo, por princípio.");
      return;
    }
    if (e.buzinou === 1 && TOGA.cena3d) {
      TOGA.cena3d.toastMundo("📣 Fom-fom! Do ponto de ônibus, um senhor acena de volta achando que conhece você. Talvez conheça — comarca é assim.");
    }
  }

  function comprarAgua() {
    const e = estado;
    if (e.evento !== 0 || e.aguaComprada) return;
    // só com o carro parado no sinal, ao lado do vendedor
    if (e.semaforo === "vermelho" && e.v < 0.3 && e.z > 124 && e.z < 137) {
      e.aguaComprada = true;
      vendedor.setEmocao("feliz");
      if (TOGA.motor && TOGA.motor.estado) {
        TOGA.motor.alterarEstresse(-2);
        TOGA.motor.salvar();
      }
      if (TOGA.cena3d) TOGA.cena3d.toastMundo("💧 Três reais, a garrafa gelada e um sorriso: “o doutor não lembra de mim, mas eu fui na audiência dos vizinhos. O muro tá de pé até hoje!”. Você arredonda para cinco. O sinal abre mais leve.");
      if (TOGA.ui && TOGA.ui.atualizarHUD) TOGA.ui.atualizarHUD();
    }
  }

  function tick(dt) {
    if (!ativo || !estado) return;
    dt = Math.min(dt * turbo, 0.12 * turbo);
    const e = estado;
    const VMAX = 25;                       // 90 km/h

    /* ---- fases do ônibus ---- */
    if (e.onibusFase === "longe" && e.z > 150) {
      e.onibusFase = "parado";
      e.onibusT = 0;
    }
    if (e.onibusFase === "parado") {
      e.onibusT += dt;
      if (e.onibusT > 7) {
        e.onibusFase = "saindo";
        if (TOGA.cena3d && !autopilot) TOGA.cena3d.toastMundo("🚌 O ônibus liga a seta e sai do ponto. Quem esperou, segue junto — sem custo, sem susto.");
      }
    }
    if (e.onibusFase === "saindo") {
      onibus.position.z += 9 * dt;
      if (onibus.position.z > e.z + 80) { e.onibusFase = "foi"; onibus.visible = false; }
    }

    /* ---- controles (ou piloto automático) ---- */
    if (autopilot) {
      let alvoV = 14;
      if (e.semaforo === "vermelho" && e.z > 110 && e.z < 137) alvoV = Math.max(0, (135 - e.z) * 0.6);
      if (e.evento === 2 && e.z > 80 && e.z < 98) alvoV = Math.min(alvoV, 5);   // quebra-molas
      if (e.onibusFase === "parado" && e.z > 168 && e.z < 184) alvoV = Math.max(0, (182 - e.z) * 0.6);
      if (e.faixaAtiva && e.z > 230 && e.z < 256.5) alvoV = Math.max(0, (254.5 - e.z) * 0.6);
      if (e.evento === 1 && e.z > 265 && e.z < 312) { alvoV = Math.min(alvoV, 8); e.x += (SX + 1.2 - e.x) * Math.min(1, 2 * dt); }
      else if (e.z > 315 && e.z < 345) alvoV = Math.min(alvoV, 15);
      if (e.z > 420) alvoV = Math.max(0.6, (442 - e.z) * 0.35);
      if (e.z > 438) e.x += (SX + 2.9 - e.x) * Math.min(1, 2 * dt);
      else if (!(e.evento === 1 && e.z > 265 && e.z < 312)) e.x += (SX + 2.1 - e.x) * Math.min(1, 1.2 * dt);
      if (e.z > 441.5) alvoV = 0;
      e.v += (alvoV - e.v) * Math.min(1, 2.2 * dt);
      if (alvoV === 0 && e.v < 0.5) e.v = 0;
      e.lado = 0;
    } else {
      const acelerando = teclas["w"] || teclas["arrowup"];
      const freando = teclas["s"] || teclas["arrowdown"];
      const acel = acelerando ? 8 : freando ? -14 : -2.2;
      if (freando && e.v > 9 && TOGA.audio && !e._freiou) { TOGA.audio.tocar("freio"); e._freiou = true; }
      if (!freando) e._freiou = false;
      e.v = Math.max(-4, Math.min(VMAX, e.v + acel * dt));
      if (!acelerando && !freando && Math.abs(e.v) < 0.6) e.v = 0;
      // câmera olha para +z (tela: direita = −x): ◄/A vai para a ESQUERDA
      // da tela (+x) e ►/D para a DIREITA (−x). Antes estava invertido.
      const lado = (teclas["a"] || teclas["arrowleft"]) ? 1
                 : (teclas["d"] || teclas["arrowright"]) ? -1 : 0;
      // a pista inteira é alcançável (ultrapassagem do ônibus) —
      // mas o contra-fluxo é por conta e risco de quem ousa
      e.x = Math.max(SX - 3.2, Math.min(SX + 3.4, e.x + lado * 3.2 * dt));
      e.lado = lado;
    }
    e.z += e.v * dt;
    if (e.z < 2) { e.z = 2; e.v = Math.max(0, e.v); }
    if (e.z > FIM + 6) { e.z = FIM + 6; e.v = 0; dica("a vaga ficou para trás — dê ré (S/▼)"); }

    /* ---- colisão suave com o ônibus parado ---- */
    if (e.onibusFase !== "foi" && e.onibusFase !== "longe" && onibus.visible) {
      const oz = onibus.position.z, ox = onibus.position.x;
      if (Math.abs(e.x - ox) < 1.9 && e.z > oz - 5.8 && e.z < oz + 4.2) {
        e.z = oz - 5.8;
        if (e.v > 0) e.v = 0;
      }
    }

    /* ---- tráfego contrário + risco de contra-fluxo ---- */
    trafego.forEach(function (t) {
      t.z -= t.vel * dt;
      if (t.z < -20) t.z = FIM + 20;
      t.grupo.position.z = t.z;
      t.rodas.forEach(function (r) { r.rotation.x -= t.vel * dt / 0.3; });
      if (!e.chegou && e.x < SX - 0.4 && t.z > e.z && t.z - e.z < 12) {
        infracao("contrafluxo", "🚨 Fino com o carro do sentido contrário! Ultrapassagem só com a pista LIVRE (CTB, art. 203) — o susto foi recíproco, e a manchete quase foi outra.");
      }
    });

    /* ---- 1) o semáforo ---- */
    if (e.semaforo === "vermelho") {
      if (e.v < 0.3 && e.z > 124 && e.z < 137) {
        e.paradoDesde += dt;
        if (e.evento === 0 && !e.aguaComprada && !autopilot) dica("💧 vendedor na janela — E compra a água (R$ 3)");
        if (e.paradoDesde > 1.4) {
          e.semaforo = "verde";
          luzSemaforo.material.color.set(0x6fbf6f);
          if (!e.semaforoOk) { e.semaforoOk = true;
            if (TOGA.cena3d) TOGA.cena3d.toastMundo("🚦 Verde. Do carro ao lado, um senhor de bigode reconhece você da audiência dos vizinhos e acena. Juiz parado no sinal ensina mais trânsito que campanha de maio.");
            if (e.radio) { e.radio.playlist.splice(e.radio.i + 1, 0,
              "✅ Comarca FM registra: o sinal da avenida foi respeitado até vazio. Tem dia que a cidade dá certo, ouvintes.");
              e.radio.t = 99; } }
        }
      } else { e.paradoDesde = 0; }
      if (e.z > 137.6) {
        e.semaforo = "verde";
        luzSemaforo.material.color.set(0x6fbf6f);
        infracao("semaforo", "🚨 Você avançou o sinal vermelho (CTB, art. 208). O flash do cruzamento não pergunta a profissão de ninguém — e a cidade viu a toga passar por cima da regra.");
      }
    }

    /* ---- quebra-molas (evento 2) ---- */
    if (e.evento === 2 && !e.eventoFeito && e.z > 95 && e.z < 97.5) {
      e.eventoFeito = true;
      if (e.v > 12) {
        grupoCarro.position.y = 0.45;   // o pulo
        setTimeout(function () { if (grupoCarro) grupoCarro.position.y = 0; }, 220);
        if (TOGA.motor && TOGA.motor.estado) { TOGA.motor.alterarEstresse(2); TOGA.motor.salvar(); }
        if (TOGA.cena3d) TOGA.cena3d.toastMundo("🦘 O quebra-molas estava SINALIZADO, doutor. O porta-luvas abre sozinho em protesto e a suspensão consigna a inconformidade em ata.");
      } else if (TOGA.cena3d) {
        TOGA.cena3d.toastMundo("✓ Quebra-molas vencido em marcha de cortejo. A suspensão agradece; o cafezinho imaginário do porta-copos, também.");
      }
    }

    /* ---- 2) a faixa de pedestres ---- */
    if (!e.faixaAtiva && !e.faixaOk && e.z > 225) {
      e.faixaAtiva = true;
      pedestres.forEach(function (p, i) {
        p.grupo.visible = true;
        p.grupo.position.set(SX - 6.5 - i * 1.2, 0, 259.8);
      });
    }
    if (e.faixaAtiva) {
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

    /* ---- ciclista (evento 1): 1,5 m de distância lateral ---- */
    if (e.evento === 1 && ciclista.visible) {
      ciclista.position.z += 4.2 * dt;
      if (ciclista.position.z > 370) ciclista.visible = false;
      if (!e.eventoFeito && Math.abs(ciclista.position.z - e.z) < 2.4) {
        if (Math.abs(e.x - ciclista.position.x) < 1.5 && e.v > 6) {
          e.eventoFeito = true;
          infracao("ciclista", "🚨 Ultrapassar ciclista exige 1,5 m de distância lateral (CTB, art. 201). O retrovisor dele balançou — e a confiança dele no trânsito, também.");
        } else if (Math.abs(e.x - ciclista.position.x) >= 1.5 && e.z > ciclista.position.z) {
          e.eventoFeito = true;
          if (TOGA.cena3d) TOGA.cena3d.toastMundo("🚲 Ultrapassagem de manual: 1,5 m de respeito (CTB, art. 201). O ciclista levanta o polegar sem olhar para trás — quem pedala reconhece quem dirige direito.");
        }
      }
    }

    /* ---- 3) o radar ---- */
    if (!e.radarPego && e.z > 320 && e.z < 345 && e.v > 17.4) {
      e.radarPego = true;
      infracao("radar", "📸 O totem amarelo pisca: acima de 60 km/h na via fiscalizada. A notificação chega no CPF, não no cargo — como deve ser.");
    }

    /* ---- 4) a vaga ---- */
    if (farolVaga) {
      farolVaga.material.opacity = 0.22 + Math.abs(Math.sin(performance.now() / 400)) * 0.18;
      farolVaga.visible = !e.chegou;
    }
    if (!e.chegou && Math.abs(e.v) < 0.25 && e.z > 439 && e.z < 448 && e.x > SX + 1.5) {
      e.v = 0;
      e.chegou = true;
      concluir();
    }

    /* ---- o carro vive: rodas, inclinação, som ---- */
    grupoCarro.position.x = e.x;
    grupoCarro.position.z = e.z;
    rodas.forEach(function (r) { r.rotation.x += e.v * dt / 0.3; });
    const inclinaAlvo = (e.lado || 0) * -0.05;
    grupoCarro.rotation.z += (inclinaAlvo - grupoCarro.rotation.z) * Math.min(1, 6 * dt);
    if (TOGA.audio && TOGA.audio.motorGiro) TOGA.audio.motorGiro(Math.abs(e.v) / VMAX);

    /* ---- câmera com FOV vivo + HUD ---- */
    const cam = TOGA.nucleo3d.camera;
    cam.position.set(e.x, 3.1, e.z - 6.5);
    cam.lookAt(e.x, 1.0, e.z + 6);
    const fovAlvo = 60 + (Math.abs(e.v) / VMAX) * 9;
    if (Math.abs(cam.fov - fovAlvo) > 0.25) {
      cam.fov += (fovAlvo - cam.fov) * Math.min(1, 3 * dt);
      cam.updateProjectionMatrix();
    }

    tickRadio(dt);
    const velEl = document.querySelector("#hud-carro .vel");
    if (velEl) velEl.textContent = Math.round(Math.abs(e.v) * 3.6);
    if (!autopilot) {
      if (e.semaforo === "vermelho" && e.z > 100 && e.z < 124) dica("🚦 sinal VERMELHO à frente — pare na linha");
      else if (e.onibusFase === "parado" && e.z > 158 && e.z < 190) dica("🚌 ônibus no ponto — espere ou ultrapasse com a pista LIVRE");
      else if (e.faixaAtiva) dica("🚶 pedestres na faixa — pare e espere");
      else if (e.evento === 1 && e.z > 260 && e.z < 315) dica("🚲 ciclista à direita — 1,5 m para passar");
      else if (e.z > 310 && e.z < 345) dica("📸 radar 60 km/h");
      else if (e.z > 420) dica("🅿 estacione na vaga VERDE (coluna de luz), à direita, e PARE o carro");
      else dica("ESMEC a " + Math.max(0, Math.round(443 - e.z)) + " m — W/▲ acelera · A/D faixa · B buzina · R rádio");
    }
  }

  function notaBaliza() {
    // distância do centro da vaga (x SX+2.9 · z 443.5)
    const dx = Math.abs(estado.x - (SX + 2.9));
    const dz = Math.abs(estado.z - 443.5);
    const nota = Math.max(4, Math.round(10 - (dx * 1.4 + dz * 0.5) * 3));
    return nota >= 10
      ? "🅿 Baliza nota 10 — milimétrica! O vigia da ESMEC aplaude de longe, sem ironia perceptível."
      : nota >= 8
        ? "🅿 Baliza nota " + nota + " — entrou bonito, com folga regulamentar."
        : "🅿 Baliza nota " + nota + " — entrou, digamos, com personalidade. A vaga do vizinho agradece a visita.";
  }

  function limparHud() {
    const el = document.getElementById("hud-carro");
    if (el) el.remove();
    const radio = document.getElementById("hud-radio");
    if (radio) radio.remove();
  }

  function concluir() {
    ativo = false;
    desligarTeclas();
    if (TOGA.audio && TOGA.audio.motor) TOGA.audio.motor(false);
    const inf = estado.infracoes.slice();
    const baliza = notaBaliza();
    limparHud();
    grupoCarro.visible = false;
    const cam = TOGA.nucleo3d.camera;
    if (cam && cam.fov !== 60) { cam.fov = 60; cam.updateProjectionMatrix(); }
    if (TOGA.cena3d && TOGA.cena3d.esconderJogador) TOGA.cena3d.esconderJogador(false);
    if (TOGA.cena3d && TOGA.cena3d.toastMundo) TOGA.cena3d.toastMundo(baliza);
    if (aoChegarCb) aoChegarCb({ infracoes: inf });
  }

  /* aborta no meio (voltar ao fórum sem terminar) */
  function cancelar() {
    if (!ativo) return;
    ativo = false;
    desligarTeclas();
    if (TOGA.audio && TOGA.audio.motor) TOGA.audio.motor(false);
    limparHud();
    grupoCarro.visible = false;
    const cam = TOGA.nucleo3d.camera;
    if (cam && cam.fov !== 60) { cam.fov = 60; cam.updateProjectionMatrix(); }
    if (TOGA.cena3d && TOGA.cena3d.esconderJogador) TOGA.cena3d.esconderJogador(false);
  }

  return {
    iniciarViagem: iniciarViagem,
    cancelar: cancelar,
    get ativo() { return ativo; },
    get SX() { return SX; }
  };
})();
