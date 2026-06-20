/* ============================================================
   TOGA 3D — juizado3d.js : O JUIZADO ESPECIAL CÍVEL E CRIMINAL
   ------------------------------------------------------------
   A unidade onde o Juiz de Direito Sérgio Augusto Furtado Neto
   Viana atuou por 5 anos. Uma ala do fórum (acesso por porta no
   corredor), montada em x ≈ +800 no mesmo scene (a neblina
   separa). Planta AMPLA e navegável, com salão de chegada/festa,
   corredor largo e CINCO salas com portas largas:

     - SECRETARIA: balcões e baias (Tcheska, Núbia, Yasmin, Milla,
       Glória) + o scanner do estagiário Carlos Tierry;
     - ATENDIMENTO / ATERMAÇÃO: a mesa da Débora (jus postulandi),
       com público entrando e saindo;
     - GABINETE: a mesa do juiz e as assessoras Laís e Bruna;
     - SALA DE CONCILIAÇÃO / AUDIÊNCIAS: onde Rochelle concilia e
       os casos do JECC são encenados (bancada, partes, plateia);
     - INSTRUÇÃO ON-LINE: as juízas leigas Lidayana, Mariana e Luana.

   A unidade é VIVA: a equipe senta, levanta, faz pregão, vai à
   conciliação, ao café, imprime, atende telefone e volta — e o
   público circula. No modo festa, a equipe se reúne no salão.
   ============================================================ */

window.TOGA = window.TOGA || {};

TOGA.juizado3d = (function () {
  if (!window.THREE) return null;

  const JX = 800;                  // centro do Juizado no eixo x
  const ALTURA = 3.2;
  let construido = false;
  let info = null;
  let festaMontada = false;
  let vidaIniciada = false;

  function mat(cor) { return TOGA.texturas3d.matPlastico(cor); }
  function matTex(tex, rx, ry) {
    const t = tex.clone(); t.needsUpdate = true; t.repeat.set(rx || 1, ry || 1);
    return new THREE.MeshLambertMaterial({ map: t });
  }

  /* ---------- O ELENCO: avatar + função + falas ---------- */
  const EQUIPE = [
    { id: "tcheska", nome: "Tcheska", cargo: "Supervisora — a mamis poderosa",
      avatar: { pele: "#e8c39a", cabelo: "longo", corCabelo: "#d9b46a", traje: "blazer", corTraje: "#3a2f4a", corBlusa: "#efe5c8" },
      falas: [
        "👑 Tcheska, a supervisora, encara você por cima dos óculos imaginários: “Doutor, gestão não é sorte — é planilha, prazo e gente boa. As quatro certificações estão na parede porque AQUI ninguém deixa passar nada. Nem o senhor.”",
        "👑 Tcheska: “Indicador é igual pressão arterial: a gente mede TODO dia. Congestionamento, tempo de sentença, acervo — eu sei de cabeça. Quer ver? Pergunte qualquer número.”",
        "👑 Tcheska, general: “Equipe afinada não nasce, doutor — se treina. Cada uma dessas meninas faz o trabalho de três. E eu? Eu faço o de todas, de olho fechado.”"
      ] },
    { id: "nubia", nome: "Núbia", cargo: "Servidora — o “setor de alvarás”",
      avatar: { pele: "#a86a48", cabelo: "coque", corCabelo: "#241a10", traje: "camisa", corTraje: "#4a5a6e", corBlusa: "#e8e2d2" },
      falas: [
        "⚡ Núbia, sem levantar os olhos da tela (que já mudou três vezes): “Alvará? Sai. Mandado? Sai. O senhor pediu agora e eu já fiz ANTES. Por isso me chamam de setor de alvarás — eu sou o setor inteiro, doutor.”",
        "⚡ Núbia: “Entendo de tudo aqui: distribuição, expedição, baixa, arquivamento. Me joga qualquer processo que eu acho o nó e desato. Rapidez não é pressa — é saber onde mexer.”",
        "⚡ Núbia: “Hoje zerei a fila de alvarás antes do café. Antes DO café, doutor. A Tcheska só fez assim com a cabeça — que pra ela já é medalha.”"
      ] },
    { id: "rochelle", nome: "Rochelle", cargo: "Conciliadora — dona da Belle Missy Joias",
      avatar: { pele: "#d8a87f", cabelo: "longo", corCabelo: "#3a2a1a", traje: "vestido", corTraje: "#7a2e4a", corBlusa: "#efe5c8" },
      falas: [
        "💎 Rochelle, a conciliadora: “Eu trabalho aqui por PRAZER, viu, doutor — minha vida é a Belle Missy, minhas joias. Mas botar duas partes brigadas pra apertar a mão? Isso não tem preço. Acordo fechado é a joia mais bonita do dia.”",
        "💎 Rochelle: “Aprendi IA com o senhor — o melhor do Ceará nisso, não adianta negar. Hoje minuto de despacho que levava uma hora eu faço em dez, com a máquina puxando a primeira versão e eu lapidando. Lapidar é comigo mesmo.”",
        "💎 Rochelle, desenrolada: “Audiência travada eu destravo: escuto os dois, acho o que ninguém quer perder e ofereço o meio-termo. Saem reclamando um do outro e agradecendo a mim. Isso é arte, doutor.”"
      ] },
    { id: "yasmin", nome: "Yasmin", cargo: "Secretaria — expedientes e movimentação",
      avatar: { pele: "#c98e66", cabelo: "longo", corCabelo: "#241a10", traje: "camisa", corTraje: "#556a55", corBlusa: "#e8e2d2" },
      falas: [
        "📨 Yasmin, do balcão, já batendo no teclado: “Movimento processo mais rápido que carregam página, doutor. Expediente que chega de manhã sai antes do almoço. Aqui a régua é ligeira — e eu corro com ela.”",
        "📨 Yasmin: “Acabei de movimentar a pauta inteira de amanhã: intimações disparadas, partes cientes, nada parado. Pode dormir tranquilo — o que passa por mim não dorme nos autos.”"
      ] },
    { id: "gloria", nome: "Glória", cargo: "Expedientes (home office) — veio para a festa",
      avatar: { pele: "#8a5436", cabelo: "coque", corCabelo: "#241a10", traje: "blazer", corTraje: "#4a4438", corBlusa: "#efe5c8" },
      falas: [
        "🏠 Glória, sorrindo largo: “Eu trabalho de casa, doutor — mas FESTA da equipe eu não perco por nada! Botei a roupa boa e vim. De longe ou de perto, esse Juizado é meu também.”",
        "🏠 Glória: “Home office não me tira do time: meus expedientes saem no prazo igualzinho aos das meninas daqui. Hoje só vim conferir se o bolo é tão bom quanto os nossos números.”"
      ] },
    { id: "milla", nome: "Milla", cargo: "Analista judiciária",
      avatar: { pele: "#e8c39a", cabelo: "coque", corCabelo: "#3a2a1a", traje: "blazer", corTraje: "#33424f", corBlusa: "#e8e2d2", oculos: true },
      falas: [
        "📑 Milla, a analista: “Análise minuciosa é comigo, doutor. Antes de chegar no senhor, o processo passa pelo meu pente fino — competência, prazo, pressuposto. O que sobe pra decisão já vem limpo.”",
        "📑 Milla: “Levantei a estatística do trimestre: nosso tempo médio de sentença caiu de novo. Eu adoro um gráfico que desce — quando é congestionamento, descer é vencer.”"
      ] },
    { id: "lais", nome: "Laís", cargo: "Chefe da assessoria — 8 anos com o juiz",
      avatar: { pele: "#c98e66", cabelo: "coque", corCabelo: "#241505", traje: "blazer", corTraje: "#4a4438", corBlusa: "#efe5c8", oculos: true },
      falas: [
        "🗂 Laís, a chefe da assessoria: “Oito anos com o senhor, doutor. Já sei a minuta que o senhor quer antes do senhor pedir. A gente fala metade da frase e a outra metade já está no papel. Isso não se contrata — se constrói.”",
        "🗂 Laís: “A assessoria está redonda: cada um no seu, prazos sob controle, nada perdido. O senhor vai pro Núcleo de Custódia, mas o método fica — a gente aprendeu a trabalhar do jeito certo.”"
      ] },
    { id: "bruna", nome: "Bruna", cargo: "Assessora — minutas (sotaque do Cariri)",
      avatar: { pele: "#c98e66", cabelo: "longo", corCabelo: "#3a2a1a", traje: "blazer", corTraje: "#5a4a52", corBlusa: "#e8e2d2" },
      falas: [
        "📝 Bruna, no jeitão do Cariri: “Vixe, doutor, minuta comigo é num instantinho! O senhor pede e eu já tô fundamentando, ó. Confiança o senhor pode ter: o que sai da minha mão sai certin e ligeiro.”",
        "📝 Bruna: “Égua, esse processo aqui tava embolado, mas eu desenrolei tudin: peguei a tese, achei o precedente e amarrei. Pode ler que tá no ponto, doutor — caprichado e rápido, do jeito que o senhor gosta.”"
      ] },
    { id: "debora", nome: "Débora", cargo: "Atermação — petições do jus postulandi",
      avatar: { pele: "#a86a48", cabelo: "coque", corCabelo: "#241a10", traje: "camisa", corTraje: "#6e5a3a", corBlusa: "#efe5c8" },
      falas: [
        "🖊 Débora, franca como sempre, atendendo uma parte: “Olhe, minha senhora, vou ser sincera: essa ação aqui não tem futuro, não — o juiz vai negar. MAS, se a senhora quiser, a gente protocola assim mesmo, é seu direito. Decide aí.”",
        "🖊 Débora: “Aqui é a atermação, doutor: a parte chega sem advogado, conta a história, eu transformo em petição na hora. Jus postulandi é isso — o Juizado é a porta que ninguém fecha na cara de ninguém.”",
        "🖊 Débora: “Já adianto o resultado pra parte pra ela não criar ilusão. Mas protocolo tudo que ela quiser — meu papel é dar acesso, não dar palpite obrigatório.”"
      ] },
    { id: "lidayana", nome: "Lidayana", cargo: "Juíza leiga — instrução on-line",
      avatar: { pele: "#d8a87f", cabelo: "longo", corCabelo: "#241a10", traje: "blazer", corTraje: "#2f4a3e", corBlusa: "#e8e2d2" },
      falas: [
        "💻 Lidayana, juíza leiga, headset no pescoço: “Conduzo as audiências on-line de instrução, doutor. Ouço parte, testemunha, colho tudo e mando a proposta de sentença pro senhor homologar. Pela tela ou na sala, a Justiça anda igual.”"
      ] },
    { id: "mariana", nome: "Mariana", cargo: "Juíza leiga — instrução on-line",
      avatar: { pele: "#c98e66", cabelo: "coque", corCabelo: "#3a2a1a", traje: "blazer", corTraje: "#4a4438", corBlusa: "#efe5c8" },
      falas: [
        "💻 Mariana, juíza leiga: “Hoje já fiz seis audiências on-line antes do meio-dia. Instrução enxuta, conciliação tentada sempre primeiro. Quando o acordo não sai, a proposta vai fundamentada pro senhor. Rende, doutor.”"
      ] },
    { id: "luana", nome: "Luana", cargo: "Juíza leiga — instrução on-line",
      avatar: { pele: "#a86a48", cabelo: "longo", corCabelo: "#241a10", traje: "blazer", corTraje: "#33424f", corBlusa: "#e8e2d2" },
      falas: [
        "💻 Luana, juíza leiga: “Adoro instrução: é onde o caso ganha cara. Pela tela eu vejo o nervoso da testemunha, a manha da parte. Colho com calma e entrego pro senhor pronto pra decidir. Trabalho bom é assim.”"
      ] },
    { id: "carlostierry", nome: "Carlos Tierry", cargo: "Estagiário de pós — faz de tudo",
      avatar: { pele: "#d8a87f", cabelo: "curto", corCabelo: "#241a10", traje: "camisa", corTraje: "#4a5a6e", corBlusa: "#e8e2d2" },
      falas: [
        "🖨 Carlos Tierry, o estagiário de pós, brigando com o scanner: “Doutor, eu faço de TUDO aqui — juntada, digitalização, pesquisa, café. Meu único inimigo é esse scanner. Ele trava de propósito, eu juro. Olha, travou de novo!”",
        "🖨 Carlos Tierry: “Já reiniciei o scanner quatro vezes hoje. QUATRO. Aí ele digitaliza a folha torta, com sombra, e some a página 2. A pós-graduação não me preparou pra isso, doutor.”",
        "🖨 Carlos Tierry, vitorioso: “Consegui! O scanner funcionou na primeira! ...brincadeira, foi na sétima. Mas tá tudo digitalizado e nos autos. Estagiário de Juizado faz milagre — e ainda repõe o toner.”"
      ] }
  ];
  function buscar(id) { return EQUIPE.find(function (e) { return e.id === id; }); }

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
      m.position.set((x1 + x2) / 2, y || 0.01, (z1 + z2) / 2);
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
    function computador(x, z) {
      caixa(0.55, 0.36, 0.05, x, 1.04, z, mat(0x15110c), { colide: false, semSombra: true });
      const tela = new THREE.Mesh(new THREE.PlaneGeometry(0.48, 0.30),
        new THREE.MeshBasicMaterial({ color: 0x2a4a6a }));
      tela.position.set(x, 1.04, z - 0.03);
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
    /* estação de trabalho: mesa + cadeira + monitor; o servidor SENTA
       em z = zDesk+0.78 virado para -z (de frente para a mesa e a
       entrada). Devolve o assento {x,z,rot}. NÃO colide com o assento,
       só com a mesa. */
    function estacao(x, zDesk) {
      caixa(1.5, 0.78, 0.8, x, 0.39, zDesk, madeira);   // mesa (colide)
      caixa(1.6, 0.05, 0.9, x, 0.8, zDesk, mat(0x4a3018), { colide: false, semSombra: true });
      computador(x, zDesk - 0.1);
      cadeira(x, zDesk + 0.78, Math.PI, 0x2a2d33);
      return { x: x, z: zDesk + 0.78, rot: Math.PI };
    }

    const paredeMat = TOGA.texturas3d.parede ? matTex(TOGA.texturas3d.parede(), 4, 1) : mat(0x5d5444);
    const madeira = TOGA.texturas3d.madeira ? matTex(TOGA.texturas3d.madeira(), 1, 1) : mat(0x6e4a2a);
    const pisoHall = TOGA.texturas3d.pisoCorredor ? matTex(TOGA.texturas3d.pisoCorredor(), 8, 4) : mat(0x2e2114);
    const pisoSala = TOGA.texturas3d.pisoSala ? matTex(TOGA.texturas3d.pisoSala(), 6, 4) : mat(0x3a2b1b);

    const X0 = JX - 20, X1 = JX + 20;   // extremos oeste/leste

    /* ============ PISOS ============ */
    piso(X0, -14, X1, -2, pisoHall);          // salão (chegada/festa)
    piso(X0, -2, X1, 4, pisoHall);            // corredor largo
    piso(X0, 4, X1, 16, pisoSala);            // faixa das salas

    /* ============ PAREDES EXTERNAS ============ */
    parede(X0, -14, JX - 1, -14);             // sul, com vão p/ o fórum [JX-1,JX+1]
    parede(JX + 1, -14, X1, -14);
    parede(X0, 16, X1, 16);                    // norte (fundo)
    parede(X0, -14, X0, 16);                   // oeste
    parede(X1, -14, X1, 16);                   // leste
    pontos.spawnJuizado = { x: JX, z: -11, angulo: 0 };
    pontos.portaForum = { x: JX, z: -13.0 };
    caixa(2.4, ALTURA, 0.3, JX, ALTURA / 2, -14, mat(0x4a3018), { colide: false });
    placaEmRot("‹ FÓRUM", JX, 2.5, -13.78, 0, 1.6);

    /* ============ PAREDE DAS SALAS (z=4) com PORTAS LARGAS ============
       5 salas: secretaria | atermação | gabinete | conciliação | instrução */
    const divX = [JX - 12, JX - 6, JX + 2, JX + 10];           // divisórias internas
    const vaos = [
      [JX - 17.2, JX - 14.8],   // secretaria
      [JX - 10.2, JX - 7.8],    // atermação
      [JX - 3.2, JX - 0.8],     // gabinete
      [JX + 4.8, JX + 7.2],     // conciliação
      [JX + 13.8, JX + 16.2]    // instrução on-line
    ];
    let cur = X0;
    vaos.forEach(function (v) { parede(cur, 4, v[0], 4); cur = v[1]; });
    parede(cur, 4, X1, 4);
    divX.forEach(function (x) { parede(x, 4, x, 16); });        // divisórias (z 4..16)

    /* ============ TETO ============ */
    [[X0, -14, X1, -2], [X0, -2, X1, 4], [X0, 4, X1, 16]].forEach(function (t) {
      const teto = new THREE.Mesh(
        new THREE.PlaneGeometry(Math.abs(t[2] - t[0]), Math.abs(t[3] - t[1])),
        new THREE.MeshLambertMaterial({ color: 0xe8e6e0 }));
      teto.rotation.x = Math.PI / 2;
      teto.position.set((t[0] + t[2]) / 2, ALTURA, (t[1] + t[3]) / 2);
      scene.add(teto);
    });
    // lustres
    [[JX - 14, -8], [JX, -8], [JX + 14, -8], [JX - 14, 1], [JX, 1], [JX + 14, 1],
     [JX - 16, 10], [JX - 9, 10], [JX - 2, 10], [JX + 6, 10], [JX + 15, 10]].forEach(function (p) {
      const luz = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffe2a8 }));
      luz.position.set(p[0], ALTURA - 0.4, p[1]); scene.add(luz);
    });

    /* ============ LETREIRO + PAREDE DOS TÍTULOS (salão) ============ */
    if (TOGA.texturas3d.letreiro) {
      const letr = new THREE.Mesh(new THREE.PlaneGeometry(8.0, 1.2),
        new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.letreiro(
          "JUIZADO ESPECIAL", "#23396b", "#e7cf9a", "CÍVEL E CRIMINAL — COMARCA DE FORTALEZA"),
          polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
      letr.position.set(JX, 2.6, 3.86); letr.rotation.y = Math.PI; scene.add(letr);
      ["1º TÍTULO", "2º TÍTULO", "3º TÍTULO", "4º TÍTULO"].forEach(function (t, i) {
        const placa = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.0),
          new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.letreiro(
            t, i === 3 ? "#8e6f1a" : "#2f4a3e", "#f4ecd9", "PRÊMIO + GESTÃO TJCE") }));
        placa.position.set(X1 - 0.12, 1.9, -11 + i * 2.2); placa.rotation.y = -Math.PI / 2; scene.add(placa);
      });
      placaEmRot("CERTIFICAÇÃO EXCELÊNCIA — A MAIS ALTA", X1 - 0.15, 2.7, -6, -Math.PI / 2, 3.2);
    }

    /* ============ MURAL DE FOTOS (parede oeste do salão) ============ */
    const mural = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 2.4),
      new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.mural ? TOGA.texturas3d.mural() : null, color: 0x9a8a6a }));
    mural.position.set(X0 + 0.15, 1.7, -8); mural.rotation.y = Math.PI / 2; scene.add(mural);
    caixa(0.12, 2.7, 5.0, X0 + 0.1, 1.7, -8, madeira, { colide: false });
    placaEmRot("MURAL DA EQUIPE", X0 + 0.3, 3.05, -8, Math.PI / 2, 2.2);
    pontos.mural = { x: X0 + 1.3, z: -8 };

    /* ============ CAFÉ / COPA no corredor (ponto de circulação) ============ */
    caixa(1.6, 0.9, 0.6, JX - 1, 0.45, 3.4, madeira);
    caixa(0.18, 0.34, 0.18, JX - 1.4, 1.12, 3.4, mat(0x9c2b22), { colide: false }); // térmica
    [[-0.2], [0.2], [0.5]].forEach(function (d) {
      const x = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.07, 8), mat(0xf4ecd9));
      x.position.set(JX - 1 + d[0], 0.94, 3.3); scene.add(x);
    });
    placaEmRot("CAFÉ", JX - 1, 1.5, 3.7, 0, 1.0);
    pontos.cafe = { x: JX - 1, z: 2.4 };

    /* ============ SECRETARIA (x X0..JX-12) ============ */
    placaEmRot("SECRETARIA", JX - 16, 2.6, 4.18, 0, 2.2);
    const seatYasmin = estacao(JX - 18, 13.5);
    const seatNubia  = estacao(JX - 15, 13.5);
    const seatMilla  = estacao(JX - 18, 9.5);
    const seatGloria = estacao(JX - 15, 9.5);
    // scanner do Carlos Tierry, mesa lateral (leste)
    caixa(1.1, 0.78, 0.8, JX - 13, 0.39, 11.5, madeira);
    caixa(0.7, 0.28, 0.5, JX - 13, 0.92, 11.5, mat(0x2a2d33), { colide: false });
    caixa(0.7, 0.05, 0.5, JX - 13, 1.08, 11.5, mat(0x55585e), { colide: false, semSombra: true });
    placaEmRot("DIGITALIZAÇÃO", JX - 13, 1.7, 10.8, 0, 1.4);
    const seatTierry = { x: JX - 13, z: 12.3, rot: Math.PI };
    cadeira(JX - 13, 12.3, Math.PI, 0x4a5a6e);
    // pilhas de autos
    [[JX - 19, 15], [JX - 13.5, 14.8]].forEach(function (p) {
      caixa(0.5, 0.6, 0.35, p[0], 0.85, p[1], mat(0xe2d6ba), { colide: false, semSombra: true });
    });
    planta(JX - 19.2, 5.2);
    pontos.secretaria = { x: JX - 16, z: 7 };
    pontos.impressora = { x: JX - 19, z: 11.5 };
    caixa(0.6, 0.5, 0.5, JX - 19.2, 0.7, 11.5, mat(0x33373d));   // impressora

    /* ============ ATERMAÇÃO — Débora (x JX-12..JX-6) ============ */
    placaEmRot("ATENDIMENTO — ATERMAÇÃO (JUS POSTULANDI)", JX - 9, 2.6, 4.18, 0, 4.2);
    caixa(1.8, 0.78, 0.9, JX - 9, 0.39, 12.5, madeira);   // mesa da Débora
    caixa(1.9, 0.05, 1.0, JX - 9, 0.8, 12.5, mat(0x4a3018), { colide: false, semSombra: true });
    computador(JX - 9, 12.4);
    const seatDebora = { x: JX - 9, z: 13.3, rot: Math.PI };
    cadeira(JX - 9, 13.3, Math.PI, 0x6e5a3a);
    // cadeiras do público (de frente para a Débora, +z)
    cadeira(JX - 9.9, 11.0, 0, 0x4a4438);
    cadeira(JX - 8.1, 11.0, 0, 0x4a4438);
    if (TOGA.texturas3d.letreiro) {
      const cartaz = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.1),
        new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.letreiro(
          "SEM ADVOGADO?", "#23396b", "#f4ecd9", "ATÉ 20 SALÁRIOS: VOCÊ MESMO PODE — LEI 9.099/95") }));
      cartaz.position.set(JX - 11.85, 1.9, 12); cartaz.rotation.y = Math.PI / 2; scene.add(cartaz);
    }
    pontos.atermacao = { x: JX - 9, z: 10.5 };
    pontos.atermacaoFila = [{ x: JX - 9, z: 8.5 }, { x: JX - 9.9, z: 11.0 }, { x: JX - 8.1, z: 11.0 }];

    /* ============ GABINETE (x JX-6..JX+2) ============ */
    placaEmRot("GABINETE — JUIZ SÉRGIO A. F. N. VIANA", JX - 2, 2.6, 4.18, 0, 4.4);
    caixa(2.4, 0.78, 1.1, JX - 2, 0.39, 13.6, madeira);   // mesa do juiz
    caixa(2.5, 0.05, 1.2, JX - 2, 0.8, 13.6, mat(0x4a3018), { colide: false, semSombra: true });
    computador(JX - 2, 13.5);
    cadeira(JX - 2, 14.4, Math.PI, 0x1d150d);             // cadeira do juiz
    const brasao = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.3),
      new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.brasao ? TOGA.texturas3d.brasao() : null, color: 0x463422 }));
    brasao.position.set(JX - 2, 2.0, 15.85); scene.add(brasao);
    caixa(0.5, 2.0, 3.0, JX + 1.6, 1.0, 13.5, madeira);  // estante
    const seatLais = estacao(JX - 4.5, 9.5);
    const seatBruna = estacao(JX + 0.5, 9.5);
    pontos.gabineteJecc = { x: JX - 2, z: 11.5 };

    /* ============ CONCILIAÇÃO / AUDIÊNCIAS — Rochelle (x JX+2..JX+10) ============ */
    placaEmRot("SALA DE CONCILIAÇÃO E AUDIÊNCIAS", JX + 6, 2.6, 4.18, 0, 4.0);
    // bancada ao fundo (palco dos casos do JECC)
    caixa(3.4, 1.0, 1.0, JX + 6, 0.5, 14.4, madeira);
    caixa(3.6, 0.06, 1.2, JX + 6, 1.03, 14.4, mat(0x4a3018), { colide: false, semSombra: true });
    cadeira(JX + 6, 15.2, 0, 0x1d150d);
    const brasao2 = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.0),
      new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.brasao ? TOGA.texturas3d.brasao() : null, color: 0x463422 }));
    brasao2.position.set(JX + 6, 2.0, 15.85); scene.add(brasao2);
    // mesa de conciliação (deslocada do eixo central p/ deixar o corredor
    // da sala livre; as partes sentam ao redor dela, ao sul)
    const mesaConc = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.08, 18), madeira);
    mesaConc.position.set(JX + 6, 0.76, 9); mesaConc.castShadow = true; scene.add(mesaConc);
    caixa(0.22, 0.76, 0.22, JX + 6, 0.38, 9, mat(0x4a3018));   // pé (colide)
    cadeira(JX + 6, 10.6, Math.PI, 0x7a2e4a);   // Rochelle (ao norte, de frente p/ as partes)
    const seatRochelle = { x: JX + 6, z: 10.6, rot: Math.PI };
    placaEmRot("CONCILIAÇÃO", JX + 6, 1.7, 6.0, 0, 1.6);
    pontos.bancadaJecc = { x: JX + 6, z: 12.0 };
    pontos.conciliacao = { x: JX + 6, z: 9 };
    // palco do caso (encenação dos casos do JECC nesta sala)
    pontos.bancadaPalco = { x: JX + 6, z: 13.6 };
    pontos.cameraBancadaJecc = { pos: { x: JX + 6, y: 2.7, z: 14.7 }, alvo: { x: JX + 6, y: 1.1, z: 8.0 } };
    pontos.filaJecc = { x: JX + 6, z: 5.0 };
    pontos.publicoJecc = [
      { x: JX + 3.4, z: 5.2 }, { x: JX + 4.6, z: 5.2 }, { x: JX + 7.4, z: 5.2 },
      { x: JX + 8.6, z: 5.2 }, { x: JX + 4.0, z: 6.2 }, { x: JX + 8.0, z: 6.2 }
    ];
    pontos.publicoJecc.forEach(function (p) {
      caixa(0.6, 0.45, 0.5, p.x, 0.22, p.z, mat(0x4a3018), { colide: false, semSombra: true });
    });

    /* ============ INSTRUÇÃO ON-LINE — juízas leigas (x JX+10..X1) ============ */
    placaEmRot("INSTRUÇÃO ON-LINE — JUÍZAS LEIGAS", JX + 15, 2.6, 4.18, 0, 4.2);
    function estacaoOnline(x) {
      const zDesk = 13.5;
      caixa(1.6, 0.78, 0.8, x, 0.39, zDesk, madeira);
      caixa(1.7, 0.05, 0.9, x, 0.8, zDesk, mat(0x4a3018), { colide: false, semSombra: true });
      // tela grande (a "sala virtual")
      const tela = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.44), new THREE.MeshBasicMaterial({ color: 0x1d3a55 }));
      tela.position.set(x, 1.15, zDesk - 0.3); scene.add(tela);
      caixa(0.74, 0.5, 0.05, x, 1.15, zDesk - 0.34, mat(0x15110c), { colide: false, semSombra: true });
      cadeira(x, zDesk + 0.78, Math.PI, 0x2a2d33);
      return { x: x, z: zDesk + 0.78, rot: Math.PI };
    }
    const seatLidayana = estacaoOnline(JX + 12);
    const seatMariana  = estacaoOnline(JX + 15);
    const seatLuana    = estacaoOnline(JX + 18);
    planta(JX + 19.2, 5.4);
    pontos.instrucao = { x: JX + 15, z: 10.5 };

    /* ============ A EQUIPE (sentada corretamente em sua estação) ============ */
    const casas = {
      tcheska: { x: JX - 16, z: 6.5, rot: Math.PI, sentado: false },   // de pé, supervisionando
      nubia: seatNubia, yasmin: seatYasmin, milla: seatMilla, gloria: seatGloria,
      carlostierry: seatTierry, debora: seatDebora, lais: seatLais, bruna: seatBruna,
      rochelle: seatRochelle, lidayana: seatLidayana, mariana: seatMariana, luana: seatLuana
    };
    function npc(item, casa) {
      const sentado = casa.sentado !== false && casa.rot !== undefined && item.id !== "tcheska";
      const b = TOGA.boneco3d.criar({ id: "jecc_" + item.id, avatar: item.avatar }, { sentado: !!sentado });
      b.grupo.position.set(casa.x, 0, casa.z);
      b.grupo.rotation.y = casa.rot || 0;
      b.casa = { x: casa.x, z: casa.z, rot: casa.rot || 0, sentado: !!sentado };
      scene.add(b.grupo);
      vivos.push(b);
      equipe[item.id] = b;
      return b;
    }
    EQUIPE.forEach(function (item) {
      const casa = item.id === "tcheska"
        ? { x: JX - 16, z: 6.5, rot: Math.PI, sentado: false }
        : casas[item.id];
      const b = npc(item, casa);
      if (item.id === "carlostierry") b.setEmocao("surpresa");
    });

    // assentos da audiência do JECC (mesmas chaves do 2D) — AO REDOR da mesa
    // de conciliação, ao sul dela, de frente para a bancada (+z)
    const ASSENTOS3D_JECC = {
      centro: { x: JX + 6, z: 7.0 },
      esq1: { x: JX + 4.0, z: 8.4 }, esq2: { x: JX + 3.6, z: 7.2 }, esq3: { x: JX + 3.4, z: 6.2 },
      dir1: { x: JX + 8.0, z: 8.4 }, dir2: { x: JX + 8.4, z: 7.2 }, dir3: { x: JX + 8.6, z: 6.2 }
    };

    info = { colisores: colisores, paredesCamera: paredesCamera, pontos: pontos,
             vivos: vivos, equipe: equipe, elenco: EQUIPE, assentos: ASSENTOS3D_JECC, JX: JX };
    return info;
  }

  /* ============================================================
     A VIDA DO JUIZADO — rotinas de movimento (rotinas3d)
     ============================================================ */
  const publicoPool = [];
  function P() { return info.pontos; }

  function iniciarVida() {
    if (vidaIniciada || !info || !TOGA.rotinas3d) return;
    vidaIniciada = true;
    const R = TOGA.rotinas3d, eq = info.equipe, pt = info.pontos;
    const porta = pt.secretaria;   // referência genérica
    // helper: caminho de uma sala até um ponto do corredor e volta
    function rot(b, passos) { R.adicionarRotina(b, passos); }

    // YASMIN: trabalha, vai ao café, imprime, volta
    rot(eq.yasmin, [
      { sentar: { x: eq.yasmin.casa.x, z: eq.yasmin.casa.z, rot: Math.PI, dur: 16 } },
      { acao: "lerPapel" },
      { ir: [{ x: eq.yasmin.casa.x, z: 6 }, { x: JX - 16, z: 2.4 }, { x: pt.cafe.x, z: pt.cafe.z }] },
      { segurar: ["xicara", "dir"] }, { acao: "beber" }, { segurar: [null, "dir"] },
      { ir: [{ x: JX - 16, z: 2.4 }, { x: eq.yasmin.casa.x, z: 6 }, { x: eq.yasmin.casa.x, z: eq.yasmin.casa.z } ] },
      { sentar: { x: eq.yasmin.casa.x, z: eq.yasmin.casa.z, rot: Math.PI, dur: 14 } }
    ]);
    // NÚBIA: ligeira — leva alvará ao gabinete e volta (muito movimento)
    rot(eq.nubia, [
      { sentar: { x: eq.nubia.casa.x, z: eq.nubia.casa.z, rot: Math.PI, dur: 10 } },
      { segurar: ["autos", "esq"] },
      { ir: [{ x: JX - 16, z: 5 }, { x: JX - 16, z: 1 }, { x: JX - 2, z: 1 }, { x: JX - 2, z: 5 }, { x: pt.gabineteJecc.x, z: 9 }] },
      { esperar: 4 }, { segurar: [null, "esq"] },
      { ir: [{ x: JX - 2, z: 5 }, { x: JX - 2, z: 1 }, { x: JX - 16, z: 1 }, { x: JX - 16, z: 5 }, { x: eq.nubia.casa.x, z: eq.nubia.casa.z }] },
      { sentar: { x: eq.nubia.casa.x, z: eq.nubia.casa.z, rot: Math.PI, dur: 8 } }
    ]);
    // MILLA: análise + impressora
    rot(eq.milla, [
      { sentar: { x: eq.milla.casa.x, z: eq.milla.casa.z, rot: Math.PI, dur: 18 } },
      { ir: [{ x: pt.impressora.x + 0.8, z: 11.5 }] },
      { segurar: ["pastas", "esq"] }, { acao: "lerPapel" }, { segurar: [null, "esq"] },
      { ir: [{ x: eq.milla.casa.x, z: eq.milla.casa.z }] },
      { sentar: { x: eq.milla.casa.x, z: eq.milla.casa.z, rot: Math.PI, dur: 16 } }
    ]);
    // GLÓRIA: trabalha e dá uma passada no café
    rot(eq.gloria, [
      { sentar: { x: eq.gloria.casa.x, z: eq.gloria.casa.z, rot: Math.PI, dur: 22 } },
      { ir: [{ x: JX - 16, z: 2.4 }, { x: pt.cafe.x, z: pt.cafe.z }] },
      { segurar: ["xicara", "dir"] }, { acao: "beber" }, { segurar: [null, "dir"] },
      { ir: [{ x: JX - 16, z: 2.4 }, { x: eq.gloria.casa.x, z: eq.gloria.casa.z }] },
      { sentar: { x: eq.gloria.casa.x, z: eq.gloria.casa.z, rot: Math.PI, dur: 18 } }
    ]);
    // TCHESKA: supervisora — ronda a secretaria e a atermação
    rot(eq.tcheska, [
      { rot: Math.PI }, { esperar: 6 },
      { ir: [{ x: JX - 18, z: 11 }] }, { esperar: 4 }, { acao: "enfase" },
      { ir: [{ x: JX - 15, z: 11 }] }, { esperar: 4 },
      { ir: [{ x: JX - 16, z: 5 }, { x: JX - 16, z: 2.6 }, { x: JX - 9, z: 2.6 }, { x: JX - 9, z: 8 }] },
      { esperar: 5 }, { acao: "enfase" },
      { ir: [{ x: JX - 9, z: 2.6 }, { x: JX - 16, z: 2.6 }, { x: JX - 16, z: 6.5 }] },
      { rot: Math.PI }, { esperar: 8 }
    ]);
    // CARLOS TIERRY: a saga do scanner + café
    rot(eq.carlostierry, [
      { sentar: { x: eq.carlostierry.casa.x, z: eq.carlostierry.casa.z, rot: Math.PI, dur: 8 } },
      { acao: "lerPapel" }, { esperar: 2 }, { acao: "desespero" },
      { ir: [{ x: JX - 13, z: 5 }, { x: JX - 16, z: 2.4 }, { x: pt.cafe.x, z: pt.cafe.z }] },
      { segurar: ["xicara", "dir"] }, { acao: "beber" }, { segurar: [null, "dir"] },
      { ir: [{ x: JX - 16, z: 2.4 }, { x: JX - 13, z: 5 }, { x: eq.carlostierry.casa.x, z: eq.carlostierry.casa.z }] },
      { sentar: { x: eq.carlostierry.casa.x, z: eq.carlostierry.casa.z, rot: Math.PI, dur: 10 } }
    ]);
    // DÉBORA: atermação — atende (falar), gesticula, atende de novo
    rot(eq.debora, [
      { sentar: { x: eq.debora.casa.x, z: eq.debora.casa.z, rot: Math.PI, dur: 8 } },
      { falar: 4 }, { acao: "enfase" }, { falar: 3 },
      { sentar: { x: eq.debora.casa.x, z: eq.debora.casa.z, rot: Math.PI, dur: 6 } }
    ]);
    // LAÍS: leva minuta à mesa do juiz e volta
    rot(eq.lais, [
      { sentar: { x: eq.lais.casa.x, z: eq.lais.casa.z, rot: Math.PI, dur: 18 } },
      { segurar: ["autos", "esq"] },
      { ir: [{ x: JX - 2, z: 11.5 }, { x: JX - 2, z: 13 }] },
      { esperar: 4 }, { segurar: [null, "esq"] },
      { ir: [{ x: JX - 2, z: 11 }, { x: eq.lais.casa.x, z: eq.lais.casa.z }] },
      { sentar: { x: eq.lais.casa.x, z: eq.lais.casa.z, rot: Math.PI, dur: 14 } }
    ]);
    // BRUNA: leva minuta à conciliação e volta
    rot(eq.bruna, [
      { sentar: { x: eq.bruna.casa.x, z: eq.bruna.casa.z, rot: Math.PI, dur: 16 } },
      { segurar: ["autos", "esq"] },
      { ir: [{ x: JX + 0.5, z: 5 }, { x: JX + 0.5, z: 2.6 }, { x: JX + 6, z: 2.6 }, { x: JX + 6, z: 9 }] },
      { esperar: 4 }, { segurar: [null, "esq"] }, { acao: "enfase" },
      { ir: [{ x: JX + 6, z: 2.6 }, { x: JX + 0.5, z: 2.6 }, { x: JX + 0.5, z: 5 }, { x: eq.bruna.casa.x, z: eq.bruna.casa.z }] },
      { sentar: { x: eq.bruna.casa.x, z: eq.bruna.casa.z, rot: Math.PI, dur: 12 } }
    ]);
    // ROCHELLE: conduz a conciliação (pregão + fala) e dá uma volta
    rot(eq.rochelle, [
      { sentar: { x: eq.rochelle.casa.x, z: eq.rochelle.casa.z, rot: Math.PI, dur: 10 } },
      { falar: 5 }, { acao: "enfase" }, { falar: 4 },
      { ir: [{ x: JX + 8, z: 5 }, { x: JX + 8, z: 2.6 }, { x: pt.cafe.x + 1, z: pt.cafe.z }] },
      { segurar: ["xicara", "dir"] }, { acao: "beber" }, { segurar: [null, "dir"] },
      { ir: [{ x: JX + 8, z: 2.6 }, { x: JX + 8, z: 5 }, { x: eq.rochelle.casa.x, z: eq.rochelle.casa.z }] },
      { sentar: { x: eq.rochelle.casa.x, z: eq.rochelle.casa.z, rot: Math.PI, dur: 8 } }
    ]);
    // JUÍZAS LEIGAS: audiência on-line (sentadas, falando à tela)
    [["lidayana", 7], ["mariana", 9], ["luana", 11]].forEach(function (j) {
      const b = eq[j[0]];
      rot(b, [
        { sentar: { x: b.casa.x, z: b.casa.z, rot: Math.PI, dur: j[1] } },
        { falar: 5 }, { acao: "enfase" }, { falar: 4 },
        { sentar: { x: b.casa.x, z: b.casa.z, rot: Math.PI, dur: j[1] + 4 } }
      ]);
    });

    // PÚBLICO circulando: entra pelo fórum, vai à atermação, espera, sai
    const PELES = ["#d8a87f", "#c98e66", "#a86a48", "#8a5436", "#e8c39a"];
    const CABELOS = ["curto", "coque", "longo"];
    const CORES = ["#54453a", "#33424f", "#4a4438", "#556a55", "#5a4a52", "#6e5a3a"];
    for (let i = 0; i < 4; i++) {
      const b = TOGA.boneco3d.criar({ id: "publicoJecc" + i, avatar: {
        pele: PELES[i % 5], cabelo: CABELOS[i % 3], corCabelo: "#241a10",
        traje: i % 2 ? "camisa" : "blazer", corTraje: CORES[i % 6] } }, {});
      b.grupo.position.set(JX - 6 + i * 3, 0, -12);
      info.vivos.push(b);
      publicoPool.push(b);
      const filaZ = 8.5 + (i % 2) * 1.0;
      R.adicionarRotina(b, [
        { esperar: 4 + i * 5 },
        { ir: [{ x: JX, z: -8 }, { x: JX - 9, z: -2 }, { x: JX - 9, z: 2.6 }, { x: JX - 9, z: filaZ }] },
        { rot: 0 }, { esperar: 10 + i * 3 },               // aguarda na atermação
        { ir: [{ x: JX - 9, z: 11 }] }, { sentar: { x: JX - 9.9 + (i % 2) * 1.8, z: 11.0, rot: 0, dur: 8 } },
        { ir: [{ x: JX - 9, z: 2.6 }, { x: JX, z: -2 }, { x: JX - 6 + i * 3, z: -12 }] },
        { esperar: 14 + i * 4 }
      ]);
    }
  }

  function pausarVida() {
    if (!info || !TOGA.rotinas3d) return;
    Object.keys(info.equipe).forEach(function (id) { TOGA.rotinas3d.pausar(info.equipe[id]); });
    publicoPool.forEach(function (b) { TOGA.rotinas3d.pausar(b); b.grupo.visible = false; });
  }
  function retomarVida() {
    if (!info || !TOGA.rotinas3d) return;
    Object.keys(info.equipe).forEach(function (id) {
      const b = info.equipe[id], c = b.casa;
      TOGA.rotinas3d.retomar(b);
      if (c) { b.grupo.position.set(c.x, 0, c.z); b.grupo.rotation.y = c.rot; b.sentar(c.sentado); b.setEmocao(id === "carlostierry" ? "surpresa" : "neutro"); }
    });
    publicoPool.forEach(function (b) { b.grupo.visible = true; TOGA.rotinas3d.retomar(b); });
  }

  /* ============================================================
     A DECORAÇÃO DA FESTA (idempotente)
     ============================================================ */
  let festaProps = [];
  const confetes = [];
  function montarFesta(scene) {
    if (festaMontada) { festaProps.forEach(function (m) { m.visible = true; }); return; }
    festaMontada = true;
    if (TOGA.texturas3d.letreiro) {
      const banner = new THREE.Mesh(new THREE.PlaneGeometry(9.0, 1.6),
        new THREE.MeshLambertMaterial({ map: TOGA.texturas3d.letreiro(
          "4º TÍTULO CONSECUTIVO!", "#8e1f1a", "#ffe2a8",
          "PRÊMIO + GESTÃO TJCE — CERTIFICAÇÃO EXCELÊNCIA") }));
      banner.position.set(JX, 2.6, -1.5); banner.rotation.y = Math.PI;
      scene.add(banner); festaProps.push(banner);
    }
    const palco = new THREE.Mesh(new THREE.BoxGeometry(6, 0.3, 2.4), mat(0x5a2e3a));
    palco.position.set(JX, 0.15, -12.0); palco.receiveShadow = true;
    scene.add(palco); festaProps.push(palco);
    const mesaBolo = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.78, 16), mat(0x6e4a2a));
    mesaBolo.position.set(JX, 0.39, -6); mesaBolo.castShadow = true;
    scene.add(mesaBolo); festaProps.push(mesaBolo);
    const bolo = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.5, 0.4, 16), mat(0xf4ecd9));
    bolo.position.set(JX, 0.98, -6);
    const cobertura = new THREE.Mesh(new THREE.CylinderGeometry(0.47, 0.47, 0.08, 16), mat(0x9c2b22));
    cobertura.position.set(JX, 1.2, -6);
    scene.add(bolo, cobertura); festaProps.push(bolo, cobertura);
    for (let i = 0; i < 4; i++) {
      const vela = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.18, 6), mat(0xe7cf9a));
      vela.position.set(JX - 0.3 + i * 0.2, 1.33, -6);
      const chama = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 5), new THREE.MeshBasicMaterial({ color: 0xffcf6a }));
      chama.position.set(JX - 0.3 + i * 0.2, 1.45, -6);
      scene.add(vela, chama); festaProps.push(vela, chama);
    }
    const coresBalao = [0xb03a3a, 0x23396b, 0x4f8a3a, 0xd8c84a, 0x7a2e4a, 0x2f7a9a];
    const pontosBalao = [
      [JX - 16, -11], [JX - 8, -12.5], [JX + 8, -12.5], [JX + 16, -11],
      [JX - 14, -3], [JX + 14, -3], [JX - 5, -12], [JX + 5, -12]
    ];
    pontosBalao.forEach(function (p, i) {
      const balao = new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 8), mat(coresBalao[i % 6]));
      balao.scale.y = 1.25; balao.position.set(p[0], 2.3, p[1]);
      const fio = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 1.4, 4), mat(0xcccccc));
      fio.position.set(p[0], 1.5, p[1]);
      scene.add(balao, fio); festaProps.push(balao, fio);
      balao.userData.fase = i * 0.8; balao.userData.baseY = 2.3;
    });
    const coresConfete = [0xb03a3a, 0x23396b, 0x4f8a3a, 0xd8c84a, 0x7a2e4a, 0x2f7a9a, 0xe7cf9a, 0xefe6d4];
    const geoConf = new THREE.PlaneGeometry(0.1, 0.14);
    for (let i = 0; i < 100; i++) {
      const c = new THREE.Mesh(geoConf, new THREE.MeshBasicMaterial({ color: coresConfete[i % 8], side: THREE.DoubleSide }));
      const cx = JX - 18 + (i * 37 % 360) / 10;
      const cz = -14 + (i * 53 % 120) / 10;
      const cy = 0.2 + (i * 29 % 300) / 100;
      c.position.set(cx, cy, cz);
      c.userData.confete = { baseX: cx, vy: 0.5 + (i % 5) * 0.18, giro: 1.5 + (i % 7) * 0.4, fase: (i * 0.7) % 6.28, balanco: 0.3 + (i % 4) * 0.12 };
      scene.add(c); festaProps.push(c); confetes.push(c);
    }
    return festaProps;
  }
  function baloesFesta() { return festaProps.filter(function (m) { return m.geometry && m.geometry.type === "SphereGeometry" && m.userData.baseY; }); }
  function confetesFesta() { return confetes; }
  function esconderFesta() { festaProps.forEach(function (m) { m.visible = false; }); }

  return {
    construir: construir,
    iniciarVida: iniciarVida,
    pausarVida: pausarVida,
    retomarVida: retomarVida,
    montarFesta: montarFesta,
    esconderFesta: esconderFesta,
    baloesFesta: baloesFesta,
    confetesFesta: confetesFesta,
    get JX() { return JX; },
    get info() { return info; },
    get pontos() { return info ? info.pontos : null; },
    get equipe() { return info ? info.equipe : null; },
    elenco: EQUIPE
  };
})();
