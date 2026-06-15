/* ============================================================
   TOGA 3D — acm3d.js : A ACM (Associação Cearense de Magistrados)
   ------------------------------------------------------------
   O Clube dos Magistrados, à beira-mar (Praia do Futuro):
   ambiente AMPLO com piscina adulto e infantil, sauna, quadra
   de beach tennis, campo de futebol society com vestiários,
   churrasqueiras, salão de jogos, AUDITÓRIO (onde acontece a
   palestra) e a sala da DIRETORIA, em reunião. Reconstrução em
   "linguagem de blocos" a partir das fotos do clube.

   Bloqueada no início; destrava com 5 conquistas (o gate fica
   no acesso de bicicleta, no parque). Construída em x ≈ +600 no
   mesmo scene; a neblina separa as áreas.
   ============================================================ */

window.TOGA = window.TOGA || {};

TOGA.acm3d = (function () {
  if (!window.THREE) return null;

  const AX = 600;                  // centro da ACM no eixo x
  const ALTURA = 3.2;
  let construido = false;
  let info = null;

  // a diretoria real da ACM (homenagem institucional — PDF da ACM).
  // Cada um tem uma fala própria, ligada ao seu cargo na reunião.
  const DIRETORIA = [
    { nome: "José Hercy Ponte de Alencar", cargo: "Presidente",
      fala: "“Excelência, seja bem-vindo à casa dos magistrados! Estou abrindo a reunião — convênios, a reforma da sede e a palestra que o senhor pode assistir ali no auditório. Puxe uma cadeira.”" },
    { nome: "Helga Medved", cargo: "Vice-presidente",
      fala: "“Bom ter um colega da ativa por perto. Estou substituindo o presidente na pauta dos novos convênios de saúde — a associação só existe para cuidar de quem cuida da Justiça.”" },
    { nome: "Cleber de Castro Cruz", cargo: "Dir. de Comunicação Social",
      fala: "“Comunicação Social, ao seu dispor. Estou fechando a transmissão da palestra de hoje pelas redes da ACM — magistratura também precisa se explicar para a sociedade, doutor.”" },
    { nome: "Mário Parente Teófilo Neto", cargo: "Dir. Administrativo",
      fala: "“Administrativo é o nome chique de quem cuida do telhado, da folha e da garagem. Se faltar café na reunião, a culpa cai em mim — por isso nunca falta.”" },
    { nome: "Jorge Cruz de Carvalho", cargo: "Dir. de Prerrogativas",
      fala: "“Prerrogativa de magistrado não é privilégio, doutor — é garantia da independência de quem julga. Qualquer atropelo à sua, a ACM entra junto. Conte conosco.”" },
    { nome: "Magno Rocha Thé Mota", cargo: "Dir. de Assuntos Educacionais e Culturais",
      fala: "“Cultura e formação são a minha pasta. A palestra ‘Simples e Mágico’ no auditório saiu daqui — se o senhor ainda não assistiu, vá: vale cada minuto.”" },
    { nome: "Wallton Pereira de Souza Paiva", cargo: "Dir. de Patrimônio e Finanças",
      fala: "“Finanças e patrimônio: cada centavo da associação prestado em planilha aberta. A piscina nova e a quadra de beach saíram com superávit — e sem dívida, doutor.”" },
    { nome: "Francisca Sônia Costa", cargo: "Diretora de Aposentados",
      fala: "“Cuido dos colegas aposentados — quem entregou a vida à toga não pode ser esquecido depois dela. Um dia o senhor vai querer alguém olhando por isso. Estarei aqui.”" },
    { nome: "Francisca Timbó de Lima", cargo: "Diretora de Pensionistas",
      fala: "“Pensionistas são as famílias que ficaram. A ACM ampara quem perdeu o seu magistrado — é a parte silenciosa, e a mais necessária, do nosso trabalho.”" },
    { nome: "Francisco Eduardo Girão Braga", cargo: "Diretor de Esportes",
      fala: "“Esportes! O campo society e a quadra de beach tennis são comigo. Sábado tem racha, doutor — toga no cabide, chuteira no pé. Apareça que eu escalo o senhor.”" },
    { nome: "Edwiges Coelho Girão", cargo: "1ª Secretária",
      fala: "“1ª Secretária — sou eu que lavro a ata desta reunião. Pode falar devagar que eu registro tudo... e o que o senhor disser de bom, eu sublinho.”" },
    { nome: "Anderson Alexandre Nascimento Silva", cargo: "2º Secretário",
      fala: "“2º Secretário, às ordens. Organizo as convocações e a ordem do dia. Se quiser pauta na próxima assembleia, fale comigo — entro com o seu nome.”" }
  ];

  function mat(cor) { return TOGA.texturas3d.matPlastico(cor); }

  function construir(scene) {
    if (construido) return info;
    construido = true;
    const colisores = [], paredesCamera = [], pontos = {}, vivos = [], aguas = [], passaros = [];

    function matAgua(rep) {
      if (!TOGA.texturas3d.agua) return new THREE.MeshPhongMaterial({ color: 0x1f6f9a, shininess: 80, specular: 0x9fd2e0 });
      const tex = TOGA.texturas3d.agua().clone();
      tex.needsUpdate = true; tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(rep || 6, rep || 6);
      return new THREE.MeshPhongMaterial({ map: tex, shininess: 95, specular: 0xbfe6f2 });
    }
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
        fase: (cx + cz) * 0.05, vel: 0.35 + (Math.abs(Math.round(cx + cz)) % 5) * 0.04 });
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
    function parede(x1, z1, x2, z2, material, altura) {
      const horizontal = Math.abs(x2 - x1) > Math.abs(z2 - z1);
      const w = horizontal ? Math.abs(x2 - x1) : 0.25;
      const d = horizontal ? 0.25 : Math.abs(z2 - z1);
      const h = altura || ALTURA;
      return caixa(w, h, d, (x1 + x2) / 2, h / 2, (z1 + z2) / 2, material, { bloqueiaCamera: true });
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
    function palmeira(x, z) {
      const tronco = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.16, 3.2, 8), mat(0x8a6a4a));
      tronco.position.set(x, 1.6, z); tronco.castShadow = true;
      scene.add(tronco);
      for (let i = 0; i < 6; i++) {
        const folha = new THREE.Mesh(new THREE.ConeGeometry(0.16, 1.7, 5), mat(0x3f6a3e));
        const ang = i * Math.PI / 3;
        folha.position.set(x + Math.cos(ang) * 0.75, 3.3, z + Math.sin(ang) * 0.75);
        folha.rotation.z = Math.cos(ang) * 1.25; folha.rotation.x = -Math.sin(ang) * 1.25;
        scene.add(folha);
      }
      colisores.push({ minX: x - 0.22, maxX: x + 0.22, minZ: z - 0.22, maxZ: z + 0.22 });
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

    const areia = mat(0xe2cfa0);
    const grama = mat(0x4f8a44);

    /* ================= TERRENO, PRAIA E MAR ================= */
    piso(AX - 40, -22, AX + 40, 50, mat(0xcabb92));                  // areão geral do clube
    piso(AX - 40, 30, AX + 40, 50, areia, 0.01);                     // faixa de praia
    aguas.push(piso(AX - 40, 38, AX + 40, 50, matAgua(14), 0.02));   // o MAR ANIMADO
    [AX - 30, AX - 14, AX + 14, AX + 30].forEach(function (x) { palmeira(x, 32); });
    // guarda-sóis e espreguiçadeiras na areia
    [[AX - 20, 34], [AX - 8, 35], [AX + 8, 34], [AX + 20, 35]].forEach(function (p) {
      const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.8, 6), mat(0x8a8378));
      haste.position.set(p[0], 0.9, p[1]); scene.add(haste);
      const lona = new THREE.Mesh(new THREE.ConeGeometry(1.1, 0.5, 12), mat(p[0] < AX ? 0xc94f4f : 0xf2b53a));
      lona.position.set(p[0], 1.95, p[1]); scene.add(lona);
      caixa(1.4, 0.18, 0.5, p[0], 0.18, p[1] + 1.0, mat(0xefe5c8), { colide: false, semSombra: true });
    });
    // torre de salva-vidas na areia (refino: marco da praia)
    caixa(2.2, 0.16, 2.2, AX + 14, 1.4, 33, mat(0xc94f4f), { colide: false });   // cabine
    caixa(2.4, 1.2, 0.1, AX + 14, 0.6, 33.9, mat(0xe8e6da));                      // frente
    [[-0.9, -0.9], [0.9, -0.9], [-0.9, 0.9], [0.9, 0.9]].forEach(function (p) {
      caixa(0.12, 1.5, 0.12, AX + 14 + p[0], 0.75, 33 + p[1], mat(0x7a5634));
    });
    const cobertura = new THREE.Mesh(new THREE.ConeGeometry(2.0, 0.9, 4), mat(0x8e1f1a));
    cobertura.rotation.y = Math.PI / 4; cobertura.position.set(AX + 14, 2.4, 33); scene.add(cobertura);
    placaEm("🛟 SALVA-VIDAS", AX + 14, 0.6, 32.0, Math.PI, 1.6);
    pontos.praia = { x: AX, z: 30 };

    /* logo da ACM em placa (canvas) — virado para quem chega */
    function logoEm(x, y, z, rotY, tam) {
      if (!TOGA.texturas3d.logoAcm) return;
      const m = new THREE.Mesh(new THREE.PlaneGeometry(tam || 2.0, tam || 2.0),
        new THREE.MeshBasicMaterial({ map: TOGA.texturas3d.logoAcm(), transparent: false }));
      m.position.set(x, y, z); m.rotation.y = rotY || 0;
      scene.add(m);
      return m;
    }

    /* ================= PORTARIA / FACHADA (sul, z ≈ −16) ================= */
    piso(AX - 6, -20, AX + 6, -12, mat(0x6b675f), 0.02);             // calçada de entrada
    caixa(0.4, 3.4, 0.4, AX - 5, 1.7, -16, mat(0x2b3340));
    caixa(0.4, 3.4, 0.4, AX + 5, 1.7, -16, mat(0x2b3340));
    caixa(10.6, 1.4, 0.5, AX, 4.0, -16, mat(0x2b3340), { colide: false });   // testeira mais alta
    logoEm(AX, 4.0, -16.28, Math.PI, 2.0);                            // LOGO no alto do portão
    palmeira(AX - 7, -16); palmeira(AX + 7, -16);
    pontos.spawnAcm = { x: AX, z: -18, angulo: 0 };       // chega de bike, de frente para o clube
    pontos.biciVolta = { x: AX, z: -19 };

    /* ================= O CLUBE (edifício baixo, z −12..2) ================= */
    piso(AX - 22, -12, AX + 22, 2,
      TOGA.texturas3d.pisoEsmec ? new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.pisoEsmec() }) : mat(0xe8e6e0), 0.04);
    // fundo sul COM vão central de entrada x∈[AX-1.8, AX+1.8] (o juiz entra)
    parede(AX - 22, -12, AX - 1.8, -12, mat(0xe8e6da));
    parede(AX + 1.8, -12, AX + 22, -12, mat(0xe8e6da));
    letreiroEm("ACM", "ASSOCIAÇÃO CEARENSE DE MAGISTRADOS · CLUBE DOS MAGISTRADOS",
      "#1d3a6e", AX - 9, 2.0, -12.18, Math.PI, 5.2, 1.0);            // letreiro na fachada do clube
    logoEm(AX + 8, 1.9, -12.18, Math.PI, 2.2);                        // 2º logo, na fachada do clube
    // reabrir o vão de entrada x∈[AX-1.5, AX+1.5]
    // (recriado por cima como duas metades)
    parede(AX - 22, 2, AX - 0.2, 2, mat(0xe8e6da));                  // norte trecho 1 (vão p/ a área de lazer)
    parede(AX + 6, 2, AX + 22, 2, mat(0xe8e6da));                    // norte trecho 2
    parede(AX - 22, -12, AX - 22, 2, mat(0xe8e6da));                 // oeste
    parede(AX + 22, -12, AX + 22, 2, mat(0xe8e6da));                 // leste
    // teto do clube
    const tetoClube = new THREE.Mesh(new THREE.PlaneGeometry(44, 14), mat(0xd8d4c8));
    tetoClube.rotation.x = Math.PI / 2; tetoClube.position.set(AX, ALTURA, -5); scene.add(tetoClube);

    /* ---- AUDITÓRIO (ala oeste do clube, x −22..−6) ---- */
    parede(AX - 6, -12, AX - 6, -2, mat(0xe8e6da));                  // divisória (vão ao norte)
    placaEm("AUDITÓRIO", AX - 14, 2.4, 1.7, Math.PI, 1.8);
    // palco + púlpito + telão
    caixa(10, 0.3, 2.2, AX - 14, 0.15, -10.8, mat(0x8a8378), { colide: false });
    const pulpito = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.1, 0.5),
      new THREE.MeshPhongMaterial({ color: 0xcfd8df, transparent: true, opacity: 0.4, shininess: 90 }));
    pulpito.position.set(AX - 16, 0.9, -10.2); pulpito.castShadow = true; scene.add(pulpito);
    colisores.push({ minX: AX - 16.4, maxX: AX - 15.6, minZ: -10.5, maxZ: -9.9 });
    letreiroEm("SIMPLES E MÁGICO", "LINGUAGEM SIMPLES NO JUDICIÁRIO", "#1d2433", AX - 12, 1.9, -11.7, 0, 3.0, 1.6);
    // poltronas (4 fileiras × 6)
    for (let f = 0; f < 4; f++) for (let c = 0; c < 6; c++) {
      const px = AX - 19 + c * 2.0, pz = -8.6 + f * 1.5;
      caixa(0.58, 0.45, 0.5, px, 0.22, pz, mat(0x7c4048), { semSombra: true });
      caixa(0.58, 0.55, 0.1, px, 0.7, pz + 0.22, mat(0x6a3038), { colide: false, semSombra: true });
    }
    pontos.auditorioAcm = { x: AX - 14, z: -6.5 };
    pontos.assentoPalestraAcm = { x: AX - 13, z: -5.0 };
    pontos.palestranteAcm = { x: AX - 16, z: -9.2 };

    /* ---- SALA DA DIRETORIA (ala leste, x 6..22) — em REUNIÃO ---- */
    parede(AX + 6, -12, AX + 6, -2, mat(0xe8e6da));
    placaEm("SALA DA DIRETORIA", AX + 14, 2.4, 1.7, Math.PI, 2.0);
    letreiroEm("DIRETORIA · ACM", "REUNIÃO DA DIRETORIA EM ANDAMENTO", "#8e1f1a", AX + 14, 1.9, -11.7, 0, 3.0, 1.0);
    // mesa de reunião longa
    caixa(7.2, 0.08, 2.0, AX + 14, 0.78, -7, mat(0x5e3f22), { colide: false });
    colisores.push({ minX: AX + 10.6, maxX: AX + 17.4, minZ: -8.1, maxZ: -5.9 });
    [[-2.4, -0.6], [0, -0.6], [2.4, -0.6]].forEach(function (p) {  // jarras/papéis sobre a mesa
      caixa(0.3, 0.2, 0.3, AX + 14 + p[0], 0.92, -7, mat(0xb9d2e0), { colide: false, semSombra: true });
    });
    pontos.diretoria = { x: AX + 14, z: -3.4 };
    pontos.mesaDiretoria = { x: AX + 14, z: -5.0 };

    // os diretores em volta da mesa (homenagem — nomes/cargos reais)
    pontos.diretores = [];
    const PELES = ["#d8a87f", "#c98e66", "#a86a48", "#8a5436", "#e8c39a"];
    DIRETORIA.forEach(function (d, i) {
      const lado = i % 2 === 0 ? -1 : 1;             // norte / sul da mesa
      const col = Math.floor(i / 2);                  // até 6 por lado
      const px = AX + 11 + col * 1.25;
      const pz = -7 + lado * 1.5;
      const fem = /^(Helga|Francisca|Edwiges)/.test(d.nome);
      const b = npc("diretorAcm" + i,
        { pele: PELES[i % 5], cabelo: fem ? (i % 2 ? "longo" : "coque") : (i % 3 ? "curto" : "calvo"),
          corCabelo: "#241a10", traje: fem ? "blazer" : "terno",
          corTraje: ["#2a2a30", "#33424f", "#4a4438", "#2b3340"][i % 4] },
        px, pz, lado < 0 ? 0 : Math.PI, { sentado: true });
      if (b) {
        b.setEmocao(["firme", "neutro", "feliz", "neutro"][i % 4]);
        // a reunião GESTICULA: cada diretor com um ciclo próprio, defasado
        if (TOGA.rotinas3d && TOGA.rotinas3d.adicionarRotina) {
          const g = ["enfase", "apelo", "indignado"][i % 3];
          TOGA.rotinas3d.adicionarRotina(b, [
            { esperar: 2 + (i % 5) }, { acao: g }, { esperar: 3 + (i % 4) },
            { acao: i % 2 ? "enfase" : "apelo" }, { esperar: 4 + (i % 3) }
          ]);
        }
      }
      pontos.diretores.push({ nome: d.nome, cargo: d.cargo, fala: d.fala, x: px, z: pz + (lado < 0 ? 0.6 : -0.6) });
    });
    // o presidente conduz, de pé, na cabeceira — gesticulando como quem preside
    const presidente = npc("presidenteAcm",
      { pele: "#d8a87f", cabelo: "curto", corCabelo: "#3a3a3a", traje: "terno", corTraje: "#2a2a30", corGravata: "#7a2e2e" },
      AX + 18, -7, -Math.PI / 2);
    if (presidente) {
      presidente.setEmocao("firme");
      if (TOGA.rotinas3d && TOGA.rotinas3d.adicionarRotina) {
        TOGA.rotinas3d.adicionarRotina(presidente, [
          { acao: "enfase" }, { esperar: 3 }, { acao: "apelo" }, { esperar: 2 },
          { acao: "indignado" }, { esperar: 3 }
        ]);
      }
    }
    pontos.presidente = { x: AX + 18, z: -7 };

    /* ---- SALÃO DE JOGOS (entre auditório e diretoria, z −12..−2, x −6..6) ---- */
    placaEm("SALÃO DE JOGOS", AX, 2.4, -1.7, 0, 1.8);
    // mesa de sinuca
    caixa(2.4, 0.78, 1.3, AX - 3, 0.39, -9.5, mat(0x2f6a3e));
    [[-1.0, -0.5], [1.0, -0.5], [-1.0, 0.5], [1.0, 0.5]].forEach(function (p) {
      const bola = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6),
        mat([0xf2b53a, 0xc94f4f, 0x222222, 0xe8e6da][Math.abs(p[0] + p[1] * 2) % 4]));
      bola.position.set(AX - 3 + p[0] * 0.5, 0.86, -9.5 + p[1]); scene.add(bola);
    });
    // pebolim e ping-pong
    caixa(1.4, 0.8, 0.9, AX, 0.4, -9.4, mat(0x33424f));
    caixa(2.2, 0.76, 1.2, AX + 3, 0.38, -9.5, mat(0x2a6a4a));
    caixa(0.04, 0.14, 1.2, AX + 3, 0.83, -9.5, mat(0xe8e6da), { colide: false }); // rede de ping-pong
    pontos.salaoJogos = { x: AX, z: -6.5 };
    // banheiros (placa)
    placaEm("BANHEIROS", AX + 5.6, 2.2, -11.7, 0, 1.2);

    /* ================= ÁREA DE LAZER (norte do clube, z > 2) ================= */
    // PISCINA adulto + infantil + deck
    piso(AX - 16, 4, AX + 4, 16, mat(0xc9ccc2), 0.03);              // deck de piscina
    caixa(8, 0.3, 6, AX - 9, 0.16, 9, mat(0x1f6f9a), { colide: false, semSombra: true }); // borda
    const aguaAd = new THREE.Mesh(new THREE.BoxGeometry(7.4, 0.2, 5.4), matAgua(3));
    aguaAd.position.set(AX - 9, 0.22, 9); scene.add(aguaAd); aguas.push(aguaAd);
    colisores.push({ minX: AX - 13, maxX: AX - 5, minZ: 6, maxZ: 12 });
    const aguaInf = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.16, 2.4), matAgua(2));
    aguaInf.position.set(AX - 1, 0.2, 6.4); scene.add(aguaInf); aguas.push(aguaInf);
    colisores.push({ minX: AX - 2.9, maxX: AX + 0.9, minZ: 5.0, maxZ: 7.8 });
    placeMarcador("PISCINA ADULTO E INFANTIL", AX - 9, 14.4);
    pontos.piscina = { x: AX - 9, z: 4.8 };
    // SAUNA (cabine de madeira)
    caixa(3, 2.4, 3, AX + 2, 1.2, 13.5, mat(0x6a4a2a));
    placaEm("SAUNA", AX + 2, 1.9, 11.95, 0, 1.2);
    pontos.sauna = { x: AX + 2, z: 11.4 };

    // QUADRA DE BEACH TENNIS (areia + rede)
    piso(AX + 8, 4, AX + 20, 14, areia, 0.03);
    [[AX + 8.2], [AX + 19.8]].forEach(function (l) {  // postes da rede
      caixa(0.1, 1.2, 0.1, l[0], 0.6, 9, mat(0x2b3340), { colide: false });
    });
    caixa(11.6, 0.7, 0.04, AX + 14, 0.9, 9, mat(0xe8e6da), { colide: false, semSombra: true });
    // linhas da quadra
    [4.2, 13.8].forEach(function (z) { caixa(11.6, 0.02, 0.08, AX + 14, 0.05, AX * 0 + z, mat(0x4a6ab8), { colide: false, semSombra: true }); });
    placeMarcador("QUADRA DE BEACH TENNIS", AX + 14, 14.4);
    pontos.beachTennis = { x: AX + 14, z: 4.6 };

    // CAMPO DE FUTEBOL SOCIETY (grama + traves) + VESTIÁRIOS
    piso(AX - 16, 18, AX + 6, 34, grama, 0.03);
    [[AX - 16, 26], [AX + 6, 26]].forEach(function (g, i) {        // duas traves
      const sentido = i ? -1 : 1;
      caixa(0.1, 1.4, 2.4, g[0], 0.7, g[1], mat(0xe8e6da), { colide: false });
      caixa(0.1, 0.1, 2.4, g[0] + sentido * 0.4, 1.35, g[1], mat(0xe8e6da), { colide: false });
    });
    // linha central + bola
    caixa(22, 0.02, 0.1, AX - 5, 0.05, 26, mat(0xe8e6da), { colide: false, semSombra: true });
    const bola = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 10), mat(0xf4f4f4));
    bola.position.set(AX - 5, 0.22, 26); scene.add(bola);
    placeMarcador("CAMPO SOCIETY", AX - 5, 33.4);
    pontos.campo = { x: AX - 5, z: 20 };
    // vestiários (bloco)
    caixa(5, 2.6, 3, AX + 12, 1.3, 20, mat(0xb9b3a6));
    placaEm("VESTIÁRIOS", AX + 12, 1.9, 18.45, 0, 1.4);

    // CHURRASQUEIRAS (quiosques)
    [[AX + 16, 8], [AX + 18, 13]].forEach(function (p) {
      caixa(1.6, 0.9, 0.8, p[0], 0.45, p[1], mat(0x7a5a44));
      caixa(1.8, 0.1, 1.0, p[0], 1.4, p[1], mat(0x8e1f1a), { colide: false }); // telhadinho
    });
    placeMarcador("CHURRASQUEIRAS", AX + 17, 5.6);
    pontos.churrasqueira = { x: AX + 16, z: 9 };

    function placeMarcador(texto, x, z) { placaEm(texto, x, 2.2, z, Math.PI, 2.6); }

    /* ================= GENTE DO CLUBE (com VIDA: gestos e passos) ================= */
    function rotina(b, passos) {
      if (b && TOGA.rotinas3d && TOGA.rotinas3d.adicionarRotina) TOGA.rotinas3d.adicionarRotina(b, passos);
    }
    // o palestrante no auditório (a mesma palestra "Simples e Mágico"),
    // virado para a plateia (sul) e gesticulando como quem expõe
    const palestrante = npc("palestranteAcm",
      { pele: "#d8a87f", cabelo: "curto", corCabelo: "#241a10", traje: "terno", corTraje: "#33424f", corBlusa: "#e8e2d2" },
      AX - 16, -9.6, 0);
    if (palestrante) {
      palestrante.setEmocao("feliz"); palestrante.segurar("autos", "esq");
      rotina(palestrante, [{ acao: "enfase" }, { esperar: 2 }, { acao: "apelo" }, { esperar: 2 }, { acao: "enfase" }, { esperar: 3 }]);
    }
    // alguns magistrados na plateia
    if (TOGA.juizesTJCE && TOGA.juizesTJCE.sortearJuizes) {
      const plat = TOGA.juizesTJCE.sortearJuizes(8);
      pontos.plateiaAcm = [];
      plat.slice(0, 8).forEach(function (j, i) {
        const px = AX - 19 + (i % 6) * 2.0, pz = -8.6 + Math.floor(i / 6) * 1.5;
        const pj = npc("plateiaAcm" + i,
          { pele: PELES[i % 5], cabelo: ["curto", "coque", "longo", "calvo"][i % 4], corCabelo: "#241a10",
            traje: i % 2 ? "terno" : "blazer", corTraje: ["#2a2a30", "#33424f", "#4a4438"][i % 3] },
          px, pz, Math.PI, { sentado: true });   // VIRADOS PARA O PALCO (norte), como as cadeiras
        if (pj) {
          pj.setEmocao(i % 4 === 0 ? "feliz" : "neutro");
          // um ou outro da plateia acena/assente de vez em quando
          if (i % 3 === 0) rotina(pj, [{ esperar: 4 + i }, { acao: "enfase" }, { esperar: 6 }]);
        }
        pontos.plateiaAcm.push({ nome: j.nome, lotacao: j.lotacao, x: px, z: pz, boneco: pj });
      });
    }
    // um ATLETA correndo no campo society (circuito)
    const atleta = npc("atletaAcm",
      { pele: "#8a5436", cabelo: "curto", corCabelo: "#241a10", traje: "camisa", corTraje: "#c94f4f" },
      AX - 14, 22, 0);
    if (atleta) { atleta.setEmocao("feliz");
      rotina(atleta, [
        { ir: [{ x: AX + 4, z: 22 }] }, { ir: [{ x: AX + 4, z: 32 }] },
        { ir: [{ x: AX - 14, z: 32 }] }, { ir: [{ x: AX - 14, z: 22 }] }
      ]);
    }
    // um banhista passeando à beira da piscina
    const banhista = npc("banhistaAcm",
      { pele: "#a86a48", cabelo: "longo", corCabelo: "#3a2a1a", traje: "camisa", corTraje: "#f2b53a" },
      AX - 4, 5, Math.PI);
    if (banhista) rotina(banhista, [
      { ir: [{ x: AX + 3, z: 6 }] }, { esperar: 3 }, { ir: [{ x: AX - 4, z: 14 }] }, { esperar: 3 },
      { ir: [{ x: AX - 4, z: 5 }] }, { esperar: 2 }
    ]);
    // um GARÇOM do clube, circulando com a bandeja entre a copa e a diretoria
    const garcom = npc("garcomAcm",
      { pele: "#c98e66", cabelo: "curto", corCabelo: "#241a10", traje: "camisa", corTraje: "#e8e6da" },
      AX + 14, -3, 0);
    if (garcom) {
      garcom.segurar("xicara", "dir");
      rotina(garcom, [
        { ir: [{ x: AX + 14, z: -6 }] }, { acao: "entregar" }, { esperar: 3 },
        { ir: [{ x: AX + 8, z: -3 }, { x: AX, z: -4 }] }, { esperar: 2 },
        { ir: [{ x: AX + 8, z: -3 }, { x: AX + 14, z: -3 }] }, { esperar: 2 }
      ]);
    }

    /* ================= PASSARINHOS / GAIVOTAS ================= */
    passaro(AX, 40, 7.0, 16, 0xe8e2d2);            // gaivotas sobre o mar
    passaro(AX - 10, 42, 6.0, 12, 0xe8e2d2);
    passaro(AX + 12, 38, 8.0, 14, 0xded6c8);
    passaro(AX - 6, 18, 5.5, 10, 0x33373d);        // sobre o campo/piscina
    passaro(AX + 8, 10, 6.0, 9, 0x44484e);
    passaro(AX, 30, 5.0, 8, 0xe8e2d2);             // na praia

    info = { colisores: colisores, paredesCamera: paredesCamera, pontos: pontos, vivos: vivos, aguas: aguas, passaros: passaros };
    return info;
  }

  return {
    construir: construir,
    get AX() { return AX; },
    get pontos() { return info ? info.pontos : null; }
  };
})();
