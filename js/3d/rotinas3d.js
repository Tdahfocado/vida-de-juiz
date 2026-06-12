/* ============================================================
   TOGA 3D — rotinas3d.js : o FÓRUM VIVO
   ------------------------------------------------------------
   Dois serviços:

   1. CAMINHADOR genérico — irPara(boneco, waypoints, opts).
      É A implementação de "andar até um lugar": a entrada do
      elenco na audiência (cena3d), a escolta da prisão
      (prisao3d) e as rotinas abaixo usam a MESMA função.
      NPCs não consultam colisores: os waypoints são traçados
      pelos vãos das portas.

   2. ROTINAS — pequenos roteiros em loop que enchem o fórum
      de vida: servidor levando autos ao gabinete, oficial de
      justiça circulando, fila da distribuição andando, uma
      dupla conversando no corredor e a 2ª VARA em audiência
      permanente (outro juiz, outras partes, martelo ao longe).

   Qualidade "baixa": só o essencial (guichê + 2ª vara parada).
   ============================================================ */

window.TOGA = window.TOGA || {};

TOGA.rotinas3d = (function () {
  if (!window.THREE) return {};

  let registrado = false;
  const caminhantes = [];     // { boneco, caminho[], vel, aoChegar }
  const rotinas = [];         // { boneco, passos[], i, espera, aoFimPasso }
  const elenco = [];          // bonecos cujo tick é nosso
  const criancas = [];        // as crianças da brinquedoteca (cena3d brinca com elas)
  let assistenteSocial = null;
  let lourdes = null;         // a dona da copa (e do coração do fórum)
  let matias = null;          // o zelador que sabe de tudo
  let guarda = null;          // o policial do corredor
  let bruna = null;           // assessora: prazos e sistemas
  let beatriz = null;         // assessora: pesquisa e jurisprudência
  let samantha = null;        // supervisora da unidade (diretoria)

  /* avatares sóbrios para a figuração (pool local) */
  const PELES = ["#d8a87f", "#c98e66", "#a86a48", "#8a5436", "#e8c39a"];
  const CABELOS = ["curto", "coque", "longo", "calvo"];
  const CORES = ["#33424f", "#4a4438", "#3a3a40", "#54453a", "#2f4a3e", "#5a4a52",
                 "#6a4a5a", "#4a5a6e", "#6e5a3a", "#556a55", "#7a6248", "#3f5a5e"];
  function avatarAleatorio(extra) {
    return Object.assign({
      pele: PELES[Math.floor(Math.random() * PELES.length)],
      cabelo: CABELOS[Math.floor(Math.random() * CABELOS.length)],
      corCabelo: ["#241a10", "#3a2a1a", "#574737", "#777268"][Math.floor(Math.random() * 4)],
      traje: Math.random() < 0.5 ? "camisa" : "blazer",
      corTraje: CORES[Math.floor(Math.random() * CORES.length)],
      oculos: Math.random() < 0.25
    }, extra || {});
  }

  function garantirTick() {
    if (registrado) return;
    registrado = true;
    TOGA.nucleo3d.aoFrame(tick);
  }

  /* ---------- 1. Caminhador ---------- */
  function irPara(boneco, caminho, opts) {
    opts = opts || {};
    cancelar(boneco);
    caminhantes.push({
      boneco: boneco,
      caminho: caminho.slice(),
      vel: opts.vel || 1.8,
      aoChegar: opts.aoChegar || null
    });
    garantirTick();
  }

  function cancelar(boneco) {
    for (let i = caminhantes.length - 1; i >= 0; i--) {
      if (caminhantes[i].boneco === boneco) caminhantes.splice(i, 1);
    }
  }

  function tickCaminhantes(dt) {
    for (let i = caminhantes.length - 1; i >= 0; i--) {
      const c = caminhantes[i];
      const g = c.boneco.grupo;
      const alvo = c.caminho[0];
      if (!alvo) { caminhantes.splice(i, 1); continue; }
      const dx = alvo.x - g.position.x, dz = alvo.z - g.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < 0.08) {
        c.caminho.shift();
        if (!c.caminho.length) {
          g.userData.andando = false;
          const fim = c.aoChegar;
          caminhantes.splice(i, 1);
          if (fim) fim();
        }
        continue;
      }
      const passo = Math.min(dist, c.vel * dt);
      g.position.x += (dx / dist) * passo;
      g.position.z += (dz / dist) * passo;
      g.userData.andando = true;
      g.rotation.y = Math.atan2(dx, dz);
    }
  }

  /* ---------- 2. Rotinas (roteiros em loop) ----------
     Passos: {ir:[{x,z}...]} {esperar:s} {sentar:{x,z,rot,dur}}
             {segurar:[prop,lado]} {acao:nome} {falar:s} {rot:ang} */
  function adicionarRotina(boneco, passos) {
    elenco.push(boneco);
    rotinas.push({ boneco: boneco, passos: passos, i: -1, espera: 0, executando: false });
    garantirTick();
  }

  function avancarRotina(r) {
    r.executando = false;
    r.i = (r.i + 1) % r.passos.length;
    const p = r.passos[r.i];
    if (p.ir) {
      r.executando = true;
      irPara(r.boneco, p.ir, { aoChegar: function () { r.executando = false; } });
    } else if (p.esperar != null) {
      r.espera = p.esperar;
    } else if (p.sentar) {
      r.boneco.grupo.position.set(p.sentar.x, 0, p.sentar.z);
      if (p.sentar.rot != null) r.boneco.grupo.rotation.y = p.sentar.rot;
      r.boneco.sentar(true);
      r.espera = p.sentar.dur || 8;
      r.aoFimEspera = function () { r.boneco.sentar(false); };
    } else if (p.segurar) {
      r.boneco.segurar(p.segurar[0], p.segurar[1] || "dir");
    } else if (p.acao) {
      r.executando = true;
      r.boneco.executarAcao(p.acao, function () { r.executando = false; });
    } else if (p.falar != null) {
      r.boneco.falando(true);
      r.espera = p.falar;
      r.aoFimEspera = function () { r.boneco.falando(false); };
    } else if (p.rot != null) {
      r.boneco.grupo.rotation.y = p.rot;
    }
  }

  function tickRotinas(dt) {
    rotinas.forEach(function (r) {
      if (r.executando) return;
      if (r.espera > 0) {
        r.espera -= dt;
        if (r.espera > 0) return;
        if (r.aoFimEspera) { const fn = r.aoFimEspera; r.aoFimEspera = null; fn(); }
      }
      avancarRotina(r);
    });
  }

  /* ---------- 3. A 2ª vara: o NÚCLEO DE CUSTÓDIA ----------
     Quem preside é a Juíza Adriana da Cruz Dantas, coordenadora
     do Núcleo de Custódia e do Juízo das Garantias — a vara
     vive em audiência de custódia: há sempre um custodiado
     algemado diante dela, e o fluxo da cela alimenta a pauta. */
  let vara2 = null;
  function montarVara2(scene, viva) {
    const P = TOGA.mundo3d.pontos;
    const juiz = TOGA.boneco3d.criar(
      { id: "juizaAdriana",
        avatar: { pele: "#c98e66", cabelo: "coque", corCabelo: "#2c1c10", oculos: true } },
      { toga: true, sentado: true });
    juiz.grupo.position.set(P.bancadaVara2.x, 0.4, P.bancadaVara2.z);
    juiz.grupo.rotation.y = Math.PI;
    scene.add(juiz.grupo);
    elenco.push(juiz);

    const partes = P.assentosVara2.map(function (a, i) {
      const b = TOGA.boneco3d.criar({ id: "vara2", avatar: avatarAleatorio() }, { sentado: true });
      b.grupo.position.set(a.x, 0, a.z);
      b.grupo.rotation.y = 0;
      // o segundo assento é do CUSTODIADO da vez
      if (i === 1) {
        b.executarAcao("algemado");
        b.segurar("algemas", "dir");
        b.setEmocao("medo");
      }
      scene.add(b.grupo);
      elenco.push(b);
      return b;
    });

    // mini-martelo sobre a bancada da 2ª vara
    const martelo = TOGA.props3d.criar("marteloMao");
    martelo.position.set(P.bancadaVara2.x + 1.1, 1.40, P.bancadaVara2.z - 0.4);
    martelo.rotation.z = 1.2;
    scene.add(martelo);

    vara2 = { juiz: juiz, partes: partes, martelo: martelo,
              viva: viva, falaEm: 6, marteloEm: 30, animMartelo: 0 };
  }

  function tickVara2(dt) {
    if (!vara2 || !vara2.viva) return;
    vara2.falaEm -= dt;
    if (vara2.falaEm <= 0) {
      vara2.falaEm = 12 + Math.random() * 8;
      const todos = [vara2.juiz].concat(vara2.partes);
      todos.forEach(function (b) { b.falando(false); });
      const sorteado = todos[Math.floor(Math.random() * todos.length)];
      sorteado.falando(true);
      setTimeout(function () { sorteado.falando(false); }, 4000);
    }
    vara2.marteloEm -= dt;
    if (vara2.marteloEm <= 0) {
      vara2.marteloEm = 45 + Math.random() * 20;
      vara2.animMartelo = 0.5;
      // o som só alcança quem está perto da 2ª vara
      const e = TOGA.controles3d.estado && TOGA.controles3d.estado();
      if (e && TOGA.audio) {
        const P = TOGA.mundo3d.pontos.bancadaVara2;
        const d = Math.hypot(P.x - e.pos.x, P.z - e.pos.z);
        if (d < 9) TOGA.audio.tocar("martelo");
      }
    }
    if (vara2.animMartelo > 0) {
      vara2.animMartelo -= dt;
      const k = Math.max(0, vara2.animMartelo / 0.5);
      vara2.martelo.rotation.z = 1.2 + Math.sin((1 - k) * Math.PI) * -0.8;
    }
  }

  /* ---------- 4. O elenco fixo do fórum ---------- */
  function iniciarElenco(reduzido) {
    const scene = TOGA.nucleo3d.scene;
    const P = TOGA.mundo3d.pontos;

    // servidor da distribuição: atende o guichê o dia inteiro
    const balconista = TOGA.boneco3d.criar(
      { id: "balconista", avatar: avatarAleatorio({ traje: "camisa" }) }, { sentado: true });
    balconista.grupo.position.set(7.4, 0, -2.65);
    balconista.grupo.rotation.y = 0;
    scene.add(balconista.grupo);
    adicionarRotina(balconista, [
      { esperar: 24 + Math.random() * 10 },
      { acao: "entregar" }
    ]);

    // assistente social: na sala dela, com pausas para o café
    assistenteSocial = TOGA.boneco3d.criar(
      { id: "assistenteSocial", avatar: avatarAleatorio({ traje: "blazer", cabelo: "coque", oculos: true }) },
      { sentado: true });
    assistenteSocial.grupo.position.set(22.2, 0, -5.75);
    assistenteSocial.grupo.rotation.y = 0;
    scene.add(assistenteSocial.grupo);
    adicionarRotina(assistenteSocial, [
      { esperar: 60 + Math.random() * 40 },
      { segurar: ["xicara", "dir"] },
      { acao: "beber" },
      { segurar: [null, "dir"] }
    ]);

    // as CRIANÇAS da brinquedoteca (o fórum que não assusta criança)
    criancas.length = 0;
    [{ x: -0.5, z: -5.0, ry: 2.4, traje: "#c94f4f", cabelo: "longo" },
     { x: 0.35, z: -6.1, ry: -0.6, traje: "#4a6ab8", cabelo: "curto" }].forEach(function (p, i) {
      const c = TOGA.boneco3d.criar(
        { id: "crianca" + i,
          avatar: { pele: PELES[(i * 2 + 1) % PELES.length], cabelo: p.cabelo,
                    corCabelo: "#241a10", traje: "camisa", corTraje: p.traje } }, {});
      c.grupo.scale.setScalar(0.62);
      c.grupo.position.set(p.x, 0, p.z);
      c.grupo.rotation.y = p.ry;
      c.setEmocao("feliz");
      scene.add(c.grupo);
      elenco.push(c);
      criancas.push(c);
    });

    // O GABINETE TEM EQUIPE: Bruna (prazos e sistemas) e
    // Beatriz (pesquisa e jurisprudência), além da Laís
    // Bruna: trabalha na estação dela e CIRCULA — leva autos ao
    // balcão da secretaria e volta (prazos não andam sozinhos)
    bruna = TOGA.boneco3d.criar(
      { id: "bruna",
        avatar: { pele: "#d8a87f", cabelo: "longo", corCabelo: "#3a2a1a",
                  traje: "blazer", corTraje: "#4a5a6e", corBlusa: "#efe5c8" } }, {});
    bruna.grupo.position.set(-9.2, 0, -7.4);
    scene.add(bruna.grupo);
    adicionarRotina(bruna, [
      { sentar: { x: -9.2, z: -7.4, rot: Math.PI, dur: 26 } },
      { segurar: ["autos", "esq"] },
      { ir: [{ x: -9.5, z: -5.2 }, { x: -9.6, z: 0.4 }, { x: 5.0, z: -1.2 }] },
      { esperar: 7 },
      { segurar: [null, "esq"] },
      { ir: [{ x: -9.6, z: 0.4 }, { x: -9.5, z: -5.2 }, { x: -9.2, z: -7.0 }] },
      { sentar: { x: -9.2, z: -7.4, rot: Math.PI, dur: 20 } },
      { acao: "lerPapel" }
    ]);

    // Beatriz: pesquisa na estação, consulta a estante do gabinete
    // e estica até a copa (jurisprudência rende mais com café)
    beatriz = TOGA.boneco3d.criar(
      { id: "beatriz",
        avatar: { pele: "#8a5436", cabelo: "coque", corCabelo: "#241505",
                  traje: "camisa", corTraje: "#556a55", oculos: true } }, {});
    beatriz.grupo.position.set(-12.6, 0, -3.6);
    scene.add(beatriz.grupo);
    adicionarRotina(beatriz, [
      { sentar: { x: -12.6, z: -3.6, rot: Math.PI, dur: 30 } },
      { ir: [{ x: -13.2, z: -4.3 }] },
      { segurar: ["pastas", "esq"] },
      { acao: "lerPapel" },
      { ir: [{ x: -9.6, z: -2.6 }, { x: -9.6, z: 0.6 }, { x: -4.8, z: 0.6 }, { x: -4.8, z: -3.2 }, { x: -4.0, z: -5.2 }] },
      { esperar: 9 },
      { segurar: [null, "esq"] },
      { ir: [{ x: -4.8, z: -2.8 }, { x: -4.8, z: 0.6 }, { x: -9.6, z: 0.6 }, { x: -9.6, z: -2.6 }, { x: -12.4, z: -3.3 }] },
      { sentar: { x: -12.6, z: -3.6, rot: Math.PI, dur: 24 } }
    ]);

    // SAMANTHA: supervisora da unidade, na DIRETORIA DO FORO
    samantha = TOGA.boneco3d.criar(
      { id: "samantha",
        avatar: { pele: "#c98e66", cabelo: "longo", corCabelo: "#1d1209",
                  traje: "blazer", corTraje: "#6a4a5a", corBlusa: "#e8e2d2", oculos: true } },
      { sentado: true });
    samantha.grupo.position.set(5.4, 0, -7.55);
    samantha.grupo.rotation.y = 0;   // sentada à mesa, de frente para a porta
    scene.add(samantha.grupo);
    adicionarRotina(samantha, [
      { esperar: 30 + Math.random() * 15 },
      { segurar: ["autos", "esq"] },
      { acao: "lerPapel" },
      { segurar: [null, "esq"] }
    ]);

    // DONA LOURDES: a copa é dela (o fórum é que funciona dentro)
    lourdes = TOGA.boneco3d.criar(
      { id: "lourdes",
        avatar: { pele: "#a86a48", cabelo: "coque", corCabelo: "#b9b3a6",
                  traje: "vestido", corTraje: "#7a4a3a" } }, {});
    lourdes.grupo.position.set(-4.7, 0, -7.0);
    lourdes.grupo.rotation.y = Math.PI;          // de frente para a copa
    scene.add(lourdes.grupo);
    adicionarRotina(lourdes, [
      { esperar: 18 + Math.random() * 12 },
      { segurar: ["xicara", "dir"] },
      { acao: "beber" },
      { segurar: [null, "dir"] },
      { esperar: 14 },
      { segurar: ["pao", "esq"] },
      { acao: "entregar" },
      { segurar: [null, "esq"] }
    ]);
    elenco.push(lourdes);

    // SEU MATIAS: o zelador — circula o fórum inteiro, de vassoura
    matias = TOGA.boneco3d.criar(
      { id: "matias",
        avatar: { pele: "#8a5436", cabelo: "calvo", corCabelo: "#9a9388",
                  traje: "camisa", corTraje: "#5a6a55", barba: true } }, {});
    matias.grupo.position.set(-6, 0, 1);
    matias.segurar("vassoura", "esq");
    scene.add(matias.grupo);
    adicionarRotina(matias, [
      { ir: [{ x: -11, z: 1 }] },
      { esperar: 6 },
      { ir: [{ x: -2, z: -0.8 }, { x: 6, z: 0.9 }] },
      { esperar: 8 },
      { ir: [{ x: 14, z: -0.6 }] },
      { esperar: 6 },
      { ir: [{ x: 24, z: 0.6 }] },
      { esperar: 9 },
      { ir: [{ x: 9, z: -1 }] },
      { esperar: 5 }
    ]);
    elenco.push(matias);

    // POLICIAMENTO fixo: um agente no corredor, outro na 1ª vara
    guarda = TOGA.boneco3d.criar(
      { id: "guardaCorredor", avatar: { pele: "#c98e66", cabelo: "curto", corCabelo: "#241a10", traje: "camisa", corTraje: "#2b3340" } },
      { quepe: true });
    guarda.grupo.position.set(-12.6, 0, 1.4);
    guarda.grupo.rotation.y = -Math.PI / 2;
    scene.add(guarda.grupo);
    elenco.push(guarda);

    const guardaSala = TOGA.boneco3d.criar(
      { id: "guardaSala", avatar: { pele: "#a86a48", cabelo: "curto", corCabelo: "#1d1209", traje: "camisa", corTraje: "#2b3340" } },
      { quepe: true });
    guardaSala.grupo.position.set(-5.2, 0, 3.0);
    guardaSala.grupo.rotation.y = Math.PI / 3;   // de olho na sala
    scene.add(guardaSala.grupo);
    elenco.push(guardaSala);

    // médica do setor de saúde
    const medica = TOGA.boneco3d.criar(
      { id: "medica", avatar: { pele: "#d8a87f", cabelo: "coque", corCabelo: "#4a3318", traje: "blazer", corTraje: "#e8e6da", corBlusa: "#cfd8cf", oculos: true } },
      { sentado: true });
    medica.grupo.position.set(27.4, 0, -4.95);
    medica.grupo.rotation.y = 0;
    scene.add(medica.grupo);
    elenco.push(medica);

    montarVara2(scene, !reduzido);
    garantirTick();
    if (reduzido) return;   // celular: sem caminhantes extras

    iniciarEscoltaVara2(scene);

    // servidor que leva autos da distribuição ao gabinete (e volta)
    const servidor = TOGA.boneco3d.criar(
      { id: "servidorAutos", avatar: avatarAleatorio({ traje: "camisa" }) });
    servidor.grupo.position.set(6.6, 0, -5);
    scene.add(servidor.grupo);
    adicionarRotina(servidor, [
      { segurar: ["autos", "esq"] },
      { ir: [{ x: 4, z: -3 }, { x: 4, z: -0.5 }, { x: -9.6, z: -0.5 }, { x: -9.6, z: -3.4 }, { x: -7.8, z: -4.4 }] },
      { esperar: 5 },
      { segurar: [null, "esq"] },
      { ir: [{ x: -9.6, z: -3.4 }, { x: -9.6, z: -0.5 }, { x: 4, z: -0.5 }, { x: 4, z: -3 }, { x: 6.6, z: -5 }] },
      { esperar: 18 }
    ]);

    // oficial de justiça: circula entre o balcão e a 2ª vara
    const oficial = TOGA.boneco3d.criar(
      { id: "oficial", avatar: avatarAleatorio({ traje: "terno", corTraje: "#33424f" }) });
    oficial.grupo.position.set(-12.5, 0, 0.5);
    scene.add(oficial.grupo);
    adicionarRotina(oficial, [
      { segurar: ["pastas", "esq"] },
      { ir: [{ x: 5.5, z: -0.6 }] },
      { esperar: 7 },
      { ir: [{ x: 15.4, z: 1.2 }, { x: 15.4, z: 3.4 }] },
      { esperar: 9 },
      { ir: [{ x: 15.4, z: 1.2 }, { x: -12.5, z: 0.5 }] },
      { esperar: 12 }
    ]);

    // advogada: bebe água no bebedouro e acompanha a pauta
    const advogada = TOGA.boneco3d.criar(
      { id: "advogadaRotina", avatar: avatarAleatorio({ traje: "blazer", cabelo: "longo" }) });
    advogada.grupo.position.set(11.6, 0, 0.8);
    scene.add(advogada.grupo);
    adicionarRotina(advogada, [
      { ir: [{ x: 10.5, z: -1.0 }] },
      { segurar: ["copo", "dir"] },
      { acao: "beber" },
      { segurar: [null, "dir"] },
      { ir: [{ x: 12.6, z: 0.6 }] },
      { esperar: 14 },
      { ir: [{ x: 19, z: 0.6 }] },
      { esperar: 10 }
    ]);

    // ---- ALA LESTE ----
    // repórter de redação: digita na mesinha da Sala de Imprensa
    const reporter1 = TOGA.boneco3d.criar(
      { id: "reporter1", avatar: avatarAleatorio({ traje: "camisa", corTraje: "#7c5a6a" }) });
    reporter1.grupo.position.set(31.9, 0, 4.8);
    scene.add(reporter1.grupo);
    adicionarRotina(reporter1, [
      { sentar: { x: 31.9, z: 4.8, rot: 0, dur: 26 } },
      { segurar: ["pastas", "esq"] },
      { acao: "lerPapel" },
      { segurar: [null, "esq"] },
      { ir: [{ x: 34, z: 3.2 }, { x: 34, z: 0.8 }] },
      { esperar: 8 },
      { ir: [{ x: 34, z: 3.2 }, { x: 32.2, z: 4.4 }] },
      { sentar: { x: 31.9, z: 4.8, rot: 0, dur: 20 } }
    ]);

    // repórter de rua: ronda entre a sala, o bebedouro e o Salão do Júri
    const reporter2 = TOGA.boneco3d.criar(
      { id: "reporter2", avatar: avatarAleatorio({ traje: "blazer", cabelo: "longo" }) });
    reporter2.grupo.position.set(36.1, 0, 4.6);
    scene.add(reporter2.grupo);
    adicionarRotina(reporter2, [
      { segurar: ["pastas", "dir"] },
      { ir: [{ x: 34, z: 2.6 }, { x: 34, z: 0.6 }, { x: 24, z: 0.6 }] },
      { esperar: 10 },
      { ir: [{ x: 11.2, z: -0.8 }] },
      { esperar: 7 },
      { ir: [{ x: 24, z: 0.6 }, { x: 34, z: 0.6 }, { x: 34, z: 3.0 }, { x: 36.1, z: 4.6 }] },
      { segurar: [null, "dir"] },
      { esperar: 12 }
    ]);

    // advogado de plantão na sala da OAB: estuda autos, estica as pernas
    const advogadoOAB = TOGA.boneco3d.criar(
      { id: "advogadoOAB", avatar: avatarAleatorio({ traje: "terno", corTraje: "#2b2b33" }) });
    advogadoOAB.grupo.position.set(32.6, 0, -4.7);
    scene.add(advogadoOAB.grupo);
    adicionarRotina(advogadoOAB, [
      { sentar: { x: 32.6, z: -4.7, rot: Math.PI, dur: 24 } },
      { segurar: ["autos", "esq"] },
      { acao: "lerPapel" },
      { segurar: [null, "esq"] },
      { ir: [{ x: 31.9, z: -6.0 }] },
      { segurar: ["xicara", "dir"] },
      { acao: "beber" },
      { segurar: [null, "dir"] },
      { ir: [{ x: 34, z: -3.4 }, { x: 32.8, z: -4.2 }] },
      { sentar: { x: 32.6, z: -4.7, rot: Math.PI, dur: 18 } }
    ]);

    // a fila da distribuição anda (duas partes alternando posições)
    [0, 1].forEach(function (n) {
      const parte = TOGA.boneco3d.criar({ id: "fila" + n, avatar: avatarAleatorio() });
      const fila = P.filaDistribuicao;
      parte.grupo.position.set(fila[n].x, 0, fila[n].z);
      parte.grupo.rotation.y = Math.PI;        // de frente para o guichê
      scene.add(parte.grupo);
      adicionarRotina(parte, [
        { esperar: 26 + n * 9 },
        { ir: [{ x: 8.4, z: 0.8 }, { x: fila[2].x, z: fila[2].z }] },
        { rot: Math.PI },
        { esperar: 22 },
        { ir: [{ x: fila[n].x, z: fila[n].z }] },
        { rot: Math.PI }
      ]);
    });

    // dupla conversando perto do mural
    const c1 = TOGA.boneco3d.criar({ id: "conversa1", avatar: avatarAleatorio() });
    const c2 = TOGA.boneco3d.criar({ id: "conversa2", avatar: avatarAleatorio() });
    c1.grupo.position.set(-5.6, 0, 0.9); c1.grupo.rotation.y = Math.PI / 2;
    c2.grupo.position.set(-4.6, 0, 0.9); c2.grupo.rotation.y = -Math.PI / 2;
    scene.add(c1.grupo, c2.grupo);
    c1.olharPara(c2.cabecaMundo);
    c2.olharPara(c1.cabecaMundo);
    adicionarRotina(c1, [{ falar: 5 }, { esperar: 7 + Math.random() * 4 }]);
    adicionarRotina(c2, [{ esperar: 6 }, { falar: 5 }, { esperar: 6 + Math.random() * 4 }]);
  }

  /* ---------- Fluxo de presos: escolta periódica à 2ª vara ----------
     De tempos em tempos, um policial conduz um custodiado algemado
     do fundo da ala até a 2ª vara (audiência alheia), espera e volta.
     O fórum tem rotina — e nem todo preso é seu.                  */
  let escoltaV2 = null;

  function iniciarEscoltaVara2(scene) {
    escoltaV2 = { scene: scene, fase: "aguardando", em: 40 + Math.random() * 60, pol: null, preso: null };
  }

  function tickEscoltaVara2(dt) {
    if (!escoltaV2) return;
    const e = escoltaV2;
    e.em -= dt;
    if (e.em > 0) return;

    /* O FLUXO DA CUSTÓDIA, etapa por etapa:
       chega escoltado → espera na CELA temporária → é levado à
       2ª Vara (audiência com a Juíza Adriana) → deixa o fórum.
       A lei por trás do balé: preso apresentado em 24 horas
       (CPP, art. 310; Res. CNJ 213).                        */
    if (e.fase === "aguardando") {
      // nasce a dupla no fundo leste da ala (a viatura chegou)
      e.pol = TOGA.boneco3d.criar(
        { id: "polEscolta", avatar: { pele: "#d8a87f", cabelo: "curto", corCabelo: "#241a10", traje: "camisa", corTraje: "#2b3340" } },
        { quepe: true });
      e.preso = TOGA.boneco3d.criar({ id: "presoEscolta", avatar: avatarAleatorio({ traje: "camisa", corTraje: "#5a5148" }) });
      e.pol.grupo.position.set(29.2, 0, 0.6);
      e.preso.grupo.position.set(29.2, 0, 1.3);
      e.preso.executarAcao("algemado");
      e.preso.segurar("algemas", "dir");
      e.preso.setEmocao("triste");
      e.scene.add(e.pol.grupo, e.preso.grupo);
      elenco.push(e.pol, e.preso);
      // primeiro destino: a CELA temporária
      irPara(e.preso, [{ x: 16.4, z: 1.2 }, { x: 13.7, z: -1.2 }, { x: 13.7, z: -2.8 }, { x: 14.4, z: -5.0 }], { vel: 1.5 });
      irPara(e.pol, [{ x: 16.4, z: 0.6 }, { x: 13.7, z: -1.0 }, { x: 13.2, z: -2.4 }], { vel: 1.5 });
      e.fase = "indoCela"; e.em = 14;
      return;
    }
    if (e.fase === "indoCela") {       // o preso AGUARDA na cela; o policial guarda a porta
      e.preso.setEmocao("medo");
      e.fase = "naCela"; e.em = 24 + Math.random() * 18;
      return;
    }
    if (e.fase === "naCela") {         // chegou a vez: audiência de custódia na 2ª Vara
      irPara(e.preso, [{ x: 13.7, z: -2.6 }, { x: 13.7, z: -1.0 }, { x: 15.4, z: 3.0 }, { x: 15.2, z: 5.0 }], { vel: 1.4 });
      irPara(e.pol, [{ x: 13.7, z: -0.8 }, { x: 15.0, z: 2.8 }, { x: 14.4, z: 4.6 }], { vel: 1.4 });
      e.fase = "naVara"; e.em = 30 + Math.random() * 15;
      return;
    }
    if (e.fase === "naVara") {         // a Juíza Adriana decidiu: a dupla deixa o fórum
      irPara(e.pol, [{ x: 15.4, z: 2.6 }, { x: 16.4, z: 0.4 }, { x: 29.2, z: 0.6 }], {
        vel: 1.6,
        aoChegar: function () { removerDaEscolta(e.pol); e.pol = null; }
      });
      irPara(e.preso, [{ x: 15.4, z: 3.2 }, { x: 16.4, z: 1.1 }, { x: 29.2, z: 1.3 }], {
        vel: 1.6,
        aoChegar: function () { removerDaEscolta(e.preso); e.preso = null; }
      });
      e.fase = "aguardando"; e.em = 70 + Math.random() * 50;   // o fluxo não para
    }
  }

  function removerDaEscolta(b) {
    const i = elenco.indexOf(b);
    if (i >= 0) elenco.splice(i, 1);
    escoltaV2.scene.remove(b.grupo);
  }

  /* ---------- leitura espontânea ----------
     De tempos em tempos, um figurante parado pega os papéis
     e relê — o fórum trabalha mesmo quando ninguém olha.   */
  let proximaLeitura = 10;
  function tickLeitores(dt) {
    proximaLeitura -= dt;
    if (proximaLeitura > 0) return;
    proximaLeitura = 9 + Math.random() * 10;
    const livres = elenco.filter(function (b) {
      return !b.acao && !b.grupo.userData.andando && !b.sentado;
    });
    if (!livres.length) return;
    const b = livres[Math.floor(Math.random() * livres.length)];
    b.segurar("pastas", "esq");
    b.executarAcao("lerPapel", function () { b.segurar(null, "esq"); });
  }

  /* ---------- tick geral do módulo ---------- */
  function tick(dt, t) {
    tickCaminhantes(dt);
    tickRotinas(dt);
    tickVara2(dt);
    tickEscoltaVara2(dt);
    tickLeitores(dt);
    elenco.forEach(function (b) { b.tick(dt, t); });
  }

  return {
    irPara: irPara,
    cancelar: cancelar,
    adicionarRotina: adicionarRotina,
    iniciarElenco: iniciarElenco,
    criancas: function () { return criancas; },
    get assistenteSocial() { return assistenteSocial; },
    get lourdes() { return lourdes; },
    get matias() { return matias; },
    get guarda() { return guarda; },
    get bruna() { return bruna; },
    get beatriz() { return beatriz; },
    get samantha() { return samantha; }
  };
})();
