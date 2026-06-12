/* ============================================================
   TOGA 3D — esmec3d.js : A ESCOLA SUPERIOR DA MAGISTRATURA
   ------------------------------------------------------------
   Reconstrução fiel (em linguagem de blocos) da sede real da
   ESMEC, a partir de fotografias:

   - corpo central CURVO em granito rosado, letreiro ESMEC no
     alto e testeira vermelha "Des. Júlio Carlos de Miranda
     Bezerra" sobre a cortina de vidro escuro;
   - alas laterais salmão com frisos verticais vermelhos;
   - jardim com palmeiras, vasos brancos, rampa com corrimão
     e estacionamento frontal (onde o juiz estaciona);
   - hall de porcelanato claro com faixas de granito em
     diagonal, vitrine do memorial, nicho iluminado e galeria
     de retratos;
   - auditório com poltronas vinho, faixa vermelha no piso,
     púlpito de acrílico, telões e brises altos.

   Construída em x ≈ +400 no mesmo scene (a neblina separa).
   ============================================================ */

window.TOGA = window.TOGA || {};

TOGA.esmec3d = (function () {
  if (!window.THREE) return null;

  const EX = 400;                 // centro da ESMEC no eixo x
  const ALTURA = 3.4;
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
    function parede(x1, z1, x2, z2, material, altura) {
      const horizontal = Math.abs(x2 - x1) > Math.abs(z2 - z1);
      const w = horizontal ? Math.abs(x2 - x1) : 0.25;
      const d = horizontal ? 0.25 : Math.abs(z2 - z1);
      const h = altura || ALTURA;
      return caixa(w, h, d, (x1 + x2) / 2, h / 2, (z1 + z2) / 2,
                   material, { bloqueiaCamera: true });
    }
    function piso(x1, z1, x2, z2, material, y) {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(Math.abs(x2 - x1), Math.abs(z2 - z1)), material);
      m.rotation.x = -Math.PI / 2;
      // alturas em camadas (terreno < asfalto < interiores): sem z-fighting
      m.position.set((x1 + x2) / 2, y || 0.005, (z1 + z2) / 2);
      m.receiveShadow = true;
      scene.add(m);
      return m;
    }
    function palmeira(x, z) {
      const tronco = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.16, 3.2, 8), mat(0x8a6a4a));
      tronco.position.set(x, 1.6, z); tronco.castShadow = true;
      scene.add(tronco);
      for (let i = 0; i < 6; i++) {
        const folha = new THREE.Mesh(new THREE.ConeGeometry(0.16, 1.7, 5), mat(0x3f6a3e));
        const ang = i * Math.PI / 3;
        folha.position.set(x + Math.cos(ang) * 0.75, 3.3, z + Math.sin(ang) * 0.75);
        folha.rotation.z = Math.cos(ang) * 1.25;
        folha.rotation.x = -Math.sin(ang) * 1.25;
        scene.add(folha);
      }
      colisores.push({ minX: x - 0.22, maxX: x + 0.22, minZ: z - 0.22, maxZ: z + 0.22 });
    }
    function vasoBranco(x, z) {
      const vaso = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.22, 0.55, 10), mat(0xe8e6da));
      vaso.position.set(x, 0.27, z); vaso.castShadow = true;
      const planta = new THREE.Mesh(new THREE.SphereGeometry(0.34, 8, 6), mat(0x2f4a3e));
      planta.position.set(x, 0.75, z);
      scene.add(vaso, planta);
      colisores.push({ minX: x - 0.3, maxX: x + 0.3, minZ: z - 0.3, maxZ: z + 0.3 });
    }

    const granito = TOGA.texturas3d.granitoRosa
      ? matTex(TOGA.texturas3d.granitoRosa(), 2, 1) : mat(0xb08572);
    const salmao = mat(0xd99a8a);
    const vidroEscuro = new THREE.MeshPhongMaterial({
      color: 0x10141c, shininess: 90, specular: 0x6a7a96 });

    /* ============ TERRENO E ESTACIONAMENTO (frente, z<14) ============ */
    piso(EX - 26, -6, EX + 26, 40, mat(0x6b675f));                       // calçadão
    piso(EX - 22, -4, EX + 22, 8,
      TOGA.texturas3d.asfalto ? matTex(TOGA.texturas3d.asfalto(), 8, 2) : mat(0x3a3d42), 0.02);
    // vagas demarcadas (a vaga do juiz é a pintada de verde-claro)
    for (let i = 0; i < 6; i++) {
      caixa(0.1, 0.02, 4.4, EX - 12.5 + i * 5, 0.055, 5.8, mat(0xd8d4c8), { colide: false, semSombra: true });
    }
    pontos.vaga = { x: EX - 10, z: 5.8 };
    caixa(4.6, 0.015, 4.2, EX - 10, 0.045, 5.8, mat(0x86ab95), { colide: false, semSombra: true });
    // o carro do juiz já estacionado (a viagem terminou aqui)
    pontos.carro = { x: EX - 10, z: 5.6 };

    // jardim: palmeiras na alameda + vasos brancos na entrada
    palmeira(EX - 16, 10.5); palmeira(EX - 8, 10.8); palmeira(EX + 8, 10.8);
    palmeira(EX + 16, 10.5); palmeira(EX - 20, 16); palmeira(EX + 20, 16);
    vasoBranco(EX - 4.6, 12.6); vasoBranco(EX + 4.6, 12.6);
    // rampa de acessibilidade com corrimãos metálicos
    caixa(3.2, 0.16, 2.6, EX - 7.5, 0.08, 12.6, mat(0xb9b3a6), { colide: false, semSombra: true });
    [[-1.4], [1.4]].forEach(function (l) {
      caixa(0.05, 0.5, 2.4, EX - 7.5 + l[0], 0.45, 12.6, mat(0xc9ccd2), { colide: false });
    });
    // lixeiras pretas
    [[EX - 3.2, 13.2], [EX + 3.2, 13.2]].forEach(function (p) {
      caixa(0.34, 0.62, 0.34, p[0], 0.31, p[1], mat(0x22262c));
    });

    /* ============ A FACHADA (linha z=14) ============ */
    // alas laterais salmão, mais baixas, com frisos verticais vermelhos
    parede(EX - 22, 14, EX - 7, 14, salmao, 2.7);
    parede(EX + 7, 14, EX + 22, 14, salmao, 2.7);
    [[-19, -15, -11], [11, 15, 19]].forEach(function (lado) {
      lado.forEach(function (fx) {
        caixa(0.5, 2.7, 0.34, EX + fx, 1.35, 14, mat(0x9c2b22), { colide: false });
      });
    });
    // muros de fechamento lateral e fundo do lote
    parede(EX - 22, 14, EX - 22, 38, salmao, 2.7);
    parede(EX + 22, 14, EX + 22, 38, salmao, 2.7);
    parede(EX - 22, 38, EX + 22, 38, salmao, 2.7);

    // CORPO CENTRAL CURVO em granito rosado (x −7..+7), convexo
    // para a rua: segmentos formando o arco, mais altos que as alas
    const SEG = 7;
    for (let i = 0; i < SEG; i++) {
      const t0 = i / SEG, t1 = (i + 1) / SEG;
      const a0 = (t0 - 0.5) * Math.PI * 0.62, a1 = (t1 - 0.5) * Math.PI * 0.62;
      const r = 11;
      const x0 = EX + Math.sin(a0) * r, z0 = 14 + 3.4 - Math.cos(a0) * 3.4 + (Math.cos(a0) - 1) * 0;
      const x1 = EX + Math.sin(a1) * r, z1 = 14 + 3.4 - Math.cos(a1) * 3.4;
      // segmento superior (acima do portal de vidro): granito
      const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2 - 1.2;
      const w = Math.hypot(x1 - x0, z1 - z0);
      const seg = new THREE.Mesh(new THREE.BoxGeometry(w + 0.12, 2.4, 0.35), granito);
      seg.position.set(cx, 4.6, cz);
      seg.rotation.y = -Math.atan2(z1 - z0, x1 - x0);
      seg.castShadow = true;
      scene.add(seg);
      paredesCamera.push(seg);
    }
    // letreiro ESMEC no alto da curva
    const letreiro = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 1.1),
      new THREE.MeshLambertMaterial({
        map: TOGA.texturas3d.letreiro ? TOGA.texturas3d.letreiro("E S M E C", "#b08572", "#2b2118") : null,
        polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
    letreiro.position.set(EX, 5.0, 12.45);
    letreiro.rotation.y = Math.PI;
    scene.add(letreiro);

    // testeira VERMELHA com o nome do patrono, sobre o portal
    const testeira = new THREE.Mesh(new THREE.PlaneGeometry(10.5, 1.0),
      new THREE.MeshLambertMaterial({
        map: TOGA.texturas3d.letreiro
          ? TOGA.texturas3d.letreiro("DES. JÚLIO CARLOS DE MIRANDA BEZERRA", "#8e1f1a", "#f4ecd9",
              "ESCOLA SUPERIOR DA MAGISTRATURA DO ESTADO DO CEARÁ")
          : null }));
    testeira.position.set(EX, 3.35, 13.3);
    testeira.rotation.y = Math.PI;
    scene.add(testeira);

    // PORTAL DE VIDRO ESCURO recuado (a cortina de vidro das fotos),
    // com o vão da porta no centro [EX-0.8, EX+0.8]
    const vidroEsq = new THREE.Mesh(new THREE.BoxGeometry(5.2, 2.8, 0.15), vidroEscuro);
    vidroEsq.position.set(EX - 3.4, 1.4, 14);
    scene.add(vidroEsq);
    paredesCamera.push(vidroEsq);
    colisores.push({ minX: EX - 6, maxX: EX - 0.8, minZ: 13.85, maxZ: 14.15 });
    const vidroDir = vidroEsq.clone();
    vidroDir.position.x = EX + 3.4;
    scene.add(vidroDir);
    paredesCamera.push(vidroDir);
    colisores.push({ minX: EX + 0.8, maxX: EX + 6, minZ: 13.85, maxZ: 14.15 });
    // caixilhos pretos
    [[-0.85], [0.85]].forEach(function (l) {
      caixa(0.1, 2.8, 0.2, EX + l[0], 1.4, 14, mat(0x15110c), { colide: false });
    });
    pontos.entrada = { x: EX, z: 13 };
    pontos.spawnEsmec = { x: EX - 10, z: 7.6, angulo: Math.PI };   // desce do carro

    /* ============ O HALL (z 14..24) ============ */
    piso(EX - 12, 14, EX + 12, 24,
      TOGA.texturas3d.pisoEsmec ? matTex(TOGA.texturas3d.pisoEsmec(), 6, 3) : mat(0xe8e6e0), 0.04);
    // paredes laterais com VÃOS: biblioteca a oeste, laboratório a leste
    parede(EX - 12, 14, EX - 12, 18.4, mat(0xe8e6da));
    parede(EX - 12, 19.6, EX - 12, 24, mat(0xe8e6da));
    parede(EX + 12, 14, EX + 12, 18.4, mat(0xe8e6da));
    parede(EX + 12, 19.6, EX + 12, 24, mat(0xe8e6da));
    // parede do fundo do hall com o VÃO para o auditório [EX-1, EX+1]
    parede(EX - 12, 24, EX - 1, 24, mat(0xe8e6da));
    parede(EX + 1, 24, EX + 12, 24, mat(0xe8e6da));

    // vitrine do memorial: mesa expositiva com tampo de vidro
    caixa(2.6, 0.85, 1.1, EX, 0.42, 18.5, mat(0x33424f));
    caixa(2.4, 0.3, 0.95, EX, 1.0, 18.5,
      new THREE.MeshPhongMaterial({ color: 0xb9d2e0, transparent: true, opacity: 0.35, shininess: 80 }),
      { colide: false });
    // nicho iluminado na parede leste (luz quente embutida)
    caixa(3.2, 1.4, 0.12, EX + 11.8, 1.7, 19, mat(0x6a4a2a), { colide: false });
    const nicho = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 1.2),
      new THREE.MeshBasicMaterial({ color: 0xffe2a8 }));
    nicho.position.set(EX + 11.72, 1.7, 19); nicho.rotation.y = -Math.PI / 2;
    scene.add(nicho);
    // galeria de retratos (alturas variadas, como nas fotos) com
    // SANCA DE LED quente correndo a parede inteira
    for (let i = 0; i < 7; i++) {
      const q = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.55),
        new THREE.MeshLambertMaterial({
          map: TOGA.texturas3d.retrato ? TOGA.texturas3d.retrato(i) : null }));
      q.position.set(EX - 11.85, 1.65 + (i % 2) * 0.55, 15.2 + i * 1.25);
      q.rotation.y = Math.PI / 2;
      scene.add(q);
    }
    const sanca = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 9.6),
      new THREE.MeshBasicMaterial({ color: 0xffe2a8 }));
    sanca.position.set(EX - 11.8, 2.75, 19);
    scene.add(sanca);

    // sofás de couro escuro (as fotos do corredor)
    [[EX - 4.5, 22.9], [EX + 4.5, 22.9]].forEach(function (p) {
      caixa(2.2, 0.45, 0.85, p[0], 0.25, p[1], mat(0x2a2d33));
      caixa(2.2, 0.55, 0.2, p[0], 0.78, p[1] + 0.32, mat(0x22252a), { colide: false });
    });
    // mesas expositoras pretas, finas, com documentos (exposição 40 anos)
    [[EX - 8.5, 20.6], [EX - 8.5, 17.2]].forEach(function (p) {
      caixa(1.5, 0.06, 0.7, p[0], 0.95, p[1], mat(0x1d2024));
      [[-0.4], [0.1], [0.45]].forEach(function (d) {
        caixa(0.3, 0.012, 0.42, p[0] + d[0], 0.99, p[1], mat(0xf4ecd9), { colide: false, semSombra: true });
      });
      [[-0.6], [0.6]].forEach(function (l) {
        caixa(0.05, 0.95, 0.05, p[0] + l[0], 0.47, p[1], mat(0x1d2024), { colide: false });
      });
    });
    // o quadro dos 40 anos
    if (TOGA.texturas3d.letreiro) {
      const q40 = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.9),
        new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.letreiro("40 ANOS", "#2a3d7c", "#e7cf9a", "ESMEC — 1985–2025") }));
      q40.position.set(EX + 11.85, 1.9, 16.2);
      q40.rotation.y = -Math.PI / 2;
      scene.add(q40);
    }

    /* ---- o JARDIM INTERNO DE SEIXOS (o coração do prédio real):
       pedras, vasos brancos, banco de madeira ripada CURVO e
       guarda-corpo de vidro com corrimão ---- */
    const JX = EX + 7, JZ = 19;
    // leito rebaixado de seixos
    caixa(4.6, 0.1, 4.6, JX, 0.06, JZ, mat(0x8a8378), { colide: false, semSombra: true });
    for (let i = 0; i < 34; i++) {
      const sx = JX - 2 + ((i * 37) % 40) / 10, sz = JZ - 2 + ((i * 53) % 40) / 10;
      const seixo = new THREE.Mesh(new THREE.SphereGeometry(0.16 + (i % 3) * 0.05, 7, 5),
        mat([0xb9b3a6, 0x9a958c, 0xcfc9bc][i % 3]));
      seixo.scale.y = 0.55;
      seixo.position.set(sx, 0.14, sz);
      seixo.castShadow = false;
      scene.add(seixo);
    }
    // vasos cilíndricos brancos com plantas
    [[JX - 1.3, JZ - 1.2], [JX + 1.2, JZ - 0.2], [JX - 0.2, JZ + 1.3]].forEach(function (p) {
      const vaso = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.6, 12), mat(0xe8e6da));
      vaso.position.set(p[0], 0.36, p[1]);
      vaso.castShadow = true;
      scene.add(vaso);
      for (let f = 0; f < 4; f++) {
        const folha = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.85, 5), mat(0x3f6a3e));
        folha.position.set(p[0] + Math.cos(f * 1.6) * 0.13, 1.0, p[1] + Math.sin(f * 1.6) * 0.13);
        folha.rotation.z = Math.cos(f * 1.6) * 0.35;
        scene.add(folha);
      }
    });
    // banco de madeira ripada em ARCO suave, de frente para o jardim
    for (let i = 0; i < 5; i++) {
      const t = (i - 2) / 2;                          // −1 … +1
      const bx = JX - 3.35 - (1 - Math.abs(t)) * 0.35; // barriga para oeste
      const bz = JZ + t * 1.85;
      const ripa = caixa(0.55, 0.07, 0.92, bx, 0.42, bz, mat(0x6a4a2a), { colide: false });
      ripa.rotation.y = -t * 0.3;
      const pe = caixa(0.4, 0.4, 0.08, bx, 0.2, bz, mat(0x55585e), { colide: false, semSombra: true });
      pe.rotation.y = -t * 0.3;
    }
    colisores.push({ minX: JX - 4.1, maxX: JX - 3.0, minZ: JZ - 2.3, maxZ: JZ + 2.3 });
    // guarda-corpo de vidro sobre mureta de granito
    [[JX, JZ - 2.6, 5.2, 0.12], [JX, JZ + 2.6, 5.2, 0.12],
     [JX + 2.6, JZ, 0.12, 5.2]].forEach(function (g) {
      caixa(g[2], 0.22, g[3], g[0], 0.11, g[1],
        TOGA.texturas3d.granitoRosa ? matTex(TOGA.texturas3d.granitoRosa(), 2, 1) : mat(0xb08572));
      const vidro = new THREE.Mesh(new THREE.BoxGeometry(g[2], 0.7, Math.max(g[3], 0.04)),
        new THREE.MeshPhongMaterial({ color: 0xcfd8df, transparent: true, opacity: 0.25, shininess: 90 }));
      vidro.position.set(g[0], 0.6, g[1]);
      scene.add(vidro);
      const corrimao = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.035, Math.max(g[2], g[3]), 8), mat(0xc9ccd2));
      if (g[2] > g[3]) corrimao.rotation.z = Math.PI / 2;
      else corrimao.rotation.x = Math.PI / 2;
      corrimao.position.set(g[0], 1.0, g[1]);
      scene.add(corrimao);
    });
    pontos.jardim = { x: JX - 3.4, z: JZ };

    /* ---- BIBLIOTECA (ala oeste, x −20..−12) ---- */
    piso(EX - 20, 14, EX - 12, 24, mat(0xd8d4c8), 0.04);
    parede(EX - 20, 14, EX - 20, 24, mat(0xe8e6da));
    // estantes com "livros" coloridos
    [[EX - 19.4, 16.5], [EX - 19.4, 19.5], [EX - 19.4, 22.5]].forEach(function (p, ei) {
      caixa(0.5, 2.1, 2.4, p[0], 1.05, p[1], mat(0x6a4a2a));
      for (let n = 0; n < 9; n++) {
        caixa(0.34, 0.26, 0.12, p[0] + 0.1, 0.5 + Math.floor(n / 3) * 0.6, p[1] - 0.9 + (n % 3) * 0.9,
          mat([0x7c3030, 0x2f4a3e, 0x2a3d7c, 0x8a6240, 0x5e2424][((n + ei) % 5)]), { colide: false, semSombra: true });
      }
    });
    caixa(2.0, 0.78, 1.0, EX - 15, 0.39, 19, mat(0x6a4a2a));   // mesa de leitura
    caixa(0.5, 0.5, 0.5, EX - 15, 0.25, 17.9, mat(0x2a2d33), { colide: false });
    caixa(0.5, 0.5, 0.5, EX - 15, 0.25, 20.1, mat(0x2a2d33), { colide: false });
    placaEmRot("BIBLIOTECA", EX - 12.2, 2.4, 19, Math.PI / 2, 1.5);
    pontos.biblioteca = { x: EX - 16.5, z: 19 };

    /* ---- LABORATÓRIO DE INFORMÁTICA (ala leste, x 12..20) ---- */
    piso(EX + 12, 14, EX + 20, 24, mat(0xd8d4c8), 0.04);
    parede(EX + 20, 14, EX + 20, 24, mat(0xe8e6da));
    // bancadas com monitores e cadeiras giratórias pretas
    for (let fila = 0; fila < 3; fila++) {
      const bz = 16 + fila * 3;
      caixa(5.4, 0.74, 0.7, EX + 16.4, 0.37, bz, mat(0xb9b3a6));
      for (let m = 0; m < 3; m++) {
        caixa(0.55, 0.38, 0.05, EX + 14.4 + m * 1.7, 1.0, bz + 0.1, mat(0x15110c), { colide: false, semSombra: true });
        caixa(0.5, 0.5, 0.5, EX + 14.4 + m * 1.7, 0.25, bz + 1.0, mat(0x22252a), { colide: false });
      }
    }
    // guarda-corpo tubular de inox na frente (as fotos do lab)
    const tubo = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 7.6, 8), mat(0xc9ccd2));
    tubo.rotation.x = Math.PI / 2;
    tubo.position.set(EX + 13.2, 0.95, 19);
    scene.add(tubo);
    placaEmRot("LABORATÓRIO — NÚCLEO DE TECNOLOGIA", EX + 12.2, 2.4, 19, -Math.PI / 2, 2.6);
    pontos.laboratorio = { x: EX + 15.5, z: 19 };

    /* ---- CREDENCIAMENTO + COFFEE BREAK (o evento de hoje) ---- */
    caixa(2.4, 1.0, 0.6, EX - 3.4, 0.5, 22.8, mat(0xe8e6da));
    [[-0.7], [0], [0.7]].forEach(function (c) {
      caixa(0.22, 0.015, 0.3, EX - 3.4 + c[0], 1.02, 22.8, mat(0xd8c84a), { colide: false, semSombra: true });
    });
    placaEmRot("CREDENCIAMENTO", EX - 3.4, 1.9, 23.4, Math.PI, 1.8);
    pontos.credenciamento = { x: EX - 3.4, z: 22 };
    // coffee break: mesa com toalha, térmicas e xícaras
    caixa(2.6, 0.9, 0.8, EX + 9.8, 0.45, 15.2, mat(0xe8e6da));
    [[-0.8], [-0.2]].forEach(function (t) {
      const termica = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.42, 10), mat(0x9c2b22));
      termica.position.set(EX + 9.8 + t[0], 1.1, 15.2);
      scene.add(termica);
    });
    [[0.3], [0.6], [0.9]].forEach(function (x) {
      const xic = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.07, 8), mat(0xf4ecd9));
      xic.position.set(EX + 9.8 + x[0], 0.94, 15.3);
      scene.add(xic);
    });
    pontos.coffee = { x: EX + 9.8, z: 16.4 };

    /* ---- LIVRO DE VISITAS na recepção ---- */
    caixa(0.5, 0.05, 0.36, EX - 7, 1.03, 16.0, mat(0x5e2424), { colide: false, semSombra: true });
    caixa(0.44, 0.012, 0.3, EX - 7, 1.07, 16.0, mat(0xf4ecd9), { colide: false, semSombra: true });
    pontos.livroVisitas = { x: EX - 7, z: 17.0 };

    // banner do evento na fachada e no hall
    if (TOGA.texturas3d.letreiro) {
      const bannerTex = TOGA.texturas3d.letreiro("SIMPLES E MÁGICO", "#4a3a55", "#f4ecd9",
        "HOJE: LINGUAGEM SIMPLES — JUIZ L. G. MONTEZUMA HERBSTER");
      const b1 = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 1.4),
        new THREE.MeshLambertMaterial({ map: bannerTex }));
      b1.position.set(EX - 8.5, 2.0, 13.84);
      b1.rotation.y = Math.PI;
      scene.add(b1);
      const b2 = b1.clone();
      b2.position.set(EX + 6.5, 1.9, 23.84);
      scene.add(b2);
    }
    // recepção + banco de madeira do corredor
    caixa(2.6, 1.0, 0.6, EX - 7, 0.5, 16.2, mat(0xe8e6da));
    placaEmRot("RECEPÇÃO", EX - 7, 1.9, 14.2, 0, 1.3);
    caixa(1.9, 0.45, 0.6, EX + 7.5, 0.22, 22.8, mat(0x6a4a2a));
    caixa(1.9, 0.5, 0.08, EX + 7.5, 0.7, 23.05, mat(0x6a4a2a), { colide: false });
    function placaEmRot(texto, x, y, z, rotY, larg) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(larg || 1.6, 0.4),
        new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.placa(texto),
          polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
      m.position.set(x, y, z); m.rotation.y = rotY || 0;
      scene.add(m);
      return m;
    }
    placaEmRot("MEMORIAL DA ESMEC", EX, 2.2, 18.95, Math.PI, 2.0);
    placaEmRot("GALERIA DOS DIRETORES", EX - 11.8, 2.75, 18.8, Math.PI / 2, 2.2);
    placaEmRot("AUDITÓRIO", EX, 2.85, 23.8, Math.PI, 1.5);
    pontos.memorial = { x: EX, z: 19.6 };
    pontos.galeria = { x: EX - 10.6, z: 18.8 };
    pontos.recepcao = { x: EX - 7, z: 17.2 };

    /* ============ O AUDITÓRIO (z 24..38) ============ */
    piso(EX - 11, 24, EX + 11, 38,
      TOGA.texturas3d.pisoAuditorioEsmec ? matTex(TOGA.texturas3d.pisoAuditorioEsmec(), 5, 4) : mat(0x9aa09a), 0.04);
    parede(EX - 11, 24, EX - 11, 38, mat(0xd8d4c8));
    parede(EX + 11, 24, EX + 11, 38, mat(0xd8d4c8));
    // (fundo em z=38 é o muro do lote, já erguido)

    // brises azulados no alto das paredes (as janelas altas das fotos)
    for (let i = 0; i < 4; i++) {
      [[-10.85, Math.PI / 2], [10.85, -Math.PI / 2]].forEach(function (lado) {
        const b = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.7),
          new THREE.MeshBasicMaterial({ color: 0x8ea6c8 }));
        b.position.set(EX + lado[0], 2.85, 26.5 + i * 3);
        b.rotation.y = lado[1];
        scene.add(b);
      });
    }

    // PALCO ao fundo: tablado + púlpito de acrílico + telões
    caixa(12, 0.35, 3.2, EX, 0.17, 36.2, mat(0x8a8378), { colide: false });
    colisores.push({ minX: EX - 6, maxX: EX + 6, minZ: 37.2, maxZ: 37.9 });
    const pulpito = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.15, 0.5),
      new THREE.MeshPhongMaterial({ color: 0xcfd8df, transparent: true, opacity: 0.4, shininess: 90 }));
    pulpito.position.set(EX - 2.2, 0.92, 35.6);
    pulpito.castShadow = true;
    scene.add(pulpito);
    colisores.push({ minX: EX - 2.6, maxX: EX - 1.8, minZ: 35.3, maxZ: 35.9 });
    [[-7.5], [7.5]].forEach(function (l) {
      const telao = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 2.0),
        TOGA.texturas3d.letreiro
          ? new THREE.MeshBasicMaterial({ map: TOGA.texturas3d.letreiro(
              "SIMPLES E MÁGICO", "#1d2433", "#e7cf9a", "LINGUAGEM SIMPLES NO JUDICIÁRIO") })
          : new THREE.MeshBasicMaterial({ color: 0xdfe8f2 }));
      telao.position.set(EX + l[0], 2.1, 37.8);
      telao.rotation.y = Math.PI;
      scene.add(telao);
    });
    // extintor (sempre ele)
    const ext = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.5, 10), mat(0xb03a3a));
    ext.position.set(EX + 10.8, 0.9, 25.0);
    scene.add(ext);

    // POLTRONAS VINHO: 5 fileiras × 8, corredor central (a faixa
    // vermelha do piso passa por ele)
    for (let fila = 0; fila < 5; fila++) {
      for (let col = 0; col < 8; col++) {
        const px = EX - 7.7 + col * 2.2 + (col > 3 ? 0.9 : 0);
        const pz = 26.5 + fila * 1.7;
        caixa(0.62, 0.45, 0.55, px, 0.22, pz, mat(0x7c4048), { semSombra: true });
        caixa(0.62, 0.62, 0.12, px, 0.75, pz + 0.24, mat(0x6a3038), { colide: false, semSombra: true });
      }
    }
    pontos.pulpito = { x: EX - 2.2, z: 34.6 };
    pontos.auditorio = { x: EX, z: 27 };

    /* ============ AS SALAS DE CAPACITAÇÃO (alas, z 24..38) ============
       Oeste: SALA DE AULA (formação inicial) e OFICINA DE SENTENÇAS.
       Leste: SALA DE MEDIAÇÃO e a COORDENAÇÃO da Escola.            */

    // ---- ala OESTE ----
    piso(EX - 20, 24, EX - 12, 38, mat(0xd8d4c8), 0.04);
    parede(EX - 20, 24, EX - 20, 38, mat(0xe8e6da));
    parede(EX - 12, 25, EX - 12, 38, mat(0xe8e6da));
    // norte da sala de aula (vão [EX-17.2, EX-16])
    parede(EX - 20, 25, EX - 17.2, 25, mat(0xe8e6da));
    parede(EX - 16, 25, EX - 12, 25, mat(0xe8e6da));
    // divisória sala de aula / oficina (vão [EX-17.2, EX-16])
    parede(EX - 20, 31, EX - 17.2, 31, mat(0xe8e6da));
    parede(EX - 16, 31, EX - 12, 31, mat(0xe8e6da));

    // SALA DE AULA — FORMAÇÃO INICIAL (z 25..31)
    placaEmRot("SALA 1 — FORMAÇÃO INICIAL", EX - 16.6, 2.4, 25.2, 0, 2.4);
    // quadro branco + projetor
    caixa(3.0, 1.5, 0.08, EX - 16, 1.7, 30.7, mat(0xf4f2ec), { colide: false });
    caixa(3.2, 1.7, 0.04, EX - 16, 1.7, 30.74, mat(0x55585e), { colide: false, semSombra: true });
    caixa(0.4, 0.18, 0.5, EX - 16, 2.9, 28, mat(0x33373d), { colide: false, semSombra: true });
    for (let cx = 0; cx < 3; cx++) for (let cz = 0; cz < 2; cz++) {
      caixa(0.85, 0.74, 0.55, EX - 18.2 + cx * 1.9, 0.37, 26.6 + cz * 1.6, mat(0xb9b3a6));
    }
    pontos.salaAula = { x: EX - 16, z: 28.6 };
    pontos.quadroAula = { x: EX - 16, z: 30 };

    // OFICINA DE SENTENÇAS (z 31..38)
    placaEmRot("OFICINA DE SENTENÇAS", EX - 16.6, 2.4, 31.2, 0, 2.2);
    caixa(3.6, 0.78, 1.4, EX - 16, 0.39, 34.6, mat(0x6a4a2a));   // o mesão
    [[-1.2, 33.6], [0, 33.6], [1.2, 33.6], [-1.2, 35.6], [0, 35.6], [1.2, 35.6]].forEach(function (c) {
      caixa(0.5, 0.5, 0.5, EX - 16 + c[0], 0.25, c[1], mat(0x2a2d33), { colide: false });
    });
    [[-0.9], [0.2], [0.9]].forEach(function (p) {
      caixa(0.3, 0.012, 0.42, EX - 16 + p[0], 0.8, 34.6, mat(0xf4ecd9), { colide: false, semSombra: true });
    });
    pontos.oficina = { x: EX - 16, z: 33.2 };

    // ---- ala LESTE ----
    piso(EX + 12, 24, EX + 20, 38, mat(0xd8d4c8), 0.04);
    parede(EX + 20, 24, EX + 20, 38, mat(0xe8e6da));
    parede(EX + 12, 25, EX + 12, 38, mat(0xe8e6da));
    parede(EX + 12, 25, EX + 16, 25, mat(0xe8e6da));
    parede(EX + 17.2, 25, EX + 20, 25, mat(0xe8e6da));
    parede(EX + 12, 31, EX + 16, 31, mat(0xe8e6da));
    parede(EX + 17.2, 31, EX + 20, 31, mat(0xe8e6da));

    // SALA DE MEDIAÇÃO (z 25..31)
    placaEmRot("SALA DE MEDIAÇÃO E CONCILIAÇÃO", EX + 16.6, 2.4, 25.2, 0, 2.6);
    const mesaRedonda = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.08, 18), mat(0x6a4a2a));
    mesaRedonda.position.set(EX + 16, 0.76, 28.2);
    mesaRedonda.castShadow = true;
    scene.add(mesaRedonda);
    const peMesa = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.76, 10), mat(0x4a3018));
    peMesa.position.set(EX + 16, 0.38, 28.2);
    scene.add(peMesa);
    colisores.push({ minX: EX + 14.9, maxX: EX + 17.1, minZ: 27.1, maxZ: 29.3 });
    [[0, -1.5], [0, 1.5], [-1.5, 0], [1.5, 0]].forEach(function (c) {
      caixa(0.5, 0.5, 0.5, EX + 16 + c[0], 0.25, 28.2 + c[1], mat(0x556a55), { colide: false });
    });
    vasoBranco(EX + 13, 26);
    pontos.mediacao = { x: EX + 16, z: 30 };

    // COORDENAÇÃO (z 31..38)
    placaEmRot("COORDENAÇÃO — JUÍZA ANA PAULA FEITOSA OLIVEIRA", EX + 16.6, 2.4, 31.2, 0, 3.2);
    caixa(2.4, 0.78, 1.0, EX + 16.5, 0.39, 35.5, mat(0x6a4a2a));    // mesa
    caixa(0.5, 0.55, 0.5, EX + 16.5, 0.27, 36.4, mat(0x2a2d33), { colide: false });
    caixa(0.5, 0.5, 0.5, EX + 16.5, 0.25, 34.4, mat(0x556a55), { colide: false });
    caixa(0.4, 0.05, 0.3, EX + 16, 0.83, 35.5, mat(0xf4ecd9), { colide: false, semSombra: true }); // a pauta de cursos
    caixa(0.5, 1.9, 0.4, EX + 19.4, 0.95, 36.8, mat(0x6a4a2a));     // estante
    // bandeira do Ceará no canto
    const mastroCE = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 2.4, 8), mat(0x8a8378));
    mastroCE.position.set(EX + 13, 1.2, 36.8);
    scene.add(mastroCE);
    const panoCE = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.5),
      new THREE.MeshLambertMaterial({ color: 0x2d7a3a, side: THREE.DoubleSide }));
    panoCE.position.set(EX + 13.37, 2.1, 36.8);
    scene.add(panoCE);
    pontos.coordenacao = { x: EX + 16, z: 33.6 };

    // mural da programação de cursos, no hall
    if (TOGA.texturas3d.letreiro) {
      const mural = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.2),
        new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.letreiro(
          "CURSOS DESTA SEMANA", "#2f4a3e", "#e7cf9a", "FORMAÇÃO CONTINUADA — ESMEC") }));
      mural.position.set(EX + 11.85, 1.8, 21.5);
      mural.rotation.y = -Math.PI / 2;
      scene.add(mural);
    }
    pontos.muralCursos = { x: EX + 10.8, z: 21.5 };

    /* ============ TETOS (forro branco dos interiores) ============ */
    [[EX - 12, 14, EX + 12, 24], [EX - 11, 24, EX + 11, 38],
     [EX - 20, 14, EX - 12, 38], [EX + 12, 14, EX + 20, 38]].forEach(function (t) {
      const teto = new THREE.Mesh(
        new THREE.PlaneGeometry(Math.abs(t[2] - t[0]), Math.abs(t[3] - t[1])),
        new THREE.MeshLambertMaterial({ color: 0xe8e6e0 }));
      teto.rotation.x = Math.PI / 2;
      teto.position.set((t[0] + t[2]) / 2, ALTURA, (t[1] + t[3]) / 2);
      scene.add(teto);
    });

    /* ============ GENTE DA ESCOLA ============ */
    function npc(id, av, x, z, rotY, opcoes) {
      const b = TOGA.boneco3d.criar({ id: id, avatar: av }, opcoes || {});
      b.grupo.position.set(x, 0, z);
      b.grupo.rotation.y = rotY || 0;
      scene.add(b.grupo);
      vivos.push(b);
      return b;
    }
    const PELES_J = ["#d8a87f", "#c98e66", "#a86a48", "#8a5436", "#e8c39a"];
    // a coordenadora, Juíza Ana Paula Feitosa Oliveira — circula
    // entre a recepção, o credenciamento e a porta do auditório
    pontos.npcCoordenadora = npc("coordenadoraEsmec",
      { pele: "#c98e66", cabelo: "longo", corCabelo: "#3a2a1a",
        traje: "blazer", corTraje: "#4a3a55", corBlusa: "#e8e2d2" },
      EX - 1.6, 17.4, 0.6);
    if (TOGA.rotinas3d && TOGA.rotinas3d.adicionarRotina) {
      TOGA.rotinas3d.adicionarRotina(pontos.npcCoordenadora, [
        { esperar: 14 },
        { ir: [{ x: EX - 3.4, z: 21.6 }] },          // confere o credenciamento
        { esperar: 8 },
        { segurar: ["pastas", "esq"] },
        { ir: [{ x: EX - 0.5, z: 22.8 }] },          // espia o auditório
        { esperar: 7 },
        { segurar: [null, "esq"] },
        { ir: [{ x: EX - 5.5, z: 16.4 }] },          // volta pela recepção
        { esperar: 10 },
        { ir: [{ x: EX - 1.6, z: 17.4 }] },
        { esperar: 12 }
      ]);
    }
    // recepcionista (organiza papéis em ciclos)
    const recep = npc("recepcionistaEsmec",
      { pele: "#d8a87f", cabelo: "coque", corCabelo: "#241a10", traje: "camisa", corTraje: "#556a55" },
      EX - 7, 15.4, 0);
    if (TOGA.rotinas3d && TOGA.rotinas3d.adicionarRotina) {
      TOGA.rotinas3d.adicionarRotina(recep, [
        { esperar: 9 },
        { segurar: ["autos", "esq"] },
        { acao: "lerPapel" },
        { segurar: [null, "esq"] },
        { esperar: 16 }
      ]);
    }

    // a assessora da coordenação, Rejane (a missão da pauta)
    pontos.npcRejane = npc("rejaneEsmec",
      { pele: "#a86a48", cabelo: "coque", corCabelo: "#241a10", traje: "blazer", corTraje: "#556a55", oculos: true },
      EX + 15.2, 33.4, Math.PI * 0.8);

    // o professor da sala de formação inicial
    const profSala = npc("professorSala1",
      { pele: "#8a5436", cabelo: "calvo", corCabelo: "#9a9388", traje: "terno", corTraje: "#33424f", barba: true },
      EX - 16, 29.8, Math.PI);
    profSala.segurar("autos", "esq");
    // dois juízes novos assistindo
    [[EX - 18.2, 26.6], [EX - 14.4, 28.2]].forEach(function (p, i) {
      const aluno = npc("alunoSala1_" + i,
        { pele: PELES_J[(i * 2 + 1) % 5], cabelo: i ? "coque" : "curto", corCabelo: "#241a10",
          traje: "terno", corTraje: "#2a2a30" },
        p[0], p[1] + 0.7, 0, { sentado: true });
      aluno.setEmocao("neutro");
    });

    // dois servidores digitando no laboratório
    [[EX + 14.4, 17.0], [EX + 17.8, 20.0]].forEach(function (p, i) {
      const tec = npc("tecLab" + i,
        { pele: PELES_J[(i + 2) % 5], cabelo: i ? "longo" : "curto", corCabelo: "#3a2a1a",
          traje: "camisa", corTraje: i ? "#4a5a6e" : "#7a6248" },
        p[0], p[1], 0, { sentado: true });
      if (TOGA.rotinas3d && TOGA.rotinas3d.adicionarRotina) {
        TOGA.rotinas3d.adicionarRotina(tec, [
          { esperar: 6 + i * 5 },
          { acao: "lerPapel" },
          { esperar: 9 }
        ]);
      }
    });
    /* a PLATEIA DE JUÍZES REAIS, sorteada da Relação de Magistrados
       do TJCE — homenagem institucional: nome + lotação de verdade */
    pontos.plateia = [];
    pontos.juizesAvulsos = [];
    const sorteados = (TOGA.juizesTJCE && TOGA.juizesTJCE.sortearJuizes)
      ? TOGA.juizesTJCE.sortearJuizes(25) : [];
    function avatarJuiz(i) {
      return { pele: PELES_J[i % 5],
        cabelo: ["curto", "coque", "longo", "calvo"][i % 4], corCabelo: "#241a10",
        traje: i % 2 ? "terno" : "blazer", corTraje: ["#2a2a30", "#33424f", "#4a4438"][i % 3] };
    }
    // 16 na plateia da palestra (4 filas × 4)
    sorteados.slice(0, 16).forEach(function (j, i) {
      const col = i % 4, fila = Math.floor(i / 4);
      const px = EX - 7.7 + col * 2.2 + 1.1, pz = 26.5 + fila * 1.7;
      const b = npc("juizReal" + i, avatarJuiz(i), px, pz, 0, { sentado: true });
      b.setEmocao(i % 5 === 3 ? "feliz" : "neutro");
      pontos.plateia.push({ nome: j.nome, lotacao: j.lotacao, x: px, z: pz });
    });
    function avulso(j, i, x, z, rotY, opcoes) {
      const b = npc("juizAvulso" + i, avatarJuiz(i + 7), x, z, rotY, opcoes || {});
      pontos.juizesAvulsos.push({ nome: j.nome, lotacao: j.lotacao, x: x, z: z, boneco: b });
      return b;
    }
    // 2 debatendo na OFICINA DE SENTENÇAS
    if (sorteados[16]) {
      const a1 = avulso(sorteados[16], 0, EX - 17.2, 33.6, Math.PI * 0.9, { sentado: true });
      a1.segurar("autos", "esq");
    }
    if (sorteados[17]) avulso(sorteados[17], 1, EX - 14.8, 35.6, -Math.PI * 0.2, { sentado: true });
    // 2 treinando na MEDIAÇÃO (frente a frente)
    if (sorteados[18]) avulso(sorteados[18], 2, EX + 16, 26.7, 0, { sentado: true });
    if (sorteados[19]) {
      const m2 = avulso(sorteados[19], 3, EX + 16, 29.7, Math.PI, { sentado: true });
      m2.setEmocao("firme");
    }
    // 1 contemplando o jardim, 1 na galeria, 1 no coffee
    if (sorteados[20]) avulso(sorteados[20], 4, EX + 3.4, 19, Math.PI / 2);
    if (sorteados[21]) avulso(sorteados[21], 5, EX - 10.9, 18.2, -Math.PI / 2);
    if (sorteados[22]) {
      const c1 = avulso(sorteados[22], 6, EX + 9.2, 16.8, Math.PI);
      c1.segurar("xicara", "dir");
    }
    // 2 ATRASADOS: chegam pela entrada e sentam na última fileira
    [[23, EX - 4.4, 33.3], [24, EX + 5.6, 33.3]].forEach(function (cfg, n) {
      const j = sorteados[cfg[0]];
      if (!j) return;
      const b = avulso(j, 7 + n, EX - 1 + n * 2, 15.0 + n * 0.8, 0);
      // o ponto de interação é o ASSENTO final, não a porta
      const reg = pontos.juizesAvulsos[pontos.juizesAvulsos.length - 1];
      reg.x = cfg[1]; reg.z = cfg[2];
      if (TOGA.rotinas3d && TOGA.rotinas3d.adicionarRotina) {
        TOGA.rotinas3d.adicionarRotina(b, [
          { esperar: 4 + n * 6 },
          { ir: [{ x: EX - 0.4 + n * 0.8, z: 22 }, { x: EX, z: 25.5 }, { x: cfg[1], z: cfg[2] - 0.9 }] },
          { sentar: { x: cfg[1], z: cfg[2], rot: 0, dur: 9999 } },
          { esperar: 9999 }
        ]);
      }
    });

    /* o PALESTRANTE: Juiz Luis Gustavo Montezuma Herbster, no
       púlpito, apresentando o programa Simples e Mágico */
    const montezuma = npc("montezuma",
      { pele: "#d8a87f", cabelo: "curto", corCabelo: "#241a10",
        traje: "terno", corTraje: "#33424f", corBlusa: "#e8e2d2" },
      EX - 2.2, 35.0, Math.PI);
    montezuma.setEmocao("feliz");
    montezuma.segurar("autos", "esq");   // as anotações da palestra
    pontos.palestrante = { x: EX - 2.2, z: 33.9 };
    // assento livre do jogador na 1ª fileira (para assistir)
    pontos.assentoPalestra = { x: EX + 5.0, z: 26.5 };
    // funcionário do café, com a bandeja
    const cafe = npc("cafeEsmec",
      { pele: "#a86a48", cabelo: "curto", corCabelo: "#241a10", traje: "camisa", corTraje: "#e8e6da" },
      EX + 9.0, 16.6, -0.4);
    cafe.segurar("xicara", "dir");
    if (TOGA.rotinas3d && TOGA.rotinas3d.adicionarRotina) {
      TOGA.rotinas3d.adicionarRotina(cafe, [
        { esperar: 11 },
        { ir: [{ x: EX + 4, z: 17.2 }, { x: EX + 0.5, z: 22.6 }] },  // serve a porta do auditório
        { acao: "entregar" },
        { esperar: 6 },
        { ir: [{ x: EX + 4, z: 16.6 }, { x: EX + 9.0, z: 16.6 }] },
        { esperar: 14 }
      ]);
    }

    info = { colisores: colisores, paredesCamera: paredesCamera, pontos: pontos, vivos: vivos };
    return info;
  }

  return {
    construir: construir,
    get EX() { return EX; },
    get pontos() { return info ? info.pontos : null; }
  };
})();
