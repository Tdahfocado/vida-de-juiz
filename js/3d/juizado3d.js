/* ============================================================
   TOGA 3D — juizado3d.js : O JUIZADO ESPECIAL CÍVEL E CRIMINAL
   ------------------------------------------------------------
   A unidade onde o Juiz de Direito Sérgio Augusto Furtado Neto
   Viana atuou por 5 anos. Uma ala do fórum (acesso por porta no
   corredor), montada em x ≈ +800 no mesmo scene (a neblina
   separa), com:

     - SALÃO comum (chegada / espaço da FESTA): mural de fotos
       da equipe, palco, mesa do bolo;
     - SECRETARIA: balcão, baias, scanner (a saga do estagiário);
     - SALA DE ATENDIMENTO INDIVIDUAL: a mesa de atermação, onde
       o servidor colhe o jus postulandi da parte;
     - SALA DO JUIZ (gabinete): mesa, estante, brasão, placa;
     - SALA DE AUDIÊNCIAS: bancada, mesas de partes, conciliação.

   A equipe REAL povoa as salas, cada um com avatar e função. No
   modo festa, parte da equipe se reúne no salão para comemorar o
   4º título consecutivo (Prêmio + Gestão TJCE — Certificação
   Excelência). Construção em "linguagem de blocos", como a ESMEC
   e a ACM.
   ============================================================ */

window.TOGA = window.TOGA || {};

TOGA.juizado3d = (function () {
  if (!window.THREE) return null;

  const JX = 800;                  // centro do Juizado no eixo x
  const ALTURA = 3.2;
  let construido = false;
  let info = null;
  let festaMontada = false;

  function mat(cor) { return TOGA.texturas3d.matPlastico(cor); }
  function matTex(tex, rx, ry) {
    const t = tex.clone(); t.needsUpdate = true; t.repeat.set(rx || 1, ry || 1);
    return new THREE.MeshLambertMaterial({ map: t });
  }

  /* ---------- O ELENCO: avatar + função + falas ----------
     A equipe que fez do Juizado a unidade mais rápida do Ceará.
     `falas` é um banco de frases (a interação cicla por elas). */
  const EQUIPE = [
    { id: "tcheska", nome: "Tcheska", cargo: "Supervisora — a mamis poderosa",
      sala: "secretaria",
      avatar: { pele: "#e8c39a", cabelo: "longo", corCabelo: "#d9b46a", traje: "blazer", corTraje: "#3a2f4a", corBlusa: "#efe5c8" },
      falas: [
        "👑 Tcheska, a supervisora, encara você por cima dos óculos imaginários: “Doutor, gestão não é sorte — é planilha, prazo e gente boa. As quatro certificações estão na parede porque AQUI ninguém deixa passar nada. Nem o senhor.”",
        "👑 Tcheska: “Indicador é igual pressão arterial: a gente mede TODO dia. Congestionamento, tempo de sentença, acervo — eu sei de cabeça. Quer ver? Pergunte qualquer número.”",
        "👑 Tcheska, general: “Equipe afinada não nasce, doutor — se treina. Cada uma dessas meninas faz o trabalho de três. E eu? Eu faço o de todas, de olho fechado.”"
      ] },
    { id: "nubia", nome: "Núbia", cargo: "Servidora — o “setor de alvarás”",
      sala: "secretaria",
      avatar: { pele: "#a86a48", cabelo: "coque", corCabelo: "#241a10", traje: "camisa", corTraje: "#4a5a6e", corBlusa: "#e8e2d2" },
      falas: [
        "⚡ Núbia, sem levantar os olhos da tela (que já mudou três vezes): “Alvará? Sai. Mandado? Sai. O senhor pediu agora e eu já fiz ANTES. Por isso me chamam de setor de alvarás — eu sou o setor inteiro, doutor.”",
        "⚡ Núbia: “Entendo de tudo aqui: distribuição, expedição, baixa, arquivamento. Me joga qualquer processo que eu acho o nó e desato. Rapidez não é pressa — é saber onde mexer.”",
        "⚡ Núbia: “Hoje zerei a fila de alvarás antes do café. Antes DO café, doutor. A Tcheska só fez assim com a cabeça — que pra ela já é medalha.”"
      ] },
    { id: "rochelle", nome: "Rochelle", cargo: "Conciliadora — dona da Belle Missy Joias",
      sala: "audiencias",
      avatar: { pele: "#d8a87f", cabelo: "longo", corCabelo: "#3a2a1a", traje: "vestido", corTraje: "#7a2e4a", corBlusa: "#efe5c8" },
      falas: [
        "💎 Rochelle, a conciliadora: “Eu trabalho aqui por PRAZER, viu, doutor — minha vida é a Belle Missy, minhas joias. Mas botar duas partes brigadas pra apertar a mão? Isso não tem preço. Acordo fechado é a joia mais bonita do dia.”",
        "💎 Rochelle: “Aprendi IA com o senhor — o melhor do Ceará nisso, não adianta negar. Hoje minuto de despacho que levava uma hora eu faço em dez, com a máquina puxando a primeira versão e eu lapidando. Lapidar é comigo mesmo.”",
        "💎 Rochelle, desenrolada: “Audiência travada eu destravo: escuto os dois, acho o que ninguém quer perder e ofereço o meio-termo. Saem reclamando um do outro e agradecendo a mim. Isso é arte, doutor.”"
      ] },
    { id: "yasmin", nome: "Yasmin", cargo: "Secretaria — expedientes e movimentação",
      sala: "secretaria",
      avatar: { pele: "#c98e66", cabelo: "longo", corCabelo: "#241a10", traje: "camisa", corTraje: "#556a55", corBlusa: "#e8e2d2" },
      falas: [
        "📨 Yasmin, do balcão, já batendo no teclado: “Movimento processo mais rápido que carregam página, doutor. Expediente que chega de manhã sai antes do almoço. Aqui a régua é ligeira — e eu corro com ela.”",
        "📨 Yasmin: “Acabei de movimentar a pauta inteira de amanhã: intimações disparadas, partes cientes, nada parado. Pode dormir tranquilo — o que passa por mim não dorme nos autos.”"
      ] },
    { id: "gloria", nome: "Glória", cargo: "Expedientes (home office) — veio para a festa",
      sala: "secretaria",
      avatar: { pele: "#8a5436", cabelo: "coque", corCabelo: "#241a10", traje: "blazer", corTraje: "#4a4438", corBlusa: "#efe5c8" },
      falas: [
        "🏠 Glória, sorrindo largo: “Eu trabalho de casa, doutor — mas FESTA da equipe eu não perco por nada! Botei a roupa boa e vim. De longe ou de perto, esse Juizado é meu também.”",
        "🏠 Glória: “Home office não me tira do time: meus expedientes saem no prazo igualzinho aos das meninas daqui. Hoje só vim conferir se o bolo é tão bom quanto os nossos números.”"
      ] },
    { id: "milla", nome: "Milla", cargo: "Analista judiciária",
      sala: "secretaria",
      avatar: { pele: "#e8c39a", cabelo: "coque", corCabelo: "#3a2a1a", traje: "blazer", corTraje: "#33424f", corBlusa: "#e8e2d2", oculos: true },
      falas: [
        "📑 Milla, a analista: “Análise minuciosa é comigo, doutor. Antes de chegar no senhor, o processo passa pelo meu pente fino — competência, prazo, pressuposto. O que sobe pra decisão já vem limpo.”",
        "📑 Milla: “Levantei a estatística do trimestre: nosso tempo médio de sentença caiu de novo. Eu adoro um gráfico que desce — quando é congestionamento, descer é vencer.”"
      ] },
    { id: "lais", nome: "Laís", cargo: "Chefe da assessoria — 8 anos com o juiz",
      sala: "gabinete",
      avatar: { pele: "#c98e66", cabelo: "coque", corCabelo: "#241505", traje: "blazer", corTraje: "#4a4438", corBlusa: "#efe5c8", oculos: true },
      falas: [
        "🗂 Laís, a chefe da assessoria: “Oito anos com o senhor, doutor. Já sei a minuta que o senhor quer antes do senhor pedir. A gente fala metade da frase e a outra metade já está no papel. Isso não se contrata — se constrói.”",
        "🗂 Laís: “A assessoria está redonda: cada um no seu, prazos sob controle, nada perdido. O senhor vai pro Núcleo de Custódia, mas o método fica — a gente aprendeu a trabalhar do jeito certo.”"
      ] },
    { id: "bruna", nome: "Bruna", cargo: "Assessora — minutas (sotaque do Cariri)",
      sala: "gabinete",
      avatar: { pele: "#c98e66", cabelo: "longo", corCabelo: "#3a2a1a", traje: "blazer", corTraje: "#5a4a52", corBlusa: "#e8e2d2" },
      falas: [
        "📝 Bruna, no jeitão do Cariri: “Vixe, doutor, minuta comigo é num instantinho! O senhor pede e eu já tô fundamentando, ó. Confiança o senhor pode ter: o que sai da minha mão sai certin e ligeiro.”",
        "📝 Bruna: “Égua, esse processo aqui tava embolado, mas eu desenrolei tudin: peguei a tese, achei o precedente e amarrei. Pode ler que tá no ponto, doutor — caprichado e rápido, do jeito que o senhor gosta.”"
      ] },
    { id: "debora", nome: "Débora", cargo: "Atermação — petições do jus postulandi",
      sala: "atendimento",
      avatar: { pele: "#a86a48", cabelo: "coque", corCabelo: "#241a10", traje: "camisa", corTraje: "#6e5a3a", corBlusa: "#efe5c8" },
      falas: [
        "🖊 Débora, franca como sempre, atendendo uma parte: “Olhe, minha senhora, vou ser sincera: essa ação aqui não tem futuro, não — o juiz vai negar. MAS, se a senhora quiser, a gente protocola assim mesmo, é seu direito. Decide aí.”",
        "🖊 Débora: “Aqui é a atermação, doutor: a parte chega sem advogado, conta a história, eu transformo em petição na hora. Jus postulandi é isso — o Juizado é a porta que ninguém fecha na cara de ninguém.”",
        "🖊 Débora: “Já adianto o resultado pra parte pra ela não criar ilusão. Mas protocolo tudo que ela quiser — meu papel é dar acesso, não dar palpite obrigatório.”"
      ] },
    { id: "lidayana", nome: "Lidayana", cargo: "Juíza leiga — instrução on-line",
      sala: "audiencias",
      avatar: { pele: "#d8a87f", cabelo: "longo", corCabelo: "#241a10", traje: "blazer", corTraje: "#2f4a3e", corBlusa: "#e8e2d2" },
      falas: [
        "💻 Lidayana, juíza leiga, headset no pescoço: “Conduzo as audiências on-line de instrução, doutor. Ouço parte, testemunha, colho tudo e mando a proposta de sentença pro senhor homologar. Pela tela ou na sala, a Justiça anda igual.”"
      ] },
    { id: "mariana", nome: "Mariana", cargo: "Juíza leiga — instrução on-line",
      sala: "audiencias",
      avatar: { pele: "#c98e66", cabelo: "coque", corCabelo: "#3a2a1a", traje: "blazer", corTraje: "#4a4438", corBlusa: "#efe5c8" },
      falas: [
        "💻 Mariana, juíza leiga: “Hoje já fiz seis audiências on-line antes do meio-dia. Instrução enxuta, conciliação tentada sempre primeiro. Quando o acordo não sai, a proposta vai fundamentada pro senhor. Rende, doutor.”"
      ] },
    { id: "luana", nome: "Luana", cargo: "Juíza leiga — instrução on-line",
      sala: "audiencias",
      avatar: { pele: "#a86a48", cabelo: "longo", corCabelo: "#241a10", traje: "blazer", corTraje: "#33424f", corBlusa: "#e8e2d2" },
      falas: [
        "💻 Luana, juíza leiga: “Adoro instrução: é onde o caso ganha cara. Pela tela eu vejo o nervoso da testemunha, a manha da parte. Colho com calma e entrego pro senhor pronto pra decidir. Trabalho bom é assim.”"
      ] },
    { id: "carlostierry", nome: "Carlos Tierry", cargo: "Estagiário de pós — faz de tudo",
      sala: "secretaria",
      avatar: { pele: "#d8a87f", cabelo: "curto", corCabelo: "#241a10", traje: "camisa", corTraje: "#4a5a6e", corBlusa: "#e8e2d2" },
      falas: [
        "🖨 Carlos Tierry, o estagiário de pós, brigando com o scanner: “Doutor, eu faço de TUDO aqui — juntada, digitalização, pesquisa, café. Meu único inimigo é esse scanner. Ele trava de propósito, eu juro. Olha, travou de novo!”",
        "🖨 Carlos Tierry: “Já reiniciei o scanner quatro vezes hoje. QUATRO. Aí ele digitaliza a folha torta, com sombra, e some a página 2. A pós-graduação não me preparou pra isso, doutor.”",
        "🖨 Carlos Tierry, vitorioso: “Consegui! O scanner funcionou na primeira! ...brincadeira, foi na sétima. Mas tá tudo digitalizado e nos autos. Estagiário de Juizado faz milagre — e ainda repõe o toner.”"
      ] }
  ];

  function construir(scene) {
    if (construido) return info;
    construido = true;
    const colisores = [], paredesCamera = [], pontos = {}, vivos = [], equipe = {};

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
                   material || paredeMat, { bloqueiaCamera: true });
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
    function placaEmRot(texto, x, y, z, rotY, larg) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(larg || 1.6, 0.4),
        new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.placa(texto),
          polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
      m.position.set(x, y, z); m.rotation.y = rotY || 0;
      scene.add(m);
      return m;
    }
    function mesa(x, z, w, d, rotY) {
      const m = caixa(w, 0.78, d, x, 0.39, z, madeira, { rotY: rotY });
      return m;
    }
    function cadeira(x, z, rotY, cor) {
      const g = new THREE.Group();
      const assento = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.5), mat(cor || 0x2a2d33));
      assento.position.y = 0.46;
      const encosto = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.08), mat(cor || 0x2a2d33));
      encosto.position.set(0, 0.7, -0.21);
      g.add(assento, encosto);
      [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]].forEach(function (p) {
        const pe = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.46, 6), mat(0x15110c));
        pe.position.set(p[0], 0.23, p[1]); g.add(pe);
      });
      g.position.set(x, 0, z); g.rotation.y = rotY || 0;
      g.traverse(function (o) { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
      scene.add(g);
      return g;
    }
    function computador(x, z, rotY) {
      caixa(0.55, 0.36, 0.05, x, 1.04, z, mat(0x15110c), { colide: false, semSombra: true, rotY: rotY });
      const tela = new THREE.Mesh(new THREE.PlaneGeometry(0.48, 0.30),
        new THREE.MeshBasicMaterial({ color: 0x2a4a6a }));
      tela.position.set(x, 1.04, z + (rotY ? 0 : 0.03));
      if (rotY) tela.rotation.y = rotY;
      scene.add(tela);
    }
    function planta(x, z) {
      const vaso = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.18, 0.4, 10), mat(0x8a5a3a));
      vaso.position.set(x, 0.2, z); vaso.castShadow = true;
      const folhas = new THREE.Mesh(new THREE.SphereGeometry(0.32, 8, 6), mat(0x2f4a3e));
      folhas.position.set(x, 0.62, z);
      scene.add(vaso, folhas);
      colisores.push({ minX: x - 0.24, maxX: x + 0.24, minZ: z - 0.24, maxZ: z + 0.24 });
    }

    const paredeMat = TOGA.texturas3d.parede ? matTex(TOGA.texturas3d.parede(), 3, 1) : mat(0x5d5444);
    const madeira = TOGA.texturas3d.madeira ? matTex(TOGA.texturas3d.madeira(), 1, 1) : mat(0x6e4a2a);
    const pisoHall = TOGA.texturas3d.pisoCorredor ? matTex(TOGA.texturas3d.pisoCorredor(), 6, 4) : mat(0x2e2114);
    const pisoSala = TOGA.texturas3d.pisoSala ? matTex(TOGA.texturas3d.pisoSala(), 4, 4) : mat(0x3a2b1b);

    /* ============ PISOS ============ */
    piso(JX - 15, -12, JX + 15, 4, pisoHall, 0.02);                 // salão / chegada
    piso(JX - 15, 4, JX + 15, 14, pisoSala, 0.03);                  // faixa das salas

    /* ============ PAREDES EXTERNAS ============ */
    // sul (z=-12) com vão central [JX-1, JX+1] = porta para o fórum
    parede(JX - 15, -12, JX - 1, -12);
    parede(JX + 1, -12, JX + 15, -12);
    parede(JX - 15, 14, JX + 15, 14);                               // norte (fundo)
    parede(JX - 15, -12, JX - 15, 14);                             // oeste
    parede(JX + 15, -12, JX + 15, 14);                             // leste
    pontos.spawnJuizado = { x: JX, z: -9, angulo: 0 };
    pontos.portaForum = { x: JX, z: -11.0 };
    // batente da porta para o fórum
    caixa(2.4, ALTURA, 0.3, JX, ALTURA / 2, -12, mat(0x4a3018), { colide: false });
    placaEmRot("‹ FÓRUM", JX, 2.4, -11.78, 0, 1.6);

    /* ============ PAREDE DAS SALAS (z=4) com VÃOS de porta ============ */
    const vaos = [
      [JX - 11.4, JX - 9.4],   // secretaria
      [JX - 4.2, JX - 3.0],    // atendimento
      [JX + 2.0, JX + 3.2],    // gabinete
      [JX + 9.0, JX + 11.0]    // audiências
    ];
    let cursor = JX - 15;
    vaos.forEach(function (v) {
      parede(cursor, 4, v[0], 4);
      cursor = v[1];
    });
    parede(cursor, 4, JX + 15, 4);
    // divisórias internas entre as salas (z 4..14)
    parede(JX - 6, 4, JX - 6, 14);     // secretaria | atendimento
    parede(JX - 1, 4, JX - 1, 14);     // atendimento | gabinete
    parede(JX + 6, 4, JX + 6, 14);     // gabinete | audiências

    /* ============ TETO ============ */
    [[JX - 15, -12, JX + 15, 4], [JX - 15, 4, JX + 15, 14]].forEach(function (t) {
      const teto = new THREE.Mesh(
        new THREE.PlaneGeometry(Math.abs(t[2] - t[0]), Math.abs(t[3] - t[1])),
        new THREE.MeshLambertMaterial({ color: 0xe8e6e0 }));
      teto.rotation.x = Math.PI / 2;
      teto.position.set((t[0] + t[2]) / 2, ALTURA, (t[1] + t[3]) / 2);
      scene.add(teto);
    });

    /* ============ LETREIRO DO JUIZADO no salão ============ */
    if (TOGA.texturas3d.letreiro) {
      const letr = new THREE.Mesh(new THREE.PlaneGeometry(7.4, 1.2),
        new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.letreiro(
          "JUIZADO ESPECIAL", "#23396b", "#e7cf9a", "CÍVEL E CRIMINAL — COMARCA DE FORTALEZA"),
          polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
      letr.position.set(JX, 2.5, 3.86);
      letr.rotation.y = Math.PI;
      scene.add(letr);
    }
    // as quatro certificações na parede do salão (a parede dos troféus)
    if (TOGA.texturas3d.letreiro) {
      ["1º TÍTULO", "2º TÍTULO", "3º TÍTULO", "4º TÍTULO"].forEach(function (t, i) {
        const placa = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.0),
          new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.letreiro(
            t, i === 3 ? "#8e6f1a" : "#2f4a3e", "#f4ecd9", "PRÊMIO + GESTÃO TJCE") }));
        placa.position.set(JX + 15 - 0.12, 1.9, -9 + i * 2.0);
        placa.rotation.y = -Math.PI / 2;
        scene.add(placa);
      });
      placaEmRot("CERTIFICAÇÃO EXCELÊNCIA — A MAIS ALTA", JX + 14.85, 2.65, -6, -Math.PI / 2, 3.0);
    }

    /* ============ O MURAL DE FOTOS (parede oeste do salão) ============ */
    const mural = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 2.4),
      new THREE.MeshLambertMaterial({
        map: TOGA.texturas3d.mural ? TOGA.texturas3d.mural() : null,
        color: 0x9a8a6a }));
    mural.position.set(JX - 14.85, 1.7, -6);
    mural.rotation.y = Math.PI / 2;
    scene.add(mural);
    // moldura de madeira
    caixa(0.12, 2.7, 5.0, JX - 14.9, 1.7, -6, madeira, { colide: false });
    placaEmRot("MURAL DA EQUIPE", JX - 14.7, 3.05, -6, Math.PI / 2, 2.2);
    pontos.mural = { x: JX - 13.6, z: -6 };

    /* ============ SECRETARIA (x -15..-6, z 4..14) ============ */
    placaEmRot("SECRETARIA", JX - 10.4, 2.5, 4.18, 0, 2.0);
    // balcão de atendimento de frente para o salão
    caixa(7.0, 1.05, 0.6, JX - 10.4, 0.52, 5.2, madeira);
    caixa(7.2, 0.06, 0.8, JX - 10.4, 1.08, 5.2, mat(0x4a3018), { colide: false, semSombra: true });
    // baias com computadores ao fundo
    [[JX - 13, 8.5], [JX - 11, 11], [JX - 8.5, 8.5], [JX - 7, 11]].forEach(function (p) {
      mesa(p[0], p[1], 1.4, 0.8);
      computador(p[0], p[1] - 0.2, 0);
      cadeira(p[0], p[1] + 0.7, Math.PI, 0x22252a);
    });
    // pilhas de autos
    [[JX - 12.4, 12.6], [JX - 9.6, 12.6]].forEach(function (p) {
      caixa(0.5, 0.6, 0.35, p[0], 0.85, p[1], mat(0xe2d6ba), { colide: false, semSombra: true });
    });
    // O SCANNER (a saga do Carlos Tierry), numa mesinha lateral
    const scannerMesa = mesa(JX - 7.4, 6.6, 1.0, 0.7);
    const scanner = caixa(0.7, 0.28, 0.5, JX - 7.4, 0.92, 6.6, mat(0x2a2d33), { colide: false });
    const tampaScanner = caixa(0.7, 0.05, 0.5, JX - 7.4, 1.08, 6.6, mat(0x55585e), { colide: false, semSombra: true });
    placaEmRot("DIGITALIZAÇÃO", JX - 7.4, 1.7, 6.0, 0, 1.4);
    pontos.scanner = { x: JX - 7.4, z: 7.4 };
    planta(JX - 14, 12.8);

    /* ============ SALA DE ATENDIMENTO INDIVIDUAL (x -6..-1, z 4..14) ============ */
    placaEmRot("ATENDIMENTO — ATERMAÇÃO (JUS POSTULANDI)", JX - 3.5, 2.5, 4.18, 0, 4.4);
    // mesa de atermação, com a parte de um lado e a servidora do outro
    mesa(JX - 3.5, 8.5, 1.8, 1.0);
    computador(JX - 3.5, 8.2, 0);
    cadeira(JX - 3.5, 9.6, Math.PI, 0x6e5a3a);   // servidora (Débora)
    cadeira(JX - 4.2, 7.2, 0, 0x4a4438);          // a parte
    cadeira(JX - 2.8, 7.2, 0, 0x4a4438);          // a parte (acompanhante)
    // cartaz de orientação ao cidadão
    if (TOGA.texturas3d.letreiro) {
      const cartaz = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.1),
        new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.letreiro(
          "SEM ADVOGADO?", "#23396b", "#f4ecd9", "ATÉ 20 SALÁRIOS: VOCÊ MESMO PODE — LEI 9.099/95") }));
      cartaz.position.set(JX - 5.85, 1.9, 8.5);
      cartaz.rotation.y = Math.PI / 2;
      scene.add(cartaz);
    }
    pontos.atermacao = { x: JX - 3.5, z: 10.4 };

    /* ============ SALA DO JUIZ — GABINETE (x -1..+6, z 4..14) ============ */
    placaEmRot("GABINETE — JUIZ SÉRGIO A. F. N. VIANA", JX + 2.5, 2.5, 4.18, 0, 4.2);
    mesa(JX + 2.5, 11, 2.6, 1.2);
    computador(JX + 2.5, 11.4, Math.PI);
    cadeira(JX + 2.5, 11.9, 0, 0x1d150d);          // a cadeira do juiz
    cadeira(JX + 1.4, 9.6, Math.PI, 0x4a4438);     // visitante
    cadeira(JX + 3.6, 9.6, Math.PI, 0x4a4438);     // visitante
    // estante
    caixa(0.5, 2.0, 3.0, JX + 5.6, 1.0, 11, madeira);
    for (let n = 0; n < 12; n++) {
      caixa(0.32, 0.26, 0.12, JX + 5.4, 0.55 + Math.floor(n / 4) * 0.55, 9.9 + (n % 4) * 0.55,
        mat([0x7c3030, 0x2f4a3e, 0x2a3d7c, 0x8a6240][n % 4]), { colide: false, semSombra: true });
    }
    // brasão da Justiça atrás da mesa
    const brasao = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.3),
      new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.brasao ? TOGA.texturas3d.brasao() : null, color: 0x463422 }));
    brasao.position.set(JX + 2.5, 1.9, 13.85);
    scene.add(brasao);
    // mesas das assessoras (Laís e Bruna)
    mesa(JX + 0.2, 6.6, 1.3, 0.8);
    computador(JX + 0.2, 6.4, 0);
    cadeira(JX + 0.2, 7.3, Math.PI, 0x4a4438);
    mesa(JX + 4.6, 6.6, 1.3, 0.8);
    computador(JX + 4.6, 6.4, 0);
    cadeira(JX + 4.6, 7.3, Math.PI, 0x5a4a52);
    pontos.gabineteJecc = { x: JX + 2.5, z: 9.6 };

    /* ============ SALA DE AUDIÊNCIAS (x +6..+15, z 4..14) ============ */
    placaEmRot("SALA DE AUDIÊNCIAS", JX + 10.5, 2.5, 4.18, 0, 2.4);
    // bancada ao fundo
    caixa(4.0, 1.0, 1.0, JX + 10.5, 0.5, 12.6, madeira);
    caixa(4.2, 0.06, 1.2, JX + 10.5, 1.03, 12.6, mat(0x4a3018), { colide: false, semSombra: true });
    cadeira(JX + 10.5, 13.4, 0, 0x1d150d);
    // brasão sobre a bancada
    const brasao2 = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.0),
      new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.brasao ? TOGA.texturas3d.brasao() : null, color: 0x463422 }));
    brasao2.position.set(JX + 10.5, 2.0, 13.85);
    scene.add(brasao2);
    // mesas das partes (frente a frente) + mesa de conciliação
    mesa(JX + 8.4, 9.6, 1.6, 0.8);
    cadeira(JX + 8.4, 8.8, 0, 0x33424f);
    mesa(JX + 12.6, 9.6, 1.6, 0.8);
    cadeira(JX + 12.6, 8.8, 0, 0x7a2e4a);
    // bancada das juízas leigas com laptops (instrução on-line)
    mesa(JX + 13.4, 6.4, 2.6, 0.8);
    [[-0.8], [0], [0.8]].forEach(function (d) {
      caixa(0.4, 0.28, 0.04, JX + 13.4 + d[0], 0.95, 6.3, mat(0x15110c), { colide: false, semSombra: true });
    });
    cadeira(JX + 12.7, 7.2, Math.PI, 0x2f4a3e);
    cadeira(JX + 13.4, 7.2, Math.PI, 0x4a4438);
    cadeira(JX + 14.1, 7.2, Math.PI, 0x33424f);
    placaEmRot("INSTRUÇÃO ON-LINE", JX + 13.4, 1.7, 5.6, 0, 2.0);
    pontos.bancadaJecc = { x: JX + 10.5, z: 11.2 };

    /* ============ GENTE DO JUIZADO ============ */
    function npc(item, x, z, rotY, opcoes) {
      const b = TOGA.boneco3d.criar({ id: "jecc_" + item.id, avatar: item.avatar }, opcoes || {});
      b.grupo.position.set(x, 0, z);
      b.grupo.rotation.y = rotY || 0;
      scene.add(b.grupo);
      vivos.push(b);
      b.estacao = { x: x, z: z, rotY: rotY || 0, sentado: !!(opcoes && opcoes.sentado) };
      equipe[item.id] = b;
      return b;
    }
    function buscar(id) { return EQUIPE.find(function (e) { return e.id === id; }); }

    // SECRETARIA
    npc(buscar("yasmin"), JX - 10.4, 6.0, Math.PI, { sentado: true });      // atrás do balcão
    npc(buscar("tcheska"), JX - 9.4, 6.8, Math.PI * 0.9);                    // supervisora, de pé
    npc(buscar("nubia"), JX - 13, 9.2, 0, { sentado: true });
    npc(buscar("milla"), JX - 8.5, 9.2, 0, { sentado: true });
    npc(buscar("gloria"), JX - 11, 11.7, 0, { sentado: true });
    const tierry = npc(buscar("carlostierry"), JX - 7.4, 7.5, Math.PI);
    tierry.setEmocao("surpresa");

    // ATENDIMENTO
    npc(buscar("debora"), JX - 3.5, 9.6, 0, { sentado: true });

    // GABINETE
    npc(buscar("lais"), JX + 0.2, 7.3, 0, { sentado: true });
    npc(buscar("bruna"), JX + 4.6, 7.3, 0, { sentado: true });

    // AUDIÊNCIAS
    npc(buscar("rochelle"), JX + 12.6, 8.8, 0, { sentado: true });
    npc(buscar("lidayana"), JX + 12.7, 7.2, Math.PI, { sentado: true });
    npc(buscar("mariana"), JX + 13.4, 7.2, Math.PI, { sentado: true });
    npc(buscar("luana"), JX + 14.1, 7.2, Math.PI, { sentado: true });

    // lustres
    [[JX - 10, -4], [JX, -4], [JX + 10, -4], [JX - 10, 9], [JX, 9], [JX + 10, 9]].forEach(function (p) {
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 6), mat(0x2a2118));
      base.position.set(p[0], ALTURA - 0.25, p[1]);
      const luz = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 6),
        new THREE.MeshBasicMaterial({ color: 0xffe2a8 }));
      luz.position.set(p[0], ALTURA - 0.5, p[1]);
      scene.add(base, luz);
    });

    info = { colisores: colisores, paredesCamera: paredesCamera, pontos: pontos,
             vivos: vivos, equipe: equipe, elenco: EQUIPE, JX: JX };
    return info;
  }

  /* ============================================================
     A DECORAÇÃO DA FESTA (idempotente) — só some quando se sai
     ============================================================ */
  let festaProps = [];
  const confetes = [];
  function montarFesta(scene) {
    if (festaMontada) { festaProps.forEach(function (m) { m.visible = true; }); return; }
    festaMontada = true;

    // BANNER do 4º título, atravessando o salão
    if (TOGA.texturas3d.letreiro) {
      const banner = new THREE.Mesh(new THREE.PlaneGeometry(9.0, 1.6),
        new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.letreiro(
          "4º TÍTULO CONSECUTIVO!", "#8e1f1a", "#ffe2a8",
          "PRÊMIO + GESTÃO TJCE — CERTIFICAÇÃO EXCELÊNCIA") }));
      banner.position.set(JX, 2.6, -1.5);
      banner.rotation.y = Math.PI;
      scene.add(banner); festaProps.push(banner);
    }
    // PALCO ao fundo do salão
    const palco = new THREE.Mesh(new THREE.BoxGeometry(6, 0.3, 2.4), mat(0x5a2e3a));
    palco.position.set(JX, 0.15, -10.6); palco.receiveShadow = true;
    scene.add(palco); festaProps.push(palco);
    // MESA DO BOLO no centro
    const mesaBolo = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.78, 16), mat(0x6e4a2a));
    mesaBolo.position.set(JX, 0.39, -5); mesaBolo.castShadow = true;
    scene.add(mesaBolo); festaProps.push(mesaBolo);
    const bolo = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.5, 0.4, 16), mat(0xf4ecd9));
    bolo.position.set(JX, 0.98, -5);
    const cobertura = new THREE.Mesh(new THREE.CylinderGeometry(0.47, 0.47, 0.08, 16), mat(0x9c2b22));
    cobertura.position.set(JX, 1.2, -5);
    scene.add(bolo, cobertura); festaProps.push(bolo, cobertura);
    // velas "4" (quatro velinhas)
    for (let i = 0; i < 4; i++) {
      const vela = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.18, 6), mat(0xe7cf9a));
      vela.position.set(JX - 0.3 + i * 0.2, 1.33, -5);
      const chama = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 5),
        new THREE.MeshBasicMaterial({ color: 0xffcf6a }));
      chama.position.set(JX - 0.3 + i * 0.2, 1.45, -5);
      scene.add(vela, chama); festaProps.push(vela, chama);
    }
    // BALÕES coloridos amarrados pelo salão
    const coresBalao = [0xb03a3a, 0x23396b, 0x4f8a3a, 0xd8c84a, 0x7a2e4a, 0x2f7a9a];
    const pontosBalao = [
      [JX - 13, -10], [JX - 7, -11], [JX + 7, -11], [JX + 13, -10],
      [JX - 12, -2], [JX + 12, -2], [JX - 4, -10.5], [JX + 4, -10.5]
    ];
    pontosBalao.forEach(function (p, i) {
      const balao = new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 8), mat(coresBalao[i % 6]));
      balao.scale.y = 1.25;
      balao.position.set(p[0], 2.3, p[1]);
      const fio = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 1.4, 4), mat(0xcccccc));
      fio.position.set(p[0], 1.5, p[1]);
      scene.add(balao, fio); festaProps.push(balao, fio);
      balao.userData.fase = i * 0.8; balao.userData.baseY = 2.3;
    });
    // CONFETE caindo pelo salão (planos coloridos que giram e descem)
    const coresConfete = [0xb03a3a, 0x23396b, 0x4f8a3a, 0xd8c84a, 0x7a2e4a, 0x2f7a9a, 0xe7cf9a, 0xefe6d4];
    const geoConf = new THREE.PlaneGeometry(0.1, 0.14);
    for (let i = 0; i < 90; i++) {
      const c = new THREE.Mesh(geoConf,
        new THREE.MeshBasicMaterial({ color: coresConfete[i % 8], side: THREE.DoubleSide }));
      const cx = JX - 14 + (i * 37 % 280) / 10;     // espalha em x
      const cz = -12 + (i * 53 % 150) / 10;         // espalha em z (salão)
      const cy = 0.2 + (i * 29 % 300) / 100;        // alturas variadas
      c.position.set(cx, cy, cz);
      c.userData.confete = {
        baseX: cx, cz: cz, vy: 0.5 + (i % 5) * 0.18,
        giro: 1.5 + (i % 7) * 0.4, fase: (i * 0.7) % 6.28,
        balanco: 0.3 + (i % 4) * 0.12
      };
      scene.add(c); festaProps.push(c); confetes.push(c);
    }
    return festaProps;
  }

  function baloesFesta() { return festaProps.filter(function (m) { return m.geometry && m.geometry.type === "SphereGeometry" && m.userData.baseY; }); }
  function confetesFesta() { return confetes; }

  function esconderFesta() {
    festaProps.forEach(function (m) { m.visible = false; });
  }

  return {
    construir: construir,
    montarFesta: montarFesta,
    esconderFesta: esconderFesta,
    baloesFesta: baloesFesta,
    confetesFesta: confetesFesta,
    get JX() { return JX; },
    get pontos() { return info ? info.pontos : null; },
    get equipe() { return info ? info.equipe : null; },
    elenco: EQUIPE
  };
})();
