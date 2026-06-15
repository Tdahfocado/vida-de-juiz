/* ============================================================
   TOGA 3D — parque3d.js : O PARQUE DA CIDADE
   ------------------------------------------------------------
   Área externa AMPLA e de ACESSO LIVRE, inspirada no parque
   urbano de lago com ilha central iluminada: lâmina d'água,
   ilha, deque/ponte, calçadão arborizado e bancos. É daqui
   que o juiz pega a BICICLETA para relaxar ou pedalar até a
   ACM (à beira-mar). Propositalmente espaçoso — sobra chão
   para expansões futuras.

   Construído deslocado em x ≈ −200 no MESMO scene do fórum;
   a neblina cobre a distância e o cena3d só troca colisores/
   spawn/interagíveis ao "viajar".
   ============================================================ */

window.TOGA = window.TOGA || {};

TOGA.parque3d = (function () {
  if (!window.THREE) return null;

  const PX = -200;                 // centro do parque no eixo x
  let construido = false;
  let info = null;

  function mat(cor) { return TOGA.texturas3d.matPlastico(cor); }

  function construir(scene) {
    if (construido) return info;
    construido = true;
    const colisores = [], paredesCamera = [], pontos = {}, vivos = [];

    function caixa(w, h, d, x, y, z, material, op) {
      op = op || {};
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
      m.position.set(x, y, z);
      if (op.rotY) m.rotation.y = op.rotY;
      m.castShadow = !op.semSombra;
      m.receiveShadow = true;
      scene.add(m);
      if (op.colide !== false) {
        colisores.push({ minX: x - w / 2 - 0.05, maxX: x + w / 2 + 0.05,
                         minZ: z - d / 2 - 0.05, maxZ: z + d / 2 + 0.05 });
      }
      if (op.bloqueiaCamera) paredesCamera.push(m);
      return m;
    }
    function piso(x1, z1, x2, z2, material, y) {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(Math.abs(x2 - x1), Math.abs(z2 - z1)), material);
      m.rotation.x = -Math.PI / 2;
      m.position.set((x1 + x2) / 2, y || 0.005, (z1 + z2) / 2);
      m.receiveShadow = true;
      scene.add(m);
      return m;
    }
    function discoY(raio, x, y, z, material, seg) {
      const m = new THREE.Mesh(new THREE.CircleGeometry(raio, seg || 48), material);
      m.rotation.x = -Math.PI / 2;
      m.position.set(x, y, z);
      m.receiveShadow = true;
      scene.add(m);
      return m;
    }
    function placaEm(texto, x, y, z, rotY, larg) {
      if (!TOGA.texturas3d.placa) return;
      const m = new THREE.Mesh(new THREE.PlaneGeometry(larg || 1.6, 0.4),
        new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.placa(texto),
          polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
      m.position.set(x, y, z); m.rotation.y = rotY || 0;
      scene.add(m);
      return m;
    }
    function arvore(x, z, escala) {
      const e = escala || 1;
      const tronco = new THREE.Mesh(new THREE.CylinderGeometry(0.16 * e, 0.2 * e, 1.8 * e, 8), mat(0x5a3a22));
      tronco.position.set(x, 0.9 * e, z); tronco.castShadow = true;
      const copa = new THREE.Mesh(new THREE.SphereGeometry(1.1 * e, 10, 8), mat(0x2f5a3e));
      copa.position.set(x, 2.3 * e, z); copa.castShadow = true;
      scene.add(tronco, copa);
      colisores.push({ minX: x - 0.3, maxX: x + 0.3, minZ: z - 0.3, maxZ: z + 0.3 });
    }
    function poste(x, z) {
      const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 4.0, 8), mat(0x55585e));
      haste.position.set(x, 2.0, z);
      const globo = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 6),
        new THREE.MeshBasicMaterial({ color: 0xffe2a8 }));
      globo.position.set(x, 4.0, z);
      scene.add(haste, globo);
    }
    function banco(x, z, rotY) {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 0.5),
        new THREE.MeshLambertMaterial({ color: 0x6a4a2a })));
      const enc = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.4, 0.08),
        new THREE.MeshLambertMaterial({ color: 0x6a4a2a }));
      enc.position.set(0, 0.24, -0.21);
      g.children[0].position.y = 0.42; enc.position.y = 0.62;
      g.add(enc);
      [[-0.7, 0], [0.7, 0]].forEach(function (p) {
        const pe = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.42, 0.46), mat(0x55585e));
        pe.position.set(p[0], 0.21, 0); g.add(pe);
      });
      g.position.set(x, 0, z); g.rotation.y = rotY || 0;
      scene.add(g);
      return g;
    }

    /* ================= O GRANDE GRAMADO / CALÇADÃO ================= */
    piso(PX - 34, -30, PX + 34, 34, mat(0x4f7a44));                  // gramado amplo
    // anel de calçada clara em torno do lago
    discoY(20, PX, 0.02, 4, mat(0xb9b3a6), 56);                       // calçadão (anel externo)
    // a lâmina d'água (lago) e a ILHA central
    discoY(16, PX, 0.05, 4, new THREE.MeshPhongMaterial({
      color: 0x2a6a8a, shininess: 80, specular: 0x9fd2e0 }), 56);     // água
    discoY(5.5, PX, 0.18, 4, mat(0x6a5a3a), 40);                      // ilha (terra)
    discoY(4.2, PX, 0.2, 4, mat(0x4f7a44), 40);                       // ilha (grama)
    // mirante/escultura iluminada no centro da ilha
    caixa(1.2, 1.6, 1.2, PX, 0.8, 4, mat(0xc96a4a));
    const farol = new THREE.Mesh(new THREE.SphereGeometry(0.3, 10, 8),
      new THREE.MeshBasicMaterial({ color: 0xffe2a8 }));
    farol.position.set(PX, 1.9, 4); scene.add(farol);
    arvore(PX - 1.6, 4, 0.8); arvore(PX + 1.6, 5.2, 0.8); arvore(PX, 2.4, 0.7);

    /* ================= PONTE / DECK até a ilha ================= */
    // passarela de madeira do calçadão (sul) até a ilha
    for (let i = 0; i < 7; i++) {
      caixa(1.6, 0.12, 1.5, PX, 0.12, -12.5 + i * 1.55, mat(0x7a5634), { semSombra: true });
    }
    [[-0.85], [0.85]].forEach(function (l) {        // corrimãos da ponte
      for (let i = 0; i < 7; i++) {
        caixa(0.06, 0.5, 0.06, PX + l[0], 0.4, -12.5 + i * 1.55, mat(0x55585e), { colide: false, semSombra: true });
      }
    });
    pontos.deque = { x: PX, z: -10.5 };

    /* ================= calçadão arborizado ================= */
    for (let a = 0; a < 12; a++) {
      const ang = (a / 12) * Math.PI * 2;
      arvore(PX + Math.cos(ang) * 24, 4 + Math.sin(ang) * 24);
      if (a % 2 === 0) poste(PX + Math.cos(ang) * 20.5, 4 + Math.sin(ang) * 20.5);
    }
    banco(PX - 19.5, 4, Math.PI / 2);
    banco(PX + 19.5, 4, -Math.PI / 2);
    banco(PX, -16, 0);
    pontos.banco = { x: PX - 18.4, z: 4 };

    /* ================= PORTAL: VOLTAR À RUA DO FÓRUM ================= */
    // um arco de entrada na borda sul do parque
    caixa(0.4, 3.2, 0.4, PX - 4, 1.6, 28, mat(0x8a6240));
    caixa(0.4, 3.2, 0.4, PX + 4, 1.6, 28, mat(0x8a6240));
    caixa(8.6, 0.5, 0.4, PX, 3.3, 28, mat(0x8a6240), { colide: false });
    placaEm("PARQUE DA CIDADE", PX, 3.3, 27.7, 0, 4.0);
    piso(PX - 2, 28, PX + 2, 33, mat(0x6b675f));     // saída de pedestre
    pontos.portaRua = { x: PX, z: 28.6 };
    pontos.spawnParque = { x: PX, z: 24, angulo: Math.PI };  // entra de frente para o lago

    /* ================= BICICLETÁRIO + a bicicleta do juiz ================= */
    // suporte de bikes a leste do calçadão
    caixa(2.4, 0.1, 0.6, PX + 22, 0.05, 10, mat(0x9aa8b0), { colide: false, semSombra: true });
    for (let i = 0; i < 4; i++) {
      caixa(0.06, 0.6, 0.06, PX + 21 + i * 0.7, 0.3, 10, mat(0x6a6a70), { colide: false, semSombra: true });
    }
    // a bicicleta do juiz, estacionada (modelo do bicicleta3d)
    if (TOGA.bicicleta3d && TOGA.bicicleta3d.criar) {
      const bike = TOGA.bicicleta3d.criar();
      bike.position.set(PX + 22.6, 0, 12);
      bike.rotation.y = -Math.PI / 2;
      scene.add(bike);
      pontos.bicicletaMesh = bike;
    }
    placaEm("🚲 BICICLETÁRIO", PX + 22, 1.4, 9.4, 0, 1.8);
    pontos.bicicleta = { x: PX + 21, z: 12 };

    /* ================= um pouco de vida ================= */
    function npc(id, av, x, z, rotY, opcoes) {
      if (!TOGA.boneco3d) return null;
      const b = TOGA.boneco3d.criar({ id: id, avatar: av }, opcoes || {});
      b.grupo.position.set(x, 0, z);
      b.grupo.rotation.y = rotY || 0;
      scene.add(b.grupo);
      vivos.push(b);
      return b;
    }
    const corredor = npc("corredorParque",
      { pele: "#c98e66", cabelo: "curto", corCabelo: "#241a10", traje: "camisa", corTraje: "#4a6ab8" },
      PX - 12, 22, Math.PI / 2);
    if (corredor) corredor.setEmocao("feliz");
    if (corredor && TOGA.rotinas3d && TOGA.rotinas3d.adicionarRotina) {
      TOGA.rotinas3d.adicionarRotina(corredor, [
        { ir: [{ x: PX + 12, z: 22 }] }, { esperar: 3 },
        { ir: [{ x: PX - 12, z: 22 }] }, { esperar: 3 }
      ]);
    }
    npc("sentadoParque",
      { pele: "#8a5436", cabelo: "coque", corCabelo: "#3a2a1a", traje: "vestido", corTraje: "#7a4a3a" },
      PX - 19.5, 3.4, -Math.PI / 2, { sentado: true });

    info = { colisores: colisores, paredesCamera: paredesCamera, pontos: pontos, vivos: vivos };
    return info;
  }

  return {
    construir: construir,
    get PX() { return PX; },
    get pontos() { return info ? info.pontos : null; }
  };
})();
