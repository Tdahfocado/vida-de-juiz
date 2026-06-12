/* ============================================================
   TOGA 3D — lembrancas3d.js : O GABINETE LEMBRA
   ------------------------------------------------------------
   As consequências boas (e as más) viram OBJETOS no gabinete
   do juiz, dirigidos pelas flags do jogo. A LISTA das
   lembranças (quais existem, quando aparecem, qual arte) mora
   em js/lembrancas.js — compartilhada com o modo 2D. Aqui
   fica só a ENCARNAÇÃO 3D: onde cada uma vive no gabinete e
   que forma física ela tem.

   Cada lembrança é interagível. `sincronizar(flags)` roda ao
   entrar no mundo: cria o que deve existir, remove o que não
   deve — inclusive ao recarregar o save.
   ============================================================ */

window.TOGA = window.TOGA || {};

TOGA.lembrancas3d = (function () {
  if (!window.THREE) {
    // sem WebGL o registro neutro continua valendo para o 2D
    return {
      sincronizar: function () {},
      listar: function (f) { return TOGA.lembrancas ? TOGA.lembrancas.listar(f) : []; }
    };
  }

  function mat(cor) { return TOGA.texturas3d.matPlastico(cor); }

  /* ---------- fábricas de objetos 3D ---------- */
  function quadroNaParede(arteNome, larg) {
    return new THREE.Mesh(new THREE.PlaneGeometry(larg || 0.6, larg || 0.6),
      new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.deArte(arteNome) }));
  }

  /* papel/carta deitado sobre a mesa, com a arte estampada */
  function papelNaMesa(arteNome, larg) {
    const l = larg || 0.24;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(l, l),
      new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.deArte(arteNome) }));
    m.rotation.x = -Math.PI / 2;
    m.rotation.z = 0.18;
    return m;
  }

  function cestaMangas() {
    const g = new THREE.Group();
    const cesta = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.11, 0.1, 10), mat(0x8a6240));
    g.add(cesta);
    for (let i = 0; i < 5; i++) {
      const manga = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), mat(i % 2 ? 0xe0a33a : 0xc98a2a));
      manga.position.set(Math.cos(i * 2.1) * 0.07, 0.08 + (i % 2) * 0.04, Math.sin(i * 2.1) * 0.07);
      g.add(manga);
    }
    return g;
  }

  function oficioVermelho() {
    const g = new THREE.Group();
    const papel = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.015, 0.21), mat(0xf4ecd9));
    const tarja = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.017, 0.05), mat(0x9c1f1f));
    tarja.position.z = -0.06;
    g.add(papel, tarja);
    return g;
  }

  /* ---------- A ENCARNAÇÃO: id (js/lembrancas.js) -> forma + lugar ----------
     Parede do fundo (z=-8.86, y=1.95): a galeria de molduras.
     Mesa (tampo y≈0.84, x∈[-13.3,-10.7], z∈[-7.75,-6.65]): papéis e cartas.
     Aparador (z≈-8.45): objetos.                                          */
  const FORMA3D = {
    desenhoAlice:       { criar: function () { return quadroNaParede("desenhoSuperJuiz", 0.66); },
                          pos: { x: -12.6, y: 1.95, z: -8.86 } },
    fotoIracema:        { criar: function () { return quadroNaParede("fotoIracema", 0.5); },
                          pos: { x: -13.45, y: 1.95, z: -8.86 } },
    fotoTurmaEsmec:     { criar: function () { return quadroNaParede("fotoTurmaEsmec", 0.56); },
                          pos: { x: -6.85, y: 1.95, z: -8.86 } },
    fotoThor:           { criar: function () { return quadroNaParede("fotoThor", 0.62); },
                          pos: { x: -11.4, y: 1.95, z: -8.86 } },
    certidaoSebastiana: { criar: function () { return quadroNaParede("certidaoLembranca", 0.56); },
                          pos: { x: -10.2, y: 1.95, z: -8.86 } },
    desenhoFoguete:     { criar: function () { return quadroNaParede("desenhoFoguete", 0.62); },
                          pos: { x: -9.3, y: 1.95, z: -8.86 } },
    fotoFisioterapia:   { criar: function () { return quadroNaParede("fotoFisioterapia", 0.56); },
                          pos: { x: -8.4, y: 1.95, z: -8.86 } },
    plaquinhaFrajola:   { criar: function () { return quadroNaParede("plaquinhaFrajola", 0.44); },
                          pos: { x: -7.5, y: 1.95, z: -8.86 } },
    mangas:             { criar: cestaMangas,
                          pos: { x: -7.3, y: 0.9, z: -8.45 } },
    desenhoDino:        { criar: function () { return quadroNaParede("desenhoDino", 0.62); },
                          pos: { x: -13.86, y: 1.95, z: -7.4 }, rotY: Math.PI / 2 },
    cartaEntrega:       { criar: function () { return papelNaMesa("cartaEntrega"); },
                          pos: { x: -12.55, y: 0.845, z: -7.5 } },
    certidaoMadrugada:  { criar: function () { return papelNaMesa("certidaoMadrugada"); },
                          pos: { x: -13.1, y: 0.845, z: -6.85 } },
    cartaJonas:         { criar: function () { return papelNaMesa("cartaJonas"); },
                          pos: { x: -11.0, y: 0.845, z: -7.3 } },
    bilheteJandira:     { criar: function () { return papelNaMesa("bilheteJandira", 0.2); },
                          pos: { x: -11.05, y: 0.845, z: -6.75 } },
    comprovanteAluguel: { criar: function () { return papelNaMesa("comprovanteAluguel"); },
                          pos: { x: -12.6, y: 0.845, z: -6.75 } },
    cartaMarlene:       { criar: function () { return papelNaMesa("cartaMarlene"); },
                          pos: { x: -12.95, y: 0.845, z: -7.35 } },
    corregedoria:       { criar: oficioVermelho,
                          pos: { x: -11.6, y: 0.84, z: -6.9 } },

    /* a PAREDE DE HONRARIAS: a fileira de cima, acima das
       lembranças afetivas (pé-direito 3,2 m — cabe com folga) */
    seloExcelencia:     { criar: function () { return quadroNaParede("seloExcelencia", 0.6); },
                          pos: { x: -12.0, y: 2.62, z: -8.86 } },
    elogioFuncional:    { criar: function () { return quadroNaParede("elogioFuncional", 0.54); },
                          pos: { x: -11.0, y: 2.62, z: -8.86 } },
    certificadoPalestra:{ criar: function () { return quadroNaParede("certificadoPalestra", 0.54); },
                          pos: { x: -10.05, y: 2.62, z: -8.86 } },
    placaComunidade:    { criar: function () { return quadroNaParede("placaComunidade", 0.54); },
                          pos: { x: -9.1, y: 2.62, z: -8.86 } },
    agradecimentoTJCE:  { criar: function () { return quadroNaParede("agradecimentoTJCE", 0.54); },
                          pos: { x: -8.15, y: 2.62, z: -8.86 } },
    placaESMEC:         { criar: function () { return quadroNaParede("placaESMEC", 0.54); },
                          pos: { x: -7.2, y: 2.62, z: -8.86 } }
  };

  function itensCompletos() {
    return ((TOGA.lembrancas && TOGA.lembrancas.REGISTRO) || [])
      .filter(function (i) { return !!FORMA3D[i.id]; })
      .map(function (i) { return Object.assign({}, i, FORMA3D[i.id]); });
  }

  const ativos = {};   // id -> Object3D
  let interagiveisRegistrados = false;

  function registrarInteragiveis() {
    if (interagiveisRegistrados || !TOGA.interacao3d) return;
    interagiveisRegistrados = true;
    itensCompletos().forEach(function (item) {
      TOGA.interacao3d.adicionar({
        id: "lembranca-" + item.id,
        pos: { x: item.pos.x, z: item.pos.z },
        raio: 1.9,
        rotulo: item.rotulo,
        visivel: function () { return !!ativos[item.id]; },
        acao: function () {
          if (item.arte) TOGA.lembrancas.ver(item);
          else if (item.texto && TOGA.cena3d) TOGA.cena3d.toastMundo(item.texto);
        }
      });
    });
  }

  function sincronizar(flags) {
    registrarInteragiveis();
    const scene = TOGA.nucleo3d.scene;
    if (!scene) return;
    itensCompletos().forEach(function (item) {
      const deve = !!item.se(flags || {});
      if (deve && !ativos[item.id]) {
        const obj = item.criar();
        obj.position.set(item.pos.x, item.pos.y, item.pos.z);
        if (item.rotY) obj.rotation.y = item.rotY;
        scene.add(obj);
        ativos[item.id] = obj;
      } else if (!deve && ativos[item.id]) {
        scene.remove(ativos[item.id]);
        delete ativos[item.id];
      }
    });
  }

  /* lista textual (o epílogo 2D usa) — delega ao registro neutro */
  function listar(flags) {
    return TOGA.lembrancas ? TOGA.lembrancas.listar(flags) : [];
  }

  return { sincronizar: sincronizar, listar: listar };
})();
