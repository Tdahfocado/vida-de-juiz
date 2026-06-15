/* ============================================================
   TOGA 3D — cena3d.js : a FACHADA do modo 3D
   ------------------------------------------------------------
   Este arquivo tem duas faces:

   1. A MESMA API da cena 2D (montar, setEmocao, falar,
      ajustarRelogio, martelo, carimbar) — o ui.js chama
      TOGA.cena.* sem saber qual modo está ativo. Trocar
      "TOGA.cena = TOGA.cena3d" liga o 3D; nada mais muda.

   2. O MODO MUNDO: free-roam pelo fórum (entrarMundo),
      interagíveis, objetivos no HUD e a transição
      andar → sentar na bancada → audiência.

   Princípio inegociável: motor.js e os casos não sabem que
   este arquivo existe.
   ============================================================ */

window.TOGA = window.TOGA || {};

TOGA.cena3d = (function () {
  if (!window.THREE) return null;

  let iniciado = false;
  let mundoInfo = null;
  let jogador = null;            // boneco do juiz (resultado de boneco3d.criar)
  let npcs = {};                 // bonecos da audiência, por id de personagem
  let npcsCorredor = [];         // figurantes do corredor
  let publico = [];              // figurantes sentados nos bancos do público
  let assessora = null;
  let luzFala = null;            // spotlight sobre quem fala
  let luzFalaAlvo = 0;           // intensidade desejada (fade no tick)
  let luzFalaPos = null;         // posição desejada (deslize no tick)
  let luzFalaMira = null;
  let emAudiencia = false;
  let animacoesRapidas = false;  // debug/bot: pula lerps
  let animMartelo = 0;

  /* Lugares possíveis do público (sobre os bancos do mundo.js)
     e um pequeno "elenco de figuração" gerado na hora.        */
  const LUGARES_PUBLICO = [
    { x: -3.4, z: 3.6 }, { x: -2.4, z: 3.6 }, { x: -1.5, z: 3.6 },
    { x: 3.6,  z: 3.6 }, { x: 4.6,  z: 3.6 }, { x: 5.5,  z: 3.6 },
    { x: -2.9, z: 4.8 }, { x: -1.9, z: 4.8 }, { x: 4.1,  z: 4.8 }, { x: 5.1, z: 4.8 }
  ];
  const LUGARES_PUBLICO_JURI = [
    { x: 22.0, z: 3.4 }, { x: 22.7, z: 3.6 },
    { x: 22.0, z: 4.7 }, { x: 22.7, z: 4.9 },
    { x: 22.0, z: 6.0 }, { x: 22.7, z: 6.2 }
  ];
  const PELES = ["#d8a87f", "#c98e66", "#a86a48", "#8a5436", "#e8c39a"];
  const CABELOS = ["curto", "coque", "longo", "calvo"];
  const CORES_SOBRIAS = ["#33424f", "#4a4438", "#3a3a40", "#54453a", "#2f4a3e", "#5a4a52",
                         "#6a4a5a", "#4a5a6e", "#6e5a3a", "#556a55", "#7a6248", "#3f5a5e"];

  // Interlúdios que chegam como "entrega" no balcão (os demais, com a assessora)
  const ENTREGAS = { int_mangas: 1, int_frouxo: 1, int_gatos_pacto: 1, int_juri_arma: 1, int_comunidade: 1 };
  // ...e os INSTITUCIONAIS (Corregedoria, CNJ) passam pela DIRETORIA:
  // é a Samantha quem entrega o que vem de cima
  const SAMANTHA_ENTREGA = { int_metas: 1, int_decoro: 1 };

  /* há ofício institucional esperando a liberação da diretoria? */
  function expedienteAguardando() {
    const e = TOGA.motor.estado;
    if (!e || e.flags._expedienteSamantha) return false;
    return ["capacitacao", "acm", "esmec"].some(function (id) {
      const d = (TOGA.despachos || []).find(function (x) { return x.id === id; });
      if (!d || e.flags["_desp_" + id]) return false;
      const p = d.pauta || "dia1";
      if (p !== "*" && p !== e.pauta) return false;
      // simula a liberação para saber se o ofício existiria hoje
      e.flags._expedienteSamantha = true;
      let passa = true;
      try { passa = !d.se || !!d.se(e); } catch (err) { passa = false; }
      delete e.flags._expedienteSamantha;
      return passa;
    });
  }

  /* o pedido da Dra. Adriana ainda não foi formalizado? */
  function pedidoAdrianaPendente() {
    const e = TOGA.motor.estado;
    return !!(e && e.pauta === "dia2" && !e.flags.ajudaAdriana &&
              !e.concluidos.some(function (c) { return c.id === "custodia"; }));
  }

  /* o pedido da escola municipal (Eleitor do Futuro) ainda está em aberto? */
  function pedidoEleitorPendente() {
    const e = TOGA.motor.estado;
    return !!(e && e.pauta === "dia1" && e.flags._expedienteSamantha &&
              !e.flags.eleitorFuturoAceito && !e.flags._palestraEleitorFeita);
  }

  /* ---------- DONA LOURDES SERVE CAFÉ EM TODO EVENTO ----------
     Capacitação, palestra, treinamento: ela larga a copa, cruza
     o fórum de xícara na mão, serve, e volta. É a tradição. */
  function lourdesServeCafe(caminhoIda, caminhoVolta, duracao) {
    const L = TOGA.rotinas3d && TOGA.rotinas3d.lourdes;
    if (!L || !TOGA.rotinas3d.irPara) return;
    L.segurar("xicara", "dir");
    L.segurar("xicara", "esq");                  // bandeja improvisada: uma em cada mão
    L.setEmocao("feliz");
    TOGA.rotinas3d.irPara(L, caminhoIda, { vel: 1.5 });
    setTimeout(function () {
      TOGA.rotinas3d.irPara(L, caminhoVolta, {
        vel: 1.5,
        aoChegar: function () { L.segurar(null, "dir"); L.segurar(null, "esq"); }
      });
    }, (duracao || 14) * 1000);
  }

  const CAMINHO_COPA_JURI = [{ x: -4.8, z: -2.6 }, { x: -4.8, z: 0.6 }, { x: 23.8, z: 0.6 }, { x: 24, z: 3.2 }, { x: 24.2, z: 6.8 }];
  const CAMINHO_JURI_COPA = [{ x: 24, z: 3.2 }, { x: 23.8, z: 0.6 }, { x: -4.8, z: 0.6 }, { x: -4.8, z: -2.6 }, { x: -4.4, z: -5.6 }];

  /* ---------- ELEITOR DO FUTURO ----------
     A escola municipal pediu, a Samantha intermediou, e o
     Salão do Júri vira sala de cidadania: sufrágio, fake news
     e voto com responsabilidade — para quem vota amanhã.    */
  let turmaEleitor = [];

  function chegadaDasTurmas() {
    // crianças e adolescentes ocupam a plateia e as cadeiras do conselho
    const lugares = [
      { x: 21.8, z: 3.6 }, { x: 22.6, z: 3.6 }, { x: 21.8, z: 4.9 }, { x: 22.6, z: 4.9 },
      { x: 21.8, z: 6.2 }, { x: 22.6, z: 6.2 },
      { x: 29.0, z: 4.4 }, { x: 29.0, z: 5.45 }, { x: 29.0, z: 6.5 }
    ];
    const CORES_TURMA = ["#c94f4f", "#4a6ab8", "#f2b53a", "#5a9a4e", "#e06a8a", "#3f5a5e", "#6a4a5a", "#7a6248", "#4a7a4e"];
    lugares.forEach(function (p, i) {
      const adolescente = i >= 6;            // os das cadeiras do conselho são os mais velhos
      const b = TOGA.boneco3d.criar({
        id: "turma-" + i,
        avatar: { pele: PELES[(i * 3 + 1) % PELES.length],
                  cabelo: ["curto", "longo", "coque"][i % 3],
                  corCabelo: "#241a10", traje: "camisa", corTraje: CORES_TURMA[i] }
      }, { sentado: true });
      b.grupo.scale.setScalar(adolescente ? 0.8 : 0.62);
      b.grupo.position.set(p.x, 0, p.z);
      b.grupo.rotation.y = adolescente ? -Math.PI / 2 : Math.PI / 2;
      b.setEmocao("feliz");
      TOGA.nucleo3d.scene.add(b.grupo);
      turmaEleitor.push(b);
    });
    // a professora, de pé ao lado da turma
    const prof = TOGA.boneco3d.criar({
      id: "profTurma",
      avatar: { pele: "#a86a48", cabelo: "coque", corCabelo: "#3a2a1a", traje: "blazer", corTraje: "#2f4a3e", corBlusa: "#efe5c8" }
    }, {});
    prof.grupo.position.set(23.4, 0, 3.0);
    prof.grupo.rotation.y = Math.PI / 4;
    TOGA.nucleo3d.scene.add(prof.grupo);
    turmaEleitor.push(prof);
  }

  function palestraEleitorDoFuturo() {
    const e = TOGA.motor.estado;
    if (!e || e.flags._palestraEleitorFeita) return;
    e.flags._palestraEleitorFeita = true;
    TOGA.motor.salvar();

    // o juiz assume a tribuna; a turma reage; a Lourdes vem com o café
    encenarJogador({ falar: true, dur: 16, olharPara: { x: 22.2, z: 5 } });
    lourdesServeCafe(CAMINHO_COPA_JURI, CAMINHO_JURI_COPA, 18);
    reagirTurma("feliz");

    toastMundo("🗳 O Salão do Júri lotado de mochila colorida: as turmas nos bancos, os adolescentes nas cadeiras do Conselho — “as cadeiras de VERDADE?”, conferem três vezes, e ninguém quer sair delas. A professora, de pé ao lado, segura um cartaz feito à mão: “NOSSA TURMA VAI VOTAR”. Você respira, olha aquela fila de gente pequena que um dia decide o país, e começa.");

    setTimeout(function () {
      reagirTurma("surpresa");
      toastMundo("🗳 “Esse voto que vai caber na mão de vocês” — você ergue dois dedos, como quem segura uma cédula invisível — “custou SANGUE. Teve gente presa, gente exilada, gente que morreu para que um dia vocês pudessem escolher sem pedir licença a ninguém.” O salão silencia de um jeito que arrepia. Até o menino que não parava quieto parou.");
    }, 5500);

    setTimeout(function () {
      reagirTurma("neutro");
      toastMundo("🗳 A parte das FAKE NEWS estoura a tensão: “quem aqui já recebeu corrente do zap que a vó mandou?” — floresta de braços e gargalhada geral. A regra dos três passos vai para o caderno de todo mundo: QUEM disse? QUANDO foi? QUEM GANHA se eu acreditar? Um menino do fundo, desconfiado: “e juiz prende quem mente na internet?” — “depende: a Justiça Eleitoral derruba a mentira; a vergonha, quem espalhou.”");
    }, 11000);

    setTimeout(function () {
      reagirTurma("feliz");
      // a palestra restaura um pouco do humor (sem mexer no estresse:
      // só o autocuidado baixa a barra — mas formar cidadão dá ALMA)
      TOGA.motor.aplicarEfeitos({ hum: 5, imp: 3, tempo: 30 });
      TOGA.motor.salvar();
      if (TOGA.ui.atualizarHUD) TOGA.ui.atualizarHUD();
      if (TOGA.conquistas) TOGA.conquistas.avaliar("eleitor");
      toastMundo("🗳 Dona Lourdes circula servindo café à professora e suco à turma (“no MEU fórum ninguém aprende cidadania de garganta seca”). No encerramento, uma adolescente da cadeira do Conselho resume melhor que qualquer sentença: “então o voto é tipo... a única vez que mandam a gente decidir de verdade. Aí não dá pra decidir de zoeira.” Você manda constar em ata — e quer que conste mesmo.");
      e.flags.eleitorDoFuturoFeito = true;
      TOGA.motor.salvar();
      // CRÍTICO: limpa o objetivo “Ministre a palestra”, que antes
      // ficava preso no HUD e parecia que nada havia sido concluído
      atualizarObjetivoAutomatico();
    }, 16500);
  }

  /* a turma reage em bloco aos momentos da palestra */
  function reagirTurma(emocao) {
    turmaEleitor.forEach(function (b, i) {
      if (b && b.setEmocao) setTimeout(function () { b.setEmocao(emocao); }, i * 90);
    });
  }

  /* ---------- A VISITA ----------
     Interlúdios com cena de entrega PESSOAL (entrega.visita3d)
     viram gente de verdade no fórum: a pessoa espera na porta do
     gabinete e o juiz vai até ela receber (tecla E). É a Alice
     com o desenho na mão — no mundo, não no texto.            */
  const PONTO_VISITA = { x: -9.6, z: -3.3 };
  let visitante = null;   // { id (do interlúdio), boneco, nome }

  function interludioComVisita() {
    if (!TOGA.motor.estado) return null;
    const p = TOGA.motor.interludiosPendentes()[0] || null;
    return (p && p.entrega && p.entrega.visita3d) ? p : null;
  }

  function sincronizarVisita() {
    const quer = interludioComVisita();
    if (visitante && (!quer || visitante.id !== quer.id)) {
      TOGA.nucleo3d.scene.remove(visitante.boneco.grupo);
      visitante = null;
    }
    if (quer && !visitante) {
      const q = quer.entrega.quem;
      const b = TOGA.boneco3d.criar({ id: "visita-" + quer.id, avatar: q.avatar }, {});
      if (q.escala) b.grupo.scale.setScalar(q.escala);
      b.grupo.position.set(PONTO_VISITA.x, 0, PONTO_VISITA.z);
      // de frente para a mesa do juiz
      b.grupo.rotation.y = Math.atan2(-12 - PONTO_VISITA.x, -7.2 - PONTO_VISITA.z);
      TOGA.nucleo3d.scene.add(b.grupo);
      visitante = { id: quer.id, boneco: b, nome: q.nome };
    }
  }

  /* o avatar 3D do juiz: o que o jogador escolheu (sem o traje
     2D "toga" — no 3D a beca é a opção {toga:true} do boneco) */
  function avatarDoJuiz() {
    const av = (TOGA.juiz && TOGA.juiz.avatar) ? Object.assign({}, TOGA.juiz.avatar()) : {};
    delete av.traje;
    return Object.keys(av).length ? av : { pele: "#d8a87f", cabelo: "curto", corCabelo: "#241a10" };
  }

  /* O jogador personalizou o juiz com o mundo já de pé:
     troca o boneco no lugar, preservando posição e rumo. */
  function aplicarJuiz() {
    if (!iniciado || !jogador) return;
    const pos = jogador.grupo.position.clone();
    const rot = jogador.grupo.rotation.y;
    TOGA.nucleo3d.scene.remove(jogador.grupo);
    jogador = TOGA.boneco3d.criar({ id: "juiz", avatar: avatarDoJuiz() }, { toga: true });
    jogador.grupo.position.copy(pos);
    jogador.grupo.rotation.y = rot;
    TOGA.nucleo3d.scene.add(jogador.grupo);
    if (TOGA.controles3d.definirJogador) TOGA.controles3d.definirJogador(jogador.grupo);
  }

  /* =====================================================
     INICIALIZAÇÃO (uma única vez por sessão)
     ===================================================== */
  function garantirIniciado(semRender) {
    if (iniciado) return;
    iniciado = true;

    const cont = document.getElementById("mundo-3d");
    TOGA.nucleo3d.iniciar(cont, { semRender: !!semRender });
    mundoInfo = TOGA.mundo3d.construir(TOGA.nucleo3d.scene);

    // o juiz jogador (de toga) — com a cara que o jogador escolheu
    jogador = TOGA.boneco3d.criar(
      { id: "juiz", avatar: avatarDoJuiz() },
      { toga: true });
    TOGA.nucleo3d.scene.add(jogador.grupo);

    // assessora fixa no gabinete
    assessora = TOGA.boneco3d.criar(
      { id: "assessora", avatar: { pele: "#c98e66", cabelo: "coque", corCabelo: "#241505", traje: "blazer", corTraje: "#4a4438", corBlusa: "#efe5c8", oculos: true } },
      { sentado: true });
    const pA = mundoInfo.pontos.assessora;
    assessora.grupo.position.set(pA.x, 0, pA.z - 0.55);
    assessora.grupo.rotation.y = 0; // de frente para a mesa/porta
    TOGA.nucleo3d.scene.add(assessora.grupo);
    bloqueantesExtra.push(assessora);

    // luz de quem fala
    luzFala = new THREE.SpotLight(0xffe9b8, 0, 7, 0.55, 0.5);
    luzFala.position.set(1, 3.1, 11);
    luzFalaPos = luzFala.position.clone();
    luzFalaMira = new THREE.Vector3(1, 1, 11);
    TOGA.nucleo3d.scene.add(luzFala, luzFala.target);

    TOGA.controles3d.iniciar(TOGA.nucleo3d.camera, jogador.grupo, mundoInfo);
    if (TOGA.controles3d.definirObstaculos) TOGA.controles3d.definirObstaculos(obstaculosColisao);
    // marcador do clique-para-mover: anel frio no ponto de destino
    let marcadorDestino = null;
    if (TOGA.controles3d.aoDestino) {
      TOGA.controles3d.aoDestino(function (destino) {
        if (!destino) { if (marcadorDestino) marcadorDestino.visible = false; return; }
        if (!marcadorDestino) {
          marcadorDestino = new THREE.Mesh(
            new THREE.RingGeometry(0.22, 0.34, 22),
            new THREE.MeshBasicMaterial({ color: 0x9fc3ae, transparent: true, opacity: 0.7,
                                          side: THREE.DoubleSide, depthWrite: false }));
          marcadorDestino.rotation.x = -Math.PI / 2;
          marcadorDestino.position.y = 0.02;
          TOGA.nucleo3d.scene.add(marcadorDestino);
        }
        marcadorDestino.position.x = destino.x;
        marcadorDestino.position.z = destino.z;
        marcadorDestino.visible = true;
      });
    }
    if (TOGA.diretor3d) TOGA.diretor3d.iniciar();
    if (TOGA.toque3d && TOGA.toque3d.iniciar) TOGA.toque3d.iniciar();
    TOGA.interacao3d.definir(montarInteragiveis());
    ligarCliqueMartelo();

    // o cachorro do fórum (entrou atrás de sombra, ficou por unanimidade)
    if (TOGA.caramelo3d && TOGA.caramelo3d.iniciar) {
      TOGA.caramelo3d.iniciar(TOGA.nucleo3d.scene);
    }

    // o fórum vivo: servidores, fila, 2ª vara em sessão
    if (TOGA.rotinas3d && TOGA.rotinas3d.iniciarElenco) {
      TOGA.rotinas3d.iniciarElenco((TOGA.config && TOGA.config.qualidade3d) === "baixa");
    }

    povoarAlaLesteII();

    TOGA.nucleo3d.aoFrame(tickGeral);
  }

  /* Habitantes da Ala Leste II: o(a) colega titular da 2ª Vara, no
     seu gabinete; e a sessão de mediação do CEJUSC (facilitadora +
     as duas partes). Bonecos estáticos — cenário das interações. */
  /* obstáculos dinâmicos para a colisão do juiz: o elenco do fórum
     (Matias, dona Lourdes, servidores, 2ª Vara em sessão, crianças),
     o cachorro Razumikin, os NPCs fixos das alas novas e a gente das
     áreas externas (rua, ESMEC, parque, ACM). Quem está longe é
     descartado pela própria distância no controles. */
  function obstaculosColisao() {
    const arr = [];
    function push(b, raio) {
      if (b && b.grupo) arr.push({ x: b.grupo.position.x, z: b.grupo.position.z, raio: raio || 0.34 });
    }
    if (TOGA.rotinas3d && TOGA.rotinas3d.elenco) TOGA.rotinas3d.elenco().forEach(function (b) { push(b, 0.34); });
    if (TOGA.caramelo3d && TOGA.caramelo3d.posicao) {
      const p = TOGA.caramelo3d.posicao();
      if (p) arr.push({ x: p.x, z: p.z, raio: 0.5 });
    }
    bloqueantesExtra.forEach(function (b) { push(b, 0.34); });
    const info = localAtivo === "rua" ? infoRua
               : localAtivo === "esmec" ? infoEsmec
               : localAtivo === "parque" ? infoParque
               : localAtivo === "acm" ? infoAcm : null;
    if (info && info.vivos) info.vivos.forEach(function (b) { push(b, 0.34); });
    return arr;
  }

  let juiz2Vara = null;
  const bloqueantesExtra = [];     // NPCs fixos que o juiz não atravessa
  const animarExtras = [];         // NPCs das alas novas que precisam de tick (gestos)
  function povoarAlaLesteII() {
    if (!TOGA.boneco3d || !mundoInfo || !mundoInfo.pontos.gab2Juiz) return;
    const P = mundoInfo.pontos;
    function npc(id, av, x, z, rotY, opcoes) {
      const b = TOGA.boneco3d.criar({ id: id, avatar: av }, opcoes || {});
      b.grupo.position.set(x, 0, z);
      b.grupo.rotation.y = rotY || 0;
      TOGA.nucleo3d.scene.add(b.grupo);
      bloqueantesExtra.push(b);
      animarExtras.push(b);        // ticado no tickGeral → ganha gestos/expressão
      return b;
    }
    // a colega da 2ª Vara, sentada à mesa, de frente para quem entra
    juiz2Vara = npc("juiz2Vara",
      { pele: "#a86a48", cabelo: "coque", corCabelo: "#241a10", traje: "blazer", corTraje: "#33424f", corBlusa: "#e8e2d2", oculos: true },
      P.gab2Juiz.x, P.gab2Juiz.z, 0, { sentado: true });
    juiz2Vara.segurar("autos", "esq");
    // CEJUSC: a facilitadora e as duas partes em torno da mesa redonda —
    // uma SESSÃO VIVA: as partes discutem com veemência, a mediadora apazigua
    const facil = npc("cejuscFacil",
      { pele: "#c98e66", cabelo: "longo", corCabelo: "#3a2a1a", traje: "blazer", corTraje: "#2f4a3e", corBlusa: "#efe5c8" },
      P.cejuscMediador.x, P.cejuscMediador.z, Math.PI, { sentado: true });
    const parteA = npc("cejuscParteA",
      { pele: "#8a5436", cabelo: "calvo", corCabelo: "#9a9388", traje: "camisa", corTraje: "#7a6248", barba: true },
      P.cejuscParteA.x, P.cejuscParteA.z, Math.PI / 2, { sentado: true });
    const parteB = npc("cejuscParteB",
      { pele: "#d8a87f", cabelo: "coque", corCabelo: "#241a10", traje: "vestido", corTraje: "#5a4a52" },
      P.cejuscParteB.x, P.cejuscParteB.z, -Math.PI / 2, { sentado: true });
    parteA.setEmocao("raiva"); parteB.setEmocao("raiva"); facil.setEmocao("firme");
    iniciarVidaCejusc(facil, parteA, parteB);
  }

  /* a sessão do CEJUSC ganha drama em loop: um lado se inflama, o outro
     reage, e a facilitadora pede calma — gestos de verdade, sem parar. */
  let vidaCejuscAtiva = false;
  function iniciarVidaCejusc(facil, a, b) {
    if (vidaCejuscAtiva) return;
    vidaCejuscAtiva = true;
    let fase = 0;
    function fala(boneco, dur) {
      if (!boneco) return;
      boneco.falando(true);
      setTimeout(function () { boneco.falando(false); }, dur || 2200);
    }
    function passo() {
      fase = (fase + 1) % 5;
      if (fase === 0) { a.setEmocao("raiva"); a.executarAcao("indignado"); fala(a, 2400); }
      else if (fase === 1) { b.setEmocao("raiva"); b.executarAcao("enfase"); fala(b, 2400); }
      else if (fase === 2) {
        if (facil) { facil.setEmocao("firme"); facil.executarAcao("apelo"); fala(facil, 2600); }
        a.setEmocao("triste"); b.setEmocao("medo");
      } else if (fase === 3) { b.setEmocao("triste"); b.executarAcao("apelo"); fala(b, 2200); }
      else { a.setEmocao("firme"); a.executarAcao("enfase"); fala(a, 2200); }
      setTimeout(passo, 2800 + Math.random() * 1600);
    }
    setTimeout(passo, 1800);
  }

  /* O martelo da bancada é clicável durante a audiência:
     o clique cai no .palco (espaçador transparente sobre o
     canvas) e um raycast confere se acertou o martelo.      */
  function ligarCliqueMartelo() {
    const ray = new THREE.Raycaster();
    const ponto = new THREE.Vector2();
    function meshMarteloAtivo() {
      const P = mundoInfo.pontos;
      return (palcoCorrente && palcoCorrente.id === "juri" && P.meshMartelo2)
        ? P.meshMartelo2 : P.meshMartelo;
    }
    function noMartelo(ev) {
      if (!emAudiencia || !meshMarteloAtivo()) return false;
      const alvo = ev.target;
      if (!alvo || !alvo.classList || !alvo.classList.contains("palco")) return false;
      ponto.x = (ev.clientX / window.innerWidth) * 2 - 1;
      ponto.y = -(ev.clientY / window.innerHeight) * 2 + 1;
      ray.setFromCamera(ponto, TOGA.nucleo3d.camera);
      return ray.intersectObject(meshMarteloAtivo(), true).length > 0;
    }
    document.addEventListener("click", function (ev) {
      if (noMartelo(ev)) martelo();
    });
    document.addEventListener("mousemove", function (ev) {
      if (!emAudiencia) return;
      const alvo = ev.target;
      if (alvo && alvo.classList && alvo.classList.contains("palco")) {
        alvo.style.cursor = noMartelo(ev) ? "pointer" : "";
      }
    });
  }

  let cafeAssessoraEm = 25;       // 1º café dela pouco depois de o mundo abrir

  function tickGeral(dt, t) {
    jogador.tick(dt, t);
    if (assessora) {
      assessora.tick(dt, t);
      // a assessora vive de café, como todo fórum
      if (t >= cafeAssessoraEm && !assessora.acao) {
        cafeAssessoraEm = t + 90 + Math.random() * 60;
        assessora.segurar("xicara", "dir");
        assessora.executarAcao("beber", function () { assessora.segurar(null, "dir"); });
      }
    }
    if (visitante) visitante.boneco.tick(dt, t);
    Object.keys(npcs).forEach(id => npcs[id].tick(dt, t));
    npcsCorredor.forEach(n => n.boneco.tick(dt, t));
    equipeTreinamento.forEach(b => b.tick(dt, t));
    turmaEleitor.forEach(b => b.tick(dt, t));
    animarExtras.forEach(b => b.tick(dt, t));   // 2ª Vara + sessão do CEJUSC
    // colapso adiado: estourou 100 durante a audiência → encena agora,
    // que o juiz já está de volta ao mundo 3D
    if (!emAtendimento && TOGA.motor.estado && TOGA.motor.estado.flags._colapsoPendente && mundoAtivo()) {
      TOGA.motor.estado.flags._colapsoPendente = false;
      TOGA.motor.salvar();
      emergenciaMedica();
    }
    // o ponto de interação do zelador acompanha o passeio dele
    if (TOGA.rotinas3d && TOGA.rotinas3d.matias) {
      posMatias.x = TOGA.rotinas3d.matias.grupo.position.x;
      posMatias.z = TOGA.rotinas3d.matias.grupo.position.z;
    }
    if (TOGA.rotinas3d && TOGA.rotinas3d.bruna) {
      posBruna.x = TOGA.rotinas3d.bruna.grupo.position.x;
      posBruna.z = TOGA.rotinas3d.bruna.grupo.position.z;
      posBeatriz.x = TOGA.rotinas3d.beatriz.grupo.position.x;
      posBeatriz.z = TOGA.rotinas3d.beatriz.grupo.position.z;
    }
    tickEspera();
    tickVisitas(dt);
    tickSeta(t);
    publico.forEach(p => p.boneco.tick(dt, t));
    figurantesArco.forEach(b => b.tick(dt, t));
    TOGA.interacao3d.tick();

    // spotlight de quem fala: intensidade e posição com fade
    // (o alvo é recalculado: o orador pode estar entrando na sala)
    if (luzFala) {
      if (falanteId && npcs[falanteId]) {
        const pos = npcs[falanteId].cabecaMundo;
        luzFalaPos.set(pos.x, pos.y + 1.6, pos.z + 0.4);
        luzFalaMira.copy(pos);
      }
      const k = animacoesRapidas ? 1 : Math.min(1, 5 * dt);
      luzFala.intensity += (luzFalaAlvo - luzFala.intensity) * k;
      luzFala.position.lerp(luzFalaPos, k);
      luzFala.target.position.lerp(luzFalaMira, k);
    }

    // animação do martelo (batida disparada por martelo())
    if (animMartelo > 0) {
      animMartelo -= dt;
      const k = Math.max(0, animMartelo / 0.5);            // 1 → 0
      const ang = 0.38 + Math.sin((1 - k) * Math.PI) * -0.9; // levanta e bate
      [mundoInfo.pontos.meshMartelo, mundoInfo.pontos.meshMartelo2].forEach(function (m) {
        if (m) m.rotation.z = (k > 0) ? ang : 0.38;
      });
    }
  }

  /* =====================================================
     MODO MUNDO
     ===================================================== */
  function entrarMundo(spawn) {
    garantirIniciado();
    document.body.classList.add("modo-3d");
    emAudiencia = false;

    if (spawn) {
      const p = mundoInfo.pontos["spawn" + spawn[0].toUpperCase() + spawn.slice(1)];
      if (p) TOGA.controles3d.teleportar(p.x, p.z, p.angulo || 0);
    }
    atualizarCorredor();
    atualizarObjetivoAutomatico();
    // a cela reflete as flags do jogo (inclusive ao recarregar o save)
    if (TOGA.prisao3d && TOGA.motor.estado) TOGA.prisao3d.sincronizarCela(TOGA.motor.estado.flags);
    // lembranças do gabinete (desenho, fotos, ofícios...) seguem as flags
    if (TOGA.lembrancas3d && TOGA.motor.estado) TOGA.lembrancas3d.sincronizar(TOGA.motor.estado.flags);
    // visitas com entrega em mãos aparecem (e desaparecem) com os interlúdios
    sincronizarVisita();
    // arco emocional: as partes vêm falar com o juiz no corredor
    const arco = TOGA.motor.arcoPendente && TOGA.motor.arcoPendente();
    if (arco) encenarArco(arco);
    if (TOGA.audio) TOGA.audio.ambiente(true);
    TOGA.ui.mostrarTela("tela-mundo");
    if (TOGA.ui.atualizarHUD && TOGA.motor.estado) TOGA.ui.atualizarHUD();
  }

  function definirObjetivo(texto) {
    const el = document.getElementById("objetivo-mundo");
    if (!el) return;
    if (texto) { el.textContent = "◈ " + texto; el.hidden = false; }
    else { el.hidden = true; alvoObjetivo = null; }
  }

  /* ---------- A SETA DE OBJETIVO ----------
     Um cone dourado flutua à frente do juiz apontando o
     próximo passo — o fórum cresceu; ninguém se perde.    */
  let alvoObjetivo = null;     // {x, z} do destino atual
  let setaObjetivo = null;

  function elBussola() {
    let el = document.getElementById("bussola-objetivo");
    if (!el) {
      const hud = document.querySelector(".hud-mundo");
      if (!hud) return null;
      el = document.createElement("div");
      el.id = "bussola-objetivo";
      el.title = "direção do objetivo";
      el.innerHTML = '<span class="agulha">➤</span>';
      hud.appendChild(el);
    }
    return el;
  }

  function tickSeta(t) {
    const ativo = alvoObjetivo && !emAudiencia && jogador &&
      document.getElementById("tela-mundo") &&
      document.getElementById("tela-mundo").classList.contains("ativa");
    const bussola = elBussola();
    if (!ativo) {
      if (setaObjetivo) setaObjetivo.visible = false;
      if (bussola) bussola.hidden = true;
      return;
    }

    const pj = jogador.grupo.position;
    const dx = alvoObjetivo.x - pj.x, dz = alvoObjetivo.z - pj.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    // bússola do HUD: SEMPRE visível enquanto há objetivo distante —
    // gira com a câmera, então nunca se perde a referência
    if (bussola) {
      if (dist < 2.4) { bussola.hidden = true; }
      else {
        bussola.hidden = false;
        const yaw = (typeof TOGA.controles3d.yaw === "number") ? TOGA.controles3d.yaw : 0;
        const diff = Math.atan2(dx, dz) - yaw;
        bussola.querySelector(".agulha").style.transform =
          "rotate(" + (-(diff * 180 / Math.PI) - 90) + "deg)";
        bussola.querySelector(".agulha").textContent = "➤";
      }
    }
    if (dist < 2.4) { if (setaObjetivo) setaObjetivo.visible = false; return; }

    if (!setaObjetivo) {
      setaObjetivo = new THREE.Mesh(
        new THREE.ConeGeometry(0.09, 0.3, 8),
        new THREE.MeshBasicMaterial({ color: 0xe7cf9a, transparent: true, opacity: 0.85 }));
      setaObjetivo.rotation.order = "YXZ";       // gira o rumo ANTES de deitar o cone
      setaObjetivo.rotation.x = Math.PI / 2;     // o cone deita: aponta para a frente
      TOGA.nucleo3d.scene.add(setaObjetivo);
    }
    const ang = Math.atan2(dx, dz);
    const px = pj.x + Math.sin(ang) * 1.1;
    const pz = pj.z + Math.cos(ang) * 1.1;
    setaObjetivo.visible = true;
    setaObjetivo.position.set(px, 2.25 + Math.sin(t * 2.4) * 0.06, pz);
    setaObjetivo.rotation.y = ang;               // gira o cone deitado para o alvo
    setaObjetivo.material.opacity = 0.55 + Math.sin(t * 2.4) * 0.2;
  }

  /* Decide sozinho qual é o "próximo passo" e escreve no HUD —
     o jogador nunca fica perdido no fórum. */
  function atualizarObjetivoAutomatico() {
    if (localAtivo !== "forum") return;   // nos locais externos o objetivo é manual
    const e = TOGA.motor.estado;
    if (!e) { definirObjetivo(null); return; }
    const P = mundoInfo.pontos;
    const pendentes = TOGA.motor.interludiosPendentes();
    if (pendentes.length) {
      const p0 = pendentes[0];
      if (p0.entrega && p0.entrega.visita3d) {
        alvoObjetivo = PONTO_VISITA;
        definirObjetivo(p0.entrega.quem.nome + " veio até você — espera na porta do gabinete (E)");
      } else if (SAMANTHA_ENTREGA[p0.id]) {
        alvoObjetivo = { x: 5.4, z: -6.6 };
        definirObjetivo("Expediente institucional — Samantha aguarda na DIRETORIA");
      } else if (ENTREGAS[p0.id]) {
        alvoObjetivo = P.balcao;
        definirObjetivo("Há uma entrega para você no balcão da secretaria (corredor)");
      } else {
        alvoObjetivo = P.assessora;
        definirObjetivo("Laís tem um recado — fale com ela no gabinete");
      }
      return;
    }
    // o START do dia passa pela diretoria: pedido da Dra. Adriana
    // (Dia 2) e a liberação do expediente institucional
    if (pedidoAdrianaPendente()) {
      alvoObjetivo = { x: 5.4, z: -6.6 };
      definirObjetivo("Fale com Samantha na DIRETORIA — há um pedido da Dra. Adriana (custódia)");
      return;
    }
    if (expedienteAguardando()) {
      alvoObjetivo = { x: 5.4, z: -6.6 };
      definirObjetivo("Passe na DIRETORIA — Samantha organizou o expediente institucional do dia");
      return;
    }
    if (pedidoEleitorPendente()) {
      alvoObjetivo = { x: 5.4, z: -6.6 };
      definirObjetivo("Samantha tem um pedido da escola municipal — DIRETORIA");
      return;
    }
    {
      const e2 = TOGA.motor.estado;
      if (e2 && e2.flags.eleitorFuturoAceito && !e2.flags._palestraEleitorFeita) {
        alvoObjetivo = { x: 25.0, z: 6.5 };
        definirObjetivo("As turmas chegaram! Vá ao centro do SALÃO DO JÚRI e tome a tribuna (E)");
        return;
      }
    }
    if (TOGA.motor.fimDaPauta()) {
      const f = e.flags || {};
      if ((f.feminicidioCondenado || f.absolvicaoContaminada) && !f._coletivaFeita) {
        alvoObjetivo = P.imprensaBancada;
        definirObjetivo("A imprensa aguarda na SALA DE IMPRENSA — atenda a coletiva (ou siga para a saída)");
        return;
      }
      alvoObjetivo = P.portaSaida;
      definirObjetivo("Fim da pauta. Vá à porta de saída do fórum para encerrar o dia");
      return;
    }
    if (TOGA.ui.audienciaPronta && TOGA.ui.audienciaPronta()) {
      if (casoNoJuri()) {
        alvoObjetivo = P.bancadaJuri;
        definirObjetivo("Dia de júri: assuma a presidência do plenário no SALÃO DO JÚRI (E)");
      } else {
        alvoObjetivo = P.bancada;
        definirObjetivo("Sente-se à bancada na sala de audiências (E) para apregoar as partes");
      }
    } else {
      const caso = TOGA.motor.casosDaPauta()[e.casoAtual];
      alvoObjetivo = P.autosMesa;
      definirObjetivo("Abra os autos sobre a mesa do gabinete — pauta das " + caso.hora + ": " + caso.titulo);
    }
  }

  /* ---------- Interagíveis do fórum ---------- */
  function montarInteragiveis() {
    const P = mundoInfo.pontos;
    const M = () => TOGA.motor;

    function haCaso() { return M().estado && !M().fimDaPauta(); }
    function semInterludios() { return !M().estado || M().interludiosPendentes().length === 0; }
    function pendente() { return (M().estado && M().interludiosPendentes()[0]) || null; }

    return [
      { id: "computador", pos: P.computador, raio: 1.7,
        rotulo: "consultar a pauta no computador",
        visivel: function () { return !!M().estado; },
        acao: function () { TOGA.ui.renderPauta(); TOGA.ui.mostrarTela("tela-pauta"); } },

      { id: "autos", pos: P.autosMesa, raio: 1.7,
        rotulo: function () {
          const c = M().casosDaPauta()[M().estado.casoAtual];
          return c ? "abrir os autos — " + c.titulo : "autos";
        },
        visivel: function () { return haCaso() && semInterludios() && !(TOGA.ui.audienciaPronta && TOGA.ui.audienciaPronta()); },
        acao: function () { TOGA.ui.abrirAutos(); } },

      { id: "cafeteira", pos: P.cafeteira, raio: 1.6,
        rotulo: "tomar um café",
        acao: function () {
          // o juiz leva a xícara à boca, de verdade
          jogador.segurar("xicara", "dir");
          jogador.executarAcao("beber", function () { jogador.segurar(null, "dir"); });
          if (TOGA.motor.estado) { TOGA.motor.alterarEstresse(-4); TOGA.motor.salvar(); }
          if (TOGA.ui.atualizarHUD) TOGA.ui.atualizarHUD();
          toastMundo("☕ Um café curto. O fórum inteiro funciona à base disto.");
        } },

      { id: "assessora", pos: P.assessora, raio: 1.8,
        rotulo: function () {
          const p = pendente();
          return (p && !ENTREGAS[p.id] && !SAMANTHA_ENTREGA[p.id] && !(p.entrega && p.entrega.visita3d))
            ? "falar com Laís — há um recado!"
            : "conversar com Laís, sua assessora";
        },
        visivel: function () { return !!M().estado; },
        acao: function () {
          const p = pendente();
          if (p && !ENTREGAS[p.id] && !SAMANTHA_ENTREGA[p.id] && !(p.entrega && p.entrega.visita3d)) {
            registrarCumprimento("assessora", true);
            TOGA.ui.abrirInterludioPendente();
          } else {
            conversaAssessora();
          }
        } },

      { id: "bruna", pos: posBruna, raio: 1.6,
        rotulo: "conversar com Bruna (assessora)",
        acao: function () {
          const b = TOGA.rotinas3d && TOGA.rotinas3d.bruna;
          if (b) {
            b.setEmocao("feliz");
            if (jogador) b.olharPara(jogador.grupo.position.clone().setY(1.4));
            setTimeout(function () { if (b) b.olharPara(null); }, 5000);
          }
          const FALAS = [
            "📋 Bruna, dos prazos e dos sistemas: “Doutor, os urgentes de hoje já estão separados por cor — vermelho decide HOJE, amarelo até sexta. E se o sistema cair, a planilha paralela está atualizada. Comigo não passa prazo nem em queda de energia.”",
            "📋 Bruna: “Atualizei o painel: zero processos parados há mais de cem dias. ZERO, doutor. Vou emoldurar o print — brincadeira. Mas vou guardar.”",
            "📋 Bruna: “Aquela intimação que voltou duas vezes? Achei o endereço certo pelo CEP da conta de luz nos autos. O oficial já saiu. Detalhe ganha processo, doutor.”"
          ];
          const e = TOGA.motor.estado;
          toastMundo(FALAS[(e ? e.historico.length : 0) % FALAS.length]);
          registrarCumprimento("bruna");
        } },

      { id: "beatriz", pos: posBeatriz, raio: 1.6,
        rotulo: "conversar com Beatriz (assessora)",
        acao: function () {
          const b = TOGA.rotinas3d && TOGA.rotinas3d.beatriz;
          if (b) {
            b.setEmocao("feliz");
            if (jogador) b.olharPara(jogador.grupo.position.clone().setY(1.4));
            setTimeout(function () { if (b) b.olharPara(null); }, 5000);
          }
          const FALAS = [
            "📚 Beatriz, da pesquisa: “Doutor, saiu acórdão novo do STJ sobre aquele tema da pauta de quinta — deixei o inteiro teor na sua mesa, com os parágrafos que importam marcados. Os outros vinte e seis são enrolação.”",
            "📚 Beatriz: “Pesquisei a tese da defesa de amanhã: três precedentes a favor, oito contra, e UM voto vencido que é exatamente o nosso caso. Está tudo na pasta verde.”",
            "📚 Beatriz: “O senhor sabia que a nossa comarca foi citada num voto do Tribunal? ‘Como bem fundamentou o juízo de origem’. Eu li duas vezes. A segunda foi em voz alta.”"
          ];
          const e = TOGA.motor.estado;
          toastMundo(FALAS[(e ? e.historico.length : 0) % FALAS.length]);
          registrarCumprimento("beatriz");
        } },

      { id: "samantha", pos: { x: 5.4, z: -6.6 }, raio: 1.8,
        rotulo: function () {
          const p = pendente();
          if (p && SAMANTHA_ENTREGA[p.id]) return "Samantha tem um expediente de cima (Corregedoria/CNJ)";
          if (pedidoAdrianaPendente()) return "Samantha tem um pedido da Dra. Adriana";
          if (expedienteAguardando()) return "checar o expediente institucional com Samantha";
          if (pedidoEleitorPendente()) return "Samantha tem um pedido da escola municipal";
          return "falar com Samantha (supervisora da unidade)";
        },
        acao: function () {
          // 1) expediente de cima: ela entrega o interlúdio institucional
          const p = pendente();
          if (p && SAMANTHA_ENTREGA[p.id]) {
            registrarCumprimento("samantha", true);
            TOGA.ui.abrirInterludioPendente();
            return;
          }
          // 2) o pedido da Dra. Adriana (Dia 2): a cooperação que abre o dia
          if (pedidoAdrianaPendente()) {
            const e = TOGA.motor.estado;
            e.flags.ajudaAdriana = true;
            TOGA.motor.salvar();
            registrarCumprimento("samantha", true);
            toastMundo("🗂 Samantha levanta da mesa: \u201cDoutor, a Dra. Adriana da Cruz Dantas ligou da custódia — o mutirão do Núcleo lotou a pauta dela e tem um flagrante que VENCE o prazo de 24 horas hoje: um pai, preso por furtar comida, com dois filhos pequenos no corredor. Ela pergunta se o senhor pode assumir essa audiência.\u201d");
            toastMundo("🗂 Você responde o que juiz cooperador responde: \u201cpode contar comigo — manda os autos.\u201d Samantha sorri e já disca: \u201cDra. Adriana? Confirmado. O doutor assume.\u201d No painel da unidade, o caso entra na SUA pauta: Custódia — O pão de Jonas, 09h00.");
            toastMundo("⚖ Cooperação judiciária registrada (CPC, art. 69): juiz que ajuda juiz é jurisdição que não para. A Dra. Adriana mandou avisar que retribui na próxima — e juíza coordenadora de Núcleo SEMPRE retribui.");
            if (TOGA.conquistas) TOGA.conquistas.avaliar("cooperacao");
            atualizarObjetivoAutomatico();
            return;
          }
          // 3) expediente institucional aguardando: ela libera a pilha
          if (expedienteAguardando()) {
            const e = TOGA.motor.estado;
            e.flags._expedienteSamantha = true;
            TOGA.motor.salvar();
            registrarCumprimento("samantha", true);
            toastMundo("🗂 Samantha abre a pasta do expediente: \u201cDoutor, chegou correspondência de gente grande — confira a pilha de CONCLUSOS: deixei tudo lá, triado e por ordem de assinatura. E respondendo a pergunta que o senhor ainda não fez: sim, eu já li tudo.\u201d");
            if (TOGA.ui.atualizarPausas) TOGA.ui.atualizarPausas();
            atualizarObjetivoAutomatico();
            return;
          }
          // 4) o pedido da escola municipal: Eleitor do Futuro (Dia 1)
          if (pedidoEleitorPendente()) {
            const e = TOGA.motor.estado;
            e.flags.eleitorFuturoAceito = true;
            TOGA.motor.salvar();
            registrarCumprimento("samantha", true);
            toastMundo("🗂 Samantha: \u201cDoutor, mais uma: a diretora da escola municipal ligou — as turmas estudaram democracia este bimestre e ela pergunta se o senhor topa uma palestra ELEITOR DO FUTURO para as crianças e adolescentes: direito ao sufrágio, fake news, votar com responsabilidade. Eu disse que ia perguntar... mas já reservei o Salão do Júri, porque eu conheço o senhor.\u201d");
            toastMundo("🗳 Você confirma — formar eleitor é formar a comarca de amanhã. Samantha liga de volta: \u201cdiretora? Confirmado. Manda as turmas.\u201d E avisa, pendurando o telefone: \u201celes chegam em quinze minutos, doutor. A dona Lourdes já foi avisada do café — ela ia descobrir de qualquer jeito.\u201d");
            chegadaDasTurmas();
            atualizarObjetivoAutomatico();
            return;
          }
          // 5) conversa de gestão (as falas de sempre)
          const s = TOGA.rotinas3d && TOGA.rotinas3d.samantha;
          if (s) {
            s.setEmocao("firme");
            if (jogador) s.olharPara(jogador.grupo.position.clone().setY(1.4));
            setTimeout(function () { if (s) { s.olharPara(null); s.setEmocao("neutro"); } }, 5000);
          }
          const e = TOGA.motor.estado;
          const FALAS = [
            "🗂 Samantha, da diretoria: “Doutor, o relatório mensal fechou: distribuição em dia, mandados sem atraso e a cela vistoriada. A unidade está redonda — e quando não estiver, o senhor saberá por mim antes de saber pela Corregedoria.”",
            "🗂 Samantha: “Remanejei a escala: a equipe do balcão almoça em dois turnos agora, ninguém mais atende com fome. Produtividade subiu, reclamação caiu. Gestão é isso, doutor — o resto é planilha.”",
            "🗂 Samantha: “A vistoria do prédio passou. Só apontaram a rachadura de sempre — e o seu Matias a defendeu pessoalmente: ‘essa rachadura tem mais estabilidade que muito depoimento’. Constou em ata.”"
          ];
          toastMundo(FALAS[(e ? e.historico.length : 0) % FALAS.length]);
          registrarCumprimento("samantha");
        } },

      { id: "lourdes", pos: { x: -4.5, z: -6.6 }, raio: 1.7,
        rotulo: "conversar com dona Lourdes",
        acao: function () {
          const a = TOGA.rotinas3d && TOGA.rotinas3d.lourdes;
          if (a) {
            a.setEmocao("feliz");
            if (jogador) a.olharPara(jogador.grupo.position.clone().setY(1.4));
            setTimeout(function () { if (a) a.olharPara(null); }, 5000);
          }
          const e = TOGA.motor.estado;
          const FALAS = [
            "🍲 “Doutor, sente um minutinho que o café tá saindo. E não me venha com 'sem açúcar' que aqui é metade, fechado?” Dona Lourdes está na copa há vinte e dois anos — três juízes, dois prédios e um número incontável de bolos de aniversário.",
            "🍲 “Tá comendo direito, doutor? Que eu vejo cada um sair daquela sala com uma cara...” Ela empurra um pedaço de bolo sem aceitar recusa. No fórum, a última instância é a dona Lourdes.",
            "🍲 “O senhor sabia que o Razumikin chegou aqui no dia de uma audiência de despejo? Entrou atrás de sombra e ficou. Igualzinho a metade do pessoal — vem resolver uma coisa e a casa adota.”"
          ];
          const aliviou = alivioEmocional("lourdes", 3);
          const fala = FALAS[(e ? (e.historico.length + noticiaIdx) : 0) % FALAS.length];
          toastMundo(fala + (aliviou ? " (−" + aliviou + " de estresse)" : ""));
          registrarCumprimento("lourdes");
        } },

      { id: "matias", pos: posMatias, raio: 1.8,
        rotulo: "cumprimentar seu Matias",
        visivel: function () { return !!(TOGA.rotinas3d && TOGA.rotinas3d.matias); },
        acao: function () {
          const m = TOGA.rotinas3d && TOGA.rotinas3d.matias;
          if (m) {
            m.setEmocao("feliz");
            if (jogador) m.olharPara(jogador.grupo.position.clone().setY(1.4));
            setTimeout(function () { if (m) m.olharPara(null); }, 5000);
          }
          const FALAS = [
            "🧹 “Bom dia, Excelência! Tá vendo aquela rachadura ali do alto? Eu acompanho ela desde 2009. Não cresce, não diminui — igual processo de usucapião.” Seu Matias conhece o prédio melhor que a planta baixa.",
            "🧹 “Doutor, o segredo do fórum é o seguinte: chão limpo de manhã, todo mundo decide melhor. Tá provado. Pode pedir perícia.” E segue varrendo onde ninguém viu poeira.",
            "🧹 “A chave que abre tudo aqui é essa daqui, ó. Mas a que mais uso é a da paciência, que não pendura no molho.” Seu Matias, zelador e filósofo, nessa ordem só por causa do crachá."
          ];
          const e = TOGA.motor.estado;
          const aliviou = alivioEmocional("matias", 3);
          const fala = FALAS[(e ? (e.historico.length + noticiaIdx) : 0) % FALAS.length];
          toastMundo(fala + (aliviou ? " (−" + aliviou + " de estresse)" : ""));
          registrarCumprimento("matias");
        } },

      { id: "guarda", pos: { x: -12.6, z: 1.4 }, raio: 1.7,
        rotulo: "cumprimentar o policial do fórum",
        acao: function () {
          const g = TOGA.rotinas3d && TOGA.rotinas3d.guarda;
          if (g) {
            g.setEmocao("firme");
            if (jogador) g.olharPara(jogador.grupo.position.clone().setY(1.4));
            setTimeout(function () { if (g) { g.olharPara(null); g.setEmocao("neutro"); } }, 4000);
          }
          toastMundo("👮 Continência discreta: “Excelência.” Pausa. “Tudo em ordem no perímetro. O cachorro fiscalizou o corredor duas vezes hoje — está mais assíduo que muita testemunha.”");
          registrarCumprimento("guarda");
        } },

      { id: "visita", pos: PONTO_VISITA, raio: 2.2,
        rotulo: function () { return visitante ? "receber " + visitante.nome : "receber a visita"; },
        visivel: function () { return !!visitante; },
        acao: function () { TOGA.ui.abrirInterludioPendente(); } },

      { id: "balcao", pos: P.balcao, raio: 1.8,
        rotulo: "ver a entrega no balcão",
        visivel: function () { const p = pendente(); return !!p && !!ENTREGAS[p.id]; },
        acao: function () { TOGA.ui.abrirInterludioPendente(); } },

      { id: "mural", pos: P.mural, raio: 1.6,
        rotulo: "ler o mural do fórum",
        acao: function () { abrirMural(); } },

      { id: "quadroConquistas", pos: P.quadroConquistas, raio: 1.8,
        rotulo: "olhar o quadro de conquistas",
        visivel: function () { return !!TOGA.conquistas; },
        acao: function () { TOGA.conquistas.abrirVitrine(); } },

      { id: "janelaGab", pos: P.janelaGab, raio: 1.7,
        rotulo: "olhar pela janela",
        acao: function () {
          const e = M().estado;
          const noite = e && e.pauta === "dia3";
          if (e && !e.flags._janela) {
            e.flags._janela = true;
            M().alterarEstresse(-2);
            M().salvar();
            if (TOGA.ui.atualizarHUD) TOGA.ui.atualizarHUD();
          }
          toastMundo(noite
            ? "🌙 A cidade dorme do outro lado do vidro — meia dúzia de janelas acesas, um cachorro atravessando a rua vazia. É por essas janelas apagadas que o plantão existe: alguém precisa estar acordado quando uma delas acender de susto."
            : "🪟 A feira está armada na praça, o ônibus escolar dobra a esquina, alguém discute o preço do tomate. A comarca inteira segue a vida — sem saber quantas dessas vidas passam pela sua pauta. Melhor assim.");
        } },

      { id: "copa", pos: P.copa, raio: 2.0,
        rotulo: "fazer um lanche na copa",
        acao: function () { lancheNaCopa(); } },

      { id: "comidaRazumikin", pos: { x: -2.6, z: -7.0 }, raio: 1.6,
        rotulo: "pegar a comida do Razumikin",
        visivel: function () {
          const e = M().estado;
          return !!(e && !e.flags._comidaRazumikin && !e.flags._razumikinJantou);
        },
        acao: function () {
          const e = M().estado;
          e.flags._comidaRazumikin = true;
          M().salvar();
          if (jogador) jogador.segurar("pote", "dir");
          toastMundo("🍖 No armário ao lado da geladeira, o pote vermelho com a etiqueta na letra do escrivão: “RAÇÃO DO RAZUMIKIN — não mexer, salvo decisão judicial”. Dona Lourdes finge que não viu — ela mesma encheu o pote de manhã. Agora é achar o fiscal do corredor.");
        } },

      { id: "brinquedoteca", pos: { x: 0, z: -3.0 }, raio: 1.7,
        rotulo: "olhar a brinquedoteca",
        acao: function () {
          const e = M().estado;
          if (e && !e.flags._brinquedoteca) {
            e.flags._brinquedoteca = true;
            M().alterarEstresse(-2);
            M().salvar();
            if (TOGA.ui.atualizarHUD) TOGA.ui.atualizarHUD();
          }
          toastMundo("🧸 A brinquedoteca existe para que nenhuma criança espere o fórum com medo dele (Lei 13.431: a escuta protegida começa na sala de espera). Os desenhos da parede são de quem já passou por aqui — repare que quase todos têm sol.");
        } },

      { id: "brincar", pos: { x: -0.6, z: -6.2 }, raio: 1.8,
        rotulo: "brincar com as crianças",
        visivel: function () { return !!M().estado; },
        acao: function () { brincarComCriancas(); } },

      { id: "treinoAssistencia", pos: { x: 22.2, z: -5.2 }, raio: 1.7,
        rotulo: "oferecer treinamento jurídico à equipe da rede",
        visivel: function () {
          return !!M().estado && TOGA.conquistas && !TOGA.conquistas.tem("professorDaRede");
        },
        acao: function () { treinarAssistencia(); } },

      { id: "palestraEleitor", pos: { x: 25.0, z: 6.5 }, raio: 3.2,
        rotulo: "tomar a tribuna e abrir a palestra Eleitor do Futuro",
        visivel: function () {
          const e = M().estado;
          return !!(e && e.flags.eleitorFuturoAceito && !e.flags._palestraEleitorFeita);
        },
        acao: function () { palestraEleitorDoFuturo(); } },

      { id: "treinamento", pos: { x: 26.6, z: 6.0 }, raio: 2.2,
        rotulo: "ministrar a capacitação à equipe (ofício do TJCE)",
        visivel: function () {
          const e = M().estado;
          return !!(e && e.pauta === "dia2" && e.flags.d1_capacitacaoAceita && !e.flags._capacitacaoFeita);
        },
        acao: function () { ministrarCapacitacao(); } },

      { id: "desembargador", pos: { x: 23.6, z: 10.4 }, raio: 1.9,
        rotulo: "cumprimentar o Des. Raimundo Nonato",
        visivel: function () { return !!desembargador; },
        acao: function () {
          desembargador.setEmocao("feliz");
          if (jogador) desembargador.olharPara(jogador.grupo.position.clone().setY(1.5));
          toastMundo("🤝 O Desembargador aperta a sua mão com as duas dele: “Excelência, eu assino ofício pedindo capacitação há vinte anos. É a primeira vez que recebo de volta uma AULA — e com fila de perguntas. O Tribunal agradece; o Ceará, mais ainda.”");
          setTimeout(function () { if (desembargador) desembargador.olharPara(null); }, 5000);
        } },

      { id: "vara2", pos: { x: 15.4, z: 3.4 }, raio: 2.2,
        rotulo: "observar o Núcleo de Custódia (2ª Vara)",
        acao: function () {
          toastMundo("⚖ Na 2ª Vara, a Juíza Adriana da Cruz Dantas — coordenadora do Núcleo de Custódia e do Juízo das Garantias — preside mais uma audiência: todo preso em flagrante da região passa por esta sala em até 24 horas (CPP, art. 310; Res. CNJ 213). É ela quem garante que ninguém fique esquecido numa cela — e foi a pedido dela que VOCÊ assumiu a custódia de Jonas, no mutirão do Núcleo.");
        } },

      { id: "juri", pos: P.juri, raio: 2.6,
        rotulo: "visitar o plenário do júri",
        visivel: function () {
          // enquanto a palestra Eleitor do Futuro está pendente, ela
          // tem prioridade aqui — o tour do plenário sai de cena
          const e = M().estado;
          return !(e && e.flags.eleitorFuturoAceito && !e.flags._palestraEleitorFeita);
        },
        acao: function () {
          const f = (M().estado && M().estado.flags) || {};
          toastMundo((f.pronunciaSolida || f.d1_pronunciaSolida)
            ? "⚖ O Salão do Júri, vazio e solene. É AQUI que o caso da espingarda será julgado: sete jurados naquelas cadeiras, a tribuna, e a pronúncia que você fundamentou abrindo os trabalhos. A régua que você segurou chega inteira a este salão."
            : "⚖ O Salão do Júri: sete cadeiras para o Conselho de Sentença, a tribuna, o silêncio. A Constituição reservou ao povo o julgamento dos crimes dolosos contra a vida (art. 5º, XXXVIII) — e ao juiz, a presidência que garante que a paixão do plenário não atropele a prova.");
        } },

      { id: "estante", pos: P.estante, raio: 1.7,
        rotulo: "consultar a doutrina",
        visivel: function () { return haCaso(); },
        acao: function () {
          const caso = M().casosDaPauta()[M().estado.casoAtual];
          const livre = (caso.focos || []).find(function (f) { return !M().temFoco(f.id); });
          toastMundo(livre
            ? "📚 Você folheia o volume certo e uma anotação antiga salta aos olhos — “" + livre.rotulo + ": " + livre.dica + "”. Os autos dirão o resto."
            : "📚 A estante confirma o que os autos já disseram: você estudou os pontos certos. Bom sinal — doutrina serve para isso.");
        } },

      { id: "bebedouro", pos: P.bebedouro, raio: 1.5,
        rotulo: "beber água (acalma)",
        acao: function () {
          jogador.segurar("copo", "dir");
          jogador.executarAcao("beber", function () { jogador.segurar(null, "dir"); });
          toastMundo(TOGA.ui.pausa("agua") || "");
          if (TOGA.ui.atualizarHUD) TOGA.ui.atualizarHUD();
        } },

      { id: "conclusos", pos: P.conclusos, raio: 1.7,
        rotulo: function () {
          return "despachar os conclusos (" + M().despachosPendentes().length + ")";
        },
        visivel: function () { return M().estado && M().despachosPendentes().length > 0; },
        acao: function () { TOGA.ui.abrirDespachos(); } },

      { id: "frigobar", pos: P.frigobar, raio: 1.6,
        rotulo: "comer algo do frigobar",
        acao: function () {
          jogador.segurar("copo", "esq");
          jogador.executarAcao("beber", function () { jogador.segurar(null, "esq"); });
          toastMundo(TOGA.ui.pausa("lanche") || "");
          if (TOGA.ui.atualizarHUD) TOGA.ui.atualizarHUD();
        } },

      { id: "saude", pos: P.saude, raio: 2.2,
        rotulo: function () {
          const e = M().estado;
          const v = (e && e.estresse) || 0;
          if (v >= 85) return "🩺 setor de saúde — ATENDIMENTO URGENTE";
          if (v >= 60) return "🩺 passar no setor de saúde (atendimento)";
          return "conversar com o médico do fórum";
        },
        visivel: function () { return !!M().estado; },
        acao: function () {
          const e = M().estado;
          const v = (e.estresse || 0);
          registrarCumprimento("medico", true);
          // o médico conversa SEMPRE levando em conta o nível de estresse
          if (v >= 85) {
            atendimentoRotina("🩺 O médico não disfarça a preocupação: “Excelência, a sua pressão está nas alturas e o senhor está a um passo de passar mal. Senta aqui. Isso é atendimento, não conversa — e o senhor vai me ouvir até o fim.”");
            return;
          }
          if (v >= 60) {
            atendimentoRotina("🩺 “A sua pressão subiu, dá para ver no seu passo. Senta que eu afiro, guio a sua respiração e o senhor sai daqui inteiro. O fórum precisa do senhor de pé — não no chão.”");
            return;
          }
          if (v >= 30) {
            M().alterarEstresse(-5); e.minutos += 3; M().salvar();
            toastMundo("🩺 “Pressão um pouco acima do seu normal, Excelência — nada grave, mas é o corpo avisando. Três respirações fundas comigo... pronto. Faça uma pausa antes que vire atendimento.” (−5 de estresse)");
          } else if (!e.flags._visitaMedico) {
            e.flags._visitaMedico = true;
            M().alterarEstresse(-3); e.minutos += 3; M().salvar();
            toastMundo("🩺 “Pressão ótima, Excelência — gestão emocional de primeira. Aproveite que veio: respira fundo comigo três vezes... pronto. Volte quando a pauta apertar, de preferência ANTES de apertar.” (−3 de estresse)");
          } else {
            M().alterarEstresse(-2); e.minutos += 2; M().salvar();
            toastMundo("🩺 “De volta e com a pressão boa? É assim que se faz: quem aparece antes da crise raramente vira a crise. Estou aqui o expediente inteiro.” (−2 de estresse)");
          }
          if (TOGA.ui.atualizarHUD) TOGA.ui.atualizarHUD();
        } },

      { id: "assistencia", pos: P.assistenciaSocial, raio: 2.2,
        rotulo: "falar com a assistência social",
        acao: function () {
          // a rede CONTA o que já fez com as suas decisões de hoje
          const f = (M().estado && M().estado.flags) || {};
          const feitos = [];
          if (f.criancasAcolhidas) feitos.push("os filhos de Jonas jantaram no abrigo, com o pai junto");
          if (f.familiaAcolheu) feitos.push("Caio dormiu na casa da avó, escola confirmada");
          if (f.acordoMoradia) feitos.push("o aluguel social da família de Cleide está ativo");
          if (f.protegida || f.protegidaMadrugada) feitos.push("o acompanhamento da medida protetiva está de pé");
          if (f.maeAcompanhada) feitos.push("Rosa segue em atendimento, com sigilo preservado");
          toastMundo(feitos.length
            ? "🤝 “Atualização da rede, Excelência: " + feitos.join("; ") + ". Oficiou, a gente cumpre.”"
            : "🤝 “A rede está de prontidão, Excelência: CRAS, Centro POP, acolhimento, abrigo e cesta de urgência. Quando o ofício chega ainda quente da audiência, a resposta sai no mesmo dia.”");
          registrarCumprimento("assistencia", true);
        } },

      { id: "cela", pos: P.cela, raio: 1.9,
        rotulo: "olhar a cela de custódia",
        acao: function () {
          if (TOGA.prisao3d && TOGA.prisao3d.ocupada()) {
            toastMundo("🔒 Custódia: " + TOGA.prisao3d.nomesPresos().join(", ") +
              ". Toda prisão que você decreta tem endereço — e prazo de revisão.");
          } else {
            toastMundo("🔓 A cela de custódia está vazia — e oxalá continue assim.");
          }
        } },

      { id: "bancada", pos: P.bancada, raio: 2.4,
        rotulo: function () {
          const c = M().casosDaPauta()[M().estado.casoAtual];
          return "sentar à bancada e apregoar — " + (c ? c.titulo : "");
        },
        visivel: function () {
          return TOGA.ui.audienciaPronta && TOGA.ui.audienciaPronta() &&
                 semInterludios() && !casoNoJuri();
        },
        acao: function () { TOGA.ui.iniciarAudiencia(); } },

      { id: "bancadaJuri", pos: P.bancadaJuri, raio: 2.6,
        rotulo: function () {
          const c = M().casosDaPauta()[M().estado.casoAtual];
          return "assumir a presidência do plenário — " + (c ? c.titulo : "");
        },
        visivel: function () {
          return TOGA.ui.audienciaPronta && TOGA.ui.audienciaPronta() &&
                 semInterludios() && casoNoJuri();
        },
        acao: function () { TOGA.ui.iniciarAudiencia(); } },

      { id: "extintor", pos: P.extintor, raio: 1.5,
        rotulo: "olhar o extintor de incêndio",
        acao: function () {
          toastMundo("🧯 Seu Matias confere o lacre todo mês: “prevenção, doutor, é igual embargos de declaração — ninguém gosta até precisar. Mas no dia em que precisa, agradece quem cuidou antes.”");
        } },

      { id: "imprensa", pos: P.imprensaBancada, raio: 2.2,
        rotulo: function () {
          const f = (M().estado && M().estado.flags) || {};
          return ((f.feminicidioCondenado || f.absolvicaoContaminada) && !f._coletivaFeita)
            ? "atender a coletiva de imprensa — o veredicto de hoje"
            : "falar com a imprensa";
        },
        acao: function () {
          const f = (M().estado && M().estado.flags) || {};
          if ((f.feminicidioCondenado || f.absolvicaoContaminada) && !f._coletivaFeita) {
            coletivaImprensa();
            return;
          }
          toastMundo("🎙 A repórter levanta o gravador: “Excelência, dois minutos?”. Você explica o que PODE: a pauta é pública, a sentença se publica, mas processo com segredo de justiça não vira manchete — protege vítima e família, não o juiz. Ela anota: “justo. Volto no dia do júri.”");
        } },

      { id: "oab", pos: P.oab, raio: 2.4,
        rotulo: "cumprimentar a advocacia",
        acao: function () {
          toastMundo("⚖ O advogado de plantão se levanta para o aperto de mão: “Excelência, apareça sempre. Juiz que respeita a tribuna julga melhor — e advogado que respeita a toga defende melhor.” Na parede, a placa lembra: a advocacia é indispensável à administração da justiça (CF, art. 133).");
        } },

      { id: "saida", pos: P.portaSaida, raio: 2.0,
        rotulo: "encerrar o expediente e sair do fórum",
        visivel: function () { return M().estado && M().fimDaPauta() && semInterludios(); },
        acao: function () { TOGA.ui.mostrarEpilogo(); } },

      // o Parque é LIVRE a qualquer hora — uma das formas de baixar o estresse
      { id: "parqueDireto", pos: { x: P.portaSaida.x, z: P.portaSaida.z + 1.7 }, raio: 1.8,
        rotulo: "🌳 dar uma volta no Parque da Cidade (pausa · alivia o estresse)",
        visivel: function () { return !!(M().estado && TOGA.parque3d); },
        acao: function () { entrarParque("forum"); } },

      { id: "cidade", pos: { x: P.portaSaida.x, z: P.portaSaida.z - 2.0 }, raio: 1.8,
        rotulo: function () {
          if (TOGA.atividades.liberadas) return "🌳 sair para a RUA · modo de teste";
          const n = TOGA.conquistas ? TOGA.conquistas.quantasGanhas() : 0;
          const tem = TOGA.atividades && TOGA.atividades.LISTA.some(function (a) { return n >= a.limiar; });
          return tem ? "🌳 sair para a RUA — atividades da comarca"
                     : "🌳 espiar a rua (atividades destravam com conquistas)";
        },
        visivel: function () {
          if (!TOGA.atividades || !M().estado) return false;
          if (TOGA.atividades.liberadas) return true;   // modo de teste do autor
          return !!(M().fimDaPauta() && semInterludios());
        },
        acao: function () {
          if (TOGA.atividades.liberadas) { entrarRua(); return; }
          const n = TOGA.conquistas ? TOGA.conquistas.quantasGanhas() : 0;
          const prox = TOGA.atividades.LISTA.find(function (a) { return n < a.limiar; });
          if (!TOGA.atividades.LISTA.some(function (a) { return n >= a.limiar; })) {
            toastMundo("🔒 A comarca além do fórum destrava com as suas conquistas: " +
              TOGA.atividades.LISTA.map(function (a) { return a.icone + " " + a.limiar; }).join(" · ") +
              ". Você tem " + n + (prox ? " — faltam " + (prox.limiar - n) + " para " + prox.nome + "." : "."));
            return;
          }
          entrarRua();
        } },

      // ---- Ala Leste II: 2ª Vara e CEJUSC ----
      { id: "gab2", pos: P.gab2 || { x: 43.5, z: -5.6 }, raio: 2.0,
        rotulo: "cumprimentar o(a) titular da 2ª Vara",
        visivel: function () { return !!(mundoInfo && mundoInfo.pontos.gab2); },
        acao: function () {
          toastMundo("🤝 No gabinete ao lado, a colega da 2ª Vara ergue os olhos dos autos: “Excelência! Bem-vindo(a) ao meu canto. Dividimos a comarca e o cafezinho — quando a sua pauta apertar, a porta aqui está sempre aberta.”");
        } },

      { id: "cejusc", pos: P.cejusc || { x: 44, z: 4.4 }, raio: 2.4,
        rotulo: function () {
          return (TOGA.atividades.missaoFeita && TOGA.atividades.missaoFeita("mediacaoCejusc"))
            ? "🤝 rever a sessão de mediação do CEJUSC"
            : "🤝 conduzir uma sessão de mediação no CEJUSC (missão)";
        },
        visivel: function () { return !!(mundoInfo && mundoInfo.pontos.cejusc); },
        acao: function () {
          if (!TOGA.atividades || TOGA.atividades.emVisita) return;
          TOGA.controles3d.desativar();
          TOGA.atividades.executarMissao("mediacaoCejusc", function (r) {
            reativarControles();
            toastMundo(r.exemplar
              ? "🤝 Sessão de manual: escuta, imparcialidade e o acordo nascendo das próprias partes. A facilitadora anota seu nome para a equipe do CEJUSC — “é assim que se pacifica conflito.”"
              : "✔ Sessão concluída. Algumas intervenções atropelaram o consenso — “mediar é desaprender a sentenciar”, sorri a facilitadora. O acordo, ainda assim, foi possível.");
          });
        } },

      { id: "muralCejusc", pos: { x: 44, z: 10.5 }, raio: 2.0,
        rotulo: "ler o mural de normas do CEJUSC",
        visivel: function () { return !!(mundoInfo && mundoInfo.pontos.cejusc); },
        acao: function () {
          toastMundo("📜 No mural: Resolução CNJ 125/2010 (Política Nacional de tratamento adequado dos conflitos) e Lei 13.140/2015 (Mediação). Princípios em destaque: imparcialidade, autonomia da vontade, confidencialidade. Embaixo, à mão: “sentença encerra o processo; acordo encerra o conflito.”");
        } }
    ];
  }

  /* ---------- COLETIVA DE IMPRENSA (pós-júri do Dia 4) ----------
     O juiz senta à bancada da Sala de Imprensa e explica o
     julgamento em linguagem institucional. O teor depende de COMO
     ele presidiu o plenário — a comarca inteira está ouvindo.     */
  function coletivaImprensa() {
    const e = TOGA.motor.estado;
    if (!e) return;
    e.flags._coletivaFeita = true;
    TOGA.motor.salvar();
    const condenou = !!e.flags.feminicidioCondenado;
    encenarJogador({ acao: "sentar", dur: 1.4 });
    if (condenou) {
      toastMundo("🎙 Você se senta à bancada. Flashes. “Excelência, o que esse julgamento significa?” — “Significa que o Tribunal do Júri funcionou: os jurados decidiram com base na PROVA, e a presidência garantiu que o debate fosse sobre o crime — não sobre a vida da vítima. É isso que o Protocolo de Julgamento com Perspectiva de Gênero do CNJ pede de cada juiz.”");
      toastMundo("🎙 “E a família?” — “A família de Iracema saiu do plenário com o nome da filha respeitado. A condenação não devolve ninguém, mas diz, em nome da sociedade: a culpa tem endereço, e não é na vítima.” Os gravadores se abaixam. Uma repórter mais antiga apenas assente, devagar.");
      toastMundo("🎙 A nota sai ainda à noite, sóbria e correta. Dona Lourdes, que serviu o café da coletiva, comenta ao recolher as xícaras: “falou bonito, doutor. Falou o que as mãe precisava ouvir.”");
    } else {
      toastMundo("🎙 Você se senta à bancada. Flashes. “Excelência, a defesa atacou a memória da vítima o julgamento inteiro e o senhor não interveio. O plenário absolveu. O que o senhor responde?” O microfone fica um segundo a mais na sua direção do que você gostaria.");
      toastMundo("🎙 Você explica o que cabe: a soberania dos veredictos é da Constituição; o Ministério Público já anunciou apelação (CPP, art. 593, III, d) e a revisão é o caminho institucional. É tecnicamente correto. Mas a pergunta que fica no ar — “e o que o senhor PODIA ter feito durante os debates?” — essa, você leva para casa.");
    }
    if (TOGA.conquistas) TOGA.conquistas.avaliar("coletiva");
  }

  /* Balãozinho de texto no mundo (conversas rápidas, café...) */
  let timerToast = null;
  /* ---------- As mensagens do mundo ----------
     PERSISTENTES e em FILA: o texto fica na tela até o jogador
     apertar E (ou tocar na mensagem) — aí fecha, ou mostra a
     próxima da fila. Ninguém mais perde uma fala por piscar. */
  let filaToasts = [];          // itens: { texto, auto? (segundos) }
  let toastVisivel = false;

  function elToast() {
    let el = document.getElementById("balao-mundo");
    if (!el) {
      el = document.createElement("div");
      el.id = "balao-mundo";
      el.className = "objetivo-mundo balao-conversa";
      el.style.position = "fixed";
      el.style.bottom = "22vh";
      el.style.left = "50%";
      el.style.transform = "translateX(-50%)";
      el.style.zIndex = 6;
      el.innerHTML = '<span class="texto-balao-mundo"></span><span class="dica-balao-mundo"></span>';
      el.addEventListener("click", avancarToast);   // no toque, a mensagem é o botão
      document.body.appendChild(el);
    }
    return el;
  }

  function exibirToast() {
    const el = elToast();
    const item = filaToasts[0];
    if (timerToast) { clearTimeout(timerToast); timerToast = null; }
    if (item == null) { el.hidden = true; toastVisivel = false; return; }
    toastVisivel = true;
    el.querySelector(".texto-balao-mundo").textContent = item.texto;
    el.querySelector(".dica-balao-mundo").textContent =
      filaToasts.length > 1 ? "E — próxima (" + (filaToasts.length - 1) + ") ▸"
        : (item.auto ? "E — fechar ▸" : "E — fechar ▸");
    el.hidden = false;
    // descobertas e avisos leves se dispensam sozinhos (o E continua valendo)
    if (item.auto) {
      timerToast = setTimeout(function () {
        if (filaToasts[0] === item) { filaToasts.shift(); exibirToast(); }
      }, item.auto * 1000);
    }
  }

  function toastMundo(texto, opts) {
    filaToasts.push({ texto: texto, auto: (opts && opts.auto) || 0 });
    exibirToast();   // mostra (ou atualiza o contador da dica)
  }

  /* troca de cenário: nada de mensagem velha sobre a cena nova */
  function limparToasts() {
    filaToasts = [];
    exibirToast();
  }

  /* avança/fecha; devolve true se CONSUMIU o aperto de E */
  function avancarToast() {
    if (!toastVisivel) return false;
    filaToasts.shift();
    exibirToast();
    if (TOGA.audio) TOGA.audio.tocar("papel");
    return true;
  }

  /* toastAberto: true só para mensagens que o jogador PRECISA ler
     (conversas). Descobertas auto-dispensáveis ("Espaço conhecido")
     não bloqueiam o prompt de interação nem o avanço por E. */
  function toastAberto() {
    return toastVisivel && !(filaToasts[0] && filaToasts[0].auto);
  }

  /* ---------- Arco emocional encenado no mundo ----------
     Depois do desfecho, as partes procuram o juiz no corredor:
     gratidão, alívio, abraço — ou decepção e raiva, conforme o
     ramo do arco que as flags acenderam.                     */
  let figurantesArco = [];

  function encenarArco(arco) {
    TOGA.motor.marcarArco(arco.caso.id);
    if (animacoesRapidas || !arco.ramo) return;         // bot/sem ramo: só marca
    const falas = arco.ramo.falas || [];
    const ids = [];
    falas.forEach(function (f) {
      if (f.quem !== "narrador" && f.quem !== "voce" && ids.indexOf(f.quem) < 0) ids.push(f.quem);
    });
    if (!ids.length) { if (falas[0]) toastMundo("💬 " + falas[0].texto); return; }

    const e = TOGA.controles3d.estado();
    const px = e ? e.pos.x : 1, pz = e ? e.pos.z : 0;
    const grupoArco = ids.slice(0, 2).map(function (id, i) {
      const p = arco.caso.personagens.find(function (x) { return x.id === id; }) || { id: id, avatar: {} };
      const b = TOGA.boneco3d.criar(p, {});
      b.grupo.position.set(1 + i * 0.7, 0, 2.6);
      TOGA.nucleo3d.scene.add(b.grupo);
      figurantesArco.push(b);
      TOGA.rotinas3d.irPara(b,
        [{ x: 1 + i * 0.7, z: 0.8 }, { x: px + (i === 0 ? -0.5 : 0.5), z: pz + 1.4 }],
        { aoChegar: function () { b.olharPara(jogador.cabecaMundo); } });
      return { id: id, b: b, p: p };
    });

    let atraso = 2800;
    falas.forEach(function (f) {
      setTimeout(function () {
        const reg = grupoArco.find(function (x) { return x.id === f.quem; });
        if (reg) {
          if (f.emocao) reg.b.setEmocao(f.emocao);
          reg.b.falando(true);
          setTimeout(function () { reg.b.falando(false); }, 2600);
        }
        const p = arco.caso.personagens.find(function (x) { return x.id === f.quem; });
        toastMundo("💬 " + (p ? p.nome + ": " : "") + "“" + f.texto + "”");
      }, atraso);
      atraso += 3700;
    });

    if (arco.ramo.gesto === "abraco" && grupoArco.length === 2) {
      setTimeout(function () {
        grupoArco[1].b.grupo.position.copy(grupoArco[0].b.grupo.position).x += 0.42;
        grupoArco.forEach(function (x) { x.b.executarAcao("abraco"); });
      }, atraso);
      atraso += 2600;
    }

    setTimeout(function () {
      grupoArco.forEach(function (x, i) {
        TOGA.rotinas3d.irPara(x.b, [{ x: -13.2, z: 0.3 + i * 0.6 }], {
          aoChegar: function () {
            TOGA.nucleo3d.scene.remove(x.b.grupo);
            const j = figurantesArco.indexOf(x.b);
            if (j >= 0) figurantesArco.splice(j, 1);
          }
        });
      });
    }, atraso + 1400);
  }

  /* Mural: pauta + manchetes que as flags já permitirem */
  function abrirMural() {
    const e = TOGA.motor.estado;
    const linhas = TOGA.motor.casosDaPauta().map(function (c, i) {
      const feito = e.concluidos.find(function (x) { return x.id === c.id; });
      return c.hora + " — " + c.titulo + (feito ? " ✓" : i === e.casoAtual ? " ◀ próxima" : "");
    });
    const vazadas = (TOGA.manchetes || [])
      .filter(function (m) { try { return m.tom === "grave" && m.condicao(e.flags, e.reputacao); } catch (err) { return false; } })
      .slice(0, 2)
      .map(function (m) { return "“" + m.titulo + "” — comenta-se no corredor"; });
    toastMundo("📌 " + linhas.concat(vazadas).join("  ·  "));
  }

  /* ---------- ENCENAR O JUIZ ----------
     Nas interações "de gente" (carinho, comida, brincadeira), o
     controle TRAVA por alguns segundos e o próprio juiz executa
     o gesto — a ação acontece no corpo, não só no texto.
     Enquanto dura, o prompt de interação some (os controles
     desativados silenciam o tick da interação).             */
  function encenarJogador(opts) {
    opts = opts || {};
    if (!jogador) { if (opts.aoFim) opts.aoFim(); return; }
    if (TOGA.controles3d.desativar) TOGA.controles3d.desativar();
    jogador.grupo.userData.andando = false;
    if (opts.olharPara) {
      jogador.grupo.rotation.y = Math.atan2(
        opts.olharPara.x - jogador.grupo.position.x,
        opts.olharPara.z - jogador.grupo.position.z);
    }
    (opts.props || []).forEach(function (p) { jogador.segurar(p[0], p[1]); });
    if (opts.acao) jogador.executarAcao(opts.acao);
    if (opts.falar) jogador.falando(true);     // gesticula como quem explica
    setTimeout(function () {
      if (opts.soltar !== false) (opts.props || []).forEach(function (p) { jogador.segurar(null, p[1]); });
      jogador.executarAcao(null);
      if (opts.falar) jogador.falando(false);
      const telaMundo = document.getElementById("tela-mundo");
      if (TOGA.controles3d.ativar && telaMundo && telaMundo.classList.contains("ativa")) {
        TOGA.controles3d.ativar();
      }
      if (opts.aoFim) opts.aoFim();
    }, (opts.dur || 3) * 1000);
  }

  /* =====================================================
     SETOR DE SAÚDE — atendimento animado e EMERGÊNCIA
     -----------------------------------------------------
     O médico do fórum conversa conforme o nível de estresse;
     a partir de 60 há atendimento encenado (o juiz senta, o
     médico examina). Aos 100, o juiz PASSA MAL: a brigada
     chega com a maca, atende e o normaliza — tudo animado.
     ===================================================== */
  let medicoBoneco = null;
  let emAtendimento = false;
  let emergState = null, emergTickReg = false, equipeMedica = null, soroMesh = null;

  function mundoAtivo() {
    const t = document.getElementById("tela-mundo");
    return !!(t && t.classList.contains("ativa")) && !!jogador;
  }

  function garantirMedico() {
    if (medicoBoneco) return medicoBoneco;
    if (!TOGA.boneco3d) return null;
    medicoBoneco = TOGA.boneco3d.criar(
      { id: "medicoForum", avatar: { pele: "#c98e66", cabelo: "curto",
        corCabelo: "#241a10", traje: "camisa", corTraje: "#eef1f4", oculos: true } }, {});
    const P = mundoInfo && mundoInfo.pontos && mundoInfo.pontos.saude;
    if (P) medicoBoneco.grupo.position.set(P.x, 0, P.z - 0.4);
    medicoBoneco.grupo.visible = false;
    TOGA.nucleo3d.scene.add(medicoBoneco.grupo);
    animarExtras.push(medicoBoneco);   // ticado → gesticula durante o atendimento
    return medicoBoneco;
  }

  /* a equipe de emergência: médico + maqueiro + a maca reutilizável */
  function garantirEquipeMedica() {
    if (equipeMedica) return equipeMedica;
    const medico = garantirMedico();
    const helper = TOGA.boneco3d.criar(
      { id: "maqueiroForum", avatar: { pele: "#a86a48", cabelo: "curto",
        corCabelo: "#241a10", traje: "camisa", corTraje: "#cfe0ea" } }, {});
    helper.grupo.visible = false;
    TOGA.nucleo3d.scene.add(helper.grupo);
    animarExtras.push(helper);
    const maca = montarMaca(0, -300);   // nasce fora de cena
    maca.visible = false;
    equipeMedica = { medico: medico, helper: helper, maca: maca };
    return equipeMedica;
  }

  /* deita / levanta o juiz (pose de desacordado) */
  function deitarJuiz(sim) {
    if (!jogador) return;
    jogador.executarAcao(null);
    jogador.userData && (jogador.userData.andando = false);
    jogador.grupo.userData.andando = false;
    if (sim) { jogador.grupo.rotation.set(-Math.PI / 2, jogador.grupo.rotation.y, 0); }
    else { jogador.grupo.rotation.set(0, jogador.grupo.rotation.y, 0); jogador.grupo.position.y = 0; }
  }

  /* suporte de soro ao lado da maca */
  function montarSoro(x, z) {
    removerSoro();
    const g = new THREE.Group();
    const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.7, 8),
      new THREE.MeshLambertMaterial({ color: 0xc9ccd2 }));
    haste.position.y = 0.85;
    const gancho = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.3, 6),
      new THREE.MeshLambertMaterial({ color: 0xc9ccd2 }));
    gancho.rotation.z = Math.PI / 2; gancho.position.set(0.12, 1.65, 0);
    const bolsa = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.28, 0.05),
      new THREE.MeshLambertMaterial({ color: 0xbfe3c0, transparent: true, opacity: 0.85 }));
    bolsa.position.set(0.22, 1.45, 0);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.05, 12),
      new THREE.MeshLambertMaterial({ color: 0x55585e }));
    g.add(haste, gancho, bolsa, base);
    g.position.set(x, 0, z);
    TOGA.nucleo3d.scene.add(g);
    soroMesh = g;
  }
  function removerSoro() {
    if (soroMesh) { TOGA.nucleo3d.scene.remove(soroMesh); soroMesh = null; }
  }

  /* tick da emergência: interpola o transporte da maca e conduz a
     câmera cinematográfica em torno da ação. */
  function tickEmergencia(dt) {
    if (!emergState) return;
    const tr = emergState.transporte;
    if (tr) {
      tr.t += dt / tr.dur;
      const k = Math.min(1, tr.t);
      const fx = tr.de.x + (tr.para.x - tr.de.x) * k;
      const fz = tr.de.z + (tr.para.z - tr.de.z) * k;
      const ang = Math.atan2(tr.para.x - tr.de.x, tr.para.z - tr.de.z);
      const eq = equipeMedica;
      if (eq && eq.maca) { eq.maca.position.set(fx, 0, fz); eq.maca.rotation.y = ang; }
      jogador.grupo.position.set(fx, 0.72, fz);
      jogador.grupo.rotation.set(-Math.PI / 2, ang, 0);
      if (eq && eq.medico) { eq.medico.grupo.position.set(fx - Math.cos(ang) * 0.7, 0, fz + Math.sin(ang) * 0.7); eq.medico.grupo.rotation.y = ang; eq.medico.grupo.userData.andando = true; }
      if (eq && eq.helper) { eq.helper.grupo.position.set(fx + Math.cos(ang) * 0.7, 0, fz - Math.sin(ang) * 0.7); eq.helper.grupo.rotation.y = ang; eq.helper.grupo.userData.andando = true; }
      emergState.foco = { x: fx, z: fz };
      if (tr.t >= 1) { emergState.transporte = null; const cb = tr.onFim; if (cb) cb(); }
    }
    const f = emergState.foco, cam = TOGA.nucleo3d.camera;
    if (cam && f) {
      const a = emergState.camAng || 0;
      cam.position.set(f.x + Math.sin(a) * 4.3, 2.7, f.z + Math.cos(a) * 4.3);
      cam.lookAt(f.x, 0.8, f.z);
    }
  }

  /* maca simples (lona + base com rodinhas) montada ao lado do juiz */
  function montarMaca(x, z) {
    const g = new THREE.Group();
    const lona = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.12, 1.9),
      new THREE.MeshLambertMaterial({ color: 0x3a6ea5 }));
    lona.position.y = 0.64; lona.castShadow = true;
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.5, 1.8),
      new THREE.MeshLambertMaterial({ color: 0xc9ccd2 }));
    base.position.y = 0.33;
    g.add(lona, base);
    [[-0.3, 0.8], [0.3, 0.8], [-0.3, -0.8], [0.3, -0.8]].forEach(function (p) {
      const r = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.08, 10),
        new THREE.MeshLambertMaterial({ color: 0x15110c }));
      r.rotation.z = Math.PI / 2; r.position.set(p[0], 0.08, p[1]); g.add(r);
    });
    g.position.set(x, 0, z);
    TOGA.nucleo3d.scene.add(g);
    return g;
  }

  /* overlay vermelho de "passar mal" (CSS #flash-emergencia) */
  function flashEmergencia(ligar) {
    let el = document.getElementById("flash-emergencia");
    if (!el) {
      el = document.createElement("div");
      el.id = "flash-emergencia";
      document.body.appendChild(el);
    }
    el.classList.toggle("ativo", !!ligar);
  }

  /* atendimento de rotina (estresse 60–99): o juiz senta, o médico
     examina e aplica a pausa forte do setor de saúde (−40, +15 min) */
  function atendimentoRotina(textoMedico) {
    const M = TOGA.motor;
    if (!mundoAtivo()) { const m = TOGA.ui.pausa("saude"); if (TOGA.ui.atualizarHUD) TOGA.ui.atualizarHUD(); return m; }
    if (emAtendimento) return "";
    emAtendimento = true;
    if (TOGA.controles3d.desativar) TOGA.controles3d.desativar();
    const jx = jogador.grupo.position.x, jz = jogador.grupo.position.z;
    const med = garantirMedico();
    if (med) {
      med.grupo.position.set(jx - 0.85, 0, jz + 0.35);
      med.grupo.rotation.y = Math.atan2(jx - (jx - 0.85), jz - (jz + 0.35));
      med.grupo.visible = true;
      med.segurar("pastas", "esq");
      med.falando(true);
    }
    jogador.executarAcao(null);
    jogador.sentar(true);
    TOGA.ui.pausa("saude");                       // efeitos (−40 estresse, +15 min)
    toastMundo(textoMedico, { auto: 6 });
    setTimeout(function () {
      if (med) { med.falando(false); med.segurar(null, "esq"); med.grupo.visible = false; }
      jogador.sentar(false);
      emAtendimento = false;
      reativarControles();
      if (TOGA.ui.atualizarHUD) TOGA.ui.atualizarHUD();
    }, 6000);
    return "";
  }

  /* EMERGÊNCIA aos 100: cutscene completa e ANIMADA — o juiz colapsa
     de verdade (cai no chão), a equipe médica é acionada, ele é
     carregado na maca, TRANSPORTADO desacordado até o setor de saúde,
     medicado/tratado, e só então desperta. Tudo mostrado em cena.
     Chamada por ui.atualizarEstresse. */
  function emergenciaMedica(aoFim) {
    const M = TOGA.motor, e = M && M.estado;
    if (!mundoAtivo() || emAtendimento) {
      const ehModo3d = document.body.classList.contains("modo-3d");
      if (ehModo3d && !emAtendimento) {
        // estourou durante a audiência (mundo coberto): ADIA a cena animada
        // para quando o juiz voltar ao mundo 3D (tickGeral dispara). Normaliza
        // agora só para a pauta seguir sem re-disparar.
        if (e) { M.alterarEstresse(45 - (e.estresse || 0)); e.minutos += 30; e.flags._colapsou = true; e.flags._colapsoPendente = true; M.salvar(); }
        if (TOGA.ui.atualizarHUD) TOGA.ui.atualizarHUD();
        if (aoFim) aoFim();
        return;
      }
      // modo 2D clássico: normaliza com aviso (sem cena)
      if (e) { M.alterarEstresse(45 - (e.estresse || 0)); e.minutos += 30; e.flags._colapsou = true; M.salvar(); }
      if (TOGA.ui.atualizarHUD) TOGA.ui.atualizarHUD();
      if (TOGA.conquistas) TOGA.conquistas.avaliar("colapso-medico");
      if (aoFim) aoFim();
      return;
    }
    emAtendimento = true;
    if (!emergTickReg) { TOGA.nucleo3d.aoFrame(tickEmergencia); emergTickReg = true; }
    if (TOGA.controles3d.desativar) TOGA.controles3d.desativar();
    limparToasts();
    flashEmergencia(true);

    const jx = jogador.grupo.position.x, jz = jogador.grupo.position.z;
    const noForum = (localAtivo === "forum");
    emergState = { transporte: null, foco: { x: jx, z: jz }, camAng: 0.3 };

    // FASE 1 — o colapso: o juiz desaba no chão, desacordado
    deitarJuiz(true);
    jogador.grupo.position.set(jx, 0.14, jz);
    toastMundo("💥 A vista escurece, os sons somem, as pernas falham — e o senhor DESABA no chão da sala, desacordado. O martelo rola da bancada. O estresse cobrou a conta inteira.", { auto: 4 });

    // FASE 2 — a equipe de emergência chega
    setTimeout(function () {
      const eq = garantirEquipeMedica();
      eq.maca.visible = true; eq.maca.position.set(jx, 0, jz - 1.1); eq.maca.rotation.y = 0;
      eq.medico.grupo.visible = true; eq.medico.grupo.position.set(jx - 0.85, 0, jz + 0.5); eq.medico.grupo.rotation.y = Math.PI;
      eq.medico.setEmocao("firme"); eq.medico.executarAcao("apelo");
      eq.helper.grupo.visible = true; eq.helper.grupo.position.set(jx + 0.85, 0, jz + 0.5); eq.helper.grupo.rotation.y = Math.PI;
      eq.helper.setEmocao("surpresa"); eq.helper.executarAcao("entregar");
      emergState.camAng = -0.5;
      toastMundo("🚑 “EMERGÊNCIA NA SALA!” A brigada do fórum chega correndo com a maca; a assessora Laís abre caminho. O médico se ajoelha, mede o pulso, ergue a voz: “oxigênio, JÁ!”.", { auto: 4 });
    }, 1500);

    // FASE 3 — carregam o juiz na maca
    setTimeout(function () {
      jogador.grupo.position.set(jx, 0.72, jz - 1.1);
      jogador.grupo.rotation.set(-Math.PI / 2, 0, 0);
      emergState.foco = { x: jx, z: jz - 1.1 };
      emergState.camAng = 0.4;
      toastMundo("🧑‍⚕️ “Um, dois, três” — com cuidado, eles erguem o senhor para a maca e prendem o cinto de segurança. Desacordado, o juiz é firmado para o transporte.", { auto: 4 });
    }, 3800);

    // FASE 4 — o transporte ao setor de saúde
    setTimeout(function () {
      if (noForum && mundoInfo.pontos.saude) {
        const dest = mundoInfo.pontos.saude;
        toastMundo("🏥 A maca dispara pelo corredor — distribuição, custódia, assistência social — abrindo passagem até o SETOR DE SAÚDE. Servidores se encostam nas paredes; ninguém respira. Tudo para pelo juiz.", { auto: 5 });
        emergState.transporte = { t: 0, dur: 6, de: { x: jx, z: jz - 1.1 }, para: { x: dest.x, z: dest.z + 0.6 }, onFim: trataNoSetor };
      } else {
        toastMundo("🏥 Sem fórum por perto, o socorro vem até o senhor: a equipe monta o atendimento ali mesmo, no chão onde o juiz caiu.", { auto: 5 });
        trataNoSetor();
      }
    }, 6000);

    function trataNoSetor() {
      const f = emergState.foco, eq = equipeMedica;
      if (eq) {
        eq.medico.grupo.userData.andando = false; eq.helper.grupo.userData.andando = false;
        eq.medico.grupo.position.set(f.x - 0.85, 0, f.z + 0.45); eq.medico.grupo.rotation.y = Math.PI;
        eq.helper.grupo.position.set(f.x + 0.9, 0, f.z + 0.2); eq.helper.grupo.rotation.y = Math.PI * 0.7;
        eq.medico.setEmocao("firme"); eq.medico.falando(true); eq.medico.executarAcao("apelo");
        eq.helper.executarAcao("lerPapel");   // monitorando os sinais
      }
      montarSoro(f.x + 0.75, f.z);
      emergState.camAng = 0.7;
      toastMundo("💉 No setor de saúde: máscara de oxigênio, acesso na veia, soro pingando, monitor apitando o ritmo do coração. “Aguenta aí, doutor — o senhor vai voltar inteiro. Respira comigo.”", { auto: 6 });
      setTimeout(recuperar, 6500);
    }

    function recuperar() {
      const est = (M && M.estado) || e, f = emergState.foco;
      if (est) {
        TOGA.motor.alterarEstresse(45 - (est.estresse || 0));   // normaliza para ~45
        est.minutos += 30; est.flags._colapsou = true; TOGA.motor.salvar();
      }
      // o juiz desperta: levanta da maca, de pé ao lado dela
      deitarJuiz(false);
      jogador.grupo.position.set(f.x + 0.3, 0, f.z + 1.0);
      jogador.grupo.rotation.set(0, Math.PI, 0);
      if (equipeMedica) {
        equipeMedica.medico.falando(false); equipeMedica.medico.executarAcao(null); equipeMedica.medico.grupo.visible = false;
        equipeMedica.helper.executarAcao(null); equipeMedica.helper.grupo.visible = false;
        equipeMedica.maca.visible = false;
      }
      removerSoro();
      flashEmergencia(false);
      toastMundo("💚 O senhor desperta no setor de saúde, a cor de volta ao rosto. O médico não dá desconto: “voltou de longe, Excelência. Autocuidado não é luxo — é dever funcional. Da próxima vez, pare ANTES de cair.” (estresse normalizado · +30 min no relógio)", { auto: 8 });
      if (TOGA.conquistas) TOGA.conquistas.avaliar("colapso-medico");
      if (TOGA.ui.atualizarHUD) TOGA.ui.atualizarHUD();
      emAtendimento = false;
      const px = f.x + 0.3, pz = f.z + 1.0;
      emergState = null;
      TOGA.controles3d.teleportar(px, pz, Math.PI);
      reativarControles();
      if (aoFim) aoFim();
    }
  }

  /* ---------- O CARDÁPIO DA COPA ----------
     Cada visita é um lanche diferente — com a comida NA MÃO. */
  const MENUS_COPA = [
    { props: [["pao", "esq"], ["xicara", "dir"]],
      texto: "🥖 Pão de sal e café passado na hora. Você come em pé, na sagrada posição “encostado na pia” — a mesma de todo fórum do Brasil. Por três minutos, nenhum prazo vence." },
    { props: [["banana", "dir"]],
      texto: "🍌 Uma banana da fruteira coletiva (reposta pela Sandra, informa o bilhete colado na parede). Potássio homologado para aguentar sustentação oral das longas." },
    { props: [["iogurte", "dir"]],
      texto: "🥄 O seu iogurte SOBREVIVEU mais uma noite na geladeira coletiva — milagre sem precedentes na jurisprudência da copa. Você come direto no pote, lendo o mural de recados." },
    { props: [["cuscuz", "esq"], ["xicara", "dir"]], micro: true,
      texto: "🌽 Cuscuz com queijo coalho derretendo por cima, café do lado. Comida de gente, na medida do Ceará. O dia inteiro melhora de sabor." }
  ];
  let menuCopaIdx = 0;

  function lancheNaCopa() {
    const menu = MENUS_COPA[menuCopaIdx % MENUS_COPA.length];
    menuCopaIdx++;
    TOGA.ui.pausa("lanche");                 // os efeitos de sempre (estresse, tempo)
    if (TOGA.ui.atualizarHUD) TOGA.ui.atualizarHUD();
    function comer() {
      encenarJogador({ props: menu.props, acao: "beber", dur: 4.2 });
      toastMundo(menu.texto);
    }
    if (menu.micro) {
      if (TOGA.controles3d.desativar) TOGA.controles3d.desativar();
      toastMundo("🌽 Você bota o cuscuz no micro-ondas. Quarenta segundos de expectativa institucional... “TIN!”");
      setTimeout(comer, 1800);
    } else {
      comer();
    }
  }

  /* ---------- A ASSESSORA SABE DE TUDO ----------
     Conversar com ela rende o briefing do gabinete: ofícios na
     pilha, a pauta, o que circula no balcão — e as notícias da
     cidade, que ela coleciona melhor que jurisprudência.     */
  const NOTICIAS_CIDADE = [
    "Na cidade: a chuva chegou cedo no sertão este ano — a feira de sábado estava de calçada cheia e de humor melhor.",
    "Na cidade: o time da comarca empatou no domingo, mas o locutor da rádio narrou como vitória moral. Ninguém discordou.",
    "Na cidade: a quermesse da padroeira começa sexta. A secretaria já organizou o rodízio para ninguém perder a novena.",
    "Na cidade: abriram uma sorveteria na praça. O escrivão jura que o sabor cajá resolve qualquer dia difícil. Estou inclinada a homologar.",
    "Na cidade: o açude subiu dois palmos com as chuvas — bom para os roçados; a Defesa Civil já está de olho nas ribanceiras.",
    "Na cidade: formatura do cursinho popular no clube — três aprovados em Direito. Um deles avisou que quer 'a vaga do doutor'. Fica o senhor avisado.",
    "Na cidade: o mercado municipal ganhou pintura nova, mas a banca de dona Zefinha continua no mesmo lugar. Há coisas que nem o progresso remove.",
    "Na cidade: vaquejada no fim do mês. O oficial de justiça requereu que não haja diligência no sábado. Deferi de plano, pela vida."
  ];
  let noticiaIdx = 0;

  function conversaAssessora() {
    const e = TOGA.motor.estado;
    const partes = [];
    if (e) {
      const nDesp = TOGA.motor.despachosPendentes().length;
      if (nDesp) partes.push("Na pilha: " + nDesp + " concluso(s) esperando despacho.");
      if (!TOGA.motor.fimDaPauta()) {
        const c = TOGA.motor.casosDaPauta()[e.casoAtual];
        partes.push("Próximo da pauta: " + c.hora + " — " + c.titulo + ".");
      } else {
        partes.push("Pauta vencida — falta só o senhor fechar o dia na porta de saída.");
      }
      let manchete = null;
      (TOGA.manchetes || []).some(function (m) {
        try { if (m.tom === "grave" && m.condicao(e.flags, e.reputacao)) { manchete = m; return true; } } catch (err) {}
        return false;
      });
      if (manchete) partes.push("Circula no balcão: “" + manchete.titulo + "”.");
    }
    partes.push(NOTICIAS_CIDADE[noticiaIdx % NOTICIAS_CIDADE.length]);
    noticiaIdx++;
    registrarCumprimento("assessora", true);
    toastMundo("💬 Laís, sem consultar papel nenhum (ela sabe tudo de cor): “" + partes.join(" ") + "”");
  }

  /* ---------- BOM DIA, FÓRUM ----------
     Cumprimentar todo mundo que faz a casa funcionar — no
     mesmo dia — rende conquista. Como deve ser.            */
  const ALVOS_CUMPRIMENTO = ["assessora", "bruna", "beatriz", "samantha", "lourdes",
                             "matias", "assistencia", "medico", "guarda"];
  const posMatias = { x: -6, z: 1 };    // o ponto de interação SEGUE o zelador
  const posBruna = { x: -9.2, z: -7.4 };  // ...e o das assessoras que circulam
  const posBeatriz = { x: -12.6, z: -3.6 };

  /* ---------- DONO(A) DA CASA: visitar todos os espaços ----------
     A cada meio segundo, confere em qual canto do fórum o juiz
     está; espaço novo no dia = um carimbo no passaporte.      */
  const ESPACOS = [
    { id: "gabinete",      nome: "Gabinete",            x: -10, z: -5.5, r: 3.2 },
    { id: "copa",          nome: "Copa",                x: -3.9, z: -5, r: 2.4 },
    { id: "brinquedoteca", nome: "Brinquedoteca",       x: 0.6, z: -5, r: 2.4 },
    { id: "diretoria",     nome: "Distribuição/Diretoria", x: 6, z: -5, r: 2.6 },
    { id: "custodia",      nome: "Custódia",            x: 13.7, z: -1.2, r: 2.0 },
    { id: "assistencia",   nome: "Assistência Social",  x: 22.2, z: -5, r: 2.6 },
    { id: "saude",         nome: "Setor de Saúde",      x: 28, z: -5, r: 2.6 },
    { id: "sala1",         nome: "Sala de Audiências",  x: 1.2, z: 8, r: 4 },
    { id: "vara2",         nome: "2ª Vara",             x: 15.5, z: 6.5, r: 3.2 },
    { id: "juri",          nome: "Salão do Júri",       x: 25.5, z: 7.5, r: 3.6 },
    { id: "imprensa",      nome: "Sala de Imprensa",    x: 34, z: 4.4, r: 2.6 },
    { id: "oab",           nome: "Sala da OAB",         x: 34, z: -4.5, r: 2.6 }
  ];
  let esfriarVisita = 0;

  function tickVisitas(dt) {
    esfriarVisita -= dt;
    if (esfriarVisita > 0) return;
    esfriarVisita = 0.5;
    const e = TOGA.motor.estado;
    if (!e || !jogador || emAudiencia) return;
    const p = jogador.grupo.position;
    ESPACOS.forEach(function (s) {
      if (e.flags["_visita_" + s.id]) return;
      const dx = p.x - s.x, dz = p.z - s.z;
      if (dx * dx + dz * dz > s.r * s.r) return;
      e.flags["_visita_" + s.id] = true;
      TOGA.motor.salvar();
      const feitos = ESPACOS.filter(function (x) { return e.flags["_visita_" + x.id]; }).length;
      toastMundo("🧭 Espaço conhecido: " + s.nome + " (" + feitos + "/" + ESPACOS.length + ")" +
        (feitos === ESPACOS.length ? " — o fórum inteiro, de porta em porta!" : ""),
        { auto: 6 });
      if (TOGA.conquistas) TOGA.conquistas.avaliar("visita");
    });
  }

  function registrarCumprimento(id, semAceno) {
    const e = TOGA.motor.estado;
    if (!e || e.flags["_cump_" + id]) return;
    e.flags["_cump_" + id] = true;
    TOGA.motor.salvar();
    if (!semAceno) encenarJogador({ acao: "entregar", dur: 1.1 });   // o aceno
    if (TOGA.conquistas) TOGA.conquistas.avaliar("cumprimento");
  }

  /* ---------- ALÍVIO EMOCIONAL ----------
     Razumikin, dona Lourdes e seu Matias: o lado humano da casa.
     Conforta de verdade (−estresse), mas só UM fôlego por vez —
     depois de decidir algo, conforta de novo. Sem isso, dava para
     zerar o estresse só insistindo na mesma conversa. Devolve o
     quanto realmente aliviou (0 se ainda está no "fôlego" anterior). */
  function alivioEmocional(chave, quanto) {
    const e = TOGA.motor.estado;
    if (!e) return 0;
    const marca = "_alivio_" + chave;
    const agora = (e.historico ? e.historico.length : 0);
    if (e.flags[marca] === agora) return 0;   // ainda não houve nova decisão
    e.flags[marca] = agora;
    TOGA.motor.alterarEstresse(-quanto);
    TOGA.motor.salvar();
    if (TOGA.ui.atualizarHUD) TOGA.ui.atualizarHUD();
    return quanto;
  }

  /* ---------- HORA DO RECREIO (brinquedoteca) ----------
     O juiz senta no banquinho minúsculo — e por dez minutos a
     toga é só uma capa preta engraçada.                     */
  const FRASES_BRINCAR = [
    "🪁 Vocês constroem a torre de blocos mais alta da história da comarca. A menor das crianças a derruba com um tapa de precisão técnica e gargalha. Você reconstrói. Ela derruba de novo. O acordo tácito se homologa por mais cinco rodadas.",
    "🪁 A menina desenha você de capa e martelo gigante; o menino pergunta, desconfiado: “tia falou que o senhor é juiz DE VERDADE. Verdade mesmo?”. Você confirma. Ele olha a toga, olha o desenho, e conclui: “então tá aprovado”. Trânsito em julgado.",
    "🪁 Dez minutos de blocos, três regras inventadas na hora e uma disputa sobre quem fica com a peça vermelha — resolvida por conciliação, com as próprias crianças propondo o rodízio. Você sai dali com esperança renovada no futuro da advocacia."
  ];
  let frasesBrincarIdx = 0;

  function brincarComCriancas() {
    const e = TOGA.motor.estado;
    if (!e) return;
    // o juiz PARA e brinca de verdade: controles travados, braços abertos
    encenarJogador({ acao: "abraco", dur: 5.5, olharPara: { x: -0.1, z: -5.5 } });
    // as crianças reagem: olham para o juiz e abrem o sorriso
    const criancas = (TOGA.rotinas3d && TOGA.rotinas3d.criancas) ? TOGA.rotinas3d.criancas() : [];
    criancas.forEach(function (c) {
      c.setEmocao("feliz");
      if (jogador) c.olharPara(jogador.grupo.position.clone().setY(1.2));
      c.executarAcao("abraco");
      setTimeout(function () { c.olharPara(null); }, 6000);
    });
    const fala = FRASES_BRINCAR[frasesBrincarIdx % FRASES_BRINCAR.length];
    frasesBrincarIdx++;
    toastMundo(fala);
    if (!e.flags._brincouCriancas) {
      e.flags._brincouCriancas = true;
      TOGA.motor.aplicarEfeitos({ estresse: -6, tempo: 8 });
      TOGA.motor.salvar();
      if (TOGA.ui.atualizarHUD) TOGA.ui.atualizarHUD();
    }
    if (TOGA.conquistas) TOGA.conquistas.avaliar("brincadeira");
  }

  /* ---------- TREINAMENTO JURÍDICO DA REDE (assistência social) ---------- */
  function treinarAssistencia() {
    const e = TOGA.motor.estado;
    if (!e || e.flags._treinouRede) return;
    e.flags._treinouRede = true;
    // o juiz puxa a cadeira e DÁ a aula: parado, gesticulando
    encenarJogador({ falar: true, dur: 7, olharPara: { x: 22.2, z: -5.75 } });
    lourdesServeCafe(
      [{ x: -4.8, z: -2.6 }, { x: -4.8, z: 0.6 }, { x: 21.8, z: 0.6 }, { x: 22.0, z: -3.4 }],
      [{ x: 22.0, z: -1.2 }, { x: -4.8, z: 0.6 }, { x: -4.8, z: -2.6 }, { x: -4.4, z: -5.6 }], 10);
    const a = TOGA.rotinas3d && TOGA.rotinas3d.assistenteSocial;
    if (a) {
      a.setEmocao("feliz");
      if (jogador) a.olharPara(jogador.grupo.position.clone().setY(1.4));
      a.falando(true);
      setTimeout(function () { a.falando(false); a.olharPara(null); }, 6000);
    }
    toastMundo("📖 Você puxa uma cadeira do lado de lá do balcão: aula prática de uma hora para a equipe da rede — como redigir o relatório que o juiz consegue USAR, o que o art. 101 do ECA permite pedir de ofício, e por que “situação de risco” precisa vir com fato, data e endereço. A assistente social toma nota de tudo e arremata: “doutor, isso vale mais que dez ofícios devolvidos”.");
    setTimeout(function () {
      TOGA.motor.aplicarEfeitos({ tec: 2, hum: 3, tempo: 20, estresse: 2 });
      TOGA.motor.salvar();
      if (TOGA.ui.atualizarHUD) TOGA.ui.atualizarHUD();
      if (TOGA.conquistas) TOGA.conquistas.avaliar("treino-assistencia");
      toastMundo("📖 Resultado prático imediato: o próximo relatório da rede chega ao gabinete com fato, data, endereço — e uma sugestão de medida com o artigo certo. Quando a rede fala a língua do processo, a criança espera menos. Todo mundo ganhou a hora que você investiu.");
    }, 7000);
  }

  /* ---------- A CAPACITAÇÃO DO TJCE ----------
     Compromisso assumido no Dia 1, cumprido no Dia 2: a equipe
     inteira senta nas cadeiras do Conselho de Sentença, o juiz
     sobe à tribuna, e a aula acontece — com direito a pergunta
     sobre o sistema que trava e ofício de agradecimento do
     Desembargador no final.                                  */
  let equipeTreinamento = [];
  let desembargador = null;

  // a equipe do Desembargador, por nome (cada um com a sua cara)
  const EQUIPE_TJCE = [
    { nome: "Tereza",  avatar: { pele: "#c98e66", cabelo: "coque", corCabelo: "#777268", traje: "blazer", corTraje: "#2f4a3e", corBlusa: "#efe5c8", oculos: true } },
    { nome: "Brenda",  avatar: { pele: "#8a5436", cabelo: "longo", corCabelo: "#241a10", traje: "blazer", corTraje: "#6a4a5a", corBlusa: "#e8e2d2" } },
    { nome: "Mariana", avatar: { pele: "#e8c39a", cabelo: "longo", corCabelo: "#5a3318", traje: "camisa", corTraje: "#4a5a6e" } },
    { nome: "Sandra",  avatar: { pele: "#a86a48", cabelo: "coque", corCabelo: "#241505", traje: "camisa", corTraje: "#54453a" } },
    { nome: "Carol",   avatar: { pele: "#d8a87f", cabelo: "curto", corCabelo: "#3a2a1a", traje: "blazer", corTraje: "#3f5a5e", corBlusa: "#efe5c8" } },
    { nome: "Antonio Fernandes", avatar: { pele: "#c98e66", cabelo: "curto", corCabelo: "#574737", traje: "terno", corTraje: "#33424f", corGravata: "#7a2e2e", barba: true } }
  ];

  function ministrarCapacitacao() {
    const e = TOGA.motor.estado;
    if (!e || e.flags._capacitacaoFeita) return;
    e.flags._capacitacaoFeita = true;

    // a equipe do Desembargador senta nas cadeiras do Conselho
    EQUIPE_TJCE.forEach(function (m, i) {
      const b = TOGA.boneco3d.criar({ id: "equipe-" + i, avatar: m.avatar }, { sentado: true });
      b.grupo.position.set(29.0, 0, 4.4 + i * 1.05);
      b.grupo.rotation.y = -Math.PI / 2;     // de frente para a tribuna
      b.setEmocao("feliz");
      if (m.nome === "Antonio Fernandes") b.segurar("pastas", "esq");   // trouxe as dúvidas por escrito
      TOGA.nucleo3d.scene.add(b.grupo);
      equipeTreinamento.push(b);
    });

    // ...e o PRÓPRIO Desembargador aparece, na cadeira de honra
    desembargador = TOGA.boneco3d.criar(
      { id: "desembargador",
        avatar: { pele: "#c98e66", cabelo: "calvo", corCabelo: "#b9b3a6",
                  traje: "terno", corTraje: "#2b3340", corGravata: "#5a2020", oculos: true } },
      { sentado: true });
    desembargador.grupo.position.set(23.6, 0, 10.4);
    desembargador.grupo.rotation.y = Math.PI * 0.75;   // de frente para a tribuna
    desembargador.setEmocao("feliz");
    desembargador.olharPara(new THREE.Vector3(26.6, 1.4, 6.5));
    TOGA.nucleo3d.scene.add(desembargador.grupo);
    equipeTreinamento.push(desembargador);

    // o juiz assume a tribuna e LECIONA: controles travados, gesto de orador
    encenarJogador({ falar: true, dur: 14.5, olharPara: { x: 29.0, z: 7.5 } });
    lourdesServeCafe(CAMINHO_COPA_JURI, CAMINHO_JURI_COPA, 16);   // tradição da casa

    toastMundo("🎓 Tereza, Brenda, Mariana, Sandra e Carol ocupam as cadeiras do Conselho de Sentença; Antonio Fernandes fecha a fileira, de pasta aberta. E, na cadeira de honra ao lado da bancada, o PRÓPRIO Des. Raimundo Nonato Silva Santos: “vim conferir de camarote, Excelência. Finja que não estou.” Você sobe à tribuna. Ninguém finge.");

    setTimeout(function () {
      toastMundo("🎓 Meia hora de método e Tereza levanta a mão: “doutor, e quando o sistema trava no MEIO da audiência?”. Brenda e Sandra se entreolham com a cumplicidade de quem viveu isso ontem. Você responde com o que faz: salvar a cada despacho, plano B em papel — e a calma de quem sabe que o processo é das pessoas, não da tela. Mariana anota a frase inteira.");
    }, 5000);

    setTimeout(function () {
      TOGA.motor.aplicarEfeitos({ tec: 3, hum: 3, tempo: 35, estresse: -3 });
      TOGA.motor.salvar();
      if (TOGA.ui.atualizarHUD) TOGA.ui.atualizarHUD();
      if (TOGA.conquistas) TOGA.conquistas.avaliar("capacitacao");
      toastMundo("🎓 Aplausos no Salão do Júri — e desta vez ninguém manda fazer silêncio. Carol fotografa o flipchart, Mariana pede a planilha por e-mail, e Antonio Fernandes guarda a folha de atalhos no bolso da camisa, “do lado do coração, doutor”. O Desembargador aplaude de pé.");
    }, 10000);

    setTimeout(function () {
      toastMundo("📜 O ofício de agradecimento do Des. Raimundo Nonato chega ainda no expediente — já emoldurado na parede de honrarias do gabinete. E a notícia correu rápido: a Coordenadora da ESMEC já mandou recado — passe na DIRETORIA, que a Samantha está organizando o ofício.");
      if (TOGA.lembrancas && TOGA.lembrancas.ver) {
        TOGA.lembrancas.ver({ arte: "agradecimentoTJCE", titulo: "Agradecimento — Des. Raimundo Nonato Silva Santos (TJCE)" });
      }
      if (TOGA.lembrancas3d && TOGA.motor.estado) TOGA.lembrancas3d.sincronizar(TOGA.motor.estado.flags);
      if (TOGA.ui.atualizarPausas) TOGA.ui.atualizarPausas();
      atualizarObjetivoAutomatico();
    }, 15000);
  }

  /* A espera REAGE: quando o juiz passa, quem espera levanta o
     olhar — e, uma vez por espera, a tensão vira uma linha viva. */
  const FRASE_ESPERA3D = {
    medo: "não tira os olhos da porta da sala quando você passa",
    choro: "enxuga os olhos quando percebe a sua toga",
    triste: "levanta o olhar devagar quando você se aproxima",
    vergonha: "desvia o olhar quando você passa",
    raiva: "respira fundo e se ajeita no banco quando você se aproxima",
    neutro: "acompanha você com o olhar, em silêncio"
  };
  let esfriarEspera = 0;   // não deixar dois toasts atropelarem

  function tickEspera() {
    if (!jogador || emAudiencia || !npcsCorredor.length) return;
    if (esfriarEspera > 0) esfriarEspera -= 1 / 60;
    const pj = jogador.grupo.position;
    npcsCorredor.forEach(function (n) {
      const g = n.boneco.grupo.position;
      const dx = g.x - pj.x, dz = g.z - pj.z;
      const perto = (dx * dx + dz * dz) < 7;            // ~2,6 m
      if (perto && !n.olhando) {
        n.boneco.olharPara(new THREE.Vector3(pj.x, 1.5, pj.z));
        if (!n.reagiu && n.ehParte && !n.personagem.preso && esfriarEspera <= 0) {
          n.reagiu = true;
          esfriarEspera = 4;
          toastMundo("🚪 " + n.personagem.nome + " " +
            (FRASE_ESPERA3D[n.emocao] || FRASE_ESPERA3D.neutro) + ".");
        }
      } else if (!perto && n.olhando) {
        n.boneco.olharPara(null);
      }
      n.olhando = perto;
    });
  }

  /* NPCs do corredor: o elenco do PRÓXIMO caso espera a audiência.
     Se o caso declara `arco.antes`, as PARTES esperam do jeito que
     chegaram: angustiadas, com medo, cabisbaixas — dá para VER
     que aquela espera pesa.                                     */
  function atualizarCorredor() {
    npcsCorredor.forEach(function (n) { TOGA.nucleo3d.scene.remove(n.boneco.grupo); });
    npcsCorredor = [];
    const e = TOGA.motor.estado;
    if (!e || TOGA.motor.fimDaPauta() || emAudiencia) return;
    const caso = TOGA.motor.casosDaPauta()[e.casoAtual];
    const bancos = mundoInfo.pontos.bancosCorredor;
    const operador = /advogad|promotor|defensor|procurador|perito|conselheir/i;

    // quem está PRESO não espera no banco do corredor: espera na CELA,
    // algemado, de onde a escolta o trará quando a audiência abrir
    caso.personagens.filter(function (p) { return p.preso; }).forEach(function (p) {
      const b = TOGA.boneco3d.criar(p, { sentado: true });
      b.grupo.position.set(16.2, 0, -4.6);   // sentado no catre da cela
      b.grupo.rotation.y = -Math.PI / 2;     // de frente para a grade
      b.executarAcao("algemado");
      b.segurar("algemas", "dir");
      b.setEmocao((caso.arco && caso.arco.antes && caso.arco.antes.emocao) || "triste");
      TOGA.nucleo3d.scene.add(b.grupo);
      npcsCorredor.push({ boneco: b, personagem: p, pos: mundoInfo.pontos.cela });

      TOGA.interacao3d.adicionar({
        id: "npc-" + p.id, pos: mundoInfo.pontos.cela, raio: 1.9,
        rotulo: "ver " + p.nome + " na custódia",
        visivel: function () {
          return npcsCorredor.some(function (n) { return n.personagem.id === p.id; });
        },
        acao: function () {
          toastMundo("🔒 " + p.nome + " aguarda a audiência de custódia, algemado. A lei dá a ele uma audiência em 24 horas — e ela está na sua pauta.");
        }
      });
    });

    caso.personagens.filter(function (p) { return !p.preso; })
      .slice(0, bancos.length).forEach(function (p, i) {
      const b = TOGA.boneco3d.criar(p, { sentado: true });
      b.grupo.position.set(bancos[i].x, 0, bancos[i].z - 0.15);
      b.grupo.rotation.y = Math.PI; // de costas para a parede, olhando o corredor
      // o estado de espírito de quem espera (partes, não os operadores)
      let emocaoEspera = "neutro";
      if (caso.arco && caso.arco.antes && !operador.test(p.papel || "")) {
        emocaoEspera = caso.arco.antes.emocao || "triste";
        b.setEmocao(emocaoEspera);
        if (caso.arco.antes.gesto) b.executarAcao(caso.arco.antes.gesto);
      }
      TOGA.nucleo3d.scene.add(b.grupo);
      npcsCorredor.push({ boneco: b, personagem: p, pos: bancos[i],
                          emocao: emocaoEspera, ehParte: !operador.test(p.papel || "") });

      TOGA.interacao3d.adicionar({
        id: "npc-" + p.id, pos: bancos[i], raio: 1.5,
        rotulo: "falar com " + p.nome,
        visivel: function () {
          return npcsCorredor.some(function (n) { return n.personagem.id === p.id; });
        },
        acao: function () {
          toastMundo("🗣 " + p.nome + (p.papel ? " (" + p.papel + ")" : "") +
            " — “Bom dia, Excelência. Estamos aguardando a pauta das " + caso.hora + ".”");
        }
      });
    });
  }

  /* =====================================================
     A MESMA API DA CENA 2D (consumida pelo ui.js)
     ===================================================== */

  /* PALCOS: a 1ª vara é o palco padrão; casos com sala:"juri"
     são montados no plenário do Salão do Júri — outra bancada,
     outra câmera, jurados no Conselho e imprensa na plateia.  */
  function casoNoJuri() {
    const c = TOGA.motor && TOGA.motor.casoDaVez && TOGA.motor.casoDaVez();
    return !!(c && c.sala === "juri");
  }

  function palcoDoCaso() {
    const P = mundoInfo.pontos;
    if (casoNoJuri()) {
      return {
        id: "juri",
        assentos: TOGA.mundo3d.ASSENTOS3D_JURI,
        bancada: P.bancadaJuri,
        cameraBancada: P.cameraBancadaJuri,
        filaBase: { x: 23.65, z: 1.7 },
        caminhoEntrada: [{ x: 24, z: 3.4 }, { x: 23.8, z: 6.9 }],
        publico: LUGARES_PUBLICO_JURI,
        publicoRot: Math.PI / 2,
        figuracao: "juri"
      };
    }
    return {
      id: "sala1",
      assentos: TOGA.mundo3d.ASSENTOS3D,
      bancada: P.bancada,
      cameraBancada: P.cameraBancada,
      filaBase: { x: 0.65, z: 2.3 },
      caminhoEntrada: [{ x: 1.0, z: 2.9 }],
      publico: LUGARES_PUBLICO,
      publicoRot: 0,
      figuracao: null
    };
  }

  let palcoCorrente = null;

  function montar(_container, personagens) {
    garantirIniciado();
    emAudiencia = true;

    // limpa elenco anterior, público e o corredor (as partes "entraram")
    Object.keys(npcs).forEach(function (id) {
      if (TOGA.rotinas3d) TOGA.rotinas3d.cancelar(npcs[id]);
      TOGA.nucleo3d.scene.remove(npcs[id].grupo);
    });
    npcs = {};
    falanteId = null;
    npcsCorredor.forEach(function (n) { TOGA.nucleo3d.scene.remove(n.boneco.grupo); });
    npcsCorredor = [];
    removerPublico();

    palcoCorrente = palcoDoCaso();
    const palco = palcoCorrente;

    // elenco do caso: entra andando pela porta e senta no
    // assento 3D equivalente ao 2D (com o bot, senta direto)
    (personagens || []).forEach(function (p, i) {
      const a = palco.assentos[p.assento] || palco.assentos.centro;
      const rotFinal = Math.atan2(
        palco.bancada.x - a.x, palco.bancada.z - a.z);
      // réu preso: entra ESCOLTADO vindo da cela (audiência de custódia)
      if (p.preso && TOGA.prisao3d) {
        const b = TOGA.boneco3d.criar(p, { sentado: false });
        TOGA.nucleo3d.scene.add(b.grupo);
        npcs[p.id] = b;
        TOGA.prisao3d.trazerPreso(b, a, rotFinal);
        return;
      }
      if (animacoesRapidas) {
        const b = TOGA.boneco3d.criar(p, { sentado: true });
        b.grupo.position.set(a.x, 0, a.z);
        b.grupo.rotation.y = rotFinal;
        TOGA.nucleo3d.scene.add(b.grupo);
        npcs[p.id] = b;
        return;
      }
      const b = TOGA.boneco3d.criar(p, { sentado: false });
      // fila de entrada: duas colunas atrás do vão da porta (z=2)
      b.grupo.position.set(palco.filaBase.x + (i % 2) * 0.8, 0,
                           palco.filaBase.z - Math.floor(i / 2) * 0.6);
      // operadores do direito entram com a pasta de trabalho
      const comPasta = /advogad|promotor|defensor|procurador/i.test(p.papel || "");
      if (comPasta) b.segurar("pastas", "esq");
      TOGA.nucleo3d.scene.add(b.grupo);
      npcs[p.id] = b;
      TOGA.rotinas3d.irPara(b, palco.caminhoEntrada.concat([{ x: a.x, z: a.z }]), {
        aoChegar: function () {
          b.grupo.position.set(a.x, 0, a.z);
          b.sentar(true);
          b.grupo.rotation.y = rotFinal;
          if (comPasta) b.segurar(null, "esq");  // a pasta vai "para a mesa"
        }
      });
    });

    montarPublico(palco);

    // o juiz senta à bancada; a câmera assume o ponto de vista do ato
    TOGA.controles3d.desativar();
    const pb = palco.bancada;
    jogador.grupo.position.set(pb.x, 0.5, pb.z + 0.5); // sobre o estrado
    jogador.grupo.rotation.y = Math.PI;                // de frente para a sala
    const cam = palco.cameraBancada;
    TOGA.nucleo3d.camera.position.set(cam.pos.x, cam.pos.y, cam.pos.z);
    TOGA.nucleo3d.camera.lookAt(cam.alvo.x, cam.alvo.y, cam.alvo.z);
    if (TOGA.diretor3d) TOGA.diretor3d.ativar(cam, animacoesRapidas);
    definirObjetivo(null);
  }

  /* ---------- Público figurante ---------- */
  function montarPublico(palco) {
    palco = palco || palcoDoCaso();
    const lugares = palco.publico.slice().sort(function () { return Math.random() - 0.5; });
    const quantos = palco.figuracao === "juri"
      ? lugares.length                                   // plenário lotado
      : 4 + Math.floor(Math.random() * 3);               // 4 a 6 presentes
    for (let i = 0; i < quantos && i < lugares.length; i++) {
      const avatar = {
        pele: PELES[Math.floor(Math.random() * PELES.length)],
        cabelo: CABELOS[Math.floor(Math.random() * CABELOS.length)],
        corCabelo: ["#241a10", "#3a2a1a", "#574737", "#777268"][Math.floor(Math.random() * 4)],
        traje: Math.random() < 0.5 ? "camisa" : "blazer",
        corTraje: CORES_SOBRIAS[Math.floor(Math.random() * CORES_SOBRIAS.length)],
        oculos: Math.random() < 0.25
      };
      const b = TOGA.boneco3d.criar({ id: "publico" + i, avatar: avatar }, { sentado: true });
      b.grupo.position.set(lugares[i].x, 0, lugares[i].z);
      b.grupo.rotation.y = palco.publicoRot || 0; // de frente para o centro do ato
      TOGA.nucleo3d.scene.add(b.grupo);
      publico.push({ boneco: b });
    }

    if (palco.figuracao === "juri") {
      // o CONSELHO DE SENTENÇA: 7 jurados sentados na lateral leste
      for (let j = 0; j < 7; j++) {
        const av = {
          pele: PELES[Math.floor(Math.random() * PELES.length)],
          cabelo: CABELOS[Math.floor(Math.random() * CABELOS.length)],
          corCabelo: ["#241a10", "#3a2a1a", "#574737", "#777268"][Math.floor(Math.random() * 4)],
          traje: Math.random() < 0.5 ? "camisa" : "blazer",
          corTraje: CORES_SOBRIAS[Math.floor(Math.random() * CORES_SOBRIAS.length)],
          oculos: Math.random() < 0.25
        };
        const jur = TOGA.boneco3d.criar({ id: "jurado" + j, avatar: av }, { sentado: true });
        jur.grupo.position.set(29.1, 0, 4.4 + j * 1.05);
        jur.grupo.rotation.y = -Math.PI / 2;       // de frente para o plenário
        TOGA.nucleo3d.scene.add(jur.grupo);
        publico.push({ boneco: jur });
      }
      // a imprensa acompanha da plateia, de bloco em punho
      for (let r = 0; r < 2; r++) {
        const rep = TOGA.boneco3d.criar(
          { id: "imprensaPlateia" + r,
            avatar: { pele: PELES[(r * 2) % PELES.length], cabelo: r ? "longo" : "curto",
                      corCabelo: "#241a10", traje: "blazer",
                      corTraje: CORES_SOBRIAS[(r * 5) % CORES_SOBRIAS.length] } },
          { sentado: true });
        rep.grupo.position.set(21.9, 0, 3.0 + r * 4.0);
        rep.grupo.rotation.y = Math.PI / 2;
        rep.segurar("pastas", "esq");
        TOGA.nucleo3d.scene.add(rep.grupo);
        publico.push({ boneco: rep });
      }
    }
  }

  function removerPublico() {
    publico.forEach(function (p) { TOGA.nucleo3d.scene.remove(p.boneco.grupo); });
    publico = [];
  }

  /* O público reage ao carimbo: cochicha com o vizinho.
     Decisão sem tom (ruim/grave) = surpresa geral.        */
  function reagirPublico(tom) {
    const emocao = tom === "dourado" ? "feliz" : tom === "positivo" ? "neutro" : "surpresa";
    publico.forEach(function (p, i) {
      const vizinho = publico[(i + 1) % publico.length];
      p.boneco.setEmocao(emocao);
      if (vizinho && vizinho !== p) p.boneco.olharPara(vizinho.boneco.cabecaMundo);
      setTimeout(function () {
        p.boneco.setEmocao("neutro");
        p.boneco.olharPara(null);
      }, 1800 + i * 180);
    });
  }

  // cada emoção forte ganha um GESTO de corpo (veemência, indignação,
  // súplica, desespero) — a fala não fica só no rosto
  const GESTO_EMO = {
    raiva: "indignado", firme: "enfase", surpresa: "indignado",
    medo: "apelo", triste: "apelo", choro: "desespero"
  };
  function setEmocao(idPers, emocao) {
    const b = npcs[idPers];
    if (!b) return;
    b.setEmocao(emocao);
    const g = GESTO_EMO[emocao];
    if (g && b.executarAcao && b.acao == null) b.executarAcao(g);
  }

  let falanteId = null;          // quem fala agora (luz/olhares o acompanham)

  function falar(idPers) {
    Object.keys(npcs).forEach(function (id) { npcs[id].falando(false); });
    if (idPers && npcs[idPers]) {
      const b = npcs[idPers];
      b.falando(true);
      falanteId = idPers;
      const pos = b.cabecaMundo;
      luzFalaAlvo = 1.4;
      luzFalaPos.set(pos.x, pos.y + 1.6, pos.z + 0.4);
      luzFalaMira.copy(pos);
      // os demais olham para quem fala; a câmera aproxima
      Object.keys(npcs).forEach(function (id) {
        if (id !== idPers) npcs[id].olharPara(pos);
      });
      if (TOGA.diretor3d) TOGA.diretor3d.focar(function () { return b.cabecaMundo; });
    } else {
      falanteId = null;
      luzFalaAlvo = 0;
      Object.keys(npcs).forEach(function (id) { npcs[id].olharPara(null); });
      if (TOGA.diretor3d) TOGA.diretor3d.geral();
    }
  }

  /* Cores do dia: manhã clara → fim de tarde dourado. O sol
     também "anda" — as sombras se alongam com o expediente.
     (Os patamares de ambiente são baixos de propósito: a luz
     hemisférica fria do nucleo3d completa o preenchimento.) */
  const LUZ_MANHA = { sol: new THREE.Color(0xfff2d0), amb: new THREE.Color(0xffe2b8), solI: 0.9,  ambI: 0.32, solX: 6 };
  const LUZ_TARDE = { sol: new THREE.Color(0xffc070), amb: new THREE.Color(0xf0c89a), solI: 0.65, ambI: 0.26, solX: -8 };
  // o Plantão Noturno: lua fria lá fora, lâmpadas quentes aqui dentro
  const LUZ_NOITE = { sol: new THREE.Color(0x7a8cc8), amb: new THREE.Color(0x9aa3c8), solI: 0.22, ambI: 0.22, solX: -4 };

  let luzesInternas = null;   // os pontos quentes do fórum à noite
  function acenderLuzesInternas(sim) {
    if (sim && !luzesInternas) {
      luzesInternas = [
        // a do gabinete é mais fraca de propósito: o azul do luar
        // precisa invadir — o plantão tem que SENTIR noite
        { x: -10, y: 2.7, z: -5.5, i: 0.42 },   // gabinete
        { x: 0,   y: 2.7, z: 0,    i: 0.6 },    // corredor
        { x: 1.5, y: 2.9, z: 9.5,  i: 0.6 }     // sala de audiências
      ].map(function (p) {
        const l = new THREE.PointLight(0xffcf8a, p.i, 11, 1.6);
        l.position.set(p.x, p.y, p.z);
        TOGA.nucleo3d.scene.add(l);
        return l;
      });
    }
    if (luzesInternas) luzesInternas.forEach(function (l) { l.visible = !!sim; });
  }

  function ajustarRelogio(minutosDoDia) {
    garantirIniciado();
    [mundoInfo.pontos.relogioParede, mundoInfo.pontos.relogioParede2].forEach(function (r) {
      if (!r) return;
      const h = Math.floor(minutosDoDia / 60) % 12;
      const m = minutosDoDia % 60;
      r.ponteiroH.rotation.z = -((h * 30 + m * 0.5) * Math.PI / 180);
      r.ponteiroM.rotation.z = -((m * 6) * Math.PI / 180);
    });
    const sol = TOGA.nucleo3d.sol, amb = TOGA.nucleo3d.ambiente;
    if (!sol || !amb) return;

    // Plantão Noturno: noite de verdade — lua, neblina azulada e
    // as lâmpadas internas do fórum acesas
    const noturno = TOGA.motor && TOGA.motor.estado && TOGA.motor.estado.pauta === "dia3";
    if (TOGA.nucleo3d.setNoite) TOGA.nucleo3d.setNoite(noturno);
    acenderLuzesInternas(noturno);
    if (noturno) {
      sol.color.copy(LUZ_NOITE.sol);
      sol.intensity = LUZ_NOITE.solI;
      sol.position.x = LUZ_NOITE.solX;
      amb.color.copy(LUZ_NOITE.amb);
      amb.intensity = LUZ_NOITE.ambI;
      return;
    }

    // luz do dia: interpola entre 9h (540 min) e 18h (1080 min)
    const t = Math.max(0, Math.min(1, (minutosDoDia - 540) / 540));
    sol.color.copy(LUZ_MANHA.sol).lerp(LUZ_TARDE.sol, t);
    sol.intensity = LUZ_MANHA.solI + (LUZ_TARDE.solI - LUZ_MANHA.solI) * t;
    sol.position.x = LUZ_MANHA.solX + (LUZ_TARDE.solX - LUZ_MANHA.solX) * t;
    amb.color.copy(LUZ_MANHA.amb).lerp(LUZ_TARDE.amb, t);
    amb.intensity = LUZ_MANHA.ambI + (LUZ_TARDE.ambI - LUZ_MANHA.ambI) * t;
  }

  function martelo() {
    animMartelo = 0.5;
    TOGA.cena2d.somMartelo();
  }

  /* O carimbo: mesmo DOM/CSS do 2D, ancorado num overlay fixo */
  function overlay() {
    let el = document.getElementById("overlay-cena-3d");
    if (!el) {
      el = document.createElement("div");
      el.id = "overlay-cena-3d";
      document.body.appendChild(el);
    }
    return el;
  }

  function carimbar(texto, tom) {
    const el = document.createElement("div");
    el.className = "carimbo bater";
    el.textContent = texto;
    if (tom === "positivo") { el.style.color = "var(--verde-claro)"; el.style.borderColor = "var(--verde-claro)"; }
    if (tom === "dourado") { el.style.color = "var(--latao-claro)"; el.style.borderColor = "var(--latao)"; }
    const ov = overlay();
    ov.appendChild(el);
    ov.classList.remove("soco"); void ov.offsetWidth; ov.classList.add("soco");
    martelo();
    reagirPublico(tom);
    setTimeout(function () {
      el.classList.add("sumir");
      setTimeout(function () { el.remove(); }, 600);
    }, 1400);
  }

  /* Eventos de cena disparados pelos CASOS (campo opcional
     `evento` nas opções/fins): "prisao:<id>" e "soltura:<id>". */
  function evento(spec, casoId) {
    if (!spec || !TOGA.prisao3d) return;
    const partes = String(spec).split(":");
    const tipo = partes[0], id = partes[1];
    const chave = (casoId || "") + ":" + id;
    if (tipo === "prisao" && npcs[id]) {
      const b = npcs[id];
      delete npcs[id];                 // a partir daqui o boneco é da escolta
      if (falanteId === id) falanteId = null;
      TOGA.prisao3d.prender(chave, b);
    } else if (tipo === "soltura") {
      if (npcs[id]) {
        TOGA.prisao3d.soltar(chave, npcs[id]);
        return;
      }
      // reconsideração: a pessoa estava em escolta/cela — volta ao assento
      const b = TOGA.prisao3d.resgatar(chave);
      if (!b) return;
      npcs[id] = b;
      b.setEmocao("choro");            // o alívio chega tremendo
      const caso = (TOGA.casos || []).find(function (c) { return c.id === casoId; });
      const p = caso && caso.personagens.find(function (x) { return x.id === id; });
      const palco = palcoCorrente || palcoDoCaso();
      const a = palco.assentos[(p && p.assento) || "centro"];
      const rotFinal = Math.atan2(
        palco.bancada.x - a.x, palco.bancada.z - a.z);
      if (animacoesRapidas) {
        b.grupo.position.set(a.x, 0, a.z);
        b.sentar(true);
        b.grupo.rotation.y = rotFinal;
        return;
      }
      b.sentar(false);
      const volta = (palco.id === "juri")
        ? palco.caminhoEntrada.concat([{ x: a.x, z: a.z }])
        : [{ x: 1, z: -0.2 }, { x: 1, z: 3.2 }, { x: a.x, z: a.z }];
      TOGA.rotinas3d.irPara(b, volta, {
        vel: 1.9,
        aoChegar: function () {
          b.grupo.position.set(a.x, 0, a.z);
          b.sentar(true);
          b.grupo.rotation.y = rotFinal;
        }
      });
    }
  }

  /* Fim do ato: o elenco se levanta, o juiz volta a andar */
  function encerrarAudiencia() {
    emAudiencia = false;
    Object.keys(npcs).forEach(function (id) {
      if (TOGA.rotinas3d) TOGA.rotinas3d.cancelar(npcs[id]);
      TOGA.nucleo3d.scene.remove(npcs[id].grupo);
    });
    npcs = {};
    falanteId = null;
    removerPublico();
    if (TOGA.prisao3d) TOGA.prisao3d.limparEscolta();
    luzFala.intensity = 0;
    luzFalaAlvo = 0;
    if (TOGA.diretor3d) TOGA.diretor3d.desativar();
    jogador.grupo.position.y = 0;
    const pb = (palcoCorrente || palcoDoCaso()).bancada;
    TOGA.controles3d.teleportar(pb.x, pb.z - 2.2, Math.PI); // desce do estrado, de frente p/ a porta
    palcoCorrente = null;
  }

  function aoPerderContexto() {
    // WebGL caiu: o jogo continua em 2D, com o mesmo save.
    if (TOGA.diretor3d) TOGA.diretor3d.desativar();
    document.body.classList.remove("modo-3d");
    TOGA.cena = TOGA.cena2d;
    TOGA.config.modo3d = false;
    if (TOGA.motor.estado) { TOGA.ui.renderPauta(); TOGA.ui.mostrarTela("tela-pauta"); }
    alert("O modo 3D foi interrompido pelo navegador. Continuando no modo clássico — seu progresso está intacto.");
  }

  /* =====================================================
     A COMARCA ALÉM DO FÓRUM — locais externos
     -----------------------------------------------------
     A rua (delegacia + escola), a viagem de carro e a ESMEC
     vivem no MESMO scene, deslocadas no eixo x; "viajar" é
     trocar colisores, spawn e interagíveis.
     ===================================================== */
  let localAtivo = "forum";
  let infoRua = null, infoEsmec = null, infoParque = null, infoAcm = null;

  function esconderJogador(sim) {
    if (jogador) jogador.grupo.visible = !sim;
  }

  function iniciarVisita3d(id) {
    if (!TOGA.atividades || TOGA.atividades.emVisita) return;
    TOGA.controles3d.desativar();
    TOGA.atividades.executarVisita(id, function (r) {
      reativarControles();
      toastMundo(r.exemplar
        ? "🌟 Visita concluída com nota máxima — a comarca comenta, e comenta bem."
        : "✔ Visita concluída. Alguns tropeços ficam de lição — instituições também aprendem.");
    });
  }
  function reativarControles() {
    // os controles religam apontando para o local atual (sem
    // re-iniciar: iniciar duplicaria listeners e ticks)
    const info = localAtivo === "rua" ? infoRua
               : localAtivo === "esmec" ? infoEsmec
               : localAtivo === "parque" ? infoParque
               : localAtivo === "acm" ? infoAcm
               : mundoInfo;
    TOGA.controles3d.setMundo(info);
    TOGA.controles3d.ativar();
  }

  function rotuloBloqueado(a) {
    const n = TOGA.conquistas ? TOGA.conquistas.quantasGanhas() : 0;
    return "🔒 " + a.nome + " — " + n + "/" + a.limiar + " conquistas";
  }

  function interagiveisRua() {
    const P = TOGA.cidade3d.pontos;
    const A = TOGA.atividades;
    function ativ(id) { return A.LISTA.find(function (x) { return x.id === id; }); }
    return [
      { id: "voltarForum", pos: P.portaForum, raio: 2.0,
        rotulo: "entrar no fórum",
        acao: function () { voltarForum(); } },

      { id: "parque", pos: P.parqueEntrada || { x: P.portaForum.x - 16, z: 8 }, raio: 2.4,
        rotulo: "🌳 ir ao Parque da Cidade (acesso livre)",
        visivel: function () { return !!TOGA.parque3d; },
        acao: function () { entrarParque("rua"); } },

      { id: "delegacia", pos: P.delegaciaPorta, raio: 2.2,
        rotulo: function () {
          if (!A.destravada("delegacia")) return rotuloBloqueado(ativ("delegacia"));
          return A.concluida("delegacia")
            ? "rever a Delegacia (visita já concluída)"
            : "🚔 visitar a Delegacia de Polícia Civil";
        },
        acao: function () {
          if (!A.destravada("delegacia")) {
            toastMundo("🔒 A visita à Delegacia destrava com 8 conquistas. A Dra. Socorro avisou na recepção: “quando o doutor fizer por merecer a fama, as portas abrem sozinhas.”");
            return;
          }
          TOGA.controles3d.teleportar(P.delegada.x, P.delegada.z + 1.6, Math.PI);
          iniciarVisita3d("delegacia");
        } },

      { id: "escola", pos: P.escolaPorta, raio: 2.2,
        rotulo: function () {
          if (!A.destravada("escola")) return rotuloBloqueado(ativ("escola"));
          return A.concluida("escola")
            ? "rever a Escola (visita já concluída)"
            : "🏫 visitar a Escola Municipal";
        },
        acao: function () {
          if (!A.destravada("escola")) {
            toastMundo("🔒 A visita à Escola destrava com 15 conquistas. No muro, um cartaz de lápis de cor: “VIZITA DO JUIS — EM BREVE?”. A turma do 4º ano está esperando.");
            return;
          }
          TOGA.controles3d.teleportar(P.professora.x, P.professora.z - 1.8, 0);
          iniciarVisita3d("escola");
        } },

      { id: "carroJuiz", pos: P.carroJuiz, raio: 2.2,
        rotulo: function () {
          if (!A.destravada("esmec")) return rotuloBloqueado(ativ("esmec"));
          return A.concluida("esmec")
            ? "🚗 dirigir até a ESMEC (rever a aula)"
            : "🚗 dirigir até a ESMEC — a aula da Escola da Magistratura";
        },
        acao: function () {
          if (!A.destravada("esmec")) {
            toastMundo("🔒 O convite da ESMEC vale para quem soma 24 conquistas. O carro espera — e a estrada também.");
            return;
          }
          iniciarViagemEsmec();
        } },

      { id: "missaoFlagrante", pos: P.salaProvas, raio: 2.2,
        rotulo: function () {
          return TOGA.atividades.missaoFeita("flagrante")
            ? "🚔 rever o plantão do flagrante"
            : "🚔 analisar o flagrante com a delegada (missão)";
        },
        visivel: function () { return TOGA.atividades.destravada("delegacia"); },
        acao: function () {
          if (!TOGA.atividades || TOGA.atividades.emVisita) return;
          TOGA.controles3d.desativar();
          TOGA.atividades.executarMissao("flagrante", function (r) {
            reativarControles();
            toastMundo(r.exemplar
              ? "🚔 Três de três! A delegada fixa no mural do plantão: “fórum aprovado no nosso vestibular”. A ponte entre as casas nunca esteve tão firme."
              : "✔ Plantão concluído. Algum ponto escapou — “por isso existe o exercício”, diz a delegada, sem drama. O próximo auto chega mais redondo.");
          });
        } },

      { id: "oitivaDelegacia", pos: P.oitiva, raio: 2.0,
        rotulo: "espiar a sala de oitiva",
        acao: function () {
          toastMundo("🎥 Mesa simples, duas cadeiras iguais e a câmera de luz vermelha no alto: aqui todo depoimento nasce gravado — proteção para quem fala E para quem ouve. A delegada resume: “dignidade não atrapalha investigação; atrapalha abuso.”");
        } },

      { id: "quadroOperacao", pos: P.quadroOperacao, raio: 2.0,
        rotulo: "olhar o quadro da operação",
        acao: function () {
          toastMundo("🗺 “OPERAÇÃO MARESIA — EM APURAÇÃO”: fotos, linhas de barbante e um mapa do litoral. A escrivã cobre discretamente um nome com a mão: “segredo de justiça, doutor — o senhor entende melhor que ninguém.”");
        } },

      { id: "kitLacres", pos: P.kitLacres, raio: 1.8,
        rotulo: "ver o kit de lacres",
        acao: function () {
          toastMundo("🔗 Lacres numerados, etiquetas, formulário de rastreio: o enxoval da cadeia de custódia (CPP, art. 158-A). Cada vestígio que chega ao fórum começou aqui, num adesivo amarelo preenchido a caneta.");
        } },

      { id: "cafeDelegacia", pos: P.cafeDelegacia, raio: 1.8,
        rotulo: "café do plantão policial",
        acao: function () {
          jogador.segurar("xicara", "dir");
          encenarJogador({ acao: "beber", dur: 2.0, aoFim: function () { jogador.segurar(null, "dir"); } });
          if (TOGA.motor && TOGA.motor.estado) { TOGA.motor.alterarEstresse(-2); TOGA.motor.salvar(); }
          if (TOGA.ui && TOGA.ui.atualizarHUD) TOGA.ui.atualizarHUD();
          toastMundo("☕ Café de delegacia: passado às 5h, requentado às 7h, heroico às 15h. Desce como um mandado de segurança: com urgência e contra tudo. (−2 de estresse)");
        } },

      { id: "npcDelegada", pos: P.delegada, raio: 1.8,
        rotulo: "cumprimentar a delegada",
        acao: function () {
          toastMundo("🤝 “Excelência! A casa é sua — quer dizer, é do Estado, mas o senhor entendeu.” A Dra. Socorro Andrade aperta a sua mão com a força de quem assina flagrante há vinte anos.");
        } },

      { id: "npcProfessora", pos: P.professora, raio: 1.8,
        rotulo: "cumprimentar a professora",
        acao: function () {
          toastMundo("🤝 “Tia Chica, para os íntimos e para os pequenos”, sorri a professora Francisca. “O senhor por aqui! As crianças NÃO vão acreditar.”");
        } },

      { id: "missaoCidadania", pos: { x: P.professora.x, z: P.professora.z + 1.6 }, raio: 2.2,
        rotulo: function () {
          return TOGA.atividades.missaoFeita("cidadania")
            ? "🧒 rever o 'pergunta tudo' do 4º ano"
            : "🧒 topar o 'pergunta tudo' do 4º ano (missão)";
        },
        visivel: function () { return TOGA.atividades.destravada("escola"); },
        acao: function () {
          if (!TOGA.atividades || TOGA.atividades.emVisita) return;
          TOGA.controles3d.desativar();
          TOGA.atividades.executarMissao("cidadania", function (r) {
            reativarControles();
            toastMundo(r.exemplar
              ? "🧒 Três respostas na altura dos olhos — a tia Chica vai precisar de um mural maior. No portão, um bilhete de lápis no seu bolso: “volta sim?”."
              : "✔ 'Pergunta tudo' concluído. Alguma resposta saiu de cima para baixo — criança percebe na hora, e perdoa na hora também. A porta da escola segue aberta.");
          });
        } },

      { id: "muralDesenhos", pos: P.muralDesenhos, raio: 2.0,
        rotulo: "ver o mural de desenhos",
        acao: function () {
          const fez = TOGA.atividades.concluida("escola");
          toastMundo(fez
            ? "🖍 No centro do mural, um desenho novo: um boneco de capa preta e martelo gigante, com a legenda “O QEBRA-GALHO DA SIDADE”. A ortografia é discutível; a homenagem, irrecorrível."
            : "🖍 O mural do 4º ano: casas tortas, sóis de óculos, um cachorro caramelo suspeito de se chamar Razumikin. Toda obra-prima começa assim.");
        } },

      { id: "amarelinhaEscola", pos: P.amarelinha, raio: 1.8,
        rotulo: "pular amarelinha",
        acao: function () {
          encenarJogador({ acao: "entregar", dur: 1.6 });
          if (TOGA.motor && TOGA.motor.estado) { TOGA.motor.alterarEstresse(-2); TOGA.motor.salvar(); }
          if (TOGA.ui && TOGA.ui.atualizarHUD) TOGA.ui.atualizarHUD();
          toastMundo("🦘 Um pé, dois pés, um pé — a toga atrapalha no 7, e duas crianças julgam tecnicamente a sua queda: “VALEU! O moço pisou na linha mas é visita.” Decisão colegiada, trânsito em julgado. (−2 de estresse)");
        } },

      { id: "hortaEscola", pos: P.horta, raio: 1.8,
        rotulo: "ver a horta do 4º ano",
        acao: function () {
          toastMundo("🍅 Canteiros com plaquinhas de palito de picolé: ALFACE (da turma A), CEBOLINHA (da turma B) e um pé de tomate sob disputa judicial entre as duas. Você se declara impedido por suspeição de fome.");
        } },

      { id: "bebedouroEscola", pos: P.bebedouroEscola, raio: 1.6,
        rotulo: "beber no bebedouro baixinho",
        acao: function () {
          if (TOGA.motor && TOGA.motor.estado) { TOGA.motor.alterarEstresse(-1); TOGA.motor.salvar(); }
          if (TOGA.ui && TOGA.ui.atualizarHUD) TOGA.ui.atualizarHUD();
          toastMundo("🚰 O bebedouro tem altura de aluno do 4º ano. Você verga em respeitosos noventa graus — e uma criança avalia, solene: “o moço é grande que nem o porteiro”. (−1 de estresse)");
        } },

      { id: "cantinhoLeitura", pos: P.cantinhoLeitura, raio: 2.0,
        rotulo: "espiar o cantinho de leitura",
        acao: function () {
          toastMundo("📖 Tapete terracota, almofadas e uma leitora de sete anos que nem levanta os olhos do livro: “xiu. O lobo tá QUASE sendo absolvido.” Você sai na ponta dos pés — há julgamentos que não se interrompem.");
        } },

      { id: "merendeiraEscola", pos: P.merenda, raio: 2.0,
        rotulo: "cumprimentar a merendeira",
        acao: function () {
          toastMundo("🤝 Tia Zefinha estende o tabuleiro pela janela da cantina: “bolo de macaxeira, doutor — receita com força de lei nesta escola.” Recusar seria atentado contra coisa julgada. Você não atenta.");
        } }
    ];
  }

  let pautaCursosNaMao = false, pautaCursosEntregue = false;

  function tituloJuiz(nome) {
    return nome.match(/^(Ana|Adriana|Alda|Alexsandra|Amaiara|Andréa|Anna|Antonia|Ariana|Bruna|Candice|Carla|Carolina|Cláudia|Cynthia|Daniela|Danielle|Dayana|Débora|Fabiana|Fabrícia|Fátima|Fernanda|Flávia|Francisca|Gabriela|Gerana|Gesília|Giselli|Harbelia|Helga|Iclea|Janaina|Juliana|Julianne|Karla|Kathleen|Larissa|Leila|Leopoldina|Leslie|Lia|Liana|Luciana|Lucimeire|Luzia|Mabel|Márcia)/)
      ? "Juíza " : "Juiz ";
  }

  function interagiveisEsmec() {
    const P = TOGA.esmec3d.pontos;
    const COMENTARIOS_JUIZ = [
      "“na minha vara, troquei ‘cediço’ por ‘sabido’ e o cartório fez festa.”",
      "“mandei refazer uma intimação em linguagem simples e a parte COMPARECEU. Mágica, doutor.”",
      "“o Montezuma tem razão: juridiquês não é tradição, é pedágio.”",
      "“minha primeira sentença simples voltou da leitura com um ‘obrigado, doutora, agora eu entendi’. Não esqueci mais.”",
      "“vim de longe só por esta palestra — e já valeu a estrada.”",
      "“a dona Maria entender a sentença é o verdadeiro trânsito em julgado.”"
    ];
    const lista = [
      { id: "coordenadora", pos: P.recepcao, raio: 2.6,
        rotulo: function () {
          return TOGA.atividades.concluida("esmec") && !TOGA.atividades.emVisita
            ? "conversar com a coordenadora"
            : "🎓 a coordenadora espera — a aula vai começar";
        },
        acao: function () { iniciarVisita3d("esmec"); } },

      { id: "memorialEsmec", pos: P.memorial, raio: 2.0,
        rotulo: "ver o memorial da ESMEC",
        acao: function () {
          toastMundo("🏛 Sob o vidro, a história da Escola: o ato de criação, a toga do patrono — Des. Júlio Carlos de Miranda Bezerra —, fotografias das primeiras turmas. Quarenta anos formando quem julga: a magistratura também aprende, sempre.");
        } },

      { id: "galeriaEsmec", pos: P.galeria, raio: 2.2,
        rotulo: "olhar a galeria dos diretores",
        acao: function () {
          toastMundo("🖼 Os retratos dos diretores, em molduras pretas, um ao lado do outro. Gerações diferentes, o mesmo encargo: ensinar que a toga pesa menos quando se sabe usá-la.");
        } },

      { id: "palestra", pos: P.assentoPalestra, raio: 2.6,
        rotulo: function () {
          return TOGA.atividades.palestraFeita && TOGA.atividades.palestraFeita()
            ? "🪄 rever a palestra Simples e Mágico"
            : "🪄 sentar e assistir — Linguagem Simples, com o Juiz Montezuma Herbster";
        },
        acao: function () {
          if (!TOGA.atividades || TOGA.atividades.emVisita) return;
          TOGA.controles3d.desativar();
          TOGA.atividades.executarPalestra(function (r) {
            reativarControles();
            toastMundo(r.exemplar
              ? "🪄 Três traduções perfeitas! Montezuma anuncia ao microfone: “colegas, achei o próximo multiplicador do programa.” A plateia aplaude — e você sai falando mais simples do que entrou."
              : "✔ Palestra concluída. Algumas traduções escorregaram — “acontece nos melhores gabinetes”, consola Montezuma. O slide final fica na memória: se a parte não entendeu, a Justiça ainda não chegou.");
          });
        } },

      { id: "jardimEsmec", pos: P.jardim, raio: 2.0,
        rotulo: "sentar no banco do jardim de seixos",
        acao: function () {
          encenarJogador({ acao: "sentar", dur: 2.2 });
          if (TOGA.motor && TOGA.motor.estado) { TOGA.motor.alterarEstresse(-2); TOGA.motor.salvar(); }
          if (TOGA.ui && TOGA.ui.atualizarHUD) TOGA.ui.atualizarHUD();
          toastMundo("🪨 O banco de ripas serpenteia o jardim de seixos. Dois minutos olhando pedra e bambu — e a pauta, lá longe, parece um problema de outra pessoa. (−2 de estresse)");
        } },

      { id: "bibliotecaEsmec", pos: P.biblioteca, raio: 2.2,
        rotulo: "consultar a biblioteca",
        acao: function () {
          const CURIOSIDADES = [
            "📚 Num manual de redação oficial da estante: a palavra “outrossim” apareceu 40 mil vezes em decisões num único ano. Em nenhuma delas era indispensável.",
            "📚 Um exemplar histórico: o regimento da primeira turma da ESMEC, de 1985 — quarenta anos formando quem julga.",
            "📚 Aberto sobre a mesa, o Pacto Nacional do Judiciário pela Linguagem Simples: comunicar com clareza não é simplificar o Direito — é respeitar quem depende dele."
          ];
          toastMundo(CURIOSIDADES[Math.floor(Math.random() * CURIOSIDADES.length)]);
        } },

      { id: "labEsmec", pos: P.laboratorio, raio: 2.4,
        rotulo: "espiar o laboratório de tecnologia",
        acao: function () {
          toastMundo("💻 Nas telas, o painel do programa Simples e Mágico: sentenças analisadas, palavras “traduzidas”, um medidor de legibilidade apontando para o verde. Tecnologia a serviço de quem lê — não de quem escreve.");
        } },

      { id: "coffeeEsmec", pos: P.coffee, raio: 2.0,
        rotulo: "café do coffee break",
        acao: function () {
          jogador.segurar("xicara", "dir");
          encenarJogador({ acao: "beber", dur: 2.0, aoFim: function () { jogador.segurar(null, "dir"); } });
          if (TOGA.motor && TOGA.motor.estado) { TOGA.motor.alterarEstresse(-3); TOGA.motor.salvar(); }
          if (TOGA.ui && TOGA.ui.atualizarHUD) TOGA.ui.atualizarHUD();
          toastMundo("☕ Café de escola de magistratura: forte o bastante para uma tese, doce o bastante para um acordo. (−3 de estresse)");
        } },

      { id: "livroVisitasEsmec", pos: P.livroVisitas, raio: 1.8,
        rotulo: "assinar o livro de visitas",
        acao: function () {
          encenarJogador({ acao: "entregar", dur: 1.4 });
          const e = TOGA.motor && TOGA.motor.estado;
          const dia = e ? (TOGA.motor.pautaAtual() || {}).titulo : "";
          toastMundo("🖋 Você assina o livro de visitas com a caneta da recepção — a mesma letra dos despachos, um pouco mais solta. Abaixo do nome, escreve: “honrado por aprender onde tantos ensinaram.”" + (dia ? " A data é a do seu " + dia + "." : ""));
        } },

      { id: "oficinaEsmec", pos: P.oficina, raio: 2.4,
        rotulo: function () {
          return TOGA.atividades.missaoFeita("oficina")
            ? "📝 rever a Oficina de Sentenças"
            : "📝 entrar na Oficina de Sentenças (missão)";
        },
        acao: function () {
          if (!TOGA.atividades || TOGA.atividades.emVisita) return;
          TOGA.controles3d.desativar();
          TOGA.atividades.executarMissao("oficina", function (r) {
            reativarControles();
            toastMundo(r.exemplar
              ? "📝 Três cortes perfeitos! A dupla da oficina fixa a sentença enxuta no mural como exemplo do mês — com as suas iniciais no rodapé."
              : "✔ Oficina concluída. Alguns cortes saíram tortos — “bisturi se afia errando”, consola o colega. A sentença saiu melhor do que entrou, e você também.");
          });
        } },

      { id: "mediacaoEsmec", pos: P.mediacao, raio: 2.4,
        rotulo: function () {
          return TOGA.atividades.missaoFeita("mediacao")
            ? "🤝 rever a simulação de mediação"
            : "🤝 conduzir a simulação de mediação (missão)";
        },
        acao: function () {
          if (!TOGA.atividades || TOGA.atividades.emVisita) return;
          TOGA.controles3d.desativar();
          TOGA.atividades.executarMissao("mediacao", function (r) {
            reativarControles();
            toastMundo(r.exemplar
              ? "🤝 Sessão de manual: escuta, reformulação e o acordo nascendo das partes. A facilitadora anota seu nome para a próxima turma — como instrutor."
              : "✔ Simulação concluída. Algumas intervenções atropelaram o consenso — “mediar é desaprender a sentenciar”, sorri a facilitadora. Na próxima, flui.");
          });
        } },

      { id: "quadroAulaEsmec", pos: P.quadroAula, raio: 2.2,
        rotulo: "espiar a aula de formação inicial",
        acao: function () {
          toastMundo("🧑‍🏫 No quadro branco: “AUDIÊNCIA DE CUSTÓDIA — roteiro dos 10 minutos que definem tudo”. O professor repete aos juízes novos: “decorem a lei em casa; aqui a gente aprende a OLHAR para a pessoa algemada.”");
        } },

      { id: "rejaneEsmec", pos: { x: TOGA.esmec3d.pontos.npcRejane ? P.coordenacao.x - 0.8 : P.coordenacao.x, z: P.coordenacao.z }, raio: 2.2,
        rotulo: function () {
          if (pautaCursosEntregue) return "conversar com Rejane (coordenação)";
          return pautaCursosNaMao
            ? "Rejane — a pauta já está com você: leve ao Juiz Montezuma"
            : "🗂 falar com Rejane, assessora da coordenação (missão rápida)";
        },
        acao: function () {
          if (pautaCursosEntregue) {
            toastMundo("🗂 “A pauta chegou ao palestrante, doutor — a coordenadora agradece. Aqui na Escola, recado entregue é curso que acontece.”");
            return;
          }
          if (pautaCursosNaMao) {
            toastMundo("🗂 “O senhor ainda está com a pauta! O Juiz Montezuma está no púlpito do auditório — é rapidinho.”");
            return;
          }
          pautaCursosNaMao = true;
          if (jogador) jogador.segurar("pastas", "esq");
          toastMundo("🗂 Rejane entrega uma pasta com a programação do semestre: “doutor, faça uma caridade — leve a pauta de cursos ao Juiz Montezuma, no auditório? A coordenadora precisa do OK dele hoje, e eu não posso largar o telefone.”");
        } },

      { id: "palestranteEsmec", pos: P.palestrante, raio: 2.2,
        rotulo: function () {
          return pautaCursosNaMao
            ? "🗂 entregar a pauta de cursos ao Juiz Montezuma"
            : "cumprimentar o Juiz Montezuma Herbster";
        },
        acao: function () {
          if (pautaCursosNaMao) {
            pautaCursosNaMao = false;
            pautaCursosEntregue = true;
            if (jogador) jogador.segurar(null, "esq");
            encenarJogador({ acao: "entregar", dur: 1.2 });
            if (TOGA.motor && TOGA.motor.estado) { TOGA.motor.alterarEstresse(-1); TOGA.motor.salvar(); }
            if (TOGA.ui && TOGA.ui.atualizarHUD) TOGA.ui.atualizarHUD();
            toastMundo("🗂 Montezuma folheia a pauta entre um slide e outro: “aprovadíssima — e diga à Rejane que o curso de linguagem simples vai precisar de turma extra.” Missão da coordenação cumprida.");
            return;
          }
          toastMundo("🤝 “Colega! Fique para o café depois — quero saber como anda a linguagem das SUAS sentenças.” O Juiz Luis Gustavo Montezuma Herbster, 2ª Vara Criminal de Quixadá, aperta sua mão sem soltar as anotações.");
        } },

      { id: "muralCursosEsmec", pos: P.muralCursos, raio: 2.0,
        rotulo: "ler o mural de cursos",
        acao: function () {
          toastMundo("📋 A programação da semana: SEG — Linguagem Simples (Montezuma Herbster) · TER — Oficina de Sentenças · QUA — Mediação e Conciliação · QUI — Protocolo CNJ 492 na prática · SEX — Gestão de gabinete com o Núcleo 4.0. Embaixo, a caneta de alguém: “tem café em todos”.");
        } },

      { id: "credenciamentoEsmec", pos: P.credenciamento, raio: 2.0,
        rotulo: "pegar o crachá do evento",
        acao: function () {
          toastMundo("🪪 A recepcionista encontra seu nome na lista e entrega o crachá: “Juiz(a) da Comarca — CONVIDADO(A)”. O cordão é roxo, a cor do programa. “O auditório já está cheio, doutor — o senhor chegou em boa hora.”");
        } }
    ];

    // os juízes REAIS espalhados pela Escola (salas, jardim, galeria)
    (P.juizesAvulsos || []).forEach(function (j, i) {
      lista.push({
        id: "juizAvulsoInt" + i, pos: { x: j.x, z: j.z }, raio: 1.6,
        rotulo: "cumprimentar — " + j.nome.split(" ")[0],
        acao: function () {
          toastMundo("🤝 " + tituloJuiz(j.nome) + j.nome + ", " + j.lotacao + " — " +
            COMENTARIOS_JUIZ[(i + 2) % COMENTARIOS_JUIZ.length]);
        }
      });
    });

    // os juízes REAIS da plateia, um interagível para cada
    (P.plateia || []).forEach(function (j, i) {
      lista.push({
        id: "juizPlateia" + i, pos: { x: j.x, z: j.z }, raio: 1.5,
        rotulo: "cumprimentar — " + j.nome.split(" ")[0],
        acao: function () {
          toastMundo("🤝 " + tituloJuiz(j.nome) + j.nome + ", " + j.lotacao + " — " +
            COMENTARIOS_JUIZ[i % COMENTARIOS_JUIZ.length]);
        }
      });
    });

    lista.push(
      { id: "carroVolta", pos: P.vaga, raio: 2.6,
        rotulo: "🚗 dirigir de volta ao fórum",
        acao: function () {
          toastMundo("🚗 A volta você dirige mais devagar — sem nenhum motivo de trânsito. Há dias em que a estrada também ensina.");
          voltarForum();
        } });
    return lista;
  }

  function entrarRua() {
    garantirIniciado();
    limparToasts();
    infoRua = TOGA.cidade3d.construir(TOGA.nucleo3d.scene);
    localAtivo = "rua";
    TOGA.controles3d.setMundo(infoRua);
    const sp = infoRua.pontos.spawnRua;
    TOGA.controles3d.teleportar(sp.x, sp.z, sp.angulo || 0);
    TOGA.interacao3d.definir(interagiveisRua());
    alvoObjetivo = null;
    definirObjetivo("A rua do fórum — Delegacia ao norte, Escola ao sul, o carro na vaga");
    toastMundo("🌳 A rua do fórum. O sol bate diferente do lado de fora do expediente — a Delegacia fica na quadra norte, a Escola Municipal na sul. E o seu carro está na vaga de sempre.");
  }

  function entrarEsmecDireto() {
    limparToasts();
    infoEsmec = TOGA.esmec3d.construir(TOGA.nucleo3d.scene);
    localAtivo = "esmec";
    TOGA.controles3d.setMundo(infoEsmec);
    const sp = infoEsmec.pontos.spawnEsmec;
    TOGA.controles3d.teleportar(sp.x, sp.z, sp.angulo || 0);
    TOGA.interacao3d.definir(interagiveisEsmec());
    alvoObjetivo = { x: infoEsmec.pontos.recepcao.x, z: infoEsmec.pontos.recepcao.z };
    definirObjetivo("ESMEC — fale com a coordenadora na recepção do hall");
  }

  function iniciarViagemEsmec() {
    if (!TOGA.carro3d) return;
    limparToasts();
    localAtivo = "estrada";
    TOGA.interacao3d.definir([]);
    definirObjetivo("Ao volante — siga a avenida e estacione na vaga verde da ESMEC");
    alvoObjetivo = null;
    TOGA.carro3d.iniciarViagem({
      aoChegar: function (r) {
        const limpa = r.infracoes.length === 0;
        const M = TOGA.motor;
        if (M && M.estado) {
          if (limpa) M.estado.flags.dirigiuExemplar = true;
          else M.estado.flags.infracaoTransito = true;
          M.salvar();
        }
        if (TOGA.conquistas && limpa) TOGA.conquistas.avaliar("viagem-limpa");
        entrarEsmecDireto();
        toastMundo(limpa
          ? "🅿 Estacionado na vaga, sem uma única infração: cinto, sinal, faixa e radar — a lei valeu o caminho inteiro. A fachada curva de granito espera por você."
          : "🅿 Estacionado. A viagem deixou " + r.infracoes.length + " infração(ões) no caminho — o exemplo também dirige, e hoje ele derrapou. A aula, ainda assim, espera.");
        reativarControles();
      }
    });
  }

  function voltarForum() {
    if (TOGA.carro3d && TOGA.carro3d.ativo) TOGA.carro3d.cancelar();
    limparToasts();
    localAtivo = "forum";
    TOGA.controles3d.setMundo(mundoInfo);
    const pb = mundoInfo.pontos.portaSaida;
    TOGA.controles3d.teleportar(pb.x + 1.2, pb.z, Math.PI / 2);
    TOGA.interacao3d.definir(montarInteragiveis());
    atualizarObjetivoAutomatico();
  }

  /* =====================================================
     PARQUE DA CIDADE + ACM + a BICICLETA
     ===================================================== */
  let protestoMontado = false;
  function montarProtestoParque() {
    if (protestoMontado || !infoParque || !TOGA.boneco3d) return;
    const e = TOGA.motor && TOGA.motor.estado;
    if (!e || !e.flags._protestoEleitoral) return;
    protestoMontado = true;
    const PX = TOGA.parque3d.PX, scene = TOGA.nucleo3d.scene;
    // faixa do protesto
    if (TOGA.texturas3d.placa) {
      [["⚖ JUIZ COMPRADO?", PX - 3], ["A SENTENÇA TEM PREÇO?", PX + 3]].forEach(function (f) {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 0.7),
          new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.placa(f[0]) }));
        m.position.set(f[1], 1.9, 19.5); m.rotation.y = Math.PI;
        scene.add(m);
      });
    }
    const cores = ["#7a2e2e", "#3f4f5a", "#5a4a3a", "#2f4a3e", "#4a3a52"];
    for (let i = 0; i < 6; i++) {
      const b = TOGA.boneco3d.criar({ id: "manifestante" + i, avatar: {
        pele: ["#d8a87f", "#c98e66", "#a86a48", "#8a5436"][i % 4],
        cabelo: ["curto", "coque", "longo", "calvo"][i % 4], corCabelo: "#241a10",
        traje: i % 2 ? "camisa" : "vestido", corTraje: cores[i % 5] } }, {});
      b.grupo.position.set(PX - 5 + i * 2, 0, 21 + (i % 2) * 1.2);
      b.grupo.rotation.y = Math.PI;
      b.setEmocao("raiva");
      scene.add(b.grupo);
      infoParque.vivos.push(b);   // o juiz também não atravessa os manifestantes
    }
    toastMundo("📢 No gramado, o protesto que a manchete convocou: faixas com o seu nome e a palavra “COMPRADO”. São pessoas que leram o título, não os autos. Você garante a segurança do ato — protestar é direito — e segue em frente. A sua sentença responde por você, lá onde ela vai ser julgada: no Tribunal, pelos autos.", { auto: 9 });
  }

  let parqueOrigem = "rua";       // de onde o juiz veio ao parque (p/ saber a volta)
  function entrarParque(origem) {
    garantirIniciado();
    if (!TOGA.parque3d) return;
    if (origem) parqueOrigem = origem;
    limparToasts();
    infoParque = TOGA.parque3d.construir(TOGA.nucleo3d.scene);
    localAtivo = "parque";
    TOGA.controles3d.setMundo(infoParque);
    const sp = infoParque.pontos.spawnParque;
    TOGA.controles3d.teleportar(sp.x, sp.z, sp.angulo || 0);
    TOGA.interacao3d.definir(interagiveisParque());
    TOGA.controles3d.ativar();          // pode vir de um passeio de bike (controles off)
    alvoObjetivo = null;
    definirObjetivo("Parque da Cidade — passeie, sente no banco ou pegue a bicicleta");
    toastMundo("🌳 O Parque da Cidade: o lago, a ilha ao centro e a ciclovia. Acesso livre, ar livre. Pegue a bicicleta para relaxar — ou pedale até a ACM, à beira-mar.");
    if (TOGA.atividades && TOGA.atividades.marcarConcluida) TOGA.atividades.marcarConcluida("parque");
    if (TOGA.conquistas) TOGA.conquistas.avaliar("visita-parque");
    montarProtestoParque();
  }

  function entrarAcm() {
    garantirIniciado();
    if (!TOGA.acm3d) return;
    limparToasts();
    infoAcm = TOGA.acm3d.construir(TOGA.nucleo3d.scene);
    localAtivo = "acm";
    TOGA.controles3d.setMundo(infoAcm);
    const sp = infoAcm.pontos.spawnAcm;
    TOGA.controles3d.teleportar(sp.x, sp.z, sp.angulo || 0);
    TOGA.interacao3d.definir(interagiveisAcm());
    TOGA.controles3d.ativar();          // chega de bike (controles off durante o passeio)
    alvoObjetivo = null;
    definirObjetivo("ACM — Clube dos Magistrados. Auditório a oeste, Diretoria a leste, a praia ao fundo.");
    toastMundo("🏖 A ACM — Associação Cearense de Magistrados, à beira da Praia do Futuro. Auditório, a Diretoria em reunião, piscina, beach tennis, campo society — e o mar logo ali.");
    if (TOGA.atividades && TOGA.atividades.marcarConcluida) TOGA.atividades.marcarConcluida("acm");
    if (TOGA.conquistas) TOGA.conquistas.avaliar("visita-acm");
  }

  /* ---- a bicicleta: passeio leve, sem obstáculos ----
     Tomamos a câmera e o juiz por alguns segundos e desenhamos
     um trajeto suave (uma volta ao redor do lago). Relaxa o
     estresse; quando o destino é a ACM, termina chegando lá. */
  let bikeState = null, bikeMesh = null, bikeTickReg = false;

  function tickBike(dt) {
    if (!bikeState || !jogador) return;
    bikeState.t += dt / bikeState.dur;
    const path = bikeState.path, n = path.length - 1;
    const f = Math.max(0, Math.min(0.9999, bikeState.t)) * n;
    const i = Math.floor(f), frac = f - i;
    const a = path[i], b = path[Math.min(n, i + 1)];
    const x = a.x + (b.x - a.x) * frac, z = a.z + (b.z - a.z) * frac;
    const tx = b.x - a.x, tz = b.z - a.z;
    const ang = Math.atan2(tx, tz);
    jogador.grupo.position.set(x, 0, z);
    jogador.grupo.rotation.y = ang;
    if (bikeMesh && TOGA.bicicleta3d) TOGA.bicicleta3d.girarRodas(bikeMesh, dt, 9);
    const cam = TOGA.nucleo3d.camera;
    if (cam) {
      const dx = Math.sin(ang), dz = Math.cos(ang);
      cam.position.set(x - dx * 5, 3.0, z - dz * 5);
      cam.lookAt(x + dx * 2, 1.1, z + dz * 2);
    }
    if (bikeState.t >= 1) {
      const fim = bikeState.aoChegar; bikeState = null;
      if (bikeMesh && bikeMesh.parent) bikeMesh.parent.remove(bikeMesh);
      if (fim) fim();
    }
  }

  function passeioDeBike(opts) {
    opts = opts || {};
    if (bikeState || !jogador) return;
    if (!bikeTickReg) { TOGA.nucleo3d.aoFrame(tickBike); bikeTickReg = true; }
    TOGA.controles3d.desativar();
    TOGA.interacao3d.definir([]);
    limparToasts();
    if (TOGA.bicicleta3d) {
      if (!bikeMesh) bikeMesh = TOGA.bicicleta3d.criar(0x2f6a8a);
      jogador.grupo.add(bikeMesh);
      bikeMesh.position.set(0, 0, 0);
    }
    jogador.executarAcao(null);
    // trajeto: arco/volta ao redor de um centro
    const c = opts.centro, r = opts.raio || 20, voltas = opts.voltas || 1;
    const passos = 40, path = [];
    for (let k = 0; k <= passos; k++) {
      const ang = Math.PI / 2 + (k / passos) * Math.PI * 2 * voltas;
      path.push({ x: c.x + Math.cos(ang) * r, z: c.z + Math.sin(ang) * r });
    }
    if (opts.objetivo) definirObjetivo(opts.objetivo);
    if (opts.msg) toastMundo(opts.msg, { auto: 4 });
    bikeState = {
      t: 0, dur: opts.dur || 9, path: path,
      aoChegar: function () {
        if (TOGA.motor && TOGA.motor.estado) {
          TOGA.motor.alterarEstresse(opts.alivio || -14);
          TOGA.motor.salvar();
        }
        if (TOGA.ui && TOGA.ui.atualizarHUD) TOGA.ui.atualizarHUD();
        if (opts.aoChegar) opts.aoChegar();
      }
    };
  }

  function interagiveisParque() {
    const P = infoParque.pontos;
    const ACM_LIMIAR = 5;
    function conq() { return TOGA.conquistas ? TOGA.conquistas.quantasGanhas() : 0; }
    return [
      { id: "voltarRua", pos: P.portaRua, raio: 2.4,
        rotulo: function () { return parqueOrigem === "forum" ? "voltar ao fórum" : "voltar à rua do fórum"; },
        acao: function () { if (parqueOrigem === "forum") voltarForum(); else entrarRua(); } },

      { id: "bikePasseio", pos: P.bicicleta, raio: 2.4,
        rotulo: "🚲 andar de bicicleta (relaxar)",
        acao: function () {
          passeioDeBike({
            centro: { x: TOGA.parque3d.PX, z: 4 }, raio: 20, voltas: 1, dur: 9, alivio: -16,
            objetivo: "Pedalando pelo parque — respire fundo",
            msg: "🚲 Uma volta tranquila ao redor do lago. Sem pressa, sem pauta, sem martelo — só o pedal e a brisa.",
            aoChegar: function () {
              localAtivo = "parque";
              TOGA.controles3d.setMundo(infoParque);
              const bp = infoParque.pontos.bicicleta;
              TOGA.controles3d.teleportar(bp.x, bp.z, 0);
              TOGA.interacao3d.definir(interagiveisParque());
              definirObjetivo("Parque da Cidade — passeie, sente no banco ou pedale até a ACM");
              toastMundo("🚲 De volta ao bicicletário, leve como antes de uma boa decisão. (estresse aliviado)");
              reativarControles();
            }
          });
        } },

      { id: "bikeAcm", pos: { x: P.bicicleta.x - 4.5, z: P.bicicleta.z }, raio: 1.9,
        rotulo: function () {
          return conq() >= ACM_LIMIAR
            ? "🚲🏖 pedalar até a ACM (à beira-mar)"
            : "🔒 ACM — pedale até lá com " + ACM_LIMIAR + " conquistas (" + conq() + "/" + ACM_LIMIAR + ")";
        },
        acao: function () {
          if (conq() < ACM_LIMIAR) {
            toastMundo("🔒 A ACM, o Clube dos Magistrados, abre as portas a quem soma " + ACM_LIMIAR + " conquistas. Você tem " + conq() + ". Falta pouco — siga decidindo bem, e a orla espera.");
            return;
          }
          passeioDeBike({
            centro: { x: TOGA.parque3d.PX, z: 4 }, raio: 20, voltas: 0.55, dur: 6.5, alivio: -12,
            objetivo: "Pedalando até a ACM — relaxe e aproveite a orla",
            msg: "🚲 Você pega a ciclovia da orla rumo à ACM. Vento no rosto, mar à direita — o estresse fica para trás.",
            aoChegar: function () { entrarAcm(); }
          });
        } },

      { id: "bancoParque", pos: P.banco, raio: 2.0,
        rotulo: "sentar no banco e olhar o lago",
        acao: function () {
          encenarJogador({ acao: "sentar", dur: 2.4 });
          if (TOGA.motor && TOGA.motor.estado) { TOGA.motor.alterarEstresse(-4); TOGA.motor.salvar(); }
          if (TOGA.ui.atualizarHUD) TOGA.ui.atualizarHUD();
          toastMundo("🪑 Sentado à beira do lago, a ilha iluminada ao centro. Por dois minutos, a pauta é problema de outro juiz. (−4 de estresse)");
        } },

      { id: "dequeParque", pos: P.deque, raio: 2.0,
        rotulo: "caminhar pelo deque até a ilha",
        acao: function () {
          if (TOGA.motor && TOGA.motor.estado) { TOGA.motor.alterarEstresse(-2); TOGA.motor.salvar(); }
          if (TOGA.ui.atualizarHUD) TOGA.ui.atualizarHUD();
          toastMundo("🌉 A passarela de madeira range de leve sobre a água. Da ilha, o parque inteiro parece um intervalo merecido. (−2 de estresse)");
        } }
    ];
  }

  function interagiveisAcm() {
    const P = infoAcm.pontos;
    const AX = TOGA.acm3d.AX;
    const lista = [
      { id: "voltarBikeAcm", pos: P.biciVolta, raio: 2.8,
        rotulo: "🚲 voltar de bicicleta ao Parque",
        acao: function () {
          passeioDeBike({
            centro: { x: AX, z: 26 }, raio: 16, voltas: 0.5, dur: 6, alivio: -8,
            objetivo: "De volta pela orla — sem pressa",
            msg: "🚲 Você pega a bike de volta. A orla é ainda mais bonita na volta, com o sol mais baixo.",
            aoChegar: function () { entrarParque(); }
          });
        } },

      { id: "palestraAcm", pos: P.assentoPalestraAcm, raio: 2.6,
        rotulo: function () {
          return (TOGA.atividades.palestraFeita && TOGA.atividades.palestraFeita())
            ? "🪄 rever a palestra no auditório da ACM"
            : "🪄 assistir à palestra no auditório — Linguagem Simples";
        },
        acao: function () {
          if (!TOGA.atividades || TOGA.atividades.emVisita) return;
          TOGA.controles3d.desativar();
          TOGA.atividades.executarPalestra(function (r) {
            reativarControles();
            toastMundo(r.exemplar
              ? "🪄 Plateia de pé na ACM! O programa Simples e Mágico ganhou mais um multiplicador — e à beira-mar."
              : "✔ Palestra concluída. O recado fica: se a parte não entendeu, a Justiça ainda não chegou.");
          });
        } },

      { id: "diretoriaAcm", pos: P.diretoria, raio: 2.8,
        rotulo: "🏛 ver a reunião da Diretoria da ACM",
        acao: function () {
          toastMundo("🏛 A Diretoria da ACM em reunião: convênios, prerrogativas, esporte e a casa dos magistrados. O presidente José Hercy Ponte de Alencar conduz a pauta e acena, convidando você a puxar uma cadeira.");
        } },

      { id: "piscinaAcm", pos: P.piscina, raio: 2.4,
        rotulo: "ver a piscina adulto e infantil",
        acao: function () {
          if (TOGA.motor && TOGA.motor.estado) { TOGA.motor.alterarEstresse(-3); TOGA.motor.salvar(); }
          if (TOGA.ui.atualizarHUD) TOGA.ui.atualizarHUD();
          toastMundo("🏊 A piscina adulto e, ao lado, a infantil — água azul reluzindo a poucos metros do mar. Você molha os pés e adia a sustentação oral mental. (−3 de estresse)");
        } },

      { id: "beachTennisAcm", pos: P.beachTennis, raio: 2.4,
        rotulo: "ver a quadra de beach tennis",
        acao: function () {
          toastMundo("🎾 A quadra de beach tennis, areia fofa e rede esticada. Alguém grita “é sua!” e ninguém vai buscar. Esporte de magistrado: todo mundo acha que a bola era do outro.");
        } },

      { id: "campoAcm", pos: P.campo, raio: 2.6,
        rotulo: "ver o campo de futebol society",
        acao: function () {
          toastMundo("⚽ O campo society, grama verdinha e traves brancas. Aos sábados, a magistratura troca a toga pela camisa e descobre que celeridade no gramado também é difícil.");
        } },

      { id: "saunaAcm", pos: P.sauna, raio: 2.2,
        rotulo: "espiar a sauna",
        acao: function () {
          if (TOGA.motor && TOGA.motor.estado) { TOGA.motor.alterarEstresse(-3); TOGA.motor.salvar(); }
          if (TOGA.ui.atualizarHUD) TOGA.ui.atualizarHUD();
          toastMundo("🧖 A sauna do clube: madeira quente e silêncio absoluto — o único lugar onde nem o celular do plantão alcança. (−3 de estresse)");
        } },

      { id: "churrasqueiraAcm", pos: P.churrasqueira, raio: 2.4,
        rotulo: "passar nas churrasqueiras",
        acao: function () {
          toastMundo("🍖 Os quiosques de churrasqueira, prontos para a confraternização. No fim de semana, é aqui que acordo de pauta vira acordo de cerveja gelada.");
        } },

      { id: "praiaAcm", pos: P.praia, raio: 2.6,
        rotulo: "caminhar até o mar",
        acao: function () {
          if (TOGA.motor && TOGA.motor.estado) { TOGA.motor.alterarEstresse(-5); TOGA.motor.salvar(); }
          if (TOGA.ui.atualizarHUD) TOGA.ui.atualizarHUD();
          toastMundo("🌊 A Praia do Futuro a poucos passos: vento salgado, barracas ao longe e o horizonte sem prazo nem peça. O mar não recorre. (−5 de estresse)");
        } }
    ];

    // cada diretor(a) da ACM, cumprimentável (homenagem institucional)
    (P.diretores || []).forEach(function (d, i) {
      lista.push({ id: "diretorAcm" + i, pos: { x: d.x, z: d.z }, raio: 1.5,
        rotulo: "cumprimentar — " + d.nome.split(" ")[0] + " (" + d.cargo + ")",
        acao: function () {
          toastMundo("🤝 " + d.nome + " — " + d.cargo + " da ACM. “Bom ter um colega da ativa por aqui, Excelência. A associação é a casa de todos nós — descanso, esporte e prerrogativas.”");
        } });
    });
    return lista;
  }

  /* ---------- API ---------- */
  return {
    // a face "cena" (mesma assinatura do 2D)
    montar: montar, setEmocao: setEmocao, falar: falar,
    ajustarRelogio: ajustarRelogio, martelo: martelo, carimbar: carimbar,
    evento: evento,
    // a face "mundo"
    entrarMundo: entrarMundo,
    encerrarAudiencia: encerrarAudiencia,
    definirObjetivo: definirObjetivo,
    atualizarObjetivoAutomatico: atualizarObjetivoAutomatico,
    atualizarCorredor: atualizarCorredor,
    toastMundo: toastMundo,
    limparToasts: limparToasts,
    avancarToast: avancarToast,
    toastAberto: toastAberto,
    aplicarJuiz: aplicarJuiz,
    emergenciaMedica: emergenciaMedica,
    jogadorSegurar: function (prop, lado) { if (jogador) jogador.segurar(prop, lado); },
    encenarJogador: encenarJogador,
    alivioEmocional: alivioEmocional,
    get posJogador() { return jogador ? jogador.grupo.position : null; },
    aoPerderContexto: aoPerderContexto,
    garantirIniciado: garantirIniciado,
    esconderJogador: esconderJogador,
    entrarRua: entrarRua,
    entrarEsmec: entrarEsmecDireto,
    dirigirEsmec: iniciarViagemEsmec,
    voltarForum: voltarForum,
    get localAtivo() { return localAtivo; },
    alvoDoInterludio: function (p) {
      if (!p) return null;
      if (p.entrega && p.entrega.visita3d) return "visita";
      if (SAMANTHA_ENTREGA[p.id]) return "samantha";
      if (ENTREGAS[p.id]) return "balcao";
      return "assessora";
    },
    set animacoesRapidas(v) { animacoesRapidas = !!v; },
    get animacoesRapidas() { return animacoesRapidas; },
    get emAudiencia() { return emAudiencia; }
  };
})();
