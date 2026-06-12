/* ============================================================
   TOGA 3D — prisao3d.js : PRISÃO, ESCOLTA E CELA
   ------------------------------------------------------------
   A decisão judicial vira CENA:

   - prender(id, boneco): um policial entra na sala, algema a
     pessoa e a escolta pelo corredor até a cela de custódia,
     onde ela fica SENTADA (e algemada) até o fim do dia.
   - trazerPreso(...): o caminho inverso — audiência de
     custódia: o preso SAI da cela escoltado e senta no centro
     da sala, com o policial em pé atrás dele.
   - soltar(id, boneco): o policial retira as algemas; a
     pessoa respira (emoção "feliz") — a liberdade em cena.
   - sincronizarCela(flags): ao voltar ao mundo (ou recarregar
     o save), reconstrói quem deve estar na cela a partir das
     FLAGS do jogo — a cela é consequência, não decoração.

   O caminhar reusa TOGA.rotinas3d.irPara; os bonecos presos
   passam a ser "adotados" por este módulo (tick próprio).
   ============================================================ */

window.TOGA = window.TOGA || {};

TOGA.prisao3d = (function () {
  if (!window.THREE) return {};

  const presos = {};        // chave "caso:pers" -> { boneco }
  const adotados = [];      // bonecos cujo tick é nosso
  let escolta = null;       // policial em pé na audiência de custódia
  let registrado = false;

  /* Temporizadores CANCELÁVEIS: se a cena for desmontada no meio
     de uma cinemática, nenhum passo atrasado dispara no vazio. */
  let timers = [];
  function apos(ms, fn) {
    const id = setTimeout(function () {
      timers = timers.filter(t => t !== id);
      fn();
    }, ms);
    timers.push(id);
  }
  function cancelarSequencias() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  /* Quem DEVE estar na cela, segundo as flags do jogo.
     (As fases de conteúdo adicionam entradas aqui.)       */
  const CELA_FLAGS = [
    { caso: "protetiva", pers: "ivan",
      se: function (f) { return f.presoFundamentado || (f.presoPreventivo && !f["_visto_int_hc_ruim"]); } },
    { caso: "juri", pers: "osmar",
      se: function (f) { return f.testemunhaPresa && !f.reconsiderou && !f["_visto_int_juri_hc"]; } },
    { caso: "instrucao", pers: "valter",
      se: function (f) { return !!f.estupradorPreso; } },
    { caso: "custodia", pers: "jonas",
      se: function (f) { return !!f.jonasPreso; } }
  ];

  function garantirTick() {
    if (registrado) return;
    registrado = true;
    TOGA.nucleo3d.aoFrame(function (dt, t) {
      adotados.forEach(function (b) { b.tick(dt, t); });
    });
  }

  function adotar(boneco) {
    if (adotados.indexOf(boneco) < 0) adotados.push(boneco);
    garantirTick();
  }
  function desadotar(boneco) {
    const i = adotados.indexOf(boneco);
    if (i >= 0) adotados.splice(i, 1);
  }

  function criarPolicial() {
    const pol = TOGA.boneco3d.criar(
      { id: "policial", avatar: { pele: "#c98e66", cabelo: "curto", corCabelo: "#241a10", traje: "camisa", corTraje: "#2b3340" } },
      { quepe: true });
    adotar(pol);
    return pol;
  }
  function removerPolicial(pol) {
    desadotar(pol);
    TOGA.nucleo3d.scene.remove(pol.grupo);
  }

  function rapido() { return TOGA.cena3d && TOGA.cena3d.animacoesRapidas; }

  /* portão da cela (grupo com pivô) */
  function portao(abrir) {
    const g = TOGA.mundo3d.pontos.meshPortaoCela;
    if (g) g.rotation.y = abrir ? -1.4 : 0;
  }

  function vagaNaCela() {
    const n = Object.keys(presos).length;
    return { x: 13.9 + (n % 3) * 0.8, z: -5.45, rot: 0 };
  }

  function sentarNaCela(boneco) {
    const vaga = vagaNaCela();
    boneco.grupo.position.set(vaga.x, 0, vaga.z);
    boneco.grupo.rotation.y = vaga.rot;
    boneco.grupo.userData.andando = false;
    boneco.sentar(true);
    boneco.executarAcao("algemado");
    boneco.setEmocao("triste");
  }

  /* ---------- PRENDER: da sala de audiências à cela ---------- */
  function prender(chave, boneco) {
    if (!boneco || presos[chave]) return;
    presos[chave] = { boneco: boneco };
    adotar(boneco);

    if (rapido()) {                       // bot: resultado direto
      boneco.segurar("algemas", "dir");
      sentarNaCela(boneco);
      return;
    }

    const scene = TOGA.nucleo3d.scene;
    const pos = boneco.grupo.position;
    const pol = criarPolicial();
    pol.grupo.position.set(1, 0, 2.4);
    scene.add(pol.grupo);

    // 1) o policial entra e vai até a pessoa
    TOGA.rotinas3d.irPara(pol, [{ x: 1, z: 3.4 }, { x: pos.x + 0.75, z: pos.z + 0.4 }], {
      vel: 2.1,
      aoChegar: function () {
        boneco.sentar(false);
        boneco.setEmocao("vergonha");
        pol.grupo.rotation.y = Math.atan2(pos.x - pol.grupo.position.x, pos.z - pol.grupo.position.z);
        // 2) algemas (a câmera acompanha)
        apos(650, function () {
          pol.executarAcao("entregar");
          boneco.executarAcao("algemado");
          boneco.segurar("algemas", "dir");
          if (TOGA.audio) TOGA.audio.tocar("algemas");
          if (TOGA.diretor3d) TOGA.diretor3d.focar(function () { return boneco.cabecaMundo; });
          // 3) escolta: sala → corredor → cela
          apos(1400, function () {
            portao(true);
            const caminho = [{ x: 1, z: 2.6 }, { x: 1, z: -0.4 }, { x: 12.6, z: -0.6 },
                             { x: 13.7, z: -1.2 }, { x: 13.7, z: -3.2 }];
            TOGA.rotinas3d.irPara(pol, caminho.slice(0, 4), {
              vel: 1.6,
              aoChegar: function () {
                // o policial espera o preso entrar, fecha o portão e sai
                apos(2600, function () {
                  portao(false);
                  TOGA.rotinas3d.irPara(pol, [{ x: 11, z: -0.2 }, { x: -13, z: 0.2 }], {
                    vel: 2.2,
                    aoChegar: function () { removerPolicial(pol); }
                  });
                });
              }
            });
            TOGA.rotinas3d.irPara(boneco, caminho, {
              vel: 1.6,
              aoChegar: function () { sentarNaCela(boneco); }
            });
            // a câmera volta ao plano geral depois que a escolta sai da sala
            apos(3400, function () { if (TOGA.diretor3d) TOGA.diretor3d.geral(); });
          });
        });
      }
    });
  }

  /* ---------- TRAZER PRESO: da cela ao centro da sala ----------
     Audiência de custódia: o réu entra escoltado e algemado;
     o policial permanece em pé atrás dele.                  */
  function trazerPreso(boneco, assento, rotFinal, aoSentar) {
    const scene = TOGA.nucleo3d.scene;
    const pol = criarPolicial();
    escolta = pol;
    const posPolicial = { x: assento.x + 1.0, z: assento.z - 0.7 };

    boneco.executarAcao("algemado");
    boneco.segurar("algemas", "dir");
    boneco.setEmocao("vergonha");

    if (rapido()) {
      boneco.grupo.position.set(assento.x, 0, assento.z);
      boneco.sentar(true);
      boneco.grupo.rotation.y = rotFinal;
      pol.grupo.position.set(posPolicial.x, 0, posPolicial.z);
      pol.grupo.rotation.y = Math.atan2(assento.x - posPolicial.x, assento.z - posPolicial.z);
      scene.add(pol.grupo);
      if (aoSentar) aoSentar();
      return;
    }

    // saem juntos da cela
    boneco.grupo.position.set(14.3, 0, -4.6);
    pol.grupo.position.set(13.7, 0, -3.4);
    scene.add(pol.grupo);
    portao(true);
    // rota pelo corredor: 1ª vara fica a oeste da cela; o plenário
    // do júri (assentos com x > 20) fica a leste
    const caminho = assento.x > 20
      ? [{ x: 13.7, z: -1.0 }, { x: 14.8, z: -0.4 }, { x: 24, z: 0.6 },
         { x: 24, z: 3.4 }, { x: assento.x, z: assento.z }]
      : [{ x: 13.7, z: -1.0 }, { x: 12.4, z: -0.4 }, { x: 1, z: 0 },
         { x: 1, z: 3.2 }, { x: assento.x, z: assento.z }];
    TOGA.rotinas3d.irPara(pol, caminho.slice(0, 4).concat([posPolicial]), {
      vel: 1.7,
      aoChegar: function () {
        portao(false);
        pol.grupo.rotation.y = Math.atan2(assento.x - posPolicial.x, assento.z - posPolicial.z);
      }
    });
    TOGA.rotinas3d.irPara(boneco, [{ x: 13.7, z: -3.0 }].concat(caminho), {
      vel: 1.7,
      aoChegar: function () {
        boneco.grupo.position.set(assento.x, 0, assento.z);
        boneco.sentar(true);
        boneco.grupo.rotation.y = rotFinal;
        if (aoSentar) aoSentar();
      }
    });
  }

  /* ---------- SOLTAR: as algemas saem em audiência ---------- */
  function soltar(chave, boneco) {
    if (!boneco) return;
    delete presos[chave];
    const pol = escolta;
    function tirarAlgemas() {
      boneco.executarAcao(null);
      boneco.segurar(null, "dir");
      boneco.setEmocao("feliz");
      if (TOGA.audio) TOGA.audio.tocar("algemas");
    }
    if (!pol || rapido()) {
      tirarAlgemas();
      if (pol) { removerPolicial(pol); escolta = null; }
      return;
    }
    // o policial se aproxima, retira as algemas e sai da sala
    const pos = boneco.grupo.position;
    TOGA.rotinas3d.irPara(pol, [{ x: pos.x + 0.7, z: pos.z + 0.3 }], {
      vel: 1.8,
      aoChegar: function () {
        pol.executarAcao("entregar");
        apos(500, tirarAlgemas);
        apos(1400, function () {
          TOGA.rotinas3d.irPara(pol, [{ x: 1, z: 2.6 }, { x: 1, z: 0 }, { x: -13, z: 0.2 }], {
            vel: 2.0,
            aoChegar: function () { removerPolicial(pol); escolta = null; }
          });
        }, 1400);
      }
    });
  }

  /* policial da custódia sai junto com o fim da audiência —
     e nenhum passo de cinemática atrasado dispara depois disso */
  function limparEscolta() {
    cancelarSequencias();
    if (escolta) { TOGA.rotinas3d.cancelar(escolta); removerPolicial(escolta); escolta = null; }
  }

  /* Reconsideração: devolve um preso (mesmo em escolta) à cena.
     O chamador volta a ser o dono do boneco (e do tick).      */
  function resgatar(chave) {
    const reg = presos[chave];
    if (!reg) return null;
    cancelarSequencias();          // a escolta em curso para aqui
    delete presos[chave];
    TOGA.rotinas3d.cancelar(reg.boneco);
    desadotar(reg.boneco);
    reg.boneco.executarAcao(null);
    reg.boneco.segurar(null, "dir");
    reg.boneco.grupo.userData.andando = false;
    return reg.boneco;
  }

  /* ---------- CELA persistente (reconstruída pelas flags) ---------- */
  function buscarPersonagem(casoId, persId) {
    const caso = (TOGA.casos || []).find(function (c) { return c.id === casoId; });
    return caso && (caso.personagens || []).find(function (p) { return p.id === persId; });
  }

  function sincronizarCela(flags) {
    CELA_FLAGS.forEach(function (regra) {
      const chave = regra.caso + ":" + regra.pers;
      const deve = !!regra.se(flags || {});
      if (deve && !presos[chave]) {
        const p = buscarPersonagem(regra.caso, regra.pers);
        if (!p) return;
        const b = TOGA.boneco3d.criar(p, { sentado: true });
        TOGA.nucleo3d.scene.add(b.grupo);
        presos[chave] = { boneco: b };
        adotar(b);
        b.segurar("algemas", "dir");
        sentarNaCela(b);
      } else if (!deve && presos[chave]) {
        desadotar(presos[chave].boneco);
        TOGA.nucleo3d.scene.remove(presos[chave].boneco.grupo);
        delete presos[chave];
      }
    });
  }

  function ocupada() { return Object.keys(presos).length > 0; }

  /* Quem está na cela SEGUNDO AS FLAGS — função pura, usada
     também pelo epílogo do modo 2D (não depende da cena 3D). */
  function presosPorFlags(flags) {
    return CELA_FLAGS
      .filter(function (r) { try { return !!r.se(flags || {}); } catch (e) { return false; } })
      .map(function (r) {
        const p = buscarPersonagem(r.caso, r.pers);
        return p ? p.nome : r.pers;
      });
  }
  function nomesPresos() {
    return Object.keys(presos).map(function (chave) {
      const partes = chave.split(":");
      const p = buscarPersonagem(partes[0], partes[1]);
      return p ? p.nome : partes[1];
    });
  }

  return {
    prender: prender,
    soltar: soltar,
    trazerPreso: trazerPreso,
    resgatar: resgatar,
    limparEscolta: limparEscolta,
    sincronizarCela: sincronizarCela,
    ocupada: ocupada,
    nomesPresos: nomesPresos,
    presosPorFlags: presosPorFlags
  };
})();
