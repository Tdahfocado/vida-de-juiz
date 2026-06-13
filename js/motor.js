/* ============================================================
   TOGA — motor.js : as REGRAS DO JOGO
   ------------------------------------------------------------
   Se a cena.js é o "palco", este arquivo é o "juiz das regras":
   ele guarda o ESTADO (reputação, relógio, decisões tomadas),
   conduz o fluxo das cenas, aplica as consequências de cada
   escolha e decide qual final você merece.

   Conceito-chave: SEPARAR DADOS DE LÓGICA.
   Os casos (js/casos/*.js) são só DADOS — textos, opções,
   efeitos. Este motor é GENÉRICO: lê qualquer caso no formato
   combinado. Para criar um caso novo, você não mexe aqui;
   só escreve um arquivo de dados (veja docs/CRIANDO-CASOS.md).
   ============================================================ */

window.TOGA = window.TOGA || {};
TOGA.casos = TOGA.casos || [];   // cada arquivo de caso dá um "push" aqui
TOGA.som = { ligado: true };

TOGA.motor = (function () {

  const CHAVE_V1 = "toga.save.v1";          // formato antigo (save único)
  const CHAVE_V2 = "toga.save.v2.";         // um save POR DIA: toga.save.v2.dia1
  const CHAVE_CARREIRA = "toga.carreira";   // melhores resultados (persistem entre dias)
  const INICIO_DO_DIA = 8 * 60 + 50; // 08h50 em minutos

  /* ---------- O ESTADO ----------
     Um único objeto guarda tudo o que muda durante o jogo.
     Fica fácil salvar (vira texto JSON) e carregar de volta. */
  let estado = null;

  /* Cada pauta pode declarar seu próprio "inicio" (ex.: o plantão
     noturno começa às 21h30); sem declaração, vale o 08h50.   */
  function inicioDaPauta(pautaId) {
    const p = (TOGA.pautas || []).find(x => x.id === pautaId);
    if (p && p.inicio) {
      const [h, m] = p.inicio.split(":").map(Number);
      return h * 60 + m;
    }
    return INICIO_DO_DIA;
  }

  function estadoNovo(pautaId) {
    return {
      pauta: pautaId || "dia1", // qual dia de trabalho está em curso
      reputacao: { tec: 50, hum: 50, cel: 50, imp: 50 },
      estresse: 18,             // a toga pesa (0 = zen, 100 = colapso)
      minutos: inicioDaPauta(pautaId),   // relógio do dia, em minutos
      casoAtual: 0,             // índice DENTRO da pauta
      flags: {},                // "memória" das suas decisões
      focos: [],                // pontos dos autos que você estudou
      grifos: {},               // marca-texto nos autos: { casoId: [{peca, trecho}] }
      modoEstudo: true,         // mostra a fundamentação após decidir
      historico: [],            // log de decisões p/ estatísticas
      concluidos: []            // [{id, selo, titulo}]
    };
  }

  /* ---------- Pautas (dias de trabalho) ----------
     Os casos vivem todos em TOGA.casos; a pauta diz QUAIS e
     em QUE ORDEM entram no dia em curso.                  */
  let _casosPorId = null;
  function casoPorId(id) {
    if (!_casosPorId) {
      _casosPorId = {};
      (TOGA.casos || []).forEach(c => { _casosPorId[c.id] = c; });
    }
    return _casosPorId[id];
  }
  function pautaAtual() {
    const id = (estado && estado.pauta) || "dia1";
    return (TOGA.pautas || []).find(p => p.id === id) ||
           { id: "dia1", titulo: "Pauta", casos: (TOGA.casos || []).map(c => c.id) };
  }
  function casosDaPauta() {
    return pautaAtual().casos.map(casoPorId).filter(Boolean);
  }
  function fimDaPauta() {
    return !estado || estado.casoAtual >= casosDaPauta().length;
  }
  function daPautaAtual(item) {
    const p = item.pauta || "dia1";
    return p === "*" || p === ((estado && estado.pauta) || "dia1");
  }

  /* ---------- Salvar e carregar (localStorage) ----------
     localStorage é um "cofrinho" de texto que o NAVEGADOR
     guarda no computador do jogador. Nada vai para servidor
     nenhum — por isso o jogo funciona 100% estático.        */
  function migrarEstado(e) {
    if (!e.grifos) e.grifos = {};             // saves antigos não tinham grifos
    if (!e.pauta) e.pauta = "dia1";           // ...nem pautas múltiplas
    if (e.estresse == null) e.estresse = 18;  // ...nem estresse
    return e;
  }

  /* O save v1 (único) migra para o slot do SEU dia na primeira leitura */
  function legadoV1(pautaId) {
    try {
      const bruto = localStorage.getItem(CHAVE_V1);
      if (!bruto) return null;
      const e = migrarEstado(JSON.parse(bruto));
      if (e.pauta !== pautaId) return null;
      return e;
    } catch (err) { return null; }
  }

  function salvar() {
    if (!estado) return;
    try { localStorage.setItem(CHAVE_V2 + estado.pauta, JSON.stringify(estado)); } catch (e) {}
  }

  function carregar(pautaId) {
    pautaId = pautaId || "dia1";
    try {
      const bruto = localStorage.getItem(CHAVE_V2 + pautaId);
      if (bruto) { estado = migrarEstado(JSON.parse(bruto)); return true; }
      const legado = legadoV1(pautaId);
      if (legado) {
        estado = legado;
        salvar();                                  // grava no slot novo...
        try { localStorage.removeItem(CHAVE_V1); } catch (e) {}  // ...e aposenta o v1
        return true;
      }
      return false;
    } catch (e) { return false; }
  }

  function apagarSave(pautaId) {
    try { localStorage.removeItem(CHAVE_V2 + (pautaId || (estado && estado.pauta) || "dia1")); } catch (e) {}
  }

  function temSave(pautaId) {
    pautaId = pautaId || "dia1";
    try {
      return !!localStorage.getItem(CHAVE_V2 + pautaId) || !!legadoV1(pautaId);
    } catch (e) { return false; }
  }

  /* ---------- A comarca lembra: flags que atravessam os dias ----------
     Ao começar o Dia 2, decisões marcantes do Dia 1 chegam com o
     prefixo "d1_" — e interlúdios/manchetes podem reagir a elas.
     Sem save do Dia 1, nada é herdado: as condições devem tolerar
     a ausência (nunca EXIGIR uma flag d1_).                       */
  const HERANCAS = {
    dia2: { de: "dia1", prefixo: "d1_", flags: [
      "protegida", "presoFundamentado", "mpuRevogada", "acordoSofia",
      "revitimizacao", "pazVizinhos", "acordoFrouxo", "thorFeliz",
      "confinamentoTotal", "pactoGatos", "pronunciaSolida",
      "testemunhaProtegida", "impronunciado", "oficioInvestigacao",
      "testemunhaPresa", "reconsiderou", "manchaGrave", "capacitacaoAceita"
    ] }
  };

  /* Lê só as flags do save de OUTRO dia (sem tocar o estado atual) */
  function flagsDeDia(pautaId) {
    try {
      const bruto = localStorage.getItem(CHAVE_V2 + pautaId);
      const e = bruto ? JSON.parse(bruto) : legadoV1(pautaId);
      return (e && e.flags) || {};
    } catch (err) { return {}; }
  }

  function herdarFlags(e) {
    const h = HERANCAS[e.pauta];
    if (!h) return;
    const antigas = flagsDeDia(h.de);
    h.flags.forEach(k => { if (antigas[k]) e.flags[h.prefixo + k] = true; });
  }

  /* Espiada leve no save de um dia (para os cartões do menu) */
  function peekSave(pautaId) {
    try {
      const bruto = localStorage.getItem(CHAVE_V2 + pautaId);
      const e = bruto ? JSON.parse(bruto) : legadoV1(pautaId);
      if (!e) return null;
      const pauta = (TOGA.pautas || []).find(p => p.id === pautaId);
      const total = pauta ? pauta.casos.length : 0;
      return {
        casoAtual: e.casoAtual,
        total: total,
        minutos: e.minutos,
        concluido: total > 0 && e.casoAtual >= total,
        modoProva: !!e.modoProva
      };
    } catch (err) { return null; }
  }

  /* ---------- Quadro de carreira (melhores resultados) ---------- */
  function carreira() {
    try { return JSON.parse(localStorage.getItem(CHAVE_CARREIRA)) || { casos: {}, pautas: {} }; }
    catch (e) { return { casos: {}, pautas: {} }; }
  }

  const ORDEM_SELO = { otimo: 4, bom: 3, ruim: 2, grave: 1 };
  function registrarCarreira(ep) {
    if (!estado) return { recorde: false };
    const c = carreira();
    let recorde = false;
    estado.concluidos.forEach(item => {
      const atual = c.casos[item.id];
      if (!atual || (ORDEM_SELO[item.selo] || 0) > (ORDEM_SELO[atual] || 0)) {
        c.casos[item.id] = item.selo;
        recorde = true;
      }
    });
    const antes = c.pautas[estado.pauta];
    if (!antes || (ORDEM_SELO[ep.veredito.selo] || 0) > (ORDEM_SELO[antes.selo] || 0)) {
      c.pautas[estado.pauta] = { selo: ep.veredito.selo, titulo: ep.veredito.titulo };
      recorde = true;
    }
    try { localStorage.setItem(CHAVE_CARREIRA, JSON.stringify(c)); } catch (e) {}
    return { recorde: recorde, carreira: c };
  }

  /* ---------- Utilidades de estado ---------- */
  function limitar(v) { return Math.max(0, Math.min(100, Math.round(v))); }

  function aplicarEfeitos(ef) {
    if (!ef) return [];
    const mapa = { tec: "⚖ Técnica", hum: "❤ Humanidade", cel: "⏱ Celeridade", imp: "🛡 Imparcialidade" };
    const variacoes = [];
    ["tec", "hum", "cel", "imp"].forEach(k => {
      if (typeof ef[k] === "number" && ef[k] !== 0) {
        estado.reputacao[k] = limitar(estado.reputacao[k] + ef[k]);
        variacoes.push({ rotulo: mapa[k], delta: ef[k] });
      }
    });
    if (typeof ef.estresse === "number" && ef.estresse !== 0) {
      alterarEstresse(ef.estresse);
      variacoes.push({ rotulo: "🫀 Estresse", delta: ef.estresse, estresse: true });
    }
    if (typeof ef.tempo === "number") estado.minutos += ef.tempo;
    return variacoes;
  }

  /* ---------- Estresse: a toga pesa ----------
     Sobe com decisões ruins, situações tensas e manifestações
     ríspidas; desce com água, frigobar e o setor de saúde.   */
  function alterarEstresse(delta) {
    if (!estado) return 0;
    estado.estresse = limitar((estado.estresse || 0) + delta);
    return estado.estresse;
  }

  function horaTexto(min) {
    const m = min == null ? estado.minutos : min;
    const h = Math.floor(m / 60) % 24, mm = m % 60;   // o plantão pode virar a meia-noite
    return String(h).padStart(2, "0") + "h" + String(mm).padStart(2, "0");
  }

  /* ---------- Fluxo do caso ---------- */
  function casoDaVez() { return casosDaPauta()[estado.casoAtual] || null; }

  function horaPautaEmMin(caso) {
    const [h, m] = caso.hora.split(":").map(Number);
    return h * 60 + m;
  }

  function iniciarCaso() {
    const caso = casoDaVez();
    if (!caso) return null;
    estado.focos = [];
    // casos pesados pesam ANTES da primeira decisão
    if (typeof caso.tensao === "number") alterarEstresse(caso.tensao);
    // Se você chegou adiantado, o relógio "espera" a hora da pauta.
    // Se chegou ATRASADO, a audiência começa atrasada — e isso custa.
    const horaPauta = horaPautaEmMin(caso);
    let atraso = 0;
    if (estado.minutos < horaPauta) {
      estado.minutos = horaPauta;
    } else {
      atraso = estado.minutos - horaPauta;
      const pena = Math.min(12, Math.floor(atraso / 10) * 3);
      if (pena > 0) estado.reputacao.cel = limitar(estado.reputacao.cel - pena);
    }
    salvar();
    return { caso, atraso };
  }

  function cena(idCena) {
    const caso = casoDaVez();
    return caso ? caso.cenas[idCena] : null;
  }

  /* O jogador escolheu uma opção: aplica efeitos, registra
     flags, devolve tudo o que a interface precisa mostrar. */
  function decidir(idCena, indiceOpcao) {
    const c = cena(idCena);
    const op = c.decisao.opcoes[indiceOpcao];

    const variacoes = aplicarEfeitos(op.efeitos);
    if (op.setFlags) Object.assign(estado.flags, op.setFlags);

    // o peso emocional da decisão (salvo se o caso já declarou o seu):
    // TODA decisão pesa — o juiz está sempre sob pressão, e decidir,
    // mesmo certo, cansa. A decisão acertada pesa pouco; a errada pesa
    // mais; a grave pesa muito. O estresse SÓ desce com autocuidado
    // (café, água, pausa, setor de saúde) — nunca por acertar.
    if (!op.efeitos || typeof op.efeitos.estresse !== "number") {
      const acerto = (op.feedback && op.feedback.acerto) || "";
      const peso = { otimo: 2, bom: 3, ruim: 7, grave: 13 }[acerto] || 4;
      alterarEstresse(peso);
      variacoes.push({ rotulo: "🫀 Estresse", delta: peso, estresse: true });
    }

    // mente exausta decide DEVAGAR: no nível crítico, cada decisão
    // custa minutos extras — o autocuidado vira estratégia
    if ((estado.estresse || 0) >= 85) {
      estado.minutos += 3;
      variacoes.push({ rotulo: "🫀 Exausto — minutos a mais", delta: 3, estresse: true });
    }

    estado.historico.push({
      caso: casoDaVez().id, cena: idCena, rotulo: op.rotulo, opcao: indiceOpcao,
      acerto: (op.feedback && op.feedback.acerto) || "neutro"
    });

    // combo de decisões exemplares (recompensa cosmética, sem bônus)
    const acertoCombo = (op.feedback && op.feedback.acerto) || "neutro";
    if (acertoCombo === "otimo") estado.comboOtimo = (estado.comboOtimo || 0) + 1;
    else if (acertoCombo !== "neutro") estado.comboOtimo = 0;

    // "proxima" pode ser um texto ("c4") OU uma função que olha
    // as flags e escolhe o caminho — é assim que decisões antigas
    // mudam o rumo de cenas futuras.
    const proxima = (typeof op.proxima === "function") ? op.proxima(estado.flags) : op.proxima;

    salvar();
    return { opcao: op, variacoes, proxima };
  }

  function concluirCaso(fim) {
    const caso = casoDaVez();
    if (fim && fim.setFlags) Object.assign(estado.flags, fim.setFlags);
    estado.concluidos.push({ id: caso.id, selo: fim.selo, titulo: fim.titulo });

    // Estourou muito a previsão? A pauta sente.
    const previsto = horaPautaEmMin(caso) + (caso.duracaoPrevistaMin || 80);
    if (estado.minutos > previsto + 15) estado.reputacao.cel = limitar(estado.reputacao.cel - 6);
    if (estado.minutos < previsto - 10) estado.reputacao.cel = limitar(estado.reputacao.cel + 4);

    estado.casoAtual += 1;
    salvar();
  }

  /* ---------- Interlúdios: consequências ENTRE audiências ----
     Cada interlúdio tem uma CONDIÇÃO sobre as flags. Depois de
     concluir um caso, o motor verifica quais despertaram.      */
  function interludiosPendentes() {
    const f = estado.flags;
    return (TOGA.interludios || []).filter(it =>
      daPautaAtual(it) &&
      !f["_visto_" + it.id] &&
      it.aposCaso === (estado.casoAtual - 1) &&  // dispara após o caso de índice X
      it.condicao(f, estado)                     // (o 2º argumento permite olhar estresse etc.)
    );
  }

  /* ---------- Arco emocional: "No corredor", depois do caso ----
     Campo opcional do caso:
       arco: { antes: {emocao, gesto},
               depois: [ {se(flags), tom, falas:[{quem,emocao,texto}], gesto?} ] }
     Após concluir um caso com `arco.depois`, o primeiro ramo cuja
     condição passar vira uma cena de gratidão (ou de decepção). */
  function arcoPendente() {
    const f = estado.flags;
    for (const caso of casosDaPauta()) {
      if (!caso.arco || !caso.arco.depois) continue;
      if (f["_arco_" + caso.id]) continue;
      const concluido = estado.concluidos.find(c => c.id === caso.id);
      if (!concluido) continue;
      const ramo = caso.arco.depois.find(r => {
        try { return r.se(f); } catch (e) { return false; }
      });
      if (ramo) return { caso: caso, ramo: ramo };
    }
    return null;
  }
  function marcarArco(casoId) {
    estado.flags["_arco_" + casoId] = true;
    salvar();
  }
  function marcarInterludio(it) {
    estado.flags["_visto_" + it.id] = true;
    if (it.efeitos) aplicarEfeitos(it.efeitos);
    if (it.setFlags) Object.assign(estado.flags, it.setFlags);
    if (it.tom === "grave") alterarEstresse(8);   // más notícias pesam
    salvar();
  }

  /* ---------- Despachos de gabinete (a pilha de conclusos) ----
     Decisões fora da audiência: cada item de TOGA.despachos é
     decidido UMA vez por dia de trabalho.                    */
  function despachosPendentes() {
    if (!estado) return [];
    return (TOGA.despachos || []).filter(d => {
      if (!daPautaAtual(d)) return false;
      if (estado.flags["_desp_" + d.id]) return false;
      if (d.se) { try { return !!d.se(estado); } catch (e) { return false; } }
      return true;
    });
  }

  function decidirDespacho(id, indice) {
    const d = (TOGA.despachos || []).find(x => x.id === id);
    if (!d || !estado) return null;
    const op = d.opcoes[indice];
    estado.flags["_desp_" + id] = true;
    const variacoes = aplicarEfeitos(op.efeitos);
    if (op.setFlags) Object.assign(estado.flags, op.setFlags);
    estado.historico.push({
      caso: "gabinete", cena: id, rotulo: op.rotulo, opcao: indice,
      acerto: (op.feedback && op.feedback.acerto) || "neutro"
    });
    salvar();
    return { opcao: op, variacoes };
  }

  /* ---------- Epílogo: a sua avaliação como magistrado ------- */
  function epilogo() {
    const r = estado.reputacao, f = estado.flags;
    const media = Math.round((r.tec + r.hum + r.cel + r.imp) / 4);

    const manchetes = [];
    (TOGA.manchetes || []).forEach(m => {
      if (daPautaAtual(m) && m.condicao(f, r)) manchetes.push(m);
    });

    /* "Vidas tocadas": o saldo HUMANO do dia, caso a caso.
       Campo opcional: vidasTocadas: [{se(flags)|"flag", texto, tom}] */
    const vidas = [];
    function coletarVidas(lista, titulo) {
      (lista || []).forEach(v => {
        let passa = false;
        try { passa = (typeof v.se === "function") ? v.se(f) : !!f[v.se]; } catch (e) {}
        if (passa) vidas.push({ caso: titulo, texto: v.texto, tom: v.tom || "bom" });
      });
    }
    casosDaPauta().forEach(caso => {
      if (!estado.concluidos.find(c => c.id === caso.id)) return;
      coletarVidas(caso.vidasTocadas, caso.titulo);
    });
    // ...e os despachos de gabinete também tocam vidas
    (TOGA.despachos || []).forEach(d => {
      if (estado.flags["_desp_" + d.id]) coletarVidas(d.vidasTocadas, "Gabinete — " + d.titulo);
    });

    let veredito;
    if (f.manchaGrave || f.mpuRevogada) {
      veredito = {
        selo: "grave", titulo: "Sob apuração",
        texto: "O dia terminou com um pedido de informações da Corregedoria sobre suas decisões. A toga pesa mais do que nunca — e a chance de recomeçar também existe: rejogue e escolha diferente."
      };
    } else if (r.tec >= 75 && r.hum >= 75 && r.cel >= 60 && r.imp >= 70) {
      veredito = {
        selo: "otimo", titulo: "Referência na magistratura",
        texto: "Decisões tecnicamente sólidas, conduzidas com humanidade e firmeza. Seu nome começa a circular como exemplo de boas práticas — a Escola Judicial quer que você conte como foi esse dia."
      };
    } else if (media >= 60) {
      veredito = {
        selo: "bom", titulo: "Magistrado sólido",
        texto: "Um dia de trabalho honesto: acertos importantes, alguns tropeços. É assim que se constrói uma judicatura respeitada — audiência após audiência."
      };
    } else if (r.tec < 45) {
      veredito = {
        selo: "ruim", titulo: "Fragilidade técnica",
        texto: "As partes saíram do fórum, mas várias decisões dificilmente sobreviverão ao segundo grau. Reveja os fundamentos no Modo Estudo e tente novamente."
      };
    } else if (r.hum < 45) {
      veredito = {
        selo: "ruim", titulo: "Distante das pessoas",
        texto: "Tecnicamente o dia até se sustentou — mas quem passou pela sua sala não se sentiu ouvido. Jurisdição é mais do que acertar artigos."
      };
    } else {
      veredito = {
        selo: "bom", titulo: "Em construção",
        texto: "Nem brilho, nem desastre: um dia mediano. A boa notícia é que cada audiência pode ser rejogada — e cada escolha, repensada."
      };
    }

    const otimas = estado.historico.filter(h => h.acerto === "otimo").length;
    return { reputacao: r, media, manchetes, vidas, veredito, decisoes: estado.historico.length, otimas };
  }

  /* ---------- API pública do motor ---------- */
  return {
    novoJogo(pautaId) { estado = estadoNovo(pautaId); herdarFlags(estado); salvar(); },
    carregar, temSave, apagarSave, salvar, peekSave, flagsDeDia,
    carreira, registrarCarreira,
    get estado() { return estado; },
    pautaAtual, casosDaPauta, fimDaPauta, casoPorId,
    arcoPendente, marcarArco, alterarEstresse,
    despachosPendentes, decidirDespacho,
    iniciarCaso, casoDaVez, cena, decidir, concluirCaso,
    interludiosPendentes, marcarInterludio, epilogo,
    aplicarEfeitos, horaTexto,
    setFoco(id) {
      const i = estado.focos.indexOf(id);
      if (i >= 0) estado.focos.splice(i, 1);
      else if (estado.focos.length < 2) estado.focos.push(id);
      salvar();
      return estado.focos;
    },
    temFoco(id) { return estado.focos.includes(id); },

    /* ---- Marca-texto nos autos (persiste no save) ---- */
    alternarGrifo(casoId, pecaId, trecho) {
      if (!estado.grifos) estado.grifos = {};
      const lista = estado.grifos[casoId] = estado.grifos[casoId] || [];
      const i = lista.findIndex(g => g.peca === pecaId && g.trecho === trecho);
      if (i >= 0) lista.splice(i, 1);
      else lista.push({ peca: pecaId, trecho: trecho });
      salvar();
    },
    grifosDe(casoId) {
      return (estado && estado.grifos && estado.grifos[casoId]) || [];
    }
  };
})();
