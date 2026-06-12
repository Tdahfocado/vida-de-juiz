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
    function piso(x1, z1, x2, z2, material) {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(Math.abs(x2 - x1), Math.abs(z2 - z1)), material);
      m.rotation.x = -Math.PI / 2;
      m.position.set((x1 + x2) / 2, 0.012, (z1 + z2) / 2);
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
    piso(EX - 26, -6, EX + 26, 40, mat(0x9a9588));                       // calçadão claro
    piso(EX - 22, -4, EX + 22, 8,
      TOGA.texturas3d.asfalto ? matTex(TOGA.texturas3d.asfalto(), 8, 2) : mat(0x3a3d42));
    // vagas demarcadas (a vaga do juiz é a pintada de verde-claro)
    for (let i = 0; i < 6; i++) {
      caixa(0.1, 0.02, 4.4, EX - 12.5 + i * 5, 0.04, 5.8, mat(0xe8e6da), { colide: false, semSombra: true });
    }
    pontos.vaga = { x: EX - 10, z: 5.8 };
    caixa(4.6, 0.015, 4.2, EX - 10, 0.035, 5.8, mat(0x9fc3ae), { colide: false, semSombra: true });
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
      TOGA.texturas3d.pisoEsmec ? matTex(TOGA.texturas3d.pisoEsmec(), 6, 3) : mat(0xe8e6e0));
    parede(EX - 12, 14, EX - 12, 24, mat(0xe8e6da));
    parede(EX + 12, 14, EX + 12, 24, mat(0xe8e6da));
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
    // galeria de retratos dos diretores (molduras pretas)
    for (let i = 0; i < 6; i++) {
      const q = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.62),
        new THREE.MeshLambertMaterial({
          map: TOGA.texturas3d.retrato ? TOGA.texturas3d.retrato(i) : null }));
      q.position.set(EX - 11.85, 1.9, 15.6 + i * 1.4);
      q.rotation.y = Math.PI / 2;
      scene.add(q);
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
    placaEmRot("AUDITÓRIO", EX, 2.5, 23.8, Math.PI, 1.6);
    pontos.memorial = { x: EX, z: 19.6 };
    pontos.galeria = { x: EX - 10.6, z: 18.8 };
    pontos.recepcao = { x: EX - 7, z: 17.2 };

    /* ============ O AUDITÓRIO (z 24..38) ============ */
    piso(EX - 11, 24, EX + 11, 38,
      TOGA.texturas3d.pisoAuditorioEsmec ? matTex(TOGA.texturas3d.pisoAuditorioEsmec(), 5, 4) : mat(0x9aa09a));
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
        new THREE.MeshBasicMaterial({ color: 0xdfe8f2 }));
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

    /* ============ TETOS (forro branco dos interiores) ============ */
    [[EX - 12, 14, EX + 12, 24], [EX - 11, 24, EX + 11, 38]].forEach(function (t) {
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
    // a coordenadora, Juíza Ana Paula Feitosa Oliveira, no hall
    pontos.npcCoordenadora = npc("coordenadoraEsmec",
      { pele: "#c98e66", cabelo: "longo", corCabelo: "#3a2a1a",
        traje: "blazer", corTraje: "#4a3a55", corBlusa: "#e8e2d2" },
      EX - 1.6, 17.4, 0.6);
    // recepcionista
    npc("recepcionistaEsmec",
      { pele: "#d8a87f", cabelo: "coque", corCabelo: "#241a10", traje: "camisa", corTraje: "#556a55" },
      EX - 7, 15.4, 0);
    // a turma de juízes novos, sentada no auditório
    for (let i = 0; i < 8; i++) {
      const px = EX - 7.7 + (i % 4) * 2.2 + ((i % 4) > 3 ? 0.9 : 0) + (i >= 4 ? 4.5 : 0);
      const pz = 26.5 + Math.floor(i / 4) * 1.7;
      const aluno = npc("alunoEsmec" + i,
        { pele: ["#d8a87f", "#c98e66", "#a86a48", "#8a5436", "#e8c39a"][i % 5],
          cabelo: ["curto", "coque", "longo", "calvo"][i % 4], corCabelo: "#241a10",
          traje: "terno", corTraje: "#2a2a30" },
        px, pz, 0, { sentado: true });
      aluno.setEmocao("neutro");
    }
    // funcionário do café, com a bandeja
    const cafe = npc("cafeEsmec",
      { pele: "#a86a48", cabelo: "curto", corCabelo: "#241a10", traje: "camisa", corTraje: "#e8e6da" },
      EX + 8.5, 16.2, -0.8);
    cafe.segurar("xicara", "dir");

    info = { colisores: colisores, paredesCamera: paredesCamera, pontos: pontos, vivos: vivos };
    return info;
  }

  return {
    construir: construir,
    get EX() { return EX; },
    get pontos() { return info ? info.pontos : null; }
  };
})();
