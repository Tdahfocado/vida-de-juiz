/* ============================================================
   TOGA 3D — props3d.js : OBJETOS DE MÃO (peças de encaixe)
   ------------------------------------------------------------
   Pequenos objetos que as minifigs SEGURAM: xícara de café,
   pilha de autos, martelo de mão, algemas, copo d'água, pasta
   de advogado. Cada prop é um Group com `userData.offset`
   (posição/rotação relativa à PALMA do boneco — o Group de
   encaixe criado pelo boneco.js).

   Geometria cacheada: dez advogados com a mesma pasta custam
   uma geometria só.
   ============================================================ */

window.TOGA = window.TOGA || {};

TOGA.props3d = (function () {
  if (!window.THREE) return {};

  function mat(cor) { return TOGA.texturas3d.matPlastico(cor); }

  const GEO = {};
  function geo(chave, fabrica) {
    if (!GEO[chave]) GEO[chave] = fabrica();
    return GEO[chave];
  }

  const FABRICAS = {
    xicara: function () {
      const g = new THREE.Group();
      const corpo = new THREE.Mesh(geo("xicCorpo", () => new THREE.CylinderGeometry(0.045, 0.035, 0.06, 10)), mat(0xf4ecd9));
      const cafe = new THREE.Mesh(geo("xicCafe", () => new THREE.CylinderGeometry(0.038, 0.038, 0.012, 10)), mat(0x2a1a0c));
      cafe.position.y = 0.028;
      const alca = new THREE.Mesh(geo("xicAlca", () => new THREE.TorusGeometry(0.026, 0.008, 6, 10, Math.PI)), mat(0xf4ecd9));
      alca.position.set(0.045, 0, 0);
      alca.rotation.z = -Math.PI / 2;
      g.add(corpo, cafe, alca);
      g.userData.offset = { pos: [0, 0, 0.02], rot: [0, 0, 0] };
      return g;
    },
    copo: function () {
      const g = new THREE.Group();
      const corpo = new THREE.Mesh(geo("copoCorpo", () => new THREE.CylinderGeometry(0.032, 0.026, 0.08, 10)), mat(0xb9d2e0));
      g.add(corpo);
      g.userData.offset = { pos: [0, 0, 0.02], rot: [0, 0, 0] };
      return g;
    },
    autos: function () {
      const g = new THREE.Group();
      const a = new THREE.Mesh(geo("autosA", () => new THREE.BoxGeometry(0.24, 0.035, 0.18)), mat(0xf4ecd9));
      const b = new THREE.Mesh(geo("autosB", () => new THREE.BoxGeometry(0.23, 0.035, 0.17)), mat(0xe2d6ba));
      b.position.set(0.006, 0.036, -0.004);
      b.rotation.y = 0.08;
      g.add(a, b);
      g.userData.offset = { pos: [0, 0, 0.06], rot: [0, 0, 0] };
      return g;
    },
    pastas: function () {
      const g = new THREE.Group();
      const pasta = new THREE.Mesh(geo("pasta", () => new THREE.BoxGeometry(0.05, 0.26, 0.20)), mat(0x6e3a26));
      const fecho = new THREE.Mesh(geo("pastaFecho", () => new THREE.BoxGeometry(0.054, 0.04, 0.05)), mat(0xc9a35c));
      fecho.position.y = 0.06;
      g.add(pasta, fecho);
      g.userData.offset = { pos: [0, -0.06, 0.03], rot: [0, 0, 0] };
      return g;
    },
    vassoura: function () {
      const g = new THREE.Group();
      const cabo = new THREE.Mesh(geo("vasCabo", () => new THREE.CylinderGeometry(0.014, 0.014, 1.1, 6)), mat(0x8a6240));
      const cerdas = new THREE.Mesh(geo("vasCerdas", () => new THREE.CylinderGeometry(0.05, 0.09, 0.18, 8)), mat(0xc9a35c));
      cerdas.position.y = -0.62;
      g.add(cabo, cerdas);
      g.userData.offset = { pos: [0, 0.2, 0.03], rot: [0, 0, 0.12] };
      return g;
    },
    pao: function () {
      const g = new THREE.Group();
      const miolo = new THREE.Mesh(geo("pao", () => new THREE.SphereGeometry(0.05, 8, 6)), mat(0xd9a662));
      miolo.scale.set(1.5, 0.7, 0.8);
      const pestana = new THREE.Mesh(geo("paoCorte", () => new THREE.BoxGeometry(0.09, 0.012, 0.02)), mat(0xb98443));
      pestana.position.y = 0.032;
      g.add(miolo, pestana);
      g.userData.offset = { pos: [0, 0, 0.03], rot: [0, 0, 0] };
      return g;
    },
    banana: function () {
      const g = new THREE.Group();
      // três gomos em arco = a curva da banana sem geometria cara
      [-1, 0, 1].forEach(function (i) {
        const gomo = new THREE.Mesh(geo("bananaGomo", () => new THREE.CylinderGeometry(0.016, 0.016, 0.05, 6)), mat(0xe8c93a));
        gomo.position.set(i * 0.034, Math.abs(i) * -0.012, 0);
        gomo.rotation.z = Math.PI / 2 + i * 0.45;
        g.add(gomo);
      });
      const ponta = new THREE.Mesh(geo("bananaPonta", () => new THREE.CylinderGeometry(0.008, 0.012, 0.018, 5)), mat(0x6e4a26));
      ponta.position.set(-0.055, -0.02, 0);
      ponta.rotation.z = Math.PI / 2;
      g.add(ponta);
      g.userData.offset = { pos: [0, 0, 0.03], rot: [0, 0, 0] };
      return g;
    },
    iogurte: function () {
      const g = new THREE.Group();
      const pote = new THREE.Mesh(geo("iogPote", () => new THREE.CylinderGeometry(0.032, 0.026, 0.07, 10)), mat(0xf2efe6));
      const tampa = new THREE.Mesh(geo("iogTampa", () => new THREE.CylinderGeometry(0.034, 0.034, 0.008, 10)), mat(0xe06a8a));
      tampa.position.y = 0.038;
      g.add(pote, tampa);
      g.userData.offset = { pos: [0, 0, 0.02], rot: [0, 0, 0] };
      return g;
    },
    cuscuz: function () {
      const g = new THREE.Group();
      const prato = new THREE.Mesh(geo("cuscuzPrato", () => new THREE.CylinderGeometry(0.07, 0.06, 0.014, 12)), mat(0xe8e6da));
      const monte = new THREE.Mesh(geo("cuscuzMonte", () => new THREE.CylinderGeometry(0.035, 0.05, 0.035, 10)), mat(0xe8c93a));
      monte.position.y = 0.024;
      // o queijo coalho derretendo por cima
      const queijo = new THREE.Mesh(geo("cuscuzQueijo", () => new THREE.BoxGeometry(0.05, 0.012, 0.05)), mat(0xfdf8ec));
      queijo.position.y = 0.046;
      queijo.rotation.y = 0.5;
      g.add(prato, monte, queijo);
      g.userData.offset = { pos: [0, 0, 0.03], rot: [0, 0, 0] };
      return g;
    },
    pote: function () {
      // o pote de comida do Razumikin (ração caprichada da copa)
      const g = new THREE.Group();
      const pote = new THREE.Mesh(geo("poteCorpo", () => new THREE.CylinderGeometry(0.06, 0.045, 0.05, 10)), mat(0xc94f4f));
      const racao = new THREE.Mesh(geo("poteRacao", () => new THREE.CylinderGeometry(0.052, 0.052, 0.014, 10)), mat(0x6e4a26));
      racao.position.y = 0.026;
      g.add(pote, racao);
      g.userData.offset = { pos: [0, 0, 0.03], rot: [0, 0, 0] };
      return g;
    },
    marteloMao: function () {
      const g = new THREE.Group();
      const cabo = new THREE.Mesh(geo("mmCabo", () => new THREE.CylinderGeometry(0.018, 0.018, 0.22, 8)), mat(0x6e4a26));
      const cabeca = new THREE.Mesh(geo("mmCabeca", () => new THREE.CylinderGeometry(0.05, 0.05, 0.12, 10)), mat(0x8a6240));
      cabeca.rotation.x = Math.PI / 2;
      cabeca.position.y = 0.11;
      g.add(cabo, cabeca);
      g.userData.offset = { pos: [0, 0, 0.03], rot: [Math.PI / 2, 0, 0] };
      return g;
    },
    algemas: function () {
      const g = new THREE.Group();
      const aroE = new THREE.Mesh(geo("algAro", () => new THREE.TorusGeometry(0.04, 0.011, 6, 12)), mat(0x9aa2ad));
      const aroD = new THREE.Mesh(geo("algAro", () => new THREE.TorusGeometry(0.04, 0.011, 6, 12)), mat(0x9aa2ad));
      aroE.position.x = -0.052;
      aroD.position.x = 0.052;
      const elo = new THREE.Mesh(geo("algElo", () => new THREE.CylinderGeometry(0.008, 0.008, 0.05, 6)), mat(0x6f7680));
      elo.rotation.z = Math.PI / 2;
      g.add(aroE, aroD, elo);
      g.userData.offset = { pos: [0, -0.02, 0.04], rot: [Math.PI / 2, 0, 0] };
      return g;
    },
    desenho: function () {   // a folha que a Alice entrega (caso da saúde)
      const g = new THREE.Group();
      const folha = new THREE.Mesh(geo("folha", () => new THREE.PlaneGeometry(0.22, 0.16)),
        new THREE.MeshLambertMaterial({
          map: (TOGA.texturas3d.desenhoSuperJuiz ? TOGA.texturas3d.desenhoSuperJuiz() : null),
          color: 0xffffff, side: THREE.DoubleSide
        }));
      g.add(folha);
      g.userData.offset = { pos: [0, 0, 0.05], rot: [0, 0, 0] };
      return g;
    }
  };

  function criar(nome) {
    const fabrica = FABRICAS[nome];
    if (!fabrica) return null;
    const prop = fabrica();
    prop.traverse(function (o) {
      if (o.isMesh && o.material && !o.material.isMeshBasicMaterial) o.castShadow = true;
    });
    return prop;
  }

  return { criar: criar };
})();
