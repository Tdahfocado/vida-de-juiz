/* ============================================================
   TOGA 3D — cidade3d.js : A RUA DO FÓRUM
   ------------------------------------------------------------
   A primeira área externa do jogo: a calçada em frente ao
   fórum, com a DELEGACIA na quadra norte e a ESCOLA MUNICIPAL
   na quadra sul. Construída deslocada (x ≈ +200) no MESMO
   scene do fórum — a neblina cobre a distância e o cena3d só
   troca colisores/spawn ao "viajar".

   Tudo segue a linguagem do jogo: blocos, placas de canvas,
   nada de textura externa (file:// não permite).
   ============================================================ */

window.TOGA = window.TOGA || {};

TOGA.cidade3d = (function () {
  if (!window.THREE) return null;

  const RX = 200;                  // centro da rua no eixo x
  const ALTURA = 3.0;
  let construida = false;
  let info = null;

  function mat(cor) { return TOGA.texturas3d.matPlastico(cor); }
  function matTex(tex, rx, ry) {
    const t = tex.clone(); t.needsUpdate = true; t.repeat.set(rx || 1, ry || 1);
    return new THREE.MeshLambertMaterial({ map: t });
  }

  function construir(scene) {
    if (construida) return info;
    construida = true;
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
    function parede(x1, z1, x2, z2, material) {
      const horizontal = Math.abs(x2 - x1) > Math.abs(z2 - z1);
      const w = horizontal ? Math.abs(x2 - x1) : 0.25;
      const d = horizontal ? 0.25 : Math.abs(z2 - z1);
      return caixa(w, ALTURA, d, (x1 + x2) / 2, ALTURA / 2, (z1 + z2) / 2,
                   material, { bloqueiaCamera: true });
    }
    function piso(x1, z1, x2, z2, material, y) {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(Math.abs(x2 - x1), Math.abs(z2 - z1)), material);
      m.rotation.x = -Math.PI / 2;
      // camadas: terreno < asfalto < interiores — alturas distintas
      // matam o z-fighting ("chão tremendo") entre planos sobrepostos
      m.position.set((x1 + x2) / 2, y || 0.005, (z1 + z2) / 2);
      m.receiveShadow = true;
      scene.add(m);
      return m;
    }
    function placaEm(texto, x, y, z, rotY, larg) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(larg || 1.6, 0.4),
        new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.placa(texto),
          polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
      m.position.set(x, y, z); m.rotation.y = rotY || 0;
      scene.add(m);
      return m;
    }
    function arvore(x, z) {
      const tronco = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 1.6, 8), mat(0x5a3a22));
      tronco.position.set(x, 0.8, z); tronco.castShadow = true;
      const copa = new THREE.Mesh(new THREE.SphereGeometry(0.95, 10, 8), mat(0x2f4a3e));
      copa.position.set(x, 2.1, z); copa.castShadow = true;
      scene.add(tronco, copa);
      colisores.push({ minX: x - 0.25, maxX: x + 0.25, minZ: z - 0.25, maxZ: z + 0.25 });
    }
    function poste(x, z) {
      const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 3.6, 8), mat(0x55585e));
      haste.position.set(x, 1.8, z);
      const globo = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 6),
        new THREE.MeshBasicMaterial({ color: 0xffe2a8 }));
      globo.position.set(x, 3.6, z);
      scene.add(haste, globo);
    }
    function carroParado(x, z, cor, rotY) {
      const g = new THREE.Group();
      const corpo = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.5, 3.6), mat(cor));
      corpo.position.y = 0.55; corpo.castShadow = true;
      const cabine = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.5, 1.8), mat(0x222831));
      cabine.position.set(0, 1.0, -0.2); cabine.castShadow = true;
      g.add(corpo, cabine);
      [[-0.85, 1.1], [0.85, 1.1], [-0.85, -1.1], [0.85, -1.1]].forEach(function (p) {
        const roda = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.2, 10), mat(0x15110c));
        roda.rotation.z = Math.PI / 2;
        roda.position.set(p[0], 0.3, p[1]);
        g.add(roda);
      });
      g.position.set(x, 0, z);
      if (rotY) g.rotation.y = rotY;
      scene.add(g);
      colisores.push({ minX: x - 1.1, maxX: x + 1.1, minZ: z - 2, maxZ: z + 2 });
      return g;
    }

    /* ================= O CHÃO DA QUADRA ================= */
    // terreno geral (concreto claro) e a rua asfaltada no meio
    piso(RX - 22, -14, RX + 22, 30, mat(0x55514a));
    piso(RX - 22, 4, RX + 22, 12,
      TOGA.texturas3d.asfalto ? matTex(TOGA.texturas3d.asfalto(), 8, 2) : mat(0x3a3d42), 0.02);
    // meio-fio
    caixa(44, 0.14, 0.3, RX, 0.07, 4, mat(0xb9b3a6), { colide: false, semSombra: true });
    caixa(44, 0.14, 0.3, RX, 0.07, 12, mat(0xb9b3a6), { colide: false, semSombra: true });

    /* ================= O FÓRUM, VISTO DE FORA ================= */
    // fachada norte da quadra (z=2): o prédio de onde o juiz sai
    parede(RX - 8, 2, RX - 0.8, 2);
    parede(RX + 0.8, 2, RX + 8, 2);
    caixa(16, 0.9, 0.3, RX, ALTURA + 0.45, 2, mat(0x6e4a26), { colide: false });
    placaEm("FÓRUM DA COMARCA", RX, 2.6, 2.2, Math.PI, 2.6);
    // escadinha da entrada
    caixa(2.4, 0.16, 1.0, RX, 0.08, 2.7, mat(0xb9b3a6), { colide: false, semSombra: true });
    pontos.portaForum = { x: RX, z: 2.8 };
    // spawn afastado da fachada: com a câmera 3,4 m atrás do juiz,
    // nascer colado na parede enfiava a lente dentro da marquise
    pontos.spawnRua = { x: RX, z: 6.2, angulo: 0 };

    /* ================= DELEGACIA (quadra norte, oeste) ================= */
    const matDeleg = mat(0x8a8f96);
    // bloco x 186..196, z -10..2 — entrada pelo vão [191,192.2] em z=2
    parede(RX - 14, 2, RX - 9, 2, matDeleg);
    parede(RX - 7.8, 2, RX - 8, 2, matDeleg);
    parede(RX - 14, -10, RX - 14, 2, matDeleg);
    parede(RX - 4, -10, RX - 4, 2, matDeleg);     // divisa leste (com o fórum)
    parede(RX - 14, -10, RX - 4, -10, matDeleg);
    // vão da porta: x ∈ [RX-9, RX-7.8]  (1,2 m)
    placaEm("DELEGACIA DE POLÍCIA CIVIL", RX - 8.4, 2.6, 2.2, Math.PI, 2.4);
    caixa(0.4, 1.4, 0.4, RX - 13.4, 0.7, 2.6, mat(0x2a3d7c), { colide: false }); // totem azul
    // interior: piso frio
    piso(RX - 14, -10, RX - 4, 2, mat(0x5e6166), 0.04);
    // recepção: balcão + bandeira
    caixa(3.2, 1.05, 0.6, RX - 8.5, 0.52, -0.6, mat(0x4a4f57));
    // cela de custódia digna (grade ao fundo oeste)
    for (let i = 0; i <= 8; i++) {
      caixa(0.07, 2.2, 0.07, RX - 13.2 + i * 0.45, 1.1, -6.5, mat(0x44505a), { colide: i === 0 });
    }
    colisores.push({ minX: RX - 13.4, maxX: RX - 9.2, minZ: -6.7, maxZ: -6.3 });
    caixa(1.6, 0.45, 0.7, RX - 12.2, 0.22, -8.6, mat(0x55585e)); // banco da cela
    placaEm("CUSTÓDIA — CAPACIDADE 4", RX - 11.2, 2.3, -6.3, 0, 1.8);
    // sala de provas: mesa com sacos lacrados
    caixa(2.2, 0.8, 1.0, RX - 6, 0.4, -7.5, mat(0x4a3018));
    caixa(0.5, 0.3, 0.4, RX - 6.5, 0.95, -7.5, mat(0xb9d2e0), { colide: false });
    caixa(0.5, 0.25, 0.4, RX - 5.6, 0.92, -7.4, mat(0xd8c84a), { colide: false });
    placaEm("CADEIA DE CUSTÓDIA — CPP 158-A", RX - 6, 2.1, -9.8, 0, 2.6);
    /* ---- SALA DE OITIVA (canto leste-norte): depoimento DIGNO,
       gravado em vídeo — mesa, cadeiras frente a frente, câmera ---- */
    parede(RX - 7.2, -4, RX - 4, -4, matDeleg);
    parede(RX - 7.2, -4, RX - 7.2, -1, matDeleg);   // vão de entrada z −1..2... (norte aberto)
    caixa(1.4, 0.78, 0.8, RX - 5.6, 0.39, -2.2, mat(0x4a4f57));
    caixa(0.5, 0.5, 0.5, RX - 5.6, 0.25, -1.3, mat(0x2a2d33), { colide: false });
    caixa(0.5, 0.5, 0.5, RX - 5.6, 0.25, -3.1, mat(0x2a2d33), { colide: false });
    // a câmera de gravação no alto, com a luzinha vermelha
    caixa(0.22, 0.14, 0.3, RX - 4.4, 2.5, -3.6, mat(0x22262c), { colide: false, semSombra: true });
    const luzRec = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 5),
      new THREE.MeshBasicMaterial({ color: 0xc94f4f }));
    luzRec.position.set(RX - 4.5, 2.44, -3.45);
    scene.add(luzRec);
    placaEm("SALA DE OITIVA — DEPOIMENTO GRAVADO", RX - 5.6, 2.2, -3.85, 0, 2.6);
    pontos.oitiva = { x: RX - 5.6, z: -2.2 };

    /* ---- INVESTIGAÇÃO (canto oeste-norte): mesas, monitores e o
       quadro da operação na parede ---- */
    parede(RX - 14, -4, RX - 11, -4, matDeleg);
    parede(RX - 10, -4, RX - 10, -2.2, matDeleg);   // vão de entrada ao sul
    caixa(1.6, 0.74, 0.7, RX - 12.6, 0.37, -2.4, mat(0x4a4f57));
    caixa(0.55, 0.38, 0.05, RX - 12.6, 1.0, -2.6, mat(0x15110c), { colide: false, semSombra: true });
    caixa(0.5, 0.5, 0.5, RX - 12.6, 0.25, -1.6, mat(0x2a2d33), { colide: false });
    if (TOGA.texturas3d.letreiro) {
      const quadroOp = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 1.2),
        new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.letreiro(
          "OPERAÇÃO MARESIA", "#33373d", "#e8e6da", "EM APURAÇÃO — SIGILOSO") }));
      quadroOp.position.set(RX - 13.85, 1.8, -1.4);
      quadroOp.rotation.y = Math.PI / 2;
      scene.add(quadroOp);
    }
    pontos.investigacao = { x: RX - 12.4, z: -1.2 };
    pontos.quadroOperacao = { x: RX - 13.2, z: -1.4 };

    // mural DISQUE 181 + cantinho do café do plantão (na recepção)
    if (TOGA.texturas3d.letreiro) {
      const m181 = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.9),
        new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.letreiro(
          "DISQUE 181", "#2a3d7c", "#f4ecd9", "DENÚNCIA ANÔNIMA — SIGILO ABSOLUTO") }));
      m181.position.set(RX - 4.15, 1.8, -0.5);
      m181.rotation.y = -Math.PI / 2;
      scene.add(m181);
    }
    caixa(0.9, 0.9, 0.5, RX - 6.6, 0.45, 1.6, mat(0x55585e));
    caixa(0.24, 0.34, 0.24, RX - 6.6, 1.07, 1.6, mat(0x222222), { colide: false }); // a garrafa eterna
    pontos.cafeDelegacia = { x: RX - 6.6, z: 0.8 };
    // kit de lacres da cadeia de custódia, na sala de provas
    caixa(0.5, 0.18, 0.36, RX - 6.6, 0.9, -7.6, mat(0xd8c84a), { colide: false, semSombra: true });
    pontos.kitLacres = { x: RX - 6.6, z: -7.0 };
    pontos.salaProvas = { x: RX - 6, z: -6.6 };

    pontos.delegaciaPorta = { x: RX - 8.4, z: 2.6 };
    pontos.delegada = { x: RX - 8.5, z: -1.6 };

    /* ================= ESCOLA (quadra sul) ================= */
    // muro colorido x 204..214, z 14..26 — portão no vão [208.4, 209.6]
    const matMuro = mat(0xd8a44a);
    parede(RX + 4, 14, RX + 8.4, 14, matMuro);
    parede(RX + 9.6, 14, RX + 14, 14, matMuro);
    parede(RX + 4, 14, RX + 4, 26, matMuro);
    parede(RX + 14, 14, RX + 14, 26, matMuro);
    parede(RX + 4, 26, RX + 14, 26, matMuro);
    placaEm("ESCOLA MUNICIPAL CHICO ALBUQUERQUE", RX + 9, 2.6, 13.8, 0, 3.4);
    // peixes pintados no muro (homenagem ao fotógrafo dos jangadeiros)
    [[RX + 5.5], [RX + 11.8]].forEach(function (p, i) {
      const peixe = new THREE.Mesh(new THREE.CircleGeometry(0.5, 3),
        new THREE.MeshBasicMaterial({ color: i ? 0x4a6ab8 : 0xc94f4f }));
      peixe.position.set(p[0], 1.6, 13.86); peixe.rotation.z = 0.5;
      scene.add(peixe);
    });
    // pátio (piso colorido) + sala ao fundo
    piso(RX + 4, 14, RX + 14, 26, mat(0x5e7a44), 0.04);
    piso(RX + 5, 20, RX + 13, 26, mat(0xa07f44), 0.055);
    parede(RX + 5, 20, RX + 8.4, 20, mat(0xe8e6da));
    parede(RX + 9.6, 20, RX + 13, 20, mat(0xe8e6da));
    placaEm("4º ANO A", RX + 9, 2.4, 19.8, 0, 1.2);
    // carteiras da sala (3×2) + quadro-negro
    for (let cx = 0; cx < 3; cx++) for (let cz = 0; cz < 2; cz++) {
      caixa(0.8, 0.62, 0.5, RX + 6.0 + cx * 1.6, 0.31, 22.4 + cz * 1.5, mat(0xb98b4a));
    }
    caixa(2.6, 1.4, 0.1, RX + 8, 1.6, 25.8, mat(0x2f4a3e), { colide: false });

    /* ---- CANTINHO DE LEITURA (divisória a leste da sala) ---- */
    parede(RX + 10.6, 20, RX + 10.6, 22.4, mat(0xe8e6da));
    parede(RX + 10.6, 23.6, RX + 10.6, 26, mat(0xe8e6da));   // vão z 22.4..23.6
    piso(RX + 10.7, 20, RX + 14, 26, mat(0xc96a4a), 0.055);  // tapete terracota
    caixa(1.8, 0.9, 0.4, RX + 13.4, 0.45, 25.4, mat(0xd8a44a));  // estante baixa
    [[-0.5, 0x7c3030], [0, 0x2a3d7c], [0.5, 0x2f4a3e]].forEach(function (l) {
      caixa(0.3, 0.24, 0.1, RX + 13.4 + l[0], 1.02, 25.4, mat(l[1]), { colide: false, semSombra: true });
    });
    // almofadas coloridas no tapete
    [[RX + 11.8, 22.2, 0xc94f4f], [RX + 12.8, 23.0, 0x4a6ab8], [RX + 11.6, 24.2, 0xd8a44a]].forEach(function (p) {
      const alm = new THREE.Mesh(new THREE.SphereGeometry(0.34, 10, 6), mat(p[2]));
      alm.scale.y = 0.42;
      alm.position.set(p[0], 0.16, p[1]);
      scene.add(alm);
    });
    placaEm("CANTINHO DE LEITURA", RX + 12.3, 2.2, 20.2, 0, 2.0);
    pontos.cantinhoLeitura = { x: RX + 12.2, z: 23.2 };

    /* ---- o pátio ganha vida: amarelinha, horta, mural, varal ---- */
    // amarelinha pintada no chão
    [[0, 0], [0, 0.85], [-0.45, 1.7], [0.45, 1.7], [0, 2.55], [-0.45, 3.4], [0.45, 3.4], [0, 4.25]].forEach(function (c, i) {
      caixa(0.74, 0.015, 0.74, RX + 9.6 + c[0], 0.045, 15.2 + c[1], mat(0xe8e6da), { colide: false, semSombra: true });
      caixa(0.6, 0.018, 0.6, RX + 9.6 + c[0], 0.05, 15.2 + c[1], mat([0xc94f4f, 0x4a6ab8, 0xd8a44a, 0x2f4a3e][i % 4]), { colide: false, semSombra: true });
    });
    pontos.amarelinha = { x: RX + 9.6, z: 17.2 };
    // horta do 4º ano, junto ao muro leste
    [[14.7], [18.4]].forEach(function (h) {
      caixa(1.8, 0.3, 0.9, RX + 12.9, 0.15, h[0], mat(0x6e3a26));
      for (let i = 0; i < 3; i++) {
        const pe = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.4, 6), mat(0x2f4a3e));
        pe.position.set(RX + 12.3 + i * 0.6, 0.5, h[0]);
        scene.add(pe);
      }
    });
    pontos.horta = { x: RX + 11.2, z: 14.7 };
    // mural de desenhos das crianças, na parede da sala
    if (TOGA.texturas3d.quadro) {
      [[RX + 5.8, 3], [RX + 6.9, 4], [RX + 11.2, 1]].forEach(function (q) {
        const des = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.55),
          new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.quadro(q[1]) }));
        des.position.set(q[0], 1.5, 19.84);
        scene.add(des);
      });
      const desJuiz = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.7),
        new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.desenhoSuperJuiz
          ? TOGA.texturas3d.desenhoSuperJuiz() : null }));
      desJuiz.position.set(RX + 10.0, 1.55, 19.84);
      scene.add(desJuiz);
    }
    pontos.muralDesenhos = { x: RX + 9, z: 19.2 };
    // varal de bandeirinhas cruzando o pátio
    const fio = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 9.6, 4), mat(0x55585e));
    fio.rotation.z = Math.PI / 2;
    fio.rotation.y = 0.32;
    fio.position.set(RX + 9, 2.7, 17);
    scene.add(fio);
    for (let i = 0; i < 9; i++) {
      const band = new THREE.Mesh(new THREE.CircleGeometry(0.2, 3),
        new THREE.MeshBasicMaterial({ color: [0xc94f4f, 0x4a6ab8, 0xd8a44a, 0x2f4a3e][i % 4], side: THREE.DoubleSide }));
      band.position.set(RX + 4.8 + i * 1.05, 2.5, 17 - (i - 4) * 0.34);
      band.rotation.z = Math.PI;
      scene.add(band);
    }
    // bebedouro baixinho (altura de criança)
    caixa(0.4, 0.7, 0.35, RX + 4.7, 0.35, 18.6, mat(0x9aa8b0));
    pontos.bebedouroEscola = { x: RX + 4.7, z: 18.0 };
    // mesa da merenda
    caixa(2.0, 0.8, 0.8, RX + 7.4, 0.4, 14.8, mat(0xb98b4a));
    pontos.merenda = { x: RX + 7.4, z: 15.7 };
    // balanço e gangorra no pátio
    caixa(0.1, 1.8, 0.1, RX + 5.8, 0.9, 16.5, mat(0x8a8f96));
    caixa(0.1, 1.8, 0.1, RX + 7.0, 0.9, 16.5, mat(0x8a8f96));
    caixa(1.3, 0.06, 0.06, RX + 6.4, 1.78, 16.5, mat(0x8a8f96), { colide: false });
    caixa(0.4, 0.06, 0.3, RX + 6.4, 0.9, 16.5, mat(0xc94f4f), { colide: false });
    caixa(2.2, 0.1, 0.3, RX + 11.5, 0.5, 16.5, mat(0x4a6ab8), { rotY: 0, colide: false });
    caixa(0.3, 0.5, 0.3, RX + 11.5, 0.25, 16.5, mat(0x8a8f96));
    pontos.escolaPorta = { x: RX + 9, z: 13.4 };
    pontos.professora = { x: RX + 9, z: 21 };

    /* ================= A RUA VIVA ================= */
    arvore(RX - 17, 13.2); arvore(RX - 2, 13.2); arvore(RX + 17, 13.2);
    arvore(RX - 17, 2.8); arvore(RX + 11, 2.8);
    poste(RX - 8, 12.6); poste(RX + 8, 3.4); poste(RX + 16, 12.6);
    carroParado(RX - 15, 5.6, 0xb9b3a6, 0);
    carroParado(RX + 13, 10.4, 0x7c3030, Math.PI);
    // O CARRO DO JUIZ: sedã sóbrio — o ponto de interação fica na
    // PORTA do motorista (o centro caía dentro do colisor do carro
    // e o E nunca alcançava)
    pontos.carroJuiz = { x: RX + 6.2, z: 5.8 };
    carroParado(RX + 4.5, 5.6, 0x33424f, 0);
    placaEm("ESMEC ➔", RX + 19.6, 2.4, 8, -Math.PI / 2, 1.4);
    // (o Parque da Cidade NÃO fica na rua: entra-se por uma porta no fim
    //  do corredor leste do fórum, para não confundir com o estacionamento
    //  da Delegacia e da Escola)

    // faixa de pedestres ligando as duas calçadas
    for (let i = 0; i < 5; i++) {
      caixa(0.5, 0.02, 7.6, RX - 0.0 + (i - 2) * 0.95, 0.045, 8, mat(0xd8d4c8),
        { colide: false, semSombra: true });
    }

    /* ================= TETOS dos interiores ================= */
    [[RX - 14, -10, RX - 4, 2], [RX + 5, 20, RX + 13, 26]].forEach(function (t) {
      const teto = new THREE.Mesh(
        new THREE.PlaneGeometry(Math.abs(t[2] - t[0]), Math.abs(t[3] - t[1])),
        new THREE.MeshLambertMaterial({ color: 0xd8d4c8 }));
      teto.rotation.x = Math.PI / 2;
      teto.position.set((t[0] + t[2]) / 2, ALTURA, (t[1] + t[3]) / 2);
      scene.add(teto);
    });

    /* ================= GENTE NA RUA ================= */
    function npc(id, av, x, z, rotY, opcoes) {
      const b = TOGA.boneco3d.criar({ id: id, avatar: av }, opcoes || {});
      b.grupo.position.set(x, 0, z);
      b.grupo.rotation.y = rotY || 0;
      scene.add(b.grupo);
      vivos.push(b);
      return b;
    }
    // a delegada Dra. Socorro Andrade — circula entre o balcão,
    // o quadro da operação e a cela (a casa é dela)
    pontos.npcDelegada = npc("delegada",
      { pele: "#a86a48", cabelo: "coque", corCabelo: "#241a10",
        traje: "blazer", corTraje: "#2b3340", corBlusa: "#cfd8cf" },
      RX - 8.5, -1.4, Math.PI);
    if (TOGA.rotinas3d && TOGA.rotinas3d.adicionarRotina) {
      TOGA.rotinas3d.adicionarRotina(pontos.npcDelegada, [
        { esperar: 12 },
        { segurar: ["autos", "esq"] },
        { ir: [{ x: RX - 12.2, z: -1.2 }] },         // confere o quadro da operação
        { acao: "lerPapel" },
        { segurar: [null, "esq"] },
        { ir: [{ x: RX - 9.4, z: -5.4 }] },          // olha a custódia
        { esperar: 6 },
        { ir: [{ x: RX - 8.5, z: -1.4 }] },
        { esperar: 14 }
      ]);
    }
    // plantonista na recepção
    npc("plantonista",
      { pele: "#c98e66", cabelo: "curto", corCabelo: "#241a10", traje: "camisa", corTraje: "#2b3340" },
      RX - 11.5, -1.2, Math.PI / 2, { quepe: true });
    // a escrivã da investigação, digitando
    const escriva = npc("escrivaInvest",
      { pele: "#d8a87f", cabelo: "longo", corCabelo: "#3a2a1a", traje: "camisa", corTraje: "#4a5a6e", oculos: true },
      RX - 12.6, -1.7, Math.PI, { sentado: true });
    if (TOGA.rotinas3d && TOGA.rotinas3d.adicionarRotina) {
      TOGA.rotinas3d.adicionarRotina(escriva, [
        { esperar: 8 },
        { acao: "lerPapel" },
        { esperar: 11 }
      ]);
    }
    // o policial de RONDA: recepção → provas → cela → volta
    const ronda = npc("policialRonda",
      { pele: "#8a5436", cabelo: "curto", corCabelo: "#241a10", traje: "camisa", corTraje: "#2b3340" },
      RX - 9.5, 0.8, Math.PI, { quepe: true });
    if (TOGA.rotinas3d && TOGA.rotinas3d.adicionarRotina) {
      TOGA.rotinas3d.adicionarRotina(ronda, [
        { esperar: 9 },
        { ir: [{ x: RX - 6.2, z: -1.0 }, { x: RX - 6.0, z: -5.6 }] },   // sala de provas
        { esperar: 5 },
        { ir: [{ x: RX - 9.5, z: -5.4 }] },                              // frente da cela
        { esperar: 7 },
        { ir: [{ x: RX - 11.4, z: -2.2 }, { x: RX - 9.5, z: 0.8 }] },
        { esperar: 11 }
      ]);
    }
    // um cidadão registrando ocorrência no balcão
    const queixoso = npc("queixosoBO",
      { pele: "#c98e66", cabelo: "calvo", corCabelo: "#9a9388", traje: "camisa", corTraje: "#7a6248", barba: true },
      RX - 8.5, 0.4, Math.PI);
    queixoso.setEmocao("triste");
    // a professora Francisca — vai e volta entre a sala e o pátio
    pontos.npcProfessora = npc("professora",
      { pele: "#8a5436", cabelo: "coque", corCabelo: "#3a2a1a", traje: "vestido", corTraje: "#7a4a3a", oculos: true },
      RX + 9, 21.2, Math.PI);
    if (TOGA.rotinas3d && TOGA.rotinas3d.adicionarRotina) {
      TOGA.rotinas3d.adicionarRotina(pontos.npcProfessora, [
        { esperar: 13 },
        { ir: [{ x: RX + 9, z: 18.6 }, { x: RX + 6.6, z: 17.6 }] },   // olha o recreio
        { esperar: 8 },
        { ir: [{ x: RX + 9, z: 18.6 }, { x: RX + 9, z: 21.2 }] },
        { rot: Math.PI },
        { esperar: 15 }
      ]);
    }
    // a merendeira, tia Zefinha, com o tabuleiro
    const merendeira = npc("merendeira",
      { pele: "#a86a48", cabelo: "coque", corCabelo: "#b9b3a6", traje: "vestido", corTraje: "#2f4a3e" },
      RX + 7.4, 14.2, 0);
    merendeira.segurar("pao", "esq");
    // a diretora circula entre o portão e a sala
    const diretora = npc("diretoraEscola",
      { pele: "#8a5436", cabelo: "longo", corCabelo: "#241a10", traje: "blazer", corTraje: "#5a4a52", oculos: true },
      RX + 9, 14.6, Math.PI);
    if (TOGA.rotinas3d && TOGA.rotinas3d.adicionarRotina) {
      TOGA.rotinas3d.adicionarRotina(diretora, [
        { esperar: 10 },
        { ir: [{ x: RX + 11.6, z: 18.0 }] },          // confere a horta
        { esperar: 7 },
        { ir: [{ x: RX + 9.0, z: 16.4 }, { x: RX + 9, z: 14.6 }] },
        { rot: Math.PI },
        { esperar: 12 }
      ]);
    }
    // o PEGA-PEGA: duas crianças correndo em circuito no pátio
    [["#c94f4f", 0], ["#4a6ab8", 4]].forEach(function (cfg, i) {
      const correndo = npc("criancaCorrendo" + i,
        { pele: ["#d8a87f", "#8a5436"][i], cabelo: i ? "curto" : "longo",
          corCabelo: "#241a10", traje: "camisa", corTraje: cfg[0] },
        RX + 5.4 + i * 2, 18.6, 0);
      correndo.grupo.scale.setScalar(0.62);
      correndo.setEmocao("feliz");
      if (TOGA.rotinas3d && TOGA.rotinas3d.adicionarRotina) {
        TOGA.rotinas3d.adicionarRotina(correndo, [
          { esperar: 2 + cfg[1] },
          { ir: [{ x: RX + 5.2, z: 15.6 }, { x: RX + 8.6, z: 16.2 }, { x: RX + 10.6, z: 18.8 }] },
          { esperar: 1 },
          { ir: [{ x: RX + 7.8, z: 19.2 }, { x: RX + 5.4, z: 18.6 }] },
          { esperar: 2 }
        ]);
      }
    });
    // uma criança lendo no cantinho
    const lendo = npc("criancaLendo",
      { pele: "#c98e66", cabelo: "coque", corCabelo: "#241a10", traje: "camisa", corTraje: "#2f4a3e" },
      RX + 11.9, 22.4, 0.8, { sentado: true });
    lendo.grupo.scale.setScalar(0.62);
    lendo.segurar("autos", "esq");
    // crianças no pátio e na sala
    [[RX + 6.4, 17.4, 0.4, "#c94f4f"], [RX + 11.4, 17.2, -0.7, "#4a6ab8"],
     [RX + 7.4, 22.0, 0, "#2f4a3e"], [RX + 10.6, 22.0, 0, "#d8a44a"]].forEach(function (p, i) {
      const c = npc("criancaEscola" + i,
        { pele: ["#d8a87f", "#a86a48", "#8a5436", "#c98e66"][i], cabelo: i % 2 ? "curto" : "longo",
          corCabelo: "#241a10", traje: "camisa", corTraje: p[3] }, p[0], p[1], p[2]);
      c.grupo.scale.setScalar(0.62);
      c.setEmocao("feliz");
    });
    // um transeunte esperando na faixa e um casal passeando na calçada
    npc("transeunte",
      { pele: "#d8a87f", cabelo: "calvo", corCabelo: "#9a9388", traje: "camisa", corTraje: "#54453a", barba: true },
      RX - 1.6, 12.8, 0);
    const passeante = npc("passeanteRua",
      { pele: "#a86a48", cabelo: "longo", corCabelo: "#3a2a1a", traje: "vestido", corTraje: "#5a4a52" },
      RX - 18, 13, Math.PI / 2);
    if (TOGA.rotinas3d && TOGA.rotinas3d.adicionarRotina) {
      TOGA.rotinas3d.adicionarRotina(passeante, [
        { ir: [{ x: RX + 16, z: 13 }] },
        { esperar: 6 },
        { ir: [{ x: RX - 18, z: 13 }] },
        { esperar: 8 }
      ]);
    }

    info = { colisores: colisores, paredesCamera: paredesCamera, pontos: pontos, vivos: vivos };
    return info;
  }

  return {
    construir: construir,
    get RX() { return RX; },
    get pontos() { return info ? info.pontos : null; }
  };
})();
