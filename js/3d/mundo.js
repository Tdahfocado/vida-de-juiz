/* ============================================================
   TOGA 3D — mundo.js : o FÓRUM
   ------------------------------------------------------------
   Constrói os três ambientes contíguos (tudo numa única cena,
   sem telas de carregamento):

        ┌──────────┐
        │ GABINETE │  x ∈ [-14,-6] · z ∈ [-9,-2]
        └────┬─────┘  (porta p/ corredor)
     ┌───────┴──────────────┐
     │       CORREDOR       │  x ∈ [-14, 9] · z ∈ [-2, 2]
     └──────────┬───────────┘  (porta p/ sala)
        ┌───────┴────────┐
        │     SALA DE    │  x ∈ [-6, 9] · z ∈ [2, 17]
        │   AUDIÊNCIAS   │  (bancada ao fundo, em z≈15)
        └────────────────┘

   Cada parede/móvel registra um COLISOR AABB ({minX,maxX,
   minZ,maxZ}) — a física do jogo é só isso: caixas no plano.
   Também exporta os PONTOS de interesse (bancada, computador,
   cafeteira...) e os ASSENTOS3D, espelho dos assentos do 2D.
   ============================================================ */

window.TOGA = window.TOGA || {};

TOGA.mundo3d = (function () {
  if (!window.THREE) return {};

  const ALTURA = 3.2;          // pé-direito
  const colisores = [];        // AABBs do plano XZ
  const paredesCamera = [];    // meshes que a câmera não atravessa

  /* Espelho 3D dos assentos do 2D (a sala vista da bancada:
     esq = MP/autor, dir = defesa, centro = depoente).
     rotY: 0 = de frente para a bancada (+z).                */
  const ASSENTOS3D = {
    centro: { x: 1.0,  z: 11.6 },
    esq1:   { x: -2.6, z: 10.2 },
    esq2:   { x: -4.0, z: 9.6  },
    esq3:   { x: -5.1, z: 9.0  },
    dir1:   { x: 4.6,  z: 10.2 },
    dir2:   { x: 6.0,  z: 9.6  },
    dir3:   { x: 7.1,  z: 9.0  }
  };

  /* Assentos do PLENÁRIO DO JÚRI (casos com sala:"juri") —
     esq = acusação/assistente, dir = defesa/réu, centro = depoente */
  const ASSENTOS3D_JURI = {
    centro: { x: 24.6, z: 9.9 },
    esq1:   { x: 25.4, z: 7.9 },
    esq2:   { x: 26.7, z: 7.5 },
    esq3:   { x: 27.5, z: 7.0 },
    dir1:   { x: 25.4, z: 4.9 },
    dir2:   { x: 24.5, z: 4.0 },
    dir3:   { x: 23.8, z: 4.9 }
  };

  /* Pontos nomeados: spawns, interagíveis, bancada do juiz */
  const pontos = {
    spawnGabinete: { x: -10, z: -5, angulo: Math.PI },        // de costas p/ a mesa
    spawnCorredor: { x: -2, z: 0, angulo: -Math.PI / 2 },
    spawnSala:     { x: 1, z: 4.2, angulo: 0 },
    bancada:       { x: 1, z: 14.6 },                          // onde o juiz senta
    cameraBancada: { pos: { x: 1, y: 2.7, z: 16.6 }, alvo: { x: 1, y: 1.1, z: 9.5 } },
    computador:    { x: -12.6, z: -7.2 },
    autosMesa:     { x: -11.2, z: -7.2 },
    cafeteira:     { x: -6.8, z: -8.4 },
    assessora:     { x: -7.2, z: -4.6 },
    balcao:        { x: 5.5, z: -1.5 },
    mural:         { x: -5, z: 1.8 },
    portaSaida:    { x: -13.8, z: 0 },
    portaJuizado:  { x: -7, z: 1.2 },                         // passagem p/ o Juizado Especial (caminho principal)
    voltaJuizado:  { x: -7, z: 0.3, angulo: Math.PI },        // onde o juiz reaparece ao voltar
    // encostados na parede sul, LONGE do vão da porta da sala (x ∈ [0.2, 1.8])
    bancosCorredor: [ { x: -2.4, z: 1.4 }, { x: -4.2, z: 1.4 }, { x: 3.4, z: 1.4 }, { x: 5.2, z: 1.4 } ],
    // ---- ala nova ----
    bebedouro:     { x: 10.5, z: -1.5 },
    filaDistribuicao: [ { x: 5.5, z: -0.9 }, { x: 5.9, z: -0.2 }, { x: 6.3, z: 0.6 } ],
    distribuicao:  { x: 6.6, z: -5 },
    celaPorta:     { x: 13.7, z: -2.6 },
    celaInterior:  { x: 14.6, z: -4.8 },
    cela:          { x: 13.7, z: -1.4 },                       // ponto de interação na grade
    assistenciaSocial: { x: 22.2, z: -4.6 },
    saude:         { x: 28.1, z: -4.6 },
    frigobar:      { x: -13.3, z: -8.2 },
    conclusos:     { x: -12.9, z: -6.4 },
    estante:       { x: -13.3, z: -4.4 },
    janelaGab:     { x: -13.4, z: -6.5 },
    quadroConquistas: { x: -7.4, z: -2.7 },
    copa:          { x: -3.9, z: -5.4 },
    brinquedoteca: { x: 0.4, z: -5.4 },
    juri:          { x: 25, z: 7 },
    spawnVara2:    { x: 15.4, z: 3.2, angulo: 0 },
    bancadaVara2:  { x: 15.5, z: 9.7 },
    assentosVara2: [ { x: 13.4, z: 6.0 }, { x: 14.2, z: 6.0 }, { x: 16.8, z: 6.0 }, { x: 17.6, z: 6.0 } ]
  };

  /* ---------- Fábricas de material e geometria ---------- */
  function mat(cor, opts) {
    if (opts) return new THREE.MeshLambertMaterial(Object.assign({ color: cor }, opts));
    return TOGA.texturas3d.matPlastico(cor);   // plástico ABS com cache
  }

  /* ---------- Studs de verdade (peças sobre os móveis) ----------
     Cada superfície que pede `studs` acumula posições num balde
     por cor; ao final, UM InstancedMesh por cor desenha todos —
     milhares de pinos por 1–2 draw calls. Na qualidade "baixa",
     ficam invisíveis (nucleo3d.aplicarQualidade).             */
  const baldesStuds = {};
  const studsMeshes = [];
  function marcarStuds(cx, topoY, cz, w, d, cor, rotY) {
    const passo = 0.24, margem = 0.10;
    const nx = Math.max(1, Math.floor((w - margem * 2) / passo) + 1);
    const nz = Math.max(1, Math.floor((d - margem * 2) / passo) + 1);
    const x0 = -((nx - 1) * passo) / 2, z0 = -((nz - 1) * passo) / 2;
    const cos = Math.cos(rotY || 0), sin = Math.sin(rotY || 0);
    const lista = baldesStuds[cor] = baldesStuds[cor] || [];
    for (let i = 0; i < nx; i++) {
      for (let j = 0; j < nz; j++) {
        const lx = x0 + i * passo, lz = z0 + j * passo;
        lista.push({ x: cx + lx * cos + lz * sin, y: topoY + 0.013, z: cz - lx * sin + lz * cos });
      }
    }
  }
  function construirStuds(scene) {
    const geoStud = new THREE.CylinderGeometry(0.045, 0.045, 0.026, 10);
    const m4 = new THREE.Matrix4();
    Object.keys(baldesStuds).forEach(function (cor) {
      const lista = baldesStuds[cor];
      const im = new THREE.InstancedMesh(geoStud, mat(cor), lista.length);
      lista.forEach(function (p, i) {
        m4.makeTranslation(p.x, p.y, p.z);
        im.setMatrixAt(i, m4);
      });
      im.instanceMatrix.needsUpdate = true;
      im.receiveShadow = true;
      scene.add(im);
      studsMeshes.push(im);
    });
  }
  /* Material com textura procedural, com repetição própria
     (clona a textura do cache para não dividir o `repeat`). */
  function matTex(textura, repX, repY) {
    const tx = textura.clone();
    tx.needsUpdate = true;
    tx.repeat.set(repX || 1, repY || 1);
    return new THREE.MeshLambertMaterial({ map: tx });
  }
  function caixa(scene, w, h, d, x, y, z, material, opcoes) {
    opcoes = opcoes || {};
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    m.position.set(x, y, z);
    if (opcoes.rotY) m.rotation.y = opcoes.rotY;
    m.castShadow = true;
    m.receiveShadow = true;
    if (opcoes.studs) marcarStuds(x, y + h / 2, z, w, d, opcoes.studs, opcoes.rotY);
    scene.add(m);
    if (opcoes.colide !== false) {
      colisores.push({ minX: x - w / 2 - 0.05, maxX: x + w / 2 + 0.05,
                       minZ: z - d / 2 - 0.05, maxZ: z + d / 2 + 0.05 });
    }
    if (opcoes.bloqueiaCamera) paredesCamera.push(m);
    return m;
  }

  /* Parede entre dois pontos do plano (sempre alinhada a um eixo).
     Sem material explícito, ganha a textura de lambri repetida
     conforme o comprimento (sem esticar).                       */
  function parede(scene, x1, z1, x2, z2, material) {
    const horizontal = Math.abs(x2 - x1) > Math.abs(z2 - z1);
    const esp = 0.25;
    const w = horizontal ? Math.abs(x2 - x1) : esp;
    const d = horizontal ? esp : Math.abs(z2 - z1);
    if (!material && TOGA.texturas3d.parede) {
      const comprimento = Math.max(w, d);
      material = matTex(TOGA.texturas3d.parede(), Math.max(1, Math.round(comprimento / 3.2)), 1);
    }
    return caixa(scene, w, ALTURA, d, (x1 + x2) / 2, ALTURA / 2, (z1 + z2) / 2,
                 material, { bloqueiaCamera: true });
  }

  function piso(scene, x1, z1, x2, z2, cor, textura) {
    const w = Math.abs(x2 - x1), d = Math.abs(z2 - z1);
    const g = new THREE.PlaneGeometry(w, d);
    const material = textura ? matTex(textura, w / 2.4, d / 2.4) : mat(cor);
    const m = new THREE.Mesh(g, material);
    m.rotation.x = -Math.PI / 2;
    m.position.set((x1 + x2) / 2, 0, (z1 + z2) / 2);
    m.receiveShadow = true;
    scene.add(m);
    return m;
  }

  function janela(scene, x, z, rotY, larg) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(larg || 1.6, 1.1),
      new THREE.MeshBasicMaterial({ color: 0xffdf9e }));
    m.position.set(x, 2.1, z); m.rotation.y = rotY || 0;
    scene.add(m);
    return m;
  }

  /* ---------- Mobília nomeada ---------- */
  function mesa(scene, x, z, w, d, rotY) {
    const grupo = new THREE.Group();
    // tampo com MADEIRA de verdade (veios), não plástico chapado
    const matTampo = TOGA.texturas3d.madeira
      ? matTex(TOGA.texturas3d.madeira(), Math.max(1, Math.round(w / 1.3)), Math.max(1, Math.round(d / 1.3)))
      : mat(0x7a5634);
    const tampo = new THREE.Mesh(new THREE.BoxGeometry(w, 0.08, d), matTampo);
    tampo.position.y = 0.78;
    tampo.castShadow = true; tampo.receiveShadow = true;
    marcarStuds(x, 0.82, z, w, d, "#7a5634", rotY);
    grupo.add(tampo);
    [[-w/2+0.1, -d/2+0.1], [w/2-0.1, -d/2+0.1], [-w/2+0.1, d/2-0.1], [w/2-0.1, d/2-0.1]].forEach(p => {
      const perna = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.78, 0.08), mat(0x4a3018));
      perna.position.set(p[0], 0.39, p[1]);
      perna.castShadow = true;
      grupo.add(perna);
    });
    grupo.position.set(x, 0, z);
    if (rotY) grupo.rotation.y = rotY;
    scene.add(grupo);
    colisores.push({ minX: x - w/2, maxX: x + w/2, minZ: z - d/2, maxZ: z + d/2 });
    return grupo;
  }

  function cadeira(scene, x, z, rotY, cor) {
    const g = new THREE.Group();
    const assento = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.5), mat(cor || 0x4a3018));
    assento.position.y = 0.45;
    assento.castShadow = true; assento.receiveShadow = true;
    const encosto = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.55, 0.06), mat(cor || 0x4a3018));
    encosto.position.set(0, 0.75, -0.24);
    encosto.castShadow = true;
    g.add(assento, encosto);
    g.position.set(x, 0, z); g.rotation.y = rotY || 0;
    scene.add(g);
    return g; // cadeiras não colidem: NPCs sentam "dentro" delas
  }

  function banco(scene, x, z, larg) {
    caixa(scene, larg || 1.6, 0.45, 0.5, x, 0.225, z, mat(0x33220f), { studs: "#33220f" });
  }

  /* ---------- Adereços reutilizáveis ---------- */
  function lustre(scene, x, z) {
    const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 6), mat(0x241809));
    haste.position.set(x, ALTURA - 0.25, z);
    const globo = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8),
      new THREE.MeshBasicMaterial({ color: 0xffe2a8 }));   // emissivo "de mentira": custo zero
    globo.position.set(x, ALTURA - 0.52, z);
    scene.add(haste, globo);
  }

  function planta(scene, x, z) {
    const vaso = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.12, 0.26, 8), mat(0x6e3a26));
    vaso.position.set(x, 0.13, z);
    vaso.castShadow = true;
    const copa = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.85, 8), mat(0x2f4a3e));
    copa.position.set(x, 0.68, z);
    copa.castShadow = true;
    scene.add(vaso, copa);
  }

  function cortina(scene, x, z, rotY) {
    // dois panos de cada lado da janela
    [-1, 1].forEach(function (lado) {
      const pano = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.9, 0.1), mat(0x5e2424));
      const dx = Math.cos(rotY || 0) * 0.0, dz = 0;     // panos correm ao longo da parede
      if (Math.abs(Math.sin(rotY || 0)) > 0.5) {        // parede leste/oeste: desloca em z
        pano.position.set(x, 1.95, z + lado * 1.1);
      } else {                                          // parede norte/sul: desloca em x
        pano.position.set(x + lado * 1.1 + dx, 1.95, z + dz);
      }
      pano.rotation.y = rotY || 0;
      pano.castShadow = true;
      scene.add(pano);
    });
  }

  /* ---------- Os três ambientes ---------- */
  function construirGabinete(scene) {
    piso(scene, -14, -9, -6, -2, 0x3a2b1b, TOGA.texturas3d.pisoSala && TOGA.texturas3d.pisoSala());
    parede(scene, -14, -9, -6, -9);                   // fundo
    parede(scene, -14, -9, -14, -2);                  // oeste
    parede(scene, -6, -9, -6, -2);                    // leste
    parede(scene, -14, -2, -10.6, -2);                // norte, trecho 1
    parede(scene, -8.6, -2, -6, -2);                  // norte, trecho 2 (vão = porta)

    // Mesa do juiz com computador e pilha de autos
    mesa(scene, -12, -7.2, 2.6, 1.1);
    const monitor = caixa(scene, 0.55, 0.38, 0.06, -12.6, 1.06, -7.35, mat(0x1d150d), { colide: false });
    const telaPC = new THREE.Mesh(new THREE.PlaneGeometry(0.48, 0.3),
      new THREE.MeshBasicMaterial({ color: 0x9fc3ae }));
    telaPC.position.set(-12.6, 1.06, -7.31); scene.add(telaPC);
    // autos = três caixinhas empilhadas cor de papel
    caixa(scene, 0.45, 0.07, 0.32, -11.2, 0.86, -7.2, mat(0xf4ecd9), { colide: false });
    caixa(scene, 0.42, 0.07, 0.30, -11.22, 0.93, -7.18, mat(0xe2d6ba), { colide: false, rotY: 0.12 });
    caixa(scene, 0.45, 0.07, 0.32, -11.18, 1.00, -7.22, mat(0xefe5c8), { colide: false, rotY: -0.08 });
    cadeira(scene, -12, -7.9, Math.PI, 0x2a1d12);

    // Cafeteira sobre um aparador
    caixa(scene, 1.2, 0.85, 0.5, -6.8, 0.425, -8.5, mat(0x4a3018), { studs: "#4a3018" });
    caixa(scene, 0.3, 0.42, 0.3, -6.8, 1.06, -8.5, mat(0x1d150d), { colide: false });

    // Estante de livros (low-poly: caixa com "lombadas")
    caixa(scene, 0.4, 2.4, 2.4, -13.7, 1.2, -4.4, mat(0x33220f));
    for (let i = 0; i < 10; i++) {
      caixa(scene, 0.1, 0.3, 0.18, -13.45, 0.6 + (i % 5) * 0.42, -5.2 + Math.floor(i / 5) * 1.4,
        mat([0x7a2e2e, 0x2f4a3e, 0xc9a35c, 0x33424f][i % 4]), { colide: false });
    }

    // Mesa da assessora-chefe Laís (canto norte-leste)
    mesa(scene, -7.2, -3.6, 1.6, 0.9);
    cadeira(scene, -7.2, -3.0, 0, 0x2a1d12);

    /* as ESTAÇÕES de Bruna e Beatriz: mesa, computador e cadeira.
       (Quem as procura nem sempre as encontra aqui — assessoras
       boas circulam o fórum o dia inteiro.)                    */
    function estacao(x, z, corTela, invertida) {
      // invertida: a cadeira fica ao NORTE da mesa (quem senta olha o sul)
      const ladoTela = invertida ? 1 : -1;
      mesa(scene, x, z, 1.3, 0.7);
      caixa(scene, 0.5, 0.34, 0.06, x, 1.02, z + ladoTela * 0.18, mat(0x1d150d), { colide: false }); // monitor
      const tela = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.26),
        new THREE.MeshBasicMaterial({ color: corTela }));
      tela.position.set(x, 1.02, z + ladoTela * 0.14);
      if (invertida) tela.rotation.y = Math.PI;
      scene.add(tela);
      caixa(scene, 0.34, 0.025, 0.13, x, 0.835, z - ladoTela * 0.12, mat(0x2a2a30), { colide: false }); // teclado
      cadeira(scene, x, z - ladoTela * 0.7, invertida ? Math.PI : 0, 0x2a1d12);
    }
    // Bruna: canto sul-leste, LONGE da mesa da Laís (que senta em ~-7.2,-5.15)
    estacao(-9.2, -8.1, 0x9fc3ae, true);   // cadeira ao norte; ela olha o sul
    estacao(-12.6, -4.3, 0xa8c8e0);        // Beatriz (pesquisa, azul)

    janela(scene, -13.85, -6.5, Math.PI / 2);
    // persiana entreaberta sobre a janela do gabinete
    caixa(scene, 0.05, 1.3, 1.8, -13.76, 2.1, -6.5, mat(0xd8cdb0), { colide: false });

    // QUADRO DE CONQUISTAS na parede norte (vitrine de medalhas)
    // — afastado da parede (sem z-fighting) e com as faces viradas
    //   para DENTRO do gabinete, de onde o juiz olha
    caixa(scene, 0.8, 0.62, 0.04, -7.4, 1.85, -2.22, mat(0x8a6240), { colide: false });
    const fundoConq = new THREE.Mesh(new THREE.PlaneGeometry(0.68, 0.5),
      new THREE.MeshLambertMaterial({ color: 0x2a1d12 }));
    fundoConq.position.set(-7.4, 1.85, -2.245);
    fundoConq.rotation.y = Math.PI;
    scene.add(fundoConq);
    for (let i = 0; i < 6; i++) {   // medalhinhas decorativas
      const med = new THREE.Mesh(new THREE.CircleGeometry(0.045, 10), mat(0xc9a35c));
      med.position.set(-7.62 + (i % 3) * 0.22, 1.94 - Math.floor(i / 3) * 0.18, -2.25);
      med.rotation.y = Math.PI;
      scene.add(med);
    }
    // xícara sobre o aparador do café
    caixa(scene, 0.09, 0.08, 0.09, -6.5, 0.89, -8.35, mat(0xf4ecd9), { colide: false });
    // frigobar do gabinete (a toga também tem fome)
    caixa(scene, 0.6, 0.85, 0.55, -13.3, 0.42, -8.2, mat(0xe8e6da));
    caixa(scene, 0.5, 0.04, 0.04, -13.3, 0.55, -7.9, mat(0x8a8378), { colide: false }); // puxador
    // pilha de CONCLUSOS sobre a mesa (os despachos do dia)
    caixa(scene, 0.5, 0.09, 0.36, -12.9, 0.87, -6.85, mat(0xf4ecd9), { colide: false });
    caixa(scene, 0.46, 0.09, 0.34, -12.88, 0.96, -6.83, mat(0xe2d6ba), { colide: false, rotY: 0.1 });
    caixa(scene, 0.48, 0.09, 0.35, -12.92, 1.05, -6.87, mat(0xefe5c8), { colide: false, rotY: -0.07 });
    lustre(scene, -10, -5.5);
    planta(scene, -6.5, -2.7);
  }

  function construirCorredor(scene) {
    piso(scene, -14, -2, 30, 2, 0x2e2114, TOGA.texturas3d.pisoCorredor && TOGA.texturas3d.pisoCorredor());
    // sul do corredor: vãos da sala [0.2,1.8], da 2ª vara [14.6,16.2]
    // e do SALÃO DO JÚRI [23.4,24.6]
    parede(scene, -14, 2, 0.2, 2);
    parede(scene, 1.8, 2, 14.6, 2);
    parede(scene, 16.2, 2, 23.4, 2);
    parede(scene, 24.6, 2, 30, 2);
    // norte do corredor: vãos do gabinete [-10.6,-8.6], da COPA
    // [-5.4,-4.2], da BRINQUEDOTECA [-0.6,0.6], da distribuição
    // [3.4,4.6] e da assistência social [21.6,22.8]; a frente da CELA
    // (x∈[12,17]) é GRADE, construída em construirCela()
    parede(scene, -8.6, -2, -5.4, -2);
    parede(scene, -4.2, -2, -0.6, -2);
    parede(scene, 0.6, -2, 3.4, -2);
    parede(scene, 4.6, -2, 12, -2);
    parede(scene, 17, -2, 21.6, -2);
    parede(scene, 22.8, -2, 27.2, -2);
    // vão do setor de saúde em x∈[27.2,28.4]
    parede(scene, 28.4, -2, 30, -2);
    // (o corredor segue para a ALA LESTE — parede final em x=38,
    //  erguida em construirAlaLeste)
    parede(scene, -14, -2, -14, 2);                  // oeste (porta de SAÍDA do fórum — decorativa)

    // bebedouro da ala nova
    caixa(scene, 0.45, 1.05, 0.4, 10.5, 0.52, -1.7, mat(0x9aa8b0));
    caixa(scene, 0.3, 0.12, 0.3, 10.5, 1.12, -1.7, mat(0xb9d2e0), { colide: false });

    // placas de identificação sobre as portas
    // (afastadas 6 cm da face da parede + polygonOffset: sem
    // z-fighting — as placas "piscavam" de longe com a neblina aberta)
    if (TOGA.texturas3d.placa) {
      [["GABINETE — JUIZ(A) DA 1ª VARA", -9.6, -1.81, 0, 3.0],
       ["DISTRIBUIÇÃO", 4.0, -1.81, 0, 1.4],
       ["DIRETORIA DO FORO", 4.0, -1.81, 0, 1.4, 2.18],     // segunda linha de placas
       ["CENTRAL DE MANDADOS", 4.0, -1.81, 0, 1.4, 1.81],
       ["CUSTÓDIA", 13.7, -1.80, 0, 1.4],
       ["ASSISTÊNCIA SOCIAL", 22.2, -1.81, 0, 1.4],
       ["SETOR DE SAÚDE", 27.8, -1.81, 0, 1.4],
       ["COPA", -4.8, -1.81, 0, 1.0],
       ["BRINQUEDOTECA", 0, -1.81, 0, 1.4],
       ["1ª VARA", 1.0, 1.81, Math.PI, 1.4],
       ["2ª VARA · CUSTÓDIA", 15.4, 1.81, Math.PI, 1.6],
       ["SALÃO DO JÚRI", 24, 1.81, Math.PI, 1.4]].forEach(function (p) {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(p[4], 0.36),
          new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.placa(p[0]),
            polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
        m.position.set(p[1], p[5] || 2.55, p[2]);
        m.rotation.y = p[3];
        scene.add(m);
      });
    }

    // Porta de saída desenhada na parede oeste
    caixa(scene, 0.1, 2.4, 1.6, -13.85, 1.2, 0, mat(0x241809), { colide: false });

    // Bancos de espera + balcão da secretaria
    pontos.bancosCorredor.forEach(b => banco(scene, b.x, b.z, 1.5));
    caixa(scene, 2.2, 1.05, 0.6, 5.5, 0.525, -1.6, mat(0x5e3f22), { studs: "#5e3f22" }); // balcão
    janela(scene, 7.5, -1.95, 0, 2.0);                                   // guichê iluminado

    // Mural de avisos (papéis desenhados na textura)
    caixa(scene, 1.8, 1.2, 0.06, -5, 1.7, 1.94, mat(0x241809), { colide: false });
    const folhas = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.9),
      TOGA.texturas3d.mural ? new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.mural() })
                            : new THREE.MeshBasicMaterial({ color: 0xf4ecd9 }));
    folhas.position.set(-5, 1.7, 1.9); folhas.rotation.y = Math.PI;
    scene.add(folhas);

    // Porta para o JUIZADO ESPECIAL (parede sul do corredor, no caminho
    // principal entre o gabinete e a sala — x≈-7). Portal destacado:
    // batentes claros, lintel, folha de porta e placa iluminada.
    const PJ = -7;
    caixa(scene, 1.5, 2.3, 0.10, PJ, 1.15, 1.92, mat(0x3a2412), { colide: false });     // vão escuro
    caixa(scene, 1.3, 2.05, 0.06, PJ, 1.02, 1.88, mat(0x6e4a2a), { colide: false });    // folha de porta (madeira)
    caixa(scene, 0.18, 2.3, 0.16, PJ - 0.84, 1.15, 1.9, mat(0xc9a35c), { colide: false }); // batente esq (latão)
    caixa(scene, 0.18, 2.3, 0.16, PJ + 0.84, 1.15, 1.9, mat(0xc9a35c), { colide: false }); // batente dir
    caixa(scene, 1.86, 0.18, 0.16, PJ, 2.35, 1.9, mat(0xc9a35c), { colide: false });    // lintel
    caixa(scene, 0.06, 0.34, 0.04, PJ + 0.45, 1.05, 1.82, mat(0xe7cf9a), { colide: false, semSombra: true }); // maçaneta
    // placa iluminada acima da porta
    const placaFundo = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 0.42),
      new THREE.MeshBasicMaterial({ color: 0x23396b }));
    placaFundo.position.set(PJ, 2.66, 1.86); placaFundo.rotation.y = Math.PI;
    scene.add(placaFundo);
    if (TOGA.texturas3d.placa) {
      const placaJ = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 0.34),
        new THREE.MeshBasicMaterial({ map: TOGA.texturas3d.placa("JUIZADO ESPECIAL"),
          transparent: true, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
      placaJ.position.set(PJ, 2.66, 1.855); placaJ.rotation.y = Math.PI;
      scene.add(placaJ);
    }
    // tapete de boas-vindas no chão, em frente à porta (pista visual)
    caixa(scene, 1.4, 0.02, 0.9, PJ, 0.02, 1.25, mat(0x5e2424), { colide: false, semSombra: true });

    // Quadros, luz e plantas: o corredor deixa de ser um tubo vazio
    if (TOGA.texturas3d.quadro) {
      [[-1.5, 1], [3.2, 2]].forEach(function (q) {
        const quadro = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.75),
          new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.quadro(q[1]) }));
        quadro.position.set(q[0], 1.9, -1.86);
        scene.add(quadro);
      });
    }
    lustre(scene, -6, 0); lustre(scene, 2, 0);
    planta(scene, -13.2, 1.5);
  }

  function construirSala(scene) {
    piso(scene, -6, 2, 9, 17, 0x3a2b1b, TOGA.texturas3d.pisoSala && TOGA.texturas3d.pisoSala());
    parede(scene, -6, 17, 9, 17);                    // fundo (atrás da bancada)
    parede(scene, -6, 2, -6, 17);                    // oeste
    parede(scene, 9, 2, 9, 17);                      // leste
    // norte (parede do corredor) — os trechos já foram erguidos pelo corredor

    // Tapete vinho do vão da porta até a bancada
    if (TOGA.texturas3d.tapete) {
      const tap = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 11.6),
        matTex(TOGA.texturas3d.tapete(), 1, 6));
      tap.rotation.x = -Math.PI / 2;
      tap.position.set(1, 0.01, 8.0);
      tap.receiveShadow = true;
      scene.add(tap);
    }

    // Janelas altas com luz quente (como no SVG) + cortinas
    janela(scene, -5.85, 6, Math.PI / 2); janela(scene, -5.85, 10, Math.PI / 2);
    janela(scene, 8.85, 6, -Math.PI / 2); janela(scene, 8.85, 10, -Math.PI / 2);
    cortina(scene, -5.78, 6, Math.PI / 2); cortina(scene, -5.78, 10, Math.PI / 2);
    cortina(scene, 8.78, 6, -Math.PI / 2); cortina(scene, 8.78, 10, -Math.PI / 2);

    // BANCADA do juiz: pódio elevado ao fundo (tampo de madeira viva)
    caixa(scene, 6.4, 0.5, 2.2, 1, 0.25, 15.2, mat(0x33200e), { studs: "#33200e" }); // estrado
    caixa(scene, 5.6, 1.15, 0.5, 1, 0.95, 14.4, mat(0x5e3f22));           // frontão
    caixa(scene, 5.6, 0.09, 0.8, 1, 1.55, 14.55,
      TOGA.texturas3d.madeira ? matTex(TOGA.texturas3d.madeira(), 4, 1) : mat(0x8a6240),
      { colide: false, studs: "#8a6240" }); // tampo
    // a placa institucional no frontão — toda sala de júri/audiência tem
    if (TOGA.texturas3d.placa) {
      const pj = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.34),
        new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.placa("PODER JUDICIÁRIO"),
          polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
      pj.position.set(1, 1.08, 14.1);
      pj.rotation.y = Math.PI;
      scene.add(pj);
    }
    cadeira(scene, 1, 15.3, Math.PI, 0x15110c);                            // cadeira do juiz

    // Brasão na parede do fundo — o MESMO desenho do menu,
    // agora em textura de verdade (balança e tudo)
    const aro = new THREE.Mesh(new THREE.CircleGeometry(0.74, 28),
      new THREE.MeshBasicMaterial({ color: 0xc9a35c }));
    aro.position.set(1, 2.5, 16.85); aro.rotation.y = Math.PI;
    scene.add(aro);
    const brasao = new THREE.Mesh(new THREE.CircleGeometry(0.68, 28),
      TOGA.texturas3d.brasao ? new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.brasao() })
                             : new THREE.MeshBasicMaterial({ color: 0x463422 }));
    brasao.position.set(1, 2.5, 16.84); brasao.rotation.y = Math.PI;
    scene.add(brasao);

    // Bandeira ao lado da bancada
    const mastro = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.6, 8), mat(0x241809));
    mastro.position.set(4.4, 1.3, 16.3);
    mastro.castShadow = true;
    const pano = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 1.25), mat(0x2f4a3e));
    pano.position.set(4.4, 1.85, 16.34); pano.rotation.y = Math.PI;
    const circulo = new THREE.Mesh(new THREE.CircleGeometry(0.2, 16),
      new THREE.MeshBasicMaterial({ color: 0xc9a35c }));
    circulo.position.set(4.4, 1.85, 16.33); circulo.rotation.y = Math.PI;
    scene.add(mastro, pano, circulo);

    // Lustres do salão (pontos de luz "de mentira", custo zero)
    lustre(scene, 1, 6.5); lustre(scene, -3, 10.5); lustre(scene, 5, 10.5); lustre(scene, 1, 13.5);
    planta(scene, -5.4, 2.7); planta(scene, 8.4, 2.7);

    // Martelo sobre a bancada (animado pelo cena3d)
    const martelo = new THREE.Group();
    const cabo = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.34, 8), mat(0x6e4a26));
    cabo.rotation.z = Math.PI / 2; cabo.position.x = 0.17;
    const cabeca = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.16, 10), mat(0x8a6240));
    cabeca.rotation.x = Math.PI / 2;
    martelo.add(cabo, cabeca);
    martelo.position.set(2.6, 1.65, 14.55);
    martelo.rotation.z = 0.38;          // repouso, cabo apoiado
    scene.add(martelo);
    pontos.meshMartelo = martelo;

    // Mesa do depoente (centro) + microfone
    mesa(scene, ASSENTOS3D.centro.x, ASSENTOS3D.centro.z - 0.7, 1.6, 0.8);
    caixa(scene, 0.03, 0.3, 0.03, ASSENTOS3D.centro.x + 0.2, 0.95, ASSENTOS3D.centro.z - 0.8, mat(0x1a1208), { colide: false });

    // Mesas das partes (esquerda = MP/autor, direita = defesa)
    mesa(scene, -3.8, 10.4, 3.6, 1.0, 0.18);
    mesa(scene, 5.8, 10.4, 3.6, 1.0, -0.18);

    // Cadeiras de todos os assentos
    Object.keys(ASSENTOS3D).forEach(k => {
      const a = ASSENTOS3D[k];
      cadeira(scene, a.x, a.z + 0.35, 0, 0x4a3018);
    });

    // Bancos do público (perto da porta), agora com encosto
    [[-2.5, 3.6], [4.5, 3.6], [-2.5, 4.8], [4.5, 4.8]].forEach(function (b) {
      banco(scene, b[0], b[1], 3);
      caixa(scene, 3, 0.5, 0.07, b[0], 0.7, b[1] - 0.27, mat(0x33220f), { colide: false });
    });

    // Relógio de parede (ponteiros girados pelo cena3d.ajustarRelogio)
    const relogio = new THREE.Group();
    const face = new THREE.Mesh(new THREE.CircleGeometry(0.34, 20),
      new THREE.MeshBasicMaterial({ color: 0xf4ecd9 }));
    const ponteiroH = new THREE.Mesh(new THREE.PlaneGeometry(0.05, 0.18),
      new THREE.MeshBasicMaterial({ color: 0x241c10 }));
    ponteiroH.geometry.translate(0, 0.09, 0); ponteiroH.position.z = 0.01;
    const ponteiroM = new THREE.Mesh(new THREE.PlaneGeometry(0.03, 0.27),
      new THREE.MeshBasicMaterial({ color: 0x241c10 }));
    ponteiroM.geometry.translate(0, 0.135, 0); ponteiroM.position.z = 0.012;
    relogio.add(face, ponteiroH, ponteiroM);
    relogio.position.set(-3.5, 2.6, 16.85); relogio.rotation.y = Math.PI;
    scene.add(relogio);
    pontos.relogioParede = { ponteiroH: ponteiroH, ponteiroM: ponteiroM };
  }

  /* ---------- A ALA NOVA ---------- */

  function construirDistribuicao(scene) {
    piso(scene, 3, -8, 9, -2, 0x352718, TOGA.texturas3d.pisoCorredor && TOGA.texturas3d.pisoCorredor());
    parede(scene, 3, -8, 9, -8);                 // fundo
    parede(scene, 3, -8, 3, -2);                 // oeste
    parede(scene, 9, -8, 9, -2);                 // leste
    // estantes de processos (o cartório transbordando de autos)
    caixa(scene, 0.4, 2.2, 2.6, 3.35, 1.1, -5.2, mat(0x33220f));
    for (let i = 0; i < 12; i++) {
      caixa(scene, 0.1, 0.28, 0.2, 3.6, 0.5 + (i % 4) * 0.5, -6.3 + Math.floor(i / 4) * 1.1,
        mat([0xf4ecd9, 0xe2d6ba, 0xc9a35c, 0x7a2e2e][i % 4]), { colide: false });
    }
    caixa(scene, 0.4, 2.2, 2.6, 8.65, 1.1, -5.2, mat(0x33220f));
    for (let i = 0; i < 12; i++) {
      caixa(scene, 0.1, 0.28, 0.2, 8.4, 0.5 + (i % 4) * 0.5, -6.3 + Math.floor(i / 4) * 1.1,
        mat([0xe2d6ba, 0x2f4a3e, 0xf4ecd9, 0x33424f][i % 4]), { colide: false });
    }
    // a mesa da SUPERVISORA (a diretoria do foro divide a sala)
    mesa(scene, 5.4, -7.0, 1.6, 0.8);
    cadeira(scene, 5.4, -7.6, Math.PI, 0x2a1d12);

    // mesa do servidor da distribuição, atrás do guichê
    mesa(scene, 7.4, -3.2, 1.6, 0.8);
    cadeira(scene, 7.4, -2.7, 0, 0x2a1d12);
    lustre(scene, 6, -5);
  }

  function construirCela(scene) {
    piso(scene, 12, -7, 17, -2, 0x4a443c);       // piso frio, sem studs: ninguém escolhe estar aqui
    parede(scene, 12, -7, 17, -7);               // fundo
    parede(scene, 12, -7, 12, -2);               // oeste
    parede(scene, 17, -7, 17, -2);               // leste

    // FRENTE = grade de barras (InstancedMesh) com vão de portão x∈[13.2,14.2]
    const posBarras = [];
    for (let x = 12.12; x <= 16.92; x += 0.22) {
      if (x > 13.2 && x < 14.2) continue;        // vão do portão
      posBarras.push(x);
    }
    const geoBarra = new THREE.CylinderGeometry(0.035, 0.035, ALTURA - 0.3, 6);
    const barras = new THREE.InstancedMesh(geoBarra, mat(0x6f7680), posBarras.length);
    const m4 = new THREE.Matrix4();
    posBarras.forEach(function (x, i) {
      m4.makeTranslation(x, (ALTURA - 0.3) / 2, -2);
      barras.setMatrixAt(i, m4);
    });
    barras.instanceMatrix.needsUpdate = true;
    barras.castShadow = true;
    scene.add(barras);
    // travessas superior/inferior
    caixa(scene, 5, 0.1, 0.08, 14.5, ALTURA - 0.28, -2, mat(0x6f7680), { colide: false });
    caixa(scene, 5, 0.1, 0.08, 14.5, 0.08, -2, mat(0x6f7680), { colide: false });
    // colisores das grades (o jogador não atravessa; o vão do portão
    // também é fechado — só NPCs escoltados entram, por waypoint)
    colisores.push({ minX: 11.95, maxX: 13.25, minZ: -2.12, maxZ: -1.88 });
    colisores.push({ minX: 14.15, maxX: 17.05, minZ: -2.12, maxZ: -1.88 });
    colisores.push({ minX: 13.2,  maxX: 14.2,  minZ: -2.12, maxZ: -1.88 });

    // PORTÃO: grupo de barras com pivô na lateral (anima na escolta)
    const portao = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const b = new THREE.Mesh(geoBarra, mat(0x6f7680));
      b.position.set(0.1 + i * 0.2, (ALTURA - 0.3) / 2, 0);
      portao.add(b);
    }
    const trava = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.08, 0.06), mat(0x4d545c));
    trava.position.set(0.5, 1.1, 0);
    portao.add(trava);
    portao.position.set(13.2, 0, -2);
    scene.add(portao);
    pontos.meshPortaoCela = portao;

    // dentro: banco de concreto e um catre
    caixa(scene, 2.4, 0.42, 0.55, 14.6, 0.21, -5.6, mat(0x57534b));
    caixa(scene, 0.9, 0.25, 1.9, 16.3, 0.13, -4.2, mat(0x5a5148));
    caixa(scene, 0.9, 0.1, 0.5, 16.3, 0.3, -3.5, mat(0x8a8378), { colide: false });
  }

  function construirAssistencia(scene) {
    piso(scene, 19, -8, 26, -2, 0x352718, TOGA.texturas3d.pisoCorredor && TOGA.texturas3d.pisoCorredor());
    parede(scene, 19, -8, 26, -8);               // fundo
    parede(scene, 19, -8, 19, -2);               // oeste
    parede(scene, 26, -8, 26, -2);               // leste
    // mesa de atendimento + cadeiras (a assistente fica do lado de lá)
    mesa(scene, 22.2, -5.2, 1.8, 0.9);
    cadeira(scene, 22.2, -5.9, Math.PI, 0x2a1d12);     // dela
    cadeira(scene, 21.8, -4.5, 0, 0x4a3018);           // de quem chega
    cadeira(scene, 22.7, -4.5, 0, 0x4a3018);
    // armário de cestas básicas e cobertores (peças coloridas e sóbrias)
    caixa(scene, 0.5, 1.8, 2.2, 25.6, 0.9, -5.2, mat(0x4a3018));
    [0xb98d4f, 0x6f8a96, 0x7a8a5a, 0x9a6a5a].forEach(function (cor, i) {
      caixa(scene, 0.42, 0.34, 0.42, 25.55, 0.42 + i * 0.42, -5.9 + (i % 2) * 1.4, mat(cor), { colide: false });
    });
    // cartaz da rede de apoio (CRAS/CREAS)
    if (TOGA.texturas3d.quadro) {
      const cartaz = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.85),
        new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.quadro(2) }));
      cartaz.position.set(22.2, 1.95, -7.92);
      scene.add(cartaz);
    }
    lustre(scene, 22.2, -5);
    planta(scene, 19.6, -2.7);
  }

  function construirSaude(scene) {
    piso(scene, 26, -8, 30, -2, 0x3d4640);          // piso esverdeado de posto
    parede(scene, 26, -8, 30, -8);                  // fundo
    parede(scene, 26, -8, 26, -2);                  // oeste
    // leste é a própria parede externa (x=30, já erguida pelo corredor)

    // maca de atendimento
    caixa(scene, 0.8, 0.55, 1.9, 28.9, 0.27, -5.4, mat(0xd8d4c8));
    caixa(scene, 0.8, 0.12, 0.5, 28.9, 0.62, -6.1, mat(0xb9d2e0), { colide: false }); // travesseiro
    // armário branco com cruz
    caixa(scene, 1.4, 1.9, 0.45, 26.8, 0.95, -7.6, mat(0xe8e6da));
    const cruz1 = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.1, 0.03), mat(0xb03a3a));
    cruz1.position.set(26.8, 1.45, -7.35);
    const cruz2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.34, 0.03), mat(0xb03a3a));
    cruz2.position.set(26.8, 1.45, -7.35);
    scene.add(cruz1, cruz2);
    // mesa da médica + cadeiras
    mesa(scene, 27.4, -4.2, 1.4, 0.8);
    cadeira(scene, 27.4, -4.9, Math.PI, 0x2a1d12);
    cadeira(scene, 27.4, -3.5, 0, 0x4a3018);
    // biombo
    caixa(scene, 0.06, 1.7, 1.6, 28.2, 0.85, -6.4, mat(0xcfd8cf), { colide: false });
    lustre(scene, 28, -5);
  }

  function construirVara2(scene) {
    piso(scene, 11, 2, 20, 11, 0x3a2b1b, TOGA.texturas3d.pisoSala && TOGA.texturas3d.pisoSala());
    parede(scene, 11, 11, 20, 11);               // fundo (atrás da bancada)
    parede(scene, 11, 2, 11, 11);                // oeste
    parede(scene, 20, 2, 20, 11);                // leste

    // bancada compacta
    caixa(scene, 4.2, 0.4, 1.6, 15.5, 0.2, 9.8, mat(0x33200e), { studs: "#33200e" });
    caixa(scene, 3.6, 1.0, 0.4, 15.5, 0.8, 9.2, mat(0x5e3f22));
    caixa(scene, 3.6, 0.08, 0.7, 15.5, 1.34, 9.3, mat(0x8a6240), { colide: false, studs: "#8a6240" });
    cadeira(scene, 15.5, 10.2, Math.PI, 0x15110c);
    // brasão menor
    const aro2 = new THREE.Mesh(new THREE.CircleGeometry(0.5, 24),
      new THREE.MeshBasicMaterial({ color: 0xc9a35c }));
    aro2.position.set(15.5, 2.3, 10.85); aro2.rotation.y = Math.PI;
    scene.add(aro2);
    const brasao2 = new THREE.Mesh(new THREE.CircleGeometry(0.45, 24),
      TOGA.texturas3d.brasao ? new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.brasao() })
                             : new THREE.MeshBasicMaterial({ color: 0x463422 }));
    brasao2.position.set(15.5, 2.3, 10.84); brasao2.rotation.y = Math.PI;
    scene.add(brasao2);
    // mesas das partes + cadeiras dos assentos
    mesa(scene, 13.8, 6.8, 2.4, 0.9, 0.1);
    mesa(scene, 17.2, 6.8, 2.4, 0.9, -0.1);
    pontos.assentosVara2.forEach(function (a) { cadeira(scene, a.x, a.z + 0.35, 0, 0x4a3018); });
    // tapete + janela + luz
    if (TOGA.texturas3d.tapete) {
      const tap = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 7.4), matTex(TOGA.texturas3d.tapete(), 1, 4));
      tap.rotation.x = -Math.PI / 2;
      tap.position.set(15.4, 0.01, 5.8);
      tap.receiveShadow = true;
      scene.add(tap);
    }
    janela(scene, 19.85, 6, -Math.PI / 2);
    cortina(scene, 19.78, 6, -Math.PI / 2);
    lustre(scene, 15.5, 6); lustre(scene, 15.5, 9);
  }

  function teto(scene) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(64, 40), mat(0x241a10));
    m.rotation.x = Math.PI / 2;
    m.position.set(10, ALTURA, 4);
    scene.add(m);
  }

  /* ---------- API ---------- */
  /* ---------- COPA: o coração não-oficial do fórum ---------- */
  function construirCopa(scene) {
    piso(scene, -6, -8, -1.8, -2, 0x4a4434);
    parede(scene, -6, -8, -1.8, -8);                 // fundo
    parede(scene, -1.8, -8, -1.8, -2);               // divisória com a brinquedoteca
    // bancada de pia ao longo do fundo
    caixa(scene, 3.4, 0.9, 0.55, -4.1, 0.45, -7.6, mat(0x8a8378), { studs: "#8a8378" });
    caixa(scene, 0.5, 0.06, 0.4, -5.2, 0.93, -7.6, mat(0xb9c2c8), { colide: false }); // pia
    caixa(scene, 0.04, 0.22, 0.04, -5.2, 1.05, -7.75, mat(0x6a6a6a), { colide: false }); // torneira
    // geladeira alta + micro-ondas + cafeteira grande
    caixa(scene, 0.7, 1.7, 0.65, -2.4, 0.85, -7.55, mat(0xe8e6da));
    caixa(scene, 0.5, 0.3, 0.4, -3.3, 1.06, -7.6, mat(0x2a2a30), { colide: false });
    caixa(scene, 0.26, 0.4, 0.26, -4.6, 1.1, -7.6, mat(0x1d150d), { colide: false });
    // mesa de refeição + cadeiras (onde o fórum conversa de verdade)
    mesa(scene, -3.9, -4.6, 1.5, 1.0);
    cadeira(scene, -4.6, -4.0, 0.6, 0x4a3018);
    cadeira(scene, -3.2, -4.0, -0.6, 0x4a3018);
    cadeira(scene, -3.9, -5.4, Math.PI, 0x4a3018);
    // mural de recados da copa
    caixa(scene, 1.2, 0.8, 0.04, -3.5, 1.9, -7.84, mat(0x5a4128), { colide: false });
  }

  /* ---------- BRINQUEDOTECA: o fórum que não assusta criança ---------- */
  function construirBrinquedoteca(scene) {
    piso(scene, -1.8, -8, 3, -2, 0x55604e);
    parede(scene, -1.8, -8, 3, -8);                  // fundo
    // tapete colorido de retalhos
    [[-0.6, -5.6, 0xc94f4f], [0.4, -5.6, 0x4a6ab8], [-0.6, -4.6, 0xf2b53a],
     [0.4, -4.6, 0x5a9a4e], [-0.1, -5.1, 0xe06a8a]].forEach(function (q) {
      const r = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 0.95),
        new THREE.MeshLambertMaterial({ color: q[2] }));
      r.rotation.x = -Math.PI / 2;
      r.position.set(q[0], 0.012, q[1]);
      scene.add(r);
    });
    // estante baixa com caixas de brinquedos coloridas
    caixa(scene, 2.2, 0.7, 0.45, 1.6, 0.35, -7.6, mat(0xefe5c8));
    [0xc94f4f, 0x4a6ab8, 0xf2b53a, 0x5a9a4e].forEach(function (cor, i) {
      caixa(scene, 0.42, 0.32, 0.34, 0.85 + i * 0.5, 0.88, -7.6, mat(cor), { colide: false });
    });
    // mesinha infantil + banquinhos
    caixa(scene, 0.9, 0.45, 0.9, -0.8, 0.22, -6.8, mat(0xf2b53a), { studs: "#f2b53a" });
    caixa(scene, 0.3, 0.26, 0.3, -1.4, 0.13, -6.4, mat(0xc94f4f));
    caixa(scene, 0.3, 0.26, 0.3, -0.2, 0.13, -6.4, mat(0x4a6ab8));
    // baú de brinquedos + blocos espalhados
    caixa(scene, 0.8, 0.5, 0.5, 2.4, 0.25, -6.6, mat(0x7a2e2e));
    [[1.6, -5.2, 0x5a9a4e], [2.1, -4.6, 0xf2b53a], [1.2, -4.2, 0x4a6ab8]].forEach(function (b) {
      caixa(scene, 0.18, 0.18, 0.18, b[0], 0.09, b[1], mat(b[2]), { colide: false });
    });
    // quadros com desenhos das crianças que passaram por aqui
    if (TOGA.texturas3d.quadro) {
      const q1 = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.6),
        new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.quadro(1) }));
      q1.position.set(0.2, 1.9, -7.84);
      scene.add(q1);
      const q2 = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.6),
        new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.quadro(2) }));
      q2.position.set(-1, 1.9, -7.84);
      scene.add(q2);
    }
  }

  /* ---------- SALÃO DO JÚRI: a sala mais solene do fórum ---------- */
  function construirJuri(scene) {
    piso(scene, 21, 2, 30, 13, 0x3a2b1b, TOGA.texturas3d.pisoSala && TOGA.texturas3d.pisoSala());
    parede(scene, 21, 2, 21, 13);                    // oeste
    parede(scene, 21, 13, 30, 13);                   // fundo
    parede(scene, 30, 2, 30, 13);                    // leste

    // bancada presidencial elevada
    caixa(scene, 5, 0.45, 1.8, 25.5, 0.22, 11.8, mat(0x33200e), { studs: "#33200e" });
    caixa(scene, 4.2, 1.05, 0.45, 25.5, 0.85, 11.2, mat(0x5e3f22));
    caixa(scene, 4.2, 0.08, 0.7, 25.5, 1.42, 11.3,
      TOGA.texturas3d.madeira ? matTex(TOGA.texturas3d.madeira(), 3, 1) : mat(0x8a6240),
      { colide: false, studs: "#8a6240" });
    cadeira(scene, 25.5, 12.2, Math.PI, 0x15110c);
    // brasão + placa
    const aroJ = new THREE.Mesh(new THREE.CircleGeometry(0.55, 24),
      new THREE.MeshBasicMaterial({ color: 0xc9a35c }));
    aroJ.position.set(25.5, 2.4, 12.85); aroJ.rotation.y = Math.PI;
    scene.add(aroJ);
    const brasaoJ = new THREE.Mesh(new THREE.CircleGeometry(0.5, 24),
      TOGA.texturas3d.brasao ? new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.brasao() })
                             : new THREE.MeshBasicMaterial({ color: 0x463422 }));
    brasaoJ.position.set(25.5, 2.4, 12.84); brasaoJ.rotation.y = Math.PI;
    scene.add(brasaoJ);

    // o CONSELHO DE SENTENÇA: 7 cadeiras ENFILEIRADAS na lateral leste
    for (let i = 0; i < 7; i++) {
      cadeira(scene, 29.1, 4.4 + i * 1.05, -Math.PI / 2, 0x4a3018);
    }
    // estrado dos jurados + balaústre do conselho
    caixa(scene, 1.6, 0.18, 8.2, 29.2, 0.09, 7.55, mat(0x33200e), { colide: false, studs: "#33200e" });
    caixa(scene, 0.08, 0.7, 7.6, 28.3, 0.35, 7.9, mat(0x5e3f22), { colide: false });

    // tribuna do orador (de frente para os jurados)
    caixa(scene, 0.8, 1.15, 0.6, 26.6, 0.57, 6.5, mat(0x5e3f22), { studs: "#5e3f22" });

    // PLATEIA: três fileiras encostadas na parede oeste — a porta
    // (x∈[23.4,24.6]) fica com um corredor livre de ~1,3 m até as mesas
    banco(scene, 22.2, 3.6, 2.0);
    banco(scene, 22.2, 4.9, 2.0);
    banco(scene, 22.2, 6.2, 2.0);

    // mesas da acusação e da defesa (centro-leste, fora do corredor da porta)
    mesa(scene, 25.4, 8.6, 1.8, 0.8);
    cadeira(scene, 25.4, 7.9, 0, 0x2a1d12);
    mesa(scene, 25.4, 5.6, 1.8, 0.8);
    cadeira(scene, 25.4, 4.9, 0, 0x2a1d12);
    // cadeira do réu, ao lado da defesa
    cadeira(scene, 24.5, 4.0, 0, 0x2a1d12);

    // mesinha do depoente, de frente para a bancada
    mesa(scene, 24.6, 9.2, 1.3, 0.6);
    caixa(scene, 0.03, 0.3, 0.03, 24.8, 0.95, 9.1, mat(0x1a1208), { colide: false }); // microfone

    // martelo próprio do plenário (animado pelo cena3d)
    const marteloJ = new THREE.Group();
    const caboJ = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.34, 8), mat(0x6e4a26));
    caboJ.rotation.z = Math.PI / 2; caboJ.position.x = 0.17;
    const cabecaJ = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.16, 10), mat(0x8a6240));
    cabecaJ.rotation.x = Math.PI / 2;
    marteloJ.add(caboJ, cabecaJ);
    marteloJ.position.set(26.6, 1.53, 11.3);
    marteloJ.rotation.z = 0.38;
    scene.add(marteloJ);
    pontos.meshMartelo2 = marteloJ;

    // pontos do palco do júri (o cena3d monta a sessão aqui)
    pontos.bancadaJuri = { x: 25.5, z: 12.0 };
    // câmera DENTRO do plenário (a parede do fundo fica em z=13;
    // face interna 12.875): por sobre o ombro esquerdo do juiz,
    // em diagonal — partes ao centro, Conselho de Sentença no quadro
    pontos.cameraBancadaJuri = { pos: { x: 23.9, y: 2.9, z: 12.55 },
                                 alvo: { x: 25.6, y: 1.0, z: 6.4 } };
  }

  /* ---------- ALA LESTE: imprensa e advocacia ---------- */
  function bandeira(scene, x, z, tipo) {
    // mastro + pano — Brasil e Ceará compartilham o desenho-base
    const mastro = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 3.4, 8), mat(0x8a8378));
    mastro.position.set(x, 1.7, z);
    mastro.castShadow = true;
    scene.add(mastro);
    const pano = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.75),
      new THREE.MeshLambertMaterial({ color: 0x2d7a3a, side: THREE.DoubleSide }));
    pano.position.set(x + 0.58, 2.9, z);
    scene.add(pano);
    const losango = new THREE.Mesh(new THREE.CircleGeometry(0.3, 4),
      new THREE.MeshBasicMaterial({ color: 0xe7c43a, side: THREE.DoubleSide }));
    losango.position.set(x + 0.58, 2.9, z + 0.005);
    scene.add(losango);
    const circulo = new THREE.Mesh(new THREE.CircleGeometry(0.15, 14),
      new THREE.MeshBasicMaterial({ color: tipo === "ce" ? 0xf4ecd9 : 0x2a3d7c,
                                    side: THREE.DoubleSide }));
    circulo.position.set(x + 0.58, 2.9, z + 0.01);
    scene.add(circulo);
  }

  function lixeira(scene, x, z) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.15, 0.5, 10), mat(0x44505a));
    m.position.set(x, 0.25, z);
    m.castShadow = true;
    scene.add(m);
  }

  function construirAlaLeste(scene) {
    // ---- extensão do corredor (x 30→38) ----
    piso(scene, 30, -2, 38, 2, 0x2e2114, TOGA.texturas3d.pisoCorredor && TOGA.texturas3d.pisoCorredor());
    // sul: vão da SALA DE IMPRENSA em x∈[33.4,34.6]
    parede(scene, 30, 2, 33.4, 2);
    parede(scene, 34.6, 2, 38, 2);
    // norte: vão da SALA DA OAB em x∈[33.4,34.6]
    parede(scene, 30, -2, 33.4, -2);
    parede(scene, 34.6, -2, 38, -2);
    // antes era o fim da ala; agora abre passagem para a ALA LESTE II
    // (CEJUSC + Gabinete da 2ª Vara) — vão central em z∈[−0.6, 0.6]
    parede(scene, 38, -2, 38, -0.6);
    parede(scene, 38, 0.6, 38, 2);
    // o setor de saúde nunca teve parede leste — agora tem
    parede(scene, 30, -8, 30, -2);

    // ---- SALA DE IMPRENSA (sul, x 31–37, z 2–7) ----
    piso(scene, 31, 2, 37, 7, 0x3a2b1b, TOGA.texturas3d.pisoSala && TOGA.texturas3d.pisoSala());
    parede(scene, 31, 2, 31, 7);                   // oeste
    parede(scene, 37, 2, 37, 7);                   // leste
    parede(scene, 31, 7, 37, 7);                   // fundo
    // bancada da coletiva, de frente para a plateia
    caixa(scene, 3.4, 0.95, 0.6, 34, 0.47, 6.2, mat(0x5e3f22), { studs: "#5e3f22" });
    caixa(scene, 3.4, 0.07, 0.8, 34, 0.99, 6.25,
      TOGA.texturas3d.madeira ? matTex(TOGA.texturas3d.madeira(), 3, 1) : mat(0x8a6240),
      { colide: false });
    [33.1, 34, 34.9].forEach(function (cx) {
      cadeira(scene, cx, 6.65, Math.PI, 0x2a1d12);
      // microfone: haste + cápsula sobre a bancada
      const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.26, 6), mat(0x222222));
      haste.position.set(cx, 1.16, 6.1);
      const capsula = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), mat(0x111111));
      capsula.position.set(cx, 1.3, 6.1);
      scene.add(haste, capsula);
    });
    // painel de fundo da coletiva
    if (TOGA.texturas3d.placa) {
      const painel = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 0.5),
        new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.placa("JUSTIÇA DO CEARÁ"),
          polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
      painel.position.set(34, 2.1, 6.81); painel.rotation.y = Math.PI;
      scene.add(painel);
    }
    // bancos da imprensa + mesinhas de redação com "laptop"
    banco(scene, 32.6, 3.6, 1.6); banco(scene, 35.4, 3.6, 1.6);
    banco(scene, 32.6, 4.8, 1.6); banco(scene, 35.4, 4.8, 1.6);
    mesa(scene, 31.9, 5.4, 1.1, 0.7);
    cadeira(scene, 31.9, 4.8, 0, 0x2a1d12);
    caixa(scene, 0.4, 0.04, 0.3, 31.9, 0.84, 5.4, mat(0x33373d), { colide: false });
    mesa(scene, 36.1, 5.4, 1.1, 0.7);
    cadeira(scene, 36.1, 4.8, 0, 0x2a1d12);
    caixa(scene, 0.4, 0.04, 0.3, 36.1, 0.84, 5.4, mat(0x33373d), { colide: false });
    lustre(scene, 34, 4.5);

    // ---- SALA DA OAB (norte, x 31–37, z −7–−2) ----
    piso(scene, 31, -7, 37, -2, 0x3a2b1b, TOGA.texturas3d.pisoSala && TOGA.texturas3d.pisoSala());
    parede(scene, 31, -7, 31, -2);                 // oeste
    parede(scene, 37, -7, 37, -2);                 // leste
    parede(scene, 31, -7, 37, -7);                 // fundo
    // mesas de trabalho da advocacia
    mesa(scene, 32.6, -5.4, 1.6, 0.8);
    cadeira(scene, 32.6, -6.1, 0, 0x2a1d12);
    cadeira(scene, 32.6, -4.7, Math.PI, 0x4a3018);
    mesa(scene, 35.6, -5.4, 1.6, 0.8);
    cadeira(scene, 35.6, -6.1, 0, 0x2a1d12);
    // estante de livros + cafeteira própria (a OAB não depende da copa)
    caixa(scene, 1.8, 1.9, 0.4, 36.4, 0.95, -6.7, mat(0x4a3018), { studs: "#4a3018" });
    [[-0.5, 1.45], [0, 1.45], [0.5, 1.45], [-0.4, 0.9], [0.3, 0.9]].forEach(function (l) {
      const livro = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.26, 0.1),
        mat([0x7c3030, 0x2f4a3e, 0x8a6240, 0x2a3d7c, 0x5e2424][Math.abs(Math.round(l[0] * 10)) % 5]));
      livro.position.set(36.4 + l[0], l[1], -6.55);
      scene.add(livro);
    });
    caixa(scene, 1.2, 0.9, 0.5, 31.7, 0.45, -6.6, mat(0x8a8378));
    caixa(scene, 0.3, 0.34, 0.26, 31.7, 1.07, -6.6, mat(0x222222), { colide: false }); // cafeteira
    // quadro institucional: a advocacia é indispensável (CF, art. 133)
    if (TOGA.texturas3d.placa) {
      const cf = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.42),
        new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.placa("ADVOCACIA · CF, ART. 133"),
          polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
      cf.position.set(34, 2.2, -6.81);
      scene.add(cf);
    }
    planta(scene, 31.5, -2.6);
    lustre(scene, 34, -4.5);

    // ---- placas do corredor ----
    if (TOGA.texturas3d.placa) {
      [["SALA DE IMPRENSA", 34, 1.81, Math.PI, 1.7],
       ["OAB — SALA DOS ADVOGADOS", 34, -1.81, 0, 2.0]].forEach(function (p) {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(p[4], 0.36),
          new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.placa(p[0]),
            polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
        m.position.set(p[1], 2.55, p[2]);
        m.rotation.y = p[3];
        scene.add(m);
      });
    }

    // ---- relógio da ala leste (segundo relógio do fórum) ----
    const relogio2 = new THREE.Group();
    const face2 = new THREE.Mesh(new THREE.CircleGeometry(0.34, 20),
      new THREE.MeshBasicMaterial({ color: 0xf4ecd9 }));
    const pH2 = new THREE.Mesh(new THREE.PlaneGeometry(0.05, 0.18),
      new THREE.MeshBasicMaterial({ color: 0x241c10 }));
    pH2.geometry.translate(0, 0.09, 0); pH2.position.z = 0.01;
    const pM2 = new THREE.Mesh(new THREE.PlaneGeometry(0.03, 0.27),
      new THREE.MeshBasicMaterial({ color: 0x241c10 }));
    pM2.geometry.translate(0, 0.135, 0); pM2.position.z = 0.012;
    relogio2.add(face2, pH2, pM2);
    relogio2.position.set(36.6, 2.6, -1.85);
    scene.add(relogio2);
    pontos.relogioParede2 = { ponteiroH: pH2, ponteiroM: pM2 };

    // ---- decorativos espalhados ----
    bandeira(scene, -13.4, -1.5, "br");            // entrada oeste: Brasil…
    bandeira(scene, -13.4, 1.5, "ce");             // …e Ceará
    lixeira(scene, 12, 1.6);
    lixeira(scene, 31, 1.6);
    lixeira(scene, -1.2, -1.6);
    planta(scene, 30.6, -1.5);
    planta(scene, 37.4, 1.5);
    // extintor de incêndio (interação do seu Matias no cena3d)
    const extintor = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.5, 10), mat(0xb03a3a));
    extintor.position.set(18.2, 0.9, -1.82);
    const bico = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.14, 6), mat(0x222222));
    bico.position.set(18.2, 1.2, -1.82); bico.rotation.z = 0.5;
    scene.add(extintor, bico);
    if (TOGA.texturas3d.placa) {
      const pe = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.3),
        new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.placa("EXTINTOR"),
          polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
      pe.position.set(18.2, 1.6, -1.81);
      scene.add(pe);
    }
    // vitrine de fotos históricas da comarca (afastada da porta do
    // Juizado, em x≈-7, para não obstruí-la — fica na quadra oeste)
    caixa(scene, 1.8, 0.9, 0.35, -11.5, 0.45, 1.7, mat(0x4a3018), { studs: "#4a3018" });
    caixa(scene, 1.7, 0.06, 0.3, -11.5, 0.93, 1.7, mat(0xb9d2e0), { colide: false }); // tampo de vidro
    if (TOGA.texturas3d.quadro) {
      [[-12.1, 3], [-10.9, 4]].forEach(function (q) {
        const foto = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.6),
          new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.quadro(q[1]) }));
        foto.position.set(q[0], 1.85, 1.9); foto.rotation.y = Math.PI;
        scene.add(foto);
      });
    }
    // pontos de interesse da ala
    pontos.imprensa = { x: 34, z: 4.4 };
    pontos.imprensaBancada = { x: 34, z: 5.6 };
    pontos.oab = { x: 34, z: -4.5 };
    pontos.extintor = { x: 18.2, z: -1.4 };
  }

  /* ---------- ALA LESTE II: CEJUSC + GABINETE DA 2ª VARA ----------
     Extensão do corredor além de x=38, ligada pelo vão aberto na
     parede da Ala Leste. Ao SUL, o CEJUSC (mesa redonda — o símbolo
     do consenso); ao NORTE, o gabinete do(a) titular da 2ª Vara.    */
  function placaAla(scene, texto, x, y, z, rotY, larg) {
    if (!TOGA.texturas3d.placa) return;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(larg || 1.6, 0.36),
      new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.placa(texto),
        polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
    m.position.set(x, y, z); m.rotation.y = rotY || 0;
    scene.add(m);
  }

  function construirAlaLesteII(scene) {
    // ---- extensão do corredor (x 38→50) ----
    piso(scene, 38, -2, 50, 2, 0x2e2114, TOGA.texturas3d.pisoCorredor && TOGA.texturas3d.pisoCorredor());
    // norte: vão do GABINETE DA 2ª VARA em x∈[42.4, 43.6]
    parede(scene, 38, -2, 42.4, -2);
    parede(scene, 43.6, -2, 50, -2);
    // sul: vão do CEJUSC em x∈[43.4, 44.6]
    parede(scene, 38, 2, 43.4, 2);
    parede(scene, 44.6, 2, 50, 2);
    // FIM do corredor leste: a PORTA DOS FUNDOS para o PARQUE DA CIDADE
    // (de propósito longe da entrada principal, p/ não confundir com a
    //  rua da Delegacia/Escola) — vão central z∈[−0.7, 0.7]
    parede(scene, 50, -2, 50, -0.7);
    parede(scene, 50, 0.7, 50, 2);
    piso(scene, 50, -0.7, 53, 0.7, 0x6b675f);              // soleira de saída (calçada)
    caixa(scene, 0.12, 2.3, 1.35, 50, 1.15, 0, mat(0x2f5a3e), { colide: false }); // folha de porta verde
    if (TOGA.texturas3d.letreiro) {
      const letr = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.8),
        new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.letreiro("PARQUE DA CIDADE", "#2f5a3e", "#e7cf9a", "ACESSO LIVRE · SAÍDA DOS FUNDOS") }));
      letr.position.set(49.78, 2.55, 0); letr.rotation.y = -Math.PI / 2; scene.add(letr);
    }
    pontos.parquePorta = { x: 48.8, z: 0 };
    // placas do corredor (viradas para quem caminha)
    placaAla(scene, "GABINETE — JUIZ(A) DA 2ª VARA", 43.0, 2.55, -1.81, 0, 3.0);
    placaAla(scene, "CEJUSC — SOLUÇÃO DE CONFLITOS", 44.0, 2.55, 1.81, Math.PI, 3.0);
    placaAla(scene, "➔ PARQUE DA CIDADE", 47.0, 2.55, -1.81, 0, 2.4);

    /* ============ GABINETE DA 2ª VARA (norte, x 39–48, z −9–−2) ============ */
    piso(scene, 39, -9, 48, -2, 0x3a2b1b, TOGA.texturas3d.pisoSala && TOGA.texturas3d.pisoSala());
    parede(scene, 39, -9, 48, -9);                 // fundo
    parede(scene, 39, -9, 39, -2);                 // oeste
    parede(scene, 48, -9, 48, -2);                 // leste
    // mesa do juiz colega + computador + autos + cadeira
    mesa(scene, 43.5, -7.2, 2.6, 1.1);
    caixa(scene, 0.55, 0.38, 0.06, 43.0, 1.06, -7.35, mat(0x1d150d), { colide: false });
    const telaG2 = new THREE.Mesh(new THREE.PlaneGeometry(0.48, 0.3),
      new THREE.MeshBasicMaterial({ color: 0x9fc3ae }));
    telaG2.position.set(43.0, 1.06, -7.31); scene.add(telaG2);
    caixa(scene, 0.45, 0.07, 0.32, 44.2, 0.86, -7.2, mat(0xf4ecd9), { colide: false });
    caixa(scene, 0.42, 0.07, 0.30, 44.2, 0.93, -7.18, mat(0xe2d6ba), { colide: false, rotY: 0.12 });
    cadeira(scene, 43.5, -7.9, Math.PI, 0x2a1d12);
    // cadeiras de atendimento, do outro lado da mesa
    cadeira(scene, 42.9, -6.4, 0, 0x4a3018);
    cadeira(scene, 44.1, -6.4, 0, 0x4a3018);
    // estante de livros
    caixa(scene, 0.4, 2.4, 2.4, 47.7, 1.2, -5.5, mat(0x33220f));
    for (let i = 0; i < 10; i++) {
      caixa(scene, 0.1, 0.3, 0.18, 47.45, 0.6 + (i % 5) * 0.42, -6.3 + Math.floor(i / 5) * 1.4,
        mat([0x7a2e2e, 0x2f4a3e, 0xc9a35c, 0x33424f][i % 4]), { colide: false });
    }
    // aparador com cafeteira própria + planta + janela
    caixa(scene, 1.2, 0.85, 0.5, 40.0, 0.425, -8.5, mat(0x4a3018), { studs: "#4a3018" });
    caixa(scene, 0.3, 0.42, 0.3, 40.0, 1.06, -8.5, mat(0x1d150d), { colide: false });
    planta(scene, 39.5, -2.6);
    janela(scene, 47.9, -5.5, -Math.PI / 2);
    cortina(scene, 47.82, -5.5, -Math.PI / 2);
    lustre(scene, 43.5, -5.5);
    // brasão sobre a estante (gabinete de magistrado)
    const brasG2 = new THREE.Mesh(new THREE.CircleGeometry(0.4, 24),
      TOGA.texturas3d.brasao ? new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.brasao() })
                             : new THREE.MeshBasicMaterial({ color: 0x463422 }));
    brasG2.position.set(43.5, 2.3, -8.84); scene.add(brasG2);
    placaAla(scene, "2ª VARA — GABINETE", 43.5, 1.7, -8.83, 0, 1.8);
    pontos.gab2 = { x: 43.5, z: -5.6 };
    pontos.gab2Juiz = { x: 43.5, z: -7.9 };

    /* ============ CEJUSC (sul, x 39–49, z 2–12) ============ */
    piso(scene, 39, 2, 49, 12, 0x3a3326, TOGA.texturas3d.pisoSala && TOGA.texturas3d.pisoSala());
    parede(scene, 39, 12, 49, 12);                 // fundo
    parede(scene, 39, 2, 39, 12);                  // oeste
    parede(scene, 49, 2, 49, 12);                  // leste
    // MESA REDONDA — o consenso senta todo mundo no mesmo nível
    const mesaR = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.08, 22),
      TOGA.texturas3d.madeira ? matTex(TOGA.texturas3d.madeira(), 2, 2) : mat(0x7a5634));
    mesaR.position.set(44, 0.76, 7); mesaR.castShadow = true; scene.add(mesaR);
    const peR = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 0.76, 12), mat(0x4a3018));
    peR.position.set(44, 0.38, 7); scene.add(peR);
    colisores.push({ minX: 42.6, maxX: 45.4, minZ: 5.6, maxZ: 8.4 });
    // 6 cadeiras ao redor (iguais — ninguém preside)
    [[0, -1.85], [0, 1.85], [-1.7, -0.9], [1.7, -0.9], [-1.7, 0.9], [1.7, 0.9]].forEach(function (c) {
      cadeira(scene, 44 + c[0], 7 + c[1], Math.atan2(-c[0], -c[1]), 0x556a55);
    });
    // jarra d'água e copos no centro (hospitalidade da sessão)
    const jarra = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.28, 10),
      new THREE.MeshPhongMaterial({ color: 0xb9d2e0, transparent: true, opacity: 0.5 }));
    jarra.position.set(44, 0.94, 7); scene.add(jarra);
    // mural das normas do CNJ (Res. 125/2010 · Lei 13.140/2015)
    if (TOGA.texturas3d.letreiro) {
      const mural = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.5),
        new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.letreiro(
          "CEJUSC", "#2f4a3e", "#e7cf9a", "RES. CNJ 125/2010 · LEI 13.140/2015 — MEDIAÇÃO") }));
      mural.position.set(44, 1.8, 11.85); mural.rotation.y = Math.PI; scene.add(mural);
    }
    planta(scene, 39.6, 2.7); planta(scene, 48.4, 2.7);
    lustre(scene, 44, 7); lustre(scene, 44, 10.5);
    janela(scene, 48.85, 9, -Math.PI / 2);
    cortina(scene, 48.78, 9, -Math.PI / 2);
    placaAla(scene, "MESA DE MEDIAÇÃO E CONCILIAÇÃO", 44, 2.4, 11.83, Math.PI, 2.8);
    pontos.cejusc = { x: 44, z: 4.4 };
    pontos.mesaCejusc = { x: 44, z: 5.4 };
    pontos.cejuscMediador = { x: 44, z: 9.0 };       // facilitador(a), de costas p/ o fundo
    pontos.cejuscParteA = { x: 42.3, z: 7.0 };
    pontos.cejuscParteB = { x: 45.7, z: 7.0 };

    // ---- teto do novo bloco (o teto principal vai só até x≈42) ----
    const tetoII = new THREE.Mesh(new THREE.PlaneGeometry(13, 22), mat(0x241a10));
    tetoII.rotation.x = Math.PI / 2;
    tetoII.position.set(44, ALTURA, 1.5);
    scene.add(tetoII);
  }

  function construir(scene) {
    construirGabinete(scene);
    construirCorredor(scene);
    construirSala(scene);
    construirDistribuicao(scene);
    construirCela(scene);
    construirAssistencia(scene);
    construirSaude(scene);
    construirVara2(scene);
    construirCopa(scene);
    construirBrinquedoteca(scene);
    construirJuri(scene);
    construirAlaLeste(scene);
    construirAlaLesteII(scene);
    teto(scene);
    construirStuds(scene);
    // studs 3D só na qualidade alta — e nunca projetam sombra (são milhares)
    const alta = !(TOGA.config && TOGA.config.qualidade3d === "baixa");
    studsMeshes.forEach(function (m) { m.visible = alta; m.castShadow = false; });

    /* O fórum inteiro é estático: congelar as matrizes poupa a CPU de
       recalcular centenas de transforms por quadro. O que ANIMA depois
       (martelo, ponteiros do relógio, portão da cela — e os bonecos,
       que entram na cena depois deste construir) fica de fora.        */
    const animados = [pontos.meshMartelo, pontos.meshMartelo2, pontos.meshPortaoCela];
    if (pontos.relogioParede) {
      animados.push(pontos.relogioParede.ponteiroH, pontos.relogioParede.ponteiroM);
    }
    if (pontos.relogioParede2) {
      animados.push(pontos.relogioParede2.ponteiroH, pontos.relogioParede2.ponteiroM);
    }
    scene.traverse(function (obj) {
      if (animados.indexOf(obj) >= 0) return;
      obj.updateMatrix();
      obj.matrixAutoUpdate = false;
    });
    return { colisores: colisores, paredesCamera: paredesCamera, pontos: pontos };
  }

  return {
    construir: construir,
    ASSENTOS3D: ASSENTOS3D,
    ASSENTOS3D_JURI: ASSENTOS3D_JURI,
    get pontos() { return pontos; },
    get studsMeshes() { return studsMeshes; }
  };
})();
