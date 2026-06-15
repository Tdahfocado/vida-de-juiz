/* ============================================================
   TOGA 3D — parque3d.js : O PARQUE DA CIDADE
   ------------------------------------------------------------
   Área externa AMPLA e de ACESSO LIVRE (entra-se por uma porta
   no fim do corredor leste do fórum). Lago com ilha e coreto,
   fonte, patos, pontes, calçadão arborizado, canteiros de flores,
   playground, quiosque, pergolado e pista de caminhada. Daqui o
   juiz pega a BICICLETA (pilotada por ele) para relaxar — e VÊ,
   na orla ao norte, a fachada da ACM (à beira-mar), exatamente
   como a Delegacia e a Escola se veem na rua do fórum.

   Construído deslocado em x ≈ −200 no MESMO scene do fórum.
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
    const colisores = [], paredesCamera = [], pontos = {}, vivos = [], aguas = [], passaros = [];

    // material de água com textura de ondas (o offset rola no cena3d)
    function matAgua(rep) {
      if (!TOGA.texturas3d.agua) return new THREE.MeshPhongMaterial({ color: 0x1f6f9a, shininess: 80, specular: 0x9fd2e0 });
      const tex = TOGA.texturas3d.agua().clone();
      tex.needsUpdate = true; tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(rep || 6, rep || 6);
      return new THREE.MeshPhongMaterial({ map: tex, shininess: 95, specular: 0xbfe6f2 });
    }
    // um passarinho (corpo + asas) que voa em arco — animado no cena3d
    function passaro(cx, cz, alt, raio, cor) {
      const g = new THREE.Group();
      const corpo = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 6),
        new THREE.MeshLambertMaterial({ color: cor || 0x44484e })); corpo.scale.set(1.5, 0.85, 1);
      const cab = new THREE.Mesh(new THREE.SphereGeometry(0.1, 7, 6),
        new THREE.MeshLambertMaterial({ color: cor || 0x44484e })); cab.position.set(0, 0.07, 0.18);
      const bico = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.12, 6),
        new THREE.MeshLambertMaterial({ color: 0xe0a23a })); bico.rotation.x = Math.PI / 2; bico.position.set(0, 0.07, 0.3);
      const asaE = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.44, 4),
        new THREE.MeshLambertMaterial({ color: 0x2f3338 })); asaE.position.set(-0.14, 0.05, 0); asaE.rotation.z = 0.5;
      const asaD = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.44, 4),
        new THREE.MeshLambertMaterial({ color: 0x2f3338 })); asaD.position.set(0.14, 0.05, 0); asaD.rotation.z = -0.5;
      g.add(corpo, cab, bico, asaE, asaD);
      g.position.set(cx, alt, cz); scene.add(g);
      passaros.push({ grupo: g, asaE: asaE, asaD: asaD, cx: cx, cz: cz, alt: alt, raio: raio,
        fase: (cx + cz) * 0.07, vel: 0.35 + (Math.abs(Math.round(cx + cz)) % 5) * 0.04 });
    }

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
    function anelY(rInt, rExt, x, y, z, material, seg) {
      const m = new THREE.Mesh(new THREE.RingGeometry(rInt, rExt, seg || 56), material);
      m.rotation.x = -Math.PI / 2;
      m.position.set(x, y, z);
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
    function letreiroEm(t, sub, cor, x, y, z, rotY, w, h) {
      if (!TOGA.texturas3d.letreiro) return;
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w || 3.4, h || 1.0),
        new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.letreiro(t, cor || "#2a3d7c", "#f4ecd9", sub) }));
      m.position.set(x, y, z); m.rotation.y = rotY || 0;
      scene.add(m);
      return m;
    }
    function arvore(x, z, escala) {
      const e = escala || 1;
      const tronco = new THREE.Mesh(new THREE.CylinderGeometry(0.16 * e, 0.22 * e, 1.8 * e, 8), mat(0x5a3a22));
      tronco.position.set(x, 0.9 * e, z); tronco.castShadow = true;
      const copa1 = new THREE.Mesh(new THREE.SphereGeometry(1.1 * e, 10, 8), mat(0x2f5a3e));
      copa1.position.set(x, 2.3 * e, z); copa1.castShadow = true;
      const copa2 = new THREE.Mesh(new THREE.SphereGeometry(0.8 * e, 9, 7), mat(0x3a6a45));
      copa2.position.set(x + 0.5 * e, 2.7 * e, z - 0.3 * e);
      scene.add(tronco, copa1, copa2);
      colisores.push({ minX: x - 0.3, maxX: x + 0.3, minZ: z - 0.3, maxZ: z + 0.3 });
    }
    function palmeira(x, z) {
      const tronco = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 3.4, 8), mat(0x8a6a4a));
      tronco.position.set(x, 1.7, z); tronco.castShadow = true; scene.add(tronco);
      for (let i = 0; i < 6; i++) {
        const folha = new THREE.Mesh(new THREE.ConeGeometry(0.18, 1.8, 5), mat(0x3f7a45));
        const ang = i * Math.PI / 3;
        folha.position.set(x + Math.cos(ang) * 0.8, 3.5, z + Math.sin(ang) * 0.8);
        folha.rotation.z = Math.cos(ang) * 1.25; folha.rotation.x = -Math.sin(ang) * 1.25;
        scene.add(folha);
      }
      colisores.push({ minX: x - 0.22, maxX: x + 0.22, minZ: z - 0.22, maxZ: z + 0.22 });
    }
    function poste(x, z) {
      const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 4.0, 8), mat(0x44484e));
      haste.position.set(x, 2.0, z); haste.castShadow = true;
      const braco = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 6), mat(0x44484e));
      braco.rotation.z = Math.PI / 2; braco.position.set(x + 0.22, 3.9, z);
      const globo = new THREE.Mesh(new THREE.SphereGeometry(0.17, 8, 6),
        new THREE.MeshBasicMaterial({ color: 0xffe8b0 }));
      globo.position.set(x + 0.44, 3.85, z);
      scene.add(haste, braco, globo);
    }
    function banco(x, z, rotY) {
      const g = new THREE.Group();
      const assento = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 0.5), mat(0x7a5634));
      assento.position.y = 0.42;
      const enc = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.4, 0.08), mat(0x7a5634));
      enc.position.set(0, 0.62, -0.21);
      g.add(assento, enc);
      [[-0.7], [0.7]].forEach(function (p) {
        const pe = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.42, 0.46), mat(0x44484e));
        pe.position.set(p[0], 0.21, 0); g.add(pe);
      });
      g.position.set(x, 0, z); g.rotation.y = rotY || 0;
      g.castShadow = true; scene.add(g);
      return g;
    }
    function canteiro(x, z) {
      // mureta baixa circular + flores coloridas
      const murete = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.3, 16), mat(0xb9a98a));
      murete.position.set(x, 0.15, z); scene.add(murete);
      const terra = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.06, 16), mat(0x4a3526));
      terra.position.set(x, 0.32, z); scene.add(terra);
      const cores = [0xe05a6a, 0xf2b53a, 0xe8e2d2, 0x9a6ad0, 0xe07a3a];
      for (let i = 0; i < 10; i++) {
        const ang = i * 0.63, r = 0.2 + (i % 3) * 0.25;
        const cau = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.3, 5), mat(0x3a6a3a));
        cau.position.set(x + Math.cos(ang) * r, 0.5, z + Math.sin(ang) * r);
        const flor = new THREE.Mesh(new THREE.SphereGeometry(0.11, 7, 6), mat(cores[i % 5]));
        flor.position.set(x + Math.cos(ang) * r, 0.66, z + Math.sin(ang) * r);
        scene.add(cau, flor);
      }
      colisores.push({ minX: x - 1.15, maxX: x + 1.15, minZ: z - 1.15, maxZ: z + 1.15 });
    }
    function npc(id, av, x, z, rotY, opcoes) {
      if (!TOGA.boneco3d) return null;
      const b = TOGA.boneco3d.criar({ id: id, avatar: av }, opcoes || {});
      b.grupo.position.set(x, 0, z);
      b.grupo.rotation.y = rotY || 0;
      scene.add(b.grupo);
      vivos.push(b);
      return b;
    }

    const LZ = 4;   // z do centro do lago

    /* ================= O GRANDE GRAMADO ================= */
    piso(PX - 36, -32, PX + 36, 36, mat(0x4f7a44));                   // gramado amplo
    // pista de caminhada (anel claro externo) + calçadão (anel do lago)
    anelY(25.4, 26.6, PX, 0.015, LZ, mat(0xc23a3a), 64);              // pista vermelha (cooper)
    discoY(21, PX, 0.02, LZ, mat(0xc6c0b2), 60);                      // calçadão claro do lago
    anelY(20.6, 21, PX, 0.03, LZ, mat(0x8a8478), 60);                 // meio-fio do calçadão

    /* ================= O LAGO, A ILHA E O CORETO ================= */
    aguas.push(discoY(16, PX, 0.05, LZ, matAgua(5), 60));            // ÁGUA ANIMADA
    anelY(15.7, 16.3, PX, 0.06, LZ, mat(0x7a6a4a), 60);              // borda de pedra do lago
    // ilha central
    discoY(5.6, PX, 0.18, LZ, mat(0x6a5a3a), 40);                     // ilha (terra)
    discoY(4.4, PX, 0.2, LZ, mat(0x4f7a44), 40);                      // ilha (grama)
    // CORETO (gazebo) no centro da ilha: base, 6 colunas e telhado cônico
    const baseCoreto = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.2, 0.35, 12), mat(0xcfc6b2));
    baseCoreto.position.set(PX, 0.37, LZ); baseCoreto.castShadow = true; scene.add(baseCoreto);
    for (let i = 0; i < 6; i++) {
      const ang = i * Math.PI / 3;
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 1.9, 8), mat(0xe8e2d2));
      col.position.set(PX + Math.cos(ang) * 1.7, 1.3, LZ + Math.sin(ang) * 1.7); scene.add(col);
    }
    const telhado = new THREE.Mesh(new THREE.ConeGeometry(2.4, 1.2, 12), mat(0x7c3030));
    telhado.position.set(PX, 2.9, LZ); telhado.castShadow = true; scene.add(telhado);
    const pinaculo = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 6),
      new THREE.MeshBasicMaterial({ color: 0xffe2a8 }));
    pinaculo.position.set(PX, 3.6, LZ); scene.add(pinaculo);
    colisores.push({ minX: PX - 2.1, maxX: PX + 2.1, minZ: LZ - 2.1, maxZ: LZ + 2.1 });
    arvore(PX - 3.2, LZ + 1, 0.8); arvore(PX + 3.2, LZ - 1, 0.8);

    /* fonte de água: jato no anel do lago, a oeste */
    const baseF = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.6, 0.4, 16), mat(0xb9b3a6));
    baseF.position.set(PX - 9, 0.25, LZ); scene.add(baseF);
    const jato = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.05, 1.6, 8),
      new THREE.MeshPhongMaterial({ color: 0xbfe6f2, transparent: true, opacity: 0.6 }));
    jato.position.set(PX - 9, 1.1, LZ); scene.add(jato);
    colisores.push({ minX: PX - 10.6, maxX: PX - 7.4, minZ: LZ - 1.6, maxZ: LZ + 1.6 });

    /* patos e vitórias-régias na água */
    [[PX + 6, LZ + 3], [PX + 9, LZ - 4], [PX - 5, LZ + 7], [PX + 2, LZ - 8]].forEach(function (p, i) {
      const folha = new THREE.Mesh(new THREE.CircleGeometry(0.5 + (i % 2) * 0.2, 12), mat(0x3a7a4a));
      folha.rotation.x = -Math.PI / 2; folha.position.set(p[0], 0.07, p[1]); scene.add(folha);
    });
    [[PX + 7, LZ + 2], [PX - 4, LZ - 5], [PX + 10, LZ + 5]].forEach(function (p) {
      const corpo = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 6), mat(0xe8e2d2));
      corpo.scale.set(1.3, 0.8, 1); corpo.position.set(p[0], 0.22, p[1]);
      const cab = new THREE.Mesh(new THREE.SphereGeometry(0.12, 7, 6), mat(0xe8e2d2));
      cab.position.set(p[0] + 0.22, 0.4, p[1]);
      const bico = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.14, 6), mat(0xe0a23a));
      bico.rotation.z = -Math.PI / 2; bico.position.set(p[0] + 0.34, 0.4, p[1]);
      scene.add(corpo, cab, bico);
    });

    /* ================= PONTE / DECK até a ilha (sul) ================= */
    for (let i = 0; i < 7; i++) {
      caixa(1.8, 0.14, 1.55, PX, 0.13, -12.5 + i * 1.55, mat(0x7a5634), { semSombra: true, colide: false });
    }
    [[-0.9], [0.9]].forEach(function (l) {
      for (let i = 0; i < 8; i++) {
        caixa(0.06, 0.55, 0.06, PX + l[0], 0.42, -12.7 + i * 1.5, mat(0x55585e), { colide: false, semSombra: true });
        if (i < 7) caixa(0.9, 0.05, 0.05, PX + l[0], 0.62, -11.95 + i * 1.5, mat(0x55585e), { colide: false, semSombra: true });
      }
    });
    pontos.deque = { x: PX, z: -10.5 };

    /* ================= CALÇADÃO: postes, bancos, canteiros, árvores ================= */
    for (let a = 0; a < 16; a++) {
      const ang = (a / 16) * Math.PI * 2;
      arvore(PX + Math.cos(ang) * 24, LZ + Math.sin(ang) * 24, 0.9 + (a % 3) * 0.15);
      if (a % 2 === 0) poste(PX + Math.cos(ang) * 20.4, LZ + Math.sin(ang) * 20.4);
    }
    [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2].forEach(function (ang) {
      banco(PX + Math.cos(ang) * 19.4, LZ + Math.sin(ang) * 19.4, -ang + Math.PI / 2);
    });
    canteiro(PX - 13, LZ - 13); canteiro(PX + 13, LZ - 13);
    canteiro(PX - 13, LZ + 13); canteiro(PX + 13, LZ + 13);
    pontos.banco = { x: PX - 18.6, z: LZ };

    /* ================= PLAYGROUND (sudoeste) ================= */
    const plx = PX - 24, plz = 18;
    piso(plx - 4, plz - 4, plx + 4, plz + 4, mat(0xc9a26a), 0.03);    // areia
    // escorregador
    caixa(0.1, 1.6, 0.1, plx - 1.5, 0.8, plz - 1.5, mat(0x55585e));
    const rampa = caixa(0.7, 0.1, 2.4, plx - 0.6, 1.0, plz - 0.8, mat(0xe05a6a), { colide: false });
    rampa.rotation.x = 0.5;
    caixa(1.0, 1.0, 1.0, plx - 1.5, 0.5, plz - 1.5, mat(0x4a6ab8));    // torre
    // balanços
    caixa(2.4, 0.1, 0.1, plx + 1.5, 1.8, plz, mat(0xf2b53a), { colide: false });
    [[-0.5], [0.5]].forEach(function (l) {
      caixa(0.06, 1.2, 0.06, plx + 1.5 + l[0], 1.2, plz, mat(0x55585e), { colide: false, semSombra: true });
      caixa(0.4, 0.08, 0.3, plx + 1.5 + l[0], 0.6, plz, mat(0xe05a6a), { colide: false });
    });
    caixa(0.12, 1.9, 2.4, plx + 1.5, 0.95, plz, mat(0xf2b53a), { colide: false }); // estrutura
    // gangorra
    const gang = caixa(2.2, 0.1, 0.3, plx, 0.5, plz + 3, mat(0x4a6ab8), { colide: false });
    gang.rotation.z = 0.12;
    placaEm("🛝 PLAYGROUND", plx, 1.6, plz - 3.6, 0, 2.0);
    pontos.playground = { x: plx, z: plz - 3.2 };

    /* ================= QUIOSQUE (lanche/água) — sudeste ================= */
    const qx = PX + 22, qz = -10;
    piso(qx - 3, qz - 3, qx + 3, qz + 3, mat(0xb9b3a6), 0.03);
    [[-2, -2], [2, -2], [-2, 2], [2, 2]].forEach(function (p) {
      caixa(0.16, 2.4, 0.16, qx + p[0], 1.2, qz + p[1], mat(0x7a5634));
    });
    const teto = new THREE.Mesh(new THREE.ConeGeometry(3.4, 1.3, 4), mat(0x8e3a2a));
    teto.rotation.y = Math.PI / 4; teto.position.set(qx, 3.0, qz); teto.castShadow = true; scene.add(teto);
    caixa(3.2, 1.0, 0.7, qx, 0.5, qz - 1.6, mat(0xe8e2d2));            // balcão
    placaEm("☕ QUIOSQUE", qx, 1.7, qz - 1.95, 0, 1.8);
    pontos.quiosque = { x: qx, z: qz + 1.2 };

    /* ================= PERGOLADO com bancos — noroeste ================= */
    const gx = PX - 23, gz = -8;
    for (let i = 0; i < 5; i++) {
      caixa(0.12, 2.3, 0.12, gx - 2, 1.15, gz - 3 + i * 1.5, mat(0x7a5634));
      caixa(0.12, 2.3, 0.12, gx + 2, 1.15, gz - 3 + i * 1.5, mat(0x7a5634));
      caixa(4.4, 0.1, 0.12, gx, 2.35, gz - 3 + i * 1.5, mat(0x6a4a2a), { colide: false });
    }
    banco(gx, gz - 1.5, 0); banco(gx, gz + 1.5, Math.PI);
    placaEm("PERGOLADO", gx, 2.7, gz - 3.6, 0, 1.6);

    /* ================= ENTRADA (volta ao fórum, sul) ================= */
    caixa(0.45, 3.4, 0.45, PX - 4, 1.7, 30, mat(0x6a4a2a));
    caixa(0.45, 3.4, 0.45, PX + 4, 1.7, 30, mat(0x6a4a2a));
    caixa(9.0, 0.6, 0.45, PX, 3.5, 30, mat(0x6a4a2a), { colide: false });
    letreiroEm("PARQUE DA CIDADE", "ACESSO LIVRE", "#2f5a3e", PX, 3.5, 29.7, 0, 5.0, 0.9);
    piso(PX - 2, 30, PX + 2, 34, mat(0x6b675f));
    palmeira(PX - 6, 30); palmeira(PX + 6, 30);
    pontos.portaRua = { x: PX, z: 30.4 };
    pontos.spawnParque = { x: PX, z: 26, angulo: Math.PI };   // entra de frente para o lago

    /* ================= BICICLETÁRIO + a bicicleta do juiz (leste) ================= */
    const bx = PX + 20, bz = 14;
    piso(bx - 2, bz - 2, bx + 2, bz + 2, mat(0xb9b3a6), 0.03);
    caixa(2.6, 0.1, 0.6, bx, 0.05, bz, mat(0x9aa8b0), { colide: false, semSombra: true });
    for (let i = 0; i < 4; i++) {
      caixa(0.06, 0.6, 0.06, bx - 0.9 + i * 0.6, 0.3, bz, mat(0x6a6a70), { colide: false, semSombra: true });
    }
    if (TOGA.bicicleta3d && TOGA.bicicleta3d.criar) {
      const bike = TOGA.bicicleta3d.criar(0x3a8a6a);
      bike.position.set(bx + 0.6, 0, bz + 0.4); bike.rotation.y = -Math.PI / 2;
      scene.add(bike);
      pontos.bicicletaMesh = bike;
    }
    placaEm("🚲 BICICLETÁRIO", bx, 1.5, bz - 1.4, 0, 2.0);
    pontos.bicicleta = { x: bx - 1.4, z: bz };

    /* ================= A ACM, VISÍVEL NA ORLA (norte) ================= */
    // praia + mar ao fundo do parque, e a fachada do Clube dos Magistrados
    const az = -28;                                   // linha da fachada da ACM
    piso(PX - 30, az - 1, PX + 30, az + 5, mat(0xe2cfa0), 0.02);      // faixa de areia
    aguas.push(piso(PX - 36, -40, PX + 36, az - 1, matAgua(12), 0.03)); // o MAR ANIMADO
    [PX - 24, PX - 12, PX + 12, PX + 24].forEach(function (x) { palmeira(x, az + 3.5); });
    // muro/fachada baixa com vão de portão central [PX-2, PX+2]
    const matFach = mat(0xe8e6da);
    caixa(26, 2.8, 0.3, PX - 14, 1.4, az, matFach, { bloqueiaCamera: true });
    caixa(26, 2.8, 0.3, PX + 14, 1.4, az, matFach, { bloqueiaCamera: true });
    // pilares do portão
    caixa(0.6, 3.4, 0.6, PX - 2.4, 1.7, az, mat(0x33424f));
    caixa(0.6, 3.4, 0.6, PX + 2.4, 1.7, az, mat(0x33424f));
    caixa(5.4, 0.6, 0.6, PX, 3.5, az, mat(0x33424f), { colide: false });
    letreiroEm("ACM", "ASSOCIAÇÃO CEARENSE DE MAGISTRADOS · CLUBE — À BEIRA-MAR",
      "#1d3a6e", PX, 3.5, az + 0.32, 0, 5.0, 0.9);
    // o LOGO da ACM na fachada (canvas), virado para quem chega do parque (sul)
    if (TOGA.texturas3d.logoAcm) {
      const logo = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 2.3),
        new THREE.MeshBasicMaterial({ map: TOGA.texturas3d.logoAcm() }));
      logo.position.set(PX - 9, 1.5, az + 0.17); scene.add(logo);
      const logo2 = logo.clone(); logo2.position.set(PX + 9, 1.5, az + 0.17); scene.add(logo2);
    }
    // espreita-se o clube por cima do muro: guarda-sóis e uma lâmina de piscina
    const aguaP = new THREE.Mesh(new THREE.BoxGeometry(7, 0.2, 3), matAgua(2));
    aguaP.position.set(PX + 8, 0.2, az - 3.5); scene.add(aguaP); aguas.push(aguaP);
    [[PX - 8, az - 3], [PX - 4, az - 4], [PX + 13, az - 4]].forEach(function (p, i) {
      const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.6, 6), mat(0x8a8378));
      haste.position.set(p[0], 0.8, p[1]); scene.add(haste);
      const lona = new THREE.Mesh(new THREE.ConeGeometry(1.0, 0.45, 12), mat(i % 2 ? 0xf2b53a : 0xc94f4f));
      lona.position.set(p[0], 1.75, p[1]); scene.add(lona);
    });
    placaEm("🏖 ENTRADA DA ACM", PX, 2.2, az + 0.34, 0, 2.6);
    // grade invisível no vão do portão: entra-se pela interação (hotspot),
    // não atravessando a pé para a praia/mar
    colisores.push({ minX: PX - 1.3, maxX: PX + 1.3, minZ: az - 0.25, maxZ: az + 0.25 });
    pontos.acmGate = { x: PX, z: az + 2.4 };          // hotspot de entrada (gated)
    pontos.acmVista = { x: PX, z: az - 6 };

    /* ================= GENTE NO PARQUE ================= */
    const corredor = npc("corredorParque",
      { pele: "#c98e66", cabelo: "curto", corCabelo: "#241a10", traje: "camisa", corTraje: "#4a6ab8" },
      PX - 12, 24, Math.PI / 2);
    if (corredor) { corredor.setEmocao("feliz"); }
    if (corredor && TOGA.rotinas3d && TOGA.rotinas3d.adicionarRotina) {
      TOGA.rotinas3d.adicionarRotina(corredor, [
        { ir: [{ x: PX + 14, z: 24 }] }, { esperar: 2 },
        { ir: [{ x: PX + 22, z: 0 }, { x: PX + 14, z: -22 }] }, { esperar: 2 },
        { ir: [{ x: PX - 14, z: -22 }, { x: PX - 22, z: 0 }, { x: PX - 12, z: 24 }] }, { esperar: 2 }
      ]);
    }
    npc("sentadoParque",
      { pele: "#8a5436", cabelo: "coque", corCabelo: "#3a2a1a", traje: "vestido", corTraje: "#7a4a3a" },
      PX - 18.6, LZ + 0.6, -Math.PI / 2, { sentado: true });
    const crianca = npc("criancaParque",
      { pele: "#d8a87f", cabelo: "longo", corCabelo: "#241a10", traje: "camisa", corTraje: "#e05a6a" },
      plx, plz + 0.5, 0);
    if (crianca) { crianca.grupo.scale.setScalar(0.62); crianca.setEmocao("feliz"); }
    const passeador = npc("passeadorParque",
      { pele: "#a86a48", cabelo: "calvo", corCabelo: "#9a9388", traje: "camisa", corTraje: "#54453a", barba: true },
      PX + 8, 22, Math.PI);
    if (passeador && TOGA.rotinas3d && TOGA.rotinas3d.adicionarRotina) {
      TOGA.rotinas3d.adicionarRotina(passeador, [
        { ir: [{ x: PX - 8, z: 22 }] }, { esperar: 4 },
        { ir: [{ x: PX + 8, z: 22 }] }, { esperar: 4 }
      ]);
    }

    /* ================= PASSARINHOS voando ================= */
    passaro(PX, LZ, 6.5, 12, 0x33373d);            // sobre o lago
    passaro(PX - 3, LZ + 2, 5.5, 9, 0x5a4a3a);
    passaro(PX + 4, LZ - 3, 7.0, 14, 0x2f3338);
    passaro(PX - 14, -4, 5.0, 7, 0x6a5030);        // sobre as árvores
    passaro(PX + 10, -20, 6.0, 10, 0x33373d);      // rumo à praia
    passaro(PX + 2, -24, 5.0, 8, 0xe8e2d2);        // gaivota na orla

    /* ================= MAIS DETALHE (refino) ================= */
    // pedras decorativas na beira do lago
    for (let i = 0; i < 10; i++) {
      const ang = i * 0.63 + 0.3, r = 17.2 + (i % 3) * 0.3;
      const pedra = new THREE.Mesh(new THREE.SphereGeometry(0.3 + (i % 3) * 0.12, 7, 5),
        mat([0x9a958c, 0x7a6a5a, 0xb9b3a6][i % 3]));
      pedra.scale.y = 0.55; pedra.position.set(PX + Math.cos(ang) * r, 0.14, LZ + Math.sin(ang) * r);
      scene.add(pedra);
    }
    // canteiros de flores extras ao longo da pista
    canteiro(PX - 22, LZ + 22); canteiro(PX + 22, LZ + 22);
    // lixeiras do parque
    [[PX - 16, 24], [PX + 16, 24], [PX, -16]].forEach(function (p) {
      const lx = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.2, 0.7, 10), mat(0x2f5a3e));
      lx.position.set(p[0], 0.35, p[1]); scene.add(lx);
      colisores.push({ minX: p[0] - 0.25, maxX: p[0] + 0.25, minZ: p[1] - 0.25, maxZ: p[1] + 0.25 });
    });
    // totem informativo do parque (placa de interação)
    caixa(0.16, 1.6, 1.1, PX + 6, 0.8, 24, mat(0x5e3f22));
    placaEm("🗺 PARQUE DA CIDADE — MAPA", PX + 6, 1.5, 23.4, 0, 1.8);
    pontos.totem = { x: PX + 6, z: 23 };
    // carrinho de sorvete
    caixa(1.2, 0.9, 0.7, PX - 8, 0.45, 24, mat(0xe8e6da));
    caixa(1.3, 0.12, 0.8, PX - 8, 0.95, 24, mat(0xc94f4f), { colide: false });
    const guardaSol = new THREE.Mesh(new THREE.ConeGeometry(1.1, 0.5, 10), mat(0xf2b53a));
    guardaSol.position.set(PX - 8, 1.9, 24); scene.add(guardaSol);
    caixa(0.05, 1.4, 0.05, PX - 8, 1.2, 24, mat(0x8a8378), { colide: false });
    placaEm("🍦 SORVETE", PX - 8, 1.35, 23.6, 0, 1.0);
    pontos.sorvete = { x: PX - 8, z: 23.2 };

    info = { colisores: colisores, paredesCamera: paredesCamera, pontos: pontos, vivos: vivos, aguas: aguas, passaros: passaros };
    return info;
  }

  return {
    construir: construir,
    get PX() { return PX; },
    get pontos() { return info ? info.pontos : null; }
  };
})();
