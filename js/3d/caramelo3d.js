/* ============================================================
   TOGA 3D — caramelo3d.js : O CACHORRO DO FÓRUM
   ------------------------------------------------------------
   Todo fórum de comarca tem um: o vira-lata caramelo que entrou
   um dia atrás de sombra e nunca mais foi embora — porque a
   comarca inteira decidiu, em silêncio e por unanimidade, que
   ele fica. Passeia pelo corredor, fareja os cantos, abana o
   rabo para quem chega e aceita carinho de qualquer parte do
   processo, sem distinção (é o único imparcial de verdade).

   Low-poly, sem assets: caixas e cilindros cor de caramelo.
   ============================================================ */

window.TOGA = window.TOGA || {};

TOGA.caramelo3d = (function () {
  if (!window.THREE) return { iniciar: function () {} };

  const CARAMELO = 0xc98a4b;
  const CARAMELO_CLARO = 0xdca362;
  const FOCINHO = 0x4a3018;

  // pontos de passeio: o corredor inteiro, dos dois lados
  const PASSEIO = [
    { x: -12, z: 0.6 }, { x: -7, z: -1 }, { x: -3, z: 1 }, { x: 2, z: -0.8 },
    { x: 7, z: 0.8 }, { x: 10.2, z: -1 }, { x: 14, z: 0.6 }, { x: 19, z: -0.6 },
    { x: 23, z: 0.8 }, { x: 27, z: -0.5 }
  ];

  const FALAS_CARINHO = [
    "🐕 Razumikin deita de barriga para cima na mesma hora. Processualmente, é uma confissão.",
    "🐕 O rabo abana em frequência de urgência deferida. Ele já gostava de você antes de você chegar.",
    "🐕 Razumikin encosta a cabeça na sua perna. Dizem no cartório que ele só faz isso com quem decide bem — mas ele faz com todo mundo, e talvez seja essa a lição.",
    "🐕 Duas voltas em torno de você, uma lambida na mão, e ele volta ao expediente dele: fiscalizar o corredor.",
    "🐕 Por um minuto inteiro, ninguém no fórum é réu, autor, juiz ou testemunha. São só pessoas vendo um cachorro feliz."
  ];

  const FALAS_COMIDA = [
    "🍖 Razumikin ataca o pote como quem cumpre mandado de urgência: com prioridade absoluta e dispensa de formalidades. O rabo, esse, não para nem para comer.",
    "🍖 O jantar é servido — e o fórum inteiro fica dois minutos mais bonito. O escrivão jura que o cachorro olhou para você ANTES de comer, 'agradecendo, doutor, eu vi'.",
    "🍖 Razumikin come, lambe o pote, lambe o chão em volta do pote e, por garantia, lambe a sua mão. Coisa julgada: ninguém tira mais esse jantar dele."
  ];

  let cachorro = null;        // { grupo, rabo, cabeca, pernas[] }
  let alvo = null;            // waypoint atual
  let pausa = 0;              // farejando/sentado (segundos restantes)
  let sentado = 0;            // tempo restante de carinho
  let comendo = 0;            // tempo restante de banquete
  let tigela = null;          // o pote no chão, enquanto come
  let velocidade = 1.1;
  let falaIdx = 0;
  let falaComidaIdx = 0;
  const posInteracao = { x: 0, z: 0 };   // o ponto de interação SEGUE o cachorro

  function flags() {
    return (TOGA.motor && TOGA.motor.estado && TOGA.motor.estado.flags) || {};
  }

  function construir() {
    const g = new THREE.Group();
    function caixa(w, h, d, x, y, z, cor) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d),
        TOGA.texturas3d.matPlastico(cor));
      m.position.set(x, y, z);
      m.castShadow = true;
      g.add(m);
      return m;
    }
    // corpo e peito
    caixa(0.26, 0.24, 0.52, 0, 0.38, 0, CARAMELO);
    caixa(0.22, 0.18, 0.16, 0, 0.36, 0.3, CARAMELO_CLARO);
    // cabeça + focinho + orelhas (uma em pé, outra caída — assinatura caramelo)
    const cabeca = new THREE.Group();
    const cranio = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.2, 0.2), TOGA.texturas3d.matPlastico(CARAMELO));
    cranio.castShadow = true;
    const focinho = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.09, 0.14), TOGA.texturas3d.matPlastico(CARAMELO_CLARO));
    focinho.position.set(0, -0.03, 0.16);
    const nariz = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.045, 0.03), TOGA.texturas3d.matPlastico(FOCINHO));
    nariz.position.set(0, -0.01, 0.235);
    const orelhaEmPe = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.12, 4), TOGA.texturas3d.matPlastico(CARAMELO));
    orelhaEmPe.position.set(-0.07, 0.14, 0);
    const orelhaCaida = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.11, 0.03), TOGA.texturas3d.matPlastico(CARAMELO));
    orelhaCaida.position.set(0.1, 0.07, 0);
    orelhaCaida.rotation.z = -0.5;
    // olhos
    [-0.055, 0.055].forEach(function (x) {
      const olho = new THREE.Mesh(new THREE.SphereGeometry(0.018, 6, 5), TOGA.texturas3d.matPlastico(0x231a10));
      olho.position.set(x, 0.03, 0.105);
      cabeca.add(olho);
    });
    cabeca.add(cranio, focinho, nariz, orelhaEmPe, orelhaCaida);
    cabeca.position.set(0, 0.52, 0.3);
    g.add(cabeca);
    // rabo (a antena emocional)
    const rabo = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.035, 0.26, 6),
      TOGA.texturas3d.matPlastico(CARAMELO));
    rabo.position.set(0, 0.5, -0.28);
    rabo.rotation.x = -0.8;
    rabo.castShadow = true;
    g.add(rabo);
    // pernas
    const pernas = [];
    [[-0.09, 0.18], [0.09, 0.18], [-0.09, -0.18], [0.09, -0.18]].forEach(function (p) {
      const perna = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.26, 0.07),
        TOGA.texturas3d.matPlastico(CARAMELO));
      perna.position.set(p[0], 0.13, p[1]);
      perna.castShadow = true;
      g.add(perna);
      pernas.push(perna);
    });
    return { grupo: g, rabo: rabo, cabeca: cabeca, pernas: pernas };
  }

  function novoAlvo() {
    let p = PASSEIO[Math.floor(Math.random() * PASSEIO.length)];
    if (alvo && p.x === alvo.x) p = PASSEIO[(PASSEIO.indexOf(p) + 1) % PASSEIO.length];
    alvo = p;
  }

  function tick(dt, t) {
    if (!cachorro) return;
    const g = cachorro.grupo;
    const pj = jogadorPos();
    const distJogador = pj ? Math.hypot(g.position.x - pj.x, g.position.z - pj.z) : 99;

    // o rabo NUNCA para — e acelera quando alguém chega perto
    const ritmo = (distJogador < 3 || comendo > 0) ? 16 : 7;
    cachorro.rabo.rotation.z = Math.sin(t * ritmo) * 0.5;

    // banquete: focinho no pote até o fim (e nem um segundo a menos)
    if (comendo > 0) {
      comendo -= dt;
      cachorro.cabeca.rotation.x = 0.65;
      cachorro.cabeca.position.y = 0.36 + Math.sin(t * 9) * 0.015;   // mastigando
      if (comendo <= 0 && tigela) {
        TOGA.nucleo3d.scene.remove(tigela);
        tigela = null;
        cachorro.cabeca.rotation.x = 0;
        cachorro.cabeca.position.y = 0.52;
      }
      sincronizarPos();
      return;
    }

    // sentado recebendo carinho: cabeça erguida, rabo a mil
    if (sentado > 0) {
      sentado -= dt;
      cachorro.cabeca.rotation.x = -0.25;
      if (pj) g.rotation.y = Math.atan2(pj.x - g.position.x, pj.z - g.position.z);
      sincronizarPos();
      return;
    }

    // pausa de farejada: nariz no chão
    if (pausa > 0) {
      pausa -= dt;
      cachorro.cabeca.rotation.x = 0.5;
      cachorro.cabeca.position.y = 0.42;
      sincronizarPos();
      return;
    }
    cachorro.cabeca.rotation.x = 0;
    cachorro.cabeca.position.y = 0.52;

    if (!alvo) novoAlvo();
    const dx = alvo.x - g.position.x, dz = alvo.z - g.position.z;
    const dist = Math.hypot(dx, dz);
    if (dist < 0.3) {
      // chegou: fareja ou escolhe outro rumo
      if (Math.random() < 0.6) pausa = 2 + Math.random() * 4;
      novoAlvo();
    } else {
      const ang = Math.atan2(dx, dz);
      g.rotation.y += (ang - g.rotation.y) * Math.min(1, 5 * dt);
      g.position.x += Math.sin(g.rotation.y) * velocidade * dt;
      g.position.z += Math.cos(g.rotation.y) * velocidade * dt;
      // trote: perninhas alternadas
      cachorro.pernas.forEach(function (p, i) {
        p.rotation.x = Math.sin(t * 10 + (i % 2 ? Math.PI : 0)) * 0.5;
      });
    }
    sincronizarPos();
  }

  function sincronizarPos() {
    posInteracao.x = cachorro.grupo.position.x;
    posInteracao.z = cachorro.grupo.position.z;
  }

  function jogadorPos() {
    const c = TOGA.controles3d && TOGA.controles3d.estado && TOGA.controles3d.estado();
    return c ? c.pos : null;
  }

  function carinho() {
    sentado = 4.5;
    pausa = 0;
    // o JUIZ se encena: vira para o cachorro, estende a mão e faz
    // o cafuné de verdade (controles travados durante o gesto)
    if (TOGA.cena3d && TOGA.cena3d.encenarJogador) {
      TOGA.cena3d.encenarJogador({
        acao: "carinho", dur: 4.2,
        olharPara: { x: cachorro.grupo.position.x, z: cachorro.grupo.position.z }
      });
    }
    if (TOGA.audio) TOGA.audio.tocar("latido");
    const fala = FALAS_CARINHO[falaIdx % FALAS_CARINHO.length];
    falaIdx++;
    if (TOGA.cena3d && TOGA.cena3d.toastMundo) TOGA.cena3d.toastMundo(fala);
    if (TOGA.motor && TOGA.motor.estado) {
      TOGA.motor.alterarEstresse(-3);
      TOGA.motor.salvar();
      if (TOGA.ui && TOGA.ui.atualizarHUD) TOGA.ui.atualizarHUD();
    }
    if (TOGA.conquistas) TOGA.conquistas.avaliar("caramelo");
  }

  /* entregar a comida: ação DISTINTA do carinho — exige ter
     passado na copa antes (o juiz carrega o pote na mão) */
  function darComida() {
    const f = flags();
    if (!f._comidaRazumikin) return;
    f._comidaRazumikin = false;
    f._razumikinJantou = true;
    pausa = 0; sentado = 0;
    comendo = 6;
    // o juiz se ABAIXA para servir: gesto de entregar, controles travados
    if (TOGA.cena3d && TOGA.cena3d.encenarJogador) {
      TOGA.cena3d.encenarJogador({
        acao: "entregar", dur: 2.4,
        olharPara: { x: cachorro.grupo.position.x, z: cachorro.grupo.position.z }
      });
    }
    // o pote sai da mão do juiz e vai para o chão, na frente dele
    if (TOGA.cena3d && TOGA.cena3d.jogadorSegurar) TOGA.cena3d.jogadorSegurar(null, "dir");
    const g = cachorro.grupo;
    tigela = TOGA.props3d && TOGA.props3d.criar ? TOGA.props3d.criar("pote") : null;
    if (tigela) {
      tigela.position.set(
        g.position.x + Math.sin(g.rotation.y) * 0.42, 0.03,
        g.position.z + Math.cos(g.rotation.y) * 0.42);
      TOGA.nucleo3d.scene.add(tigela);
    }
    if (TOGA.audio) TOGA.audio.tocar("latido");
    const fala = FALAS_COMIDA[falaComidaIdx % FALAS_COMIDA.length];
    falaComidaIdx++;
    if (TOGA.cena3d && TOGA.cena3d.toastMundo) TOGA.cena3d.toastMundo(fala);
    if (TOGA.motor && TOGA.motor.estado) {
      TOGA.motor.alterarEstresse(-4);
      TOGA.motor.salvar();
      if (TOGA.ui && TOGA.ui.atualizarHUD) TOGA.ui.atualizarHUD();
    }
    if (TOGA.conquistas) TOGA.conquistas.avaliar("caramelo-comida");
  }

  function iniciar(scene) {
    if (cachorro) return;
    cachorro = construir();
    cachorro.grupo.position.set(-3, 0, 1);
    scene.add(cachorro.grupo);
    novoAlvo();
    TOGA.nucleo3d.aoFrame(tick);
    sincronizarPos();
    if (TOGA.interacao3d && TOGA.interacao3d.adicionar) {
      TOGA.interacao3d.adicionar({
        id: "caramelo",
        pos: posInteracao,        // referência viva: segue o passeio
        raio: 1.6,
        // ações DISTINTAS: com o pote na mão, é hora do jantar;
        // sem ele, é carinho — e o jantar não substitui o carinho
        rotulo: function () {
          return flags()._comidaRazumikin
            ? "dar a comida ao Razumikin"
            : "fazer carinho no Razumikin";
        },
        visivel: function () { return !!cachorro && comendo <= 0; },
        acao: function () {
          if (flags()._comidaRazumikin) darComida();
          else carinho();
        }
      });
    }
  }

  return { iniciar: iniciar };
})();
