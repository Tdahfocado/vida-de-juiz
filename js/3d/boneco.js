/* ============================================================
   TOGA 3D — boneco.js : MINIFIGS (personagens estilo Lego)
   ------------------------------------------------------------
   Constrói um boneco estilo "minifig" a partir do MESMO objeto
   `avatar` que os casos declaram para o 2D:
     { pele, cabelo: curto|coque|longo|calvo, corCabelo,
       traje: terno|blazer|camisa|vestido, corTraje,
       corGravata, corBlusa, oculos, barba }

   Anatomia de peça de montar (~1,66 m):
     pernas-bloco (duas variações: em pé / sentado, alternadas
     por sentar()) → quadril → tronco trapezoidal achatado →
     braços com MÃO EM C (e um Group "palma" onde props se
     encaixam — xícara, algemas, pastas...) → cabeça cilíndrica
     com STUD no topo. O rosto continua sendo a textura viva do
     rosto.js — as mesmas 9 emoções do 2D, agora numa minifig.

   Tudo em geometria COMPARTILHADA (cache GEO) e material
   plástico com cache (texturas3d.matPlastico): o fórum chega a
   ~25 bonecos simultâneos sem pesar.
   ============================================================ */

window.TOGA = window.TOGA || {};

TOGA.boneco3d = (function () {
  if (!window.THREE) return {};

  function mat(cor) { return TOGA.texturas3d.matPlastico(cor); }

  /* ---------- Geometrias compartilhadas (criadas 1×) ---------- */
  const GEO = {};
  function geo(chave, fabrica) {
    if (!GEO[chave]) GEO[chave] = fabrica();
    return GEO[chave];
  }

  /* ---------- Poses corporais por emoção ----------
     As 9 emoções do 2D viram linguagem corporal: alvos de
     rotação (em radianos) SOMADOS à pose base do boneco.
       bE/bD = braço esquerdo/direito (eixo X: negativo ergue
       a mão para a frente/rosto) · cab = inclinar a cabeça
       (positivo = baixar o olhar).                          */
  const POSES = {
    neutro:   { bE: 0,     bD: 0,     cab: 0 },
    firme:    { bE: 0,     bD: 0,     cab: -0.06 },
    feliz:    { bE: 0,     bD: 0,     cab: -0.05 },
    triste:   { bE: 0,     bD: 0,     cab: 0.30 },
    choro:    { bE: -1.0,  bD: -0.9,  cab: 0.34 },  // mãos ao rosto
    raiva:    { bE: -0.45, bD: -0.35, cab: 0.10 },  // braços erguidos, queixo baixo
    surpresa: { bE: -0.7,  bD: 0,     cab: -0.12 },
    medo:     { bE: -0.55, bD: -0.55, cab: 0.18 },  // braços recolhidos
    vergonha: { bE: 0,     bD: 0,     cab: 0.42 }   // cabeça baixa
  };

  const ALTURA_TRONCO = 0.60;
  const CORPO_EM_PE = 0.74, CORPO_SENTADO = 0.45;

  /* ---------- Ações de braço (usar objetos, gestos) ----------
     Cada ação devolve ALVOS de rotação; o tick interpola.
     `alvo: null` = devolve o braço à pose normal (descida).
     Persistentes (algemado, angústia) ficam até executarAcao(null). */
  const ACOES = {
    beber:    { dur: 2.4, alvos: function (ta) { return ta < 1.7 ? { bD: -2.05 } : {}; } },
    entregar: { dur: 1.1, alvos: function (ta) { return ta < 0.75 ? { bD: -1.25 } : {}; } },
    algemado: { persistente: true,
                alvos: function () { return { bE: -0.75, bD: -0.75, zE: 0.26, zD: -0.26 }; } },
    abraco:   { dur: 2.4,
                alvos: function (ta) { return ta < 1.9 ? { bE: -1.3, bD: -1.3, zE: 0.32, zD: -0.32 } : {}; } },
    angustia: { persistente: true,
                alvos: function (ta, t) {
                  const tremor = Math.sin(t * 14) * 0.05;
                  return { bE: -0.95 + tremor, bD: -0.95 - tremor, zE: 0.18, zD: -0.18 };
                } },
    carinho:  { dur: 4.2,
                alvos: function (ta, t) {
                  // mão direita estendida à frente, baixa, com o vai-e-vem
                  // de quem faz cafuné em alguém da altura de um joelho
                  if (ta >= 3.6) return {};
                  const cafune = Math.sin(t * 6) * 0.12;
                  return { bD: -0.8 + cafune, zD: -0.06 };
                } },
    lerPapel: { dur: 5.5,
                alvos: function (ta) {
                  // os dois braços à frente segurando o papel; um leve
                  // "vai e vem" de quem relê a mesma linha
                  if (ta >= 4.8) return {};
                  const releitura = Math.sin(ta * 1.8) * 0.06;
                  return { bE: -1.05 + releitura, bD: -1.05 + releitura, zE: 0.2, zD: -0.2 };
                } },
    /* ---- GESTOS DE EMOÇÃO (acompanham as falas) ----
       Disparados pelo setEmocao (cena3d): veemência, indignação,
       súplica e desespero ganham CORPO, não só rosto. */
    enfase:    { dur: 1.5,                          // veemência: o dedo que martela o ar
                alvos: function (ta, t) {
                  if (ta >= 1.4) return {};
                  const batida = Math.abs(Math.sin(t * 8)) * 0.55;
                  return { bD: -1.45 - batida, zD: -0.08 };
                } },
    indignado: { dur: 1.7,                          // "como assim?!" — os dois braços abrem
                alvos: function (ta, t) {
                  if (ta >= 1.5) return {};
                  const abre = Math.min(1, t * 4);
                  return { bE: -0.55 * abre, bD: -0.55 * abre, zE: 0.62 * abre, zD: -0.62 * abre };
                } },
    apelo:     { dur: 1.9,                          // súplica: as duas mãos à frente
                alvos: function (ta, t) {
                  if (ta >= 1.7) return {};
                  const tremor = Math.sin(t * 5) * 0.07;
                  return { bE: -1.15 + tremor, bD: -1.15 - tremor, zE: 0.14, zD: -0.14 };
                } },
    desespero: { dur: 1.7,                          // a mão que sobe à cabeça
                alvos: function (ta) {
                  if (ta >= 1.5) return {};
                  return { bD: -2.5, zD: 0.55 };
                } },
    /* pilotar a bicicleta: as duas mãos à frente, no guidão (persistente) */
    guidao:    { persistente: true,
                alvos: function () {
                  return { bE: -1.15, bD: -1.15, zE: 0.22, zD: -0.22 };
                } }
  };

  function criar(personagem, opcoes) {
    opcoes = opcoes || {};
    const av = personagem.avatar || {};
    const pele = av.pele || "#d8a87f";
    const corTraje = av.corTraje || "#33424f";
    const corCalca = opcoes.toga ? 0x15110c : 0x2a2a30;
    const grupo = new THREE.Group();
    let sentadoAtual = !!opcoes.sentado;

    /* ---------- pernas-bloco (duas variações) ---------- */
    const pernasPe = new THREE.Group();
    [-0.105, 0.105].forEach(x => {
      const perna = new THREE.Mesh(geo("perna", () => new THREE.BoxGeometry(0.17, 0.62, 0.22)), mat(corCalca));
      perna.position.set(x, 0.31, 0);
      const pe = new THREE.Mesh(geo("pe", () => new THREE.BoxGeometry(0.18, 0.10, 0.27)), mat(0x1d1d22));
      pe.position.set(x, 0.05, 0.03);
      pernasPe.add(perna, pe);
    });
    const pernasSentado = new THREE.Group();
    [-0.105, 0.105].forEach(x => {
      const coxa = new THREE.Mesh(geo("coxa", () => new THREE.BoxGeometry(0.17, 0.14, 0.42)), mat(corCalca));
      coxa.position.set(x, 0.42, 0.18);
      const canela = new THREE.Mesh(geo("canela", () => new THREE.BoxGeometry(0.15, 0.40, 0.16)), mat(corCalca));
      canela.position.set(x, 0.20, 0.36);
      const pe = new THREE.Mesh(geo("pe", () => new THREE.BoxGeometry(0.18, 0.10, 0.27)), mat(0x1d1d22));
      pe.position.set(x, 0.05, 0.42);
      pernasSentado.add(coxa, canela, pe);
    });
    // quadril (peça única que une as pernas ao corpo)
    const quadril = new THREE.Mesh(geo("quadril", () => new THREE.BoxGeometry(0.38, 0.12, 0.24)), mat(corCalca));
    grupo.add(pernasPe, pernasSentado);

    /* O "corpo" (quadril+tronco+braços+cabeça) vive num grupo
       próprio: sentar = baixar o corpo e trocar as pernas.   */
    const corpo = new THREE.Group();
    grupo.add(corpo);
    quadril.position.y = -0.06;
    corpo.add(quadril);

    /* ---------- tronco trapezoidal (peça de minifig) ---------- */
    const tronco = new THREE.Group();
    const ehVestido = av.traje === "vestido";
    const busto = new THREE.Mesh(
      ehVestido ? geo("troncoVestido", () => new THREE.CylinderGeometry(0.17, 0.33, ALTURA_TRONCO, 4))
                : geo("tronco", () => new THREE.CylinderGeometry(0.17, 0.27, ALTURA_TRONCO, 4)),
      mat(corTraje));
    busto.rotation.y = Math.PI / 4;     // seção quadrada alinhada à frente
    busto.scale.z = 0.62;               // achatado como peça Lego
    busto.position.y = ALTURA_TRONCO / 2;
    tronco.add(busto);

    // detalhes impressos do traje (planos frontais)
    if (av.traje === "terno") {
      const camisa = new THREE.Mesh(geo("pCamisa", () => new THREE.PlaneGeometry(0.13, 0.30)), mat(0xf2efe6));
      camisa.position.set(0, 0.40, 0.115);
      const gravata = new THREE.Mesh(geo("pGravata", () => new THREE.PlaneGeometry(0.05, 0.26)), mat(av.corGravata || "#7a2e2e"));
      gravata.position.set(0, 0.38, 0.12);
      tronco.add(camisa, gravata);
    }
    if (av.traje === "blazer") {
      const blusa = new THREE.Mesh(geo("pBlusa", () => new THREE.PlaneGeometry(0.15, 0.28)), mat(av.corBlusa || "#e8e2d2"));
      blusa.position.set(0, 0.40, 0.115);
      tronco.add(blusa);
    }
    if (opcoes.toga) { // a beca do juiz: trapézio maior por cima
      const beca = new THREE.Mesh(geo("toga", () => new THREE.CylinderGeometry(0.19, 0.34, ALTURA_TRONCO + 0.14, 4)), mat(0x15110c));
      beca.rotation.y = Math.PI / 4;
      beca.scale.z = 0.62;
      beca.position.y = ALTURA_TRONCO / 2 - 0.05;
      const faixa = new THREE.Mesh(geo("faixa", () => new THREE.TorusGeometry(0.165, 0.022, 6, 14)), mat(0xc9a35c));
      faixa.rotation.x = Math.PI / 2; faixa.position.y = ALTURA_TRONCO - 0.06;
      tronco.add(beca, faixa);
    }
    corpo.add(tronco);

    /* ---------- braços com MÃO EM C + palma p/ props ---------- */
    const bracos = [];
    const palmas = [];
    [-1, 1].forEach(lado => {
      const braco = new THREE.Group();
      const ombro = new THREE.Mesh(geo("ombro", () => new THREE.SphereGeometry(0.06, 8, 6)),
        mat(opcoes.toga ? 0x15110c : corTraje));
      const membro = new THREE.Mesh(geo("braco", () => new THREE.CylinderGeometry(0.05, 0.045, 0.42, 8)),
        mat(opcoes.toga ? 0x15110c : corTraje));
      membro.position.y = -0.21;
      // mão em C: torus aberto na cor da pele, vão para a frente
      const mao = new THREE.Mesh(geo("maoC", () => new THREE.TorusGeometry(0.045, 0.021, 6, 10, Math.PI * 1.35)),
        mat(pele));
      mao.position.y = -0.45;
      mao.rotation.y = Math.PI / 2;        // anel no plano ZY (visto de lado)
      mao.rotation.z = Math.PI * 0.18;     // vão do C voltado para a frente
      // ponto de encaixe de props (xícara, pastas, algemas...)
      const palma = new THREE.Group();
      palma.position.set(0, -0.45, 0.05);
      braco.add(ombro, membro, mao, palma);
      braco.position.set(lado * 0.245, ALTURA_TRONCO - 0.07, 0);
      braco.rotation.z = lado * 0.10;
      if (opcoes.sentado) braco.rotation.x = -0.5; // mãos à frente, sobre a mesa
      corpo.add(braco);
      bracos.push(braco);
      palmas.push(palma);
    });

    /* ---------- cabeça de minifig + rosto vivo ---------- */
    const cabeca = new THREE.Group();
    const cranio = new THREE.Mesh(geo("cabeca", () => new THREE.CylinderGeometry(0.145, 0.145, 0.27, 16)), mat(pele));
    const stud = new THREE.Mesh(geo("stud", () => new THREE.CylinderGeometry(0.07, 0.07, 0.045, 12)), mat(pele));
    stud.position.y = 0.157;
    cabeca.add(cranio, stud);

    const rosto = TOGA.rosto3d.criarTextura(av);
    const face = new THREE.Mesh(geo("face", () => new THREE.PlaneGeometry(0.24, 0.24)),
      new THREE.MeshBasicMaterial({ map: rosto.texture, transparent: true }));
    face.position.set(0, 0.005, 0.148);
    cabeca.add(face);

    // cabelo = "peça de capacete" encaixada na cabeça
    const corCabelo = av.corCabelo || "#3a2a1a";
    if (av.cabelo === "coque") {
      const calota = new THREE.Mesh(geo("calota", () => new THREE.CylinderGeometry(0.158, 0.165, 0.12, 14)), mat(corCabelo));
      calota.position.y = 0.10;
      const coque = new THREE.Mesh(geo("coque", () => new THREE.SphereGeometry(0.06, 8, 6)), mat(corCabelo));
      coque.position.set(0, 0.14, -0.12);
      cabeca.add(calota, coque);
    } else if (av.cabelo === "longo") {
      const calota = new THREE.Mesh(geo("calota", () => new THREE.CylinderGeometry(0.158, 0.165, 0.12, 14)), mat(corCabelo));
      calota.position.y = 0.10;
      const costas = new THREE.Mesh(geo("cabeloCostas", () => new THREE.BoxGeometry(0.26, 0.34, 0.08)), mat(corCabelo));
      costas.position.set(0, -0.06, -0.14);
      cabeca.add(calota, costas);
    } else if (av.cabelo === "calvo") {
      [-1, 1].forEach(l => {
        const lateral = new THREE.Mesh(geo("cabeloLateral", () => new THREE.SphereGeometry(0.05, 6, 5)), mat(corCabelo));
        lateral.position.set(l * 0.13, -0.02, -0.03);
        lateral.scale.set(0.7, 1.1, 1.3);
        cabeca.add(lateral);
      });
    } else { // curto (default)
      const calota = new THREE.Mesh(geo("calota", () => new THREE.CylinderGeometry(0.158, 0.165, 0.12, 14)), mat(corCabelo));
      calota.position.y = 0.10;
      cabeca.add(calota);
    }
    // quepe de policial (usado pela cinemática de prisão)
    if (opcoes.quepe) {
      const copa = new THREE.Mesh(geo("quepeCopa", () => new THREE.CylinderGeometry(0.16, 0.155, 0.09, 14)), mat(0x1d2430));
      copa.position.y = 0.13;
      const aba = new THREE.Mesh(geo("quepeAba", () => new THREE.BoxGeometry(0.22, 0.02, 0.14)), mat(0x10141c));
      aba.position.set(0, 0.085, 0.16);
      cabeca.add(copa, aba);
    }

    cabeca.position.y = ALTURA_TRONCO + 0.155;
    corpo.add(cabeca);

    // sombras: só nos meshes "de corpo" (o plano do rosto, não)
    grupo.traverse(function (o) {
      if (o.isMesh && o.material && !o.material.isMeshBasicMaterial) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });

    /* ---------- postura: sentado × em pé ---------- */
    function sentar(sim) {
      sentadoAtual = !!sim;
      pernasPe.visible = !sentadoAtual;
      pernasSentado.visible = sentadoAtual;
      corpo.position.y = sentadoAtual ? CORPO_SENTADO : CORPO_EM_PE;
    }
    sentar(sentadoAtual);

    /* ---------- estado de animação ---------- */
    const fase = Math.random() * Math.PI * 2;  // dessincroniza os idles
    let estaFalando = false;
    let alvoOlhar = null;
    let emocaoAtual = "neutro";
    let acaoAtual = null;                      // { nome, t, aoTerminar }
    const props = { esq: null, dir: null };    // objetos nas palmas

    function tick(dt, t) {
      // respiração / balanço sutil
      tronco.rotation.z = Math.sin(t * 0.8 + fase) * 0.02;
      tronco.scale.y = 1 + Math.sin(t * 1.6 + fase) * 0.008;

      // o rosto vive: piscadas e boca da fala
      if (rosto.tick) rosto.tick(dt);

      const pose = POSES[emocaoAtual] || POSES.neutro;
      const bracoBase = sentadoAtual ? -0.5 : 0;

      // alvos vindos de uma AÇÃO em curso (beber, algemado...)
      let alvosAcao = null;
      if (acaoAtual) {
        const def = ACOES[acaoAtual.nome];
        acaoAtual.t += dt;
        alvosAcao = def.alvos(acaoAtual.t, t) || {};
        if (!def.persistente && acaoAtual.t >= def.dur) {
          const fim = acaoAtual.aoTerminar;
          acaoAtual = null;
          alvosAcao = null;
          if (fim) fim();
        }
      }
      const k = Math.min(1, 8 * dt);

      // passos: balanço do corpo quando o grupo está "andando"
      if (grupo.userData.andando) {
        grupo.position.y = Math.abs(Math.sin(t * 9)) * 0.04;
        if (alvosAcao) {
          // andando algemado/aflito: braços mantêm a ação, sem balanço
          if (alvosAcao.bE != null) bracos[0].rotation.x += (alvosAcao.bE - bracos[0].rotation.x) * k;
          if (alvosAcao.bD != null) bracos[1].rotation.x += (alvosAcao.bD - bracos[1].rotation.x) * k;
        } else {
          bracos[0].rotation.x = Math.sin(t * 9) * 0.5;
          bracos[1].rotation.x = -Math.sin(t * 9) * 0.5;
        }
      } else {
        if (!sentadoAtual) grupo.position.y *= 0.8;
        // braço esquerdo: ação > linguagem corporal da emoção
        const alvoE = (alvosAcao && alvosAcao.bE != null) ? alvosAcao.bE : bracoBase + pose.bE;
        bracos[0].rotation.x += (alvoE - bracos[0].rotation.x) * Math.min(1, 6 * dt);
        // braço direito: ação > fala > emoção
        if (alvosAcao && alvosAcao.bD != null) {
          bracos[1].rotation.x += (alvosAcao.bD - bracos[1].rotation.x) * k;
        } else if (estaFalando) {
          bracos[1].rotation.x = -0.6 + Math.sin(t * 4.2 + fase) * 0.25;
        } else {
          bracos[1].rotation.x += ((bracoBase + pose.bD) - bracos[1].rotation.x) * Math.min(1, 6 * dt);
        }
      }

      // convergência lateral dos braços (mãos juntas: algemas/angústia)
      const zE = (alvosAcao && alvosAcao.zE != null) ? alvosAcao.zE : -0.10;
      const zD = (alvosAcao && alvosAcao.zD != null) ? alvosAcao.zD : 0.10;
      bracos[0].rotation.z += (zE - bracos[0].rotation.z) * k;
      bracos[1].rotation.z += (zD - bracos[1].rotation.z) * k;

      // inclinar a cabeça conforme a emoção (baixar/erguer o olhar)
      cabeca.rotation.x += (pose.cab - cabeca.rotation.x) * Math.min(1, 5 * dt);

      // virar a cabeça para o alvo (lerp simples)
      if (alvoOlhar) {
        const alvoLocal = grupo.worldToLocal(alvoOlhar.clone());
        const ang = Math.atan2(alvoLocal.x, alvoLocal.z);
        const limitado = Math.max(-1.1, Math.min(1.1, ang));
        cabeca.rotation.y += (limitado - cabeca.rotation.y) * Math.min(1, 6 * dt);
      } else if (!grupo.userData.andando) {
        // cabeça inquieta no idle: um olhar lento pela sala,
        // em vez do decaimento seco a zero
        const vagar = Math.sin(t * 0.27 + fase) * 0.07;
        cabeca.rotation.y += (vagar - cabeca.rotation.y) * Math.min(1, 2 * dt);
      } else {
        cabeca.rotation.y *= 0.92;
      }
    }

    return {
      grupo: grupo,
      tick: tick,
      setEmocao: function (nome) {
        emocaoAtual = POSES[nome] ? nome : "neutro";
        rosto.setEmocao(nome);
      },
      falando: function (sim) {
        estaFalando = !!sim;
        if (rosto.setFalando) rosto.setFalando(sim);   // a boca acompanha
        if (!sim) bracos[1].rotation.x = sentadoAtual ? -0.5 : 0;
      },
      olharPara: function (vec3) { alvoOlhar = vec3 ? vec3.clone() : null; },
      sentar: sentar,
      get sentado() { return sentadoAtual; },
      get palmas() { return palmas; },     // pontos de encaixe de props (props3d)

      /* segura/solta um objeto na palma ("esq"|"dir") */
      segurar: function (nomeProp, lado) {
        const i = lado === "esq" ? 0 : 1;
        const chave = lado === "esq" ? "esq" : "dir";
        if (props[chave]) { palmas[i].remove(props[chave]); props[chave] = null; }
        if (nomeProp && TOGA.props3d && TOGA.props3d.criar) {
          const prop = TOGA.props3d.criar(nomeProp);
          if (prop) {
            const off = prop.userData.offset || {};
            if (off.pos) prop.position.set(off.pos[0], off.pos[1], off.pos[2]);
            if (off.rot) prop.rotation.set(off.rot[0], off.rot[1], off.rot[2]);
            palmas[i].add(prop);
            props[chave] = prop;
          }
        }
      },

      /* dispara uma ação de braço; null cancela as persistentes.
         Com o bot (animações rápidas), resolve de imediato.   */
      executarAcao: function (nome, aoTerminar) {
        if (!nome) { acaoAtual = null; return; }
        if (!ACOES[nome]) { if (aoTerminar) aoTerminar(); return; }
        const rapido = TOGA.cena3d && TOGA.cena3d.animacoesRapidas;
        if (rapido && !ACOES[nome].persistente) { if (aoTerminar) aoTerminar(); return; }
        acaoAtual = { nome: nome, t: 0, aoTerminar: aoTerminar || null };
      },
      get acao() { return acaoAtual ? acaoAtual.nome : null; },
      get cabecaMundo() {
        const v = new THREE.Vector3();
        cabeca.getWorldPosition(v);
        return v;
      }
    };
  }

  return { criar: criar };
})();
